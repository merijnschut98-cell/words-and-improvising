import { h, aiErrorText } from './dom.js';
import { syncSection } from './sync.js';
import { ico } from './icons.js';
import { THEMES } from '../core/storage.js';
import { checkKey } from '../core/claude.js';
import { parseBackup } from '../core/storage.js';
import { navBar } from './home.js';
import { planPicker } from './plan.js';

export function renderSettings(app, _params, root) {
  const t = app.t;
  const s = app.state.settings;
  const status = h('span', { class: 'saved', 'aria-live': 'polite' });
  const flash = () => {
    status.replaceChildren(ico('check'), ' ', t('saved'));
    setTimeout(() => { status.textContent = ''; }, 1500);
  };
  const set = (patch, rerender = false) => {
    app.updateSettings(patch);
    if (rerender) app.go('settings');
    else flash();
  };

  const segmented = (value, options, onPick) => h('div', { class: 'segmented' },
    options.map(([v, label]) => h('button', { class: value === v ? 'on' : '', 'aria-pressed': String(value === v), onclick: () => onPick(v) }, label)));

  const keyInput = h('input', {
    type: 'password', autocomplete: 'off', spellcheck: false, placeholder: 'sk-ant-…', value: s.apiKey,
    onchange: (e) => set({ apiKey: e.target.value.trim() }),
  });

  const remindNote = h('p', { class: 'muted small' }, t('remindHelp'));

  // His work, for coach scenes and explanations. Device-only (settings never sync).
  const ctxInput = h('textarea', {
    id: 'ctx-input', class: 'text-input ctx-input', rows: 3, maxlength: 400,
    onchange: (e) => set({ context: e.target.value.trim().slice(0, 400) }),
  });
  ctxInput.value = s.context || '';

  const keyStatus = h('p', { class: 'small', 'aria-live': 'polite' });
  const testBtn = h('button', { class: 'btn btn-ghost small', onclick: testKey }, ico('key-round'), ' ', t('testKey'));
  async function testKey() {
    const key = keyInput.value.trim();
    if (key !== app.state.settings.apiKey) set({ apiKey: key });
    testBtn.disabled = true;
    keyStatus.className = 'small muted';
    keyStatus.textContent = t('testing');
    const res = await checkKey(key, app.state.settings.model);
    testBtn.disabled = false;
    keyStatus.className = `small ${res.ok ? 'good-text' : 'note'}`;
    keyStatus.textContent = res.ok ? t('keyOk') : aiErrorText(t, res);
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
    const a = h('a', { href: URL.createObjectURL(blob), download: `vantage-point-${app.today()}.json` });
    document.body.append(a);
    a.click();
    a.remove();
  }

  // Import: read the picked file, show what it holds, replace only after a confirm.
  // File contents only ever reach the screen as numbers via textContent.
  const importArea = h('div', { class: 'import-area', 'aria-live': 'polite' });
  const importErr = (code) => app.toast(t(code === 'json' ? 'importErrJson' : code === 'shape' ? 'importErrShape' : code === 'save' ? 'importErrSave' : 'importErrRead'));
  function showImportConfirm(text, summary) {
    importArea.replaceChildren(h('div', { class: 'card import-confirm' },
      h('p', {}, t('importConfirm')),
      h('p', { class: 'import-summary' }, h('strong', {}, t('importSummary', summary.rounds, summary.days, summary.xp))),
      h('div', { class: 'row' },
        h('button', {
          class: 'btn btn-danger small',
          onclick: () => {
            const res = app.importJson(text);
            if (!res.ok) { importArea.replaceChildren(); return importErr(res.error); }
            app.toast(t('importDone'));
            app.go('home');
          },
        }, t('importReplace')),
        h('button', { class: 'btn btn-ghost small', onclick: () => importArea.replaceChildren() }, t('importCancel')))));
  }
  async function pickBackup(input) {
    const file = input.files && input.files[0];
    input.value = '';
    if (!file) return;
    let text;
    try { text = await file.text(); } catch { return importErr('read'); }
    const res = parseBackup(text);
    if (!res.ok) { importArea.replaceChildren(); return importErr(res.error); }
    showImportConfirm(text, res.summary);
  }
  const importInput = h('input', { type: 'file', accept: '.json,application/json', class: 'file-input', onchange: (e) => pickBackup(e.target) });

  // One labelled group per topic; rarely used options sit lower down.
  const group = (id, ...children) => h('section', { class: 'settings-group', 'data-section': id },
    h('h2', { class: 'group-title' }, t(`set_${id}`)),
    h('div', { class: 'card' }, children));
  const toggle = (checked, onchange, label, help) => h('div', { class: 'toggle-row' },
    h('label', { class: 'toggle' }, h('input', { type: 'checkbox', checked, onchange }), h('span', {}, label)),
    help);

  root.append(
    h('header', { class: 'top' }, h('h1', { class: 'round-title' }, t('settingsTitle')), status),
    h('main', { class: 'screen settings' },
      group('language',
        segmented(s.lang, [['nl', 'Nederlands'], ['en', 'English']], (v) => set({ lang: v }, true))),
      // Sync between devices, above the coach: most people need it before a key.
      syncSection(app),
      group('coach',
        h('label', { class: 'field-label' }, t('apiKey')),
        keyInput,
        h('p', { class: 'muted small' }, t('apiKeyHelp')),
        testBtn,
        keyStatus,
        h('label', { class: 'field-label' }, t('model')),
        h('select', { onchange: (e) => set({ model: e.target.value }) },
          h('option', { value: 'claude-opus-5-5', selected: s.model === 'claude-opus-5-5' }, t('modelBest')),
          h('option', { value: 'claude-haiku-5-5', selected: s.model === 'claude-haiku-5-5' }, t('modelCheap'))),
        h('label', { class: 'field-label', for: 'ctx-input' }, t('ctxLabel')),
        ctxInput,
        h('p', { class: 'muted small' }, t('ctxHelp'))),
      group('practice',
        h('label', { class: 'field-label' }, t('defaultMode')),
        segmented(s.mode, [['speak', [ico('mic'), ' ', t('speak')]], ['type', [ico('keyboard'), ' ', t('type')]]], (v) => set({ mode: v }, true)),
        h('label', { class: 'field-label' }, t('planTitle')),
        h('p', { class: 'muted small' }, t('planHelp')),
        planPicker(app, flash),
        toggle(s.remind, (e) => toggleReminder(e.target), t('remind'), remindNote),
        toggle(s.sound !== false, (e) => set({ sound: e.target.checked }), t('sound'), h('p', { class: 'muted small' }, t('soundHelp'))),
        toggle(s.record, (e) => set({ record: e.target.checked }), t('record'), h('p', { class: 'muted small' }, t('recordHelp'))),
        toggle(!!s.voiceStats, (e) => set({ voiceStats: e.target.checked }), t('voiceStats'), h('p', { class: 'muted small' }, t('voiceStatsHelp')))),
      group('appearance',
        segmented(THEMES.includes(s.theme) ? s.theme : 'auto', THEMES.map((th) => [th, t(`theme_${th}`)]), (v) => set({ theme: v }, true)),
        h('p', { class: 'muted small' }, t('themeHelp'))),
      group('data',
        app.installPrompt
          ? h('button', {
            class: 'btn btn-ghost small install-btn',
            onclick: async () => { app.installPrompt.prompt(); app.installPrompt = null; app.go('settings'); },
          }, t('installBtn'))
          : null,
        h('p', { class: 'muted small' }, t('install')),
        h('div', { class: 'row' },
          h('button', { class: 'btn btn-ghost small', onclick: exportData }, t('exportData')),
          h('label', { class: 'btn btn-ghost small file-btn' }, importInput, t('importData')),
          h('button', {
            class: 'btn btn-danger small',
            onclick: () => { if (window.confirm(t('resetConfirm'))) { app.reset(); app.go('home'); } },
          }, t('resetData'))),
        importArea)),
    navBar(app, 'settings'),
  );
}
