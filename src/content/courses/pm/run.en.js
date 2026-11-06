// pm.run (EN): Run, keeping a project moving: meeting rhythm, honest status, scope creep, decisions, the team and conflict.
export default {
  lessons: [
    {
      id: 'pm.run.rhythm',
      title: 'A meeting rhythm that works',
      pre: [
        {
          q: 'Which agenda item for the steering group, the meeting where the sponsor takes the big decisions, is most likely to lead to a decision?',
          options: ['“Status pilot”', '“Update from the project team”', '“Any other business”', '“Pilot: extend to region North from week 12, yes or no?”'],
          answer: '“Pilot: extend to region North from week 12, yes or no?”',
          why: 'An item written as a decision question gets a decision; a topic title gets a discussion.',
        },
      ],
      teach: [
        'A project runs on three meetings. A stand-up: 15 minutes standing at a whiteboard, two or three times a week, where each person says what they finished, what’s next and what blocks them. It comes from agile methods such as Scrum: working in short cycles.\n\nA weekly team meeting, 45 to 60 minutes: progress, blockers, decisions needed. And a steering group every four to six weeks, 60 to 90 minutes: the sponsor, the senior manager who owns the goal and budget, plus a few department heads.',
        'Agendas that end in decisions. Label each item: to decide, to discuss or to inform.\n\nWrite decision items as a question: “Do we extend the pilot to region North from week 12?” Send the agenda two days before, with a decision note: one page with the question, the options, your recommendation and the deadline. Information items go in a written update, not in the meeting.',
        'The minutes are the written record of a meeting. Keep them to decisions and actions, nothing else: what was decided, who does what by when. Send them the same day.\n\nStart the next meeting by checking the actions. When actions keep slipping, that tells you more about the project than any status slide. Ask the sharp question: “Which of last week’s actions are done?”',
        'The people side: client staff drown in meetings. Every meeting you add costs them hours. Keep yours short, start on time, end early when you can, and cancel when there’s nothing to decide.\n\nIf the sponsor keeps cancelling the steering group, that is a signal, not bad luck. Ask: “Is this still the right moment, or should we find another way for you to decide?”',
        'What goes wrong: the weekly meeting grows to twelve people who only listen, and the steering group becomes a slideshow where nothing is decided.\n\nExperts disagree on how often to meet. Agile teams, which work in short cycles full-time, swear by a daily stand-up; client teams who work on the project part-time often find two a week enough. Test it: if a stand-up keeps running past 15 minutes, or nobody ever names a blocker, change the format.',
      ],
      example: {
        kind: 'worked',
        text: 'A project to cut downtime (the hours a line stands still when it should run) at a beverage plant. Stand-up Monday and Thursday 08:30 at the board on the shop floor, 15 minutes, five people.\n\nWeekly meeting Tuesday 13:00, 45 minutes: 10 minutes actions, 15 minutes progress against the one-page plan, 15 minutes two decisions (which line next, whether to involve the supplier), 5 minutes next week. Steering group every five weeks, 60 minutes, three decision items, a decision note sent on Friday before.\n\nAfter the first steering group, the minutes fit on half a page: three decisions, four actions, sent at 16:00 the same day.',
      },
      said: 'What you hear in projects: “Another meeting? I already spend half my week in meetings about meetings.”',
      recall: [
        {
          q: 'What belongs in the minutes of a project meeting?',
          options: ['A full record of who said what', 'The slides that were shown', 'Decisions and actions with owner and date', 'Only the next meeting date'],
          answer: 'Decisions and actions with owner and date',
          why: 'Short minutes with decisions and actions get read and acted on.',
        },
        {
          q: 'Where do pure information items go?',
          options: ['At the start of the steering group', 'In a written update, not in the meeting', 'In the stand-up', 'Nowhere, they are not needed'],
          answer: 'In a written update, not in the meeting',
          why: 'Meeting time is for discussing and deciding; reading can be done alone.',
        },
        {
          q: 'The sponsor cancels the steering group for the second time. What do you do?',
          options: ['Wait for the next scheduled one', 'Hold it without him', 'Complain to his manager', 'Ask him whether this is still the right moment or he needs another way to decide'],
          answer: 'Ask him whether this is still the right moment or he needs another way to decide',
          why: 'Repeated cancelling is a signal; you address it and keep the decisions moving.',
        },
        {
          q: 'What is the purpose of a stand-up at the board?',
          options: ['Quick check on finished work, next steps and blockers', 'Discussing strategy with the team', 'Reporting to the sponsor', 'Training new team members'],
          answer: 'Quick check on finished work, next steps and blockers',
          why: 'Short and frequent, so blockers surface within days, not weeks.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator, the company that runs the regional power network. Your weekly project meeting has grown to 90 minutes with twelve people, half of whom only listen. Decisions keep being postponed to “next week”.',
        ask: 'What do you change?',
        model: 'I’d cut it back to the five people who do the work, 45 minutes, with every item labelled decide, discuss or inform. Information goes in a short written update for the others. Decision items get a one-page note two days before, and the minutes list only decisions and actions, sent the same day.',
        rubric: [
          'Shrinks the meeting to the people who act',
          'Labels items and moves information to a written update',
          'Prepares decisions in advance and records them the same day',
        ],
        pushback: {
          lines: [
            '“If you cut people from the meeting, they’ll feel left out. Everyone here wants to stay informed.”',
            '“We postpone decisions because we need more information. That’s just being careful.”',
          ],
          model: '“Staying informed matters, and they will be: a short written update every Friday. The meeting becomes 45 minutes, for the people who decide. If we need more information for a decision, we name what and by when, so next week it actually gets decided.”',
          rubric: [
            'Acknowledges the wish to stay informed and be careful',
            'Holds to a smaller meeting for decisions',
            'Proposes a concrete alternative and a deadline for information',
          ],
        },
      },
      sayIt: 'Explain to a client team lead in 60 seconds the meeting rhythm of your project and why each meeting exists.',
      terms: [
        { term: 'Stand-up', def: 'A 15-minute standing check at the board: done, next, blocked.' },
        { term: 'Steering group', def: 'The sponsor and senior managers who meet every few weeks to take the decisions the team can’t.' },
        { term: 'Sponsor', def: 'The senior manager who owns the project’s goal and budget and takes its big decisions.' },
        { term: 'Decision note', def: 'One page with the question, options, a recommendation and the deadline.' },
        { term: 'Minutes', def: 'The written record of a meeting: decisions and actions with owner and date.' },
      ],
    },
    {
      id: 'pm.run.status',
      title: 'Honest status',
      pre: [
        {
          q: 'A milestone is three weeks behind. The team thinks it can catch up with its own actions, without help. Which colour is honest?',
          options: ['Green', 'Amber', 'Red', 'Grey, it is too early to tell'],
          answer: 'Amber',
          why: 'At risk, but recoverable by the team itself: amber. Red means it needs the steering group to act.',
        },
      ],
      teach: [
        'Most projects report a RAG status: red, amber or green. It only works if you agree at the start what the colours mean.\n\nA workable set: green, on track for the next milestone, a dated checkpoint such as “pilot starts”, without extra help. Amber, at risk, but the team can recover with its own actions. Red, will miss unless the steering group acts.\n\nThen red is not a failure; it is a request for a decision.',
        'The watermelon project: green outside, red inside. Reports stay green until two weeks before the deadline, then jump to red. People hope to catch up, and fear the messenger gets shot. Psychologists call this reluctance to pass on bad news the MUM effect, from “keep mum”, stay silent (Rosen and Tesser, 1970).\n\nThe cost: by then the options are gone. Bad news early is cheap; bad news late is expensive.',
        'Structure bad news in four parts: what happened, what it means for the milestone, what I propose, what I need from you.\n\n“The system access is six weeks late. That moves the pilot from week 8 to week 12. I propose we start the pilot on paper in week 8. I need your OK and a call from you to the IT manager.” That last part is an escalation: taking a problem to someone who can decide or help, with a proposal.',
        'The people side: client team members may ask you to “keep it green for now”. Don’t argue in the corridor. Say: “I get it, nobody likes red. But if we say it now, the sponsor can still help. In six weeks, he can’t.”\n\nAs an outsider you can often say what insiders can’t. Use that with care, and always tell the owner before the sponsor hears it.',
        'Report a forecast, not only progress: where will we land at the end, given what we know today? “70% of tasks done” says little; “the savings will come out at 180,000 euro, not 300,000” says a lot.\n\nA common failure: colours set on gut feeling. Ask the sharp question in every review: “What would have to happen for this to turn red?” If nobody can answer, the green means nothing.',
      ],
      example: {
        kind: 'worked',
        text: 'Week 6 of a project at a grid operator. The pilot needs system access, which IT promised for week 5. It’s not there and IT now says week 11.\n\nYour team lead wants to report amber. You check the definitions: the team cannot fix IT itself, and the pilot slips four weeks unless someone acts. That’s red.\n\nYou first tell the team lead and the IT contact what you will report. In the steering group: “Red on the pilot. Access is six weeks late, which moves the pilot from week 8 to week 12. Proposal: start on paper in week 8 with two planners. I need your OK, and a call from you to the IT manager about the date.” The sponsor agrees and calls the same afternoon.',
      },
      said: 'What you hear in projects: “Let’s keep it amber for now. If we say red, the director will be all over us.”',
      recall: [
        {
          q: 'What does red mean in a well-defined status?',
          options: ['The project has failed', 'Someone made a mistake', 'The team is a bit behind', 'It will miss unless the steering group acts'],
          answer: 'It will miss unless the steering group acts',
          why: 'Red is a request for a decision or help, not a verdict.',
        },
        {
          q: 'Why are watermelon projects costly?',
          options: ['When the bad news finally comes, most options are gone', 'They use too many colours', 'The reports are too long', 'Sponsors dislike green'],
          answer: 'When the bad news finally comes, most options are gone',
          why: 'Early bad news leaves room to act; late bad news leaves only damage control.',
        },
        {
          q: 'Which is the best order for bad news?',
          options: ['Apology, background, problem, request', 'What happened, what it means, what I propose, what I need', 'Request, then explanation', 'Problem, blame, solution'],
          answer: 'What happened, what it means, what I propose, what I need',
          why: 'It is short, factual and ends with a clear ask.',
        },
        {
          q: 'A client team member asks you to keep the status green. What do you say?',
          options: ['“Fine, it’s your project.”', '“I’ll report it to the sponsor today.”', '“I get it, but if we say it now the sponsor can still help; later he can’t.”', '“The method requires red.”'],
          answer: '“I get it, but if we say it now the sponsor can still help; later he can’t.”',
          why: 'You acknowledge the fear and explain why early is in their interest too.',
        },
      ],
      situation: {
        scene: 'You’re at a packaging plant. Your project has been reported green for eight weeks and runs for another five months. Today you calculate that the savings target, the cost reduction of 300,000 euro a year promised at the start, will come out at about 180,000. The steering group is next Tuesday.',
        ask: 'What do you do before and in the steering group?',
        model: 'First tell the project owner and the team what I found and what I’ll report, so nobody is surprised. In the steering group: “Red on the savings. We’re heading for about 180,000 instead of 300,000, because line 2 won’t be in scope before the summer. Two options: accept 180 this year, or add line 2 with one extra technician for three months. I recommend option two. I need your decision today.”',
        rubric: [
          'Tells the people involved before the steering group',
          'Reports what happened and what it means in numbers',
          'Brings options with a recommendation and a clear request',
        ],
        pushback: {
          lines: [
            '“Why go red now? It was green last week. The board will ask what went wrong, and I can’t explain that.”',
            '“Can’t we keep it green until we know more? 180 is a forecast, not a result.”',
          ],
          model: '“I see why that’s uncomfortable. But if we keep it green and it lands at 180, the question becomes why we didn’t say so. With five months left we can still act. I’ll bring two options to close the gap, so the board hears a plan, not just a problem.”',
          rubric: [
            'Acknowledges his discomfort with the board',
            'Holds to reporting the honest status now',
            'Proposes concrete options to bring with the bad news',
          ],
        },
      },
      sayIt: 'Explain to a new client team in 60 seconds what green, amber and red mean in your project and why red is not a failure.',
      terms: [
        { term: 'RAG status', def: 'Red, amber, green: agreed definitions of how a project is doing.' },
        { term: 'Milestone', def: 'A dated checkpoint in the plan, such as “pilot starts” or “handover done”.' },
        { term: 'Watermelon project', def: 'A project reported green on the outside while it is red inside.' },
        { term: 'Escalation', def: 'Bringing a problem to someone who can decide or help, with a proposal.' },
        { term: 'Forecast', def: 'Where the project will land at the end, given what you know today.' },
      ],
    },
    {
      id: 'pm.run.scope',
      title: 'Scope creep',
      pre: [
        {
          q: 'Where does most scope creep at clients come from?',
          options: ['Many small, reasonable-sounding requests', 'Large formal change requests', 'The contract', 'The consultant’s own ideas only'],
          answer: 'Many small, reasonable-sounding requests',
          why: 'Each one sounds fine on its own; together they eat the project.',
        },
      ],
      teach: [
        'Scope is what the project will and won’t deliver. Scope creep is that scope growing bit by bit without anyone formally agreeing. It comes as “while you’re at it, can you also look at line 4?” or “could you join the meeting about the new ERP?”, the company-wide system for orders, stock and planning. Each request is small and reasonable.\n\nSigns: new people at your meetings, the goal sentence shifting, and you working evenings while the plan says you’re on track.',
        'The goal sentence is one line that says what the project must achieve, for example “cut jobs cancelled in the week before they are due from 18% to under 8% by June”. Test every request against it.\n\nThen make each request visible: what is asked, by whom, why, and the impact on time, cost, risk and the goal. Small things go on a list you review weekly. Bigger ones become a change request: a written request with its impact, which the sponsor decides on.',
        'Say “yes, and here is the cost”. “We can add line 4. That’s about three weeks extra, or we drop the shift handover. Which do you prefer?”\n\nYou’re not saying no; you’re showing the trade-off: what you give up to get something else. Most requests shrink or disappear once they have a price. Never decide alone on scope; it’s not your project, it’s theirs.',
        'The people side: as a junior it feels risky to push back on a senior client. You don’t push back; you ask the sponsor to choose.\n\nSometimes the change is right, because the original goal was wrong. Then change the scope officially, with a new goal sentence and plan, rather than letting it drift. Formal projects have a change control board for this; in most improvement projects the steering group plays that role.',
        'Watch your own side too. Gold plating is the team adding extras nobody asked for: a nicer dashboard, one more analysis. It feels like service, but it eats the same hours as creep.\n\nExperts argue about how strict to be. Some count every hour; others keep a small reserve for favours that build goodwill, often around 10% of the budget: a rule of thumb, not a standard. Either way, ask weekly: “Does everything we worked on this week serve the goal sentence?”',
      ],
      example: {
        kind: 'worked',
        text: 'Your project at a cable manufacturer is planned at 40 consultant days, the consultant time the client pays for, to improve the weekly planning.\n\nBy week 5 you have said yes to five small requests: a report for sales, a check on stock levels, a session with the new ERP team, and two extra analyses. Each was about 2 days. Together: 10 days, 25% extra, and the plan still shows green.\n\nYou write the list down with the impact, and bring it to the sponsor: “These five came in. Together they cost 10 days. Option A: we keep them and move the end date by two weeks. Option B: we drop the stock check and ERP session.” He chooses B and tells sales himself.',
      },
      said: 'What you hear in projects: “It’s just one small extra thing. You’re here anyway, right?”',
      recall: [
        {
          q: 'A project has 40 days of budget. Five small requests of 2 days each are added. By what percentage of the original 40 days has the scope grown?',
          number: 25,
          tolerance: 0.5,
          unit: '%',
          why: '5 × 2 = 10 days; 10 / 40 = 25%.',
        },
        {
          q: 'Who should decide on a significant scope change?',
          options: ['The consultant, who knows the plan', 'The person who asks', 'The sponsor', 'The whole team by vote'],
          answer: 'The sponsor',
          why: 'Scope trades off against time, cost and goal, which is the sponsor’s call.',
        },
        {
          q: 'What does “yes, and here is the cost” do?',
          options: ['Makes the trade-off visible so the client can choose', 'Refuses the request politely', 'Increases the consultant’s fee', 'Avoids the conversation'],
          answer: 'Makes the trade-off visible so the client can choose',
          why: 'You don’t block; you show what it takes and let the right person decide.',
        },
        {
          q: 'Which is an early sign of scope creep?',
          options: ['The team finishes early', 'The sponsor attends every steering group', 'Risks are reviewed weekly', 'New people at your meetings and a shifting goal sentence'],
          answer: 'New people at your meetings and a shifting goal sentence',
          why: 'New stakeholders bring new wishes; a drifting goal shows the project is changing.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator, the regional power network company. In the corridor, a regional manager asks: “Since you’re looking at planning anyway, could you also sort out our materials reservations?” He means booking cables and parts for planned jobs. “Shouldn’t be much work.”',
        ask: 'What do you say?',
        model: '“Interesting, and it probably affects planning too. I can’t judge yet how much work it is. Let me write down what you’d want from it and estimate the impact on the current plan. Then I’ll bring it to the sponsor, so she can decide whether we add it and what moves.”',
        rubric: [
          'Takes the request seriously instead of saying no',
          'Makes the impact visible before agreeing',
          'Routes the decision to the sponsor',
        ],
        pushback: {
          lines: [
            '“Come on, it’s a small thing. You’re already talking to the same people. Don’t make it bureaucratic.”',
            '“If I have to go through the sponsor for every little thing, this project isn’t helping me at all.”',
          ],
          model: '“It might well be small, and I’d like to help. I just don’t know yet what it does to the planning work. Give me two days to size it; then you and the sponsor decide together. If it’s really small, that’s a five-minute conversation.”',
          rubric: [
            'Acknowledges his request and the wish to avoid bureaucracy',
            'Holds to sizing it and a sponsor decision before saying yes',
            'Proposes a quick, concrete route to a decision',
          ],
        },
      },
      sayIt: 'Explain to a team member in 60 seconds how you handle “small” extra requests from the client.',
      terms: [
        { term: 'Scope', def: 'What the project will and won’t deliver.' },
        { term: 'Scope creep', def: 'The project slowly growing through small additions nobody formally agreed.' },
        { term: 'Goal sentence', def: 'One sentence stating what the project must achieve, used to test requests.' },
        { term: 'Change request', def: 'A written request for a scope change with its impact, decided by the sponsor.' },
        { term: 'Trade-off', def: 'What you give up to get something else: more scope costs time, money or another part of the plan.' },
        { term: 'Gold plating', def: 'The project team adding extras nobody asked for.' },
      ],
    },
    {
      id: 'pm.run.decisions',
      title: 'Getting decisions made',
      pre: [
        {
          q: 'A manager keeps postponing a decision “until we have more data”. Which question helps most?',
          options: ['“When will you decide?”', '“Shall I collect all the data?”', '“What would you need to see to decide either way?”', '“Can someone else decide?”'],
          answer: '“What would you need to see to decide either way?”',
          why: 'It turns vague doubt into a specific condition, or shows that no data will change the decision.',
        },
      ],
      teach: [
        'Bring options with a recommendation, not a problem. A recommendation is the option you advise, with your reason. Give two or three real options, the decision criteria that matter (cost, time, risk, impact on people), and the pros and cons. Add what happens if no decision is taken.\n\nOne page. A manager can decide in ten minutes on a good page; a vague question takes three meetings.',
        'Keep a decision log: date, decision, who decided, why, and which alternatives were rejected. It takes two minutes per decision.\n\nIn month four, when someone says “who decided that?”, you open the log instead of reopening the discussion. Keep it where everyone can see it, for example as a tab in the project file.',
        'Agree an escalation path at the start: the levels a stuck decision goes through, team, project owner, sponsor, with a time limit at each. “If we can’t agree by Friday, it goes to the sponsor.” Escalate the decision, not the person.\n\nTell the people involved before you escalate. And set a default, what happens if nobody decides: “If there’s no decision by the 15th, we continue with option A.”',
        'The people side: managers postpone decisions because they fear being wrong, or because someone above them disagrees. Ask: “What would you need to see to decide?” If the answer is vague, ask: “Who else needs to be comfortable with this?”\n\nWhen you don’t know which option is best, say so and recommend a small test instead.',
        'Not every decision deserves the same care. Jeff Bezos of Amazon (shareholder letter, 2015) split them into one-way doors, hard to reverse, and two-way doors, easy to undo. Take two-way doors fast, as low in the organisation as possible.\n\nA failure mode is the decision taken twice: agreed in the steering group, then quietly reopened in the corridor. Experts argue about consensus; many prefer “disagree and commit”, a phrase from Intel that Bezos made known at Amazon: argue openly, then everyone carries the decision.',
      ],
      example: {
        kind: 'worked',
        text: 'At a plastics manufacturer the team can’t decide where to start: line 2 (most downtime, 14% of planned production hours) or line 5 (smaller losses, but a supervisor keen to start). You write one page.\n\nOption A, line 2: biggest saving, about 90,000 euro a year, but the shift lead there is sceptical. Option B, line 5: about 40,000, quick start, willing team. Option C: start line 5 for four weeks to prove the approach, then line 2.\n\nRecommendation: C, because a visible success on line 5 will help convince line 2. If no decision by Friday, the team starts with C. The operations manager picks C in the meeting, and you log it with the reason.',
      },
      said: 'What you hear in projects: “Let’s take this offline and come back to it next week.”',
      recall: [
        {
          q: 'What should a good decision note contain?',
          options: ['All the data you collected', 'Only your recommendation', 'Options, criteria, a recommendation and what happens without a decision', 'A list of open questions'],
          answer: 'Options, criteria, a recommendation and what happens without a decision',
          why: 'It makes deciding quick and shows the cost of not deciding.',
        },
        {
          q: 'Why keep a decision log?',
          options: ['The auditor demands it', 'To avoid reopening settled discussions later', 'To blame people later', 'To replace the minutes'],
          answer: 'To avoid reopening settled discussions later',
          why: 'You can show what was decided, by whom and why.',
        },
        {
          q: 'What does “escalate the decision, not the person” mean?',
          options: ['You complain about a colleague to his boss', 'You avoid escalating', 'You let the person escalate himself', 'You bring the open decision to the next level, after telling those involved'],
          answer: 'You bring the open decision to the next level, after telling those involved',
          why: 'It is about getting a decision, not about getting someone in trouble.',
        },
        {
          q: 'What is the purpose of a default in a decision note?',
          options: ['It shows what happens if no one decides, so not deciding is also a choice', 'It replaces the sponsor', 'It hides the risks', 'It makes the note shorter'],
          answer: 'It shows what happens if no one decides, so not deciding is also a choice',
          why: 'A default keeps the project moving and makes postponing visible.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator, the regional power network company. For three weeks the heads of planning and execution (the field crews) have disagreed about who owns the new readiness check, the check that a job has people, parts and permits before it is planned. The project waits. Your sponsor is the operations director.',
        ask: 'How do you get this decided?',
        model: 'I’d write one page with the options: planning owns it, execution owns it, or planning owns it with execution signing off. With pros and cons and my recommendation. I’d tell both heads I’m bringing it to the sponsor if they can’t agree by Friday, and I’d set a default. Then I’d log the decision with the reason.',
        rubric: [
          'Prepares options with a recommendation on one page',
          'Sets a deadline and tells both heads before escalating',
          'Records the decision in a log',
        ],
        pushback: {
          lines: [
            '“This isn’t something to force. Give us another few weeks and we’ll work it out between us.”',
            '“If you take this to the director, it looks like we can’t manage our own departments.”',
          ],
          model: '“I’d prefer the two of you decide it, and you still can. But the project has waited three weeks. Let’s set a date: if you agree by Friday, done. If not, I put both options and their consequences to the director, as a choice, not a complaint.”',
          rubric: [
            'Acknowledges their wish to solve it themselves',
            'Holds to a deadline for the decision',
            'Proposes a clear fallback route that saves their face',
          ],
        },
      },
      sayIt: 'Explain to a client project owner in 60 seconds how you prepare a decision so the steering group can take it in ten minutes.',
      terms: [
        { term: 'Recommendation', def: 'The option you advise in a decision note, with your reason.' },
        { term: 'Decision criteria', def: 'What the options are judged on: cost, time, risk, impact on people.' },
        { term: 'Decision log', def: 'A list of decisions with date, who, why and rejected options.' },
        { term: 'Escalation path', def: 'Agreed levels and time limits for decisions the team can’t take.' },
        { term: 'Default', def: 'What happens if no decision is taken by the deadline.' },
      ],
    },
    {
      id: 'pm.run.team',
      title: 'Leading without authority',
      pre: [
        {
          q: 'A client team member misses his second deadline on your project. What is the most likely cause?',
          options: ['He isn’t motivated', 'He doesn’t understand the task', 'His normal job took priority', 'He dislikes consultants'],
          answer: 'His normal job took priority',
          why: 'Client staff do projects on top of their job; when it gets busy, the project loses.',
        },
      ],
      teach: [
        'Leading without authority means getting work done by people who don’t report to you. Your team reports to their line manager, the boss who sets their priorities and appraises them. You lead with what you have: clarity, help and credit.\n\nPeople work on a project when it solves their own pain, when progress is visible, and when their name is on the success. Ask early: “What would make this project worth it for you?”',
        'A commitment that holds is small, specific and in their own words. Not “can you look at the data?” but “what can you have by Thursday?”\n\nLet them say it aloud in the team meeting and write it on the board. Then check it at the next meeting. People keep promises they made in public; the psychologist Robert Cialdini calls this commitment and consistency.',
        'When someone doesn’t deliver, assume capacity before attitude. Capacity is the hours someone really has free for your project, next to the day job. Ask in a one-on-one, a private talk between the two of you: “I noticed the analysis isn’t there. What’s in the way?”\n\nOften it’s the day job, a manager who doesn’t know, or an unclear task. Help remove it: a smaller piece, a clearer task, or a call to their manager for time.',
        'If it keeps happening, talk to their manager, but tell the person first: “I’m going to ask your manager whether you can get the four hours a week we agreed. Is that OK with you?” Never go around someone.\n\nAnd give credit loudly: in the steering group, name who did the work. Visible praise from senior people is one of the few rewards you can hand out.',
        'Make capacity explicit at the start: “four hours a week, Tuesday morning, agreed with your manager” beats “he’ll help where he can”. Someone at 20% on your project has one day a week, minus meetings.\n\nA common failure: the consultant quietly does the client’s tasks to stay on schedule. The plan looks fine, but nobody at the client can run it later. Ask yourself weekly: “Whose hands did this week’s work?”',
      ],
      example: {
        kind: 'worked',
        text: 'At a food plant, the maintenance engineer Ahmed was to deliver a breakdown list by Thursday. It’s Monday, nothing.\n\nYou ask him for coffee: “The list isn’t there yet. What’s in the way?” He says two breakdowns last week ate his time and his manager asked him to prioritise them. You agree to cut the task: only the top 10 breakdowns of line 3, by Wednesday.\n\nThen you ask his manager for the four hours a week agreed at the start, after telling Ahmed you would. On Wednesday the list is there. In the steering group you say: “Ahmed’s list shows 60% of the downtime comes from three causes.”',
      },
      said: 'What you hear in projects: “Sorry, I just haven’t had time. The day job comes first, you know.”',
      recall: [
        {
          q: 'What is the best question when someone hasn’t delivered?',
          options: ['“Why didn’t you do it?”', '“What’s in the way?”', '“Shall I tell your manager?”', '“Do you still want to be on this project?”'],
          answer: '“What’s in the way?”',
          why: 'It looks for the obstacle instead of a culprit, and usually finds it.',
        },
        {
          q: 'What makes a commitment more likely to hold?',
          options: ['Small, specific, in their own words, said in front of the team', 'A formal e-mail from you', 'A big task with a far deadline', 'Approval from HR'],
          answer: 'Small, specific, in their own words, said in front of the team',
          why: 'People keep concrete promises they made themselves in public.',
        },
        {
          q: 'You need to involve someone’s manager about his time. What do you do first?',
          options: ['Go straight to the manager', 'Copy the manager on an e-mail', 'Wait until the end of the project', 'Tell the person you’re going to do it'],
          answer: 'Tell the person you’re going to do it',
          why: 'Going around someone destroys trust; telling him first keeps it.',
        },
        {
          q: 'Where should you give credit for good work?',
          options: ['Privately, so nobody feels left out', 'Out loud, including in the steering group', 'Only in the final report', 'Nowhere, it is their job'],
          answer: 'Out loud, including in the steering group',
          why: 'Visible credit from senior people is one of the few rewards you can give.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator, the regional power network company. A senior planner on your team is clearly capable, but stays silent in meetings and delivers late. A colleague tells you he wasn’t asked whether he wanted to join the project.',
        ask: 'What do you do?',
        model: 'Talk to him one-on-one, without blaming. “I heard you were put on this project without being asked. How is it for you?” Then ask what would make it worth his time, and whether his workload allows it. Agree something small and specific he wants to own, and if time is the problem, raise it with his manager after telling him.',
        rubric: [
          'Opens a one-on-one conversation without blame',
          'Asks what would make the project worth it for him',
          'Agrees a small, specific commitment and handles capacity openly',
        ],
        pushback: {
          lines: [
            '“Nobody asked me if I wanted this. I have a full job already. This project comes on top.”',
            '“And frankly, I’ve seen five of these projects come and go.”',
          ],
          model: '“That’s fair, someone should have asked you, and I’m sorry nobody did. Your experience is exactly why I need you. What would make it worth your time? If we can take something off your plate, I’ll ask your manager this week.”',
          rubric: [
            'Acknowledges that he was not asked and has a full job',
            'Makes clear why his part matters',
            'Proposes a concrete change that makes it workable for him',
          ],
        },
      },
      sayIt: 'Explain to a new consultant in 60 seconds how you get client staff to deliver when they don’t report to you.',
      terms: [
        { term: 'Leading without authority', def: 'Getting work done through clarity, help and credit, not hierarchy.' },
        { term: 'Line manager', def: 'The boss a team member actually reports to, who sets their priorities.' },
        { term: 'Commitment', def: 'A small, specific promise someone makes in their own words.' },
        { term: 'Capacity', def: 'The hours someone really has free for the project, next to the day job.' },
        { term: 'One-on-one', def: 'A private conversation between two people, away from the group.' },
      ],
    },
    {
      id: 'pm.run.conflict',
      title: 'Conflict and the difficult conversation',
      pre: [
        {
          q: 'Production says “no maintenance stops during the week”. Maintenance says “we need four hours per line per week”. What is the best first step?',
          options: ['Split the difference: two hours', 'Let the plant manager decide', 'Ask each side what they need it for', 'Pick the side with the best data'],
          answer: 'Ask each side what they need it for',
          why: 'Behind positions are interests, and interests can often both be met.',
        },
      ],
      teach: [
        'Positions versus interests, from Fisher and Ury’s book Getting to Yes (1981). A position is what someone says they want: “no stops during the week”. An interest is why: “we can’t miss the weekly delivery to our biggest customer”.\n\nPositions clash; interests often don’t. Maybe a four-hour stop on Monday morning, when the order has already shipped, works for both. Ask “what do you need it for?” and “what are you worried about?”',
        'In the team: listen to both sides separately first. Don’t take sides, even when one is right.\n\nThen bring them together with the interests on the table: “You both want the line to run reliably. You disagree on when to stop it.” Look for options that serve both, and decide on objective criteria, facts both sides accept beforehand, such as downtime hours or missed deliveries, not on who shouts loudest.',
        'A difficult conversation is the talk you’d rather avoid. Do it in four steps.\n\nWhat I saw, factually: “Twice this month the data wasn’t there on Monday.” The impact: “The planning meeting then decides on guesses.” Ask their view, and listen: “How do you see it?”\n\nAgree the next step together. Prepare the first sentence; the rest follows.',
        'With the client: when a manager blames your project, don’t defend in the room. “I hear you’re unhappy with how this is going. Can we take twenty minutes tomorrow to go through it?”\n\nThen use the same four steps. When you don’t know what to do, separate the people, talk to each alone, and ask a senior colleague before you act.',
        'Know each side’s BATNA, another term from Getting to Yes: the best alternative to a negotiated agreement, what they do if there is no deal. Without a shared stop, maintenance’s alternative is a breakdown; production’s is a missed delivery. Seeing that makes a deal more attractive.\n\nA failure mode is splitting the difference: two hours instead of four satisfies nobody and fixes nothing. And some conflicts are about values or status, not interests; then escalate to someone who can decide.',
      ],
      example: {
        kind: 'worked',
        text: 'At a dairy plant, the production manager and the maintenance manager clash in your weekly meeting. Production: “No more stops on line 1, we’re behind.” Maintenance: “Then it will break down, and that’s worse.”\n\nYou stop the discussion and talk to each alone. Production’s interest: a big retail order ships every Thursday. Maintenance’s interest: three hours per week to replace worn seals before they fail.\n\nTogether again: “You both want line 1 reliable for Thursday.” Option: a three-hour stop on Friday morning, the day after the Thursday shipment. Both agree to try it for four weeks and look at downtime and deliveries then.',
      },
      said: 'What you hear in projects: “If maintenance had done their job, we wouldn’t need this project at all.”',
      recall: [
        {
          q: 'Which of these is an interest rather than a position?',
          options: ['“No stops during the week.”', '“We need a new machine.”', '“Four hours per line, no less.”', '“We can’t miss the Thursday delivery to our biggest customer.”'],
          answer: '“We can’t miss the Thursday delivery to our biggest customer.”',
          why: 'It says why someone wants something, which opens up other solutions.',
        },
        {
          q: 'How do you start a difficult conversation?',
          options: ['With what you saw, factually', 'With your conclusion about the person', 'With small talk for ten minutes', 'With what others have said about him'],
          answer: 'With what you saw, factually',
          why: 'Facts are hard to argue with; judgements trigger defence.',
        },
        {
          q: 'Two team members clash in a meeting. What do you do first?',
          options: ['Decide who is right on the spot', 'Ignore it and move on', 'Talk to each of them separately', 'Escalate to the sponsor'],
          answer: 'Talk to each of them separately',
          why: 'Alone, people say what they really need without losing face.',
        },
        {
          q: 'A client manager criticises your project in a meeting. What is the best reaction?',
          options: ['Defend the project with data right away', 'Acknowledge it and propose a separate conversation soon', 'Say nothing and hope it passes', 'Ask the sponsor to intervene'],
          answer: 'Acknowledge it and propose a separate conversation soon',
          why: 'You don’t fight in public, and you show you take it seriously.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator, the regional power network company. A team leader from execution, the field crews who carry out the jobs, says in your project meeting: “Planning sends us jobs that can’t be done, and now they want us to fill in another checklist?” The planners on your team go quiet.',
        ask: 'What do you do in the meeting and after?',
        model: 'In the meeting: “I hear real frustration about jobs that can’t be done. That’s exactly what this check should fix, so I want to understand it.” After, talk to him alone: what happened, what does he need from planning? Then talk to the planners. Bring them together on the shared interest, fewer wasted trips, and adjust the checklist with his input.',
        rubric: [
          'Acknowledges the frustration in the meeting without defending',
          'Talks to each side separately to find interests',
          'Brings them together on a shared interest and involves him in the solution',
        ],
        pushback: {
          lines: [
            '“I’m just saying what everyone on the floor thinks. Somebody has to say it.”',
            '“Talking about it won’t help. The planners need to send better jobs, that’s all.”',
          ],
          model: '“Good that you say it out loud; better here than in the corridor. Undoable jobs are exactly what the check should stop. Bring me three from last week, and we’ll go through them with the planners on Thursday. If the check doesn’t catch them, we change the check.”',
          rubric: [
            'Acknowledges his frustration and that he said it openly',
            'Restates the purpose without taking sides',
            'Proposes a concrete joint look at real cases',
          ],
        },
      },
      sayIt: 'Explain to a client team lead in 60 seconds the difference between positions and interests, with an example from the shop floor.',
      terms: [
        { term: 'Position', def: 'What someone says they want.' },
        { term: 'Interest', def: 'Why they want it: the need or worry behind the position.' },
        { term: 'Objective criteria', def: 'Facts both sides accept beforehand to judge options, such as downtime hours.' },
        { term: 'Difficult conversation', def: 'A talk you’d rather avoid, held in four steps: facts, impact, their view, next step.' },
        { term: 'BATNA', def: 'Best alternative to a negotiated agreement: what you do if there is no deal.' },
      ],
    },
  ],
};
