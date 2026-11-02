// eng.flow (EN): Capacity and flow: takt, bottlenecks, OEE, changeover, line balance, capacity.
export default {
  lessons: [
    {
      id: 'eng.flow.takt',
      title: 'Takt, cycle and lead time',
      pre: [
        {
          q: 'A bracket gets 4 minutes of actual processing. How long does it typically spend in the factory from raw steel to shipping?',
          options: ['About 4 minutes', 'About an hour', 'Several days', 'Exactly one shift'],
          answer: 'Several days',
          why: 'Most lead time is waiting in queues and stock between steps; processing is often under 1% of it.',
        },
      ],
      teach: [
        'Takt time is available time divided by customer demand: the pace the customer pulls. Available time is shift time minus planned breaks and meetings, not minus breakdowns, because those are losses the line has to absorb. A shift of 7.5 net hours is 27,000 seconds; with a demand of 450 units, takt is 60 seconds. Takt is set by demand, not by the machine. When demand changes, takt changes.',
        'Cycle time is how often a part actually comes off a station or the line: the time between two good parts. If cycle time is above takt, you cannot keep up and need overtime, an extra shift or more capacity. Engineers usually plan cycle time at 85 to 90% of takt, to leave room for stops and scrap.',
        'Lead time is how long one part spends from raw material to shipping, waiting included. A part with 4 minutes of processing often has a lead time of 3 to 10 days, because it sits in buffers, stock and queues. Long lead time is almost always a waiting problem, not a machine-speed problem.',
        '“Cycle time” means different things to different people: the machine cycle (spindle running), the operator cycle, or the interval between parts leaving the line. Always ask which one. A robot cycle of 38 seconds can still give a part every 45 seconds once loading and rejects are counted.',
      ],
      example: {
        kind: 'worked',
        text: 'A packaging line must ship 2,400 boxes a week, 5 days, one 8-hour shift. Breaks are 2 × 15 minutes plus a 10-minute start-up meeting. Available time per day: 480 − 40 = 440 minutes = 26,400 seconds. Daily demand: 2,400 / 5 = 480 boxes. Takt = 26,400 / 480 = 55 seconds. The line runs a box every 52 seconds: it keeps up, but with only 3 seconds (5%) margin, so a few jams per shift put it behind. Lead time is 3 days, because finished boxes wait in the warehouse.',
      },
      said: 'What engineers say: “We’re running 52 seconds against a 55-second takt, so one bad hour and we’re behind for the day.”',
      recall: [
        {
          q: 'Demand is 600 units per shift. Net available time is 450 minutes. What is takt, in seconds?',
          number: 45,
          tolerance: 1,
          unit: 's',
          why: '450 × 60 = 27,000 seconds; 27,000 / 600 = 45 seconds.',
        },
        {
          q: 'Customer demand drops by 20%. What happens to takt?',
          options: ['Takt gets shorter', 'Takt stays the same, it’s set by the machine', 'Takt gets longer', 'Cycle time gets longer automatically'],
          answer: 'Takt gets longer',
          why: 'Same available time divided by fewer units: the customer pulls more slowly.',
        },
        {
          q: 'Which of these is usually by far the largest for one part?',
          options: ['Cycle time', 'Lead time', 'Takt time', 'Machine time'],
          answer: 'Lead time',
          why: 'Lead time includes all the waiting between steps, which dwarfs processing.',
        },
        {
          q: 'A station has a cycle time of 70 seconds against a takt of 60 seconds. What does that mean?',
          options: ['It can’t meet demand without extra time or capacity', 'It is fast enough with 10 seconds margin', 'Takt should be raised to 70 seconds', 'The station is broken'],
          answer: 'It can’t meet demand without extra time or capacity',
          why: 'Cycle time above takt means the station falls further behind every part.',
        },
      ],
      situation: {
        scene: 'You’re on a plant walk at an automotive supplier. The production manager says “our takt is 40 seconds”. The screen at the robot cell shows a cycle time of 38 seconds.',
        ask: 'What do you ask to know whether this cell really keeps up?',
        model: 'Is the 40 seconds based on current demand and net time after breaks? And is the 38 seconds the robot cycle, or the real time between good parts leaving the cell, including loading and rejects? If it’s the robot only, the real interval may already be over takt, and with 5% margin there is little room anyway.',
        rubric: [
          'Asks how takt was calculated (demand and net available time)',
          'Separates machine cycle from the real interval between good parts',
          'Notices the margin of 2 seconds (5%) is thin',
        ],
      },
      sayIt: 'Explain the difference between takt, cycle time and lead time to a new planner in 60 seconds.',
      terms: [
        { term: 'Takt time', def: 'Net available time divided by customer demand: the pace you need.' },
        { term: 'Cycle time', def: 'The real time between two good parts off a station or line.' },
        { term: 'Lead time', def: 'Total time one part spends in the process, waiting included.' },
      ],
    },
    {
      id: 'eng.flow.bottleneck',
      figure: 'eng.flow.line',
      title: 'The bottleneck sets output',
      pre: [
        {
          q: 'A line has four stations of 40, 55, 45 and 50 seconds. You speed up the first station from 40 to 30 seconds. What happens to output?',
          options: ['It rises by about 25%', 'No change', 'It rises by 10 seconds per part', 'It falls'],
          answer: 'No change',
          why: 'The 55-second station still limits the line to one part every 55 seconds.',
        },
      ],
      teach: [
        'A line produces no faster than its slowest step: the bottleneck, or constraint. Stations of 40, 55 and 45 seconds give one part every 55 seconds, about 65 per hour. Making the 40-second station faster gains nothing, it just waits more.',
        'How to spot it: work in progress (WIP) piles up in front of it, the station after it waits for parts (starved), and the bottleneck itself almost never stops. Be careful: a big pile can also be left over from a breakdown. The real tell is which machine is running all the time.',
        'An hour lost at the bottleneck is an hour lost for the whole plant. An hour saved anywhere else is a mirage. So protect the bottleneck: a buffer in front of it, staggered breaks so it runs through lunch, a quality check before it so it never processes scrap, and maintenance planned around it.',
        'Little’s law links stock and time: lead time = WIP / throughput. With 300 parts in the system and an output of 60 per hour, lead time is 5 hours. Cut WIP to 120 and lead time drops to 2 hours, without any machine going faster.',
        'Bottlenecks move. Fix one and the next-slowest takes over. A change in product mix can move it too, because some products take much longer on one machine than on another.',
      ],
      example: {
        kind: 'worked',
        text: 'A machining cell: saw 30 seconds, CNC 90 seconds, deburring 45 seconds, washing 40 seconds. Output = 3,600 / 90 = 40 parts per hour, set by the CNC. There are 480 parts in the cell, 360 of them waiting before the CNC. Little’s law: 480 / 40 = 12 hours lead time. Buying a faster deburring station: zero gain. Adding a second CNC: the CNC step now delivers a part every 45 seconds, deburring becomes the bottleneck at 45 seconds, and output goes to 80 per hour, exactly double.',
      },
      said: 'What engineers say: “Forget the washer, the CNC is the constraint. Every minute it stands still is gone for good.”',
      recall: [
        {
          q: 'Four stations take 35, 48, 60 and 42 seconds. How many parts per hour does the line make?',
          number: 60,
          tolerance: 1,
          unit: 'parts/hour',
          why: 'The 60-second station is the bottleneck: 3,600 / 60 = 60 parts per hour.',
        },
        {
          q: 'There are 600 parts of WIP in a process with a throughput of 50 parts per hour. What is the lead time, in hours?',
          number: 12,
          tolerance: 0.5,
          unit: 'hours',
          why: 'Little’s law: lead time = WIP / throughput = 600 / 50 = 12 hours.',
        },
        {
          q: 'Which sign points most reliably to the bottleneck?',
          options: ['The most expensive machine', 'The station with the most operators', 'The station with the most breakdown reports', 'The station that never waits for parts and has a queue in front of it'],
          answer: 'The station that never waits for parts and has a queue in front of it',
          why: 'The constraint runs all the time; stations around it wait or block.',
        },
        {
          q: 'You add a second CNC next to the bottleneck CNC. Will output double?',
          options: ['Yes, always', 'Only until the next-slowest station becomes the bottleneck', 'No, output stays the same', 'Only if WIP goes up'],
          answer: 'Only until the next-slowest station becomes the bottleneck',
          why: 'The bottleneck moves; output rises to the pace of the new slowest step.',
        },
      ],
      situation: {
        scene: 'You’re at a food client. The team wants to buy a faster labelling machine for €80,000 “because that’s where it always goes wrong”.',
        ask: 'What do you ask before they sign the order?',
        model: 'Which station runs nonstop and has a queue in front of it? If the labeller waits for product half the time, a faster one won’t add a single unit. Can we pull a week of output and stop data per station, and calculate how many extra units per hour this €80,000 actually buys?',
        rubric: [
          'Asks where WIP piles up and which station is never starved',
          'Links the investment to extra throughput, not to local speed',
          'Asks for data: stop logs and cycle times per station',
        ],
      },
      sayIt: 'Explain to a plant manager in 60 seconds why speeding up a non-bottleneck doesn’t raise output.',
      terms: [
        { term: 'Bottleneck', def: 'The slowest step, which sets the output of the whole line.' },
        { term: 'WIP', def: 'Work in progress: parts started but not finished.' },
        { term: 'Little’s law', def: 'Lead time = WIP / throughput.' },
        { term: 'Starved / blocked', def: 'A station waiting for input / unable to pass output on.' },
      ],
    },
    {
      id: 'eng.flow.oee',
      title: 'OEE and the six big losses',
      pre: [
        {
          q: 'A machine scores 90% on availability, 90% on performance and 90% on quality. What is its OEE?',
          options: ['90%', '81%', '270%', '73%'],
          answer: '73%',
          why: 'You multiply: 0.9 × 0.9 × 0.9 = 0.73.',
        },
      ],
      teach: [
        'OEE = availability × performance × quality. Availability = run time / planned production time (lost to breakdowns and changeovers). Performance = ideal cycle time × parts made / run time (lost to slow running and small stops). Quality = good parts / parts made (lost to scrap and rework). Multiply, never average. A quick check: OEE = good parts × ideal cycle time / planned time.',
        'The six big losses. Availability: breakdowns, and setups and adjustments. Performance: small stops (jams under about 5 minutes) and reduced speed. Quality: start-up rejects and production rejects. Small stops are the hidden one: nobody fills in a form for a 40-second jam, but 30 of them per shift is 20 minutes.',
        'What is good? 85% is the famous “world class” figure (90% × 95% × 99.9%). Honest measurement in discrete manufacturing typically gives 40 to 60%. A plant reporting 90% is usually shrinking the denominator: leaving changeovers out of planned time, or using a slow “ideal” cycle time.',
        '100% is a lie: no stop, every part at ideal speed, zero scrap. It never happens. And OEE is per machine: raising it on a non-bottleneck only makes more WIP. The questions that matter: OEE of which machine, against which ideal cycle time, and what is left out of planned time?',
      ],
      example: {
        kind: 'worked',
        text: 'Shift of 480 minutes with a 30-minute break: planned time 450 minutes. Breakdowns 30 minutes, one changeover 45 minutes: run time 375 minutes. Availability = 375 / 450 = 83.3%. Ideal cycle 30 seconds, 600 parts made: 300 ideal minutes. Performance = 300 / 375 = 80%. Of 600 parts, 570 are good: quality = 95%. OEE = 0.833 × 0.80 × 0.95 = 63.3%. Check: 570 × 0.5 minutes / 450 = 63.3%. The biggest lever is performance: 75 minutes lost to small stops and slow running.',
      },
      said: 'What engineers say: “Availability looks fine, it’s the small stops killing our performance rate. Nobody logs a 30-second jam.”',
      recall: [
        {
          q: 'Availability 80%, performance 90%, quality 95%. What is the OEE, in percent?',
          number: 68.4,
          tolerance: 0.5,
          unit: '%',
          why: '0.80 × 0.90 × 0.95 = 0.684.',
        },
        {
          q: 'Planned time 400 minutes, ideal cycle time 30 seconds, 600 good parts. What is the OEE, in percent?',
          number: 75,
          tolerance: 1,
          unit: '%',
          why: '600 × 0.5 minutes = 300 minutes of good output; 300 / 400 = 75%.',
        },
        {
          q: 'A client reports an OEE of 92% on a packaging line. What is the best first question?',
          options: ['Which line is your best one?', 'Can we get it to 100%?', 'What is left out of planned time, and which ideal cycle time do you use?', 'Why isn’t it higher?'],
          answer: 'What is left out of planned time, and which ideal cycle time do you use?',
          why: 'Very high OEE usually comes from a shrunk denominator or a slow ideal cycle.',
        },
        {
          q: 'Which losses fall under performance?',
          options: ['Small stops and reduced speed', 'Changeovers', 'Start-up rejects', 'A breakdown of 2 hours'],
          answer: 'Small stops and reduced speed',
          why: 'Changeovers and breakdowns are availability; rejects are quality.',
        },
      ],
      situation: {
        scene: 'You’re in the daily meeting at a food plant. OEE on line 3 dropped from 68% to 61% this week. The shift lead says: “The machine is just old.”',
        ask: 'How do you move the conversation from opinion to cause?',
        model: 'Which of the three dropped: availability, performance or quality? If it’s performance, we look at small stops and speed; if it’s availability, which breakdowns or changeovers. Can we put this week’s stop log next to last week’s, by reason?',
        rubric: [
          'Splits OEE into availability, performance and quality',
          'Asks for loss data by reason, this week versus last',
          'Does not accept a vague cause without data',
        ],
      },
      sayIt: 'Explain to a new team lead in 60 seconds what OEE is and why 100% is not the target.',
      terms: [
        { term: 'OEE', def: 'Overall equipment effectiveness: availability × performance × quality.' },
        { term: 'Ideal cycle time', def: 'The fastest proven time per part; the yardstick for performance.' },
        { term: 'Small stops', def: 'Short jams and stoppages, usually under 5 minutes and rarely logged.' },
        { term: 'Six big losses', def: 'Breakdowns, setups, small stops, reduced speed, start-up rejects, production rejects.' },
      ],
    },
    {
      id: 'eng.flow.changeover',
      title: 'Changeover and SMED',
      pre: [
        {
          q: 'A changeover takes 60 minutes. How much of that can typically be cut just by doing preparation while the machine still runs, with no investment?',
          options: ['Often 30 to 50%', 'Almost nothing', 'About 5%', 'All of it'],
          answer: 'Often 30 to 50%',
          why: 'Fetching tools, moulds and paperwork during the stop is common and easy to move out.',
        },
      ],
      teach: [
        'Changeover time runs from the last good part of product A to the first good part of product B at full speed. So it includes the trial runs and adjustments at the end, and that is where much of the hidden time sits.',
        'Internal work can only be done with the machine stopped: swapping the die. External work can be done while it runs: fetching the next die, preheating it, preparing tools and paperwork. SMED steps: film a changeover and list every step; mark each one internal or external; move external work out of the stop; convert internal to external (preheat moulds, preset tools offline); then streamline with quick clamps instead of bolts.',
        'Adjustment is the killer: trial and tweak is often half of a changeover. The engineering fix is fixed locators, pins, standard die heights and setting sheets, so the setting is right first time. Adjustment is a sign the setting isn’t defined.',
        'The batch size trade-off: average stock is roughly half a batch. With long changeovers, planners run big batches to lose less time, and stock and lead time grow. Halve the changeover and you can halve the batch at the same lost time, halving stock. Or keep the batch and gain capacity, which only pays off at the bottleneck.',
      ],
      example: {
        kind: 'worked',
        text: 'Injection moulding, mould change 90 minutes. The video shows: 25 minutes fetching mould, crane and tools; 15 minutes connecting cooling water; 20 minutes heating the mould; 30 minutes of trial shots. Fetching everything beforehand removes 25 minutes. Preheating the mould on a heating station removes 20. Quick couplings take water from 15 to 5 minutes. New changeover: 5 + 30 = 35 minutes. With 4 changeovers a day that frees 220 minutes, or allows 8 smaller batches a day for 280 minutes instead of the old 360.',
      },
      said: 'What engineers say: “Half our changeover is waiting for the forklift with the next mould. That’s external work done internally.”',
      recall: [
        {
          q: 'Which of these is external work?',
          options: ['Unbolting the old die', 'Preheating the next mould on a separate station', 'Trial shots until parts are in spec', 'Swapping the clamping plates'],
          answer: 'Preheating the next mould on a separate station',
          why: 'It can be done while the machine is still producing the previous product.',
        },
        {
          q: 'A machine has 4 changeovers a day of 50 minutes. SMED brings them to 20 minutes. How many minutes per day are freed?',
          number: 120,
          tolerance: 1,
          unit: 'minutes',
          why: '4 × (50 − 20) = 120 minutes.',
        },
        {
          q: 'Changeover takes 30 minutes. Net time is 15 hours a day, and at most 10% may go to changeovers. How many changeovers fit per day?',
          number: 3,
          tolerance: 0.1,
          unit: '',
          why: '10% of 900 minutes = 90 minutes; 90 / 30 = 3 changeovers.',
        },
        {
          q: 'Why does a shorter changeover cut inventory?',
          options: ['You need fewer operators', 'The machine runs faster', 'Scrap disappears', 'You can run smaller batches at the same lost time, so less stock waits'],
          answer: 'You can run smaller batches at the same lost time, so less stock waits',
          why: 'Average stock is about half a batch; smaller batches mean less stock and shorter lead time.',
        },
      ],
      situation: {
        scene: 'You’re at a packaging plant. Planning wants bigger batches because changeovers take 2 hours. Sales complains about long delivery times, and the warehouse is full.',
        ask: 'What do you propose before the batch size goes up?',
        model: 'Before we lock in bigger batches, can we film one changeover and split it into internal and external work? If we get 2 hours down to 1, we can run twice as many smaller batches for the same lost time: less stock and shorter delivery times. And is this line the bottleneck? If not, extra changeovers there cost almost nothing.',
        rubric: [
          'Proposes measuring a real changeover and splitting internal from external',
          'Links changeover time to batch size, stock and lead time',
          'Checks whether the line is the bottleneck',
        ],
      },
      sayIt: 'Explain SMED and the batch size trade-off to a planner in 60 seconds.',
      terms: [
        { term: 'Changeover', def: 'Last good part of A to first good part of B at full speed.' },
        { term: 'Internal / external', def: 'Work that needs the machine stopped / work that can be done while it runs.' },
        { term: 'SMED', def: 'Single-minute exchange of die: a method to cut changeover time.' },
      ],
    },
    {
      id: 'eng.flow.balance',
      title: 'Line balancing',
      pre: [
        {
          q: 'An assembly line has 160 seconds of total work per product and a takt of 60 seconds. What is the minimum number of stations?',
          options: ['2', '3', '4', '5'],
          answer: '3',
          why: '160 / 60 = 2.7, rounded up to 3. Most people guess 4 from habit.',
        },
      ],
      teach: [
        'Line balancing divides the total work content over stations so each station’s cycle time sits just under takt. Minimum stations = total work content / takt, rounded up. 300 seconds of work at a 60-second takt needs at least 5 stations.',
        'A line runs at the pace of its slowest station. Stations of 50, 30, 45 and 40 seconds give a line cycle of 50 seconds. The others wait every cycle: idle time = 4 × 50 − 165 = 35 seconds. Balance loss = idle time / (stations × slowest cycle) = 35 / 200 = 17.5%.',
        'One slow station hurts everyone. If it is over takt, the whole line misses demand, upstream builds WIP and downstream starves. Variation matters too: a station averaging 55 seconds against a 60-second takt but swinging between 45 and 75 seconds will regularly hold up the line. The average is not enough.',
        'Fixes: move work elements from the slow station to stations with slack, split the task, add a second operator, or automate. Precedence limits what can move: you can’t fit the screw before the bracket. The standard picture is a Yamazumi chart: a stacked bar per station with the takt line drawn across.',
      ],
      example: {
        kind: 'worked',
        text: 'An e-bike motor assembly line with a takt of 72 seconds. Stations: 65, 80, 50 and 70 seconds, total 265. Station 2 is over takt, so the line cycle is 80 seconds: 45 motors an hour instead of the 50 needed. Minimum stations: 265 / 72 = 3.7, so 4 is enough. Move 12 seconds of cable routing from station 2 to station 3: 65, 68, 62, 70. Slowest is now 70 seconds, under takt. Balance loss = (4 × 70 − 265) / 280 = 5.4%.',
      },
      said: 'What engineers say: “Station two is over takt, look at the Yamazumi. Can we shift the cable routing to three?”',
      recall: [
        {
          q: 'Total work content is 420 seconds and takt is 50 seconds. What is the minimum number of stations?',
          number: 9,
          tolerance: 0.1,
          unit: 'stations',
          why: '420 / 50 = 8.4, rounded up to 9.',
        },
        {
          q: 'Four stations take 40, 55, 50 and 35 seconds. What is the balance loss, in percent?',
          number: 18.2,
          tolerance: 1,
          unit: '%',
          why: 'Idle = 4 × 55 − 180 = 40; 40 / 220 = 18.2%.',
        },
        {
          q: 'A station averages 55 seconds against a 60-second takt, but swings between 45 and 75 seconds. What follows?',
          options: ['Fine, the average is under takt', 'Raise takt to 75 seconds', 'The line will regularly miss takt; reduce the variation or add a buffer', 'It only matters if it is the first station'],
          answer: 'The line will regularly miss takt; reduce the variation or add a buffer',
          why: 'Every slow cycle holds up the stations after it; averages hide that.',
        },
        {
          q: 'Why can’t you simply move any task to any station?',
          options: ['Precedence: some tasks must happen before others', 'Union rules forbid it', 'Takt prevents it', 'Balance loss would rise'],
          answer: 'Precedence: some tasks must happen before others',
          why: 'Assembly order limits which work elements can shift.',
        },
      ],
      situation: {
        scene: 'You’re at a heat pump assembly line that misses its daily target. The supervisor wants a seventh operator.',
        ask: 'What do you ask before agreeing to an extra person?',
        model: 'Can we see the cycle time per station against takt in a Yamazumi? If one station is over takt and others have slack, moving work may fix it without an extra person. If total work content divided by takt already needs 7 stations, then yes, we need the operator.',
        rubric: [
          'Asks for cycle time per station against takt',
          'Checks minimum stations: work content divided by takt',
          'Considers rebalancing before adding people',
        ],
      },
      sayIt: 'Explain to a supervisor in 60 seconds why one slow station limits the whole line.',
      terms: [
        { term: 'Line balancing', def: 'Spreading work content over stations so each is just under takt.' },
        { term: 'Work content', def: 'Total time of all tasks needed for one product.' },
        { term: 'Balance loss', def: 'Idle time as a share of stations × slowest cycle.' },
        { term: 'Yamazumi', def: 'Stacked bar chart of work per station with the takt line.' },
      ],
    },
    {
      id: 'eng.flow.capacity',
      title: 'Capacity and utilisation',
      pre: [
        {
          q: 'A machine’s utilisation goes from 80% to 95%. Roughly what happens to the waiting time in its queue?',
          options: ['It rises by about 15%', 'It roughly doubles', 'It gets about 5 times longer', 'No change'],
          answer: 'It gets about 5 times longer',
          why: 'Queue time grows with u / (1 − u): 4 at 80%, 19 at 95%.',
        },
      ],
      teach: [
        'Capacity = available time / cycle time, corrected for losses. One shift of 7.5 net hours at a 60-second cycle is 450 parts on paper; at 75% OEE it is about 340. Plan on the realistic number, not the nameplate. Going from two to three shifts adds 50% hours, but costs night premiums and leaves less time for maintenance.',
        'Utilisation = busy time / available time. Managers love 100%. But arrivals and process times vary, and queue time grows roughly with u / (1 − u). At 50% utilisation that factor is 1, at 80% it is 4, at 90% it is 9, at 95% it is 19. Queues explode in the last 10 to 15%.',
        'So plan the bottleneck at around 80 to 85% load after OEE, leaving room for breakdowns and rush orders. Non-bottlenecks need even more spare capacity, so they can catch up after a disruption and keep the bottleneck fed. A plant planned to 100% has long lead times and permanent firefighting.',
        'The question that gets you taken seriously: what is the planned load on the bottleneck, in hours, after OEE? Not against nameplate hours. Reducing variation (fewer breakdowns, steadier arrivals) is what lets you run a higher load safely.',
      ],
      example: {
        kind: 'worked',
        text: 'A CNC bottleneck must make 1,200 parts a week at 4 minutes each: 80 hours of demand. Two shifts × 5 days × 7.5 net hours = 75 hours. At 70% OEE that is 52.5 effective hours: load = 80 / 52.5 = 152%. Not feasible. Three shifts give 112.5 hours; at 70% OEE that is 78.75 hours, still 102%. Three shifts plus OEE raised to 80% gives 90 hours: load 89%. Workable, but only just, so lead times will still be long.',
      },
      said: 'What engineers say: “The planner shows 98% load on the five-axis. That’s not efficiency, that’s a queue waiting to happen.”',
      recall: [
        {
          q: 'Two shifts × 5 days × 7.5 net hours, OEE 80%. Demand is 54 hours. What is the load, in percent?',
          number: 90,
          tolerance: 1,
          unit: '%',
          why: '75 hours × 0.8 = 60 effective hours; 54 / 60 = 90%.',
        },
        {
          q: 'Utilisation goes from 80% to 90%. What happens to waiting time?',
          options: ['It rises by about 10%', 'It stays about the same', 'It gets shorter, because the machine is busier', 'It roughly doubles or more'],
          answer: 'It roughly doubles or more',
          why: 'u / (1 − u) goes from 4 to 9: more than double.',
        },
        {
          q: 'A shift has 7.5 net hours, the cycle time is 90 seconds and OEE is 80%. How many parts per shift can you plan on?',
          number: 240,
          tolerance: 2,
          unit: 'parts',
          why: '27,000 / 90 = 300 parts on paper; × 0.8 = 240.',
        },
        {
          q: 'Why should non-bottlenecks have spare capacity?',
          options: ['So they can catch up after a disruption and keep feeding the bottleneck', 'It’s cheaper to run them slowly', 'To keep operators busy', 'Because OEE requires it'],
          answer: 'So they can catch up after a disruption and keep feeding the bottleneck',
          why: 'Without spare capacity a non-bottleneck can never recover lost time, and starves the constraint.',
        },
      ],
      situation: {
        scene: 'You’re in a sales and operations meeting at a sheet metal client. Sales wants to accept a large order. The planner says: “We have capacity, the laser is at 85%, so 15% is free.”',
        ask: 'What do you ask before the order is accepted?',
        model: 'Is that 85% against nameplate hours or after OEE? If it’s nameplate, the real load may already be over 100%. And what is the queue on the laser today? Near 100% lead times explode, so let’s work out what delivery time we can honestly promise, or what an extra shift would add.',
        rubric: [
          'Checks the basis: nameplate hours versus effective hours after OEE',
          'Points out that queues and lead times explode near 100%',
          'Turns it into options: delivery promise, extra shift or OEE gain',
        ],
      },
      sayIt: 'Explain to a sales manager in 60 seconds why 100% utilisation is not the goal.',
      terms: [
        { term: 'Capacity', def: 'What a resource can make in a period, after losses.' },
        { term: 'Utilisation', def: 'Busy time divided by available time.' },
        { term: 'Load', def: 'Demand in hours divided by effective capacity in hours.' },
        { term: 'Shift model', def: 'How hours are organised: 1, 2 or 3 shifts, 5 or 7 days.' },
      ],
    },
  ],
};
