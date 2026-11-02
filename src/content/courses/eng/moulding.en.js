// eng.moulding (EN): Injection moulding: the machine, cycle time, materials, defects, process window, tooling.
export default {
  lessons: [
    {
      id: 'eng.moulding.machine',
      title: 'The moulding machine',
      pre: [
        {
          q: 'A moulding machine is called “a 250-tonne machine”. What do the 250 tonnes refer to?',
          options: ['The weight of the machine', 'The maximum shot weight in kilos', 'The force that holds the mould shut', 'The injection pressure'],
          answer: 'The force that holds the mould shut',
          why: 'Machines are sized by clamp force: the force that keeps the mould halves closed against the pressure of the plastic.',
        },
      ],
      teach: [
        'An injection moulding machine has two halves. The injection unit melts and pushes the plastic: plastic granules drop from the hopper, a funnel on top, into a heated barrel (a long steel tube), where a rotating screw melts, mixes and collects them in front of its tip. The clamp unit holds the mould: one half fixed, one half moving. The machine is mostly a big, precise press with a heated syringe on one side.',
        'The cycle has six steps. The mould closes. The screw moves forward like a plunger and pushes the melt through the gate, a small opening, into the cavity, the part-shaped hollow in the mould (injection). It keeps pushing to pack in extra plastic as the part shrinks (holding pressure). The part cools in the mould while the screw turns and doses the next shot. The mould opens. Ejector pins push the part out. Then it starts again.',
        'Clamp force is how machines are sized, in tonnes. The molten plastic pushes the mould halves apart with hundreds of bar. Rule of thumb: you need about 0.3 to 0.6 tonne per cm² of projected area, the part’s shadow seen from the press direction. Too little force and the mould opens a fraction at the parting line, where the halves meet, and plastic leaks out as flash: a thin fin on the part.',
        'The mould is the expensive, part-specific bit; the machine is generic. One machine runs many moulds, so a moulding shop thinks in two lists: which machines have which tonnage, and which moulds fit on which machines. A mould that only fits one press makes that press a planning bottleneck.',
      ],
      example: {
        kind: 'worked',
        text: 'A housing has a projected area of 15 × 20 cm = 300 cm². It is ABS with normal walls, so the engineer uses 0.4 tonne per cm²: 300 × 0.4 = 120 tonnes. A 2-cavity mould doubles the area to 600 cm², so 240 tonnes. With a margin of about 10 to 20%, the mould goes on a 280- or 300-tonne machine, not the 200-tonne press that happens to be free.',
      },
      said: 'What engineers say: “That tool is flashing on the 200-tonner. Move it to the 300, it needs the tonnage.”',
      recall: [
        {
          q: 'A part has a projected area of 250 cm². The engineer uses 0.4 tonne per cm². What clamp force does the mould need, in tonnes?',
          number: 100,
          tolerance: 2,
          unit: 't',
          why: '250 × 0.4 = 100 tonnes, before any safety margin.',
        },
        {
          q: 'What happens during the holding pressure phase?',
          options: ['The screw keeps pushing to pack in plastic as the part shrinks', 'The mould opens a little to let air out', 'The screw turns backwards to dose the next shot', 'The ejector pins push the part out'],
          answer: 'The screw keeps pushing to pack in plastic as the part shrinks',
          why: 'Plastic shrinks as it cools; holding pressure compensates until the gate freezes.',
        },
        {
          q: 'When does the screw dose the next shot?',
          options: ['After the mould opens', 'Before the mould closes', 'During injection', 'While the part cools in the mould'],
          answer: 'While the part cools in the mould',
          why: 'Dosing runs in parallel with cooling, so it usually does not add to the cycle time.',
        },
        {
          q: 'What does too little clamp force typically cause?',
          options: ['Burn marks', 'Flash at the parting line', 'Sink marks', 'Wet granules'],
          answer: 'Flash at the parting line',
          why: 'The mould is pushed open slightly and plastic squeezes out between the halves.',
        },
      ],
      situation: {
        scene: 'You’re at a plastics moulder that supplies a car maker. The planner says: “Machine 7 is free, we’ll put the new mould on there.” Machine 7 is 150 tonnes; the new part is large and flat.',
        ask: 'What do you ask before the mould goes on?',
        model: 'What is the projected area of the part and how much clamp force does the mould need? If a large flat part needs 200 tonnes, it will flash on machine 7, and we lose more time sorting parts than we gain by using a free press. Also: does the mould physically fit between the tie bars (the four columns of the clamp), and is the mould height within the machine’s range?',
        rubric: [
          'Asks about projected area and required clamp force',
          'Links too little tonnage to flash and scrap',
          'Checks the physical fit of the mould on the machine',
        ],
      },
      sayIt: 'Explain to a new account manager in 60 seconds what an injection moulding machine does and why tonnage matters.',
      terms: [
        { term: 'Clamp force', def: 'The force, in tonnes, that keeps the mould shut during injection.' },
        { term: 'Projected area', def: 'The area of the part seen from the press direction, its shadow.' },
        { term: 'Holding pressure', def: 'Pressure after filling that packs in plastic as the part shrinks.' },
      ],
    },
    {
      id: 'eng.moulding.cycle',
      title: 'Cycle time and output',
      pre: [
        {
          q: 'A part has a 30-second moulding cycle. Roughly how much of that is the plastic flowing into the mould?',
          options: ['About 20 seconds', 'One or two seconds', 'About 10 seconds', 'About half'],
          answer: 'One or two seconds',
          why: 'Filling is fast; most of the cycle is waiting for the part to cool enough to eject.',
        },
      ],
      teach: [
        'A typical cycle of 30 seconds might be: mould close 2 s, injection 1.5 s, holding 6 s, cooling 15 s, mould open 2 s, eject and remove 3.5 s. Cooling is often 50 to 80% of the cycle. The plastic has to become stiff enough that the part keeps its shape when it is pushed out.',
        'Cooling time grows with the square of the wall thickness. A wall that is twice as thick needs roughly four times the cooling. That is why designers fight for thin, even walls, and why one thick boss (a solid stud, for example for a screw) can set the cycle of the whole part. Mould temperature and well-placed cooling channels matter too.',
        'Output per hour = 3,600 / cycle time × number of cavities. A 4-cavity mould at 24 seconds gives 3,600 / 24 × 4 = 600 parts per hour. More cavities means more parts per cycle, but a bigger, more expensive mould and a bigger machine. If one cavity is damaged, shops often block it and run with three.',
        'Cycle time is a commercial number. The quoted price of a part was calculated with a cycle time. If the real cycle runs 10% slower, the margin on that part can disappear. When someone says a mould “runs at 28 seconds”, ask whether that is the quoted cycle, the set cycle, or the average actually achieved over a week.',
      ],
      example: {
        kind: 'worked',
        text: 'A 2-cavity mould for a cap runs at 20 seconds: 3,600 / 20 × 2 = 360 caps per hour. Cooling is 12 of the 20 seconds. The thickest wall is 3 mm. The designer can bring it to 2.4 mm. Cooling scales with thickness squared: (2.4 / 3)² = 0.64, so cooling drops from 12 to about 7.7 seconds and the cycle to about 15.7 seconds. Output rises to 3,600 / 15.7 × 2 ≈ 459 per hour, about 27% more, from the same machine.',
      },
      said: 'What engineers say: “We’re cooling-limited. Take a millimetre out of that wall and we gain five seconds.”',
      recall: [
        {
          q: 'An 8-cavity mould runs at 30 seconds. How many parts per hour?',
          number: 960,
          tolerance: 5,
          unit: 'parts/h',
          why: '3,600 / 30 = 120 cycles per hour; 120 × 8 = 960 parts.',
        },
        {
          q: 'A wall goes from 2 mm to 4 mm. By what factor does the cooling time roughly grow?',
          number: 4,
          tolerance: 0.3,
          unit: '×',
          why: 'Cooling time scales with thickness squared: (4 / 2)² = 4.',
        },
        {
          q: 'Which phase is usually the largest part of the cycle?',
          options: ['Injection', 'Mould opening', 'Cooling', 'Ejection'],
          answer: 'Cooling',
          why: 'Cooling often takes 50 to 80% of the cycle.',
        },
        {
          q: 'Why does a slower real cycle hurt the business?',
          options: ['The part price was calculated on the quoted cycle, so the margin shrinks', 'The plastic gets more expensive', 'The machine uses less power', 'The mould wears faster'],
          answer: 'The part price was calculated on the quoted cycle, so the margin shrinks',
          why: 'Machine hours per part go up while the price stays fixed.',
        },
      ],
      situation: {
        scene: 'You’re at a moulder looking at a capacity problem. The ERP says mould 4411 runs at 22 seconds. The operators say it has been running at 26 seconds for months “because of warping”.',
        ask: 'What do you ask, and why does it matter?',
        model: 'What cycle did we quote this part at, and what is the average real cycle over the last weeks? Four seconds on 22 is 18% more machine time per part, or about 15% less output than planned, so both the capacity plan and the margin are off. And who decided the extra cooling time, is it fixing the warp or hiding a cooling problem in the mould?',
        rubric: [
          'Separates quoted, set and actual cycle times',
          'Quantifies the impact: about 15% less output, 18% more machine hours, lower margin',
          'Asks for the root cause instead of accepting extra cooling as permanent',
        ],
      },
      sayIt: 'Explain to a sales colleague in 60 seconds why cooling time and wall thickness decide the price of a plastic part.',
      terms: [
        { term: 'Cycle time', def: 'Time for one full moulding cycle, from mould close to mould close.' },
        { term: 'Cavity', def: 'One part-shaped space in the mould; a 4-cavity mould makes 4 parts per shot.' },
        { term: 'Cooling time', def: 'Time the part stays in the closed mould to solidify; scales with wall thickness squared.' },
      ],
    },
    {
      id: 'eng.moulding.materials',
      title: 'Plastics, drying and regrind',
      pre: [
        {
          q: 'Nylon (PA) granules come straight from an opened bag. What is the main risk if you mould them without drying?',
          options: ['The colour is off', 'The mould gets too hot', 'Nothing, it comes dry from the supplier', 'Brittle parts and silver streaks from moisture'],
          answer: 'Brittle parts and silver streaks from moisture',
          why: 'PA absorbs moisture from the air; in the hot barrel the water attacks the polymer and makes steam streaks.',
        },
      ],
      teach: [
        'Four plastics cover much of what you’ll see. PP: cheap, tough, chemical-resistant, used for caps, crates and car interiors. ABS: stiff, nice surface, used for housings. PA (nylon): strong and heat-resistant, often glass-filled, used for technical parts under the bonnet. PC: transparent and impact-resistant, used for lenses and covers. Each has its own melt and mould temperatures.',
        'Some plastics absorb water from the air: PA, PC, PET and PBT. They must be dried before moulding, typically for 2 to 4 hours at 80 to 120 °C (PET even hotter) in a dryer that blows very dry air through the granules; shops check that air’s dew point. Wet material gives silver streaks (splay) and, worse, weak parts that look fine but break later. PP and PE hardly absorb water and usually need no drying.',
        'Regrind is ground-up runners (the plastic channels that feed the cavities) and rejects that go back into the hopper. It saves material, but each pass through the barrel degrades the plastic a little. Customers often allow a maximum, for example 10 to 25%, and some safety or medical parts allow none. A regrind mill next to the machine is normal; an unclear ratio is a quality risk.',
        'Colour usually comes from masterbatch: coloured granules mixed in at a few percent. A colour change means purging: pushing new material through the barrel until the old colour is gone. Dark to light is the slowest; black to white can take an hour and a lot of scrap. Good planners sequence light to dark.',
      ],
      example: {
        kind: 'worked',
        text: 'A shop moulds a PA6 bracket with 30% glass fibre. The dryer holds 50 kg and the machine uses 12 kg per hour. Drying time is 4 hours, so the dryer must hold at least 4 × 12 = 48 kg to deliver dry material continuously: just enough. When the night shift lets it run low and then tops it up with 20 kg of fresh, wet material at once, that new material has only been in the dryer for about 1.5 hours when it reaches the machine. The next morning, quality finds brittle brackets from the night.',
      },
      said: 'What engineers say: “That’s splay. Check the dew point on the dryer before you touch the process.”',
      recall: [
        {
          q: 'A machine uses 20 kg of PC per hour. Drying time is 3 hours. What is the minimum dryer content, in kg, to deliver properly dried material continuously?',
          number: 60,
          tolerance: 1,
          unit: 'kg',
          why: 'Every granule must stay 3 hours in the dryer: 3 × 20 = 60 kg.',
        },
        {
          q: 'Which plastic usually needs no drying?',
          options: ['PA', 'PP', 'PC', 'PET'],
          answer: 'PP',
          why: 'PP hardly absorbs moisture; PA, PC and PET do.',
        },
        {
          q: 'Why do customers limit the regrind percentage?',
          options: ['Regrind is more expensive', 'Regrind changes the colour', 'Each pass through the barrel degrades the plastic', 'Regrind blocks the hopper'],
          answer: 'Each pass through the barrel degrades the plastic',
          why: 'Heat and shear shorten the polymer chains, which lowers strength.',
        },
        {
          q: 'Which colour sequence keeps purging time and scrap lowest?',
          options: ['Light to dark', 'Dark to light', 'Alternate light and dark', 'Order does not matter'],
          answer: 'Light to dark',
          why: 'A little light residue disappears in a dark colour; the reverse needs long purging.',
        },
      ],
      situation: {
        scene: 'You’re at a moulder with a scrap problem on a nylon part. Scrap is high on Monday mornings and after weekends. The team thinks it is the mould warming up.',
        ask: 'What do you ask about the material?',
        model: 'What happens to the material over the weekend: does it stay in the dryer, in the hopper, or in an open bag? Nylon picks up moisture fast, so material standing on the machine for two days may be wet on Monday. Can we check the dryer settings and dew point, and compare scrap on the first hour with the material log?',
        rubric: [
          'Suspects moisture in hygroscopic material, not only the mould',
          'Asks how material is stored and dried over the weekend',
          'Proposes checking dryer data against the scrap pattern',
        ],
      },
      sayIt: 'Explain to a planner in 60 seconds why drying, regrind and colour order affect quality and lost time.',
      terms: [
        { term: 'Hygroscopic', def: 'Absorbs moisture from the air; must be dried before moulding (PA, PC, PET).' },
        { term: 'Regrind', def: 'Ground runners and rejects mixed back into fresh material.' },
        { term: 'Masterbatch', def: 'Concentrated colour granules mixed in at a few percent.' },
        { term: 'Splay', def: 'Silver streaks on the surface, often from moisture.' },
      ],
    },
    {
      id: 'eng.moulding.defects',
      title: 'Defects and their causes',
      pre: [
        {
          q: 'A part shows a small dent on the outside, right above a thick rib on the inside. What is it called?',
          options: ['A sink mark', 'Flash', 'A short shot', 'A weld line'],
          answer: 'A sink mark',
          why: 'Thick sections keep shrinking after the surface has set, pulling the surface inwards.',
        },
      ],
      teach: [
        'Short shot: the part is not completely filled. Causes: too little material dosed, too low injection pressure or speed, plastic too cold, or air that cannot escape through the vents, tiny slots in the mould that let air out. Flash: a thin film of plastic at the parting line or around pins. Causes: too high pressure, too little clamp force, or a worn mould where the halves no longer seal.',
        'Sink marks: dents above thick sections. The inside keeps shrinking after the skin has set. Causes: too little holding pressure or time, the gate freezing (solidifying) too early, or a design with thick ribs and bosses. Voids are the same problem inside the part: bubbles where the core shrank away.',
        'Warpage: the part bends after ejection because it shrinks unevenly. Causes: uneven wall thickness, one mould half hotter than the other, glass fibres lining up in one direction, or ejecting too hot. Warpage often shows up hours later, so it can pass inspection at the machine and fail at the customer.',
        'Burn marks: black or brown spots, usually at the end of the flow path. Air is trapped and compressed so fast that it heats up and scorches the plastic. Causes: blocked or missing vents, injection too fast. Each defect points at a few causes. Good engineers ask which one changed before touching settings.',
      ],
      example: {
        kind: 'worked',
        text: 'A PP crate starts flashing at one corner after 80,000 shots. The setter raises clamp force from 180 to 220 tonnes and the flash stops. Two weeks later it is back, worse. The real cause: the parting line at that corner is worn, so the halves no longer seal there. More clamp force only pushed the problem away and adds wear. The fix: take the mould out, repair the parting line in the toolroom (the in-house mould repair shop), and run it again at 180 tonnes.',
      },
      said: 'What engineers say: “It’s short-shotting at the end of fill. Before you crank up pressure, check the vents.”',
      recall: [
        {
          q: 'A part with a projected area of 400 cm² needs 0.5 tonne per cm². It runs on a 160-tonne machine. How many tonnes is it short?',
          number: 40,
          tolerance: 1,
          unit: 't',
          why: '400 × 0.5 = 200 tonnes needed; 200 − 160 = 40 tonnes short, so expect flash.',
        },
        {
          q: 'Burn marks at the end of the flow path. What is the most likely cause?',
          options: ['Wet material', 'Too much holding time', 'Too high clamp force', 'Air that cannot escape through the vents'],
          answer: 'Air that cannot escape through the vents',
          why: 'Trapped air is compressed and heats up enough to scorch the plastic.',
        },
        {
          q: 'Why can warpage pass inspection at the machine and still fail at the customer?',
          options: ['Inspectors are not trained', 'Parts keep shrinking and bending for hours after moulding', 'The customer uses a different gauge', 'Warpage only appears in cold weather'],
          answer: 'Parts keep shrinking and bending for hours after moulding',
          why: 'Shrinkage continues after ejection, so a warm part can still move.',
        },
        {
          q: 'Which change is most likely to reduce sink marks?',
          options: ['Lower clamp force', 'Faster mould opening', 'More holding pressure or holding time', 'More regrind'],
          answer: 'More holding pressure or holding time',
          why: 'Holding pressure packs in plastic to compensate for shrinkage in thick areas.',
        },
      ],
      situation: {
        scene: 'You’re in a problem-solving meeting at a moulder. Flash has appeared on a mould that ran fine for a year. The shift lead says: “We raised the clamp force, it’s solved.”',
        ask: 'What do you ask?',
        model: 'Good that we stopped the scrap, but what changed on a mould that ran fine for a year? If nothing changed in the material or settings, the parting line may be worn, and more clamp force will make that worse over time. When is the mould due for maintenance, and can the toolroom have a look at that corner?',
        rubric: [
          'Separates the quick fix from the root cause',
          'Asks what changed after a long stable period',
          'Mentions mould wear and maintenance as a likely cause',
        ],
      },
      sayIt: 'Explain to a quality engineer from another industry in 60 seconds the four most common moulding defects and one cause of each.',
      terms: [
        { term: 'Short shot', def: 'A part that is not completely filled.' },
        { term: 'Flash', def: 'Thin excess plastic at the parting line or around pins.' },
        { term: 'Sink mark', def: 'A dent in the surface above a thick section.' },
        { term: 'Warpage', def: 'Bending of the part from uneven shrinkage.' },
      ],
    },
    {
      id: 'eng.moulding.process',
      title: 'The process window',
      pre: [
        {
          q: 'A good process technician fills most of the cavity on injection speed. When does a scientific moulder switch to holding pressure?',
          options: ['At 50% full', 'Only when the part is 100% full', 'At about 95 to 98% full', 'After a fixed 5 seconds'],
          answer: 'At about 95 to 98% full',
          why: 'Filling on speed to almost full and then packing on pressure makes the process stable from shot to shot.',
        },
      ],
      teach: [
        'The main settings: melt temperature, mould temperature, injection speed, switchover point (from filling to holding), holding pressure and time, cooling time and back pressure (the resistance the screw works against while dosing, which mixes the melt). The process window is the range of these settings within which every part is good. A wide window is robust; a narrow one means small variations in material or temperature give scrap.',
        'Scientific moulding (also called decoupled moulding) splits the cycle: fill about 95 to 98% of the part on speed, then switch to pressure to pack the last bit. The engineer finds the settings with short studies: a viscosity curve (how easily the melt flows at each speed) to choose injection speed, a gate freeze study (when the gate solidifies) to set holding time, and a test of the window. The result is a documented, reasoned set of settings.',
        '“Just tweak it” is risky. Settings interact: more temperature changes viscosity, which changes fill, which changes pressure. Every shift that adjusts a few values pushes the process somewhere new, and nobody knows anymore which setting fixes what. After a month, a mould has three versions of “the right settings”.',
        'Good shops lock the approved settings, log every change with a reason, and ask “what changed?” before adjusting. If an operator has to tweak to keep making good parts, the real cause is upstream: wet material, a blocked cooling channel, a worn check ring, the valve ring on the screw tip that stops melt flowing backwards. Tweaking hides it.',
      ],
      example: {
        kind: 'worked',
        text: 'A mould for a PC lens makes 3% rejects. The engineer finds 14 changes in the log over 6 weeks, from four people. She resets to the approved sheet, runs a 30-shot study and finds that the switchover position drifts because the check ring on the screw leaks: the cushion, the melt left in front of the screw after injection, varies from 2 to 8 mm. After replacing the check ring, the original settings run at 0.4% rejects. The fix was a €300 part, not the 14 adjustments.',
      },
      said: 'What engineers say: “Don’t chase it with settings. If the cushion is jumping around, the check ring is gone.”',
      recall: [
        {
          q: 'A shot is 100 cm³. The engineer switches to holding pressure at 96% full. How many cm³ are filled on speed?',
          number: 96,
          tolerance: 0.5,
          unit: 'cm³',
          why: '96% of 100 cm³ is 96 cm³; holding pressure packs the last 4 cm³ and the shrinkage.',
        },
        {
          q: 'What does a wide process window mean?',
          options: ['The machine has a big screen', 'The mould has many cavities', 'Parts are good only at one exact setting', 'Parts stay good despite small variations in settings or material'],
          answer: 'Parts stay good despite small variations in settings or material',
          why: 'A wide window means the process is robust.',
        },
        {
          q: 'Why is “just tweak it” risky?',
          options: ['Settings interact, and repeated tweaks hide the real cause', 'Operators are not allowed to touch the machine', 'It voids the machine warranty', 'Tweaks are always too small to matter'],
          answer: 'Settings interact, and repeated tweaks hide the real cause',
          why: 'Each change shifts other variables, and the root cause stays in place.',
        },
        {
          q: 'An operator must keep adjusting to make good parts. Where does a good engineer look first?',
          options: ['At the operator’s training', 'At what changed upstream: material, cooling, screw wear', 'At a bigger machine', 'At the drawing tolerance'],
          answer: 'At what changed upstream: material, cooling, screw wear',
          why: 'Constant adjustment is a symptom of an unstable input.',
        },
      ],
      situation: {
        scene: 'You’re facilitating a scrap reduction project at a moulder. Each shift has its own “best” settings for the same mould. The night shift says theirs are better.',
        ask: 'What do you propose?',
        model: 'Let’s agree on one approved setting sheet per mould, made by the process engineer with a short study, and lock it. Every change after that gets logged with a reason. Then, instead of discussing whose settings are best, we look at the log: if a shift has to adjust, that tells us something upstream is unstable, and that is what we fix.',
        rubric: [
          'Proposes one documented, approved setting per mould',
          'Introduces a change log with reasons',
          'Turns the shift conflict into a search for the unstable input',
        ],
      },
      sayIt: 'Explain to a plant manager in 60 seconds why operators should not freely tweak moulding settings.',
      terms: [
        { term: 'Process window', def: 'The range of settings within which all parts are good.' },
        { term: 'Switchover point', def: 'The moment the machine switches from filling on speed to holding on pressure.' },
        { term: 'Scientific moulding', def: 'Setting up the process with studies and data instead of trial and error.' },
        { term: 'Cushion', def: 'The small amount of plastic left in front of the screw at the end of injection.' },
      ],
    },
    {
      id: 'eng.moulding.tooling',
      title: 'Moulds, changes and maintenance',
      pre: [
        {
          q: 'A customer orders a new mould for a mid-size technical part. What is a realistic lead time from order to first parts?',
          options: ['One week', '10 to 16 weeks', 'Two years', 'Two days'],
          answer: '10 to 16 weeks',
          why: 'Design, steel, machining, assembly and trials usually take about three months or more.',
        },
      ],
      teach: [
        'A mould is a precision tool of hardened steel with cavities, cooling channels, ejector pins and vents. A simple mould can cost €20,000; a multi-cavity or large automotive mould easily €100,000 to €300,000 or more. Lead time is typically 10 to 16 weeks, plus trial runs (T1, T2) before the customer approves the parts.',
        'The runner is the channel that carries plastic from the machine nozzle to the cavities. A cold runner solidifies and is ejected with the parts as waste or regrind. A hot runner keeps the plastic molten in a heated manifold (a block of channels inside the mould): no runner waste and often a shorter cycle, but a more expensive mould and extra failure points such as heater zones and leaks.',
        'Moulds need preventive maintenance, often every 50,000 to 100,000 shots or on a fixed calendar: cleaning vents, checking ejector pins, descaling cooling channels and checking the parting line. Skipping maintenance shows up later as flash, short shots and longer cycles. The shot counter on the mould is the key number.',
        'A mould change typically takes 1 to 2 hours: disconnecting water and hot runner, cranes, unclamping, clamping, heating up and first-part approval. With SMED you bring that to 15 to 30 minutes: pre-heating the next mould, standard clamp plates, quick couplings for water and power, and doing everything possible while the machine still runs.',
      ],
      example: {
        kind: 'worked',
        text: 'A shop does 40 mould changes a week at 90 minutes each: 60 hours of press time. A SMED project brings them to 30 minutes: 40 × 1 = 40 hours saved per week. At a machine rate of €60 per hour, that is about €2,400 a week, or €110,000 a year at 46 weeks. The investment: quick couplings and clamp plates for €40,000 and a pre-heating station for €15,000. Payback: about half a year, and smaller batches become possible.',
      },
      said: 'What engineers say: “The mould is at 120,000 shots and hasn’t seen the toolroom. No wonder it’s flashing.”',
      recall: [
        {
          q: 'A press does 15 mould changes a week. SMED brings each change from 2 hours to 30 minutes. How many hours per week are freed?',
          number: 22.5,
          tolerance: 0.5,
          unit: 'h',
          why: '15 × (2 − 0.5) = 15 × 1.5 = 22.5 hours.',
        },
        {
          q: 'What is the main advantage of a hot runner?',
          options: ['A cheaper mould', 'Fewer heater zones', 'No runner waste and often a shorter cycle', 'No need for cooling channels'],
          answer: 'No runner waste and often a shorter cycle',
          why: 'The plastic in the manifold stays molten, so no runner has to cool or be ejected.',
        },
        {
          q: 'Which number tells you when a mould is due for maintenance?',
          options: ['The machine tonnage', 'The cycle time', 'The cavity count', 'The shot counter'],
          answer: 'The shot counter',
          why: 'Maintenance is planned on the number of shots since the last service.',
        },
        {
          q: 'Which SMED step saves the most heat-up time during a mould change?',
          options: ['Pre-heating the next mould before the change', 'Running the old mould faster', 'Using a bigger crane', 'Changing moulds only at night'],
          answer: 'Pre-heating the next mould before the change',
          why: 'Heating up is moved outside the stop, while the machine still runs.',
        },
      ],
      situation: {
        scene: 'You’re at a moulder where a customer asks for smaller batches. The production manager says: “Impossible, every mould change costs us two hours.”',
        ask: 'How do you respond?',
        model: 'Can we film one mould change and split the steps into what must happen with the machine stopped and what could happen before or after? In most shops, pre-heating, getting the next mould, tools and water hoses ready can move outside the stop. If we bring two hours to 30 minutes, smaller batches become affordable, and we can calculate exactly what it frees up.',
        rubric: [
          'Proposes analysing a real change instead of debating',
          'Separates internal and external steps (SMED)',
          'Links shorter changes to smaller batches and quantified gain',
        ],
      },
      sayIt: 'Explain to a buyer in 60 seconds why a new mould costs so much, takes three months, and still needs maintenance.',
      terms: [
        { term: 'Hot runner', def: 'Heated manifold that keeps the plastic molten up to the cavities.' },
        { term: 'Shot counter', def: 'Counter on the mould showing how many cycles it has made.' },
        { term: 'SMED', def: 'Method to shorten changeovers by moving work outside the stop.' },
        { term: 'T1', def: 'The first trial run of a new mould.' },
      ],
    },
  ],
};
