// Pure parts of the film player: caption markers, number formats, the speak
// variant, the timeline, beats, the narration hold and the page parameters.
// No imports and no DOM: the build inlines this file into every film page (with
// its `export` words stripped), and tests/film.test.js imports it as it is.
// The part between the build-only markers (caption markers, numbers, the SAY
// table and the speak variants) runs only at build time: the page's film data
// already carries the resolved captions and voice/speak strings, so the page
// inlines everything except that part (runtimeTimeline in films/_kit/player.mjs).
// Keep runtime code out of it, and build-only code in it.

export const wordsOf = (text) => String(text || '').trim().split(/\s+/).filter(Boolean).length;

// build-only:start
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
    // and sleutelstation (espeak-ng reads "-tɛl-" with the e of "bed"; said SLEUtel-staSJON) and foutstroom
    // (stressed on "stroom"; said FOUT-STROOM), for eng.switchgear.automation
    [/\b([Ss])leutelstation/g, '$1leutel-station'], [/\b([Ff])outstroom/g, '$1out-stroom'],
    // outages: espeak-ng drops "-burige" in naburige (it says "naa-e") and stresses vrijgeschakeld(e) on "-GE-"
    // with the e of "bed"; said na-burige and vrij-geschakeld, each part with its own reading
    [/\b([Nn])aburige\b/g, '$1a-burige'], [/\b([Vv])rijgeschakeld/g, '$1rij-geschakeld'],
    // IT/OT: espeak-ng reads Purdue as "pur-du-e" (said as the floor says it, "Pur-djoe"), firewall as "fie-re-wal"
    // (said "fajerwol", with "regels" apart, else it stresses "re-GELS"), historian as "HIStoorian" and conduits
    // with the Dutch ui (said "his-toorjen", "kondjoe-its"); and it stresses the head of functieMOdel (with "kti"),
    // PROductieorder, stamDAta and tijdSCHAAL: split, each part keeps its own reading
    [/\bPurdue\b/g, 'Pur-djoe'], [/\b([Ff])irewallregels\b/g, '$1ajerwol regels'], [/\b([Ff])irewall(s?)\b/g, '$1ajerwol$2'],
    [/\bhistorian\b/g, 'his-toorjen'], [/\bconduits\b/g, 'kondjoe-its'],
    [/\b([Ff])unctiemodel/g, '$1unctie-model'], [/\b([Pp])roductieorder/g, '$1roductie-order'], [/\b([Ss])tamdata\b/g, '$1tam-data'], [/\b([Tt])ijdschaal\b/g, '$1ijd-schaal'],
    // the order flow: espeak-ng reads goederenontvangst as "goe-dier-een-ontvangst"; split, each part keeps its reading
    [/\b([Gg])oederenontvangst/g, '$1oederen-ontvangst'],
    // and, like productieorder, it stresses PROductieplanning and PROductieprestaties (with "kti"): split, so
    // both are said pro-DUC-tie (this changes eng.ot.isa95's voice, which had no rendered video yet)
    [/\b([Pp])roductie(planning|prestaties)/g, '$1roductie-$2'],
    // congestion and roles (eng.gridbasics.congestion): ACM as letters (espeak-ng reads the word "akm") and
    // TenneT as one word (it reads "Tenne T"); energiewet, capaciteitskaart, energieleverancier and piekuren split at the head (espeak-ng
    // stresses "E-nergiewet", "KA-paciteitskaart", "energieleveranCIER" and "pie-KUUR-en"); and the grid's
    // "de/een wachtrij", stressed "wacht-RIJ", said WACHT-rij (only after de or een, so the lines film's
    // "kleine wachtrij" and "wachtrijen" stay as they are)
    [/\bACM\b/g, 'A C M'], [/\bTenneT\b/g, 'Tennet'], [/\b([Ee])nergiewet/g, '$1nergie-wet'], [/\b([Cc])apaciteitskaart/g, '$1apaciteits-kaart'],
    [/\b([Ee])nergieleverancier/g, '$1nergie-leverancier'], [/\b([Pp])iekuren\b/g, '$1iek-uren'], [/\b([Dd]e|[Ee]en) wachtrij\b/g, '$1 wacht-rij'],
    // and congestiemanagement, stressed "KON-gestiemanagement": split, so it is said con-GES-tie-management
    [/\b([Cc])ongestiemanagement/g, '$1ongestie-management'],
    // compressed air (eng.power.air): espeak-ng stresses oliene-VEL-aar (with the e of "bed"), verzorgings-EEN-heid,
    // warmte-TEE-rugwinning (with a long e) and reads toerenregeling as "toer-en-regeling"; split at the head, each
    // part keeps its own reading (OLie-NEvelaar, verZORgings-eenheid, warmte-teRUGwinning, TOEren-REgeling). And
    // booster as the floor says it, "boester" (espeak-ng reads the Dutch oo).
    [/\b([Oo])lienevel/g, '$1lie-nevel'], [/\b([Vv])erzorgingseenheid/g, '$1erzorgings-eenheid'], [/\b([Ww])armteterugwinning/g, '$1armte-terugwinning'],
    [/\b([Tt])oerenregeling/g, '$1oeren-regeling'], [/\b([Bb])ooster/g, '$1oester'],
    // batch capacity (eng.process.batch): espeak-ng reads CIP as the word "sip" (said as letters, C I P), inline
    // as "in-lie-ne" (said "inlain"), stresses VIScositeitsmeter, vrijGAve, ploegWISsel, besturingsSYSteem and
    // spoedmoMENT, and reads labuitslag with the long a of "laaf"; split at the head, each part keeps its reading
    [/\bCIP\b/g, 'C I P'], [/\binline\b/g, 'inlain'], [/\b([Vv])iscositeitsmeter/g, '$1iscositeits-meter'], [/\bQC-vrijgave\b/g, 'QC-vrij-gave'],
    [/\b([Pp])loegwissel/g, '$1loeg-wissel'], [/\b([Bb])esturingssysteem/g, '$1esturings-systeem'], [/\b([Ss])poedmoment/g, '$1poed-moment'], [/\b([Ll])abuitslag/g, '$1ab-uitslag'],
    // load flow and N-1 (eng.gridplanning.loadflow): loadflow as the floor says it, "loodflo" (espeak-ng reads
    // "lo-ad-flow"; in a compound "loodflo-"), N-1 as "N min één" (espeak-ng drops the minus: "N één"),
    // vluchtstrook and Netcode split at the head (espeak-ng stresses vluchtSTROOK and netCOde), and EN 50160
    // as "E N vijftig honderdzestig" (not "vijftigduizend honderdzestig")
    [/\b([Ll])oadflow(?=\p{L})/gu, '$1oodflo-'], [/\b([Ll])oadflow\b/g, '$1oodflo'], [/\bN-1-/g, 'N min één '], [/\bN-1\b/g, 'N min één'],
    [/\b([Vv])luchtstrook/g, '$1lucht-strook'], [/\bNetcode\b/g, 'Net-code'], [/\bEN 50160\b/g, 'E N vijftig honderdzestig'],
    // non-firm as the floor says it, "non-furm" (espeak-ng reads the Dutch short i, "non-fim")
    [/\b([Nn])on-firm\b/g, '$1on-furm'],
    // flex and batteries (eng.gridplanning.flex): redispatch, peak shaving and the day-aheadmarkt as the floor
    // says them (espeak-ng reads "reedisp-atch" with the ch of "lachen", "pe-ak sjaaving" and "daaj-aahe-admarkt");
    // compounds it stresses at the end or on every part, split at the head: systeemCOde, KA-paciteitsbeperkings-
    // contract, tijdsduurGEEbonden (with a long e), trafoWISsel and piek-UUR (as piekuren above)
    [/\b([Rr])edispatch\b/g, '$1iedispetsj'], [/\b([Pp])eak shaving\b/g, '$1iek sjeeving'], [/\b([Dd])ay-aheadmarkt/g, '$1ee-ahed-markt'],
    [/\b([Ss])ysteemcode\b/g, '$1ysteem-code'], [/\b([Cc])apaciteits(beperkings|sturings)contract/g, '$1apaciteits-$2contract'],
    [/\b([Tt])ijdsduurgebonden\b/g, '$1ijdsduur-gebonden'], [/\b([Tt])rafowissel/g, '$1rafo-wissel'], [/\b([Pp])iekuur\b/g, '$1iek-uur'],
    // from substation to socket (eng.gridbasics.path): espeak-ng says EE-neksis, LIE-ander, westLAND, wijkTRAfo
    // and hoofdze-KIE-ring. "En-exis" and "Ljander" give one main stress in the right place (en-NEK-sis,
    // LJAN-der); Westland, wijktrafo and hoofdzekering are split at the head, which stresses both parts (WEST-LAND,
    // WIJK-TRAfo, HOOFD-ZEkering) but no longer the wrong one alone. hoofdzekering only after "aan de", so the
    // load film's "De hoofdzekering" stays as it is
    [/\bEnexis\b/g, 'En-exis'], [/\bLiander\b/g, 'Ljander'], [/\bWestland\b/g, 'West-land'],
    [/\b([Ww])ijktrafo/g, '$1ijk-trafo'], [/\baan de hoofdzekering\b/g, 'aan de hoofd-zekering'],
    // how a transformer works (eng.transformers.principle): ONAN and Dyn5 as letters (espeak-ng reads the words
    // "onan" and "din vijf"); nullastverliezen and regelschakelaar, stressed nullastverLIEzen and regelschaKElaar
    // (with the e of "bed"), split at the head (NULlast-verLIEzen, REgel-SCHAkelaar, as vermogensschakelaar
    // above); and "in driehoek", stressed drie-HOEK, said drie-hoek (only after "in", so the drives film's
    // "naar driehoek" stays as it is)
    [/\bONAN\b/g, 'O N A N'], [/\bDyn5\b/g, 'D Y N 5'], [/\b([Nn])ullastverliezen/g, '$1ullast-verliezen'],
    [/\b([Rr])egelschakelaar/g, '$1egel-schakelaar'], [/\bin driehoek\b/g, 'in drie-hoek'],
    // the five safety rules (eng.switchgear.fiverules): espeak-ng reads NEN-EN 50110 as "en ee en ee en
    // vijftig duizend honderd tien" and NEN 3140 as "en ee en drieduizend honderdveertig"; said as the floor
    // says them, "nen E N vijftig honderdtien" and "nen 31 40" (only NEN with a four-digit number, so ISO and
    // EN numbers elsewhere stay). IV is read as the word "if", VOP as the word "vop" and WV with a v for the
    // w: said I V, vee oo pee and wee vee (VP is read right). It stresses ARbobesluit (with "bes-luit"),
    // the head of schakelmonTEUR, schakelmoMENten and moffenPLOEG, and reads installatieverantwoordelijke
    // as "INstalaativerantwoordelijke" (t, not ts): split at the head, each part keeps its own reading
    [/\bNEN-EN 50110\b/g, 'nen E N vijftig honderdtien'], [/\bNEN (\d\d)(\d\d)\b/g, 'nen $1 $2'],
    [/\bIV\b/g, 'I V'], [/\bVOP\b/g, 'vee oo pee'], [/\bWV\b/g, 'wee vee'], [/\bArbobesluit\b/g, 'Arbo-besluit'],
    [/\b([Ss])chakelmonteur/g, '$1chakel-monteur'], [/\b([Ss])chakelmoment/g, '$1chakel-moment'], [/\b([Mm])offenploeg/g, '$1offen-ploeg'],
    [/\b([Ii])nstallatieverantwoordelijke/g, '$1nstallatie-verantwoordelijke'],
    // protection (eng.switchgear.protection): espeak-ng reads relais as "REE-lice" (said as the floor says it,
    // re-LEE; only where no film with a video says it: not before "ziet", "ook" or "meet", nor at a full stop,
    // so eng.lines.control, eng.switchgear.devices and eng.switchgear.automation keep their voice), NAI-jlen
    // (said naa-ijlen), and it stresses or voices these compounds wrong: uitschaKEL-signaal with the e of "bed",
    // REEzervee-beveiliging, aardfout-beeveiLIEging, middenspannings-sə-KIEring,
    // lekSTROOM, faseSTROmen, foutSTROmen, laagspanningsKAbel, straatKAbel; split at the head, each part keeps
    // its own reading
    [/\b([Bb]eveiligings)?([Rr])elais\b(?! (?:ziet|ook|meet)\b)(?!\.)/g, '$1$2elee'], [/\bnaijlen\b/g, 'naa-ijlen'],
    [/\b([Uu])itschakelsignaal/g, '$1itschakel-signaal'],
    [/\b([Rr])eservebeveiliging/g, '$1eserve-beveiliging'], [/\b([Aa])ardfoutbeveiliging/g, '$1ardfout-beveiliging'],
    [/\b([Mm])iddenspanningszekering/g, '$1iddenspannings-zekering'], [/\b([Ll])aagspanningszekering/g, '$1aagspannings-zekering'],
    [/\b([Ll])ekstroom/g, '$1ek-stroom'], [/\b([Ff])asestromen\b/g, '$1ase-stromen'],
    [/\b([Ff])outstromen\b/g, '$1out-stromen'], [/\b([Ll])aagspanningskabel/g, '$1aagspannings-kabel'], [/\b([Ss])traatkabel/g, '$1traat-kabel'],
    // the critical path (pm.plan.schedule, the first pm film): go/no-go without "slash" (espeak-ng says
    // "go slash no-go"; as the English rule), pilot as the Dutch say it, "pailot" (espeak-ng reads "pie-lot"),
    // and compounds it stresses at the end or reads wrong, split at the head: stuurGROEP, mijlPAAL, nulmEting
    // with a schwa, gereedheidsCHeck with s-ch, piekseiZOEN (STUUR-groep, MIJL-paal, NUL-meting, -check as tsjek)
    [/\b([Gg])o\/no-go\b/g, '$1o, no-go'], [/\b([Pp])ilot/g, '$1ailot'], [/\b([Ss])tuurgroep/g, '$1tuur-groep'],
    [/\b([Mm])ijlpa(al|len)\b/g, '$1ijl-pa$2'], [/\b([Nn])ulmeting/g, '$1ul-meting'], [/\b([Gg])ereedheidscheck/g, '$1ereedheids-check'],
    [/\b([Pp])iekseizoen/g, '$1iek-seizoen'],
    // the stakeholder map (pm.intake.stakeholders): espeak-ng reads stakeholder as "staa-ke-holder" (said
    // steekholder; in stakeholdermap the map as "mep", else "-dər-map" runs together), stresses proceseigenaar
    // as "PROOsə-zeigenaar" (split at the head), and reads the RACI letters' English words as Dutch
    // ("res-pon-SI-ble", "ak-kaunt-ab-le", "IN-for-met"); said riesponsibel, akauntebel, informt. Consulted is
    // read well enough as it is
    [/\b([Ss])takeholdermap/g, '$1teekholdermep'], [/\b([Ss])takeholder/g, '$1teekholder'], [/\b([Pp])roceseigenaar/g, '$1roces-eigenaar'],
    [/\b([Rr])esponsible\b/g, '$1iesponsibel'], [/\b([Aa])ccountable\b/g, (m, a) => (a === 'A' ? 'Akauntebel' : 'akauntebel')], [/\b([Ii])nformed\b/g, '$1nformt'],
    // the first conversation (pm.intake.firsttalk): the listening checklist MORE PIES as its English name, "Mor
    // pais" (espeak-ng reads PIES as the Dutch "pis"); only in capitals, as the lessons write it
    [/\bMORE PIES\b/g, 'Mor pais'],
    // escalation (pm.run.escalation): espeak-ng reads governance the Dutch way, "GOO-ver-nan-se" (said as the
    // floor says it, "gavvernens"), MUM-effect as letters and keep with a long e (said mum-effect, kiep mum), and
    // stresses ESkalatieroute; split at the head, so it keeps es-ka-LA-tie
    [/\b([Gg])overnance\b/g, (m, g) => `${g === 'G' ? 'G' : 'g'}avvernens`], [/\bMUM-effect\b/g, 'mum-effect'], [/\bkeep mum\b/g, 'kiep mum'],
    [/\b([Ee])scalatieroute/g, '$1scalatie-route'],
    // the pre-mortem (pm.plan.risk): issue as Dutch project people say it, "isjoe" (espeak-ng reads "is-uu-e");
    // pm.outside.experts says issues (isjoes) through this rule too
    [/\b([Ii])ssue(s?)\b/g, '$1sjoe$2'],
    // ways of working (pm.plan.method): espeak-ng reads agile the Dutch way, "AA-gie-le" (said as the floor says
    // it, "etsjail", tsj for the dzj it cannot voice there), and stresses HYbride (said hie-BRIE-de); not before
    // "machine", so eng.moulding.machine, which has a rendered video, keeps its voice
    [/\b([Aa])gile\b/g, (m, a) => `${a === 'A' ? 'E' : 'e'}tsjail`], [/\b([Hh])ybride\b(?! machine)/g, '$1iebriede'],
    // breaking down the work (pm.plan.wbs): scope and scope creep as said in Dutch projects (espeak-ng reads
    // "skoo-pe" and "kreep"): skoop, kriep; and werkpakket and nachtploeg, stressed werkPAKket and nachtPLOEG,
    // split at the head (WERK-pakket, NACHT-ploeg); not before "accepteert", so pm.plan.risk's "De nachtploeg
    // accepteert het niet" keeps the voice it was reviewed with
    [/\b([Ss])cope creep\b/g, (m, s) => `${s === 'S' ? 'S' : 's'}koop kriep`], [/\b([Ss])cope\b/g, (m, s) => `${s === 'S' ? 'S' : 's'}koop`],
    [/\b([Ww])erkpakket/g, '$1erk-pakket'], [/\b([Nn])achtploeg\b(?! accepteert)/g, '$1acht-ploeg'],
    // five small requests (pm.run.scope): espeak-ng stresses wijzigingsverZOEK, wijzigingscomMISsie and
    // duivelsdrieHOEK (with a full e in duivels); split at the head, as stuur-groep, so they keep WIJzigings-
    // and DUIvels-; no other film says them
    [/\b([Ww])ijzigings(verzoek|commissie)/g, '$1ijzigings-$2'], [/\b([Dd])uivelsdriehoek/g, '$1uivels-driehoek'],
    // feedback, upward too (pm.lead.feedback): espeak-ng reads feedback as "feed-bak" with a Dutch long e (said
    // fiedbek, also in feedbacksandwich and feedforward), SBI as one word, "zbie" (said as letters), disagree and
    // commit as "die-za-grée ant" and the English names as Dutch ("krée-aa-tie-ve lée-aa-der-ship", "mars-hal",
    // "dzjef" as "jef"); it stresses PRES-tatiegesprek, ES-kalatiepad and IN-tegriteit; split at the head, each
    // keeps its own stress. Not before "van de vloer", so pm.plan.method keeps the voice it was built with
    [/\b([Ff])eedbacksandwich/g, '$1iedbek-sendwitsj'], [/\b([Ff])eedforward\b/g, '$1iedforwerd'], [/\b([Ff])eedback\b(?! van de vloer)/g, '$1iedbek'],
    [/\bSBI\b/g, 'es bee ie'], [/\bCenter for Creative Leadership\b/g, 'Senter for Krie-eetif Liedersjip'], [/\bMarshall\b/g, 'Marsjal'],
    [/\bEdmondson\b/g, 'Edmondsen'], [/\bJeff Bezos\b/g, 'Djef Beezos'], [/\b([Dd])isagree and commit\b/g, '$1issegrie en kommit'],
    [/\b([Pp])restatiegesprek/g, '$1restatie-gesprek'], [/\b([Ee])scalatiepad/g, '$1scalatie-pad'], [/\b([Ii])ntegriteit\b/g, '$1n-tegriteit'],
    // and COO as letters (before a colon espeak-ng reads the word "koo"); commitment as Dutch project people say
    // it, k'MIT-ment (espeak-ng reads "kommit-MENT", heard as "comment meer"; "kmitmunt" heard as commitment)
    [/\bCOO\b/g, 'C O O'], [/\bCommitment\b/g, 'Kmitmunt'], [/\bcommitment\b/g, 'kmitmunt'],
    // handing over and holding on (pm.land.handover): hypercare as said in Dutch IT projects, "haiperkeer"
    // (espeak-ng reads "hie-per-kaa-re"); the KPI after "de" and KPI's as letters (espeak-ng reads the word
    // "kpie"; not "een KPI", so pm.intake.firsttalk keeps its voice, and KPI- compounds are read as letters
    // already); and compounds it misreads, split at the head: acceptatiecriteria with "ti" for "tsie" (lower
    // case only, so pm.plan.wbs's "Acceptatiecriteria:" keeps its voice), PROjectopdracht, PROOsə-zaudit,
    // baTENreview and overdrachts-sx-ecklist (with the s-ch of "schip"); no other film says them
    [/\b([Hh])ypercare\b/g, '$1aiperkeer'], [/\b([Dd]e) KPI\b(?!-)/g, '$1 K P I'], [/\bKPI's\b/g, "K P I's"],
    [/\bacceptatiecriteria\b/g, 'acceptatie-criteria'], [/\b([Pp])rojectopdracht/g, '$1roject-opdracht'], [/\b([Pp])rocesaudit/g, '$1roces-audit'],
    [/\b([Bb])atenreview/g, '$1aten-review'], [/\b([Oo])verdrachtschecklist/g, '$1verdrachts-checklist'],
    // adoption (pm.land.adoption): the five ADKAR steps as their English words, as the floor says them (espeak-ng
    // reads "AA-va-ree-nus", "DEE-zie-re", "knoow-ledge" with a g, "AA-bi-lie-ti", "rein-fors-e-MENT"): e-WER-nus,
    // di-ZAAI-er, NOL-litsj, e-BIL-li-ti, rie-in-FORS-ment; only with a capital, as the lessons write them.
    // livegang as said in Dutch projects (espeak-ng reads "LIE-ve-gang"): laif-gang; communicatieplan stressed
    // KOM- with a t for ts, middenmanager with a Dutch "manager" (said midden-menetsjer, tsj for the dzj it cannot
    // voice), and town hall with the o of "town" (taun hol). Coch and French ("kox en frenx") and Mark Hughes
    // ("hux-hes") as their English names, only in these pairs; no other film says them
    [/\bAwareness\b/g, 'E-wèrnus'], [/\bDesire\b/g, 'Die-zaaijer'], [/\bKnowledge\b/g, 'Nollitsj'], [/\bAbility\b/g, 'E-billiti'], [/\bReinforcement\b/g, 'Rie-in-forsmunt'],
    [/\b([Ll])ivegang/g, '$1aif-gang'], [/\b([Cc])ommunicatieplan/g, '$1ommunicatie-plan'], [/\b([Mm])iddenmanager/g, '$1idden-menetsjer'], [/\b([Tt])own hall\b/g, '$1aun hol'],
    [/\bCoch en French\b/g, 'Kootsj en Frensj'], [/\bMark Hughes\b/g, 'Mark Hjoes'],
    // from strategy to team number (pm.perform.tree): the English words Dutch performance people use, as they
    // say them (espeak-ng reads "drie-vur", "baa-lan-set skoo-re-kart", gaming with the g of "lachen" and a long
    // a, "Goo-dhart", "Strat-ern", "lok-ke en lat-tam" and stresses NORton on its last syllable): draiver,
    // bellenst skoorkart, geeming, Goedhart, Strèthurn, Lok en Leetum, Norten (the names only in their pairs);
    // and words it stresses or voices wrong: IN-dicator (said indie-KAtor, indie-kaTOren, only after voorlopende,
    // achterlopende and gekoppelde, so the grid films' "kleine indicatoren" stay), actiegrens with a schwa (only
    // after "een", so eng.maintenance.failure's "De actiegrens ligt" keeps its voice), "dee-ad-lie-ne",
    // "dasj-boo-arts" (only the plural: the singular in pm.intake.firsttalk, pm.plan.method and pm.run.scope
    // stays), RAPportagecijfer and "orderrə-GEL"; said actie-grens, dedlain, desjbords, rapportage-cijfer and
    // order-regel. No other film's spoken text changes
    [/\b([Dd])river/g, '$1raiver'], [/\b([Bb])alanced scorecard\b/g, (m, b) => `${b === 'B' ? 'B' : 'b'}ellenst skoorkart`], [/\bKaplan en Norton\b/g, 'Kaplan en Norten'],
    [/\b([Gg])aming\b/g, '$1eeming'], [/\bGoodhart\b/g, 'Goedhart'], [/\bStrathern\b/g, 'Strèthurn'], [/\bLocke en Latham\b/g, 'Lok en Leetum'],
    [/\b([Vv]oorlopende|[Aa]chterlopende|[Gg]ekoppelde) indicator/g, '$1 indie-kator'], [/\b([Ee]en) actiegrens\b/g, '$1 actie-grens'], [/\b([Dd])eadline/g, '$1edlain'],
    [/\b([Dd])ashboards\b/g, '$1esjbords'],
    [/\b([Rr])apportagecijfer/g, '$1apportage-cijfer'], [/\b([Oo])rderregel/g, '$1rder-regel'],
    // on-the-job instruction (pm.land.training): Toyota as the Dutch say it, "tojota" (espeak-ng reads
    // "too-ie-oota"); no other film says Toyota in Dutch
    [/\bToyota\b/g, 'Tojota'],
    // proving results (pm.close.results): espeak-ng stresses controller on the first part, "KON-trol-ler" (said
    // kon-TROL-ler), dekkingsbijdrage on "-DRAA-" with a French zj (split at the head: DEK-kings-BIJ-drage), and
    // reads run chart with a French sj (said run tsjart); no other film says them. procentpunt stressed PRO-
    // (split: pro-CENT-punt); no other film's voice says it. investering is read IN-ves-te-ring (said
    // in-ves-TEE-ring), but eng.lines.variants and eng.quality.tolerance say it in rendered videos, so only
    // this film's phrase "investering die niet nodig" is split
    [/\b([Cc])ontroller(s?)\b/g, (m, c, s) => `${c === 'C' ? 'K' : 'k'}on-troller${s}`], [/\b([Dd])ekkingsbijdrage/g, '$1ekkings-bijdrage'],
    [/\b([Rr])un chart\b/g, '$1un tsjart'], [/\b([Pp])rocentpunt/g, '$1rocent-punt'], [/\b([Ii])nvestering die niet nodig\b/g, '$1n-ves-tering die niet nodig'],
    // what fits under the line (pm.portfolio.prioritise): espeak-ng stresses programmaRAAD, capaciteitsSTREEP,
    // KApaciteitsmatrix, KApaciteitsconflict and risicogecorrigEERde: split at the head, each part keeps its own
    // stress (pro-GRAM-ma-RAAD, ca-pa-ci-TEITS-STREEP, RI-si-co-ge-cor-ri-GEER-de). It stresses ONderhanden werk
    // (said onder-HANden), but eng.lines.design says "onderhanden werk" in a rendered video, so only this film's
    // two phrases are split. contextswitch with the tsj of "switch" (espeak-ng reads the ch of "lachen"),
    // planningstool with the oe Dutch speakers say (it reads planningsTOOL with a Dutch oo), and Gerald Weinberg
    // as his English name (it reads a Dutch g and ei); no other film says them
    [/\b([Pp])rogrammaraad/g, '$1rogramma-raad'], [/\b([Cc])apaciteits(streep|matrix|conflict)/g, '$1apaciteits-$2'], [/\b([Rr])isicogecorrigeerd/g, '$1isico-gecorrigeerd'],
    [/\b([Oo])nderhanden werk(?= is alles| gedeeld door)/g, '$1nder-handen werk'],
    [/\b([Cc])ontextswitch/g, '$1ontext-switsj'], [/\b([Pp])lanningstool/g, '$1lannings-toel'], [/\bGerald Weinberg\b/g, 'Djerreld Wainburk'],
    // BATNA, ZOPA and the first offer (pm.negotiate.batna): pakketdeal with "deal" as the Dutch say it, "diel"
    // (espeak-ng drops the d: "pakket-eeal"), framing as "freeming" (espeak-ng reads "fraa-ming"), and the
    // example's gecoate beugels and coaten with the English oa, "koote" (espeak-ng reads "ge-koo-aa-te"); gecoate
    // only before beugels, so eng.joining.bonding's "gecoate nagels" keeps its voice. Also deal on its own as
    // "diel" (espeak-ng reads "dee-al"). integriteit takes pm.lead.feedback's in-tegriteit above (stress on
    // -TEIT, full e). BATNA and ZOPA need no rule (espeak-ng reads BAT-naa and ZOO-paa); no other film says
    // these words in Dutch
    [/\b([Pp])akketdeal/g, '$1akket-diel'], [/\b([Dd])eal(s?)\b/g, '$1iel$2'], [/\b([Ff])raming\b/g, '$1reeming'],
    [/\b([Gg])ecoate beugels\b/g, '$1ekoote beugels'], [/\bcoaten\b/g, 'kooten'],
    // from output to benefits (pm.portfolio.benefits): batenhouder and ploegdagen split at the head (espeak-ng reads
    // a full e in "baa-tèn-houder" and stresses ploeg-DA-gen; ploegdag on its own is read right), business case as
    // Dutch project people say it, "biznis kees" (espeak-ng reads "bu-zie-nus kaa-se"), weekenddienst as "wieken-dienst"
    // (it reads "wee-kend-DIENST"), and lijnmanager and operationeel manager with a Dutch "manager" as the
    // middenmanager rule above says it (it reads MAA-naa-cher), operationeel stressed on -NEEL (it stresses OO-);
    // no other film says them in Dutch. And the lesson's trigger before its Dutch gloss as "trikker" (espeak-ng
    // reads a soft g, "tri-gher"), only in this film's "trigger, een actiegrens", so pm.land.handover keeps its voice
    [/\b([Tt])rigger(?=, een actie-?grens\b)/g, '$1rikker'],
    [/\b([Bb])atenhouder/g, '$1aten-houder'], [/\b([Pp])loegdagen\b/g, '$1loeg-dagen'], [/\b([Bb])usiness case/g, '$1iznis kees'],
    [/\b([Ww])eekenddienst/g, '$1ieken-dienst'], [/\b([Ll])ijnmanager/g, '$1ijn-menetsjer'], [/\b([Oo])perationeel manager/g, '$1pperaatsjoneel menetsjer'],
    // asking questions outside your field (pm.outside.questions): the names behind the planning fallacy and the
    // reference class as English and Danish speakers say them (espeak-ng reads Kahneman with a sounded h,
    // Flyvbjerg as "flif-bjerg"): Kaaneman, Fluubjerg (Gardner is on the card only: no spelling gives
    // espeak-ng a hard g, and Kardner is another name); and words it
    // misreads, split at the head: REferentieklasse with "ti" for "tsie" (referentie-KLASse), basiscijfer without
    // the s of cijfer ("basis-eifer"), IT-lead as "lee-ad" (said IT-lied), and OPtimistisch and VOORspelling
    // (said op-timistisch, voor-spelling: op-ti-MIS-tisch, voor-SPEL-ling); no other film says them, and
    // optimistisch only before "e", "en", a number or ", plus", so pm.plan.wbs's "optimistisch, meest
    // waarschijnlijk" keeps the voice it was built with
    [/\bKahneman\b/g, 'Kaaneman'], [/\bFlyvbjerg\b/g, 'Fluubjerg'],
    [/\b([Rr])eferentieklasse/g, '$1eferentie-klasse'], [/\b([Bb])asiscijfer/g, '$1asis-cijfer'], [/\bIT-lead\b/g, 'IT-lied'],
    [/\b([Oo])ptimistisch(?=e\b| en\b| \d|, plus\b)/g, '$1p-timistisch'], [/\b([Vv])oorspelling/g, '$1oor-spelling'],
    // three conversations in one (pm.lead.difficult): the authors and the book's title as English names (espeak-ng
    // reads "stoo-ne", pat-TON and a Dutch "kon-ver-saa-sjons"): Stoon, Petten, Diffikkelt Konver-seesjens;
    // identiteitsgesprek and identiteitsval split at the head (it stresses I-dentiteits; split, i-den-ti-TEITS),
    // ge-kwetstheid (it stresses GE-), smalltalk as said in Dutch (smoltok); analyse is stressed AA-na-ly-se, but
    // other films say it, so only this film's two phrases get "analiese"; stilstanddata, stilstandlogboek and
    // lijndata split at the head (it stresses the last part). No other film says them
    [/\bStone, Patton en Heen\b/g, 'Stoon, Petten en Heen'], [/\bDifficult Conversations\b/g, 'Diffikkelt Konver-seesjens'],
    [/\b([Ii])dentiteits(gesprek|val)/g, '$1dentiteits-$2'], [/\b([Gg])ekwetstheid\b/g, '$1e-kwetstheid'], [/\b([Ss])malltalk\b/g, '$1moltok'],
    [/\banalyse (?=moet vrijdag|vóór vrijdag)/g, 'analiese '], [/\b([Ss])tilstandlogboek\b/g, '$1tilstand-log-boek'],
    [/\b([Ss])tilstanddata\b/g, '$1tilstand-data'], [/\b([Ll])ijndata\b/g, '$1ijn-data'],
    // from phone call to proposal (pm.consult.proposal): espeak-ng stresses dagtaRIEF and extrusieLIJN (split at
    // the head: DAG-tarief, ex-TRU-sie-lijn), drops the d of plantdirecteur ("plantirecteur"), reads engineer as
    // "eng-i-neer" (said as Dutch makers say it, "entsjinier", tsj for the dzj it cannot voice) and Alan Weiss
    // as "AA-lan" (said as his English name, "Ellun Wais"). It stresses OF-ferte and offerTES (French -tes):
    // split as off-erte, which keeps a stress on -FER-, and the plural with an apostrophe, off-erte's, which ends
    // on a schwa. dagtarief in lower case only, so pm.run.scope's "Dagtarief: bij de klant" keeps the voice it
    // was built with. Vantage, the consultancy of the lessons' examples, as its English name, "Ventitsj"
    // (espeak-ng reads a French van-TAA-zje); no other film says the others or Vantage in Dutch
    [/\b([Oo])fferte(s?)\b/g, (m, o, s) => `${o}ff-erte${s ? "'s" : ''}`],
    [/\bdagtarie(f|ven)\b/g, 'dag-tarie$1'], [/\b([Pp])lantdirecteur/g, '$1lant-directeur'], [/\b([Ee])xtrusielijn/g, '$1xtrusie-lijn'],
    [/\b([Pp])roductie-engineer\b/g, '$1roductie-entsjinier'], [/\bAlan Weiss\b/g, 'Ellun Wais'], [/\bVantage\b/g, 'Ventitsj'],
    // stuck: which kind of problem (pm.stuck.diagnose): espeak-ng stresses mensenproBLEEM, capaciteitsproBLEEM,
    // ijkmoMENT and planningsreGEL (with the e of "bed"), split at the head as stuur-groep, and vrijgeven on
    // -GEE- (said VRIJ-geven). Not vrijgave, which films with a video say; no other film says these
    [/\b([Mm])ensenprobl/g, '$1ensen-probl'], [/\b([Cc])apaciteitsprobl/g, '$1apaciteits-probl'], [/\b(I[Jj]|ij)kmoment/g, '$1k-moment'],
    [/\b([Pp])lanningsregel/g, '$1lannings-regel'], [/\b([Vv])rijgeven\b/g, '$1rij-geven'],
    // seeing progress without the expertise (pm.outside.steering): espeak-ng reads definition of done (also with
    // a capital D, pm.agile.scrum's Scrum Guide name) as
    // "dee-fie-nie-SJON of doo-ne" (said deffi-nisjun of dun; not in pm.plan.wbs's caption "definition of done:
    // klaar als", so that film's spoken text stays), FAT and SAT as the words "fat" and "sat" (said as letters,
    // as on the floor; capitals only), stresses FABrieksacceptatietest and LOcatieacceptatietest with "ti" for
    // "tsie" (split at the heads: fa-BRIEKS-ak-sep-TAA-tsie-TEST), and reads Jeffrey Pfeffer with a stressed
    // -REY and a sounded p (said as his English name, Djeffri Feffer); no other film says them in Dutch
    [/\b([Dd])efinition of [Dd]one\b(?!: klaar als)/g, '$1effi-nisjun of dun'], [/\b([FS])AT\b/g, '$1 A T'],
    [/\b([Ff])abrieksacceptatietest/g, '$1abrieks-acceptatie-test'], [/\b([Ll])ocatieacceptatietest/g, '$1ocatie-acceptatie-test'],
    [/\bJeffrey Pfeffer\b/g, 'Djeffri Feffer'],
    // testing plans, translating jargon (pm.outside.jargon): espeak-ng stresses PREmortem (said pree-mortem), reads
    // single point of failure as "poo-int of fa-LU-re" (said singel pojnt of feeljer), stresses beheersmaatreGEL and
    // nachtDIENST and reads barcodescanners as "barcoo-des-kanners" (said barkoodskenners; split at the head; beheersmaatregel only after
    // "een", so pm.plan.risk's caption "De beheersmaatregel" keeps its voice), and the integration specialist's
    // jargon: "ree-al-TAIM", "laa-ten-sie", "re-TRIES" (said riel-taim, lee-tensie, rie-traiz; batch already has its
    // rule above, betsj), and jargon as "sjargon", near the Dutch zj espeak-ng cannot give (it reads "jar-gon"), only
    // in this film's phrases, so pm.plan.method's "geen jargon" keeps its voice; Harvard Business Review as "Harvard
    // Biznis Rievjoe" (it reads "bu-ZIE-nus ree-VIEW"; the business case rule above has the same Biznis); no other
    // film says them in Dutch
    [/\b([Pp])remortem/g, '$1ree-mortem'], [/\b([Ss])ingle point of failure\b/g, '$1ingel pojnt of feeljer'],
    [/\b([Ee]en) beheersmaatregel\b/g, '$1 beheers-maatregel'], [/\b([Bb])arcodescanner/g, '$1arkoodskenner'], [/\b([Nn])achtdienst/g, '$1acht-dienst'],
    [/\breal-time\b/g, 'riel-taim'], [/\blatency\b/g, 'lee-tensie'], [/\bretries\b/g, 'rie-traiz'],
    [/\b([Jj])argon(?= is de vaktaal|: de vaktaal| aan het bestuur)/g, (m, j) => `${j === 'J' ? 'S' : 's'}jargon`], [/\bHarvard Business Review\b/g, 'Harvard Biznis Rievjoe'],
    // conflict: interests and the difficult conversation (pm.run.conflict): the authors of Getting to Yes as their
    // names sound, only after "van" (so pm.negotiate.batna's captions "Fisher en Ury:" keep their voice): espeak-ng
    // sounds the h of Fisher and reads Ury as "uu-rie" (said Fisjer en Joeri); and Lean-consultant as
    // "Lien consultant", two words (espeak-ng reads "lee-an"; "Lien-consultant" runs on into "link-consultant",
    // as Whisper hears it); no other film says them in Dutch
    [/\bvan Fisher en Ury\b/g, 'van Fisjer en Joeri'], [/\bLean-consultant\b/g, 'Lien consultant'],
    // working with experts (pm.outside.experts): espeak-ng reads codereviews as "koo-di-re-views" (said as Dutch
    // makers say it, kood-rievjoes; its issues goes through the pre-mortem's rule above) and vage with a French g
    // ("vaazje": vaage),
    // stresses risico-GE-stuurd and sleu-TEL-persoon with the e of "bed" (split at the head), negentig-
    // negentigregEL and routineNEEpunten (the last part apart), and after "eerlijk" OPtimistisch (op-timistisch,
    // as the questions film's rule says it). No other film says these; eng.quality.spc's steekproef and the
    // other films' optimistisch keep their voice
    [/\b([Cc])odereviews\b/g, (m, c) => `${c === 'C' ? 'K' : 'k'}ood-rievjoes`],
    [/\b([Rr])isicogestuurd/g, '$1isico-gestuurd'], [/\b([Ss])leutelpersoon/g, '$1leutel-persoon'],
    [/\b([Nn])egentig-negentigregel/g, '$1egentig-negentig-regel'], [/\b(eerlijk )optimistisch\b/g, '$1op-timistisch'],
    [/\b([Vv])age\b/g, '$1aage'], [/\b([Rr])outinepunt/g, '$1outine-punt'],
    // disagreement and busy experts (pm.outside.disagree): espeak-ng reads second opinion as "se-KONT OP-i-ni-on"
    // (said sekkend opinjun, only in this film's phrases, so pm.outside.steering's "een second opinion, de
    // sponsor" keeps its voice), timebox as "TIE-me-box" (taimboks), Weinberg after "van" with a Dutch ei and g
    // (Wainburk, as the Gerald Weinberg rule above), Daniel Pink's Drive as "dri-ve" (Deniel Pink, Draiv), Edward
    // Deci and Richard Ryan with a Dutch ch and "rie-an" (Edwerd Diessie, Ritsjerd Rajen), manager as MAA-naa-gher
    // (menetsjer, as the middenmanager rule; only in this film's phrases, so pm.plan.wbs keeps its voice), and
    // stresses OO-pi-raa-tors (ope-raators, only before "verliezen", so the TPM and LOTO films keep theirs),
    // IN-stal-la-teur, zelfdeterminatie with "ti" for "tsie", bouwPLAATS, drijfVEren and, after
    // "als" and before a colon only (other films keep their vuistregel), vuistreGEL: split at the head. No other film says them in Dutch
    [/\b([Ss])econd opinion\b(?=:| is een| van een onafhankelijk| steunt)/g, '$1ekkend opinjun'], [/\b([Tt])imebox\b/g, '$1aimboks'],
    [/\bvan Weinberg\b/g, 'van Wainburk'], [/\bDaniel Pink noemt in Drive\b/g, 'Deniel Pink noemt in Draiv'],
    [/\bEdward Deci en Richard Ryan\b/g, 'Edwerd Diessie en Ritsjerd Rajen'],
    [/\b(de|[Zz]ijn) manager\b(?= van de expert| verdeelt| zegt| om )/g, '$1 menetsjer'], [/\bde operators(?= verliezen)/g, 'de ope-raators'],
    [/\b([Ii])nstallateur\b/g, '$1nstal-lateur'], [/\bzelfdeterminatietheorie\b/g, 'zelf-determinatie-theorie'],
    [/\b([Bb])ouwplaats/g, '$1ouw-plaats'], [/\b([Dd])rijfveren\b/g, '$1rijf-veren'], [/\bals vuistregel:/g, 'als vuist-regel:'],
    // a two-week sprint (pm.agile.scrum): the Scrum Guide's English names as Dutch Scrum teams say them, checked
    // with espeak-ng phonemes through Piper's nl_NL-alex bridge: it reads "PROO-dukt OU-ner", "BAK-loch" and
    // "GOO-al" (said Prodduct Ooner, Bek-lok, Gool, the goal of Dutch football), "DEE-ve-loo-pers" (Di-vellopers),
    // "DAI-lie" (Deeli), "ree-VIEW" (Rievjoe, as Harvard Business Review above), "RE-tros-pek-tie-ve"
    // (Retro-spektif), a Dutch "guide" (Gaid), Schwaber with sch and Jeff as "yef" (Sjwaaber, Djef), "ee-VENTS" (ievents) and
    // "ree-fie-ne-MENT" (ri-fainmunt), and it stresses productieLEIder with "ti",
    // acceptatieomGEving with "ti", sprintDOEL and, in this film's phrases only, vuistreGEL (pm.outside.disagree's
    // rule covers "als vuistregel:"): split at the head; "uit het Lean-team" as "Lien team", as the Lean-consultant
    // rule above (espeak-ng reads "lee-an"; pm.run.conflict's "een Lean-team" stays). Capitalised names only (a
    // lower-case goal, review or developer keeps its voice), the Guide only as "Scrum Guide van"
    // (pm.outside.steering's "Uit de Scrum Guide" stays); ERP stays the word "erp", as the films with a video say
    // it; Definition of Done with a capital D goes through pm.outside.steering's rule above; no other film's voice changes
    [/\bProduct (?=(?:Owner|Backlog|Goal)\b)/g, 'Prodduct '], [/\bOwner\b/g, 'Ooner'], [/\bBacklog\b/g, 'Bek-lok'], [/\bGoal\b/g, 'Gool'],
    [/\bDeveloper(s?)\b/g, 'Di-velloper$1'], [/\bDaily Scrum\b/g, 'Deeli Scrum'], [/\bSprint Review\b/g, 'Sprint Rievjoe'],
    [/\bSprint Retrospective\b/g, 'Sprint Retro-spektif'], [/\bScrum Guide van\b/g, 'Scrum Gaid van'],
    [/\bKen Schwaber en Jeff Sutherland\b/g, 'Ken Sjwaaber en Djef Sutherland'], [/\b([Ee])vent(s?)\b/g, (m, e, s) => `${e === 'E' ? 'I' : 'i'}event${s}`],
    [/\b([Rr])efinement\b/g, '$1i-fainmunt'],
    [/\b([Pp])roductieleider/g, '$1roductie-leider'],
    [/\b([Aa])cceptatieomgeving/g, '$1cceptatie-omgeving'], [/\b([Ss])printdoel/g, '$1print-doel'], [/\b([Uu])it het Lean-team\b/g, '$1it het Lien team'],
    [/\bgangbare vuistregel\b/g, 'gangbare vuist-regel'],
    // from idea to sprint-ready (pm.agile.backlog): the backlog and estimating words as Dutch agile teams say
    // them, checked with espeak-ng phonemes through Piper's nl_NL-alex bridge: it reads user story with
    // "uuzer" (said joezer story), stresses "sto-RIES" (story's), reads story points as "po-ints" (pojnts),
    // epic with a long e (eppik), velocity as "VEE-loo-si-ti" (ve-lossetti), the Fibonacci-reeks as
    // "FIE-boo-nak-si" (Fiebo-natsjie reeks), Definition of Ready as "dee-fie-nie-SJON of REE-aa-die" (Deffi-nisjun of
    // Reddi, as the Done rule above), Jeffries with a Dutch j, Wake as "waa-ke" and James as "jaa-mes" (Djeffriz,
    // Weejk, Djeems), Card, Conversation and Confirmation as Dutch words and Extreme Programming as "ek-STREE-me"
    // (said in English sounds), the Scrum Guide as a Dutch "guide" (Gaid, as the Scrum film's rule, only before
    // "schrijft" and "noemt", so pm.outside.steering's "Uit de Scrum Guide" stays), and acceptatiecriteria with
    // "ti", zaagmachines and trekhaken stressed at the end: split at the head. A story alone, planning poker and
    // INVEST keep their voice; a capital Acceptatiecriteria only before "zijn concrete" (the lower-case rule above
    // covers the rest; pm.plan.wbs's "Acceptatiecriteria:" stays); no other film's spoken text changes
    [/\b([Uu])ser stor(y|ies)\b/g, (m, u, e) => `${u === 'U' ? 'J' : 'j'}oezer story${e === 'ies' ? '\'s' : ''}`],
    [/\b([Ss])tories\b/g, '$1tory\'s'], [/\b([Ss])tory points\b/g, '$1tory pojnts'], [/\b([Ee])pic(s?)\b/g, '$1ppik$2'],
    [/\b([Vv])elocity\b/g, '$1e-lossetti'], [/\bFibonacci-reeks\b/g, 'Fiebo-natsjie reeks'], [/\bDefinition of Ready\b/g, 'Deffi-nisjun of Reddi'],
    [/\bRon Jeffries\b/g, 'Ron Djeffriz'], [/\bBill Wake\b/g, 'Bil Weejk'], [/\bJames Grenning\b/g, 'Djeems Grenning'],
    [/\bCard, Conversation en Confirmation\b/g, 'Kaard, Konver-seesjun en Konfur-meesjun'], [/\bExtreme Programming\b/g, 'Ekstriem Proogremming'],
    [/\bScrum Guide (?=schrijft|noemt)/g, 'Scrum Gaid '], [/\b([Aa])cceptatiecriteria(?= zijn concrete)/g, '$1cceptatie-criteria'],
    [/\bzaagmachines\b/g, 'zaag-machines'], [/\btrekhaken\b/g, 'trek-haken']],
  en: [[/\brpm\b/g, 'revolutions per minute'], [/\bmm\/min\b/g, 'millimetres per minute'], [/\bm\/min\b/g, 'metres per minute'], [/µm\b/g, 'micrometres'],
    [/€\s?(\d[\d,]*(?:\.\d+)?)/g, '$1 euros'], [/(\d)\.0(?![\d])/g, '$1'], [/(\d)\s?mm\b/g, '$1 millimetres'], [/(\d)\s?min\b/g, '$1 minutes'], [/(\d)\s?%/g, '$1 percent'],
    [/Ø\s*/g, 'diameter '], [/(\d)\+(\d)/g, '$1 plus $2'], [/\s×\s/g, ' times '], [/\s\/\s/g, ' divided by '], [/\s=\s/g, ' is '], [/°/g, ' degrees'], [/\bRa\b/g, 'R a'], [/’/g, "'"],
    [/\b([A-Z]{2,})\/(?=[A-Z]{2,}\b)/g, '$1 '], [/\bt8\/5\b/g, 't 8 5'], [/\bISO (\d\d)(\d\d)-(\d)\b/g, 'ISO $1 $2 part $3'],
    [/\bISO (5817|9712)\b/g, (m, n) => `ISO ${n.slice(0, 2)} ${n.slice(2)}`], [/\bEXC([1-4])\b/g, 'E X C $1'], [/\b401\b/g, 'four oh one'],
    [/\bDOE\b/g, 'D O E'], [/\bPFMEA\b/g, 'P F M E A'],
    [/\b([Gg])o\/no-go\b/g, '$1o, no-go'], [/\bR&R\b/g, 'R and R'],
    [/\bI\/O\b/g, 'I O'], [/\bOEE\b/g, 'O E E'], [/\bMES\b/g, 'M E S'], [/\bISO 2768\b/g, 'ISO 27 68'],
    // CILT as letters here too: espeak-ng's English reads it as the word "silt"
    [/\bCILT\b/g, 'C I L T'],
    // the Dutch regulator as letters (espeak-ng's English reads "ackem") and TenneT as one word ("Ten T")
    [/\bACM\b/g, 'A C M'], [/\bTenneT\b/g, 'Tennet'],
    // the five safety rules (eng.switchgear.fiverules): espeak-ng's English reads IV as "Roman four" and the
    // standards as "three thousand one hundred and forty", "fifty thousand one hundred and ten"; said I V,
    // "nen thirty-one forty" and "nen E N fifty one ten"; before a comma it reads VOP as the word "vop"
    // (letters elsewhere), so V O P throughout
    [/\bIV\b/g, 'I V'], [/\bVOP\b/g, 'V O P'], [/\bNEN-EN 50110\b/g, 'nen E N fifty one ten'], [/\bNEN (\d\d)(\d\d)\b/g, 'nen $1 $2'],
    // translating jargon (pm.outside.jargon): espeak-ng's English reads idempotency as "AID-mpoatency"; said idem-potency
    [/\bidempotency\b/g, 'idem-potency'],
    // conflict: interests and the difficult conversation (pm.run.conflict): Ury as his name sounds, "Yuri"
    // (espeak-ng's English reads "urry"), only after "by", so pm.negotiate.batna's caption "Fisher and Ury:" stays
    [/\bby Fisher and Ury\b/g, 'by Fisher and Yuri'],
    // from idea to sprint-ready (pm.agile.backlog): Ron Jeffries' three Cs with an apostrophe, as the letter's
    // plural sounds (espeak-ng's English reads "three Cs" as "three C S")
    [/\b([Tt])hree Cs\b/g, '$1hree C\'s']],
};
export const sayable = (text, lang) => (SAY[lang] || []).reduce((s, [re, w]) => s.replace(re, w), text);
// The words the voice says: no English gloss, and with a language, units as words.
export const speakOf = (seg, lang) => sayable(seg.map((p) => (typeof p === 'string' ? p : p.t)).join(''), lang).replace(/\s+/g, ' ').trim();
// What is said, as written (no gloss, units kept): the subtitles of the video.
export const saidOf = (seg) => seg.map((p) => (typeof p === 'string' ? p : p.t)).join('').replace(/\s+/g, ' ').trim();
// build-only:end

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

// The stage's u (0..1) in the HTML film. A stage drawn on the Dutch beats
// (nlBeats, set by beatwarp.js) runs, while caption beat k shows in `lang`,
// from Dutch beat k's fraction to k+1's, so English is never a beat off.
export function stageU(scene, lang, local, nlBeats) {
  const u = Math.min(1, Math.max(0, local / scene.dur));
  if (!nlBeats || lang === 'nl' || !scene.beats || !scene.beats.length) return u;
  const own = beatStarts(scene, lang);
  const nl = beatStarts(scene, 'nl');
  let k = 0;
  for (let i = 0; i < own.length; i++) if (local >= own[i]) k = i;
  const a0 = own[k];
  const a1 = k + 1 < own.length ? own[k + 1] : scene.dur;
  const b0 = nl[k];
  const b1 = k + 1 < nl.length ? nl[k + 1] : scene.dur;
  const p = Math.min(1, Math.max(0, (local - a0) / Math.max(1e-6, a1 - a0)));
  return Math.min(1, Math.max(0, (b0 + p * (b1 - b0)) / scene.dur));
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
