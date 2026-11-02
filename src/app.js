// App shell: state, persistence, navigation.
import { load, save, defaultState, KEY, needsWelcome, importBackup } from './core/storage.js';
import { dayKey, reconcileStreak } from './core/progress.js';
import { buildLesson, makePrompt } from './core/lesson.js';
import { translator } from './i18n.js';
import { reminderMeta } from './core/reminder.js';
import { weeklyReview } from './core/review.js';
import { runTailor, fallbackPick } from './core/tailor.js';
import { aiErrorText } from './ui/dom.js';
import { parseChallenge, challengePrompt } from './core/share.js';
import { parseRateLink, parseAnswer, addFriendRating } from './core/friend.js';
import { dueReviews } from './core/spaced.js';
import en from './content/prompts.en.js';
import nl from './content/prompts.nl.js';
import { renderHome } from './ui/home.js';
import { renderRound } from './ui/round.js';
import { renderFeedback } from './ui/feedback.js';
import { renderDone } from './ui/done.js';
import { renderProgress } from './ui/progress.js';
import { renderSettings } from './ui/settings.js';
import { renderConversation } from './ui/conversation.js';
import { renderWelcome } from './ui/welcome.js';
import { renderRealweek } from './ui/realweek.js';
import { renderWeekly } from './ui/weekly.js';
import { renderFriendRate } from './ui/friendrate.js';
import { needsWeeklyReset, weekFocus, chooseFocus } from './core/weekly.js';
import { ownedDrills, maintenanceDrill } from './core/mastery.js';
import { loadModule } from './content/courses/index.js';
import { createCloud } from './core/cloud.js';
import { createSyncer, authReturn } from './core/syncer.js';
import { homeSubject } from './core/today.js';
import { renderLesson } from './ui/lesson.js';
import { renderDue } from './ui/due.js';
import { renderSituation } from './ui/situation.js';
import { renderGlossary } from './ui/glossary.js';

const SCREENS = {
  home: renderHome,
  round: renderRound,
  feedback: renderFeedback,
  done: renderDone,
  progress: renderProgress,
  realweek: renderRealweek,
  weekly: renderWeekly,
  settings: renderSettings,
  conversation: renderConversation,
  welcome: renderWelcome,
  friendrate: renderFriendRate,
  lesson: renderLesson,
  due: renderDue,
  situation: renderSituation,
  glossary: renderGlossary,
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
  // 'start' (the overview of all subjects), 'speak', 'eng' or 'pm'.
  get subject() { return homeSubject(this.state.ui); },
  setSubject(id, screen = 'home') {
    this.setState({ ...this.state, ui: { ...(this.state.ui || {}), subject: id } });
    this.go(screen);
  },
  modules: {}, // 'lang:moduleId' -> loaded module (promise), course bodies on demand
  moduleFails: {}, // 'lang:moduleId' -> failed loads so far
  openModule(subject, moduleId) {
    const key = `${this.lang}:${moduleId}`;
    if (!this.modules[key]) {
      const attempt = this.moduleFails[key] || 0;
      this.modules[key] = loadModule(subject, moduleId, this.lang, attempt).catch((err) => {
        delete this.modules[key];
        this.moduleFails[key] = attempt + 1;
        throw err;
      });
    }
    return this.modules[key];
  },
  startSayIt(subject, moduleId, lessonId) {
    return this.openModule(subject, moduleId).then((mod) => {
      const l = mod.lessons.find((x) => x.id === lessonId);
      if (!l) return this.go('home');
      this.session = null;
      return this.go('round', {
        prompt: { id: `course:${lessonId}`, drill: 'explain', body: l.sayIt, extra: { course: { subject, lessonId, terms: l.terms.map((x) => x.term) } }, seenIds: [] },
        modifier: null,
      });
    }).catch(() => this.toast(this.t('loadError')));
  },
  today() { return dayKey(new Date()); },

  setState(next, fromSync = false) {
    this.state = next;
    save(storage, next);
    writeMeta(next);
    // Signed-in devices push their changes a few seconds later.
    if (!fromSync && this.syncer && next.settings.syncOn) this.syncer.changed();
  },
  cloud: null,
  syncer: null,
  ensureCloud() {
    if (!this.cloud) {
      this.cloud = createCloud({ redirect: `${location.origin}${location.pathname}` });
      this.syncer = createSyncer({
        cloud: this.cloud,
        getState: () => this.state,
        setState: (s) => this.setState(s, true),
        // Signed out elsewhere or the session expired: say so, and show the sign-in form again.
        onAuthLost: () => {
          if (!this.state.settings.syncOn) return;
          this.updateSettings({ syncOn: false });
          this.toast(this.t('syncSignedOut'));
        },
      });
    }
    return this.cloud;
  },
  // Pull, merge and push; on the first success after a login link, sync is on.
  async startSync() {
    this.ensureCloud();
    const res = await this.syncer.syncNow();
    if (res.ok && !this.state.settings.syncOn) {
      this.updateSettings({ syncOn: true });
      this.toast(this.t('syncStarted'));
    }
    return res;
  },
  updateSettings(patch) {
    this.setState({ ...this.state, settings: { ...this.state.settings, ...patch } });
    document.documentElement.lang = this.lang;
    this.applyTheme();
  },
  // Light or dark forces a theme; auto (no attribute) follows prefers-color-scheme.
  applyTheme() {
    const th = this.state.settings.theme;
    const forced = th === 'light' || th === 'dark' ? th : null;
    if (forced) document.documentElement.dataset.theme = forced;
    else delete document.documentElement.dataset.theme;
    // The browser bar follows the canvas: beige in light, deep green in dark.
    for (const m of document.querySelectorAll('meta[name="theme-color"]')) {
      const dark = forced ? forced === 'dark' : /dark/.test(m.media || '');
      m.content = dark ? '#0B291B' : '#E8DFCA';
    }
  },
  reset() {
    this.setState(defaultState());
  },
  exportJson() {
    return storage.getItem(KEY) || JSON.stringify(this.state);
  },
  // Replaces progress with a backup file's contents; the old value is kept under KEY:backup.
  importJson(text) {
    const res = importBackup(storage, text);
    if (res.ok) {
      this.state = load(storage);
      writeMeta(this.state);
      document.documentElement.lang = this.lang;
      this.applyTheme();
    }
    return res;
  },

  startLesson() {
    const prompts = buildLesson(this.content, Math.random, this.state.seen, { history: this.state.history, due: this.dueReviews(), focus: weekFocus(this.state, new Date()), owned: ownedDrills(this.state.history), maintain: maintenanceDrill(this.state.history) });
    this.session = { prompts, index: 0, xp: 0, levelUp: false };
    this.go('round', { prompt: prompts[0] });
  },
  // Spaced re-attempts: up to three earlier prompts that are due today.
  dueReviews() {
    return dueReviews(this.state.reviews, this.today(), this.content, this.lang);
  },
  startReviews() {
    const prompts = this.dueReviews().slice(0, 3);
    if (!prompts.length) return this.go('home');
    this.session = { prompts, index: 0, xp: 0, levelUp: false };
    return this.go('round', { prompt: prompts[0] });
  },
  // Only a minute: one short round still keeps the day.
  startQuick() {
    this.session = null;
    this.go('round', { prompt: makePrompt('minute', this.content, Math.random, this.state.seen), timing: { prepS: 5, answerS: 60, questions: 1 } });
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
  // Small floating message that survives navigation.
  toast(text) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.textContent = text;
    document.body.append(el);
    setTimeout(() => el.classList.add('out'), 2200);
    setTimeout(() => el.remove(), 2700);
  },
  // Adds an applied round's result to the running lesson, if any.
  addToSession({ xp = 0, levelUp = false, newBests = [], newMilestones = [] } = {}) {
    if (!this.session) return;
    this.session.xp += xp;
    this.session.levelUp = this.session.levelUp || levelUp;
    this.session.highlights = [...(this.session.highlights || []), ...newBests];
    this.session.milestones = [...(this.session.milestones || []), ...newMilestones];
  },
  // Called by feedback after a round is applied.
  nextAfterRound(result) {
    const s = this.session;
    if (!s) return this.go('home');
    this.addToSession(result);
    s.index += 1;
    if (s.index < s.prompts.length) return this.go('round', { prompt: s.prompts[s.index] });
    const summary = { xp: s.xp, levelUp: s.levelUp, highlights: s.highlights || [], milestones: s.milestones || [] };
    this.session = null;
    return this.go('done', summary);
  },

  go(screen, params = {}) {
    this.navSeq += 1;
    if (screen === 'home') {
      this.challengeId = null; // "Reply" only right after the challenge itself
      if (needsWelcome(this.state)) screen = 'welcome';
      else if (needsWeeklyReset(this.state, new Date())) screen = 'weekly';
    }
    if (cleanup) {
      try { cleanup(); } catch { /* ignore */ }
    }
    cleanup = null;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    root.replaceChildren();
    root.dataset.screen = screen;
    let result;
    try {
      result = SCREENS[screen](app, params, root);
    } catch (err) {
      // The weekly screen sits in front of Home: never let it become a dead end.
      if (screen !== 'weekly') throw err;
      console.error(err);
      app.setState(chooseFocus(app.state, new Date(), null));
      root.replaceChildren();
      root.dataset.screen = 'home';
      result = SCREENS.home(app, {}, root);
    }
    if (typeof result === 'function') cleanup = result;
    // Move focus to the new screen's heading so screen readers announce it.
    const heading = root.querySelector('h1, .round-title');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      try { heading.focus({ preventScroll: true }); } catch { /* old browsers */ }
    }
    window.scrollTo(0, 0);
  },
};

document.documentElement.lang = app.lang;
app.applyTheme();

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  app.installPrompt = e;
  if (root.dataset.screen === 'settings') app.go('settings');
});

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// Cover missed days with streak freezes: at boot and whenever the installed
// app comes back to the foreground (Android keeps it alive across days).
function reconcileNow() {
  const r = reconcileStreak(app.state, app.today());
  app.broke = app.broke || r.broke;
  if (r.usedFreeze) {
    app.setState(r.state);
    app.toast(app.t('freezeUsed'));
  }
  return r;
}
reconcileNow();
// Sync: back from a login link, or a device that is already signed in.
{
  const back = authReturn(location.hash);
  if (back === 'error') {
    // An expired or already-used login link: nothing to sign in with.
    history.replaceState(null, '', location.pathname + location.search);
    app.toast(app.t('syncLinkExpired'));
  } else if (back === 'token' || app.state.settings.syncOn) {
    app.startSync().then((res) => {
      if (res.ok && root.dataset.screen === 'home') app.go('home');
      else if (!res.ok && back === 'token') app.toast(app.t('syncFailed'));
    });
  }
}
document.addEventListener('visibilitychange', () => {
  if (app.state.settings.syncOn && app.cloud) {
    if (document.visibilityState === 'hidden') app.cloud.push(app.state);
    else app.startSync();
  }
  if (document.visibilityState !== 'visible') return;
  const r = reconcileNow();
  if ((r.usedFreeze || r.broke) && root.dataset.screen === 'home') app.go('home');
});
// A challenge link (?c=drill.promptId.lang) opens that exact prompt.
// A rating link (?r=…) opens the friend's page; an answer link (?rr=…) stores his friend's rating.
{
  const ch = parseChallenge(location.search);
  const ask = parseRateLink(location.search);
  const answer = parseAnswer(location.search);
  const query = new URLSearchParams(location.search);
  const hasRate = query.has('r');
  const hasAnswer = query.has('rr');
  if (location.search) history.replaceState(null, '', location.pathname);
  const prompt = ch && challengePrompt(ch, ch.lang === 'en' ? en : nl);
  if (answer) {
    const next = addFriendRating(app.state, answer, Date.now());
    if (next !== app.state) {
      app.setState(next);
      app.toast(app.t('friendRated'));
    } else app.toast(app.t('friendUnknown'));
  } else if (hasAnswer) app.toast(app.t('friendUnknown'));
  if (hasRate) {
    // The friend needs no account: nothing is saved and onboarding stays as it was.
    const friendPrompt = ask && challengePrompt(ask, ask.lang === 'en' ? en : nl);
    app.go('friendrate', { ask, prompt: friendPrompt });
  } else if (prompt) {
    if (ch.lang !== app.lang) app.updateSettings({ lang: ch.lang });
    if (needsWelcome(app.state)) app.setState({ ...app.state, ui: { ...(app.state.ui || {}), pendingWelcome: true } });
    app.challengeId = prompt.id;
    app.go('round', { prompt, notice: app.t('challengeNotice'), modifier: null });
  } else {
    app.go(needsWelcome(app.state) ? 'welcome' : 'home');
  }
}
window.__app = app; // handy for debugging on device
