// Pictures of the Project approach module (v18 G1). Plain data, drawn by
// src/ui/picture.js; every label is { nl, en } and occurs in the text of the
// lesson that shows it (tests/picture.test.js).
const L = (en, nl) => ({ en, nl });

export default {
  // pm.approach.families: the four method families and the mix, with their methods
  'pm.approach.families.map': {
    kind: 'table',
    head: [L('Method family', 'Methodefamilie'), L('Methods', 'Methoden')],
    rows: [
      [L('Predictive', 'Voorspellend'), [L('Waterfall', 'Waterfall'), L('PRINCE2', 'PRINCE2'), L('Stage-gate', 'Stage-gate')]],
      [L('Agile', 'Agile'), [L('Scrum', 'Scrum'), L('Kanban', 'Kanban'), L('SAFe', 'SAFe')]],
      [L('Lean improvement', 'Lean-verbeteren'), [L('PDCA', 'PDCA'), L('A3', 'A3'), L('Kaizen event', 'Kaizenevent'), L('Value stream analysis', 'Waardestroomanalyse')]],
      [L('Improving with DMAIC', 'Verbeteren met DMAIC'), [L('DMAIC', 'DMAIC'), L('Six Sigma', 'Six Sigma'), L('8D', '8D'), L('DMADV', 'DMADV')]],
      [L('Hybrid', 'Hybride'), [L('Fixed milestones with short rounds inside', 'Vaste mijlpalen met korte rondes erbinnen')]],
    ],
  },
};
