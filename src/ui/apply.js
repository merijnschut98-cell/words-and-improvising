// "Did you use it?": the check-back on a plan from the end of a lesson. His
// plan, how it went, then one recall question from that lesson right after
// the real experience. No XP and no round: this is about his week, not points.
import { h } from './dom.js';
import { ico } from './icons.js';
import { renderQuiz } from './quiz.js';
import { answerPlan, skipPlan, applyRecall, applyQuestionId, questionById, PLAN_USED } from '../core/course.js';
import { moduleOf, metaOf } from '../content/courses/index.js';

export function renderApply(app, { subject, planId }, root) {
  const t = app.t;
  const seq = app.navSeq;
  const plan = ((((app.state.courses || {})[subject]) || {}).plans || []).find((p) => p.id === planId);
  const main = h('main', { class: 'screen apply' });
  root.append(
    h('header', { class: 'top round-top' },
      h('button', { class: 'icon-btn', 'aria-label': t('close'), onclick: () => app.go('home') }, ico('x')),
      h('div', { class: 'round-title' }, t('applyTitle')), h('div', {})),
    main);
  if (!plan || plan.outcome) {
    main.replaceChildren(h('section', { class: 'card' }, h('p', {}, t('dueNone'))),
      h('button', { class: 'btn btn-primary', onclick: () => app.go('home') }, t('backToCourse')));
    return;
  }

  const planCard = () => h('section', { class: 'card apply-plan' },
    h('p', { class: 'today-label' }, t('applyYourPlan')),
    h('p', { class: 'said plan-text' }, plan.text));
  const later = h('button', {
    class: 'btn btn-ghost apply-later',
    onclick: () => { app.go('home'); }, // leaving unanswered = ask later (cleanup below)
  }, t('applyLater'));

  // Step 1: how it went. The choices are the action; no filled button yet.
  function choose(used) {
    const note = h('input', { type: 'text', class: 'text-input apply-note', maxlength: 160, placeholder: t('applyNotePh'), 'aria-label': t('applyNotePh') });
    main.replaceChildren(planCard(),
      h('section', { class: 'card' },
        h('div', { class: 'quiz-opts apply-opts' }, PLAN_USED.map((u) => h('button', {
          class: `opt${u === used ? ' chosen' : ''}`, 'aria-pressed': String(u === used), onclick: () => choose(u),
        }, t(`applyUsed_${u}`)))),
        note),
      h('button', { class: 'btn btn-primary btn-big apply-save', onclick: () => save(used, note.value) }, t('applySave')),
      later);
  }

  // Step 2: saved; one question from the lesson, scheduled but without XP.
  function save(used, note) {
    app.setState(answerPlan(app.state, { subject, id: plan.id, used, note }, Date.now()));
    const meta = metaOf(moduleOf(plan.lessonId));
    const qid = applyQuestionId(app.state.courseReviews, app.lang, plan.lessonId, meta ? (meta.questions || {})[plan.lessonId] : 0);
    if (!qid) { finish(false); return; }
    main.replaceChildren(h('p', { class: 'muted loading' }, '…'));
    app.openModule(subject, moduleOf(plan.lessonId)).then((mod) => {
      if (seq !== app.navSeq) return;
      const q = questionById([mod], qid);
      if (!q) { finish(false); return; }
      const box = h('div', {});
      main.replaceChildren(h('p', { class: 'muted small apply-recall' }, t('applyRecall')), box);
      renderQuiz(app, {
        questions: [q],
        termsOf: () => ((mod.lessons || []).find((l) => l.id === plan.lessonId) || {}).terms || [],
        onDone: (firstTry, sure) => {
          app.setState(applyRecall(app.state, { subject, results: firstTry, sure, lang: app.lang }, app.today()).state);
          finish(true);
        },
      }, box);
    }).catch(() => { if (seq === app.navSeq) finish(false); });
  }

  function finish(asked) {
    main.replaceChildren(h('section', { class: 'card lesson-done apply-done' },
      h('p', { class: 'done-mark' }, ico('check')),
      h('h2', { class: 'card-title' }, t('applyDone')),
      asked ? h('p', { class: 'muted small' }, t('applyDoneSub')) : null),
    h('button', { class: 'btn btn-primary btn-big', onclick: () => app.go('home') }, t('backToCourse')));
  }

  main.replaceChildren(planCard(),
    h('section', { class: 'card' },
      h('div', { class: 'quiz-opts apply-opts' }, PLAN_USED.map((u) => h('button', { class: 'opt', 'aria-pressed': 'false', onclick: () => choose(u) }, t(`applyUsed_${u}`))))),
    later);
  // Leaving without an answer counts as "ask me later": after twice the plan
  // expires, so the check-back never returns day after day. No-op once answered.
  return () => { app.setState(skipPlan(app.state, { subject, id: plan.id }, app.today(), Date.now())); };
}
