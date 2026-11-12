// v14b, real video: the pure parts of the narration and render pipeline
// (films/_kit), the app side of the Film step (src/ui/film.js, src/core/course.js)
// and the service worker's byte-range helper (src/core/filmrange.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { audioTimeline, timedAt, speakOf, saidOf, parseParams, PAUSES, AUDIO_GAPS } from '../films/_kit/timeline.mjs';
import { wavInfo, wavFile, joinTrack, cueChunks, vttTime, vttOf, cuesOf, manifestWith, filmUrl, MANIFEST_BASE, phrasesOf, beatLayout, beatLength, cuesOfLines, spokenOf, SUB_MAX, sentenceClips, saidWordSpans, forceAlign, timedPhrases, voiceOf } from '../films/_kit/narration.mjs';
import { listenGuard, werLimit } from '../films/_kit/listen-guard.mjs';
import { glossCase } from '../films/_kit/build-film.mjs';
import { videoOf, readAlong, filmDataOf } from '../src/ui/film.js';
import { lessonPhases, lessonSteps, lessonBack } from '../src/core/course.js';

// ------------------------------------------------------------ the audio timeline
test('audio timeline: lines follow each other with a breath, scenes open with a look and hold after the last line', () => {
  const g = { lead: 1, look: 0.5, gap: 0.25, hold: 1, tail: 2 };
  const atl = audioTimeline([[3, 2], [4]], g);
  assert.deepEqual(atl.scenes[0], { start: 0, dur: 1 + 3 + 0.25 + 2 + 1, beats: [{ start: 1, dur: 3 }, { start: 4.25, dur: 2 }] });
  assert.deepEqual(atl.scenes[1], { start: 7.25, dur: 0.5 + 4 + 2, beats: [{ start: 7.75, dur: 4 }] });
  assert.equal(atl.total, 13.75);
  // the scene is as long as its narration needs: a longer line, a longer scene
  assert.ok(audioTimeline([[9, 2], [4]], g).scenes[0].dur > atl.scenes[0].dur);
  assert.throws(() => audioTimeline([[3, 0]], g), /no audio/);
});

test('audio timeline: the scene, beat and progress at a time', () => {
  const atl = audioTimeline([[3, 2], [4]], { lead: 1, look: 0.5, gap: 0.25, hold: 1, tail: 2 });
  assert.deepEqual(timedAt(0, atl), { si: 0, bi: 0, u: 0 });
  assert.equal(timedAt(4.2, atl).bi, 0);
  assert.equal(timedAt(4.25, atl).bi, 1);
  assert.equal(timedAt(7.25, atl).si, 1);
  assert.equal(timedAt(99, atl).u, 1);
  assert.equal(timedAt(7.25 + 6.5 / 2, atl).u, 0.5);
});

test('render mode is a page parameter', () => {
  assert.equal(parseParams('?render=1&lang=en').render, true);
  assert.equal(parseParams('?lang=en').render, false);
});

// ------------------------------------------------------------ the spoken text
test('spoken text: units, signs, money and whole decimals as words; the gloss is not spoken', () => {
  assert.equal(speakOf(['in ', { t: 'zes minuten', c: 'x' }, ': 4,0 + 3,0 = 6,0 min'], 'nl'), 'in zes minuten: 4 + 3 is 6 minuten');
  assert.equal(speakOf(['€8,67 per stuk'], 'nl'), '8,67 euro per stuk');
  assert.equal(speakOf(['€8.67 a part, 6.0 min'], 'en'), '8.67 euros a part, 6 minutes');
  assert.equal(speakOf(['f 0,3 mm, 20% sneller'], 'nl'), 'f 0,3 millimeter, 20 procent sneller');
  assert.equal(speakOf(['zo’n 3 meter'], 'nl'), "zo'n 3 meter");
  // Dutch says 1.167 as elfhonderd zevenenzestig; round thousands and bigger numbers stay
  assert.equal(speakOf(['1.167 toeren, 1.200 mm/min, 2.000 stuks, 21.167 en 220.000'], 'nl'), '11honderd 67 toeren, 12honderd millimeter per minuut, 2.000 stuks, 21.167 en 220.000');
  assert.equal(speakOf(['De ', { t: 'voeding', en: 'feed', c: 'f' }, ' is 0,3 mm.'], 'nl'), 'De voeding is 0,3 millimeter.');
  // the subtitles keep what is written, without the gloss
  assert.equal(saidOf(['De ', { t: 'voeding', en: 'feed', c: 'f' }, ' is 0,3 mm.']), 'De voeding is 0,3 mm.');
  // MIG, MAG and TIG on their own as letters in Dutch (espeak-ng reads MAG as the verb), MAG-lassen as it is
  assert.equal(speakOf(['Dit is MIG/MAG-lassen. Bij MAG, voor staal, bij TIG 0,6. Het product mag eruit.'], 'nl'), 'Dit is M I G MAG-lassen. Bij M A G, voor staal, bij T I G 0,6. Het product mag eruit.');
  // no "slash" or "ampersand" in the go/no-go gauge and gauge R&R
  assert.equal(speakOf(['Gaat/gaat-niet: een vast kaliber. Een gauge R&R.'], 'nl'), 'Gaat, gaat niet: een vast kaliber. Een gauge R en R.');
  // I/O, OEE, MES and (in Dutch) HMI as letters; CE stays, espeak-ng already spells it
  assert.equal(speakOf(['De I/O, de lijn-OEE, een MES, de HMI en de CE-markering.'], 'nl'), 'De I O, de lijn-O E E, een M E S, de H M I en de CE-markering.');
  assert.equal(speakOf(['The I/O, the line OEE, an MES, the HMI and the CE marking.'], 'en'), 'The I O, the line O E E, an M E S, the HMI and the CE marking.');
  // machine states and the Pareto chart in a Dutch spelling; English keeps them
  assert.equal(speakOf(['Starved of blocked, in een paretodiagram.'], 'nl'), 'Staarft of blokt, in een pareto-diagram.');
  assert.equal(speakOf(['Starved or blocked, in a Pareto chart.'], 'en'), 'Starved or blocked, in a Pareto chart.');
  assert.equal(speakOf(['Zet ze in een pareto-diagram.'], 'nl'), 'Zet ze in een pareto-diagram.');
  assert.equal(speakOf(['The go/no-go plug gauge. A gauge R&R.'], 'en'), 'The go, no-go plug gauge. A gauge R and R.');
  // the stakeholder film: stakeholder as the Dutch say it (espeak-ng reads "staa-ke-holder"), proces-eigenaar
  // split at the head, and the RACI letters' English words in a Dutch spelling; English keeps them
  assert.equal(speakOf(['Een stakeholder, de stakeholdermap, de stakeholderkaart en de proceseigenaar.'], 'nl'), 'Een steekholder, de steekholdermep, de steekholderkaart en de proces-eigenaar.');
  assert.equal(speakOf(['Responsible, Accountable, Consulted en Informed; wie is accountable?'], 'nl'), 'Riesponsibel, Akauntebel, Consulted en Informt; wie is akauntebel?');
  assert.equal(speakOf(['A stakeholder map: Responsible, Accountable, Informed.'], 'en'), 'A stakeholder map: Responsible, Accountable, Informed.');
  // English robot words in Dutch said as on the floor; English keeps them
  assert.equal(speakOf(['De payload en het payloaddiagram, de teach pendant, end-of-arm tooling, met vision.'], 'nl'), 'De pee-lood en het pee-looddiagram, de tietsj pendant, end-of-arm toeling, met vizjun.');
  assert.equal(speakOf(['The payload, the teach pendant, end-of-arm tooling, vision.'], 'en'), 'The payload, the teach pendant, end-of-arm tooling, vision.');
  // the listening checklist MORE PIES as the English name in Dutch (espeak-ng reads PIES as the Dutch "pis");
  // English keeps it, and lower-case words stay
  assert.equal(speakOf(['De checklist MORE PIES komt uit de crisisonderhandeling.'], 'nl'), 'De checklist Mor pais komt uit de crisisonderhandeling.');
  assert.equal(speakOf(['The checklist MORE PIES comes from crisis negotiation.'], 'en'), 'The checklist MORE PIES comes from crisis negotiation.');
  assert.equal(speakOf(['Meer pies en more pies.'], 'nl'), 'Meer pies en more pies.');
  // issue as Dutch project people say it, "isjoe" (espeak-ng reads "is-uu-e"); English keeps it
  assert.equal(speakOf(['Dan wordt het een issue. Twee issues. Issue blijft.'], 'nl'), 'Dan wordt het een isjoe. Twee isjoes. Isjoe blijft.');
  assert.equal(speakOf(['Then it becomes an issue. Two issues.'], 'en'), 'Then it becomes an issue. Two issues.');
  // pm.plan.wbs: scope and scope creep as said in Dutch projects (espeak-ng reads "skoo-pe" and "kreep"),
  // werkpakket and nachtploeg split at the head (espeak-ng stresses werkPAKket, nachtPLOEG); English keeps them
  assert.equal(speakOf(['Scope creep: buiten de scope. Een werkpakket, de werkpakketten, de nachtploeg.'], 'nl'), 'Skoop kriep: buiten de skoop. Een werk-pakket, de werk-pakketten, de nacht-ploeg.');
  assert.equal(speakOf(['Scope creep: out of scope. A work package, the night shift.'], 'en'), 'Scope creep: out of scope. A work package, the night shift.');
  assert.equal(speakOf(['De nachtploeg accepteert het niet.'], 'nl'), 'De nachtploeg accepteert het niet.');
  // pm.perform.tree: the terms the cards show, said as Dutch performance people say them
  assert.equal(speakOf(['Een driver in de driverboom. De balanced scorecard van Kaplan en Norton.'], 'nl'), 'Een draiver in de draiverboom. De bellenst skoorkart van Kaplan en Norten.');
  assert.equal(speakOf(['Gaming, naar Goodhart en Strathern; Locke en Latham.'], 'nl'), 'Geeming, naar Goedhart en Strèthurn; Lok en Leetum.');
  assert.equal(speakOf(['Een voorlopende indicator, achterlopende en gekoppelde indicatoren, een actiegrens.'], 'nl'), 'Een voorlopende indie-kator, achterlopende en gekoppelde indie-katoren, een actie-grens.');
  // other films keep their voice: kleine indicatoren, De actiegrens ligt, het dashboard
  assert.equal(speakOf(['Kleine indicatoren. De actiegrens ligt op 4,5. Een beter dashboard.'], 'nl'), 'Kleine indicatoren. De actiegrens ligt op 4,5. Een beter dashboard.');
  assert.equal(speakOf(['Voor de deadline groeien dashboards; een rapportagecijfer per orderregel.'], 'nl'), 'Voor de dedlain groeien desjbords; een rapportage-cijfer per order-regel.');
  assert.equal(speakOf(['A driver tree, gaming, Goodhart and Strathern, a leading indicator, the balanced scorecard.'], 'en'), 'A driver tree, gaming, Goodhart and Strathern, a leading indicator, the balanced scorecard.');
  // pm.lead.feedback: feedback, the feedbacksandwich and feedforward as Dutch project people say them (espeak-ng
  // reads "feed-bak"), SBI as letters (read as one word, "zbie"), disagree and commit and the English names in a
  // Dutch spelling, and prestatiegesprek, escalatiepad and integriteit stressed on the right part; English keeps
  // them, and pm.plan.method's "feedback van de vloer" keeps the voice it was built with
  assert.equal(speakOf(['Feedback, de feedbacksandwich en feedforward: SBI, van het Center for Creative Leadership.'], 'nl'), 'Fiedbek, de fiedbek-sendwitsj en fiedforwerd: es bee ie, van het Senter for Krie-eetif Liedersjip.');
  assert.equal(speakOf(['Marshall Goldsmith, Edmondson en Jeff Bezos. Disagree and commit, tenzij het over integriteit gaat.'], 'nl'), 'Marsjal Goldsmith, Edmondsen en Djef Beezos. Dissegrie en kommit, tenzij het over in-tegriteit gaat.');
  assert.equal(speakOf(['Een prestatiegesprek, het escalatiepad. De COO: nee.'], 'nl'), 'Een prestatie-gesprek, het escalatie-pad. De C O O: nee.');
  assert.equal(speakOf(['Iets echts, en feedback van de vloer.'], 'nl'), 'Iets echts, en feedback van de vloer.');
  // commitment, the lead example's word, as k'MIT-ment (espeak-ng stresses it at the end); English keeps it, and
  // "disagree and commit" is untouched by it
  assert.equal(speakOf(['Ik heb hun commitment nodig. Commitment, en disagree and commit.'], 'nl'), 'Ik heb hun kmitmunt nodig. Kmitmunt, en dissegrie en kommit.');
  assert.equal(speakOf(['I need their commitment.'], 'en'), 'I need their commitment.');
  assert.equal(speakOf(['Feedback and feedforward: SBI, Marshall Goldsmith, Jeff Bezos. Disagree and commit. The COO.'], 'en'), 'Feedback and feedforward: SBI, Marshall Goldsmith, Jeff Bezos. Disagree and commit. The COO.');
  // pm.land.handover: hypercare as said in Dutch IT projects, "haiperkeer" (espeak-ng reads "hie-per-kaa-re"),
  // the KPI after "de" and KPI's as letters (espeak-ng reads the word "kpie"; "een KPI" and KPI- compounds keep
  // their voice), and compounds split at the head that espeak-ng misreads: acceptatiecriteria (with "ti",
  // lower case only, so pm.plan.wbs's "Acceptatiecriteria:" keeps its voice), PROjectopdracht, PROOsə-zaudit,
  // baTENreview and overdrachts-sx-ecklist; English keeps them all
  assert.equal(speakOf(['Hypercare na de start, met hypercare. De KPI, twee KPI\'s, een KPI, de KPI-review.'], 'nl'),
    'Haiperkeer na de start, met haiperkeer. De K P I, twee K P I\'s, een KPI, de KPI-review.');
  assert.equal(speakOf(['De acceptatiecriteria in de projectopdracht. Projectopdracht, gelaagde procesaudit, de batenreview, de overdrachtschecklist.'], 'nl'),
    'De acceptatie-criteria in de project-opdracht. Project-opdracht, gelaagde proces-audit, de baten-review, de overdrachts-checklist.');
  assert.equal(speakOf(['Acceptatiecriteria: wie tekent af.'], 'nl'), 'Acceptatiecriteria: wie tekent af.');
  assert.equal(speakOf(['Hypercare, the KPI, KPI\'s, acceptance criteria, a layered process audit, the benefits review.'], 'en'),
    'Hypercare, the KPI, KPI\'s, acceptance criteria, a layered process audit, the benefits review.');
  // pm.land.training: Toyota as the Dutch say it, "tojota" (espeak-ng reads "too-ie-oota"); English keeps it
  assert.equal(speakOf(['Toyota nam de methode over, net als Toyota\'s leveranciers.'], 'nl'), 'Tojota nam de methode over, net als Tojota\'s leveranciers.');
  assert.equal(speakOf(['Toyota adopted it.'], 'en'), 'Toyota adopted it.');
  // pm.close.results: controller stressed on the second part (espeak-ng says KON-trol-ler), dekkingsbijdrage
  // split at the head (espeak-ng stresses -bij-DRAA-zje), run chart with a tsj (espeak-ng reads a French sj);
  // English keeps them
  assert.equal(speakOf(['De controller checkt de dekkingsbijdrage. Controllers. Een run chart, Run chart.'], 'nl'), 'De kon-troller checkt de dekkings-bijdrage. Kon-trollers. Een run tsjart, Run tsjart.');
  assert.equal(speakOf(['The controller checks the run chart.'], 'en'), 'The controller checks the run chart.');
  // pm.negotiate.batna: pakketdeal with "deal" as the Dutch say it (espeak-ng drops the d: "pakket-eeal"), framing as
  // "freeming" (espeak-ng reads the Dutch "fraa-ming"), and the example's gecoate beugels and coaten with the English
  // oa (espeak-ng reads "ge-koo-aa-te"; only before beugels, so eng.joining.bonding's "gecoate nagels" keeps its
  // voice); English keeps them all
  assert.equal(speakOf(['Een pakketdeal, twee pakketdeals. Met framing, Framing.'], 'nl'), 'Een pakket-diel, twee pakket-diels. Met freeming, Freeming.');
  assert.equal(speakOf(['Gecoate beugels; zelf coaten kan niet. Gecoate nagels.'], 'nl'), 'Gekoote beugels; zelf kooten kan niet. Gecoate nagels.');
  // and deal on its own as "diel" (espeak-ng reads "dee-al"), integriteit stressed on -TEIT (pm.lead.feedback's in-tegriteit)
  assert.equal(speakOf(['De slechtste deal, twee deals. Deal! Veiligheid en integriteit.'], 'nl'), 'De slechtste diel, twee diels. Diel! Veiligheid en in-tegriteit.');
  assert.equal(speakOf(['A package deal, with framing. Coated brackets. The worst deal; integrity.'], 'en'), 'A package deal, with framing. Coated brackets. The worst deal; integrity.');
});

// ------------------------------------------------------------ WAV files
const pcm = (n, v = 0) => Buffer.alloc(n * 2, v);
test('wav: header written and read back; tracks joined with silence at the timeline positions', () => {
  const a = wavFile(pcm(22050, 1), 22050);
  assert.deepEqual(wavInfo(a), { rate: 22050, channels: 1, bits: 16, dataOffset: 44, dataBytes: 44100, dur: 1 });
  assert.throws(() => wavInfo(Buffer.from('nope')), /WAV/);
  const b = wavFile(pcm(11025, 2), 22050);
  // a at 0.5 s, b at 2 s, 3 s in all
  const track = joinTrack([{ at: 0.5, wav: a }, { at: 2, wav: b }], 3);
  const info = wavInfo(track);
  assert.equal(info.dur, 3);
  const data = track.subarray(info.dataOffset);
  assert.equal(data[0], 0); // silence before a
  assert.equal(data[Math.round(0.5 * 22050) * 2], 1); // a starts at 0.5 s
  assert.equal(data[Math.round(2 * 22050) * 2], 2); // b starts at 2 s
  assert.throws(() => joinTrack([{ at: 0, wav: a }, { at: 0.5, wav: b }], 3), /overlap/);
});

// ------------------------------------------------------------ captions (WebVTT)
test('caption chunks: sentences, long ones split at a comma, none longer than the limit when it can be helped', () => {
  assert.deepEqual(cueChunks('Een zin. Nog een zin! En een vraag?'), ['Een zin.', 'Nog een zin!', 'En een vraag?']);
  const long = 'Dit is een heel lange zin met veel woorden, die op een komma gesplitst moet worden omdat hij anders te lang is voor het scherm.';
  const parts = cueChunks(long, 80);
  assert.equal(parts.join(' '), long);
  assert.ok(parts.length >= 2 && parts.every((p) => p.length <= 80), parts.join(' | '));
  assert.deepEqual(cueChunks('  '), []);
});

test('WebVTT: timestamps, cues per beat timed by length, the file format', () => {
  assert.equal(vttTime(0), '00:00:00.000');
  assert.equal(vttTime(83.2567), '00:01:23.257');
  assert.equal(vttTime(3725), '01:02:05.000');
  const data = { scenes: [{ beats: [{ say: { nl: ['Kort. ', { t: 'Langer', c: 'x', en: 'longer' }, ' en nog langer.'] } }] }] };
  const atl = { scenes: [{ start: 0, dur: 5, beats: [{ start: 1, dur: 3 }] }], total: 5 };
  const cues = cuesOf(data, atl, 'nl');
  assert.equal(cues.length, 2);
  assert.deepEqual(cues.map((c) => c.text), ['Kort.', 'Langer en nog langer.']);
  assert.equal(cues[0].start, 1);
  assert.equal(cues[1].end, 4);
  assert.ok(cues[0].end === cues[1].start && cues[0].end > 1.3 && cues[0].end < 2, String(cues[0].end));
  const vtt = vttOf(cues);
  assert.match(vtt, /^WEBVTT\n\n1\n00:00:01\.000 --> 00:00:0\d\.\d{3}\nKort\.\n\n2\n/);
  assert.ok(vtt.endsWith('Langer en nog langer.\n'));
  // a cue text never carries markup
  assert.equal(vttOf([{ start: 0, end: 1, text: 'a <b> & c' }]).split('\n')[4], 'a &lt;b&gt; &amp; c');
});

test('gloss case: an ordinary word is lowered, a proper noun and an acronym keep their capitals', () => {
  const corpus = 'Use the Taylor equation. A turn-mill centre turns and mills. Cutting speed matters; the cutting speed is set.';
  assert.equal(glossCase('Cutting speed', corpus), 'cutting speed');
  assert.equal(glossCase('Turn-mill centre', corpus), 'turn-mill centre');
  assert.equal(glossCase('Taylor equation', corpus), 'Taylor equation');
  assert.equal(glossCase('HSS', corpus), 'HSS');
  assert.equal(glossCase('C-axis', corpus), 'C-axis');
  // a title with a later capitalised word is a name, even when its first word also occurs in lower case
  assert.equal(glossCase('Machinery Regulation', `${corpus} Old machinery stays.`), 'Machinery Regulation');
  // a word the corpus never writes mid-sentence is treated as ordinary
  assert.equal(glossCase('Cemented carbide', corpus), 'cemented carbide');
  // a name with its own parenthesis is glossed with a comma, never nested brackets
  assert.equal(glossCase('Direct on line (DOL)', corpus), 'direct on line, DOL');
});

test('glossed subtitles: a Dutch term shows its English word once, in parentheses; the voice text is untouched', () => {
  const seg = ['Een ', { t: 'wisselplaat', en: 'carbide insert' }, ' snijdt, en de ', { t: 'snijsnelheid', en: 'cutting speed' }, ' telt. Ook ', { t: 'H7', en: 'H7' }, '.'];
  assert.deepEqual(phrasesOf(seg), [['Een wisselplaat snijdt,', 'en de snijsnelheid telt.'], ['Ook H7.']]);
  // a gloss equal to the term as shown (H7, CAM) is left out
  assert.deepEqual(phrasesOf(seg, { gloss: true }), [['Een wisselplaat (carbide insert) snijdt,', 'en de snijsnelheid (cutting speed) telt.'], ['Ook H7.']]);
  // English scripts carry no gloss: unchanged
  assert.deepEqual(phrasesOf(['A ', { t: 'carbide insert' }, ' cuts.'], { gloss: true }), [['A carbide insert cuts.']]);
  // a glossed phrase too long for one cue is cut after the gloss
  assert.deepEqual(cueChunks('Daarom bewaart de gereedschapscorrectie (tool offset) van elk gereedschap de lengte en de radius.', 84),
    ['Daarom bewaart de gereedschapscorrectie (tool offset)', 'van elk gereedschap de lengte en de radius.']);
});

// The voice rework (2026-11-09, films/_kit/voice-ab): one Piper call per
// sentence (commas stay inside, so the voice keeps its sentence melody), the
// pauses between sentences, beats and scenes laid from one place, and the
// subtitle cues cut at word boundaries measured inside the sentence clip.
test('pauses: commas stay inside a sentence clip; full stop, beat and scene hold from one place', () => {
  assert.ok(!('comma' in PAUSES), 'no laid pause at a comma: the voice says the comma itself');
  assert.ok(PAUSES.sentence >= 0.5 && PAUSES.sentence <= 0.7, `sentence ${PAUSES.sentence}`);
  assert.ok(PAUSES.beat >= 0.8 && PAUSES.beat <= 1, `beat ${PAUSES.beat}`);
  assert.ok(PAUSES.hold >= 0.7 && PAUSES.hold <= 0.9, `hold ${PAUSES.hold}`);
  assert.equal(AUDIO_GAPS.gap, PAUSES.beat);
  assert.equal(AUDIO_GAPS.hold, PAUSES.hold);
  // a beat is its sentence clips with a full-stop pause in between
  const p = PAUSES.sentence;
  assert.deepEqual(beatLayout(2, [1.5, 2, 0.5]), [{ start: 2, dur: 1.5 }, { start: Math.round((3.5 + p) * 1000) / 1000, dur: 2 }, { start: Math.round((5.5 + 2 * p) * 1000) / 1000, dur: 0.5 }]);
  assert.equal(beatLength([1.5, 2, 0.5]), Math.round((4 + 2 * p) * 1000) / 1000);
  assert.equal(beatLength([3]), 3);
});

test('sentence clips: one per sentence, commas inside; the voice text has units as words, the subtitle phrases keep the gloss', () => {
  const seg = ['Het ', { t: 'toerental', en: 'spindle speed', k: 'a#1' }, ' is 1.167 omw/min, ongeveer. Hoe dunner de as, hoe sneller.'];
  const s = sentenceClips(seg, 'nl');
  assert.equal(s.length, 2);
  assert.equal(s[0].said, 'Het toerental is 1.167 omw/min, ongeveer.');
  assert.equal(s[0].spoken, 'Het toerental is 11honderd 67 omwentelingen per minuut, ongeveer.');
  assert.deepEqual(s[0].phrases, ['Het toerental is 1.167 omw/min,', 'ongeveer.']);
  assert.deepEqual(s[0].glossed, ['Het toerental (spindle speed) is 1.167 omw/min,', 'ongeveer.']);
  assert.equal(s[1].spoken, 'Hoe dunner de as, hoe sneller.', 'the comma stays in the clip');
  assert.deepEqual(s[1].phrases, ['Hoe dunner de as,', 'hoe sneller.']);
  // the voice never gets raw phoneme pieces: the lexicon is swapped into the
  // whole sentence's phonemes by films/_kit/speak.py
  assert.ok(sentenceClips(['De klauwplaat draait.'], 'nl').every((c) => !c.spoken.includes('[[')));
  assert.equal(spokenOf('f 0,3 mm', 'nl'), 'f 0,3 millimeter');
});

test('word timing: the spoken words’ measured spans mapped back to the written words', () => {
  const said = 'Het toerental is 1.167 omw/min.';
  // spoken: Het toerental is 11honderd 67 omwentelingen per minuut. (8 words)
  const sp = [[0.04, 0.2], [0.25, 0.8], [0.85, 1], [1.05, 1.6], [1.62, 2.1], [2.2, 2.9], [2.95, 3.1], [3.15, 3.6]].map(([start, end]) => ({ start, end }));
  const w = saidWordSpans(said, 'nl', sp);
  assert.equal(w.length, 5);
  assert.deepEqual(w[3], { start: 1.05, end: 2.1 }, '1.167 is said as two words');
  assert.deepEqual(w[4], { start: 2.2, end: 3.6 }, 'omw/min is said as three');
  assert.throws(() => saidWordSpans(said, 'nl', sp.slice(1)), /spoken words/);
});

test('forced alignment fallback: Whisper’s words matched to the known script, every word timed in order', () => {
  const tokens = ['De', 'klauwplaat', 'laat', 'een', 'stalen', 'as', 'draaien.'];
  const heard = [
    { word: ' De', start: 0.1, end: 0.2 }, { word: ' klauw', start: 0.25, end: 0.5 }, { word: 'plaat', start: 0.5, end: 0.8 },
    { word: ' laat', start: 0.9, end: 1.1 }, { word: ' een', start: 1.15, end: 1.25 }, { word: ' stalenas', start: 1.3, end: 2 }, { word: ' draaien.', start: 2.1, end: 2.6 },
  ];
  const sp = forceAlign(tokens, heard);
  assert.equal(sp.length, tokens.length);
  assert.equal(sp[1].start, 0.25);
  assert.equal(sp[1].end, 0.8, 'a word Whisper split in two');
  assert.ok(sp[4].start >= 1.3 && sp[4].end <= sp[5].start + 1e-9 && sp[5].end <= 2 + 1e-9, 'two words Whisper glued together');
  assert.equal(sp[6].end, 2.6);
  for (let i = 1; i < sp.length; i++) assert.ok(sp[i].start >= sp[i - 1].end - 1e-9 && sp[i].end >= sp[i].start, `in order at ${i}`);
  // a word Whisper did not hear at all still gets a place between its neighbours
  const gap = forceAlign(['een', 'grote', 'as'], [{ word: 'een', start: 0, end: 0.3 }, { word: 'as', start: 1, end: 1.3 }]);
  assert.ok(gap[1].start >= 0.3 && gap[1].end <= 1);
});

test('subtitle cues: cut at word boundaries inside the sentence clip, the gloss in the subtitle only', () => {
  const w = (a, b) => ({ start: a, end: b });
  // one sentence clip from 10 s; Piper's lead-in is trimmed, so the first word starts near the clip start
  const sentence = {
    phrases: ['Dit is een lange zin met heel veel woorden erin,', 'die na de komma nog een flink eind doorgaat.'],
    glossed: ['Dit is een lange zin (sentence) met heel veel woorden erin,', 'die na de komma nog een flink eind doorgaat.'],
  };
  const words = [[10.04, 10.2], [10.2, 10.3], [10.3, 10.4], [10.4, 10.7], [10.7, 10.9], [10.9, 11], [11, 11.2], [11.2, 11.4], [11.4, 11.8], [11.8, 12.1],
    [12.5, 12.6], [12.6, 12.7], [12.7, 12.8], [12.8, 13.1], [13.1, 13.3], [13.3, 13.4], [13.4, 13.7], [13.7, 13.9], [13.9, 14.5]].map(([a, b]) => w(a, b));
  const ph = timedPhrases(sentence, words);
  assert.deepEqual(ph.map((p) => [p.start, Math.round((p.start + p.dur) * 1000) / 1000, p.text]), [[10.04, 12.1, sentence.glossed[0]], [12.5, 14.5, sentence.glossed[1]]]);
  const cues = cuesOfLines([ph]);
  assert.deepEqual(cues.map((c) => [c.start, c.end]), [[10.04, 12.1], [12.5, 14.5]], 'cut between the phrases at the words’ real times');
  // a single phrase too long for one cue is cut at a space, timed by its words (not by length)
  const long = 'Daarom bewaart de gereedschapscorrectie (tool offset) van elk gereedschap de lengte en de radius.';
  const lw = Array.from({ length: 12 }, (_, i) => w(i, i + 0.9));
  const lc = cuesOfLines([[{ start: 0, dur: 11.9, text: long, words: lw }]]);
  assert.deepEqual(lc.map((c) => c.text), ['Daarom bewaart de gereedschapscorrectie (tool offset)', 'van elk gereedschap de lengte en de radius.']);
  assert.deepEqual(lc.map((c) => [c.start, c.end]), [[0, 3.9], [4, 11.9]], 'the cut sits between word 4 and word 5');
  assert.ok(cues.every((c) => c.text.length <= SUB_MAX));
});

test('the voice is configuration: films/_kit/voices.json names the voice and speed per language, the code names none', () => {
  const v = JSON.parse(fs.readFileSync('films/_kit/voices.json', 'utf8'));
  assert.deepEqual([v.nl.model, v.nl.length], ['nl_NL-alex-medium', 1.27], 'Merijn’s pick (2026-11-09): alex, about 8 % slower than the A/B sample at 1.15');
  assert.deepEqual([v.en.model, v.en.length], ['en_GB-alan-medium', 0.92]);
  assert.deepEqual(voiceOf('nl', v), { model: 'nl_NL-alex-medium', path: 'nl/nl_NL/alex/medium', length: 1.27 });
  assert.equal(voiceOf('nl', v, 'nl_NL-pim-medium:0.9').path, 'nl/nl_NL/pim/medium', 'a one-off override for an A/B listen');
  assert.equal(voiceOf('nl', v, 'nl_NL-pim-medium:0.9').length, 0.9);
  assert.throws(() => voiceOf('de', v), /voice/);
  for (const f of ['films/_kit/narrate.mjs', 'films/_kit/speak.py', 'films/_kit/render.mjs']) assert.ok(!/ronnie|nl_NL-alex|en_GB-alan/.test(fs.readFileSync(f, 'utf8')), `${f} names a voice`);
});

test('lexicon: small and hand-checked, swapped into the whole sentence; the seeded one is retired', () => {
  const nl = JSON.parse(fs.readFileSync('films/_kit/lexicon.nl.json', 'utf8'));
  assert.ok(Object.keys(nl).length <= 19,`${Object.keys(nl).length} entries: each entry must be listened to`);
  for (const w of ['klauwplaat', 'omwenteling', 'omwentelingen', 'toerental']) assert.ok(nl[w], w);
  assert.ok(!('hardmetaal' in nl), 'hardmetaal was heard worse with an entry');
  for (const lang of ['nl', 'en']) {
    const l = JSON.parse(fs.readFileSync(`films/_kit/lexicon.${lang}.json`, 'utf8'));
    for (const [word, ipa] of Object.entries(l)) {
      assert.equal(word, word.toLowerCase());
      assert.ok(ipa.includes('ˈ') && !/[[\]\s]/.test(ipa), `${lang} ${word}: ${ipa}`);
    }
  }
  // omWENteling, KLAUWplaat
  for (const word of ['omwenteling', 'omwentelingen']) assert.ok(nl[word].includes('ʋˈɛn'), `${word}: ${nl[word]}`);
  assert.ok(/^klˈ/.test(nl.klauwplaat));
  // Ó-lie, ci-LIN-der, ma-no-MÉ-ter (espeak-ng says oLIE, CIlinder, MAnometer; 2026-11-11)
  assert.ok(/^ˈoː/.test(nl.olie));
  for (const word of ['cilinder', 'cilinders']) assert.ok(nl[word].includes('lˈɪn'), `${word}: ${nl[word]}`);
  for (const word of ['manometer', 'manometers']) assert.ok(nl[word].includes('mˈeː'), `${word}: ${nl[word]}`);
  // com-PRES-sor (espeak-ng says KOMpressor; 2026-11-12); compressoren it already reads right
  assert.ok(nl.compressor.includes('prˈɛs'), `compressor: ${nl.compressor}`);
  // DOOR-snede (espeak-ng says door-SNE-de; 2026-11-12); doorsneden it already reads right
  assert.ok(/^dˈɔːr/.test(nl.doorsnede), `doorsnede: ${nl.doorsnede}`);
  // a-lu-MI-nium (espeak-ng says AA-lu-minium; 2026-11-12)
  assert.ok(nl.aluminium.includes('mˈi'), `aluminium: ${nl.aluminium}`);
  // pro-JECT (espeak-ng says PRO-ject; 2026-11-12): audio only, at the next render; no rendered film says it
  assert.ok(nl.project.includes('jˈɛ'), `project: ${nl.project}`);
  // pro-JEC-ten likewise (2026-11-12, pm.land.training); swapped at its own word since the word-aligned swap.
  // Said by eng.gridbasics.congestion, pm.run.scope and pm.land.training, none rendered yet
  assert.ok(nl.projecten.includes('jˈɛ'), `projecten: ${nl.projecten}`);
  // no [[ ]] pieces cut into the text any more (piper-tts splits the sentence at each)
  assert.ok(!fs.existsSync('films/_kit/lexicon.mjs') && !fs.existsSync('films/_kit/lexicon/seed.py'));
  const speak = fs.readFileSync('films/_kit/speak.py', 'utf8');
  assert.ok(speak.includes('def sentence_phonemes'), 'whole-sentence injection');
});

// films/_kit/speak.py word_spans, run alone (python3's standard library only:
// the function is cut out of the file, so piper and numpy are not needed).
function wordSpans(counts, groups) {
  const py = [
    'import ast, json, sys',
    'src = open(sys.argv[1], encoding="utf-8").read()',
    'fn = next(n for n in ast.parse(src).body if isinstance(n, ast.FunctionDef) and n.name == "word_spans")',
    'ns = {}',
    'exec(compile(ast.Module(body=[fn], type_ignores=[]), "speak.py", "exec"), ns)',
    'counts, groups = json.loads(sys.stdin.read())',
    'print(json.dumps(ns["word_spans"](counts, groups)))',
  ].join('\n');
  const r = spawnSync('python3', ['-I', '-c', py, 'films/_kit/speak.py'], { input: JSON.stringify([counts, groups]), encoding: 'utf8' });
  if (r.error) return null;
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
}
test('speak.py word timing: each spoken word gets its phoneme words; a word espeak-ng glues on takes no time', (t) => {
  const g = [[0, 10], [12, 20], [25, 40], [41, 50]];
  const plain = wordSpans([1, 2, 3, 4], g);
  if (plain === null) return t.skip('no python3');
  assert.deepEqual(plain, [[0, 10], [12, 20], [25, 40], [41, 50]]);
  // a word read as two phoneme words; a word glued to the one before it
  assert.deepEqual(wordSpans([2, 2, 4], g), [[0, 20], [20, 20], [25, 50]]);
  // "… or use it as it is.": espeak-ng reads the prefixes "… as" and "… as it"
  // as separate words, the whole sentence glues "as it is." into one
  // (ˌæzɪtˈɪz), so the count per prefix goes 3, 4, 3 (was an IndexError)
  assert.deepEqual(wordSpans([1, 2, 3, 4, 3], g.slice(0, 3)), [[0, 10], [12, 20], [25, 40], [40, 40], [40, 40]]);
});

// films/_kit/speak.py swap_lexicon, run alone like word_spans (with PUNCT and re).
function swapLexicon(ph, toks, counts, lex, alone) {
  const py = [
    'import ast, json, re, sys',
    'src = open(sys.argv[1], encoding="utf-8").read()',
    'body = [n for n in ast.parse(src).body if (isinstance(n, ast.FunctionDef) and n.name in ("swap_lexicon", "word_groups")) or (isinstance(n, ast.Assign) and any(getattr(t, "id", "") == "PUNCT" for t in n.targets))]',
    'ns = {"re": re}',
    'exec(compile(ast.Module(body=body, type_ignores=[]), "speak.py", "exec"), ns)',
    'print(json.dumps(ns["swap_lexicon"](*json.loads(sys.stdin.read())), ensure_ascii=False))',
  ].join('\n');
  const r = spawnSync('python3', ['-I', '-c', py, 'films/_kit/speak.py'], { input: JSON.stringify([ph, toks, counts, lex, alone]), encoding: 'utf8' });
  if (r.error) return null;
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
}
test('speak.py lexicon swap: a word is swapped at its own position, never inside another word that holds its phonemes', (t) => {
  const lex = { project: 'prɔjˈɛkt' };
  const alone = { project: 'prˈoːjɛkt' };
  // "projecten" comes first and starts with the phonemes of "project"
  const r = swapLexicon('də prˈoːjɛktən ɛn ɦɛt prˈoːjɛkt.', ['De', 'projecten', 'en', 'het', 'project.'], [1, 2, 3, 4, 5], lex, alone);
  if (r === null) return t.skip('no python3');
  assert.deepEqual(r, ['də prˈoːjɛktən ɛn ɦɛt prɔjˈɛkt.', ['project'], []]);
  // twice in a sentence: both, each at its own place; punctuation stays
  assert.deepEqual(swapLexicon('prˈoːjɛkt, prˈoːjɛktən, prˈoːjɛkt.', ['Project,', 'projecten,', 'project.'], [1, 2, 3], lex, alone)[0], 'prɔjˈɛkt, prˈoːjɛktən, prɔjˈɛkt.');
  // a word espeak-ng reads as two phoneme words: searched across both
  assert.deepEqual(swapLexicon('ɦɛt prˈoː jɛkt lˈoːpt', ['het', 'project', 'loopt'], [1, 3, 4], { project: 'X' }, { project: 'prˈoː jɛkt' })[0], 'ɦɛt X lˈoːpt');
  // glued onto the word before it (no phoneme word of its own): searched in that one
  assert.deepEqual(swapLexicon('ɦɛtprˈoːjɛkt lˈoːpt', ['het', 'project', 'loopt'], [1, 1, 2], lex, alone)[0], 'ɦɛtprɔjˈɛkt lˈoːpt');
  // not read the same way in the sentence: left alone, with a warning
  const miss = swapLexicon('də proːjˈɛkt', ['de', 'project'], [1, 2], lex, alone);
  assert.equal(miss[0], 'də proːjˈɛkt');
  assert.deepEqual(miss[1], []);
  assert.match(miss[2][0], /lexicon: espeak form of "project"/);
  // counts that do not fit the sentence's phoneme words: whole phoneme words only
  assert.deepEqual(swapLexicon('də prˈoːjɛktən ɛn prˈoːjɛkt.', ['De', 'projecten', 'en', 'project.'], [1, 2, 3, 5], lex, alone)[0], 'də prˈoːjɛktən ɛn prɔjˈɛkt.');
});

// The listen guard (films/_kit/listen-guard.mjs) on a synthetic track: "speech"
// is a tone, silence is zero.
const RATE = 8000;
function track(parts, total) {
  const a = new Float32Array(Math.round(total * RATE));
  for (const [t0, t1] of parts) for (let i = Math.round(t0 * RATE); i < Math.round(t1 * RATE); i++) a[i] = 0.3 * Math.sin(i / 3);
  return a;
}
test('listen guard: silences inside a sentence, full-stop pauses and cue texts are checked on the rendered track', () => {
  // beat: two sentences, 0.68 s apart; the second has a comma pause of 0.3 s inside
  const sentences = [
    { beat: '1.1', start: 1, end: 3, said: 'De as draait.', words: [['De', 1, 1.3], ['as', 1.3, 1.9], ['draait.', 1.9, 3]] },
    { beat: '1.1', start: 3.68, end: 6, said: 'Hoe dunner, hoe sneller.', words: [['Hoe', 3.68, 4], ['dunner,', 4, 4.6], ['hoe', 4.9, 5.3], ['sneller.', 5.3, 6]] },
  ].map((s) => ({ ...s, words: s.words.map(([w, start, end]) => ({ w, start, end })) }));
  const cues = [{ start: 1, end: 3, text: 'De as (shaft) draait.' }, { start: 3.68, end: 6, text: 'Hoe dunner, hoe sneller.' }];
  const good = track([[1, 3], [3.68, 4.6], [4.9, 6]], 7);
  const r = listenGuard({ samples: good, rate: RATE, sentences, cues, lang: 'nl' });
  assert.deepEqual(r.errors, []);
  assert.equal(r.ok, true);
  assert.equal(r.stats.stops.n, 1);
  assert.ok(Math.abs(r.stats.stops.median - 0.68) < 0.05, String(r.stats.stops.median));
  assert.ok(r.stats.maxInside < 0.4 && r.stats.maxInside > 0.25, String(r.stats.maxInside));
  // a silence of 1 s inside a sentence (the old per-phrase clips) fails
  const gappy = track([[1, 3], [3.68, 4.6], [5.6, 6]], 7);
  assert.match(listenGuard({ samples: gappy, rate: RATE, sentences, cues, lang: 'nl' }).errors.join('\n'), /silence of 1\.0\d? s inside/);
  // a full stop with a 1.5 s pause fails, so does one with none
  const late = sentences.map((s, i) => (i ? { ...s, start: s.start + 1, end: s.end + 1, words: s.words.map((x) => ({ ...x, start: x.start + 1, end: x.end + 1 })) } : s));
  const lateTrack = track([[1, 3], [4.68, 5.6], [5.9, 7]], 8);
  assert.match(listenGuard({ samples: lateTrack, rate: RATE, sentences: late, cues: [cues[0], { ...cues[1], start: 4.68, end: 7 }], lang: 'nl' }).errors.join('\n'), /full-stop pause of 1\.\d+ s/);
  // a cue whose text is not the words spoken in its span fails, as does one that starts early
  assert.match(listenGuard({ samples: good, rate: RATE, sentences, cues: [cues[0], { ...cues[1], text: 'Hoe dunner, hoe beter.' }], lang: 'nl' }).errors.join('\n'), /cue 2/);
  assert.match(listenGuard({ samples: good, rate: RATE, sentences, cues: [{ ...cues[0], start: 0.4 }, cues[1]], lang: 'nl' }).errors.join('\n'), /cue 1/);
  // the word error rate counts when Whisper ran
  assert.equal(werLimit('large-v3-turbo'), 0.15);
  assert.equal(werLimit('small'), 0.2);
  assert.match(listenGuard({ samples: good, rate: RATE, sentences, cues, lang: 'nl', wer: { model: 'small', wer: 0.31 } }).errors.join('\n'), /word error rate 31/);
});

test('render refuses to finish when the listen guard fails', () => {
  const src = fs.readFileSync('films/_kit/render.mjs', 'utf8');
  assert.match(src, /import \{[^}]*runGuard[^}]*\} from '\.\/listen-guard\.mjs'/);
  assert.match(src, /if \(!guard\.ok\)[^\n]*throw/);
  assert.ok(src.indexOf('runGuard(') < src.indexOf('manifestWith(manifest'), 'the guard runs before the manifest is written');
});

// Kept from the per-phrase kit: the subtitle phrases and their cue rules.
test('subtitle phrases: a short phrase rides with the next one, a decimal comma is no break, long sentences cut between phrases', () => {
  const seg = ['De ', { t: 'Voeding', k: 'x#0', en: 'feed' }, ' is 0,3 mm. Hoe dunner de as wordt, hoe sneller hij draait. Zo ver.'];
  assert.deepEqual(phrasesOf(seg), [['De Voeding is 0,3 mm.'], ['Hoe dunner de as wordt,', 'hoe sneller hij draait.'], ['Zo ver.']]);
  // a decimal comma is no phrase break; a short phrase rides with the next one
  assert.deepEqual(phrasesOf(['Hier, bij 1.167 toeren, is f 0,3 mm.']), [['Hier, bij 1.167 toeren,', 'is f 0,3 mm.']]);
  const cues = cuesOfLines([
    [{ start: 1, dur: 2, text: 'Kort.' }],
    [{ start: 3.5, dur: 2.5, text: 'Dit is een lange zin met heel veel woorden erin,' }, { start: 6.2, dur: 3, text: 'die na de komma nog een flink eind doorgaat.' }],
  ]);
  assert.deepEqual(cues[0], { start: 1, end: 3, text: 'Kort.' });
  assert.deepEqual(cues.slice(1).map((c) => [c.start, c.end]), [[3.5, 6], [6.2, 9.2]], 'a long sentence is cut between its phrases, at their real times');
  assert.ok(cues.every((c) => c.text.length <= SUB_MAX));
  assert.equal(cuesOfLines([[{ start: 0, dur: 2, text: 'Een korte zin,' }, { start: 2.2, dur: 1, text: 'die kort blijft.' }]]).length, 1);
  // the subtitle of a Dutch phrase carries the English word of a term (first use);
  // the voice's phrases skip it, and both are cut into the same phrases
  // (a short phrase rides with the next one by its spoken words, gloss or not)
  const glossed = [{ t: 'Smeltbad', en: 'weld pool', k: 'a#1' }, ', zegt hij, is heet. Een ', { t: 'WBZ', en: 'HAZ', k: 'a#2' }, ' volgt.'];
  assert.deepEqual(phrasesOf(glossed), [['Smeltbad, zegt hij,', 'is heet.'], ['Een WBZ volgt.']]);
  assert.deepEqual(phrasesOf(glossed, { gloss: true }), [['Smeltbad (weld pool), zegt hij,', 'is heet.'], ['Een WBZ (HAZ) volgt.']]);
  const plain = ['Het ', { t: 'toerental', k: 'x#0' }, ' is 1.167 omw/min.'];
  assert.deepEqual(phrasesOf(plain, { gloss: true }), phrasesOf(plain));
});

test('render mode shows no caption band: the video subtitles come from its WebVTT track only', () => {
  const src = fs.readFileSync('films/_kit/player.mjs', 'utf8');
  assert.ok(src.includes('.fp[data-render="1"]:not([data-poster="1"]) .fp-cap{display:none}'));
});

// ------------------------------------------------------------ the manifest
test('manifest: the public URL pattern and an entry per film and language', () => {
  assert.equal(MANIFEST_BASE, 'https://ysybqtdzcutmyabfwijl.supabase.co/storage/v1/object/public/films');
  assert.equal(filmUrl(MANIFEST_BASE, 'eng.machining.turning', 'en'), `${MANIFEST_BASE}/eng.machining.turning/en.mp4`);
  const m1 = manifestWith(null, 'eng.x.y', 'nl', { dur: 181.26, bytes: 9000000, scenes: [0, 20.5] });
  assert.equal(m1.base, MANIFEST_BASE);
  assert.equal(m1.pattern, '{base}/{id}/{lang}.mp4');
  assert.deepEqual(m1.films['eng.x.y'].nl, { dur: 181.3, bytes: 9000000, scenes: [0, 20.5], vtt: 'src/content/courses/films/eng.x.y.nl.vtt' });
  assert.equal(m1.films['eng.x.y'].poster, 'src/content/courses/films/eng.x.y.jpg');
  const m2 = manifestWith(m1, 'eng.x.y', 'en', { dur: 170, bytes: 8000000, scenes: [0, 19] });
  assert.ok(m2.films['eng.x.y'].nl && m2.films['eng.x.y'].en);
  assert.ok(!m1.films['eng.x.y'].en, 'the old manifest is not changed');
  assert.throws(() => manifestWith(null, '../x', 'nl', { dur: 1, bytes: 1, scenes: [0] }), /id/);
  assert.throws(() => manifestWith(null, 'eng.x.y', 'de', { dur: 1, bytes: 1, scenes: [0] }), /lang/);
});

// Merijn's rules for the shipped subtitles: they are exactly the spoken words;
// in Dutch a term's English word is shown once, in parentheses, and never
// spoken; English has no glosses. Checked for every film's committed VTT
// against the narration script in its film page.
const vttText = (vtt) => vtt.replace(/\r/g, '').split(/\n\n+/).slice(1)
  .map((block) => block.split('\n').filter((l) => l && !/^\d+$/.test(l) && !l.includes('-->')).join(' '))
  .join(' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
test('shipped subtitles: the spoken words exactly, a Dutch term’s English word once in parentheses, never spoken; no glosses in English', () => {
  const m = JSON.parse(fs.readFileSync('src/content/courses/films/manifest.json', 'utf8'));
  const ids = Object.keys(m.films);
  assert.ok(ids.length >= 5);
  for (const id of ids) {
    const data = filmDataOf(fs.readFileSync(`src/content/courses/films/${id}.html`, 'utf8'));
    assert.ok(data, `${id}: film data`);
    const beats = data.scenes.flatMap((s) => s.beats).filter((b) => b.say);
    for (const lang of ['nl', 'en']) {
      const segs = beats.map((b) => b.say[lang]);
      const terms = segs.flat().filter((p) => typeof p !== 'string');
      const glossed = terms.filter((p) => p.en && p.en.toLowerCase() !== p.t.toLowerCase());
      if (lang === 'en') assert.equal(terms.filter((p) => p.en).length, 0, `${id} en: a gloss in the English script`);
      // the voice: the phrases as said, the same words as the script, no gloss
      const said = segs.map((seg) => saidOf(seg)).join(' ');
      assert.equal(segs.map((seg) => phrasesOf(seg).flat().join(' ')).join(' '), said, `${id} ${lang}: the clips say the script`);
      for (const b of beats) assert.equal(b.voice[lang], speakOf(b.say[lang], lang), `${id} ${lang}: voice`);
      for (const p of glossed) assert.ok(!said.includes(`(${p.en})`) && !beats.some((b) => b.voice[lang].includes(`(${p.en})`)), `${id} ${lang}: "${p.en}" is spoken`);
      // the subtitles: the glossed phrases, cue by cue
      const sub = vttText(fs.readFileSync(m.films[id][lang].vtt, 'utf8'));
      assert.equal(sub, segs.map((seg) => phrasesOf(seg, { gloss: true }).flat().join(' ')).join(' '), `${id} ${lang}: subtitles = script with glosses`);
      // with each gloss taken out, they are the spoken words exactly
      let plain = sub;
      for (const p of glossed) {
        const at = plain.indexOf(`${p.t} (${p.en})`);
        assert.ok(at >= 0, `${id} ${lang}: no "${p.t} (${p.en})" in the subtitles`);
        plain = plain.slice(0, at) + p.t + plain.slice(at + p.t.length + p.en.length + 3);
      }
      assert.equal(plain, said, `${id} ${lang}: subtitles without glosses = the spoken words`);
      // each term's English word once
      const keys = glossed.map((p) => p.k);
      assert.equal(new Set(keys).size, keys.length, `${id} ${lang}: a term glossed twice`);
    }
  }
});

test('the committed manifest: every film has nl and en, an https URL on the films bucket, sizes and durations', () => {
  const m = JSON.parse(fs.readFileSync('src/content/courses/films/manifest.json', 'utf8'));
  assert.equal(m.base, MANIFEST_BASE);
  assert.ok(Object.keys(m.films).length >= 1);
  for (const [id, f] of Object.entries(m.films)) {
    assert.ok(fs.existsSync(`src/content/courses/films/${id}.html`), `${id}: no HTML film to fall back on`);
    assert.ok(fs.existsSync(f.poster), `${id}: poster ${f.poster} missing`);
    for (const lang of ['nl', 'en']) {
      const v = f[lang];
      assert.ok(v, `${id}: no ${lang} video`);
      assert.ok(v.dur >= 60 && v.dur <= 360, `${id} ${lang}: ${v.dur} s`);
      assert.ok(v.bytes > 100000 && v.bytes < 60e6, `${id} ${lang}: ${v.bytes} bytes`);
      assert.ok(fs.existsSync(v.vtt) && fs.readFileSync(v.vtt, 'utf8').startsWith('WEBVTT'), `${id} ${lang}: captions ${v.vtt}`);
      assert.ok(v.scenes[0] === 0 && v.scenes.every((s, i) => i === 0 || s > v.scenes[i - 1]) && v.scenes.at(-1) < v.dur, `${id} ${lang}: scene starts`);
      assert.match(videoOf(m, id, lang).url, /^https:\/\/[a-z]+\.supabase\.co\/storage\/v1\/object\/public\/films\/[a-z0-9.]+\/(nl|en)\.mp4\?v=\d+$/);
    }
  }
});

// ------------------------------------------------------------ the app: which video
test('videoOf: the video in the app language, with captions, poster and a start scene; null when there is none', () => {
  const m = manifestWith(manifestWith(null, 'eng.x.y', 'nl', { dur: 100, bytes: 5e6, scenes: [0, 20, 50] }), 'eng.x.y', 'en', { dur: 90, bytes: 4e6, scenes: [0, 18, 45] });
  assert.deepEqual(videoOf(m, 'eng.x.y', 'en'), {
    url: `${MANIFEST_BASE}/eng.x.y/en.mp4?v=4000000`, vtt: 'src/content/courses/films/eng.x.y.en.vtt', poster: 'src/content/courses/films/eng.x.y.jpg', dur: 90, start: 0,
  });
  assert.equal(videoOf(m, 'eng.x.y', 'nl', 3).start, 50);
  assert.equal(videoOf(m, 'eng.x.y', 'nl', 9).start, 50);
  assert.equal(videoOf(m, 'eng.x.y', 'fr').url, `${MANIFEST_BASE}/eng.x.y/nl.mp4?v=5000000`);
  // a re-rendered film is a new URL (its size is the version), so no browser or
  // film cache can play the old video under the new captions
  const again = manifestWith(m, 'eng.x.y', 'nl', { dur: 100, bytes: 5000001, scenes: [0, 20, 50] });
  assert.notEqual(videoOf(again, 'eng.x.y', 'nl').url, videoOf(m, 'eng.x.y', 'nl').url);
  assert.equal(videoOf(m, 'eng.other', 'nl'), null);
  assert.equal(videoOf(null, 'eng.x.y', 'nl'), null);
  assert.equal(videoOf({ films: { 'eng.x.y': { nl: { dur: 1 } } } }, 'eng.x.y', 'nl'), null, 'no base, no URL');
  // only a public https URL on Supabase storage
  assert.equal(videoOf({ ...m, base: 'javascript:alert(1)//' }, 'eng.x.y', 'nl'), null);
});

// ------------------------------------------------------------ the app: read along
test('read along: the narration script per scene in the app language, terms marked, English words only in Dutch', () => {
  const data = {
    scenes: [
      { title: { nl: 'De snede', en: 'The cut' }, beats: [{ say: { nl: ['Een ', { t: 'wisselplaat', en: 'carbide insert', c: 'i' }, ' snijdt.'], en: ['A ', { t: 'carbide insert', c: 'i' }, ' cuts.'] } }, { say: { nl: ['Tweede zin.'], en: ['Second line.'] } }] },
      { title: { nl: 'Leeg', en: 'Empty' }, beats: [{}] },
    ],
  };
  assert.deepEqual(readAlong(data, 'nl'), [{ n: 1, title: 'De snede', paras: [['Een ', { t: 'wisselplaat', en: 'carbide insert' }, ' snijdt.'], ['Tweede zin.']] }]);
  assert.deepEqual(readAlong(data, 'en')[0].paras[0], ['A ', { t: 'carbide insert' }, ' cuts.']);
  assert.deepEqual(readAlong({ scenes: [] }, 'nl'), []);
  assert.deepEqual(readAlong(null, 'nl'), []);
});

test('filmDataOf: the data block of a film page, or null', () => {
  assert.deepEqual(filmDataOf('<script type="application/json" id="film-data">{"id":"x"}</script>'), { id: 'x' });
  assert.equal(filmDataOf('<p>nothing</p>'), null);
  assert.equal(filmDataOf('<script type="application/json" id="film-data">{bad</script>'), null);
  assert.equal(filmDataOf(null), null);
});

// ------------------------------------------------------------ the app: the steps
test('a lesson with a film: Raden · Film · Check (the film covers the worked example, v16); without one it keeps Lezen · Voorbeeld', () => {
  const withFilm = { pre: [{}], teach: ['a', 'b'], film: 'eng.machining.turning', example: { kind: 'worked', text: 'x' } };
  assert.deepEqual(lessonPhases(withFilm), ['pre', 'film', 'quiz']);
  assert.deepEqual(lessonSteps(lessonPhases(withFilm), 'film').map((s) => `${s.id}:${s.state}`), ['guess:done', 'film:current', 'check:todo']);
  assert.deepEqual(lessonPhases({ pre: [{}], teach: ['a'] }), ['pre', 'teach', 'example', 'quiz']);
  assert.deepEqual(lessonPhases({ teach: ['a'], film: 'eng.x.y' }), ['film', 'quiz']);
  // back from the check goes to the film; back from the film to the last guess
  const phases = lessonPhases(withFilm);
  assert.deepEqual(lessonBack({ p: 2, block: 0, pre: 0 }, phases, withFilm), { p: 1, block: 0, pre: 0 });
  assert.deepEqual(lessonBack({ p: 1, block: 0, pre: 0 }, phases, { ...withFilm, pre: [{}, {}] }), { p: 0, block: 0, pre: 1 });
});

// ------------------------------------------------------------ the service worker: byte ranges
function rangeLib() {
  const ctx = { URL };
  vm.runInNewContext(fs.readFileSync('src/core/filmrange.js', 'utf8'), ctx);
  return ctx;
}

test('byte ranges: parsed against the size, open-ended and suffix ranges, junk refused', () => {
  const { parseRange } = rangeLib();
  const r = (h, n) => JSON.parse(JSON.stringify(parseRange(h, n)));
  assert.deepEqual(r('bytes=0-99', 1000), { start: 0, end: 99 });
  assert.deepEqual(r('bytes=500-', 1000), { start: 500, end: 999 });
  assert.deepEqual(r('bytes=-100', 1000), { start: 900, end: 999 });
  assert.deepEqual(r('bytes=900-5000', 1000), { start: 900, end: 999 });
  assert.equal(parseRange(null, 1000), null); // no range: the whole file
  assert.equal(parseRange('', 1000), null);
  assert.equal(r('bytes=1000-', 1000).unsatisfiable, true);
  assert.equal(r('bytes=50-10', 1000).unsatisfiable, true);
  assert.equal(r('items=0-1', 1000).unsatisfiable, true);
  assert.equal(r('bytes=0-1,5-9', 1000).unsatisfiable, true); // one range only
});

test('byte ranges: the response parts (206 with Content-Range, 200 for no range, 416 when it cannot be met)', () => {
  const { rangeParts } = rangeLib();
  const p = (h, n) => JSON.parse(JSON.stringify(rangeParts(h, n, 'video/mp4')));
  assert.deepEqual(p('bytes=0-1', 10), { status: 206, start: 0, end: 2, headers: { 'Content-Type': 'video/mp4', 'Content-Length': '2', 'Content-Range': 'bytes 0-1/10', 'Accept-Ranges': 'bytes' } });
  assert.deepEqual(p(null, 10), { status: 200, start: 0, end: 10, headers: { 'Content-Type': 'video/mp4', 'Content-Length': '10', 'Accept-Ranges': 'bytes' } });
  assert.deepEqual(p('bytes=20-', 10), { status: 416, start: 0, end: 0, headers: { 'Content-Range': 'bytes */10', 'Accept-Ranges': 'bytes' } });
});

test('the film URL test: only the public films bucket', () => {
  const { isFilmUrl } = rangeLib();
  assert.equal(isFilmUrl('https://ysybqtdzcutmyabfwijl.supabase.co/storage/v1/object/public/films/eng.machining.turning/nl.mp4'), true);
  assert.equal(isFilmUrl('https://ysybqtdzcutmyabfwijl.supabase.co/storage/v1/object/public/other/x.mp4'), false);
  assert.equal(isFilmUrl('https://evil.example/storage/v1/object/public/films/x/nl.mp4'), false);
  assert.equal(isFilmUrl('not a url'), false);
});

test('the service worker routes films through the range helper and keeps the films cache', () => {
  const sw = fs.readFileSync('sw.js', 'utf8');
  assert.match(sw, /importScripts\('src\/core\/filmrange\.js'\)/);
  assert.match(sw, /const FILMS = 'vantage-films'/);
  assert.match(sw, /k !== CACHE && k !== META && k !== FILMS/);
  assert.ok(!/\.mp4'/.test(sw.split('const SHELL')[1].split('];')[0]), 'no video in the shell precache');
  // films are cached per version (?v=), so the worker looks up the whole URL
  assert.match(sw, /c\.match\(e\.request\.url\)/);
});

test('cacheFilm: the whole file into the films cache once; false when it cannot', async () => {
  const { cacheFilm, FILMS_CACHE } = await import('../src/ui/film.js');
  const store = new Map();
  const opened = [];
  const cachesApi = { open: async (name) => { opened.push(name); return { match: async (u) => store.get(u), put: async (u, r) => { store.set(u, r); } }; } };
  let fetched = 0;
  const ok = async () => { fetched += 1; return { status: 200 }; };
  assert.equal(await cacheFilm('https://x/films/a/nl.mp4', { cachesApi, fetchFn: ok }), true);
  assert.equal(opened[0], FILMS_CACHE);
  assert.ok(store.has('https://x/films/a/nl.mp4'));
  assert.equal(await cacheFilm('https://x/films/a/nl.mp4', { cachesApi, fetchFn: ok }), true);
  assert.equal(fetched, 1, 'a cached film is not fetched again');
  // a partial or failed answer is never stored
  assert.equal(await cacheFilm('https://x/films/b/nl.mp4', { cachesApi, fetchFn: async () => ({ status: 206 }) }), false);
  assert.equal(await cacheFilm('https://x/films/c/nl.mp4', { cachesApi, fetchFn: async () => { throw new Error('offline'); } }), false);
  assert.equal(await cacheFilm('https://x/films/d/nl.mp4', { cachesApi: null, fetchFn: ok }), false);
  assert.ok(!store.has('https://x/films/b/nl.mp4') && !store.has('https://x/films/c/nl.mp4'));
  // a new version of a film replaces the old one in the cache
  const keyed = new Map([['https://x/films/e/nl.mp4?v=1', 1], ['https://x/films/e/en.mp4?v=1', 1]]);
  const api2 = { open: async () => ({ match: async (u) => keyed.get(u), put: async (u, r) => { keyed.set(u, r); }, keys: async () => [...keyed.keys()].map((url) => ({ url })), delete: async (k) => keyed.delete(typeof k === 'string' ? k : k.url) }) };
  assert.equal(await cacheFilm('https://x/films/e/nl.mp4?v=2', { cachesApi: api2, fetchFn: ok }), true);
  assert.deepEqual([...keyed.keys()].sort(), ['https://x/films/e/en.mp4?v=1', 'https://x/films/e/nl.mp4?v=2']);
});

test('films never reuse the player\'s own class names (a render hides .fp-bar and friends)', () => {
  const reserved = ['fp-bar', 'fp-note', 'fp-poster', 'fp-end', 'fp-sheet'];
  for (const dir of fs.readdirSync('films').filter((d) => d.startsWith('eng.') || d.startsWith('pm.'))) {
    for (const f of ['stage.js', 'build.mjs']) {
      const p = `films/${dir}/${f}`;
      if (!fs.existsSync(p)) continue;
      const src = fs.readFileSync(p, 'utf8');
      for (const cls of reserved) assert.ok(!new RegExp(`\\b${cls}\\b`).test(src), `${p} uses the player class ${cls}`);
    }
  }
});
