// eng.gridbasics (EN): The electricity grid: basics, voltage levels, the path to the socket, load, congestion, what a DSO does.
export default {
  lessons: [
    {
      id: 'eng.gridbasics.basics',
      title: 'Volts, amps, watts and kWh',
      pre: [
        {
          q: 'A typical Dutch household uses about 2,700 kWh of electricity a year. What is its average power over the year?',
          options: ['About 3 kW', 'About 0.3 kW', 'About 30 kW', 'About 2.7 kW'],
          answer: 'About 0.3 kW',
          why: '2,700 kWh / 8,760 hours ≈ 0.31 kW. The peaks are much higher, which is what the grid must handle.',
        },
      ],
      teach: [
        'Voltage (V, volt) is the push, current (A, ampere) is the flow, and power (W, watt) is how fast energy is used: power = voltage × current. A 2,000 W kettle on 230 V draws about 8.7 A. Energy is power × time, in kilowatt-hours: that kettle running for 3 minutes uses 2 kW × 0.05 h = 0.1 kWh. You pay for kWh; the grid is built for kW.',
        'The grid uses alternating current (AC): the voltage swings back and forth 50 times a second (50 Hz) in Europe. AC is used because transformers can easily raise and lower AC voltage, which is the key to moving power over long distances with low losses.',
        'Most of the grid is three-phase: three wires each carrying AC, shifted a third of a cycle from each other, plus a neutral. In a Dutch home, the voltage between one phase and neutral is 230 V; between two phases it is 400 V. Three phases deliver smooth power and use the copper efficiently, which is why heavy loads like heat pumps and car chargers often use all three.',
        'A common Dutch house connection is 3 × 25 A: three phases, 25 A each, about 3 × 230 × 25 ≈ 17 kVA maximum (kVA, kilovolt-ampere, is the grid’s unit for what a cable or fuse must carry; for a home it is close to kW). Older homes may have 1 × 35 A. That maximum is what the main fuse allows, not what the house normally uses.',
      ],
      example: {
        kind: 'worked',
        text: 'A family in Den Bosch uses 2,700 kWh a year: on average 2,700 / 8,760 ≈ 0.31 kW. But at 18:00 the oven (3 kW), the kettle (2 kW) and the dishwasher heating up (2 kW) run together: 7 kW. Add an electric car charging at 11 kW and the house draws 18 kW, above the 17 kVA its 3 × 25 A connection allows, and close to blowing a main fuse. The energy use over the year is modest; the peak is what the cables and fuses must carry.',
      },
      said: 'What engineers say: “Don’t look at the kWh, look at the peak. The cable doesn’t care about the annual total.”',
      recall: [
        {
          q: 'A heat pump draws 3 kW and runs 8 hours on a cold day. How much energy does it use, in kWh?',
          number: 24,
          tolerance: 0.5,
          unit: 'kWh',
          why: 'Energy = power × time = 3 kW × 8 h = 24 kWh.',
        },
        {
          q: 'A house has a 3 × 25 A connection at 230 V per phase. What is its maximum capacity, in kVA?',
          number: 17.3,
          tolerance: 0.5,
          unit: 'kVA',
          why: '3 × 230 V × 25 A = 17,250 VA ≈ 17.3 kVA.',
        },
        {
          q: 'What is the voltage between two phases in a Dutch home?',
          options: ['230 V', '110 V', '50 V', '400 V'],
          answer: '400 V',
          why: 'Phase to neutral is 230 V; phase to phase is about 400 V.',
        },
        {
          q: 'Why does the grid use alternating current?',
          options: ['Transformers can easily change AC voltage, so power can be moved with low losses', 'AC is safer to touch', 'AC can be stored in batteries', 'Appliances only work on AC'],
          answer: 'Transformers can easily change AC voltage, so power can be moved with low losses',
          why: 'Changing voltage with transformers is the basis of the whole grid structure.',
        },
      ],
      situation: {
        scene: 'You’re in a kick-off at a regional grid operator. A planner says: “This neighbourhood only uses 3 GWh a year, so there is plenty of room.” A grid engineer frowns.',
        ask: 'What do you ask to understand the engineer’s concern?',
        model: 'Is the limit the energy over the year or the peak at certain moments? If the cables and transformers are sized for kW, 3 GWh says little: what matters is the highest load, for example on a cold winter evening. Do we have peak measurements for this area?',
        rubric: [
          'Separates energy (kWh) from power (kW)',
          'Asks about the peak moment rather than the annual total',
          'Asks for peak measurement data',
        ],
      },
      sayIt: 'Explain to a friend in 60 seconds the difference between kW and kWh, and why the grid cares about kW.',
      terms: [
        { term: 'kW', def: 'Power: how fast energy is used or delivered at one moment.' },
        { term: 'kWh', def: 'Energy: power × time; what you pay for.' },
        { term: 'Three-phase', def: 'Three AC wires shifted in time, plus neutral; 230 V phase to neutral, 400 V phase to phase.' },
      ],
    },
    {
      id: 'eng.gridbasics.levels',
      figure: 'eng.gridbasics.levels',
      title: 'Voltage levels and who runs them',
      pre: [
        {
          q: 'Who operates the 150 kV grid in the Netherlands?',
          options: ['Enexis, Liander and Stedin', 'The energy suppliers', 'TenneT', 'The municipalities'],
          answer: 'TenneT',
          why: 'TenneT runs all grids of 110 kV and higher; regional operators run the lower voltages.',
        },
      ],
      teach: [
        'Why high voltage: power = voltage × current, and losses in a cable grow with the current squared. Raise the voltage 10 times and the current for the same power drops 10 times, so the losses drop 100 times. That is why power travels long distances at very high voltage and is stepped down close to the user.',
        'The Dutch levels: extra-high voltage (EHS) of 380 and 220 kV and high voltage (HS) of 150 and 110 kV, all run by TenneT, the national transmission system operator. Below that, regional grid operators take over. Some regions have an intermediate level (tussenspanning) of around 50 or 25 kV.',
        'Medium voltage (MS, middenspanning) is mostly 10 to 20 kV. It runs from substations through cities and villages to the distribution substations, and directly to large customers such as factories. Low voltage (LS, laagspanning) is 400/230 V: the cables in your street and the connection to your house.',
        'The regional operators (DSOs, distribution system operators) are Enexis, Liander and Stedin, plus a few smaller ones such as Westland Infra, Coteq and Rendo. Each has a monopoly in its area. Enexis covers large parts of the north, east and south. They own and run the MS and LS grid that almost every home and business connects to.',
      ],
      example: {
        kind: 'worked',
        text: 'A wind farm sends 100 MW into the grid. At 10 kV that would need a current of roughly 100,000,000 / (1.73 × 10,000) ≈ 5,800 A, far too much for any normal cable. At 150 kV it is about 385 A, 15 times less current, and about 225 times lower losses for the same cable. That is why the wind farm connects to a TenneT 150 kV station, while a single wind turbine or a small solar park connects to the MS grid of the regional operator.',
      },
      said: 'What engineers say: “That’s TenneT’s side of the station. We start at the 10 kV rail.”',
      recall: [
        {
          q: 'An operator converts an MS grid from 10 kV to 20 kV and carries the same power. By what factor do the cable losses change? Give the factor as a decimal number.',
          number: 0.25,
          tolerance: 0.02,
          unit: '',
          why: 'Double the voltage halves the current; losses scale with current squared: 0.5² = 0.25.',
        },
        {
          q: 'Which voltage is typical for the MS grid?',
          options: ['10 to 20 kV', '380 kV', '230 V', '150 kV'],
          answer: '10 to 20 kV',
          why: 'Middenspanning in the Netherlands is mostly 10 to 20 kV.',
        },
        {
          q: 'Which of these is a regional grid operator?',
          options: ['TenneT', 'Vattenfall', 'ACM', 'Enexis'],
          answer: 'Enexis',
          why: 'Enexis, Liander and Stedin are the large regional operators; Vattenfall is a supplier, ACM the regulator.',
        },
        {
          q: 'Why is electricity transported at very high voltage?',
          options: ['It is safer', 'Lower current means much lower losses', 'Cables are cheaper at high voltage', 'Households need high voltage'],
          answer: 'Lower current means much lower losses',
          why: 'Losses scale with current squared; higher voltage means less current for the same power.',
        },
      ],
      situation: {
        scene: 'You’re at a regional grid operator in a meeting about a new industrial area. Someone says: “We just need a bigger cable from the TenneT station.” A colleague mentions the 150/20 kV transformer.',
        ask: 'What do you ask to make sense of it?',
        model: 'Which part is ours and which is TenneT’s: does the station have room on the 20 kV side, or is the 150/20 kV transformer itself the limit? If the transformer is full, a bigger cable from the station does not help, and we need TenneT involved. Who talks to TenneT about this?',
        rubric: [
          'Separates TenneT’s high-voltage side from the regional MS side',
          'Asks where the actual limit is: cable or transformer',
          'Asks who coordinates with TenneT',
        ],
      },
      sayIt: 'Explain to a new colleague in 60 seconds the Dutch voltage levels and who runs which.',
      terms: [
        { term: 'TenneT', def: 'The national transmission system operator; runs 110 kV and higher.' },
        { term: 'MS (middenspanning)', def: 'Medium voltage, mostly 10 to 20 kV, run by regional operators.' },
        { term: 'LS (laagspanning)', def: 'Low voltage, 400/230 V: street cables and house connections.' },
        { term: 'DSO', def: 'Distribution system operator: regional grid operator such as Enexis.' },
      ],
    },
    {
      id: 'eng.gridbasics.path',
      title: 'From substation to socket',
      pre: [
        {
          q: 'An MS ring connects about 15 distribution substations in a loop. How is it usually operated?',
          options: ['Open at one point, so each half is fed from one side', 'Closed, fed from both sides at once', 'Each substation fed by its own cable', 'Only during peak hours'],
          answer: 'Open at one point, so each half is fed from one side',
          why: 'A ring is built as a loop but run open, so after a fault the open point can be closed to restore supply.',
        },
      ],
      teach: [
        'Power arrives from TenneT at an onderstation (substation), where large transformers step it down from 150 or 110 kV to 10 or 20 kV. From there, MS cables leave in many directions. The substation is where the national and regional grids meet, and where much of the capacity for a whole town is decided.',
        'MS cables are laid in rings: they leave the substation, pass a series of distribution substations and return. The ring is run open at one point, the normally open point. If a cable section fails, operators isolate it and close the open point, so most customers are back on supply while the cable is repaired.',
        'The distribution substation, netstation or wijktrafo, is the small building or cabinet in your street. Inside: MS switchgear (the switches) for the ring, a transformer from 10 kV to 400 V of typically 250 to 630 kVA, and an LS rack with fuses for each outgoing street cable. In buildings and at large customers the MS equipment often sits in an MS-ruimte.',
        'From the netstation, LS cables run along the streets, each feeding dozens of homes. A connection cable runs to each house and ends at the main fuse and meter in the meterkast. Up to and including the meter, it belongs to the grid operator; after it, to the owner.',
      ],
      example: {
        kind: 'worked',
        text: 'A house in Tilburg: TenneT delivers at 150 kV to the onderstation, where two 150/10 kV transformers feed a 10 kV rail. A 10 kV cable leaves in a ring past 12 netstations. Netstation number 7 has a 400 kVA transformer and six LS cables; one of them runs down the street, feeding 35 homes. The house’s connection cable ends at a 3 × 25 A main fuse. If the ring cable between netstations 6 and 7 fails, operators open switches at both ends and close the normally open point, and netstation 7 is back on from the other side.',
      },
      said: 'What engineers say: “We back-fed station 7 from the other half of the ring. The faulty section is switched out.”',
      recall: [
        {
          q: 'A netstation has a 400 kVA transformer. Planners count 2 kVA peak per home. How many homes can it feed at most?',
          number: 200,
          tolerance: 5,
          unit: 'homes',
          why: '400 / 2 = 200 homes, before any margin for growth.',
        },
        {
          q: 'What is in a typical netstation?',
          options: ['A 150/10 kV transformer', 'A power plant', 'MS switchgear, a 10 kV/400 V transformer and LS fuses', 'Only meters'],
          answer: 'MS switchgear, a 10 kV/400 V transformer and LS fuses',
          why: 'The netstation steps MS down to LS and distributes it over street cables.',
        },
        {
          q: 'Where does the national grid hand over to the regional grid?',
          options: ['At the house meter', 'At the onderstation', 'At the netstation', 'At the power plant'],
          answer: 'At the onderstation',
          why: 'The substation steps 150 or 110 kV down to MS, where the regional operator takes over.',
        },
        {
          q: 'Up to which point is a house connection owned by the grid operator?',
          options: ['The street cable', 'The netstation', 'The first socket in the house', 'Up to and including the meter'],
          answer: 'Up to and including the meter',
          why: 'The connection and meter belong to the grid operator; the installation after it to the owner.',
        },
      ],
      situation: {
        scene: 'You’re at a regional grid operator. A team wants to improve how fast customers get power back after an MS fault. They show restoration times of 2 to 3 hours in some areas and 30 minutes in others.',
        ask: 'What do you ask about the grid structure?',
        model: 'In the slow areas, is the MS grid built as rings with an open point that can be switched, or are there radial cables without a second feed? And where can switching be done remotely, and where does a technician have to drive to the netstation? The difference may be in the grid structure and travel time, not in the people.',
        rubric: [
          'Asks whether there is a ring with a switchable open point',
          'Asks about remote versus manual switching',
          'Looks at structure and travel time before blaming the teams',
        ],
      },
      sayIt: 'Explain to a family member in 60 seconds how electricity gets from a substation to their socket.',
      terms: [
        { term: 'Onderstation', def: 'Substation where HS is stepped down to MS.' },
        { term: 'Netstation (wijktrafo)', def: 'Distribution substation in the street, stepping MS down to 400/230 V.' },
        { term: 'Normally open point', def: 'The point where an MS ring is kept open; closed to restore supply after a fault.' },
        { term: 'MS-ruimte', def: 'A room with MS equipment, often in a building or at a large customer.' },
      ],
    },
    {
      id: 'eng.gridbasics.load',
      title: 'Capacity, peak load and simultaneity',
      pre: [
        {
          q: 'A street has 100 homes, each with a 17 kVA connection. Roughly what peak did grid planners traditionally expect for the whole street?',
          options: ['1,700 kVA', 'About 850 kVA', 'Zero', 'About 150 kVA'],
          answer: 'About 150 kVA',
          why: 'Homes do not peak at the same time; traditionally about 1.5 kVA per home at the evening peak.',
        },
      ],
      teach: [
        'Grid equipment is rated in kVA, apparent power: what the cable or transformer actually has to carry, including the part that does no useful work. kW is the useful part. The ratio is the power factor, usually 0.9 to 1 for homes. A 400 kVA transformer can deliver about 360 to 400 kW.',
        'Simultaneity (gelijktijdigheid) is the key planning idea. Not every home uses its maximum at the same time. Traditionally a street was planned at about 1 to 1.5 kVA per home at the evening peak, far below the 17 kVA of each connection. That assumption is why many old LS grids are relatively light.',
        'Heat pumps and electric cars change this. On a cold evening, all heat pumps run at once: simultaneity close to 1. Cars charge after work at 11 kW each. Solar panels add a new peak at midday in the other direction: on a sunny day, every roof feeds back at the same time. The grid now needs room for peaks it was never designed for.',
        'Too much feed-in raises the voltage at the end of a long LS cable. Above about 253 V (230 V plus 10%), inverters (the boxes that turn solar power into grid AC) switch off to protect the grid: “my panels keep switching off” is often a voltage problem, not a broken inverter.',
      ],
      example: {
        kind: 'worked',
        text: 'A netstation of 400 kVA feeds 150 homes. Old peak: 1.5 kVA × 150 = 225 kVA, 56% loaded. Now 50 homes get a heat pump of 3 kW, all running on a cold evening at about 80% of full power: + 50 × 3 × 0.8 = 120 kVA. And 40 homes charge a car at 11 kW, with about 30% charging at the same moment: + 40 × 11 × 0.3 = 132 kVA. New peak: 225 + 120 + 132 = 477 kVA, 119% of the transformer. The annual energy only rose by about half; the peak more than doubled.',
      },
      said: 'What engineers say: “The simultaneity of those heat pumps is close to one. When it freezes, they all run.”',
      recall: [
        {
          q: '100 homes each have 5 kW of solar panels. At noon on a sunny day they produce 70% of that and use 0.5 kW each. How much flows back into the grid, in kW?',
          number: 300,
          tolerance: 5,
          unit: 'kW',
          why: 'Per home 5 × 0.7 − 0.5 = 3 kW; 100 × 3 = 300 kW.',
        },
        {
          q: 'What does simultaneity (gelijktijdigheid) describe?',
          options: ['How many homes have solar panels', 'How much of the maximum load occurs at the same moment', 'The voltage at the end of a cable', 'The age of the grid'],
          answer: 'How much of the maximum load occurs at the same moment',
          why: 'Planners use it to size cables and transformers below the sum of all connections.',
        },
        {
          q: 'Why do heat pumps hit the grid harder than you might expect from their kWh?',
          options: ['They use more kWh than any other appliance', 'They run only in summer', 'On cold evenings almost all of them run at the same time', 'They feed back into the grid'],
          answer: 'On cold evenings almost all of them run at the same time',
          why: 'High simultaneity makes the peak large even if the yearly energy is moderate.',
        },
        {
          q: 'A resident complains that the solar inverter keeps switching off on sunny days. What is a likely cause?',
          options: ['The voltage at the end of the LS cable rises above the limit', 'The meter is broken', 'The panels are dirty', 'The heat pump is too large'],
          answer: 'The voltage at the end of the LS cable rises above the limit',
          why: 'Inverters disconnect when the voltage goes above about 253 V.',
        },
      ],
      situation: {
        scene: 'You’re in a planning session at a regional grid operator. A municipality wants to take a whole neighbourhood off gas with heat pumps within three years. The planner says the netstations are only 50% loaded.',
        ask: 'What do you ask?',
        model: 'Fifty percent at which peak, and under which assumptions? Today’s peak is with gas heating; with heat pumps on a cold evening the simultaneity goes towards 1, and if cars are added the peak may double. Can we recalculate the peak per netstation with the planned heat pumps and expected cars, and see which ones go over 100%?',
        rubric: [
          'Questions the current loading as basis for future load',
          'Mentions high simultaneity of heat pumps on cold days',
          'Asks for a recalculation per netstation with the new loads',
        ],
      },
      sayIt: 'Explain to a municipal policy officer in 60 seconds why going off gas changes the load on the electricity grid so much.',
      terms: [
        { term: 'kVA', def: 'Apparent power: what cables and transformers must carry.' },
        { term: 'Simultaneity (gelijktijdigheid)', def: 'The share of maximum loads that occur at the same moment.' },
        { term: 'Peak load', def: 'The highest load in a period, which sets the size of the equipment.' },
      ],
    },
    {
      id: 'eng.gridbasics.congestion',
      title: 'Grid congestion',
      pre: [
        {
          q: 'A substation is “congested”. For how many hours a year is it typically actually overloaded?',
          options: ['All 8,760 hours', 'Often only tens to a few hundred hours', 'Exactly half the year', 'It is never overloaded, it is a legal status'],
          answer: 'Often only tens to a few hundred hours',
          why: 'Congestion is about the peak hours; most of the year there is room left.',
        },
      ],
      teach: [
        'Grid congestion (netcongestie) means that at peak moments, the demand for transport capacity is higher than what part of the grid can safely carry. It can be for consumption (afname), for example an industrial area that wants more power, or for feed-in (invoeding), for example solar parks in a rural area. Large parts of the Netherlands are now congested.',
        'In congested areas, new large customers (grootverbruik, connections above 3 × 80 A) and customers who want more capacity end up on a waiting list. Households and small businesses are still connected. The national capacity map shows where there is room and where not.',
        'Reinforcing the grid takes years: a new substation often takes 5 to 10 years including permits, land and the space for cables in the street. MS reinforcement is faster but still months to years. Staff, materials and digging space are all scarce.',
        'Meanwhile, operators use the existing grid more cleverly. Congestion management: customers are paid or contracted to use less or feed in less at peak moments, often through GOPACS, the national platform where grid operators buy this flexibility. Flexible or time-bound contracts give capacity except at peak hours, so a customer can connect now in return for limits. Since most congestion is a few hundred hours a year, a little flexibility frees a lot of room.',
      ],
      example: {
        kind: 'worked',
        text: 'An industrial area is fed by a 30 MVA substation. Peak load is 29 MVA, and three companies want 6 MVA more. The answer is a waiting list until the new substation is ready in about 7 years. The operator looks closer: the load is above 24 MVA for only 180 hours a year, about 2% of the time. A cold store agrees to shift 4 MVA of cooling away from those hours for a fee, and one company accepts a contract without capacity at peak hours. Two of the three can connect within a year.',
      },
      said: 'What engineers say: “The station is only full 200 hours a year. Find flex for those hours and we can let people on.”',
      recall: [
        {
          q: 'A substation is overloaded for 150 hours a year. What percentage of the year is that, rounded to one decimal?',
          number: 1.7,
          tolerance: 0.1,
          unit: '%',
          why: '150 / 8,760 = 0.017, about 1.7%.',
        },
        {
          q: 'Who usually ends up on a waiting list in a congested area?',
          options: ['Every household', 'Nobody, the law forbids waiting lists', 'Only solar panel owners', 'New large customers and those wanting more capacity'],
          answer: 'New large customers and those wanting more capacity',
          why: 'Small connections are still made; large ones wait for capacity.',
        },
        {
          q: 'What is congestion management?',
          options: ['Paying or contracting customers to shift use or feed-in away from peak moments', 'Building a new substation', 'Raising the price of electricity', 'Disconnecting households'],
          answer: 'Paying or contracting customers to shift use or feed-in away from peak moments',
          why: 'It frees capacity on the existing grid at the moments it is full.',
        },
        {
          q: 'Why does a little flexibility free up a lot of capacity?',
          options: ['Flexibility makes cables thicker', 'Customers stop using power', 'The overload only occurs in a small number of hours', 'TenneT adds capacity'],
          answer: 'The overload only occurs in a small number of hours',
          why: 'Shifting load out of those hours keeps the grid within its limit.',
        },
      ],
      situation: {
        scene: 'You’re at a regional grid operator in a project to shorten the waiting list for business connections. A manager says: “Nothing can be done until the new substation is built.”',
        ask: 'What do you ask?',
        model: 'For how many hours a year is the substation actually over its limit, and how much above it? If it is a few hundred hours, are there customers on the waiting list who could accept a time-bound or flexible contract, or existing customers who could shift load for a fee? Can we look at the load profile and the waiting list together?',
        rubric: [
          'Asks how many hours and by how much the station is overloaded',
          'Proposes flexible contracts or congestion management',
          'Links the load profile to the waiting list',
        ],
      },
      sayIt: 'Explain to an entrepreneur in 60 seconds why they cannot get a bigger connection right now, and what options exist.',
      terms: [
        { term: 'Netcongestie', def: 'Peak demand for transport is higher than the grid can safely carry.' },
        { term: 'Congestion management', def: 'Contracting customers to shift use or feed-in away from peak moments.' },
        { term: 'Grootverbruik', def: 'Large connections, above 3 × 80 A.' },
        { term: 'Capacity map', def: 'Public map showing where the grid has room for consumption and feed-in.' },
      ],
    },
    {
      id: 'eng.gridbasics.roles',
      title: 'What a grid operator does',
      pre: [
        {
          q: 'Who sells you the electricity you use at home?',
          options: ['Your energy supplier', 'The regional grid operator', 'TenneT', 'The municipality'],
          answer: 'Your energy supplier',
          why: 'Suppliers sell energy; the grid operator transports it and maintains the grid.',
        },
      ],
      teach: [
        'A regional grid operator has five core tasks. Connect customers. Transport electricity (and often gas) to them. Maintain the grid so it stays safe and reliable. Restore outages, day and night. Plan and build the grid of the future: every two years it publishes an investment plan. It does not sell energy; suppliers do that.',
        'Most outages happen in the MS and LS grid: a digger hits a cable, an old joint fails, a fuse blows. The Dutch grid is among the most reliable in Europe: the average customer loses power for roughly 20 to 30 minutes a year. Operators track this as outage minutes per customer.',
        'Grid operators are regulated monopolies. Each has its own area; customers cannot choose. The ACM, the regulator, sets how much income they may earn through tariffs, sets the technical and connection rules in the codes, and checks quality. Their shareholders are provinces and municipalities, and by law they cannot be sold to private owners.',
        'The work is changing fast. With the energy transition, grid operators are building and connecting more than ever, while staff and materials are scarce. That is why they care so much about standardising, planning work in bigger packages, and every hour of efficiency in the field.',
      ],
      example: {
        kind: 'worked',
        text: 'A regional operator has 2.8 million customers. In one year, its outages add up to 70 million customer minutes, mostly from MS cable faults. Average per customer: 70,000,000 / 2,800,000 = 25 minutes. One big MS fault that cuts 3,000 customers for 90 minutes alone adds 270,000 customer minutes. That is why restoring most customers quickly, by switching, matters even before the cable is repaired.',
      },
      said: 'What engineers say: “We don’t sell a single kWh. We move it, we connect, and we fix it when it breaks.”',
      recall: [
        {
          q: 'An operator has 2 million customers and 50 million customer minutes of outage in a year. What is the average outage per customer, in minutes?',
          number: 25,
          tolerance: 0.5,
          unit: 'min',
          why: '50,000,000 / 2,000,000 = 25 minutes.',
        },
        {
          q: 'What does the ACM do for grid operators?',
          options: ['It builds substations', 'It sells electricity', 'It sets allowed income, rules and checks quality', 'It operates the 380 kV grid'],
          answer: 'It sets allowed income, rules and checks quality',
          why: 'The ACM regulates the monopoly grid operators.',
        },
        {
          q: 'Where do most outages for customers start?',
          options: ['At power plants', 'In the 380 kV grid', 'In home appliances', 'In the MS and LS grid'],
          answer: 'In the MS and LS grid',
          why: 'Cable damage, joint failures and blown fuses in the regional grid cause most outages.',
        },
        {
          q: 'Who owns the Dutch regional grid operators?',
          options: ['Energy suppliers', 'Provinces and municipalities', 'Foreign investors', 'TenneT'],
          answer: 'Provinces and municipalities',
          why: 'They are publicly owned and by law cannot be privatised.',
        },
      ],
      situation: {
        scene: 'You start a project at a regional grid operator. Your client contact says: “We need to connect 30% more customers next year with the same number of technicians.”',
        ask: 'What do you ask to understand the work?',
        model: 'Where does a technician’s day go today: travel, waiting for materials, permits, rework, actual work on the cable? And how much of the work is standard connections versus custom jobs? If we know where the hours leak, we can see whether standardising or better work preparation gives the 30%.',
        rubric: [
          'Asks how a technician’s time is actually spent',
          'Separates standard work from custom work',
          'Links the answer to standardisation and work preparation',
        ],
      },
      sayIt: 'Explain to a friend in 60 seconds what a regional grid operator does and does not do.',
      terms: [
        { term: 'ACM', def: 'The Dutch regulator that sets grid operators’ income and rules.' },
        { term: 'Outage minutes', def: 'Average minutes without power per customer per year.' },
        { term: 'Investment plan', def: 'Plan a grid operator publishes every two years for grid expansion.' },
      ],
    },
  ],
};
