// eng.safety (EN): Safety on the floor and in the substation: risk and controls, lockout-tagout, the LMRA and stopping work, electrical roles under NEN 3140, permits to work, and learning from incidents.
export default {
  lessons: [
    {
      id: 'eng.safety.risk',
      title: 'Hazard, risk and the hierarchy of controls',
      pre: [
        {
          q: 'What is the difference between a hazard and a risk?',
          options: ['There is no difference', 'A hazard is something that can cause harm; risk is how likely the harm is and how bad it would be', 'A risk is always bigger than a hazard', 'A hazard is a rule; a risk is breaking it'],
          answer: 'A hazard is something that can cause harm; risk is how likely the harm is and how bad it would be',
          why: 'The same hazard, such as 400 volts, carries little risk behind a closed cover and a lot during maintenance.',
        },
        {
          q: 'Operators get headaches from a solvent used to clean a machine. Which measure is strongest?',
          options: ['Respirators for the operators', 'A sign warning about the vapours', 'Switching to a cleaner that gives off no harmful vapours', 'Shorter cleaning shifts'],
          answer: 'Switching to a cleaner that gives off no harmful vapours',
          why: 'Substitution removes the hazard at the source. Signs, schedules and masks only work as long as people use them right.',
        },
      ],
      teach: [
        'A hazard (gevaar) is anything that can cause harm: a rotating shaft, 400 volts, a forklift, a solvent, working at height. Risk combines how likely harm is with how bad it would be. A hazard nobody comes near carries little risk; the same hazard during maintenance can carry a lot.',
        'In the Netherlands every employer with staff must have a risk inventory and evaluation, the RI&E (Arbowet, article 5), with a plan of action: which measures, who and by when. Most employers must have it checked by a certified expert (article 14); firms with at most 25 employees that use a recognised sector RI&E don’t need that check. As a consultant, ask for it: it tells you what the site sees as its main risks.',
        'The hierarchy of controls, strongest first: remove the hazard; replace it with something less hazardous; engineering controls such as guards, interlocks and extraction; administrative controls such as procedures, training and signs; and last, personal protective equipment. In the Netherlands this is the arbeidshygiënische strategie, based on article 3 of the Arbowet: tackle the source first, then collective measures, then individual ones, and PPE last.',
        'Many Dutch sites score risks with the Fine and Kinney method: risk = probability × exposure × effect, each on a fixed scale. The score helps you rank risks and choose where to act first; it does not prove anything is safe. Then pick the strongest control you can reasonably apply.',
      ],
      example: {
        kind: 'worked',
        text: 'A parts manufacturer. Operators clean a mixing tank by hand every day with a solvent, from outside the tank, and complain of headaches. The team walks down the hierarchy. Remove: could the tank need cleaning less often? Partly: a scraper on the mixer halves the residue. Replace: a water-based cleaner works for most residue. Engineering: local extraction at the tank opening. Administrative: a short instruction for the remaining solvent jobs. PPE: a respirator only for those remaining jobs. Result: the hazard is mostly gone at the source, and the mask is the last line, not the first.',
      },
      said: 'What engineers say: “Don’t start with gloves and a sign. Can we get rid of it, or put a guard on it?”',
      recall: [
        {
          q: 'What is the order of the hierarchy of controls, from strongest to weakest?',
          options: ['PPE, administrative, engineering, substitution, elimination', 'Elimination, substitution, engineering controls, administrative controls, PPE', 'Engineering controls, elimination, PPE, substitution, administrative', 'Administrative, PPE, elimination, engineering, substitution'],
          answer: 'Elimination, substitution, engineering controls, administrative controls, PPE',
          why: 'Measures at the source work without anyone having to do the right thing. PPE depends on every person, every time.',
        },
        {
          q: 'Which of these is an engineering control?',
          options: ['A training on safe working', 'A warning sign on the machine', 'An interlocked guard that stops the machine when it is opened', 'Safety glasses'],
          answer: 'An interlocked guard that stops the machine when it is opened',
          why: 'It acts on the machine itself, whatever the operator does. Training and signs are administrative; glasses are PPE.',
        },
        {
          q: 'What is the RI&E?',
          options: ['A voluntary safety certificate', 'The legally required risk inventory and evaluation, with a plan of action', 'An insurance form', 'The report the inspectorate writes after an accident'],
          answer: 'The legally required risk inventory and evaluation, with a plan of action',
          why: 'Under article 5 of the Arbowet, every employer with staff must have one, with a plan of who does what by when.',
        },
        {
          q: 'In the Fine and Kinney method, risk score = probability × exposure × effect. A task scores 3 for probability, 6 for exposure and 15 for effect. What is its risk score? (The score has no unit.)',
          number: 270,
          tolerance: 0.5,
          unit: '',
          why: '3 × 6 × 15 = 270. The score ranks risks against each other; it does not say the task is safe or unsafe on its own.',
        },
      ],
      situation: {
        scene: 'You’re on a productivity project at a parts manufacturer. A supervisor proposes to take the guard off a press during changeovers: “It costs five minutes each time, and our operators are careful.”',
        ask: 'How do you respond?',
        model: 'I’d say no to removing the guard: it’s an engineering control, and “being careful” is the weakest kind of measure. The five minutes are real, though, so let’s look at why the guard is slow. Maybe a quick-release, interlocked guard would help, or preparing more of the changeover outside the press. I’d bring in the safety advisor and maintenance to look at it with us.',
        rubric: [
          'Refuses to trade the guard for time',
          'Explains why care by people is weaker than a guard',
          'Looks for the time saving elsewhere, with the right experts',
        ],
      },
      sayIt: 'Explain the hierarchy of controls to a new colleague in 60 seconds, with one example from a factory.',
      terms: [
        { term: 'Hazard', def: 'Gevaar: anything that can cause harm.' },
        { term: 'Risk', def: 'How likely harm is, combined with how bad it would be.' },
        { term: 'RI&E', def: 'Risico-inventarisatie en -evaluatie: the legally required risk assessment with a plan of action.' },
        { term: 'Hierarchy of controls', def: 'Elimination, substitution, engineering, administrative, PPE: strongest measure first.' },
      ],
    },
    {
      id: 'eng.safety.loto',
      title: 'Lockout-tagout: isolating energy',
      pre: [
        {
          q: 'A packaging machine has stopped and its emergency stop is pressed. Can a technician now safely reach in to clear a jam?',
          options: ['Yes, the emergency stop cuts all power', 'No: an emergency stop is not isolation; energy must be isolated, locked, released and verified', 'Yes, if a colleague watches the button', 'Only if the machine has cooled down'],
          answer: 'No: an emergency stop is not isolation; energy must be isolated, locked, released and verified',
          why: 'An emergency stop can be reset by someone else or fail, and it does not release stored energy such as air pressure or a raised load.',
        },
      ],
      teach: [
        'Many serious injuries in maintenance happen when a machine starts unexpectedly or stored energy is released. Lockout-tagout (LOTO), in Dutch often vergrendelen en labelen, prevents that. Stopping a machine is not isolating it: a stop button, an emergency stop or a PLC can be reset, overridden or fail. The European standard on preventing unexpected start-up is EN ISO 14118.',
        'Think of all energy, not just electricity: electrical, pneumatic, hydraulic, mechanical (springs, flywheels, loads that can fall), thermal, chemical, and pressure in pipes. One machine can have several of these. A good site has a LOTO procedure per machine that lists every isolation point.',
        'The steps: tell the people affected; stop the machine normally; isolate every energy source at its isolation point; each person who works on it puts on their own lock and tag (with many people, a group lockbox); release or block stored energy, such as bleeding pressure and supporting raised parts; then verify zero energy: try to start it, measure, check the gauges. Only then start work.',
        'Only the person who placed a lock removes it. Before restarting: tools out, guards back, everyone clear. If someone went home with their lock still on, it comes off only under a strict written procedure: try to reach them, check the machine is safe, and let a supervisor decide. Never just cut it off. For work on electrical installations themselves, the five safety rules of NEN 3140 and NEN-EN 50110 apply as well.',
      ],
      example: {
        kind: 'worked',
        text: 'A die change on a hydraulic press at a parts manufacturer. The technician tells the operators and stops the press with the ram at the top of its stroke. He switches off the main switch and closes the compressed-air valve, and hangs his own lock and tag on both. He puts a mechanical safety block under the raised ram so it cannot come down, and only then bleeds the hydraulic accumulator until the gauge reads 0 bar. He presses the start button: nothing happens. He sets the controls back to off. Only then does he reach in. Afterwards: tools out, guards closed, everyone clear, and he removes his own locks.',
      },
      said: 'What engineers say: “E-stop is not a lockout. Lock it, bleed it, try it, then go in.”',
      recall: [
        {
          q: 'Why is pressing the emergency stop not enough before reaching into a machine?',
          options: ['It is too slow', 'It can be reset or fail, and it does not release stored energy', 'It only works on new machines', 'It is enough if the machine is small'],
          answer: 'It can be reset or fail, and it does not release stored energy',
          why: 'Isolation, a personal lock and releasing stored energy are what make the machine safe to work on.',
        },
        {
          q: 'Which of these is stored energy that must be released or blocked during LOTO?',
          options: ['The colour of the machine', 'A press ram held up by hydraulic pressure', 'The machine’s production schedule', 'The light in the hall'],
          answer: 'A press ram held up by hydraulic pressure',
          why: 'If the pressure drops or a valve moves, the ram falls. It needs bleeding down and a mechanical block.',
        },
        {
          q: 'What is the step after isolating the energy and releasing stored energy?',
          options: ['Start the work right away', 'Verify zero energy: try to start the machine and check the gauges', 'Remove the locks', 'Sign the logbook'],
          answer: 'Verify zero energy: try to start the machine and check the gauges',
          why: 'You prove it is dead instead of assuming it. A wrong switch or a second source shows up here.',
        },
        {
          q: 'Four people work on a line that is isolated with a group lockbox. Who puts a personal lock on the lockbox?',
          options: ['Only the team leader', 'Only the person who isolated the line', 'Each of the four people, with their own lock', 'Nobody, the lockbox is enough'],
          answer: 'Each of the four people, with their own lock',
          why: 'Then the line can’t be restarted until the last person has taken their own lock off.',
        },
      ],
      situation: {
        scene: 'On a gemba walk at a food plant you see a technician press the emergency stop on a conveyor and reach in to pull out a stuck product. “It’s only a second,” he says. This jam happens several times per shift.',
        ask: 'What do you do, as a consultant?',
        model: 'I’d say something right away, calmly: “Please wait, can we stop for a moment?” I wouldn’t touch anything myself. Afterwards I’d raise it with his supervisor as an observation, not a complaint. The real question is why the jam happens so often and why lockout feels too slow, so we look for a fix at the source, like a guide rail or a safe way to clear jams.',
        rubric: [
          'Speaks up straight away without touching anything',
          'Raises it with the supervisor as an observation, not blame',
          'Looks for why the jam and the shortcut happen',
        ],
      },
      sayIt: 'Explain to a new consultant in 60 seconds why an emergency stop is not a lockout.',
      terms: [
        { term: 'LOTO', def: 'Lockout-tagout, vergrendelen en labelen: isolating energy and locking it so a machine can’t start.' },
        { term: 'Isolation point', def: 'The switch or valve where an energy source is cut off and locked.' },
        { term: 'Stored energy', def: 'Energy left after isolation, such as pressure, springs or a raised load.' },
        { term: 'Group lockbox', def: 'A box holding the isolation keys, on which every worker puts a personal lock.' },
      ],
    },
    {
      id: 'eng.safety.lmra',
      title: 'The LMRA and stopping work',
      pre: [
        {
          q: 'What is an LMRA?',
          options: ['A yearly safety audit', 'A short check by the people doing the job, at the workplace, right before they start', 'A form the safety manager fills in once a week', 'The risk assessment for a new building'],
          answer: 'A short check by the people doing the job, at the workplace, right before they start',
          why: 'Laatste minuut risicoanalyse: the last check that catches what changed since the job was planned.',
        },
      ],
      teach: [
        'The LMRA, the laatste minuut risicoanalyse, is a short check at the workplace, just before starting, by the people who will do the work. It comes from VCA, the Dutch safety checklist for contractors. Plans and permits are made in an office; the LMRA catches what has changed: a leaking valve, someone working above you, a different machine than on the work order.',
        'Typical questions: Do I know what to do and how? What can go wrong here and now? Are the measures from the work order and permit in place? Do I have the right tools and PPE? Are others around me affected? If an answer is no or unclear, you don’t start.',
        'Stop when it is unsafe. Under article 29 of the Arbowet, employees may stop work when, in their reasonable judgement, there is serious danger so immediate that there is no time to wait for the inspectorate. They keep their pay; they must tell their supervisor right away, and the stop is reported to the Arbeidsinspectie as soon as possible. Many sites go further with a stop-work rule for everyone, including visitors and contractors. Stopping is not failing; carrying on when unsure is.',
        'The trap is the LMRA turning into a ticked form. A card signed in two seconds checks nothing. Good teams name the risks out loud together, and a supervisor sometimes asks “What did you find?”. A stop that is thanked, not punished, is what keeps people stopping.',
      ],
      example: {
        kind: 'worked',
        text: 'Two maintenance technicians are to replace a motor on a roof fan. The work order says: up the fixed ladder. At the ladder they do their LMRA. It has rained, so the roof is wet and slippery. And they hear a contractor welding on the same roof, which was not on their work order. They don’t start. They call the contractor’s supervisor and the person who issued the welding permit, agree who works where and when, and check that the roof edge near the fan has a guardrail. They start an hour later, with the welder at the other end of the roof.',
      },
      said: 'What engineers say: “Before we start: what’s different here from what’s on the work order?”',
      recall: [
        {
          q: 'Who does the LMRA?',
          options: ['The safety manager, once a week', 'The people who will do the work, at the workplace, just before starting', 'The planner, when making the work order', 'The client, at the end of the job'],
          answer: 'The people who will do the work, at the workplace, just before starting',
          why: 'Only they see the actual situation at that moment.',
        },
        {
          q: 'During the LMRA, one answer is unclear. What do you do?',
          options: ['Start and keep an eye on it', 'Don’t start until it is clear', 'Write it on the card and start', 'Ask a colleague to start first'],
          answer: 'Don’t start until it is clear',
          why: 'An unclear answer is a reason to stop and sort it out, not to take the risk.',
        },
        {
          q: 'What does article 29 of the Arbowet give employees?',
          options: ['The right to refuse any task they dislike', 'The right to stop work in case of serious and immediate danger, without losing pay', 'A bonus for reporting near misses', 'The right to inspect the employer’s finances'],
          answer: 'The right to stop work in case of serious and immediate danger, without losing pay',
          why: 'It applies when, in their reasonable judgement, the danger is serious and immediate; they must tell their supervisor right away.',
        },
        {
          q: 'Which sign shows that the LMRA has become a ritual?',
          options: ['The team talks through the risks out loud', 'Cards are signed in seconds without anyone discussing risks', 'A supervisor asks what was found', 'Work is sometimes stopped after the LMRA'],
          answer: 'Cards are signed in seconds without anyone discussing risks',
          why: 'A signature without thinking checks nothing. The other three are signs that it works.',
        },
      ],
      situation: {
        scene: 'At a grid operator you are timing how long crews spend per job. You notice one crew skipping the LMRA at the substation door. The crew leader winks: “Saves five minutes. You’re measuring us, right?”',
        ask: 'What do you do?',
        model: 'I’d tell him straight away that I don’t want my measuring to make anyone skip the LMRA: it counts as part of the job, and I’ll record it that way. I’d ask him to do it now, before they go in. Afterwards I’d tell my sponsor and adjust how I present the study, so no crew feels that safety steps make them look slow.',
        rubric: [
          'Asks the crew to do the LMRA before they continue',
          'Makes clear the LMRA counts as part of the job',
          'Changes the measurement so it doesn’t push people to skip safety steps',
        ],
      },
      sayIt: 'Explain to a new consultant in 60 seconds what an LMRA is and why anyone may stop unsafe work.',
      terms: [
        { term: 'LMRA', def: 'Laatste minuut risicoanalyse: a short check at the workplace by the people doing the job, just before they start.' },
        { term: 'VCA', def: 'The Dutch safety checklist and certificate scheme for contractors.' },
        { term: 'Stop-work right', def: 'The right to stop work in serious danger (Arbowet article 29); many sites extend it to everyone.' },
      ],
    },
    {
      id: 'eng.safety.nen3140',
      title: 'Electrical work: roles and why you don’t touch',
      pre: [
        {
          q: 'During a site visit, an engineer invites you to open a cabinet in a low-voltage installation to look at the wiring. What do you do?',
          options: ['Open it yourself, carefully', 'Decline: you’re a layperson; an authorised person opens it and you watch from where they tell you', 'Open it with gloves on', 'Open it if the main switch is off'],
          answer: 'Decline: you’re a layperson; an authorised person opens it and you watch from where they tell you',
          why: 'Gloves or a switched-off main switch don’t make you competent or authorised. Your job is to look and ask, not to touch.',
        },
      ],
      teach: [
        'NEN 3140 is the Dutch standard for safely operating and working on low-voltage installations, up to 1,000 V AC; NEN 3840 does the same above that, for high voltage. Both build on the European NEN-EN 50110. The legal duty comes from the Arbobesluit; following these standards is the accepted way to meet it.',
        'The roles. The installatieverantwoordelijke (IV) is responsible for the safe operation of the installation. The werkverantwoordelijke (WV) leads a specific job on site. A vakbekwaam persoon (VP) has the training and experience to judge the electrical risks of the work. A voldoende onderricht persoon (VOP) is instructed for specific, defined tasks. Everyone else is a leek, a layperson.',
        'The appointment counts. The employer appoints people in writing for a role and a scope: the aanwijzing. Skill alone doesn’t allow you to work on an installation; the written appointment does. The appointment states what the person may do, and on which installations. Before any work near an installation, ask: who is the IV here, and who is the WV for this job?',
        'As a consultant you are a layperson. You enter switch rooms and substations only with an authorised person, you stand where they tell you, and you touch nothing: no doors, no switches, no covers, no resetting a tripped breaker. That isn’t modesty; it is how electrocution and arc flash are avoided. Your value is in your questions, not your hands.',
      ],
      example: {
        kind: 'worked',
        text: 'A consultant at a grid operator wants to time a cable repair at a substation, a netstation. Before the day, she asks the planner who the WV for the job is and calls him: may she observe, and what does she need? On site, the WV briefs her: she stays outside the marked area, wears the helmet and arc-rated clothing he gives her, and touches nothing. The crew isolates, locks and earths the cable under a switching programme approved by the IV. She writes down times and asks her questions during the breaks, not while they are switching.',
      },
      said: 'What engineers say: “Who’s the WV on this job? Then I’ll ask him where you can stand.”',
      recall: [
        {
          q: 'Which standard covers the safe operation of high-voltage installations, above 1,000 V AC, in the Netherlands?',
          options: ['NEN 3140', 'NEN 3840', 'NEN 1010', 'VCA'],
          answer: 'NEN 3840',
          why: 'NEN 3140 covers low voltage up to 1,000 V AC; NEN 3840 covers high voltage above it. NEN 1010 is about designing and building low-voltage installations.',
        },
        {
          q: 'Who leads a specific electrical job on site?',
          options: ['The installatieverantwoordelijke (IV)', 'The werkverantwoordelijke (WV)', 'The voldoende onderricht persoon (VOP)', 'The safety manager'],
          answer: 'The werkverantwoordelijke (WV)',
          why: 'The IV is responsible for the installation as a whole; the WV leads the work at the place where it happens.',
        },
        {
          q: 'A technician is skilled, but has no written appointment from the employer for this installation. May he work on it as a VP?',
          options: ['Yes, skill is what counts', 'No: the written appointment for that role and scope is required', 'Yes, if a colleague agrees', 'Yes, if he has a VCA certificate'],
          answer: 'No: the written appointment for that role and scope is required',
          why: 'The aanwijzing is what makes him a VP for that work, not his skill alone.',
        },
        {
          q: 'What is the difference between a VP and a VOP?',
          options: ['There is none', 'A VP can judge the electrical risks of the work; a VOP is instructed for specific, defined tasks', 'A VOP is more senior than a VP', 'A VP only works on high voltage'],
          answer: 'A VP can judge the electrical risks of the work; a VOP is instructed for specific, defined tasks',
          why: 'A VOP does a fixed task well; a VP can assess a situation that isn’t standard.',
        },
      ],
      situation: {
        scene: 'At a parts manufacturer, a line stops because a breaker in a distribution board has tripped. The production manager, in a hurry, says to you: “You’re standing next to it. Just flip it back, everybody does.”',
        ask: 'What do you do?',
        model: 'I wouldn’t touch it. I’d say: “I’m not authorised for that, and a breaker trips for a reason. Who’s the electrician on shift?” Then I’d help find that person fast. Afterwards I could suggest looking at why the breaker trips and who on each shift is appointed to deal with it, so production doesn’t wait so long next time.',
        rubric: [
          'Refuses to touch the board',
          'Points out that a trip has a cause and needs an authorised person',
          'Helps get the right person and suggests a structural fix',
        ],
      },
      sayIt: 'Explain to a new consultant in 60 seconds who does what in electrical work under NEN 3140, and what a layperson may do.',
      terms: [
        { term: 'IV', def: 'Installatieverantwoordelijke: responsible for the safe operation of the installation.' },
        { term: 'WV', def: 'Werkverantwoordelijke: leads a specific electrical job on site.' },
        { term: 'VP and VOP', def: 'Vakbekwaam persoon (can judge the risks) and voldoende onderricht persoon (instructed for defined tasks).' },
        { term: 'Aanwijzing', def: 'The employer’s written appointment for a role and scope; without it, no electrical work.' },
      ],
    },
    {
      id: 'eng.safety.permit',
      title: 'Permit to work',
      pre: [
        {
          q: 'Which job most likely needs a written permit to work at a factory?',
          options: ['Changing a printer cartridge', 'Welding near a tank that held a flammable liquid', 'Walking the production floor with a visitor vest', 'Updating a work instruction'],
          answer: 'Welding near a tank that held a flammable liquid',
          why: 'Hot work near flammable residue is non-routine and can cause a fire or explosion, which is exactly what permits are for.',
        },
      ],
      teach: [
        'A permit to work, the werkvergunning, is a written system for non-routine, high-risk work: hot work such as welding, grinding and cutting; entering a confined space such as a tank; work at height; opening pipes or vessels with process media; and digging near cables. It makes sure the hazards are known, the area is ready, and everyone knows who is in control.',
        'What a permit holds: the exact job and location; the hazards; the isolations, with their lockout references; tests to do, such as gas measurement before entering a tank; the PPE; how long it is valid; and signatures. The issuer, often from operations, confirms the area is ready. The holder, the crew leader, accepts it and briefs the crew.',
        'Handover and closing are where it goes wrong. At a shift change the permit is handed over in person. When the job is done, the holder hands it back, the issuer checks the area, and only then are isolations removed. On Piper Alpha in 1988, 167 people died after a pump was restarted while its safety valve was out for maintenance; the permit for that work had not been passed on at shift change.',
        'A permit doesn’t replace the LMRA: the permit sets the plan, the LMRA checks it on the spot. And jobs in the same area need coordination. Two permits that each make sense on their own can together create a hazard nobody foresaw, like welding next to a tank someone else is opening.',
      ],
      example: {
        kind: 'worked',
        text: 'Hot work at a parts manufacturer: welding a bracket to a steel platform above a hydraulic power unit. The issuer from production and the welding crew leader walk the area together. The permit lists: flammable material removed or covered within the distance in the site rule; the hydraulic unit covered with a fire blanket; an extinguisher at hand; a fire watch during the work and for the set time after it, because smouldering fires can start later; valid today from 08:00 to 16:00. Both sign. At 14:30 the job is done: the crew leader hands the permit back, the fire watch stays, and the issuer closes it after checking the area.',
      },
      said: 'What engineers say: “Is the permit signed, and who’s the issuer if something changes?”',
      recall: [
        {
          q: 'On a permit to work, who confirms that the area is ready for the job?',
          options: ['The holder, the crew leader', 'The issuer, often from operations', 'The client’s purchasing department', 'Anyone in the crew'],
          answer: 'The issuer, often from operations',
          why: 'The issuer controls the area and the isolations; the holder accepts the permit and briefs the crew.',
        },
        {
          q: 'At which moments do permit systems most often fail?',
          options: ['When the permit is printed', 'At shift change and when the permit is handed back', 'When the PPE is handed out', 'During lunch breaks'],
          answer: 'At shift change and when the permit is handed back',
          why: 'Information gets lost between people. Piper Alpha is the classic example of a permit not passed on at shift change.',
        },
        {
          q: 'Why does a fire watch stay for a set time after hot work ends?',
          options: ['To clean up the area', 'Because smouldering material can catch fire after the welding has stopped', 'To fill in the permit', 'Because the welder needs a break'],
          answer: 'Because smouldering material can catch fire after the welding has stopped',
          why: 'Sparks can land in hidden places and start a fire some time later.',
        },
        {
          q: 'Which test is typically required on the permit before someone enters a tank?',
          options: ['A noise measurement', 'A gas measurement', 'A vibration measurement', 'An eye test'],
          answer: 'A gas measurement',
          why: 'A confined space can hold too little oxygen, flammable gas or toxic gas, none of which you can reliably see or smell.',
        },
      ],
      situation: {
        scene: 'You’re observing a maintenance crew at a parts manufacturer. At 14:50 the crew leader says: “The permit runs out at 15:00, but we’re nearly done. We’ll just finish.”',
        ask: 'What do you say?',
        model: 'It isn’t my call to allow or stop it, but I’d ask him: “Shall we call the issuer to extend it? It’s a two-minute call.” If he goes on anyway, I’d tell his supervisor. A permit that has run out means nobody has confirmed the area is still safe, for instance whether another job has started nearby.',
        rubric: [
          'Doesn’t accept working on an expired permit',
          'Suggests the quick, proper route: the issuer extends it',
          'Explains what an expired permit no longer guarantees',
        ],
      },
      sayIt: 'Explain to a new consultant in 60 seconds what a permit to work is and where it most often goes wrong.',
      terms: [
        { term: 'Permit to work', def: 'Werkvergunning: written approval for non-routine, high-risk work, with hazards, isolations and signatures.' },
        { term: 'Hot work', def: 'Welding, grinding or cutting: work that can start a fire.' },
        { term: 'Issuer and holder', def: 'The issuer confirms the area is ready; the holder accepts the permit and briefs the crew.' },
      ],
    },
    {
      id: 'eng.safety.incidents',
      title: 'Near misses and learning without blame',
      pre: [
        {
          q: 'Heinrich’s 1931 pyramid suggests a fixed ratio between minor and serious accidents. What has later research shown?',
          options: ['The ratio is exactly the same everywhere', 'Fewer minor injuries doesn’t reliably mean fewer serious or fatal ones; they often have different causes', 'Minor injuries don’t matter at all', 'Serious accidents are pure chance'],
          answer: 'Fewer minor injuries doesn’t reliably mean fewer serious or fatal ones; they often have different causes',
          why: 'Cuts and sprains come from different situations than falls, crushings or explosions. You need to look at the serious ones on their own.',
        },
      ],
      teach: [
        'A near miss, a bijna-ongeval, is an event that could have caused harm but didn’t: a pallet falling where, by luck, nobody stood. Reporting near misses gives you lessons for free. Heinrich (1931) drew a pyramid: for every serious injury, 29 minor ones and 300 events without injury. Bird later published 1 : 10 : 30 : 600.',
        'The limits: the ratios vary widely, and serious and fatal events often have different causes than cuts and sprains. BP’s Texas City refinery, where 15 people died in 2005, had good personal injury statistics. So look specifically at what can cause serious harm: released energy, work at height, vehicles, failed isolations.',
        'Learning without blame. Most incidents involve normal people in a system that made the mistake easy: poor design, time pressure, unclear procedures. A just culture (James Reason, Sidney Dekker) separates honest mistakes, which you learn from, from reckless behaviour, which has consequences. Punish people for reporting and the reports stop, while the risks stay.',
        'Dutch law: the employer must report a work accident that causes death, permanent injury or a hospital admission to the Nederlandse Arbeidsinspectie immediately (Arbowet, article 9). The employer also keeps a list of those accidents and of accidents that led to more than three working days of absence. Inside the company: care for the people, secure the scene, investigate with those involved, fix the system, and share what you learned.',
      ],
      example: {
        kind: 'worked',
        text: 'At a parts manufacturer, a reversing forklift nearly hits a planner at the corner of a warehouse aisle. She reports it. The safety advisor doesn’t ask “who wasn’t paying attention?” but walks the spot with her and the driver. They find a blind corner; the racks were moved last month; and the marked walkway takes a long way round, so people take the shortcut. The fixes: a physical barrier, a marked crossing at the corner, a mirror, and the walkway along the shortest route. The planner hears what changed, and the next week two more near misses are reported.',
      },
      said: 'What engineers say: “Thanks for reporting it. Let’s go and look at where it happened.”',
      recall: [
        {
          q: 'What is a near miss?',
          options: ['An accident with minor injury', 'An event that could have caused harm but didn’t', 'A safety inspection that found nothing', 'A late delivery'],
          answer: 'An event that could have caused harm but didn’t',
          why: 'It carries the same lessons as an accident, without anyone getting hurt.',
        },
        {
          q: 'Why are low minor-injury numbers no proof that serious accidents won’t happen?',
          options: ['Because minor injuries are not recorded', 'Because serious and fatal events often have different causes than minor ones', 'Because the numbers are always wrong', 'Because serious accidents can’t be prevented'],
          answer: 'Because serious and fatal events often have different causes than minor ones',
          why: 'Texas City had good personal injury figures. Serious risks need their own attention.',
        },
        {
          q: 'Which work accident must an employer in the Netherlands report to the Nederlandse Arbeidsinspectie immediately?',
          options: ['Any accident, even a scratch', 'One that leads to death, permanent injury or a hospital admission', 'Only accidents involving contractors', 'Only fatal accidents'],
          answer: 'One that leads to death, permanent injury or a hospital admission',
          why: 'That is the reporting duty in article 9 of the Arbowet.',
        },
        {
          q: 'What does a just culture do?',
          options: ['It never holds anyone responsible', 'It separates honest mistakes, to learn from, from reckless behaviour, which has consequences', 'It punishes every mistake to set an example', 'It leaves incidents to HR'],
          answer: 'It separates honest mistakes, to learn from, from reckless behaviour, which has consequences',
          why: 'People keep reporting when honest mistakes aren’t punished, while reckless behaviour is still addressed.',
        },
      ],
      situation: {
        scene: 'The plant manager of a parts manufacturer wants a big screen at the entrance showing “days without a lost-time injury”, with a team bonus at 100 days. He asks what you think.',
        ask: 'What do you advise?',
        model: 'I’d say I like that he wants safety visible, but a bonus on injury-free days can make people stop reporting, or come to work injured. I’d put on the screen what shows active safety work: near misses reported, actions closed, and progress on the serious risks such as forklifts and lockout. And I’d keep any reward away from the injury count itself.',
        rubric: [
          'Appreciates the intent to make safety visible',
          'Explains how a bonus on injury-free days can hide incidents',
          'Proposes measures that show learning and serious risks',
        ],
      },
      sayIt: 'Explain to a plant manager in 60 seconds why near misses matter and why blaming people makes a site less safe.',
      terms: [
        { term: 'Near miss', def: 'Bijna-ongeval: an event that could have caused harm but didn’t.' },
        { term: 'Just culture', def: 'Learning from honest mistakes, while reckless behaviour still has consequences.' },
        { term: 'Reporting duty', def: 'Under Arbowet article 9: death, permanent injury or hospital admission must be reported to the inspectorate immediately.' },
      ],
    },
  ],
};
