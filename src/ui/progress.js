import { h, DRILL_ICON } from './dom.js';
import { levelFromXp, DRILLS } from '../core/progress.js';
import { navBar } from './home.js';
import { weeklyReview } from '../core/review.js';
import { calibration, localCalibration, skillRadar } from '../core/calibration.js';
import { MILESTONES } from '../core/milestones.js';

// "4.2 (▼ 1.3)" with a tone: lowerIsBetter flips which direction is good.
function delta(now, prev, lowerIsBetter) {
  if (now == null) return { text: '–', tone: '' };
  if (prev == null) return { text: String(now), tone: '' };
  const d = Math.round((now - prev) * 10) / 10;
  if (d === 0) return { text: `${now} (=)`, tone: '' };
  const good = lowerIsBetter ? d < 0 : d > 0;
  return { text: `${now} (${d < 0 ? '▼' : '▲'} ${Math.abs(d)})`, tone: good ? 'good' : 'bad' };
}

function weekCard(app) {
  const t = app.t;
  const r = weeklyReview(app.state.history, Date.now());
  const row = (label, value, tone = '') => h('div', { class: 'week-row' },
    h('span', {}, label), h('b', { class: tone }, value));
  const fr = delta(r.thisWeek.fillerRate, r.lastWeek.fillerRate, true);
  const wpm = delta(r.thisWeek.wpm, r.lastWeek.wpm, false);
  const f = r.focus;
  const focusText = f.kind === 'filler' ? t('focusFiller', f.value)
    : f.kind === 'drill' ? t('focusDrill', t(`drill_${f.value}`))
      : f.kind === 'rounds' ? t('focusRounds', f.value)
        : t('focusStretch');
  return h('section', { class: 'card review-card' },
    h('h2', { class: 'card-title' }, t('thisWeek')),
    row(t('rounds'), `${r.thisWeek.rounds} (${t('lastWeekShort')} ${r.lastWeek.rounds})`),
    row(t('minutesSpoken'), `${r.thisWeek.minutes} (${t('lastWeekShort')} ${r.lastWeek.minutes})`),
    row(t('m_fillers'), fr.text, fr.tone),
    row(t('m_wpm'), wpm.text, wpm.tone),
    r.boss ? row(`👑 ${t('bossTitle')}`, `${r.boss.words} ${t('m_words')} · ${r.boss.fillerRate} ${t('m_fillers')}`) : null,
    r.topFiller ? row(t('topFillerWeek'), `“${r.topFiller.word}” ×${r.topFiller.count}`) : null,
    r.best ? row(t('bestDrill'), `${DRILL_ICON[r.best.drill]} ${t(`drill_${r.best.drill}`)} (${r.best.avg})`) : null,
    r.worst && r.worst.drill !== r.best.drill
      ? row(t('worstDrill'), `${DRILL_ICON[r.worst.drill]} ${t(`drill_${r.worst.drill}`)} (${r.worst.avg})`) : null,
    h('div', { class: 'focus' }, h('b', {}, `🎯 ${t('focusNext')}: `), focusText));
}

function sparkline(values, { invert = false } = {}) {
  const w = 300;
  const hgt = 70;
  const pad = 6;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${hgt}`);
  svg.setAttribute('class', 'spark');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('role', 'img');
  if (values.length < 2) {
    svg.innerHTML = `<line x1="${pad}" y1="${hgt / 2}" x2="${w - pad}" y2="${hgt / 2}" class="spark-base"/>`;
    return svg;
  }
  // Scale to the data's own range so small changes stay visible.
  const max = Math.max(...values);
  const min = Math.min(...values);
  const x = (i) => pad + (i * (w - 2 * pad)) / (values.length - 1);
  const y = (v) => (max === min ? hgt / 2 : hgt - pad - ((v - min) / (max - min)) * (hgt - 2 * pad));
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const last = values[values.length - 1];
  svg.innerHTML = `<polyline points="${pts}" class="spark-line${invert ? ' invert' : ''}"/>`
    + `<circle cx="${x(values.length - 1)}" cy="${y(last)}" r="4" class="spark-dot"/>`;
  svg.setAttribute('aria-label', values.join(', '));
  return svg;
}

const avg = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);

const SVGNS = 'http://www.w3.org/2000/svg';
const AXES = ['clarity', 'structure', 'fluency', 'vocabulary'];

// 4-axis radar (0–5), top/right/bottom/left. Labels are text nodes.
function radarSvg(r, t) {
  const c = 110;
  const R = 70;
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('viewBox', '-50 0 320 220');
  svg.setAttribute('class', 'radar');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', AXES.map((a) => `${t(`sc_${a}`)} ${r[a]}`).join(', '));
  const dir = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const pt = (i, v) => `${(c + dir[i][0] * R * v / 5).toFixed(1)},${(c + dir[i][1] * R * v / 5).toFixed(1)}`;
  const el = (tag, attrs) => {
    const n = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    svg.append(n);
    return n;
  };
  for (const lvl of [1, 2, 3, 4, 5]) el('polygon', { points: AXES.map((_, i) => pt(i, lvl)).join(' '), class: 'radar-grid' });
  AXES.forEach((_, i) => el('line', { x1: c, y1: c, x2: c + dir[i][0] * R, y2: c + dir[i][1] * R, class: 'radar-grid' }));
  el('polygon', { points: AXES.map((a, i) => pt(i, r[a])).join(' '), class: 'radar-shape' });
  const anchor = ['middle', 'start', 'middle', 'end'];
  AXES.forEach((a, i) => {
    const dim = r.source === 'local' && (a === 'clarity' || a === 'structure');
    const label = el('text', {
      x: c + dir[i][0] * (R + 8), y: c + dir[i][1] * (R + 14) + (i === 1 || i === 3 ? 4 : 0),
      'text-anchor': anchor[i], class: `radar-label${dim ? ' dim' : ''}`,
    });
    label.textContent = `${t(`sc_${a}`)} ${r[a]}`;
  });
  return svg;
}

function skillCard(app) {
  const t = app.t;
  const r = skillRadar(app.state.history);
  if (!r) return null;
  const coached = app.state.history.slice(0, 10).filter((e) => e.coach && e.coach.scores).length;
  return h('section', { class: 'card skill-card' },
    h('h2', { class: 'card-title' }, t('skillsTitle')),
    radarSvg(r, t),
    h('p', { class: 'small muted' }, r.source === 'coach' ? t('skillsCoach', coached) : t('skillsLocal')));
}

// One vertical path: reached ✓, the next one highlighted, the rest muted.
function journeyCard(app) {
  const t = app.t;
  const have = new Set(app.state.milestones || []);
  const next = MILESTONES.find((m) => !have.has(m.id));
  return h('section', { class: 'card journey-card' },
    h('h2', { class: 'card-title' }, t('journeyTitle')),
    h('ol', { class: 'journey' }, MILESTONES.map((m) => {
      const state = have.has(m.id) ? 'reached' : m === next ? 'next' : 'later';
      return h('li', { class: `ms ${state}` },
        h('span', { class: 'ms-dot', 'aria-hidden': 'true' }, state === 'reached' ? '✓' : ''),
        h('span', { class: 'ms-text' },
          h('b', {}, t(`ms_${m.id}`), state === 'next' ? h('small', { class: 'ms-next' }, ` · ${t('journeyNext')}`) : null),
          h('small', {}, t(`msHow_${m.id}`)),
          m.unlocks ? h('small', { class: 'ms-unlock' }, `🎨 ${t('themeUnlocks', t(`theme_${m.unlocks}`))}`) : null));
    })));
}

function calibrationCard(app) {
  const t = app.t;
  const c = calibration(app.state.history);
  const text = c ? t(`calib_${c.verdict}`, c.meanGap, c.n)
    : (() => { const l = localCalibration(app.state.history); return l && t(`calibLocal_${l.verdict}`); })();
  if (!text) return null;
  return h('section', { class: 'card calib-card' },
    h('h2', { class: 'card-title' }, t('calibTitle')),
    h('p', {}, text));
}

export function renderProgress(app, _params, root) {
  const t = app.t;
  const s = app.state;
  const hist = s.history;
  const lv = levelFromXp(s.xp);
  const recent = hist.slice(0, 20).reverse();
  const minutes = Math.round(hist.reduce((a, e) => a + (e.durationS || 0), 0) / 60);

  const last10 = hist.slice(0, 10).map((e) => e.metrics.fillerRate);
  const prev10 = hist.slice(10, 20).map((e) => e.metrics.fillerRate);
  let trend = null;
  if (last10.length >= 3 && prev10.length >= 3) {
    const diff = avg(last10) - avg(prev10);
    trend = h('p', { class: diff <= 0 ? 'good-text' : 'note' },
      `${diff <= 0 ? '▼' : '▲'} ${Math.abs(diff).toFixed(1)} ${t('m_fillers')} ${diff <= 0 ? t('better') : t('worse')}`);
  }

  const dateFmt = new Intl.DateTimeFormat(app.lang === 'nl' ? 'nl-NL' : 'en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  root.append(
    h('header', { class: 'top' }, h('div', { class: 'round-title' }, t('progressTitle'))),
    h('main', { class: 'screen progress' },
      weekCard(app),
      h('section', { class: 'stats' },
        h('div', { class: 'stat' }, h('b', {}, lv.level), h('span', {}, t('level'))),
        h('div', { class: 'stat' }, h('b', {}, s.xp), h('span', {}, 'XP')),
        h('div', { class: 'stat' }, h('b', {}, hist.length), h('span', {}, t('rounds'))),
        h('div', { class: 'stat' }, h('b', {}, minutes), h('span', {}, t('minutesSpoken')))),
      journeyCard(app),
      skillCard(app),
      calibrationCard(app),
      h('section', { class: 'card' },
        h('h2', { class: 'card-title' }, t('fillersTrend')),
        sparkline(recent.map((e) => e.metrics.fillerRate), { invert: true }),
        trend,
        h('h2', { class: 'card-title' }, t('paceTrend')),
        sparkline(recent.map((e) => e.metrics.wpm))),
      h('section', { class: 'card' },
        h('h2', { class: 'card-title' }, t('drillLevels')),
        h('div', { class: 'levels' }, DRILLS.map((d) => h('div', { class: 'level-line' },
          h('span', {}, `${DRILL_ICON[d]} ${t(`drill_${d}`)}`),
          h('span', { class: 'pips' }, [1, 2, 3, 4, 5].map((n) => h('i', { class: n <= s.drillLevels[d] ? 'on' : '' }))))))),
      h('section', { class: 'card' },
        h('h2', { class: 'card-title' }, t('history')),
        hist.length === 0 ? h('p', { class: 'muted' }, t('noHistory')) : null,
        h('div', { class: 'history' }, hist.slice(0, 50).map((e) => h('details', { class: 'hist-item' },
          h('summary', {},
            h('span', { class: 'hist-icon', 'aria-hidden': 'true' }, DRILL_ICON[e.drill]),
            h('span', { class: 'hist-main' }, h('b', {}, e.body), h('small', { class: 'muted' }, dateFmt.format(e.ts))),
            h('span', { class: 'hist-meta' }, `${e.metrics.fillerRate}/min`)),
          h('p', { class: 'transcript small' }, e.transcript),
          e.coach ? h('p', { class: 'small' }, h('b', {}, `${t('improvement')}: `), e.coach.improvement) : null,
          e.coach ? h('p', { class: 'small muted' }, h('b', {}, `${t('stronger')}: `), e.coach.stronger_version) : null))))),
    navBar(app, 'progress'),
  );
}
