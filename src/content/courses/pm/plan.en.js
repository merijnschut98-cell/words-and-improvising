// pm.plan (EN): Plan, turning a goal into a plan people believe: breakdown, estimates, schedule, risks, roles and way of working.
export default {
  lessons: [
    {
      id: 'pm.plan.wbs',
      title: 'Breaking the work down',
      pre: [
        {
          q: 'Which is the best first line in the breakdown of a project to cut cancelled jobs at a grid operator?',
          options: ['“Analyse data”', '“Week 1: kick-off”', '“Baseline of cancellations by cause, agreed with the planning manager”', '“Hold workshops”'],
          answer: '“Baseline of cancellations by cause, agreed with the planning manager”',
          why: 'Start from deliverables, things that will exist and can be checked, not from activities.',
        },
      ],
      teach: [
        'Start with deliverables, not activities. A deliverable is something that exists at the end and that someone can check: “a baseline of cancellations by cause”, “a readiness check agreed by the planners”, “a six-week pilot in one region”. Ask: “If this project is done, what is there that isn’t there now?” Write four to seven deliverables. Activities come later, under each one.',
        'Then break each deliverable into work packages: pieces one person or a small team can do and finish. The 8–80 hour idea: a package smaller than about 8 hours is micromanagement, bigger than about 80 hours hides surprises and can’t be tracked. Each package gets a verb, an owner and a “done when”: “Classify 3 months of cancellations by cause, done when the planning manager agrees the categories.”',
        'Build the breakdown with the people who will do the work, not alone behind your laptop. Sticky notes on a wall, one deliverable per column, 60 minutes. People commit to what they helped break down. And they spot the packages you forgot, like data access, the works council or the training of the night shift.',
        'Resistance sounds like: “We don’t need all this planning, let’s just start.” Answer: “Agreed, we start this week. Give me one hour to see what we’re signing up for, so we don’t get surprised in month two.” When you don’t understand the technical work, ask the expert: “What needs to be finished before you can start this?” and “What would you deliver first?”',
      ],
      example: {
        kind: 'worked',
        text: 'At a grid operator, the goal is to cut last-week cancellations of planned MS jobs from 18% to under 8% in six months. With two planners and a team lead you put up four deliverables: (1) baseline of cancellations by cause, (2) a readiness check agreed by planning and the control room, (3) a six-week pilot in one region, (4) handover to all regional planners. Under (1): “extract 3 months of cancellations from the planning system” (16 hours, the data analyst), “classify by cause with two planners” (12 hours), “review with the planning manager” (4 hours). Under (3) someone adds “brief the switching technicians”, which you had missed.',
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
          q: 'A work package is estimated at 200 hours. By the 8–80 hour idea, what do you do?',
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
        scene: 'You’re at a food manufacturer. The plant manager hands you a project: “Reduce unplanned downtime on the filling lines by 30%.” Your team is a maintenance engineer, a shift lead and a planner. They are keen to start fixing things.',
        ask: 'How do you get to a breakdown without killing their energy?',
        model: '“Great that you want to start. Let’s spend one hour tomorrow on what this project must deliver, so we all aim at the same thing.” Then with sticky notes: what will exist at the end, like a downtime baseline per line, the top causes, fixes in place, a way to keep it up. Under each one, packages with an owner and a “done when”.',
        rubric: [
          'Keeps the energy by limiting planning to a short session',
          'Starts from deliverables, not activities',
          'Gives each package an owner and a “done when”',
        ],
      },
      sayIt: 'Explain to a new colleague in 60 seconds how you break a project down, from deliverables to work packages.',
      terms: [
        { term: 'Deliverable', def: 'Something that exists at the end of the project and can be checked.' },
        { term: 'Work package', def: 'A piece of work one person or small team can do and finish, with an owner and a “done when”.' },
        { term: '8–80 hour idea', def: 'Rule of thumb: work packages between about 8 and 80 hours of effort.' },
      ],
    },
    {
      id: 'pm.plan.estimate',
      title: 'Estimating honestly',
      pre: [
        {
          q: 'A team member says a task will take 5 days. What does research on the planning fallacy say usually happens?',
          options: ['It takes about 5 days', 'It is often done early', 'It takes noticeably longer than estimated', 'It depends only on the person’s experience'],
          answer: 'It takes noticeably longer than estimated',
          why: 'People plan from the best case and forget interruptions, waiting and other work.',
        },
      ],
      teach: [
        'Give ranges, not points. “Six to ten weeks” is more honest than “eight weeks”, and it shows where the uncertainty is. A three-point estimate asks for optimistic (O), most likely (M) and pessimistic (P). A common average is (O + 4M + P) / 6. For O = 4, M = 6, P = 14 days that gives 7 days, more than the “most likely” 6, because things can go much more wrong than right.',
        'Why people underestimate: they picture the work going smoothly, forget waiting for others, and forget their normal job. At clients this is the big one: a shift lead is “on the project” but has maybe 20% of his week free. Ask: “How many hours a week can you really spend on this?” Then convert effort to duration: 16 hours of work at 4 hours a week is four weeks.',
        'Buffers: don’t pad every task secretly; people then use the padding anyway. Put one visible buffer at the end of the project or before a hard milestone, and watch how fast it gets used. A buffer half gone at a quarter of the project is an early warning.',
        'The people side. When a client engineer says “two weeks”, don’t argue. Ask: “What’s the best case? And what could make it take longer?” He’ll give you the range himself. When you have to estimate something you don’t know, say so and give a range with what would narrow it: “Four to eight weeks. After the data check in week 2 I can tell you more precisely.”',
      ],
      example: {
        kind: 'worked',
        text: 'You plan a data analysis of breakdowns at a packaging plant. The maintenance engineer says: “Three days.” You ask for the best and worst case. Best: 2 days, if the data export works. Worst: 10 days, because the maintenance system has had a migration and the old data may be messy. Three-point: (2 + 4 × 3 + 10) / 6 = 4 days of effort. He can spend one day a week on it next to his normal work, so the duration is about 4 weeks, not 3 days. You put “data analysis: 3 to 6 weeks” in the plan and tell the sponsor that after the first export you’ll know which end it is.',
      },
      said: 'What you hear in projects: “That’s two days of work, tops. I’ll do it next week.”',
      recall: [
        {
          q: 'Three-point estimate: optimistic 4, most likely 6, pessimistic 14 days. With (O + 4M + P) / 6, what is the estimate in days?',
          number: 7,
          tolerance: 0.1,
          unit: 'days',
          why: '(4 + 24 + 14) / 6 = 42 / 6 = 7.',
        },
        {
          q: 'A shift lead needs 24 hours of work for a task and has 4 hours a week for the project. How many weeks will it take?',
          number: 6,
          tolerance: 0.1,
          unit: 'weeks',
          why: '24 / 4 = 6 weeks: effort is not duration.',
        },
        {
          q: 'Why put one visible buffer at the end instead of padding each task?',
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
        scene: 'You’re in a steering group at a metal parts manufacturer. The sponsor asks: “So when is the new planning process live?” You haven’t talked to IT yet about the system changes.',
        ask: 'What do you say?',
        model: '“My best estimate now is between June and September. The big unknown is the system change; I’m meeting IT next Tuesday, and after that I can narrow it to a month. I’ll send you the update on Wednesday.” Then actually do it.',
        rubric: [
          'Gives a range instead of a single date',
          'Names the biggest unknown honestly',
          'Says when and how the range will be narrowed',
        ],
      },
      sayIt: 'Explain to a client engineer in 60 seconds why you ask for a best case and a worst case instead of one number.',
      terms: [
        { term: 'Three-point estimate', def: 'Optimistic, most likely and pessimistic, often combined as (O + 4M + P) / 6.' },
        { term: 'Planning fallacy', def: 'The tendency to underestimate time by picturing the best case.' },
        { term: 'Effort vs duration', def: 'Hours of work versus calendar time, which depends on availability.' },
      ],
    },
    {
      id: 'pm.plan.schedule',
      title: 'Critical path and the one-page plan',
      pre: [
        {
          q: 'A task that is not on the critical path slips by one week. What happens to the end date?',
          options: ['It moves one week', 'It moves two weeks', 'The whole plan must be redone', 'Nothing, as long as the slip fits within that task’s slack'],
          answer: 'Nothing, as long as the slip fits within that task’s slack',
          why: 'Only the longest chain of dependent tasks sets the end date.',
        },
      ],
      teach: [
        'Dependencies: some work can only start when other work is finished. You can’t pilot the new readiness check before the planners agree on it. List them by asking each owner: “What do you need from someone else before you can start?” Most dependencies at clients are about people and decisions, not tasks: a sign-off, a works council, a production stop.',
        'The critical path is the longest chain of dependent work from start to finish. It sets the end date. Tasks off that path have slack: they can slip a bit without moving the end. So you watch the critical path closely and don’t panic about everything else. If you need to go faster, only shortening the critical path helps.',
        'Milestones are moments, not activities: “readiness check agreed”, “pilot starts”, “go/no-go for rollout”. Good milestones are decisions or visible results, about every three to six weeks. They give the steering group something to check and the team something to aim at.',
        'Put the plan on one page: deliverables as rows, weeks as columns, milestones as diamonds, an owner per row. Check it against the client’s calendar: shutdowns, holidays, peak season, steering group dates. Hang it on the wall where the team works. A plan people see every day gets corrected; a plan in a file gets forgotten.',
      ],
      example: {
        kind: 'worked',
        text: 'A planning project at a grid operator. Baseline analysis (A) takes 3 weeks. Then two chains: designing the readiness check (B, 4 weeks) and training the planners (D, 2 weeks) after it; and arranging system access for the pilot region (C, 6 weeks), also before the pilot. Pilot (E, 6 weeks) needs D and C. Chain A-B-D-E = 3 + 4 + 2 + 6 = 15 weeks. Chain A-C-E = 3 + 6 + 6 = 15 weeks. Both are critical. You ask IT whether the access request can start in week 1 instead of after the baseline: then C runs alongside A and the project ends in 15 weeks with 3 weeks of slack on the access chain.',
      },
      said: 'What you hear in projects: “That date’s fine, as long as IT delivers on time. Has anyone actually asked IT?”',
      recall: [
        {
          q: 'Two chains: A (3 weeks) then B (4) then D (2); and A (3) then C (6) then D (2). How many weeks is the critical path?',
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
        scene: 'You’re at a plastic parts manufacturer. Your plan says the new shift handover goes live in week 20. In a coffee chat, a team leader mentions the plant has a two-week shutdown in week 19 and half the operators then go on holiday.',
        ask: 'What do you do with this?',
        model: 'Thank him, and check the plan against the client calendar right away: shutdowns, holidays, peak season. Going live in week 20 with half the operators away is risky, so I’d propose either week 17 or after the holidays, and bring that to the sponsor with the reason. And I’d hang the one-page plan where the team can see it, so this kind of thing gets caught sooner.',
        rubric: [
          'Checks the plan against the client’s calendar',
          'Proposes a concrete alternative date with the reason to the sponsor',
          'Makes the plan visible so others can correct it',
        ],
      },
      sayIt: 'Explain to a client team in 60 seconds what the critical path is and why it matters for the end date.',
      terms: [
        { term: 'Critical path', def: 'The longest chain of dependent work; it sets the end date.' },
        { term: 'Slack', def: 'How much a task can slip without moving the end date.' },
        { term: 'Milestone', def: 'A moment with a decision or visible result, not an activity.' },
      ],
    },
    {
      id: 'pm.plan.risk',
      title: 'A risk register that gets used',
      pre: [
        {
          q: 'What is the main purpose of a pre-mortem?',
          options: ['Calculating the project budget', 'Assigning blame in advance', 'Making it safe to name why the project could fail', 'Replacing the risk register'],
          answer: 'Making it safe to name why the project could fail',
          why: 'Imagining failure as a fact makes people say what they would otherwise keep to themselves.',
        },
      ],
      teach: [
        'A risk is something that might happen and would hurt the project. For each one: likelihood, impact, an owner and an action with a date. “Data may be poor” is not useful. “The maintenance data before 2023 may be unusable after the migration; owner: Pieter; action: test export in week 1” is. An owner is a person, not a department.',
        'Most registers die after the kickoff. Keep yours alive: only the top five are discussed in each steering group, each with its owner saying what happened since. Risks that came true become issues and get handled as such. Add new risks as you hear them, often in the coffee machine conversation.',
        'The pre-mortem: “Imagine it’s six months from now and this project has failed. Write down, alone, why it failed.” Then collect the reasons one per person per round. Because the failure is imagined as fact, people name things they would not say otherwise: the sponsor might leave, the night shift won’t accept it, the IT change isn’t budgeted.',
        'The people side: some risks are sensitive, like “the plant manager doesn’t really believe in this”. Don’t write that in a register the plant manager reads. Word it as a theme (“sponsorship and visible support”) and discuss the real thing one-on-one with whoever can act on it. When you don’t know how likely something is, say so and plan a cheap test to find out.',
      ],
      example: {
        kind: 'worked',
        text: 'At the kick-off of a downtime project at a bakery, you run a 20-minute pre-mortem with six people. Reasons that come up: “maintenance never had time because of the summer peak” (three people), “operators stopped logging stops after two weeks”, “the new manager cancelled it”. You turn the top ones into register lines. Summer peak: likelihood high, impact high, owner the maintenance manager, action: plan the analysis before June and reserve 4 hours a week per technician. Logging: owner the shift lead, action: one-tap logging on the line terminal by week 3. Each steering group starts with these five.',
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
        scene: 'You’re at the kick-off of a project at a grid operator to speed up work preparation. The atmosphere is polite. Nobody raises any concerns, but you heard from a planner last week that “this has been tried twice before”.',
        ask: 'How do you surface the real risks?',
        model: 'I’d run a short pre-mortem: “Imagine it’s a year from now and this project failed, just like the earlier two. Write down alone why.” Then collect one reason per person per round. I’d also ask openly: “What happened with the earlier attempts?” and turn the top reasons into risks with an owner and an action.',
        rubric: [
          'Uses a pre-mortem or similar to make it safe to name risks',
          'Asks about the earlier attempts openly',
          'Turns reasons into risks with an owner and an action',
        ],
      },
      sayIt: 'Explain to a client team lead in 60 seconds how a pre-mortem works and why it helps.',
      terms: [
        { term: 'Risk register', def: 'List of risks with likelihood, impact, owner and a dated action.' },
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
          options: ['What the sponsor will actually do', 'Who takes notes', 'Who books the meeting rooms', 'Who the consultant is'],
          answer: 'What the sponsor will actually do',
          why: 'Sponsors are named but their tasks are rarely spelled out, so they quietly fade.',
        },
      ],
      teach: [
        'RACI per deliverable. Responsible: who does the work. Accountable: who owns the result and says “this is done”, exactly one person. Consulted: who gives input before. Informed: who hears after. Two names under A means nobody is accountable. A table with ten names that are all C means decisions will be slow.',
        'One owner per deliverable, from the client side where possible. You can be responsible for the analysis; the planning manager should be accountable for the new planning process, because he has to run it after you leave. If the client won’t own any deliverable, you have a project they are watching, not doing.',
        'Make the sponsor’s role explicit. Write it down with them: attends the steering group every four weeks, decides on scope changes within a week, removes obstacles you escalate, and explains to the organisation why this matters. Ask: “What can I count on you for, and how do I reach you when something is stuck?”',
        'The RACI conversation brings out conflicts. Two managers both think they decide about the shift pattern. Don’t solve it yourself: “I see two names here. Who decides if you disagree?” If they can’t agree, it goes to the sponsor. Better to find this out in week 2 than in week 12.',
      ],
      example: {
        kind: 'worked',
        text: 'Project to improve the weekly production planning at a cable manufacturer. You draft a RACI for four deliverables. For “new weekly planning meeting”: R the planner, A the operations manager, C the shift leads and sales, I the plant manager. For “capacity model”: R you, A the planner. Then you meet the sponsor, the plant manager, for 30 minutes and agree four things in writing: he chairs the steering group every four weeks, decides on scope within a week, opens the meeting with sales when you get stuck there, and tells the shift leads in the monthly meeting why this project matters.',
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
      },
      sayIt: 'Explain to a new project member in 60 seconds what RACI means and why only one person can be accountable.',
      terms: [
        { term: 'RACI', def: 'Responsible, Accountable, Consulted, Informed: roles per deliverable.' },
        { term: 'Accountable', def: 'The one person who owns the result and says it is done.' },
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
        'Waterfall: phases in order, analyse, design, build, implement, with a fixed scope. It fits work that is predictable and hard to change later, like installing a new MS station or moving a production line. You plan once in detail and manage deviations.',
        'Agile: short rounds (sprints) of one to four weeks, each ending with something working that users see and react to. Scope adjusts as you learn. It fits work where the solution is unclear and the users’ reaction matters, like a new planning meeting or a new dashboard for shift leads.',
        'Most improvement projects are hybrid: fixed milestones, budget and end date for the steering group, and short rounds inside. The steering group sees “pilot live in week 10”; the team works in two-week rounds towards it, each round ending with a short review where the floor tells you what works.',
        'The people side: don’t sell jargon. A plant manager who hears “scrum” may think of software and chaos. Say: “We work in two-week rounds, and every round you’ll see something working on the floor.” Resistance: “The board wants a full plan.” Give them the milestone plan; the rounds are how the team gets there. If you’re unsure which approach fits, ask: “How sure are we about what the solution looks like?”',
      ],
      example: {
        kind: 'worked',
        text: 'At a grid operator you lead a project to introduce a new readiness check before jobs enter the week plan. Nobody knows exactly which checks will matter. Plan for the steering group: baseline done week 4, pilot live week 8, go/no-go for rollout week 16. Inside: two-week rounds. Round 1: a paper checklist with five checks used by two planners. Review: “check 4 takes too long and never fails”, so you drop it. Round 2: add the switching plan check the control room asked for. By week 8 the checklist has been tested on 60 real jobs, and the planners helped shape it, so they defend it.',
      },
      said: 'What you hear in projects: “Agile? We’re not a software company. We just need a plan with dates.”',
      recall: [
        {
          q: 'Which project fits waterfall best?',
          options: ['Designing a new shift handover with the operators', 'Building a dashboard nobody has seen before', 'Replacing an MS station to a fixed design', 'Testing a new way of planning maintenance'],
          answer: 'Replacing an MS station to a fixed design',
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
      },
      sayIt: 'Explain to a plant manager in 60 seconds when you would plan a project in one go and when in short rounds.',
      terms: [
        { term: 'Waterfall', def: 'Phases in a fixed order with a fixed scope, for predictable work.' },
        { term: 'Sprint', def: 'A short round of one to four weeks ending in something users can react to.' },
        { term: 'Hybrid', def: 'Fixed milestones for the steering group, short rounds for the team.' },
      ],
    },
  ],
};
