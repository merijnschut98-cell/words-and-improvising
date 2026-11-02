// eng.joining (EN): Welding and joining: MIG/MAG and TIG, spot welding, weld defects, inspection, bolting, bonding and riveting.
export default {
  lessons: [
    {
      id: 'eng.joining.arc',
      title: 'MIG/MAG and TIG welding',
      pre: [
        {
          q: 'MIG and MAG welding use the same machine. What is the difference?',
          options: ['The wire diameter', 'MAG is manual, MIG is robotic', 'The shielding gas: inert or active', 'The type of current'],
          answer: 'The shielding gas: inert or active',
          why: 'MIG uses an inert gas such as argon; MAG adds an active gas such as CO₂, for steel.',
        },
      ],
      teach: [
        'Arc welding melts the edges of the parts (the base metal) and extra metal (the filler) with an electric arc: a continuous spark between the electrode and the part, at roughly 20 to 35 volts and 100 to 400 amps. A shielding gas keeps air away from the molten pool, because oxygen and nitrogen cause porosity (gas bubbles in the weld) and brittle welds.',
        'MIG/MAG (also called GMAW, gas metal arc welding): a wire is fed continuously through the torch, the welding gun, and is both the electrode and the filler. MAG, metal active gas, is used on steel with argon plus 8 to 20% CO₂; an 82/18 mix is common. MIG, metal inert gas, uses pure argon, for aluminium. It’s fast and easy to automate: robot cells for car parts, frames, trailers and steel structures.',
        'TIG (GTAW, gas tungsten arc welding): a tungsten electrode that doesn’t melt, a separate filler rod fed by hand, and pure argon. Slower, but clean and precise: stainless pipe in food and pharma, thin sheet, aluminium, and the first layer (root pass) of welds in pressure piping. A good TIG welder is a scarce skill.',
        'Arc energy per mm of weld = volts × amps × 60 / (travel speed in mm/min × 1,000), in kJ/mm. Too much heat gives distortion and a wide heat-affected zone (HAZ) where steel loses strength; too little gives lack of fusion: the weld doesn’t melt properly into the part. Welders talk in parameters: wire feed speed, voltage, travel speed, and gas flow, usually 12 to 18 litres a minute.',
      ],
      example: {
        kind: 'worked',
        text: 'A robot MAG weld on a bracket: 24 V, 220 A, travel speed 400 mm/min. Arc energy = 24 × 220 × 60 / (400 × 1,000) = 0.79 kJ/mm; times the MAG efficiency of 0.8 gives a heat input of 0.63 kJ/mm, inside the 0.5 to 0.9 the welding procedure allows. On Tuesday the gas hose gets kinked behind the robot and flow drops from 15 to 5 litres a minute. Within an hour the welds are full of pores. The fix is a gas flow sensor that stops the robot below 10 litres a minute.',
      },
      said: 'What engineers say: “That’s porosity all along the seam. Check the gas first: flow, nozzle, a draught from the door. Nine times out of ten it’s the gas.”',
      recall: [
        {
          q: 'A weld runs at 25 V, 200 A and a travel speed of 300 mm/min. What is the arc energy, in kJ/mm?',
          number: 1,
          tolerance: 0.02,
          unit: 'kJ/mm',
          why: '25 × 200 × 60 / (300 × 1,000) = 300,000 / 300,000 = 1.0 kJ/mm.',
        },
        {
          q: 'Which process is the usual choice for stainless steel pipe in a dairy?',
          options: ['MAG', 'TIG', 'Spot welding', 'Flux-cored welding'],
          answer: 'TIG',
          why: 'TIG gives clean, precise welds with a smooth inside, which hygienic pipework needs.',
        },
        {
          q: 'What is the main job of the shielding gas?',
          options: ['Cooling the torch', 'Making the arc brighter', 'Cleaning the part before welding', 'Keeping air away from the molten pool'],
          answer: 'Keeping air away from the molten pool',
          why: 'Oxygen and nitrogen in the pool cause porosity and brittle welds.',
        },
        {
          q: 'Which gas is used for MIG welding aluminium?',
          options: ['Argon', 'Pure CO₂', 'Argon with 18% CO₂', 'Oxygen'],
          answer: 'Argon',
          why: 'Aluminium needs an inert gas; active gases would oxidise it.',
        },
      ],
      situation: {
        scene: 'You’re at a trailer manufacturer. Since November, porosity in the manual MAG welds has doubled. The welding supervisor blames a new batch of wire.',
        ask: 'What do you ask before the wire supplier gets the blame?',
        model: 'Where do the porous welds come from: which booths, near which doors? In winter the doors open for forklifts and a draught blows the gas away. What gas flow is set, and when were nozzles last cleaned? And is the steel coming in cold and wet from outside storage? If the porosity follows the location and not the wire batch, it isn’t the wire.',
        rubric: [
          'Asks where the defects occur, looking for draughts',
          'Asks about gas flow and nozzle condition',
          'Considers moisture on cold material before blaming the wire',
        ],
      },
      sayIt: 'Explain to a project manager in 60 seconds the difference between MIG/MAG and TIG and where each is used.',
      terms: [
        { term: 'MIG/MAG', def: 'Arc welding with a continuously fed wire; inert gas (MIG) or active gas (MAG).' },
        { term: 'TIG', def: 'Arc welding with a non-melting tungsten electrode and a separate filler rod.' },
        { term: 'Shielding gas', def: 'Gas that keeps air away from the weld pool.' },
        { term: 'HAZ', def: 'Heat-affected zone: base metal next to the weld changed by the heat.' },
      ],
    },
    {
      id: 'eng.joining.spot',
      title: 'Resistance spot welding',
      pre: [
        {
          q: 'Roughly how many spot welds hold a typical car body together?',
          options: ['About 500', 'About 1,500', 'About 4,000–5,000', 'About 20,000'],
          answer: 'About 4,000–5,000',
          why: 'A body-in-white typically has several thousand spot welds, almost all made by robots.',
        },
      ],
      teach: [
        'Resistance spot welding joins overlapping sheets at single points. Two copper electrodes squeeze the sheets together and pass a high current, around 8 to 12 kA (8,000 to 12,000 amps), for 200 to 400 milliseconds. The resistance at the contact heats the metal until a nugget, a small lens of molten metal, forms and solidifies. No filler, no gas. Robot weld guns do this on every body-in-white line (the bare, unpainted car body).',
        'Three main parameters: current, weld time and electrode force (about 2 to 4 kN). Heat = I² × R × t, so current counts squared: 10% more current gives about 21% more heat. Too little gives a small nugget or none, a “stick weld” that looks fine but holds nothing. Too much gives expulsion: sparks and splashed metal, deep marks and a weaker joint.',
        'Nugget size is the quality measure. A common rule: the nugget diameter must be at least 4√t, with t the thinnest sheet in mm. For 1 mm sheet that’s 4 mm; for 2 mm sheet about 5.7 mm.',
        'Electrode tips wear: they mushroom, growing wider, so the same current spreads over a bigger area and the nugget shrinks. Two counters: a stepper that raises the current as the weld count rises, and tip dressing, where a cutter reshapes the tips, on galvanised (zinc-coated) steel often every 200 welds or so. Zinc coating makes tips wear faster.',
      ],
      example: {
        kind: 'worked',
        text: 'A gun welds two 1.2 mm galvanised sheets at 9.5 kA, 300 ms and 3 kN, with a Ø6 mm tip face: 28.3 mm², so 9,500 / 28.3 = 336 A/mm². The tip dresser jams and nobody notices. After 500 welds the tip face is Ø7.5 mm: 44.2 mm², and the current per mm² of tip (the current density) drops to 215 A/mm², 36% less. The nugget shrinks from 5.5 to about 3.8 mm, below the minimum of 4√1.2 = 4.4 mm. The daily chisel test (prying the sheets apart and measuring the weld) catches it, but 2 shifts of bodies need checking.',
      },
      said: 'What engineers say: “Don’t just turn up the current. Check the dresser first. If the tips are mushroomed, more amps just gives you expulsion.”',
      recall: [
        {
          q: 'The thinnest sheet in a joint is 2.25 mm. What is the minimum nugget diameter, using 4√t, in mm?',
          number: 6,
          tolerance: 0.05,
          unit: 'mm',
          why: '√2.25 = 1.5; 4 × 1.5 = 6 mm.',
        },
        {
          q: 'The weld current is raised by 10%. By roughly how many % does the heat increase?',
          number: 21,
          tolerance: 1,
          unit: '%',
          why: 'Heat scales with I²: 1.1² = 1.21, so about 21% more.',
        },
        {
          q: 'The electrode tips have mushroomed. What happens to the welds?',
          options: ['Nuggets get bigger', 'Nothing, the current is the same', 'The current density drops and nuggets shrink', 'The welds get stronger'],
          answer: 'The current density drops and nuggets shrink',
          why: 'The same current spreads over a larger contact area, so less heat per mm².',
        },
        {
          q: 'A robot gun throws heavy sparks on every weld. What is the likely cause?',
          options: ['Too little current', 'Too much current or too little force', 'Tips that were just dressed', 'Sheets that are too thick'],
          answer: 'Too much current or too little force',
          why: 'Expulsion happens when the molten metal is overheated or not held in by enough force.',
        },
      ],
      situation: {
        scene: 'You’re in a body shop. The chisel test found undersized welds on robot 14. The proposal from the shift is to raise the current on that robot by 15%.',
        ask: 'What do you ask before they change the parameters?',
        model: 'When were the tips on robot 14 last dressed, and is the dresser actually cutting? Are the tips centred and is the gun force right? If the tips are mushroomed, more current will cover it for a day and then give expulsion. I’d check tips, dresser and force first, and only then look at the weld schedule.',
        rubric: [
          'Asks about tip dressing and tip condition',
          'Asks about electrode force and alignment',
          'Warns that raising current hides the cause and risks expulsion',
        ],
      },
      sayIt: 'Explain to a production manager in 60 seconds how a spot weld is made and why tip dressing matters.',
      terms: [
        { term: 'Nugget', def: 'The lens of fused metal that forms the spot weld.' },
        { term: 'Expulsion', def: 'Molten metal spraying out of the weld as sparks: too much heat or too little force.' },
        { term: 'Tip dressing', def: 'Reshaping the electrode tips with a cutter to keep the contact area right.' },
        { term: 'Stepper', def: 'Control function that raises current as tips wear.' },
      ],
    },
    {
      id: 'eng.joining.defects',
      title: 'Weld defects and their causes',
      pre: [
        {
          q: 'Which weld defect is the most dangerous because it’s often invisible from the outside?',
          options: ['Spatter', 'Discoloration', 'Undercut at the edge', 'Lack of fusion'],
          answer: 'Lack of fusion',
          why: 'The weld can look perfect while inside it never bonded to the base metal.',
        },
      ],
      teach: [
        'Porosity: gas bubbles trapped in the weld. Causes: shielding gas lost (draught, low flow, spatter in the nozzle), dirty, oily or wet metal, or vapour from a zinc coating. Pores at the surface you can see; pores inside need X-ray or ultrasonic testing.',
        'Lack of fusion and incomplete penetration: the weld metal did not melt into the base metal or did not reach the root, the bottom of the joint. Causes: too little heat, travelling too fast, the wrong torch angle, a poorly prepared joint. It’s the most dangerous defect, because a weld can look perfect on the outside while hiding a crack-like flaw.',
        'Cracks are never accepted. Hot cracks form as the weld solidifies, along the centre of the bead (the line of weld metal). Cold or hydrogen cracks form hours after welding, in the heat-affected zone of high-strength steel, from moisture or hydrogen; the cure is dry filler and preheating the parts. That’s why inspection of some steels waits 16 to 48 hours.',
        'Distortion: heat expands the metal and cooling shrinks it, so parts bend and angles close up. It’s a defect of the part rather than of the weld. Remedies: jigs (holding frames) and clamping, pre-setting parts at the opposite angle, a balanced welding sequence, and less heat. Spatter (drops of metal thrown out) and small undercut (a groove melted along the weld edge) are usually cosmetic or minor.',
      ],
      example: {
        kind: 'worked',
        text: 'An excavator boom: ultrasonic testing finds lack of fusion in 3 of 40 joints, all welded vertically upwards by the second shift. The welding procedure says 300 mm/min travel speed; measured is 405 mm/min, 35% too fast, which drops the arc energy by 26%. The welders also skipped the weave, the side-to-side motion of the torch. Why? After a robot breakdown, the shift had a tighter target and sped up. Each repair means gouging out the bad weld, rewelding and retesting: about 3.5 hours. The fix is a realistic plan and travel-speed checks, not a talk about craftsmanship.',
      },
      said: 'What engineers say: “It looks beautiful from the outside, but the ultrasonic test shows no fusion on the side wall. They were running way too fast.”',
      recall: [
        {
          q: 'The procedure specifies 300 mm/min travel speed; the welder runs at 405 mm/min. By how many % does the arc energy drop?',
          number: 26,
          tolerance: 1,
          unit: '%',
          why: 'Arc energy scales with 1 / speed: 300 / 405 = 0.74, so about 26% less heat per mm.',
        },
        {
          q: 'What typically causes porosity in MAG welding?',
          options: ['Loss of shielding gas, for example from a draught', 'Too low a travel speed', 'Preheating the steel', 'Using a thicker wire'],
          answer: 'Loss of shielding gas, for example from a draught',
          why: 'Air reaching the molten pool leaves gas bubbles in the weld.',
        },
        {
          q: 'A crack appears in the heat-affected zone of a high-strength steel weld a day after welding. What is it most likely?',
          options: ['A hot crack', 'Porosity', 'A hydrogen (cold) crack', 'Distortion'],
          answer: 'A hydrogen (cold) crack',
          why: 'Hydrogen cracks are delayed and form in the HAZ of hardenable steels.',
        },
        {
          q: 'Which measure reduces distortion?',
          options: ['Higher current', 'Welding everything from one side first', 'Slower travel speed', 'A balanced welding sequence and pre-setting the parts'],
          answer: 'A balanced welding sequence and pre-setting the parts',
          why: 'Balancing heat and pre-setting against the expected shrinkage keeps the part straight.',
        },
      ],
      situation: {
        scene: 'You’re at a manufacturer of steel frames for cranes. The welding supervisor says: “Our welds look great, we check every one visually.” There’s no other inspection.',
        ask: 'What do you ask?',
        model: 'Visual checks catch surface defects, but lack of fusion and internal cracks can look perfect from outside. What does the customer specification or the standard require for these load-bearing welds, and what percentage gets ultrasonic testing? If the answer is none, I’d like a sample of critical joints tested before we talk about anything else.',
        rubric: [
          'Points out that visual inspection misses internal defects',
          'Asks what the specification or standard requires',
          'Proposes a sample of volumetric testing on critical welds',
        ],
      },
      sayIt: 'Explain to a plant manager in 60 seconds the four main weld defects and which one keeps welding engineers awake.',
      terms: [
        { term: 'Porosity', def: 'Gas bubbles trapped in the weld.' },
        { term: 'Lack of fusion', def: 'Weld metal that did not bond to the base metal or the previous pass.' },
        { term: 'Hydrogen cracking', def: 'Delayed cracking in the HAZ, caused by hydrogen and stress.' },
        { term: 'Distortion', def: 'Bending or shrinking of the part from welding heat.' },
      ],
    },
    {
      id: 'eng.joining.inspection',
      title: 'Weld inspection, WPS and WPQR',
      pre: [
        {
          q: 'What is a WPS?',
          options: ['A list of the best welders', 'The inspection report of a weld', 'The instruction for how a specific weld must be made: process, parameters, position', 'The price list for welding work'],
          answer: 'The instruction for how a specific weld must be made: process, parameters, position',
          why: 'A welding procedure specification tells the welder exactly how to make that weld.',
        },
      ],
      teach: [
        'Visual testing (VT) comes first and is cheapest: weld size (on a fillet weld, the corner weld between two plates: its throat thickness, checked with a weld gauge), undercut, surface pores, cracks, spatter. It only sees the surface. On most structural work every weld gets it.',
        'Dye penetrant (PT): a red dye seeps into surface cracks, and a white developer draws it out, showing cracks too fine for the eye. Magnetic particle testing (MT) does the same on steel, also just below the surface. Ultrasonic testing (UT) sends sound pulses in and listens for reflections from internal flaws such as lack of fusion. Radiography (RT) is X-ray, good for porosity.',
        'Destructive tests: for spot welds, the chisel test and peel test pry the sheets apart; a good weld tears a button out of the sheet, and you measure its diameter. Cut-and-etch sections show penetration. Bend and tensile tests are used to qualify procedures. All on samples, per shift or per robot.',
        'A WPQR (welding procedure qualification record) proves a procedure works: a test piece is welded, then tested destructively and non-destructively, under ISO 15614. The WPS (welding procedure specification) is the instruction derived from it, at the workstation: process, filler, gas, current and voltage ranges, position, preheat. Welders are qualified separately under ISO 9606. For structural steel under EN 1090 this is mandatory.',
      ],
      example: {
        kind: 'worked',
        text: 'A body shop with 12 welding robots peel-tests one part per robot per shift: 32 welds, each button measured with a caliper, minimum 4.4 mm for 1.2 mm sheet. The destroyed parts cost 12 × 3 × €140 = €5,040 a day. So the plant adds handheld ultrasonic checks: 200 welds per shift without destroying anything, results into an SPC chart per robot. The peel tests drop to once a day per robot, and are still used to calibrate what the ultrasonic readings mean.',
      },
      said: 'What engineers say: “Is there a WPS for that joint, and is that welder qualified for vertical-up? Because the auditor will ask both.”',
      recall: [
        {
          q: 'A plant destroys one €140 part per robot per shift for peel testing. It has 12 robots and runs 3 shifts. What does that cost per day, in €?',
          number: 5040,
          tolerance: 1,
          unit: '€',
          why: '12 × 3 × €140 = €5,040, which is why plants add non-destructive checks.',
        },
        {
          q: 'You want to find a fine surface crack in a weld on 304 stainless steel. Which method?',
          options: ['Magnetic particle testing', 'Dye penetrant testing', 'A tensile test', 'Weighing the part'],
          answer: 'Dye penetrant testing',
          why: 'Penetrant shows surface cracks on any non-porous metal; magnetic particle needs magnetic steel, and 304 stainless is not magnetic.',
        },
        {
          q: 'You suspect lack of fusion inside a thick butt weld (two plates welded edge to edge). Which method finds it without destroying the part?',
          options: ['Visual testing', 'Dye penetrant testing', 'A chisel test', 'Ultrasonic testing'],
          answer: 'Ultrasonic testing',
          why: 'UT detects internal planar flaws such as lack of fusion.',
        },
        {
          q: 'What is the difference between a WPQR and a WPS?',
          options: ['They are the same document', 'The WPQR proves the procedure works; the WPS is the instruction for the welder', 'The WPS qualifies the welder; the WPQR is the invoice', 'The WPQR is only needed for robots'],
          answer: 'The WPQR proves the procedure works; the WPS is the instruction for the welder',
          why: 'The qualification record backs up the specification used on the floor.',
        },
      ],
      situation: {
        scene: 'You’re at a steel construction client working under EN 1090. A new welder starts today on a load-bearing job. The supervisor says: “He’s got twenty years’ experience, he’ll be fine.”',
        ask: 'What do you ask?',
        model: 'Is he qualified under ISO 9606 for this process, material and position, and is his certificate in date? Is there a WPS for these joints at the workstation, backed by a WPQR? Experience is great, but under EN 1090 the auditor and the customer will ask for the paperwork, and without it the welds may have to be cut out.',
        rubric: [
          'Asks for the welder’s qualification for this process and position',
          'Asks for the WPS at the workstation and its WPQR',
          'Explains the consequence under EN 1090 without dismissing experience',
        ],
      },
      sayIt: 'Explain to a project sponsor in 60 seconds what a WPS and a welder qualification are, and why an audit asks for them.',
      terms: [
        { term: 'NDT', def: 'Non-destructive testing: VT, PT, MT, UT, RT.' },
        { term: 'Dye penetrant', def: 'Red dye and developer that reveal fine surface cracks.' },
        { term: 'WPS', def: 'Welding procedure specification: how a specific weld must be made.' },
        { term: 'WPQR', def: 'Welding procedure qualification record: the test proof behind a WPS.' },
      ],
    },
    {
      id: 'eng.joining.bolting',
      figure: 'eng.joining.bolt',
      title: 'Bolted joints: torque and preload',
      pre: [
        {
          q: 'When you tighten a bolt with a torque wrench, how much of the torque ends up stretching the bolt into clamping force?',
          options: ['About 90%', 'About 50%', 'All of it', 'About 10–15%'],
          answer: 'About 10–15%',
          why: 'Roughly half is lost to friction under the head and about 40% in the thread.',
        },
      ],
      teach: [
        'A bolt works like a spring: tightening stretches it, and that tension, the preload, clamps the joint. Preload is what matters, not torque. An M10 bolt (metric thread, 10 mm) in strength grade 8.8, with normal friction, gets about 25 kN of preload from about 49 Nm (newton-metres) of torque.',
        'Torque is only an indirect measure. About 50% goes into friction under the head, 40% into friction in the thread, and only 10% into stretching the bolt. Change the friction with oil, a different coating, dirt or rust, and the same torque gives 25 to 30% more or less preload. An oiled bolt tightened to a dry torque can be overloaded.',
        'Tools: click wrenches for manual work, pulse tools (air tools that tighten in short bursts), and electric nutrunners that control and record torque and angle. These are standard in car assembly, where safety joints like wheels and brakes are traceable per car. Torque-angle tightening, a low snug torque and then a fixed extra angle, gives a more accurate preload. Audits check breakaway torque, the torque needed to turn a tightened bolt further, with a calibrated wrench, or use paint marks.',
        'Why bolts loosen: vibration that makes the joint slip sideways, which turns the nut back; settling of rough surfaces or paint under the head, which loses preload; and too little preload to begin with. Remedies: the right preload, longer bolts, heads with a wide flange, no paint in the joint. Split spring washers don’t help in vibration tests; thread-locking adhesive does.',
      ],
      example: {
        kind: 'worked',
        text: 'A seat frame is fixed with four M10 bolts, nutrunner spec 50 Nm ±10%. The shift audit measures breakaway torque on five cars: 53, 52, 31, 54 and 52 Nm. Breakaway normally reads a little above the install torque, so 31 is a problem. The nutrunner log shows four OK results for that car, but two of them on the same bolt: the operator re-hit a tightened bolt, which reads OK instantly, and the fourth bolt was only run down by hand. Fix: position control on the tool, so it counts each bolt location only once.',
      },
      said: 'What engineers say: “The tool says fifty newton-metre, fine, but what’s the clamp load? Somebody oiled those bolts, so we’re way over.”',
      recall: [
        {
          q: 'A joint’s nominal preload is 25 kN. With torque control, preload scatters about ±25%. What is the lowest preload you might get, in kN?',
          number: 18.75,
          tolerance: 0.3,
          unit: 'kN',
          why: '25 × 0.75 = 18.75 kN.',
        },
        {
          q: 'Where does most of the tightening torque go?',
          options: ['Into friction under the head and in the thread', 'Into stretching the bolt', 'Into heating the tool', 'Into bending the part'],
          answer: 'Into friction under the head and in the thread',
          why: 'Around 90% is friction; only about 10% creates preload.',
        },
        {
          q: 'Why do bolted joints loosen under vibration?',
          options: ['The bolt metal gets tired', 'Sideways slip in the joint turns the nut back', 'Lock washers wear out', 'Torque wrenches lose calibration'],
          answer: 'Sideways slip in the joint turns the nut back',
          why: 'Transverse slip lets the thread rotate loose when preload is too low to stop it.',
        },
        {
          q: 'Technicians oil bolts that should be tightened dry, at the dry torque. What happens?',
          options: ['Preload drops', 'Preload rises, possibly overloading the bolt', 'Nothing changes', 'The bolts will loosen sooner'],
          answer: 'Preload rises, possibly overloading the bolt',
          why: 'Less friction means more of the torque turns into stretch.',
        },
      ],
      situation: {
        scene: 'You’re at a manufacturer of agricultural machines. Wheel bolts have come loose at three customers. The engineering team proposes raising the tightening torque by 20%.',
        ask: 'What do you ask before the torque goes up?',
        model: 'What preload do we actually get today, and what friction condition is the torque spec based on: dry, oiled, coated? Is there paint under the wheel nuts that settles in use? And what do the audit and nutrunner data say: were these joints really at spec, or were some missed? Raising torque on a joint that’s missing preload for another reason won’t fix it.',
        rubric: [
          'Shifts the question from torque to preload',
          'Asks about friction condition and paint in the joint',
          'Asks for audit or tool data to check whether joints were at spec',
        ],
      },
      sayIt: 'Explain to an assembly team leader in 60 seconds why torque is not the same as clamping force.',
      terms: [
        { term: 'Preload', def: 'The tension in a tightened bolt that clamps the joint.' },
        { term: 'Torque-angle', def: 'Tightening to a snug torque, then turning a fixed angle.' },
        { term: 'Breakaway torque', def: 'Torque needed to start turning an already tightened bolt; used in audits.' },
        { term: 'Settling', def: 'Loss of preload as surfaces or paint under the head flatten.' },
      ],
    },
    {
      id: 'eng.joining.bonding',
      title: 'Adhesives, rivets and clinching',
      pre: [
        {
          q: 'Why can’t you simply spot weld aluminium to steel?',
          options: ['It’s too expensive', 'Aluminium doesn’t conduct electricity', 'They form brittle compounds, and aluminium melts far below steel', 'It is allowed but too slow'],
          answer: 'They form brittle compounds, and aluminium melts far below steel',
          why: 'Aluminium melts around 660 °C, steel around 1,500 °C, and where they mix they form brittle intermetallics.',
        },
      ],
      teach: [
        'Structural adhesives (epoxies, polyurethanes, acrylics) join different materials, such as aluminium to steel or composites, without heat distortion. They also seal, damp vibration and spread load over an area, which helps against fatigue (cracking from repeated loads). They’re strong in shear (parts sliding along each other) and weak in peel (one edge pulled open). They need clean surfaces and curing time; in car body shops, epoxy cures in the paint oven at about 180 °C. And they’re hard to inspect.',
        'Rivets. Blind rivets (pop rivets) are set from one side. Self-piercing rivets (SPR) punch through the top sheet and flare into the bottom one without a pre-drilled hole: the standard for aluminium car bodies. Solid rivets are still used in aircraft. Quality is checked through head height and sections cut through the joint.',
        'Clinching: a punch presses the sheets into a shaped die below them, forming an interlocking button, with no extra part and no heat. Used in ventilation ducts, appliances and car doors. Weaker than a spot weld, but cheap, fume-free and fine with coated sheet.',
        'How engineers choose. Same material, steel, high strength, cheap: weld. Mixed materials, crash stiffness, sealing: adhesive plus rivets, a hybrid joint. Must come apart for service: bolts. Questions to ask: does it need to come apart, which materials, what kind of load (peel or shear), and how do we check it in production?',
      ],
      example: {
        kind: 'worked',
        text: 'A battery tray for an electric van joins aluminium profiles (extrusions) to steel crossmembers. Welding is out. The design: 96 self-piercing rivets spaced 30 mm apart, plus a 14-metre bead (line) of structural epoxy. The rivets hold the parts while the adhesive cures in the oven and take the peel loads at the bead ends; the adhesive carries the shear and seals out water. In production a camera checks every bead for gaps, the riveting tool monitors force and stroke on every rivet, and one tray per shift is cut up to check head height and bead coverage.',
      },
      said: 'What engineers say: “Glue’s great in shear, but this joint peels open in a crash. Put a rivet at each end of the bead to stop the peel.”',
      recall: [
        {
          q: 'An adhesive lap joint has an overlap of 25 mm × 20 mm. The adhesive’s shear strength is 20 MPa (N/mm²). Roughly what load can it carry in shear, in kN?',
          number: 10,
          tolerance: 0.2,
          unit: 'kN',
          why: '25 × 20 = 500 mm²; 500 × 20 N/mm² = 10,000 N = 10 kN.',
        },
        {
          q: 'In which type of loading is an adhesive joint weakest?',
          options: ['Shear', 'Compression', 'Peel', 'Uniform tension over the whole area'],
          answer: 'Peel',
          why: 'Peel concentrates the load on a thin line at the edge of the bond.',
        },
        {
          q: 'What is the main advantage of self-piercing rivets in aluminium car bodies?',
          options: ['No pre-drilled hole and no heat', 'They are invisible', 'They can be removed easily', 'They need no special tools'],
          answer: 'No pre-drilled hole and no heat',
          why: 'SPR joins aluminium and mixed materials quickly, without heat or drilling.',
        },
        {
          q: 'When do engineers choose bolts over welding or bonding?',
          options: ['When the joint must be as light as possible', 'When the parts are the same steel', 'When it needs to be sealed', 'When the joint must come apart for service'],
          answer: 'When the joint must come apart for service',
          why: 'Bolts are the only one of these you can undo and redo.',
        },
      ],
      situation: {
        scene: 'You’re at a client making machine frames. To save weight, the design team wants to change a steel bracket to aluminium and “just weld it to the steel frame like before”.',
        ask: 'What do you ask?',
        model: 'Aluminium to steel can’t be welded the normal way, so what joining method do we plan: bolts, rivets, adhesive or a combination? Does the joint need to come apart for service, and does it take peel or shear loads? And how do we check joint quality in production? These answers might change the weight saving and the cost, so better to know now.',
        rubric: [
          'Flags that aluminium to steel can’t be welded conventionally',
          'Asks about service, load type and inspection',
          'Links the choice back to the business case',
        ],
      },
      sayIt: 'Explain to a product manager in 60 seconds when engineers choose adhesive, rivets or bolts instead of welding.',
      terms: [
        { term: 'Structural adhesive', def: 'Load-bearing glue, strong in shear, weak in peel.' },
        { term: 'Self-piercing rivet (SPR)', def: 'Rivet that punches through the top sheet and locks into the bottom, without a hole.' },
        { term: 'Clinching', def: 'Joining sheets by pressing them into an interlocking button.' },
        { term: 'Peel vs shear', def: 'Peel pulls a joint open from one edge; shear slides the parts along each other.' },
      ],
    },
  ],
};
