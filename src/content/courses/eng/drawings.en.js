// eng.drawings (EN): Drawings and control: views, GD&T, P&IDs, control loops, PID tuning, PLC and safety.
export default {
  lessons: [
    {
      id: 'eng.drawings.views',
      title: 'Reading a technical drawing',
      pre: [
        {
          q: 'You pick up a drawing at a machine. Where do you look first to know whether it’s the valid one?',
          options: ['The largest view', 'The dimension with the tightest tolerance', 'The revision in the title block', 'The notes on the left'],
          answer: 'The revision in the title block',
          why: 'Most drawing-related scrap comes from someone working to an old revision.',
        },
      ],
      teach: [
        'A part is shown in orthographic views: front, top and side, each looking from one direction. Europe uses first-angle projection, the US third-angle. A small symbol of a cone in the title block tells you which. Mix them up and you mirror the part: the top view sits below the front view in first angle, above it in third angle.',
        'A section view shows the inside: an imaginary cut along a line marked A-A with arrows; hatching marks the cut material. A detail view enlarges a small area, for example “Detail B, scale 5:1”. An isometric view is there for orientation only; you never take dimensions from it.',
        'Scale 1:2 means drawn at half size, 2:1 at double size. Never measure off a print with a ruler: paper stretches and prints get scaled. Use the dimensions. Many drawings say it outright: “do not scale”.',
        'The title block, bottom right, is where you start: part number, name, material, scale, projection symbol, general tolerances (for example ISO 2768-mK), drawn, checked and approved by, and the revision letter. The revision table lists what changed in each revision and when.',
      ],
      example: {
        kind: 'worked',
        text: 'Drawing 4711-203, bracket, S235 steel, scale 1:1, ISO 2768-m, revision C. The revision table: rev B (March 2024) changed hole Ø8.5 to Ø9; rev C (January 2025) changed the bend radius from R2 to R3. At the press brake, the setter works from a printed rev B kept in a plastic sleeve. Result: 400 brackets with R2 bends, rejected at the customer. The fix is not “be more careful”: it’s drawings on a screen at the machine, pulled from the PDM system, so only the current revision exists on the floor.',
      },
      said: 'What engineers say: “Which rev are you working from? Because the R3 came in with rev C and that print says B.”',
      recall: [
        {
          q: 'A drawing has scale 1:5. A line on the paper measures 40 mm. How long is the real feature, in mm, if the print is true to scale?',
          number: 200,
          tolerance: 0.5,
          unit: 'mm',
          why: '1:5 means the drawing is a fifth of real size: 40 × 5 = 200 mm. In practice you read the dimension instead.',
        },
        {
          q: 'What does hatching in a view mean?',
          options: ['The surface must be painted', 'Material that has been cut through in a section', 'A welded area', 'A hidden edge'],
          answer: 'Material that has been cut through in a section',
          why: 'Hatching shows the solid material where the imaginary cut passes.',
        },
        {
          q: 'How do you know whether a drawing uses first-angle or third-angle projection?',
          options: ['From the projection symbol in the title block', 'From the country of the customer', 'From the scale', 'From the number of views'],
          answer: 'From the projection symbol in the title block',
          why: 'The small cone symbol states the convention; never assume it.',
        },
        {
          q: 'A dimension on the drawing has no tolerance. Where do you find what applies?',
          options: ['In the revision table', 'In the isometric view', 'In the material specification', 'In the general tolerance note in the title block'],
          answer: 'In the general tolerance note in the title block',
          why: 'The title block states the general tolerance, such as ISO 2768-m.',
        },
      ],
      situation: {
        scene: 'You’re at a sheet metal supplier after a customer complaint. The production manager says: “We built it exactly to drawing. Their drawing is wrong.”',
        ask: 'What do you ask first?',
        model: 'Which drawing number and revision did we build to, and which revision did the customer order against? Can we check the revision table together? If there’s a mismatch, the next question is how an old print ended up at the machine, and not whose fault it is.',
        rubric: [
          'Asks for drawing number and revision on both sides',
          'Checks the revision table rather than arguing',
          'Looks at the document control system, not at blame',
        ],
      },
      sayIt: 'Explain to a new operator in 60 seconds how to check that a drawing is the right one and where to find the key information.',
      terms: [
        { term: 'Section view', def: 'A view of an imaginary cut through the part, with hatching on cut material.' },
        { term: 'Title block', def: 'Box bottom right with part number, material, scale, tolerances and revision.' },
        { term: 'Revision', def: 'The version of a drawing; each change gets a new letter and a line in the table.' },
        { term: 'First-angle projection', def: 'European view layout; the top view sits below the front view.' },
      ],
    },
    {
      id: 'eng.drawings.gdt',
      title: 'Tolerances on drawings and GD&T',
      pre: [
        {
          q: 'A hole has a position tolerance of Ø0.2 relative to datums A, B and C. What shape is the zone its centre must fall in?',
          options: ['A square of 0.2 × 0.2', 'A circle of Ø0.2', 'A line 0.2 long', 'A rectangle 0.1 × 0.2'],
          answer: 'A circle of Ø0.2',
          why: 'Position zones are round, which matches how a bolt actually fits a hole.',
        },
      ],
      teach: [
        'A ± tolerance controls size. It does not control form (flat, round, straight) or where features sit relative to each other. GD&T (geometric dimensioning and tolerancing; ISO GPS in Europe, ASME Y14.5 in the US) adds that, in a feature control frame: a box with a symbol, a tolerance and the datums it refers to.',
        'Datums A, B and C are the reference features, marked with a triangle. They’re the surfaces the part is located on, like the corner of a room. Primary A: the part rests on it (three points). Secondary B: it’s pushed against it (two points). Tertiary C: one point. The order matters, because that’s how the part sits in the fixture and on the CMM (coordinate measuring machine).',
        'Symbols in plain words. Flatness: the surface lies between two planes 0.05 apart. Perpendicularity: square to a datum. Parallelism: parallel to a datum. Position: the centre of a hole within a round zone around its exact spot. Runout: how much a surface wobbles when the part turns on its axis. Profile: a surface within a band around its ideal shape.',
        'Boxed dimensions are basic: exact theoretical values without ±; the tolerance sits in the frame. A round zone that just encloses a ±0.1 square (Ø0.28) has 57% more area, so more parts that will fit get accepted. An Ⓜ in the frame means maximum material condition (MMC): the hole gets bonus tolerance as it measures bigger.',
      ],
      example: {
        kind: 'worked',
        text: 'A plate has four holes Ø10.2 +0.1/0 for M10 bolts, position Ø0.3 Ⓜ relative to A B C. A is the bottom face, B the long edge, C the short edge. One hole sits at basic 25 from B and 40 from C. The CMM measures its centre 0.12 off in X and 0.09 off in Y. Distance = √(0.12² + 0.09²) = 0.15, so as a diameter 0.30: right on the limit. But the hole measures Ø10.25, 0.05 above its smallest size, so with Ⓜ it gets 0.05 bonus: allowed 0.35. The part is good.',
      },
      said: 'What engineers say: “Position is point-three at MMC to A-B-C. Did you measure it from the datums, or from the edge you happened to clamp on?”',
      recall: [
        {
          q: 'A hole centre is 0.06 mm off in X and 0.08 mm off in Y from its true position. What is the position deviation as a diameter, in mm?',
          number: 0.2,
          tolerance: 0.005,
          unit: 'mm',
          why: '√(0.06² + 0.08²) = 0.10; as a diameter that is 2 × 0.10 = 0.20 mm.',
        },
        {
          q: 'What is datum A in a frame that reads A B C?',
          options: ['The tightest feature on the part', 'The primary datum the part is located on first', 'The feature being toleranced', 'The last surface machined'],
          answer: 'The primary datum the part is located on first',
          why: 'The order of datums is the order in which the part is located.',
        },
        {
          q: 'A dimension is shown in a box, with no ± next to it. What does that mean?',
          options: ['It is a reference dimension only', 'It is a basic dimension: exact, with the tolerance in a feature control frame', 'It needs no tolerance', 'It must be checked 100%'],
          answer: 'It is a basic dimension: exact, with the tolerance in a feature control frame',
          why: 'Basic dimensions define the true position or profile; the frame gives the tolerance.',
        },
        {
          q: 'Which of these controls usually needs no datum?',
          options: ['Position', 'Perpendicularity', 'Parallelism', 'Flatness'],
          answer: 'Flatness',
          why: 'Flatness only compares a surface with itself; the others relate to a datum.',
        },
      ],
      situation: {
        scene: 'You’re at a machining supplier. Their customer rejected a batch on hole position. The supplier’s quality engineer says: “Our caliper check says it’s fine, their CMM must be wrong.”',
        ask: 'What do you ask?',
        model: 'How did you measure position: from datums A, B and C in that order, as the frame says, or from whichever edges were easy to reach with the caliper? If the datums differ, both measurements can be right and still disagree. Can we measure two parts the same way the customer does, ideally on a CMM with the same alignment?',
        rubric: [
          'Asks how the part was aligned to the datums',
          'Explains that different datums give different results',
          'Proposes measuring a few parts the customer’s way',
        ],
      },
      sayIt: 'Explain to a buyer in 60 seconds what datums and a position tolerance are, and why a caliper can’t check them.',
      terms: [
        { term: 'Datum', def: 'A reference feature the part is located on, marked A, B, C.' },
        { term: 'Feature control frame', def: 'Box with a GD&T symbol, a tolerance and the datums it refers to.' },
        { term: 'Position tolerance', def: 'Round zone around the exact location in which a feature centre must lie.' },
        { term: 'Basic dimension', def: 'Exact boxed value without ±; its tolerance sits in a frame.' },
      ],
    },
    {
      id: 'eng.drawings.pid',
      title: 'Reading a P&ID',
      pre: [
        {
          q: 'An instrument bubble on a P&ID reads “PT 101”. What is it?',
          options: ['Pump 101', 'Pipe tee 101', 'Pressure transmitter in loop 101', 'Temperature probe on line 101'],
          answer: 'Pressure transmitter in loop 101',
          why: 'First letter is the measured variable (P, pressure); next letters the function (T, transmit); the number is the loop.',
        },
      ],
      teach: [
        'A P&ID (piping and instrumentation diagram) is a schematic of pipes, equipment, valves and instruments in a process plant: food, chemicals, water, energy. It is not to scale and doesn’t show real routing. It shows what is connected to what, and how it is measured and controlled. Changes to the plant start with a marked-up P&ID.',
        'Lines: a thick solid line is process pipe, with a line number such as DN150-CW-1203 (size, medium, number). A dashed line is an electrical signal. A line with double slashes is pneumatic. Arrows show flow direction. Equipment has its own tags: P-101 a pump, T-101 a tank, E-101 a heat exchanger.',
        'Valves are drawn as a bowtie. Filled in black: normally closed. A bowtie with a dome on top is a control valve with a pneumatic actuator. A check valve lets flow go one way. A PSV is a pressure safety valve, the last line of defence against overpressure.',
        'Instrument tags follow ISA 5.1. First letter: what is measured: F flow, P pressure, T temperature, L level. Next letters: what it does: I indicate, T transmit, C control, A alarm, S switch, V valve. FT 201 is a flow transmitter; TIC 305 a temperature indicating controller; LAH a level alarm high. A plain circle is in the field; a circle in a square is on the screen of the DCS, the plant’s central control system.',
      ],
      example: {
        kind: 'worked',
        text: 'Tank T-101 holds 20 m³. On its side sits LT 101, a level transmitter. A dashed line runs to LIC 101, a circle in a square: the level controller on the DCS. Another dashed line runs to LV 101, a control valve on the outlet. Reading: the controller keeps the level at setpoint by opening or closing the outlet. LAH 101 warns the operator at 80%, so 16 m³. Separately, LSHH 102, a high-high switch at 95%, is wired to close inlet valve XV 103: an independent safety function, not part of normal control.',
      },
      said: 'What engineers say: “LIC one-oh-one throttles the outlet, but the high-high on one-oh-two trips XV one-oh-three. Don’t confuse the control loop with the trip.”',
      recall: [
        {
          q: 'A 20 m³ tank has its level alarm high (LAH) at 80%. At what volume does the alarm go off, in m³?',
          number: 16,
          tolerance: 0.1,
          unit: 'm³',
          why: '0.8 × 20 = 16 m³.',
        },
        {
          q: 'What is a TIC?',
          options: ['A temperature indicating controller', 'A timer in the control room', 'A temperature switch', 'A test instrument connection'],
          answer: 'A temperature indicating controller',
          why: 'T for temperature, I for indicate, C for control.',
        },
        {
          q: 'On a P&ID, what does a dashed line between instruments usually show?',
          options: ['A pipe for cooling water', 'A future pipe', 'An electrical signal', 'A drain line'],
          answer: 'An electrical signal',
          why: 'Dashed is electrical; double slashes mean pneumatic; solid is process pipe.',
        },
        {
          q: 'What does LSHH stand for?',
          options: ['Level sensor, high heat', 'Level switch high-high', 'Line steam, high head', 'Low setpoint, hold high'],
          answer: 'Level switch high-high',
          why: 'L level, S switch, HH the second, higher alarm point, usually a trip.',
        },
      ],
      situation: {
        scene: 'You’re in a project meeting at a dairy. A process engineer has the P&ID on the table and proposes removing a manual bypass valve around a control valve “because nobody uses it”.',
        ask: 'What do you ask before the change goes ahead?',
        model: 'Is this P&ID as-built, does it match what’s actually in the plant today? What happens when the control valve fails or needs maintenance: is the bypass how they keep running? And is anything in this loop part of a safety function or an interlock, so that this needs a formal change review?',
        rubric: [
          'Asks whether the P&ID is up to date (as-built)',
          'Asks what the bypass is for in failure or maintenance',
          'Asks about safety functions and the change procedure',
        ],
      },
      sayIt: 'Explain to a colleague in 60 seconds how to read an instrument tag like FIC 201 on a P&ID.',
      terms: [
        { term: 'P&ID', def: 'Piping and instrumentation diagram: what is connected to what and how it’s controlled.' },
        { term: 'Tag number', def: 'Code like PT 101: measured variable, function, loop number.' },
        { term: 'Transmitter', def: 'Instrument that measures and sends a signal, usually 4–20 mA, to the control system.' },
        { term: 'Control valve', def: 'Valve with an actuator that a controller opens and closes to steer the process.' },
      ],
    },
    {
      id: 'eng.drawings.loop',
      figure: 'eng.drawings.loop',
      title: 'The control loop',
      pre: [
        {
          q: 'A dishwasher runs a fixed 90-minute program without measuring how clean the dishes are. What kind of control is that?',
          options: ['Closed loop', 'Open loop', 'Cascade control', 'PID control'],
          answer: 'Open loop',
          why: 'Nothing measures the result, so nothing corrects when the dishes are dirtier than usual.',
        },
      ],
      teach: [
        'Every control loop has four parts. A sensor measures the process value (PV), say 72.4 °C. The controller compares it with the setpoint (SP), say 75 °C, and computes the error: 2.6 °C. An actuator, for example a steam valve, changes the process: that’s the controller output (OP), 0 to 100%. And the process responds, with some delay.',
        'Closed loop means feedback: measure, compare, correct, and again, many times a second. Open loop means no measurement of the result: a timer, a fixed valve position, a recipe that says “heat for 10 minutes”. Open loop can’t correct for disturbances such as colder product or lower steam pressure.',
        'Every controller faceplate shows three numbers: SP, PV and OP. Together they tell the story. PV below SP with OP at 100%: the actuator is saturated and the loop can’t do more; the valve is too small or the steam supply is low. OP at 0% and PV still above SP: the disturbance is bigger than the actuator can handle.',
        'Modes: AUTO, the controller acts. MAN, the operator sets the output by hand. CAS, the setpoint comes from another controller. Studies keep finding around a third of loops in plants running in manual or performing badly. “How many loops run in manual, and why?” is a question that gets an engineer’s attention.',
      ],
      example: {
        kind: 'worked',
        text: 'A milk pasteuriser must hold product at 72 °C for 15 seconds. TT 401 reads 71.2 °C. TIC 401 has a setpoint of 72.5 °C, so the error is 1.3 °C. The output rises from 45% to 58%, hot-water valve TV 401 opens further, and in about 40 seconds the temperature reaches 72.5. Separately, if the temperature drops below 72.0 °C, a divert valve sends the milk back to the balance tank. That is a food safety function, independent of the control loop.',
      },
      said: 'What engineers say: “That loop’s been in manual at forty percent for months. Nobody trusts it in auto, so the operators just babysit it.”',
      recall: [
        {
          q: 'The setpoint is 80 °C and the process value is 76.5 °C. What is the error, in °C?',
          number: 3.5,
          tolerance: 0.05,
          unit: '°C',
          why: 'Error = SP − PV = 80 − 76.5 = 3.5 °C.',
        },
        {
          q: 'PV sits well below SP and the output is stuck at 100%. What does that tell you?',
          options: ['The controller needs retuning', 'The sensor is broken for sure', 'The setpoint is wrong', 'The actuator is saturated: the loop can’t push harder'],
          answer: 'The actuator is saturated: the loop can’t push harder',
          why: 'The controller is asking for everything it has; the limit is the valve or the supply.',
        },
        {
          q: 'Which of these is open-loop control?',
          options: ['A thermostat switching the heating', 'A cruise control in a car', 'A level controller on a tank', 'A timer running a pump for 10 minutes'],
          answer: 'A timer running a pump for 10 minutes',
          why: 'The timer doesn’t measure the result, so it can’t correct.',
        },
        {
          q: 'What does MAN mode mean on a controller?',
          options: ['The operator sets the output directly', 'The controller runs on maximum gain', 'The setpoint comes from another controller', 'The loop is shut down'],
          answer: 'The operator sets the output directly',
          why: 'In manual, the controller stops acting and the operator holds the valve position.',
        },
      ],
      situation: {
        scene: 'You’re at a client with a spray dryer. Operators complain that the outlet temperature swings, which affects product moisture. On the DCS you see that TIC 210 is in MAN at 40% output.',
        ask: 'What do you ask?',
        model: 'Why is this loop in manual, and since when? If it was put in manual because it oscillated in auto, the cause might be the tuning or a sticky valve, and that’s fixable. As long as it’s in manual, every change in feed or weather is corrected by hand, so the swings make sense. Who could look at it with the operators this week?',
        rubric: [
          'Notices the loop is in manual and asks why',
          'Links manual mode to the swings in temperature',
          'Proposes getting a control engineer to look at tuning or valve',
        ],
      },
      sayIt: 'Explain to an operator in 60 seconds what SP, PV and OP mean on a controller faceplate.',
      terms: [
        { term: 'Setpoint (SP)', def: 'The value the controller is trying to reach.' },
        { term: 'Process value (PV)', def: 'The measured actual value.' },
        { term: 'Output (OP)', def: 'What the controller sends to the actuator, 0 to 100%.' },
        { term: 'Closed loop', def: 'Control with feedback: measure, compare, correct, repeat.' },
      ],
    },
    {
      id: 'eng.drawings.pid_control',
      title: 'PID control intuition',
      pre: [
        {
          q: 'A controller has only P action, no I. Where does the process value settle after a disturbance?',
          options: ['Exactly at the setpoint', 'Slightly away from the setpoint: an offset', 'It oscillates forever', 'At zero'],
          answer: 'Slightly away from the setpoint: an offset',
          why: 'P needs an error to produce output, so a small error always remains.',
        },
      ],
      teach: [
        'P (proportional): output change in proportion to the current error. With a gain of 2, an error of 5% gives 10% more output. More gain means a stronger, faster reaction. Pure P leaves an offset, because it needs some error to produce output. Too much gain makes the loop oscillate.',
        'I (integral): adds up the error over time and keeps pushing until the error is zero. It removes the offset. Too much I gives overshoot and slow swinging. Integral windup: if the actuator sits at its limit for a long time, the I term keeps growing, and the loop overshoots badly afterwards.',
        'D (derivative): reacts to how fast the error is changing, so it brakes before overshoot. It’s sensitive to noise on the measurement, so most industrial loops run PI, with D switched off.',
        'On a trend: a sluggish loop crawls to setpoint over minutes without overshoot. An aggressive loop overshoots and then swings, slowly dying out. An unstable loop swings bigger and bigger. But oscillation isn’t always tuning: a sticking valve (stiction) gives a sawtooth on the output and square-ish steps in the process value. Check the valve before you retune.',
      ],
      example: {
        kind: 'worked',
        text: 'A PI level loop on a buffer tank, setpoint 60%. The trend shows the level swinging between 52 and 68% every 4 minutes, with the output swinging between 20 and 80%. The control engineer puts the loop in manual at 50%: the swinging stops, so the loop itself causes it. Next, valve test: step the output from 50 to 51%, nothing moves; to 53%, the valve jumps. That’s about 2 to 3% stiction. The fix is the valve (packing, positioner), not new tuning.',
      },
      said: 'What engineers say: “Before you touch the tuning, put it in manual and step the valve. Nine times out of ten it’s a sticky valve, not the PID.”',
      recall: [
        {
          q: 'A P-only controller has a gain of 2. The error increases by 5%. By how many % does the output change?',
          number: 10,
          tolerance: 0.1,
          unit: '%',
          why: 'Output change = gain × error = 2 × 5 = 10%.',
        },
        {
          q: 'Which part of PID removes the steady offset?',
          options: ['P', 'D', 'I', 'The setpoint ramp'],
          answer: 'I',
          why: 'The integral keeps pushing as long as any error remains.',
        },
        {
          q: 'The process value swings with ever larger amplitude. What is most likely?',
          options: ['The loop is too sluggish', 'The loop is unstable: gain or integral action is too high', 'The setpoint is too low', 'The sensor is too accurate'],
          answer: 'The loop is unstable: gain or integral action is too high',
          why: 'Growing swings mean the loop over-reacts to its own corrections.',
        },
        {
          q: 'The output shows a sawtooth and the process value moves in square steps. What do you suspect?',
          options: ['A sticking valve (stiction)', 'Too little integral action', 'Noise on the sensor', 'A setpoint that is too high'],
          answer: 'A sticking valve (stiction)',
          why: 'The output builds up until the valve breaks free and jumps; then it repeats.',
        },
      ],
      situation: {
        scene: 'You’re at a chemicals client. An operator says: “The steam pressure loop is bad, it’s always swinging. Someone should retune it.” The control engineer is on holiday for two weeks.',
        ask: 'What do you ask or suggest?',
        model: 'Has anyone tried it in manual for a few minutes: does the swinging stop? If it does, the loop causes it, and the next check is whether the valve moves smoothly with small output steps. If it keeps swinging in manual, the cause is upstream, a disturbance, and retuning won’t help. Either way, let’s collect that before the engineer is back.',
        rubric: [
          'Proposes the manual test to see if the loop causes the swing',
          'Mentions checking the valve for stiction',
          'Separates a loop problem from an upstream disturbance',
        ],
      },
      sayIt: 'Explain to a production manager in 60 seconds what P, I and D each do, in plain words.',
      terms: [
        { term: 'P, I, D', def: 'Proportional (react to error), integral (remove offset), derivative (brake on fast change).' },
        { term: 'Offset', def: 'A steady error that remains with P-only control.' },
        { term: 'Overshoot', def: 'The process value going past the setpoint before settling.' },
        { term: 'Stiction', def: 'A valve that sticks and then jumps, causing oscillation.' },
      ],
    },
    {
      id: 'eng.drawings.plc',
      title: 'PLC, HMI, SCADA and safety',
      pre: [
        {
          q: 'A guard door on a robot cell is opened while the robot is running. What should stop the robot?',
          options: ['The normal stop step in the PLC program', 'The operator pressing stop on the HMI', 'The robot’s own collision detection', 'A safety relay or safety PLC wired for that purpose'],
          answer: 'A safety relay or safety PLC wired for that purpose',
          why: 'Protecting people is a separate, certified safety function, not ordinary program logic.',
        },
      ],
      teach: [
        'A PLC (programmable logic controller) is an industrial computer that reads inputs (sensors, buttons) and sets outputs (motors, valves) in a fast cycle, often every 10 ms. Common makes: Siemens, Rockwell (Allen-Bradley), Beckhoff, Omron. Machine sequences are written as steps: step 10 clamp, step 20 drill, step 30 unclamp, each waiting for a condition.',
        'The HMI (human-machine interface) is the touchscreen at the machine: start, stop, recipes, alarms, setpoints. SCADA supervises many PLCs: overview screens, trends, alarms for a whole plant or a whole grid; grid operators run SCADA for their substations. In process plants a DCS combines control and screens in one system.',
        'An interlock is a condition that blocks an action: the pump can’t start with the suction valve closed. Process interlocks protect equipment and product. Safety functions protect people and are designed separately: safety PLC or safety relays, rated to ISO 13849 (performance level a to e) or IEC 62061 and 61511 (SIL). They are never bypassed with a wire bridge.',
        'Before changing a sequence, ask: what does this step protect? Is it part of a safety function, which needs a risk assessment and validation? Who owns the code, and is there a backup? How do we test and roll back? And ask for the bypass list: many plants have sensors “temporarily” bypassed for years.',
      ],
      example: {
        kind: 'worked',
        text: 'A packaging machine runs at 28 seconds a cycle. The team wants to start the pusher before sensor B12 confirms “box in position”, saving 3 seconds. The controls engineer checks: step 40 waits for B12 to prevent jams, a process interlock, not a safety function. The infeed light curtain is wired to the safety PLC (PL d) and stays untouched. Plan: back up program v2.3, change in test mode, run one shift, measure. Result: cycle 25 seconds, jams still 2 per shift. On an 8-hour shift that’s about 123 extra cycles.',
      },
      said: 'What engineers say: “Sure, we can skip that wait step, it’s just a process interlock. But the light curtain’s on the safety PLC, nobody touches that without a risk assessment.”',
      recall: [
        {
          q: 'A machine’s cycle time goes from 28 to 25 seconds per cycle. How many extra cycles do you get in an 8-hour shift (28,800 seconds)?',
          number: 123,
          tolerance: 2,
          unit: 'cycles',
          why: '28,800 / 25 = 1,152 and 28,800 / 28 = 1,029: about 123 more.',
        },
        {
          q: 'Which of these is a safety function rather than a process interlock?',
          options: ['A pump that won’t start with the suction valve closed', 'A conveyor that stops when the next machine is full', 'A light curtain that stops a robot when someone reaches in', 'A step that waits for a box to be in position'],
          answer: 'A light curtain that stops a robot when someone reaches in',
          why: 'It exists to protect a person, so it’s designed and rated as a safety function.',
        },
        {
          q: 'What is the main difference between an HMI and SCADA?',
          options: ['SCADA supervises many PLCs across a plant or grid; an HMI is one machine’s screen', 'An HMI is always wireless', 'SCADA only runs safety functions', 'There is no difference'],
          answer: 'SCADA supervises many PLCs across a plant or grid; an HMI is one machine’s screen',
          why: 'SCADA is the supervisory layer over many controllers and sites.',
        },
        {
          q: 'Someone proposes changing a machine sequence. What is the first question?',
          options: ['How fast can it be done?', 'Which PLC brand is it?', 'Can the operators be trained later?', 'What does this step protect, and is it part of a safety function?'],
          answer: 'What does this step protect, and is it part of a safety function?',
          why: 'Changing a safety-related step needs a risk assessment and validation first.',
        },
      ],
      situation: {
        scene: 'You’re on a plant walk at a building materials client. At the palletiser, a sensor is bypassed with a wire bridge in the cabinet. The team leader says: “It gave false stops, so maintenance bridged it last year.”',
        ask: 'What do you ask?',
        model: 'What does that sensor protect: is it part of the guarding or just a process check? Who approved the bypass, and is it on a bypass register? If it’s safety-related, this needs fixing today; if not, it still needs a proper repair of the false stops rather than a permanent bridge. I’d like the maintenance lead and the safety officer to look at it now.',
        rubric: [
          'Asks whether the sensor is safety-related',
          'Asks about approval and a bypass register',
          'Escalates appropriately and asks for the real cause to be fixed',
        ],
      },
      sayIt: 'Explain to a project sponsor in 60 seconds the difference between a process interlock and a safety function, and why it matters for your project.',
      terms: [
        { term: 'PLC', def: 'Industrial controller that runs machine logic in a fast cycle.' },
        { term: 'HMI', def: 'The operator screen at a machine.' },
        { term: 'SCADA', def: 'Supervisory system over many PLCs: overview, trends, alarms.' },
        { term: 'Safety function', def: 'Separately designed and rated function that protects people, such as a light curtain stop.' },
      ],
    },
  ],
};
