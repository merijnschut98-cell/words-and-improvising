// eng.switchgear (EN): Switchgear and protection: switching devices, MS installations, protection relays, selectivity, working safely, distribution automation.
export default {
  lessons: [
    {
      id: 'eng.switchgear.devices',
      title: 'Breakers, switches, disconnectors and fuses',
      pre: [
        {
          q: 'Which device can safely interrupt a short-circuit current of thousands of amperes and then switch back on?',
          options: ['A disconnector', 'A load-break switch', 'A circuit breaker', 'A fuse'],
          answer: 'A circuit breaker',
          why: 'Only a circuit breaker can interrupt fault currents repeatedly; a fuse does it once and must be replaced.',
        },
      ],
      teach: [
        'A circuit breaker (vermogensschakelaar) can switch normal load and interrupt short-circuit currents, in MS often 10 to 20 kA or more. A protection relay tells it to open when it sees a fault.\n\nBreakers sit in substations at the start of every MS feeder. Modern MS breakers interrupt the arc in a vacuum bottle.',
        'A load-break switch (lastscheider) can switch normal load current on and off, and close onto a fault, but it cannot interrupt a short circuit. That is what you find in netstations for the ring cables: operators use them to switch sections in and out of the ring.',
        'A disconnector (scheider) may only be operated without current. Its job is to create a safe, reliable gap so people can work behind it. An earthing switch connects a dead section to earth.\n\nA fuse (zekering) interrupts a fault by melting, once; then it must be replaced. In a netstation, the transformer is often protected by MS fuses combined with a load-break switch.',
        'The key question for any device: what can it make and what can it break? Operating a disconnector under load, or a load-break switch onto a fault it cannot handle, can create an arc that injures the operator. Knowing what each device can do is basic safety, not trivia.',
      ],
      example: {
        kind: 'worked',
        text: 'A 10 kV feeder in a substation is protected by a breaker rated 20 kA. The ring passes netstation 12, which has two load-break switches for the ring cables and a fuse-switch for its 400 kVA transformer. A digger hits the ring cable: the relay at the substation sees 8 kA and opens the breaker in about 0.3 s.\n\nThe load-break switches in netstation 12 could not have done that. Once the feeder is dead, a technician opens the load-break switches around the damaged section to isolate it, and the breaker is switched back on.',
      },
      said: 'What engineers say: “You can’t pull that under load, it’s a disconnector. Open the switch first.”',
      recall: [
        {
          q: 'A 10 kV network has a fault level of 300 MVA. What is the short-circuit current, in kA? (I = S / (1.73 × U))',
          number: 17.3,
          tolerance: 0.5,
          unit: 'kA',
          why: '300,000,000 / (1.73 × 10,000) ≈ 17,300 A = 17.3 kA.',
        },
        {
          q: 'What may a disconnector do?',
          options: ['Only switch without current, to create a safe gap', 'Interrupt short circuits', 'Switch full load current', 'Replace a fuse'],
          answer: 'Only switch without current, to create a safe gap',
          why: 'A disconnector is for isolation, not for switching current.',
        },
        {
          q: 'What happens to a fuse after it interrupts a fault?',
          options: ['It resets itself', 'A relay closes it again', 'It switches to the other ring', 'It must be replaced'],
          answer: 'It must be replaced',
          why: 'The fuse element melts to interrupt the fault, so it works only once.',
        },
        {
          q: 'Which device is typically used for the ring cables in a netstation?',
          options: ['A circuit breaker with relay', 'A load-break switch', 'A fuse', 'A disconnector only'],
          answer: 'A load-break switch',
          why: 'Load-break switches let operators switch ring sections under normal load.',
        },
      ],
      situation: {
        scene: 'You’re at a regional grid operator in a project to make fault restoration faster. Someone proposes that technicians “just switch the netstation while the fault is still on, to save time”.',
        ask: 'What do you ask?',
        model: 'What can the switches in those netstations break? Load-break switches cannot interrupt a short-circuit current, so operating them while a fault is fed would create a dangerous arc. The breaker in the substation has to clear the fault first. Maybe the time can be won elsewhere, for example in finding the faulty section faster.',
        rubric: [
          'Asks what the devices can make and break',
          'Identifies the safety risk of switching a fault with a load-break switch',
          'Redirects the time saving to a safe part of the process',
        ],
      },
      sayIt: 'Explain to a project manager in 60 seconds the difference between a circuit breaker, a load-break switch, a disconnector and a fuse.',
      terms: [
        { term: 'Vermogensschakelaar', def: 'Circuit breaker: switches load and interrupts short-circuit currents.' },
        { term: 'Lastscheider', def: 'Load-break switch: switches normal load, not short circuits.' },
        { term: 'Scheider', def: 'Disconnector: operated without current to create a safe gap.' },
        { term: 'Fault level', def: 'The short-circuit power or current at a point in the network.' },
      ],
    },
    {
      id: 'eng.switchgear.installations',
      title: 'MS switchgear and ring main units',
      pre: [
        {
          q: 'SF6, the gas in much MS switchgear, is a greenhouse gas. Roughly how much stronger than CO2 is it, per kilogram?',
          options: ['About 2 times', 'About 23,000 times', 'About 100 times', 'It is not a greenhouse gas'],
          answer: 'About 23,000 times',
          why: 'SF6 has a global warming potential of roughly 23,500, the highest of any common industrial gas.',
        },
      ],
      teach: [
        'In a substation, MS switchgear is a row of cabinets (velden), one per feeder, each with a breaker, measurement transformers and a relay.\n\nOlder air-insulated switchgear (AIS) is large: air between the parts insulates them. Gas-insulated switchgear (GIS) puts the live parts in a sealed tank of SF6, which makes it much more compact.',
        'In a netstation, the MS part is usually a ring main unit (RMU): a compact unit with two cable fields for the ring and one transformer field. Many RMUs from recent decades are SF6-insulated.\n\nOlder types, such as the Magnefix, are still very common in Dutch netstations. For some older types, grid operators have extra rules on how to operate them safely.',
        'SF6 insulates and quenches arcs extremely well, but it is a very strong greenhouse gas: about 23,500 times CO2. Under the EU F-gas rules, new MS switchgear up to 24 kV may no longer use F-gases such as SF6 from 2026, and up to 52 kV from 2030. Alternatives use vacuum to interrupt the arc and dry air or solid insulation.',
        'Switchgear choices are long-term: an installation stays 30 to 50 years. That makes them a big topic in standardisation, purchasing and safety. When grid people talk about “the installation”, ask what type it is; the answer tells you how it is operated, maintained and replaced.',
      ],
      example: {
        kind: 'worked',
        text: 'A grid operator has 20,000 SF6 RMUs, each with about 1.5 kg of gas: 30 tonnes of SF6. If 0.1% leaks per year, that is 30 kg, which equals about 30 × 23,500 = 705,000 kg, roughly 700 tonnes of CO2 equivalent a year.\n\nFrom 2026, new RMUs must be SF6-free. The operator updates its standard netstation design to a vacuum and dry-air RMU, retrains technicians on the new operating steps, and keeps a plan for safely collecting SF6 from units it replaces.',
      },
      said: 'What engineers say: “From now on it’s SF6-free for new stations. Same footprint, different operating steps, so we retrain everyone.”',
      recall: [
        {
          q: 'An RMU contains 1.5 kg of SF6, with a warming effect of about 23,500 times CO2. If all of it leaked, how many tonnes of CO2 equivalent is that?',
          number: 35.3,
          tolerance: 1,
          unit: 't',
          why: '1.5 × 23,500 = 35,250 kg ≈ 35.3 tonnes.',
        },
        {
          q: 'What does a typical ring main unit contain?',
          options: ['One breaker per house', 'A 150/10 kV transformer', 'Two cable fields for the ring and one transformer field', 'Only LS fuses'],
          answer: 'Two cable fields for the ring and one transformer field',
          why: 'The RMU connects the netstation into the ring and feeds the transformer.',
        },
        {
          q: 'What is the main advantage of gas-insulated switchgear over air-insulated?',
          options: ['It is much more compact', 'It needs no protection', 'It is cheaper to dispose of', 'It works without electricity'],
          answer: 'It is much more compact',
          why: 'SF6 insulates far better than air, so parts can sit closer together.',
        },
        {
          q: 'What do SF6-free MS alternatives typically use?',
          options: ['Oil for everything', 'Higher voltage', 'Hydrogen', 'Vacuum to interrupt the arc and dry air or solid insulation'],
          answer: 'Vacuum to interrupt the arc and dry air or solid insulation',
          why: 'Vacuum interrupters handle the arc; air or solid materials provide insulation.',
        },
      ],
      situation: {
        scene: 'You’re at a regional grid operator in a project on the roll-out of a new SF6-free RMU. The planning assumes technicians can operate it from day one, “because a switch is a switch”.',
        ask: 'What do you ask?',
        model: 'Are the operating steps the same as on the current RMUs, including earthing and interlocks? If they differ, technicians need training and updated work instructions before the first unit goes live, and mixing two types in one ring adds risk. When is the training planned, and who signs off that the instructions are ready?',
        rubric: [
          'Asks whether operating steps differ from the current type',
          'Links a new type to training and work instructions',
          'Asks who is accountable for readiness before go-live',
        ],
      },
      sayIt: 'Explain to a sustainability manager in 60 seconds why SF6 matters for grid operators and what replaces it.',
      terms: [
        { term: 'RMU', def: 'Ring main unit: compact MS switchgear in a netstation with ring and transformer fields.' },
        { term: 'GIS / AIS', def: 'Gas-insulated / air-insulated switchgear.' },
        { term: 'SF6', def: 'Insulating gas with a very high greenhouse effect, being phased out in new MS switchgear.' },
        { term: 'Veld', def: 'One cabinet in a switchgear row, for one feeder or transformer.' },
      ],
    },
    {
      id: 'eng.switchgear.protection',
      title: 'Protection relays, CTs and VTs',
      pre: [
        {
          q: 'A protection relay at a 10 kV feeder needs to know the current, which can be hundreds of amperes. How does it measure it?',
          options: ['It is wired directly into the 10 kV cable', 'From the smart meters', 'Someone reads it off and enters it', 'Through a current transformer that brings it down to about 1 or 5 A'],
          answer: 'Through a current transformer that brings it down to about 1 or 5 A',
          why: 'CTs and VTs scale current and voltage down to safe, standard values for relays and meters.',
        },
      ],
      teach: [
        'A protection system has three parts.\n\nMeasurement transformers scale the real values down: a current transformer (CT, stroomtransformator) of 400/1 A turns 400 A into 1 A; a voltage transformer (VT, spanningstransformator) turns 10 kV into 100 V. A relay compares these values with its settings. A breaker opens when the relay sends a trip signal.',
        'Overcurrent protection trips when the current stays above a set value for a set time.\n\nTypically there are two stages: a lower setting with a delay for overload and distant faults, and a high setting that trips almost instantly for heavy short circuits close by. The setting must be above the highest normal load and below the lowest fault current.',
        'Earth-fault protection looks at the current that leaks to earth, measured as the sum of the three phases, which should be zero when all is well.\n\nHow large an earth fault current is depends on how the network’s star point is earthed, and that differs per network. Some networks need very sensitive or directional earth-fault relays.',
        'Modern relays are digital: they also record events and fault currents, which helps after a trip. Settings are a managed engineering product.\n\nA wrong setting causes either unwanted trips or, worse, no trip at all. When the network changes, for example a new solar park, the settings must be checked.',
      ],
      example: {
        kind: 'worked',
        text: 'A 10 kV feeder has a maximum load of 300 A and the smallest fault current at the far end is 2,000 A. The CT is 400/1 A. The engineer sets the first stage at 450 A, 1.5 times the maximum load, with 0.5 s delay: on the relay side that is 450 / 400 = 1.125 A.\n\nThe second stage is set at 4,000 A, instantaneous. A fault at the far end (2,000 A) trips on stage one after 0.5 s; a fault near the substation (12,000 A) trips immediately on stage two.',
      },
      said: 'What engineers say: “Check the relay settings after that solar park connects. The fault currents on that feeder have changed.”',
      recall: [
        {
          q: 'A CT has a ratio of 400/1 A. The primary current is 600 A. What current does the relay see, in amperes?',
          number: 1.5,
          tolerance: 0.05,
          unit: 'A',
          why: '600 / 400 = 1.5 A on the secondary side.',
        },
        {
          q: 'Where must an overcurrent setting lie?',
          options: ['Below the normal load current', 'Above the highest normal load and below the lowest fault current', 'Exactly at the cable rating', 'Above the highest fault current'],
          answer: 'Above the highest normal load and below the lowest fault current',
          why: 'Otherwise it either trips on normal load or misses real faults.',
        },
        {
          q: 'What does earth-fault protection typically measure?',
          options: ['The voltage between phases', 'The temperature of the cable', 'The sum of the three phase currents', 'The power factor'],
          answer: 'The sum of the three phase currents',
          why: 'In a healthy network the sum is zero; current leaking to earth makes it non-zero.',
        },
        {
          q: 'A new solar park is connected to a feeder. What should happen to the protection?',
          options: ['The settings should be checked against the new fault currents', 'Nothing, protection is independent of the network', 'The relay should be removed', 'The breaker should be replaced'],
          answer: 'The settings should be checked against the new fault currents',
          why: 'New sources change fault currents and can make existing settings wrong.',
        },
      ],
      situation: {
        scene: 'You’re at a regional grid operator. After a feeder tripped unexpectedly twice in a month without any visible fault, the planner wants to know “if we can just set the relay a bit higher”.',
        ask: 'What do you ask?',
        model: 'What did the relay record at those trips: which stage, what current, and what was the load at that moment? If load has grown, the setting may be too close to normal load; but raising it blindly could mean a real fault far down the feeder is no longer seen. Who owns the settings, and can they review it against the current minimum fault current?',
        rubric: [
          'Asks for the relay’s recorded event data',
          'Recognises the risk of a setting that no longer sees real faults',
          'Involves the owner of the settings for a proper review',
        ],
      },
      sayIt: 'Explain to a non-technical manager in 60 seconds how a protection relay knows when to trip a breaker.',
      terms: [
        { term: 'CT (stroomtransformator)', def: 'Scales high currents down to 1 or 5 A for relays and meters.' },
        { term: 'VT (spanningstransformator)', def: 'Scales high voltages down to about 100 V.' },
        { term: 'Overcurrent protection', def: 'Trips when current stays above a set value for a set time.' },
        { term: 'Earth-fault protection', def: 'Trips on current leaking to earth.' },
      ],
    },
    {
      id: 'eng.switchgear.selectivity',
      figure: 'eng.switchgear.selectivity',
      title: 'Selectivity',
      pre: [
        {
          q: 'A short circuit occurs in one LS street cable. In a well-designed grid, what switches off?',
          options: ['Only the fuse of that street cable', 'The whole netstation', 'The whole MS ring', 'The substation'],
          answer: 'Only the fuse of that street cable',
          why: 'Selectivity means the protection closest to the fault clears it, and everything upstream stays on.',
        },
      ],
      teach: [
        'Selectivity means that only the protection closest to the fault trips, so as few customers as possible lose power. A fault in a street cable should blow that cable’s fuse in the netstation, not the transformer fuse, and certainly not the feeder breaker in the substation.',
        'Time grading is the most common method. The relay closest to the fault is set fastest; each relay upstream waits a bit longer, typically about 0.3 s more.\n\nThat grading margin covers the breaker’s opening time and measuring tolerances. If the nearest device fails to clear the fault, the next one up still will, just later: that is the backup.',
        'Fuses are coordinated by size. For LS fuses of the same type, a rule of thumb is that the upstream fuse should be at least about 1.6 times the rating of the downstream one. Between a netstation’s MS fuse and its LS fuses, engineers check the curves to make sure the LS fuse goes first.',
        'Without selectivity, a small fault turns into a big outage: one bad street cable takes out a whole ring of 2,000 customers. Selectivity can also break when the network changes: a new feed point, a cable section moved to another ring, or larger fuses fitted “because they kept blowing”.',
      ],
      example: {
        kind: 'worked',
        text: 'A netstation feeds six LS cables, each with a 250 A fuse. A technician replaces a fuse that keeps blowing on one cable with a 400 A one. Months later, a fault on that cable does not blow the 400 A fuse fast enough; the MS fuse of the transformer blows first.\n\nResult: all six cables, 180 homes, lose power instead of 30. The fix: back to 250 A on that cable, and find out why it kept blowing, probably an overloaded cable that needs splitting or reinforcing.',
      },
      said: 'What engineers say: “Someone put a bigger fuse in and now it’s not selective. The trafo fuse goes first.”',
      recall: [
        {
          q: 'The relay closest to the fault trips at 0.3 s. The grading margin is 0.3 s. Two relays sit upstream of it. At what time should the top one trip, in seconds?',
          number: 0.9,
          tolerance: 0.05,
          unit: 's',
          why: '0.3 + 0.3 + 0.3 = 0.9 s.',
        },
        {
          q: 'What does time grading do?',
          options: ['It makes all relays trip at once', 'It switches the ring automatically', 'It measures cable length', 'It lets the nearest relay trip first and upstream relays wait a little longer'],
          answer: 'It lets the nearest relay trip first and upstream relays wait a little longer',
          why: 'Each step upstream adds a delay so the nearest device clears the fault first.',
        },
        {
          q: 'Why is fitting a larger fuse “because it kept blowing” risky?',
          options: ['Larger fuses are more expensive', 'It can break selectivity so an upstream fuse blows first', 'Larger fuses do not fit', 'It reduces the voltage'],
          answer: 'It can break selectivity so an upstream fuse blows first',
          why: 'Then a fault takes out many more customers, and the cause stays hidden.',
        },
        {
          q: 'What is the backup function of time grading?',
          options: ['It stores energy', 'It restores supply automatically', 'If the nearest device fails, the next one upstream still clears the fault', 'It doubles the fault current'],
          answer: 'If the nearest device fails, the next one upstream still clears the fault',
          why: 'The upstream relay is set slightly slower, so it acts as backup.',
        },
      ],
      situation: {
        scene: 'You’re reviewing outage data at a regional grid operator. Several LS faults led to the whole netstation going out instead of one street cable. The field team says: “That just happens sometimes.”',
        ask: 'What do you ask?',
        model: 'In those cases, which fuse blew, and were the LS fuses on those cables the standard size? If larger fuses were fitted to stop nuisance blowing, the selectivity with the transformer fuse may be gone. Can we check the fitted fuses against the standard in those netstations, and look at why the original fuses blew in the first place?',
        rubric: [
          'Asks which device operated and which fuse sizes are fitted',
          'Links non-standard fuses to loss of selectivity',
          'Asks for the root cause of the original fuse blowing',
        ],
      },
      sayIt: 'Explain to a customer service team lead in 60 seconds why a fault in one street sometimes takes out a whole neighbourhood.',
      terms: [
        { term: 'Selectivity', def: 'Only the protection closest to the fault trips.' },
        { term: 'Time grading', def: 'Upstream relays are set progressively slower than downstream ones.' },
        { term: 'Grading margin', def: 'The extra delay per step, typically about 0.3 s.' },
      ],
    },
    {
      id: 'eng.switchgear.safety',
      title: 'Working safely: the five rules and NEN 3140',
      pre: [
        {
          q: 'A technician has switched off an MS cable and locked the switch. What must they do before touching it?',
          options: ['Nothing, it is off', 'Wait five minutes', 'Measure that it is dead, then earth and short-circuit it', 'Ask the control room if it is off'],
          answer: 'Measure that it is dead, then earth and short-circuit it',
          why: 'Switched off is not proven dead. Measuring and earthing protect against mistakes and back-feeds.',
        },
      ],
      teach: [
        'The five safety rules for working dead, in this order: 1. vrijschakelen, disconnect on all sides.\n\n2. Vergrendelen, secure against switching back on, with a lock and a tag.\n\n3. Spanningsloos meten, verify that it is dead with a tester.\n\n4. Aarden en kortsluiten, earth and short-circuit.\n\n5. Afschermen, shield nearby parts that are still live.',
        'Each rule covers a real failure. Switching the wrong field. Someone switching back on.\n\nA back-feed from a generator, solar panels or another ring. Induced or residual voltage. A neighbouring live part within reach.\n\nSkipping one step because “it’s definitely off” is how serious accidents happen.',
        'NEN 3140 sets the rules for operating LS installations, up to 1,000 V AC; NEN 3840 does the same above that, so for MS and HS. Both build on the European NEN-EN 50110, and grid operators work with sector rules based on them (BEI).\n\nKey roles: the installatieverantwoordelijke (IV), who controls the installation, and the werkverantwoordelijke (WV), who leads the work on site. A VP (vakbekwaam persoon) is a skilled person; a VOP (voldoende onderricht persoon) is an instructed person.',
        'The employer appoints people to these roles in writing, for specific work: the aanwijzing. A skilled technician without that appointment may not work on the installation as a VP. Skill alone is not enough; the appointment matters.\n\nAs a consultant you are a layperson in an installation: you go in only with a qualified person and you never touch anything.',
      ],
      example: {
        kind: 'worked',
        text: 'Work on an MS cable between netstations 8 and 9. The control room and the IV prepare a switching plan. A technician opens the switches in both stations (rule 1), locks them and hangs tags (rule 2).\n\nAt the work location, they test that all three cores are dead, after first checking the tester on a live source (rule 3). They close the earthing switches at both ends (rule 4) and cover nearby live parts in the netstation (rule 5). Only then does the WV release the cable for the jointing crew.',
      },
      said: 'What engineers say: “It’s switched off, locked and earthed both sides. You can start, but measure first yourself.”',
      recall: [
        {
          q: 'Up to what AC voltage does NEN 3140 count an installation as low voltage, in volts?',
          number: 1000,
          tolerance: 1,
          unit: 'V',
          why: 'Low voltage is up to 1,000 V AC; above that, NEN 3840 applies.',
        },
        {
          q: 'What is the correct order of the first three safety rules?',
          options: ['Disconnect, secure against reclosing, verify dead', 'Earth, disconnect, verify dead', 'Verify dead, disconnect, shield', 'Shield, earth, disconnect'],
          answer: 'Disconnect, secure against reclosing, verify dead',
          why: 'First isolate, then make sure it stays isolated, then prove it is dead.',
        },
        {
          q: 'Under NEN 3140, what allows a skilled technician to work on an installation as a VP?',
          options: ['A technical diploma', 'Five years of experience', 'Passing a safety quiz', 'A written appointment by the employer for specific work'],
          answer: 'A written appointment by the employer for specific work',
          why: 'Training and experience are needed, but the employer’s written appointment, the aanwijzing, is what makes someone a VP for that work.',
        },
        {
          q: 'Why earth and short-circuit after verifying it is dead?',
          options: ['It is faster', 'To protect against a back-feed or someone switching on by mistake', 'To measure the current', 'It is only required for LS'],
          answer: 'To protect against a back-feed or someone switching on by mistake',
          why: 'If voltage returns, the earth carries it away and the protection trips.',
        },
      ],
      situation: {
        scene: 'You’re leading a productivity project at a regional grid operator. A manager suggests that crews could “save twenty minutes per job by skipping the extra measurement when the control room has already confirmed it’s off”.',
        ask: 'How do you respond?',
        model: 'I would not touch the safety steps: verifying it is dead on site is exactly what protects against a wrong field or a back-feed that the control room cannot see. Let’s look for the twenty minutes elsewhere, for example in waiting for the switching, travel between stations or preparing the switching plan. Can we ask the crews where they lose time?',
        rubric: [
          'Refuses to trade a safety rule for productivity',
          'Explains why on-site verification matters',
          'Redirects the search for time savings to other steps, with the crews',
        ],
      },
      sayIt: 'Explain to a new consultant in 60 seconds the five safety rules and why each one matters.',
      terms: [
        { term: 'Vrijschakelen', def: 'Disconnecting an installation part on all sides.' },
        { term: 'NEN 3140', def: 'Dutch standard for safely operating LS electrical installations.' },
        { term: 'IV', def: 'Installatieverantwoordelijke: the person responsible for the installation.' },
        { term: 'Aanwijzing', def: 'The employer’s written appointment of a person to a NEN 3140 role, such as VP or WV, for specific work.' },
      ],
    },
    {
      id: 'eng.switchgear.automation',
      title: 'Distribution automation',
      pre: [
        {
          q: 'An MS ring has remote-controlled switches in a few netstations. After a cable fault, how long does restoring most customers typically take?',
          options: ['About a day', 'Minutes instead of one to two hours', 'Exactly as long as without automation', 'Only until the cable is repaired'],
          answer: 'Minutes instead of one to two hours',
          why: 'The control room can isolate the fault and switch remotely, without waiting for a technician to drive out.',
        },
      ],
      teach: [
        'Without automation, a technician drives to netstations, reads fault indicators and switches by hand: one to two hours of outage for most customers.\n\nWith distribution automation, some netstations get remote-controlled switches and fault indicators that report to the control room. The operator sees where the fault is and switches remotely, in minutes.',
        'Fault indicators (kortsluitverklikkers) light up or send a signal when fault current has passed them. The fault lies between the last indicator that saw current and the first that did not. That is how the faulty section is found quickly, with or without remote control.',
        'A self-healing ring goes one step further: the system locates the fault, opens the switches around it and closes the open point automatically, often within a minute. It needs reliable communication, good data on the network and well-tested logic, so it is introduced step by step.',
        'Automating every netstation is too expensive. Operators choose a few key stations per ring, often two or three, where a remote switch splits the ring into sections.\n\nThat is a business case: cost per station against fewer outage minutes and less driving. Netstation monitoring of load and voltage is often added at the same time.',
      ],
      example: {
        kind: 'worked',
        text: 'A ring feeds 1,200 customers. Without automation, all are out for 90 minutes: 1,200 × 90 = 108,000 customer minutes. With remote switches in two key netstations, the control room isolates the faulty section in 3 minutes: 1,000 customers are back after 3 minutes and 200 stay out for 90 minutes.\n\nThat is 1,000 × 3 + 200 × 90 = 3,000 + 18,000 = 21,000 customer minutes, about 80% less, from two upgraded netstations.',
      },
      said: 'What engineers say: “The verklikkers show it’s between 6 and 7. I’ve switched it out remotely, most of them are back.”',
      recall: [
        {
          q: 'A ring of 900 customers. With automation, 750 are back after 2 minutes and 150 stay out 60 minutes. How many customer minutes is that?',
          number: 10500,
          tolerance: 10,
          unit: 'min',
          why: '750 × 2 + 150 × 60 = 1,500 + 9,000 = 10,500 customer minutes.',
        },
        {
          q: 'How do fault indicators help find a fault?',
          options: ['They measure cable temperature', 'They switch off the fault automatically', 'The fault lies between the last indicator that saw fault current and the first that did not', 'They show the voltage at each home'],
          answer: 'The fault lies between the last indicator that saw fault current and the first that did not',
          why: 'Fault current flows from the source up to the fault, not beyond it.',
        },
        {
          q: 'Why do operators not automate every netstation?',
          options: ['It is forbidden', 'Remote switches do not work in rings', 'Automation increases outages', 'The cost is too high; a few key stations per ring give most of the benefit'],
          answer: 'The cost is too high; a few key stations per ring give most of the benefit',
          why: 'Two or three switch points split the ring into sections that can be restored separately.',
        },
        {
          q: 'What does a self-healing ring do?',
          options: ['Locates, isolates and restores automatically, often within a minute', 'Repairs the cable itself', 'Prevents all faults', 'Replaces the protection relays'],
          answer: 'Locates, isolates and restores automatically, often within a minute',
          why: 'The system runs the switching steps itself instead of an operator.',
        },
      ],
      situation: {
        scene: 'You’re at a regional grid operator. The team wants to install remote switches in 500 netstations next year, chosen “where installation is easiest”.',
        ask: 'What do you ask about the selection?',
        model: 'Which rings cause the most customer minutes today, and where in those rings would a switch point split them best? Easy installation is nice, but the benefit sits in rings with many customers, frequent faults and long travel times. Can we rank the candidates on expected customer minutes saved per euro, and then check installability?',
        rubric: [
          'Asks for outage data per ring',
          'Links the choice to customers, fault frequency and travel time',
          'Proposes ranking on benefit per euro before ease of installation',
        ],
      },
      sayIt: 'Explain to a finance manager in 60 seconds why a few remote switches in the MS grid can cut outage time so much.',
      terms: [
        { term: 'Kortsluitverklikker', def: 'Fault indicator that shows whether fault current has passed.' },
        { term: 'Distribution automation', def: 'Remote control and monitoring of the MS grid.' },
        { term: 'Self-healing ring', def: 'A ring that locates, isolates and restores faults automatically.' },
        { term: 'Customer minutes', def: 'Number of customers out × minutes without power.' },
      ],
    },
  ],
};
