// The learning path as a map (v16 flair): per topic, its levels are stops on
// a short line. Which levels show comes from the course engine's topicRows
// (a level appears once the one before it is passed); this file only draws
// it. After the open stop, a faint dashed stub says how many levels are
// still to come (no names); a finished topic ends in a flag.
import { h } from './dom.js';
import { ico } from './icons.js';
import { topicRows, nextLesson } from '../core/course.js';
import { topicsOf } from '../content/courses/index.js';

// Per topic: the visible stops (passed, owned, todo; one of them the next
// step of the module), how many levels are still hidden, and whether done.
export function pathModel(state, meta, lang) {
  const rows = topicRows(state, meta, lang) || [];
  const topics = topicsOf(meta) || [];
  const next = nextLesson(state, meta);
  return {
    next,
    topics: rows.map((row, i) => {
      const total = topics[i].levels.length;
      return {
        id: row.id,
        title: row.title,
        passed: row.passed,
        total,
        stops: row.levels.map((lv) => ({ ...lv, next: lv.lessonId === next })),
        hidden: total - row.levels.length,
        done: row.passed === total,
      };
    }),
  };
}

const STOP_ICON = { passed: 'check', owned: 'check-check' };

// One topic's path: stop buttons joined by lines; the stub or the flag at the end.
export function topicPath(t, topicTitle, topic, go) {
  const cells = [];
  topic.stops.forEach((s, i) => {
    if (i > 0) cells.push(h('span', { class: `path-line${topic.stops[i - 1].state !== 'todo' && s.state !== 'todo' ? ' on' : ''}`, 'aria-hidden': 'true' }));
    const label = t(`level_${s.level}`);
    const aria = t('chipLabel', topicTitle, label, t(`chipState_${s.state}`));
    cells.push(h('span', { class: 'path-cell' },
      h('button', {
        class: `path-stop s-${s.state}${s.next ? ' s-next' : ''}`,
        'aria-label': s.next ? `${aria} (${t('chipNext')})` : aria,
        onclick: () => go(s.lessonId),
      }, STOP_ICON[s.state] ? ico(STOP_ICON[s.state]) : null),
      h('span', { class: 'path-label' }, label),
      s.next ? h('span', { class: 'path-next' }, t('chipNext')) : null));
  });
  if (topic.hidden > 0) {
    cells.push(h('span', { class: 'path-line path-line-more', 'aria-hidden': 'true' }));
    cells.push(h('span', { class: 'path-stub mono', role: 'img', 'aria-label': t('pathMore', topic.hidden) }, t('pathMoreShort', topic.hidden)));
  } else if (topic.done) {
    cells.push(h('span', { class: 'path-line on', 'aria-hidden': 'true' }));
    cells.push(h('span', { class: 'path-flag', role: 'img', 'aria-label': t('pathTopicDone') }, ico('flag'), ico('check')));
  }
  return h('div', { class: 'path' }, cells);
}
