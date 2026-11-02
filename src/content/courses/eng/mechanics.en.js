// eng.mechanics (EN): Materials and strength: forces and torque, stress and stiffness, yield and safety factor, fatigue, materials, heat treatment.
export default {
  lessons: [
    {
      id: 'eng.mechanics.forces',
      title: 'Force, weight and torque',
      pre: [
        {
          q: 'A crate with a mass of 100 kg hangs still from a hook. Roughly how large is the force on the hook?',
          options: ['100 N', 'About 1,000 N (1 kN)', '10 N', '10,000 N'],
          answer: 'About 1,000 N (1 kN)',
          why: 'Weight = mass × 9.81 m/s²: 100 × 9.81 = 981 N, about 1 kN.',
        },
      ],
      teach: [
        'Force is measured in newtons (N); mass in kilograms. Weight is the force gravity puts on a mass: mass × 9.81 m/s². So a 100 kg crate pulls on its hook with about 981 N; engineers round to “1 kN per 100 kg”. Drawings and data sheets give loads in N or kN; lifting gear is rated in kg or tonnes, as its working load limit (WLL).',
        'Torque is a turning force: force × lever arm. Pushing 200 N on a wrench 0.25 m long gives 50 Nm. Double the arm and you need half the force for the same torque. Bolts are tightened to a torque, motors deliver torque, gearboxes trade speed for torque.',
        'A part that doesn’t move has all its forces and torques in balance. That simple rule lets engineers work out what each support, bolt or bearing carries. A load exactly in the middle of a beam on two supports puts half its weight on each; move it close to one support and that support takes nearly all of it.',
        'Loads come in kinds: static (constant, like a tank on its legs), dynamic (changing, like a press stroke or a vibrating motor) and impact (a dropped load, a crash stop). Dynamic and impact loads can be several times the static weight. When someone says “it only weighs 200 kg”, ask how it is loaded.',
      ],
      example: {
        kind: 'worked',
        text: 'A 50 kg motor is mounted on a wall bracket, with its centre 0.4 m from the wall. Weight: 50 × 9.81 = 490 N. The turning moment at the wall: 490 N × 0.4 m = 196 Nm, and the top bolts take that as tension. A redesign moves the motor out to 0.8 m: the moment doubles to 392 Nm, with the same motor. Because the motor vibrates, the engineer also applies a factor for the dynamic load on top. The weight didn’t change; the lever arm and the way it’s loaded did.',
      },
      said: 'What engineers say: “It’s only fifty kilos, but it hangs eight hundred mil out and it vibrates. Check the bolts.”',
      recall: [
        {
          q: 'A load has a mass of 250 kg. Using g = 9.81 m/s², what is its weight, in newtons?',
          number: 2452.5,
          tolerance: 10,
          unit: 'N',
          why: '250 × 9.81 = 2,452.5 N.',
        },
        {
          q: 'A technician pushes with 150 N at the end of a 0.4 m wrench, at right angles to it. What torque does that give, in Nm?',
          number: 60,
          tolerance: 0.5,
          unit: 'Nm',
          why: 'Torque = force × arm = 150 × 0.4 = 60 Nm.',
        },
        {
          q: 'A beam rests on two supports 2 m apart. A load of 6 kN sits exactly in the middle; ignore the beam’s own weight. What force does each support carry, in kN?',
          number: 3,
          tolerance: 0.05,
          unit: 'kN',
          why: 'A load in the middle splits equally: 6 / 2 = 3 kN per support.',
        },
        {
          q: 'A press hits a part once every second, all day. What kind of load is that on the press frame?',
          options: ['Static', 'Dynamic', 'No load', 'Only a weight load'],
          answer: 'Dynamic',
          why: 'The load changes with every stroke; repeated changing loads are dynamic.',
        },
      ],
      situation: {
        scene: 'You’re at a plant where maintenance wants to hang a new 400 kg electric hoist from an existing roof beam, “because the old one was 300 kg and that was fine”.',
        ask: 'What do you ask before it goes up?',
        model: 'What load is the beam designed for, and who checked it? The hoist weighs 400 kg, but what will it lift on top of that, and how hard can a load stop or swing: the dynamic load can be well above the static weight. Where on the beam does it hang: near a support or in the middle of the span? And what are the beam and the hoist’s rated WLL? Someone qualified should sign off the calculation.',
        rubric: [
          'Asks for the beam’s rated capacity and a calculation, not a comparison with the old hoist',
          'Includes the lifted load and dynamic effects, not just the hoist’s weight',
          'Asks where on the span the load hangs',
        ],
      },
      sayIt: 'Explain to a production supervisor in 60 seconds the difference between mass, weight and torque.',
      terms: [
        { term: 'Newton (N)', def: 'Unit of force; 100 kg weighs about 1,000 N (1 kN).' },
        { term: 'Torque', def: 'Turning force: force × lever arm, in Nm.' },
        { term: 'Working load limit (WLL)', def: 'The maximum load lifting gear may carry in normal use.' },
        { term: 'Dynamic load', def: 'A load that changes over time; can be several times the static weight.' },
      ],
    },
    {
      id: 'eng.mechanics.stress',
      title: 'Stress, strain and stiffness',
      pre: [
        {
          q: 'Two rods of the same diameter, one steel and one aluminium, carry the same pulling force. Both stay elastic. Which stretches more?',
          options: ['The steel rod', 'The aluminium rod, about three times as much', 'Both the same', 'Neither stretches'],
          answer: 'The aluminium rod, about three times as much',
          why: 'Aluminium is about a third as stiff as steel (E about 70,000 against 210,000 MPa).',
        },
      ],
      teach: [
        'Stress is force per area: σ = F / A, in N/mm², which is the same as MPa. A 10 kN pull on a rod with a 100 mm² cross-section gives 100 MPa. Stress, not force, decides whether a part fails: the same force is harmless on a thick bar and fatal on a thin one.',
        'Strain is how much a part stretches relative to its length: ε = ΔL / L. A 1,000 mm bar that gets 0.5 mm longer has a strain of 0.0005. Up to a limit, metals behave like a spring: stress = E × strain. E, Young’s modulus, is the stiffness of the material: about 210,000 MPa for steel, 70,000 for aluminium, 2,000 to 3,000 for many plastics.',
        'Stiffness and strength are different things. Stiffness is how much a part deflects under load; strength is how much load it takes before it bends permanently or breaks. High-strength steel is much stronger than mild steel but just as stiff: the same E. If a frame flexes too much, a stronger grade won’t help; more material or a better shape will.',
        'Shape matters as much as material. The bending stiffness of a beam rises with its height cubed: a beam twice as tall is eight times stiffer. That is why beams are I-shaped and why a tube beats a solid rod of the same weight.',
      ],
      example: {
        kind: 'worked',
        text: 'A steel tie rod of Ø20 mm has a cross-section of 314 mm². It carries 31.4 kN: stress = 31,400 / 314 = 100 MPa. Strain = 100 / 210,000 = 0.000476. Over its 2,000 mm length that is 0.95 mm of stretch. The same rod in aluminium: 100 / 70,000 × 2,000 = 2.86 mm. Both are far below their yield strength, so both are strong enough. But if the rod holds a machine alignment, the aluminium version moves three times as much. The question was never only “will it break?”, but also “how much will it move?”',
      },
      said: 'What engineers say: “Strength isn’t the issue, it’s stiffness. High-tensile steel won’t help; we need a deeper section.”',
      recall: [
        {
          q: 'A rod with a cross-section of 400 mm² carries a pull of 20 kN. What is the stress, in MPa (N/mm²)?',
          number: 50,
          tolerance: 0.5,
          unit: 'MPa',
          why: '20,000 N / 400 mm² = 50 N/mm² = 50 MPa.',
        },
        {
          q: 'A steel bar (E = 210,000 MPa) of 3,000 mm long carries a stress of 210 MPa and stays elastic. How much does it stretch, in mm?',
          number: 3,
          tolerance: 0.1,
          unit: 'mm',
          why: 'Strain = 210 / 210,000 = 0.001; 0.001 × 3,000 mm = 3 mm.',
        },
        {
          q: 'A steel machine frame deflects too much under load, but nothing breaks. What helps?',
          options: ['Swap to high-strength steel of the same dimensions', 'Make the section taller or add stiffeners', 'Paint it', 'Tighten the bolts harder'],
          answer: 'Make the section taller or add stiffeners',
          why: 'All steels have about the same E; only more material in the right place adds stiffness.',
        },
        {
          q: 'A beam is made twice as tall, with the same width and material. What happens to its bending stiffness?',
          options: ['It doubles', 'It becomes four times as large', 'It becomes eight times as large', 'It stays the same'],
          answer: 'It becomes eight times as large',
          why: 'Bending stiffness rises with height cubed: 2 × 2 × 2 = 8.',
        },
      ],
      situation: {
        scene: 'You’re at a machine builder. To save weight, an engineer proposes replacing a steel bracket that holds a camera with an aluminium bracket of exactly the same dimensions. The line has vibration issues already.',
        ask: 'What do you ask?',
        model: 'Aluminium is about a third as stiff as steel: with the same dimensions the bracket will deflect and vibrate about three times as much. Is the bracket there for strength or for stiffness? For a camera, stiffness and vibration matter most. Can the aluminium version be given a deeper or boxed section to match the stiffness, and does it still save weight then?',
        rubric: [
          'Notes that aluminium is about a third as stiff as steel',
          'Separates the strength question from the stiffness and vibration question',
          'Suggests changing the shape to recover stiffness and rechecking the weight gain',
        ],
      },
      sayIt: 'Explain the difference between stiffness and strength to a project manager in 60 seconds.',
      terms: [
        { term: 'Stress', def: 'Force per area, in N/mm² or MPa.' },
        { term: 'Strain', def: 'Stretch relative to the original length.' },
        { term: 'Young’s modulus (E)', def: 'The stiffness of a material: stress divided by strain in the elastic range.' },
        { term: 'Stiffness and strength', def: 'How much a part deflects, versus how much load it takes before it yields or breaks.' },
      ],
    },
    {
      id: 'eng.mechanics.strength',
      title: 'Yield, tensile strength and safety factor',
      pre: [
        {
          q: 'A structural steel is called S355. What does the 355 stand for?',
          options: ['The carbon content in percent', 'A minimum yield strength of 355 MPa', 'The maximum temperature in °C', 'The year of the standard'],
          answer: 'A minimum yield strength of 355 MPa',
          why: 'European structural steels carry their minimum yield strength in the name.',
        },
      ],
      teach: [
        'A tensile test pulls a sample until it breaks and plots stress against strain. At first the line is straight: elastic, the sample springs back. At the yield strength the material starts to deform permanently. The highest stress reached is the tensile strength (UTS). Then it necks and breaks.',
        'Designers keep stresses below yield, because a part that bends permanently has usually already failed. Steel grades carry their minimum yield in the name: S235 yields at 235 MPa, S355 at 355 MPa (for thin sections). Bolt grades work differently: in 8.8, the first number × 100 is the tensile strength in MPa (800), and the second number × 10 is the yield as a percentage of it (80%), so 640 MPa.',
        'Ductile materials (most steels, aluminium, copper) stretch a lot before they break, which gives a warning. Brittle materials (cast iron, glass, ceramics, very hard steels) break with little warning. Cold makes some steels brittle; that is why steel certificates show an impact test at a temperature, for example 27 J at −20 °C.',
        'The safety factor is the margin between strength and the expected stress: yield divided by working stress. Typical values run from about 1.5 for well-known static loads to 3 or more for uncertain or dynamic loads; lifting gear often uses 4 to 5 against breaking. A safety factor covers unknowns. It is not spare capacity for extra load.',
      ],
      example: {
        kind: 'worked',
        text: 'A bracket of S235 sees a working stress of 120 MPa. Safety factor: 235 / 120 = 1.96, fine for a steady load. After a process change the load doubles: 240 MPa, above yield. The bracket will bend permanently. Switching to S355 gives 355 / 240 = 1.48: it holds, but the margin is thin if the load vibrates, and fatigue may become the next problem. A thicker bracket in S235, bringing the stress back to 120 MPa, restores the original margin. The question is always: what is the stress now, and what margin do we need for this kind of load?',
      },
      said: 'What engineers say: “It’s not about whether it breaks. At that load it yields, and then it’s scrap anyway.”',
      recall: [
        {
          q: 'A part made of S355 (yield 355 MPa) carries a working stress of 142 MPa. What is its safety factor against yield?',
          number: 2.5,
          tolerance: 0.02,
          unit: '',
          why: '355 / 142 = 2.5.',
        },
        {
          q: 'A bolt has grade 10.9. Using the rule (first number × 100 = tensile strength in MPa; second number × 10 = yield as a percentage of tensile), what is its yield strength, in MPa?',
          number: 900,
          tolerance: 1,
          unit: 'MPa',
          why: 'Tensile 10 × 100 = 1,000 MPa; yield 90% of that = 900 MPa.',
        },
        {
          q: 'Which of these materials breaks with the least warning?',
          options: ['Mild steel', 'Aluminium', 'Cast iron', 'Copper'],
          answer: 'Cast iron',
          why: 'Grey cast iron is brittle: it barely stretches before it breaks.',
        },
        {
          q: 'What does the yield strength mark?',
          options: ['The stress at which the part breaks', 'The stress at which permanent deformation starts', 'The maximum allowed working stress', 'The stiffness of the material'],
          answer: 'The stress at which permanent deformation starts',
          why: 'Below yield the material springs back; above it, it stays bent.',
        },
      ],
      situation: {
        scene: 'You’re at a food plant. A bolt on a mixer drive broke. Maintenance replaced it with “whatever was in the drawer” and restarted the line.',
        ask: 'What do you ask?',
        model: 'What grade was the original bolt, for example 8.8 or 10.9, and what grade went in? A lower grade has a lower yield and may stretch or break at the same tightening torque. Was it tightened to the specified torque? And why did the first one break: overload, fatigue from vibration, or corrosion? Replacing it like for like without knowing that may just repeat the failure.',
        rubric: [
          'Asks for the original and replacement bolt grades',
          'Raises tightening torque',
          'Asks why the first bolt failed before closing the issue',
        ],
      },
      sayIt: 'Explain to a maintenance technician in 60 seconds what yield strength and a safety factor are.',
      terms: [
        { term: 'Yield strength', def: 'The stress at which permanent deformation starts.' },
        { term: 'Tensile strength (UTS)', def: 'The highest stress a material reaches before it necks and breaks.' },
        { term: 'Ductile and brittle', def: 'Stretches a lot before breaking, versus breaks with little warning.' },
        { term: 'Safety factor', def: 'Strength divided by the working stress: the margin for unknowns.' },
      ],
    },
    {
      id: 'eng.mechanics.fatigue',
      title: 'Fatigue and stress concentrations',
      pre: [
        {
          q: 'A shaft breaks after two years in service. The calculated stress was always well below yield. What is the most likely mechanism?',
          options: ['A single overload', 'Fatigue: millions of load cycles grew a crack', 'The steel melted', 'Corrosion only on the surface paint'],
          answer: 'Fatigue: millions of load cycles grew a crack',
          why: 'Repeated stress far below yield can still grow a crack over time.',
        },
      ],
      teach: [
        'Most mechanical failures in machines are fatigue: a load that repeats millions of times grows a small crack until the part snaps, even though the stress stays well below yield. A shaft at 1,500 rpm sees over 2 million load cycles a day. A fatigue fracture shows beach marks, rings spreading from where the crack started, and a small, rough final break zone.',
        'The S-N curve plots stress against the number of cycles to failure. Steels have an endurance limit: below roughly half their tensile strength (for polished test samples) they can last indefinitely. Aluminium has no real limit: it eventually fails at any repeated stress, so designs state a life in cycles.',
        'Cracks start where stress concentrates: sharp corners, holes, keyways, threads, weld toes, scratches and corrosion pits. A small round hole in a wide plate locally triples the stress. A generous radius at a shoulder, a smooth surface and a shot-peened finish can multiply fatigue life.',
        'Real fatigue strength is much lower than the polished-sample value: rough surfaces, larger sizes, corrosion and welds all cut it. So a static calculation that says “strong enough” proves nothing for a vibrating part. When a part breaks again after being replaced with a stronger one, suspect fatigue and ask about the cycles, the vibration and the corner radius.',
      ],
      example: {
        kind: 'worked',
        text: 'An agitator shaft broke at the end of its keyway twice in 18 months. After the first failure it was replaced with a stronger steel; it broke again in the same place. The fracture shows beach marks starting at the sharp corner of the keyway. Two things combine: the impeller is out of balance, so the shaft bends back and forth once per revolution, and the sharp keyway corner concentrates that stress. The fix: a rounded keyway end, a balanced impeller and an alignment check. Stronger steel alone did little, because high-strength steels are often more sensitive to notches.',
      },
      said: 'What engineers say: “Look at those beach marks. It started at the keyway corner. Stronger steel won’t fix a sharp corner.”',
      recall: [
        {
          q: 'A shaft turns at 1,000 rpm, 16 hours a day. Each revolution is one load cycle. How many load cycles does it see per day?',
          number: 960000,
          tolerance: 1000,
          unit: 'cycles/day',
          why: '1,000 per minute × 60 × 16 = 960,000 cycles a day.',
        },
        {
          q: 'What does a fatigue fracture surface typically show?',
          options: ['A smooth, shiny cup-and-cone shape', 'Beach marks spreading from a start point, with a small rough final zone', 'Melted metal', 'No features at all'],
          answer: 'Beach marks spreading from a start point, with a small rough final zone',
          why: 'The crack grows step by step, leaving rings, until the rest breaks suddenly.',
        },
        {
          q: 'Where on a shaft is a fatigue crack most likely to start?',
          options: ['In the middle of a smooth, polished section', 'At the sharp corner of a keyway', 'Inside the shaft’s centre', 'On the painted surface far from any change in shape'],
          answer: 'At the sharp corner of a keyway',
          why: 'Sharp changes in shape concentrate stress, and cracks start there.',
        },
        {
          q: 'A part fails by fatigue again after it was replaced with a stronger grade. What is the best next step?',
          options: ['Use an even stronger grade', 'Reduce the stress concentration and the vibration: radius, surface finish, balancing', 'Paint it', 'Replace it more often without changes'],
          answer: 'Reduce the stress concentration and the vibration: radius, surface finish, balancing',
          why: 'Fatigue is driven by repeated stress at a notch; removing either is more effective than a stronger material.',
        },
      ],
      situation: {
        scene: 'You’re at a packaging client. The welds on a conveyor frame crack every few months. Each time, a welder grinds the crack out and welds it again.',
        ask: 'What do you ask?',
        model: 'Where exactly do the cracks start: at the weld toe, and always in the same spot? What vibrates or loads that frame repeatedly: a drive, an unbalanced roller, a stop-start cycle? How many cycles per day does it see? Re-welding resets the crack but not the cause; can we reduce the vibration, move the weld away from the stress peak, or add a gusset with smooth transitions?',
        rubric: [
          'Recognises repeated cracking at welds as likely fatigue',
          'Asks for the source and frequency of the repeated load',
          'Proposes a design or vibration fix instead of only re-welding',
        ],
      },
      sayIt: 'Explain fatigue to a plant manager in 60 seconds, and why a stronger part doesn’t always help.',
      terms: [
        { term: 'Fatigue', def: 'Failure by a crack that grows under repeated loading, below the yield strength.' },
        { term: 'S-N curve', def: 'Stress against number of cycles to failure.' },
        { term: 'Endurance limit', def: 'The stress below which steel can survive indefinite cycles; aluminium has none.' },
        { term: 'Stress concentration', def: 'A local stress peak at a hole, corner, notch or weld toe.' },
      ],
    },
    {
      id: 'eng.mechanics.materials',
      title: 'Common engineering materials',
      pre: [
        {
          q: 'A steel part weighs 3 kg. An aluminium part of exactly the same shape weighs roughly how much?',
          options: ['3 kg', 'About 1 kg', 'About 2 kg', 'About 0.3 kg'],
          answer: 'About 1 kg',
          why: 'Aluminium (2,700 kg/m³) is about a third as dense as steel (7,850 kg/m³).',
        },
      ],
      teach: [
        'Carbon steel is the workhorse: strong, stiff, cheap and weldable, with a density of about 7,850 kg/m³. More carbon means harder and stronger but harder to weld. It rusts, so it is painted, galvanised or oiled. Structural grades such as S235 and S355 go into frames; steels such as C45 or 42CrMo4 into shafts and gears.',
        'Stainless steel contains at least about 10.5% chromium, which forms a thin protective oxide layer. 304 (1.4301) is the general grade; 316 (1.4401) adds molybdenum for better resistance to chlorides, such as salt and many cleaning agents, which is why food and pharma plants often specify it. Stainless costs more, machines harder, and can still corrode in crevices.',
        'Aluminium weighs about a third of steel (2,700 kg/m³) and is about a third as stiff. Alloys such as 6082 or 7075 can match mild steel in strength. It machines fast and doesn’t rust, but it has no fatigue limit, loses strength near welds, and is attacked by strong alkaline cleaners. Cast iron is cheap and damps vibration well, so it is used for machine beds, but it is brittle.',
        'Plastics such as PA (nylon), POM and PE-UHMW are used for wear strips and guides: light and quiet, but far less stiff than metal. They creep (slowly deform) under constant load and change with heat or water. Galvanic corrosion: put stainless steel against aluminium or zinc in a wet environment and the less noble metal corrodes fast.',
      ],
      example: {
        kind: 'worked',
        text: 'A food client is choosing the frame material for a new washdown machine, cleaned daily with chlorinated foam and sometimes with caustic soda. Painted carbon steel: paint flakes can end up in food, not acceptable in the product zone. Aluminium: light, but caustic cleaners attack it. Stainless 304: common, but chlorides in the foam can cause pitting over time. Stainless 316: better against chlorides, but noticeably more expensive than 304 (the gap moves with nickel and molybdenum prices). The engineer picks 316 in the splash zone and 304 for the parts away from the product.',
      },
      said: 'What engineers say: “With chlorinated foam every day, 304 will pit in the splash zone. Spec 316 there, 304 is fine underneath.”',
      recall: [
        {
          q: 'A steel part weighs 7.85 kg. Steel has a density of 7,850 kg/m³, aluminium 2,700 kg/m³. What does the same part in aluminium weigh, in kg?',
          number: 2.7,
          tolerance: 0.05,
          unit: 'kg',
          why: 'The volume is 7.85 / 7,850 = 0.001 m³; × 2,700 = 2.7 kg.',
        },
        {
          q: 'Why do food plants often specify 316 rather than 304 stainless steel?',
          options: ['316 is cheaper', 'The molybdenum in 316 gives better resistance to chlorides in salt and cleaning agents', '316 is magnetic', '316 is easier to weld than any other steel'],
          answer: 'The molybdenum in 316 gives better resistance to chlorides in salt and cleaning agents',
          why: 'Chlorides cause pitting; molybdenum improves resistance to it.',
        },
        {
          q: 'A plastic bracket carrying a constant load slowly sags over several months. What is this called?',
          options: ['Fatigue', 'Creep', 'Corrosion', 'Yield'],
          answer: 'Creep',
          why: 'Creep is slow deformation under a constant load, common in plastics.',
        },
        {
          q: 'Stainless steel bolts hold an aluminium frame outdoors. After a year the aluminium around the bolts is badly corroded. Why?',
          options: ['The bolts were too tight', 'Galvanic corrosion: in a wet environment the less noble aluminium corrodes against the stainless', 'Aluminium always corrodes outdoors at the same rate', 'The stainless bolts rusted'],
          answer: 'Galvanic corrosion: in a wet environment the less noble aluminium corrodes against the stainless',
          why: 'Two different metals plus moisture form a cell; the less noble one corrodes.',
        },
      ],
      situation: {
        scene: 'You’re at a machine builder. To save weight and cost, the team wants to switch the steel frame of a washdown filling machine to aluminium.',
        ask: 'What do you ask?',
        model: 'Which cleaning agents does the customer use? Caustic cleaners attack aluminium, and chlorinated ones are hard on it too. The frame will be about a third as stiff with the same section: does that matter for vibration and alignment of the filler? How will it be joined to stainless parts without galvanic corrosion? And does welding weaken the alloy where the frame is loaded?',
        rubric: [
          'Asks about the cleaning chemicals and corrosion',
          'Raises the drop in stiffness',
          'Raises galvanic corrosion and weld strength',
        ],
      },
      sayIt: 'Explain to a buyer in 60 seconds why “just use aluminium, it’s lighter” is not a simple swap.',
      terms: [
        { term: 'Stainless steel', def: 'Steel with at least about 10.5% chromium; 316 adds molybdenum for chloride resistance.' },
        { term: 'Creep', def: 'Slow deformation under a constant load, especially in plastics and at high temperature.' },
        { term: 'Galvanic corrosion', def: 'Fast corrosion of the less noble metal when two different metals touch in a wet environment.' },
      ],
    },
    {
      id: 'eng.mechanics.heattreat',
      title: 'Hardness and heat treatment',
      pre: [
        {
          q: 'A medium-carbon steel shaft is heated until red-hot and then quenched in water. What happens to it?',
          options: ['It becomes soft and easy to machine', 'It becomes very hard and brittle', 'Nothing changes', 'It becomes stainless'],
          answer: 'It becomes very hard and brittle',
          why: 'Fast cooling from the hardening temperature traps a hard, brittle structure; tempering is needed afterwards.',
        },
      ],
      teach: [
        'Hardness is resistance to indentation. Three common scales: Brinell (HB) for softer steels and castings, Vickers (HV) for any material and thin layers, Rockwell C (HRC) for hardened steel. Mild steel is about 120 HB; a hardened tool steel 60 HRC or more. Hardness tracks strength and wear resistance, and the test is quick and cheap, so it is a common incoming check.',
        'Steel with enough carbon can be hardened: heat it to roughly 800 to 900 °C, then quench it fast in water, oil or a polymer solution. It becomes very hard and brittle. Then it is tempered: reheated to typically 150 to 650 °C, which trades some hardness back for toughness. Quench and temper is how shafts, gears and tools get their properties.',
        'Annealing does the opposite: slow cooling makes steel soft and easy to machine or form. Stress relieving, a lower-temperature treatment, removes internal stresses after welding or rough machining, so parts don’t warp later.',
        'Case hardening gives a hard skin on a tough core: carburising (adding carbon to the surface, then quenching), nitriding (low temperature, little distortion) and induction hardening (heating only the surface). Gears and bearing seats use it. Heat treatment can distort parts, so grinding often follows. A drawing note like “58–62 HRC, case depth 0.8–1.2 mm” is a spec to check, not decoration.',
      ],
      example: {
        kind: 'worked',
        text: 'Gear teeth from a new supplier wear out within weeks. The drawing says “carburised and hardened, 58–62 HRC, case depth 0.8–1.2 mm”. The incoming hardness check measures 48 HRC at the surface. Possible causes: the carburising was skipped or too short, the surface lost carbon in the furnace, or the quench was too slow. Actions: quarantine the stock, cut one gear and measure the hardness profile in HV from the surface inward to see the real case depth, and ask the supplier for the furnace records and heat-treatment certificate for that batch.',
      },
      said: 'What engineers say: “The drawing says 58 to 62 HRC, we measure 48. That’s not a gear, that’s a soft gear. Cut one and check the case depth.”',
      recall: [
        {
          q: 'Which hardness scale is typically used for hardened steel?',
          options: ['Brinell (HB)', 'Rockwell C (HRC)', 'Shore A', 'Mohs'],
          answer: 'Rockwell C (HRC)',
          why: 'HRC is the standard scale for hardened steels; HB for softer steels and castings.',
        },
        {
          q: 'Why is steel tempered after quenching?',
          options: ['To make it harder still', 'To regain toughness, because quenched steel is too brittle', 'To clean the surface', 'To make it stainless'],
          answer: 'To regain toughness, because quenched steel is too brittle',
          why: 'Tempering trades some hardness for toughness.',
        },
        {
          q: 'A welded steel frame warps after it is machined. Which step before machining would most likely have prevented that?',
          options: ['Painting', 'Stress relieving after welding', 'Quenching in water', 'A hardness test'],
          answer: 'Stress relieving after welding',
          why: 'Welding leaves internal stresses; machining releases them and the part moves. Stress relieving removes them first.',
        },
        {
          q: 'Which treatment gives a hard surface on a tough core?',
          options: ['Annealing', 'Case hardening, such as carburising or induction hardening', 'Stress relieving', 'Galvanising'],
          answer: 'Case hardening, such as carburising or induction hardening',
          why: 'Case hardening hardens only the surface layer, leaving the core tough.',
        },
      ],
      situation: {
        scene: 'You’re at a machine builder. A supplier proposes dropping the nitriding step on a set of guide shafts “to save cost and two weeks of lead time”.',
        ask: 'What do you ask?',
        model: 'Why was nitriding specified: wear resistance, fatigue strength, or both? What surface hardness and depth does the drawing ask for, and what would the shafts have without it? Has anyone tested the life of untreated shafts in this application? If they wear faster, what does a field replacement cost compared with the saving? Engineering should approve any change to a heat-treatment spec in writing.',
        rubric: [
          'Asks what function the nitriding serves',
          'Asks for the spec and the effect on hardness, wear and life',
          'Compares the saving with the cost of earlier failures and asks for formal approval',
        ],
      },
      sayIt: 'Explain to a buyer in 60 seconds what hardening and tempering do, and why a heat-treatment note on a drawing matters.',
      terms: [
        { term: 'Hardness (HB, HV, HRC)', def: 'Resistance to indentation, measured on the Brinell, Vickers or Rockwell C scale.' },
        { term: 'Quench and temper', def: 'Heat, quench fast to harden, then reheat moderately to regain toughness.' },
        { term: 'Annealing and stress relieving', def: 'Heat treatments that soften steel or remove internal stresses.' },
        { term: 'Case hardening', def: 'Hardening only the surface layer: carburising, nitriding or induction hardening.' },
      ],
    },
  ],
};
