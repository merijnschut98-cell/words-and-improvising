// A tiny DOM, enough for ui/dom.js's h() and the flair screens' tests:
// elements, text, attributes, classes, events and simple selectors
// ('.a', '.a.b', 'tag', '[attr]', 'tag.a', and descendant chains).
class FakeNode {
  constructor() { this.parentNode = null; this.childNodes = []; }
  get children() { return this.childNodes.filter((c) => c instanceof FakeElement); }
  get childElementCount() { return this.children.length; }
  get firstElementChild() { return this.children[0] || null; }
  get isConnected() { return true; }
  append(...nodes) {
    for (const n of nodes) {
      const node = n instanceof FakeNode ? n : new FakeText(String(n));
      if (node.parentNode) node.parentNode.childNodes = node.parentNode.childNodes.filter((c) => c !== node);
      node.parentNode = this;
      this.childNodes.push(node);
    }
  }
  appendChild(n) { this.append(n); return n; }
  replaceChildren(...nodes) { this.childNodes = []; this.append(...nodes); }
  remove() { if (this.parentNode) this.parentNode.childNodes = this.parentNode.childNodes.filter((c) => c !== this); this.parentNode = null; }
  replaceWith(n) {
    const p = this.parentNode;
    if (!p) return;
    const i = p.childNodes.indexOf(this);
    n.parentNode = p;
    p.childNodes[i] = n;
    this.parentNode = null;
  }
  get textContent() { return this.childNodes.map((c) => c.textContent).join(''); }
  set textContent(v) { this.childNodes = [new FakeText(String(v))]; }
}
class FakeText extends FakeNode {
  constructor(text) { super(); this.data = text; }
  get textContent() { return this.data; }
}
class FakeElement extends FakeNode {
  constructor(tag) {
    super();
    this.tagName = tag.toUpperCase();
    this.attributes = {};
    this.listeners = {};
    this.style = {};
    this.dataset = {};
    this.innerHTMLValue = '';
    this.disabled = false;
    this.hidden = false;
    this.value = '';
    this.checked = false;
  }
  get className() { return this.attributes.class || ''; }
  set className(v) { this.attributes.class = String(v); }
  get classList() {
    const el = this;
    const list = () => el.className.split(/\s+/).filter(Boolean);
    const add = (...cs) => { el.className = [...new Set([...list(), ...cs])].join(' '); };
    const remove = (...cs) => { el.className = list().filter((x) => !cs.includes(x)).join(' '); };
    return {
      contains: (c) => list().includes(c),
      add,
      remove,
      toggle: (c, on) => { const want = on === undefined ? !list().includes(c) : on; if (want) add(c); else remove(c); },
    };
  }
  set innerHTML(v) { this.innerHTMLValue = String(v); this.childNodes = []; }
  get innerHTML() { return this.innerHTMLValue; }
  get textContent() { return this.childNodes.length ? super.textContent : this.innerHTMLValue.replace(/<[^>]*>/g, ''); }
  set textContent(v) { super.textContent = v; }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  getAttribute(k) { return k in this.attributes ? this.attributes[k] : null; }
  hasAttribute(k) { return k in this.attributes; }
  removeAttribute(k) { delete this.attributes[k]; }
  addEventListener(type, fn) { (this.listeners[type] = this.listeners[type] || []).push(fn); }
  removeEventListener() {}
  dispatch(type, extra = {}) { for (const fn of this.listeners[type] || []) fn({ currentTarget: this, target: this, preventDefault() {}, ...extra }); }
  click() { if (!this.disabled) this.dispatch('click'); }
  focus() {}
  matches(sel) { return matchOne(this, sel); }
  closest(sel) { let n = this; while (n && n instanceof FakeElement) { if (matchOne(n, sel)) return n; n = n.parentNode; } return null; }
  querySelectorAll(sel) {
    const parts = sel.trim().split(/\s+/);
    const out = [];
    const walk = (n) => { for (const c of n.children) { if (matchChain(c, parts, this)) out.push(c); walk(c); } };
    walk(this);
    return out;
  }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
}

function matchOne(el, sel) {
  const m = sel.match(/^([a-z0-9]+)?((?:\.[\w-]+)*)((?:\[[\w-]+\])*)$/i);
  if (!m) throw new Error(`fakedom: unsupported selector ${sel}`);
  if (m[1] && el.tagName !== m[1].toUpperCase()) return false;
  const classes = (m[2] || '').split('.').filter(Boolean);
  if (!classes.every((c) => el.classList.contains(c))) return false;
  const attrs = [...(m[3] || '').matchAll(/\[([\w-]+)\]/g)].map((x) => x[1]);
  return attrs.every((a) => el.hasAttribute(a));
}
function matchChain(el, parts, root) {
  if (!matchOne(el, parts[parts.length - 1])) return false;
  let i = parts.length - 2;
  let n = el.parentNode;
  while (i >= 0 && n && n !== root.parentNode) {
    if (n instanceof FakeElement && matchOne(n, parts[i])) i--;
    if (n === root) break;
    n = n.parentNode;
  }
  return i < 0;
}

export function installFakeDom() {
  globalThis.Node = FakeNode;
  globalThis.document = { createElement: (t) => new FakeElement(t), createElementNS: (_ns, t) => new FakeElement(t), createTextNode: (t) => new FakeText(t), documentElement: new FakeElement('html') };
  if (!globalThis.window) globalThis.window = { scrollTo() {}, matchMedia: () => ({ matches: false }) };
  return { FakeElement };
}
