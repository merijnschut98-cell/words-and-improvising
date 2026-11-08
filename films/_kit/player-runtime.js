// The film player, inlined into every film page after films/_kit/timeline.mjs
// and the film's own STAGE ({ render(sceneIndex, u) }). Plain browser script.
//
// Timeline: scenes of `dur` seconds, each split into caption beats. The stage is
// a pure function of (scene, u in 0..1), so play, scrub and reduced motion
// (each scene at its designed still) all draw the same way.
// Narration: in the app the film asks the parent page to speak (postMessage,
// {type:'vp-film'}); opened on its own it uses its own speechSynthesis. While a
// line is spoken the clock may run to the next beat and then holds.
// Render mode (?render=1, films/_kit/render.mjs): no clock, no controls and no
// speech. The render script hands over the audio timeline and sets the time of
// every frame through window.__film, so each frame is a pure function of t.
/* global STAGE, parseParams, searchOf, timelineOf, sceneIndexAt, clampScene, beatStarts, beatIndexAt, holdLimit, fmtClock, timedAt */
(function () {
  const DATA = JSON.parse(document.getElementById('film-data').textContent);
  const PRM = parseParams(searchOf(location.search, window.name));
  const LANG = PRM.lang;
  const STR = {
    nl: { play: 'Afspelen', pause: 'Pauzeren', replay: 'Opnieuw afspelen', mute: 'Gesproken uitleg uit', unmute: 'Gesproken uitleg aan', scenes: 'Scènes', close: 'Sluiten', prev: 'Vorige', next: 'Volgende', speed: 'Snelheid', scrub: 'Tijdlijn van de film', scene: (n, m) => `Scène ${n} van ${m}`, start: 'Bekijk de film', again: 'Nog een keer', voice: 'Geen stem op dit apparaat: lees de ondertitels mee.', label: 'Uitlegfilm' },
    en: { play: 'Play', pause: 'Pause', replay: 'Play again', mute: 'Narration off', unmute: 'Narration on', scenes: 'Scenes', close: 'Close', prev: 'Previous', next: 'Next', speed: 'Speed', scrub: 'Film timeline', scene: (n, m) => `Scene ${n} of ${m}`, start: 'Watch the film', again: 'Watch again', voice: 'No voice on this device: follow the captions.', label: 'Explainer film' },
  }[LANG];
  const doc = document.documentElement;
  const $ = (sel) => document.querySelector(sel);
  const scenes = DATA.scenes;
  const tl = timelineOf(scenes);
  const reduceMq = matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = !PRM.render && (PRM.reduce || reduceMq.matches);

  // ---------------------------------------------------------------- state
  let t = tl.starts[clampScene(PRM.scene, scenes.length)];
  let playing = false;
  let started = false;
  let ended = false;
  let scrubbing = false;
  let visible = true;
  let rate = 1;
  let muted = PRM.muted;
  if (window.parent === window) { try { muted = localStorage.getItem('vp:filmMuted') === '1' || PRM.muted; } catch (e) { /* storage blocked */ } }
  let spokenKey = null; // "scene:beat" last handed to the voice
  let speaking = null; // { id, scene, beat, until? }
  let nextId = 1;
  let raf = 0;
  let last = 0;

  // ---------------------------------------------------------------- elements
  const main = $('.fp');
  const stage = $('.fp-stage');
  const cap = $('.fp-cap');
  const read = $('.fp-read');
  const playBtn = $('[data-act="play"]');
  const muteBtn = $('[data-act="mute"]');
  const scenesBtn = $('[data-act="scenes"]');
  const prevBtn = $('[data-act="prev"]');
  const nextBtn = $('[data-act="next"]');
  const range = $('.fp-range');
  const clock = $('.fp-time');
  const poster = $('.fp-poster');
  const sheet = $('.fp-sheet');
  const note = $('.fp-note');
  const cueEls = [...document.querySelectorAll('[data-cue]')];

  document.title = DATA.title[LANG];
  doc.lang = LANG;
  main.setAttribute('aria-label', `${STR.label}: ${DATA.title[LANG]}`);
  $('.fp-poster-title').textContent = DATA.title[LANG];
  $('.fp-poster-go span').textContent = STR.start;
  $('.fp-sheet-title').textContent = STR.scenes;
  $('[data-act="close"]').setAttribute('aria-label', STR.close);
  prevBtn.setAttribute('aria-label', STR.prev);
  nextBtn.setAttribute('aria-label', STR.next);
  scenesBtn.setAttribute('aria-label', STR.scenes);
  range.setAttribute('aria-label', STR.scrub);
  range.max = String(tl.total);
  const svgEl = stage.querySelector('svg');
  if (svgEl && DATA.label) svgEl.setAttribute('aria-label', DATA.label[LANG]);

  // scene ticks on the scrubber, and the scene list
  const ticks = $('.fp-ticks');
  tl.starts.slice(1).forEach((s) => { const i = document.createElement('i'); i.style.left = `${(s / tl.total) * 100}%`; ticks.append(i); });
  const list = $('.fp-list');
  scenes.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'fp-item';
    b.innerHTML = `<span class="fp-item-n">${i + 1}</span><span class="fp-item-t"></span><span class="fp-item-d">${fmtClock(tl.starts[i])}</span>`;
    b.querySelector('.fp-item-t').textContent = s.title[LANG];
    b.addEventListener('click', () => { closeSheet(); jump(tl.starts[i]); if (!playing) play(); });
    list.append(b);
  });
  const speedBtn = $('[data-act="speed"]');
  speedBtn.querySelector('.fp-speed-l').textContent = STR.speed;

  // ---------------------------------------------------------------- narration
  const inFrame = window.parent !== window;
  let bridge = false;
  const post = (msg) => { try { window.parent.postMessage(Object.assign({ type: 'vp-film' }, msg), '*'); } catch (e) { /* no parent */ } };
  window.addEventListener('message', (e) => {
    if (!inFrame || e.source !== window.parent) return;
    const d = e.data;
    if (!d || typeof d !== 'object' || d.type !== 'vp-film') return;
    if (d.op === 'ready') { bridge = true; doc.dataset.narration = 'bridge'; }
    else if (d.op === 'said') lineDone(d.id, d.result);
  });
  if (inFrame) post({ op: 'hello' });
  if (inFrame) document.body.style.background = 'transparent'; // the app's card shows round the player
  doc.dataset.narration = 'local';
  doc.dataset.said = '0';

  const localSynth = (() => { try { return window.speechSynthesis && typeof SpeechSynthesisUtterance === 'function' ? window.speechSynthesis : null; } catch (e) { return null; } })();
  function localSay(id, text) {
    if (!localSynth) { setTimeout(() => lineDone(id, 'failed'), 0); return; }
    try {
      localSynth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = LANG === 'en' ? 'en-GB' : 'nl-NL';
      u.rate = rate;
      const code = LANG === 'en' ? 'en' : 'nl';
      const voices = localSynth.getVoices();
      const v = voices.find((x) => x.lang.toLowerCase().startsWith(code) && x.localService) || voices.find((x) => x.lang.toLowerCase().startsWith(code));
      if (v) u.voice = v;
      const t0 = Date.now();
      u.onend = () => lineDone(id, Date.now() - t0 < 300 ? 'failed' : 'spoken');
      u.onerror = () => lineDone(id, 'failed');
      localSynth.speak(u);
    } catch (e) { setTimeout(() => lineDone(id, 'failed'), 0); }
  }
  function sayBeat(si, bi) {
    const b = scenes[si].beats[bi];
    const text = (b.voice || b.speak)[LANG]; // the narration script when the film has one
    const id = nextId++;
    speaking = { id, scene: si, beat: bi };
    // never wait forever: some engines never end a line
    const limit = Math.max(6000, 2000 + text.length * 90) / rate;
    setTimeout(() => lineDone(id, 'timeout'), limit);
    if (bridge) post({ op: 'say', id, text, lang: LANG, rate });
    else localSay(id, text);
  }
  let failures = 0;
  function lineDone(id, result) {
    if (!speaking || speaking.id !== id || speaking.until) return;
    speaking.until = performance.now() + 400; // a breath before the next line
    doc.dataset.said = String(Number(doc.dataset.said) + 1);
    if (result === 'failed') { failures += 1; if (failures >= 2) note.textContent = STR.voice; }
  }
  function cancelSpeech() {
    if (speaking) { if (bridge) post({ op: 'cancel' }); else if (localSynth) { try { localSynth.cancel(); } catch (e) { /* ignore */ } } }
    speaking = null;
  }

  // ---------------------------------------------------------------- drawing
  const local = () => {
    const si = sceneIndexAt(t, tl);
    return { si, lt: t - tl.starts[si] };
  };
  let shownKey = '';
  function caption(si, bi) {
    const key = `${si}:${bi}`;
    if (key === shownKey) return;
    shownKey = key;
    const b = scenes[si].beats[bi];
    const line = b.seg[LANG].map((p) => {
      if (typeof p === 'string') return document.createTextNode(p);
      const s = document.createElement('span');
      s.className = 'fp-term';
      s.textContent = p.t;
      if (!p.en) return s;
      const f = document.createDocumentFragment();
      const en = document.createElement('span');
      en.className = 'fp-en';
      en.lang = 'en';
      en.textContent = ` (${p.en})`;
      f.append(s, en);
      return f;
    });
    // in a video frame the line sits centred in a band of fixed height (one span)
    if (PRM.render) { const one = document.createElement('span'); one.append(...line); cap.replaceChildren(one); } else cap.replaceChildren(...line);
    // the readout of this beat, or the last one before it in the scene
    let r = null;
    for (let k = bi; k >= 0 && !r; k--) r = scenes[si].beats[k].read || null;
    read.textContent = r ? r[LANG] : '';
    read.hidden = !r;
    const on = new Set(b.cues);
    cueEls.forEach((el) => el.toggleAttribute('data-on', on.has(el.getAttribute('data-cue'))));
  }
  function draw() {
    const { si, lt } = local();
    const s = scenes[si];
    const bi = beatIndexAt(s, LANG, lt);
    const u = reduce ? s.still : Math.min(1, Math.max(0, lt / s.dur));
    STAGE.render(si, u);
    caption(si, bi);
    if (!scrubbing) range.value = String(Math.round(t * 10) / 10);
    range.setAttribute('aria-valuetext', `${STR.scene(si + 1, scenes.length)}: ${s.title[LANG]}, ${fmtClock(t)}`);
    clock.textContent = `${fmtClock(t)} / ${fmtClock(tl.total)}`;
    doc.dataset.scene = String(si + 1);
  }

  // ---------------------------------------------------------------- clock
  function advance(dt) {
    let target = t + dt * rate;
    const now = performance.now();
    if (!muted && speaking) {
      if (speaking.until && now >= speaking.until) speaking = null;
      else target = Math.min(target, holdLimit(tl, scenes, LANG, speaking.scene, speaking.beat) - 0.001);
    }
    t = Math.max(t, target);
    if (t >= tl.total - 0.0005) { t = tl.total; finish(); return; }
    const { si, lt } = local();
    const bi = beatIndexAt(scenes[si], LANG, lt);
    const key = `${si}:${bi}`;
    if (key !== spokenKey) {
      spokenKey = key;
      if (!muted) sayBeat(si, bi);
    }
  }
  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    if (playing && visible && !scrubbing) advance(dt);
    draw();
    if (playing) raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } };

  // ---------------------------------------------------------------- controls
  function setPlayBtn() {
    const label = ended ? STR.replay : playing ? STR.pause : STR.play;
    playBtn.setAttribute('aria-label', label);
    playBtn.dataset.state = ended ? 'replay' : playing ? 'pause' : 'play';
    main.dataset.playing = playing ? '1' : '0';
  }
  function play() {
    if (ended) { ended = false; t = 0; spokenKey = null; main.dataset.ended = '0'; }
    if (!started) { started = true; poster.hidden = true; main.dataset.started = '1'; }
    playing = true;
    setPlayBtn();
    kick();
  }
  function pause() {
    playing = false;
    cancelSpeech();
    spokenKey = null; // the beat speaks again from its start when play resumes
    setPlayBtn();
    draw();
  }
  function finish() {
    playing = false;
    ended = true;
    speaking = null;
    main.dataset.ended = '1';
    setPlayBtn();
  }
  function jump(to) {
    cancelSpeech();
    t = Math.max(0, Math.min(tl.total - 0.01, to));
    if (ended) { ended = false; main.dataset.ended = '0'; }
    if (!started) { started = true; poster.hidden = true; main.dataset.started = '1'; }
    spokenKey = null;
    setPlayBtn();
    draw();
  }
  const sceneStep = (dir) => {
    const { si, lt } = local();
    const to = dir < 0 ? (lt > 1.5 ? si : si - 1) : si + 1;
    if (to >= scenes.length) { jump(tl.total - 0.01); return; }
    jump(tl.starts[Math.max(0, to)]);
  };
  const toggle = () => (playing ? pause() : play());
  playBtn.addEventListener('click', toggle);
  $('.fp-poster-go').addEventListener('click', play);
  $('.fp-again').addEventListener('click', play);
  prevBtn.addEventListener('click', () => sceneStep(-1));
  nextBtn.addEventListener('click', () => sceneStep(1));
  function setMute(m) {
    muted = m;
    muteBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
    muteBtn.setAttribute('aria-label', muted ? STR.unmute : STR.mute);
    main.dataset.muted = muted ? '1' : '0';
    if (muted) cancelSpeech(); else spokenKey = null;
    if (inFrame) post({ op: 'mute', muted });
    else { try { localStorage.setItem('vp:filmMuted', muted ? '1' : '0'); } catch (e) { /* storage blocked */ } }
  }
  muteBtn.addEventListener('click', () => setMute(!muted));
  speedBtn.addEventListener('click', () => {
    rate = rate === 1 ? 1.25 : 1;
    speedBtn.querySelector('.fp-speed-v').textContent = rate === 1 ? '1×' : '1,25×'.replace(',', LANG === 'en' ? '.' : ',');
    speedBtn.setAttribute('aria-pressed', rate !== 1 ? 'true' : 'false');
  });
  function openSheet() { sheet.hidden = false; scenesBtn.setAttribute('aria-expanded', 'true'); const { si } = local(); (list.children[si] || list.children[0]).focus(); }
  function closeSheet() { sheet.hidden = true; scenesBtn.setAttribute('aria-expanded', 'false'); }
  scenesBtn.addEventListener('click', () => (sheet.hidden ? openSheet() : closeSheet()));
  $('[data-act="close"]').addEventListener('click', () => { closeSheet(); scenesBtn.focus(); });

  // scrub: speech stops; the scene you land in speaks from its beat's start
  range.addEventListener('pointerdown', () => { scrubbing = true; cancelSpeech(); });
  const endScrub = () => { if (scrubbing) { scrubbing = false; spokenKey = null; kick(); } };
  range.addEventListener('pointerup', endScrub);
  range.addEventListener('pointercancel', endScrub);
  range.addEventListener('change', endScrub);
  range.addEventListener('input', () => { jump(Number(range.value)); if (playing) kick(); });

  document.addEventListener('keydown', (e) => {
    if (e.target && e.target.tagName === 'INPUT' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return; // the scrubber's own keys
    if (e.key === ' ' || e.key === 'k') { if (e.target && e.target.tagName === 'BUTTON' && e.key === ' ') return; toggle(); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { sceneStep(-1); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { sceneStep(1); e.preventDefault(); }
    else if (e.key === 'm' || e.key === 'M') setMute(!muted);
    else if (e.key === 'End') { jump(tl.starts[scenes.length - 1]); e.preventDefault(); }
    else if (e.key === 'Home') { jump(0); e.preventDefault(); }
    else if (e.key === 'Escape' && !sheet.hidden) closeSheet();
  });

  // pause when the film leaves the screen or the tab is hidden
  const away = () => { if (playing) pause(); };
  document.addEventListener('visibilitychange', () => { if (document.hidden) away(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (!visible) away();
    }, { threshold: 0.15 }).observe(stage);
  }
  const setMotion = () => { main.dataset.motion = reduce ? 'reduce' : 'full'; draw(); };
  reduceMq.addEventListener && reduceMq.addEventListener('change', () => { reduce = PRM.reduce || reduceMq.matches; setMotion(); });

  // tell the app how tall the film is, so its frame fits without scrolling
  if (inFrame && 'ResizeObserver' in window) {
    let lastH = 0;
    new ResizeObserver(() => {
      const hgt = Math.ceil(main.getBoundingClientRect().height + 2);
      if (Math.abs(hgt - lastH) > 1) { lastH = hgt; post({ op: 'size', h: hgt }); }
    }).observe(main);
  }

  if (PRM.render) {
    // the frame is the video: no poster, controls or speech; time from the script
    main.dataset.render = '1';
    doc.dataset.render = '1';
    poster.hidden = true;
    started = true;
    main.dataset.started = '1';
    let atl = null;
    window.__film = {
      total: tl.total,
      setTiming(next) { atl = next; return atl.total; },
      seek(time) {
        if (atl) {
          const at = timedAt(time, atl);
          STAGE.render(at.si, at.u);
          caption(at.si, at.bi);
        } else { t = Math.max(0, Math.min(tl.total, time)); draw(); }
        // the cue's glow breathes with the film's own clock, not the wall clock
        main.style.setProperty('--fp-b', `${(2.5 * (0.5 - 0.5 * Math.cos((2 * Math.PI * time) / 1.8))).toFixed(2)}px`);
        return true;
      },
    };
    window.__film.seek(0);
    return;
  }
  setMute(muted);
  setPlayBtn();
  setMotion();
})();
