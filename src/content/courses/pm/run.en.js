// pm.run (EN): Run, keeping a project moving: meeting rhythm, honest status, scope creep, decisions, the team and conflict.
export default {
  lessons: [
    {
      id: 'pm.run.rhythm',
      title: 'A meeting rhythm that works',
      pre: [
        {
          q: 'Which steering group agenda item is most likely to lead somewhere?',
          options: ['“Status pilot”', '“Update from the project team”', '“Any other business”', '“Pilot: extend to region North from week 12, yes or no?”'],
          answer: '“Pilot: extend to region North from week 12, yes or no?”',
          why: 'An item written as a decision question gets a decision; a topic title gets a discussion.',
        },
      ],
      teach: [
        'Three layers. A short stand-up at the board, 15 minutes, two or three times a week for a part-time client team: what did I finish, what’s next, what’s blocking me. A weekly team meeting, 45 to 60 minutes: progress against the plan, blockers, decisions needed, next week. A steering group every four to six weeks, 60 to 90 minutes, for decisions only the sponsor can take.',
        'Agendas that end in decisions. Label each item: to decide, to discuss or to inform. Write decision items as a question: “Do we extend the pilot to region North from week 12?” Send the agenda and a one-page decision note two days before. Information items go in a written update, not in the meeting.',
        'Minutes are decisions and actions, nothing else: what was decided, who does what by when. Send them the same day. Start the next meeting by checking the actions. When actions keep slipping, that tells you more about the project than any status slide.',
        'The people side: client staff drown in meetings. Every meeting you add costs them. Keep yours short, start on time, end early when you can, and cancel when there’s nothing to decide. If the sponsor keeps cancelling the steering group, that is a signal, not bad luck. Ask him: “Is this still the right moment, or should we find another way for you to decide?”',
      ],
      example: {
        kind: 'worked',
        text: 'Downtime project at a beverage plant. Stand-up Monday and Thursday 08:30 at the board on the shop floor, 15 minutes, five people. Weekly meeting Tuesday 13:00, 45 minutes: 10 minutes actions, 15 minutes progress against the one-page plan, 15 minutes two decisions (which line next, whether to involve the supplier), 5 minutes next week. Steering group every five weeks, 60 minutes, three decision items, a decision note sent on Friday before. After the first steering group, the minutes fit on half a page: three decisions, four actions, sent at 16:00 the same day.',
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
        scene: 'You’re at a grid operator. Your weekly project meeting has grown to 90 minutes with twelve people, half of whom only listen. Decisions keep being postponed to “next week”.',
        ask: 'What do you change?',
        model: 'I’d cut it back to the five people who do the work, 45 minutes, with every item labelled decide, discuss or inform. Information goes in a short written update for the others. Decision items get a one-page note two days before, and the minutes list only decisions and actions, sent the same day.',
        rubric: [
          'Shrinks the meeting to the people who act',
          'Labels items and moves information to a written update',
          'Prepares decisions in advance and records them the same day',
        ],
      },
      sayIt: 'Explain to a client team lead in 60 seconds the meeting rhythm of your project and why each meeting exists.',
      terms: [
        { term: 'Stand-up', def: 'A 15-minute standing check at the board: done, next, blocked.' },
        { term: 'Steering group', def: 'The sponsor and senior people who take the decisions the team can’t.' },
        { term: 'Decision note', def: 'One page with the question, options, a recommendation and the deadline.' },
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
        'Agree what the colours mean at the start, or they mean nothing. A workable set: green, on track for the next milestone without extra help. Amber, at risk, but the team can recover with its own actions. Red, will miss unless the steering group acts. Then red is not a failure; it is a request for a decision.',
        'The watermelon project: green outside, red inside. Reports stay green until two weeks before the deadline, then jump to red. It happens because people hope to catch up and fear the messenger gets shot. The cost: by then the options are gone. Bad news early is cheap; bad news late is expensive.',
        'Structure bad news in four parts: what happened, what it means for the milestone, what I propose, what I need from you. “The system access is six weeks late. That moves the pilot from week 8 to week 12. I propose we start the pilot on paper in week 8. I need your OK and a call from you to the IT manager.”',
        'The people side: client team members may ask you to “keep it green for now”. Don’t argue in the corridor. Say: “I get it, nobody likes red. But if we say it now, the sponsor can still help. In six weeks, he can’t.” As an outsider you can often say what insiders can’t. Use that with care, and always tell the owner before the sponsor hears it.',
      ],
      example: {
        kind: 'worked',
        text: 'Week 6 of a project at a grid operator. The pilot needs system access, which IT promised for week 5. It’s not there and IT now says week 11. Your team lead wants to report amber. You check the definitions: the team cannot fix IT itself, and the pilot slips four weeks unless someone acts. That’s red. You first tell the team lead and the IT contact what you will report. In the steering group: “Red on the pilot. Access is six weeks late, which moves the pilot from week 8 to week 12. Proposal: start on paper in week 8 with two planners. I need your OK, and a call from you to the IT manager about the date.” The sponsor agrees and calls the same afternoon.',
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
        scene: 'You’re at a packaging plant. Your project has been reported green for eight weeks. Today you calculate that the savings target of 300,000 euro a year will come out at about 180,000. The steering group is next Tuesday.',
        ask: 'What do you do before and in the steering group?',
        model: 'First tell the project owner and the team what I found and what I’ll report, so nobody is surprised. In the steering group: “Red on the savings. We’re heading for about 180,000 instead of 300,000, because line 2 won’t be in scope before the summer. Two options: accept 180 this year, or add line 2 with one extra technician for three months. I recommend option two. I need your decision today.”',
        rubric: [
          'Tells the people involved before the steering group',
          'Reports what happened and what it means in numbers',
          'Brings options with a recommendation and a clear request',
        ],
      },
      sayIt: 'Explain to a new client team in 60 seconds what green, amber and red mean in your project and why red is not a failure.',
      terms: [
        { term: 'RAG status', def: 'Red, amber, green: agreed definitions of how a project is doing.' },
        { term: 'Watermelon project', def: 'A project reported green on the outside while it is red inside.' },
        { term: 'Escalation', def: 'Bringing a problem to someone who can decide or help, with a proposal.' },
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
        'Scope creep rarely arrives as one big request. It comes as “while you’re at it, can you also look at line 4?”, “can the dashboard also show quality?”, “could you join the meeting about the new ERP?”. Each one is small and reasonable. Signs: new people at your meetings, the goal sentence shifting, and you working evenings while the plan says you’re on track.',
        'Make every request visible. Write it down: what is asked, by whom, why, and the impact on time, cost, risk and the original goal. Small things go on a list you review weekly. Bigger ones become a change request that the sponsor decides on. Never decide alone on scope; it’s not your project, it’s theirs.',
        'Say “yes, and here is the cost”. “We can add line 4. That’s about three weeks extra, or we drop the shift handover. Which do you prefer?” You’re not saying no; you’re making the trade-off visible. Most requests shrink or disappear once they have a price.',
        'The people side: as a junior it feels risky to push back on a senior client. You don’t push back; you ask the sponsor to choose. Sometimes the change is right because the original goal was wrong. Then change the scope officially, with a new goal sentence and plan, rather than letting it drift.',
      ],
      example: {
        kind: 'worked',
        text: 'Your project at a cable manufacturer is planned at 40 consultant days to improve the weekly planning. By week 5 you have said yes to five small requests: a report for sales, a check on stock levels, a session with the new ERP team, and two extra analyses. Each was about 2 days. Together: 10 days, 25% extra, and the plan still shows green. You write the list down with the impact, and bring it to the sponsor: “These five came in. Together they cost 10 days. Option A: we keep them and move the end date by two weeks. Option B: we drop the stock check and ERP session.” He chooses B and tells sales himself.',
      },
      said: 'What you hear in projects: “It’s just one small extra thing. You’re here anyway, right?”',
      recall: [
        {
          q: 'A project has 40 days of budget. Five small requests of 2 days each are added. By what percentage has the scope grown?',
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
        scene: 'You’re at a grid operator. In the corridor, a regional manager asks: “Since you’re looking at planning anyway, could you also sort out our materials reservations? Shouldn’t be much work.”',
        ask: 'What do you say?',
        model: '“Interesting, and it probably affects planning too. I can’t judge yet how much work it is. Let me write down what you’d want from it and estimate the impact on the current plan. Then I’ll bring it to the sponsor, so she can decide whether we add it and what moves.”',
        rubric: [
          'Takes the request seriously instead of saying no',
          'Makes the impact visible before agreeing',
          'Routes the decision to the sponsor',
        ],
      },
      sayIt: 'Explain to a team member in 60 seconds how you handle “small” extra requests from the client.',
      terms: [
        { term: 'Scope creep', def: 'The project slowly growing through small additions nobody formally agreed.' },
        { term: 'Change request', def: 'A written request for a scope change with its impact, decided by the sponsor.' },
        { term: 'Goal sentence', def: 'One sentence stating what the project must achieve, used to test requests.' },
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
        'Bring options with a recommendation, not a problem. Two or three real options, the criteria that matter (cost, time, risk, impact on people), the pros and cons, and what you recommend and why. Add what happens if no decision is taken. One page. A manager can decide in ten minutes on a good page; a vague question takes three meetings.',
        'Keep a decision log: date, decision, who decided, why, and what alternatives were rejected. It takes two minutes per decision. In month four, when someone says “who decided that?”, you open the log instead of reopening the discussion.',
        'Escalation that works: escalate the decision, not the person. Agree the path at the start: team, project owner, sponsor, with a time limit at each level. “If we can’t agree by Friday, it goes to the sponsor.” Tell the people involved before you escalate. And use a default: “If there’s no decision by the 15th, we continue with option A.”',
        'The people side: managers postpone decisions because they fear being wrong, or because someone above them disagrees. Ask: “What would you need to see to decide?” If the answer is vague, ask: “Who else needs to be comfortable with this?” When you don’t know which option is best, say so and recommend a small test instead.',
      ],
      example: {
        kind: 'worked',
        text: 'At a plastics manufacturer the team can’t decide where to start: line 2 (most downtime, 14% of hours) or line 5 (smaller losses, but a supervisor keen to start). You write one page. Option A, line 2: biggest saving, about 90,000 euro a year, but the shift lead there is sceptical. Option B, line 5: about 40,000, quick start, willing team. Option C: start line 5 for four weeks to prove the approach, then line 2. Recommendation: C, because a visible success on line 5 will help convince line 2. If no decision by Friday, the team starts with C. The operations manager picks C in the meeting, and you log it with the reason.',
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
        scene: 'You’re at a grid operator. For three weeks the heads of planning and execution have disagreed about who owns the new readiness check. The project waits.',
        ask: 'How do you get this decided?',
        model: 'I’d write one page with the options: planning owns it, execution owns it, or planning owns it with execution signing off. With pros and cons and my recommendation. I’d tell both heads I’m bringing it to the sponsor if they can’t agree by Friday, and I’d set a default. Then I’d log the decision with the reason.',
        rubric: [
          'Prepares options with a recommendation on one page',
          'Sets a deadline and tells both heads before escalating',
          'Records the decision in a log',
        ],
      },
      sayIt: 'Explain to a client project owner in 60 seconds how you prepare a decision so the steering group can take it in ten minutes.',
      terms: [
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
        'Your team reports to their line managers, not to you. You lead with what you have: clarity, help and credit. People work on a project when it solves their own pain, when progress is visible, and when their name is on the success. Ask early: “What would make this project worth it for you?”',
        'Commitments that hold are small, specific and in their own words. Not “can you look at the data?” but “what can you have by Thursday?” Let them say it aloud in the team meeting and write it on the board. Then check it at the next meeting. People keep promises they made in public.',
        'When someone doesn’t deliver, assume capacity before attitude. One-on-one: “I noticed the analysis isn’t there. What’s in the way?” Often it’s the day job, a manager who doesn’t know, or a task that was unclear. Help remove it: smaller piece, clearer task, or a call to their manager for time.',
        'If it keeps happening, talk to their manager, but tell the person first: “I’m going to ask your manager whether you can get the four hours a week we agreed. Is that OK with you?” Never go around someone. And give credit loudly: in the steering group, name who did the work.',
      ],
      example: {
        kind: 'worked',
        text: 'At a food plant, the maintenance engineer Ahmed was to deliver a breakdown list by Thursday. It’s Monday, nothing. You ask him for coffee: “The list isn’t there yet. What’s in the way?” He says two breakdowns last week ate his time and his manager asked him to prioritise them. You agree to cut the task: only the top 10 breakdowns of line 3, by Wednesday. Then you ask his manager for the four hours a week agreed at the start, after telling Ahmed you would. On Wednesday the list is there. In the steering group you say: “Ahmed’s list shows 60% of the downtime comes from three causes.”',
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
        scene: 'You’re at a grid operator. A senior planner on your team is clearly capable, but stays silent in meetings and delivers late. A colleague tells you he wasn’t asked whether he wanted to join the project.',
        ask: 'What do you do?',
        model: 'Talk to him one-on-one, without blaming. “I heard you were put on this project without being asked. How is it for you?” Then ask what would make it worth his time, and whether his workload allows it. Agree something small and specific he wants to own, and if time is the problem, raise it with his manager after telling him.',
        rubric: [
          'Opens a one-on-one conversation without blame',
          'Asks what would make the project worth it for him',
          'Agrees a small, specific commitment and handles capacity openly',
        ],
      },
      sayIt: 'Explain to a new consultant in 60 seconds how you get client staff to deliver when they don’t report to you.',
      terms: [
        { term: 'Leading without authority', def: 'Getting work done through clarity, help and credit, not hierarchy.' },
        { term: 'Commitment', def: 'A small, specific promise someone makes in their own words.' },
        { term: 'Line manager', def: 'The person a team member actually reports to.' },
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
        'Positions versus interests (Fisher and Ury, Getting to Yes). A position is what someone says they want: “no stops during the week”. An interest is why: “we can’t miss the weekly delivery to our biggest customer”. Positions clash; interests often don’t. Maybe a four-hour stop on Monday morning, when the order is already shipped, works for both. Ask “what do you need it for?” and “what are you worried about?”',
        'In the team: listen to both sides separately first. Don’t take sides, even when one is right. Then bring them together with the interests on the table, not the positions: “You both want the line to run reliably. You disagree on when to stop it.” Look for options that serve both, and decide on criteria, not on who shouts.',
        'The difficult conversation, in four steps. What I saw, factual: “Twice this month the data wasn’t there on Monday.” The impact: “The planning meeting then decides on guesses.” Ask their view, and listen: “How do you see it?” Agree the next step together. Prepare the first sentence; the rest follows.',
        'With the client: when a manager blames your project, don’t defend in the room. “I hear you’re unhappy with how this is going. Can we take twenty minutes tomorrow to go through it?” Then use the same four steps. When you don’t know what to do, separate the people, talk to each alone, and ask a senior colleague before you act.',
      ],
      example: {
        kind: 'worked',
        text: 'At a dairy plant, the production manager and the maintenance manager clash in your weekly meeting. Production: “No more stops on line 1, we’re behind.” Maintenance: “Then it will break down, and that’s worse.” You stop the discussion and talk to each alone. Production’s interest: a big retail order ships every Thursday. Maintenance’s interest: three hours per week to replace worn seals before they fail. Together again: “You both want line 1 reliable for Thursday.” Option: a three-hour stop on Friday morning, the day after the Thursday shipment. Both agree to try it for four weeks and look at downtime and deliveries then.',
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
        scene: 'You’re at a grid operator. A team leader from execution says in your project meeting: “Planning sends us jobs that can’t be done, and now they want us to fill in another checklist?” The planners on your team go quiet.',
        ask: 'What do you do in the meeting and after?',
        model: 'In the meeting: “I hear real frustration about jobs that can’t be done. That’s exactly what this check should fix, so I want to understand it.” After, talk to him alone: what happened, what does he need from planning? Then talk to the planners. Bring them together on the shared interest, fewer wasted trips, and adjust the checklist with his input.',
        rubric: [
          'Acknowledges the frustration in the meeting without defending',
          'Talks to each side separately to find interests',
          'Brings them together on a shared interest and involves him in the solution',
        ],
      },
      sayIt: 'Explain to a client team lead in 60 seconds the difference between positions and interests, with an example from the shop floor.',
      terms: [
        { term: 'Position', def: 'What someone says they want.' },
        { term: 'Interest', def: 'Why they want it: the need or worry behind the position.' },
        { term: 'Difficult conversation', def: 'Facts, impact, their view, next step, in that order.' },
      ],
    },
  ],
};
