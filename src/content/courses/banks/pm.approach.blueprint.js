// Blueprint pm.approach: per topic and level what the level tests (aims) and the real misconceptions
// a distractor can use (traps), in nl and en. The brief for the bank writer and the anchor for the AI test generator.
// DMAIC: the module sits in an unlettered Start band before Define; the route topic is rewritten for the DMAIC road in task D2b,
// so its aims and traps stay at the level of stage, stage product, mandate and proportionality.
const L = (aimsNl, aimsEn, trapsNl, trapsEn) => ({ aims: { nl: aimsNl, en: aimsEn }, traps: { nl: trapsNl, en: trapsEn } });

export default {
  module: 'pm.approach',
  topics: {
    route: {
      1: L(
        ['Een fase, een faseproduct en een mandaat herkennen en toepassen op een eenvoudige situatie.'],
        ['Recognise a stage, a stage product and a mandate and apply them to a plain situation.'],
        ['Een planning mag al voordat het probleem is afgesproken', 'Een mandaat is hetzelfde als een planning of een kick-off', 'De sponsor is een teamlid dat het werk uitvoert', 'Een fase is een vakje om af te vinken in plaats van een vraag'],
        ['A schedule may be drawn up before the problem is agreed', 'A mandate is the same as a schedule or a kick-off', 'The sponsor is a team member who does the work', 'A stage is a box to tick instead of a question'],
      ),
      2: L(
        ['De vijf vragen, de documentvolgorde en de statuscheck toepassen op een overname met getallen.', 'Het vastgestelde plan van het nieuwste bestand onderscheiden.'],
        ['Apply the five questions, the document order and the status check to a take-over with numbers.', 'Tell the plan of record from the newest file.'],
        ['Meteen alles omgooien is de snelste manier om een project over te nemen', 'Het nieuwste bestand is het vastgestelde plan', 'Staat er “groen” in elk rapport, dan loopt het project goed', 'Oude open acties zijn onbelangrijk voor de overname'],
        ['Overturning everything at once is the quickest way to take over a project', 'The newest file is the plan of record', 'If every report says “green”, the project is going well', 'Old open actions do not matter for the take-over'],
      ),
      3: L(
        ['Kiezen hoeveel route een project krijgt en afwegen wat samenvoegen wel en niet toestaat.'],
        ['Choose how much route a project gets and weigh what merging does and does not allow.'],
        ['Klein werk heeft geen beslisser of doel nodig', 'Samenvoegen van fasen laat een faseproduct vervallen', 'Een enthousiaste teamleider kan de sponsor vervangen', 'Een klein project heeft dezelfde governance nodig als een programma, voor de zekerheid'],
        ['Small work needs no decider or goal', 'Merging stages makes a stage product lapse', 'A keen team leader can replace the sponsor', 'A small project needs the same governance as a programme, to be safe'],
      ),
      4: L(
        ['Een route voorstellen die in het PMO en het gatemodel van de klant past, en zien wanneer niet starten het eerlijke antwoord is.', 'Wegen wat verplicht is, wat wordt gelezen en wat je mag verkorten.'],
        ['Propose a route that fits the client’s PMO and gate model, and see when not starting is the honest answer.', 'Weigh what is mandatory, what is read and what you may shorten.'],
        ['De route van het PMO overslaan omdat jouw route slanker is', 'Een ruime marge in de vaste prijs dekt het onbekende werk', 'Doorzetten na een eerste fase omdat die al is betaald', 'Sjablonen op eigen gezag verkorten en het PMO achteraf informeren'],
        ['Skip the PMO’s route because yours is leaner', 'A generous margin in the fixed price covers the unknown work', 'Carry on after a first stage because it has been paid for', 'Shorten templates on your own authority and inform the PMO afterwards'],
      ),
    },
    method: {
      1: L(
        ['De vier methodefamilies en de mengvorm herkennen en een methode in de juiste familie plaatsen.', 'Weten dat DMAIC een structuur voor elke verbetering is.'],
        ['Recognise the four method families and the blend and place a method in the right family.', 'Know that DMAIC is a structure for any improvement.'],
        ['PRINCE2 is een kennisraamwerk van PMI', 'Een certificaat bewijst hoe goed de projecten van de houder lopen', 'DMAIC hoort bij Six Sigma en vraagt statistische tests', 'Scrum is een voorspellende methode met vaste fasen'],
        ['PRINCE2 is a body of knowledge from PMI', 'A certificate proves how well the holder’s projects run', 'DMAIC belongs to Six Sigma and needs statistical tests', 'Scrum is a predictive method with fixed stages'],
      ),
      2: L(
        ['De fasen van DMAIC en hun resultaten toepassen op een klein probleem met getallen.', 'Een verbeterweg kiezen naar maat: A3, kaizenevent of DMAIC.'],
        ['Apply the DMAIC phases and their results to a small problem with numbers.', 'Choose an improvement route by size: A3, kaizen event or DMAIC.'],
        ['Na de test is het project klaar en is borgen overbodig', 'Je kiest eerst de oplossing en meet daarna pas', 'Een nulmeting is een inschatting van het team', 'Een kaizenevent past bij een project van enkele maanden'],
        ['After the test the project is finished and control is unnecessary', 'You pick the solution first and only then measure', 'A baseline is an estimate by the team', 'A kaizen event suits a project of several months'],
      ),
      3: L(
        ['Met de vijf keuzevragen een aanpak kiezen en een hybride vorm of een opgelegde methode afwegen.'],
        ['Choose an approach with the five selection questions and weigh a hybrid form or an imposed method.'],
        ['Een hybride vorm is een halfslachtig compromis', 'Het contract bepaalt de methode, de eisen doen er niet toe', 'Bij een onbekende oplossing werkt een volledig ontwerp vooraf het best', 'Een opgelegde methode moet je bestrijden'],
        ['A hybrid form is a half-hearted compromise', 'The contract decides the method, the requirements do not matter', 'With an unknown solution a full design up front works best', 'An imposed method has to be fought'],
      ),
      4: L(
        ['Methodetheater herkennen en ontmaskeren en openlijk aanpassen met het raamwerk als argument.', 'Wegen wat een auditor over een jaar moet kunnen zien.'],
        ['Recognise and expose method theatre and tailor openly with the framework as the argument.', 'Weigh what an auditor must be able to see in a year.'],
        ['Ingevulde sjablonen en gehaalde gates betekenen dat het project onder controle is', 'Een PMO dat om certificaten vraagt, wantrouwt je werk', 'Een aangepaste methode is geen echte methode meer, dus pas niet aan', 'Je eigen begrippenset is duidelijker dan hun woorden'],
        ['Completed templates and passed gates mean the project is under control', 'A PMO that asks for certificates distrusts your work', 'A tailored method is no longer a real method, so do not tailor', 'Your own vocabulary is clearer than their words'],
      ),
    },
    tools: {
      1: L(
        ['Een toolfamilie herkennen bij een soort werk en weten wanneer een spreadsheet genoeg is.'],
        ['Recognise the tool family for a kind of work and know when a spreadsheet is enough.'],
        ['Een tool kiezen op merk is veiliger dan op familie', 'Een spreadsheet is nooit genoeg voor een projectlijst', 'Een tool loont vanaf de eerste lijst van tien regels', 'Een samenwerkingsbord bewaakt taken met afhankelijkheden'],
        ['Picking a tool by brand is safer than by family', 'A spreadsheet is never enough for a project list', 'A tool pays off from the first list of ten rows', 'A whiteboard tracks tasks with dependencies'],
      ),
      2: L(
        ['Een takenbord inrichten met buckets op werk, kaarten met eigenaar, datum en klaar-criterium, en rekenen met het filter op achterstand.'],
        ['Set up a task board with buckets on work, cards with owner, date and done criterion, and calculate with the filter on overdue.'],
        ['Een bucket per teamlid geeft het beste overzicht', 'Besluiten leg je vast als kaart in de bucket Klaar', 'Hoe meer labels, hoe beter je kunt filteren', 'In het weekoverleg lees je alle kaarten voor'],
        ['A bucket per team member gives the best overview', 'You record decisions as a card in the Done bucket', 'The more labels, the better you can filter', 'In the weekly meeting you read out every card'],
      ),
      3: L(
        ['De tool per project kiezen met de regels van de klant eerst, en wegen tussen één tool per doel en één voor alles.'],
        ['Choose the tool per project with the client’s rules first, and weigh one tool per purpose against one for everything.'],
        ['Je eigen tool gebruiken omdat het team er prettig in werkt, ook als de klant het verbiedt', 'Eén tool voor alles is beter, want dan staat alles op één plek', 'Een bord draagt een plan met veel afhankelijkheden', 'Midden in het project naar één tool verhuizen is goedkoop'],
        ['Use your own tool because the team likes it, even when the client forbids it', 'One tool for everything is better, because then everything sits in one place', 'A board carries a plan with many dependencies', 'Moving to one tool in the middle of the project is cheap'],
      ),
      4: L(
        ['De verborgen kosten van een tool wegen: wildgroei, dataverblijf, dubbele invoer, eigenaarschap na vertrek en AI-assistenten.', 'Rekenen aan de kosten van overtypen.'],
        ['Weigh the hidden costs of a tool: sprawl, data residency, double entry, ownership after you leave and AI assistants.', 'Calculate the cost of retyping.'],
        ['Een tool met veel functies is goedkoper in gebruik', 'Adoptie komt vanzelf als de tool goed is', 'Een AI-assistent in de tool is de bron van waarheid', 'De klant neemt het bord na je vertrek vanzelf over'],
        ['A tool with many functions is cheaper to use', 'Adoption comes by itself when the tool is good', 'An AI assistant in the tool is the source of truth', 'The client takes the board over by itself after you leave'],
      ),
    },
    enterprise: {
      1: L(
        ['De systemen van een grote klant (ERP, PPM, PLM, ITSM) herkennen aan hun taak en het systeem van vastlegging noemen.'],
        ['Recognise a large client’s systems (ERP, PPM, PLM, ITSM) by their job and name the system of record.'],
        ['Je eigen bord is het systeem van vastlegging', 'Uren staan officieel in het ITSM', 'Een bron van een leverancier over een klant is bewijs', 'Een verkeerde projectcode maakt niets uit'],
        ['Your own board is the system of record', 'Hours officially sit in the ITSM', 'A supplier’s source about a client is proof', 'A wrong project code makes no difference'],
      ),
      2: L(
        ['Als gast leestoegang en projectcode vragen, een backlogbord lezen en geboekte uren naast voortgang zetten met getallen.'],
        ['As a guest ask for read access and project code, read a backlog board and set booked hours next to progress with numbers.'],
        ['Als gast begin je met schrijfrechten', 'Vier geblokkeerde items zijn vier problemen', 'Veel geboekte uren betekenen veel voortgang', 'Een epic is een kleine behoefte van een gebruiker'],
        ['As a guest you start with write rights', 'Four blocked items are four problems', 'Many booked hours mean much progress', 'An epic is a small need of a user'],
      ),
      3: L(
        ['Een verschil tussen bord en rapport uitzoeken in de volgorde verversing, definitie, code, en dubbele invoer voorkomen met één thuis per feit.'],
        ['Trace a difference between board and report in the order refresh, definition, code, and prevent double entry with one home per fact.'],
        ['Bij een verschil tussen bord en rapport wint het bord', 'Dubbel invoeren voor de zekerheid voorkomt fouten', 'Je werkt de PMO-tool bij na het afsluitmoment', 'Het PMO moet het rapport voor jou aanpassen'],
        ['When board and report differ, the board wins', 'Entering twice for safety prevents mistakes', 'You update the PMO tool after the cut-off', 'The PMO must adjust the report for you'],
      ),
      4: L(
        ['Het toollandschap als senior wegen: data-eigenaar, het PMO vroeg onderhandelen, leveranciersrisico en technische wijzigingen, ook met getallen.'],
        ['Weigh the tool landscape as a senior: data owner, negotiating early with the PMO, vendor risk and engineering changes, also with numbers.'],
        ['Wie het rapport heeft gebouwd, bepaalt wat een getal betekent', 'Wachten op de leverancier is genoeg bij een uitfasering', 'Technische wijzigingen merk je vanzelf op tijd', 'Het PMO bepaalt pas na de eerste rode status hoe je wordt gemeten'],
        ['Whoever built the report decides what a figure means', 'Waiting for the supplier is enough when a tool is retired', 'You notice engineering changes in time by yourself', 'The PMO only sets how you are measured after the first red status'],
      ),
    },
  },
};
