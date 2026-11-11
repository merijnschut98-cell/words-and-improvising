// Pure parts of the film player: caption markers, number formats, the speak
// variant, the timeline, beats, the narration hold and the page parameters.
// No imports and no DOM: the build inlines this file into every film page (with
// its `export` words stripped), and tests/film.test.js imports it as it is.

export const wordsOf = (text) => String(text || '').trim().split(/\s+/).filter(Boolean).length;

// A scene lasts at least (caption words / 2.5) + 2 s, so it can be read.
export const minSceneDur = (words) => words / 2.5 + 2;

// "De {t:Snijsnelheid} is {n:220} m/min" → text, term and number pieces.
// {t:Term|shown} names lesson term Term but shows "shown" (another form).
export function parseMarked(src) {
  const out = [];
  const re = /\{([a-z]):([^{}]*)\}/g;
  let last = 0;
  let m;
  const plain = (s) => {
    if (/[{}]/.test(s)) throw new Error(`bad marker in "${src}"`);
    if (s) out.push({ text: s });
  };
  while ((m = re.exec(src))) {
    plain(src.slice(last, m.index));
    if (m[1] === 't') {
      const [term, shown] = m[2].split('|');
      out.push({ term: term.trim(), shown: (shown ?? term).trim() });
    } else if (m[1] === 'n') out.push({ num: m[2].trim() });
    else throw new Error(`bad marker {${m[1]}:} in "${src}"`);
    last = re.lastIndex;
  }
  plain(src.slice(last));
  return out;
}

// "1167" → 1.167 (nl) or 1,167 (en); "0.3" → 0,3 or 0.3. Decimals as written.
export function formatNumber(raw, lang) {
  const s = String(raw);
  if (!/^-?\d+(\.\d+)?$/.test(s)) throw new Error(`not a plain number: ${s}`);
  const [int, dec] = s.split('.');
  const group = lang === 'en' ? ',' : '.';
  const point = lang === 'en' ? '.' : ',';
  const body = int.replace(/^-/, '');
  const grouped = body.length >= 4 ? body.replace(/\B(?=(\d{3})+(?!\d))/g, group) : body;
  return (int.startsWith('-') ? '-' : '') + grouped + (dec !== undefined ? point + dec : '');
}

// A resolved caption is a list of strings and term pieces {t, en?, c}. In Dutch
// a term carries its English word (en) on first use only.
export const plainOf = (seg) => seg.map((p) => (typeof p === 'string' ? p : p.t + (p.en ? ` (${p.en})` : ''))).join('');
// Units and signs a voice would spell out or skip, said as words. Longest first.
// Also for Piper (espeak-ng reads "6,0" as "zes komma nul" and "€8,67" badly).
const SAY = {
  // 1.167 is "elfhonderdzevenenzestig" (espeak-ng says "duizend honderd zevenenzestig")
  nl: [[/\b([1-9])\.([1-9])(\d\d)\b/g, (m, a, b, cd) => `${a}${b}honderd${cd === '00' ? '' : ` ${Number(cd)}`}`],
    [/omw\/min/g, 'omwentelingen per minuut'], [/\bmm\/min\b/g, 'millimeter per minuut'], [/\bm\/min\b/g, 'meter per minuut'], [/µm\b/g, 'micrometer'], [/\brpm\b/g, 'omwentelingen per minuut'],
    [/€\s?(\d[\d.]*(?:,\d+)?)/g, '$1 euro'], [/(\d),0(?![\d])/g, '$1'], [/(\d)\s?mm\b/g, '$1 millimeter'], [/(\d)\s?min\b/g, '$1 minuten'], [/(\d)\s?%/g, '$1 procent'],
    [/Ø\s*/g, 'diameter '], [/(\d)\+(\d)/g, '$1 plus $2'], [/\s×\s/g, ' maal '], [/\s\/\s/g, ' gedeeld door '], [/\s=\s/g, ' is '], [/°/g, ' graden'], [/\bRa\b/g, 'R a'], [/’/g, "'"],
    // acronym pairs (MIG/MAG, IQ/OQ/PQ) without the slash, t8/5, and a standard's number in parts
    [/\b([A-Z]{2,})\/(?=[A-Z]{2,}\b)/g, '$1 '], [/\bt8\/5\b/g, 't 8 5'], [/\bISO (\d\d)(\d\d)-(\d)\b/g, 'ISO $1 $2 deel $3'],
    // the weld standards as said on the floor (ISO 58 17, not "vijfduizend..."), the execution
    // classes as letters, and the ISO 6520-1 code 401 digit by digit; only these, so ISO 9001 stays
    [/\bISO (5817|9712)\b/g, (m, n) => `ISO ${n.slice(0, 2)} ${n.slice(2)}`], [/\bEXC([1-4])\b/g, 'E X C $1'], [/\b401\b/g, 'vier nul één'],
    // MIG, MAG and TIG on their own as letters, like MAG-lassen (espeak-ng reads MAG as the verb "mag")
    [/\b(MIG|MAG|TIG)\b(?!-)/g, (m) => m.split('').join(' ')],
    // DOE (design of experiments) as letters in both languages, not the Dutch verb "doe" or the English "doe"
    [/\bDOE\b/g, 'D O E'],
    // PFMEA as letters (espeak-ng says "pfmeea" in Dutch and drops the A in English)
    [/\bPFMEA\b/g, 'P F M E A'],
    // the go/no-go gauge and gauge R&R without "slash" or "ampersand": gaat, gaat niet; R en R
    [/\b([Gg])aat\/gaat-niet\b/g, '$1aat, gaat niet'], [/\bR&R\b/g, 'R en R'],
    // I/O without "slash"; OEE, MES and HMI as letters (espeak-ng says "oe", the word "mes", "hmie"); CE needs
    // nothing: espeak-ng already spells it in CE-markering. But a lone S with a word after it ("M E S in", "M E
    // S-leverancier") is read as a bare hiss, the clitic 's (phon.py, 2026-11-11): there MES is "em ee es"
    [/\bI\/O\b/g, 'I O'], [/\bOEE\b/g, 'O E E'], [/\bMES(?=[\s-]+[\p{L}\p{N}])/gu, 'em ee es'], [/\bMES\b/g, 'M E S'], [/\bHMI\b/g, 'H M I'],
    // CILT (clean, inspect, lubricate, tighten) as letters: espeak-ng reads it as the word "silt"
    [/\bCILT\b/g, 'C I L T'],
    // English robot words in a Dutch sentence as the floor says them (espeak-ng reads "pajlo-at", "te-ach", "tolling", French "vision")
    [/\b([Pp])ayload/g, '$1ee-lood'], [/\b([Tt])each pendant\b/g, '$1ietsj pendant'], [/\btooling\b/g, 'toeling'], [/\b([Vv])ision\b/g, '$1izjun'],
    // espeak-ng reads "miksed-model", "heijunka" with the u of "bus", and drops the pr of "robotprogramma's"
    [/\b([Mm])ixed-model\b/g, '$1ikst moddul'], [/\b([Hh])eijunka/g, '$1eijoenka'], [/\b([Rr])obotprogramma/g, '$1obot-programma'],
    // the machine states and the Pareto chart (espeak-ng reads "star-vet", "blok-ket", and stresses "PA-re-to-diagram";
    // the texts write pareto-diagram since 2026-11-11, which it stresses right, pa-RE-to, and needs no rule)
    [/\b([Ss])tarved\b/g, '$1taarft'], [/\b([Bb])locked\b/g, '$1lokt'], [/\b([Pp])aretodiagram/g, '$1areto-diagram'],
    // the range of a subgroup as the floor says it (espeak-ng reads the Dutch "rang-e"), and slijtagecompensatie
    // with its parts apart (espeak-ng reads "slijtaaɣee" in the compound; "slijtage" alone is right)
    [/\b([Rr])ange\b/g, '$1eenzj'], [/\b([Ss])lijtagecompensatie/g, '$1lijtage-compensatie'],
    // ISO 2768 as "ISO 27 68" (espeak-ng says "tweeduizend zevenhonderd ...")
    [/\bISO 2768\b/g, 'ISO 27 68'],
    // the Weibull shape factor: espeak-ng reads "bèta" as "be-TAA" with a schwa; said as "beeta"
    [/\b([Bb])èta\b/g, '$1eeta'],
    // espeak-ng stresses "hoofdschaKElaar" (with the e of "bed") and "veiligheidsreGELS": split, each part
    // keeps its own stress and vowels (HOOFD-SCHAkelaar, VEILigheids-REgels)
    [/\b([Hh])oofdschakelaar/g, '$1oofd-schakelaar'], [/\b([Vv])eiligheidsregels\b/g, '$1eiligheids-regels'],
    // the motor efficiency classes as letters (espeak-ng reads "IE3" with the vowel of "die": "ie drie"), and
    // typeplaatje, isolatieklasse and draaistroom with their parts apart (espeak-ng reads "tipɛplaatje", stresses
    // "Isolatieklasse" with a t for ts, and "draaiSTROOM"; split, each part keeps its own reading)
    [/\bIE([1-5])\b/g, 'I-E $1'], [/\b([Tt])ypeplaatje/g, '$1iepe-plaatje'], [/\b([Ii])solatieklasse/g, '$1solatie-klasse'],
    [/\b([Dd])raaistroom/g, '$1raai-stroom'],
    // steel grades with the letter said as "es" (espeak-ng gives a bare hiss for the S in S235; capital at a
    // sentence start, so the sentence still ends before it), and compounds espeak-ng stresses at the end
    // (kerfslagPROEF, Elasticiteitsmodulus): split at the head
    [/(^|[.!?]\s+)S(235|275|355)\b/g, '$1Es $2'], [/\bS(235|275|355)\b/g, 'es $1'],
    [/\b([Kk])erfslagproef/g, '$1erfslag-proef'], [/\b([Ee])lasticiteitsmodulus/g, '$1lasticiteits-modulus'],
    // trekproef the same way (espeak-ng stresses trekPROEF): TREK-proef
    [/\b([Tt])rekproef/g, '$1rek-proef'],
    // LMRA and VCA as letters (espeak-ng reads the words "lmraa" and "vkaa"), Piper Alpha as its English name
    // (espeak-ng gives the Dutch i of "pieper" and a p-h in "alpha"), and compounds espeak-ng stresses or voices
    // wrong: blusDEken with a z, gasmEting with a schwa, dienstWISsel, dakventiLAtor, KONtroleekamer, stopreGEL;
    // split, each part keeps its own reading
    [/\bLMRA\b/g, 'L M R A'], [/\bVCA\b/g, 'V C A'], [/\bPiper Alpha\b/g, 'Paiper Alfa'],
    [/\b([Bb])lusdeken/g, '$1lus-deken'], [/\b([Gg])asmeting/g, '$1as-meting'], [/\b([Dd])ienstwissel/g, '$1ienst-wissel'],
    [/\b([Dd])akventilator/g, '$1ak-ventilator'], [/\b([Cc])ontrolekamer/g, '$1ontrole-kamer'], [/\b([Ss])topregel/g, '$1top-regel'],
    // hydraulics: espeak-ng stresses the valve compounds on "-tiel" (stuurvenTIEL), cilindersnelheid on "snel"
    // (cilinderbenutting, in the moulding machine film, on "CI-" with the e of "bed"; split, so "cilinder" gets
    // its lexicon entry, ci-LIN-der),
    // reads zuigeroppervlak as "zuigiir-oppervlak"
    // and reads injectieletsel as "INjektie-letsel"; split at the head (STUUR-venTIEL, in-JECtie-LETsel),
    // and ISO 4406 as the floor says it, "ISO 44 06" (as ISO 2768)
    [/\b([Ss])tuurventiel/g, '$1tuur-ventiel'], [/\b([Ss])moorventiel/g, '$1moor-ventiel'], [/\b([Dd])rukbegrenzingsventiel/g, '$1rukbegrenzings-ventiel'],
    [/\b([Cc])ilindersnelheid/g, '$1ilinder-snelheid'], [/\b([Cc])ilinderbenutting/g, '$1ilinder-benutting'], [/\b([Zz])uigeroppervlak/g, '$1uiger-oppervlak'], [/\b([Ii])njectieletsel/g, '$1n-jectie-letsel'], [/\bISO 4406\b/g, 'ISO 44 06'],
    // drives: espeak-ng stresses the singular magneetschakelaar and the -regelaar compounds on "-ke-"/"-ge-"
    // with the e of "bed" (frequentieregeLAAR); split at the head (frequentie-REgelaar). It stresses
    // "DIrect" in direct inschakelen (only there: "direct na elkaar" in other films stays), said as the
    // floor says it, "d'rect"; and harmonischen with "sch" as in "school", said "harmonische" (-ise)
    [/\b([Mm])agneetschakelaar\b/g, '$1agneet-schakelaar'], [/\b([Ff])requentieregelaar/g, '$1requentie-regelaar'], [/\b([Ss])ervoregelaar/g, '$1ervo-regelaar'],
    [/\b([Dd])irect (?=in(?:schakel|geschakeld))/g, '$1e-rekt '], [/\b([Hh])armonischen\b/g, '$1armonische'],
    // fatigue: espeak-ng reads Wöhler with the o of "bot" and a sounded h (said "Weuler"), stresses
    // lastwisSEEling, puts a schwa in vermoeiingsgrens, and stresses kogelSTRAlen and lasTEEN; split at the head
    [/Wöhler/g, 'Weuler'], [/\b([Ll])astwisseling/g, '$1ast-wisseling'], [/\b([Vv])ermoeiingsgrens/g, '$1ermoeiings-grens'],
    [/\b([Kk])ogelstralen\b/g, '$1ogel-stralen'], [/\b([Ll])asteen\b/g, '$1as-teen'],
    // process plant: English words in a Dutch sentence as the floor says them (espeak-ng reads "batx" with the g of
    // "lachen", "uunit oopiraasjon", stresses "KOrioliss" and "KONtinu", and sounds the h in ohm): betsj
    // (betsj- in compounds: batchproces, batchnummer), joenit oppe-reesjen, kori-olis (KO-ri-O-lis; "korie-olis"
    // stressed the ie), konti-nu (continue as konti-nuwe), oom
    [/\b([Bb])atch(\p{L}?)/gu, (m, b, l) => `${b}etsj${l ? `-${l}` : ''}`],
    [/\b([Uu])nit operation(s?)\b/g, (m, u, s) => `${u === 'U' ? 'J' : 'j'}oenit oppe-reesjen${s}`],
    [/\b([Cc])oriolis/g, (m, c) => (c === 'C' ? 'Kori-olis' : 'kori-olis')], [/\bohm\b/g, 'oom'],
    [/\b([Cc])ontinue\b/g, (m, c) => (c === 'C' ? 'Konti-nuwe' : 'konti-nuwe')], [/\b([Cc])ontinu\b/g, (m, c) => (c === 'C' ? 'Konti-nu' : 'konti-nu')],
    // measuring the process variables: espeak-ng reads psi as one hiss ("psie"), FDA as "vdaa", stresses
    // thermokopPEL, drops the h in toezichthouders and reads magnetisch-inductieve as "INduktieve"; said
    // pee-es-ie, ef-dee-aa, thermo-koppel, toezicht-houders, magnetisch in-duktieve (only after "magnetisch",
    // so the inductieve sensor of eng.lines.errorproof keeps its reading); it also stresses DEbietmeter and
    // drops the h in heethoudbuis (debiet-meter, heet-houdbuis)
    [/\b([Dd])ebietmeter/g, '$1ebiet-meter'], [/\b([Hh])eethoudbuis/g, '$1eet-houdbuis'],
    [/\bpsi\b/g, 'pee-es-ie'], [/\bFDA\b/g, 'ef-dee-aa'], [/\b([Tt])hermokoppel/g, '$1hermo-koppel'], [/\b([Tt])oezichthouder/g, '$1oezicht-houder'],
    [/\b([Mm])agnetisch-inductie(ve|f)\b/g, '$1agnetisch in-duktie$2'],
    // heat treatment: espeak-ng stresses BRInell and PIramide (said Brie-NEL, pira-MIE-de), drops the h in
    // inzetharden, reads inductieharden as "INduktie-harden", and stresses warmtebehandeling (-be-HAN-deling
    // read "bee-han-DEE-ling"), tandwielen (tandWIElen), polymeeroplossing (POlymeer) and diktesprong (with
    // the e of "bed") wrong; split at the head, each part keeps its own reading
    [/\bBrinell\b/g, 'Brienel'], [/\b([Pp])iramide/g, '$1iramiede'], [/\b([Ii])nzetharden/g, '$1nzet-harden'], [/\b([Ii])nductieharden/g, '$1nductie-harden'],
    [/\b([Ww])armtebehandeling/g, '$1armte-behandeling'], [/\b([Tt])andwielen\b/g, '$1and-wielen'], [/\b([Pp])olymeeroplossing/g, '$1olymeer-oplossing'], [/\b([Dd])iktesprong/g, '$1ikte-sprong'],
    // grid: espeak-ng stresses the head of wisselSTROOM, gelijkSTROOM, netstaSJON and laadPAAL; split, each part
    // keeps its own stress (WISsel-STROOM, NET-staSJON, LAAD-PAAL)
    [/\b([Ww])isselstroom/g, '$1issel-stroom'], [/\b([Gg])elijkstroom/g, '$1elijk-stroom'], [/\b([Nn])etstation/g, '$1et-station'],
    [/\b([Ll])aadpa(al|len)\b/g, '$1aad-pa$2'],
    // switchgear: espeak-ng stresses the singular vermogensschakelaar and aardingsschakelaar on "-ke-" with the
    // e of "bed" (as magneetschakelaar; the plurals are read right) and kortsluitvermogen on "-mo-"; split at
    // the head (verMOgens-SCHAkelaar, KORTsluit-vermogen). RMU as letters (espeak-ng reads the word "rmu")
    [/\b([Vv])ermogensschakelaar\b/g, '$1ermogens-schakelaar'], [/\b([Aa])ardingsschakelaar\b/g, '$1ardings-schakelaar'],
    [/\b([Kk])ortsluitvermogen\b/g, '$1ortsluit-vermogen'], [/\bRMU\b/g, 'R M U'],
    // and vrijschakelen, the first safety rule, stressed on "-ke-" with a long e: VRIJ-schakelen
    [/\b([Vv])rijschakelen\b/g, '$1rij-schakelen'],
    // and schakelstation and klantstation, said like netstation above (SCHAkel-staSJON, KLANT-staSJON)
    [/\b([Ss])chakelstation/g, '$1chakel-station'], [/\b([Kk])lantstation/g, '$1lant-station'],
    // IT/OT: espeak-ng reads Purdue as "pur-du-e" (said as the floor says it, "Pur-djoe"), firewall as "fie-re-wal"
    // (said "fajerwol", with "regels" apart, else it stresses "re-GELS"), historian as "HIStoorian" and conduits
    // with the Dutch ui (said "his-toorjen", "kondjoe-its"); and it stresses the head of functieMOdel (with "kti"),
    // PROductieorder, stamDAta and tijdSCHAAL: split, each part keeps its own reading
    [/\bPurdue\b/g, 'Pur-djoe'], [/\b([Ff])irewallregels\b/g, '$1ajerwol regels'], [/\b([Ff])irewall(s?)\b/g, '$1ajerwol$2'],
    [/\bhistorian\b/g, 'his-toorjen'], [/\bconduits\b/g, 'kondjoe-its'],
    [/\b([Ff])unctiemodel/g, '$1unctie-model'], [/\b([Pp])roductieorder/g, '$1roductie-order'], [/\b([Ss])tamdata\b/g, '$1tam-data'], [/\b([Tt])ijdschaal\b/g, '$1ijd-schaal'],
    // the order flow: espeak-ng reads goederenontvangst as "goe-dier-een-ontvangst"; split, each part keeps its reading
    [/\b([Gg])oederenontvangst/g, '$1oederen-ontvangst']],
  en: [[/\brpm\b/g, 'revolutions per minute'], [/\bmm\/min\b/g, 'millimetres per minute'], [/\bm\/min\b/g, 'metres per minute'], [/µm\b/g, 'micrometres'],
    [/€\s?(\d[\d,]*(?:\.\d+)?)/g, '$1 euros'], [/(\d)\.0(?![\d])/g, '$1'], [/(\d)\s?mm\b/g, '$1 millimetres'], [/(\d)\s?min\b/g, '$1 minutes'], [/(\d)\s?%/g, '$1 percent'],
    [/Ø\s*/g, 'diameter '], [/(\d)\+(\d)/g, '$1 plus $2'], [/\s×\s/g, ' times '], [/\s\/\s/g, ' divided by '], [/\s=\s/g, ' is '], [/°/g, ' degrees'], [/\bRa\b/g, 'R a'], [/’/g, "'"],
    [/\b([A-Z]{2,})\/(?=[A-Z]{2,}\b)/g, '$1 '], [/\bt8\/5\b/g, 't 8 5'], [/\bISO (\d\d)(\d\d)-(\d)\b/g, 'ISO $1 $2 part $3'],
    [/\bISO (5817|9712)\b/g, (m, n) => `ISO ${n.slice(0, 2)} ${n.slice(2)}`], [/\bEXC([1-4])\b/g, 'E X C $1'], [/\b401\b/g, 'four oh one'],
    [/\bDOE\b/g, 'D O E'], [/\bPFMEA\b/g, 'P F M E A'],
    [/\b([Gg])o\/no-go\b/g, '$1o, no-go'], [/\bR&R\b/g, 'R and R'],
    [/\bI\/O\b/g, 'I O'], [/\bOEE\b/g, 'O E E'], [/\bMES\b/g, 'M E S'], [/\bISO 2768\b/g, 'ISO 27 68'],
    // CILT as letters here too: espeak-ng's English reads it as the word "silt"
    [/\bCILT\b/g, 'C I L T']],
};
export const sayable = (text, lang) => (SAY[lang] || []).reduce((s, [re, w]) => s.replace(re, w), text);
// The words the voice says: no English gloss, and with a language, units as words.
export const speakOf = (seg, lang) => sayable(seg.map((p) => (typeof p === 'string' ? p : p.t)).join(''), lang).replace(/\s+/g, ' ').trim();
// What is said, as written (no gloss, units kept): the subtitles of the video.
export const saidOf = (seg) => seg.map((p) => (typeof p === 'string' ? p : p.t)).join('').replace(/\s+/g, ' ').trim();

// v14b, the timeline driven by the narration audio. durs[scene][beat] is the
// length of each beat's recorded line (s). Each scene opens with a short look
// before the first line (the film itself with a longer lead), lines follow with
// a breath in between, and a scene holds a moment after its last line.
// The pauses of the narration, all in one place (seconds). Each sentence is one
// Piper clip (films/_kit/narrate.mjs), commas inside: the voice makes its own
// comma pause and keeps the sentence melody. Piper's own edge silence is
// trimmed to about 40 ms (films/_kit/speak.py), so these are the pauses heard:
// sentence after a full stop, beat between two lines, hold at a scene's end.
// The listen guard (films/_kit/listen-guard.mjs) checks them on the render.
export const PAUSES = { sentence: 0.6, beat: 0.9, hold: 0.8 };
export const AUDIO_GAPS = { lead: 0.8, look: 0.4, gap: PAUSES.beat, hold: PAUSES.hold, tail: 1.6 };
export function audioTimeline(durs, gaps = AUDIO_GAPS) {
  const g = { ...AUDIO_GAPS, ...gaps };
  const scenes = [];
  let t = 0;
  durs.forEach((beats, si) => {
    const start = t;
    let at = start + (si === 0 ? g.lead : g.look);
    const out = beats.map((d, bi) => {
      if (!(d > 0)) throw new Error(`scene ${si + 1} beat ${bi + 1}: no audio`);
      const b = { start: round3(at), dur: round3(d) };
      at += d + (bi + 1 < beats.length ? g.gap : 0);
      return b;
    });
    t = round3(at + (si + 1 < durs.length ? g.hold : g.tail));
    scenes.push({ start: round3(start), dur: round3(t - start), beats: out });
  });
  return { scenes, total: t };
}
const round3 = (x) => Math.round(x * 1000) / 1000;

// Where time t falls on an audio timeline: the scene, the beat on screen (the
// last one started; the first while the scene opens) and the scene's progress u.
export function timedAt(t, atl) {
  const sc = atl.scenes;
  let si = 0;
  for (let k = 0; k < sc.length; k++) if (t >= sc[k].start) si = k;
  const s = sc[si];
  let bi = 0;
  for (let k = 0; k < s.beats.length; k++) if (t >= s.beats[k].start) bi = k;
  const u = Math.min(1, Math.max(0, (t - s.start) / s.dur));
  return { si, bi, u };
}

export function timelineOf(scenes) {
  const starts = [];
  let t = 0;
  for (const s of scenes) { starts.push(t); t += s.dur; }
  return { starts, total: t };
}

export function sceneIndexAt(t, tl) {
  let i = 0;
  for (let k = 0; k < tl.starts.length; k++) if (t >= tl.starts[k]) i = k;
  return i;
}

// ?scene=n is 1-based; anything odd opens the first scene.
export function clampScene(param, count) {
  const n = parseInt(param, 10);
  if (!Number.isFinite(n) || n < 1) return 0;
  return Math.min(count, n) - 1;
}

// Beat starts within a scene (seconds), by each beat's share of the words.
export function beatStarts(scene, lang) {
  const counts = scene.beats.map((b) => Math.max(1, wordsOf(b.text[lang] ?? b.text.nl)));
  const all = counts.reduce((a, b) => a + b, 0);
  const out = [];
  let acc = 0;
  for (const c of counts) { out.push(Math.round((acc / all) * scene.dur * 100) / 100); acc += c; }
  return out;
}

export function beatIndexAt(scene, lang, local) {
  const starts = beatStarts(scene, lang);
  let i = 0;
  for (let k = 0; k < starts.length; k++) if (local >= starts[k]) i = k;
  return i;
}

// While a beat is being spoken the clock may run up to the next beat, or to the
// end of the scene for the last beat, and then holds there.
export function holdLimit(tl, scenes, lang, sceneIndex, beatIndex) {
  const scene = scenes[sceneIndex];
  const starts = beatStarts(scene, lang);
  const local = beatIndex + 1 < starts.length ? starts[beatIndex + 1] : scene.dur;
  return tl.starts[sceneIndex] + local;
}

// The page's parameters: from its URL when opened on its own, else from the
// frame's name. The app hands the page over as srcdoc (a sandboxed frame's own
// navigation skips the service worker, so a src would be blank offline) and
// puts "?theme=…&lang=…" in the iframe's name attribute.
export const searchOf = (search, name) => (search && search.length > 1 ? search
  : typeof name === 'string' && name.charAt(0) === '?' ? name : '');

export function parseParams(search) {
  const q = new URLSearchParams(search || '');
  const theme = q.get('theme');
  const level = parseInt(q.get('level'), 10);
  return {
    theme: theme === 'light' || theme === 'dark' ? theme : null,
    lang: q.get('lang') === 'en' ? 'en' : 'nl',
    scene: q.get('scene'),
    reduce: q.get('motion') === 'reduce',
    muted: q.get('muted') === '1',
    level: [1, 2, 3, 4].includes(level) ? level : null,
    render: q.get('render') === '1',
  };
}

export function fmtClock(sec) {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// Calm ease-in-out, and the eased progress of u through [a, b].
export const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const span = (u, a, b) => ease(Math.min(1, Math.max(0, (u - a) / (b - a))));
