// eng.fluids (EN): Pumps, flow and heat: pressure drop, pump curves, cavitation, speed control, heat exchangers, steam.
export default {
  lessons: [
    {
      id: 'eng.fluids.flow',
      title: 'Pressure, flow and pressure drop',
      pre: [
        {
          q: 'The flow through an existing pipe doubles. The flow is turbulent, as in most process pipes. What happens to the friction pressure drop, roughly?',
          options: ['It doubles', 'It roughly quadruples', 'It stays the same', 'It halves'],
          answer: 'It roughly quadruples',
          why: 'In turbulent flow the friction pressure drop rises roughly with the velocity squared: 2 × 2 = 4.',
        },
      ],
      teach: [
        'Liquids flow from high to low pressure. Pumps make the pressure; pipes, bends, valves, filters and heat exchangers use it up through friction.\n\nPump people talk in head: the height in metres of liquid the pump can lift. 10 m of water is about 1 bar. A centrifugal pump gives the same head with any thin liquid; the pressure that head gives scales with density.',
        'The friction pressure drop rises with the velocity squared in the turbulent flow found in most process pipes. Double the flow in the same pipe and the drop roughly quadruples.\n\nThat is why pushing more through an existing line often fails: the pump can’t deliver the extra pressure. One pipe size larger lowers the velocity, and the drop falls sharply.',
        'Velocity = flow / pipe cross-section. Typical design velocities for water-like liquids are 1 to 3 m/s. Above that, erosion, noise and pressure drop climb; below it, solids may settle.\n\nPipe size is given as DN, the nominal diameter in mm: DN50 is roughly 50 mm inside.',
        'Slow, thick flow is laminar: layers slide smoothly past each other. Most flows of thin liquids are turbulent: swirling.\n\nThe Reynolds number tells which: below about 2,300 laminar, above about 4,000 turbulent. Turbulence mixes and transfers heat well; thick products like syrups, creams and pastes often flow laminar and heat up slowly in a pipe.',
      ],
      example: {
        kind: 'worked',
        text: 'A cooling circuit runs 10 m³ per hour through a DN50 line. Cross-section: 3.14 / 4 × 0.05² = 0.00196 m²; flow 10 / 3,600 = 0.00278 m³/s; velocity 1.4 m/s. The friction drop is 0.8 bar.\n\nA new machine needs the flow doubled to 20 m³ per hour: velocity 2.8 m/s and a drop of about 4 × 0.8 = 3.2 bar. The pump can only add 2 bar at that flow, so it won’t work. Changing the line to DN80 brings the velocity down to 1.1 m/s and the drop to roughly 0.3 bar: the pipe, not the pump, was the problem.',
      },
      said: 'What engineers say: “Double the flow in that line and you need four times the pressure. The pump won’t make it, so we upsize the pipe.”',
      recall: [
        {
          q: 'A pipe has a friction pressure drop of 0.5 bar at 12 m³ per hour, turbulent flow. The flow is raised to 18 m³ per hour in the same pipe. Assume the drop rises with flow squared. What is the new drop, in bar?',
          number: 1.125,
          tolerance: 0.05,
          unit: 'bar',
          why: '18 / 12 = 1.5; 1.5² = 2.25; 0.5 × 2.25 = 1.125 bar.',
        },
        {
          q: 'A pump delivers 30 m of head pumping water. Using 10 m of water ≈ 1 bar, how much pressure does it add, in bar?',
          number: 3,
          tolerance: 0.1,
          unit: 'bar',
          why: '30 m / 10 m per bar = 3 bar.',
        },
        {
          q: 'The same pump, at the same flow and speed, now pumps a liquid with a density of 1,200 kg/m³ instead of water. What changes?',
          options: ['The head in metres drops by 20%', 'Same head in metres, about 20% more pressure in bar', 'Both head and pressure stay the same', 'The flow doubles'],
          answer: 'Same head in metres, about 20% more pressure in bar',
          why: 'A centrifugal pump gives the same head for any thin liquid; pressure = density × g × head, so it scales with density.',
        },
        {
          q: 'Why does a thick sauce heat up slowly in a tube heat exchanger?',
          options: ['It flows laminar, with little mixing near the wall', 'Thick liquids have no specific heat', 'The pipe is too short by definition', 'Thick liquids are always cold'],
          answer: 'It flows laminar, with little mixing near the wall',
          why: 'Laminar flow has a slow layer at the wall and little mixing, so heat moves in slowly.',
        },
      ],
      situation: {
        scene: 'You’re at a plastics client. They want to raise the flow in a cooling water circuit by 40% to cool a new machine, using the existing pipes and pump.',
        ask: 'What do you ask?',
        model: 'What is the pressure drop in the circuit now, and what would 40% more flow do to it: roughly 1.4² = 2 times the friction drop? Where on its curve does the pump run, and can it deliver that head at the higher flow? Which section of pipe has the highest velocity? Maybe one undersized section or a clogged filter is the real limit.',
        rubric: [
          'Expects the friction drop to rise with flow squared',
          'Checks the pump curve at the new flow',
          'Looks for the narrowest section or a restriction such as a filter',
        ],
      },
      sayIt: 'Explain to a production manager in 60 seconds why you can’t just push twice as much through the same pipe.',
      terms: [
        { term: 'Head', def: 'Pump pressure expressed as metres of liquid column; 10 m of water is about 1 bar.' },
        { term: 'Pressure drop', def: 'Pressure lost to friction in pipes, valves and equipment; grows with velocity squared in turbulent flow.' },
        { term: 'DN', def: 'Nominal pipe diameter in mm.' },
        { term: 'Reynolds number', def: 'Number that tells laminar (below about 2,300) from turbulent (above about 4,000) flow.' },
      ],
    },
    {
      id: 'eng.fluids.pumps',
      title: 'Pump curve, system curve and duty point',
      pre: [
        {
          q: 'A centrifugal pump runs with its discharge valve fully closed. What happens?',
          options: ['The pressure rises until the pipe bursts', 'The pressure rises a little, the flow is zero and the liquid in the pump heats up', 'The pump automatically stops', 'Nothing, it’s a normal operating point'],
          answer: 'The pressure rises a little, the flow is zero and the liquid in the pump heats up',
          why: 'A centrifugal pump has a maximum head at zero flow; all its power then turns into heat in the trapped liquid.',
        },
      ],
      teach: [
        'Two pump families. A centrifugal pump spins an impeller and throws liquid outward: simple, cheap, ideal for thin liquids and large flows. Its flow drops as the pressure against it rises.\n\nA positive displacement pump (gear, lobe, screw, piston, diaphragm) pushes a fixed volume per turn, so its flow barely changes with pressure. It suits thick liquids, dosing and high pressures, but against a closed valve the pressure climbs until something breaks, so it needs a relief valve.',
        'A centrifugal pump has a pump curve: head against flow, high at low flow and falling as flow rises. The pipework has a system curve: static head (height difference and vessel pressure to overcome) plus friction, which grows with flow squared.\n\nWhere the two curves cross is the duty point: the flow and head you actually get.',
        'Every pump has a best efficiency point (BEP), the flow where it runs most efficiently. Running far from it, roughly below 70% or above 120% of the BEP flow, causes vibration, heating, and seal and bearing wear.\n\nMany “bad pumps” are good pumps in the wrong place on their curve.',
        'Throttling a valve to cut the flow moves the duty point by adding friction: it works, but burns energy across the valve. Hydraulic power = density × g × flow × head; the motor must supply that divided by the pump efficiency.\n\nOversized pumps throttled back are common in older plants: a quick energy and reliability win.',
      ],
      example: {
        kind: 'worked',
        text: 'A cooling pump was chosen with its best efficiency point (BEP) at 100 m³ per hour, but the plant only needs 60, so a valve is half closed. At 60 m³ per hour the pump makes 45 m of head, while the pipework needs only 25 m: the other 20 m burn in the valve.\n\nHydraulic power at the pump: 1,000 × 9.81 × (60 / 3,600) × 45 = 7.4 kW. Needed: 1,000 × 9.81 × (60 / 3,600) × 25 = 4.1 kW. So about 3.3 kW is wasted in the valve, 26,000 kWh a year at 8,000 hours, before motor and pump losses.\n\nAnd at 60% of its BEP flow the pump vibrates: seals last four months. A trimmed impeller or a speed drive fixes both.',
      },
      said: 'What engineers say: “That pump isn’t bad, it’s throttled back to 60% of BEP. Trim the impeller and I bet the seal problem goes away.”',
      recall: [
        {
          q: 'A gear pump is running and someone closes the discharge valve. What protects the pump and pipe?',
          options: ['The pump curve', 'A pressure relief valve', 'A check valve', 'Nothing is needed'],
          answer: 'A pressure relief valve',
          why: 'A positive displacement pump keeps pushing volume, so pressure climbs until a relief valve opens or something breaks.',
        },
        {
          q: 'What is the duty point of a centrifugal pump?',
          options: ['The flow on its nameplate', 'Where the pump curve and the system curve cross', 'The point of maximum head', 'The flow at which it cavitates'],
          answer: 'Where the pump curve and the system curve cross',
          why: 'That is the only flow and head where what the pump delivers equals what the system needs.',
        },
        {
          q: 'A pump moves water (density 1,000 kg/m³) at 0.02 m³ per second against a head of 25 m. Use g = 9.81 m/s². Hydraulic power = density × g × flow × head. What is the hydraulic power, in kW?',
          number: 4.9,
          tolerance: 0.1,
          unit: 'kW',
          why: '1,000 × 9.81 × 0.02 × 25 = 4,905 W, about 4.9 kW.',
        },
        {
          q: 'A centrifugal pump runs at 40% of its best-efficiency flow, all year. What is the likely consequence?',
          options: ['It runs at its most efficient point', 'More vibration, heating, and seal and bearing wear', 'It delivers more head than any other point and lasts longer', 'No consequence at all'],
          answer: 'More vibration, heating, and seal and bearing wear',
          why: 'Far left of BEP, flow inside the pump becomes unstable and loads the shaft, seals and bearings.',
        },
      ],
      situation: {
        scene: 'You’re at a chemicals client. The maintenance lead says pump P-204 “eats mechanical seals” and wants to switch to a more expensive brand.',
        ask: 'What do you ask before they buy?',
        model: 'Where on its curve does P-204 actually run: what are the real flow and head compared with its BEP? Is it throttled with a valve? Is there any sign of cavitation, such as noise or a low suction tank? And is the seal type right for this liquid and temperature? A pump running far from BEP will eat any brand of seal.',
        rubric: [
          'Asks for the real duty point compared with the BEP',
          'Checks for throttling or an oversized pump',
          'Considers cavitation and the seal choice before blaming the brand',
        ],
      },
      sayIt: 'Explain to a maintenance planner in 60 seconds what a pump curve, a system curve and the duty point are.',
      terms: [
        { term: 'Centrifugal pump', def: 'A pump with a spinning impeller; its flow falls as the pressure against it rises.' },
        { term: 'Positive displacement pump', def: 'A pump that pushes a fixed volume per turn; needs a relief valve.' },
        { term: 'Duty point', def: 'Where the pump curve and the system curve cross: the real flow and head.' },
        { term: 'BEP', def: 'Best efficiency point: the flow where a pump runs most efficiently and smoothly.' },
      ],
    },
    {
      id: 'eng.fluids.cavitation',
      title: 'Cavitation and NPSH',
      pre: [
        {
          q: 'A pump sounds as if it is pumping gravel. Its suction tank is nearly empty and the liquid is hot. What is the most likely cause?',
          options: ['A loose motor', 'Cavitation', 'Too much flow resistance on the discharge side', 'A blocked vent on the motor'],
          answer: 'Cavitation',
          why: 'A low tank level and hot liquid both reduce the margin against boiling at the pump inlet.',
        },
      ],
      teach: [
        'Liquids boil when the pressure falls below their vapour pressure, which rises with temperature: water at 20 °C boils at about 0.023 bar absolute, at 80 °C at about 0.47 bar absolute.\n\nThe pump inlet is where the pressure dips lowest. If it falls below the vapour pressure, vapour bubbles form and then collapse violently further along the impeller. That is cavitation.',
        'Symptoms: a crackling, gravel-like noise, vibration, falling flow and head, and pitted, sponge-like damage on the impeller. Seals and bearings suffer too. Heavy cavitation can wreck an impeller within weeks.',
        'Engineers check it with NPSH, net positive suction head, in metres. NPSHr (required) comes from the pump maker’s curve and rises with flow. NPSHa (available) comes from the installation: the pressure on the liquid surface as head, plus the liquid height above the pump inlet, minus friction in the suction line, minus the vapour pressure as head.\n\nThe rule: NPSHa must stay above NPSHr, with a margin.',
        'What lowers NPSHa: a low tank level, hot liquid, a long or narrow suction pipe, a clogged suction strainer, a partly closed suction valve, a vessel under vacuum.\n\nFixes: raise the tank or lower the pump, a wider and shorter suction line, cooler liquid, a clean strainer, and never throttle on the suction side. Running above design flow raises NPSHr.',
      ],
      example: {
        kind: 'worked',
        text: 'A condensate pump takes water at 95 °C from a vented tank. Pressure on the surface: 1.01 bar; vapour pressure at 95 °C: 0.85 bar. The difference, 0.16 bar, is about 1.7 m of water.\n\nThe tank level sits 1.5 m above the pump inlet; suction friction is 0.5 m. NPSHa = 1.7 + 1.5 − 0.5 = 2.7 m.\n\nThe pump curve says NPSHr = 3.0 m at the duty flow: it cavitates, and the impeller shows it. Raising the tank 1 m gives NPSHa 3.7 m, a margin of 0.7 m. That, not a new pump brand, solves it.',
      },
      said: 'What engineers say: “It’s hot condensate with a metre and a half of suction head. Of course it cavitates. Raise the tank.”',
      recall: [
        {
          q: 'Which change lowers the NPSH available to a pump?',
          options: ['A higher liquid level in the suction tank', 'Hotter liquid in the suction tank', 'A wider suction pipe', 'Throttling the discharge valve'],
          answer: 'Hotter liquid in the suction tank',
          why: 'Hotter liquid has a higher vapour pressure, which is subtracted in NPSHa.',
        },
        {
          q: 'What must hold to avoid cavitation?',
          options: ['NPSHr above NPSHa', 'NPSHa above NPSHr, with a margin', 'The pump runs below 1,500 rpm', 'The discharge pressure is above 3 bar'],
          answer: 'NPSHa above NPSHr, with a margin',
          why: 'The installation must offer more suction head than the pump needs at that flow.',
        },
        {
          q: 'A pump draws water from an open tank. Expressed as head: the pressure on the liquid surface is 10.3 m, the vapour pressure is 0.4 m, the liquid level is 2 m above the pump inlet, and friction in the suction line is 1.5 m. What is the NPSH available, in m?',
          number: 10.4,
          tolerance: 0.1,
          unit: 'm',
          why: 'NPSHa = 10.3 + 2 − 1.5 − 0.4 = 10.4 m.',
        },
        {
          q: 'An operator closes the suction valve of a centrifugal pump halfway to reduce its flow. What does that do?',
          options: ['It is the recommended way to reduce flow', 'It raises the risk of cavitation; throttle on the discharge side instead', 'It lowers NPSHr', 'It has no effect on the pump'],
          answer: 'It raises the risk of cavitation; throttle on the discharge side instead',
          why: 'Throttling the suction adds friction before the pump, which lowers NPSHa.',
        },
      ],
      situation: {
        scene: 'You’re at a brewery. The CIP return pump has needed a new impeller three times this year; the old ones are pitted like a sponge. Maintenance blames the supplier.',
        ask: 'What do you ask?',
        model: 'That pitting looks like cavitation. How hot is the cleaning liquid at the pump, and how high is the liquid level above the pump inlet? How long and narrow is the suction line, and is there a strainer or a half-closed valve before the pump? What is the NPSHr at the actual flow, and does it run above design flow? Let’s compare NPSHa with NPSHr before we change supplier.',
        rubric: [
          'Recognises the pitting as a likely cavitation sign',
          'Asks about temperature, liquid level and suction line restrictions',
          'Proposes comparing NPSHa with NPSHr at the real flow',
        ],
      },
      sayIt: 'Explain cavitation to a production supervisor in 60 seconds, and say what makes it worse.',
      terms: [
        { term: 'Cavitation', def: 'Vapour bubbles forming and collapsing in a pump because the inlet pressure is too low.' },
        { term: 'Vapour pressure', def: 'The pressure at which a liquid boils at a given temperature; rises with temperature.' },
        { term: 'NPSHa', def: 'Net positive suction head available: the suction margin the installation offers.' },
        { term: 'NPSHr', def: 'Net positive suction head required: what the pump needs at a given flow, from the maker’s curve.' },
      ],
    },
    {
      id: 'eng.fluids.speed',
      title: 'Speed control and the affinity laws',
      pre: [
        {
          q: 'A pump circulates water in a closed loop with no height difference, so all its head goes to friction. It is slowed to 80% speed. What happens to its power, roughly?',
          options: ['It drops to 80%', 'It drops to 64%', 'It drops to about half', 'It stays the same'],
          answer: 'It drops to about half',
          why: 'Power scales with speed cubed: 0.8 × 0.8 × 0.8 = 0.51.',
        },
      ],
      teach: [
        'A variable frequency drive (VFD) changes motor speed.\n\nFor a centrifugal pump or fan, the affinity laws say: flow scales with speed, head with speed squared, and power with speed cubed. At 80% speed you get 80% flow, 64% head and about 51% power.',
        'Compare that with throttling. To get 80% flow by closing a valve, the pump keeps running at full speed and its power drops only a little.\n\nOn systems that are mostly friction, such as circulation loops, ventilation and cooling circuits, speed control usually saves far more.',
        'The catch is static head. If the pump has to lift liquid 30 m or push into a vessel at 5 bar, it must reach that head before any flow starts. Turn the speed down too far and flow collapses to zero.\n\nIn such systems the savings are smaller than the cube law suggests: ask what share of the head is static.',
        'Other gains: gentle starts, no water hammer, and control of pressure or flow directly from a sensor instead of a valve. Costs: the drive itself, about 3% drive losses, harmonics on the electrical network, and bearing currents on some motors.\n\nEngineers size the case with a load profile: how many hours a year at each flow.',
      ],
      example: {
        kind: 'worked',
        text: 'A circulation pump takes 30 kW at full speed in a friction-only loop. It runs 8,000 hours a year: 2,000 hours at full flow and 6,000 hours at 70% flow.\n\nNow a valve throttles it to 70% flow; according to the pump curve it then still draws about 25.5 kW. Yearly: 30 × 2,000 + 25.5 × 6,000 = 213,000 kWh.\n\nWith a VFD at 70% speed: 0.7³ × 30 = 10.3 kW. Adding 3% drive losses: 30.9 × 2,000 + 10.6 × 6,000 = about 125,400 kWh. Saving about 88,000 kWh a year, roughly €13,000 at €0.15 per kWh, for a drive costing a fraction of that.',
      },
      said: 'What engineers say: “It’s a closed loop, all friction. Put a drive on it and run it on differential pressure; the valve can stay open.”',
      recall: [
        {
          q: 'A pump in a friction-only loop draws 40 kW at full speed. It is slowed to 50% speed. Using the affinity laws and ignoring drive losses, what power does it draw, in kW?',
          number: 5,
          tolerance: 0.2,
          unit: 'kW',
          why: 'Power scales with speed cubed: 0.5³ = 0.125; 0.125 × 40 = 5 kW.',
        },
        {
          q: 'A centrifugal pump delivers 200 m³ per hour at full speed in a friction-only loop. It is slowed to 75% speed. Using the affinity laws, what flow does it deliver, in m³ per hour?',
          number: 150,
          tolerance: 1,
          unit: 'm³/h',
          why: 'Flow scales with speed: 0.75 × 200 = 150 m³ per hour.',
        },
        {
          q: 'Where does a VFD on a pump usually save the least energy?',
          options: ['On a closed circulation loop', 'On a pump that mostly lifts water against a large fixed height', 'On a ventilation fan', 'On a cooling water loop with throttling valves'],
          answer: 'On a pump that mostly lifts water against a large fixed height',
          why: 'With high static head, speed can drop only a little before flow stops, so the cube law gains are small.',
        },
        {
          q: 'What do you need to estimate the yearly savings of a VFD on a pump?',
          options: ['Only the motor’s nameplate power', 'A load profile: how many hours a year it runs at each flow', 'The pump’s purchase price', 'The VFD supplier’s brochure'],
          answer: 'A load profile: how many hours a year it runs at each flow',
          why: 'Savings depend on how long the pump runs at reduced flow; at full flow a VFD saves nothing.',
        },
      ],
      situation: {
        scene: 'You’re at a food client. A supplier pitches VFDs on all 40 pumps in the plant with “50% energy savings guaranteed”.',
        ask: 'What do you ask before anyone signs?',
        model: 'Which of these pumps actually run at reduced flow for long periods, and which run flat out? For each, how much of the head is static? A pump lifting to a high tank saves little. Can we log flow or valve position on the biggest ten for two weeks to build a load profile? And what exactly does “guaranteed” mean: measured how, against which baseline?',
        rubric: [
          'Asks which pumps run at part flow and for how long',
          'Raises static head as a limit on savings',
          'Asks for measurement: load profile and a baseline for the guarantee',
        ],
      },
      sayIt: 'Explain the affinity laws to a plant manager in 60 seconds, and why a VFD doesn’t save on every pump.',
      terms: [
        { term: 'VFD', def: 'Variable frequency drive: changes the motor speed by changing the supply frequency.' },
        { term: 'Affinity laws', def: 'Flow scales with speed, head with speed squared, power with speed cubed.' },
        { term: 'Static head', def: 'Height and pressure difference the pump must overcome even at zero flow.' },
        { term: 'Load profile', def: 'Hours per year at each flow or load; the basis of any savings estimate.' },
      ],
    },
    {
      id: 'eng.fluids.heat',
      title: 'Heat exchangers',
      pre: [
        {
          q: 'In a counterflow heat exchanger, hot and cold streams move in opposite directions. Can the cold stream leave hotter than the hot stream leaves?',
          options: ['No, never', 'Yes, in counterflow it can', 'Only with steam', 'Only if the flows are equal'],
          answer: 'Yes, in counterflow it can',
          why: 'The cold stream leaves at the end where the hot stream enters, so it can approach the hot inlet temperature.',
        },
      ],
      teach: [
        'A heat exchanger moves heat from a hot stream to a cold one through a wall, without mixing them.\n\nPlate heat exchangers (stacked corrugated plates) are compact and efficient and easy to open for cleaning; common in food and building services, but limited in pressure and sensitive to particles. Shell and tube exchangers (a tube bundle inside a shell) handle high pressures, high temperatures and dirty streams; common in chemicals and refineries.',
        'The heat duty follows from the streams: Q = m × cp × ΔT on either side, and at steady state the hot side gives what the cold side takes, minus small losses. What an exchanger can transfer is Q = U × A × ΔT mean: U is how well heat passes through the wall and the liquid films, A is the area, and ΔT mean the average temperature difference between the streams.',
        'Counterflow, with the streams in opposite directions, keeps a temperature difference along the whole length. It transfers the most heat for a given area, and the cold stream can leave hotter than the hot stream leaves.\n\nIn parallel flow the cold outlet can never get above the hot outlet.',
        'The approach is the smallest temperature gap between the streams. A tight approach of 2 to 5 °C recovers a lot of heat but needs a large area.\n\nIf an exchanger stops reaching its temperature, ask what changed: higher flow, fouling on the wall (lower U), a warmer cooling medium, or air or condensate blocking part of the area.',
      ],
      example: {
        kind: 'worked',
        text: 'A product cooler: 5,000 kg per hour, cp 3.8 kJ per kg per °C, cooled from 70 to 30 °C. Duty: 5,000 × 3.8 × 40 = 760,000 kJ per hour = 211 kW. Cooling water enters at 15 °C and may leave at 25 °C, a 10 °C rise with cp 4.2: water flow = 760,000 / (4.2 × 10) = 18,100 kg per hour, about 18 m³ per hour.\n\nIn summer the water comes in at 20 °C. To stay at 25 °C out, the water may only rise 5 °C, so it needs twice the flow, 36 m³ per hour, and the smaller temperature difference means the area may not be enough at all. That’s why coolers struggle in July.',
      },
      said: 'What engineers say: “Same flows, same inlet temperatures, four degrees warmer out than last month. That’s most likely fouling. Schedule a clean.”',
      recall: [
        {
          q: 'A product stream of 2 kg per second with cp 4.0 kJ per kg per °C is cooled from 60 to 20 °C. Ignore losses. How much heat is removed, in kW?',
          number: 320,
          tolerance: 2,
          unit: 'kW',
          why: '2 × 4.0 × 40 = 320 kJ per second = 320 kW.',
        },
        {
          q: 'A cooler must remove 320 kW. The cooling water (cp 4.2 kJ per kg per °C) may warm up by 10 °C. Ignore losses. How many kg of cooling water per second are needed?',
          number: 7.6,
          tolerance: 0.1,
          unit: 'kg/s',
          why: '320 / (4.2 × 10) = 7.6 kg per second.',
        },
        {
          q: 'Which flow arrangement transfers the most heat per m² of exchanger area?',
          options: ['Parallel flow', 'Counterflow', 'Both the same', 'It depends only on the pump'],
          answer: 'Counterflow',
          why: 'Counterflow keeps a larger average temperature difference along the whole length.',
        },
        {
          q: 'A plate cooler runs at the same flows and the same inlet temperatures as last month, but the product now leaves 4 °C warmer. What is the most likely cause?',
          options: ['Fouling on the plates, which lowers U', 'A higher product flow', 'Colder cooling water', 'A bigger exchanger was fitted'],
          answer: 'Fouling on the plates, which lowers U',
          why: 'With flows and inlet temperatures unchanged, only U or the effective area can have dropped; fouling lowers U.',
        },
      ],
      situation: {
        scene: 'You’re at a brewery. In summer the wort cooler can’t get the wort down to 12 °C, and the brewmaster wants a bigger chiller.',
        ask: 'What do you ask?',
        model: 'What are the temperatures in and out on both sides in summer compared with winter? If the cooling medium comes in warmer, the temperature difference shrinks and the same exchanger transfers less. When was it last cleaned, and is U falling over time? Is the problem the chiller’s capacity, the exchanger’s area, or the cooling medium flow? Each has a different fix.',
        rubric: [
          'Asks for inlet and outlet temperatures on both sides, summer vs winter',
          'Checks fouling and the trend in performance',
          'Separates chiller capacity from exchanger area and flow limits',
        ],
      },
      sayIt: 'Explain to a new process operator in 60 seconds what makes a heat exchanger work better or worse.',
      terms: [
        { term: 'Plate heat exchanger', def: 'Compact exchanger of stacked corrugated plates; easy to clean, limited in pressure.' },
        { term: 'Shell and tube', def: 'Exchanger with a tube bundle in a shell; robust for high pressure and dirty streams.' },
        { term: 'Counterflow', def: 'Streams moving in opposite directions; the most effective arrangement.' },
        { term: 'Fouling', def: 'Deposits on the heat transfer surface that lower U and so the heat transferred.' },
      ],
    },
    {
      id: 'eng.fluids.steam',
      title: 'Steam and condensate',
      pre: [
        {
          q: 'Why do many plants heat with steam rather than hot water?',
          options: ['Steam is free', 'Condensing steam releases a lot of heat at a fixed temperature', 'Steam needs no pipes', 'Hot water cannot be pumped'],
          answer: 'Condensing steam releases a lot of heat at a fixed temperature',
          why: 'Most of steam’s heat is latent heat, released at the condensing temperature set by its pressure.',
        },
      ],
      teach: [
        'Steam carries its heat mostly as latent heat. Condensing 1 kg of saturated steam at about 7 bar(g) releases around 2,050 kJ, at a fixed temperature of about 170 °C.\n\nThat makes steam compact to distribute and easy to control: the steam pressure sets the heating temperature. Raise the pressure, and the temperature rises with it.',
        'After condensing, the water (condensate) must leave the heat exchanger, or it floods the surface and heating drops. Steam traps do that: they let condensate out and keep steam in.\n\nA trap stuck open blows live steam into the condensate line; a trap stuck closed waterlogs the exchanger and can cause water hammer: violent bangs that break pipes and gaskets.',
        'Traps fail quietly. In systems without a test programme, 15 to 30% of the traps can be failed (a common estimate). Plants test them every year with ultrasound or temperature measurement.\n\nCondensate is hot, clean water: returning it to the boiler saves fuel, water and treatment chemicals.',
        'Steam leaks and uninsulated pipes and valves are visible money. The numbers to ask for: boiler efficiency, the share of condensate returned, and steam use per tonne of product.\n\nFouling in steam-heated exchangers, such as scale or burnt-on product, lowers heat transfer like in any exchanger; cleaning or descaling restores it.',
      ],
      example: {
        kind: 'worked',
        text: 'A trap survey at a food plant finds 30 of 200 traps failed open. One failed-open trap is estimated to lose 15 kg of steam per hour. Over 8,000 hours that is 120 tonnes of steam a year per trap.\n\nAt an assumed €40 per tonne of steam (it depends on the gas price), that is €4,800 a year per trap, and €144,000 for all 30, if each loses that much. A new trap costs a few hundred euros. Even if the real average loss is half the estimate, the repair pays back within a few months.\n\nReplace traps only with the line isolated, depressurised and cooled down. Then set up a yearly trap test so it doesn’t creep back.',
      },
      said: 'What engineers say: “Before we talk about a new boiler, let’s survey the traps. Every failed-open trap is a small leak you pay for all year.”',
      recall: [
        {
          q: 'Steam releases 2,050 kJ per kg when it condenses. A heater needs 410 kW from condensing steam. Ignore losses. How many kg of steam does it need per hour?',
          number: 720,
          tolerance: 5,
          unit: 'kg/h',
          why: '410 kJ/s × 3,600 = 1,476,000 kJ per hour; / 2,050 = 720 kg per hour.',
        },
        {
          q: 'The steam trap on a heat exchanger is stuck closed. What happens?',
          options: ['Live steam blows to the drain', 'Condensate backs up, heating drops and water hammer can occur', 'The exchanger heats better', 'Nothing, traps are optional'],
          answer: 'Condensate backs up, heating drops and water hammer can occur',
          why: 'Condensate can’t leave, so it floods the heating surface and can be slammed through the pipes by steam.',
        },
        {
          q: 'Why do plants return condensate to the boiler?',
          options: ['It is required by law', 'It is hot, clean water: it saves fuel, water and treatment chemicals', 'Condensate cannot go to the drain', 'It raises the steam pressure'],
          answer: 'It is hot, clean water: it saves fuel, water and treatment chemicals',
          why: 'Returned condensate already carries heat and needs little treatment.',
        },
        {
          q: 'The steam pressure in a heater is raised from 3 to 6 bar(g). What happens to the heating temperature?',
          options: ['It rises, because the condensing temperature of saturated steam rises with pressure', 'It falls', 'It stays the same, steam is always 100 °C', 'It depends only on the trap'],
          answer: 'It rises, because the condensing temperature of saturated steam rises with pressure',
          why: 'Saturated steam at higher pressure condenses at a higher temperature (about 144 °C at 3 bar(g), 165 °C at 6 bar(g)).',
        },
      ],
      situation: {
        scene: 'You’re at a food plant. The gas bill rose sharply and the plant manager wants to replace the 20-year-old boiler with a high-efficiency one.',
        ask: 'What do you ask before the boiler decision?',
        model: 'How much steam do we use per tonne of product, and how has that moved? What share of condensate comes back to the boiler? When were the steam traps last surveyed, and how many failed? Are there leaks and uninsulated valves? And what is the measured efficiency of the current boiler? A new boiler only fixes the last of these.',
        rubric: [
          'Asks for steam use per tonne of product and its trend',
          'Raises traps, leaks, insulation and condensate return',
          'Asks for the measured boiler efficiency before replacing it',
        ],
      },
      sayIt: 'Explain to a finance manager in 60 seconds what a steam trap does and why failed traps cost money.',
      terms: [
        { term: 'Saturated steam', def: 'Steam at its boiling point; its pressure fixes its temperature.' },
        { term: 'Steam trap', def: 'A valve that lets condensate out of steam equipment and keeps steam in.' },
        { term: 'Condensate', def: 'The hot water left after steam has given up its latent heat.' },
        { term: 'Water hammer', def: 'Violent pressure shocks when condensate is slammed through steam pipes.' },
      ],
    },
  ],
};
