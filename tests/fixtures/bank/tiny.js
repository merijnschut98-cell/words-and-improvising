// A tiny example bank as a test fixture (v18 T1). Not real content: two topics,
// eight lessons, eight bank items (every kind), and a blueprint. The lessons hold
// only the text a source may quote (title, teach, example, terms).
export const meta = {
  id: 'tiny.mod', subject: 'tiny', level: 1,
  topics: [
    { id: 'alpha', levels: ['tiny.mod.a1', 'tiny.mod.a2', 'tiny.mod.a3', 'tiny.mod.a4'] },
    { id: 'beta', levels: ['tiny.mod.b1', 'tiny.mod.b2', 'tiny.mod.b3', 'tiny.mod.b4'] },
  ],
  lessons: ['tiny.mod.a1', 'tiny.mod.a2', 'tiny.mod.a3', 'tiny.mod.a4', 'tiny.mod.b1', 'tiny.mod.b2', 'tiny.mod.b3', 'tiny.mod.b4'],
};

const lesson = (id, lang) => ({
  id,
  title: lang === 'nl' ? `Les ${id}` : `Lesson ${id}`,
  teach: lang === 'nl'
    ? [`De wachtrij van ${id} groeit snel als de lijn bijna vol is.`, `Een buffer van ${id} vangt storingen op.`, `Meet eerst, pas daarna verbeter je ${id}.`]
    : [`The queue of ${id} grows fast when the line is almost full.`, `A buffer of ${id} absorbs disturbances.`, `Measure first, improve ${id} only after that.`],
  example: { kind: 'worked', text: lang === 'nl' ? `Voorbeeld bij ${id}: een lijn met 90 procent bezetting.` : `Example for ${id}: a line at 90 percent utilisation.` },
  terms: [{ term: lang === 'nl' ? `buffer ${id}` : `buffer ${id}`, def: lang === 'nl' ? `Een voorraad die storingen opvangt bij ${id}.` : `A stock that absorbs disturbances at ${id}.` }],
});

export const lessons = {
  en: meta.lessons.map((id) => lesson(id, 'en')),
  nl: meta.lessons.map((id) => lesson(id, 'nl')),
};

const q = (lang, id) => lessons[lang].find((l) => l.id === id).teach[0];
const src = (lang, id) => ({ lesson: id, quote: q(lang, id) });

const bank = (lang) => {
  const nl = lang === 'nl';
  return {
    items: [
      { id: 'b1', topic: 'alpha', level: 1, source: src(lang, 'tiny.mod.a1'), q: nl ? 'Wat gebeurt er met de wachtrij als de lijn bijna vol is?' : 'What happens to the queue when the line is almost full?',
        options: nl ? ['Hij groeit snel', 'Hij blijft gelijk', 'Hij krimpt', 'Hij verdwijnt'] : ['It grows fast', 'It stays equal', 'It shrinks', 'It disappears'], answer: nl ? 'Hij groeit snel' : 'It grows fast', why: nl ? 'Dicht bij 100 procent stapelt het werk zich op.' : 'Near 100 percent the work piles up.' },
      { id: 'b2', topic: 'alpha', level: 2, source: src(lang, 'tiny.mod.a2'), q: nl ? 'Een lijn draait op 90 procent. Hoeveel procent ruimte is er over?' : 'A line runs at 90 percent. How many percent of room is left?',
        number: 10, tolerance: 0.5, unit: '%', why: nl ? '100 min 90 is 10.' : '100 minus 90 is 10.' },
      { id: 'b3', kind: 'best', topic: 'alpha', level: 3, source: src(lang, 'tiny.mod.a3'), q: nl ? 'Wat is de beste eerste stap bij een volle lijn?' : 'What is the best first step on a full line?',
        options: nl ? ['Meten waar het werk wacht', 'Meer mensen inzetten', 'De klant bellen', 'Het schema herdrukken'] : ['Measure where the work waits', 'Add more people', 'Call the customer', 'Reprint the schedule'],
        answer: nl ? 'Meten waar het werk wacht' : 'Measure where the work waits', close: nl ? 'Meer mensen inzetten' : 'Add more people',
        why: nl ? 'Meten eerst; extra mensen kan daarna, maar zonder meting raad je.' : 'Measure first; extra people can follow, but without data you guess.' },
      { id: 'b4', kind: 'all', topic: 'alpha', level: 4, source: src(lang, 'tiny.mod.a4'), q: nl ? 'Welke maatregelen vangen storingen op? Vink alle juiste aan.' : 'Which measures absorb disturbances? Tick all that apply.',
        options: nl ? ['Een buffer', 'Reserveonderdelen', 'Een dikker rapport', 'Preventief onderhoud'] : ['A buffer', 'Spare parts', 'A thicker report', 'Preventive maintenance'],
        answers: nl ? ['Een buffer', 'Reserveonderdelen', 'Preventief onderhoud'] : ['A buffer', 'Spare parts', 'Preventive maintenance'], why: nl ? 'Een rapport vangt niets op.' : 'A report absorbs nothing.' },
      { id: 'b5', kind: 'gap', topic: 'beta', level: 1, source: src(lang, 'tiny.mod.b1'), q: nl ? 'Vul het ontbrekende woord in.' : 'Fill in the missing word.',
        text: nl ? 'Een ___ vangt storingen op.' : 'A ___ absorbs disturbances.', accept: nl ? ['buffer'] : ['buffer'], choices: null, why: nl ? 'De buffer is de voorraad die de storing opvangt.' : 'The buffer is the stock that absorbs the disturbance.' },
      { id: 'b6', kind: 'order', topic: 'beta', level: 2, source: src(lang, 'tiny.mod.b2'), q: nl ? 'Zet de stappen in volgorde.' : 'Put the steps in order.',
        items: nl ? ['Meten', 'Analyseren', 'Verbeteren'] : ['Measure', 'Analyse', 'Improve'], why: nl ? 'Eerst meten, dan pas verbeteren.' : 'Measure first, improve only after.' },
      { id: 'b7', kind: 'match', topic: 'beta', level: 3, source: src(lang, 'tiny.mod.b3'), q: nl ? 'Koppel elke situatie aan de maatregel.' : 'Match each situation to the measure.',
        pairs: nl ? [['Storing', 'Buffer'], ['Onbekende oorzaak', 'Meten'], ['Vol schema', 'Capaciteit erbij']] : [['Breakdown', 'Buffer'], ['Unknown cause', 'Measure'], ['Full schedule', 'Add capacity']],
        why: nl ? 'Elke maatregel past bij een eigen probleem.' : 'Each measure fits its own problem.' },
      { id: 'b8', topic: 'beta', level: 4, source: src(lang, 'tiny.mod.b4'), q: nl ? 'Wanneer verbeter je pas?' : 'When do you improve?',
        options: nl ? ['Na het meten', 'Voor het meten', 'Tijdens de lunch', 'Op goed geluk'] : ['After measuring', 'Before measuring', 'During lunch', 'At random'], answer: nl ? 'Na het meten' : 'After measuring', why: nl ? 'Eerst meten.' : 'Measure first.' },
    ],
  };
};

export const bankEn = bank('en');
export const bankNl = bank('nl');

const trap = (n, nl) => Array.from({ length: n }, (_, i) => (nl ? `Misvatting ${i + 1}` : `Misconception ${i + 1}`));
const entry = () => ({ aims: { nl: ['Herkent het begrip.'], en: ['Recognises the idea.'] }, traps: { nl: trap(3, true), en: trap(3, false) } });
const topic = () => ({ 1: entry(), 2: entry(), 3: entry(), 4: entry() });
export const blueprint = { module: 'tiny.mod', topics: { alpha: topic(), beta: topic() } };
