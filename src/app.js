// App shell: state, persistence, navigation.
import { load, save, defaultState, KEY } from './core/storage.js';
import { dayKey } from './core/progress.js';
import { buildLesson, makePrompt } from './core/lesson.js';
import { translator } from './i18n.js';
import { reminderMeta } from './core/reminder.js';
import { weeklyReview } from './core/review.js';
import { runTailor, fallbackPick } from './core/tailor.js';
import { aiErrorText } from './ui/dom.js';
import en from './content/prompts.en.js';
import nl from './content/prompts.nl.js';
import { renderHome } from './ui/home.js';
import { renderRound } from './ui/round.js';
import { renderFeedback } from './ui/feedback.js';
import { renderDone } from './ui/done.js';
import { renderProgress } from './ui/progress.js';
import { renderSettings } from './ui/settings.js';
import { renderConversation } from './ui/conversation.js';

const SCREENS = {
  home: renderHome,
  round: renderRound,
  feedback: renderFeedback,
  done: renderDone,
  progress: renderProgress,
  settings: renderSettings,
  conversation: renderConversation,
};

const storage = (() => {
  try {
    const k = '__probe__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return localStorage;
  } catch {
    const mem = {};
    return { getItem: (k) => mem[k] ?? null, setItem: (k, v) => { mem[k] = String(v); } };
  }
})();

// The service worker can't read localStorage; give it what the reminder needs.
function writeMeta(state) {
  if (!('caches' in window)) return;
  const meta = reminderMeta(state);
  caches.open('spraakwater-meta')
    .then((c) => c.put('./__meta', new Response(JSON.stringify(meta), { headers: { 'Content-Type': 'application/json' } })))
    .catch(() => {});
}

const root = document.getElementById('app');
let cleanup = null;

export const app = {
  state: load(storage),
  session: null, // { prompts, index, xp, levelUp } during a lesson
  installPrompt: null,
  navSeq: 0, // bumped on every navigation; async starters check it before navigating
  targeting: false,

  get lang() { return this.state.settings.lang; },
  get content() { return this.lang === 'en' ? en : nl; },
  get t() { return translator(this.lang); },
  today() { return dayKey(new Date()); },

  setState(next) {
    this.state = next;
    save(storage, next);
    writeMeta(next);
  },
  updateSettings(patch) {
    this.setState({ ...this.state, settings: { ...this.state.settings, ...patch } });
    document.documentElement.lang = this.lang;
  },
  reset() {
    this.setState(defaultState());
  },
  exportJson() {
    return storage.getItem(KEY) || JSON.stringify(this.state);
  },

  startLesson() {
    const prompts = buildLesson(this.content, Math.random, this.state.seen);
    this.session = { prompts, index: 0, xp: 0, levelUp: false };
    this.go('round', { prompt: prompts[0] });
  },
  startDrill(drill) {
    this.session = null;
    this.go('round', { prompt: makePrompt(drill, this.content, Math.random, this.state.seen) });
  },
  // Targeted practice: AI-written exercise for the weak spot, or the weekly focus without a key.
  async startTargeted() {
    if (this.targeting) return;
    this.targeting = true;
    const seq = this.navSeq;
    try {
      await this.pickTargeted(seq);
    } finally {
      this.targeting = false;
    }
  },
  async pickTargeted(seq) {
    const review = weeklyReview(this.state.history, Date.now());
    const fallback = () => fallbackPick(review, this.content, Math.random, this.state.seen);
    let prompt;
    let notice = '';
    const { apiKey, model } = this.state.settings;
    if (apiKey) {
      const improvements = this.state.history.filter((e) => e.coach && e.coach.improvement)
        .slice(0, 3).map((e) => e.coach.improvement);
      const res = await runTailor(apiKey, { review, improvements, lang: this.lang, model });
      if (res.ok) prompt = res.prompt;
      else notice = `${this.t('targetFallback')} ${aiErrorText(this.t, res)}`;
    }
    if (this.navSeq !== seq) return; // he navigated away while we waited
    this.session = null;
    this.go('round', { prompt: prompt || fallback(), notice });
  },
  // Adds an applied round's result to the running lesson, if any.
  addToSession({ xp = 0, levelUp = false } = {}) {
    if (!this.session) return;
    this.session.xp += xp;
    this.session.levelUp = this.session.levelUp || levelUp;
  },
  // Called by feedback after a round is applied.
  nextAfterRound(result) {
    const s = this.session;
    if (!s) return this.go('home');
    this.addToSession(result);
    s.index += 1;
    if (s.index < s.prompts.length) return this.go('round', { prompt: s.prompts[s.index] });
    const summary = { xp: s.xp, levelUp: s.levelUp };
    this.session = null;
    return this.go('done', summary);
  },

  go(screen, params = {}) {
    this.navSeq += 1;
    if (cleanup) {
      try { cleanup(); } catch { /* ignore */ }
    }
    cleanup = null;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    root.replaceChildren();
    root.dataset.screen = screen;
    const result = SCREENS[screen](app, params, root);
    if (typeof result === 'function') cleanup = result;
    window.scrollTo(0, 0);
  },
};

document.documentElement.lang = app.lang;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  app.installPrompt = e;
  if (root.dataset.screen === 'home') app.go('home');
});

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

app.go('home');
window.__app = app; // handy for debugging on device
