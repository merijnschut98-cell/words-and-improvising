// eng.machining (EN): Machining: turning, milling, drilling, grinding, CNC, cutting data, tools, fixtures, part quality.
export default {
  lessons: [
    {
      id: 'eng.machining.processes',
      title: 'Turning, milling, drilling, grinding',
      pre: [
        {
          q: 'You need a round steel shaft with two shoulders and a groove. Which machine makes it?',
          options: ['A milling machine', 'A drill press', 'A lathe', 'A surface grinder'],
          answer: 'A lathe',
          why: 'Round parts come from turning: the workpiece rotates and the tool shapes it.',
        },
      ],
      teach: [
        'Turning, on a lathe: the workpiece rotates and a fixed cutting tool moves along it. It makes round shapes: shafts, bushings (short tubes), flanges, threads, grooves, bores (accurate holes). Many modern lathes also have driven tools: small motorised cutters. With these they can mill a flat or drill a cross hole without moving the part to another machine.',
        'Milling: the tool rotates and the workpiece, clamped on the table, moves under it. It makes flat faces, pockets, slots and contours: housings, brackets, mould parts. A standard mill moves in three directions, called axes: left-right (X), front-back (Y) and up-down (Z). Five-axis machines can also tilt the part or the head, for complex shapes such as pump impellers and aircraft parts.',
        'Drilling: a rotating drill makes round holes, usually on a milling machine. A drilled hole is not very accurate. For an accurate hole you drill slightly too small, then finish it with a reamer: a tool that takes off the last few tenths of a millimetre. For a thread you cut it with a tap. Holes deeper than about five times the diameter get slow and risky: chips jam and drills break.',
        'Grinding: a fast-spinning abrasive wheel removes tiny amounts of material. It gives tight tolerances (the allowed deviation from the drawing size) and a fine finish, often after the part is hardened: bearing seats, hardened shafts, measuring gauges. Turning holds about ±0.02 mm; grinding ±0.005 mm or better. It’s slower and more expensive, so engineers grind only where the drawing really needs it.',
      ],
      example: {
        kind: 'worked',
        text: 'A gearbox output shaft. Route: saw a Ø55 mm bar to length (1 minute); turn it on a CNC lathe to Ø50 with shoulders (steps in the diameter), leaving 0.2 mm extra on the Ø35 bearing seat for grinding (6 minutes); mill a 10 mm keyway, the slot for a key that locks a gear to the shaft (3 minutes); harden it at an outside heat treater (3 days); grind the bearing seat to Ø35 k6, a standard size class with a 16 µm tolerance, or 0.016 mm (4 minutes). Total cutting time: 14 minutes. Lead time: about 6 days, almost all of it the outsourced hardening and the waiting before and after it.',
      },
      said: 'What engineers say: “We turn it, mill the keyway, send it out for hardening, then grind the bearing seats. The grinding’s four minutes, the hardener’s three days.”',
      recall: [
        {
          q: 'A Ø8 mm hole must be 60 mm deep. How many times the diameter is that?',
          number: 7.5,
          tolerance: 0.05,
          unit: '× D',
          why: '60 / 8 = 7.5: beyond the 5 × D where drilling gets slow and risky.',
        },
        {
          q: 'Which process makes a keyway in a shaft?',
          options: ['Milling', 'Turning', 'Reaming', 'Grinding'],
          answer: 'Milling',
          why: 'A keyway is a slot, cut with a rotating end mill (a milling cutter).',
        },
        {
          q: 'A hardened bearing seat needs ±0.005 mm. Which process finishes it?',
          options: ['Drilling', 'Rough turning', 'Sawing', 'Grinding'],
          answer: 'Grinding',
          why: 'Grinding holds microns and works on hardened steel.',
        },
        {
          q: 'In turning, what rotates?',
          options: ['The tool', 'The workpiece', 'Both', 'Neither, the table moves'],
          answer: 'The workpiece',
          why: 'On a lathe the part spins and the tool moves along it.',
        },
      ],
      situation: {
        scene: 'You’re at a machining company. Sales complains that a standard shaft has a lead time of three weeks, while the cutting time is only 14 minutes. The production manager says the machines are full.',
        ask: 'What do you ask?',
        model: 'Can we walk the route: which steps, which machines, and what happens between them? How much of the three weeks is the outside hardening and the transport and waiting around it? And what batch size do we run per step, because a batch of 200 waiting at every machine adds days without anyone noticing.',
        rubric: [
          'Asks for the full route, step by step',
          'Asks about outsourced steps and waiting around them',
          'Asks about batch sizes between steps',
        ],
      },
      sayIt: 'Explain to a buyer in 60 seconds which machining process makes which shape, and why grinding costs extra.',
      terms: [
        { term: 'Turning', def: 'The workpiece rotates against a fixed tool; makes round parts.' },
        { term: 'Milling', def: 'A rotating tool cuts a moving workpiece; makes faces, pockets and slots.' },
        { term: 'Grinding', def: 'An abrasive wheel removes tiny amounts for tight tolerances and fine finish.' },
        { term: 'Reaming', def: 'Finishing a drilled hole to an accurate size.' },
      ],
    },
    {
      id: 'eng.machining.cnc',
      title: 'CNC basics',
      pre: [
        {
          q: 'Why does the setter measure the first part after a new setup before the batch runs?',
          options: ['It’s only a customer requirement', 'To warm up the machine', 'To train the operator', 'Because new offsets, tools or program can scrap the whole batch'],
          answer: 'Because new offsets, tools or program can scrap the whole batch',
          why: 'One wrong number in a setup repeats on every part until someone checks.',
        },
      ],
      teach: [
        'CNC (computer numerical control) means a computer drives the machine’s motors, following a program. The spindle is the rotating shaft that holds the part (on a lathe) or the tool (on a mill). On a lathe, X sets the diameter and Z runs along the spindle. On a mill, X and Y move the table and Z moves the spindle up and down; a fourth and fifth axis rotate the part or the head.',
        'The program is G-code, a list of short commands. G00 is a rapid move, G01 a straight cut, G02 and G03 arcs. M03 starts the spindle, M08 the coolant, M06 changes the tool. F sets the feed (how fast the tool advances), S the speed, T the tool. Most programs are made in CAM software, which turns the 3D model into G-code, and sent to the machine’s control (Fanuc, Siemens, Heidenhain). Small edits happen at the machine.',
        'Zero points. Machine zero is a fixed home position. The work offset (G54) tells the machine where the part sits on the table. Tool offsets tell it each tool’s length and radius, because every tool sticks out a different amount. The setter, who prepares the machine for a new job, types these numbers in. Most crashes (the tool hitting the part or the clamps) and scrapped first parts come from wrong offsets, not from wrong programs.',
        'First-off inspection: after every setup (changing the machine over to a new job), program change or tool change, measure the first part fully before running the batch. Many shops also check the last part. It costs 10 to 20 minutes and saves a batch of 200 wrong parts.',
      ],
      example: {
        kind: 'worked',
        text: 'A setter starts a job of 200 flanges. He sets G54 by touching the vice jaw with a probe, a measuring pin held in the spindle. For tool 5, a drill, he types a length of 112.43 instead of 121.43. The machine thinks the drill is 9 mm shorter than it is, so it drills 9 mm deeper. The first-off check finds the hole depth 9 mm over: one part scrapped, €35. Without the check, 200 × €35 = €7,000 of scrap, and if the hole should stop just above a thin floor, possibly a broken drill and a damaged fixture (the part holder).',
      },
      said: 'What engineers say: “First-off is good, release the batch. But double-check the tool length on T5 next time, that’s the second typo this month.”',
      recall: [
        {
          q: 'A batch is 150 parts at €28 each. A first-off check catches a wrong offset on part 1. How much scrap cost is avoided, in €?',
          number: 4172,
          tolerance: 1,
          unit: '€',
          why: 'Only the first part is lost: 149 × €28 = €4,172 saved.',
        },
        {
          q: 'What does G54 tell the machine?',
          options: ['The spindle speed', 'Where the workpiece sits: the work offset', 'Which tool to use', 'To switch on the coolant'],
          answer: 'Where the workpiece sits: the work offset',
          why: 'G54 is the first work offset, the part’s zero point.',
        },
        {
          q: 'On a CNC lathe, what does the X axis control?',
          options: ['The length along the spindle', 'The spindle speed', 'The diameter', 'The tool change'],
          answer: 'The diameter',
          why: 'X moves the tool towards or away from the centre line; Z runs along the spindle.',
        },
        {
          q: 'What is the most common cause of first-part scrap after a setup?',
          options: ['A wrong work or tool offset', 'A bug in the CAM software', 'Wrong material', 'A worn spindle bearing'],
          answer: 'A wrong work or tool offset',
          why: 'Offsets are typed in by hand at every setup; programs are usually proven.',
        },
      ],
      situation: {
        scene: 'You’re at a job shop. One in four setups produces a scrapped first part. The production manager wants to send the CAM programmers on a training course.',
        ask: 'What do you ask before the training is booked?',
        model: 'What were the causes of the last 20 scrapped first parts: program errors, offsets, wrong tools, fixture problems? If most are offsets typed in by hand, training the programmers won’t help; probing the part and measuring tools in a presetter might. Can we go through the scrap tickets with the setters this week?',
        rubric: [
          'Asks for the actual causes of first-part scrap',
          'Questions whether the programmers are the right target',
          'Suggests involving the setters and looking at offset errors',
        ],
      },
      sayIt: 'Explain to a new planner in 60 seconds what a setup involves on a CNC and why the first part is checked.',
      terms: [
        { term: 'G-code', def: 'The program language of CNC machines: moves, speeds, tool changes.' },
        { term: 'Work offset (G54)', def: 'Tells the machine where the part’s zero point is.' },
        { term: 'Tool offset', def: 'Each tool’s stored length and radius.' },
        { term: 'First-off', def: 'Full check of the first part after a setup, before the batch runs.' },
      ],
    },
    {
      id: 'eng.machining.cutting',
      figure: 'eng.machining.lathe',
      title: 'Cutting speed, feed and depth of cut',
      pre: [
        {
          q: 'What is a typical cutting speed for turning steel with a carbide insert?',
          options: ['About 2 m/min', 'About 20 m/min', 'About 200 m/min', 'About 2,000 m/min'],
          answer: 'About 200 m/min',
          why: 'Carbide in steel runs at roughly 150 to 300 m/min.',
        },
      ],
      teach: [
        'Cutting speed (Vc, in metres per minute) is how fast the cutting edge moves through the material. Tool and material set it. Most tools today are carbide inserts: small, replaceable tips of very hard tungsten carbide. Carbide runs at 150 to 300 m/min in steel, 100 to 200 in stainless, 300 to 1,000 or more in aluminium, 40 to 80 in titanium. Older HSS tools (high-speed steel) run much slower, about 30 in steel.',
        'Spindle speed n, in rpm (revolutions per minute), follows from the diameter D in mm: n = Vc × 1,000 / (π × D). Example: a Ø50 part at 200 m/min needs 200,000 / 157 = 1,273 rpm. A smaller diameter needs more rpm for the same cutting speed.',
        'Feed is how far the tool moves forward while it cuts. In turning: mm per revolution (f, say 0.25). In milling: mm per tooth of the cutter (fz, say 0.1), so table feed = fz × number of teeth × rpm. Depth of cut (ap) is how deep the tool goes in, in mm. Feed and depth decide how much metal you remove per minute; speed decides most of the heat and tool wear.',
        'Time for one turning pass = length / (f × n). The trade-offs: higher speed shortens the cycle but cuts tool life (how long an edge lasts) fast; with carbide, 20% more speed can roughly halve it. Higher feed costs the tool less but gives a rougher surface. So engineers push feed and depth first, then speed. Roughing passes remove most of the metal; a separate, gentler finishing pass gives the final size and surface.',
      ],
      example: {
        kind: 'worked',
        text: 'Roughing a Ø60 shaft over 200 mm in C45 (a common medium-carbon steel) with a carbide insert, Vc 220 m/min, f 0.3 mm/rev. n = 220,000 / (π × 60) = 220,000 / 188.5 = 1,167 rpm. Feed rate = 0.3 × 1,167 = 350 mm/min. Time per pass = 200 / 350 = 0.57 min, 34 seconds. Raise the roughing feed to 0.4: 467 mm/min, 26 seconds, saving about 8.6 seconds per pass. With 3 roughing passes and 5,000 parts a year, that’s about 36 hours of machine time. The finishing pass stays at 0.15 for the surface.',
      },
      said: 'What engineers say: “Don’t crank up the speed, you’ll just eat inserts. Push the feed on the roughing passes and leave the finish pass alone.”',
      recall: [
        {
          q: 'Cutting speed 150 m/min, diameter 40 mm. What is the spindle speed, in rpm?',
          number: 1194,
          tolerance: 10,
          unit: 'rpm',
          why: 'n = 150 × 1,000 / (π × 40) = 150,000 / 125.7 = 1,194 rpm.',
        },
        {
          q: 'Spindle at 1,000 rpm, feed 0.2 mm/rev, cut length 100 mm. How long does the pass take, in seconds?',
          number: 30,
          tolerance: 1,
          unit: 's',
          why: 'Feed rate 0.2 × 1,000 = 200 mm/min; 100 / 200 = 0.5 min = 30 s.',
        },
        {
          q: 'Which cutting parameter affects tool wear the most?',
          options: ['Depth of cut', 'Cutting speed', 'Feed', 'Coolant colour'],
          answer: 'Cutting speed',
          why: 'Speed drives heat at the edge, and heat drives wear.',
        },
        {
          q: 'What happens to surface finish when you raise the feed?',
          options: ['It gets smoother', 'Nothing changes', 'It gets rougher', 'It depends only on the speed'],
          answer: 'It gets rougher',
          why: 'A bigger feed leaves wider, deeper tool marks.',
        },
      ],
      situation: {
        scene: 'You’re at a machining client. The production manager wants to raise all cutting speeds by 30% across the shop “to get more out of the machines”.',
        ask: 'What do you ask?',
        model: 'Which machines are actually the bottleneck? Speeding up the others won’t give a single extra part. And 30% more speed can cut tool life by more than half, so more tool changes and more risk of scrap. Can we pick the bottleneck machine, look at feed and depth first, and test one part number with the tooling supplier before rolling anything out?',
        rubric: [
          'Asks where the bottleneck is',
          'Names the tool life and scrap cost of higher speed',
          'Proposes a controlled test, starting with feed and depth',
        ],
      },
      sayIt: 'Explain to a production manager in 60 seconds what cutting speed, feed and depth of cut are, and why faster isn’t always cheaper.',
      terms: [
        { term: 'Cutting speed (Vc)', def: 'Speed of the edge through the material, in m/min.' },
        { term: 'Feed', def: 'How far the tool advances per revolution (turning) or per tooth (milling).' },
        { term: 'Depth of cut (ap)', def: 'How deep the tool cuts into the material, in mm.' },
        { term: 'Spindle speed', def: 'Revolutions per minute, from cutting speed and diameter.' },
      ],
    },
    {
      id: 'eng.machining.tools',
      title: 'Tool wear, tool life and coolant',
      pre: [
        {
          q: 'On a CNC part, which usually makes up the larger share of the cost?',
          options: ['The cutting tools, by far', 'Machine time, by far', 'Always about equal', 'The coolant'],
          answer: 'Machine time, by far',
          why: 'Tooling is often only around 3% of part cost; machine time is typically ten times that.',
        },
      ],
      teach: [
        'Tools wear. Flank wear: the edge itself rubs away. Crater wear: a hollow forms on top, where the chip slides over. Chipping: small pieces break off. Built-up edge: workpiece material sticks to the edge. Wear grows slowly, then fast. A worn tool shows as sizes drifting, a worse surface, burrs (sharp ridges on the edges) and rising spindle load (the motor works harder). Then it breaks, which can scrap the part and damage the machine.',
        'Tool life is set in minutes of cutting or in parts per edge, for example 15 minutes or 120 parts. The control counts it; at the limit it calls a sister tool (an identical spare in the machine’s tool store, the magazine) or stops for a change. Too late means scrap; too early wastes edges, but edges are cheap.',
        'Coolant cools, lubricates and flushes chips away. Most shops use emulsion: oil mixed into water, usually 5 to 8% oil. They check it with a refractometer, a small hand-held meter. Too lean: rust, poor tool life, bacteria. Too rich: foam and skin problems. High-pressure coolant, around 70 bar, pumped through the tool, breaks up the chips in deep drilling.',
        'Tool management drives uptime. Presetting means measuring each tool’s length and radius on a separate device before it goes into the machine, so the machine doesn’t stand still while the setter measures. Sister tools, a standard tool list and kitting (collecting all tools for the next job in advance) all cut stops. Missing or unprepared tools are a top cause of long setups.',
      ],
      example: {
        kind: 'worked',
        text: 'An insert costs €12 and has 4 edges: €3 per edge. Each edge does 80 parts: €0.0375 of insert per part. Stretching it to 100 parts saves €0.0075 per part, €7.50 per 1,000 parts. But a stretched edge breaks about once every 1,000 parts, scrapping a part worth €45 and stopping the machine 30 minutes at €90 an hour: another €45. Saving €7.50 risks €90. Changing at 80 is cheaper.',
      },
      said: 'What engineers say: “Stop stretching the inserts. We save three euros on carbide and lose a spindle hour every time one snaps.”',
      recall: [
        {
          q: 'An insert costs €16, has 4 edges, and each edge lasts 50 parts. What is the insert cost per part, in €?',
          number: 0.08,
          tolerance: 0.005,
          unit: '€',
          why: '€16 / 4 = €4 per edge; €4 / 50 = €0.08 per part.',
        },
        {
          q: 'Which signs point to a worn tool?',
          options: ['Spindle load rising and sizes drifting', 'The coolant getting colder', 'Faster cycle times', 'Shinier chips'],
          answer: 'Spindle load rising and sizes drifting',
          why: 'A dull edge needs more force and cuts slightly differently as it wears.',
        },
        {
          q: 'Why do shops preset tools off the machine?',
          options: ['It makes the tools last longer', 'The machine keeps cutting while tools are measured elsewhere', 'Customers require it', 'It replaces the first-off check'],
          answer: 'The machine keeps cutting while tools are measured elsewhere',
          why: 'Measuring in the machine is lost spindle time; a presetter moves it outside.',
        },
        {
          q: 'The emulsion concentration has dropped to 2%. What do you expect?',
          options: ['Better surface finish', 'More foam', 'Nothing, concentration doesn’t matter', 'Rust and shorter tool life'],
          answer: 'Rust and shorter tool life',
          why: 'Too lean an emulsion lubricates and protects too little.',
        },
      ],
      situation: {
        scene: 'You’re at a machining client. The night shift has three drill breakages a week on one operation. The shift supervisor wants to switch to a cheaper drill supplier, “since they keep breaking anyway”.',
        ask: 'What do you ask?',
        model: 'Is there a tool-life counter on that drill, and what is it set to? What’s the coolant concentration on that machine, and does the coolant reach the tip? And is it only nights, and if so, what’s different on nights: material batch, tool changes, who sets it up? A cheaper drill in the same conditions will probably break more often.',
        rubric: [
          'Asks about the tool-life setting',
          'Asks about coolant concentration and delivery',
          'Asks what is different on the night shift',
        ],
      },
      sayIt: 'Explain to a buyer in 60 seconds why the cheapest cutting tool rarely gives the cheapest part.',
      terms: [
        { term: 'Tool life', def: 'Cutting minutes or parts per edge before a planned change.' },
        { term: 'Flank wear', def: 'Wear along the cutting edge; the main measure of a worn tool.' },
        { term: 'Presetting', def: 'Measuring tool length and radius outside the machine.' },
        { term: 'Sister tool', def: 'An identical spare tool in the magazine that takes over at end of life.' },
      ],
    },
    {
      id: 'eng.machining.fixtures',
      title: 'Fixtures, clamping and setup',
      pre: [
        {
          q: 'In a typical job shop, what share of the time does a CNC machine actually cut metal?',
          options: ['About 30–50%', 'About 80–90%', 'About 65%', 'Nearly 100%'],
          answer: 'About 30–50%',
          why: 'Setups, waiting for tools or programs, measuring and loading take the rest.',
        },
      ],
      teach: [
        'Workholding is how the part is held: a vice, a three-jaw chuck on a lathe (three jaws that close around the part), a collet (a slotted sleeve that squeezes a bar), or a fixture, a holder made for one specific part. Its job is to put the part in exactly the same place every time and hold it firmly against the cutting forces, without bending it.',
        'A loose part can move in six ways: slide in three directions and turn around three axes. These are its six degrees of freedom. The 3-2-1 principle stops all six: three support points under the main face, two along a side, one at the end. Good fixtures locate on the datums, the reference faces the drawing marks A, B and C, and clamp the part towards these points, never into empty space.',
        'Setup time is everything from the last good part of one job to the first good part of the next: removing the old fixture, mounting the new one, loading tools, setting offsets, first-off. Typically 30 minutes to 3 hours. Zero-point clamping systems repeat within 0.005 mm, so a pallet (a base plate with the part already clamped on it, loaded outside the machine) drops in and runs.',
        'Workholding errors are a big source of scrap: a chip under the part (it tilts), too much clamping force (a thin wall distorts and springs back after unclamping), a part not pushed fully against its stops, worn jaws. Telltale: a dimension that varies between clampings but not within one, or one fixture position always worse than the others.',
      ],
      example: {
        kind: 'worked',
        text: 'An aluminium housing with 2 mm walls and a bore of Ø40 H7 (tolerance 0.025 mm). Clamped hard in a vice, the bore measures round on the machine. Unclamped, it is 0.04 mm out of round: scrap. Fix: clamp on the thick flange, tightened to a set torque (twisting force), and the bore stays within 0.008 mm. A second problem: chips under the part tilt it by 0.05 mm, so an air blast before loading is added to the standard. Setup also drops from 90 to 25 minutes with a zero-point pallet loaded outside the machine.',
      },
      said: 'What engineers say: “It measures perfect in the machine and oval on the measuring machine. You’re clamping it too hard, it springs back.”',
      recall: [
        {
          q: 'How many degrees of freedom does the 3-2-1 principle fix?',
          number: 6,
          tolerance: 0.5,
          unit: '',
          why: 'Three translations and three rotations: 3 + 2 + 1 = 6 points.',
        },
        {
          q: 'Setup drops from 90 to 25 minutes, with 8 setups a week. How many hours of machine time are freed per week?',
          number: 8.67,
          tolerance: 0.1,
          unit: 'hours',
          why: '65 minutes × 8 = 520 minutes = 8.67 hours.',
        },
        {
          q: 'A thin-walled part measures round in the machine but oval after unclamping. What is the likely cause?',
          options: ['Tool wear', 'Clamping distortion', 'Wrong program', 'Coolant temperature'],
          answer: 'Clamping distortion',
          why: 'The clamp bends the part while cutting; it springs back once released.',
        },
        {
          q: 'Parts from one of four fixture positions on a pallet are always worse. Where do you look first?',
          options: ['The CAM program', 'The material certificate', 'The operator’s training', 'That fixture position: locators, jaws, chips'],
          answer: 'That fixture position: locators, jaws, chips',
          why: 'A problem tied to one position points to the workholding there.',
        },
      ],
      situation: {
        scene: 'You’re at a CNC cell with 6% scrap on a bracket. The programmer blames the operators. You notice chips lying everywhere on the fixtures and the machine table.',
        ask: 'What do you ask?',
        model: 'When does the scrap happen: after a reload, on particular fixture positions, or randomly through the run? Which dimension is out, and by how much? If it’s flatness or position that varies between clampings, chips under the part are a good suspect, and an air blast and a cleaning step in the standard cost almost nothing to try.',
        rubric: [
          'Asks when and where the scrap occurs',
          'Asks which dimension fails and by how much',
          'Links the visible chips to a possible workholding cause',
        ],
      },
      sayIt: 'Explain to a team leader in 60 seconds why clamping and fixtures cause so much scrap and setup time.',
      terms: [
        { term: 'Fixture', def: 'A device that locates and holds a part during machining.' },
        { term: '3-2-1 principle', def: 'Three, two and one locating points fix all six degrees of freedom.' },
        { term: 'Zero-point clamping', def: 'Quick-change pallet system that repeats position within microns.' },
        { term: 'Setup time', def: 'Last good part of one job to first good part of the next.' },
      ],
    },
    {
      id: 'eng.machining.quality',
      title: 'Surface finish, measuring and defects',
      pre: [
        {
          q: 'A bore has a tolerance of ±0.005 mm. What do you measure it with?',
          options: ['A steel ruler', 'A caliper', 'A tape measure', 'A bore gauge or air gauge'],
          answer: 'A bore gauge or air gauge',
          why: 'A caliper is good to about ±0.02 to 0.03 mm in practice; this needs a dedicated gauge.',
        },
      ],
      teach: [
        'Surface finish is given as Ra: the average height of the tiny peaks and valleys on the surface, in µm (thousandths of a millimetre). Rough turning gives Ra 3.2 to 6.3, fine turning 0.8 to 1.6, grinding 0.2 to 0.8. Seal faces and bearing seats need a low Ra. A note like “Ra 0.8” on a drawing means a finishing pass or grinding, so extra cost.',
        'Measuring tools. Caliper: reads 0.01 mm, real accuracy about ±0.02 to 0.03, fine for ±0.1 tolerances. Micrometer: reads 0.001 mm, for ±0.01. Holes: bore gauge, air gauge, or go/no-go plug gauges (fixed pins: one end must fit, the other must not). A CMM (coordinate measuring machine) touches points in 3D and reports them against the datums, in a room kept at 20 °C.',
        'Temperature matters. Steel grows about 0.0115 mm per metre for every °C; aluminium twice that. A 200 mm steel part measured at 30 °C, warm from the machine, is 0.023 mm bigger than at 20 °C: more than many tolerances. So measure at 20 °C, or let parts cool, or correct for it.',
        'Typical defects and their usual causes. Size drift: tool wear or the machine warming up. Chatter marks: a wavy pattern from vibration, caused by a tool sticking out too far, thin walls or the wrong speed. Burrs: worn tools, or edges where the tool exits. Poor finish: worn insert or too high a feed. Position errors: fixture or offset. Out of round: clamping.',
      ],
      example: {
        kind: 'worked',
        text: 'A shaft Ø30 h6, a standard size class: it must measure between 29.987 and 30.000 mm. The operator measures it with a micrometer straight from the machine, at 35 °C: 29.990, in spec. At 20 °C, 15 °C cooler, it shrinks by 30 × 0.0115 × 15 / 1,000 = 0.005 mm, to 29.985: out of spec. The customer measures at 20 °C and rejects the batch. Fix: measure after the part has cooled in a set place for 15 minutes, or set the gauge with a master part (a reference part of known size) at the same temperature.',
      },
      said: 'What engineers say: “You measured it warm. Give it fifteen minutes on the plate and it’s five microns smaller, and then it’s out.”',
      recall: [
        {
          q: 'An aluminium part 500 mm long is measured at 30 °C instead of 20 °C. Aluminium grows 0.023 mm per metre per °C. How much bigger does it measure, in mm?',
          number: 0.115,
          tolerance: 0.005,
          unit: 'mm',
          why: '0.5 m × 0.023 × 10 °C = 0.115 mm.',
        },
        {
          q: 'A turned part shows a regular wavy pattern of chatter marks. What is the most likely cause?',
          options: ['Vibration from a tool sticking out too far, or a thin wall', 'Wrong material grade', 'Too much coolant', 'A wrong drawing revision'],
          answer: 'Vibration from a tool sticking out too far, or a thin wall',
          why: 'Chatter is a vibration problem: stiffness and speed.',
        },
        {
          q: 'A shaft has a tolerance of ±0.01 mm. Which tool do you use at the machine?',
          options: ['A caliper', 'A steel ruler', 'A micrometer', 'A tape measure'],
          answer: 'A micrometer',
          why: 'A micrometer reads 0.001 mm; a caliper is too coarse for ±0.01.',
        },
        {
          q: 'What does a lower Ra value mean?',
          options: ['A rougher surface', 'A smoother surface', 'A harder surface', 'A larger diameter'],
          answer: 'A smoother surface',
          why: 'Ra is average roughness: lower is smoother.',
        },
      ],
      situation: {
        scene: 'You’re at a supplier. The customer’s CMM says a bore is 0.012 mm too big. The supplier’s own check at the machine says it’s fine. Both sides send angry emails.',
        ask: 'What do you ask to settle it?',
        model: 'At what temperature was each measurement taken: warm at the machine, or in a 20 °C room? With what gauge, and when was it last calibrated? And did both measure at the same depth and against the same datums? If we measure three parts on both sides under the same conditions, the emails can stop.',
        rubric: [
          'Asks about temperature at measurement',
          'Asks about the gauges and calibration',
          'Proposes a joint comparison under the same conditions',
        ],
      },
      sayIt: 'Explain to a new quality inspector in 60 seconds why a part can measure good at the machine and bad at the customer.',
      terms: [
        { term: 'Ra', def: 'Average surface roughness in µm; lower is smoother.' },
        { term: 'CMM', def: 'Coordinate measuring machine: measures points in 3D against datums.' },
        { term: 'Go/no-go gauge', def: 'Fixed gauge that tells good from bad without reading a number.' },
        { term: 'Chatter', def: 'Vibration during cutting that leaves a wavy pattern.' },
      ],
    },
  ],
};
