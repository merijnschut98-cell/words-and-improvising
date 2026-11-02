// eng.maintenance (EN): Maintenance: strategies, MTBF/MTTR, failure patterns, condition monitoring, TPM, CMMS.
export default {
  lessons: [
    {
      id: 'eng.maintenance.strategies',
      title: 'Four maintenance strategies',
      pre: [
        {
          q: 'A €400 conveyor motor on a non-bottleneck line fails about once a year, costs 15 minutes of downtime, and a spare is on the shelf. What is the best strategy?',
          options: ['Replace it every six months', 'Fit a wireless vibration sensor', 'Run it to failure', 'Overhaul it every year'],
          answer: 'Run it to failure',
          why: 'Failure is cheap, safe and quick to fix. Any other strategy costs more than it saves.',
        },
      ],
      teach: [
        'Reactive (run-to-failure, breakdown maintenance): fix it when it breaks. Fine when failure is cheap, safe and not on the bottleneck: a light fitting, a small motor with a spare on the shelf. As a default it’s expensive: an unplanned repair typically costs three to five times a planned one, through rush parts, overtime and lost output.',
        'Preventive (time- or usage-based): service or replace at a fixed interval: gearbox oil every 4,000 running hours, filters every month, belts every year. Works for parts that clearly wear out. Wasteful when good parts are thrown away, and risky, because every time you open a machine you can introduce a fault.',
        'Condition-based: measure the condition and act when it crosses a threshold: vibration level, temperature, wear particles in the oil. Predictive goes one step further: use the trend to forecast when it will cross, and plan the repair into a planned stop. It costs sensors and analysis time, so it pays on critical, expensive assets: a press main drive, a bottleneck gearbox, a power transformer.',
        'You choose per asset and per failure mode, based on criticality and how it fails. That logic is called RCM (reliability-centred maintenance). Good plants do 85% or more of their maintenance hours as planned work. Ask: what share of your hours last month was planned?',
      ],
      example: {
        kind: 'worked',
        text: 'A stamping plant has two candidates. Bottleneck press main gearbox: €60,000 new, 10 weeks delivery. Run to failure would stop the plant for weeks: unacceptable. A preventive overhaul every 2 years costs €25,000 and opens a healthy gearbox. A monthly vibration route (€3,000 a year) plus quarterly oil analysis (€400 a year) spots bearing damage months early; a bearing swap in a planned weekend costs €4,000. Choice: condition-based. Conveyor motors on the packing line: €400, spares in stock, 15 minutes to swap. Choice: run to failure.',
      },
      said: 'What engineers say: “That gearbox is on the bottleneck with ten weeks delivery. We’re not running that to failure, put it on the vibration route.”',
      recall: [
        {
          q: 'Last month a maintenance team worked 1,200 hours, of which 300 were unplanned breakdown work. What percentage was planned?',
          number: 75,
          tolerance: 0.5,
          unit: '%',
          why: '(1,200 − 300) / 1,200 = 75%, below the 85% good plants reach.',
        },
        {
          q: 'Which part suits time-based preventive replacement best?',
          options: ['A PLC input card', 'A V-belt that wears and stretches steadily', 'A frequency inverter', 'A light curtain'],
          answer: 'A V-belt that wears and stretches steadily',
          why: 'Preventive replacement works when a part clearly wears with use.',
        },
        {
          q: 'When is run-to-failure a sound choice?',
          options: ['When the asset is on the bottleneck', 'When the failure could hurt someone', 'When failure is cheap, safe and quick to fix', 'When spare parts take months to arrive'],
          answer: 'When failure is cheap, safe and quick to fix',
          why: 'Then the cost of preventing the failure is higher than the failure itself.',
        },
        {
          q: 'What is the difference between condition-based and predictive maintenance?',
          options: ['Predictive uses the trend to forecast when the threshold will be reached', 'There is no difference', 'Condition-based is always done by operators', 'Predictive replaces parts at fixed intervals'],
          answer: 'Predictive uses the trend to forecast when the threshold will be reached',
          why: 'Condition-based acts at a threshold; predictive forecasts it so the repair can be planned.',
        },
      ],
      situation: {
        scene: 'You’re at a food plant. The maintenance manager wants to put wireless vibration sensors on all 140 motors, at €900 per sensor plus a software subscription. “Predictive is the future,” he says.',
        ask: 'What do you ask before the budget goes to the plant manager?',
        model: 'Which of these 140 motors would actually hurt us if they failed: which are on the bottleneck or have no spare? What caused our downtime last year, and how much of it was motors at all? I’d rather start with the 15 most critical assets, prove the value there, and leave the cheap motors with spares on run-to-failure.',
        rubric: [
          'Asks for criticality: which assets really matter',
          'Asks what actually caused downtime last year',
          'Proposes starting small on critical assets and proving the value',
        ],
      },
      sayIt: 'Explain to a plant manager in 60 seconds the four maintenance strategies and why you don’t pick one for the whole plant.',
      terms: [
        { term: 'Run-to-failure', def: 'Deliberately fixing only after a breakdown.' },
        { term: 'Preventive maintenance', def: 'Servicing or replacing at fixed time or usage intervals.' },
        { term: 'Condition-based maintenance', def: 'Acting when a measured condition crosses a threshold.' },
        { term: 'RCM', def: 'Reliability-centred maintenance: choosing a task per failure mode based on consequences.' },
      ],
    },
    {
      id: 'eng.maintenance.metrics',
      title: 'MTBF, MTTR and availability',
      pre: [
        {
          q: 'A machine runs 500 hours and has 5 breakdowns with 10 hours of repair in total. What is the MTBF?',
          options: ['2 hours', '50 hours', '98 hours', '100 hours'],
          answer: '100 hours',
          why: 'MTBF = running time / number of failures = 500 / 5 = 100 hours. The 2 hours is the MTTR.',
        },
      ],
      teach: [
        'MTBF (mean time between failures) = total running time / number of failures. It measures reliability: how often it breaks. MTTR (mean time to repair) = total repair time / number of failures. It measures maintainability: how fast you get it back.',
        'MTTR covers everything from stop to restart: noticing, calling the technician, walking there, diagnosis, finding the part, the repair itself, testing and restarting. The actual wrench time is often the smallest piece; waiting for people and parts is the biggest. That is where the quick wins are.',
        'Availability from the two: MTBF / (MTBF + MTTR). With an MTBF of 40 hours and an MTTR of 2 hours, availability is 40 / 42 = 95.2%. You raise it by making breakdowns rarer (MTBF up) or shorter (MTTR down).',
        'Always ask for the definitions. Does a 3-minute jam count as a failure, or only stops over 10 minutes? Is running time measured in production hours or calendar hours? Including micro-stops can turn an MTBF of 40 hours into one of 2. And MTBF is not a lifetime: an MTBF of 10,000 hours does not mean each part lasts 10,000 hours.',
      ],
      example: {
        kind: 'worked',
        text: 'A filling machine, four weeks, two shifts, five days: 4 × 5 × 16 = 320 planned hours. The stop list shows 8 breakdowns over 10 minutes: 0.5, 1.5, 3, 0.75, 2, 0.25, 4 and 0.5 hours, total 12.5 hours. Running time 320 − 12.5 = 307.5 hours. MTBF = 307.5 / 8 = 38.4 hours. MTTR = 12.5 / 8 = 1.56 hours. Availability = 38.4 / (38.4 + 1.56) = 96.1%. The two longest stops, 3 and 4 hours, were both waiting for a spare part: 7 of the 12.5 hours, 56% of the downtime.',
      },
      said: 'What engineers say: “The MTTR looks bad, but the repair itself is twenty minutes. The rest is waiting for the part from the stores on the other site.”',
      recall: [
        {
          q: 'A press runs 600 hours and has 12 breakdowns. What is the MTBF, in hours?',
          number: 50,
          tolerance: 0.5,
          unit: 'hours',
          why: '600 / 12 = 50 hours.',
        },
        {
          q: 'MTBF is 50 hours and MTTR is 2.5 hours. What is the availability, in %?',
          number: 95.2,
          tolerance: 0.2,
          unit: '%',
          why: '50 / (50 + 2.5) = 0.952.',
        },
        {
          q: 'Which action most directly lowers MTTR?',
          options: ['A longer warranty from the machine builder', 'Running the machine slower', 'A kit of critical spares at the machine', 'Replacing parts more often'],
          answer: 'A kit of critical spares at the machine',
          why: 'Waiting for parts is often the largest part of repair time.',
        },
        {
          q: 'A bearing supplier quotes an MTBF of 10,000 hours. What does that NOT mean?',
          options: ['On average there are 10,000 running hours between failures', 'It is a measure of reliability', 'It depends on how a failure is defined', 'Every bearing will last at least 10,000 hours'],
          answer: 'Every bearing will last at least 10,000 hours',
          why: 'MTBF is an average across failures, not a guaranteed lifetime.',
        },
      ],
      situation: {
        scene: 'You’re at a packaging client. The maintenance KPI board shows an MTTR of 45 minutes, nicely green. The operators tell you the line is often down for hours.',
        ask: 'What do you ask?',
        model: 'When does the MTTR clock start: when the machine stops, or when the technician arrives? And when does it stop: repair done, or line running good product again? If it starts at arrival, the waiting time is invisible. Can we take last month’s stop list and time five breakdowns from stop to good product?',
        rubric: [
          'Asks when the MTTR clock starts and stops',
          'Points out that waiting time may be hidden',
          'Proposes checking a few real breakdowns end to end',
        ],
      },
      sayIt: 'Explain to a production manager in 60 seconds what MTBF and MTTR are and how they give availability.',
      terms: [
        { term: 'MTBF', def: 'Mean time between failures: running time divided by number of failures.' },
        { term: 'MTTR', def: 'Mean time to repair: from stop to running again, divided by number of failures.' },
        { term: 'Availability', def: 'MTBF / (MTBF + MTTR): the share of time the asset can run.' },
        { term: 'Stop list', def: 'The log of every stop with start, duration and reason.' },
      ],
    },
    {
      id: 'eng.maintenance.failure',
      title: 'How equipment really fails',
      pre: [
        {
          q: 'In the classic aviation study by Nowlan and Heap, what share of components showed a clear wear-out age?',
          options: ['About 90%', 'About 10–20%', 'About 60%', 'About 40%'],
          answer: 'About 10–20%',
          why: 'Only around 11% showed age-related failure; most failed at random or early in life.',
        },
      ],
      teach: [
        'The textbook picture is the bathtub curve: many failures at the start (infant mortality: assembly errors, bad parts), then a long flat period of random failures, then rising wear-out. The textbook suggests all equipment looks like this. It doesn’t.',
        'Nowlan and Heap (United Airlines, 1978) found six patterns. Only about 11% of components showed wear-out with age. Most failed at random (constant chance, whatever their age) or early in life after installation or overhaul (68%). Later studies in navies and industry found the same picture. What wears with age is what rubs, cuts or carries load: tyres, brake pads, cutting tools, belts, liners. Electronics, hydraulics and complex assemblies mostly fail at random.',
        'The consequence: replacing a randomly failing part on a schedule does not reduce failures. It can increase them, because every intervention risks infant mortality: a seal fitted wrongly, dirt in the hydraulics, a misaligned coupling.',
        'Engineers check the pattern with a Weibull analysis of failure history. Shape factor β below 1: early failures; fix installation and quality. β around 1: random; use condition monitoring or design it out. β above 1, and especially above 3: wear-out; time-based replacement makes sense, with the interval taken from the data.',
      ],
      example: {
        kind: 'worked',
        text: 'A packaging plant replaces the bearings in all 24 servo axes every 12 months: 24 × €750 = €18,000 a year. Before the programme there were 6 bearing failures a year. After it there were 9, and 5 of those happened within two weeks after a replacement. A Weibull fit on the old data gives β = 1.0: random failure, not wear-out. The plant stops the yearly swap, puts the 6 critical axes on a monthly vibration check, and trains the technicians on bearing fitting. Next year: 3 failures.',
      },
      said: 'What engineers say: “Half of our breakdowns come in the week after the PM. We’re not preventing failures, we’re causing them.”',
      recall: [
        {
          q: 'Of 40 pump failures last year, 26 happened within three weeks after a maintenance intervention. What share is that, in %?',
          number: 65,
          tolerance: 0.5,
          unit: '%',
          why: '26 / 40 = 65%: a strong hint of maintenance-induced failure.',
        },
        {
          q: 'A Weibull analysis of a part’s failures gives β = 3.5. What does that suggest?',
          options: ['Infant mortality', 'Purely random failure', 'Clear wear-out, so time-based replacement can work', 'The data is useless'],
          answer: 'Clear wear-out, so time-based replacement can work',
          why: 'β well above 1 means the failure rate rises with age.',
        },
        {
          q: 'What typically causes infant mortality after maintenance?',
          options: ['Installation errors such as misalignment or contamination', 'The part getting old', 'Too much condition monitoring', 'Operators running the machine too slowly'],
          answer: 'Installation errors such as misalignment or contamination',
          why: 'Opening a machine creates chances to fit things wrongly or let dirt in.',
        },
        {
          q: 'What is true for a part that fails at random?',
          options: ['It should be replaced more often', 'The chance of failure is about the same whatever its age', 'It always gives a warning', 'It will fail at its rated life'],
          answer: 'The chance of failure is about the same whatever its age',
          why: 'Random failures do not depend on age, so replacing early buys nothing.',
        },
      ],
      situation: {
        scene: 'You’re at a water company. Their maintenance plan overhauls every pump every two years. Pump failures have not gone down in five years, and the overhaul budget is €400,000 a year.',
        ask: 'What do you ask the asset manager?',
        model: 'When do the failures happen relative to the last overhaul: early, at random, or near the end of the two years? If they cluster just after an overhaul, we’re introducing faults. If they’re spread evenly, the two-year interval isn’t buying us anything. Can we put the failure dates next to the overhaul dates for the last five years?',
        rubric: [
          'Asks when failures happen relative to the last overhaul',
          'Names the possibility of maintenance-induced failures',
          'Proposes analysing failure history against intervention dates',
        ],
      },
      sayIt: 'Explain to a maintenance manager in 60 seconds why replacing parts on a schedule doesn’t always reduce breakdowns.',
      terms: [
        { term: 'Bathtub curve', def: 'Early failures, then a flat random period, then wear-out; true for only some equipment.' },
        { term: 'Infant mortality', def: 'Failures shortly after installation or overhaul.' },
        { term: 'Random failure', def: 'Failure with about the same chance at any age.' },
        { term: 'Weibull β', def: 'Shape factor: below 1 early failure, about 1 random, above 1 wear-out.' },
      ],
    },
    {
      id: 'eng.maintenance.condition',
      title: 'Condition monitoring',
      pre: [
        {
          q: 'Which method usually detects a developing bearing defect earliest?',
          options: ['Feeling the housing for heat', 'Hearing a noise', 'Vibration analysis', 'Seeing smoke'],
          answer: 'Vibration analysis',
          why: 'Vibration picks up bearing damage months before heat or audible noise.',
        },
      ],
      teach: [
        'The P-F interval is the key idea. P is the point where a developing failure becomes detectable; F is the functional failure. For a bearing, vibration can see damage months before F; heat and noise come only days or hours before. You must check more often than the P-F interval, usually at half of it, or you will miss it.',
        'Vibration: a sensor on the bearing housings. It finds imbalance, misalignment, looseness, bearing damage and gear wear, each at its own frequency. Levels are in mm/s RMS. For a medium-sized motor on a rigid base, ISO 10816-3 puts about 2.8 mm/s as a warning and 4.5 mm/s as a call for action. The trend matters more than one reading.',
        'Thermography: an infrared camera shows hot spots: loose electrical connections, overloaded cables, unbalanced phases, blocked coolers. Electrical cabinets must be scanned under load, at least 40%. A connection more than 15 °C hotter than the same connection on the other phases needs action soon.',
        'Oil analysis: a sample from a gearbox or hydraulic unit shows wear metals (iron, copper), particles, water and viscosity, often before vibration sees a slow gearbox wearing. Ultrasound: listening at 20 to 100 kHz finds compressed-air leaks, under-greased bearings and partial discharge in medium-voltage switchgear. One 3 mm air leak at 7 bar wastes roughly €1,000 to €2,000 of electricity a year.',
      ],
      example: {
        kind: 'worked',
        text: 'Monthly vibration route, cooling-water pump on the bottleneck: January 1.8 mm/s, February 1.9, March 2.6, April 3.4, with a bearing defect frequency showing in the spectrum. The trend rises about 0.8 mm/s per month, so it will pass 4.5 in about six weeks. The planner orders a bearing (€350, one week delivery) and books four hours in the planned stop in mid-May. Compare a breakdown: the pump seizes on a Friday night and the line stands for most of the weekend.',
      },
      said: 'What engineers say: “It went from 1.9 to 3.4 in two months and you can see the outer race frequency. Order the bearing, we swap it in the May stop.”',
      recall: [
        {
          q: 'The P-F interval for a gearbox failure is 8 weeks. Using the usual rule, how often should you inspect, at most every how many weeks?',
          number: 4,
          tolerance: 0.5,
          unit: 'weeks',
          why: 'Check at half the P-F interval, so you have at least one chance to see it and time to act.',
        },
        {
          q: 'Which method finds a loose connection on one phase of a breaker in a cabinet?',
          options: ['Oil analysis', 'Thermography under load', 'Vibration analysis', 'Visual check with the power off'],
          answer: 'Thermography under load',
          why: 'A loose connection heats up under current, which the infrared camera shows.',
        },
        {
          q: 'Which method is the standard way to find compressed-air leaks?',
          options: ['Thermography', 'Oil analysis', 'Vibration analysis', 'Ultrasound'],
          answer: 'Ultrasound',
          why: 'Escaping air makes high-frequency sound that an ultrasound detector picks up, even in a noisy hall.',
        },
        {
          q: 'A pump’s vibration rose from 1.9 to 3.4 mm/s over two months, with bearing frequencies visible. What do you do?',
          options: ['Nothing until it reaches 7 mm/s', 'Plan a bearing replacement in the next planned stop', 'Stop the pump immediately', 'Lower the alarm limit'],
          answer: 'Plan a bearing replacement in the next planned stop',
          why: 'The defect is real and trending, but there is time to plan it, which is the whole point.',
        },
      ],
      situation: {
        scene: 'You’re at a plant after a fire in a low-voltage distribution cabinet. The plant manager says: “We did a thermography scan last year, nothing was found.”',
        ask: 'What do you ask about that scan?',
        model: 'Was the scan done under normal load, or during a quiet period or a stop? A loose connection only heats up when current flows. Were the cabinet doors opened so the camera could see the connections? And who looked at the images and set the action limits?',
        rubric: [
          'Asks whether the scan was done under load',
          'Asks whether the connections were actually visible to the camera',
          'Asks who interpreted the results and with what criteria',
        ],
      },
      sayIt: 'Explain to a technician in 60 seconds what the P-F interval is and why it decides how often you measure.',
      terms: [
        { term: 'P-F interval', def: 'Time between a failure becoming detectable (P) and the actual failure (F).' },
        { term: 'Vibration analysis', def: 'Measuring vibration to find imbalance, misalignment, looseness and bearing or gear damage.' },
        { term: 'Thermography', def: 'Infrared imaging to find hot spots, mostly electrical.' },
        { term: 'Oil analysis', def: 'Lab test of an oil sample for wear metals, particles, water and viscosity.' },
      ],
    },
    {
      id: 'eng.maintenance.tpm',
      title: 'TPM and autonomous maintenance',
      pre: [
        {
          q: 'In TPM, who does the daily cleaning, inspection, lubrication and tightening of a machine?',
          options: ['The operator', 'The maintenance technician', 'An external contractor', 'The team leader'],
          answer: 'The operator',
          why: 'Autonomous maintenance gives basic care to the people who run the machine every day.',
        },
      ],
      teach: [
        'TPM (Total Productive Maintenance) came from Japan in the 1970s (Nakajima, JIPM). The goal: zero breakdowns, zero defects, zero accidents, by making equipment care everyone’s job and not only maintenance’s. Progress is measured with OEE. Most plants use eight pillars, including autonomous maintenance, planned maintenance, focused improvement, quality maintenance and training.',
        'Autonomous maintenance (AM): operators own basic care: clean, inspect, lubricate, tighten (CILT), and spot and tag abnormalities. Cleaning is inspection: on a clean machine you see the oil leak, the loose bolt, the crack. It starts with an initial clean where every abnormality gets a tag.',
        'Planned maintenance: with routine work moved to operators, technicians spend time on skilled work: condition monitoring, root cause of repeat failures, improving MTBF. A typical split: operators do 5 to 10 minutes of checks per shift; technicians fix what they find.',
        'The people side decides it. Operators hear “extra work, not my job”. Technicians fear losing their role or don’t trust operators with their machine. It works when technicians train operators, checks are visual (match marks on bolts, min/max on oil glasses, green zones on gauges), and tags are fixed fast. When tags hang for months, AM dies.',
      ],
      example: {
        kind: 'worked',
        text: 'Pilot on one injection moulding machine. The initial clean takes one shift and the team hangs 37 tags: 12 oil leaks, 9 loose bolts, 6 missing guards, 10 other. Operators fix 21 themselves in the first week; 16 go to maintenance, with a promise to close them within 4 weeks. A daily CILT checklist of 8 points takes 7 minutes at shift start. After three months, breakdowns drop from 9 to 4 a month, and hydraulic oil top-ups fall from 60 litres to 15 litres a month.',
      },
      said: 'What engineers say: “If the operators clean it every day, they see the leak in week one. We find it when the pump runs dry.”',
      recall: [
        {
          q: 'Breakdowns drop from 9 to 4 a month, and each took 2.5 hours on average. How many hours of downtime are saved per month?',
          number: 12.5,
          tolerance: 0.1,
          unit: 'hours',
          why: '5 fewer breakdowns × 2.5 hours = 12.5 hours.',
        },
        {
          q: 'What does CILT stand for?',
          options: ['Check, Inform, Log, Track', 'Clean, Inspect, Lubricate, Tighten', 'Control, Improve, Lead, Teach', 'Clean, Isolate, Lock, Test'],
          answer: 'Clean, Inspect, Lubricate, Tighten',
          why: 'These are the four basic care tasks operators take on in autonomous maintenance.',
        },
        {
          q: 'Why does TPM say “cleaning is inspection”?',
          options: ['Clean machines look better in audits', 'Dirt is the main cause of all failures', 'Cleaning saves maintenance hours', 'On a clean machine you see leaks, cracks and loose parts'],
          answer: 'On a clean machine you see leaks, cracks and loose parts',
          why: 'Cleaning with attention brings abnormalities to light early.',
        },
        {
          q: 'What most often kills autonomous maintenance after a good start?',
          options: ['Tags that stay open for months', 'Too many operators involved', 'Checklists that are too short', 'Using visual controls'],
          answer: 'Tags that stay open for months',
          why: 'Operators stop reporting when nothing happens with what they report.',
        },
      ],
      situation: {
        scene: 'You’re at a client starting TPM. In the kick-off the maintenance team leader says: “Operators can’t touch the machines. They’ll break them, and then it’s our problem again.”',
        ask: 'How do you respond?',
        model: 'That’s a fair worry, so let’s design it with you in charge: you decide which checks operators do, you train them, and anything beyond the checklist stays with your team. What would you want them to spot for you every shift? And can we agree how fast your team closes the tags they hang, because that’s what makes it work?',
        rubric: [
          'Takes the concern seriously instead of overruling it',
          'Gives maintenance ownership of what operators do and of training',
          'Raises the need for fast follow-up on tags',
        ],
      },
      sayIt: 'Explain to an operator in 60 seconds what autonomous maintenance means for their daily work and what they get out of it.',
      terms: [
        { term: 'TPM', def: 'Total Productive Maintenance: everyone owns equipment care, aiming for zero breakdowns.' },
        { term: 'Autonomous maintenance', def: 'Operators doing basic care and spotting abnormalities.' },
        { term: 'CILT', def: 'Clean, Inspect, Lubricate, Tighten.' },
        { term: 'Tag', def: 'A label hung on an abnormality so it gets fixed and tracked.' },
      ],
    },
    {
      id: 'eng.maintenance.cmms',
      title: 'CMMS, work orders and backlog',
      pre: [
        {
          q: 'A plant has 8 technicians working 40-hour weeks and a maintenance backlog of 3,200 hours. Is that healthy?',
          options: ['Yes, about 2 weeks of work', 'Yes, about 4 weeks of work', 'Can’t say without the OEE', 'No, about 10 weeks of work'],
          answer: 'No, about 10 weeks of work',
          why: '3,200 / (8 × 40) = 10 weeks. Two to four weeks is the usual healthy range.',
        },
      ],
      teach: [
        'A CMMS (computerised maintenance management system) is the maintenance database: SAP PM, Maximo, and in the Netherlands often Ultimo. It holds the asset register (every machine in a hierarchy), work orders, preventive plans, spare parts and history. The data is only as good as what technicians type in.',
        'Work order flow: notification, approved, planned (tasks, parts, hours), scheduled (date), executed, completed with feedback (what was found, what was done, time spent), closed. Breakdown orders are often created after the fact. Feedback like “fixed” or “repaired” makes root cause analysis impossible.',
        'Criticality ranking scores each asset on safety, quality, output impact (is it the bottleneck?), cost and redundancy, usually into A, B and C. A gets condition monitoring and critical spares; C runs to failure. Stock a €12,000 gearbox with 14 weeks delivery if it sits on the bottleneck. Many stores hold millions in parts, with a third not moved in years.',
        'Backlog: approved work not yet done, in hours. Divide by weekly crew hours to get weeks. Two to four weeks is healthy. Under two: you may not be finding the work. Over six: work is piling up and preventive jobs are slipping. Pair it with PM compliance, the share of preventive jobs done on time; aim for 90% or more.',
      ],
      example: {
        kind: 'worked',
        text: 'CMMS report for a bakery, last quarter. Six technicians × 40 hours = 240 hours a week. Backlog 1,150 hours, so 1,150 / 240 = 4.8 weeks. PM compliance 68%. Breakdown work 42% of all hours. One asset, the oven conveyor, takes 31% of breakdown hours. Reading: the team is firefighting, PMs slip because breakdowns eat the hours, and the backlog grows. Two actions: a root cause team on the oven conveyor, and four protected PM hours per technician per week.',
      },
      said: 'What engineers say: “Our backlog is eight weeks and PM compliance is sixty percent. We’re not maintaining, we’re just repairing.”',
      recall: [
        {
          q: 'The backlog is 960 hours. The crew is 6 technicians at 40 hours a week. How many weeks of backlog is that?',
          number: 4,
          tolerance: 0.1,
          unit: 'weeks',
          why: '960 / (6 × 40) = 4 weeks, at the top of the healthy range.',
        },
        {
          q: '120 preventive jobs were planned this month, and 84 were done on time. What is the PM compliance, in %?',
          number: 70,
          tolerance: 0.5,
          unit: '%',
          why: '84 / 120 = 70%, well under a target of 90%.',
        },
        {
          q: 'Which asset most likely gets criticality A?',
          options: ['A canteen coffee machine', 'A conveyor with two spares in stock', 'The bottleneck press with a 14-week spare delivery', 'A spare forklift'],
          answer: 'The bottleneck press with a 14-week spare delivery',
          why: 'Its failure stops output for a long time; high impact and no redundancy.',
        },
        {
          q: 'What makes the breakdown history in a CMMS nearly useless?',
          options: ['Feedback like “fixed” with no cause or action', 'Too many work orders', 'Using asset hierarchies', 'Scheduling orders by date'],
          answer: 'Feedback like “fixed” with no cause or action',
          why: 'Without what was found and done, you can’t find repeat failures or their causes.',
        },
      ],
      situation: {
        scene: 'You need downtime data for a project at a metal plant. In the CMMS, 70% of last year’s breakdown orders say only “repaired” or “OK”.',
        ask: 'What do you do?',
        model: 'I won’t try to analyse the whole year. I’ll sit with the planner, take the three assets with the most breakdown hours, and walk through those orders with the technicians who did them, because they usually remember. Then I’d propose a simple set of failure codes: what failed, why, what was done, so next quarter the data works for us.',
        rubric: [
          'Narrows the scope to the few assets that matter most',
          'Uses technicians’ knowledge to fill the gaps',
          'Proposes a simple fix for future data quality',
        ],
      },
      sayIt: 'Explain to a plant manager in 60 seconds what the maintenance backlog says and when it should worry him.',
      terms: [
        { term: 'CMMS', def: 'Maintenance database with assets, work orders, PM plans, spares and history.' },
        { term: 'Work order', def: 'A job with tasks, parts, hours and feedback, tracked from request to close.' },
        { term: 'Backlog', def: 'Approved maintenance work not yet done, often shown in weeks of crew time.' },
        { term: 'Criticality', def: 'Ranking (A, B, C) of how much an asset’s failure hurts.' },
      ],
    },
  ],
};
