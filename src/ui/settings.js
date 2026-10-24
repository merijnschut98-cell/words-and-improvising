import { h, aiErrorText } from './dom.js';
import { checkKey } from '../core/claude.js';
import { navBar } from './home.js';

export function renderSettings(app, _params, root) {
  const t = app.t;
  const s = app.state.settings;
  const status = h('span', { class: 'saved', 'aria-live': 'polite' });
  const flash = () => {
    status.textContent = `✓ ${t('saved')}`;
    setTimeout(() => { status.textContent = ''; }, 1500);
  };
  const set = (patch, rerender = false) => {
    app.updateSettings(patch);
    if (rerender) app.go('settings');
    else flash();
  };

  const segmented = (value, options, onPick) => h('div', { class: 'segmented' },
    options.map(([v, label]) => h('button', { class: value === v ? 'on' : '', onclick: () => onPick(v) }, label)));

  const keyInput = h('input', {
    type: 'password', autocomplete: 'off', spellcheck: false, placeholder: 'sk-ant-…', value: s.apiKey,
    onchange: (e) => set({ apiKey: e.target.value.trim() }),
  });

  const remindNote = h('p', { class: 'muted small' }, t('remindHelp'));

  const keyStatus = h('p', { class: 'small', 'aria-live': 'polite' });
  const testBtn = h('button', { class: 'btn btn-ghost small', onclick: testKey }, `🔑 ${t('testKey')}`);
  async function testKey() {
    const key = keyInput.value.trim();
    if (key !== app.state.settings.apiKey) set({ apiKey: key });
    testBtn.disabled = true;
    keyStatus.className = 'small muted';
    keyStatus.textContent = t('testing');
    const res = await checkKey(key, app.state.settings.model);
    testBtn.disabled = false;
    keyStatus.className = `small ${res.ok ? 'good-text' : 'note'}`;
    keyStatus.textContent = res.ok ? `✓ ${t('keyOk')}` : aiErrorText(t, res);
  }

  // Daily reminder via Periodic Background Sync (installed Chrome apps only, best effort).
  async function toggleReminder(box) {
    if (!box.checked) {
      set({ remind: false });
      try {
        const reg = await navigator.serviceWorker.ready;
        if (reg.periodicSync) await reg.periodicSync.unregister('daily-practice');
      } catch { /* nothing to undo */ }
      return;
    }
    const fail = (msg) => { box.checked = false; set({ remind: false }); remindNote.textContent = msg; };
    try {
      if (!('Notification' in window) || !('serviceWorker' in navigator)) return fail(t('remindUnsupported'));
      if (await Notification.requestPermission() !== 'granted') return fail(t('remindDenied'));
      // ready never resolves if the worker failed to install; don't hang the toggle.
      const reg = await Promise.race([navigator.serviceWorker.ready, new Promise((r) => setTimeout(() => r(null), 3000))]);
      if (!reg || !reg.periodicSync) return fail(t('remindUnsupported'));
      await reg.periodicSync.register('daily-practice', { minInterval: 12 * 60 * 60 * 1000 });
      set({ remind: true });
      remindNote.textContent = t('remindHelp');
    } catch {
      fail(t('remindUnsupported'));
    }
  }

  function exportData() {
    const blob = new Blob([app.exportJson()], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: `spraakwater-${app.today()}.json` });
    document.body.append(a);
    a.click();
    a.remove();
  }

  root.append(
    h('header', { class: 'top' }, h('div', { class: 'round-title' }, t('settingsTitle')), status),
    h('main', { class: 'screen settings' },
      h('section', { class: 'card' },
        h('label', { class: 'field-label' }, t('language')),
        segmented(s.lang, [['nl', '🇳🇱 Nederlands'], ['en', '🇬🇧 English']], (v) => set({ lang: v }, true)),
        h('label', { class: 'field-label' }, t('defaultMode')),
        segmented(s.mode, [['speak', `🎙 ${t('speak')}`], ['type', `⌨️ ${t('type')}`]], (v) => set({ mode: v }, true))),
      h('section', { class: 'card' },
        h('label', { class: 'field-label' }, t('apiKey')),
        keyInput,
        h('p', { class: 'muted small' }, t('apiKeyHelp')),
        testBtn,
        keyStatus,
        h('label', { class: 'field-label' }, t('model')),
        h('select', { onchange: (e) => set({ model: e.target.value }) },
          h('option', { value: 'claude-opus-5-5', selected: s.model === 'claude-opus-5-5' }, t('modelBest')),
          h('option', { value: 'claude-haiku-5-5', selected: s.model === 'claude-haiku-5-5' }, t('modelCheap')))),
      h('section', { class: 'card' },
        h('label', { class: 'toggle' },
          h('input', { type: 'checkbox', checked: s.remind, onchange: (e) => toggleReminder(e.target) }),
          h('span', {}, t('remind'))),
        remindNote),
      h('section', { class: 'card' },
        h('label', { class: 'toggle' },
          h('input', { type: 'checkbox', checked: s.record, onchange: (e) => set({ record: e.target.checked }) }),
          h('span', {}, t('record'))),
        h('p', { class: 'muted small' }, t('recordHelp'))),
      h('section', { class: 'card' },
        h('p', { class: 'muted small' }, t('install')),
        h('div', { class: 'row' },
          h('button', { class: 'btn btn-ghost small', onclick: exportData }, t('exportData')),
          h('button', {
            class: 'btn btn-danger small',
            onclick: () => { if (window.confirm(t('resetConfirm'))) { app.reset(); app.go('home'); } },
          }, t('resetData'))))),
    navBar(app, 'settings'),
  );
}
