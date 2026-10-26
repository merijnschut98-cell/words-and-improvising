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
    default:
      throw new Error(`Unknown drill: ${drill}`);
  }
}

export function buildLesson(content, rng, seen = {}, n = 3) {
  return shuffle(DRILLS, rng).slice(0, n).map((d) => makePrompt(d, content, rng, seen));
}
