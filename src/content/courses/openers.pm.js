// Level openers for the pm subject (v17 Task 19): a short card shown the first
// time a learner opens a lesson at Werkkennis (2), Gevorderd (3) or Expert (4)
// in a topic. Basis has the module intro film, so there is no level 1.
//
// Topic key: '<moduleId>/<topicId>' exactly as in MODULES (index.js), for
// example 'eng.flow/takt'. The slash keeps it apart from lesson ids, which are
// '<moduleId>.<slug>' and can look the same ('eng.flow.takt' is a lesson).
// Shape: { [topicKey]: { 2: { nl, en }, 3: { nl, en }, 4: { nl, en } } }.
// Two to four sentences, no colons, no numbers from the lesson, at most 320
// characters per language (tests/openers.test.js, validate.js checkOpeners).
export default {
  'pm.intake/problem': {
    2: {
      nl: 'Op Werkkennis voer je het eerste gesprek. Je geeft het verhaal van de opdrachtgever terug in eigen woorden en vraagt door als iemand kort antwoordt. Daarna kun je beantwoorden waarom je parafraseert en wat je doet als alles in het rapport zou staan.',
      en: 'At Working knowledge you hold the first conversation. You give the client’s story back in your own words and ask further when someone answers shortly. Afterwards you can answer why you paraphrase and what to do when everything is supposedly in the report.',
    },
    3: {
      nl: 'Op Gevorderd formuleer je een scherp probleem. Je beslist wat er wel en niet in een probleemstelling thuishoort en hoeveel de norm wordt overschreden. Daarna kun je uitleggen wat een goede probleemstelling is en wat je er niet in zet.',
      en: 'At Advanced you word a sharp problem. You decide what belongs in a problem statement and what does not, and by how much the standard is missed. Afterwards you can explain what a good problem statement is and what to leave out.',
    },
    4: {
      nl: 'Op Expert werkt een senior met hypotheses. Het gaat om een boom zonder overlap en zonder gaten en om waar je als eerste naar kijkt. Daarna kun je een analyse opzetten waarmee je een gokje ontmaskert.',
      en: 'At Expert a senior works with hypotheses. It is about a tree without overlap and without gaps and where you look first. Afterwards you can set up an analysis that exposes a guess.',
    },
  },
  'pm.intake/people': {
    2: {
      nl: 'Op Werkkennis ga je de eerste weken in. Je laat snelle winst en een stevig fundament naast elkaar lopen. Daarna kun je beantwoorden waarom beide tegelijk moeten en hoe je reageert op iemand die zegt dat het al eens is mislukt.',
      en: 'At Working knowledge you enter the first weeks. You run quick wins and a solid foundation side by side. Afterwards you can answer why both are needed at once and how to respond to someone who says it failed once before.',
    },
    3: {
      nl: 'Op Gevorderd maak je afspraken met de sponsor. Je beslist wat je vraagt, wat je biedt en wat je niet accepteert. Daarna kun je uitleggen wat vragen en bieden bij Block betekenen en hoeveel uren een vraag aan mensen werkelijk is.',
      en: 'At Advanced you make agreements with the sponsor. You decide what you ask, what you offer and what you will not accept. Afterwards you can explain what wants and offers mean in Block’s sense and how many hours a request for people really is.',
    },
    4: {
      nl: 'Op Expert bouwt een senior een coalitie. Het gaat om wie je nodig hebt om iets te laten blijven en om wanneer de ondernemingsraad advies moet geven. Daarna kun je een plan voor draagvlak beoordelen.',
      en: 'At Expert a senior builds a coalition. It is about who you need to make something stick and when the works council must give advice. Afterwards you can assess a plan for support.',
    },
  },
  'pm.intake/scope': {
    2: {
      nl: 'Op Werkkennis schrijf je het charter op één blad. Je zet doel, mijlpalen en kosten op papier en rekent mee met de uren van de adviseur. Daarna kun je beantwoorden wat een mijlpaal is en wat de tijd van een adviseur kost.',
      en: 'At Working knowledge you write the charter on one page. You put goal, milestones and cost on paper and work out the consultant’s time. Afterwards you can answer what a milestone is and what an adviser’s time costs.',
    },
    3: {
      nl: 'Op Gevorderd trek je grenzen met SIPOC. Je beslist waar een proces begint en eindigt en waar problemen in de praktijk ontstaan. Daarna kun je uitleggen waar de P voor staat en waar je het probleem zoekt.',
      en: 'At Advanced you draw boundaries with SIPOC. You decide where a process begins and ends and where problems start in practice. Afterwards you can explain what the P stands for and where to look for the problem.',
    },
    4: {
      nl: 'Op Expert beheert een senior fasering en wijzigingen. Het gaat om een go of no-go aan het eind van een fase en om budget binnen de marge. Daarna kun je beoordelen of een fase zijn grenzen nog haalt.',
      en: 'At Expert a senior manages phasing and changes. It is about a go or no-go at the end of a phase and budget within tolerance. Afterwards you can judge whether a phase is still within its limits.',
    },
  },
  'pm.intake/case': {
    2: {
      nl: 'Op Werkkennis schrijf je het voorstel. Je opent met situatie, complicatie en vraag en kiest een prijsvorm. Daarna kun je beantwoorden wat SCQ is en welke prijsvorm het risico bij het bureau legt.',
      en: 'At Working knowledge you write the proposal. You open with situation, complication and question and choose a pricing form. Afterwards you can answer what SCQ is and which pricing form puts the risk with the firm.',
    },
    3: {
      nl: 'Op Gevorderd beslis je of je ja zegt. Je herkent een rode vlag bij de intake en weet wat je als eerste doet bij een project dat gedoemd lijkt. Daarna kun je uitleggen welke tegenwerping het best werkt.',
      en: 'At Advanced you decide whether to say yes. You recognise a red flag at intake and know what to do first with a project that seems doomed. Afterwards you can explain which pushback works best.',
    },
    4: {
      nl: 'Op Expert bouwt een senior een business case die standhoudt. Het gaat om wat er gebeurt als de baten tegenvallen en om gevoeligheden. Daarna kun je een case toetsen op wat er gebeurt bij een lagere opbrengst.',
      en: 'At Expert a senior builds a business case that holds. It is about what happens when benefits fall short and about sensitivities. Afterwards you can test a case against a lower return.',
    },
  },
  'pm.plan/breakdown': {
    2: {
      nl: 'Op Werkkennis leg je vast wat erbij hoort en wat niet. Je schrijft op wat buiten de scope valt en formuleert een bruikbaar acceptatiecriterium. Daarna kun je beantwoorden waarom je het uitsluit en wat een goed criterium is.',
      en: 'At Working knowledge you fix what is in and what is out. You write down what falls outside scope and word a usable acceptance criterion. Afterwards you can answer why to state exclusions and what a good criterion is.',
    },
    3: {
      nl: 'Op Gevorderd plan je op producten. Je volgt de vier stappen van productgericht plannen en weet wat een extern product is. Daarna kun je uitleggen in welke volgorde die stappen gaan en wat een productbeschrijving bevat.',
      en: 'At Advanced you plan on products. You follow the four steps of product-based planning and know what an external product is. Afterwards you can explain the order of those steps and what a product description contains.',
    },
    4: {
      nl: 'Op Expert weegt een senior een basisplan en een marge. Het gaat om toleranties, om een wijziging die het kritieke pad raakt en om rollend plannen. Daarna kun je beoordelen of een wijzigingsverzoek in de marge past.',
      en: 'At Expert a senior weighs a baseline and a tolerance. It is about tolerances, a change that hits the critical path and rolling wave planning. Afterwards you can judge whether a change request fits within the margin.',
    },
  },
  'pm.plan/schedule': {
    2: {
      nl: 'Op Werkkennis kies je een manier van werken. Je let op welk project bij een vast plan past en wat elke korte ronde afsluit. Daarna kun je beantwoorden wat bij watervalwerk past en wat je een bestuur zegt dat een volledig plan wil.',
      en: 'At Working knowledge you choose a way of working. You look at which project suits a fixed plan and what ends every short round. Afterwards you can answer what suits waterfall work and what to tell a board that wants a full plan.',
    },
    3: {
      nl: 'Op Gevorderd reken je het netwerk door. Je bepaalt vroegste en laatste momenten en de speling per activiteit. Daarna kun je uitleggen hoe lang een project minimaal duurt en wat totale speling betekent.',
      en: 'At Advanced you calculate the network. You determine earliest and latest times and the float per activity. Afterwards you can explain how long a project takes at least and what total float means.',
    },
    4: {
      nl: 'Op Expert versnelt en volgt een senior de planning. Het gaat om overlappen en inkorten tegen een prijs en om waar de laatste euro het meeste oplevert. Daarna kun je een versnelling kiezen en verdedigen.',
      en: 'At Expert a senior speeds up and tracks the schedule. It is about overlapping and crashing at a price and where the last euro buys the most. Afterwards you can choose a speed-up and defend it.',
    },
  },
  'pm.plan/estimate': {
    2: {
      nl: 'Op Werkkennis schat je op meer manieren. Je vergelijkt met eerder werk, gebruikt normen of telt op. Daarna kun je beantwoorden wat het grootste risico van een parametrische schatting is en wanneer welke methode past.',
      en: 'At Working knowledge you estimate in more than one way. You compare with earlier work, use norms or add up. Afterwards you can answer what the biggest risk of a parametric estimate is and when each method fits.',
    },
    3: {
      nl: 'Op Gevorderd tel je onzekerheid op. Je gebruikt een optimistische, gewone en pessimistische schatting en kijkt hoe spreiding bij elkaar komt. Daarna kun je uitleggen hoeveel afwijking een activiteit heeft en wat twee onafhankelijke activiteiten samen doen.',
      en: 'At Advanced you add up uncertainty. You use an optimistic, usual and pessimistic estimate and see how spread combines. Afterwards you can explain how much deviation an activity has and what two independent activities do together.',
    },
    4: {
      nl: 'Op Expert beheert een senior de ketting en de buffers. Het gaat om reserves die je van taken naar het einde verplaatst en om waar een voedingsbuffer hoort. Daarna kun je een planning met een kritieke keten opzetten en bewaken.',
      en: 'At Expert a senior manages the chain and the buffers. It is about reserves you move from tasks to the end and where a feeding buffer belongs. Afterwards you can set up and watch a schedule with a critical chain.',
    },
  },
  'pm.plan/resources': {
    2: {
      nl: 'Op Werkkennis verdeel je rollen. Je bepaalt wie waarvoor verantwoordelijk is en waarom de sponsor niet ontbreekt. Daarna kun je beantwoorden hoeveel mensen eindverantwoordelijk zijn voor één product en wat je doet als twee managers dezelfde taak vragen.',
      en: 'At Working knowledge you assign roles. You decide who is responsible for what and why the sponsor must not be missing. Afterwards you can answer how many people are accountable for one deliverable and what to do when two managers ask for the same task.',
    },
    3: {
      nl: 'Op Gevorderd plan je mensen en capaciteit. Je kijkt wat iemand echt beschikbaar heeft en wat resource levelling doet. Daarna kun je uitleggen hoeveel uren een planner werkelijk vrij heeft en hoe levelling en smoothing verschillen.',
      en: 'At Advanced you plan people and capacity. You look at what someone really has available and what resource levelling does. Afterwards you can explain how many hours a planner really has free and how levelling and smoothing differ.',
    },
    4: {
      nl: 'Op Expert rekent een senior risico’s in geld en reserves. Het gaat om kans keer gevolg, om wat je escaleert en om wat je in een reserve zet. Daarna kun je een risicoreserve onderbouwen.',
      en: 'At Expert a senior puts risks in money and reserves. It is about chance times consequence, what you escalate and what goes into a reserve. Afterwards you can back up a risk reserve.',
    },
  },
  'pm.run/steer': {
    2: {
      nl: 'Op Werkkennis bereid je een stuurgroep voor. Je zorgt dat besluiten bovenaan de agenda staan en dat niemand verrast wordt. Daarna kun je beantwoorden wat nemawashi in een project is en hoe je een rode mijlpaal aankondigt.',
      en: 'At Working knowledge you prepare a steering group. You make sure decisions sit at the top of the agenda and nobody is surprised. Afterwards you can answer what nemawashi is in a project and how to announce a red milestone.',
    },
    3: {
      nl: 'Op Gevorderd laat je voortgang in cijfers zien. Je zet geplande en behaalde waarde naast elkaar en leest wat dat zegt over tempo. Daarna kun je uitrekenen of een project voor of achter ligt en wat dat voor de kosten betekent.',
      en: 'At Advanced you show progress in numbers. You set planned and earned value side by side and read what that says about pace. Afterwards you can work out whether a project is ahead or behind and what that means for cost.',
    },
    4: {
      nl: 'Op Expert stuur je op uitzonderingen. Het gaat om een grens waarbinnen de projectleider vrij is en om wat in een afwijkingsrapport hoort. Daarna kun je een prognose van de eindkosten geven en een rapport schrijven dat om een besluit vraagt.',
      en: 'At Expert you manage by exception. It is about a limit within which the project manager is free and what belongs in an exception report. Afterwards you can give a forecast of the final cost and write a report that asks for a decision.',
    },
  },
  'pm.run/scope': {
    2: {
      nl: 'Op Werkkennis beheers je wijzigingen. Je laat een voorstel eerst onderzoeken en rekent wat goedgekeurde wijzigingen met het budget doen. Daarna kun je beantwoorden wat in een impactanalyse hoort en hoeveel marge er nog is.',
      en: 'At Working knowledge you control changes. You have a proposal looked into first and work out what approved changes do to the budget. Afterwards you can answer what belongs in an impact analysis and how much margin is left.',
    },
    3: {
      nl: 'Op Gevorderd plan je opnieuw en beheer je reserves. Je kiest tussen versnellen en overlappen en kijkt hoeveel van de reserve is gebruikt. Daarna kun je uitleggen wat het verschil tussen die twee is en wanneer een reserve te snel opraakt.',
      en: 'At Advanced you replan and manage reserves. You choose between crashing and fast-tracking and look at how much of the reserve is used. Afterwards you can explain the difference between those two and when a reserve runs out too fast.',
    },
    4: {
      nl: 'Op Expert weegt een senior doorgaan tegen stoppen. Het gaat om wat nog moet, wat het oplevert en om verloren kosten die niet meetellen. Daarna kun je een besluit tot stoppen voorbereiden en afspraken over stopcriteria vooraf verdedigen.',
      en: 'At Expert a senior weighs going on against stopping. It is about what is still to come, what it returns and sunk costs that do not count. Afterwards you can prepare a decision to stop and defend agreeing kill criteria in advance.',
    },
  },
  'pm.run/team': {
    2: {
      nl: 'Op Werkkennis leid je zonder gezag. Je stelt de vraag die iemand aanspreekt zonder aan te vallen en maakt een afspraak die blijft staan. Daarna kun je beantwoorden wat de beste vraag is bij een gemiste toezegging en wat een afspraak sterker maakt.',
      en: 'At Working knowledge you lead without authority. You ask the question that addresses someone without attacking and make an agreement that holds. Afterwards you can answer what the best question is after a missed promise and what makes a commitment stronger.',
    },
    3: {
      nl: 'Op Gevorderd pak je conflicten aan. Je onderscheidt belangen van standpunten en begint een lastig gesprek op een manier die open blijft. Daarna kun je uitleggen wat een belang is en hoe je opent als twee teamleden botsen.',
      en: 'At Advanced you handle conflicts. You tell interests from positions and open a difficult conversation in a way that stays open. Afterwards you can explain what an interest is and how to open when two team members clash.',
    },
    4: {
      nl: 'Op Expert stuur je meerdere werkstromen. Het gaat om hoeveel overleg een team aankan en om wat een vergadering van veel mensen echt kost. Daarna kun je de communicatielast van een groep inschatten en een ritme ontwerpen dat schaalt.',
      en: 'At Expert you steer several workstreams. It is about how much coordination a team can take and what a meeting of many people really costs. Afterwards you can estimate the communication load of a group and design a rhythm that scales.',
    },
  },
  'pm.run/issues': {
    2: {
      nl: 'Op Werkkennis krijg je besluiten genomen. Je schrijft een besluitnotitie die iemand kan beslissen en houdt een logboek bij. Daarna kun je beantwoorden wat er in een goede notitie hoort en wat het besluit escaleren in plaats van de persoon inhoudt.',
      en: 'At Working knowledge you get decisions made. You write a decision note someone can act on and keep a log. Afterwards you can answer what belongs in a good note and what escalating the decision instead of the person means.',
    },
    3: {
      nl: 'Op Gevorderd escaleer je in lagen. Je volgt vaste tijden per niveau en laat dagelijkse overleggen de zaak oppakken. Daarna kun je uitleggen hoe lang iets maximaal blijft liggen en wat een goed overleg aan de vloer kenmerkt.',
      en: 'At Advanced you escalate in tiers. You follow fixed times per level and let daily meetings pick the matter up. Afterwards you can explain how long something may lie at most and what marks a good meeting at the floor.',
    },
    4: {
      nl: 'Op Expert lost een senior kwesties tussen bedrijven op. Het gaat om een boete in het contract, om een escalatiematrix tussen organisaties en om wat een relatie verdraagt. Daarna kun je een geschil met een leverancier beoordelen en kiezen wanneer je de boete inzet.',
      en: 'At Expert a senior resolves issues between companies. It is about a penalty in the contract, an escalation matrix between organisations and what a relationship can bear. Afterwards you can assess a dispute with a supplier and choose when to use the penalty.',
    },
  },
  'pm.land/standard': {
    2: {
      nl: 'Op Werkkennis leg je standaardwerk vast. Je beschrijft de stappen en rekent wat een wachttijd voor een volgende stap betekent. Daarna kun je beantwoorden wat de basis onder elke verbetering is en hoe je een standaard uit tijden opbouwt.',
      en: 'At Working knowledge you set down standardised work. You describe the steps and work out what a waiting time for a next step means. Afterwards you can answer what the base under every improvement is and how to build a standard from times.',
    },
    3: {
      nl: 'Op Gevorderd bouw je een vaardighedenmatrix. Je beslist wie wat kan en hoeveel mensen op welk niveau je per station wilt. Daarna kun je uitleggen wat een letter in de matrix betekent en hoeveel mensen je nodig hebt voor een regel van drie.',
      en: 'At Advanced you build a skills matrix. You decide who can do what and how many people at which level you want per station. Afterwards you can explain what a letter in the matrix means and how many people you need for a rule of three.',
    },
    4: {
      nl: 'Op Expert houdt een senior de standaard levend. Het gaat om de houding tegenover een standaard, om wanneer je hem verbetert en om hoe je terugval voorkomt. Daarna kun je beoordelen of een verbetering ook echt de nieuwe standaard is geworden.',
      en: 'At Expert a senior keeps the standard alive. It is about the attitude to a standard, when you improve it and how to prevent slipping back. Afterwards you can judge whether an improvement has really become the new standard.',
    },
  },
  'pm.land/handover': {
    2: {
      nl: 'Op Werkkennis ga je met weerstand om. Je herkent ja zeggen zonder iets te doen en betrekt de scherpste criticus. Daarna kun je beantwoorden welke vorm van weerstand je ziet en waarom de criticus erbij hoort.',
      en: 'At Working knowledge you deal with resistance. You recognise saying yes without doing anything and involve the sharpest critic. Afterwards you can answer which form of resistance you are seeing and why the critic belongs in the design.',
    },
    3: {
      nl: 'Op Gevorderd communiceer je een verandering. Je beslist wie het eerst hoort en wat je doet met geruchten. Daarna kun je uitleggen hoe je middenmanagers toerust en wat je zegt als het nieuws al rondgaat.',
      en: 'At Advanced you communicate a change. You decide who hears first and what to do with rumours. Afterwards you can explain how to equip middle managers and what to say when the news is already out.',
    },
    4: {
      nl: 'Op Expert draagt een senior het over aan de lijn. Het gaat om wie eigenaar wordt, waar de kengetallen komen en in welke volgorde je loslaat. Daarna kun je een overdracht ontwerpen die ook na het project houdt.',
      en: 'At Expert a senior hands over to the line. It is about who becomes the owner, where the KPIs live and in which order to let go. Afterwards you can design a handover that also holds after the project.',
    },
  },
  'pm.land/sustain': {
    2: {
      nl: 'Op Werkkennis loop je de ronde van de leidinggevende. Je ziet hoe standaardwerk voor een leider verdeeld is over de dienst en wat je op de vloer controleert. Daarna kun je beantwoorden hoeveel tijd een supervisor aan welk onderdeel besteedt.',
      en: 'At Working knowledge you walk the round of the leader. You see how standard work for a leader is spread over the shift and what you check on the floor. Afterwards you can answer how much time a supervisor spends on which part.',
    },
    3: {
      nl: 'Op Gevorderd leid je een gelaagd overleg. Je kiest de volgorde en bespreekt alleen wat rood staat. Daarna kun je uitleggen in welke volgorde een ochtendoverleg loopt en waarom alleen rode vakken aan bod komen.',
      en: 'At Advanced you lead a tiered meeting. You choose the order and discuss only what is red. Afterwards you can explain in which order a morning meeting runs and why only red boxes are discussed.',
    },
    4: {
      nl: 'Op Expert ontwerpt een senior audits die iets vinden. Het gaat om goede vragen en om hoeveel auditwerk een organisatie draagt. Daarna kun je een auditsysteem beoordelen op wat het werkelijk oplevert.',
      en: 'At Expert a senior designs audits that find something. It is about good questions and how much audit work an organisation can carry. Afterwards you can assess an audit system on what it really returns.',
    },
  },
  'pm.land/benefits': {
    2: {
      nl: 'Op Werkkennis tel je baten eerlijk. Je onderscheidt harde en zachte besparingen en let op wat echt in de cijfers komt. Daarna kun je beantwoorden wat voor soort besparing een vermeden aankoop is en wat met overwerk gebeurt.',
      en: 'At Working knowledge you count benefits honestly. You tell hard from soft savings and watch what really shows in the figures. Afterwards you can answer what kind of saving an avoided purchase is and what happens to overtime.',
    },
    3: {
      nl: 'Op Gevorderd reflecteer je. Je gebruikt de nabespreking met vaste vragen en kiest het leerpunt dat bruikbaar is. Daarna kun je uitleggen wat de derde vraag van zo’n nabespreking is en wanneer een leerpunt echt bruikbaar is.',
      en: 'At Advanced you reflect. You use the review with fixed questions and pick the learning point that is usable. Afterwards you can explain what the third question of such a review is and when a learning point is really usable.',
    },
    4: {
      nl: 'Op Expert rolt een senior een oplossing uit naar andere lijnen. Het gaat om kopiëren en verbeteren en om wanneer een voorbeeldlijn klaar is. Daarna kun je beoordelen of een resultaat overdraagbaar is.',
      en: 'At Expert a senior rolls a solution out to other lines. It is about copy and improve and when a model line is ready. Afterwards you can judge whether a result is transferable.',
    },
  },
  'pm.close/proof': {
    2: {
      nl: 'Op Werkkennis lees je een verloopgrafiek. Je bepaalt wat de mediaan is en wanneer een reeks een verschuiving laat zien. Daarna kun je beantwoorden wanneer je van een verschuiving spreekt en hoe je een basislijn leest.',
      en: 'At Working knowledge you read a run chart. You determine what the median is and when a series shows a shift. Afterwards you can answer when to call something a shift and how to read a baseline.',
    },
    3: {
      nl: 'Op Gevorderd scheid je je eigen effect van de rest. Je vergelijkt met een groep die niets veranderde en let op wat anders meeging. Daarna kun je uitleggen welke aanname bij zo’n vergelijking hoort en waarom een daling niet altijd jouw werk is.',
      en: 'At Advanced you separate your own effect from the rest. You compare with a group that changed nothing and watch what else moved. Afterwards you can explain which assumption goes with such a comparison and why a drop is not always your doing.',
    },
    4: {
      nl: 'Op Expert bouw je een claim die standhoudt. Het gaat om baten en kosten over de tijd en om een sponsor die te vroeg wil sluiten. Daarna kun je een resultaat verdedigen met cijfers waar een kritische controller niets op aan te merken heeft.',
      en: 'At Expert you build a claim that holds. It is about benefits and costs over time and a sponsor who wants to close too early. Afterwards you can defend a result with figures a critical controller cannot fault.',
    },
  },
  'pm.close/closure': {
    2: {
      nl: 'Op Werkkennis sluit je het administratief af. Je sluit tijdcodes, bewaart het archief en let op persoonsgegevens. Daarna kun je beantwoorden waarom je de tijdcode direct sluit en waar het archief hoort.',
      en: 'At Working knowledge you close the administration. You close time codes, keep the archive and watch personal data. Afterwards you can answer why to close the time code right away and where the archive belongs.',
    },
    3: {
      nl: 'Op Gevorderd stop je vroeg zonder rommel. Je kiest een veilig stopmoment en beslist wat je met half werk doet. Daarna kun je uitleggen wat een veilig stoppunt is en wat je doet als de klant wil doorgaan.',
      en: 'At Advanced you stop early without a mess. You choose a safe stopping point and decide what to do with half-finished work. Afterwards you can explain what a safe stopping point is and what to do when the client wants to carry on.',
    },
    4: {
      nl: 'Op Expert draagt een senior registers en restrisico’s over. Het gaat om wie het project mag sluiten en om wie met een restrisico verder moet. Daarna kun je een overdracht beoordelen op wat er achterblijft.',
      en: 'At Expert a senior hands over registers and residual risks. It is about who may close the project and who must carry on with a residual risk. Afterwards you can assess a handover on what is left behind.',
    },
  },
  'pm.close/learn': {
    2: {
      nl: 'Op Werkkennis kijk je naar jezelf. Je gaat om met feedback die steekt en schrijft een korte casus op. Daarna kun je beantwoorden wat je doet met feedback die pijn doet en wat in een casus op één blad staat.',
      en: 'At Working knowledge you look at yourself. You deal with feedback that stings and write a short case history. Afterwards you can answer what to do with feedback that hurts and what goes in a one-page case history.',
    },
    3: {
      nl: 'Op Gevorderd ontwerp je een terugblik. Je kiest de fasen en meet met een score hoe nuttig het was. Daarna kun je uitleggen in welke volgorde de vijf fasen lopen en hoe je een score leest.',
      en: 'At Advanced you design a retrospective. You choose the phases and measure with a score how useful it was. Afterwards you can explain in which order the five phases run and how to read a score.',
    },
    4: {
      nl: 'Op Expert zorgt een senior dat lessen reizen. Het gaat om leren dat de aanname zelf verandert en om wanneer een lessenlijst echt gelezen wordt. Daarna kun je beoordelen of een organisatie van een project leert.',
      en: 'At Expert a senior makes sure lessons travel. It is about learning that changes the assumption itself and when a lessons list is really read. Afterwards you can judge whether an organisation learns from a project.',
    },
  },
  'pm.close/client': {
    2: {
      nl: 'Op Werkkennis volg je op en kijk je naar het volgende project. Je weet het verschil tussen helpen en verkopen en hoe je contact houdt. Daarna kun je beantwoorden wat een natuurlijke manier is om in contact te blijven.',
      en: 'At Working knowledge you follow up and look towards the next project. You know the difference between helping and selling and how to stay in touch. Afterwards you can answer what a natural way to stay in contact is.',
    },
    3: {
      nl: 'Op Gevorderd evalueer je met de klant. Je telt reacties op de aanbevelingsvraag en leest wat een score werkelijk zegt. Daarna kun je uitleggen hoe je uit een reeks antwoorden een eindcijfer haalt en wat een achtje betekent.',
      en: 'At Advanced you evaluate with the client. You count answers to the recommendation question and read what a score really says. Afterwards you can explain how to get a final figure from a series of answers and what an eight means.',
    },
    4: {
      nl: 'Op Expert vertrek je zonder afhankelijkheid. Het gaat om tekens dat de klant op jou leunt en om een vervolgopdracht die je eigen bureau zou krijgen. Daarna kun je een vervolg aanpakken zonder je onafhankelijkheid te verliezen.',
      en: 'At Expert you leave without dependency. It is about signs the client leans on you and a follow-on assignment your own firm would get. Afterwards you can handle a follow-up without losing your independence.',
    },
  },
  'pm.stuck/diagnose': {
    2: {
      nl: 'Op Werkkennis verzamel je de feiten. Je rekent hoeveel van de toezeggingen echt af zijn en kijkt wat de lijst en wat je zelf ziet. Daarna kun je beantwoorden hoeveel van de acties echt zijn gedaan en wat je verschil tussen lijst en werkelijkheid zegt.',
      en: 'At Working knowledge you gather the facts. You work out how many commitments are really done and compare the list with what you see yourself. Afterwards you can answer how many actions are truly done and what the gap between list and reality says.',
    },
    3: {
      nl: 'Op Gevorderd zoek je onder het oppervlak. Je scheidt een symptoom van een oorzaak en kijkt hoe beoordeling gedrag stuurt. Daarna kun je uitleggen wat het verschil is en op welke laag een beloning de schade doet.',
      en: 'At Advanced you look below the surface. You separate a symptom from a cause and see how evaluation steers behaviour. Afterwards you can explain the difference and on which layer a reward does the damage.',
    },
    4: {
      nl: 'Op Expert leidt een senior een projectreview. Het gaat om wie het rapport als eerste ziet, om hoeveel mensen je spreekt en om een boodschap die iemand kan horen. Daarna kun je een review opzetten die tot actie leidt.',
      en: 'At Expert a senior leads a project review. It is about who sees the report first, how many people you interview and a message someone can hear. Afterwards you can set up a review that leads to action.',
    },
  },
  'pm.stuck/unknown': {
    2: {
      nl: 'Op Werkkennis vraag je goed om hulp. Je kiest de juiste persoon en een vraag die een drukke senior kan beantwoorden. Daarna kun je beantwoorden hoe je een senior het best aanspreekt en wie je vraagt naar hoe een klant budget verdeelt.',
      en: 'At Working knowledge you ask for help well. You pick the right person and a question a busy senior can answer. Afterwards you can answer how best to approach a senior and whom to ask how a client allocates budget.',
    },
    3: {
      nl: 'Op Gevorderd handel je onder onzekerheid. Je beslist welke keuze je langzaam en welke je snel neemt. Daarna kun je uitleggen welk besluit de meeste zorg verdient en wat een kleine proef kost in uren.',
      en: 'At Advanced you act under uncertainty. You decide which choices to take slowly and which fast. Afterwards you can explain which decision deserves the most care and what a small trial costs in hours.',
    },
    4: {
      nl: 'Op Expert herkent een senior wat voor probleem het is. Met het Cynefin-model kies je tussen analyse, uitproberen en direct handelen. Daarna kun je een probleem plaatsen en een aanpak kiezen die erbij past.',
      en: 'At Expert a senior recognises what kind of problem it is. With the Cynefin model you choose between analysis, probing and acting straight away. Afterwards you can place a problem and choose an approach that fits.',
    },
  },
  'pm.stuck/politics': {
    2: {
      nl: 'Op Werkkennis houd je stand als de klant duwt. Je doet als eerste het goede en vindt de vraag die laat zien hoe groot de echte behoefte is. Daarna kun je beantwoorden wat je als eerste doet en welke vraag een kleinere behoefte onthult.',
      en: 'At Working knowledge you hold your ground when the client pushes. You do the right thing first and find the question that shows how big the real need is. Afterwards you can answer what to do first and which question reveals a smaller need.',
    },
    3: {
      nl: 'Op Gevorderd maak je van ja ook doen. Je maakt een toezegging concreet en voorkomt dat een besluit stilletjes verdwijnt. Daarna kun je uitleggen wat een toezegging concreet maakt en welke vraag een stil veto voorkomt.',
      en: 'At Advanced you turn yes into doing. You make a commitment concrete and prevent a decision from quietly disappearing. Afterwards you can explain what makes a commitment concrete and which question prevents a pocket veto.',
    },
    4: {
      nl: 'Op Expert werkt een senior tussen twee afdelingen. Het gaat om lokaal optimaliseren, om een gezamenlijk stuk dat beide hoofden goedkeuren en om wie een gezamenlijke escalatie krijgt. Daarna kun je een patstelling tussen afdelingen oplossen.',
      en: 'At Expert a senior works between two departments. It is about local optimisation, a joint page both heads approve and who receives a joint escalation. Afterwards you can resolve a stalemate between departments.',
    },
  },
  'pm.stuck/restart': {
    2: {
      nl: 'Op Werkkennis kom je weer in beweging. Je zoekt kleine winst en ziet hoe zwaar een tegenslag weegt naast vooruitgang. Daarna kun je beantwoorden wat vooruitgang doet voor motivatie en welke kleine stap je als eerste neemt.',
      en: 'At Working knowledge you get moving again. You look for small wins and see how heavily a setback weighs against progress. Afterwards you can answer what progress does for motivation and which small step to take first.',
    },
    3: {
      nl: 'Op Gevorderd zet je een falend project opnieuw op. Je maakt een eerlijke beoordeling, ook van je eigen deel, en spreekt eerst met de juiste mensen. Daarna kun je uitleggen met wie je praat vóór de sponsor en wat een goed nieuw contract bevat.',
      en: 'At Advanced you reset a failing project. You make an honest assessment, your own part included, and speak first to the right people. Afterwards you can explain whom to talk to before the sponsor and what a good new contract contains.',
    },
    4: {
      nl: 'Op Expert herstelt een senior een rood project. Het gaat om wat nog moet tegen wat nog kan en om wat er in een herstelplan hoort. Daarna kun je beoordelen welke eisen je moet loslaten en welke niet.',
      en: 'At Expert a senior recovers a red project. It is about what is still to do against what is still possible and what belongs in a recovery plan. Afterwards you can judge which requirements to let go and which not.',
    },
  },
  'pm.lead/influence': {
    2: {
      nl: 'Op Werkkennis gebruik je overtuigingsprincipes eerlijk. Je kent de zes principes en een zevende en ziet ze als neigingen, niet als wetten. Daarna kun je beantwoorden welk principe later is toegevoegd en waarom je ze niet als trucs gebruikt.',
      en: 'At Working knowledge you use persuasion principles honestly. You know the six principles and a seventh and see them as tendencies, not laws. Afterwards you can answer which principle was added later and why you do not use them as tricks.',
    },
    3: {
      nl: 'Op Gevorderd krijg je invloed zonder gezag. Je weet wat je anderen te bieden hebt en wie je als eerste wint. Daarna kun je uitleggen wat een currency is en waarom je met sleutelpersonen eerst apart praat.',
      en: 'At Advanced you gain influence without authority. You know what you have to offer others and whom to win first. Afterwards you can explain what a currency is and why you talk to key people separately first.',
    },
    4: {
      nl: 'Op Expert werkt een senior met coalities en het informele netwerk. Het gaat om wie met wie praat en om een manager die tegen is. Daarna kun je een kaart van invloed lezen en een eerste zet kiezen.',
      en: 'At Expert a senior works with coalitions and the informal network. It is about who talks to whom and a manager who is against. Afterwards you can read a map of influence and choose a first move.',
    },
  },
  'pm.lead/feedback': {
    2: {
      nl: 'Op Werkkennis geef je feedback met zorg en duidelijkheid. Je combineert persoonlijk bezorgd zijn met direct uitspreken. Daarna kun je beantwoorden wat de twee assen zijn en wat iemand prijzen in het gezicht en bekritiseren achter de rug heet.',
      en: 'At Working knowledge you give feedback with care and clarity. You combine caring personally with speaking directly. Afterwards you can answer what the two axes are and what praising to the face and criticising behind the back is called.',
    },
    3: {
      nl: 'Op Gevorderd voer je moeilijke gesprekken. Je kent drie soorten gesprekken en opent met een derde verhaal. Daarna kun je uitleggen welk gesprek je defensief maakt en hoe je opent als een opmerking pijn deed.',
      en: 'At Advanced you hold difficult conversations. You know three kinds of conversations and open with a third story. Afterwards you can explain which conversation makes you defensive and how to open when a remark hurt.',
    },
    4: {
      nl: 'Op Expert ontvangt een senior feedback die raakt. Het gaat om de triggers die je afweren en om hoe je er toch iets uit haalt. Daarna kun je beoordelen wat je met lastige feedback doet voor je antwoordt.',
      en: 'At Expert a senior receives feedback that hits home. It is about the triggers that make you push back and how to still take something from it. Afterwards you can judge what to do with awkward feedback before you answer.',
    },
  },
  'pm.lead/coaching': {
    2: {
      nl: 'Op Werkkennis coach je met de Toyota Kata. Je werkt met een doelsituatie en vijf vaste vragen. Daarna kun je beantwoorden wat een doelsituatie is en wat de vierde coachvraag is.',
      en: 'At Working knowledge you coach with the Toyota Kata. You work with a target condition and five fixed questions. Afterwards you can answer what a target condition is and what the fourth coaching question is.',
    },
    3: {
      nl: 'Op Gevorderd draai je coachingcycli goed. Je beslist wat je van een experiment bijhoudt en wat je doet als iemand weinig experimenteert. Daarna kun je uitleggen welke kolom het meest telt en wat je een leerling met één experiment in twee weken zegt.',
      en: 'At Advanced you run coaching cycles well. You decide what to record from an experiment and what to do when someone experiments little. Afterwards you can explain which column counts most and what to say to a learner with one experiment in two weeks.',
    },
    4: {
      nl: 'Op Expert kiest een senior tussen coachen, sturen en delegeren. Het gaat om de stijl die bij de ander past en om wat onderzoek over situationeel leiderschap zegt. Daarna kun je een stijl kiezen en dat verdedigen.',
      en: 'At Expert a senior chooses between coaching, directing and delegating. It is about the style that fits the other person and what research says about situational leadership. Afterwards you can choose a style and defend it.',
    },
  },
  'pm.lead/teams': {
    2: {
      nl: 'Op Werkkennis zie je hoe een team zich ontwikkelt. Je herkent de fase waarin meningsverschillen over doel en aanpak naar boven komen. Daarna kun je beantwoorden in welke fase dat gebeurt en wat het midden van een projectperiode doet.',
      en: 'At Working knowledge you see how a team develops. You recognise the stage in which disagreements about goals and methods come out. Afterwards you can answer in which stage that happens and what the midpoint of a project period does.',
    },
    3: {
      nl: 'Op Gevorderd lees je de dynamiek van een team. Je weet wat er eerst moet liggen voordat de rest werkt en herkent signalen van ontbrekende betrokkenheid. Daarna kun je uitleggen wat de basis is en hoe je als buitenstaander snel een gesprek op gang krijgt.',
      en: 'At Advanced you read the dynamics of a team. You know what must be in place before the rest works and recognise signs of missing commitment. Afterwards you can explain what the base is and how, as an outsider, to get a conversation going quickly.',
    },
    4: {
      nl: 'Op Expert bouwt een senior psychologische veiligheid. Het gaat om hoe je dat meet en om hoe je reageert als iemand een probleem meldt. Daarna kun je een score lezen en een reactie kiezen die de volgende melding mogelijk maakt.',
      en: 'At Expert a senior builds psychological safety. It is about how to measure it and how to respond when someone raises a problem. Afterwards you can read a score and choose a response that makes the next report possible.',
    },
  },
  'pm.perform/indicators': {
    2: {
      nl: 'Op Werkkennis vertaal je strategie naar de cijfers van een team. Je breekt een uitkomst op in delen die het team zelf kan beïnvloeden. Daarna kun je beantwoorden hoe je een weekuitkomst uit uren, benutting en tempo opbouwt.',
      en: 'At Working knowledge you translate strategy into a team’s numbers. You break an outcome into parts the team can influence itself. Afterwards you can answer how to build a weekly output from hours, utilisation and speed.',
    },
    3: {
      nl: 'Op Gevorderd definieer je een kengetal zodat niemand ruzie maakt. Je beslist wat telt, wanneer en vanaf welk moment. Daarna kun je uitleggen wat een operationele definitie is en hoe je een leverpercentage zo vastlegt dat het niet kan schuiven.',
      en: 'At Advanced you define a KPI so nobody argues. You decide what counts, when and from which moment. Afterwards you can explain what an operational definition is and how to fix a delivery percentage so it cannot drift.',
    },
    4: {
      nl: 'Op Expert toetst een senior de samenhang tussen kengetallen. Het gaat om een strategiekaart, om maten zonder verband en om kritiek op de logica van de kaart. Daarna kun je een scorekaart terugbrengen tot wat echt stuurt.',
      en: 'At Expert a senior tests the links between indicators. It is about a strategy map, measures without a connection and criticism of the logic of the map. Afterwards you can cut a scorecard back to what really steers.',
    },
  },
  'pm.perform/targets': {
    2: {
      nl: 'Op Werkkennis maak je doelen waar mensen in geloven. Je kijkt wanneer een moeilijk doel werkt en waarom een bandbreedte beter kan zijn dan één getal. Daarna kun je beantwoorden onder welke voorwaarden een moeilijk doel presteert en waarom je een bereik kiest.',
      en: 'At Working knowledge you make targets people believe in. You look at when a hard target works and why a range can beat a single figure. Afterwards you can answer under which conditions a hard target performs and why to choose a range.',
    },
    3: {
      nl: 'Op Gevorderd stuur je met Hoshin Kanri. Je laat doelen via heen-en-weer gesprekken door de organisatie lopen en bepaalt wat een doorbraak is. Daarna kun je uitleggen wat een doorbraakdoel bepaalt en hoe je een bedrag aan slechte kwaliteit in doelen omzet.',
      en: 'At Advanced you steer with Hoshin Kanri. You let targets flow through the organisation via back-and-forth conversations and determine what a breakthrough is. Afterwards you can explain what sets a breakthrough target and how to turn a cost of poor quality into goals.',
    },
    4: {
      nl: 'Op Expert weegt een senior doelen tegen spreiding. Het gaat om wat mensen doen als ze onder druk staan en om schommelingen die geen signaal zijn. Daarna kun je beoordelen of een gemist doel een reden is voor actie of voor rust.',
      en: 'At Expert a senior weighs targets against variation. It is about what people do under pressure and swings that are not a signal. Afterwards you can judge whether a missed target is a reason for action or for calm.',
    },
  },
  'pm.perform/behaviour': {
    2: {
      nl: 'Op Werkkennis herken je gedrag dat cijfers vervormt. Je kent de wet van Goodhart en let op waarschuwingstekens. Daarna kun je beantwoorden wat die wet zegt en wat je doet bij een vermoeden van gamen.',
      en: 'At Working knowledge you recognise behaviour that distorts figures. You know Goodhart’s law and watch for warning signs. Afterwards you can answer what that law says and what to do when you suspect gaming.',
    },
    3: {
      nl: 'Op Gevorderd kies je tussen meten om te leren en meten om te oordelen. Je ziet wat een oordeel met de gemeten waarden doet. Daarna kun je uitleggen wat Campbell toevoegt en waarom meldingen kunnen dalen terwijl het risico gelijk blijft.',
      en: 'At Advanced you choose between measuring to learn and measuring to judge. You see what a verdict does to the measured values. Afterwards you can explain what Campbell adds and why reports can fall while the risk stays the same.',
    },
    4: {
      nl: 'Op Expert coacht een senior de leider in de review. Het gaat om de verhouding tussen vragen en beweringen en om veiligheid in het gesprek. Daarna kun je een reviewgesprek beoordelen op wat het met het team doet.',
      en: 'At Expert a senior coaches the leader in the review. It is about the ratio of questions to statements and safety in the conversation. Afterwards you can assess a review conversation on what it does to the team.',
    },
  },
  'pm.perform/rhythm': {
    2: {
      nl: 'Op Werkkennis bouw je een ritme dat blijft. Je kiest wie de review voorzit en welke cijfers bij welke frequentie horen. Daarna kun je beantwoorden wie een nieuwe review het best leidt en welk getal in een maandelijks overleg past.',
      en: 'At Working knowledge you build a rhythm that lasts. You choose who chairs the review and which figures belong to which frequency. Afterwards you can answer who best leads a new review and which figure fits a monthly meeting.',
    },
    3: {
      nl: 'Op Gevorderd leid je de maandelijkse review van de plantmanager. Je kijkt naar plan tegen werkelijk en stuurt op afwijkingen. Daarna kun je uitleggen wat sturen op uitzonderingen betekent en welke maanden aandacht verdienen.',
      en: 'At Advanced you lead the plant manager’s monthly review. You look at plan against actual and steer on deviations. Afterwards you can explain what managing by exception means and which months deserve attention.',
    },
    4: {
      nl: 'Op Expert scheidt een senior signaal van ruis in de review. Het gaat om natuurlijke grenzen van een wekelijks cijfer en om wanneer een reeks echt verschoven is. Daarna kun je beoordelen of een afwijking uitleg vraagt of niet.',
      en: 'At Expert a senior separates signal from noise in the review. It is about the natural limits of a weekly figure and when a series has really shifted. Afterwards you can judge whether a deviation needs an explanation or not.',
    },
  },
  'pm.negotiate/prepare': {
    2: {
      nl: 'Op Werkkennis ken je je alternatief en dat van de ander. Je zoekt het gebied waarin een akkoord mogelijk is. Daarna kun je beantwoorden wat dat gebied is en wat je doet als je een ander aanbod hebt liggen.',
      en: 'At Working knowledge you know your alternative and theirs. You look for the area in which a deal is possible. Afterwards you can answer what that area is and what to do when you have another offer on the table.',
    },
    3: {
      nl: 'Op Gevorderd maak je een voorbereidingsblad dat standhoudt. Je scheidt je streefpunt van je grens en rangschikt de onderwerpen voor beide kanten. Daarna kun je uitleggen wat het verschil is tussen die punten en waarom je ook de ander rangschikt.',
      en: 'At Advanced you make a preparation sheet that holds. You separate your target from your walk-away point and rank the issues for both sides. Afterwards you can explain the difference between those points and why you also rank for the other side.',
    },
    4: {
      nl: 'Op Expert onderhandelt een senior vanuit een zwakkere positie. Het gaat om wat je de ander te bieden hebt en om hefboom die je eerlijk mag gebruiken. Daarna kun je een zet kiezen die je kracht geeft zonder te dreigen.',
      en: 'At Expert a senior negotiates from a weaker position. It is about what you can offer the other side and leverage you may use honestly. Afterwards you can choose a move that gives you strength without threatening.',
    },
  },
  'pm.negotiate/trade': {
    2: {
      nl: 'Op Werkkennis doe je concessies zonder je te laten leeglopen. Je geeft weinig en vraagt altijd iets terug. Daarna kun je beantwoorden wat een concessie voorwaardelijk maakt en waar je terechtkomt als je je plan volgt.',
      en: 'At Working knowledge you make concessions without being drained. You give little and always ask for something back. Afterwards you can answer what makes a concession conditional and where you end up if you follow your plan.',
    },
    3: {
      nl: 'Op Gevorderd ruil je over onderwerpen heen. Je maakt pakketten en geeft de ander meer dan één keuze. Daarna kun je uitleggen wat logrolling is, wat een MESO is en welk pakket het meeste oplevert.',
      en: 'At Advanced you trade across issues. You make packages and give the other side more than one choice. Afterwards you can explain what logrolling is, what a MESO is and which package returns most.',
    },
    4: {
      nl: 'Op Expert ga je om met harde tactieken. Je gebruikt stappen uit het Harvard-werk en gereedschap uit gijzelingsonderhandelingen. Daarna kun je beantwoorden in welke volgorde je op een harde tactiek reageert en wat naar het balkon gaan betekent.',
      en: 'At Expert you deal with hard tactics. You use steps from the Harvard work and tools from hostage negotiation. Afterwards you can answer in which order to respond to a hard tactic and what going to the balcony means.',
    },
  },
  'pm.negotiate/clients': {
    2: {
      nl: 'Op Werkkennis houd je je tarief overeind. Je biedt een andere vorm in plaats van een korting op je dagprijs. Daarna kun je beantwoorden wat tariefintegriteit is en hoe je een percentage korting beantwoordt zonder je prijs te verlagen.',
      en: 'At Working knowledge you hold your rate. You offer another form instead of a cut to your day rate. Afterwards you can answer what rate integrity is and how to answer a request for a percentage off without lowering your price.',
    },
    3: {
      nl: 'Op Gevorderd leg je aannames en voorwaarden vast. Je kiest wat bij de prijs hoort en wat in de voorwaarden staat. Daarna kun je uitleggen wat een aanname in een voorstel is en wanneer je over voorwaarden onderhandelt.',
      en: 'At Advanced you set down assumptions and terms. You choose what goes with the price and what sits in the terms. Afterwards you can explain what an assumption in a proposal is and when to negotiate terms.',
    },
    4: {
      nl: 'Op Expert heropent een senior een afspraak midden in het project. Het gaat om het moment waarop een aanname faalt en om de oorzaak los te zien van de oplossing. Daarna kun je een heronderhandeling openen zonder de relatie te beschadigen.',
      en: 'At Expert a senior reopens a deal mid-project. It is about the moment an assumption fails and separating the cause from the solution. Afterwards you can open a renegotiation without damaging the relationship.',
    },
  },
  'pm.negotiate/ground': {
    2: {
      nl: 'Op Werkkennis ben je assertief zonder agressief te worden. Je weet wat assertiviteit is en kent de twee assen van een bekend model. Daarna kun je beantwoorden wat assertiviteit inhoudt en welke twee assen het Thomas-Kilmann-model gebruikt.',
      en: 'At Working knowledge you are assertive without becoming aggressive. You know what assertiveness is and the two axes of a well-known model. Afterwards you can answer what assertiveness involves and which two axes the Thomas-Kilmann model uses.',
    },
    3: {
      nl: 'Op Gevorderd spreek je iemand van hoger niveau tegen. Je bereidt drie dingen voor en houdt ze uit elkaar. Daarna kun je uitleggen welke drie dat zijn en wat je doet als een senior tegen je voorstel besluit.',
      en: 'At Advanced you disagree with someone more senior. You prepare three things and keep them apart. Afterwards you can explain which three those are and what to do when a senior decides against your proposal.',
    },
    4: {
      nl: 'Op Expert escaleert een senior zonder bruggen te verbranden. Het gaat om een herhaalde boodschap, om een gezamenlijke escalatie en om een gouden brug. Daarna kun je een escalatie kiezen die de relatie overleeft.',
      en: 'At Expert a senior escalates without burning bridges. It is about a repeated message, a joint escalation and a golden bridge. Afterwards you can choose an escalation that the relationship survives.',
    },
  },
  'pm.outside/mindset': {
    2: {
      nl: 'Op Werkkennis ben je nieuwsgierig en nederig. Je weet wat intellectuele bescheidenheid is en stelt een naïeve vraag zonder dom over te komen. Daarna kun je beantwoorden wat Dunning en Kruger vonden en hoe je zo’n vraag stelt.',
      en: 'At Working knowledge you are curious and humble. You know what intellectual humility is and ask a naive question without looking clueless. Afterwards you can answer what Dunning and Kruger found and how to ask such a question.',
    },
    3: {
      nl: 'Op Gevorderd word je geloofwaardig zonder de inhoud te kennen. Je gebruikt de vergelijking over vertrouwen en weet wat je wel kunt leveren. Daarna kun je uitleggen wat onder de lijn van die vergelijking staat en waarom geloofwaardigheid meer is dan kennis.',
      en: 'At Advanced you become credible without knowing the content. You use the trust equation and know what you can deliver. Afterwards you can explain what sits below the line of that equation and why credibility is more than knowledge.',
    },
    4: {
      nl: 'Op Expert weet een senior wat je nooit uit handen geeft. Het gaat om drie dingen die bij de projectleider blijven en om verantwoordelijkheid in een RACI. Daarna kun je uitleggen wat je wel en niet delegeert aan een expert.',
      en: 'At Expert a senior knows what you never hand over. It is about three things that stay with the project leader and accountability in a RACI. Afterwards you can explain what you do and do not delegate to an expert.',
    },
  },
  'pm.outside/questions': {
    2: {
      nl: 'Op Werkkennis vraag je wat het zou laten mislukken. Je houdt een premortem en ziet hoeveel meer redenen mensen noemen als ze zich een mislukking voorstellen. Daarna kun je beantwoorden wat er in een premortem gebeurt en waarom het werkt.',
      en: 'At Working knowledge you ask what would make it fail. You hold a premortem and see how many more reasons people name when they imagine a failure. Afterwards you can answer what happens in a premortem and why it works.',
    },
    3: {
      nl: 'Op Gevorderd controleer je schattingen zonder de inhoud te kennen. Je gebruikt de planningsfout en een schatting met drie waarden. Daarna kun je uitleggen wat de planningsfout is en hoe je uit drie waarden een verwachting haalt.',
      en: 'At Advanced you check estimates without knowing the content. You use the planning fallacy and a three-point estimate. Afterwards you can explain what the planning fallacy is and how to get an expectation from three values.',
    },
    4: {
      nl: 'Op Expert vertaal je vaktaal terug naar het project. Je stelt drie vragen die jargon omzetten in een gevolg en vraagt terug hoe de ander het begrepen heeft. Daarna kun je beantwoorden wat teach-back is en welke vragen jargon projectgevolgen laten krijgen.',
      en: 'At Expert you translate jargon back into the project. You ask three questions that turn jargon into a consequence and ask the other person to say it back. Afterwards you can answer what teach-back is and which questions give jargon project consequences.',
    },
  },
  'pm.outside/experts': {
    2: {
      nl: 'Op Werkkennis ga je om met experts die het oneens zijn. Je legt eerst op tafel wat ze delen en zoekt waar het verschil zit. Daarna kun je beantwoorden wat je als eerste op tafel legt en wie de gewichten in een afweging bepaalt.',
      en: 'At Working knowledge you deal with experts who disagree. You first put on the table what they share and look for where the difference sits. Afterwards you can answer what to put on the table first and who sets the weights in a trade-off.',
    },
    3: {
      nl: 'Op Gevorderd kijk je naar tijd en motivatie van experts. Je beslist hoe je om tijd vraagt en wat de afleiding van wisselen kost. Daarna kun je uitleggen wat contextwisseling is en welke drie drijfveren kenniswerk heeft.',
      en: 'At Advanced you look at experts’ time and motivation. You decide how to ask for time and what the distraction of switching costs. Afterwards you can explain what context switching is and which three drivers knowledge work has.',
    },
    4: {
      nl: 'Op Expert herkent een senior rode vlaggen. Het gaat om het negentig-negentigeffect, om een status die er groen uitziet en om het sterkste signaal na maanden bouwen. Daarna kun je beoordelen of een expert op koers is.',
      en: 'At Expert a senior spots red flags. It is about the ninety-ninety rule, a status that looks green and the strongest signal after months of building. Afterwards you can judge whether an expert is on track.',
    },
  },
  'pm.outside/steer': {
    2: {
      nl: 'Op Werkkennis beslis je onder onzekerheid en escaleer je. Je weet wat een eenrichtingsdeur is en hoeveel informatie genoeg is voor de meeste besluiten. Daarna kun je beantwoorden wat een eenrichtingsbesluit is en wanneer je het toch neemt.',
      en: 'At Working knowledge you decide under uncertainty and escalate. You know what a one-way door is and how much information is enough for most decisions. Afterwards you can answer what a one-way decision is and when to take it anyway.',
    },
    3: {
      nl: 'Op Gevorderd communiceer je met stakeholders. Je gebruikt het piramideprincipe en let op hoe je een besluit aankondigt. Daarna kun je uitleggen wat het principe zegt en wat je in een bericht vooraan zet.',
      en: 'At Advanced you communicate with stakeholders. You use the pyramid principle and watch how you announce a decision. Afterwards you can explain what the principle says and what to put first in a message.',
    },
    4: {
      nl: 'Op Expert leert een senior snel een nieuw vak. Het gaat om een plan voor negentig dagen, om een woordenlijst en om vragen die de basis blootleggen. Daarna kun je een inwerkplan voor een nieuw veld opzetten.',
      en: 'At Expert a senior learns a new field fast. It is about a ninety-day plan, a glossary and questions that expose the basics. Afterwards you can set up an onboarding plan for a new field.',
    },
  },
  'pm.portfolio/programmes': {
    2: {
      nl: 'Op Werkkennis draai je een programma met MSP. Je rekent wat een tranche oplevert en kent de rollen. Daarna kun je beantwoorden wat een eerste tranche per jaar oplevert en welke rol zorgt dat de baten behaald worden.',
      en: 'At Working knowledge you run a programme with MSP. You work out what a tranche returns and know the roles. Afterwards you can answer what a first tranche returns per year and which role makes sure the benefits are achieved.',
    },
    3: {
      nl: 'Op Gevorderd beheer je afhankelijkheden tussen projecten. Je weet welke je kunt sturen en welke alleen kunt volgen. Daarna kun je uitleggen welk soort afhankelijkheid je niet kunt sturen en hoe vier paden samenkomen in één livegang.',
      en: 'At Advanced you manage dependencies between projects. You know which you can steer and which you can only follow. Afterwards you can explain which kind of dependency you cannot steer and how four paths merge into one go-live.',
    },
    4: {
      nl: 'Op Expert weegt een senior hoeveel verandering een fabriek aankan. Het gaat om verzadiging, om het besluit aan het eind van een tranche en om een warmtekaart van de last. Daarna kun je een tranche beoordelen op wat de organisatie verdraagt.',
      en: 'At Expert a senior weighs how much change a plant can absorb. It is about saturation, the decision at the end of a tranche and a heatmap of the load. Afterwards you can judge a tranche on what the organisation can bear.',
    },
  },
  'pm.portfolio/priorities': {
    2: {
      nl: 'Op Werkkennis zie je dezelfde experts overal. Je rekent hoeveel dagen een expert echt voor projecten heeft en zet het in een capaciteitsmatrix. Daarna kun je beantwoorden hoeveel projectdagen er overblijven en wat in zo’n matrix staat.',
      en: 'At Working knowledge you see the same experts everywhere. You work out how many days an expert really has for projects and put it in a capacity matrix. Afterwards you can answer how many project days remain and what goes in such a matrix.',
    },
    3: {
      nl: 'Op Gevorderd reken je met de kosten van wachten. Je ziet wat een maand vertraging kost en wat een vaste datum verandert. Daarna kun je uitleggen wat een project per maand oplevert en welke urgentie een vaste datum heeft.',
      en: 'At Advanced you calculate the cost of waiting. You see what a month of delay costs and what a fixed date changes. Afterwards you can explain what a project returns per month and what urgency a fixed date has.',
    },
    4: {
      nl: 'Op Expert brengt een senior balans in het portfolio. Het gaat om verplichte projecten die er vooraf af gaan en om emmers voor strategie. Daarna kun je een budget verdelen en een lijst opschonen.',
      en: 'At Expert a senior brings balance to the portfolio. It is about mandatory projects that come off the top and buckets for strategy. Afterwards you can divide a budget and clean up a list.',
    },
  },
  'pm.portfolio/governance': {
    2: {
      nl: 'Op Werkkennis loop je de poorten van een project. Je weet wat wachten als besluit betekent en rekent een terugverdientijd uit. Daarna kun je beantwoorden wat een hold bij een poort is en hoe lang een investering erover doet.',
      en: 'At Working knowledge you walk a project’s gates. You know what hold means as a decision and work out a payback. Afterwards you can answer what a hold at a gate is and how long an investment takes to pay back.',
    },
    3: {
      nl: 'Op Gevorderd sta je voor het bestuur. Je zet het besluit bovenaan en houdt de spreektijd kort. Daarna kun je uitleggen wat bovenaan een bestuursstuk hoort en hoeveel minuten je praat voordat het gesprek begint.',
      en: 'At Advanced you stand before the board. You put the decision at the top and keep your talking time short. Afterwards you can explain what goes at the top of a board paper and how many minutes you talk before the discussion starts.',
    },
    4: {
      nl: 'Op Expert waarborgt een senior onafhankelijke toetsing. Het gaat om de drie lijnen en om waar een PMO past. Daarna kun je beoordelen of een toets echt onafhankelijk is en waar ze voor dient.',
      en: 'At Expert a senior secures independent assurance. It is about the three lines and where a PMO fits. Afterwards you can judge whether a check is truly independent and what it is for.',
    },
  },
  'pm.portfolio/benefits': {
    2: {
      nl: 'Op Werkkennis maak je een batenkaart. Je volgt van verandering naar baat en rekent wat een lagere voorraad oplevert. Daarna kun je beantwoorden wat een bedrijfsverandering is en wat een daling van voorraad per jaar waard is.',
      en: 'At Working knowledge you make a benefits map. You follow from change to benefit and work out what lower stock returns. Afterwards you can answer what a business change is and what a drop in stock is worth per year.',
    },
    3: {
      nl: 'Op Gevorderd volg je baten over het portfolio. Je houdt rekening met een opbouw over kwartalen en kiest een voorlopende indicator. Daarna kun je uitleggen hoeveel van een baat er in een kwartaal is behaald en wat een voorlopende indicator is.',
      en: 'At Advanced you track benefits across the portfolio. You allow for a build-up over quarters and choose a leading indicator. Afterwards you can explain how much of a benefit has been realised in a quarter and what a leading indicator is.',
    },
    4: {
      nl: 'Op Expert bouw je realistische business cases. Het gaat om opgeblazen baten, om een referentieklasse en om eerlijkheid in een strijd om budget. Daarna kun je een case toetsen op wat vergelijkbare projecten haalden.',
      en: 'At Expert you build realistic business cases. It is about inflated benefits, a reference class and honesty in a fight for budget. Afterwards you can test a case against what comparable projects achieved.',
    },
  },
  'pm.consult/offer': {
    2: {
      nl: 'Op Werkkennis prijs je een opdracht. Je rekent wat een vaste prijs oplevert als het werk uitloopt en wanneer waardegerichte prijsstelling past. Daarna kun je beantwoorden wat je effectieve dagtarief is en wanneer waardeprijs past.',
      en: 'At Working knowledge you price an assignment. You work out what a fixed price returns when the work overruns and when value-based pricing fits. Afterwards you can answer what your effective day rate is and when value pricing fits.',
    },
    3: {
      nl: 'Op Gevorderd kies je tussen waardeprijs en kritiek erop. Je spreekt met de controller af wat meetelt. Daarna kun je uitleggen wat de grootste kritiek op waardeprijs is en hoe je baten voorzichtig telt.',
      en: 'At Advanced you weigh value pricing against its critics. You agree with the controller what counts. Afterwards you can explain the main criticism of value pricing and how to count benefits cautiously.',
    },
    4: {
      nl: 'Op Expert prijst een senior het risico in een vast bod. Het gaat om kansen op extra dagen en om een maximum dat je meegeeft. Daarna kun je een risico-opslag berekenen en verdedigen.',
      en: 'At Expert a senior prices the risk in a fixed bid. It is about chances of extra days and a cap you give along. Afterwards you can work out a risk premium and defend it.',
    },
  },
  'pm.consult/advisor': {
    2: {
      nl: 'Op Werkkennis kies je je rol als helper. Je kent de rollen van Block en Schein en ziet het risico van alleen handen zijn. Daarna kun je beantwoorden wat het grootste risico van die rol is en waarom je in het eerste gesprek over het proces begint.',
      en: 'At Working knowledge you choose your role as a helper. You know the roles of Block and Schein and see the risk of being only a pair of hands. Afterwards you can answer what the biggest risk of that role is and why you start with the process in a first conversation.',
    },
    3: {
      nl: 'Op Gevorderd ga je om met weerstand tegen je advies. Je volgt drie stappen en onderscheidt een echte bezwaar van weerstand. Daarna kun je uitleggen welke drie stappen dat zijn en hoe je het verschil herkent.',
      en: 'At Advanced you deal with resistance to your advice. You follow three steps and tell a real objection from resistance. Afterwards you can explain which three steps those are and how you recognise the difference.',
    },
    4: {
      nl: 'Op Expert bouwt een senior een nederige relatie op een dieper niveau. Het gaat om een open, persoonlijke verhouding vanaf het eerste contact en om aanpassende zetten. Daarna kun je een relatie beoordelen op openheid.',
      en: 'At Expert a senior builds a humble relationship at a deeper level. It is about an open, personal relationship from first contact and adaptive moves. Afterwards you can assess a relationship on openness.',
    },
  },
  'pm.consult/ethics': {
    2: {
      nl: 'Op Werkkennis ga je om met klantgegevens. Je weet wat de wet tussen jou en de klant eist en wat dataminimalisatie inhoudt. Daarna kun je beantwoorden wat tussen jullie vastgelegd moet worden en waarom je minder gegevens vraagt.',
      en: 'At Working knowledge you deal with client data. You know what the law requires between you and the client and what data minimisation involves. Afterwards you can answer what must be recorded between you and why you ask for less data.',
    },
    3: {
      nl: 'Op Gevorderd los je dilemma’s tijdens een opdracht op. Je weet wat je als eerste doet en hoe je met een geschenk omgaat. Daarna kun je uitleggen wat de eerste stap bij een dilemma is en wat je doet met een uitnodiging van een leverancier.',
      en: 'At Advanced you resolve dilemmas during an assignment. You know what to do first and how to handle a gift. Afterwards you can explain what the first step in a dilemma is and what to do with an invitation from a supplier.',
    },
    4: {
      nl: 'Op Expert weet een senior wanneer hij weggaat. Het gaat om wat voor een terugtrekking komt, om beroepscodes en om een titel die niet beschermd is. Daarna kun je een besluit om te stoppen met een opdracht onderbouwen.',
      en: 'At Expert a senior knows when to walk away. It is about what comes before withdrawing, professional codes and a title that is not protected. Afterwards you can back up a decision to stop an assignment.',
    },
  },
  'pm.consult/grow': {
    2: {
      nl: 'Op Werkkennis bouw je je eigen praktijk. Je rekent je jaaromzet uit en wat een winstkans per voorstel betekent. Daarna kun je beantwoorden hoeveel je per jaar omzet en hoeveel voorstellen je daarvoor nodig hebt.',
      en: 'At Working knowledge you build your own practice. You work out your yearly revenue and what a win rate per proposal means. Afterwards you can answer how much you turn over per year and how many proposals you need for it.',
    },
    3: {
      nl: 'Op Gevorderd word je bekend om een standpunt. Je bepaalt waar het vandaan moet komen en wat tijd in schrijven en spreken kost. Daarna kun je uitleggen waar thought leadership vandaan komt en welk deel van je tijd het mag kosten.',
      en: 'At Advanced you become known for a point of view. You decide where it must come from and what time spent writing and speaking costs. Afterwards you can explain where thought leadership comes from and what share of your time it may cost.',
    },
    4: {
      nl: 'Op Expert kijkt een senior voorbij zichzelf. Het gaat om hefboom via medewerkers en om de regels voor zzp’ers. Daarna kun je beoordelen of een hefboom zich terugverdient en wat de regels vragen.',
      en: 'At Expert a senior looks beyond themselves. It is about leverage through associates and the rules for independents. Afterwards you can judge whether leverage pays off and what the rules require.',
    },
  },
  'pm.agile/mindset': {
    2: {
      nl: 'Op Werkkennis ga je de principes in de praktijk brengen. Je toetst wat je doet aan wat het manifest echt vraagt. Daarna kun je beantwoorden wat de belangrijkste maat voor voortgang is en welk principe past bij een rapport waarvan weinig velden worden gebruikt.',
      en: 'At Working knowledge you start putting the principles into practice. You test what you do against what the manifesto really asks. Afterwards you can answer what the main measure of progress is and which principle fits a report whose fields are barely used.',
    },
    3: {
      nl: 'Op Gevorderd leg je agile naast Lean. Je ziet waar ze op elkaar lijken en waar niet, en vertaalt verspilling van de fabriek naar software. Daarna kun je uitleggen waarop Scrum gebouwd is en welke softwareverspilling bij voorraad hoort.',
      en: 'At Advanced you lay agile next to Lean. You see where they are alike and where not, and translate factory waste to software. Afterwards you can explain what Scrum is founded on and which software waste matches inventory.',
    },
    4: {
      nl: 'Op Expert weegt een senior wanneer agile past. Het gaat om werk met onzekerheid, om teams die de vorm hebben maar niet de uitkomst en om wat je dan verandert. Daarna kun je een organisatie beoordelen op echte agile of alleen de rituelen.',
      en: 'At Expert a senior weighs when agile fits. It is about work with uncertainty, teams that have the form but not the outcome and what to change then. Afterwards you can assess an organisation on real agile or only the rituals.',
    },
  },
  'pm.agile/scrum': {
    2: {
      nl: 'Op Werkkennis loop je de vijf events door. Je plant ze in een sprint en kent de grenzen in tijd. Daarna kun je beantwoorden hoeveel tijd een sprint aan het dagelijkse overleg kwijt is en hoe lang een planning maximaal mag duren.',
      en: 'At Working knowledge you walk through the five events. You schedule them in a sprint and know the time limits. Afterwards you can answer how much time a sprint spends on the daily meeting and how long planning may take at most.',
    },
    3: {
      nl: 'Op Gevorderd werk je met de drie artefacten en hun verplichtingen. Je beslist wie wat bezit en wat er gebeurt met werk dat niet af is. Daarna kun je uitleggen welke verplichting bij de backlog hoort en wie de sprintbacklog beheert.',
      en: 'At Advanced you work with the three artefacts and their commitments. You decide who owns what and what happens to work that is not finished. Afterwards you can explain which commitment belongs to the backlog and who owns the sprint backlog.',
    },
    4: {
      nl: 'Op Expert kijkt een senior naar wat er misgaat. Het gaat om een proxy product owner, om zelfsturing en om vragen die de zwakke plek laten zien. Daarna kun je een Scrumteam doorlichten en benoemen wat je eerst verandert.',
      en: 'At Expert a senior looks at what goes wrong. It is about a proxy product owner, self-management and questions that reveal the weak spot. Afterwards you can review a Scrum team and name what to change first.',
    },
  },
  'pm.agile/backlog': {
    2: {
      nl: 'Op Werkkennis maak je de backlog klaar. Je knipt werk in stukjes die iets werkends opleveren en toetst ze aan een bekende lijst. Daarna kun je beantwoorden waar de S voor staat en wat klaar voor oppakken betekent.',
      en: 'At Working knowledge you get the backlog ready. You cut work into pieces that deliver something working and test them against a well-known checklist. Afterwards you can answer what the S stands for and what ready to pick up means.',
    },
    3: {
      nl: 'Op Gevorderd werk je met punten, poker en snelheid. Je rekent het gemiddelde uit en weet wat een snelheid wel en niet vertelt. Daarna kun je uitleggen wat je gemiddelde snelheid is en welk getal je voor een planning pakt.',
      en: 'At Advanced you work with points, poker and velocity. You work out the average and know what velocity does and does not tell you. Afterwards you can explain what your average velocity is and which figure to take for planning.',
    },
    4: {
      nl: 'Op Expert voorspelt een senior zonder valse zekerheid. Het gaat om de onzekerheidskegel en om een voorspelling met kansen in plaats van een datum. Daarna kun je een bandbreedte geven en uitleggen waarom één datum misleidt.',
      en: 'At Expert a senior forecasts without false certainty. It is about the cone of uncertainty and a forecast with probabilities instead of a date. Afterwards you can give a range and explain why a single date misleads.',
    },
  },
  'pm.agile/kanban': {
    2: {
      nl: 'Op Werkkennis stel je grenzen aan werk in uitvoering. Je rekent per persoon en begrijpt waarom minder starten meer afmaakt. Daarna kun je beantwoorden wat een WIP-limiet is en hoeveel werk per persoon in uitvoering te veel is.',
      en: 'At Working knowledge you set limits on work in progress. You count per person and understand why starting less finishes more. Afterwards you can answer what a WIP limit is and how much work per person in progress is too much.',
    },
    3: {
      nl: 'Op Gevorderd meet je doorlooptijd en doorvoer. Je gebruikt de wet van Little om verbanden te zien. Daarna kun je uitleggen hoe lang een item gemiddeld onderweg is en wat doorlooptijd precies meet.',
      en: 'At Advanced you measure cycle time and throughput. You use Little’s law to see the links. Afterwards you can explain how long an item is on its way on average and what cycle time exactly measures.',
    },
    4: {
      nl: 'Op Expert stuur je op stroom. Het gaat om verwachtingen, om items die oud worden en om wat een hoge bezetting met de wachttijd doet. Daarna kun je een team adviseren welke bezetting nog gezond is.',
      en: 'At Expert you steer on flow. It is about expectations, items that age and what high utilisation does to waiting time. Afterwards you can advise a team on which utilisation is still healthy.',
    },
  },
  'pm.scaled/safe': {
    2: {
      nl: 'Op Werkkennis plan je twee dagen samen. Je doet mee aan de planning van een hele trein en leest de vertrouwensstemming. Daarna kun je beantwoorden wat de stemming met vingers zegt en wie de zakelijke context geeft.',
      en: 'At Working knowledge you plan together for two days. You take part in the planning of a whole train and read the confidence vote. Afterwards you can answer what the vote with fingers says and who provides the business context.',
    },
    3: {
      nl: 'Op Gevorderd weet je wie waarover beslist. Je onderscheidt rollen op teamniveau en treinniveau. Daarna kun je uitleggen wie de lijst met features voor de hele trein ordent en welke beschrijving bij de trainingenieur past.',
      en: 'At Advanced you know who decides what. You tell roles at team level from roles at train level. Afterwards you can explain who orders the list of features for the whole train and which description fits the release train engineer.',
    },
    4: {
      nl: 'Op Expert weegt een senior hoeveel SAFe nodig is. Het gaat om de vier configuraties en om een bedrijfswaarde die je eerlijk scoort. Daarna kun je een configuratie kiezen die bij de organisatie past en niet bij het boek.',
      en: 'At Expert a senior weighs how much SAFe is needed. It is about the four configurations and a business value you score honestly. Afterwards you can choose a configuration that fits the organisation and not the book.',
    },
  },
  'pm.scaled/portfolio': {
    2: {
      nl: 'Op Werkkennis knip je een groot initiatief in stappen. Je vergelijkt een volledige uitrol met een kleinste versie om te testen. Daarna kun je beantwoorden wat een MVP kost ten opzichte van de uitrol en wat het verschil met een epic is.',
      en: 'At Working knowledge you cut a large initiative into steps. You compare a full rollout with a smallest version to test. Afterwards you can answer what an MVP costs relative to the rollout and what the difference with an epic is.',
    },
    3: {
      nl: 'Op Gevorderd stel je prioriteit met WSJF. Je weegt waarde, tijdsdruk en risico tegen de grootte van het werk. Daarna kun je uitleggen wat Cost of Delay meet en hoe je twee features op score rangschikt.',
      en: 'At Advanced you prioritise with WSJF. You weigh value, time pressure and risk against the size of the work. Afterwards you can explain what Cost of Delay measures and how to rank two features on score.',
    },
    4: {
      nl: 'Op Expert stuurt een senior met budgetten en leuningen. Het gaat om verdeling van capaciteit over soorten werk en om budgetteren met inspraak. Daarna kun je een budgetopzet voor een trein beoordelen.',
      en: 'At Expert a senior steers with budgets and guardrails. It is about spreading capacity over types of work and budgeting with participation. Afterwards you can assess a budget set-up for a train.',
    },
  },
  'pm.scaled/alternatives': {
    2: {
      nl: 'Op Werkkennis kijk je naar Nexus. Je ziet hoe een integratieteam werk samenbrengt en hoe vaak je integreert. Daarna kun je beantwoorden hoeveel sprints je aan werk laat liggen bij een lange integratiecyclus en hoeveel teams een Nexus telt.',
      en: 'At Working knowledge you look at Nexus. You see how an integration team brings work together and how often you integrate. Afterwards you can answer how many sprints of work you let pile up with a long integration cycle and how many teams a Nexus has.',
    },
    3: {
      nl: 'Op Gevorderd ontleed je het Spotify-model. Je telt mensen in stammen en squads en ziet de valkuilen. Daarna kun je uitleggen wat een chapter is en waarom het model geen recept is.',
      en: 'At Advanced you take the Spotify model apart. You count people in tribes and squads and see the pitfalls. Afterwards you can explain what a chapter is and why the model is not a recipe.',
    },
    4: {
      nl: 'Op Expert weegt een senior kritiek op SAFe eerlijk. Het gaat om wat de critici aanvoeren en wat een stemming echt zegt. Daarna kun je een oordeel over SAFe geven dat zowel de voor- als de nadelen laat zien.',
      en: 'At Expert a senior weighs criticism of SAFe fairly. It is about what the critics argue and what a vote really says. Afterwards you can give a verdict on SAFe that shows both the pros and the cons.',
    },
  },
  'pm.scaled/hybrid': {
    2: {
      nl: 'Op Werkkennis plan je terug vanaf de start van de serie. Je telt weken terug vanaf SOP en herkent onderdelen met een lange levertijd. Daarna kun je beantwoorden wanneer iets moet starten en wat een long-lead item is.',
      en: 'At Working knowledge you plan backwards from the start of series. You count weeks back from SOP and recognise items with a long lead time. Afterwards you can answer when something must start and what a long-lead item is.',
    },
    3: {
      nl: 'Op Gevorderd laat je hardware en software samenkomen. Je plant integratiepunten en kiest hoe vaak je ze herhaalt. Daarna kun je uitleggen hoeveel integratiemomenten een project heeft en wat hardware in de loop met zich meebrengt.',
      en: 'At Advanced you bring hardware and software together. You plan integration points and choose how often to repeat them. Afterwards you can explain how many integration moments a project has and what hardware in the loop brings.',
    },
    4: {
      nl: 'Op Expert zet een senior een hybride aanpak op. Het gaat om poortchecklists die je snoeit en om wat je laat staan omdat de wet het eist. Daarna kun je een hybride werkwijze verdedigen tegenover een ploeg die alles wil of niets.',
      en: 'At Expert a senior sets up a hybrid approach. It is about gate checklists you trim and what you keep because the law demands it. Afterwards you can defend a hybrid way of working against a crowd that wants all or nothing.',
    },
  },
  'pm.devops/pipeline': {
    2: {
      nl: 'Op Werkkennis automatiseer je testen. Je kent de lagen en rekent uit wat een trage reeks aan tijd kost. Daarna kun je beantwoorden hoe lang een reeks van twintig volledige testen duurt en welke laag het snelst is.',
      en: 'At Working knowledge you automate tests. You know the layers and work out what a slow suite costs in time. Afterwards you can answer how long a suite of twenty end-to-end tests takes and which layer is fastest.',
    },
    3: {
      nl: 'Op Gevorderd integreer je continu. Je weegt de kosten van samenvoeren na weken tegen vaak en klein samenvoegen. Daarna kun je uitleggen wat een team aan samenvoegconflicten kwijt is en wat trunk-based werken verandert.',
      en: 'At Advanced you integrate continuously. You weigh the cost of merging after weeks against merging often and small. Afterwards you can explain what a team loses to merge conflicts and what trunk-based working changes.',
    },
    4: {
      nl: 'Op Expert brengt een senior continu leveren naar de fabriek. Het gaat om wat doorlopend uitrollen betekent en waarom een machine-PLC zich daar slecht voor leent. Daarna kun je beoordelen waar leveren in kleine stappen past.',
      en: 'At Expert a senior brings continuous delivery to the factory. It is about what continuous deployment means and why a machine PLC lends itself poorly to it. Afterwards you can judge where delivering in small steps fits.',
    },
  },
  'pm.devops/dora': {
    2: {
      nl: 'Op Werkkennis meet je DORA zonder jezelf voor de gek te houden. Je rekent het aandeel mislukte wijzigingen uit en kiest de juiste mediaan. Daarna kun je beantwoorden hoe je het mislukkingspercentage berekent en waarom je een mediaan boven een gemiddelde verkiest.',
      en: 'At Working knowledge you measure DORA without fooling yourself. You work out the share of failed changes and pick the right median. Afterwards you can answer how to calculate the change failure rate and why to prefer a median over an average.',
    },
    3: {
      nl: 'Op Gevorderd lees je benchmarks kritisch. Je weet wat de rapporten werkelijk zeggen en wat een elitegroep betekent. Daarna kun je uitleggen welk percentage bij de beste groep hoort en waarom vergelijken met anderen misleidt.',
      en: 'At Advanced you read benchmarks critically. You know what the reports really say and what an elite group means. Afterwards you can explain which percentage belongs to the best group and why comparing with others misleads.',
    },
    4: {
      nl: 'Op Expert stuurt een senior met DORA zonder de maat kapot te maken. Het gaat om een wachtrij die de doorlooptijd bepaalt en om doelen die gedrag veranderen. Daarna kun je een verbetering kiezen die niet alleen het getal verbetert.',
      en: 'At Expert a senior steers with DORA without breaking the measure. It is about a queue that sets the lead time and targets that change behaviour. Afterwards you can choose an improvement that does not only improve the figure.',
    },
  },
  'pm.devops/release': {
    2: {
      nl: 'Op Werkkennis scheid je uitrollen van vrijgeven. Je gebruikt feature flags en ziet hoeveel combinaties dat geeft. Daarna kun je beantwoorden wat het verschil is tussen deployen en releasen en hoeveel combinaties tien vlaggen geven.',
      en: 'At Working knowledge you separate deploying from releasing. You use feature flags and see how many combinations that gives. Afterwards you can answer what the difference is between deploying and releasing and how many combinations ten flags give.',
    },
    3: {
      nl: 'Op Gevorderd ga je veilig live. Je kiest tussen blauw-groen, canary en rollend en rekent hoeveel gebruikers de eerste stap raakt. Daarna kun je uitleggen hoeveel gebruikers een canary bereikt en welke methode bij welk risico past.',
      en: 'At Advanced you go live safely. You choose between blue-green, canary and rolling and work out how many users the first step reaches. Afterwards you can explain how many users a canary reaches and which method fits which risk.',
    },
    4: {
      nl: 'Op Expert kiest een senior tussen terugdraaien en vooruit repareren. Het gaat om databasewijzigingen die je in stappen doet en om wat er mis ging toen het bijna goed ging. Daarna kun je een terugvalplan beoordelen op hoe echt het is.',
      en: 'At Expert a senior chooses between rolling back and fixing forward. It is about database changes you make in steps and what went wrong when it almost worked. Afterwards you can judge a fallback plan on how real it is.',
    },
  },
  'pm.devops/itsm': {
    2: {
      nl: 'Op Werkkennis werk je met afspraken over dienstverlening. Je rekent hoeveel storing een beschikbaarheid toelaat en kent het verschil tussen prioriteit en ernst. Daarna kun je beantwoorden hoeveel minuten een dienst per maand mag liggen.',
      en: 'At Working knowledge you work with service agreements. You work out how much downtime an availability figure allows and know the difference between priority and severity. Afterwards you can answer how many minutes a service may be down per month.',
    },
    3: {
      nl: 'Op Gevorderd leer je van een storing zonder schuldige. Je rekent de duur uit en schrijft op wat de organisatie kan leren. Daarna kun je uitleggen hoe lang een storing duurde en wat een nabespreking zonder schuld oplevert.',
      en: 'At Advanced you learn from an outage without a culprit. You work out the duration and write down what the organisation can learn. Afterwards you can explain how long an outage lasted and what a blameless review returns.',
    },
    4: {
      nl: 'Op Expert past een senior lean toe op IT-beheer. Het gaat om andon, A3 en wijzigingen zonder de rem erop. Daarna kun je beoordelen welk deel van de wijzigingen een snelle weg verdient.',
      en: 'At Expert a senior applies lean to IT operations. It is about andon, A3 and changes without the brake on. Afterwards you can judge which share of changes deserves a fast lane.',
    },
  },
  'pm.itproject/scope': {
    2: {
      nl: 'Op Werkkennis kies je wat erin gaat met MoSCoW. Je verdeelt dagen over must, should en could en rekent een veilige verdeling uit. Daarna kun je beantwoorden hoeveel dagen aan de must haves mogen gaan en welke vraag een must test.',
      en: 'At Working knowledge you choose what goes in with MoSCoW. You spread days over must, should and could and work out a safe split. Afterwards you can answer how many days may go to the must haves and which question tests a must.',
    },
    3: {
      nl: 'Op Gevorderd kies je tussen standaard en maatwerk. Je weegt wat elke aanpassing kost bij elke update. Daarna kun je uitleggen wat een aanpassing aan hertests kost en wat past in de standaard betekent.',
      en: 'At Advanced you choose between standard and custom. You weigh what each customisation costs at every update. Afterwards you can explain what a customisation costs in retests and what fit-to-standard means.',
    },
    4: {
      nl: 'Op Expert houd je een datum vast en laat je de scope vrij. Het gaat om wat verloren weken in dagen betekenen en wat DSDM vastzet. Daarna kun je een verlies aan capaciteit vertalen naar wat eruit moet.',
      en: 'At Expert you hold a date and let the scope float. It is about what lost weeks mean in days and what DSDM fixes. Afterwards you can translate a loss of capacity into what has to go.',
    },
  },
  'pm.itproject/vendor': {
    2: {
      nl: 'Op Werkkennis kies je een leverancier met een methode. Je weegt criteria en laat een demo volgens script zien. Daarna kun je beantwoorden hoe een gewogen score uitkomt en waarin een scriptdemo van een gewone demo verschilt.',
      en: 'At Working knowledge you choose a vendor with a method. You weigh criteria and have a demo follow a script. Afterwards you can answer how a weighted score comes out and how a scripted demo differs from a regular one.',
    },
    3: {
      nl: 'Op Gevorderd reken je vijf jaar vooruit. Je telt interne mensen, vervanging en licenties mee in de totale kosten. Daarna kun je uitleggen wat TCO is en waarom je meer dan de licentie bekijkt.',
      en: 'At Advanced you calculate five years ahead. You count internal people, backfill and licences in the total cost. Afterwards you can explain what TCO is and why you look at more than the licence.',
    },
    4: {
      nl: 'Op Expert leg je vast wat je voor ondertekenen regelt. Het gaat om betaalmomenten gekoppeld aan acceptatie en om de grootste valkuil van een contract. Daarna kun je een contract beoordelen op wat jij nodig hebt.',
      en: 'At Expert you fix what you settle before signing. It is about payment moments tied to acceptance and the biggest pitfall of a contract. Afterwards you can assess a contract on what you need.',
    },
  },
  'pm.itproject/golive': {
    2: {
      nl: 'Op Werkkennis migreer je gegevens. Je telt wat binnenkomt tegen wat je verwachtte en ziet wat stamdata is. Daarna kun je beantwoorden hoeveel artikelen zijn afgewezen en welke gegevens als stamdata gelden.',
      en: 'At Working knowledge you migrate data. You count what arrives against what you expected and see what master data is. Afterwards you can answer how many articles were rejected and which data counts as master data.',
    },
    3: {
      nl: 'Op Gevorderd plan je het overstapweekend. Je rekent de tijd van de repetitie met marge en weet wat bevriezen is. Daarna kun je uitleggen hoeveel uren je voor een overstap inplant en wie de beslissing neemt.',
      en: 'At Advanced you plan the cutover weekend. You work out the rehearsal time with margin and know what the freeze is. Afterwards you can explain how many hours to plan for a cutover and who takes the decision.',
    },
    4: {
      nl: 'Op Expert loopt een senior de eerste weken na livegang. Het gaat om tickets die dalen, om een oorlogskamer en om wanneer hypercare klaar is. Daarna kun je beoordelen of een afbouw van extra ondersteuning verantwoord is.',
      en: 'At Expert a senior runs the first weeks after go-live. It is about tickets that fall, a war room and when hypercare is over. Afterwards you can judge whether winding down extra support is justified.',
    },
  },
  'pm.itproject/adoption': {
    2: {
      nl: 'Op Werkkennis werk je met fouten en uitgangscriteria. Je triageert wat blokkeert en rekent wat een slaagpercentage betekent. Daarna kun je beantwoorden hoeveel scripts moeten slagen en welk verschil er tussen twee soorten fouten is.',
      en: 'At Working knowledge you work with defects and exit criteria. You triage what blocks and work out what a pass percentage means. Afterwards you can answer how many scripts must pass and what the difference between two kinds of defects is.',
    },
    3: {
      nl: 'Op Gevorderd regel je rollen, autorisaties en training. Je plant sessies voor groepen en leert wat op rollen gebaseerde training is. Daarna kun je uitleggen hoeveel sessies een groep nodig heeft en waarom je per rol traint.',
      en: 'At Advanced you arrange roles, authorisations and training. You plan sessions for groups and learn what role-based training is. Afterwards you can explain how many sessions a group needs and why you train per role.',
    },
    4: {
      nl: 'Op Expert controleert een senior of het systeem echt gebruikt wordt. Het gaat om bevestigde orders en om schaduwsystemen die ernaast ontstaan. Daarna kun je adoptie meten en bijsturen waar mensen terugvallen.',
      en: 'At Expert a senior checks whether the system is really used. It is about confirmed orders and shadow systems that appear next to it. Afterwards you can measure adoption and steer where people fall back.',
    },
  },
};
