// eng.transformers (EN): Transformers and cables: how transformers work and age, MS and LS cables, cable faults, the connection process, standardisation.
export default {
  lessons: [
    {
      id: 'eng.transformers.principle',
      title: 'How a transformer works',
      pre: [
        {
          q: 'A distribution transformer of 630 kVA steps 10 kV down to 400 V. Roughly what current flows on the 400 V side at full load?',
          options: ['About 63 A', 'About 36 A', 'About 1,575 A', 'About 900 A'],
          answer: 'About 900 A',
          why: '630,000 / (1.73 × 400) ≈ 909 A. On the 10 kV side it is only about 36 A.',
        },
      ],
      teach: [
        'A transformer has two copper windings around an iron core. AC in the first winding creates a changing magnetic field in the core, which induces a voltage in the second. The voltage ratio equals the turns ratio: a 10 kV/400 V transformer has 25 times more turns on the MS side. Power stays (almost) the same, so the current goes up by the same factor on the LS side.',
        'Transformers are rated in kVA (or MVA for large ones). A netstation typically has 250, 400 or 630 kVA; a substation transformer from 150 to 10 or 20 kV often tens of MVA. Current = power / (1.73 × voltage) for three-phase: 630 kVA at 400 V is about 909 A, at 10 kV about 36 A.',
        'Losses are small but constant. No-load losses in the iron core are there as soon as the transformer is energised, day and night. Load losses in the copper grow with the load squared: at half load, a quarter. Efficiency is above 98%, but across thousands of netstations the losses add up, which is why new transformers must meet strict EU loss limits.',
        'Most distribution transformers are oil-filled and cooled ONAN: oil natural, air natural. Warm oil rises, cools in the fins and sinks again, without pumps or fans. A tap changer adjusts the ratio in small steps, usually 2.5%. On netstation transformers it can only be set with the transformer switched off; substation transformers have an on-load tap changer that regulates the MS voltage automatically.',
      ],
      example: {
        kind: 'worked',
        text: 'A 400 kVA netstation in a street full of solar panels. On sunny days, the voltage at the end of the LS cables reaches 252 V and inverters start dropping out. The transformer’s tap changer is in the middle position. The engineer moves it one step, 2.5%: the LS voltage drops by about 6 V, to around 246 V at the end of the cables. To do this, the transformer must be switched off for a few minutes, so all customers on the station get a planned short outage and a letter in advance.',
      },
      said: 'What engineers say: “Put that trafo one tap lower. With all those panels it’s running high in the summer.”',
      recall: [
        {
          q: 'A 400 kVA transformer at 400 V. What is the full-load current on the LS side, in amperes?',
          number: 577,
          tolerance: 10,
          unit: 'A',
          why: '400,000 / (1.73 × 400) ≈ 577 A.',
        },
        {
          q: 'A transformer steps 20 kV down to 400 V. What is the turns ratio?',
          number: 50,
          tolerance: 0.5,
          unit: '',
          why: '20,000 / 400 = 50: the MS winding has 50 times as many turns.',
        },
        {
          q: 'What does ONAN mean?',
          options: ['Oil pumped, air blown by fans', 'Oil natural, air natural: cooling without pumps or fans', 'Only no-load, air needed', 'A type of tap changer'],
          answer: 'Oil natural, air natural: cooling without pumps or fans',
          why: 'Warm oil rises and cools in the fins by itself.',
        },
        {
          q: 'A transformer runs at half load. How do its load losses compare with full load?',
          options: ['The same', 'Half', 'A quarter', 'Double'],
          answer: 'A quarter',
          why: 'Load losses scale with load squared: 0.5² = 0.25.',
        },
      ],
      situation: {
        scene: 'You’re at a regional grid operator. A team leader complains that changing the tap position of netstation transformers “takes a whole planning process” for what is a two-minute job.',
        ask: 'What do you ask to understand why?',
        model: 'Does the transformer have to be switched off to change the tap? If so, every customer on the station gets a short outage, which needs announcing and maybe switching to back-feed part of the load. Then the real question is how we bundle these jobs, for example with other planned work on the same station, rather than whether the planning is too slow.',
        rubric: [
          'Asks whether the tap change requires switching off',
          'Connects it to customer outages and announcements',
          'Proposes bundling with other planned work',
        ],
      },
      sayIt: 'Explain to a new project member in 60 seconds what a transformer does and why its rating is in kVA.',
      terms: [
        { term: 'Turns ratio', def: 'Ratio of windings, equal to the voltage ratio.' },
        { term: 'ONAN', def: 'Oil natural, air natural: passive cooling of an oil-filled transformer.' },
        { term: 'Tap changer', def: 'Switch that adjusts the turns ratio in small steps to correct voltage.' },
        { term: 'No-load losses', def: 'Iron losses that occur whenever the transformer is energised.' },
      ],
    },
    {
      id: 'eng.transformers.ageing',
      title: 'Loading, temperature and ageing',
      pre: [
        {
          q: 'What mainly determines how fast a transformer ages?',
          options: ['The temperature of its paper insulation', 'Its number of switching actions', 'The calendar age alone', 'The colour of the oil'],
          answer: 'The temperature of its paper insulation',
          why: 'Heat breaks down the cellulose paper around the windings; hotter means faster ageing.',
        },
      ],
      teach: [
        'Inside a transformer, the windings are insulated with paper soaked in oil. Heat slowly breaks down that paper. The rule of thumb: every 6 °C or so above the design hot-spot temperature doubles the ageing rate. A transformer that runs too hot for years can lose decades of life; one that runs cool can last 40 to 60 years.',
        'Short overloads are usually fine. A transformer heats up slowly, over hours, so a one-hour evening peak of 120% does little harm, while weeks at 120% do a lot. That is why engineers look at the load profile, not only the peak value. With heat pumps, cars and solar, many netstations now run hotter, for longer, than they were designed for.',
        'For large substation transformers, the oil is a health check. Dissolved gas analysis (DGA) measures gases in an oil sample. Hydrogen points to partial discharges, acetylene to arcing, ethylene to overheating, and carbon monoxide to paper breaking down. The trend over time matters more than one value. Large transformers often have online DGA monitors.',
        'Netstation transformers are different: there are tens of thousands of them, mostly sealed, so they are rarely sampled. For those, operators use age, load measurements and failure data to decide what to replace. Smart meters and netstation monitoring now give much better load data than a few years ago.',
      ],
      example: {
        kind: 'worked',
        text: 'A 150/10 kV transformer of 40 MVA shows a rising level of acetylene in its quarterly oil samples: from 0 to 3 to 9 ppm in a year. Acetylene means arcing inside. The asset manager orders a monthly sample, an online monitor and an inspection of the on-load tap changer, a common source. The next outage window is planned within six weeks. Without DGA, the first sign might have been a failure taking out the whole substation.',
      },
      said: 'What engineers say: “The DGA shows acetylene trending up. That’s arcing; we need to get inside before it lets go.”',
      recall: [
        {
          q: 'A transformer runs 12 °C above its design hot-spot temperature. Using the 6 °C doubling rule, how many times faster does it age?',
          number: 4,
          tolerance: 0.2,
          unit: '×',
          why: '12 / 6 = 2 doublings: 2 × 2 = 4 times faster.',
        },
        {
          q: 'Which gas in DGA points to arcing?',
          options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Acetylene'],
          answer: 'Acetylene',
          why: 'Acetylene forms at the very high temperatures of an arc.',
        },
        {
          q: 'Why is a one-hour peak of 120% usually less harmful than weeks at 120%?',
          options: ['The oil cools faster at peaks', 'A transformer heats up slowly, over hours', 'Peaks happen only at night', 'The tap changer absorbs the peak'],
          answer: 'A transformer heats up slowly, over hours',
          why: 'Its thermal inertia means short peaks do not reach full temperature.',
        },
        {
          q: 'Why are netstation transformers rarely oil-sampled?',
          options: ['Their oil never ages', 'It is forbidden', 'There are tens of thousands, mostly sealed', 'They have no oil'],
          answer: 'There are tens of thousands, mostly sealed',
          why: 'Operators use age, load and failure data instead.',
        },
      ],
      situation: {
        scene: 'You’re at a regional grid operator in a meeting about replacing netstation transformers. The plan is to replace everything older than 45 years. An engineer says: “Some of the 30-year-old ones are in worse shape.”',
        ask: 'What do you ask?',
        model: 'What data do we have per transformer besides age: load measurements, how often they ran above rating, failure history? Ageing depends on temperature, so a heavily loaded 30-year-old unit can be closer to the end than a lightly loaded 45-year-old. Can we rank the list on load and condition, not just on age?',
        rubric: [
          'Questions age as the only criterion',
          'Links ageing to load and temperature',
          'Proposes ranking by load and condition data',
        ],
      },
      sayIt: 'Explain to an asset manager from another sector in 60 seconds what makes a transformer age and how you can see it.',
      terms: [
        { term: 'Hot-spot temperature', def: 'The hottest point in the winding, which sets the ageing rate.' },
        { term: 'DGA', def: 'Dissolved gas analysis: gases in the oil that reveal internal faults.' },
        { term: 'Thermal inertia', def: 'A transformer heats up and cools down slowly, over hours.' },
      ],
    },
    {
      id: 'eng.transformers.cables',
      title: 'MS and LS cables',
      pre: [
        {
          q: 'In an MS cable network, which component usually causes the most internal failures?',
          options: ['The cable itself in the middle of a length', 'The copper conductor', 'The joints connecting cable lengths', 'The cable markers in the street'],
          answer: 'The joints connecting cable lengths',
          why: 'Joints are made by hand in the field; workmanship, moisture and ground movement make them the weak spot.',
        },
      ],
      teach: [
        'Two MS cable families dominate in the Netherlands. The older one is paper-insulated, oil-impregnated cable with a lead sheath and steel armour, called GPLK. Much of it has been in the ground for 40 to 60 years and still works well. Since the 1980s and 1990s, new cables are mostly XLPE: cross-linked polyethylene, lighter and easier to work with.',
        'LS cables are similar: old networks have paper-insulated cables, newer ones plastic insulation with aluminium conductors. Cables come on drums of a few hundred metres, so a longer route needs joints (moffen) to connect the lengths. At each end, a termination (eindsluiting) connects the cable to the switchgear or transformer.',
        'Joints are the weak spot. They are made by hand, in a trench, often in the rain. Poor workmanship, moisture, and ground settlement that pulls on the cable all cause failures. Transition joints between old paper cable and new XLPE are especially sensitive. A good joint takes hours of careful work by a trained technician.',
        'Other causes: digging damage is the most common external cause. Overloading heats a cable and speeds up ageing. Early XLPE cables can suffer from water treeing, tiny channels that grow in the insulation where moisture gets in. Knowing the cable type and age of a route tells an engineer a lot about its risks.',
      ],
      example: {
        kind: 'worked',
        text: 'A new 10 kV connection needs a 2.4 km cable route. The cable comes on drums of 600 m, so it needs 4 lengths and 3 joints, plus a termination at each end. At the old end, the new XLPE cable meets an existing GPLK cable, so one of those joints is a transition joint. The work preparer plans a jointer with a valid certificate for transition joints, and a dry, covered trench, because a moist transition joint is a classic failure a few years later.',
      },
      said: 'What engineers say: “It’s GPLK to XLPE there, so you need a transition joint. Make sure someone qualified does it.”',
      recall: [
        {
          q: 'A cable route is 3 km and the cable comes on drums of 500 m. How many joints are needed between the lengths?',
          number: 5,
          tolerance: 0.5,
          unit: 'joints',
          why: '3,000 / 500 = 6 lengths, so 5 joints between them.',
        },
        {
          q: 'What is GPLK?',
          options: ['Paper-insulated, lead-sheathed MS cable', 'A modern plastic cable', 'A type of joint', 'A cable fault locator'],
          answer: 'Paper-insulated, lead-sheathed MS cable',
          why: 'The older Dutch cable type: paper insulation, lead sheath, steel armour.',
        },
        {
          q: 'What is the most common external cause of cable damage?',
          options: ['Lightning', 'Frost', 'Rodents', 'Digging'],
          answer: 'Digging',
          why: 'Excavators hitting cables cause many faults, despite mandatory cable checks.',
        },
        {
          q: 'Why are transition joints sensitive?',
          options: ['They carry more current', 'They connect two different cable types, which is harder to do well', 'They are only used in LS', 'They are made in a factory'],
          answer: 'They connect two different cable types, which is harder to do well',
          why: 'Joining paper-insulated and XLPE cable requires extra skill and care.',
        },
      ],
      situation: {
        scene: 'You’re at a regional grid operator. Failure data show that MS joints made in the last three years fail more often than older ones. A manager wants to switch joint supplier.',
        ask: 'What do you ask before changing supplier?',
        model: 'Do the failures cluster by supplier, or by crew, type of joint and conditions? If many new jointers joined in the same period, or work is done under more time pressure, a new supplier will not help. Can we break down the failed joints by joint type, team, weather and age, and look at a few of the failed joints themselves?',
        rubric: [
          'Asks whether the cause is product, workmanship or conditions',
          'Considers changes in crews and time pressure',
          'Proposes analysing the failure data and the failed joints',
        ],
      },
      sayIt: 'Explain to a project manager in 60 seconds why joints are the weak spot in a cable network.',
      terms: [
        { term: 'GPLK', def: 'Older paper-insulated MS cable with lead sheath and steel armour.' },
        { term: 'XLPE', def: 'Cross-linked polyethylene, the modern plastic cable insulation.' },
        { term: 'Mof (joint)', def: 'Connection between two cable lengths, made by hand in the field.' },
        { term: 'Eindsluiting', def: 'Termination connecting a cable to switchgear or a transformer.' },
      ],
    },
    {
      id: 'eng.transformers.faults',
      title: 'Cable faults and repair',
      pre: [
        {
          q: 'An MS cable fails and 2,000 customers lose power. What usually gets most of them back first?',
          options: ['Repairing the cable', 'Switching the ring so they are fed from the other side', 'A mobile generator', 'Waiting for the fault to clear itself'],
          answer: 'Switching the ring so they are fed from the other side',
          why: 'Switching takes minutes to an hour or two; repairing the cable takes much longer.',
        },
      ],
      teach: [
        'When an MS cable fails, the protection at the substation trips the feeder and everyone on that part of the ring loses power. The control room sees it immediately. Technicians drive to netstations, use fault indicators to find the faulty section, open the switches on both sides and close the normally open point. Most customers are back within one to two hours, faster where switching is remote.',
        'Then the fault must be found. First pre-location: a time-domain reflectometer sends a pulse into the cable and measures how long the echo takes to come back from the fault. Then pinpointing: a surge generator sends high-voltage pulses that make the fault flash over, and a technician listens along the route for the bang to find the exact spot.',
        'Repair: dig a hole, cut out the damaged piece, put in a new piece of cable with two joints, test it and switch back. That is often a full working day or more, depending on the location, permits and depth. Meanwhile the ring runs without its backup, so a second fault would cause a longer outage.',
        'LS faults are different: often a fuse in the netstation blows and a technician replaces it, or an LS cable burns through. Digging damage is a big part of all faults. Before digging, a KLIC notification is mandatory to get the maps of cables and pipes; still, damage happens daily.',
      ],
      example: {
        kind: 'worked',
        text: 'At 14:10, a 10 kV feeder trips: 1,800 customers off. At 14:40, technicians reach netstations 4 and 5; fault indicators show fault current passed station 4 but not station 5. They open the switches between 4 and 5 and close the open point: everyone is back by 15:30. The reflectometer shows the fault 320 m from station 4. The surge generator pinpoints it under a newly paved driveway: digging damage from last week. A crew repairs it the next day with two joints; the ring is complete again by 17:00.',
      },
      said: 'What engineers say: “Customers are back on, the faulty section is switched out. We’ll thump it tomorrow and get it fixed.”',
      recall: [
        {
          q: 'A reflectometer pulse travels at about 160 m per microsecond. The echo returns after 10 microseconds. How far away is the fault, in metres?',
          number: 800,
          tolerance: 20,
          unit: 'm',
          why: 'The pulse goes there and back: 160 × 10 / 2 = 800 m.',
        },
        {
          q: 'What does a surge generator do in fault location?',
          options: ['It restores power to customers', 'It measures the cable length', 'It makes the fault flash over so it can be heard at the surface', 'It dries the cable'],
          answer: 'It makes the fault flash over so it can be heard at the surface',
          why: 'High-voltage pulses create a bang at the fault that can be pinpointed.',
        },
        {
          q: 'Why is the period after switching but before repair a risk?',
          options: ['The ring runs without backup, so a second fault causes a longer outage', 'Customers get a higher voltage', 'The cable heats up', 'The meters stop working'],
          answer: 'The ring runs without backup, so a second fault causes a longer outage',
          why: 'With the open point closed, there is no second feed left for that ring.',
        },
        {
          q: 'What is mandatory before digging in the Netherlands?',
          options: ['A permit from TenneT', 'A call to the energy supplier', 'Turning off the cables in the area', 'A KLIC notification to get cable and pipe maps'],
          answer: 'A KLIC notification to get cable and pipe maps',
          why: 'KLIC gives the excavator the maps of underground cables and pipes.',
        },
      ],
      situation: {
        scene: 'You’re at a regional grid operator in a project on outage duration. In one region, restoring customers takes on average 95 minutes; in another 40 minutes. The slow region’s manager says: “Our area is bigger.”',
        ask: 'What do you ask?',
        model: 'Let’s split the 95 minutes into steps: time to alarm, to dispatch, travel, finding the faulty section, switching. Where does the gap with the other region sit? If travel is the big part, remote switching or fault indicators in key netstations may help more than more crews. If finding the section is slow, it may be missing fault indicators.',
        rubric: [
          'Breaks restoration time into steps',
          'Compares the steps between regions',
          'Links the biggest step to a specific fix such as remote switching or fault indicators',
        ],
      },
      sayIt: 'Explain to a customer service manager in 60 seconds what happens between an MS cable fault and the cable being repaired.',
      terms: [
        { term: 'Reflectometer', def: 'Instrument that sends a pulse into a cable and times the echo from the fault.' },
        { term: 'Surge generator', def: 'Device that makes the fault flash over so it can be pinpointed.' },
        { term: 'KLIC-melding', def: 'Mandatory request for cable and pipe maps before digging.' },
      ],
    },
    {
      id: 'eng.transformers.connections',
      title: 'What a new connection takes',
      pre: [
        {
          q: 'For a typical new business connection, which phase most often takes the longest?',
          options: ['The digging and connecting', 'Handling the request', 'Work preparation: permits, materials and planning', 'Installing the meter'],
          answer: 'Work preparation: permits, materials and planning',
          why: 'The work in the street often takes days; permits, coordination and materials can take months.',
        },
      ],
      teach: [
        'A connection goes through five steps. Request: the customer applies, for small connections usually online. Capacity check: does the grid have room, and in congested areas, does the request wait? Design: the route, the cable, and whether a new netstation or MS connection is needed. Work preparation: permits, digging maps, materials, crew planning. Execution: digging, laying cable, joints, connecting, meter, and putting it into service.',
        'Size decides the route. Small connections up to 3 × 80 A connect to the LS cable in the street. Larger ones get a heavy LS cable straight from the netstation. Above roughly a few hundred kVA, the customer usually gets an MS connection with its own station or MS-ruimte, which takes much more design and coordination.',
        'The law sets a standard term of 18 weeks for most connections up to 10 MVA, a term operators now often miss. The work itself is short, often one or two days on site. The rest is waiting: for a capacity check, a digging permit from the municipality, materials, or a free crew. Rework when the design does not match the street makes it longer.',
        'Work preparation (werkvoorbereiding) is where much of the lead time sits. One missing permit or a transformer that is not in stock stops the job. That makes it a natural target for improvement: standard packages, earlier permit requests, and checking the site before the crew arrives.',
      ],
      example: {
        kind: 'worked',
        text: 'A supermarket requests a connection of 3 × 250 A. Request handling: 2 weeks. Capacity check: 1 week, there is room in the netstation. Design: 3 weeks, a new LS cable of 180 m from the netstation. Work preparation: 8 weeks, mainly the municipal permit to dig under a cycle path. Execution: planned 4 weeks out, 2 days on site. Total: 2 + 1 + 3 + 8 + 4 = 18 weeks, for 2 days of work in the street. Requesting the permit during design would have saved 3 to 4 weeks.',
      },
      said: 'What engineers say: “The crew is there two days. It’s the fourteen weeks before that we need to talk about.”',
      recall: [
        {
          q: 'Request 2 weeks, design 3 weeks, work preparation 8 weeks, waiting for a crew 4 weeks. What is the total lead time, in weeks?',
          number: 17,
          tolerance: 0.5,
          unit: 'weeks',
          why: '2 + 3 + 8 + 4 = 17 weeks.',
        },
        {
          q: 'How does a small connection up to 3 × 80 A usually connect?',
          options: ['Directly to the MS ring', 'To the LS cable in the street', 'To its own transformer', 'To the TenneT grid'],
          answer: 'To the LS cable in the street',
          why: 'Small connections hang on the local LS network.',
        },
        {
          q: 'What does a large customer of several hundred kVA or more usually get?',
          options: ['A 3 × 25 A connection', 'Two house connections', 'A connection to the 150 kV grid', 'An MS connection with its own station or MS-ruimte'],
          answer: 'An MS connection with its own station or MS-ruimte',
          why: 'Above a few hundred kVA, LS cables become impractical.',
        },
        {
          q: 'Which measure most often shortens connection lead times?',
          options: ['Requesting permits earlier, in parallel with design', 'Digging faster', 'Using thicker cable', 'Asking the customer to wait'],
          answer: 'Requesting permits earlier, in parallel with design',
          why: 'Waiting for permits is often the longest step; doing it in parallel removes weeks.',
        },
      ],
      situation: {
        scene: 'You’re at a regional grid operator. A manager wants to shorten connection lead times and proposes hiring 20 extra field technicians.',
        ask: 'What do you ask?',
        model: 'Where does the lead time actually sit? If a connection takes 20 weeks and the crew is on site for two days, more technicians shorten only the waiting for a crew. Can we take 30 recent jobs and map the weeks per step: request, capacity check, design, work preparation, execution? Then we know whether the bottleneck is in the field or in the office.',
        rubric: [
          'Compares on-site time with total lead time',
          'Proposes mapping weeks per step on real jobs',
          'Checks whether the bottleneck is field capacity or preparation',
        ],
      },
      sayIt: 'Explain to a business customer in 60 seconds why their connection takes months while the work takes two days.',
      terms: [
        { term: 'Werkvoorbereiding', def: 'Work preparation: permits, maps, materials and planning before execution.' },
        { term: 'Aansluittermijn', def: 'The time a grid operator has to realise a connection; standard 18 weeks up to 10 MVA.' },
        { term: 'Kleinverbruik', def: 'Small connections up to 3 × 80 A.' },
      ],
    },
    {
      id: 'eng.transformers.standard',
      title: 'Standardisation',
      pre: [
        {
          q: 'A grid operator switches from custom-designed netstations to a few standard types. What is usually the biggest gain?',
          options: ['Faster design, purchasing and installation at large volumes', 'Each station is better tuned to its location', 'Fewer customers need a connection', 'Transformers last longer'],
          answer: 'Faster design, purchasing and installation at large volumes',
          why: 'Standard designs remove design hours, allow bulk orders and make the work routine.',
        },
      ],
      teach: [
        'With more work than people, grid operators standardise. A standard netstation is a prefab building or kiosk with a fixed MS switchgear, transformer sizes such as 400 or 630 kVA, and a standard LS rack. Instead of designing each station, the designer picks a type from a catalogue.',
        'Connections are standardised too: a fixed set of sizes for small connections (3 × 25 A, 3 × 35 A up to 3 × 80 A), and standard designs for MS customer connections. The more jobs follow a standard, the less engineering each one needs and the fewer surprises there are on site.',
        'Benefits add up across the chain: fewer design hours, larger and more predictable orders with suppliers, stock that matches the work, shorter training for technicians, and fewer errors because everyone knows the standard. Operators also align specifications with each other, so suppliers can produce in series.',
        'The cost: a standard is sometimes larger or more expensive than a custom design for one location. That is usually worth it across hundreds of jobs. The hard part is discipline: every exception (“this case is special”) brings back design hours and stock problems. A good standard has a clear process for exceptions.',
      ],
      example: {
        kind: 'worked',
        text: 'An operator builds 300 new netstations a year. A custom design takes about 40 engineering hours; with a standard type it takes about 8 hours to choose and adapt. Saving: 300 × 32 = 9,600 hours a year, about six full-time designers. Standard transformers ordered in yearly volumes also arrive faster. The trade-off: in some places a 630 kVA standard station is placed where 400 kVA would have done, which also leaves room for future heat pumps and cars.',
      },
      said: 'What engineers say: “Just put a standard 630 in. It’s faster to build, and in five years you’ll need it anyway.”',
      recall: [
        {
          q: 'An operator designs 250 stations a year. A standard saves 30 design hours per station. How many hours a year are saved?',
          number: 7500,
          tolerance: 10,
          unit: 'h',
          why: '250 × 30 = 7,500 hours.',
        },
        {
          q: 'What is the main downside of standard stations?',
          options: ['They cannot be connected to MS', 'In some places they are larger or more expensive than needed', 'They need more design hours', 'They are not allowed by the ACM'],
          answer: 'In some places they are larger or more expensive than needed',
          why: 'A standard fits most cases well, but not every case perfectly.',
        },
        {
          q: 'Why do grid operators align specifications with each other?',
          options: ['The law requires one supplier', 'It lowers tariffs directly', 'So suppliers can produce in series and deliver faster', 'To share technicians'],
          answer: 'So suppliers can produce in series and deliver faster',
          why: 'Shared specifications give suppliers larger, predictable volumes.',
        },
        {
          q: 'What most often undermines a standard?',
          options: ['Too few types', 'Suppliers', 'The weather', 'Too many exceptions without a clear process'],
          answer: 'Too many exceptions without a clear process',
          why: 'Each exception brings back custom design and stock problems.',
        },
      ],
      situation: {
        scene: 'You’re at a regional grid operator in a project on standardising MS customer connections. Designers say: “Every customer is different, a standard won’t work.”',
        ask: 'How do you respond?',
        model: 'Let’s look at the last 50 MS connections: how many were really different, and how many were variants of three or four types? If 80% fit a few standards, we design those once and spend the designers’ time on the 20% that are truly special. Can we set up a simple exception process, so “this one is different” is a choice with a reason?',
        rubric: [
          'Tests the claim with data on recent jobs',
          'Focuses the standard on the majority of cases',
          'Proposes a clear exception process',
        ],
      },
      sayIt: 'Explain to a designer in 60 seconds why standardising saves time even if each standard is not perfect for every case.',
      terms: [
        { term: 'Standard netstation', def: 'A prefab netstation type with fixed switchgear, transformer size and LS rack.' },
        { term: 'Exception process', def: 'A defined way to approve and record deviations from the standard.' },
        { term: 'Series production', def: 'Making the same product in volume, which shortens supplier lead times.' },
      ],
    },
  ],
};
