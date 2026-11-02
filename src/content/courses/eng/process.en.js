// eng.process (EN): Process engineering basics: unit operations, process variables, mass and energy balances, batch cycles, scale-up.
export default {
  lessons: [
    {
      id: 'eng.process.types',
      title: 'Unit operations, batch and continuous',
      pre: [
        {
          q: 'A brewery brews in a kettle, one brew at a time. A refinery runs its distillation column for years without stopping. What is the main difference in how the two run?',
          options: ['The brewery uses more energy per litre', 'The brewery runs in batches; the refinery runs continuously', 'The refinery has no recipe', 'There is no real difference'],
          answer: 'The brewery runs in batches; the refinery runs continuously',
          why: 'A batch is one fixed amount processed step by step; a continuous plant has material flowing in and out all the time.',
        },
      ],
      teach: [
        'Process plants are built from unit operations: a small set of physical steps that come back everywhere. Pumping, heating and cooling, mixing, separating (filtering, centrifuging, distilling, evaporating), drying and reacting. A dairy, a chemical plant and a water works use the same building blocks in a different order. If you know which step you are looking at, you know which questions to ask, whatever the product.',
        'Batch: a fixed amount goes into a vessel, is processed step by step, and comes out as one lot. It is flexible, easy to trace (one batch, one record) and suits many recipes and small volumes: pharma, specialty chemicals, much of food. The downsides: filling, emptying and cleaning produce nothing, and every batch comes out a little different.',
        'Continuous: material flows in and out non-stop, and the plant runs at steady state, with the same conditions at every point hour after hour. It is efficient at high volume: refineries, paper, bulk chemicals, milk powder. Start-ups and shutdowns are costly and make off-spec product, so these plants hate stopping. Many sites mix both: batch mixing that feeds a continuous filling line.',
        'Residence time is how long material stays in a continuous step, on average: the volume of that step divided by the flow through it. A 6 m³ tank with 3 m³ per hour flowing through gives 2 hours. Ask about it whenever quality depends on time: heating, holding, reacting, settling. In a continuous plant, more flow means less residence time.',
      ],
      example: {
        kind: 'worked',
        text: 'A juice plant pasteurises continuously. After heating, the juice flows through a holding tube of 0.1 m³ at 12 m³ per hour. Residence time = 0.1 / 12 hours = 0.00833 hours = 30 seconds. The food safety plan demands at least 20 seconds at temperature. Production wants to raise the flow to 18 m³ per hour to make more. Then the residence time becomes 0.1 / 18 hours = 20 seconds: exactly on the minimum, with no margin. In a continuous plant, throughput and holding time are linked: more output needs a longer holding tube, not just a faster pump.',
      },
      said: 'What engineers say: “We can push it to 18 cubes an hour, but then we’re right on the minimum hold time. Not without a longer tube.”',
      recall: [
        {
          q: 'A continuous buffer tank holds on average 8 m³ of product. Product flows through it at a steady 2 m³ per hour. What is the average residence time in the tank, in hours?',
          number: 4,
          tolerance: 0.1,
          unit: 'hours',
          why: 'Residence time = volume / flow = 8 / 2 = 4 hours.',
        },
        {
          q: 'Which of these is a unit operation?',
          options: ['Production planning', 'Evaporation', 'A quality audit', 'A shift handover'],
          answer: 'Evaporation',
          why: 'Unit operations are physical process steps; planning, audits and handovers are organisational.',
        },
        {
          q: 'Why do continuous plants try hard to avoid stopping?',
          options: ['Start-ups and shutdowns take long and make off-spec product', 'Their machines cannot be switched off', 'Continuous plants have no maintenance', 'Stopping changes the recipe'],
          answer: 'Start-ups and shutdowns take long and make off-spec product',
          why: 'A continuous plant only makes good product at steady state; every stop costs the way back to it.',
        },
        {
          q: 'A pharmaceutical company makes 40 different products in small volumes and must trace every lot. Which way of running fits best?',
          options: ['Continuous', 'Batch', 'Either, it makes no difference', 'Neither: only manual work'],
          answer: 'Batch',
          why: 'Batch handles many recipes and small volumes, and one batch gives one traceable record.',
        },
      ],
      situation: {
        scene: 'You’re at a dairy client. The plant manager wants 30% more output from the continuous pasteuriser: “We’ll just turn up the pump.”',
        ask: 'What do you ask before they turn up the flow?',
        model: 'What does 30% more flow do to the residence time in the holding section: do we still meet the minimum time at temperature in the food safety plan? Can the heat exchanger still bring 30% more milk to temperature? And is the pasteuriser the real bottleneck, or will the filler downstream limit output anyway?',
        rubric: [
          'Links more flow to a shorter residence (holding) time',
          'Asks whether heating capacity keeps up at the higher flow',
          'Checks whether this step is really the bottleneck',
        ],
      },
      sayIt: 'Explain the difference between batch and continuous processing to a new colleague in 60 seconds.',
      terms: [
        { term: 'Unit operation', def: 'A basic physical process step, such as pumping, heating, mixing, separating, drying or reacting.' },
        { term: 'Batch process', def: 'A fixed amount processed step by step in a vessel and released as one lot.' },
        { term: 'Continuous process', def: 'Material flows in and out non-stop and the plant runs at steady state.' },
        { term: 'Residence time', def: 'Average time material spends in a step: volume divided by flow.' },
      ],
    },
    {
      id: 'eng.process.variables',
      title: 'Pressure, flow, level and temperature',
      pre: [
        {
          q: 'A pressure gauge on a vessel reads 2 bar. Like almost all gauges, it shows pressure relative to the air around it. The plant is at sea level. What is the absolute pressure inside, roughly?',
          options: ['2 bar', 'About 3 bar', '1 bar', '0 bar'],
          answer: 'About 3 bar',
          why: 'Absolute pressure = gauge pressure + about 1 bar of atmospheric pressure.',
        },
      ],
      teach: [
        'Four variables run most process plants: pressure, temperature, flow and level. Pressure is in bar (or kPa; psi on American equipment). Gauge pressure, bar(g), is relative to the air around you; absolute pressure, bar(a), is relative to vacuum. Absolute = gauge + about 1 bar at sea level. Vacuum shows as a negative gauge pressure or a low absolute one. When a number is quoted, ask which.',
        'Flow is volume per time (m³/h, l/min) or mass per time (kg/h, t/h). Mass flow = volume flow × density. Water is about 1,000 kg/m³, so 1 m³/h is about 1,000 kg/h; a syrup of 1,300 kg/m³ gives 1,300 kg/h. Recipes and balances work in mass, so ask what a meter shows. Common meters: magnetic (conductive liquids), Coriolis (measures mass flow directly, accurate, expensive), vortex and differential pressure.',
        'Level is measured with a pressure sensor at the bottom, radar from the top, or a float. A pressure sensor really measures the weight of the liquid column: if the density differs from what it was set up for, the height reading is off, though the mass it implies is still right. Foam can fool radar. When a level reads oddly, ask what principle the meter uses.',
        'Temperature: a difference of 1 °C equals 1 K, so heat calculations with differences can use °C. Sensors are mostly Pt100 resistance sensors (accurate, up to about 600 °C) or thermocouples (wider range, less accurate). A sensor in a protective pocket (thermowell) in a slow-flowing pipe can lag the real temperature by minutes.',
      ],
      example: {
        kind: 'worked',
        text: 'A tank has a pressure-based level meter set up for water (1,000 kg/m³). It now holds syrup of 1,250 kg/m³ to a real height of 2.0 m. The pressure at the bottom is 1,250 × 9.81 × 2.0 = 24,525 Pa. The meter divides by the density of water: 24,525 / (1,000 × 9.81) = 2.5 m. The screen shows 2.5 m while the real level is 2.0 m, so the high-level alarm may trip early and the tank looks fuller than it is. The mass the meter implies is still correct, because pressure × tank area / g is the weight of what is in it. The fix: enter the right density, or read the tank in kg.',
      },
      said: 'What engineers say: “That level transmitter is set up for water. With syrup it reads half a metre high, so don’t trust the alarm.”',
      recall: [
        {
          q: 'A pressure gauge on a steam line reads 6 bar(g). The plant is at sea level, where atmospheric pressure is about 1 bar. What is the absolute pressure, in bar(a)?',
          number: 7,
          tolerance: 0.1,
          unit: 'bar(a)',
          why: 'Absolute = gauge + atmospheric = 6 + 1 = about 7 bar(a).',
        },
        {
          q: 'A flow meter shows 12 m³ per hour of a liquid with a density of 1,100 kg/m³. What is the mass flow, in kg per hour?',
          number: 13200,
          tolerance: 50,
          unit: 'kg/h',
          why: 'Mass flow = volume flow × density = 12 × 1,100 = 13,200 kg per hour.',
        },
        {
          q: 'Which type of flow meter measures mass flow directly?',
          options: ['A magnetic flow meter', 'A Coriolis meter', 'A vortex meter', 'A float in a glass tube'],
          answer: 'A Coriolis meter',
          why: 'A Coriolis meter measures mass flow directly; the others measure velocity or volume and need the density to give mass.',
        },
        {
          q: 'A product is heated from 20 °C to 80 °C. What is the temperature difference, in kelvin?',
          options: ['60 K', '333 K', '353 K', '80 K'],
          answer: '60 K',
          why: 'A difference of 1 °C equals 1 K, so a 60 °C rise is a 60 K rise.',
        },
      ],
      situation: {
        scene: 'You’re at a soft-drink client. Syrup batches come out about 3% low on sugar content, again and again. The recipe adds sugar by weight on a scale and water by a flow meter that totals cubic metres.',
        ask: 'What do you ask?',
        model: 'What kind of flow meter is on the water, and when was it last calibrated? It totals volume: is the recipe written in volume or in kg, and at what temperature is the water? Does anything else add water, such as rinse water or a line flush into the batch? And how is the sugar content measured: same lab method and temperature every time?',
        rubric: [
          'Asks about the meter type and its calibration',
          'Separates volume from mass and checks density or temperature',
          'Looks for hidden extra streams and checks the measurement of the result',
        ],
      },
      sayIt: 'Explain to a new planner in 60 seconds why “bar” and “cubic metres per hour” always need a second question.',
      terms: [
        { term: 'bar(g) and bar(a)', def: 'Gauge pressure (relative to the surrounding air) and absolute pressure (relative to vacuum); absolute is about 1 bar higher.' },
        { term: 'Mass flow', def: 'Kilograms per unit of time: volume flow × density.' },
        { term: 'Coriolis meter', def: 'A flow meter that measures mass flow directly; accurate and widely used for dosing.' },
        { term: 'Pt100', def: 'A common, accurate resistance temperature sensor.' },
      ],
    },
    {
      id: 'eng.process.mass',
      title: 'Mass balance and yield',
      pre: [
        {
          q: 'An evaporator takes in 1,000 kg of juice with 12% dry matter and removes water until the concentrate has 60% dry matter. No dry matter is lost. How much concentrate comes out?',
          options: ['200 kg', '600 kg', '120 kg', '480 kg'],
          answer: '200 kg',
          why: 'The 120 kg of dry matter passes through untouched; 120 kg is 60% of 200 kg.',
        },
      ],
      teach: [
        'Mass is conserved: what goes in comes out or stays inside. In formula: in = out + accumulation. In a continuous plant at steady state nothing accumulates, so in = out. A mass balance is the first tool of a process engineer: draw a box around a step, list every stream in and out, and check that the numbers close.',
        'Balance each component too. Water, sugar, solids or salt each balance on their own, as long as nothing reacts. The trick in most problems is the component that passes through untouched: the dry matter in an evaporator, the solids in a dryer. It fixes the size of the other streams.',
        'Yield is useful output divided by input: kg of good product per kg of raw material. A balance that doesn’t close is a finding. If 2% of the mass is missing, look for a leak, a meter error, product going to drain, or material sitting in tanks and pipes. Losses hide in rinse water, filter cake, start-up product and lab samples.',
        'Ask for balances in mass, not volume. Volumes change with temperature and mixing: 1 litre of water plus 1 litre of ethanol gives about 1.92 litres, not 2. Mass always adds up. And check that the stock in tanks at the start and end of the period is counted, or a full tank looks like a loss.',
      ],
      example: {
        kind: 'worked',
        text: 'A syrup step dissolves 1,000 kg of sugar in 500 kg of water per batch: 1,500 kg in. Out: 1,440 kg of syrup on the load cells and 30 kg of filter cake: 1,470 kg. Missing: 30 kg, 2% of the input. Yield of syrup on input: 1,440 / 1,500 = 96%. Where do the 30 kg go? The batch is heated to 85 °C in an open vessel, so some water evaporates. A sugar balance settles it: if all 1,000 kg of sugar is in the syrup and the cake, the missing mass is water, and the syrup is slightly stronger than the recipe. If sugar is missing too, look for spills or product left in the lines.',
      },
      said: 'What engineers say: “The balance doesn’t close by 2%. Before we call it a loss, let’s do it on dry matter.”',
      recall: [
        {
          q: 'A dryer takes in 500 kg per hour of wet powder containing 20% water. The dried powder leaves with 4% water, and all solids leave with the powder. How many kg of dried powder leave per hour?',
          number: 416.7,
          tolerance: 1,
          unit: 'kg/h',
          why: 'Solids = 80% of 500 = 400 kg/h. They are 96% of the dried powder: 400 / 0.96 = 416.7 kg/h.',
        },
        {
          q: 'One batch uses 2,000 kg of raw material and gives 1,700 kg of good product. What is the yield, in percent?',
          number: 85,
          tolerance: 0.5,
          unit: '%',
          why: 'Yield = good output / input = 1,700 / 2,000 = 85%.',
        },
        {
          q: 'Over a week, the mass balance of a mixing tank does not close: 1.5% of the input is missing. What is the right first step?',
          options: ['Book it as process loss and move on', 'Check the meters, the stock change in the tanks and every small stream such as rinse water and samples', 'Replace the tank', 'Blame the night shift'],
          answer: 'Check the meters, the stock change in the tanks and every small stream such as rinse water and samples',
          why: 'Most gaps come from measurement, stock changes or forgotten streams; only then is it a real loss.',
        },
        {
          q: 'Why do process engineers balance in mass rather than in volume?',
          options: ['Mass is conserved; volume changes with temperature and mixing', 'Mass meters are cheaper', 'Volume cannot be measured in a plant', 'Customers buy by mass only'],
          answer: 'Mass is conserved; volume changes with temperature and mixing',
          why: 'Only mass is guaranteed to add up; volumes can shrink or grow.',
        },
      ],
      situation: {
        scene: 'You’re at a sauce maker. Finance says the line uses 5% more tomato paste than the recipe over the last quarter. The production manager says the recipe is “just theory”.',
        ask: 'What do you ask to find the 5%?',
        model: 'Can we draw a mass balance over the line for a week: paste in by weight, product out by weight, plus rejects, start-up and end-of-run product, rinse water and samples? Is the paste dosed by weight or by volume, and when was that checked? Are tank stocks counted at the start and end of each period? And does the 5% vary by shift or product, which would point to a practice rather than the recipe?',
        rubric: [
          'Proposes a mass balance over the line with all streams',
          'Checks how the paste is dosed and measured',
          'Asks for stock changes and a split by shift or product',
        ],
      },
      sayIt: 'Explain to a production manager in 60 seconds what a mass balance is and why it finds losses.',
      terms: [
        { term: 'Mass balance', def: 'In = out + accumulation, for the total and for each component.' },
        { term: 'Steady state', def: 'A continuous process where nothing changes over time, so nothing accumulates.' },
        { term: 'Yield', def: 'Useful output divided by input, usually in kg per kg.' },
        { term: 'Tie component', def: 'A component that passes through unchanged, such as dry matter, and fixes the other streams.' },
      ],
    },
    {
      id: 'eng.process.energy',
      title: 'Energy balance: heating, cooling, evaporating',
      pre: [
        {
          q: 'Which takes more energy: heating 1 kg of water from 20 to 100 °C, or turning 1 kg of water at 100 °C into steam?',
          options: ['Heating it from 20 to 100 °C', 'Turning it into steam, by about seven times', 'Both take the same', 'Neither takes energy'],
          answer: 'Turning it into steam, by about seven times',
          why: 'Heating takes about 4.2 × 80 = 336 kJ; evaporating takes about 2,260 kJ.',
        },
      ],
      teach: [
        'Energy is conserved too. What goes in as steam, gas, electricity or hot product comes out somewhere: as heat in the product, losses to the surroundings, or warm cooling water. An energy balance tells you how much heating or cooling a step needs, and where the energy leaks away.',
        'Sensible heat changes temperature: Q = m × cp × ΔT. For water, cp is about 4.2 kJ per kg per °C; many watery foods sit around 3.5 to 4; oils around 2. Heating 1,000 kg of water by 50 °C takes 1,000 × 4.2 × 50 = 210,000 kJ. One kWh is 3,600 kJ, so that is about 58 kWh.',
        'Latent heat changes the phase at constant temperature. Evaporating 1 kg of water at 100 °C takes about 2,260 kJ, almost seven times what it took to heat it from 20 to 100 °C. That is why evaporators and dryers eat energy, and why removing water mechanically first (pressing, membranes, centrifuges) is far cheaper than boiling it off.',
        'Power is energy per time: 1 kW is 1 kJ per second. To heat 2 kg per second by 10 °C you need 2 × 4.2 × 10 = 84 kW. Turning energy into power tells you whether a heater, boiler or chiller is big enough. The classic saving is heat recovery: using a hot outgoing stream to preheat the cold incoming one.',
      ],
      example: {
        kind: 'worked',
        text: 'A pasteuriser heats 10,000 kg per hour of milk (cp 3.9 kJ per kg per °C) from 4 to 72 °C. Without heat recovery: 10,000 × 3.9 × 68 = 2,652,000 kJ per hour; divided by 3,600 that is about 737 kW, all from hot water or steam. In practice, a regeneration section uses the hot pasteurised milk to warm the cold incoming milk, say from 4 to 65 °C, and cools the outgoing milk at the same time. The heater then only covers 65 to 72 °C: 10,000 × 3.9 × 7 / 3,600 = about 76 kW. Heat recovery cuts the heating need by about 90%.',
      },
      said: 'What engineers say: “Don’t look at the heater first. Look at the regen section. If it fouls, the heater has to do the work.”',
      recall: [
        {
          q: 'You heat 500 kg of water from 15 °C to 75 °C. Use cp = 4.2 kJ per kg per °C and ignore losses. How much energy does that take, in kWh? (1 kWh = 3,600 kJ.)',
          number: 35,
          tolerance: 0.5,
          unit: 'kWh',
          why: '500 × 4.2 × 60 = 126,000 kJ; 126,000 / 3,600 = 35 kWh.',
        },
        {
          q: 'A continuous heater warms 3 kg per second of product with cp 4.0 kJ per kg per °C by 20 °C. Ignore losses. What heater power is needed, in kW?',
          number: 240,
          tolerance: 2,
          unit: 'kW',
          why: '3 × 4.0 × 20 = 240 kJ per second = 240 kW.',
        },
        {
          q: 'Why does drying by evaporation take so much energy?',
          options: ['Dryers are badly insulated', 'Evaporating water needs a large amount of latent heat per kg', 'Powder has a high specific heat', 'The fans use most of it'],
          answer: 'Evaporating water needs a large amount of latent heat per kg',
          why: 'About 2,260 kJ per kg of water evaporated, far more than heating it.',
        },
        {
          q: 'A plant wants to cut the heating energy of a continuous pasteuriser. Which measure usually saves the most?',
          options: ['Raise the temperature setpoint', 'Use the hot outgoing product to preheat the cold incoming product', 'Install a bigger pump', 'Use a faster temperature sensor'],
          answer: 'Use the hot outgoing product to preheat the cold incoming product',
          why: 'Heat recovery can cover most of the heating duty, as in the regeneration section of a pasteuriser.',
        },
      ],
      situation: {
        scene: 'You’re at a dairy ingredients plant. The evaporator can’t keep up and the engineering manager asks for a €2 million bigger boiler.',
        ask: 'What do you ask first?',
        model: 'How much steam does the evaporator use per kg of water removed, and how does that compare with its design and with last year? Is it fouled, and how often is it cleaned? Is the condensate returned to the boiler? And could more water come out before the evaporator, with membranes, which costs far less energy per kg than boiling it off?',
        rubric: [
          'Asks for steam use per kg of water evaporated against design',
          'Checks fouling, cleaning and condensate return',
          'Raises removing water mechanically before evaporating',
        ],
      },
      sayIt: 'Explain to an operations manager in 60 seconds why evaporating water costs so much more energy than heating it.',
      terms: [
        { term: 'Sensible heat', def: 'Heat that changes temperature: mass × specific heat × temperature change.' },
        { term: 'Latent heat', def: 'Heat that changes phase at constant temperature; about 2,260 kJ per kg to evaporate water.' },
        { term: 'Specific heat (cp)', def: 'Energy to warm 1 kg by 1 °C; about 4.2 kJ for water.' },
        { term: 'Heat recovery', def: 'Using a hot outgoing stream to warm a cold incoming one.' },
      ],
    },
    {
      id: 'eng.process.batch',
      title: 'Batch cycles and capacity',
      pre: [
        {
          q: 'A reactor’s batch cycle: fill 30 minutes, heat 60, react 120, cool 45, empty 15, clean 30. Which saving raises output per day the most?',
          options: ['20 minutes off the reaction, because it is the core step', '20 minutes off cleaning, because cleaning is waste', 'Any 20 minutes saved anywhere in the cycle gives the same gain', 'Only saving on heating counts'],
          answer: 'Any 20 minutes saved anywhere in the cycle gives the same gain',
          why: 'Output depends on the total cycle time; every minute counts the same.',
        },
      ],
      teach: [
        'A batch vessel produces in cycles. The cycle time is everything between two starts: fill, heat, react or mix, cool, empty, clean, and the waiting for an operator, a lab result or a free tank downstream. Capacity per vessel = batch size / cycle time. A 5-hour cycle of 4 tonnes gives 0.8 tonnes per hour, about 19 tonnes per day if it runs around the clock.',
        'Every minute in the cycle counts the same. Engineers like to shorten the reaction step, but filling, emptying, cleaning and waiting for QC release often take a third of the cycle and are easier to cut: bigger pumps, preheated raw materials, steps in parallel, faster lab tests or an inline measurement.',
        'With several vessels in a row, the bottleneck is the stage with the longest time per batch, divided by the number of parallel vessels at that stage. A 6-hour reactor feeding a 3-hour filter gives one batch per 6 hours. Add a second reactor and the plant makes a batch every 3 hours, as long as the filter keeps pace.',
        'Recipes are often run to a standard called ISA-88: a recipe is a sequence of phases (charge, heat, hold, transfer) with set values, run by the control system. Ask for the batch reports: actual time per phase over the last 50 batches. The gap between the fastest and slowest batches is often the biggest capacity gain on site.',
      ],
      example: {
        kind: 'worked',
        text: 'A paint mixing vessel makes 3,000 kg per batch. Cycle: fill 40 minutes, disperse 90, wait for the QC sample 50, adjust 20, fill off 60, clean 40: 300 minutes. Capacity: 3,000 kg / 5 hours = 600 kg per hour. The QC wait is long because the lab serves the whole site. An inline viscosity meter plus a fast-track sample slot cuts the wait to 15 minutes. New cycle: 265 minutes, so 3,000 / 4.417 hours = 679 kg per hour: 13% more from the same vessel, without touching the dispersing step.',
      },
      said: 'What engineers say: “The reactor isn’t slow. It sits for 50 minutes waiting for the lab every batch.”',
      recall: [
        {
          q: 'A vessel makes batches of 6,000 kg. One full cycle, from the start of filling to the next start of filling, takes 4 hours. It runs 24 hours a day without interruptions. How many kg does it make per day?',
          number: 36000,
          tolerance: 100,
          unit: 'kg/day',
          why: '24 / 4 = 6 batches per day × 6,000 kg = 36,000 kg.',
        },
        {
          q: 'A vessel makes batches of 6,000 kg with a 240-minute cycle. Cleaning is cut from 60 to 30 minutes and nothing else changes. By how many percent does output per day rise?',
          number: 14.3,
          tolerance: 0.5,
          unit: '%',
          why: 'The cycle goes from 240 to 210 minutes; 240 / 210 = 1.143, so about 14.3% more batches per day.',
        },
        {
          q: 'Two stages in a row, same batch size: one reactor taking 6 hours per batch, then one filter taking 2.5 hours per batch. A second identical reactor is added; both share the filter. How often does a batch now leave the plant, at best?',
          options: ['Every 2.5 hours', 'Every 3 hours', 'Every 6 hours', 'Every 8.5 hours'],
          answer: 'Every 3 hours',
          why: 'Two reactors give one batch per 6 / 2 = 3 hours; the filter at 2.5 hours keeps up, so the reactor stage still sets the pace.',
        },
        {
          q: 'What is the best first data source to find hidden capacity in a batch plant?',
          options: ['The vessel nameplates', 'Batch reports with actual phase times over many batches', 'The original design study', 'The maintenance budget'],
          answer: 'Batch reports with actual phase times over many batches',
          why: 'They show where time really goes and how far the slow batches are from the fast ones.',
        },
      ],
      situation: {
        scene: 'You’re at a specialty chemicals client. The site wants a third reactor for €1.2 million, because the two existing reactors are “always full”.',
        ask: 'What do you ask before the investment goes to the board?',
        model: 'Can we see the batch reports for the last few months, with time per phase? How much of the cycle is filling, emptying, cleaning and waiting for QC release, and how big is the gap between the fastest and slowest batches? Is the reactor really the bottleneck, or do the filter, dryer or packing hold batches up? Cutting waiting may give the extra capacity for a fraction of €1.2 million.',
        rubric: [
          'Asks for actual phase times from batch reports',
          'Looks at non-reaction time: filling, cleaning, waiting for release',
          'Checks whether a downstream stage is the real bottleneck',
        ],
      },
      sayIt: 'Explain to a plant manager in 60 seconds why a batch plant often has capacity hidden in waiting and cleaning time.',
      terms: [
        { term: 'Batch cycle time', def: 'Time from one batch start to the next on the same vessel, waiting included.' },
        { term: 'Phase', def: 'One step of a batch recipe, such as charge, heat or transfer (ISA-88 term).' },
        { term: 'CIP', def: 'Cleaning in place: cleaning tanks and pipes without taking them apart.' },
        { term: 'QC release', def: 'The lab approval a batch needs before it may go to the next step.' },
      ],
    },
    {
      id: 'eng.process.scaleup',
      title: 'From lab to plant: scale-up',
      pre: [
        {
          q: 'A stirred vessel is made twice as large in every dimension, same shape. Its volume rises 8 times. By how much does its wall area, which is used for cooling, rise?',
          options: ['2 times', '4 times', '8 times', '16 times'],
          answer: '4 times',
          why: 'Area grows with size squared (2 × 2 = 4), volume with size cubed (2 × 2 × 2 = 8).',
        },
      ],
      teach: [
        'A recipe that works in a 2-litre glass flask often misbehaves in a 10 m³ reactor. Scale-up is the path from lab to pilot plant to production, and it fails on what doesn’t grow in proportion: heat transfer, mixing and time.',
        'Volume grows with size cubed, surface with size squared. Make a vessel ten times larger in every dimension and its volume rises 1,000-fold, its wall area only 100-fold: per kg of product there is ten times less cooling surface. A reaction that gives off heat (exothermic) is easy to control in the lab and can overheat in the plant. Plants add cooling coils, external coolers or slower dosing.',
        'Mixing time grows with scale. In a flask everything is mixed in seconds; in a big tank it can take a minute or more. If a reaction runs faster than the mixing, you get local hot spots or local excess of a reagent, and with that by-products. Where you dose, the type of stirrer and its speed matter more in the plant than in the lab.',
        'So scale-up goes in steps: lab, a pilot plant (often 50 to 500 litres), then production, with test batches and extra sampling at each step. Useful questions: “Which is the slowest step here: the reaction, the heat removal or the mixing?” and “What changed between the pilot and the plant?”',
      ],
      example: {
        kind: 'worked',
        text: 'A reaction is scaled from a 10-litre lab reactor to a 10 m³ plant reactor of the same shape: volume × 1,000, so every dimension × 10 and wall area × 100. In the lab, dosing the reagent over 1 hour released 0.5 kW, easily removed. In the plant the same dosing time releases 1,000 × 0.5 = 500 kW. The jacket has 25 m² and removes at most 10 kW per m² at full cooling water flow: 250 kW. The solution: dose twice as slowly, over 2 hours, so the heat release halves to 250 kW. The batch gets an hour longer: a scale-up cost that belongs in the capacity plan.',
      },
      said: 'What engineers say: “In the lab it’s mixing-limited at worst. In the plant it’s heat-limited, so the dosing rate is set by the jacket.”',
      recall: [
        {
          q: 'A vessel is scaled up 3 times in every dimension, keeping the same shape. By what factor does its volume grow?',
          number: 27,
          tolerance: 0.1,
          unit: 'times',
          why: 'Volume grows with size cubed: 3 × 3 × 3 = 27.',
        },
        {
          q: 'The same vessel, scaled up 3 times in every dimension: what happens to the wall area per m³ of volume?',
          options: ['It stays the same', 'It becomes one third', 'It triples', 'It becomes one ninth'],
          answer: 'It becomes one third',
          why: 'Area × 9, volume × 27: area per volume = 9 / 27 = one third.',
        },
        {
          q: 'Why can a heat-releasing reaction run fine in the lab but overheat in the plant?',
          options: ['Plant raw materials are always worse', 'The cooling surface per kg of product drops as the vessel gets bigger', 'Plant thermometers are less accurate', 'Plant operators dose faster'],
          answer: 'The cooling surface per kg of product drops as the vessel gets bigger',
          why: 'Heat release grows with volume, cooling with area; the gap widens with size.',
        },
        {
          q: 'In a large tank, a reaction runs faster than the mixing. What is the typical result?',
          options: ['A faster, cleaner reaction', 'Local excess of a reagent and hot spots, giving more by-products', 'No effect at all', 'Lower energy use'],
          answer: 'Local excess of a reagent and hot spots, giving more by-products',
          why: 'Where the reagent enters, it reacts before it is spread out.',
        },
      ],
      situation: {
        scene: 'You’re at a chemicals client moving a new product from the pilot plant to production. The first two plant batches ran hotter than planned and have twice the by-product level of the pilot batches.',
        ask: 'What do you ask the process engineer?',
        model: 'What changed between pilot and plant: the dosing time, the dosing point, the stirrer type and speed, the cooling capacity per kg? Was the dosing rate scaled with the jacket’s heat removal, or kept the same as in the pilot? Where was the temperature measured, and could there be hot spots near the dosing point? Can we run the next batch with slower dosing and extra samples to see whether the by-product follows the temperature?',
        rubric: [
          'Asks what changed between pilot and plant (dosing, mixing, cooling)',
          'Links the overheating to heat removal not keeping up with heat release',
          'Proposes a controlled test batch with slower dosing and extra sampling',
        ],
      },
      sayIt: 'Explain to a commercial manager in 60 seconds why a lab recipe can’t just be multiplied by a thousand.',
      terms: [
        { term: 'Scale-up', def: 'Moving a process from lab to pilot to production size.' },
        { term: 'Pilot plant', def: 'A small production-like installation to test a process before full scale.' },
        { term: 'Exothermic', def: 'A reaction that releases heat and must be cooled.' },
        { term: 'Surface-to-volume ratio', def: 'Area per unit of volume; it falls as equipment gets bigger.' },
      ],
    },
  ],
};
