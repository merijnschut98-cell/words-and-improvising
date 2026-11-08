// The film page: Vantage palette and theme boot (as in the figures), the player
// markup and CSS, and the inlined scripts (timeline, the film's stage, the
// player runtime). One self-contained file per film: a sandboxed frame without
// allow-same-origin has an opaque origin, so subresources would miss the
// service worker.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const strip = (file) => readFileSync(join(HERE, file), 'utf8').replace(/^export /gm, '');

// Lucide icons (ISC licence, as in src/ui/icons.js).
const ICON = {
  play: '<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>',
  pause: '<rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/>',
  replay: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  sound: '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>',
  silent: '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M22 9l-6 6"/><path d="M16 9l6 6"/>',
  list: '<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
  prev: '<path d="m15 18-6-6 6-6"/>',
  next: '<path d="m9 18 6-6-6-6"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
};
const icon = (name, cls = '') => `<svg class="fp-ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[name]}</svg>`;

// Vantage palette on the anatomy kit's variables (same values as the figures).
export const VANTAGE_CSS = `
.iso{
  --anatomy-page:#0B291B;--anatomy-card:#0D252B;--anatomy-text:#DCD8CB;--anatomy-strong:#F0E9DA;--anatomy-muted:#9FB3A6;
  --anatomy-paper:#0D252B;--anatomy-face:#123039;--anatomy-top:#16353D;
  --anatomy-shade-0:#0A1E23;--anatomy-shade-1:#0C2228;--anatomy-shade-2:#0F272D;--anatomy-shade-3:#122C33;
  --anatomy-lit-top:#1D4A55;--anatomy-lit-shade:#173D47;
  --anatomy-hi:#E4DDCC;--anatomy-mid:#7C9289;--anatomy-lo:#45615D;--anatomy-faint:#26433F;--anatomy-lit:#5C9FAE;
  --anatomy-halo:#03100F;--anatomy-halo-opacity:.85;--anatomy-dot:#F0E9DA;
  --fp-hair:rgba(240,233,218,.12);--fp-accent:#5C9FAE;--fp-accent-text:#7DB6C3;--fp-glow:#5C9FAE;--fp-on-accent:#06191E;--fp-scrim:rgba(6,22,26,.62);
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --fp-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --fp-hair:rgba(11,41,27,.14);--fp-accent:#276F81;--fp-accent-text:#1C5563;--fp-glow:#3E8C9E;--fp-on-accent:#FFFFFF;--fp-scrim:rgba(244,239,227,.7);
}`;

export const PLAYER_CSS = `
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:16px/1.45 var(--fp-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;overflow-x:hidden}
.fp{position:relative;max-width:760px;margin:0 auto;background:var(--anatomy-card);border-radius:12px;box-shadow:inset 0 0 0 1px var(--fp-hair);overflow:hidden}
.fp-stage{position:relative;aspect-ratio:16/10;width:100%;overflow:hidden}
.fp-stage>svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.fp-read{position:absolute;left:8px;top:8px;max-width:calc(100% - 16px);font:600 12.5px/1.35 var(--anatomy-mono);color:var(--anatomy-strong);background:color-mix(in srgb,var(--anatomy-card) 88%,transparent);box-shadow:inset 0 0 0 1px var(--fp-hair);border-radius:6px;padding:4px 8px;pointer-events:none}
.fp-read[hidden]{display:none}
.fp-poster,.fp-end{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:var(--fp-scrim);text-align:center;padding:16px}
.fp-poster[hidden]{display:none}
.fp-end{display:none}
.fp[data-ended="1"] .fp-end{display:flex}
.fp-poster-title{margin:0;font:600 20px/1.25 var(--fp-sans);color:var(--anatomy-strong)}
.fp-go{display:inline-flex;align-items:center;gap:10px;min-height:56px;padding:0 22px 0 14px;border:0;border-radius:999px;background:var(--fp-accent);color:var(--fp-on-accent);font:600 16px/1 var(--fp-sans);cursor:pointer}
.fp-go .fp-ico{width:30px;height:30px;fill:currentColor;stroke:none}
.fp-go:focus-visible,.fp-btn:focus-visible,.fp-item:focus-visible{outline:2px solid var(--fp-accent);outline-offset:2px}
.fp-cap{margin:0;min-height:calc(3 * 1.45em + 20px);padding:10px 14px;font-size:16px;line-height:1.45;color:var(--anatomy-strong)}
.fp-term{color:var(--fp-accent-text);font-weight:650}
.fp-en{color:var(--anatomy-muted);font-style:italic}
.fp-note{margin:-6px 14px 4px;font-size:13px;color:var(--anatomy-muted)}
.fp-note:empty{display:none}
.fp-bar{display:flex;align-items:center;gap:4px;padding:0 6px 6px}
.fp-btn{flex:0 0 auto;width:44px;height:44px;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:999px;background:transparent;color:var(--anatomy-strong);cursor:pointer;-webkit-tap-highlight-color:transparent}
.fp-btn .fp-ico{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.fp-btn[data-act="play"]{background:var(--fp-accent);color:var(--fp-on-accent)}
.fp-btn[data-act="play"] .fp-ico{fill:currentColor;stroke:none}
.fp-btn[data-act="play"] [data-i]{display:none}
.fp-btn[data-state="play"] [data-i="play"],.fp-btn[data-state="pause"] [data-i="pause"],.fp-btn[data-state="replay"] [data-i="replay"]{display:block}
.fp-btn[data-state="replay"] .fp-ico{fill:none;stroke:currentColor;stroke-width:2.2}
@media (hover:hover){.fp-btn:not([data-act="play"]):hover{background:color-mix(in srgb,var(--anatomy-strong) 8%,transparent)}}
.fp-btn [data-m]{display:none}
.fp[data-muted="0"] [data-m="on"],.fp[data-muted="1"] [data-m="off"]{display:block}
.fp-scrub{position:relative;flex:1 1 auto;min-width:0;height:44px}
.fp-ticks{position:absolute;left:9px;right:9px;top:20px;height:4px;pointer-events:none}
.fp-ticks i{position:absolute;top:-3px;width:2px;height:10px;margin-left:-1px;border-radius:1px;background:var(--anatomy-muted);opacity:.7}
.fp-range{position:absolute;inset:0;width:100%;height:44px;margin:0;background:transparent;-webkit-appearance:none;appearance:none;cursor:pointer;accent-color:var(--fp-accent)}
.fp-range::-webkit-slider-runnable-track{height:4px;border-radius:2px;background:var(--fp-hair)}
.fp-range::-moz-range-track{height:4px;border-radius:2px;background:var(--fp-hair)}
.fp-range::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;margin-top:-7px;border-radius:50%;background:var(--fp-accent);border:2px solid var(--anatomy-card)}
.fp-range::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:var(--fp-accent);border:2px solid var(--anatomy-card)}
.fp-time{position:absolute;right:2px;bottom:0;font:11px/1 var(--anatomy-mono);color:var(--anatomy-muted);pointer-events:none}
.fp-step{display:none}
.fp[data-motion="reduce"] .fp-ticks,.fp[data-motion="reduce"] .fp-range{display:none}
.fp[data-motion="reduce"] .fp-step{display:inline-flex}
.fp[data-motion="reduce"] .fp-time{position:static;display:block;text-align:center;line-height:44px;font-size:12px}
.fp-sheet{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;background:var(--anatomy-card)}
.fp-sheet[hidden]{display:none}
.fp-sheet-head{display:flex;align-items:center;gap:8px;padding:6px 6px 6px 14px;border-bottom:1px solid var(--fp-hair)}
.fp-sheet-title{flex:1;margin:0;font:600 16px/1.2 var(--fp-sans);color:var(--anatomy-strong)}
.fp-speed{min-height:44px;padding:0 12px;border:1px solid var(--fp-hair);border-radius:999px;background:transparent;color:var(--anatomy-strong);font:14px/1 var(--fp-sans);cursor:pointer}
.fp-speed[aria-pressed="true"]{border-color:var(--fp-accent);color:var(--fp-accent-text)}
.fp-list{flex:1;overflow:auto;padding:4px 0}
.fp-item{display:flex;align-items:center;gap:12px;width:100%;min-height:48px;padding:6px 14px;border:0;background:transparent;color:var(--anatomy-strong);font:15px/1.3 var(--fp-sans);text-align:left;cursor:pointer}
.fp-item-n{flex:0 0 26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font:600 12px/1 var(--anatomy-mono);box-shadow:inset 0 0 0 1px var(--fp-hair)}
.fp-item-t{flex:1}
.fp-item-d{font:12px/1 var(--anatomy-mono);color:var(--anatomy-muted)}
@media (hover:hover){.fp-item:hover{background:color-mix(in srgb,var(--anatomy-strong) 6%,transparent)}}
.fp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
/* a term's visual cue: the part turns petrol and breathes while it is named */
[data-cue][data-on] .iso-edge,[data-cue][data-on] .iso-crease{stroke:var(--fp-accent)!important}
[data-cue][data-on] .iso-edge{stroke-width:1.4px}
[data-cue][data-on] .iso-top{fill:var(--anatomy-lit-top)}
[data-cue][data-on] .iso-shade{fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .iso-line,[data-cue][data-on] .fp-mark{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-ink{fill:var(--fp-accent)}
[data-cue][data-on]{animation:fp-breathe 1.8s ease-in-out infinite}
@keyframes fp-breathe{0%,100%{filter:none}50%{filter:drop-shadow(0 0 2.5px var(--fp-glow))}}
.fp[data-motion="reduce"] [data-cue][data-on]{animation:none}
@media (prefers-reduced-motion:reduce){[data-cue][data-on]{animation:none}}
/* render mode (?render=1): the page is one 16:9 video frame; stage on top, the caption band under it, big enough for a phone */
html[data-render="1"],html[data-render="1"] body{width:100%;height:100%;overflow:hidden;background:var(--anatomy-card)}
.fp[data-render="1"]{position:fixed;inset:0;max-width:none;margin:0;border-radius:0;box-shadow:none;display:flex;flex-direction:column}
.fp[data-render="1"] .fp-stage{flex:1 1 auto;aspect-ratio:auto;min-height:0}
.fp[data-render="1"] .fp-cap{flex:0 0 auto;height:calc(3 * 1.25em + 24px);min-height:0;margin:0;padding:12px 48px;font-size:clamp(16px,6.1vh,44px);line-height:1.25;text-align:center;display:flex;align-items:center;justify-content:center;border-top:1px solid var(--fp-hair)}
.fp[data-render="1"] .fp-cap>span{display:block;max-width:100%}
.fp[data-render="1"] .fp-read{left:2.4vh;top:2.4vh;font-size:clamp(12px,3.6vh,30px);padding:.3em .6em;border-radius:.4em}
.fp[data-render="1"] .fp-bar,.fp[data-render="1"] .fp-note,.fp[data-render="1"] .fp-poster,.fp[data-render="1"] .fp-end,.fp[data-render="1"] .fp-sheet{display:none!important}
.fp[data-render="1"] [data-cue][data-on]{animation:none;filter:drop-shadow(0 0 var(--fp-b,0px) var(--fp-glow))}
.fp-mark{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-ink{fill:var(--anatomy-mid)}
`;

// The page's parameters as a plain inline script can read them (searchOf in
// timeline.mjs): the URL, or the frame name when the app hands it over as srcdoc.
const SEARCH = `(location.search.length>1?location.search:(window.name.charAt(0)==="?"?window.name:""))`;

// Sets the theme before first paint, as the figures do.
const BOOT = `(function(){var q=new URLSearchParams(${SEARCH}),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

function playerHtml(data, stageSvg) {
  return `<main class="fp" data-started="0" data-ended="0" data-playing="0">
<div class="fp-stage">${stageSvg}<div class="fp-read" hidden></div>
<div class="fp-poster"><p class="fp-poster-title">${data.title.nl}</p><button type="button" class="fp-go fp-poster-go">${icon('play')}<span>Bekijk de film</span></button></div>
<div class="fp-end"><button type="button" class="fp-go fp-again">${icon('replay', 'fp-replay')}<span></span></button></div>
</div>
<p class="fp-cap" aria-live="polite"></p>
<p class="fp-note" aria-live="polite"></p>
<div class="fp-bar">
<button type="button" class="fp-btn" data-act="play" data-state="play" aria-label="Afspelen">${icon('play').replace('<svg', '<svg data-i="play"')}${icon('pause').replace('<svg', '<svg data-i="pause"')}${icon('replay').replace('<svg', '<svg data-i="replay"')}</button>
<button type="button" class="fp-btn fp-step" data-act="prev">${icon('prev')}</button>
<div class="fp-scrub"><div class="fp-ticks"></div><input class="fp-range" type="range" min="0" max="100" step="0.1" value="0"><span class="fp-time"></span></div>
<button type="button" class="fp-btn fp-step" data-act="next">${icon('next')}</button>
<button type="button" class="fp-btn" data-act="mute" aria-pressed="false">${icon('sound').replace('<svg', '<svg data-m="on"')}${icon('silent').replace('<svg', '<svg data-m="off"')}</button>
<button type="button" class="fp-btn" data-act="scenes" aria-expanded="false">${icon('list')}</button>
</div>
<div class="fp-sheet" hidden><div class="fp-sheet-head"><p class="fp-sheet-title"></p><button type="button" class="fp-speed" data-act="speed" aria-pressed="false"><span class="fp-speed-l"></span> <span class="fp-speed-v">1×</span></button><button type="button" class="fp-btn" data-act="close">${icon('x')}</button></div><div class="fp-list"></div></div>
</main>`;
}

const json = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

// stage: { svg, script, css, label: { nl, en } }. The script defines STAGE.
export function pageHtml(data, stage) {
  const withLabel = { ...data, label: stage.label };
  const script = [strip('timeline.mjs'), stage.script, readFileSync(join(HERE, 'player-runtime.js'), 'utf8')].join('\n;\n');
  // The end card's replay label follows the language.
  const again = `document.querySelector('.fp-again span').textContent=new URLSearchParams(${SEARCH}).get('lang')==='en'?'Watch again':'Nog een keer';`;
  return `<!doctype html><html lang="nl" class="iso film" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${data.title.nl}</title><script>${BOOT}</script><style>${stage.kitCss || ''}${VANTAGE_CSS}${PLAYER_CSS}${stage.css || ''}</style></head><body>${playerHtml(data, stage.svg)}<script type="application/json" id="film-data">${json(withLabel)}</script><script>${again}</script><script type="module">${script.replace(/<\/(script)/gi, '<\\/$1')}</script></body></html>`;
}
