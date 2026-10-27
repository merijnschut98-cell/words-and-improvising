// Prompt selection and daily lesson building. Pure, rng injected.
import { DRILLS } from './progress.js';

// Mulberry32: small deterministic rng for tests.
export function seededRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Structure frames for the frame drill (steps live in i18n and coach.js).
export const FRAME_IDS = ['prep', 'star', 'wsn', 'psb', 'ppf', 'answer', 'story3'];

const pickOne = (arr, rng) => arr[Math.floor(rng() * arr.length)];

function shuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Unseen items first (random among them); otherwise the least recently seen.
function pickFresh(items, pool, seen, rng, n = 1) {
  const key = (it) => `${pool}:${it.id}`;
  const unseen = shuffle(items.filter((it) => !(key(it) in seen)), rng);
  const old = items
    .filter((it) => key(it) in seen)
    .sort((a, b) => seen[key(a)] - seen[key(b)]);
  return [...unseen, ...old].slice(0, n).map((item) => ({ item, seenId: key(item) }));
}

export function makePrompt(drill, content, rng, seen = {}) {
  switch (drill) {
    case 'minute': {
      const [t] = pickFresh(content.topics, 'topic', seen, rng);
      return { id: t.seenId, drill, body: t.item.text, extra: {}, seenIds: [t.seenId] };
    }
    case 'explain': {
      const [c] = pickFresh(content.concepts, 'concept', seen, rng);
      const audience = pickOne(content.audiences, rng).text;
      return { id: c.seenId, drill, body: c.item.text, extra: { audience }, seenIds: [c.seenId] };
    }
    case 'prep': {
      const [o] = pickFresh(content.opinions, 'opinion', seen, rng);
      return { id: o.seenId, drill, body: o.item.text, extra: {}, seenIds: [o.seenId] };
    }
    case 'bridge': {
      const [t] = pickFresh(content.topics, 'topic', seen, rng);
      const words = shuffle(content.words, rng).slice(0, 3);
      return { id: t.seenId, drill, body: t.item.text, extra: { words }, seenIds: [t.seenId] };
    }
    case 'smalltalk': {
      const [s] = pickFresh(content.scenarios, 'scenario', seen, rng);
      return {
        id: s.seenId, drill, body: s.item.opener, extra: { setting: s.item.setting }, seenIds: [s.seenId],
      };
    }
    case 'rapid': {
      const qs = pickFresh(content.rapid, 'rapid', seen, rng, 5);
      return {
        id: qs[0].seenId,
        drill,
        body: qs[0].item.text,
        extra: { questions: qs.map((q) => q.item.text) },
        seenIds: qs.map((q) => q.seenId),
      };
    }
    case 'boss': {
      const [o] = pickFresh(content.opinions, 'opinion', seen, rng);
      const twists = shuffle(content.twists, rng).slice(0, 1);
      const words = shuffle(content.words, rng).slice(0, 3);
      return { id: o.seenId, drill, body: o.item.text, extra: { twists, words }, seenIds: [o.seenId] };
    }
    case 'debate': {
      const [o] = pickFresh(content.opinions, 'opinion', seen, rng);
      return { id: o.seenId, drill, body: o.item.text, extra: {}, seenIds: [o.seenId] };
    }
    case 'pause': {
      const [t] = pickFresh(content.topics, 'topic', seen, rng);
      return { id: t.seenId, drill, body: t.item.text, extra: {}, seenIds: [t.seenId] };
    }
    case 'story': {
      const [st] = pickFresh(content.storyStarts, 'story', seen, rng);
      const twists = shuffle(content.twists, rng).slice(0, 8);
      return { id: st.seenId, drill, body: st.item.text, extra: { twists }, seenIds: [st.seenId] };
    }
    case 'real': {
      // Real life: captain situations and work situations, freshest first across both.
      const both = [
        ...pickFresh(content.captain, 'captain', seen, rng, content.captain.length).map((c) => ({ ...c, kind: 'captain' })),
        ...pickFresh(content.work, 'work', seen, rng, content.work.length).map((c) => ({ ...c, kind: 'work' })),
      ];
      const unseen = shuffle(both.filter((c) => !(c.seenId in seen)), rng);
      const pick = unseen[0] || both.sort((a, b) => seen[a.seenId] - seen[b.seenId])[0];
      const extra = pick.kind === 'captain' ? { kind: 'captain', constraint: pick.item.constraint } : { kind: 'work' };
      return { id: pick.seenId, drill, body: pick.item.text, extra, seenIds: [pick.seenId] };
    }
    case 'followUp': {
      const [u] = pickFresh(content.followUps, 'followUp', seen, rng);
      return { id: u.seenId, drill, body: u.item.text, extra: { cues: [u.item.text], detail: u.item.detail }, seenIds: [u.seenId] };
    }
    case 'frame': {
      const [f] = pickFresh(content.frames, 'frame', seen, rng);
      const others = shuffle(FRAME_IDS.filter((x) => x !== f.item.frame), rng).slice(0, 2);
      return {
        id: f.seenId, drill, body: f.item.text,
        extra: { frame: f.item.frame, options: shuffle([f.item.frame, ...others], rng) }, seenIds: [f.seenId],
      };
    }
    case 'yesAnd': {
      const ls = pickFresh(content.yesAnd, 'yesAnd', seen, rng, 3);
      return {
        id: ls[0].seenId, drill, body: ls[0].item.text,
        extra: { cues: ls.map((l) => l.item.text) }, seenIds: ls.map((l) => l.seenId),
      };
    }
    case 'listen': {
      const [l] = pickFresh(content.listen, 'listen', seen, rng);
      const { statement, question } = l.item;
      return {
        id: l.seenId, drill, body: question,
        extra: { statement, question, cues: [`${statement} ${question}`] }, seenIds: [l.seenId],
      };
    }
    case 'expert': {
      const [x] = pickFresh(content.experts, 'expert', seen, rng);
      const qs = shuffle(content.expertQuestions, rng).slice(0, 5).map((q) => q.text);
      return { id: x.seenId, drill, body: x.item.text, extra: { cues: qs }, seenIds: [x.seenId] };
    }
    default:
      throw new Error(`Unknown drill: ${drill}`);
  }
}

// The drill he does worst lately: lowest average rating (self, else coach),
// more fillers/min breaking ties. Needs at least 2 recent rounds in a drill.
export function weakestDrill(history) {
  const recent = (history || []).slice(0, 40);
  let worst = null;
  for (const d of DRILLS) {
    const es = recent.filter((e) => e.drill === d && e.metrics);
    if (es.length < 2) continue;
    const rating = es.reduce((a, e) => a + (e.rating ?? (e.coach && e.coach.overall) ?? 3), 0) / es.length;
    const fillers = es.reduce((a, e) => a + (e.metrics.fillerRate || 0), 0) / es.length;
    const score = rating - fillers / 10;
    if (!worst || score < worst.score) worst = { d, score };
  }
  return worst ? worst.d : null;
}

// Daily lesson. Without opts: 3 random drills. With {history, due}: one drill
// from the weakest area, one due spaced review (else the drill left longest),
// and one random; always distinct drills. Each prompt carries a `reason`.
export function buildLesson(content, rng, seen = {}, opts = null, n = 3) {
  if (!opts) return shuffle(DRILLS, rng).slice(0, n).map((d) => makePrompt(d, content, rng, seen));
  const history = opts.history || [];
  const out = [];
  const used = () => new Set(out.map((p) => p.drill));
  // His chosen focus for the week takes the first slot; otherwise the weakest drill.
  const weak = opts.focus ? null : weakestDrill(history);
  if (opts.focus) out.push({ ...makePrompt(opts.focus, content, rng, seen), reason: 'focus' });
  else if (weak) out.push({ ...makePrompt(weak, content, rng, seen), reason: 'weak' });
  const review = (opts.due || []).find((p) => !used().has(p.drill));
  if (review) out.push({ ...review, reason: 'review' });
  else {
    const lastDone = (d) => {
      const i = history.findIndex((e) => e.drill === d);
      return i === -1 ? Infinity : i; // never done = most stale
    };
    const stale = shuffle(DRILLS.filter((d) => !used().has(d)), rng).sort((a, b) => lastDone(b) - lastDone(a))[0];
    out.push({ ...makePrompt(stale, content, rng, seen), reason: 'stale' });
  }
  for (const d of shuffle(DRILLS.filter((x) => !used().has(x)), rng)) {
    if (out.length >= n) break;
    out.push({ ...makePrompt(d, content, rng, seen), reason: 'random' });
  }
  return out.slice(0, n);
}
