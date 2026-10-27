// Interruptions & hostile questions: a checklist on the answer he gave after
// being cut off. Speech-to-text has no punctuation, so "short" is a word
// count and the phrase checks look at the first and last few words. Pure.
import { tokenize } from './metrics.js';

const ACK = {
  en: ['fair', 'fair point', 'good point', 'good question', 'i hear', 'i understand', 'i get that', 'you are right', 'youre right', "you're right", 'thats fair', "that's fair", 'true', 'sure', 'yes', 'absolutely'],
  nl: ['terecht', 'goede vraag', 'goed punt', 'ik begrijp', 'begrijp ik', 'snap ik', 'ik snap', 'klopt', 'eerlijk', 'ja', 'zeker', 'inderdaad', 'helemaal waar'],
};
const CHECK_BACK = {
  en: ['what', 'how', 'why', 'which', 'does that', 'do you', 'is that', 'would that', 'makes sense', 'right', 'okay', 'ok', 'agreed', 'fair enough'],
  nl: ['wat', 'hoe', 'waarom', 'welke', 'klopt dat', 'toch', 'snap je', 'is dat', 'helpt dat', 'past dat', 'oké', 'oke', 'akkoord', 'kun je daarmee'],
};
const SHORT_MAX = 60;

const hasPhrase = (words, list) => {
  const text = ` ${words.join(' ')} `;
  return list.some((p) => text.includes(` ${p} `));
};

export function pressureChecks(answer, lang) {
  const L = lang === 'en' ? 'en' : 'nl';
  const toks = tokenize(answer || '');
  if (!toks.length) return { acknowledged: false, short: false, checkedBack: false };
  return {
    acknowledged: hasPhrase(toks.slice(0, 4), ACK[L]),
    short: toks.length <= SHORT_MAX,
    checkedBack: hasPhrase(toks.slice(-8), CHECK_BACK[L]),
  };
}
