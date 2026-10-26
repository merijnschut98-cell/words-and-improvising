// "My real week": upcoming real events he wants to rehearse, and a short
// reflection afterwards. Free text stays on the device and is only ever
// rendered as text. Pure.
export const EVENT_TYPES = ['client', 'presentation', 'teamtalk', 'networking', 'other'];
const TEXT_MAX = 120;
const NOTE_MAX = 160;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const HARD_QUESTIONS = {
  en: {
    client: ['The client asks: "Why should we spend time on this now, with everything else going on?"', 'The client says: "We tried something like this before and it didn’t stick. What is different this time?"'],
    presentation: ['Someone in the room asks: "What exactly do you want from us after this?"', 'A manager interrupts: "Can you give me the bottom line in one sentence?"'],
    teamtalk: ['A teammate pushes back: "Why should we change what we are doing?"', 'Someone asks: "What do you expect from me personally?"'],
    networking: ['Someone asks: "So what do you actually do?"', 'Someone asks: "What are you working on that excites you right now?"'],
    other: ['Someone asks: "What is the one thing you want me to remember?"', 'Someone asks: "Why does this matter to you?"'],
  },
  nl: {
    client: ['De klant vraagt: "Waarom zouden we hier nu tijd in steken, met alles wat er al speelt?"', 'De klant zegt: "Zoiets hebben we eerder geprobeerd en het beklijfde niet. Wat is er nu anders?"'],
    presentation: ['Iemand in de zaal vraagt: "Wat wil je na afloop precies van ons?"', 'Een manager onderbreekt je: "Kun je de kern in één zin geven?"'],
    teamtalk: ['Een teamgenoot sputtert tegen: "Waarom zouden we iets veranderen aan hoe we het doen?"', 'Iemand vraagt: "Wat verwacht je van mij persoonlijk?"'],
    networking: ['Iemand vraagt: "Wat doe je nou eigenlijk precies?"', 'Iemand vraagt: "Waar werk je nu aan waar je enthousiast van wordt?"'],
    other: ['Iemand vraagt: "Wat is het ene ding dat ik moet onthouden?"', 'Iemand vraagt: "Waarom is dit belangrijk voor jou?"'],
  },
};

const PARTS = {
  en: { pitch: (x) => `Your 60-second version: ${x}`, pitchF: 'The 60-second version: what is it about and what do you want?', hardF: 'The hard question: answer it calmly and directly.', open: (x) => `Your opening line: ${x}`, openF: 'Opening line: your first 15 seconds, out loud.' },
  nl: { pitch: (x) => `Jouw versie in 60 seconden: ${x}`, pitchF: 'De 60-secondenversie: waar gaat het over en wat wil je?', hardF: 'De lastige vraag: beantwoord hem rustig en direct.', open: (x) => `Je openingszin: ${x}`, openF: 'Openingszin: je eerste 15 seconden, hardop.' },
};

const clean = (s, max) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, max);
const byDate = (a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0);

export function addEvent(events, { type, date, text }, id) {
  const t = clean(text, TEXT_MAX);
  if (!EVENT_TYPES.includes(type) || !DATE_RE.test(String(date)) || !t) return events;
  return [...events, { id, type, date, text: t, reflection: null }].sort(byDate);
}

export const upcoming = (events, today) => (events || []).filter((e) => e.date >= today && !e.reflection).sort(byDate);
export const needsReflection = (events, today) => (events || []).filter((e) => e.date < today && !e.reflection).sort(byDate);

export function reflect(events, id, { rating, next }) {
  const r = Math.min(5, Math.max(1, Math.round(Number(rating) || 3)));
  return events.map((e) => (e.id === id ? { ...e, reflection: { rating: r, next: clean(next, NOTE_MAX) } } : e));
}

function hashIndex(s, n) {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % n;
}

// Three rehearsal rounds for one event.
export function rehearsalPrompts(event, lang) {
  const L = lang === 'en' ? 'en' : 'nl';
  const qs = HARD_QUESTIONS[L][event.type] || HARD_QUESTIONS[L].other;
  const base = { extra: {}, seenIds: [], eventId: event.id };
  return [
    { ...base, id: `event:${event.id}:pitch`, drill: 'minute', body: PARTS[L].pitch(event.text), focus: PARTS[L].pitchF, timing: { prepS: 15, answerS: 60, questions: 1 } },
    { ...base, id: `event:${event.id}:hard`, drill: 'prep', body: qs[hashIndex(event.id, qs.length)], focus: PARTS[L].hardF, timing: { prepS: 10, answerS: 45, questions: 1 } },
    { ...base, id: `event:${event.id}:open`, drill: 'minute', body: PARTS[L].open(event.text), focus: PARTS[L].openF, timing: { prepS: 5, answerS: 15, questions: 1 } },
  ];
}
