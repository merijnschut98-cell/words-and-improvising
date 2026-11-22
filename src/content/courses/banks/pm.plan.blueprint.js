// Blueprint pm.plan: per topic and level what the level tests (aims) and the real misconceptions
// a distractor can use (traps), in nl and en. The brief for the bank writer and the anchor for the AI test generator.
// DMAIC (neutral, nothing moved): Plannen serves the Improve phase and is the core of a delivery project.
const L = (aimsNl, aimsEn, trapsNl, trapsEn) => ({ aims: { nl: aimsNl, en: aimsEn }, traps: { nl: trapsNl, en: trapsEn } });

export default {
  module: 'pm.plan',
  topics: {
    breakdown: {
      1: L(
        ['Een resultaat herkennen en onderscheiden van een activiteit; de 8–80-regel toepassen op een eenvoudig pakket.'],
        ['Recognise a deliverable and tell it from an activity; apply the 8–80 rule to a simple package.'],
        ['Een activiteit als “Data analyseren” is een resultaat', 'Een groot pakket is efficiënt omdat één persoon het afmaakt', 'Een tweede persoon op een te groot pakket maakt het goed te volgen', 'De opdeling maak je het best alleen, zonder team'],
        ['An activity such as “Analyse data” is a deliverable', 'A big package is efficient because one person finishes it', 'A second person on an oversized package makes it trackable', 'You make the breakdown best alone, without the team'],
      ),
      2: L(
        ['De onderdelen van een scope-A4 kennen en elk onderdeel toepassen op een kleine casus met een getal.', 'Een acceptatiecriterium controleerbaar maken.'],
        ['Know the parts of a scope page and apply each to a small case with a number.', 'Make an acceptance criterion checkable.'],
        ['“Tevreden” of “duidelijk verbeterd” is een acceptatiecriterium', 'Een aanname die niet bewezen is, is een randvoorwaarde', 'Een uitsluiting maakt het document alleen langer', 'De risicolijst en de RACI horen op de scope-A4'],
        ['“Satisfied” or “clearly improved” is an acceptance criterion', 'An unproven assumption is a constraint', 'An exclusion only makes the document longer', 'The risk register and the RACI belong on the scope page'],
      ),
      3: L(
        ['Kiezen en afwegen binnen productgericht plannen: volgorde van de vier stappen, extern product, en hoe zwaar de beschrijvingen moeten zijn.'],
        ['Choose and weigh within product-based planning: order of the four steps, external product, and how heavy the descriptions must be.'],
        ['Een extern product maak je zelf als werkpakket in de planning', 'Elke PRINCE2-beschrijving moet voor elk product volledig zijn', 'Managementproducten hoeven niet in de productboom', 'Het productstroomschema komt vóór de productdecompositiestructuur'],
        ['You make an external product yourself as a work package', 'Every PRINCE2 description must be complete for every product', 'Management products need not be in the product tree', 'The product flow diagram comes before the product breakdown structure'],
      ),
      4: L(
        ['Een wijziging wegen tegen basislijn, buffer en tolerantie, en bepalen wie beslist.', 'Zien wat er ontbreekt of fout gaat in een planning met rollende golven.'],
        ['Weigh a change against baseline, buffer and tolerance, and decide who decides.', 'Spot what is missing or wrong in a rolling wave plan.'],
        ['Wijzigingen binnen de tolerantie beslis je altijd zelf, ook bij scope', 'Uitwerken van een planningspakket is een scopewijziging', 'De buffer wordt opgeteld bij het extra werk in plaats van afgetrokken', 'De voorspelde overschrijding meld je pas als hij gebeurt'],
        ['Changes within tolerance you always decide yourself, even for scope', 'Working out a planning package is a scope change', 'The buffer is added to the extra work instead of subtracted', 'You report the forecast breach only when it happens'],
      ),
    },
    schedule: {
      1: L(
        ['Het kritieke pad, speling, mijlpaal en afhankelijkheid herkennen in een eenvoudig voorbeeld.'],
        ['Recognise critical path, slack, milestone and dependency in a simple example.'],
        ['Uitloop van een taak buiten het kritieke pad schuift altijd de einddatum', 'Een overleg of een fase is een mijlpaal', 'Winst zoek je in de goedkoopste taken, ook buiten het kritieke pad', 'Afhankelijkheden vind je door de duur van elk deel te vragen'],
        ['A slip of a task off the critical path always moves the end date', 'A meeting or a phase is a milestone', 'You look for gains in the cheapest tasks, also off the critical path', 'You find dependencies by asking the duration of each part'],
      ),
      2: L(
        ['Een werkwijze kiezen (waterval, agile, hybride) voor een gegeven project en dat uitleggen aan een directie.'],
        ['Choose a way of working (waterfall, agile, hybrid) for a given project and explain it to a board.'],
        ['Waterval past bij werk waarvan de oplossing nog open is', 'Een agile ronde eindigt met een rapport', 'Agile betekent geen plan en geen einddatum', 'Hybride betekent de helft van het project waterval en de helft agile'],
        ['Waterfall fits work whose solution is still open', 'An agile round ends with a report', 'Agile means no plan and no end date', 'Hybrid means half the project waterfall and half agile'],
      ),
      3: L(
        ['Het netwerk heen en terug doorrekenen met voorgangers, wachttijd en speling.', 'Totale en vrije speling uit elkaar houden.'],
        ['Calculate the network forward and backward with predecessors, lag and float.', 'Keep total and free float apart.'],
        ['Een taak met meer voorgangers begint na de eerste voorganger', 'De vroegste start is het kleinste eind van de voorgangers', 'Totale speling is een eigenschap van één taak', 'Vrije speling en totale speling zijn altijd hetzelfde getal'],
        ['A task with several predecessors starts after the first one', 'The early start is the smallest finish of the predecessors', 'Total float is a property of a single task', 'Free float and total float are always the same number'],
      ),
      4: L(
        ['Versnellen met crashing of fast-tracking afwegen op prijs en risico, en zien dat een andere keten kritiek kan worden.', 'Een trend in mijlpalen lezen als vroeg alarm.'],
        ['Weigh speeding up by crashing or fast-tracking on price and risk, and see that another chain can become critical.', 'Read a milestone trend as an early alarm.'],
        ['Mensen toevoegen versnelt een achterlopend softwareproject', 'Versnellen op een taak met speling verkort het project', 'Kiezen op de laagste prijs per week levert altijd de goedkoopste combinatie', 'Een stijgende mijlpaaldatum is normaal als het team groen meldt'],
        ['Adding people speeds up a late software project', 'Speeding up a task with float shortens the project', 'Choosing the lowest price per week always gives the cheapest combination', 'A rising milestone date is normal if the team reports green'],
      ),
    },
    estimate: {
      1: L(
        ['Een bandbreedte en het PERT-gemiddelde gebruiken; inspanning en doorlooptijd uit elkaar houden.'],
        ['Use a range and the PERT average; keep effort and duration apart.'],
        ['De meest waarschijnlijke waarde is het gemiddelde van drie punten', 'Inspanning en doorlooptijd zijn hetzelfde', 'Een schatting is zo goed mogelijk één getal', 'Reserve in elke taak voorkomt uitloop'],
        ['The most likely value is the average of three points', 'Effort and duration are the same', 'An estimate is best given as a single number', 'Reserve in each task prevents overrun'],
      ),
      2: L(
        ['Analoog, parametrisch en bottom-up schatten kiezen en uitvoeren met kleine getallen.', 'Het buitenperspectief toepassen.'],
        ['Choose and carry out analogous, parametric and bottom-up estimating with small numbers.', 'Apply the outside view.'],
        ['Bottom-up schatten kan al voordat er een opdeling is', 'Bij analoog schatten gebruik je de geplande duur van het vorige project', 'Het buitenperspectief is een externe consultant laten schatten', 'Parametrisch schatten is altijd evenredig met het aantal'],
        ['Bottom-up estimating works before a breakdown exists', 'With analogous estimating you use the planned duration of the previous project', 'The outside view is having an external consultant estimate', 'Parametric estimating is always proportional to the quantity'],
      ),
      3: L(
        ['Spreiding en zekerheid uitrekenen: standaarddeviatie per activiteit, varianties optellen, kans op een datum.'],
        ['Work out spread and confidence: standard deviation per activity, adding variances, the chance of a date.'],
        ['De standaarddeviaties van een keten tel je op', 'P50 is een veilige datum', 'De deling door 6 is een meting van de echte spreiding', 'Afhankelijke activiteiten maken de spreiding kleiner'],
        ['You add the standard deviations of a chain', 'P50 is a safe date', 'The division by 6 is a measurement of the real spread', 'Dependent activities make the spread smaller'],
      ),
      4: L(
        ['Een kritieke keten en projectbuffer opzetten en het bufferverbruik lezen op een koortsgrafiek.'],
        ['Set up a critical chain and project buffer and read buffer use on a fever chart.'],
        ['Verborgen reserve in taken blijft beschikbaar voor het project', 'Een aanvoerbuffer staat aan het eind van het project', 'Bufferverbruik is normaal, ook als het sneller gaat dan de voortgang', 'De kritieke keten is gelijk aan het kritieke pad'],
        ['Hidden reserve in tasks stays available to the project', 'A feeding buffer sits at the end of the project', 'Buffer use is normal, even when faster than progress', 'The critical chain equals the critical path'],
      ),
    },
    resources: {
      1: L(
        ['Een bruikbare risicoregel herkennen (gebeurtenis, eigenaar, actie met datum) en de pre-mortem kennen.'],
        ['Recognise a usable risk line (event, owner, action with a date) and know the pre-mortem.'],
        ['Een afdeling kan risico-eigenaar zijn', '“Monitoren” is een beheersmaatregel', 'Een gevoelig risico zet je letterlijk in de lijst', 'Een pre-mortem kijkt terug op het vorige project'],
        ['A department can be risk owner', '“Monitor” is a mitigation', 'You write a sensitive risk literally in the register', 'A pre-mortem looks back at the previous project'],
      ),
      2: L(
        ['Een RACI opstellen en conflicten of ontbrekende rollen erin ontdekken; de rol van de sponsor uitschrijven.'],
        ['Draw up a RACI and spot conflicts or missing roles in it; write out the sponsor’s role.'],
        ['Twee A’s zijn een back-up voor elkaar', 'Veel C’s versnellen de besluiten', 'De consultant hoort accountable te zijn voor het proces', 'Het team kan de rol van de sponsor zonder hem opschrijven'],
        ['Two As are a back-up for each other', 'Many Cs speed up decisions', 'The consultant should be accountable for the process', 'The team can write down the sponsor’s role without him'],
      ),
      3: L(
        ['Capaciteit plannen met echte beschikbare uren en een overbelasting oplossen met smoothing of leveling.'],
        ['Plan capacity with real available hours and solve an overallocation with smoothing or leveling.'],
        ['Een medewerker is 40 uur beschikbaar als hij “voor 100%” in het project staat', 'Leveling houdt de einddatum gelijk', 'Overwerk lost een overbelasting op', 'De afspraak over tijd maak je met de specialist zelf'],
        ['An employee has 40 hours available if he is on the project “for 100%”', 'Leveling keeps the end date the same', 'Overtime solves an overallocation', 'You make the agreement about time with the specialist himself'],
      ),
      4: L(
        ['Risico’s in geld uitdrukken, een respons kiezen en een risicoreserve onderbouwen naast de managementreserve.'],
        ['Express risks in money, choose a response and back up a contingency reserve next to the management reserve.'],
        ['Verwachte waarde is het bedrag dat je kwijtraakt', 'Een overgedragen risico telt mee in de risicoreserve', 'Risicoreserve en managementreserve zijn één pot', 'Elk risico met een hoge score escaleer je'],
        ['Expected value is the amount you lose', 'A transferred risk counts in the contingency reserve', 'Contingency and management reserve are one pot', 'You escalate every risk with a high score'],
      ),
    },
  },
};
