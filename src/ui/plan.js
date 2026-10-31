import { h } from './dom.js';
import { PLAN_CUES, planCueText } from '../core/reminder.js';

// Practice plan picker (implementation intention): a cue plus an optional hour.
export function planPicker(app, onChange = () => {}) {
  const t = app.t;
  const wrap = h('div', { class: 'plan-picker' });
  const save = (patch) => {
    app.setState({ ...app.state, plan: { ...app.state.plan, ...patch } });
    render();
    onChange();
  };
  function render() {
    const plan = app.state.plan;
    const custom = plan.cue && !PLAN_CUES.includes(plan.cue);
    wrap.replaceChildren(
      h('div', { class: 'chips' }, PLAN_CUES.map((c) => h('button', {
        class: `chip-btn${plan.cue === c ? ' on' : ''}`,
        onclick: () => save({ cue: plan.cue === c ? '' : c }),
      }, planCueText(c, app.lang)))),
      h('input', {
        type: 'text', class: 'plan-custom', placeholder: t('planCustom'), value: custom ? plan.cue : '',
        onchange: (e) => save({ cue: e.target.value.trim() }),
      }),
      h('label', { class: 'field-label' }, t('planHour')),
      h('select', { onchange: (e) => save({ hour: e.target.value === '' ? null : Number(e.target.value) }) },
        h('option', { value: '', selected: plan.hour == null }, t('planAnyTime')),
        Array.from({ length: 18 }, (_, i) => i + 6).map((hr) => h('option', { value: String(hr), selected: plan.hour === hr }, `${String(hr).padStart(2, '0')}:00`))),
    );
  }
  render();
  return wrap;
}

export function planLine(app) {
  const { cue, hour } = app.state.plan || {};
  if (!cue && hour == null) return null;
  const when = [planCueText(cue, app.lang), hour != null ? `~${String(hour).padStart(2, '0')}:00` : ''].filter(Boolean).join(' · ');
  return h('button', { class: 'plan-line', onclick: () => app.go('settings') }, `🗓 ${app.t('planYour')}: ${when} ✏️`);
}
