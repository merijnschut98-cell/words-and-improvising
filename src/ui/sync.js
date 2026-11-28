// Settings: sync this device's progress with the cloud (email login link).
import { h } from './dom.js';

const timeFmt = (lang, ts) => new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(ts);

export function syncSection(app) {
  const t = app.t;
  const s = app.state.settings;
  const note = h('p', { class: 'muted small sync-note', role: 'status' });
  const card = h('section', { class: 'card sync-card', 'data-section': 'sync' }, h('label', { class: 'field-label' }, t('syncTitle')));

  if (!s.syncOn) {
    const email = h('input', { type: 'email', class: 'text-input', autocomplete: 'email', placeholder: t('syncEmailPh'), 'aria-label': t('syncEmailPh'), value: s.syncEmail || '' });
    const send = h('button', {
      class: 'btn btn-ghost',
      onclick: async () => {
        send.disabled = true;
        note.textContent = t('syncSending');
        const res = await app.ensureCloud().signIn(email.value);
        send.disabled = false;
        if (res.ok) {
          app.updateSettings({ syncEmail: email.value.trim().toLowerCase() });
          note.textContent = t('syncLinkSent', email.value.trim());
        } else note.textContent = res.error === 'email' ? t('syncBadEmail') : res.error === 'rate' ? t('syncRateLimit') : t('syncFailed');
      },
    }, t('syncSend'));
    card.append(h('p', { class: 'muted small' }, t('syncHelp')), email, send, note);
    return card;
  }

  const st = app.syncer ? app.syncer.status() : {};
  note.textContent = st.error ? t('syncFailed') : st.lastSync ? t('syncLast', timeFmt(app.lang, st.lastSync)) : t('syncOnNote');
  card.append(
    h('p', {}, t('syncOnAs', s.syncEmail || '')),
    note,
    h('div', { class: 'row' },
      h('button', {
        class: 'btn btn-ghost small',
        onclick: async (e) => {
          e.currentTarget.disabled = true;
          note.textContent = t('syncSending');
          const res = await app.startSync();
          note.textContent = res.ok ? t('syncLast', timeFmt(app.lang, Date.now())) : t('syncFailed');
        },
      }, t('syncNow')),
      h('button', {
        class: 'btn btn-ghost small',
        onclick: async () => {
          await app.ensureCloud().signOut();
          app.updateSettings({ syncOn: false });
          app.go('settings');
        },
      }, t('syncOff'))));
  return card;
}
