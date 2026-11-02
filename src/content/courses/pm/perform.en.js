// pm.perform (EN): Performance management: indicators that steer, from strategy to team numbers, believable targets, the performance conversation, gaming, and a review rhythm that lasts.
export default {
  lessons: [
    {
      id: 'pm.perform.kpis',
      title: 'A few indicators that steer',
      pre: [
        {
          q: 'A plant director has 46 KPIs on one dashboard and reviews it every month. What is the most likely effect?',
          options: ['Better control, because nothing is missed', 'Nobody knows which numbers to act on, so few of them lead to action', 'Faster decisions, because all the data is in one place', 'Higher results, because every department feels watched'],
          answer: 'Nobody knows which numbers to act on, so few of them lead to action',
          why: 'People can steer on a handful of numbers. With 46, attention spreads so thin that most figures are only read, never acted on.',
        },
      ],
      teach: [
        'A KPI is a number someone acts on. If nobody would do anything different when it moves, it is a report figure, not a KPI. A team can steer on three to seven numbers; a wall of forty gets read by nobody. Choose per level: the board needs a few results, a team needs the few numbers it can move this week.',
        'Lagging indicators measure the result after the fact: on-time delivery last month, customer minutes lost, cost per connection. Leading indicators move before the result and point to what to do: share of jobs with materials ready two days before the start, preventive maintenance done on time, age of the backlog. Lagging tells you whether you won. Leading tells you whether you will.',
        'A good KPI has a written definition (what counts and what doesn’t), one owner, a data source nobody argues about, a frequency that fits how fast it can change, and a known direction: is higher better or lower? Half of all KPI arguments are two people measuring different things under the same name.',
        'Balance. One number on its own gets pushed at the cost of others. Pair them: output with quality, speed with safety, cost with service. Kaplan and Norton made this point with the balanced scorecard in 1992: financial results alone tell you how you did, not where you are heading, so they added customer, process and learning measures.',
      ],
      example: {
        kind: 'faded',
        text: 'A parts manufacturer gets customer complaints about late deliveries. The plant manager wants one KPI on the board: on-time delivery, in % of order lines, reported monthly. Planning and the production teams will see it at the monthly meeting.',
        ask: 'What would you add or change before this goes on the board?',
        reveal: 'Keep on-time delivery as the lagging result, but define it: against the date confirmed to the customer, per order line, zero days late allowed. Give it one owner, the planning lead. Then add one or two leading numbers the teams can move every week, such as schedule adherence at the bottleneck per day and the share of orders released with all materials in stock. Pair it with first-pass yield, so on-time delivery isn’t bought by rushing parts out.',
      },
      said: 'What you hear in projects: “That’s a lagging number. What can the team move this week that tells us where it’s heading?”',
      recall: [
        {
          q: 'Which of these is a leading indicator for on-time delivery?',
          options: ['On-time delivery in % last month', 'Number of customer complaints last quarter', 'Share of orders released with all materials in stock', 'Revenue per month'],
          answer: 'Share of orders released with all materials in stock',
          why: 'Missing materials cause late orders later on, so this number moves before the delivery result does. The others are measured after the fact.',
        },
        {
          q: 'What turns a figure into a KPI?',
          options: ['It is shown on the dashboard', 'Someone acts on it when it moves', 'It is measured every day', 'It comes straight from the ERP system'],
          answer: 'Someone acts on it when it moves',
          why: 'A KPI exists to steer. A figure that triggers no action is information, however often it is measured.',
        },
        {
          q: 'Why do you pair an output indicator with a quality indicator?',
          options: ['To have more KPIs on the board', 'So output isn’t raised at the cost of quality', 'Because auditors require two indicators per team', 'To make the dashboard look balanced'],
          answer: 'So output isn’t raised at the cost of quality',
          why: 'A single number gets pushed at the expense of what isn’t measured. The pair shows the side effect.',
        },
        {
          q: 'A grid team planned 240 jobs for one week, all fixed on the Monday of that week. By Friday it had completed 180 of those 240 jobs. What was its schedule completion for that week (the share of planned jobs completed in that week), in %?',
          number: 75,
          tolerance: 0.5,
          unit: '%',
          why: '180 / 240 = 0.75, so 75% of the jobs planned for that week were completed in that week.',
        },
      ],
      situation: {
        scene: 'The regional director of a grid operator asks you to build “one dashboard with all our KPIs”. You count 32 indicators across the monthly reports. His team leads say the monthly meeting is three hours of reading out numbers.',
        ask: 'What do you propose to him?',
        model: 'I’d keep the 32 in the monthly report, since some are required, but propose a separate weekly team board with five numbers: two results, like customer minutes lost, and three leading numbers the teams can move, like jobs started on the planned day. Each with a written definition and one owner. Let’s test it in one team for six weeks and see if meetings get shorter and actions clearer.',
        rubric: [
          'Separates numbers to report from numbers to steer on',
          'Proposes a small set with leading and lagging indicators, defined and owned',
          'Suggests a short test in one team before rolling out',
        ],
        pushback: {
          lines: [
            'All 32 are in our agreements with the board and the regulator. I can’t just drop numbers.',
            'And my team leads like to see everything. Why would less information be better?',
          ],
          model: 'You’re right, nothing gets dropped: the reported numbers stay in the monthly report. What I’m proposing is a separate weekly board with five numbers the team can act on, so the meeting is about actions, not reading. The full report stays one click away. Can we try it in one team for six weeks and compare meeting length and actions closed?',
          rubric: [
            'Acknowledges that the reported numbers must stay',
            'Restates the difference between reporting and steering',
            'Proposes a six-week test in one team with a way to judge it',
          ],
        },
      },
      sayIt: 'Explain to a team lead in 60 seconds the difference between a leading and a lagging indicator, with one example from his work.',
      terms: [
        { term: 'KPI', def: 'Key performance indicator: a number someone acts on when it moves.' },
        { term: 'Lagging indicator', def: 'Measures the result after the fact, like on-time delivery last month.' },
        { term: 'Leading indicator', def: 'Moves before the result and points to what to do, like materials ready before the start.' },
      ],
    },
    {
      id: 'pm.perform.tree',
      title: 'From strategy to a team’s numbers',
      pre: [
        {
          q: 'A grid operator’s board goal is “shorter lead times for new connections”. A field crew asks what that means for them. What is the most useful answer?',
          options: ['Work faster on every job', 'The board goal, repeated in the team meeting', 'The one or two numbers in their own work that drive lead time, such as jobs started on the planned day', 'A link to the annual report'],
          answer: 'The one or two numbers in their own work that drive lead time, such as jobs started on the planned day',
          why: 'A team can only move what is in its own work. A board goal repeated louder doesn’t tell anyone what to do on Monday.',
        },
      ],
      teach: [
        'A KPI tree, also called a driver tree, breaks a goal into the numbers that cause it. At the top sits a result, such as lead time or cost per unit. Each level down answers “what drives this?”, until you reach numbers a team controls. A math tree adds or multiplies exactly; a logic tree only lists the main drivers. Use math where you can.',
        'Example. Weekly good output of a press line = available hours × share of those hours running × parts per running hour × share of good parts. Each branch has a natural owner: planning for the hours, maintenance for the running share, engineering for the rate, quality for the good share. Now each team sees which branch it moves.',
        'Check the tree with data before you trust it. Does the branch actually move the top? A branch that hardly varies won’t explain the gap. Look for the branch with the biggest gap to a realistic level: that is where the effort goes. Stop breaking down when you reach a number a team can act on weekly.',
        'Cascading isn’t copying. A team target should be its own driver, not a slice of the board number. “Cut lead time by 20%” given to every team is a slogan. “Raise jobs started on the planned day from 70% to 85%” is a team number.',
      ],
      example: {
        kind: 'faded',
        text: 'A grid operator wants to shorten the time from a customer’s request to a working connection for small users. The average is 26 weeks. The steps run one after another, and the data shows how long each step takes on average: intake 3 weeks, design and permits 9 weeks, waiting for a crew 10 weeks, execution 1 week, meter placement 3 weeks.',
        ask: 'How would you build the tree, and where would you look first?',
        reveal: 'Because the steps run one after another, lead time is their sum: 3 + 9 + 10 + 1 + 3 = 26 weeks. The big branches are waiting for a crew (10) and design and permits (9); execution (1) has little to win. Break “waiting for a crew” down further: is it crew capacity, or jobs bounced back because they weren’t ready? Give each step one owner and one weekly team number, such as the share of jobs that pass the readiness check.',
      },
      said: 'What you hear in projects: “Which branch of the tree are we actually moving with this?”',
      recall: [
        {
          q: 'Weekly good output of a line = available hours per week × share of those hours running × parts per running hour × share of good parts. The line has 80 available hours per week, runs 75% of them, makes 200 parts per running hour, and 95% of parts are good. How many good parts does it make per week?',
          number: 11400,
          tolerance: 1,
          unit: 'good parts per week',
          why: '80 × 0.75 = 60 running hours; 60 × 200 = 12,000 parts; 12,000 × 0.95 = 11,400 good parts per week.',
        },
        {
          q: 'A connection’s lead time is the sum of five steps that run one after another: intake 3, design and permits 9, waiting for a crew 10, execution 1 and meter placement 3 weeks. If waiting for a crew is cut in half and nothing else changes, what is the new lead time, in weeks?',
          number: 21,
          tolerance: 0.1,
          unit: 'weeks',
          why: 'Waiting drops from 10 to 5 weeks, so 26 − 5 = 21 weeks.',
        },
        {
          q: 'When do you stop breaking a KPI tree further down?',
          options: ['After exactly three levels', 'When you reach a number a team can act on weekly', 'When the tree fits on one slide', 'When every department has a branch'],
          answer: 'When you reach a number a team can act on weekly',
          why: 'The point of the tree is to connect the goal to something a team can move. Going deeper adds detail nobody steers on.',
        },
        {
          q: 'Why is “cut lead time by 20%” a weak target for a single field crew?',
          options: ['20% is too low', 'It is a slice of the board number, not a driver the crew controls', 'Lead time can’t be measured', 'Crews should have no targets'],
          answer: 'It is a slice of the board number, not a driver the crew controls',
          why: 'A crew influences part of the lead time. Its target should be its own driver, such as jobs started on the planned day.',
        },
      ],
      situation: {
        scene: 'At a parts manufacturer the strategy slide says “profitable growth”. In your first week, a production team leader tells you: “I have no idea what we contribute to that. We just make parts.”',
        ask: 'How do you help him see his team’s numbers?',
        model: 'I’d draw a simple tree with him on a whiteboard. Profit depends on, among other things, cost per good part. That depends on output per hour and scrap. On his cell, scrap and unplanned stops are what his team moves. So his team’s numbers could be scrap in % per week and minutes of unplanned stop per shift. Then I’d check with last month’s data which of the two has the bigger gap.',
        rubric: [
          'Builds the link from the strategy to his team step by step',
          'Ends with one or two numbers his team can move',
          'Checks with data which branch matters most',
        ],
        pushback: {
          lines: [
            'Nice drawing, but cost per part is set by purchasing and overhead. My scrap is peanuts in that picture.',
            'And if I put scrap on the board, management will just use it to blame my team.',
          ],
          model: 'Fair: purchasing and overhead are big branches, and they’re not yours. Scrap may be small in the total, but it’s the branch you control. Let’s check with last month’s data how much scrap actually cost. If it’s too small to matter, we pick unplanned stops instead. And the board is for your team’s own review first; we agree that with your manager before anything goes up.',
          rubric: [
            'Acknowledges that other branches are bigger and not his',
            'Restates why his team should steer on what it controls',
            'Proposes checking the cost with data and agreeing how the board is used',
          ],
        },
      },
      sayIt: 'Explain in 60 seconds how a KPI tree links a company goal to the numbers of one team.',
      terms: [
        { term: 'KPI tree', def: 'A breakdown of a goal into the numbers that drive it, down to numbers a team controls.' },
        { term: 'Driver', def: 'A number that causes movement in the number above it in the tree.' },
        { term: 'Cascading', def: 'Translating a goal into goals for the levels below; done well, each level gets its own driver.' },
      ],
    },
    {
      id: 'pm.perform.targets',
      title: 'Targets people believe',
      pre: [
        {
          q: 'According to goal-setting research, which kind of target usually leads to the best performance?',
          options: ['“Do your best”', 'A specific, challenging target that people accept', 'An easy target, so everyone succeeds', 'A target set as high as possible, to stretch people'],
          answer: 'A specific, challenging target that people accept',
          why: 'Locke and Latham found that specific, difficult goals beat vague ones, as long as people accept them and get feedback.',
        },
      ],
      teach: [
        'Decades of research by Locke and Latham show that specific, difficult goals beat “do your best”, as long as people accept them, have the skills and get feedback on their progress. Make it too hard and people give up or start gaming the number. A target nobody believes is not a target, it’s a wish.',
        'Base a target on data, not on last year plus ten percent. Look at the spread: which weeks were best, and what made them work? A target close to the best weeks you have actually achieved is believable. A target beyond anything you’ve ever seen needs a changed method behind it. Say what changes.',
        'Use ranges, not single points. Results vary from week to week. “Between 83 and 87%, aiming for 85” lets a team tell a normal week from a real change. A single point turns every week below it into a failure, even when it’s just noise. Separate the target (where we want to be) from the trigger (when we take action).',
        'Involve the people who have to hit it. Ask: what is realistic in three months, and what would have to change to get more? People defend targets they helped set. You still own the ambition: if their proposal is below their own best weeks, ask why.',
      ],
      example: {
        kind: 'faded',
        text: 'A parts manufacturer. Scrap on one machining cell, in % of parts made, over the last eight weeks: 4.1, 3.6, 5.2, 3.9, 4.4, 3.3, 4.8, 3.7. The average is about 4.1%. Nothing in the process has changed yet. Management wants a target of 1% from next month.',
        ask: 'What target would you propose, and how?',
        reveal: 'A target of 1% is far below any week ever seen, and nothing in the method has changed, so nobody will believe it. Propose a first target close to the best weeks (3.3 and 3.6): a range of 3.0 to 4.0%, aiming for 3.5, reviewed after eight weeks. A week above 5% is the trigger to look into it. Meanwhile the root-cause work on the biggest defect is what could make 1% realistic later. Say that out loud, so the ambition isn’t lost.',
      },
      said: 'What you hear in projects: “Your best weeks were at 86. What would we need to change to make that a normal week?”',
      recall: [
        {
          q: 'According to Locke and Latham, a difficult target improves performance only when three things are in place. Which three?',
          options: ['A bonus, a deadline and a dashboard', 'Acceptance, the skills to do it and feedback on progress', 'Approval from HR, the works council and the board', 'A range, a trigger and an owner'],
          answer: 'Acceptance, the skills to do it and feedback on progress',
          why: 'Without acceptance people don’t try, without skills they can’t, and without feedback they don’t know where they stand.',
        },
        {
          q: 'Why use a target range instead of a single point?',
          options: ['So normal week-to-week variation isn’t read as failure or success', 'Because a range is easier to reach', 'So the team can choose its own number each week', 'Because single points can’t be measured'],
          answer: 'So normal week-to-week variation isn’t read as failure or success',
          why: 'Results vary. A range shows when a change is real and worth acting on.',
        },
        {
          q: 'A team’s on-time completion over its last 10 weeks was, week by week: 78, 81, 84, 79, 86, 80, 83, 85, 82 and 82%. What is the average over those 10 weeks, in %?',
          number: 82,
          tolerance: 0.1,
          unit: '%',
          why: 'The ten values add up to 820; 820 / 10 = 82%.',
        },
        {
          q: 'A team’s weekly on-time completion ranged from 78% to 86% over the last 10 weeks, with an average of 82%. Nothing in their way of working changes next quarter. Which target for next quarter is the most defensible?',
          options: ['95%', 'Between 83 and 87%, aiming for 85%', '“Do your best”', 'Exactly 82%, the current average'],
          answer: 'Between 83 and 87%, aiming for 85%',
          why: 'It is near the best weeks they already achieved, so it is a stretch people can believe. 95% needs a changed method, 82% asks for no improvement, and “do your best” is not specific.',
        },
      ],
      situation: {
        scene: 'At a grid operator, the sponsor tells the planning team: “Zero late jobs by June.” Today about 18% of jobs start later than planned, and the best week this year was 11%. The planning lead looks at you after the meeting and sighs.',
        ask: 'What do you propose to the sponsor?',
        model: 'I’d tell the sponsor I share the ambition, but zero by June is below anything the team has ever done, so they won’t believe it. I’d propose a range for June of 10 to 14% late, close to their best week, with a review every month. And I’d name what has to change for a bigger step, like a readiness check two days before the start, so the next target can be lower.',
        rubric: [
          'Supports the ambition while showing the target is beyond anything achieved',
          'Proposes a range based on the team’s own best weeks',
          'Names the change in method needed for a bigger step',
        ],
        pushback: {
          lines: [
            'If I say 12%, they’ll relax. People need a stretch, otherwise nothing moves.',
            'The board already heard “zero”. I can’t come back with something softer.',
          ],
          model: 'I agree they need a stretch: 12% means a week close to their best becomes a normal week, which is a real step. A target they think is impossible usually gets ignored or gamed. You can keep zero as the direction and tell the board the June milestone and what we change to get there. Shall I draft that one slide for you before Thursday?',
          rubric: [
            'Acknowledges the need for a stretch and the board’s expectation',
            'Restates why a believable target moves more than an impossible one',
            'Offers a concrete way to present it to the board',
          ],
        },
      },
      sayIt: 'Explain in 60 seconds how to set a target a team believes in, using their own data.',
      terms: [
        { term: 'Target range', def: 'A band with an aim in the middle, so normal variation isn’t read as success or failure.' },
        { term: 'Trigger', def: 'The level at which the team takes action, separate from the target.' },
        { term: 'Goal acceptance', def: 'People agreeing that a target is worth pursuing and possible; needed for a hard goal to work.' },
      ],
    },
    {
      id: 'pm.perform.dialogue',
      title: 'The performance conversation',
      pre: [
        {
          q: 'A team’s weekly number went red. What should the first question in a good performance review be about?',
          options: ['Who is responsible', 'What the data shows, and whether it is a real change or a normal week', 'How fast it can be fixed', 'Why nobody saw it coming'],
          answer: 'What the data shows, and whether it is a real change or a normal week',
          why: 'Agree on the facts first. Discussing causes or blame before you know whether anything really changed wastes the meeting.',
        },
      ],
      teach: [
        'A performance conversation is a short, regular talk about the numbers between a manager and the team or person who owns them. It has three steps: facts, cause, commitment. Most reviews skip the middle and jump from a red number to “try harder”.',
        'Facts. What does the number show, against which target, over which period? Is it a real change or a normal week? Look at the trend, not one point. Agree on the facts before discussing why. If the data is disputed, fix the data first, or the meeting turns into an argument about the data.',
        'Cause. Ask open questions: “What happened in the weeks that went well?” “Where did the jobs get stuck?” Go and look if you can. Separate a one-off, like a storm, from a pattern. If the first explanation is outside the team’s control, accept that part and ask which part was inside it.',
        'Commitment. One or two actions, each with an owner, a date and a way to see whether it worked. Next time, start with those actions. The tone: hard on the numbers, soft on the people. The goal is to learn what to do, not to find who to blame.',
      ],
      example: {
        kind: 'faded',
        text: 'A grid operator, weekly review with crew lead Mark. Target: 85% of jobs start on the planned day. The last four weeks: 84, 86, 83 and 70%. Last week 40 jobs were planned and 12 didn’t start on the planned day. Mark opens with: “It was the weather. Nothing we could do.”',
        ask: 'How would you run the rest of this conversation?',
        reveal: 'Facts first: 70% (28 of 40) is clearly below the normal 83 to 86%, so it is worth discussing. Then ask how the 12 missed jobs split: say 5 were due to the storm and 7 to materials not being ready. Accept the storm as a one-off and focus on the part inside the team’s control, the materials. Commitment: Mark checks materials for next week’s jobs with the warehouse every Thursday. The next review starts with how that check went.',
      },
      said: 'What you hear in projects: “Before we talk about why, are we agreed on what the numbers say?”',
      recall: [
        {
          q: 'What is the order of the three steps in a performance conversation?',
          options: ['Cause, facts, commitment', 'Facts, cause, commitment', 'Commitment, facts, cause', 'Facts, commitment, cause'],
          answer: 'Facts, cause, commitment',
          why: 'You agree on what happened, then why, then what you will do. Skipping the cause gives actions that don’t fix anything.',
        },
        {
          q: 'Which of these is a good commitment at the end of a performance conversation?',
          options: ['“We’ll try harder next week”', '“Mark checks next week’s materials with the warehouse every Thursday, and we look at the result in the next review”', '“Everyone pays more attention to planning”', '“We’ll discuss it again next month”'],
          answer: '“Mark checks next week’s materials with the warehouse every Thursday, and we look at the result in the next review”',
          why: 'It has an owner, a date and a way to check whether it worked. The others have none of these.',
        },
        {
          q: 'A team lead blames a missed target entirely on something outside the team’s control. What is the best response?',
          options: ['Accept it and move on', 'Tell him it’s an excuse', 'Accept the outside part, and ask which part was within the team’s influence', 'Escalate to his manager'],
          answer: 'Accept the outside part, and ask which part was within the team’s influence',
          why: 'Denying a real outside cause costs trust. Asking about the inside part keeps the conversation on what the team can change.',
        },
        {
          q: 'Last week 40 jobs were planned and 30 started on the planned day. Of the 10 jobs that didn’t, 4 were held up by the weather and 6 by missing materials. What share of the missed jobs was due to missing materials, in %?',
          number: 60,
          tolerance: 0.5,
          unit: '%',
          why: '6 of the 10 missed jobs: 6 / 10 = 60%.',
        },
      ],
      situation: {
        scene: 'You facilitate the monthly performance review at a parts manufacturer. On-time delivery for one value stream dropped from 92% to 81%. The plant manager turns to the team leader in front of everyone: “This is unacceptable. What are you going to do about it?” The team leader goes quiet.',
        ask: 'What do you say, as the facilitator?',
        model: 'I’d step in calmly: “Can we first look at what the data shows? Then we’ll get to actions.” I’d show the trend and ask whether the drop is spread over the month or in one week. Then ask the team leader open questions about where orders got stuck. And I’d close with one or two actions, each with an owner and date, which we check first next month.',
        rubric: [
          'Brings the meeting back to the facts without attacking the plant manager',
          'Asks open questions about the cause before actions',
          'Ends with concrete actions with owner and date',
        ],
        pushback: {
          lines: [
            'I don’t need a process lesson. I need to know who fixes this.',
            'We’ve been looking at data for months. It’s time for consequences.',
          ],
          model: 'Understood, you want an owner, and you’ll get one before we leave this room. Give us ten minutes to find where the orders got stuck, so the owner fixes the right thing. If we skip that, we’ll be here next month with the same number. I’ll write down the action, the owner and the date, and we open next month’s review with it.',
          rubric: [
            'Acknowledges his need for ownership and urgency',
            'Restates why ten minutes on the cause matters',
            'Commits to an action with an owner and date in this meeting',
          ],
        },
      },
      sayIt: 'Explain in 60 seconds how to run a good performance conversation when a number has gone red.',
      terms: [
        { term: 'Performance conversation', def: 'A short, regular talk about the numbers: facts, cause, commitment.' },
        { term: 'Commitment', def: 'An action with an owner, a date and a way to check whether it worked.' },
        { term: 'One-off', def: 'A cause that won’t repeat, like a storm, as opposed to a pattern.' },
      ],
    },
    {
      id: 'pm.perform.gaming',
      title: 'Gaming and perverse incentives',
      pre: [
        {
          q: 'A customer service team is rewarded for short average call times. What is a likely side effect?',
          options: ['Customers get better help', 'Agents end calls before the problem is solved, so customers call back', 'Fewer customers call', 'Nothing changes'],
          answer: 'Agents end calls before the problem is solved, so customers call back',
          why: 'The cheapest way to shorten calls is to end them early. The number improves while the service gets worse.',
        },
      ],
      teach: [
        'Goodhart’s law, in Marilyn Strathern’s phrasing: when a measure becomes a target, it ceases to be a good measure. Put pressure on one number and people find the cheapest way to move it, which is not always the way you intended.',
        'Typical forms: shifting work, cost or defects just outside the measured period or scope; cherry-picking the easy jobs to hit a count; redefining what counts; and plain fudging. Steve Kerr called it “rewarding A while hoping for B” (1975). The textbook case is Wells Fargo, where aggressive sales targets led staff to open millions of accounts customers never asked for.',
        'How to spot it: the number improves but nothing around it does. Sudden jumps right before the deadline. Results that cluster just above the threshold. Paired numbers moving the wrong way, like on-time delivery up while complaints rise too. And ask the floor: “What do people do to make this number green?”',
        'Prevention: pair indicators, keep some numbers for learning only with no bonus attached, change the definition when you see gaming, and look at the work itself, not only the figure. Most gaming isn’t done by bad people. It is a reasonable answer to a badly designed system, so fix the system first.',
      ],
      example: {
        kind: 'faded',
        text: 'A grid operator links a team bonus to “share of outages restored within 4 hours”. In one quarter it goes from 88% to 97%. In the same quarter, outages that return at the same address within 30 days go from 6 to 14 per 100 restored outages.',
        ask: 'What do you suspect, and what would you do?',
        reveal: 'Suspect the clock is being stopped with temporary fixes: power is back fast, but the real repair is left for later or not done. Check it, don’t accuse: compare restored outages with follow-up work orders, and ask crews what they do to make the 4 hours. Then fix the system: pair the 4-hour number with repeat outages within 30 days, and consider taking the bonus off the single number.',
      },
      said: 'What you hear in projects: “That number got a lot better very fast. What did people have to do to make it green?”',
      recall: [
        {
          q: 'What does Goodhart’s law say?',
          options: ['What gets measured gets done', 'When a measure becomes a target, it ceases to be a good measure', 'Most results come from a few causes', 'Work expands to fill the time available'],
          answer: 'When a measure becomes a target, it ceases to be a good measure',
          why: 'Pressure on a number changes behaviour towards the number, and it stops reflecting the thing it was meant to show.',
        },
        {
          q: 'Which pattern is a warning sign of gaming?',
          options: ['Results vary randomly around the average', 'Results cluster just above the threshold', 'The number improves slowly over several months', 'Two paired numbers improve together'],
          answer: 'Results cluster just above the threshold',
          why: 'Natural results spread out. A pile-up just above the line suggests people are steering on the line itself.',
        },
        {
          q: 'You suspect a team is gaming a KPI. Which response addresses the cause?',
          options: ['Warn the team that gaming will be punished', 'Redesign the measure and pair it with one that shows the side effect', 'Add a second bonus for honesty', 'Stop measuring altogether'],
          answer: 'Redesign the measure and pair it with one that shows the side effect',
          why: 'Gaming is usually a reasonable response to a badly designed system. Changing the system removes the reason for it.',
        },
        {
          q: 'Before a bonus was linked to restoration time, 6 of every 100 restored outages came back at the same address within 30 days. After the bonus, 14 of every 100 did. By how many percentage points did this repeat rate rise?',
          number: 8,
          tolerance: 0.1,
          unit: 'percentage points',
          why: 'From 6% to 14% is a rise of 14 − 6 = 8 percentage points.',
        },
      ],
      situation: {
        scene: 'At a parts manufacturer, the purchasing manager proudly reports that average purchase prices are down 8% this year, which is her bonus target. You have also seen that line stops caused by late or wrong parts from a new, cheaper supplier rose from 3 to 11 per month.',
        ask: 'How do you raise this in the management meeting?',
        model: 'I’d first credit the saving: 8% is real money. Then put the two numbers side by side: “In the same period, line stops from late or wrong parts went from 3 to 11 a month. I’d like to know what those stops cost, so we see the total.” And I’d suggest pairing purchase price with supplier on-time delivery for purchasing’s targets.',
        rubric: [
          'Credits the result without accusing anyone',
          'Puts the side effect next to the number with data',
          'Proposes pairing the indicator so the system changes',
        ],
        pushback: {
          lines: [
            'Line stops are production’s problem. Purchasing did exactly what it was asked to do.',
            'You’re making my department look bad in front of the whole management team.',
          ],
          model: 'You did what the target asked, and that’s the point: the target only looked at price. I’m not blaming purchasing; the system rewards one number. If we price the line stops, we see the total cost of the supplier choice. Can we sit down together before the next meeting and work out those costs, so you present the full picture?',
          rubric: [
            'Acknowledges she met her target and isn’t to blame',
            'Restates that the issue is the one-sided target',
            'Proposes working out the total cost together first',
          ],
        },
      },
      sayIt: 'Explain Goodhart’s law to a plant manager in 60 seconds, with one example of how a KPI can be gamed.',
      terms: [
        { term: 'Goodhart’s law', def: 'When a measure becomes a target, it ceases to be a good measure.' },
        { term: 'Gaming', def: 'Moving a number in a way that doesn’t improve what it was meant to show.' },
        { term: 'Perverse incentive', def: 'A reward that encourages behaviour opposite to what was intended.' },
      ],
    },
    {
      id: 'pm.perform.rhythm',
      title: 'A review rhythm that lasts',
      pre: [
        {
          q: 'Six months after a consultant leaves, what most often kills a new performance review routine?',
          options: ['The KPIs turned out to be wrong', 'Nobody in the line owns the meeting, so it slips once the consultant’s invite is gone', 'The software licence expires', 'The targets were too low'],
          answer: 'Nobody in the line owns the meeting, so it slips once the consultant’s invite is gone',
          why: 'A routine run by an outsider stops when the outsider stops. Ownership by a line manager is what keeps it alive.',
        },
      ],
      teach: [
        'Build a chain of short meetings that feed each other: daily or weekly at team level, about 15 minutes at the board; weekly or every two weeks at department level; monthly for management. The same definitions all the way up. Problems a team can’t solve go up one level, decisions come back down.',
        'Fit the frequency to the number. Daily for what changes daily, such as jobs started or breakdowns. Monthly for slow numbers, such as cost per connection or customer satisfaction. Looking at a slow number every day only produces noise and frustration.',
        'A fixed, short agenda: actions from last time, the numbers against target, one or two problems in depth, new actions. Same time, same place. Make it visible, so anyone walking past sees where the team stands. An action list nobody looks at the next time is how a rhythm dies.',
        'Design for your exit from day one. A line manager chairs from the start; you coach from the side, then step back. The data refreshes without you: no spreadsheet only you can update. Leave a one-page description of who, when, which numbers and how problems go up. Check after you leave whether the meetings still happen.',
      ],
      example: {
        kind: 'faded',
        text: 'At a parts manufacturer you set up a weekly KPI review. You’ve chaired it for eight weeks and you update the spreadsheet yourself every Monday morning. The production manager attends and likes it. Your contract ends in four weeks.',
        ask: 'What do you do in these four weeks?',
        reveal: 'Hand over in steps. Next week the production manager chairs and you sit next to him. The week after, you only attend. In the last two weeks you stay away and ask afterwards how it went. Move the data refresh to an automatic export, or to the planner who owns the source, and test it while you’re still there. Write the one-pager. Agree with the sponsor on a check four and twelve weeks after you leave.',
      },
      said: 'What you hear in projects: “If this meeting only happens when the consultant is here, we haven’t built anything.”',
      recall: [
        {
          q: 'Who should chair a new review meeting from the start?',
          options: ['The consultant, until it runs smoothly', 'A line manager who will own it after the consultant leaves', 'The most senior person available', 'Whoever has time that week'],
          answer: 'A line manager who will own it after the consultant leaves',
          why: 'Ownership has to be built while you are still there to coach. Handing over at the end is too late.',
        },
        {
          q: 'Which of these numbers fits a monthly review rather than a daily one?',
          options: ['Jobs started today', 'Breakdowns on the bottleneck in the last shift', 'Cost per completed connection', 'Crews available tomorrow'],
          answer: 'Cost per completed connection',
          why: 'Cost per connection moves slowly and needs a month of data to mean something. The others change every day.',
        },
        {
          q: 'What comes first on the agenda of a good review meeting?',
          options: ['The actions agreed last time', 'The new numbers', 'Announcements from management', 'A round of how everyone is doing'],
          answer: 'The actions agreed last time',
          why: 'Starting with last time’s actions shows they matter. Skip them and people stop closing them.',
        },
        {
          q: 'A team holds a 15-minute review every working day, 5 days a week. All 8 team members attend every meeting. How many person-hours per week does the review take?',
          number: 10,
          tolerance: 0.1,
          unit: 'person-hours per week',
          why: '15 minutes × 5 days = 75 minutes = 1.25 hours per person; 1.25 × 8 people = 10 person-hours per week.',
        },
      ],
      situation: {
        scene: 'At a grid operator, the operations director says in your last month: “This works well. Once you’re gone we’ll keep doing it. Just send us the monthly analysis from your side, like you do now.”',
        ask: 'What do you answer?',
        model: 'I’d thank him and say that if the analysis comes from me, the routine depends on me. I’d propose that one of his analysts takes it over now, while I’m still here: two weeks together, then she does it alone and I review. And we agree that the department heads keep chairing their own reviews, and that he and I check in three months from now.',
        rubric: [
          'Points out the dependency on the consultant',
          'Proposes moving the work to someone in the line while still there',
          'Agrees a check after leaving',
        ],
        pushback: {
          lines: [
            'My analysts are fully booked. You know the analysis best, so it’s more efficient if you keep doing it.',
            'Honestly, it sounds like you just don’t want to do the work.',
          ],
          model: 'I understand: your analysts are busy, and in the short run it’s quicker if I do it. But then the review stops the day my contract does, and you’ve paid for something that doesn’t last. It takes about four hours a month. Can we pick one analyst now, do the next two months together, and then she runs it on her own?',
          rubric: [
            'Acknowledges the capacity problem and the short-term efficiency',
            'Restates that the routine must not depend on the consultant',
            'Proposes a concrete handover with one named person and a time frame',
          ],
        },
      },
      sayIt: 'Explain in 60 seconds how to set up a review rhythm that keeps running after the consultant has left.',
      terms: [
        { term: 'Review cascade', def: 'A chain of short meetings at team, department and management level, each feeding the next.' },
        { term: 'Escalation', def: 'Moving a problem a team can’t solve to the next level, with a decision coming back.' },
        { term: 'Handover', def: 'Moving ownership of a routine to the line in steps, while the consultant can still coach.' },
      ],
    },
  ],
};
