// Pictures of the Intake module (v18 G2, in the pm.intake pass). Plain data, drawn by
// src/ui/picture.js; every label is { nl, en } and occurs in the text of the lesson
// that shows it (tests/picture.test.js). Four static structures: a grid, a table of
// the worked example, a table and a short flow. Nothing here replaces a film.
const L = (en, nl) => ({ en, nl });

export default {
  // pm.intake.stakeholders: the stakeholder map, influence against interest
  'pm.intake.stakeholders.grid': {
    kind: 'grid',
    xTitle: L('Interest', 'Belang'),
    yTitle: L('Influence', 'Invloed'),
    cols: [L('Low', 'Weinig'), L('High', 'Veel')],
    rows: [L('High', 'Veel'), L('Low', 'Weinig')],
    cells: [
      [L('Keep satisfied', 'Tevreden houden'), L('Involve weekly', 'Wekelijks betrekken')],
      [L('Keep an eye on', 'In de gaten houden'), L('Keep informed', 'Goed informeren')],
    ],
  },
  // pm.intake.charter: the one-page layout, filled in with the press brake example
  'pm.intake.charter.layout': {
    kind: 'table',
    head: [L('Charter', 'Projectopdracht'), L('example', 'voorbeeld')],
    rows: [
      [L('Background', 'Aanleiding'), L('customers order smaller batches', 'klanten bestellen kleinere series')],
      [L('Goal', 'Doel'), L('average changeover time from 45 to 25 minutes by 1 June', 'gemiddelde omsteltijd van 45 naar 25 minuten voor 1 juni')],
      [L('Scope', 'Scope'), L('the four press brakes', 'de vier kantbanken')],
      [L('Deliverables', 'Deliverables'), L('baseline, standard changeover method, training of 12 operators', 'nulmeting, standaard omstelwerkwijze, training van 12 operators')],
      [L('Milestones', 'Mijlpalen'), [L('week 1 process map and data plan', 'week 1 procesmap en dataplan'), L('week 2 baseline', 'week 2 nulmeting'), L('week 5 pilot on press brake 1', 'week 5 pilot op kantbank 1'), L('week 10 all four', 'week 10 alle vier')]],
      [L('Assumptions', 'Aannames'), L('the tooling supplier delivers quick-change parts within 4 weeks', 'de gereedschapsleverancier levert snelwissel-onderdelen binnen 4 weken')],
    ],
  },
  // pm.intake.sipoc: the five parts, filled in with the connection process
  'pm.intake.sipoc.map': {
    kind: 'table',
    head: [L('SIPOC', 'SIPOC'), L('grid operator', 'netbeheerder')],
    rows: [
      [L('Suppliers', 'Suppliers'), L('the customer', 'de klant')],
      [L('Inputs', 'Inputs'), L('complete application received', 'aanvraag compleet ontvangen')],
      [L('Process', 'Process'), [L('assess application', 'aanvraag beoordelen'), L('design', 'ontwerp'), L('permit and material', 'vergunning en materiaal'), L('execution', 'uitvoering'), L('install meter', 'meter plaatsen')]],
      [L('Outputs', 'Outputs'), L('customer has power', 'klant heeft stroom')],
      [L('Customers', 'Customers'), L('small business customers', 'kleinzakelijke klanten')],
    ],
  },
  // pm.intake.phasing: diagnosis, pilot and roll-out, each ending in a decision
  'pm.intake.phasing.flow': {
    kind: 'flow',
    steps: [
      { label: L('Diagnosis', 'Diagnose'), note: L('go/no-go decision', 'go/no-go-besluit') },
      { label: L('Pilot', 'Pilot'), note: L('go/no-go decision', 'go/no-go-besluit') },
      { label: L('Roll-out', 'Uitrol'), note: L('go/no-go decision', 'go/no-go-besluit') },
    ],
  },
};
