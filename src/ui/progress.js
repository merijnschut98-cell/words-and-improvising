import { h, DRILL_ICON } from './dom.js';
import { levelFromXp, DRILLS } from '../core/progress.js';
import { navBar } from './home.js';

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
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const x = (i) => pad + (i * (w - 2 * pad)) / (values.length - 1);
  const y = (v) => hgt - pad - ((v - min) / (max - min || 1)) * (hgt - 2 * pad);
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const last = values[values.length - 1];
  svg.innerHTML = `<polyline points="${pts}" class="spark-line${invert ? ' invert' : ''}"/>`
    + `<circle cx="${x(values.length - 1)}" cy="${y(last)}" r="4" class="spark-dot"/>`;
  svg.setAttribute('aria-label', values.join(', '));
  return svg;
}

const avg = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);

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
      h('section', { class: 'stats' },
        h('div', { class: 'stat' }, h('b', {}, lv.level), h('span', {}, t('level'))),
        h('div', { class: 'stat' }, h('b', {}, s.xp), h('span', {}, 'XP')),
        h('div', { class: 'stat' }, h('b', {}, hist.length), h('span', {}, t('rounds'))),
        h('div', { class: 'stat' }, h('b', {}, minutes), h('span', {}, t('minutesSpoken')))),
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
