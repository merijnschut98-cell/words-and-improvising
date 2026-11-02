// pm.intake (English): intake, from the client’s question to a project worth doing.
export default {
  lessons: [
    {
      id: 'pm.intake.ask',
      title: 'What they ask vs what they need',
      pre: [
        {
          q: 'A plant manager opens with: “We need a new planning tool.” What is that, most likely?',
          options: ['The problem to solve', 'A solution they already picked', 'The goal of the project', 'A scope boundary'],
          answer: 'A solution they already picked',
          why: 'Clients usually arrive with a solution; your job is to find the problem it is meant to solve.',
        },
      ],
      teach: [
        'Clients rarely bring a problem. They bring a solution (“we need a dashboard”) or a symptom (“orders are late”). Separate three layers. The symptom is what they see. The problem is what causes it. The goal is what should be different once it’s solved. A project aimed at the symptom fixes nothing; a project aimed at a solution they picked may fix the wrong thing.',
        'Questions that get underneath: “How do you notice it?”, “Since when?”, “What does it cost you per week?”, “What have you already tried?”, “What happens if nothing changes for a year?” Ask about one recent, concrete case instead of the general picture: “Walk me through last Tuesday’s late order.” A concrete case shows the real mechanism; the general picture shows their opinion.',
        'The people side: whoever asks often has their name tied to the solution they named. Don’t attack it. Say: “A planning tool could well be part of it. To make sure it pays off, can I first see where the delays come from?” Resistance sounds like “we’ve analysed this already”. Answer: “Great, then this will go quickly. Can you show me?”',
        'When you don’t know the technical side, say so and use it: “I don’t know your process yet, so I’ll ask some naive questions.” Clients respect a consultant who asks precise questions more than one who pretends to know. Write down their words literally. You will reuse them later in the goal sentence, and they will recognise them.',
      ],
      example: {
        kind: 'worked',
        text: 'At a grid operator, a team lead asks for “a better dashboard for the work orders”. You ask what he would do with it. “See which jobs are stuck.” Where do they get stuck? “Waiting for permits and materials.” How many? He checks: 140 of 600 open orders have waited more than 4 weeks, 90 of them for materials. Symptom: orders stuck. Problem: material reservations aren’t linked to the planning. Goal: no order waits more than 4 weeks for materials. The dashboard becomes one small part, not the project.',
      },
      said: 'What you hear in projects: “We don’t need a study, we need someone to just build the tool.”',
      recall: [
        {
          q: '“Our orders ship late” is best described as…',
          options: ['the goal', 'the problem', 'the symptom', 'the scope'],
          answer: 'the symptom',
          why: 'It’s what they see; the cause underneath is the problem.',
        },
        {
          q: 'Which question gets underneath the request best?',
          options: ['“Walk me through the last time it went wrong.”', '“Do you agree this is important?”', '“Which tool would you like?”', '“When should the project be finished?”'],
          answer: '“Walk me through the last time it went wrong.”',
          why: 'A concrete recent case shows the mechanism, not just the opinion.',
        },
        {
          q: 'The client insists on their own solution. What is the best response?',
          options: ['Tell them the solution is premature', 'Agree and start building to win trust', 'Ask them to send a formal request first', 'Accept it as a possible part and ask to first see where the problem comes from'],
          answer: 'Accept it as a possible part and ask to first see where the problem comes from',
          why: 'You keep their idea alive while checking it solves the real problem.',
        },
        {
          q: 'Why ask what the problem costs per week?',
          options: ['To set your fee', 'To size the problem so it can be weighed against the effort', 'To find out who is to blame', 'Because every sponsor wants a business case'],
          answer: 'To size the problem so it can be weighed against the effort',
          why: 'A problem without a size can’t be prioritised or judged worth a project.',
        },
      ],
      situation: {
        scene: 'You’re at a metal stamping plant. The operations manager opens with: “Our OEE is 58%, we want 75% within six months.” (OEE: the share of planned time the presses make good parts.) “ Can you put an improvement team on it?”',
        ask: 'What do you ask before agreeing to anything?',
        model: '“75% would be great. Before we commit: where do the 42 points go now, roughly, between breakdowns, changeovers, speed losses and scrap? And which press line hurts your deliveries most?” Then: “What have you tried so far, and what happens if OEE stays at 58?”',
        rubric: [
          'Does not accept or reject the target straight away',
          'Asks where the loss actually sits, per loss type or per line',
          'Asks what was already tried and what doing nothing costs',
        ],
      },
      sayIt: 'Explain to a new colleague in 60 seconds the difference between symptom, problem and goal, using a late-orders example.',
      terms: [
        { term: 'Symptom', def: 'What the client sees and complains about, such as late orders.' },
        { term: 'Problem', def: 'The cause underneath the symptom that a project can change.' },
        { term: 'Goal', def: 'What should be measurably different once the problem is solved.' },
      ],
    },
    {
      id: 'pm.intake.firsttalk',
      title: 'The first conversation',
      pre: [
        {
          q: 'In a 60-minute intake, how much of the time should the client be talking?',
          options: ['About half', 'About a quarter', 'It depends on their seniority', 'About three quarters'],
          answer: 'About three quarters',
          why: 'You learn by listening; aim for the client talking 70 to 80% of the time.',
        },
      ],
      teach: [
        'A simple structure. Open (5 minutes): why you’re here and what you’d like to leave with. Explore (35): their story, the problem, the people. Check (10): summarise back, ask what’s missing. Close (10): a next step with a date. Say the structure out loud at the start: “I’d like to mostly listen today and end with a concrete next step. Okay?” It puts people at ease.',
        'Use MORE PIES as your listening checklist. Mood: read the room. Open questions. Reflecting feelings: “That sounds frustrating.” Empathy. Paraphrasing: “So the main issue is…”. Inquiry: dig deeper into one thing. Experience: share your own briefly, only to build trust. Silence: wait three seconds after an answer. The important sentence often comes right after the pause.',
        'Resistance in a first talk is usually quiet: short answers, “it’s all in the report”, a phone face-up on the table. Name it lightly: “I get the sense this has been looked at before. What happened last time?” Often a previous consultant left a slide deck and nothing changed. Let them tell that story; it tells you what not to repeat.',
        'Leave with five things: the problem in their words, three names of people to talk to, which data you may see, what success means to the sponsor (the manager who pays and decides), and a date for the next step. Send a one-page summary within 24 hours. Anything you don’t know yet goes in that summary as an open question, not as a guess.',
      ],
      example: {
        kind: 'worked',
        text: 'At a dairy plant you meet the production manager for an hour. Minutes 0 to 5: you state the aim. 5 to 40: she describes a filling line with 6 changeovers a day of 50 minutes each. You paraphrase: “So five hours a day go to changeovers, and that is what blocks the extra volume?” She corrects you: “No, the cleaning is the bigger issue.” That correction is gold. 40 to 50: you summarise. 50 to 60: you agree to visit the line Thursday and talk to two shift leads. The summary goes out that evening.',
      },
      said: 'What you hear in projects: “We’ve had consultants here before. Nice slides, nothing changed.”',
      recall: [
        {
          q: 'Why paraphrase the client’s story back to them?',
          options: ['To show you took notes', 'To let them correct you, which surfaces what really matters', 'To speed up the meeting', 'To steer them toward your solution'],
          answer: 'To let them correct you, which surfaces what really matters',
          why: 'Corrections show where your picture differs from theirs.',
        },
        {
          q: 'The client gives short answers and says “it’s all in the report”. What’s the best move?',
          options: ['Go through the report together page by page', 'Switch to closed questions to get the facts', 'End early and reschedule', 'Name it lightly and ask what happened last time'],
          answer: 'Name it lightly and ask what happened last time',
          why: 'Quiet resistance often comes from an earlier project that went nowhere.',
        },
        {
          q: 'What does Silence in MORE PIES mean in practice?',
          options: ['Wait a few seconds after an answer before you speak', 'Don’t talk about your own experience', 'Keep bad news to yourself until you have data', 'Let the sponsor speak first in every meeting'],
          answer: 'Wait a few seconds after an answer before you speak',
          why: 'People fill the pause, often with the thing that matters most.',
        },
        {
          q: 'Which of these should you leave the first conversation with?',
          options: ['A signed project plan', 'A list of solutions to test', 'Names of people to talk to and a date for the next step', 'Agreement on the budget'],
          answer: 'Names of people to talk to and a date for the next step',
          why: 'A first talk is for understanding and access, not for commitments.',
        },
      ],
      situation: {
        scene: 'You’re in a first meeting with the asset manager of a grid operator about delays in replacing MS stations. After 15 minutes he says: “Honestly, I think the planners just aren’t good enough.”',
        ask: 'How do you respond in the moment?',
        model: 'Don’t agree and don’t defend the planners. Reflect and inquire: “That sounds like it has cost you a lot of frustration. What did you see happen that makes you say that?” Ask for a recent example, and later ask which planners you could talk to so you hear their side as well.',
        rubric: [
          'Neither agrees with nor argues against the blame',
          'Uses reflecting or inquiry to get a concrete example',
          'Plans to hear the other side, the planners themselves',
        ],
      },
      sayIt: 'Explain to a colleague in 60 seconds how you run a first client conversation, from opening to what you leave with.',
      terms: [
        { term: 'MORE PIES', def: 'Listening checklist: Mood, Open questions, Reflecting, Empathy, Paraphrasing, Inquiry, Experience, Silence.' },
        { term: 'Paraphrasing', def: 'Repeating the core of what someone said in your words so they can confirm or correct it.' },
        { term: 'Intake summary', def: 'One page sent within 24 hours: problem, people, data, success, next step, open questions.' },
      ],
    },
    {
      id: 'pm.intake.stakeholders',
      title: 'Who decides, who can stop it',
      pre: [
        {
          q: 'In an improvement project at a plant, who can most easily stop it without ever saying no?',
          options: ['The middle managers whose people have to work differently', 'The CEO', 'The external consultant', 'The finance department'],
          answer: 'The middle managers whose people have to work differently',
          why: 'They control people’s time; they stall a project quietly by not freeing anyone up.',
        },
      ],
      teach: [
        'Four roles. Sponsor: owns the budget and the result, and can decide. Owner: the manager who runs the process and has to live with the change. Users: the operators, planners or technicians whose daily work changes. Blockers: anyone whose interest, power or time is affected, often IT, the works council or a shift lead with 20 years of service. One person can hold two roles.',
        'A quick map: two axes, influence (can they stop or speed it up?) and interest (does it change their work?). High on both: involve weekly. High influence, low interest: keep satisfied, with short updates in their terms. Low influence, high interest: keep informed and use them in the work, they know the details. Draw it on paper in 15 minutes after the intake and update it monthly.',
        'Ask straight out: “Who decides whether this goes ahead?”, “Who could stop it, even without saying so?” and “Who has been through a project like this before?” People often answer the second with a laugh and a name. Write that name down. That person gets a one-on-one with you this week.',
        'Resistance rarely sounds like “no”. It looks like missed meetings, people who aren’t freed up, or “interesting, let’s discuss it in the MT” (the management team). Don’t escalate first. Go and ask: “What would this need to look like to work for your team?” Escalate to the sponsor only when a decision is truly blocked, and tell the person beforehand that you’re doing it.',
      ],
      example: {
        kind: 'worked',
        text: 'At a grid operator: a project to shorten connection lead times for small business customers. Sponsor: director of customer connections. Owner: head of work preparation. Users: 12 work planners and 40 field technicians. Influential and quiet: the IT owner of the planning system and the regional team leads who assign crews. Your map puts the team leads at high influence and high interest, yet nobody invited them. You book three one-on-ones in week one. One lead tells you crews get pulled to fault repairs 30% of the time. That becomes key data.',
      },
      said: 'What you hear in projects: “Interesting, let’s put it on the MT agenda.”',
      recall: [
        {
          q: 'Who is the sponsor?',
          options: ['The person with the most interest in the result', 'The manager who runs the process day to day', 'Whoever started the conversation', 'The person who owns the budget and the result and can decide'],
          answer: 'The person who owns the budget and the result and can decide',
          why: 'Without someone who can decide, every blocked choice stays blocked.',
        },
        {
          q: 'A stakeholder has high influence but low interest. What do you do?',
          options: ['Involve them in weekly working sessions', 'Keep them satisfied with short updates in their terms', 'Leave them out until the end', 'Ask them to become the sponsor'],
          answer: 'Keep them satisfied with short updates in their terms',
          why: 'They can stop you, but don’t want your detail; short updates keep them on side.',
        },
        {
          q: 'A shift lead keeps not freeing up operators for the workshops. What’s your first step?',
          options: ['Report it to the sponsor', 'Plan the workshops without his team', 'Ask him what it would need to look like to work for his team', 'Move the workshops to the weekend'],
          answer: 'Ask him what it would need to look like to work for his team',
          why: 'There’s usually a real reason, such as staffing or output targets; find it first.',
        },
        {
          q: 'Why ask “Who could stop this, even without saying so?”',
          options: ['It surfaces hidden blockers you need to talk to early', 'It shows the sponsor you are critical', 'It helps set the budget', 'It’s a standard risk register question'],
          answer: 'It surfaces hidden blockers you need to talk to early',
          why: 'The people who can stall you are rarely the ones on the org chart slide.',
        },
      ],
      situation: {
        scene: 'You’re two weeks into a changeover project at a packaging plant. The sponsor, the plant director, is enthusiastic. The maintenance manager has skipped both steering meetings (the monthly meeting with the sponsor) and his technicians are “too busy” for the pilot.',
        ask: 'What do you do this week?',
        model: 'See the maintenance manager one-on-one, not in the steering meeting. “I can see your team is under pressure and this pilot takes their time. What would it need to look like to work for you?” Listen for the real issue, such as a breakdown backlog or no say in the design. Only if a decision on capacity stays blocked, ask the sponsor to decide, and tell him first.',
        rubric: [
          'Talks one-on-one with the maintenance manager before escalating',
          'Asks what it needs to work for his team and listens for the real reason',
          'Escalates only on a blocked decision, and openly',
        ],
      },
      sayIt: 'Explain to a client’s project lead in 60 seconds why you want to talk to the team leads before the kick-off.',
      terms: [
        { term: 'Sponsor', def: 'Owns the budget and the result and can make decisions.' },
        { term: 'Process owner', def: 'The manager who runs the process day to day and lives with the change.' },
        { term: 'Stakeholder map', def: 'Everyone involved placed on influence and interest, to decide how to engage each.' },
        { term: 'Blocker', def: 'Someone who can slow or stop the project, often without saying no.' },
      ],
    },
    {
      id: 'pm.intake.done',
      title: 'Defining done',
      pre: [
        {
          q: 'Which of these is a usable project goal?',
          options: ['Improve the planning process', 'Make the line more efficient', 'Cut the average connection lead time for small business customers from 18 to 12 weeks by June', 'Implement a new planning tool'],
          answer: 'Cut the average connection lead time for small business customers from 18 to 12 weeks by June',
          why: 'Only this one has a baseline, a target and a date that someone can check.',
        },
      ],
      teach: [
        'Write a one-sentence goal: from X to Y by when, measured how. “Reduce unplanned stops on line 3 from 14 to 8 hours a week by 1 April, measured in the MES stop log.” (MES: the system that logs every stop.) If you can’t write that sentence, you don’t have a project yet, you have a wish. Write it with the client, in their words, and read it back to them.',
        'Baseline first. Without a measured starting point nobody can say you succeeded, and every result gets disputed. If the data doesn’t exist, measuring for two weeks is your first deliverable. Say it plainly: “I don’t know the current number yet, and honestly neither do you. Let’s measure before we promise anything.”',
        'Scope in and scope out. Write both down. Out matters more: “Line 3 only, not lines 1 and 2. Process and planning, not a new ERP system. No changes to shift patterns.” List the out-of-scope items people are likely to raise. When they come up later, you point to the list instead of having the argument again.',
        'Acceptance criteria: who signs off, on what evidence, and when. “The plant manager accepts when the average over four consecutive weeks is 8 hours or less.” Agree this at the start. By the end the mood in the room will be different and everyone will remember the promise differently.',
      ],
      example: {
        kind: 'worked',
        text: 'A food plant asks you to “reduce waste”. You measure first: 3.2% of output is scrapped, about 2,400 kg a week out of 75,000 kg, mostly at start-up after changeovers. Goal sentence: “Reduce scrap on the two filling lines from 3.2% to 2.0% by the end of Q2, measured in the weekly scrap report.” In scope: start-up after changeovers, machine settings, work instructions. Out of scope: the packaging supplier and recipes. Acceptance: the production manager signs off on four consecutive weeks at 2.0% or lower. That saves 900 kg a week.',
      },
      said: 'What you hear in projects: “Let’s not pin ourselves down on a number yet.”',
      recall: [
        {
          q: 'What makes the strongest goal sentence?',
          options: ['A baseline, a target and a date, plus how it’s measured', 'An ambitious target that motivates the team', 'A list of the activities you will carry out', 'The solution the client asked for'],
          answer: 'A baseline, a target and a date, plus how it’s measured',
          why: 'From X to Y by when, measured how: anyone can check it.',
        },
        {
          q: 'Why write down what is out of scope?',
          options: ['To lower your fee', 'Because the contract requires it', 'So you can point to it when people try to widen the project', 'To keep stakeholders at a distance'],
          answer: 'So you can point to it when people try to widen the project',
          why: 'An agreed list ends the discussion faster than an argument.',
        },
        {
          q: 'Scrap is 3.2% of a weekly output of 75,000 kg. The goal is 2.0%. How many kg of scrap per week does reaching the goal save?',
          number: 900,
          tolerance: 10,
          unit: 'kg',
          why: '3.2% of 75,000 is 2,400 kg; 2.0% is 1,500 kg; the difference is 900 kg.',
        },
        {
          q: 'There is no data on the current situation. What do you do?',
          options: ['Use the client’s estimate as the baseline', 'Skip the baseline and focus on the target', 'Borrow a benchmark from another plant', 'Make measuring for a short period the first deliverable'],
          answer: 'Make measuring for a short period the first deliverable',
          why: 'A measured baseline is the only one nobody can dispute at the end.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator. The sponsor wants the project goal to be “better collaboration between planning and the field teams”.',
        ask: 'How do you turn this into something measurable without losing the sponsor?',
        model: '“I like that, and I want us to be able to show it worked. When collaboration is better, what would you see happen? Fewer jobs rescheduled on the day? Crews arriving with the right material?” Pick one with him, for example “Reduce same-day rescheduled jobs from 22% to 10% by Q3, from the planning system”, and keep collaboration as the reason why.',
        rubric: [
          'Keeps the sponsor’s intent and asks what he would observe',
          'Turns it into from, to, by when, with a data source',
          'Agrees who signs off and on what evidence',
        ],
      },
      sayIt: 'Explain to a sponsor in 60 seconds why you want a measured baseline before you commit to a target.',
      terms: [
        { term: 'Baseline', def: 'The measured starting value that progress is compared against.' },
        { term: 'Scope', def: 'What the project covers and, just as important, what it explicitly does not.' },
        { term: 'Acceptance criteria', def: 'Who signs off, on which evidence, and when the result counts as done.' },
      ],
    },
    {
      id: 'pm.intake.start',
      title: 'The first weeks',
      pre: [
        {
          q: 'In the first weeks, what builds the most trust with the people on the floor?',
          options: ['A clear presentation of the project plan', 'Quickly fixing one small annoyance they raised', 'A kick-off led by the plant director', 'Sharing benchmark data from other plants'],
          answer: 'Quickly fixing one small annoyance they raised',
          why: 'It proves you listen and that talking to you leads to something.',
        },
      ],
      teach: [
        'Quick wins and foundations, in parallel. Quick wins are small, visible fixes that come from the people themselves: a missing tool, a printer that jams every shift. Foundations are slower: baseline data, clear roles, a meeting rhythm. Quick wins alone turn into a show. Foundations alone and people see nothing for six weeks and lose interest.',
        'Trust comes from doing what you said. Write down every promise, however small (“I’ll check that with IT”), and come back within the week, even if the answer is “no, and here’s why”. Spend the first two weeks mostly on the floor or with the crews, not in the meeting room. Ask before you suggest.',
        'Set the rhythm early: a weekly 30-minute check with the process owner, a short team stand-up, and a monthly steering meeting with the sponsor. Fixed day, fixed time, fixed agenda: progress against the goal, what’s blocked, which decisions are needed. A rhythm makes problems visible in week three instead of month four.',
        'Resistance in weeks 1 to 4 sounds like “we tried this in 2019” or “you don’t know our process”. Both are often true. Answer: “You’re right, I don’t know it the way you do. What went wrong in 2019?” That history tells you what to avoid. When you don’t know something, say “I’ll find out by Thursday”, and do.',
      ],
      example: {
        kind: 'worked',
        text: 'Week 1 at a pump assembly plant. You spend two days on the line and one with planning. Operators mention that the torque wrench is missing on second shift, costing about 20 minutes a shift. You raise it with the team lead; a second wrench arrives Wednesday for 400 euros. Meanwhile you start a two-week stop log as the baseline and agree Tuesday 9:00 as the weekly check with the production manager. By week 3 operators bring you problems without being asked. That’s your signal the trust is there.',
      },
      said: 'What you hear in projects: “Nice that you’re here. Let’s see if you’re still here in three months.”',
      recall: [
        {
          q: 'Why run quick wins and foundations in parallel?',
          options: ['Quick wins are cheaper', 'Foundations can wait until results show', 'Quick wins keep people engaged while the foundations make the result last', 'The sponsor always asks for both'],
          answer: 'Quick wins keep people engaged while the foundations make the result last',
          why: 'Either one alone fails: a show without a base, or a base nobody notices.',
        },
        {
          q: 'An operator says: “We tried this in 2019 and it failed.” What’s the best answer?',
          options: ['“This time it’s different.”', '“That was before my time.”', '“Let’s focus on the future.”', '“What went wrong in 2019?”'],
          answer: '“What went wrong in 2019?”',
          why: 'Their history shows you what to avoid, and asking shows respect.',
        },
        {
          q: 'A missing tool costs 20 minutes per shift on one shift, 5 days a week, 46 working weeks a year. How many hours a year is that?',
          number: 76.7,
          tolerance: 1,
          unit: 'hours',
          why: '20 × 5 × 46 = 4,600 minutes, which is about 76.7 hours.',
        },
        {
          q: 'What makes a weekly check useful?',
          options: ['Fixed time and agenda: progress, blocks, decisions needed', 'Inviting as many people as possible', 'A new slide deck every week', 'Only meeting when there is a problem'],
          answer: 'Fixed time and agenda: progress, blocks, decisions needed',
          why: 'Predictable and short means people show up and problems surface early.',
        },
      ],
      situation: {
        scene: 'You’re in week 2 at a grid operator’s regional depot. The field technicians are polite but say little. A senior technician mentions, almost in passing, that the van stock list hasn’t been updated in a year, so they often drive back to the warehouse.',
        ask: 'What do you do with this?',
        model: 'Treat it as both a quick win and a data point. “How often does that happen in a week? Who could update the list?” Then make sure it gets fixed within days, give him the credit openly when it is, and note the extra trips as a possible measure for the main goal.',
        rubric: [
          'Asks a follow-up to make it concrete: how often, who can fix it',
          'Gets it fixed quickly and gives the technician the credit',
          'Links it back to the baseline or the main goal',
        ],
      },
      sayIt: 'Explain to the process owner in 60 seconds why you’ll spend most of your first two weeks on the floor.',
      terms: [
        { term: 'Quick win', def: 'A small, visible fix raised by the people themselves, done within days.' },
        { term: 'Foundations', def: 'The slower groundwork: baseline, roles and rhythm that make results last.' },
        { term: 'Rhythm', def: 'Fixed meetings with a fixed agenda, weekly with the owner and monthly with the sponsor.' },
      ],
    },
    {
      id: 'pm.intake.no',
      title: 'Saying no, or reshaping',
      pre: [
        {
          q: 'A client wants a project, but nobody on their side has time to take part. What is the most likely outcome?',
          options: ['A report and no lasting change', 'The consultant delivers faster without distractions', 'The project costs less', 'The sponsor frees people up once results show'],
          answer: 'A report and no lasting change',
          why: 'Change that their own people didn’t make leaves with the consultant.',
        },
      ],
      teach: [
        'Red flags at intake: no sponsor who can decide; the solution is fixed and you’re only asked to sign it off; no time from their people; a goal nobody can measure; a hidden agenda (“we need this to justify a reorganisation”); a deadline set before anyone knows the problem. One flag is normal. Three means the project will probably fail, with your name on it.',
        'Reshape before you refuse. Most bad projects have a good one inside. Offer a smaller, sharper version: “Instead of all four lines in three months, let’s do line 2 in six weeks, with two operators per shift freed up four hours a week. If it works, we scale up.” Smaller scope, real commitment, proof first.',
        'How to push back: start from their goal, name the risk, then offer an option. “You want shorter lead times by summer. Without anyone from planning involved, I expect we deliver a report, not shorter lead times. That’s not worth your money. What I can propose is…” Never say “that’s not possible” without an alternative.',
        'If they still insist, put the conditions in writing and agree a checkpoint: “If the planners aren’t involved by week 4, we stop or rescope.” When you’re unsure whether to say no, involve your own manager before you commit. Saying no well often raises your credibility; clients remember who was honest with them.',
      ],
      example: {
        kind: 'worked',
        text: 'A machine builder asks you to “halve lead times across the whole plant in three months”. There is no time budgeted for their people, and the director will be away for half that period. Red flags: no sponsor present, no time, unrealistic scope. You propose one product family (35% of volume), eight weeks, a named deputy sponsor, and 4 hours a week from the planner and one team lead. Target: lead time for that family from 6 to 4 weeks. The director agrees, and the result becomes the case for the rest of the plant.',
      },
      said: 'What you hear in projects: “Can you just put it in a report? Then we can move forward.”',
      recall: [
        {
          q: 'Which is the strongest red flag at intake?',
          options: ['The client is sceptical about consultants', 'Nobody on the client side can decide or free up people', 'The data is kept in Excel', 'The deadline is six months away'],
          answer: 'Nobody on the client side can decide or free up people',
          why: 'Without a decider and people’s time, nothing you find gets implemented.',
        },
        {
          q: 'What is your first move with a project you think is set up to fail?',
          options: ['Offer a smaller, sharper version with real commitment', 'Refuse politely', 'Accept it and lower your own expectations', 'Escalate to their board'],
          answer: 'Offer a smaller, sharper version with real commitment',
          why: 'Most bad projects contain a good one; reshaping keeps the client and the result.',
        },
        {
          q: 'Which pushback works best?',
          options: ['“That’s not possible.”', '“Our method doesn’t allow that.”', '“We’ll do our best, but no promises.”', '“You want X. Without Y I expect a report, not X. What I propose is…”'],
          answer: '“You want X. Without Y I expect a report, not X. What I propose is…”',
          why: 'Start from their goal, name the risk, offer an option.',
        },
        {
          q: 'The client insists on the original plan. What protects you both?',
          options: ['Adding more consultants', 'Lowering the fee', 'Written conditions and a checkpoint to stop or rescope', 'Starting and hoping it improves'],
          answer: 'Written conditions and a checkpoint to stop or rescope',
          why: 'It turns a vague worry into a moment where both sides decide again.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator. A manager asks you to “prove” that the field teams are causing the delays, ahead of a reorganisation that seems to have been decided already.',
        ask: 'How do you respond?',
        model: '“I understand you need a clear picture before the reorganisation. I can’t start from the conclusion: the field teams will see it, and nothing I find will be trusted. What I can do is map in four weeks where the delays actually come from, across planning, materials and the field. If it’s the field teams, the data will show it.”',
        rubric: [
          'Addresses the hidden agenda without accusing anyone',
          'Explains the risk in the client’s own interest: a result nobody trusts',
          'Offers a reshaped, neutral alternative with a time frame',
        ],
      },
      sayIt: 'Explain to your own manager in 60 seconds why you want to reshape a project the client already wants to sign.',
      terms: [
        { term: 'Red flag', def: 'A sign at intake that the project is likely to fail as set up.' },
        { term: 'Rescope', def: 'Reshape the project to a smaller or different scope that can actually succeed.' },
        { term: 'Checkpoint', def: 'An agreed moment to decide whether to continue, stop or rescope.' },
      ],
    },
  ],
};
