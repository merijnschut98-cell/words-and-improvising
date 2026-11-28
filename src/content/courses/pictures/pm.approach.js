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

  // pm.approach.toolfamilies: the tool families, the work each does and example tools
  'pm.approach.toolfamilies.map': {
    kind: 'table',
    head: [L('Tool family', 'Toolfamilie'), L('Kind of work', 'Soort werk')],
    rows: [
      [L('Spreadsheet', 'Spreadsheet'), [L('Lists and calculations', 'Lijsten en berekeningen'), L('Excel', 'Excel')]],
      [L('Scheduling tool', 'Planningstool'), [L('Tasks with dependencies and dates', 'Taken met afhankelijkheden en data'), L('Microsoft Project or Smartsheet', 'Microsoft Project of Smartsheet')]],
      [L('Task board', 'Takenbord'), [L('Cards in columns for who does what', 'Kaarten in kolommen voor wie wat doet'), L('Planner or Trello', 'Planner of Trello')]],
      [L('Backlog', 'Backlog'), [L('An ordered list of work still to be done', 'Een geordende lijst van werk dat nog moet gebeuren'), L('Jira or Azure DevOps Boards', 'Jira of Azure DevOps Boards')]],
      [L('Documentation and knowledge', 'Documentatie en kennis'), [L('Decisions and agreements', 'Besluiten en afspraken'), L('SharePoint, Teams, Loop or Confluence', 'SharePoint, Teams, Loop of Confluence')]],
      [L('Whiteboard', 'Samenwerkingsbord'), [L('A digital board for sessions', 'Een digitaal bord voor sessies'), L('Miro or Mural', 'Miro of Mural')]],
      [L('Reporting', 'Rapportage'), [L('Shows figures that come from other systems', 'Laat cijfers zien die uit andere systemen komen'), L('Power BI', 'Power BI')]],
    ],
  },

  // pm.approach.choose: the answers to the five selection questions and what they point to
  'pm.approach.choose.map': {
    kind: 'table',
    head: [L('Answers', 'Antwoorden'), L('Points to', 'Wijst naar')],
    rows: [
      [L('An unclear solution and requirements that still move', 'Onduidelijke oplossing en eisen die nog bewegen'), L('Short rounds', 'Korte rondes')],
      [L('A known solution, fixed requirements and a fixed contract', 'Een bekende oplossing, vaste eisen en een vast contract'), L('Predictive', 'Voorspellend')],
      [L('An improvement project with a number you can measure', 'Een verbeterproject met een getal dat je kunt meten'), L('DMAIC', 'DMAIC')],
      [L('One owner, one area and a few weeks', 'Eén eigenaar, één gebied en een paar weken'), L('An A3 or kaizen event', 'Een A3 of kaizenevent')],
      [L('A borrowed team', 'Een geleend team'), L('Few fixed meetings and clear weekly agreements', 'Weinig vaste overleggen en duidelijke weekafspraken')],
    ],
  },

  // pm.approach.dmaic: the five phases with the result each leaves for the next
  'pm.approach.dmaic.flow': {
    kind: 'flow',
    steps: [
      { label: L('Define', 'Definiëren'), note: L('Project charter', 'Projectdefinitie') },
      { label: L('Measure', 'Meten'), note: L('Baseline', 'Nulmeting') },
      { label: L('Analyse', 'Analyseren'), note: L('Where the loss is', 'Waar het verlies zit') },
      { label: L('Improve', 'Verbeteren'), note: L('A solution on a small scale', 'Oplossing op kleine schaal') },
      { label: L('Control', 'Borgen'), note: L('An owner, a fixed measurement', 'Een eigenaar, een vaste meting') },
    ],
  },

  // pm.approach.systems: a large client's systems and the job of each
  'pm.approach.systems.map': {
    kind: 'table',
    head: [L('System', 'Systeem'), L('Job', 'Taak')],
    rows: [
      [L('ERP', 'ERP'), L('Money, hours and materials, per project number', 'Geld, uren en materiaal, per projectnummer')],
      [L('Planning for large projects', 'Planning voor grote projecten'), L('Big schedules with many dependencies', 'Grote planningen met veel afhankelijkheden')],
      [L('PPM', 'PPM'), L('Which projects exist, what they ask for and who has capacity for them', 'Welke projecten er zijn, wat ze vragen en wie er capaciteit voor heeft')],
      [L('PLM', 'PLM'), L('Product data such as drawings, parts and engineering changes', 'Productgegevens zoals tekeningen, onderdelen en technische wijzigingen')],
      [L('ITSM', 'ITSM'), L('Incidents, changes and requests in IT', 'Incidenten, wijzigingen en verzoeken in de IT')],
      [L('Reporting', 'Rapportage'), L('Tools such as Power BI that show figures from other systems', 'Tools als Power BI die cijfers uit andere systemen tonen')],
    ],
  },
};
