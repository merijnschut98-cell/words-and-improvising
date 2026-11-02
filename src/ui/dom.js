// Minimal hyperscript helper: h('div', {class: 'x', onclick}, child, ...)
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k in el && typeof v !== 'string') el[k] = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

// Drill -> icon name in icons.js. Render with ico(DRILL_ICON[d]).
export const DRILL_ICON = {
  minute: 'timer', explain: 'presentation', prep: 'layers', bridge: 'link', smalltalk: 'coffee', rapid: 'zap', story: 'book-open', pause: 'pause',
  debate: 'scale', boss: 'crown', yesAnd: 'handshake', listen: 'ear', expert: 'graduation-cap', frame: 'compass', real: 'globe', followUp: 'message-circle-question', pressure: 'flame',
};

// "Fewest fillers/min: 1.2" etc. for a personal-best record.
export function bestLabel(t, b) {
  return b.drill ? t('pb_fillerRateDrill', t(`drill_${b.drill}`), b.value) : t(`pb_${b.key}`, b.value);
}

export function fmtTime(s) {
  const n = Math.max(0, Math.ceil(s));
  return n >= 60 ? `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}` : String(n);
}

// Readable text for an AI call error {error, detail?}.
export function aiErrorText(t, res) {
  const table = t('coachErr');
  const base = table[res.error] || table.unknown;
  return res.detail && ['request', 'permission', 'unknown'].includes(res.error) ? `${base} ${res.detail}` : base;
}
