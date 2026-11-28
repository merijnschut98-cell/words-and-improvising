// Blueprint pm.intake: per topic and level what the level tests (aims) and the real misconceptions
// a distractor can use (traps), in nl and en. The brief for the bank writer and the anchor for the AI test generator.
// DMAIC: Intake is the Define phase; its phase product is the project charter, with a short plan for the Measure deliverables.
const L = (aimsNl, aimsEn, trapsNl, trapsEn) => ({ aims: { nl: aimsNl, en: aimsEn }, traps: { nl: trapsNl, en: trapsEn } });

export default {
  module: 'pm.intake',
  topics: {
    problem: {
      1: L(
        ['Symptoom, probleem, doel en gekozen oplossing uit elkaar halen in wat een klant zegt.'],
        ['Tell symptom, problem, goal and chosen solution apart in what a client says.'],
        ['“We hebben een nieuw systeem nodig” is een probleem', 'Late orders zijn het probleem in plaats van het symptoom', 'De klant zijn oplossing afwijzen is de beste eerste reactie', 'Naar de kosten van niksdoen vraag je om het tarief te bepalen'],
        ['“We need a new system” is a problem', 'Late orders are the problem rather than the symptom', 'Rejecting the client’s solution is the best first reaction', 'You ask about the cost of inaction to set your rate'],
      ),
      2: L(
        ['Een eerste gesprek van een uur opbouwen en MORE PIES inzetten.', 'Parafraseren, stilte en stille weerstand toepassen op een concreet gesprek.'],
        ['Structure a one-hour first talk and use MORE PIES.', 'Apply paraphrasing, silence and quiet resistance to a concrete conversation.'],
        ['Parafraseren dient om te laten zien dat je aantekeningen maakt', 'Bij stille weerstand ga je het rapport samen doorlopen of over op ja/nee-vragen', 'Een stilte vul je op met je eigen ervaring', 'Je gaat weg met een voorstel of een akkoord over het budget'],
        ['Paraphrasing is to show you take notes', 'With quiet resistance you go through the report together or switch to yes/no questions', 'You fill a silence with an experience of your own', 'You leave with a proposal or an agreement on the budget'],
      ),
      3: L(
        ['Een probleemstelling met wat, waar, wanneer en hoeveel schrijven, zonder oorzaak, oplossing of schuldige.', 'Kiezen tussen is/is-niet, gemba en 5 keer waarom bij een concreet probleem.'],
        ['Write a problem statement with what, where, when and how much, without cause, solution or culprit.', 'Choose between is/is-not, gemba and 5 Whys for a concrete problem.'],
        ['Een bevestigde oorzaak mag in de probleemstelling blijven staan', 'De probleemstelling mag een oordeel bevatten als het voor iedereen klopt', '5 keer waarom geeft een betrouwbare oorzaak als je vijf keer doorvraagt', 'Gemba is een gesprek in de vergaderzaal over wat er op de vloer gebeurt'],
        ['A confirmed cause may stay in the problem statement', 'The problem statement may hold a judgement if everyone agrees', '5 Whys gives a reliable cause if you ask five times', 'Gemba is a talk in the meeting room about what happens on the floor'],
      ),
      4: L(
        ['Een vragenboom op MECE toetsen en kiezen welke takken eerst aan de beurt zijn.', 'Een datavraag en een weerleggingsregel opstellen die bevestigingsvooroordeel tegengaat.'],
        ['Test an issue tree for MECE and choose which branches come first.', 'Write a data request and a refutation rule that counters confirmation bias.'],
        ['Takken hoeven niet MECE te zijn zolang ze alle bekende oorzaken noemen', 'Eerst alle data verzamelen en dan kijken wat opvalt', 'Een hypothese hoort pas na de data te komen', 'Een datavraag hoeft alleen de naam van het systeem te noemen'],
        ['Branches need not be MECE as long as they name all known causes', 'First collect all the data and then see what stands out', 'A hypothesis should come only after the data', 'A data request needs to name only the system'],
      ),
    },
    people: {
      1: L(
        ['De vier rollen sponsor, proceseigenaar, gebruikers en blokkeerders herkennen en een stakeholder op de map plaatsen.'],
        ['Recognise the four roles sponsor, process owner, users and blockers and place a stakeholder on the map.'],
        ['De sponsor is wie het gesprek begon of het meeste belang heeft', 'Wie het project kan stoppen zegt dat hardop', 'Veel invloed en weinig belang betekent wekelijks betrekken', 'De echte macht staat altijd op het organogram'],
        ['The sponsor is whoever started the conversation or has the most interest', 'Whoever can stop the project says so out loud', 'High influence and low interest means involving weekly', 'The real power is always on the org chart'],
      ),
      2: L(
        ['Quick wins en fundament naast elkaar laten lopen en het overlegritme vroeg neerzetten.', 'Met tijden en aantallen rekenen aan een quick win.'],
        ['Run quick wins and foundations side by side and set the meeting rhythm early.', 'Count with times and numbers on a quick win.'],
        ['Alleen quick wins is genoeg om vertrouwen en resultaat te krijgen', 'De nulmeting hoort al in de eerste week volledig af te zijn', 'Op “dit hebben we al eens geprobeerd” antwoord je dat het nu anders is', 'Een overleg houd je alleen als er een probleem is'],
        ['Quick wins alone are enough for trust and results', 'The baseline should be fully done in the first week', 'To “we tried this before” you answer that this time is different', 'You hold a meeting only when there is a problem'],
      ),
      3: L(
        ['Wensen en aanbod met de sponsor bespreken en hercontracteren als de afspraken veranderen.', 'De uren van de klant uitrekenen en weigeren om alles op je te nemen.'],
        ['Discuss wants and offers with the sponsor and recontract when the agreements change.', 'Work out the client’s hours and refuse to take everything on yourself.'],
        ['Contracteren is de offerte laten tekenen', 'De klant is vooral verantwoordelijk, of juist de consultant', 'Bij een gebroken afspraak houd je de einddatum vast en wijs je de schuld aan', 'Als consultant neem je het voorwerk op je om vertrouwen te winnen'],
        ['Contracting is getting the quote signed', 'The client is mainly responsible, or else the consultant', 'With a broken agreement you hold the end date and assign the blame', 'As a consultant you take the groundwork on to win trust'],
      ),
      4: L(
        ['Een coalitie samenstellen en het informele netwerk vinden.', 'De rechten van de OR (advies en instemming) op tijd inzetten.'],
        ['Assemble a coalition and find the informal network.', 'Use the works council’s rights (advice and consent) in good time.'],
        ['Een sponsor met macht heeft geen coalitie nodig', 'De OR adviseert na het besluit zodat hij het kan uitleggen', 'Advies en instemming zijn hetzelfde recht', 'Het informele netwerk lees je uit het organogram of de beoordelingen'],
        ['A sponsor with power needs no coalition', 'The works council advises after the decision so it can explain it', 'Advice and consent are the same right', 'You read the informal network from the org chart or the appraisals'],
      ),
    },
    scope: {
      1: L(
        ['Een doelzin van X naar Y met datum en meting herkennen en een nulmeting eisen.', 'Scope en buiten scope onderscheiden en scope creep herkennen.'],
        ['Recognise a goal sentence from X to Y with date and measure and demand a baseline.', 'Tell scope from out of scope and recognise scope creep.'],
        ['Een wens als “flink verkorten” is een doel', 'Een schatting van de klant is een nulmeting', 'Een ambitieus target van nul motiveert en is dus goed', 'Wat buiten scope valt hoeft niet opgeschreven te worden'],
        ['A wish such as “shorten considerably” is a goal', 'A client’s estimate is a baseline', 'An ambitious target of zero motivates and is therefore good', 'What is out of scope need not be written down'],
      ),
      2: L(
        ['De onderdelen van een projectopdracht op één A4 kennen, met de korte planning voor de Measure-oplevering.', 'Een aanname opschrijven en inzet van de consultant uitrekenen.'],
        ['Know the parts of a one-page charter, with the short plan for the Measure delivery.', 'Write down an assumption and work out the consultant’s input.'],
        ['De projectopdracht bevat de volledige taakplanning tot en met de uitrol', 'De korte planning voor Measure noemt de oorzaken en oplossingen', 'Aannames schrijf je op om aansprakelijkheid te ontlopen', 'Een handtekening bewijst dat de projectopdracht gedragen wordt'],
        ['The charter holds the full task plan through to the roll-out', 'The short plan for Measure names the causes and solutions', 'You write down assumptions to avoid liability', 'A signature proves the charter is carried'],
      ),
      3: L(
        ['De SIPOC-grens vanuit de klant trekken en overdrachten als meetpunt zien.', 'De klanteis bij de klant zelf navragen.'],
        ['Draw the SIPOC boundary from the customer and see handovers as measurement points.', 'Ask the customer himself for the customer requirement.'],
        ['Een SIPOC met vijftien stappen is nauwkeuriger', 'De grens volgt de afdeling van de sponsor of de beschikbare data', 'De afdeling weet wat de klant wil', 'Problemen zitten vooral bij de eerste stap van het proces'],
        ['A SIPOC with fifteen steps is more accurate', 'The boundary follows the sponsor’s department or the available data', 'The department knows what the customer wants', 'Problems sit mostly at the first step of the process'],
      ),
      4: L(
        ['Een go/no-go bij elke fasepoort van DMAIC herkennen en een wijzigingsverzoek opstellen.', 'Een tolerantie en een bovengrens van een fase uitrekenen.'],
        ['Recognise a go/no-go at each DMAIC tollgate and write a change request.', 'Work out a tolerance and an upper limit of a phase.'],
        ['Een diagnose die ongemerkt overgaat in uitvoering is efficiënt', 'Een extra verzoek neem je stilletjes mee zolang het klein is', 'Een go/no-go is een checkpoint waar de planning wordt doorgelopen', 'De tolerantie rekent mee in de prognose zelf in plaats van erboven'],
        ['A diagnosis that quietly flows into execution is efficient', 'You take on an extra request quietly as long as it is small', 'A go/no-go is a checkpoint where the planning is gone through', 'The tolerance counts inside the forecast itself instead of above it'],
      ),
    },
    case: {
      1: L(
        ['De terugverdientijd uitrekenen en kosten van baten onderscheiden.', 'Zien wanneer minder stilstand echt geld oplevert.'],
        ['Work out the payback period and tell costs from benefits.', 'See when less downtime really earns money.'],
        ['De tijd van de eigen mensen telt niet als kosten', 'Minder stilstand levert direct geld op', 'Baten reken je met de omzet in plaats van de dekkingsbijdrage', 'Een licentie per jaar is een eenmalige kost'],
        ['The time of your own people does not count as cost', 'Less downtime earns money directly', 'You count benefits with revenue instead of contribution margin', 'A licence per year is a one-off cost'],
      ),
      2: L(
        ['Een voorstel openen met SCQ en een prijsvorm kiezen.', 'Een aanpak concreet maken en opties aanbieden.'],
        ['Open a proposal with SCQ and choose a pricing form.', 'Make an approach concrete and offer options.'],
        ['Een voorstel begint met het bureau en zijn referenties', 'Bij een vaste prijs draagt de klant het risico van uitloop', 'Een grondige analyse is een concrete aanpak', 'Twee opties maken het voorstel onduidelijk'],
        ['A proposal starts with the firm and its references', 'With a fixed price the client carries the risk of overrun', 'A thorough analysis is a concrete approach', 'Two options make the proposal unclear'],
      ),
      3: L(
        ['Rode vlaggen herkennen en het project ombouwen in plaats van weigeren.', 'Tegengas geven in de volgorde doel, risico, optie.'],
        ['Recognise red flags and rebuild the project instead of refusing.', 'Push back in the order goal, risk, option.'],
        ['Netjes weigeren is altijd de veiligste reactie', 'Scepsis van de klant is de sterkste rode vlag', '“Dat kan niet” is genoeg zonder alternatief', 'Een verborgen agenda breng je aan het licht door de conclusie alvast te noemen'],
        ['Politely refusing is always the safest reaction', 'Client scepticism is the strongest red flag', '“That cannot be done” is enough without an alternative', 'You expose a hidden agenda by stating the conclusion up front'],
      ),
      4: L(
        ['Een businesscase doorrekenen met een gevoeligheidsanalyse en een bandbreedte.', 'Optimisme corrigeren met een referentieklasse.'],
        ['Work a business case through with a sensitivity analysis and a range.', 'Correct optimism with a reference class.'],
        ['Eén getal voor de baten is het duidelijkst voor de directie', 'Een hogere disconteringsvoet corrigeert optimisme-bias', 'Een langere looptijd maakt een slechte case positief', 'Terugrekenen met 1 + r maakt de baten kleiner dan ze zijn'],
        ['One number for the benefits is clearest for management', 'A higher discount rate corrects optimism bias', 'A longer term turns a bad case positive', 'Discounting with 1 + r makes the benefits smaller than they are'],
      ),
    },
  },
};
