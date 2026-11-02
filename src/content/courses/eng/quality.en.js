// eng.quality (EN): Quality basics: tolerances, variation, capability, SPC, FMEA, control plan and measurement.
export default {
  lessons: [
    {
      id: 'eng.quality.tolerance',
      title: 'Nominal, tolerance and spec limits',
      pre: [
        {
          q: 'A shaft is drawn as Ø20 ±0.05 mm. It measures 20.06 mm. What is it?',
          options: ['Good: it’s only 0.06 off nominal', 'Out of spec: scrap, rework or ask for a deviation', 'Good, because the total tolerance is 0.1 mm', 'Good, as long as the next part is in'],
          answer: 'Out of spec: scrap, rework or ask for a deviation',
          why: 'The upper spec limit is 20.05. Anything above it is nonconforming, however small the miss.',
        },
      ],
      teach: [
        'Nominal is the target value on the drawing. Tolerance is how far a part may deviate and still work. Ø20 ±0.05 means a lower spec limit (LSL) of 19.95 and an upper spec limit (USL) of 20.05: a tolerance band of 0.10 mm. Tolerances can be unequal too: Ø12 +0.018/0 runs from 12.000 to 12.018.',
        'Every dimension that matters for fit or function has a tolerance. Dimensions without one fall under the general tolerance in the title block, often ISO 2768-m: ±0.2 mm for sizes from 6 to 30 mm. So “there was no tolerance on it” is almost never true.',
        'Tighter costs money. Halving a tolerance can mean a better machine, slower cutting, an extra grinding step and more measuring. A bearing seat may need ±0.01 mm; a hole in a cover plate is fine at ±0.2. Good engineers ask what the function needs, not what looks precise.',
        'Out of spec means nonconforming: scrap it, rework it, or use it as is with a written deviation (concession) from the customer. Cost grows roughly tenfold at every step it travels: €1 at the machine, €10 at assembly, €100 at the customer, and a recall costs far more.',
      ],
      example: {
        kind: 'worked',
        text: 'A bushing bore is Ø12 +0.018/0, so it must be between 12.000 and 12.018 mm. In a batch of 500, 15 bores measure 12.021: 3% out. Caught at the machine: 15 × €4.50 = €67.50 of scrap. Caught at the customer: they block the whole lot, a sorting company checks all 500 at €0.80 each (€400), the complaint fee is €250, and you write an 8D. Same 15 parts, ten times the cost, plus a dent in your supplier rating.',
      },
      said: 'What engineers say: “It’s 20.06 on a twenty plus-minus fifty microns, so it’s out. Either we scrap it or quality asks the customer for a deviation.”',
      recall: [
        {
          q: 'A dimension is Ø40 ±0.1 mm. How wide is the tolerance band, in mm?',
          number: 0.2,
          tolerance: 0.001,
          unit: 'mm',
          why: 'From 39.9 to 40.1 is a band of 0.2 mm.',
        },
        {
          q: 'A dimension is 25 +0.05/−0.02 mm. What is the lower spec limit, in mm?',
          number: 24.98,
          tolerance: 0.001,
          unit: 'mm',
          why: '25 − 0.02 = 24.98; the upper limit is 25.05.',
        },
        {
          q: 'A dimension on the drawing has no tolerance written next to it. What applies?',
          options: ['Anything goes', 'The general tolerance in the title block', 'The tightest tolerance on the drawing', 'Whatever the machine can do'],
          answer: 'The general tolerance in the title block',
          why: 'Untoleranced dimensions fall under the general tolerance, such as ISO 2768-m.',
        },
        {
          q: 'Why don’t engineers simply make every tolerance very tight?',
          options: ['The CAD system doesn’t allow it', 'Customers forbid it', 'It doesn’t matter for quality', 'Tighter tolerances cost more machining, time and measuring'],
          answer: 'Tighter tolerances cost more machining, time and measuring',
          why: 'Tolerance should follow function; every extra decimal costs money.',
        },
      ],
      situation: {
        scene: 'You’re at a machining supplier after a customer complaint: 40 housings with a bore 0.01 mm over the upper limit. The quality manager wants to tighten the internal tolerance on every bore by half “to be safe”.',
        ask: 'What do you ask before everyone accepts that plan?',
        model: 'How many parts were out, by how much, and from which machine and shift: is this one cause or a general spread problem? Halving every bore tolerance doubles cost everywhere for one dimension. And is that bore functional at this tolerance, or could we ask the customer whether it can be opened up?',
        rubric: [
          'Asks for the facts: how many, how far out, where and when',
          'Questions a blanket tightening because of its cost',
          'Asks whether the tolerance itself matches the function (and could be discussed with the customer)',
        ],
      },
      sayIt: 'Explain to a new planner in 60 seconds what nominal, tolerance and spec limits are, and why out of spec gets expensive fast.',
      terms: [
        { term: 'Nominal', def: 'The target value of a dimension on the drawing.' },
        { term: 'Tolerance', def: 'The allowed deviation from nominal; the width between the spec limits.' },
        { term: 'USL / LSL', def: 'Upper and lower spec limit: the edges of what is acceptable.' },
        { term: 'Deviation (concession)', def: 'Written customer approval to use nonconforming parts as they are.' },
      ],
    },
    {
      id: 'eng.quality.variation',
      title: 'Variation: common and special cause',
      pre: [
        {
          q: 'Two machines make a 10 ±0.05 mm part. Both average exactly 10.00 mm. Which makes more scrap?',
          options: ['Neither, the average is on target', 'The newest one', 'The one with the larger spread', 'The faster one'],
          answer: 'The one with the larger spread',
          why: 'With the same average, the wider spread pushes more parts past the spec limits.',
        },
      ],
      teach: [
        'No two parts are identical. Engineers describe variation with two numbers. The mean is where the process is centred. The standard deviation (σ, sigma) is how wide it spreads. For a normal distribution, about 68% of parts fall within ±1σ of the mean and 99.7% within ±3σ. A mean of 10.00 with σ 0.01 puts nearly every part between 9.97 and 10.03.',
        'Common cause variation comes from many small sources that are always there: material, temperature, spindle play, operator technique. It gives a stable, predictable spread. You only reduce it by changing the system: a better machine, fixture or method.',
        'Special cause variation comes from a specific event: a broken tool, a new coil of steel, a cold machine on Monday morning, a new operator. It shows as a jump, a trend or an outlier. You find it, fix it and stop it coming back.',
        'Treating common cause as special makes things worse. An operator who adjusts the offset after every part, chasing normal noise, increases the spread by about 40%: that’s called tampering. So the first question is always: did something change, or is this just how wide the process is?',
      ],
      example: {
        kind: 'worked',
        text: 'A lathe makes Ø20 ±0.05 shafts. 25 parts on Thursday: mean 20.003, σ 0.008. Three sigma is 0.024, so nearly all parts lie between 19.979 and 20.027: well inside 19.95 to 20.05. That is common cause; leave the machine alone. Monday 06:00, the first 10 parts average 20.025, then drift back to 20.005 by 07:00. That jump is special cause: the machine is cold after the weekend and grows as it warms. The fix is a 20-minute warm-up program, not adjusting offsets every hour.',
      },
      said: 'What engineers say: “That’s just the normal spread, don’t touch it. But that jump on Monday morning, that’s something. What changed?”',
      recall: [
        {
          q: 'A process has a mean of 50.00 mm and σ of 0.02 mm. Where does the top of the ±3σ spread sit, in mm?',
          number: 50.06,
          tolerance: 0.001,
          unit: 'mm',
          why: '50.00 + 3 × 0.02 = 50.06.',
        },
        {
          q: 'Roughly what percentage of parts fall within ±3σ of the mean in a normal distribution?',
          number: 99.7,
          tolerance: 0.2,
          unit: '%',
          why: '68% within 1σ, 95% within 2σ, 99.7% within 3σ.',
        },
        {
          q: 'An operator adjusts the tool offset after every part, based on the last measurement. What happens?',
          options: ['The spread increases', 'The spread decreases', 'Nothing changes', 'The mean drifts but the spread stays the same'],
          answer: 'The spread increases',
          why: 'Reacting to common-cause noise adds variation: tampering.',
        },
        {
          q: 'Which of these is a special cause?',
          options: ['Small temperature changes during the day', 'Normal play in the spindle bearings', 'A new coil from a different steel supplier causing a jump', 'The usual difference between parts in one batch'],
          answer: 'A new coil from a different steel supplier causing a jump',
          why: 'It is a specific, identifiable event that shifts the process.',
        },
      ],
      situation: {
        scene: 'You’re at a sheet metal plant. Scrap on one press brake went from 1% to 4% over two weeks. The operator says: “It’s just normal variation, the material is never the same.”',
        ask: 'What do you ask to tell special cause from common cause?',
        model: 'Did the scrap jump at a specific moment, or has it been creeping up? What changed around then: a new material batch, tooling, operator, program? If we plot the bend angle per hour for the last two weeks, we’ll see whether it’s a shift or just wider spread, and that decides whether we hunt for an event or change the process.',
        rubric: [
          'Asks when it changed: a jump or a gradual drift',
          'Asks what changed in material, tooling, people or program',
          'Proposes plotting the data over time to separate the two',
        ],
      },
      sayIt: 'Explain to a team leader in 60 seconds the difference between common and special cause, and why adjusting after every part is a bad idea.',
      terms: [
        { term: 'Mean', def: 'The average value: where the process is centred.' },
        { term: 'Standard deviation (σ)', def: 'How wide the process spreads around the mean.' },
        { term: 'Common cause', def: 'Variation from many small sources always present; change the system to reduce it.' },
        { term: 'Special cause', def: 'Variation from a specific event; find it and remove it.' },
      ],
    },
    {
      id: 'eng.quality.capability',
      title: 'Capability: Cp and Cpk',
      pre: [
        {
          q: 'A perfectly centred process has Cpk = 1.0. Roughly how many parts per million fall outside the spec?',
          options: ['About 3', 'About 60', 'About 27,000', 'About 2,700'],
          answer: 'About 2,700',
          why: 'Cpk 1.0 means the spec limits sit at ±3σ, so 0.3% of parts fall outside: 2,700 ppm.',
        },
      ],
      teach: [
        'Capability compares the spread of the process with the width of the tolerance. Cp = tolerance width / 6σ. With a tolerance of 0.10 mm and σ of 0.0125, 6σ is 0.075, so Cp = 1.33. Cp only says whether the process would fit if it were perfectly centred.',
        'Cpk adds the centring: the distance from the mean to the nearest spec limit, divided by 3σ. Move that same process 0.025 mm towards the upper limit and it has 0.025 left to the limit: Cpk = 0.025 / 0.0375 = 0.67. Cp is still 1.33, but now it makes scrap. Cpk is never higher than Cp.',
        'Targets: 1.33 is the common minimum for running production (about 63 ppm if centred). 1.67 is asked for new processes and safety characteristics. Below 1.0 you make scrap every day and need 100% inspection.',
        'The gap between Cp and Cpk tells you the fix. Cp high and Cpk low: centre the process, often one offset. Both low: reduce the spread, which means fixture, machine or method, and costs real money. And a Cpk only means something if the process was stable while you measured it.',
      ],
      example: {
        kind: 'worked',
        text: 'A bore is Ø30 +0.04/0: limits 30.000 and 30.040, tolerance 0.040. Fifty parts give a mean of 30.026 and σ of 0.004, so 3σ = 0.012 and 6σ = 0.024. Cp = 0.040 / 0.024 = 1.67: the spread is fine. Cpk = (30.040 − 30.026) / 0.012 = 1.17: not capable against a target of 1.33, because the mean sits too close to the top. A tool offset of −0.006 moves the mean to 30.020: Cpk = 0.020 / 0.012 = 1.67. One offset, no investment.',
      },
      said: 'What engineers say: “Cp is 1.7 but Cpk is 1.1, so it’s not the spread, it’s off-centre. Shift the offset and we’re there.”',
      recall: [
        {
          q: 'Tolerance width is 0.06 mm and σ is 0.01 mm. What is Cp?',
          number: 1,
          tolerance: 0.01,
          unit: '',
          why: 'Cp = 0.06 / (6 × 0.01) = 1.0.',
        },
        {
          q: 'LSL 9.95, USL 10.05, mean 10.02, σ 0.01. What is Cpk?',
          number: 1,
          tolerance: 0.01,
          unit: '',
          why: 'Nearest limit is the USL: (10.05 − 10.02) / (3 × 0.01) = 1.0.',
        },
        {
          q: 'A process has Cp 1.8 and Cpk 0.9. What is the first thing to do?',
          options: ['Buy a more precise machine', 'Centre the process', 'Widen the tolerance', 'Start 100% inspection and leave it'],
          answer: 'Centre the process',
          why: 'The spread fits easily; the mean is just too close to one limit.',
        },
        {
          q: 'What Cpk is the common minimum target for a running production process?',
          options: ['0.67', '1.00', '1.33', '3.00'],
          answer: '1.33',
          why: '1.33 is the usual minimum; 1.67 for new processes and safety characteristics.',
        },
      ],
      situation: {
        scene: 'You’re at a supplier quality meeting at an automotive client. The supplier presents a Cpk of 1.52 on a safety-critical diameter and says: “So we’re capable, case closed.”',
        ask: 'What do you ask before you accept that number?',
        model: 'Over how many parts and how many days was that measured? Was the process in control in that period, and can we see the control chart? A Cpk from 30 parts on one good morning says little. And has the gauge been through a gauge R&R, because measurement noise ends up in that σ too?',
        rubric: [
          'Asks for sample size and the period of measurement',
          'Asks whether the process was stable (control chart) during the study',
          'Asks whether the measurement system was checked',
        ],
      },
      sayIt: 'Explain to a production manager in 60 seconds what Cp and Cpk mean and why a high Cp with a low Cpk is good news.',
      terms: [
        { term: 'Cp', def: 'Tolerance width divided by 6σ: could the spread fit if centred?' },
        { term: 'Cpk', def: 'Distance from mean to the nearest limit divided by 3σ: does it fit where it is?' },
        { term: 'Ppk', def: 'Like Cpk, but using the overall long-term spread, often asked at launch.' },
        { term: 'ppm', def: 'Parts per million: defects out of every million parts.' },
      ],
    },
    {
      id: 'eng.quality.spc',
      title: 'Control charts (SPC)',
      pre: [
        {
          q: 'Where do the control limits on an X-bar chart come from?',
          options: ['The tolerance on the drawing', 'The customer’s requirements', 'The machine manual', 'The process’s own measured data'],
          answer: 'The process’s own measured data',
          why: 'Control limits are ±3σ of the process itself: the voice of the process, not of the customer.',
        },
      ],
      teach: [
        'A control chart plots a measurement over time, with a centre line and control limits at ±3σ of the process itself. The classic is the X-bar/R chart: every hour you measure a subgroup of, say, 5 parts and plot their average (X-bar) and their range (R, largest minus smallest). X-bar shows whether the centre moves; R shows whether the spread changes.',
        'Control limits are not spec limits. Spec limits are what the customer needs. Control limits are what the process normally does. A point can be in control but out of spec (the process isn’t capable), or out of control but still in spec (something changed: act before it becomes scrap). Spec limits don’t belong on an X-bar chart, because averages spread less than single parts.',
        'The rules that signal a special cause: one point outside a control limit; a run of 7 points in a row on one side of the centre line (some plants use 8 or 9); 6 or more points in a row steadily rising or falling; 2 out of 3 points beyond 2σ. Any of these means stop and look.',
        'The weak spot in most plants: the charts are filled in, but nobody reacts. Every chart needs a reaction plan: what the operator does when a rule fires, who to call, what to do with the parts since the last good check. A chart without reaction is wallpaper.',
      ],
      example: {
        kind: 'worked',
        text: 'Shafts Ø20 ±0.05, subgroups of 5 every hour. Grand mean 20.000, average range 0.020. For n = 5 the constant A2 is 0.577, so the limits are 20.000 ± 0.577 × 0.020: 19.9885 to 20.0115. From 10:00 to 16:00 the averages are 20.002, 20.004, 20.005, 20.006, 20.008, 20.009, 20.011. All inside the limits, all far inside spec, but seven rising in a row: a trend. Tool wear. The operator changes the insert at 16:10, before a single part is out.',
      },
      said: 'What engineers say: “It’s still in spec, but that’s seven up in a row. That’s the insert going, change it now and we never make a bad part.”',
      recall: [
        {
          q: 'X-bar/R chart, subgroup size 5 (A2 = 0.577). Grand mean 50.00 mm, average range 0.10 mm. What is the upper control limit, in mm?',
          number: 50.058,
          tolerance: 0.002,
          unit: 'mm',
          why: 'UCL = 50.00 + 0.577 × 0.10 = 50.0577.',
        },
        {
          q: 'A point falls outside the control limit, but the part is still within spec. What do you do?',
          options: ['Nothing, the part is good', 'Look for the special cause now', 'Widen the control limits', 'Scrap the whole batch'],
          answer: 'Look for the special cause now',
          why: 'Something changed in the process; finding it before parts go out of spec is the whole point.',
        },
        {
          q: 'Eight points in a row sit above the centre line, all inside the control limits. What does that signal?',
          options: ['Nothing, they are all inside the limits', 'The chart is drawn wrong', 'The process is very capable', 'The process mean has shifted'],
          answer: 'The process mean has shifted',
          why: 'A long run on one side is very unlikely by chance; it signals a shift.',
        },
        {
          q: 'Why don’t spec limits belong on an X-bar chart?',
          options: ['Averages of 5 parts spread less than single parts', 'Customers don’t allow it', 'They are always the same as control limits', 'Spec limits are confidential'],
          answer: 'Averages of 5 parts spread less than single parts',
          why: 'An average can look fine while single parts in the subgroup are out of spec.',
        },
      ],
      situation: {
        scene: 'You walk past the SPC board at a plastic injection moulding client. The charts are neatly filled in. On two of them, three points from this week sit outside the control limits. Nothing is written next to them.',
        ask: 'What do you ask the team leader?',
        model: 'What does the operator do when a point falls outside the limits, is there a reaction plan? Who looks at these charts, and when did someone last act on one? If the answer is nobody, we either make the reaction plan real or stop spending time filling them in.',
        rubric: [
          'Asks for the reaction plan',
          'Asks who reviews the charts and when someone last acted',
          'Names the choice: make it work or stop the ritual',
        ],
      },
      sayIt: 'Explain to an operator in 60 seconds why control limits are not the same as spec limits, and what to do when a point falls outside.',
      terms: [
        { term: 'Control limits', def: '±3σ of the process itself: what the process normally does.' },
        { term: 'Spec limits', def: 'What the customer needs, from the drawing.' },
        { term: 'X-bar/R chart', def: 'Chart of subgroup averages and ranges over time.' },
        { term: 'Reaction plan', def: 'What to do, and who to call, when a chart signals.' },
      ],
    },
    {
      id: 'eng.quality.fmea',
      title: 'FMEA: risk before launch',
      pre: [
        {
          q: 'Failure mode 1 scores Severity 10, Occurrence 4, Detection 3 (RPN 120). Failure mode 2 scores 4, 6, 6 (RPN 144). Which do you work on first?',
          options: ['Failure mode 1, because severity 10 comes first', 'Failure mode 2, because its RPN is higher', 'Both equally', 'Neither, both are below 200'],
          answer: 'Failure mode 1, because severity 10 comes first',
          why: 'A severity of 9 or 10 means safety or legal risk; it gets action whatever the RPN.',
        },
      ],
      teach: [
        'FMEA (Failure Mode and Effects Analysis) is a structured team session, held before launch. For every process step (PFMEA) or design function (DFMEA) the team asks: how can it fail (failure mode), what happens then (effect), why would it happen (cause), and what do we already do to prevent or detect it (controls)?',
        'Each line gets three scores from 1 to 10. Severity: how bad the effect is; 9 or 10 is safety or legal. Occurrence: how likely the cause is. Detection: how likely we catch it before it leaves us; note that 1 means almost certain to catch it and 10 means no chance. RPN = S × O × D, maximum 1,000.',
        'RPN has problems: very different risks get the same number, and teams learn to score just under the threshold. The AIAG-VDA FMEA (2019) replaced it with Action Priority (high, medium, low), which weighs severity first, then occurrence, then detection. Only a design change lowers severity; prevention lowers occurrence; better checks lower detection.',
        'Timing is everything. An FMEA done before design freeze can still change the product and the process. One written after start of production to fill the PPAP file is paperwork. Good FMEAs have design, process engineering, quality, maintenance and an operator in the room, and get updated after every complaint.',
      ],
      example: {
        kind: 'worked',
        text: 'Step: press a bearing into a wheel hub housing. Failure mode: bearing not fully seated. Effect: bearing walks out, noise, possible wheel damage: S = 8. Cause: press force too low from worn tooling: O = 5. Current control: operator looks at it: D = 7. RPN = 8 × 5 × 7 = 280. Action: force-displacement monitoring on the press, rejecting every part outside the curve window: D = 2. New RPN = 8 × 5 × 2 = 80. Severity stays 8, because only a design change can make the effect less bad.',
      },
      said: 'What engineers say: “Severity nine and we’re relying on a visual check? That’s a detection of seven at best. We need a poka-yoke there before SOP.”',
      recall: [
        {
          q: 'A failure mode scores S 7, O 4, D 5. What is the RPN?',
          number: 140,
          tolerance: 0.5,
          unit: '',
          why: '7 × 4 × 5 = 140.',
        },
        {
          q: 'What does a detection score of 1 mean?',
          options: ['The failure will almost certainly not be detected', 'The failure is almost certainly detected', 'The failure occurs once', 'The failure is harmless'],
          answer: 'The failure is almost certainly detected',
          why: 'The detection scale is inverted: low is good.',
        },
        {
          q: 'Which action can lower the severity score?',
          options: ['Adding a camera check', 'Training the operators', 'More frequent maintenance', 'Changing the design so the effect is less harmful'],
          answer: 'Changing the design so the effect is less harmful',
          why: 'Severity is about the effect; only changing the design changes the effect.',
        },
        {
          q: 'When does an FMEA add the most value?',
          options: ['Before design and process are frozen', 'Right after the first customer complaint', 'When the PPAP file is being assembled', 'At the yearly audit'],
          answer: 'Before design and process are frozen',
          why: 'That is when the findings can still change the product and the process cheaply.',
        },
      ],
      situation: {
        scene: 'You’re helping a client launch a new assembly line in six weeks. The PFMEA was copied from an older line by one quality engineer. Every RPN is below 100.',
        ask: 'What do you ask?',
        model: 'Who was in the session, and what is different on this line compared to the old one: new equipment, new product features, new suppliers? Which lines have severity 9 or 10, and what is the detection control there: if it’s a visual check, I’d like to see that worked on before launch. Can we get design, maintenance and an operator together for two half days?',
        rubric: [
          'Asks who made it and what is new compared to the copied line',
          'Goes straight to the high-severity items and their controls',
          'Proposes a real cross-functional session before launch',
        ],
      },
      sayIt: 'Explain to a project sponsor in 60 seconds what an FMEA is and why doing it after launch is too late.',
      terms: [
        { term: 'Failure mode', def: 'The way something can go wrong at a step or function.' },
        { term: 'RPN', def: 'Risk priority number: Severity × Occurrence × Detection.' },
        { term: 'Action Priority (AP)', def: 'AIAG-VDA rating (high, medium, low) that weighs severity first.' },
        { term: 'PFMEA / DFMEA', def: 'FMEA of the process / of the design.' },
      ],
    },
    {
      id: 'eng.quality.controlplan',
      title: 'Control plan, measurement and PPAP',
      pre: [
        {
          q: 'A gauge R&R study shows the measurement system uses 45% of the tolerance. What does that mean?',
          options: ['The gauge is fine', '45% of the parts are bad', 'Almost half the tolerance is eaten by measurement noise', 'The process is 45% capable'],
          answer: 'Almost half the tolerance is eaten by measurement noise',
          why: 'Near the limits you can’t trust good/bad decisions; above 30% the gauge is not acceptable.',
        },
      ],
      teach: [
        'The control plan is a table that says, for every process step, which characteristics are checked: the spec, the gauge, the sample size and frequency, who checks, how it’s recorded, and the reaction plan. Example row: “Bore Ø30 H7, air gauge, 1 in 20, operator, SPC chart; if out: stop, quarantine back to the last good check, call the team leader.” It is the bridge from the FMEA to the shop floor.',
        'Measuring is a process with its own variation. MSA (measurement system analysis) checks it. The best-known study is gauge R&R: for example 10 parts, 3 operators, each part measured 3 times. Repeatability is the spread with the same person and gauge; reproducibility is the difference between people.',
        'The result is shown as % of tolerance. Under 10%: good. 10 to 30%: acceptable depending on use and cost. Over 30%: not acceptable. Rule of ten: the gauge resolution should be at most a tenth of the tolerance. A caliper reading to 0.01 mm is useless on a 0.02 mm tolerance.',
        'PPAP (Production Part Approval Process) is the automotive package a supplier submits before shipping series parts: drawing and dimensional results, FMEA, control plan, MSA, capability studies, sample parts, and a signed Part Submission Warrant (PSW). Level 3 is the default. Underneath the paperwork it answers one question: can this process make good parts at rate?',
      ],
      example: {
        kind: 'worked',
        text: 'Control plan line for a shaft OD 20 ±0.02 (tolerance 0.04 mm). The proposal is a digital caliper with 0.01 mm resolution. Rule of ten: you need 0.004 or better, so the caliper fails. With a micrometer (0.001 mm), a gauge R&R of 10 parts × 3 operators × 3 repeats gives 90 readings and a measurement σ of 0.001 mm. Six times that is 0.006 mm: 0.006 / 0.04 = 15% of tolerance. Acceptable, and written into the control plan with frequency 5 parts per hour.',
      },
      said: 'What engineers say: “Before we argue about the Cpk, has anyone done an R&R on that gauge? If it eats 40% of the tolerance, we’re measuring noise.”',
      recall: [
        {
          q: 'The tolerance is 0.05 mm. Following the rule of ten, what gauge resolution do you need at most, in mm?',
          number: 0.005,
          tolerance: 0.0001,
          unit: 'mm',
          why: 'A tenth of the tolerance: 0.05 / 10 = 0.005 mm.',
        },
        {
          q: 'The measurement spread (6σ of the gauge) is 0.012 mm on a tolerance of 0.04 mm. What is the %GRR?',
          number: 30,
          tolerance: 0.5,
          unit: '%',
          why: '0.012 / 0.04 = 0.30: right at the limit of acceptable.',
        },
        {
          q: 'Which of these belongs in a control plan line?',
          options: ['The cost price of the part', 'The reaction plan when a check fails', 'The operator’s shift preference', 'The supplier’s turnover'],
          answer: 'The reaction plan when a check fails',
          why: 'A control plan says what is checked, how, how often, by whom, and what to do when it fails.',
        },
        {
          q: 'What is PPAP really meant to prove?',
          options: ['That the supplier has an ISO certificate', 'That the drawing is correct', 'That the process can make good parts at the required rate', 'That the price has been agreed'],
          answer: 'That the process can make good parts at the required rate',
          why: 'All the elements together show capability, control and measurement before series supply.',
        },
      ],
      situation: {
        scene: 'You’re at a plant where the day shift rejects parts that the night shift accepts. Both use the same bore gauge. The production manager blames “attitude on nights”.',
        ask: 'What do you ask before this turns into a people discussion?',
        model: 'Has this gauge been through a gauge R&R, including people from both shifts? Do they measure at the same spot and depth, with the same setting master? If reproducibility is the problem, it’s the method or the gauge, not the attitude, and we fix it with a clear measuring instruction.',
        rubric: [
          'Asks for a gauge R&R with operators from both shifts',
          'Asks about the measuring method (where, how, setting master)',
          'Moves the discussion from blame to the measurement system',
        ],
      },
      sayIt: 'Explain to a production manager in 60 seconds why you check the gauge before you trust a capability number.',
      terms: [
        { term: 'Control plan', def: 'Table of what is checked per step, how, how often, by whom, and the reaction plan.' },
        { term: 'Gauge R&R', def: 'Study of measurement spread: repeatability (gauge) and reproducibility (people).' },
        { term: 'PPAP', def: 'Production Part Approval Process: the supplier’s proof before series supply.' },
        { term: 'PSW', def: 'Part Submission Warrant: the signed summary page of a PPAP.' },
      ],
    },
  ],
};
