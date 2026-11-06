// A situation from his work: he answers (typed or spoken), then rates himself
// against three rubric points, or the coach grades it when there is a key.
// After the model answer, "They push back" (where the lesson has objections):
// two turns of holding his ground, then a rating and a calm, firm reply.
import { h } from './dom.js';
import { ico } from './icons.js';
import { applySituation, paragraphs } from '../core/course.js';
import { runGrade, runScene } from '../core/coursecoach.js';
import { pushbackTurns, runPushback, runPushbackGrade, applyPushback } from '../core/pushback.js';
import { createRecognizer, speechSupported } from '../core/speech.js';

const prose = (cls, text) => h('div', { class: cls }, paragraphs(text).map((x) => h('p', {}, x)));

export function renderSituation(app, { subject, moduleId, lessonId }, root) {
  const t = app.t;
  const seq = app.navSeq;
  const main = h('main', { class: 'screen situation' }, h('p', { class: 'muted loading' }, '…'));
  let rec = null;
  root.append(
    h('header', { class: 'top round-top' },
      h('button', { class: 'icon-btn', 'aria-label': t('close'), onclick: () => app.go('home') }, ico('x')),
      h('div', { class: 'round-title' }, ico('drama'), ' ', t('sitTitle')), h('div', {})),
    main);

  app.openModule(subject, moduleId).then((mod) => {
    if (seq !== app.navSeq) return;
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (!lesson) throw new Error('missing');
    ask(lesson);
  }).catch(() => {
    if (seq !== app.navSeq) return;
    main.replaceChildren(h('section', { class: 'card load-error' }, h('p', {}, t('loadError')),
      h('button', { class: 'btn btn-primary', onclick: () => app.go('situation', { subject, moduleId, lessonId }) }, t('retry'))));
  });

  const stopRec = () => { if (rec) { rec.stop(); rec = null; } };

  // A textarea for his answer, with a mic button where speech works.
  function answerBox(cls, ph) {
    const ta = h('textarea', { class: `text-input ${cls}`, rows: 5, placeholder: ph, 'aria-label': ph });
    let micBtn = null;
    if (speechSupported) {
      const idle = () => { rec = null; if (micBtn.isConnected) micBtn.replaceChildren(ico('mic'), ' ', t('sitSpeak')); };
      micBtn = h('button', {
        class: 'btn btn-ghost small mic-btn',
        onclick: () => {
          if (rec) { rec.stop(); idle(); return; }
          const base = ta.value;
          rec = createRecognizer({
            lang: app.lang,
            onText: (final, interim) => { const said = `${final}${final && interim ? ' ' : ''}${interim || ''}`; ta.value = `${base}${base && said ? ' ' : ''}${said}`; },
            onError: idle,
          });
          if (rec.start() === false) { idle(); return; }
          micBtn.replaceChildren(ico('square'), ' ', t('sitStop'));
        },
      }, ico('mic'), ' ', t('sitSpeak'));
    }
    return { ta, micBtn };
  }

  // base is the lesson as written: a fresh scene is made from it and lives only
  // in memory for this visit; its points are saved under the same lesson.
  function ask(lesson, note = '', base = lesson) {
    const s = lesson.situation;
    const { ta, micBtn } = answerBox('sit-answer', t('sitAnswerPh'));
    const key = app.state.settings.apiKey;
    const context = String(app.state.settings.context || '').trim();
    const fresh = key && context ? h('button', {
      class: 'btn btn-ghost small scene-new',
      onclick: async (e) => {
        stopRec();
        const btn = e.currentTarget;
        btn.disabled = true;
        btn.textContent = t('coachThinking');
        const res = await runScene(key, { lesson: base, context, lang: app.lang, model: app.state.settings.model });
        if (seq !== app.navSeq) return;
        if (res.ok) ask({ ...base, situation: res.situation }, '', base);
        else ask(base, t('sceneNote'), base);
      },
    }, t('sceneNew')) : null;
    main.replaceChildren(
      h('section', { class: 'card sit-card' },
        h('p', { class: 'today-label' }, lesson.title),
        fresh,
        note ? h('p', { class: 'note scene-note' }, note) : null,
        prose('teach-text sit-scene', s.scene),
        h('p', { class: 'quiz-q' }, s.ask),
        ta, micBtn),
      h('button', {
        class: 'btn btn-primary btn-big',
        onclick: () => {
          stopRec();
          if (!ta.value.trim()) { ta.focus(); return; }
          assess(lesson, ta.value.trim());
        },
      }, t('sitSubmit')));
  }

  async function assess(lesson, answer) {
    const s = lesson.situation;
    const key = app.state.settings.apiKey;
    if (key) {
      main.replaceChildren(h('section', { class: 'card' }, h('p', { class: 'muted' }, t('coachThinking'))));
      const res = await runGrade(key, { lesson, answer, lang: app.lang, model: app.state.settings.model });
      if (seq !== app.navSeq) return;
      if (res.ok) { result(lesson, answer, res.points, res.missed); return; }
    }
    // Self-rating against the rubric: honest checkboxes, no coach needed.
    const boxes = s.rubric.map((line) => h('label', { class: 'rubric-line' }, h('input', { type: 'checkbox' }), h('span', {}, line)));
    main.replaceChildren(
      h('section', { class: 'card sit-card' },
        h('p', { class: 'muted small' }, t('sitYourAnswer')),
        h('p', { class: 'sit-mine' }, answer),
        h('p', { class: 'quiz-q' }, t('sitSelfRate')),
        boxes),
      h('button', {
        class: 'btn btn-primary btn-big',
        onclick: () => result(lesson, answer, boxes.map((b) => (b.querySelector('input').checked ? 1 : 0)), ''),
      }, t('sitCheck')));
  }

  function result(lesson, answer, points, missed) {
    const pts = points.reduce((a, b) => a + b, 0);
    const res = applySituation(app.state, { subject, lessonId: lesson.id, pts }, app.today(), Date.now());
    app.setState(res.state);
    main.replaceChildren(
      h('section', { class: 'card sit-card sit-result' },
        h('p', { class: 'xp-line' }, `${t('sitPoints', pts)}${res.xp ? ` · +${res.xp} XP` : ''}`),
        lesson.situation.rubric.map((line, i) => h('p', { class: `rubric-result ${points[i] ? 'ok' : 'miss'}` },
          ico(points[i] ? 'check' : 'x'), ' ', line)),
        missed ? h('p', { class: 'note' }, `${t('coachMissed')}: ${missed}`) : null,
        h('p', { class: 'muted small' }, t('sitModel')),
        h('p', { class: 'said' }, lesson.situation.model)),
      // Spread, not null: replaceChildren would render a null as text.
      ...(pushbackTurns(lesson.situation).length ? [h('button', { class: 'btn btn-ghost pb-open', onclick: () => pushback(lesson, answer) }, t('pbOpen'))] : []),
      h('button', { class: 'btn btn-ghost', onclick: () => app.startSayIt(subject, moduleId, lesson.id) }, ico('mic'), ' ', t('openSayIt')),
      h('button', { class: 'btn btn-primary btn-big', onclick: () => app.go('home') }, t('backToCourse')));
  }

  // Two objections, two replies. With a key the coach plays the other person;
  // without one, or when the coach fails, the lesson's own lines are used.
  function pushback(lesson, answer) {
    const pb = lesson.situation.pushback;
    const lines = pushbackTurns(lesson.situation);
    const turns = [{ who: 'me', text: answer }];
    const key = app.state.settings.apiKey;
    const thinking = () => main.replaceChildren(h('section', { class: 'card' }, h('p', { class: 'muted' }, t('coachThinking'))));

    async function turn(i) {
      let said = lines[i];
      if (key) {
        thinking();
        const res = await runPushback(key, { lesson, turns, lang: app.lang, model: app.state.settings.model, context: app.state.settings.context || '' });
        if (seq !== app.navSeq) return;
        if (res.ok) said = res.reply;
      }
      turns.push({ who: 'them', text: said });
      const { ta, micBtn } = answerBox('pb-answer', t('pbYourReply'));
      main.replaceChildren(
        h('section', { class: 'card sit-card pb-card' },
          h('p', { class: 'today-label' }, `${t('pbOpen')} · ${i + 1}/2`),
          h('p', { class: 'muted small' }, t('pbTheySay')),
          h('p', { class: 'pb-they' }, said),
          ta, micBtn),
        h('button', {
          class: 'btn btn-primary btn-big',
          onclick: () => {
            stopRec();
            if (!ta.value.trim()) { ta.focus(); return; }
            turns.push({ who: 'me', text: ta.value.trim() });
            if (i === 0) turn(1); else grade();
          },
        }, t('pbReply')));
      window.scrollTo(0, 0);
    }

    async function grade() {
      if (key) {
        thinking();
        const res = await runPushbackGrade(key, { lesson, turns, lang: app.lang, model: app.state.settings.model });
        if (seq !== app.navSeq) return;
        if (res.ok) { done(res.points, res.missed); return; }
      }
      const boxes = pb.rubric.map((line) => h('label', { class: 'rubric-line' }, h('input', { type: 'checkbox' }), h('span', {}, line)));
      main.replaceChildren(
        h('section', { class: 'card sit-card pb-card' },
          h('p', { class: 'quiz-q' }, t('pbRate')),
          boxes),
        h('button', {
          class: 'btn btn-primary btn-big',
          onclick: () => done(boxes.map((b) => (b.querySelector('input').checked ? 1 : 0)), ''),
        }, t('sitCheck')));
    }

    // Practice only: the points are kept, no XP and not a round.
    function done(points, missed) {
      const pts = points.reduce((a, b) => a + b, 0);
      app.setState(applyPushback(app.state, { subject, lessonId: lesson.id, pts }, Date.now()));
      main.replaceChildren(
        h('section', { class: 'card sit-card pb-result' },
          h('p', { class: 'xp-line' }, t('sitPoints', pts)),
          pb.rubric.map((line, i) => h('p', { class: `rubric-result ${points[i] ? 'ok' : 'miss'}` }, ico(points[i] ? 'check' : 'x'), ' ', line)),
          missed ? h('p', { class: 'note' }, `${t('coachMissed')}: ${missed}`) : null,
          h('p', { class: 'muted small' }, t('pbModel')),
          h('p', { class: 'said' }, pb.model)),
        h('button', { class: 'btn btn-primary btn-big', onclick: () => app.go('home') }, t('pbDone')));
      window.scrollTo(0, 0);
    }

    turn(0);
  }

  return () => { if (rec) { try { rec.stop(); } catch { /* already stopped */ } } };
}
