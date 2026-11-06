// pm.plan (EN): Plan, turning a goal into a plan people believe: breakdown, estimates, schedule, risks, roles and way of working.
export default {
  lessons: [
    {
      id: 'pm.plan.wbs',
      title: 'Breaking the work down',
      pre: [
        {
          q: 'A grid operator (the company that runs the local electricity network) wants fewer cancelled jobs. Which is the best first line in the breakdown of that project?',
          options: ['“Analyse data”', '“Week 1: kick-off (start meeting)”', '“Baseline of cancellations by cause, agreed with the planning manager”', '“Hold workshops”'],
          answer: '“Baseline of cancellations by cause, agreed with the planning manager”',
          why: 'Start from deliverables, things that will exist and can be checked, not from activities. A baseline is the measured starting point.',
        },
      ],
      teach: [
        'Start with deliverables, not activities. A deliverable is something that exists at the end and that someone can check: “a baseline of cancellations by cause”, “a readiness check agreed by the planners” (a check that permits, materials and crew are in place before a job), “a six-week pilot (a small trial) in one region”.\n\nAsk: “If this project is done, what is there that isn’t there now?” Write four to seven deliverables. Activities come later, under each one.',
        'The result is a WBS, a work breakdown structure: a tree with the project at the top, deliverables below it, and work packages at the bottom.\n\nOne rule from the PMI (the Project Management Institute, the big professional body) helps: the 100% rule. Together, the branches must cover all the work, and nothing outside the project. If something has to happen and it isn’t in the tree, nobody will do it.',
        'A work package is a piece one person or a small team can do and finish. The 8–80 rule, a common rule of thumb: a package smaller than about 8 hours is micromanagement, bigger than about 80 hours hides surprises and can’t be tracked.\n\nEach package gets a verb, an owner and a definition of done, the check that says it’s finished: “Classify 3 months of cancellations by cause, done when the planning manager agrees the categories.”',
        'Build the breakdown with the people who will do the work, not alone behind your laptop. Sticky notes on a wall, one deliverable per column, 60 minutes.\n\nPeople commit to what they helped break down. And they spot the packages you forgot, like data access, the works council (elected staff who must be consulted on big changes) or the training of the night shift. Typical forgotten work: getting permissions, training, and handing over to the line organisation that runs it afterwards.',
        'Resistance sounds like: “We don’t need all this planning, let’s just start.” Answer: “Agreed, we start this week. Give me one hour to see what we’re signing up for, so we don’t get surprised in month two.”\n\nExperts argue about detail: some break everything down on day one, others only the next six weeks and the rest roughly. When you don’t understand the technical work, ask the expert: “What needs to be finished before you can start this?”',
      ],
      example: {
        kind: 'worked',
        text: 'At a grid operator, the goal is to cut last-week cancellations of planned MS jobs (work on the medium-voltage network, cancelled in the final week before the date) from 18% to under 8% in six months. With two planners and a team lead you put up four deliverables: (1) baseline of cancellations by cause, (2) a readiness check agreed by planning and the control room (which operates the grid remotely), (3) a six-week pilot in one region, (4) handover to all regional planners.\n\nUnder (1): “extract 3 months of cancellations from the planning system” (16 hours, the data analyst), “classify by cause with two planners” (12 hours), “review with the planning manager” (4 hours). Under (3) someone adds “brief the switching technicians” (who switch the network off and on safely), which you had missed.',
      },
      said: 'What you hear in projects: “Do we really need a whole breakdown? We know what has to happen.”',
      recall: [
        {
          q: 'What is a deliverable?',
          options: ['Something that exists at the end and can be checked', 'Any task on the plan', 'A meeting with the sponsor', 'The project goal'],
          answer: 'Something that exists at the end and can be checked',
          why: 'Deliverables are outcomes you can point at; activities are what you do to get there.',
        },
        {
          q: 'A work package is estimated at 200 hours of work. By the 8–80 rule, what do you do?',
          options: ['Leave it, big packages are efficient', 'Merge it with another package', 'Split it into smaller packages that can be tracked', 'Give it to two owners'],
          answer: 'Split it into smaller packages that can be tracked',
          why: 'Above about 80 hours a package hides surprises and you can’t see progress.',
        },
        {
          q: 'Why build the breakdown together with the team?',
          options: ['It is faster than doing it alone', 'The sponsor requires it', 'So you don’t have to estimate', 'People commit to it and spot the work you forgot'],
          answer: 'People commit to it and spot the work you forgot',
          why: 'Ownership and completeness both come from the people who will do the work.',
        },
        {
          q: 'An engineer says “let’s just start”. What is the best answer?',
          options: ['“Then you own the risk.”', '“Agreed, we start this week. One hour first to see what we’re signing up for.”', '“The method requires a full breakdown.”', '“Fine, we skip planning.”'],
          answer: '“Agreed, we start this week. One hour first to see what we’re signing up for.”',
          why: 'You honour their urge to act and still get the overview, at low cost.',
        },
      ],
      situation: {
        scene: 'You’re at a food manufacturer. The plant manager hands you a project: “Reduce unplanned downtime (hours the line stands still without it being planned) on the filling lines by 30%.” Your team is a maintenance engineer, a shift lead and a planner. They are keen to start fixing things, beginning with the capper (the machine that screws the caps on).',
        ask: 'How do you get to a breakdown without killing their energy?',
        model: '“Great that you want to start. Let’s spend one hour tomorrow on what this project must deliver, so we all aim at the same thing.” Then with sticky notes: what will exist at the end, like a downtime baseline per line, the top causes, fixes in place, a way to keep it up. Under each one, packages with an owner and a “done when”.',
        rubric: [
          'Keeps the energy by limiting planning to a short session',
          'Starts from deliverables, not activities',
          'Gives each package an owner and a “done when”',
        ],
        pushback: {
          lines: [
            '“We know what’s broken. Why spend a week on boxes and lists when we could be fixing the capper today?”',
            '“Last project we made a beautiful plan and nothing happened. The guys lose interest if they don’t see action.”',
          ],
          model: '“I get it, and we will fix the capper this week. Alongside it, give me one hour on Thursday to list what else eats downtime, so we don’t fix the wrong things first. Your capper goes on that list as item one, already started.”',
          rubric: [
            'Acknowledges their energy and the bad experience',
            'Holds to a short breakdown before the full push',
            'Proposes doing both: a quick fix now and a short planning session',
          ],
        },
      },
      sayIt: 'Explain to a new colleague in 60 seconds how you break a project down, from deliverables to work packages.',
      terms: [
        { term: 'Deliverable', def: 'Something that exists at the end of the project and can be checked.' },
        { term: 'WBS', def: 'Work breakdown structure: a tree from project to deliverables to work packages, covering all the work.' },
        { term: 'Work package', def: 'A piece of work one person or small team can do and finish, with an owner and a “done when”.' },
        { term: '8–80 rule', def: 'Rule of thumb: work packages between about 8 and 80 hours of effort.' },
        { term: 'Definition of done', def: 'The agreed check that says a package or deliverable is finished.' },
      ],
    },
    {
      id: 'pm.plan.estimate',
      title: 'Estimating honestly',
      pre: [
        {
          q: 'A team member says a task will take 5 days. What does research on the planning fallacy (our habit of underestimating how long things take) say usually happens?',
          options: ['It takes about 5 days', 'It is often done early', 'It takes noticeably longer than estimated', 'It depends only on the person’s experience'],
          answer: 'It takes noticeably longer than estimated',
          why: 'People plan from the best case and forget interruptions, waiting and other work.',
        },
      ],
      teach: [
        'Give a range, not a point. “Six to ten weeks” is more honest than “eight weeks”, and it shows where the uncertainty is.\n\nA three-point estimate asks for optimistic (O), most likely (M) and pessimistic (P). The PERT average (Program Evaluation and Review Technique), from the US Navy’s Polaris programme in 1958, is (O + 4M + P) / 6. For O = 4, M = 6, P = 14 days that gives 7 days, more than the “most likely” 6, because things can go much more wrong than right.',
        'The planning fallacy is the habit of underestimating time by picturing the best case. Kahneman and Tversky named it in 1979. In a 1994 study by Buehler, Griffin and Ross, students expected to finish their thesis in about 34 days; on average it took 56.\n\nPeople picture the work going smoothly, forget waiting for others, and forget their normal job. A cure: ask how long similar jobs actually took last time, not how long this one should take.',
        'Effort is the hours of work; duration is the calendar time until it’s done. At clients this is the big gap: a shift lead is “on the project” but has maybe 20% of his week free.\n\nAsk: “How many hours a week can you really spend on this?” Then convert: 16 hours of effort at 4 hours a week is a duration of four weeks. Add holidays and peak season to that, not to the effort.',
        'A buffer is spare time kept for what goes wrong. Don’t pad every task secretly; people then use the padding anyway. Parkinson’s law (1955): work expands to fill the time available. Goldratt (1997) called starting only near the deadline “student syndrome”.\n\nPut one visible buffer at the end of the project or before a hard milestone (a fixed date that matters), and watch how fast it gets used. A buffer half gone at a quarter of the project is an early warning.',
        'The people side. When a client engineer says “two weeks”, don’t argue. Ask: “What’s the best case? And what could make it take longer?” He’ll give you the range himself.\n\nWhen you have to estimate something you don’t know, say so and give a range with what would narrow it: “Four to eight weeks. After the data check in week 2 I can tell you more precisely.” Experts differ on showing ranges to boards; most give the range plus the date they’ll commit to.',
      ],
      example: {
        kind: 'worked',
        text: 'You plan a data analysis of breakdowns at a packaging plant. The maintenance engineer says: “Three days.” You ask for the best and worst case.\n\nBest: 2 days, if the data export works. Worst: 10 days, because the maintenance system has had a migration (a move of all data to a new system) and the old data may be messy.\n\nThree-point: (2 + 4 × 3 + 10) / 6 = 4 days of effort. He can spend one day a week on it next to his normal work, so the duration is about 4 weeks, not 3 days. You put “data analysis: 2 to 10 weeks, most likely about 4” in the plan and tell the sponsor that after the first export you’ll know which end it is.',
      },
      said: 'What you hear in projects: “That’s two days of work, tops. I’ll do it next week.”',
      recall: [
        {
          q: 'Three-point estimate of effort: optimistic 4, most likely 6, pessimistic 14 days. With (O + 4M + P) / 6, what is the estimate in days?',
          number: 7,
          tolerance: 0.1,
          unit: 'days',
          why: '(4 + 4 × 6 + 14) / 6 = (4 + 24 + 14) / 6 = 42 / 6 = 7.',
        },
        {
          q: 'A shift lead needs 24 hours of work (effort) for a task and has 4 hours a week for the project. Ignoring holidays, how many calendar weeks will it take?',
          number: 6,
          tolerance: 0.1,
          unit: 'weeks',
          why: '24 / 4 = 6 weeks: effort is not duration.',
        },
        {
          q: 'Why put one visible buffer (spare time) at the end instead of padding each task?',
          options: ['Padding in each task tends to get used up anyway', 'The sponsor can then cut it', 'It makes the plan look shorter', 'Tasks then never slip'],
          answer: 'Padding in each task tends to get used up anyway',
          why: 'Work expands to fill the time; a shared buffer you watch shows real slippage.',
        },
        {
          q: 'You must estimate something you don’t know yet. What is the most professional answer?',
          options: ['A single number, to sound confident', 'Refuse to estimate until you know more', 'A range, plus when and how you will narrow it', 'Copy the estimate from the last project'],
          answer: 'A range, plus when and how you will narrow it',
          why: 'Honest about the uncertainty and clear about how it shrinks.',
        },
      ],
      situation: {
        scene: 'You’re in a steering group (the regular meeting where the sponsor checks progress and decides) at a metal parts manufacturer. The sponsor asks: “So when is the new planning process live?” You haven’t talked to IT yet about the system changes.',
        ask: 'What do you say?',
        model: '“My best estimate now is between June and September. The big unknown is the system change; I’m meeting IT next Tuesday, and after that I can narrow it to a month. I’ll send you the update on Wednesday.” Then actually do it.',
        rubric: [
          'Gives a range instead of a single date',
          'Names the biggest unknown honestly',
          'Says when and how the range will be narrowed',
        ],
        pushback: {
          lines: [
            '“I don’t need it exact. Just give me a date I can put in the board update.”',
            '“Every consultant says ‘it depends’. If you can’t give me a date, what do I have you for?”',
          ],
          model: '“Fair, you need something for the board. Without IT it’s somewhere between June and September; the system change is the big unknown. I’ll talk to IT this week and give you a firm range by next Wednesday. Then the date you report is one we can keep.”',
          rubric: [
            'Acknowledges his need for a date',
            'Gives an honest range and names the unknown',
            'Commits to a dated step that narrows the range',
          ],
        },
      },
      sayIt: 'Explain to a client engineer in 60 seconds why you ask for a best case and a worst case instead of one number.',
      terms: [
        { term: 'Range', def: 'An estimate as a lower and upper value, such as “six to ten weeks”, instead of one number.' },
        { term: 'Three-point estimate', def: 'Optimistic, most likely and pessimistic, often combined as (O + 4M + P) / 6.' },
        { term: 'Planning fallacy', def: 'The tendency to underestimate time by picturing the best case.' },
        { term: 'Effort', def: 'The hours of work a task needs, regardless of when they happen.' },
        { term: 'Duration', def: 'Calendar time from start to finish, which depends on how many hours a week people have.' },
        { term: 'Buffer', def: 'One visible block of spare time for what goes wrong, watched instead of hidden in every task.' },
      ],
    },
    {
      id: 'pm.plan.schedule',
      title: 'Critical path and the one-page plan',
      pre: [
        {
          q: 'A task that is not on the critical path (the longest chain of tasks that depend on each other) slips by one week. What happens to the end date?',
          options: ['It moves one week', 'It moves two weeks', 'The whole plan must be redone', 'Nothing, as long as the slip fits within that task’s slack'],
          answer: 'Nothing, as long as the slip fits within that task’s slack',
          why: 'Only the longest chain of dependent tasks sets the end date; slack is how much a task can slip without moving it.',
        },
      ],
      teach: [
        'A dependency means some work can only start when other work is finished. You can’t pilot the new readiness check before the planners agree on it.\n\nList them by asking each owner: “What do you need from someone else before you can start?” Most dependencies at clients are about people and decisions, not tasks: a sign-off, the works council (elected staff with a legal say in big changes), a production stop.',
        'The critical path is the longest chain of dependent work from start to finish. It sets the end date. The method dates from 1957, from DuPont and Remington Rand.\n\nTasks off that path have slack: they can slip a bit without moving the end. So you watch the critical path closely and don’t panic about everything else. If you need to go faster, only shortening the critical path helps. Shorten it too much and another chain becomes critical.',
        'A milestone is a moment, not an activity: “readiness check agreed”, “pilot starts”. The most important kind is a go/no-go: the decision to continue or roll out (introduce everywhere), or to stop.\n\nGood milestones are decisions or visible results, about every three to six weeks. They give the steering group (the sponsor’s regular decision meeting) something to check and the team something to aim at.',
        'Put the plan on one page as a Gantt chart, named after Henry Gantt, who drew such charts in the 1910s: deliverables as rows, weeks as columns, bars for work, milestones as diamonds, an owner per row. Check it against the client’s calendar: shutdowns, holidays, peak season, steering group dates.\n\nHang it on the wall where the team works. A plan people see every day gets corrected; a plan in a file gets forgotten.',
        'Typical failure: the plan shows only tasks the team controls, and the slow outside steps are missing, like IT access, a supplier or a permit. These often turn out to be the critical path.\n\nExperts argue about software: big tools like MS Project (Microsoft’s planning software) calculate paths for you, but a wall plan gets more corrections from the floor. A sharp question at every review: “What has to happen this month for the end date to hold?”',
      ],
      example: {
        kind: 'worked',
        text: 'A planning project at a grid operator.\n\nBaseline analysis (A) takes 3 weeks. Then two chains: designing the readiness check (B, 4 weeks) and training the planners (D, 2 weeks) after it; and arranging system access for the pilot region (C, 6 weeks), also before the pilot. Pilot (E, 6 weeks) needs D and C.\n\nChain A-B-D-E = 3 + 4 + 2 + 6 = 15 weeks. Chain A-C-E = 3 + 6 + 6 = 15 weeks. Both are critical.\n\nYou ask IT whether the access request can start in week 1 instead of after the baseline: then C runs alongside A. The end date stays at 15 weeks, but the access chain now has 3 weeks of slack, so an IT delay no longer moves the end.',
      },
      said: 'What you hear in projects: “That date’s fine, as long as IT delivers on time. Has anyone actually asked IT?”',
      recall: [
        {
          q: 'Two chains, each task starting only when the one before is finished: A (3 weeks) then B (4) then D (2); and A (3) then C (6) then D (2). How many weeks is the critical path?',
          number: 11,
          tolerance: 0.1,
          unit: 'weeks',
          why: 'A-C-D = 3 + 6 + 2 = 11 weeks, longer than A-B-D = 9.',
        },
        {
          q: 'Which of these is a good milestone?',
          options: ['“Analysis phase”', '“Weekly team meeting”', '“Go/no-go for rollout decided by the steering group”', '“Working on the pilot”'],
          answer: '“Go/no-go for rollout decided by the steering group”',
          why: 'A milestone is a moment with a decision or visible result, not an ongoing activity.',
        },
        {
          q: 'You need to finish two weeks earlier. Where do you look first?',
          options: ['At tasks on the critical path', 'At the cheapest tasks', 'At tasks with the most slack', 'At all tasks equally'],
          answer: 'At tasks on the critical path',
          why: 'Only shortening the critical path moves the end date.',
        },
        {
          q: 'What question best uncovers dependencies at a client?',
          options: ['“How long will your part take?”', '“What do you need from someone else before you can start?”', '“Are you motivated?”', '“Which software do you use?”'],
          answer: '“What do you need from someone else before you can start?”',
          why: 'Dependencies are usually about inputs, sign-offs and decisions from others.',
        },
      ],
      situation: {
        scene: 'You’re at a plastic parts manufacturer. Your plan says the new shift handover (how one shift passes the state of the line to the next) goes live in week 20. In a coffee chat, a team leader mentions the plant shuts down in weeks 19 and 20, and that half the operators go on holiday right after.',
        ask: 'What do you do with this?',
        model: 'Thank him, and check the plan against the client calendar right away: shutdowns, holidays, peak season. Going live in week 20 can’t work: the plant is shut down, and right after that half the operators are away. So I’d propose either week 17 or after the holidays, and bring that to the sponsor with the reason. And I’d hang the one-page plan where the team can see it, so this kind of thing gets caught sooner.',
        rubric: [
          'Checks the plan against the client’s calendar',
          'Proposes a concrete alternative date with the reason to the sponsor',
          'Makes the plan visible so others can correct it',
        ],
        pushback: {
          lines: [
            '“Week 20 is in the plan the board approved. Moving it now makes us look like we didn’t think it through.”',
            '“Can’t you just go live during the shutdown? It’s quiet then, perfect for something new.”',
          ],
          model: '“I understand, a moved date feels bad. But going live in a shutdown means nobody uses it for weeks, and half the operators then learn it after their holiday. Better to say it now: week 23, with everyone there. I’ll write the board a two-line reason today.”',
          rubric: [
            'Acknowledges the cost of moving the date',
            'Holds to a date that actually works on the floor',
            'Proposes a concrete new date and how to tell the board',
          ],
        },
      },
      sayIt: 'Explain to a client team in 60 seconds what the critical path is and why it matters for the end date.',
      terms: [
        { term: 'Dependency', def: 'A link where one piece of work can only start when another is finished or decided.' },
        { term: 'Critical path', def: 'The longest chain of dependent work; it sets the end date.' },
        { term: 'Slack', def: 'How much a task can slip without moving the end date.' },
        { term: 'Milestone', def: 'A moment with a decision or visible result, not an activity.' },
        { term: 'Go/no-go', def: 'A milestone where someone decides to continue or roll out, or to stop.' },
        { term: 'Gantt chart', def: 'A plan with work as bars against a time line, milestones as diamonds, one row per deliverable.' },
      ],
    },
    {
      id: 'pm.plan.risk',
      title: 'A risk register that gets used',
      pre: [
        {
          q: 'What is the main purpose of a pre-mortem (a session where you imagine the project has already failed)?',
          options: ['Calculating the project budget', 'Assigning blame in advance', 'Making it safe to name why the project could fail', 'Replacing the risk register'],
          answer: 'Making it safe to name why the project could fail',
          why: 'Imagining failure as a fact makes people say what they would otherwise keep to themselves.',
        },
      ],
      teach: [
        'A risk is something that might happen and would hurt the project. A risk register is the list of them, each with a likelihood (how probable), an impact (how bad), a risk owner and an action with a date.\n\nThe risk owner is one person who watches it and acts, not a department. “Data may be poor” is not useful. “The maintenance data before 2023 may be unusable after the move to the new system; owner: Pieter; action: test export in week 1” is.',
        'Many teams score likelihood and impact from 1 to 5 and multiply, so a risk scores 1 to 25. Treat the score as a way to sort, not as truth: a 12 is not really worse than a 10.\n\nThe action is the mitigation: what you do now to make the risk less likely or less harmful. “Monitor” is not a mitigation. “Test the export in week 1” is.',
        'Most registers die after the kick-off. Keep yours alive: only the top five are discussed in each steering group, each with its owner saying what happened since.\n\nRisks that came true become issues: problems that are happening now and need handling, not watching. Add new risks as you hear them, often in the coffee machine conversation.',
        'The pre-mortem, described by Gary Klein in 2007: “Imagine it’s six months from now and this project has failed. Write down, alone, why it failed.” Then collect one reason per person per round.\n\nBecause the failure is imagined as fact, people name things they would not say otherwise: the sponsor might leave, the night shift won’t accept it, the IT change isn’t budgeted. Klein cites Mitchell, Russo and Pennington (1989): this “prospective hindsight” (looking back from an imagined future) made people about 30% better at naming the right reasons.',
        'The people side: some risks are sensitive, like “the plant manager doesn’t really believe in this”. Don’t write that in a register the plant manager reads. Word it as a theme (“sponsorship and visible support”) and discuss the real thing one-on-one with whoever can act on it.\n\nWhen you don’t know how likely something is, say so and plan a cheap test to find out. A sharp question for each top risk: “What would we see first if this starts to happen?”',
      ],
      example: {
        kind: 'worked',
        text: 'At the kick-off of a downtime project at a bakery, you run a 20-minute pre-mortem with six people. Reasons that come up: “maintenance never had time because of the summer peak” (three people), “operators stopped logging stops after two weeks”, “the new manager cancelled it”. You turn the top ones into register lines.\n\nSummer peak: likelihood high, impact high, owner the maintenance manager, action: plan the analysis before June and reserve 4 hours a week per technician. Logging: owner the shift lead, action: one-tap logging on the line terminal (the screen at the line) by week 3. Each steering group starts with these five.',
      },
      said: 'What you hear in projects: “The risk register? Somewhere in the project folder, I think.”',
      recall: [
        {
          q: 'Which is a useful risk line?',
          options: ['“Data quality”', '“Old maintenance data may be unusable; owner Pieter; test export in week 1”', '“IT risks: medium”', '“Resistance from the floor”'],
          answer: '“Old maintenance data may be unusable; owner Pieter; test export in week 1”',
          why: 'It names the specific event, a person as owner and a dated action.',
        },
        {
          q: 'How do you keep a risk register alive?',
          options: ['Update it once a quarter', 'Send it to everyone by e-mail', 'Make it as complete as possible at the start', 'Discuss the top five in each steering group, owners reporting'],
          answer: 'Discuss the top five in each steering group, owners reporting',
          why: 'Regular, short use by the people who own the risks keeps it real.',
        },
        {
          q: 'A sensitive risk: the plant manager doesn’t believe in the project. What do you do?',
          options: ['Write it in the register as it is', 'Ignore it until it becomes visible', 'Word it as a theme in the register and discuss the real issue one-on-one', 'Tell the team in the next meeting'],
          answer: 'Word it as a theme in the register and discuss the real issue one-on-one',
          why: 'The risk is handled without damaging the relationship in a public document.',
        },
        {
          q: 'In a pre-mortem, why does everyone write their reasons alone first?',
          options: ['So the loudest person doesn’t set the direction', 'To save time', 'Because the sponsor reads them', 'So nobody needs to speak'],
          answer: 'So the loudest person doesn’t set the direction',
          why: 'Writing alone first gets you everyone’s view, not just the first one said aloud.',
        },
      ],
      situation: {
        scene: 'You’re at the kick-off of a project at a grid operator to speed up work preparation (getting permits, materials and crews ready before a job). The atmosphere is polite. Nobody raises any concerns, but you heard from a planner last week that “this has been tried twice before”.',
        ask: 'How do you surface the real risks?',
        model: 'I’d run a short pre-mortem: “Imagine it’s a year from now and this project failed, just like the earlier two. Write down alone why.” Then collect one reason per person per round. I’d also ask openly: “What happened with the earlier attempts?” and turn the top reasons into risks with an owner and an action.',
        rubric: [
          'Uses a pre-mortem or similar to make it safe to name risks',
          'Asks about the earlier attempts openly',
          'Turns reasons into risks with an owner and an action',
        ],
        pushback: {
          lines: [
            '“Why bring up the old attempts? It just makes people negative before we’ve even started.”',
            '“Those projects failed because of the people back then. This team is different.”',
          ],
          model: '“I don’t want to dwell on it either. But if something stopped it twice, it can stop us too. Give me fifteen minutes in the next session: what went wrong then, and what’s different now? Whatever comes out goes on the risk list with an owner.”',
          rubric: [
            'Acknowledges the worry about negativity',
            'Keeps learning from the earlier attempts on the table',
            'Proposes a short, concrete session with owners for the risks',
          ],
        },
      },
      sayIt: 'Explain to a client team lead in 60 seconds how a pre-mortem works and why it helps.',
      terms: [
        { term: 'Risk register', def: 'List of risks with likelihood, impact, owner and a dated action.' },
        { term: 'Risk owner', def: 'The one person who watches a risk and makes sure the action happens.' },
        { term: 'Mitigation', def: 'An action taken now to make a risk less likely or less harmful.' },
        { term: 'Pre-mortem', def: 'Imagining the project has failed and writing down why, to find risks early.' },
        { term: 'Issue', def: 'A risk that has happened and now needs handling.' },
      ],
    },
    {
      id: 'pm.plan.raci',
      title: 'Roles and the sponsor',
      pre: [
        {
          q: 'In improvement projects at clients, which role is most often left vague?',
          options: ['What the sponsor (the senior person who backs and pays for the project) will actually do', 'Who takes notes', 'Who books the meeting rooms', 'Who the consultant is'],
          answer: 'What the sponsor (the senior person who backs and pays for the project) will actually do',
          why: 'Sponsors are named but their tasks are rarely spelled out, so they quietly fade.',
        },
      ],
      teach: [
        'RACI is a table of roles per deliverable, with four letters.\n\nResponsible: who does the work. Accountable: who owns the result and says “this is done”, exactly one person. Consulted: who gives input before, in a two-way talk. Informed: who hears after, one way.\n\nTwo names under A means nobody is accountable. A table with ten names that are all C means decisions will be slow.',
        'One owner per deliverable, from the client side where possible. You can be responsible for the analysis; the planning manager should be accountable for the new planning process, because he has to run it after you leave.\n\nIf the client won’t own any deliverable, you have a project they are watching, not doing. That’s a red flag (a warning sign) worth raising in week one.',
        'Make the sponsor’s role explicit: the senior client person who backs the project, decides and removes obstacles. Write it down with them: attends the steering group every four weeks, decides on scope changes within a week, removes obstacles you escalate, and explains to the organisation why this matters.\n\nAsk: “What can I count on you for, and how do I reach you when something is stuck?”',
        'The RACI conversation brings out conflicts. Two managers both think they decide about the shift pattern.\n\nDon’t solve it yourself: “I see two names here. Who decides if you disagree?” If they can’t agree, it goes to the sponsor. Better to find this out in week 2 than in week 12.',
        'Typical failures: a RACI made by the consultant alone and never discussed; too many Cs, so every choice waits for a round of opinions; the table filed and forgotten.\n\nExperts argue about variants. Some add S for Support (RASCI); others prefer DACI, with a D for the one Driver and an A for the Approver. The letters matter less than the conversation. A sharp question: “If this goes wrong, whose phone rings?”',
      ],
      example: {
        kind: 'worked',
        text: 'Project to improve the weekly production planning at a cable manufacturer. You draft a RACI for four deliverables.\n\nFor “new weekly planning meeting”: R the planner, A the operations manager, C the shift leads and sales, I the plant manager. For “capacity model” (a sheet showing how many hours each machine can make per week): R you, A the planner.\n\nThen you meet the sponsor, the plant manager, for 30 minutes and agree four things in writing: he chairs the steering group every four weeks, decides on scope within a week, opens the meeting with sales when you get stuck there, and tells the shift leads in the monthly meeting why this project matters.',
      },
      said: 'What you hear in projects: “The sponsor? Formally that’s the plant manager, but I haven’t seen him since the kick-off.”',
      recall: [
        {
          q: 'How many people should be Accountable for one deliverable?',
          options: ['None, the team is', 'Exactly one', 'Two, for backup', 'Everyone involved'],
          answer: 'Exactly one',
          why: 'With more than one, nobody truly owns the result.',
        },
        {
          q: 'Why should a client person be accountable for most deliverables?',
          options: ['It is cheaper', 'Consultants may not sign off', 'They must run it after you leave', 'It shortens the project'],
          answer: 'They must run it after you leave',
          why: 'Ownership during the project makes ownership after the project possible.',
        },
        {
          q: 'Two managers both think they decide on the shift pattern. What do you do?',
          options: ['Decide yourself, as the neutral party', 'Pick the most senior one', 'Leave it until it causes trouble', 'Ask them who decides if they disagree, and escalate to the sponsor if they can’t agree'],
          answer: 'Ask them who decides if they disagree, and escalate to the sponsor if they can’t agree',
          why: 'You surface the conflict early and let the right person settle it.',
        },
        {
          q: 'What is the best way to make the sponsor’s role explicit?',
          options: ['Agree concrete tasks with them in writing, like deciding on scope within a week', 'Name them on the title slide', 'Invite them to every meeting', 'Ask the team what they expect'],
          answer: 'Agree concrete tasks with them in writing, like deciding on scope within a week',
          why: 'Concrete, agreed tasks give you something to hold them to.',
        },
      ],
      situation: {
        scene: 'You’re starting a project at a grid operator. The sponsor, a regional director, says at the kick-off: “I fully support this. Just let me know if you need anything.” Then he leaves.',
        ask: 'What do you do in the next week?',
        model: 'Book 30 minutes with him. “Thanks for your support. To make it concrete: can I count on you to chair the steering group every four weeks, decide on scope changes within a week, and help when we get stuck with another department? And how do I reach you quickly when something is blocked?” Then send a short summary of what we agreed.',
        rubric: [
          'Follows up quickly instead of accepting general support',
          'Proposes concrete sponsor tasks',
          'Confirms the agreement in writing',
        ],
        pushback: {
          lines: [
            '“I told you, I support it. I don’t need to be in every meeting. That’s what I hired you for.”',
            '“A monthly steering group? My diary is full until March. Just send me an update now and then.”',
          ],
          model: '“I appreciate the trust, and you don’t need to be in every meeting. I need you for three decisions this quarter, and the teams need to see you behind it. Thirty minutes every four weeks is enough. Shall I ask your assistant for the first slot now?”',
          rubric: [
            'Acknowledges his trust and his full diary',
            'Makes concrete what the sponsor role needs',
            'Proposes a small, fixed slot and books it',
          ],
        },
      },
      sayIt: 'Explain to a new project member in 60 seconds what RACI means and why only one person can be accountable.',
      terms: [
        { term: 'RACI', def: 'Responsible, Accountable, Consulted, Informed: roles per deliverable.' },
        { term: 'Responsible', def: 'The person or people who do the work on a deliverable.' },
        { term: 'Accountable', def: 'The one person who owns the result and says it is done.' },
        { term: 'Consulted', def: 'People asked for input before a decision, in a two-way conversation.' },
        { term: 'Informed', def: 'People told about the result afterwards, one way.' },
        { term: 'Sponsor', def: 'The senior client person who backs the project, decides and removes obstacles.' },
      ],
    },
    {
      id: 'pm.plan.method',
      title: 'Choosing a way of working',
      pre: [
        {
          q: 'You are improving how a factory plans its maintenance, and nobody knows yet what the new process should look like. Which approach fits best?',
          options: ['Waterfall: design it fully, then implement', 'Short rounds where you try parts with the team and adjust', 'No plan at all, just start', 'Copy the process from another plant'],
          answer: 'Short rounds where you try parts with the team and adjust',
          why: 'When the solution is unknown, fast feedback beats a detailed design on paper.',
        },
      ],
      teach: [
        'Waterfall: phases in order, analyse, design, build, implement, with a fixed scope (what the project covers). It fits work that is predictable and hard to change later, like installing a new MS station (a medium-voltage substation in a neighbourhood) or moving a production line.\n\nYou plan once in detail and manage deviations. Each phase is signed off before the next one starts.',
        'Agile: work in short rounds, each ending with something working that users see and react to. Scope adjusts as you learn. The term comes from the Agile Manifesto, written by seventeen software developers in 2001.\n\nIt fits work where the solution is unclear and the users’ reaction matters, like a new planning meeting or a new dashboard (a screen of key figures) for shift leads.',
        'Scrum is the best-known agile method. Its rounds are called sprints: a fixed period of at most a month, often two weeks. Each sprint starts with a short planning and ends with a review, where users see the result, and a look back at how the team worked, the retrospective.\n\nIn a factory you rarely need the full method. The core is enough: short rounds, something real at the end of each, and feedback from the floor.',
        'Most improvement projects are hybrid: fixed milestones, budget and end date for the steering group, and short rounds inside. The steering group sees “pilot live in week 10”; the team works in two-week rounds towards it.\n\nA pilot is a small, bounded trial in one area, with an end date and a way back. Experts argue whether pilots prove much: a pilot with extra attention often does better than the rollout will.',
        'The people side: don’t sell jargon. A plant manager who hears “scrum” may think of software and chaos. Say: “We work in two-week rounds, and every round you’ll see something working on the floor.”\n\nResistance: “The board wants a full plan.” Give them the milestone plan; the rounds are how the team gets there. If you’re unsure which approach fits, ask: “How sure are we about what the solution looks like?”',
      ],
      example: {
        kind: 'worked',
        text: 'At a grid operator you lead a project to introduce a new readiness check (a check that permits, materials and crew are in place) before jobs enter the week plan. Nobody knows exactly which checks will matter.\n\nPlan for the steering group: baseline done week 4, pilot live week 8, go/no-go for rollout week 16. Inside: two-week rounds.\n\nRound 1: a paper checklist with five checks used by two planners. Review: “check 4 takes too long and never fails”, so you drop it. Round 2: add the switching plan check the control room asked for.\n\nBy week 8 the checklist has been tested on 60 real jobs, and the planners helped shape it, so they defend it.',
      },
      said: 'What you hear in projects: “Agile? We’re not a software company. We just need a plan with dates.”',
      recall: [
        {
          q: 'Which project fits waterfall best?',
          options: ['Designing a new shift handover with the operators', 'Building a dashboard nobody has seen before', 'Replacing an MS station (medium-voltage substation) to a fixed design', 'Testing a new way of planning maintenance'],
          answer: 'Replacing an MS station (medium-voltage substation) to a fixed design',
          why: 'Predictable work with a known design suits a sequential plan.',
        },
        {
          q: 'What should every short round end with?',
          options: ['A status report', 'Something working that users can react to', 'A new risk register', 'A steering group meeting'],
          answer: 'Something working that users can react to',
          why: 'The value of short rounds is the feedback from real users.',
        },
        {
          q: 'The board wants a full plan with dates. You want to work in rounds. What do you do?',
          options: ['Refuse, explaining agile', 'Give up on the rounds', 'Make a detailed plan for every task', 'Give them a milestone plan, with rounds inside to get there'],
          answer: 'Give them a milestone plan, with rounds inside to get there',
          why: 'Hybrid gives the board certainty on milestones and the team room to learn.',
        },
        {
          q: 'Which question helps you choose an approach?',
          options: ['“How sure are we about what the solution looks like?”', '“Which method is most modern?”', '“What did the last consultant use?”', '“How many people are in the team?”'],
          answer: '“How sure are we about what the solution looks like?”',
          why: 'Uncertainty about the solution is the main reason to work in short rounds.',
        },
      ],
      situation: {
        scene: 'You’re at a manufacturer of steel doors. The operations director says: “I want a complete design of the new production planning before we change anything. No experiments on my floor.”',
        ask: 'How do you respond?',
        model: '“Understood, you don’t want chaos on the floor. I’ll give you a plan with clear milestones and a go/no-go before anything goes live everywhere. To make sure the design works, I’d like to test it first with one team for two weeks, in a controlled way. Then you decide on the rollout based on what we saw.”',
        rubric: [
          'Acknowledges the director’s concern about the floor',
          'Offers milestones and a go/no-go for control',
          'Proposes a small, controlled test instead of jargon',
        ],
        pushback: {
          lines: [
            '“I’ve seen ‘pilots’ before. They turn my floor into a lab and nobody cleans up afterwards.”',
            '“If the design is good, why would you need to test it? Just do the work properly up front.”',
          ],
          model: '“Fair, a pilot that leaves a mess is worse than none. I’ll design it properly. The point is to check two assumptions before we roll it out everywhere: one cell (one small group of machines and people), four weeks, with an end date and a way back. At the end, you decide whether it goes wider.”',
          rubric: [
            'Acknowledges his bad experience and his need for control',
            'Holds to testing the key assumptions before a full rollout',
            'Proposes a bounded test with an end date and his decision',
          ],
        },
      },
      sayIt: 'Explain to a plant manager in 60 seconds when you would plan a project in one go and when in short rounds.',
      terms: [
        { term: 'Waterfall', def: 'Phases in a fixed order with a fixed scope, for predictable work.' },
        { term: 'Agile', def: 'Working in short rounds that each end in something users react to, adjusting scope as you learn.' },
        { term: 'Scrum', def: 'The best-known agile method, with fixed sprints, a review with users and a team look-back.' },
        { term: 'Sprint', def: 'A short round of one to four weeks ending in something users can react to.' },
        { term: 'Hybrid', def: 'Fixed milestones for the steering group, short rounds for the team.' },
        { term: 'Pilot', def: 'A small, bounded trial in one area, with an end date and a way back.' },
      ],
    },
  ],
};
