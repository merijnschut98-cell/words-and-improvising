// pm.intake (English): intake, from the client’s question to a project worth doing.
export default {
  lessons: [
    {
      id: 'pm.intake.ask',
      title: 'What they ask vs what they need',
      pre: [
        {
          q: 'A plant manager (the person who runs the whole factory) opens with: “We need a new planning tool.” What is that, most likely?',
          options: ['The problem to solve', 'A solution they already picked', 'The goal of the project', 'A scope boundary (a limit on what the project covers)'],
          answer: 'A solution they already picked',
          why: 'Clients usually arrive with a solution; your job is to find the problem it is meant to solve.',
        },
      ],
      teach: [
        'Clients rarely bring a problem. They bring a solution (“we need a dashboard”, a screen full of figures) or a symptom (“orders are late”).\n\nSeparate three layers. The symptom is what they see. The problem is the cause underneath, the thing a project can actually change. The goal is what should be measurably different once it’s solved.\n\nA project aimed at the symptom fixes nothing; a project aimed at a solution they picked may fix the wrong thing.',
        'Questions that get underneath: “How do you notice it?”, “Since when?”, “What have you already tried?”\n\nThen size it: “What does it cost you per week?” and “What happens if nothing changes for a year?” That answer is the cost of inaction, the price of doing nothing. It tells you whether a project is worth it at all.\n\nAsk about one recent case: “Walk me through last Tuesday’s late order.” A concrete case shows the real mechanism; the general picture shows their opinion.',
        'A common opening is a target on a KPI (key performance indicator: a number management steers on), often OEE. OEE, overall equipment effectiveness, is the share of planned time a machine makes good parts at full speed.\n\n85% is often quoted as “world class”, a convention, not a measured norm; many plants measure around 60%. “From 58 to 75%” is still a wish at symptom level. Ask where the 42 missing percentage points go: breakdowns, changeovers (switching the machine to another product), slow running or scrap (rejected parts).',
        'The people side: whoever asks often has their name tied to the solution they named. Don’t attack it. Say: “A planning tool could well be part of it. To make sure it pays off, can I first see where the delays come from?”\n\nResistance sounds like “we’ve analysed this already”. Answer: “Great, then this will go quickly. Can you show me?” If they can’t show it, you’ve learned something too.',
        'Experts disagree on how hard to push. Some say: never accept the client’s solution before you have seen the problem. Others say: a client who picked a tool has often half-diagnosed it already. A fair middle: treat their solution as a hypothesis, a guess you check with data in a week or two.\n\nWhen you don’t know the technical side, say so: “I don’t know your process yet, so I’ll ask naive questions.” Write their words down literally; you’ll reuse them in the goal sentence.',
      ],
      example: {
        kind: 'worked',
        text: 'At a grid operator (the company that runs the local electricity network), a team lead asks for “a better dashboard for the work orders”, the jobs planned for the field crews. You ask what he would do with it.\n\n“See which jobs are stuck.” Where do they get stuck? “Waiting for permits and materials.”\n\nHow many? He checks: 140 of 600 open orders have waited more than 4 weeks, 90 of them for materials.\n\nSymptom: orders stuck. Problem: material reservations aren’t linked to the planning. Goal: no order waits more than 4 weeks for materials.\n\nThe dashboard becomes one small part, not the project.',
      },
      said: 'What you hear in projects: “We don’t need a study, we need someone to just build the tool.” The study they mean is the analysis of where the problem comes from.',
      recall: [
        {
          q: '“Our orders ship late” is best described as…',
          options: ['the goal', 'the problem', 'the symptom', 'the scope (what the project covers)'],
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
          options: ['To set your fee', 'To size the problem so it can be weighed against the effort', 'To find out who is to blame', 'Because every sponsor (the manager who pays) wants a business case (a sum of costs and benefits)'],
          answer: 'To size the problem so it can be weighed against the effort',
          why: 'A problem without a size can’t be prioritised or judged worth a project.',
        },
      ],
      situation: {
        scene: 'You’re at a metal stamping plant, where presses punch and bend sheet steel into parts. The operations manager opens with: “Our OEE is 58%, we want 75% within six months.” (OEE: the share of planned time the presses make good parts at full speed.) “Can you put an improvement team on it?”',
        ask: 'What do you ask before agreeing to anything?',
        model: '“75% would be great. Before we commit: where do the 42 points go now, roughly, between breakdowns, changeovers, speed losses and scrap? And which press line hurts your deliveries most?” Then: “What have you tried so far, and what happens if OEE stays at 58?”',
        rubric: [
          'Does not accept or reject the target straight away',
          'Asks where the loss actually sits, per loss type or per line',
          'Asks what was already tried and what doing nothing costs',
        ],
        pushback: {
          lines: [
            '“We’ve looked at this for years. We know where the losses are. I need people on the floor, not more questions.”',
            '“Six months is what I promised the board. If you start with analysis, we lose two of them.”',
          ],
          model: '“Fair, you know these presses far better than I do. Then this goes fast: show me your losses by type this week, and on Monday we put the team on the biggest loss. No months of analysis; one week, then we fix.”',
          rubric: [
            'Acknowledges his knowledge and his deadline',
            'Holds to knowing where the loss sits before choosing a fix',
            'Proposes a short step with a date',
          ],
        },
      },
      sayIt: 'Explain to a new colleague in 60 seconds the difference between symptom, problem and goal, using a late-orders example.',
      terms: [
        { term: 'Symptom', def: 'What the client sees and complains about, such as late orders.' },
        { term: 'Problem', def: 'The cause underneath the symptom that a project can change.' },
        { term: 'Goal', def: 'What should be measurably different once the problem is solved.' },
        { term: 'Cost of inaction', def: 'What it costs the client if nothing changes, for example per week or per year; it sizes the problem.' },
        { term: 'OEE', def: 'Overall equipment effectiveness: the share of planned time a machine makes good parts at full speed.' },
      ],
    },
    {
      id: 'pm.intake.firsttalk',
      title: 'The first conversation',
      pre: [
        {
          q: 'In a 60-minute intake (the first conversation about a possible project), how much of the time should the client be talking?',
          options: ['About half', 'About a quarter', 'It depends on their seniority', 'About three quarters'],
          answer: 'About three quarters',
          why: 'You learn by listening; aim for the client talking 70 to 80% of the time.',
        },
      ],
      teach: [
        'A simple structure for a 60-minute intake.\n\nOpen (5 minutes): why you’re here and what you’d like to leave with. Explore (35): their story, the problem, the people. Check (10): summarise back, ask what’s missing. Close (10): a next step with a date.\n\nSay the structure out loud at the start: “I’d like to mostly listen today and end with a concrete next step. Okay?” It puts people at ease.',
        'Use MORE PIES as your listening checklist.\n\nMood: read the room. Open questions: questions that can’t be answered with yes or no, like “How does a normal Monday go?”. Reflecting: naming the feeling you hear, “That sounds frustrating.”\n\nEmpathy. Paraphrasing: repeating the core in your own words, “So the main issue is…”. Inquiry: dig deeper into one thing. Experience: share your own briefly, only to build trust. Silence: wait three seconds after an answer.',
        'Why it works: people correct a wrong paraphrase much more readily than they volunteer the full story. The correction is where the real issue shows.\n\nAim for the client talking 70 to 80% of the time. If you notice you’ve talked for two minutes straight, stop and ask a question. Juniors often fill silences out of nerves; the important sentence often comes right after the pause.',
        'Resistance in a first talk is usually quiet: short answers, “it’s all in the report”, a phone face-up on the table. Name it lightly: “I get the sense this has been looked at before. What happened last time?”\n\nOften a previous consultant left a slide deck and nothing changed. Let them tell that story; it tells you what not to repeat. Experts differ on taking notes on a laptop; a paper notebook feels less like an interrogation.',
        'Leave with five things: the problem in their words, three names of people to talk to, which data you may see, what success means to the sponsor (the manager who pays and decides), and a date for the next step.\n\nSend an intake summary within 24 hours: one page with those five things. Anything you don’t know yet goes in as an open question, not as a guess. A sharp closing question: “What would make you say in six months that this was worth it?”',
      ],
      example: {
        kind: 'worked',
        text: 'At a dairy plant you meet the production manager for an hour. Minutes 0 to 5: you state the aim.\n\n5 to 40: she describes a filling line with 6 changeovers a day (switching the line to another product) of 50 minutes each. You paraphrase: “So five hours a day go to changeovers, and that is what blocks the extra volume?”\n\nShe corrects you: “No, the cleaning is the bigger issue.” That correction is gold.\n\n40 to 50: you summarise. 50 to 60: you agree to visit the line Thursday and talk to two shift leads. The summary goes out that evening.',
      },
      said: 'What you hear in projects: “We’ve had consultants here before. Nice slides, nothing changed.”',
      recall: [
        {
          q: 'Why paraphrase (repeat in your own words) the client’s story back to them?',
          options: ['To show you took notes', 'To let them correct you, which surfaces what really matters', 'To speed up the meeting', 'To steer them toward your solution'],
          answer: 'To let them correct you, which surfaces what really matters',
          why: 'Corrections show where your picture differs from theirs.',
        },
        {
          q: 'The client gives short answers and says “it’s all in the report”. What’s the best move?',
          options: ['Go through the report together page by page', 'Switch to closed questions (yes/no questions) to get the facts', 'End early and reschedule', 'Name it lightly and ask what happened last time'],
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
        scene: 'You’re in a first meeting with the asset manager of a grid operator (the person responsible for the cables and stations over their lifetime). The topic is delays in replacing MS stations: medium-voltage substations, the cabinets in neighbourhoods that bring 10,000 to 20,000 volts down to household level. After 15 minutes he says: “Honestly, I think the planners just aren’t good enough.”',
        ask: 'How do you respond in the moment?',
        model: 'Don’t agree and don’t defend the planners. Reflect and inquire: “That sounds like it has cost you a lot of frustration. What did you see happen that makes you say that?” Ask for a recent example, and later ask which planners you could talk to so you hear their side as well.',
        rubric: [
          'Neither agrees with nor argues against the blame',
          'Uses reflecting or inquiry to get a concrete example',
          'Plans to hear the other side, the planners themselves',
        ],
        pushback: {
          lines: [
            '“Come on, I’ve worked with these planners for years. You don’t need to dig, I’m telling you what the problem is.”',
            '“So you think I’m wrong? I hired you to fix the planning, not to question my people.”',
          ],
          model: '“I don’t think you’re wrong; I want to see it the way you see it. If it’s the planners, the last three late stations will show that quickly. Can we go through those together on Thursday? Then I’ll know where to start.”',
          rubric: [
            'Acknowledges his view without agreeing or arguing',
            'Keeps asking for concrete cases before a conclusion',
            'Proposes a specific next look at real cases',
          ],
        },
      },
      sayIt: 'Explain to a colleague in 60 seconds how you run a first client conversation, from opening to what you leave with.',
      terms: [
        { term: 'MORE PIES', def: 'Listening checklist: Mood, Open questions, Reflecting, Empathy, Paraphrasing, Inquiry, Experience, Silence.' },
        { term: 'Open questions', def: 'Questions that can’t be answered with yes or no, so the other person tells the story.' },
        { term: 'Reflecting', def: 'Naming the feeling you hear (“that sounds frustrating”) so the person feels heard and goes on.' },
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
        'A stakeholder is anyone who affects the project or is affected by it. Four roles matter most.\n\nSponsor: owns the budget and the result, and can decide. Process owner: the manager who runs the process and has to live with the change. Users: the operators, planners or technicians whose daily work changes.\n\nBlockers: anyone whose interest, power or time is affected, often IT, the works council (elected staff with a legal say in big changes) or a shift lead with 20 years of service. One person can hold two roles.',
        'A stakeholder map has two axes: influence (can they stop or speed it up?) and interest (does it change their work?). It is usually credited to Mendelow (1981, often cited as 1991).\n\nHigh on both: involve weekly. High influence, low interest: keep satisfied, with short updates in their terms. Low influence, high interest: keep informed and use them in the work, they know the details.\n\nDraw it on paper in 15 minutes after the intake and update it monthly. People move on the map as the project moves.',
        'Ask straight out: “Who decides whether this goes ahead?”, “Who could stop it, even without saying so?” and “Who has been through a project like this before?”\n\nPeople often answer the second with a laugh and a name. Write that name down. That person gets a one-on-one with you this week.\n\nIn the Netherlands, check early whether the works council must be involved. Under the Works Councils Act (WOR, art. 27), changes to working-time rules such as shift patterns need its consent; skipping it can stop a project for months.',
        'Resistance rarely sounds like “no”. It looks like missed meetings, people who aren’t freed up, or “interesting, let’s discuss it in the MT” (the management team).\n\nDon’t escalate first. Escalation means taking a blocked issue to someone higher up who can decide. Go and ask first: “What would this need to look like to work for your team?” Escalate to the sponsor only when a decision is truly blocked, and tell the person beforehand that you’re doing it.',
        'A typical failure: the map holds only names from the org chart (the diagram of who reports to whom). The real power often sits with a planner everyone asks for advice, or the union rep.\n\nExperts argue whether to show the map to the client. Many keep a neutral version for the team and their own notes private: “low support” on a slide the person may see does damage. A sharp question for the sponsor: “Whose support do we need that we don’t have yet?”',
      ],
      example: {
        kind: 'worked',
        text: 'At a grid operator: a project to shorten connection lead times (the weeks from request to working connection) for small business customers. Sponsor: director of customer connections. Process owner: head of work preparation (the team that gets permits, materials and crews ready before a job). Users: 12 work planners and 40 field technicians.\n\nInfluential and quiet: the IT owner of the planning system and the regional team leads who assign crews. Your map puts the team leads at high influence and high interest, yet nobody invited them. You book three one-on-ones in week one.\n\nOne lead tells you crews get pulled to fault repairs 30% of the time. That becomes key data.',
      },
      said: 'What you hear in projects: “Interesting, let’s put it on the MT agenda.” Often that means: not now, and maybe never.',
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
          options: ['It surfaces hidden blockers you need to talk to early', 'It shows the sponsor you are critical', 'It helps set the budget', 'It’s a standard question from the risk register (the project’s list of risks)'],
          answer: 'It surfaces hidden blockers you need to talk to early',
          why: 'The people who can stall you are rarely the ones on the org chart slide.',
        },
      ],
      situation: {
        scene: 'You’re two weeks into a changeover project at a packaging plant: the aim is faster switching of the lines between products. The sponsor, the plant director, is enthusiastic. The maintenance manager has skipped both steering meetings (the monthly meeting where the sponsor checks progress and decides) and his technicians are “too busy” for the pilot, the small trial on one line.',
        ask: 'What do you do this week?',
        model: 'See the maintenance manager one-on-one, not in the steering meeting. “I can see your team is under pressure and this pilot takes their time. What would it need to look like to work for you?” Listen for the real issue, such as a breakdown backlog or no say in the design. Only if a decision on capacity stays blocked, ask the sponsor to decide, and tell him first.',
        rubric: [
          'Talks one-on-one with the maintenance manager before escalating',
          'Asks what it needs to work for his team and listens for the real reason',
          'Escalates only on a blocked decision, and openly',
        ],
        pushback: {
          lines: [
            '“Look, my people keep the lines running. Your pilot is nice, but if a line stops, that’s on me, not on you.”',
            '“The director wants this, fine. Nobody asked me. So don’t expect me to free up technicians.”',
          ],
          model: '“You’re right, nobody asked you, and that was a mistake on our side. You carry the risk if a line stops. So help me set up the pilot so it doesn’t: which line and which hours would cost you least? I’d like to take your answer to the next steering meeting.”',
          rubric: [
            'Acknowledges his risk and that he was left out',
            'Keeps the pilot and his part in it on the table',
            'Proposes a concrete way to let him shape it',
          ],
        },
      },
      sayIt: 'Explain to a client’s project lead in 60 seconds why you want to talk to the team leads before the kick-off, the first meeting where the project officially starts.',
      terms: [
        { term: 'Stakeholder', def: 'Anyone who affects the project or is affected by it.' },
        { term: 'Sponsor', def: 'Owns the budget and the result and can make decisions.' },
        { term: 'Process owner', def: 'The manager who runs the process day to day and lives with the change.' },
        { term: 'Stakeholder map', def: 'Everyone involved placed on influence and interest, to decide how to engage each.' },
        { term: 'Blocker', def: 'Someone who can slow or stop the project, often without saying no.' },
        { term: 'Escalation', def: 'Taking a blocked decision to someone higher up who can make it, openly and as a last step.' },
      ],
    },
    {
      id: 'pm.intake.done',
      title: 'Defining done',
      pre: [
        {
          q: 'Which of these is a usable project goal?',
          options: ['Improve the planning process', 'Make the line more efficient', 'Cut the average connection lead time (weeks from request to working connection) for small business customers from 18 to 12 weeks by June', 'Implement a new planning tool'],
          answer: 'Cut the average connection lead time (weeks from request to working connection) for small business customers from 18 to 12 weeks by June',
          why: 'Only this one has a starting value, a target and a date that someone can check.',
        },
      ],
      teach: [
        'Write a one-sentence goal: from X to Y by when, measured how. “Reduce unplanned stops on line 3 from 14 to 8 hours a week by 1 April, measured in the MES stop log.” (MES: the manufacturing execution system, the software on the floor that logs every stop.)\n\nIf you can’t write that sentence, you don’t have a project yet, you have a wish. Write it with the client, in their words, and read it back to them.',
        'Baseline first: the measured starting value you compare against later. Without it nobody can say you succeeded, and every result gets disputed.\n\nIf the data doesn’t exist, measuring for two weeks is your first deliverable (something you hand over that can be checked). Say it plainly: “I don’t know the current number yet, and honestly neither do you. Let’s measure before we promise anything.” Two weeks catches a normal weekly pattern; a seasonal business may need longer.',
        'Scope is what the project covers. Write down in scope and out of scope. Out matters more: “Line 3 only, not lines 1 and 2. Process and planning, not a new ERP system (the company-wide software for orders, stock and finance). No changes to shift patterns.”\n\nList the out-of-scope items people are likely to raise. When they come up later, you point to the list instead of having the argument again.',
        'Scope creep is the slow widening of a project, one reasonable request at a time: “while you’re at it, could you also look at line 2?” Each one sounds small; together they eat your weeks.\n\nDon’t just say no. Say: “Good idea. It’s out of scope now, so either we swap it for something, or the sponsor adds time.” A sharp question when someone adds work: “What do we drop to make room?”',
        'Acceptance criteria: who signs off, on what evidence, and when. “The plant manager accepts when the average over four consecutive weeks is 8 hours or less.” Four weeks guards against one lucky week.\n\nAgree this at the start. By the end the mood in the room will be different and everyone will remember the promise differently. Experts argue about stretch targets; an ambitious number motivates some teams, but a target nobody believes gets quietly ignored.',
      ],
      example: {
        kind: 'worked',
        text: 'A food plant asks you to “reduce waste”. You measure first: 3.2% of output is scrapped, about 2,400 kg a week out of 75,000 kg, mostly at start-up after changeovers (switching the line to another product). Goal sentence: “Reduce scrap on the two filling lines from 3.2% to 2.0% by the end of Q2 (April to June), measured in the weekly scrap report.”\n\nIn scope: start-up after changeovers, machine settings, work instructions. Out of scope: the packaging supplier and recipes. Acceptance: the production manager signs off on four consecutive weeks at 2.0% or lower.\n\nThat saves 900 kg a week.',
      },
      said: 'What you hear in projects: “Let’s not pin ourselves down on a number yet.” Sometimes that’s fair caution; often it’s a way to never be measured.',
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
          q: 'Scrap is 3.2% of a weekly output of 75,000 kg. The goal is 2.0% of the same weekly output. How many kg of scrap per week does reaching the goal save?',
          number: 900,
          tolerance: 10,
          unit: 'kg',
          why: '3.2% of 75,000 is 2,400 kg; 2.0% is 1,500 kg; the difference is 900 kg.',
        },
        {
          q: 'There is no data on the current situation. What do you do?',
          options: ['Use the client’s estimate as the baseline', 'Skip the baseline and focus on the target', 'Borrow a benchmark (a figure from another company) from another plant', 'Make measuring for a short period the first deliverable'],
          answer: 'Make measuring for a short period the first deliverable',
          why: 'A measured baseline is the only one nobody can dispute at the end.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator. The sponsor wants the project goal to be “better collaboration between planning and the field teams”, the crews who do the work on site.',
        ask: 'How do you turn this into something measurable without losing the sponsor?',
        model: '“I like that, and I want us to be able to show it worked. When collaboration is better, what would you see happen? Fewer jobs rescheduled on the day? Crews arriving with the right material?” Pick one with him, for example “Reduce same-day rescheduled jobs from 22% to 10% by the end of Q3 (September), from the planning system”, and keep collaboration as the reason why.',
        rubric: [
          'Keeps the sponsor’s intent and asks what he would observe',
          'Turns it into from, to, by when, with a data source',
          'Agrees who signs off and on what evidence',
        ],
        pushback: {
          lines: [
            '“You consultants always want a number. Collaboration isn’t a number. Everyone knows what I mean.”',
            '“If we put a hard target in, the teams will feel judged. I don’t want that.”',
          ],
          model: '“Agreed, collaboration itself isn’t a number. But you’ll notice it somewhere: fewer jobs bounced back, fewer trips for nothing. If we pick one of those, we can show the board it worked. We measure the process, not the people. Shall I bring two options on Friday?”',
          rubric: [
            'Acknowledges that collaboration is not a number in itself',
            'Holds to one observable measure of done',
            'Proposes concrete options and a moment to choose',
          ],
        },
      },
      sayIt: 'Explain to a sponsor in 60 seconds why you want a measured baseline before you commit to a target.',
      terms: [
        { term: 'Baseline', def: 'The measured starting value that progress is compared against.' },
        { term: 'Scope', def: 'What the project covers and, just as important, what it explicitly does not.' },
        { term: 'Out of scope', def: 'The written list of things the project will not do, to point to when they come up.' },
        { term: 'Scope creep', def: 'The slow widening of a project through small extra requests, without extra time or money.' },
        { term: 'Acceptance criteria', def: 'Who signs off, on which evidence, and when the result counts as done.' },
      ],
    },
    {
      id: 'pm.intake.start',
      title: 'The first weeks',
      pre: [
        {
          q: 'In the first weeks, what builds the most trust with the people on the floor?',
          options: ['A clear presentation of the project plan', 'Quickly fixing one small annoyance they raised', 'A kick-off (official start meeting) led by the plant director', 'Sharing benchmark data (figures from other companies) from other plants'],
          answer: 'Quickly fixing one small annoyance they raised',
          why: 'It proves you listen and that talking to you leads to something.',
        },
      ],
      teach: [
        'Quick wins and foundations, in parallel. A quick win is a small, visible fix that comes from the people themselves: a missing tool, a printer that jams every shift. Foundations are the slower groundwork: baseline data, clear roles, a meeting rhythm.\n\nQuick wins alone turn into a show. Foundations alone and people see nothing for six weeks and lose interest. A rough balance: one or two quick wins in each of the first four weeks.',
        'The kick-off is the meeting where the project officially starts: goal, scope, roles, first steps. Keep it short, about an hour, and let the sponsor say why it matters, in his own words.\n\nTrust comes after that, from doing what you said. Write down every promise, however small (“I’ll check that with IT”), and come back within the week, even if the answer is “no, and here’s why”.',
        'Spend the first two weeks mostly on the floor or with the crews, not in the meeting room. Ask before you suggest. Stand at the line during a changeover; ride along with a field crew for a day.\n\nWhat you see there beats any report: the operator walking 40 metres for a tool, the planner phoning three people for one answer. Write down times and counts, not just impressions.',
        'Set the rhythm early: fixed meetings with a fixed agenda. A weekly 30-minute check with the process owner, a short team stand-up (15 minutes, standing, what’s done and what’s stuck), and a monthly steering group: the meeting where the sponsor checks progress and takes decisions.\n\nFixed day, fixed time, fixed agenda: progress against the goal, what’s blocked, which decisions are needed. A rhythm makes problems visible in week three instead of month four.',
        'Resistance in weeks 1 to 4 sounds like “we tried this in 2019” or “you don’t know our process”. Both are often true.\n\nAnswer: “You’re right, I don’t know it the way you do. What went wrong in 2019?” That history tells you what to avoid.\n\nA common failure: the consultant chases so many quick wins that the baseline never gets measured. A sharp check at week 4: “Do we know the starting number yet?”',
      ],
      example: {
        kind: 'worked',
        text: 'Week 1 at a pump assembly plant. You spend two days on the line and one with planning.\n\nOperators mention that the torque wrench (a wrench that tightens bolts to an exact force) is missing on second shift, costing about 20 minutes a shift. You raise it with the team lead; a second wrench arrives Wednesday for 400 euros. Meanwhile you start a two-week stop log as the baseline and agree Tuesday 9:00 as the weekly check with the production manager.\n\nBy week 3 operators bring you problems without being asked. That’s your signal the trust is there.',
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
          q: 'A missing tool costs 20 minutes a day, on one shift only, 5 days a week, 46 working weeks a year. How many hours a year is that?',
          number: 76.7,
          tolerance: 1,
          unit: 'hours',
          why: '20 × 5 × 46 = 4,600 minutes; 4,600 / 60 is about 76.7 hours.',
        },
        {
          q: 'What makes a weekly check useful?',
          options: ['Fixed time and agenda: progress, blocks, decisions needed', 'Inviting as many people as possible', 'A new slide deck every week', 'Only meeting when there is a problem'],
          answer: 'Fixed time and agenda: progress, blocks, decisions needed',
          why: 'Predictable and short means people show up and problems surface early.',
        },
      ],
      situation: {
        scene: 'You’re in week 2 at a grid operator’s regional depot. The field technicians are polite but say little. A senior technician mentions, almost in passing, that the van stock list (the standard set of parts each van should carry) hasn’t been updated in a year, so they often drive back to the warehouse.',
        ask: 'What do you do with this?',
        model: 'Treat it as both a quick win and a data point. “How often does that happen in a week? Who could update the list?” Then make sure it gets fixed within days, give him the credit openly when it is, and note the extra trips as a possible measure for the main goal.',
        rubric: [
          'Asks a follow-up to make it concrete: how often, who can fix it',
          'Gets it fixed quickly and gives the technician the credit',
          'Links it back to the baseline or the main goal',
        ],
        pushback: {
          lines: [
            '“The van stock list? That’s not what you’re here for. Stick to the planning project.”',
            '“And honestly, the guys complain about everything. If we chase every comment, nothing gets done.”',
          ],
          model: '“Fair, it’s not in the scope. But trips back to the warehouse cost planned hours, and that is my project. Let me check it quickly: I’ll ask three technicians to note their warehouse trips this week. If it’s small, I drop it. If it’s big, you decide.”',
          rubric: [
            'Acknowledges the scope and his worry',
            'Links the remark to the project’s own goal',
            'Proposes a small, quick check and leaves the decision with him',
          ],
        },
      },
      sayIt: 'Explain to the process owner in 60 seconds why you’ll spend most of your first two weeks on the floor.',
      terms: [
        { term: 'Quick win', def: 'A small, visible fix raised by the people themselves, done within days.' },
        { term: 'Foundations', def: 'The slower groundwork: baseline, roles and rhythm that make results last.' },
        { term: 'Kick-off', def: 'The meeting where the project officially starts: goal, scope, roles and first steps.' },
        { term: 'Steering group', def: 'The regular meeting, often monthly, where the sponsor checks progress and takes decisions.' },
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
        'A red flag is a sign at intake that the project will probably fail as set up. The common ones: no sponsor who can decide; the solution is fixed and you’re only asked to sign it off; no time from their people; a goal nobody can measure; a deadline set before anyone knows the problem.\n\nOne flag is normal. Three means the project will probably fail, with your name on it.',
        'The hardest flag to spot is a hidden agenda: the real reason for the project differs from the one you’re told. “We need this to justify a reorganisation” rarely gets said out loud.\n\nSigns: the conclusion seems decided before the analysis, people avoid the question “what will you do with the result?”, or some departments are left out of the interviews. Ask it directly and kindly: “What decision will this help you make?”',
        'Reshape before you refuse. Most bad projects have a good one inside. To rescope is to reshape a project into a smaller or different one that can succeed.\n\nOffer a sharper version: “Instead of all four lines in three months, let’s do line 2 in six weeks, with two operators per shift freed up four hours a week. If it works, we scale up.” Smaller scope, real commitment, proof first.',
        'How to push back: start from their goal, name the risk, then offer an option. “You want shorter lead times by summer. Without anyone from planning involved, I expect we deliver a report, not shorter lead times. That’s not worth your money. What I can propose is…”\n\nNever say “that’s not possible” without an alternative. Experts differ on whether a junior should ever refuse alone; most firms want a partner or manager in that decision.',
        'If they still insist, put the conditions in writing and agree a checkpoint: a fixed moment to decide whether to continue, stop or rescope. “If the planners aren’t involved by week 4, we stop or rescope.”\n\nWhen you’re unsure whether to say no, involve your own manager before you commit. Saying no well often raises your credibility; clients remember who was honest with them. A sharp question to yourself: “Would I bet my own money that this works?”',
      ],
      example: {
        kind: 'worked',
        text: 'A machine builder asks you to “halve lead times (the weeks from order to delivery) across the whole plant in three months”. There is no time budgeted for their people, and the director will be away for half that period. Red flags: no sponsor present, no time, unrealistic scope.\n\nYou propose one product family (a group of similar products made the same way, here 35% of volume), eight weeks, a named deputy sponsor, and 4 hours a week from the planner and one team lead. Target: lead time for that family from 6 to 4 weeks. The director agrees, and the result becomes the case for the rest of the plant.',
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
        scene: 'You’re at a grid operator. A manager asks you to “prove” that the field teams are causing the delays, ahead of a reorganisation (a change in departments, roles or jobs) that seems to have been decided already.',
        ask: 'How do you respond?',
        model: '“I understand you need a clear picture before the reorganisation. I can’t start from the conclusion: the field teams will see it, and nothing I find will be trusted. What I can do is map in four weeks where the delays actually come from, across planning, materials and the field. If it’s the field teams, the data will show it.”',
        rubric: [
          'Addresses the hidden agenda without accusing anyone',
          'Explains the risk in the client’s own interest: a result nobody trusts',
          'Offers a reshaped, neutral alternative with a time frame',
        ],
        pushback: {
          lines: [
            '“It’s obviously the field teams. I just need the numbers to show it. That’s what we’re paying you for.”',
            '“If you won’t do it, I’ll find another firm that will. Think about what that means for your firm.”',
          ],
          model: '“I understand you need a solid basis for the decision. I can give you the real causes of the delays, with numbers, and if the field teams are a big part, it will show. What I can’t do is start from the answer. That protects you too, if anyone checks it later.”',
          rubric: [
            'Acknowledges the need behind the request',
            'Holds firm on not starting from a fixed conclusion',
            'Offers a concrete alternative that still helps him',
          ],
        },
      },
      sayIt: 'Explain to your own manager in 60 seconds why you want to reshape a project the client already wants to sign.',
      terms: [
        { term: 'Red flag', def: 'A sign at intake that the project is likely to fail as set up.' },
        { term: 'Hidden agenda', def: 'A real reason for the project that differs from the one you are told.' },
        { term: 'Rescope', def: 'Reshape the project to a smaller or different scope that can actually succeed.' },
        { term: 'Checkpoint', def: 'An agreed moment to decide whether to continue, stop or rescope.' },
      ],
    },
  ],
};
