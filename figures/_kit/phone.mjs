// The shared phone layout and parameter reading for every lesson figure.
//
// Each figures/<id>/build.mjs writes its page through finishFigure(page, opts):
//   - every location.search read becomes the page's parameters from the URL or,
//     when the app hands the page over as srcdoc (offline-safe, like the
//     films), from the frame name;
//   - the phone CSS and runtime (phone-core.mjs + phone-runtime.js) go in, as a
//     module after the figure's own script;
//   - opts.crop: the phone camera per level, { 1: [x, y, w, h], ..., all: [...] }
//     in the drawing's viewBox units; without it the camera crops to what is
//     drawn. opts.pad: air around an automatic crop (share of its size).
//   - opts.css / opts.script: a figure's own phone rules (scope them with
//     html.vp-phone) and a script run after the phone runtime.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const read = (file) => readFileSync(join(HERE, file), 'utf8');

// The parameters as a plain expression any inline script can use in place of
// location.search (searchOf in phone-core.mjs, written out).
export const SEARCH = '(location.search.length>1?location.search:(typeof window.name==="string"&&window.name.charAt(0)==="?"?window.name:""))';

export const PHONE_CSS = `
html.vp-phone,html.vp-phone body,html.vp-phone main{height:100%;margin:0}
html.vp-phone .iso-figure{height:100%;margin:0}
html.vp-phone .iso-plate{display:flex!important;flex-direction:column!important;justify-content:flex-start!important;align-items:stretch!important;height:100%!important;max-height:none!important;min-height:0!important;padding:0 0 4px!important;position:relative!important;overflow:hidden}
html.vp-phone .iso-plate-corners{display:none!important}
html.vp-phone .iso-plate-corner{position:static!important;inset:auto!important;transform:none!important;max-width:none!important;margin:0!important}
.vp-head{display:none;gap:6px;align-items:baseline;margin:0 30px 4px 0;font-size:12px;line-height:16px}
.vp-head .iso-plate-corner{white-space:normal!important;font-size:12px!important}
html.vp-phone .vp-stage{flex:1 1 auto!important;min-height:0!important;width:auto!important;height:auto!important;max-height:none!important;position:relative!important;inset:auto!important;margin:0!important;padding:3px 4px 0!important;transform:none!important}
html.vp-phone .vp-stage .iso-svg{width:100%!important;height:100%!important;max-height:100%!important;max-width:100%!important}
.vp-tiny{visibility:hidden}
.vp-read{position:relative;display:flex;align-items:flex-end;gap:2px;flex:none;min-height:30px;padding:0 2px 2px 10px}
.vp-sheet{flex:1 1 auto;min-width:0}
.vp-sheet [data-corner="hint"]{display:none}
html.vp-phone .vp-sheet [data-readout]{display:block;font-size:11px!important;line-height:15px!important;max-height:30px;overflow:hidden;text-align:left!important;white-space:normal!important;letter-spacing:0}
html.vp-phone .vp-sheet [data-readout]>*{display:block;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vp-more{display:none;position:relative;z-index:4;flex:none;min-width:52px;height:44px;margin-top:-14px;padding:0 10px;border:0;border-radius:8px;background:transparent;color:var(--anatomy-strong);font:600 12px/1 inherit;font-family:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer;-webkit-tap-highlight-color:transparent}
.vp-has-more .vp-more{display:inline-flex;align-items:center;justify-content:center}
html[data-vp-more] .vp-sheet{position:absolute;left:6px;right:6px;bottom:100%;z-index:5;overflow:auto;padding:10px 12px;border-radius:10px;background:var(--anatomy-card);box-shadow:0 0 0 1px color-mix(in srgb,var(--anatomy-text) 22%,transparent),0 10px 28px rgba(0,0,0,.28)}
html[data-vp-more] .vp-sheet .vp-head{display:flex}
html[data-vp-more] .vp-sheet [data-corner="hint"]{display:block;margin:0 0 6px!important;white-space:normal!important;overflow:visible!important;color:var(--anatomy-muted);font-size:12px!important;line-height:1.4}
html[data-vp-more] .vp-sheet [data-readout]{max-height:none;overflow:visible}
html[data-vp-more] .vp-sheet [data-readout]>*{white-space:normal;overflow:visible}
html.vp-phone .vp-controls{position:static!important;inset:auto!important;transform:none!important;display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;justify-content:flex-start!important;gap:6px!important;flex:none!important;width:auto!important;height:auto!important;margin:0!important;padding:0 8px!important;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;overscroll-behavior-x:contain}
html.vp-phone .vp-controls::-webkit-scrollbar{display:none}
html.vp-phone .vp-controls [hidden]{display:none!important}
html.vp-phone .vp-controls>:not([hidden]):not(button):not(input):not(select):not(label){display:contents!important}
html.vp-phone .vp-controls button,html.vp-phone .vp-controls select,html.vp-phone .vp-controls input:not([type="range"]){flex:1 0 auto!important;min-width:44px!important;min-height:44px!important;height:44px!important;width:auto!important;max-width:none!important;padding:0 12px!important;white-space:nowrap!important}
html.vp-phone .vp-controls input[type="range"]{flex:1 1 140px!important;min-width:120px!important;height:44px!important;margin:0!important}
html.vp-phone .vp-controls .vp-gap{margin-left:10px!important}
html.vp-phone .vp-controls.vp-scroll{-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 28px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 28px),transparent)}
html.vp-phone .iso-plate button:not(.vp-full):not(.vp-more){min-width:44px;min-height:44px}
.vp-full{position:absolute;top:0;right:0;z-index:6;width:44px;height:44px;padding:0;border:0;border-radius:0 0 0 10px;background:transparent;color:var(--anatomy-muted);display:grid;place-items:center;cursor:pointer;-webkit-tap-highlight-color:transparent}
.vp-full:hover,.vp-full:focus-visible{color:var(--anatomy-strong)}
.vp-full svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.vp-full .vp-ico-min,.vp-full.vp-on .vp-ico-max{display:none}
.vp-full.vp-on .vp-ico-min{display:block}
html[data-vp-full] .vp-stage{touch-action:none!important}
`;

const strip = (src) => src.replace(/^export /gm, '');
export const phoneScript = () => `${strip(read('phone-core.mjs'))}\n;\n${read('phone-runtime.js')}`;

export function finishFigure(page, { crop, pad, css = '', script: extra = '' } = {}) {
  if (!page.includes('</head>') || !page.includes('</body>')) throw new Error('finishFigure: not a whole page');
  if (page.includes('id="vp-phone"')) throw new Error('finishFigure: page already finished');
  const cfg = {};
  if (crop) cfg.crop = crop;
  if (pad != null) cfg.pad = pad;
  const config = Object.keys(cfg).length ? `<script type="application/json" id="vp-phone-config">${JSON.stringify(cfg)}</script>` : '';
  const script = `${phoneScript()}\n;\n${extra}`.replace(/<\/(script)/gi, '<\\/$1');
  return page
    .replace(/location\.search/g, () => SEARCH)
    .replace('</head>', () => `<style id="vp-phone-css">${PHONE_CSS}${css}</style></head>`)
    .replace(/<\/body>(?![\s\S]*<\/body>)/, () => `${config}<script type="module" id="vp-phone">${script}</script></body>`);
}
