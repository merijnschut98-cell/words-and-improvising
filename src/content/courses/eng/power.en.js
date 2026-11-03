// eng.power (EN): Motors, drives and fluid power: power and energy, induction motors, starting and drives, compressed air, hydraulics, plant energy.
export default {
  lessons: [
    {
      id: 'eng.power.basics',
      title: 'Power, energy and three-phase',
      pre: [
        {
          q: 'A motor draws 15 kW of electrical power, steadily, for 8 hours. How much energy has it used?',
          options: ['15 kWh', '120 kWh', '1.9 kWh', '120 kW'],
          answer: '120 kWh',
          why: 'Energy = power × time = 15 kW × 8 h = 120 kWh.',
        },
      ],
      teach: [
        'Power is the rate of using energy, in watts or kilowatts. Energy is power × time, in kWh. A motor drawing 15 kW for 8 hours uses 120 kWh.\n\nThe energy bill charges kWh; the grid connection and peak charges are about kW. Mixing the two up is the most common error in energy discussions.',
        'Efficiency is useful output divided by input. A motor at 93% turns 93% of its electrical input into shaft power; the rest becomes heat. Losses multiply along a chain: motor 93%, gearbox 95%, pump 70% gives 0.93 × 0.95 × 0.70 = 62% from the plug to the water.',
        'Industry runs on three-phase alternating current: in Europe 400 V between phases at 50 Hz (230 V between a phase and neutral). The electrical power of a three-phase load is √3 × voltage × current × power factor. A motor drawing 30 A at 400 V with a power factor of 0.85 takes about 17.7 kW.',
        'Power factor (cos φ) says how much of the current does useful work. Lightly loaded motors have a low power factor and lower efficiency.\n\nA motor nameplate gives the rated power, which is the mechanical output at the shaft, not the electrical input, plus voltage, current, speed, power factor and efficiency class. When someone quotes “kW”, ask: shaft output or electrical input?',
      ],
      example: {
        kind: 'worked',
        text: 'A cooling-water pump must deliver 11 kW of hydraulic power whenever it runs, 6,000 hours a year. The pump is 70% efficient and the motor 92%.\n\nElectrical input: 11 / (0.70 × 0.92) = 17.1 kW. Yearly energy: 17.1 × 6,000 = 102,600 kWh. At €0.15 per kWh that is about €15,400 a year, likely more than the pump cost to buy.\n\nA pump at 80% instead of 70% would need 11 / (0.80 × 0.92) = 14.9 kW: about 13,000 kWh and €2,000 a year less. Efficiency is a running cost, not a spec-sheet detail.',
      },
      said: 'What engineers say: “It’s a fifteen kW motor, but it’s only drawing nine. That’s nine kW, not fifteen, and it’s running at a lousy power factor.”',
      recall: [
        {
          q: 'A machine draws 22 kW of electrical power whenever it runs. It runs 4,000 hours a year at that load. How much energy does it use per year, in kWh?',
          number: 88000,
          tolerance: 100,
          unit: 'kWh/year',
          why: '22 kW × 4,000 h = 88,000 kWh a year.',
        },
        {
          q: 'A three-phase motor draws 50 A at 400 V with a power factor of 0.8. Using P = √3 × U × I × cos φ (√3 ≈ 1.732), what electrical power does it take, in kW?',
          number: 27.7,
          tolerance: 0.3,
          unit: 'kW',
          why: '1.732 × 400 × 50 × 0.8 = 27,713 W, about 27.7 kW.',
        },
        {
          q: 'A drive chain has a motor at 95% efficiency and a gearbox at 90%. What is the overall efficiency of the chain, in percent?',
          number: 85.5,
          tolerance: 0.5,
          unit: '%',
          why: '0.95 × 0.90 = 0.855, so 85.5%.',
        },
        {
          q: 'A motor nameplate says 30 kW. What does that number mean?',
          options: ['The electrical power it always draws', 'The rated mechanical output at the shaft', 'The peak power at start-up', 'Its yearly energy use in kWh'],
          answer: 'The rated mechanical output at the shaft',
          why: 'Motor ratings are shaft output; the electrical input is higher by the losses.',
        },
      ],
      situation: {
        scene: 'You’re at a plant. In an energy meeting someone says: “Our three compressors are 75 kW each, so that’s 225 kW times 8,760 hours: almost 2 million kWh a year.”',
        ask: 'What do you ask?',
        model: 'Is 75 kW the nameplate rating at the shaft, or measured electrical input? Do all three run all year, and at full load? Compressors load and unload; the real energy depends on the hours at each load. Can we put a meter on the compressor room for two weeks? That gives real kWh, and it shows the base load at weekends.',
        rubric: [
          'Separates nameplate kW from measured electrical input',
          'Questions the hours and the load assumption',
          'Proposes measuring kWh over a period',
        ],
      },
      sayIt: 'Explain to a controller in 60 seconds the difference between kW and kWh, and why both matter on the bill.',
      terms: [
        { term: 'kW and kWh', def: 'Power (rate of energy use) and energy (power × time).' },
        { term: 'Efficiency', def: 'Useful output divided by input; losses along a chain multiply.' },
        { term: 'Power factor (cos φ)', def: 'The share of the current that does useful work.' },
        { term: 'Three-phase', def: 'The industrial supply: three alternating voltages, in Europe 400 V between phases at 50 Hz.' },
      ],
    },
    {
      id: 'eng.power.motors',
      title: 'Induction motors',
      pre: [
        {
          q: 'A 4-pole motor runs on the 50 Hz grid. Its nameplate says 1,460 rpm, not 1,500. Why?',
          options: ['It is a faulty motor', 'Slip: the rotor always turns a little slower than the magnetic field', 'The grid frequency is too low', 'The nameplate is rounded wrongly'],
          answer: 'Slip: the rotor always turns a little slower than the magnetic field',
          why: 'An induction motor needs slip to induce current in its rotor and make torque.',
        },
      ],
      teach: [
        'The three-phase induction motor (also called asynchronous or squirrel-cage motor) drives most pumps, fans, conveyors and compressors: robust, cheap, little maintenance. The stator windings make a rotating magnetic field; the rotor is dragged along with it. Its speed is set by the grid frequency and the number of poles.',
        'Synchronous speed = 120 × frequency / number of poles. At 50 Hz: 2 poles give 3,000 rpm, 4 poles 1,500, 6 poles 1,000.\n\nThe rotor always runs a little slower: the slip, typically 1 to 5%. A 4-pole motor turns at about 1,450 to 1,480 rpm, and more load means a little more slip.',
        'Torque and power are linked by speed: power (kW) = torque (Nm) × speed (rpm) / 9,550. A 15 kW motor at 1,460 rpm delivers about 98 Nm. A gearbox lowers the speed and raises the torque by the same ratio, minus its losses.',
        'Efficiency classes run from IE1 to IE5 (IEC 60034-30-1). EU Regulation 2019/1781 requires at least IE3 for most new motors from 0.75 to 1,000 kW (since July 2021), and IE4 for most 75 to 200 kW motors (since July 2023).\n\nMost motor failures are bearings and winding insulation. Heat kills insulation: as a rule of thumb, every 10 °C above its rating roughly halves winding life. Ask about motor temperature, vibration and how often it starts.',
      ],
      example: {
        kind: 'worked',
        text: 'A fan motor: 4 poles, 50 Hz, 30 kW, nameplate 1,470 rpm. Slip = (1,500 − 1,470) / 1,500 = 2%. Rated torque = 30 × 9,550 / 1,470 = 195 Nm.\n\nIt is an old IE1 motor at about 90% efficiency, running 6,000 hours a year at 25 kW shaft output. Electrical input: 25 / 0.90 = 27.8 kW. A new IE3 motor at about 93.6%: 25 / 0.936 = 26.7 kW.\n\nSaving 1.1 kW × 6,000 h = about 6,400 kWh, €960 a year at €0.15. Worth doing when the old motor fails; rarely worth replacing a healthy one for that alone.',
      },
      said: 'What engineers say: “That’s a four-pole, so 1,500 synchronous, 1,470 on the plate. If it’s turning 1,420 it’s probably overloaded.”',
      recall: [
        {
          q: 'An induction motor has 6 poles and runs on a 50 Hz supply. What is its synchronous speed, in rpm?',
          number: 1000,
          tolerance: 1,
          unit: 'rpm',
          why: '120 × 50 / 6 = 1,000 rpm.',
        },
        {
          q: 'A 4-pole motor on 50 Hz (synchronous speed 1,500 rpm) runs at 1,440 rpm. What is its slip, in percent?',
          number: 4,
          tolerance: 0.1,
          unit: '%',
          why: '(1,500 − 1,440) / 1,500 = 0.04 = 4%.',
        },
        {
          q: 'A motor delivers 11 kW at its shaft at 1,450 rpm. Using power (kW) = torque (Nm) × speed (rpm) / 9,550, what torque does it deliver, in Nm?',
          number: 72.4,
          tolerance: 1,
          unit: 'Nm',
          why: 'Torque = 11 × 9,550 / 1,450 = 72.4 Nm.',
        },
        {
          q: 'A motor runs 10 °C hotter than its insulation rating allows, continuously. Using the common rule of thumb, what happens to the life of its winding insulation?',
          options: ['No effect', 'It roughly halves', 'It roughly doubles', 'It drops by about 10%'],
          answer: 'It roughly halves',
          why: 'Insulation ageing roughly doubles with every 10 °C rise in temperature.',
        },
      ],
      situation: {
        scene: 'You’re at a distribution centre. After a line speed-up, conveyor motors burn out every few months. Maintenance buys the same motors again.',
        ask: 'What do you ask?',
        model: 'What load do the motors carry now compared with their rating: current measured against the nameplate? Did the speed-up change the gearbox ratio or the load per motor? How hot do they run, and do they start and stop much more often now? Each start heats a motor a lot. Same motor, more load and more starts gives the same failure, faster.',
        rubric: [
          'Asks for measured current or load against the nameplate',
          'Links the speed-up to load, gearing and starts per hour',
          'Raises motor temperature as the failure driver',
        ],
      },
      sayIt: 'Explain to a production manager in 60 seconds how an induction motor’s speed is set and why it slips.',
      terms: [
        { term: 'Induction motor', def: 'The standard three-phase motor; its rotor is dragged along by a rotating magnetic field.' },
        { term: 'Synchronous speed', def: '120 × frequency / number of poles; 1,500 rpm for 4 poles at 50 Hz.' },
        { term: 'Slip', def: 'How much slower the rotor turns than the field, typically 1 to 5%.' },
        { term: 'IE class', def: 'Motor efficiency class from IE1 to IE5; IE3 is the EU minimum for most new motors.' },
      ],
    },
    {
      id: 'eng.power.drives',
      title: 'Starting and controlling motors',
      pre: [
        {
          q: 'A motor is switched straight onto the grid (direct on line). What current does it draw for the first moments of the start?',
          options: ['Less than its rated current', 'About its rated current', 'About 6 to 8 times its rated current', 'About 100 times its rated current'],
          answer: 'About 6 to 8 times its rated current',
          why: 'A standing rotor acts almost like a short-circuited transformer until it speeds up.',
        },
      ],
      teach: [
        'Direct on line (DOL): switch the motor straight onto the grid with a contactor. Simple and cheap, but the starting current is 6 to 8 times the rated current, and the full torque hits the mechanics as a jolt. Fine for small motors; for big ones it can dip the plant voltage and wear belts, couplings and gearboxes.',
        'A soft starter ramps up the voltage over a few seconds, cutting the inrush current and the jolt. It does not change the running speed.\n\nA star-delta starter is the older, cheaper way to cut the starting current, for motors that start without much load. Soft starters also give less starting torque, so a machine that must start under heavy load may stall.',
        'A variable frequency drive (VFD, also called inverter or frequency converter) changes the frequency and so the speed, smoothly. It also starts the motor gently, with full torque available from low speed.\n\nUses: matching pump and fan speed to demand, conveyor speed, process control. Side effects: harmonics on the grid, electrical noise, and sometimes bearing damage; proper cabling and filters handle these.',
        'Servo motors and drives control position and speed precisely, with an encoder feeding back the actual position: robots, pick-and-place, cut-to-length, packaging machines. They are about motion accuracy, not energy saving. Ask what the drive must do: just start, run at variable speed, or position to a tenth of a millimetre.',
      ],
      example: {
        kind: 'worked',
        text: 'A 90 kW crusher motor starts direct on line. Its rated current is about 160 A at 400 V, so the start draws roughly 1,000 to 1,300 A for a few seconds. Each start dips the voltage in the plant: lights flicker and two VFDs elsewhere trip on undervoltage.\n\nA soft starter would cut the inrush to about 3 to 4 times rated, but the crusher often has to start full of material, and a soft starter’s reduced torque may stall it. A VFD limits the current to about rated while giving full torque from standstill. The more expensive device is the one that fits here.',
      },
      said: 'What engineers say: “Every time that crusher starts DOL the whole hall dips. Soft starter won’t pull it loaded; it needs a drive.”',
      recall: [
        {
          q: 'A motor has a rated current of 50 A. Started direct on line, it draws 7 times its rated current at the start. What is the starting current, in A?',
          number: 350,
          tolerance: 1,
          unit: 'A',
          why: '7 × 50 A = 350 A.',
        },
        {
          q: 'Which device lets you run a motor at a different speed continuously?',
          options: ['A contactor', 'A soft starter', 'A variable frequency drive (VFD)', 'A star-delta starter'],
          answer: 'A variable frequency drive (VFD)',
          why: 'Only a VFD changes the supply frequency, which sets the running speed.',
        },
        {
          q: 'A packaging machine must stop a product at an exact position, to a tenth of a millimetre, many times a minute. Which kind of drive fits?',
          options: ['A direct-on-line motor', 'A soft starter', 'A servo motor and drive with position feedback', 'A star-delta starter'],
          answer: 'A servo motor and drive with position feedback',
          why: 'Servos use an encoder to control position precisely; the others don’t control position at all.',
        },
        {
          q: 'A large fan always runs at full speed. Starting it direct on line dips the plant voltage. Which device is the simplest and cheapest that solves the dip?',
          options: ['A soft starter', 'A servo drive', 'A bigger contactor', 'A larger motor'],
          answer: 'A soft starter',
          why: 'A fan starts with little load and needs no speed control, so a soft starter limits the inrush at low cost.',
        },
      ],
      situation: {
        scene: 'You’re at a food client. A machine builder proposes VFDs on all 25 conveyor motors of a new line, “for flexibility”, adding €40,000 to the quote.',
        ask: 'What do you ask?',
        model: 'Which conveyors actually need to change speed in operation, for example to balance the line or for different products, and which run at one fixed speed? For the fixed ones, a direct start or a soft starter may do. What about the harmonics of 25 drives on our supply, and who maintains them? Can the quote show the drives as an option per conveyor?',
        rubric: [
          'Asks which conveyors really need variable speed',
          'Suggests simpler starting for fixed-speed conveyors',
          'Raises side effects and maintenance, and asks for an itemised option',
        ],
      },
      sayIt: 'Explain to a project manager in 60 seconds the difference between a soft starter, a VFD and a servo drive.',
      terms: [
        { term: 'DOL', def: 'Direct on line: switching a motor straight onto the grid; 6 to 8 times rated current at start.' },
        { term: 'Soft starter', def: 'Ramps up the voltage to cut inrush current and jolt; does not change running speed.' },
        { term: 'VFD', def: 'Variable frequency drive: controls speed by changing the frequency.' },
        { term: 'Servo drive', def: 'A drive with position feedback that controls position and speed precisely.' },
      ],
    },
    {
      id: 'eng.power.air',
      title: 'Compressed air: the expensive utility',
      pre: [
        {
          q: 'Of the electrical energy a compressor takes in, roughly how much ends up as useful work at the air tools and cylinders?',
          options: ['About 90%', 'About 50%', 'About 10%', 'Almost all of it'],
          answer: 'About 10%',
          why: 'Most of the input becomes heat in the compressor; leaks and pressure drops take more.',
        },
      ],
      teach: [
        'Compressed air is clean and handy, which is why it is everywhere: cylinders, blow-offs, tools, valves. It is also the most expensive way to deliver energy in a plant.\n\nMost of a compressor’s electricity becomes heat; only around 10% does useful work at the point of use. Recovering the compressor heat wins part of it back. It is not harmless: never blow air at skin or clothes.',
        'Leaks are the big loss. In plants without a leak programme, often 20 to 30% of the compressor output escapes through couplings, hoses and valves.\n\nListen at a weekend: if compressors still run with production stopped, that is mostly leaks. Ultrasonic detectors find them; tagging and fixing them is a classic quick win.',
        'Pressure costs energy: each extra bar of generated pressure costs roughly 7% more compressor energy, and it makes every leak bigger. Many plants run at 7 or 8 bar because one machine needs it. Solve that machine locally (a booster, a bigger supply line, a local tank) and lower the whole network.',
        'Air must be clean and dry: water and oil damage valves and cylinders. A dryer and filters sit after the compressor; an FRL unit (filter, regulator, lubricator) sits before each machine.\n\nInappropriate use is the third loss: open blow-offs, cooling with air, vacuum made with air, where an electric fan or pump would use a fraction of the energy.',
      ],
      example: {
        kind: 'worked',
        text: 'A weekend test: production stopped, nothing should use air. The 75 kW compressor, which delivers 10 m³ of air per minute when loaded, runs loaded 40% of the time. So leaks are about 40% × 10 = 4 m³ per minute.\n\nLeaks run all year. Taking 75 kW as its loaded power draw: 75 kW × 40% × 8,760 hours = about 263,000 kWh, roughly €39,000 a year at €0.15 per kWh, ignoring the unloaded running power.\n\nA leak survey and repair round typically costs a few thousand euros. Then lower the pressure by 1 bar and save roughly another 7%.',
      },
      said: 'What engineers say: “Saturday, nothing running, and the compressor still loads forty percent of the time. That’s our leak bill.”',
      recall: [
        {
          q: 'Weekend test: production is stopped and nothing should use air. The compressor delivers 12 m³ per minute when loaded and runs loaded 25% of the time. What is the average leak flow, in m³ per minute?',
          number: 3,
          tolerance: 0.1,
          unit: 'm³/min',
          why: '25% × 12 = 3 m³ per minute, all of it leaking.',
        },
        {
          q: 'The network pressure is lowered from 8 to 6 bar. Using roughly 7% compressor energy per bar, about how much compressor energy is saved, in percent?',
          number: 14,
          tolerance: 1,
          unit: '%',
          why: '2 bar × 7% per bar = about 14%.',
        },
        {
          q: 'What is the clearest sign of a large leak problem?',
          options: ['The compressor is loud', 'Compressors keep running when production has stopped', 'The air is wet', 'Pressure is high on Monday morning'],
          answer: 'Compressors keep running when production has stopped',
          why: 'With no demand, any air the compressors still deliver is going out through leaks.',
        },
        {
          q: 'One machine needs 7.5 bar; everything else works at 6 bar. The network runs at 8 bar. What is the best approach?',
          options: ['Keep 8 bar for safety', 'Solve that machine locally (booster or bigger supply line) and lower the network pressure', 'Raise the network to 9 bar', 'Add a second compressor'],
          answer: 'Solve that machine locally (booster or bigger supply line) and lower the network pressure',
          why: 'One demanding user shouldn’t set the pressure, and the energy cost, for the whole plant.',
        },
      ],
      situation: {
        scene: 'You’re at a plastics plant. Every afternoon the air pressure drops and machines stop. The maintenance manager wants to buy a third compressor for €60,000.',
        ask: 'What do you ask?',
        model: 'What does the compressor room deliver at a weekend with production stopped: how much is leakage? What uses the extra air in the afternoon: a shift with more machines, blow-offs, cleaning with air guns? Is the pressure dropping at the compressors or only at the far end of the network, which would point to undersized pipes or clogged filters? A leak round and a pipe check may solve it for a fraction of €60,000.',
        rubric: [
          'Asks for the leak level, for example from a weekend test',
          'Asks what drives the afternoon demand and checks inappropriate use',
          'Separates supply shortage from pressure drop in the network',
        ],
      },
      sayIt: 'Explain to a plant manager in 60 seconds why compressed air is so expensive and where to look first.',
      terms: [
        { term: 'Leak test', def: 'Measuring compressor load with production stopped to estimate how much air leaks away.' },
        { term: 'FRL unit', def: 'Filter, regulator and lubricator before a machine, to deliver clean air at the right pressure.' },
        { term: 'Inappropriate use', def: 'Using compressed air where a cheaper source would do, such as open blow-offs or air cooling.' },
      ],
    },
    {
      id: 'eng.power.hydraulics',
      title: 'Hydraulics',
      pre: [
        {
          q: 'A hydraulic cylinder has a piston area of 7,854 mm² (100 mm bore) and works at 200 bar. 1 bar = 0.1 N/mm². Roughly what force does it push with?',
          options: ['1.6 kN', '15.7 kN', '157 kN', '1,570 kN'],
          answer: '157 kN',
          why: '200 bar = 20 N/mm²; 20 × 7,854 = 157,080 N, about 157 kN.',
        },
      ],
      teach: [
        'Hydraulics uses oil under high pressure, typically 100 to 350 bar, to make large forces in a small space: presses, injection moulding machines, excavators, lifting tables.\n\nForce = pressure × piston area. 1 bar is 0.1 N/mm², so 200 bar on a 100 mm piston (7,854 mm²) gives about 157 kN, the weight of 16 tonnes.',
        'A hydraulic pump (gear, vane or piston) makes the flow; the load makes the pressure. Valves steer the oil: directional valves choose where it goes, pressure relief valves cap the pressure, flow control valves set the speed.\n\nCylinder speed = flow / piston area. Accumulators store oil under pressure for fast movements.',
        'Contamination is the main enemy: most hydraulic failures trace back to dirt, water or air in the oil. Cleanliness is coded to ISO 4406 with three numbers such as 18/16/13; lower is cleaner. Good practice: filters chosen for a target code, sealed breathers, oil analysis, and never topping up from an open drum.',
        'Heat is the second enemy. Every pressure drop across a valve turns into heat; oil kept above about 60 °C ages fast and seals harden.\n\nLeaks are a safety issue: a pinhole jet at high pressure can inject oil under the skin, so never feel for leaks by hand, and treat any injection as a medical emergency. Accumulators keep pressure after the pump stops, so making a machine safe includes bleeding them off.',
      ],
      example: {
        kind: 'worked',
        text: 'A press cylinder of 125 mm bore should extend fast, fed by a pump of 60 litres per minute. Piston area: 3.14 / 4 × 125² = 12,272 mm² = 0.01227 m². Flow: 60 litres per minute = 0.001 m³ per second.\n\nExpected speed: 0.001 / 0.01227 = 0.081 m/s, about 81 mm/s. Measured: 60 mm/s, and the oil runs at 70 °C. So about a quarter of the flow is not reaching the cylinder.\n\nLikely causes: a worn pump leaking internally, or a relief valve that opens too early. Both turn the lost flow into heat, which explains the hot oil.',
      },
      said: 'What engineers say: “The cylinder’s slow and the oil’s hot. That flow is going somewhere: worn pump or a relief valve bypassing.”',
      recall: [
        {
          q: 'A cylinder has a piston area of 2,000 mm² and works at 150 bar. 1 bar = 0.1 N/mm². What force does it give, in kN?',
          number: 30,
          tolerance: 0.5,
          unit: 'kN',
          why: '150 bar = 15 N/mm²; 15 × 2,000 = 30,000 N = 30 kN.',
        },
        {
          q: 'A cylinder has a piston area of 0.01 m². The pump sends 0.0005 m³ per second into it, all of the flow. How fast does the piston move, in mm per second?',
          number: 50,
          tolerance: 1,
          unit: 'mm/s',
          why: 'Speed = flow / area = 0.0005 / 0.01 = 0.05 m/s = 50 mm/s.',
        },
        {
          q: 'In a hydraulic system, what sets the pressure?',
          options: ['The size of the pump alone', 'The load the cylinder pushes against, up to the relief valve setting', 'The volume of the oil tank', 'The oil colour'],
          answer: 'The load the cylinder pushes against, up to the relief valve setting',
          why: 'The pump makes flow; pressure builds only as far as the load resists, capped by the relief valve.',
        },
        {
          q: 'A hydraulic machine has an accumulator. Before maintenance, the pump is switched off and locked out. What else must be done?',
          options: ['Nothing, the system is now safe', 'Bleed off the pressure stored in the accumulator', 'Drain the whole oil tank', 'Replace the filters'],
          answer: 'Bleed off the pressure stored in the accumulator',
          why: 'An accumulator holds oil under pressure after the pump stops and can move parts or spray oil. Raised loads must also be supported or lowered.',
        },
      ],
      situation: {
        scene: 'You’re at a metal-forming client. The hydraulic presses need new valves every few months, and maintenance has started buying a more expensive valve brand.',
        ask: 'What do you ask?',
        model: 'What is the oil cleanliness: is there an ISO 4406 target and an oil analysis? How is oil topped up, and are the breathers sealed? What temperature does the oil run at? Most valve failures come from dirty or hot oil, so a better valve in dirty oil fails the same way. Can we send an oil sample and check the filters before buying more valves?',
        rubric: [
          'Asks for oil cleanliness data and a target code',
          'Asks about contamination routes: topping up, breathers, filters',
          'Raises oil temperature and proposes an oil analysis before changing brands',
        ],
      },
      sayIt: 'Explain to an operations manager in 60 seconds how hydraulics makes force, and what usually kills a hydraulic system.',
      terms: [
        { term: 'Pressure relief valve', def: 'A valve that caps the system pressure by opening above a set value.' },
        { term: 'Accumulator', def: 'A vessel that stores oil under pressure; it stays pressurised after the pump stops.' },
        { term: 'ISO 4406', def: 'The code for oil cleanliness, three numbers such as 18/16/13; lower is cleaner.' },
        { term: 'Cylinder speed', def: 'Oil flow divided by piston area.' },
      ],
    },
    {
      id: 'eng.power.energy',
      title: 'Energy in the plant: base load, peaks and kWh per product',
      pre: [
        {
          q: 'A plant measures 900 kW during production and 350 kW on a Sunday with no production at all. What does the 350 kW mainly show?',
          options: ['A meter fault', 'A base load: partly necessary, partly equipment running with nothing to make', 'The power of the office lighting only', 'The grid operator’s losses'],
          answer: 'A base load: partly necessary, partly equipment running with nothing to make',
          why: 'Some base load is needed (cooling, IT, safety); the rest is often compressors, fans and machines left on.',
        },
      ],
      teach: [
        'Start with the load profile: electricity use per 15 minutes over a few weeks, from the utility’s smart meter or the plant’s own meters. Three things stand out: the base load when nothing is produced, the peaks, and how use moves with output.\n\nThe base load is often surprisingly high, and part of it is avoidable: compressors feeding leaks, extraction fans, heaters and idling machines.',
        'Energy (kWh) and peak power (kW) are paid differently. In the Netherlands, larger connections pay the grid operator for the contracted transport capacity in kW and for the monthly peak.\n\nWith grid congestion, extra kW may simply not be available for years. Staggered start-ups, a battery or switching big loads in turn can keep a plant within its contracted capacity.',
        'Measure energy per product: kWh per tonne, per part or per m³. It turns energy from overhead into a process number that teams can steer. Compare shifts, products and lines; the spread between the best and worst runs usually shows the first savings.',
        'The usual order: switch off what isn’t needed (idling, weekends), fix leaks and losses (compressed air, steam), turn down what runs too high (pressure, temperature, speed), recover heat, and only then buy new equipment. Electrifying heat with heat pumps or electric boilers is the big transition topic, but it adds kW the grid may not have.',
      ],
      example: {
        kind: 'worked',
        text: 'A plant draws 1,200 kW in production, two shifts five days a week: 80 hours. The other 88 hours of the week it draws 400 kW with nothing produced. Weekly: 1,200 × 80 = 96,000 kWh in production hours and 400 × 88 = 35,200 kWh with no production, so 27% of all energy is used while nothing is made.\n\nA walk-round at night finds compressors, extraction and two ovens on standby. If half of that 400 kW can be switched off: 200 × 88 × 50 weeks = 880,000 kWh, about €132,000 a year at €0.15, before any investment.',
      },
      said: 'What engineers say: “Before we talk about a heat pump, look at Sunday. Four hundred kW and nobody in the building.”',
      recall: [
        {
          q: 'A plant draws a steady 300 kW base load during 100 hours a week with no production. How much energy does that use per week, in kWh?',
          number: 30000,
          tolerance: 10,
          unit: 'kWh/week',
          why: '300 kW × 100 h = 30,000 kWh per week.',
        },
        {
          q: 'A line uses 45,000 kWh in one week and produces 300 tonnes of product that week. What is its energy use per tonne, in kWh per tonne?',
          number: 150,
          tolerance: 1,
          unit: 'kWh/t',
          why: '45,000 / 300 = 150 kWh per tonne.',
        },
        {
          q: 'A Dutch plant in a congested grid area wants to install a large electric boiler. What is the first question?',
          options: ['Which brand is most efficient', 'Does the contracted transport capacity in kW allow it, or can it run when the grid has room', 'How many kWh it uses per year', 'Which supplier can deliver fastest'],
          answer: 'Does the contracted transport capacity in kW allow it, or can it run when the grid has room',
          why: 'With congestion, the limit is kW capacity on the connection, not the energy price.',
        },
        {
          q: 'What is the usual order of attack on plant energy?',
          options: ['Buy new efficient equipment first', 'Switch off and fix losses first, then turn down, recover heat, and only then invest', 'Start with solar panels', 'Measure only once a year'],
          answer: 'Switch off and fix losses first, then turn down, recover heat, and only then invest',
          why: 'The cheap measures shrink the load, so any later investment can be smaller.',
        },
      ],
      situation: {
        scene: 'You’re at a food client. They want to replace their gas boiler with a 2 MW heat pump to cut CO₂. The grid operator says no extra transport capacity is available until 2030.',
        ask: 'What do you ask?',
        model: 'What is our current contracted capacity and how close is our real peak to it: is there room if we shave peaks or shift loads? How much heat do we really need after fixing losses and recovering heat from the chillers and compressors? Could a smaller heat pump plus heat storage run when the grid has room, with the gas boiler as backup? And has the grid operator offered a flexible or time-bound contract?',
        rubric: [
          'Asks for contracted capacity versus the real peak profile',
          'Reduces the heat demand first: losses and heat recovery',
          'Explores flexible options: smaller unit, storage, flexible grid contract',
        ],
      },
      sayIt: 'Explain to a plant manager in 60 seconds why a load profile is the first step in any energy project.',
      terms: [
        { term: 'Load profile', def: 'Power use over time, usually per 15 minutes, showing base load and peaks.' },
        { term: 'Base load', def: 'Power drawn when nothing is produced.' },
        { term: 'Contracted transport capacity', def: 'The maximum kW the grid operator has agreed to transport for a connection.' },
        { term: 'Energy intensity', def: 'Energy per unit of product, such as kWh per tonne.' },
      ],
    },
  ],
};
