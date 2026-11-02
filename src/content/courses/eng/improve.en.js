// eng.improve (EN): Engineering problem solving: 8D, is/is-not and stratification, measuring before concluding, design of experiments, verifying the fix, facilitating a root-cause session.
export default {
  lessons: [
    {
      id: 'eng.improve.8d',
      title: '8D: contain, find the cause, fix it for good',
      pre: [
        {
          q: 'A customer finds cracked brackets. The supplier sorts all stock at 100% and ships only good parts. Is the problem solved?',
          options: ['Yes, the customer now gets good parts', 'Yes, if the sorting is documented', 'No, the customer is protected but the cause still makes cracked parts', 'No, because 100% sorting is not allowed in automotive'],
          answer: 'No, the customer is protected but the cause still makes cracked parts',
          why: 'Sorting is containment: it stops bad parts reaching the customer, but the process keeps making them.',
        },
      ],
      teach: [
        'The 8D is the standard problem-solving report in automotive and much of industry. D1 build the team. D2 describe the problem in numbers. D3 contain it. D4 find the root cause. D5 choose and prove the permanent action. D6 implement it and validate. D7 prevent recurrence. D8 close and thank the team. Many versions add D0: decide whether an 8D is needed and take emergency action. Customers often expect D3 within 24 hours (a common requirement, not a law).',
        'Containment (D3) protects the customer while you search. Quarantine stock at your plant, in transit and at the customer, sort it, and mark the first clean shipment. It is expensive and leaky: people sorting by eye miss some defects, often 10–20% as a rule of thumb. Containment buys time. It is never the fix, and a team that stops after D3 will see the problem again.',
        'A real root cause (D4) has two legs. The occurrence cause: why the process made the bad part. The escape cause: why your checks let it through. Both need evidence, not opinion. “Operator error” is not a root cause; it only moves the question to why the process allowed the error, and why nothing caught it.',
        'The permanent action (D5–D6) removes or blocks the cause, and D7 updates the FMEA, the control plan and the work instructions, and checks sister processes. The question that exposes a weak 8D: “If we did nothing else, what would stop this happening again tomorrow?” If the answer is “people will be more careful”, the 8D is not done.',
      ],
      example: {
        kind: 'faded',
        text: 'A tier-2 supplier ships plastic housings with short shots (incompletely filled parts) to a car-parts customer. D3: 100% visual sort of 9,000 parts, 140 rejects found. D4 in the draft 8D reads “operator did not check the parts”. D5 reads “operator retrained, extra visual check added”. The quality manager wants to send it to the customer today.',
        ask: 'What would you do next?',
        reveal: 'Push back before it goes out. “Operator did not check” is the escape side, and only half of it: why was a visual check the only barrier? The occurrence cause is missing completely: why did the mould make short shots? Ask for data on shot size, injection pressure, melt temperature, material drying and blocked vents, split by cavity and time. The permanent action should stop short shots being made (for example a process window with alarms) and detect them automatically (cavity-pressure monitoring or a part-weight check), not rely on more watching. Then update the PFMEA and control plan, and check the other moulds that run the same material.',
      },
      said: 'What engineers say: “D3 is in place, the customer is clean. But we haven’t got a D4 yet, we’ve only got a theory.”',
      recall: [
        {
          q: 'You hold 12,000 parts with a 2% defect rate. A visual sort catches 85% of the bad parts. How many bad parts still reach the customer?',
          number: 36,
          tolerance: 1,
          unit: 'parts',
          why: '12,000 × 2% = 240 bad parts; 15% escape the sort, so 240 × 0.15 = 36.',
        },
        {
          q: 'When is D4 complete?',
          options: ['When the team agrees on the most likely cause', 'When the operator has signed the training record', 'When both the occurrence cause and the escape cause are confirmed with evidence', 'When the customer stops complaining'],
          answer: 'When both the occurrence cause and the escape cause are confirmed with evidence',
          why: 'A root cause explains why the part was made bad and why it got through, and is proven, not voted on.',
        },
        {
          q: 'A draft 8D names “operator error” as the root cause. What is the strongest follow-up question?',
          options: ['Which operator was it?', 'Has the operator been retrained?', 'Was it night shift?', 'Why did the process allow this error, and why did nothing catch it?'],
          answer: 'Why did the process allow this error, and why did nothing catch it?',
          why: 'Human error is a symptom; the cause is the process design that made the error possible and invisible.',
        },
        {
          q: 'Why is a 100% sort not a permanent corrective action?',
          options: ['Customers do not accept sorting at all', 'It catches only part of the defects, costs labour, and leaves the cause in place', 'It is too slow for high volumes', 'It needs a separate 8D'],
          answer: 'It catches only part of the defects, costs labour, and leaves the cause in place',
          why: 'Sorting is containment; the process still makes the defect.',
        },
      ],
      situation: {
        scene: 'You’re at a metal stamping client for the weekly 8D review. A customer complaint about burrs on a bracket shows D4 “die wear” and D5 “extra visual check at packing”. The quality engineer wants to close it.',
        ask: 'What do you ask?',
        model: 'What evidence do we have that die wear causes these burrs: do burr height and strokes since the last sharpening line up? And why did die wear go unnoticed: is there a sharpening interval or a burr check at the press? A check at packing is containment; the permanent action should be a sharpening interval based on stroke count, and a burr check at the press. Do the other dies on that press have the same risk?',
        rubric: [
          'Asks for evidence linking the stated cause to the defect',
          'Separates the occurrence cause from the escape cause',
          'Calls the packing check containment and asks for an action that removes the cause',
        ],
      },
      sayIt: 'Explain to a plant manager in 60 seconds why containment is not the fix, and what a finished D4 looks like.',
      terms: [
        { term: '8D', def: 'Eight-step problem-solving report: team, description, containment, root cause, action, validation, prevention, closure.' },
        { term: 'Containment', def: 'Temporary action that protects the customer, such as quarantine and sorting, while the cause is found.' },
        { term: 'Occurrence and escape cause', def: 'Why the defect was made, and why the checks did not catch it.' },
      ],
    },
    {
      id: 'eng.improve.isisnot',
      title: 'Is/is-not and stratification',
      pre: [
        {
          q: 'Leaks appear on parts from machining centre 2 but not from machining centre 1. Both use the same casting lots. Which theory does this data weaken most?',
          options: ['A worn tool on centre 2', 'Porous castings from the supplier', 'A program change on centre 2', 'Different coolant on centre 2'],
          answer: 'Porous castings from the supplier',
          why: 'The same castings are fine on centre 1, so a supplier cause must also explain why centre 1 has no leaks.',
        },
      ],
      teach: [
        'Is/is-not analysis describes a problem along four lines: what (which part, which defect), where (which machine, which place on the part), when (since when, which shift, which point in the cycle) and how much (how many, trend). For each line you write what it is, and what it could be but is not. The “is not” column is where the learning is.',
        'Then ask two questions of every pair. What is distinct about the “is” side? And what changed around the time it started? A problem that starts on a date almost always has a trigger: a new tool, a program edit, a supplier change, a new operator, a maintenance job.',
        'Stratification is is/is-not with data. Split defects by machine, cavity, shift, material lot, operator and week. A flat 5% scrap rate can turn out to be 28% on one cavity and under 2% everywhere else. Concentrated defects point to a specific cause. Defects spread evenly across everything point to something common: the material, the design or the method.',
        'A true cause must explain every “is” and every “is not”. Test each theory against the table: “If it is the material, why is line 1 fine?” That one question exposes most weak analyses, because a favourite theory usually explains the defect but not where it is absent.',
      ],
      example: {
        kind: 'faded',
        text: 'Valve bodies fail the leak test at 3%. The engineer is sure it is porosity from the casting supplier. The data: leaks started in week 14; all leaking parts came from machining centre 2, none from centre 1; both centres run the same casting lots; every leak is at the same port.',
        ask: 'What would you do next?',
        reveal: 'Test the supplier theory against the is-not: the same lots are fine on centre 1, so porosity alone cannot explain it. Look at what is distinct about centre 2 and what changed there around week 14: a new drill or tap, a program edit, a fixture repair, a coolant change. One port only suggests a single operation. Check that operation on centre 2: tool wear, depth, and whether the drill now breaks into a porous zone the old program missed. Then confirm by running the same casting lot on both centres.',
      },
      said: 'What engineers say: “Stratify it per cavity first. If it’s all cavity 5, stop talking about the material.”',
      recall: [
        {
          q: 'An 8-cavity mould made 8,000 parts, 1,000 per cavity, with 400 rejects. Cavity 5 has 280 of them. What is the reject rate of the other seven cavities combined, in percent?',
          number: 1.7,
          tolerance: 0.1,
          unit: '%',
          why: '400 − 280 = 120 rejects over 7,000 parts = 1.7%, against 28% on cavity 5.',
        },
        {
          q: 'What must a true cause explain?',
          options: ['The biggest share of the defects', 'What the most experienced engineer has seen before', 'The cost of the problem', 'Every “is” and every “is not” in the table'],
          answer: 'Every “is” and every “is not” in the table',
          why: 'A cause that fits the defects but not where they are absent is not the cause.',
        },
        {
          q: 'Defects are spread evenly over all machines, shifts and cavities. Where do you look first?',
          options: ['Something common to all: material, design or method', 'The newest operator', 'The machine with the most hours', 'The night shift'],
          answer: 'Something common to all: material, design or method',
          why: 'An even spread means no local cause; look at what every part shares.',
        },
        {
          q: 'Why ask what changed around the date a problem started?',
          options: ['Because auditors want a timeline', 'Because changes are usually cheap to undo', 'Because a problem that starts on a date usually has a trigger', 'Because operators remember changes best'],
          answer: 'Because a problem that starts on a date usually has a trigger',
          why: 'Tools, programs, suppliers, people and maintenance jobs are the usual triggers.',
        },
      ],
      situation: {
        scene: 'You’re at a food-packaging client. Seal failures on one packing line have doubled. The maintenance lead says the new film supplier is the cause and wants to switch back.',
        ask: 'What do you ask before they switch?',
        model: 'Is the new film running on the other lines too, and are they also seeing more seal failures? If not, the film alone cannot explain it. Can we split the failures by sealing jaw, shift and film roll, and list what changed on this line around the same date? If the failures sit on one jaw, we look at that jaw before we change supplier.',
        rubric: [
          'Tests the theory against the is-not (other lines with the same film)',
          'Asks to stratify the failures by jaw, shift or roll',
          'Asks what changed on this line around the start date',
        ],
      },
      sayIt: 'Explain to a production manager in 60 seconds how an is/is-not table can kill a favourite theory.',
      terms: [
        { term: 'Is/is-not', def: 'A table that sets where, when and how much a problem occurs against where it could occur but does not.' },
        { term: 'Stratification', def: 'Splitting defect data by machine, cavity, shift, lot or time to see where it concentrates.' },
        { term: 'Distinction', def: 'Something true of the “is” side and not of the “is not” side; a pointer to the cause.' },
      ],
    },
    {
      id: 'eng.improve.data',
      title: 'Measuring before concluding',
      pre: [
        {
          q: 'Scrap normally runs between 3% and 7% a day. After a process change, the first day shows 3.5%. What can you conclude?',
          options: ['The change works', 'The change made scrap worse', 'Nothing yet; 3.5% is inside the normal spread', 'The scrap measurement must be wrong'],
          answer: 'Nothing yet; 3.5% is inside the normal spread',
          why: 'A day inside the usual range is what you would see without any change.',
        },
      ],
      teach: [
        'Every process varies. Scrap, cycle time and dimensions move from day to day without anyone touching anything. Before judging a change, know the normal spread: plot the last 20 to 30 days on a run chart or control chart. A result inside the usual band tells you nothing, however good it looks.',
        'One good day proves nothing. What you need is a sustained shift. A common run-chart rule of thumb: about 8 points in a row on one side of the centre line signals a real change (books use 6 to 9). Also check that nothing else changed at the same time, such as the product mix, the material lot or the shift pattern.',
        'Rare defects need big samples. The rule of three: if you see zero defects in n parts, you can say with 95% confidence that the rate is below about 3 / n. So 50 good parts only shows the rate is under 6%. To claim under 1% you need about 300 good parts in a row.',
        'Trust the measurement first. A gauge R&R study shows how much of the spread comes from the measurement itself. Common guidance (AIAG): under 10% is good, 10–30% may be acceptable, over 30% is not. The question that exposes a weak analysis: “What was the normal variation before, and how good is the gauge?”',
      ],
      example: {
        kind: 'faded',
        text: 'A moulding team raised the nozzle temperature on Tuesday. Wednesday’s scrap was 1.8%, against a “normal 4%”. Over the last four weeks, daily scrap ranged from 2.1% to 6.3%. The plant manager wants to roll the setting out to all six machines tomorrow.',
        ask: 'What would you do next?',
        reveal: 'Wednesday is just below the lowest day of the last month, which is interesting, not proof. Keep the new setting on this machine for about two weeks and plot daily scrap on the same chart as the four weeks before. Look for a sustained run below the old average, not one point. Check what else changed: the product mix, the material lot, who was on shift. If you want it faster, switch the setting back for a few days and see whether scrap returns. Then roll out.',
      },
      said: 'What engineers say: “One good shift is noise. Show me two weeks on the chart and then we’ll talk.”',
      recall: [
        {
          q: 'Using the rule of three, how many consecutive good parts do you need to claim with 95% confidence that the defect rate is below 0.5%?',
          number: 600,
          tolerance: 10,
          unit: 'parts',
          why: '3 / 0.005 = 600.',
        },
        {
          q: 'A team sees scrap fall from 5% to 4% the week after a change. Normal weekly scrap ranges from 3.5% to 6%. What is the honest summary?',
          options: ['Scrap fell by 20%, the change works', 'The result is inside normal variation; keep measuring', 'The change made no difference', 'The measurement system is broken'],
          answer: 'The result is inside normal variation; keep measuring',
          why: 'A week inside the usual range is not evidence for or against the change.',
        },
        {
          q: 'On a run chart, what signals a real shift?',
          options: ['A long run of points on one side of the centre line', 'One point far from the rest', 'The last point being the lowest', 'Two points moving in the same direction'],
          answer: 'A long run of points on one side of the centre line',
          why: 'A sustained run, about 8 points as a rule of thumb, is unlikely by chance.',
        },
        {
          q: 'A gauge R&R study comes back at 35% of tolerance. What does that mean?',
          options: ['The process is 35% out of tolerance', 'The parts are 35% scrap', 'The gauge is very good', 'The measurement system is not fit to judge the parts'],
          answer: 'The measurement system is not fit to judge the parts',
          why: 'Over 30% of the tolerance is taken up by measurement error, so readings cannot separate good from bad reliably.',
        },
      ],
      situation: {
        scene: 'You’re at a client’s monthly results meeting. An engineer shows that a new fixture cut dimensional rejects from 2.4% to 0.9%, based on one week before and one week after.',
        ask: 'What do you ask?',
        model: 'How much do rejects normally vary week to week, and is 0.9% outside that range? Can we see more weeks before and after on one chart? And has the gauge been checked: what does the gauge R&R look like on this dimension? If the drop holds for several weeks and the gauge is sound, I am happy to call it.',
        rubric: [
          'Asks for the normal week-to-week variation',
          'Asks for more data before and after on a chart',
          'Asks whether the measurement system is capable',
        ],
      },
      sayIt: 'Explain to a sponsor in 60 seconds why one good day after a change proves nothing.',
      terms: [
        { term: 'Run chart', def: 'A plot of a measure over time with a centre line, used to spot real shifts.' },
        { term: 'Rule of three', def: 'Zero defects in n parts means the rate is below about 3 / n with 95% confidence.' },
        { term: 'Gauge R&R', def: 'A study of how much measurement variation comes from the gauge and the people using it.' },
      ],
    },
    {
      id: 'eng.improve.doe',
      figure: 'eng.improve.doe',
      title: 'Design of experiments in plain words',
      pre: [
        {
          q: 'An engineer tests temperature with pressure held fixed, then pressure with temperature held fixed. What can this approach miss?',
          options: ['Nothing, if each test is done carefully', 'The effect of temperature', 'The cost of the trial', 'The best combination, when the two factors interact'],
          answer: 'The best combination, when the two factors interact',
          why: 'One-factor-at-a-time never tests the corners where both are changed, so it misses interactions.',
        },
      ],
      teach: [
        'Design of experiments (DOE) changes several settings at once in a planned pattern. The words: a factor is a setting you change (temperature, pressure); a level is a value you test (low and high); the response is what you measure (defect rate, strength); a run is one combination. A full factorial at two levels needs 2 to the power k runs: 4 runs for 2 factors, 8 for 3, 16 for 4.',
        'The main effect of a factor is the average response at its high level minus the average at its low level. Because every run is used for every factor, a factorial gets more information from the same number of runs than testing one factor at a time.',
        'An interaction means the effect of one factor depends on the level of another. In gluing, a higher cure temperature may help only when the clamp pressure is also high. One-factor-at-a-time never tests that corner, so it can conclude that temperature “does not help”, and miss the best setting.',
        'Good practice: randomise the run order, so drift such as machine warm-up or a new material lot does not look like a factor effect. Repeat runs to see the noise. Pick levels wide enough to show an effect but safe to run. With many factors, a fractional factorial screens them in fewer runs. The question: “How big is the effect compared with the spread between repeats?”',
      ],
      example: {
        kind: 'faded',
        text: 'A 2×2 experiment on a moulding machine, defect rate per run of 500 parts. Low temperature, low pressure: 8%. High temperature, low pressure: 9%. Low temperature, high pressure: 7%. High temperature, high pressure: 2%. Last month the engineer tried one factor at a time, starting from low/low, and concluded: “higher temperature makes it worse, higher pressure helps a little, so best is 7%.”',
        ask: 'What do you conclude from the 2×2?',
        reveal: 'Main effect of temperature: average at high (9 and 2) is 5.5%, at low (8 and 7) is 7.5%, so −2 points. Main effect of pressure: high (7 and 2) is 4.5%, low (8 and 9) is 8.5%, so −4 points. But temperature behaves differently per pressure level: at low pressure it adds 1 point, at high pressure it removes 5. That is a strong interaction. One-factor-at-a-time never tested high/high and missed the 2% corner. Next: repeat high/high and the neighbouring runs, in random order, to confirm 2% is real and not one lucky run.',
      },
      said: 'What engineers say: “Don’t tweak one knob at a time, run a small factorial. And randomise it, the machine drifts in the first hour.”',
      recall: [
        {
          q: 'How many runs does a full factorial need with 4 factors at 2 levels, without repeats?',
          number: 16,
          tolerance: 0.5,
          unit: 'runs',
          why: '2 to the power 4 = 16.',
        },
        {
          q: 'Pull strength in a 2×2 test: low A, low B = 200 N; high A, low B = 240 N; low A, high B = 220 N; high A, high B = 260 N. What is the main effect of A?',
          number: 40,
          tolerance: 1,
          unit: 'N',
          why: 'High A averages (240 + 260) / 2 = 250; low A averages (200 + 220) / 2 = 210; 250 − 210 = 40 N.',
        },
        {
          q: 'What does an interaction between two factors mean?',
          options: ['Both factors have a large effect', 'The two factors were changed at the same time by mistake', 'The effect of one factor depends on the level of the other', 'The factors cancel each other out'],
          answer: 'The effect of one factor depends on the level of the other',
          why: 'On an interaction plot, the lines for the two levels of the other factor are not parallel.',
        },
        {
          q: 'Why randomise the run order?',
          options: ['To save time on changeovers', 'So that drift over time does not look like a factor effect', 'Because the software requires it', 'To make the results more significant'],
          answer: 'So that drift over time does not look like a factor effect',
          why: 'Warm-up, tool wear and material lots change over time; random order spreads them over all factors.',
        },
      ],
      situation: {
        scene: 'You’re at an adhesive bonding line. The process engineer has spent three weeks testing glue amount, cure time and cure temperature one at a time, and bond strength is still unstable.',
        ask: 'What do you suggest?',
        model: 'Could we run a 2-level factorial on the three factors instead: 8 runs, repeated once, in random order? That shows each main effect and any interaction, for example cure temperature only helping with longer cure time. Before we start: how much does bond strength vary between repeats at the same settings? Otherwise we can’t tell an effect from noise.',
        rubric: [
          'Proposes a small factorial with the right number of runs',
          'Mentions randomising and repeating runs',
          'Asks about the noise between repeats before judging effects',
        ],
      },
      sayIt: 'Explain to a production manager in 60 seconds what an interaction is, using a 2×2 example.',
      terms: [
        { term: 'Factor and level', def: 'A setting you change, and the values you test it at.' },
        { term: 'Main effect', def: 'Average response at a factor’s high level minus the average at its low level.' },
        { term: 'Interaction', def: 'When the effect of one factor depends on the level of another.' },
        { term: 'OFAT', def: 'One factor at a time: changing settings one by one, which misses interactions.' },
      ],
    },
    {
      id: 'eng.improve.verify',
      title: 'Verifying the fix',
      pre: [
        {
          q: 'A defect used to appear about once a month. After a fix, it has not appeared for 3 weeks. What does that prove?',
          options: ['The fix works', 'Almost nothing; 3 weeks is shorter than the normal gap', 'The fix works on day shift', 'The defect has moved to another product'],
          answer: 'Almost nothing; 3 weeks is shorter than the normal gap',
          why: 'With a monthly defect, 3 quiet weeks is what you would see without any fix.',
        },
      ],
      teach: [
        'The strongest proof of a root cause is switching the problem on and off. Put the old condition back, where it is safe and cheap, and the defect returns. Remove it, and the defect disappears. If you cannot do that, show that the defect rate follows the cause, for example cracks rising with tool wear. “It stopped after the fix” is weaker, because many things change at once.',
        'Validate in production over enough volume. Compare what you see with what you would expect without the fix. Old rate 1%, 1,500 parts since: expect about 15 defects, so zero is strong evidence. After 100 parts you would expect only 1, so zero means little. Rare problems need patience.',
        'The escape point is the place in the process, closest to the root cause, where the defect should have been caught and was not. Fix that too: why did the check miss it? Was the gauge not capable, the check too infrequent, the sample too small? A good 8D closes both the cause and the escape.',
        'Prevent recurrence elsewhere. Update the PFMEA, the control plan, the work instructions and the maintenance plan. Then do the read-across: the same machine type, the same design feature, the same supplier, other plants. The question that exposes a narrow fix: “Where else do we have this, and have we checked it?”',
      ],
      example: {
        kind: 'faded',
        text: 'Spot-welded brackets cracked at a customer. Root cause: a worn electrode tip on welder 4 after tip dressing was skipped. The fix: automatic tip dressing every 200 welds. Before, cracks were found at about 0.5%. Two weeks and 1,200 brackets since the fix, no cracks. The team wants to close the 8D. The plant has 12 welders with the same controller, and a sister plant has 8.',
        ask: 'What would you do next?',
        reveal: 'The volume is promising: at 0.5%, 1,200 parts would show about 6 cracks, so zero is real evidence. Strengthen it with on/off proof: weld a small test batch with a deliberately worn tip and confirm the cracks return, then show they disappear with a dressed tip. Close the escape: why did the end-of-line chisel test miss the cracks? Check its frequency and sample size. Then read across: are the other 11 welders and the 8 at the sister plant set to dress automatically? Update the PFMEA, the control plan and the maintenance plan before closing.',
      },
      said: 'What engineers say: “Can you turn it on and off? If not, you’ve got a correlation, not a root cause.”',
      recall: [
        {
          q: 'The defect rate before the fix was 0.5%. Since the fix, 2,000 parts have been made. How many defects would you expect if the fix did nothing?',
          number: 10,
          tolerance: 0.5,
          unit: 'defects',
          why: '2,000 × 0.005 = 10; seeing zero is strong evidence the fix works.',
        },
        {
          q: 'What is the strongest evidence that you found the root cause?',
          options: ['You can switch the defect on and off by adding and removing the cause', 'The defect stopped after the fix', 'The senior engineer agrees', 'The customer accepted the 8D'],
          answer: 'You can switch the defect on and off by adding and removing the cause',
          why: 'On/off control rules out coincidence and other changes made at the same time.',
        },
        {
          q: 'What is read-across?',
          options: ['Reading the 8D aloud to the team', 'Checking the customer’s complaint data', 'Applying the fix and checks to similar machines, products and plants', 'Comparing two operators’ results'],
          answer: 'Applying the fix and checks to similar machines, products and plants',
          why: 'The same cause often lives on sister equipment and similar designs.',
        },
        {
          q: 'What is the escape point?',
          options: ['The step where the defect is made', 'The last inspection before shipping', 'The customer’s incoming inspection', 'The point closest to the root cause where the defect should have been caught'],
          answer: 'The point closest to the root cause where the defect should have been caught',
          why: 'Fixing detection there stops the next unknown problem going as far.',
        },
      ],
      situation: {
        scene: 'You’re at a client’s 8D closure meeting. The fix for a leaking hose connection, a new crimp height setting, has been in place for one week. The quality manager wants to close the 8D and move on.',
        ask: 'What do you ask before closing?',
        model: 'How many connections have we made since the fix, and how many leaks would we have expected at the old rate? Have we shown that the wrong crimp height brings the leak back? Why did the leak test miss these parts? And do the other crimping machines and the hose variants use the same setting, so we can read across?',
        rubric: [
          'Compares the volume since the fix with the expected number of defects',
          'Asks for on/off evidence and for the escape point',
          'Asks for read-across to other machines or variants',
        ],
      },
      sayIt: 'Explain to a quality manager in 60 seconds why “it hasn’t come back” is not yet proof.',
      terms: [
        { term: 'On/off verification', def: 'Proving a cause by making the defect return and disappear on purpose.' },
        { term: 'Escape point', def: 'The point closest to the root cause where the defect should have been detected.' },
        { term: 'Read-across', def: 'Applying a fix and its checks to similar machines, products and sites.' },
      ],
    },
    {
      id: 'eng.improve.facilitate',
      title: 'Facilitating a root-cause session',
      pre: [
        {
          q: 'In a root-cause session, the most senior engineer names the cause in the first five minutes. What usually happens next?',
          options: ['The team tests it quickly and moves on', 'The others challenge it openly', 'The others stop offering alternatives', 'The session ends early with the right answer'],
          answer: 'The others stop offering alternatives',
          why: 'An early answer from authority anchors the group; quieter people with useful facts stay silent.',
        },
      ],
      teach: [
        'As a non-engineer you own the process, not the answer. Prepare: a problem statement with numbers, the data split by machine and time, and the actual bad parts on the table. Invite the people who touch the problem: the operator, the setter, maintenance, quality and the process engineer. Keep the session to about 60 to 90 minutes (a rule of thumb).',
        'Keep it factual. Split the board into three columns: facts, theories, and questions still open. When someone states a cause, ask “how do we know?” and “what would we see if that were true?” Facts need data or a part you can hold. Everything else is a theory until tested.',
        'The expert who “already knows” is often right, and you need him on board. Write his idea up as the first theory, thank him, then ask: “What would rule this out?” and “Does it explain why line 1 is fine?” You don’t fight on technical ground; you hold everyone to the same standard of evidence.',
        'When you don’t understand, say so and use it: “Explain it as you would to a new operator,” or “Draw it for me.” Then repeat it back. End every session with each theory linked to a test, an owner and a date. A session that ends with only opinions has not done its job.',
      ],
      example: {
        kind: 'faded',
        text: 'You facilitate a session on repeated bearing failures on a cooling-water pump, six failures in four months. Present: maintenance lead, two technicians, process engineer, purchasing and an operator. Ten minutes in, the maintenance lead says: “It’s the cheap bearings purchasing switched to. I’ve seen this a hundred times.” Purchasing goes red, the technicians fall silent.',
        ask: 'What would you do next?',
        reveal: 'Write “bearing brand changed” on the theories column and thank him: it is a serious candidate. Then turn it into a test: when did the brand change, and do the failure dates follow it? Are the same bearings running on other pumps without problems? Ask the technicians what they saw on the failed bearings: wear pattern, discolouration, lubrication. Ask the operator what changed in how the pump runs. Collect other theories, such as alignment, lubrication interval and running off its design point, and give each a test, an owner and a date, including a failure analysis of the next bearing.',
      },
      said: 'What engineers say: “I know what it is, we don’t need a whole session.” Your reply: “Great, then let’s write down what would prove it.”',
      recall: [
        {
          q: 'What three columns keep a root-cause board factual?',
          options: ['Causes, solutions, owners', 'Machines, people, materials', 'Facts, theories, open questions', 'Good, bad, unknown'],
          answer: 'Facts, theories, open questions',
          why: 'Separating facts from theories stops opinions being treated as evidence.',
        },
        {
          q: 'A senior engineer says he already knows the cause. What is the best response?',
          options: ['Ask him to leave so others can speak', 'Record it as a theory and ask what evidence would confirm or rule it out', 'Accept it and move to actions', 'Challenge his technical reasoning directly'],
          answer: 'Record it as a theory and ask what evidence would confirm or rule it out',
          why: 'You keep the expert engaged and hold his idea to the same standard as the rest.',
        },
        {
          q: 'Why ask “what would we see if that were true?”',
          options: ['To slow the meeting down', 'To show you know the technology', 'To find out who is responsible', 'To turn an opinion into something you can check'],
          answer: 'To turn an opinion into something you can check',
          why: 'A theory with a predicted observation can be tested with data or a part.',
        },
        {
          q: 'What should a root-cause session end with?',
          options: ['Each theory linked to a test, an owner and a date', 'Agreement on the root cause', 'A list of everyone’s opinions', 'A new date for the next session'],
          answer: 'Each theory linked to a test, an owner and a date',
          why: 'The session narrows the theories; the tests prove the cause.',
        },
      ],
      situation: {
        scene: 'You’re at a client’s plant, leading a root-cause session on surface scratches on painted panels. The paint-shop engineer keeps using terms you don’t know and says the cause is “obviously the conveyor hooks”. The operators say nothing.',
        ask: 'What do you do?',
        model: 'I ask the engineer to explain the hook theory as he would to a new operator, and I repeat it back. Then I put it up as the first theory and ask what we would see if it were true: scratches in the same place on every panel, on all colours? I ask the operators directly where they first see the scratches. Before we close, each theory gets a check, an owner and a date.',
        rubric: [
          'Asks the expert to explain in plain words and repeats it back',
          'Turns the expert’s claim into a testable theory',
          'Draws in the quiet operators and ends with tests, owners and dates',
        ],
      },
      sayIt: 'Explain to a new colleague in 60 seconds how you lead a root-cause session when you know less about the technology than anyone in the room.',
      terms: [
        { term: 'Anchoring', def: 'When an early answer, often from a senior person, narrows what the group considers.' },
        { term: 'Theory versus fact', def: 'A fact has data or a part behind it; a theory still needs a test.' },
      ],
    },
  ],
};
