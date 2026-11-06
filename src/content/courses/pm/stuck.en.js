// pm.stuck (EN): When you’re stuck: naming the problem, buying time, asking for help, experimenting, handling pressure and resetting a project.
export default {
  lessons: [
    {
      id: 'pm.stuck.diagnose',
      title: 'Naming the problem',
      pre: [
        {
          q: 'On your project, actions slip for everyone on the team, by about the same amount, week after week. What is the most likely cause?',
          options: ['Resistance to the change', 'An unclear goal', 'People don’t have the hours', 'A weak project lead'],
          answer: 'People don’t have the hours',
          why: 'When everyone slips evenly, it is usually capacity: too few hours for the work. Resistance shows up in some people, not all.',
        },
      ],
      teach: [
        'Stuck projects feel the same from the inside: nothing moves. But there are four kinds of stuck, each with its own fix.\n\nUnclear goal: people disagree on what success is. Unclear way: the goal is clear, nobody knows how. People problem: someone whose yes you need isn’t giving it. Capacity problem: everyone agrees, nobody has the time.',
        'The quick diagnostic, four questions.\n\nWould the sponsor, the manager who owns the project, and the team each write the same goal in one sentence? Do we know the next three steps? Is there someone whose support we need and don’t have? Do people actually have the hours in their week?\n\nThe first “no” is usually where you start.',
        'Symptoms help.\n\nUnclear goal: long debates about solutions, the sponsor changing direction, every design workshop reopening the last. Unclear way: analysis loops, waiting for more data. People: one person’s actions slip, silence in meetings, “we’ll see”. Capacity: everyone slips, meetings get cancelled, the project lives in the evening hours.',
        'Fixes differ. Goal: back to the sponsor to choose. Way: a small experiment or an expert. People: a one-on-one conversation. Capacity: a trade-off by the sponsor, deciding what gets less time so this gets more.\n\nThe classic mistake is treating a goal problem as a people problem and pushing harder. Often two kinds are mixed; start with the one earliest in the chain: goal, way, people, capacity.',
        'Notice it early. A useful signal: you have been “about to” do the same thing for two weeks. Seeing it in week 3 instead of week 9 is the skill.\n\nWhat experts argue about: some say almost every stuck project is a people problem in disguise; others warn that calling it “resistance” blames people for a decision nobody took. A sharp question: “Which decision is nobody taking?”',
      ],
      example: {
        kind: 'faded',
        text: 'Week 7 at a grid operator. You are designing a readiness check for planned jobs: a check that a job has everything it needs before it is released, handed to a field crew. This is the third design workshop.\n\nThe head of planning wants a strict check that blocks any job without a confirmed switching plan, the step-by-step plan for safely switching grid parts off and on, and without material. The head of execution wants a light check, because “strict means jobs get released even later”. The sponsor said at the start: “Just make it work.”\n\nThe team is getting tired.',
        ask: 'What would you do next?',
        reveal: 'This looks like a design debate, but it’s an unclear goal. Strict serves “fewer cancellations”; light serves “faster release”. Another workshop won’t settle it, because they’re optimising for different things.\n\nWrite one page with the two goals, what each design does to cancellations and release time, and ask the sponsor to choose, or to set a target for both, for example: cancellations under 8% while release takes no more than 2 days longer. Tell both heads beforehand that you’re doing this. Then design against the chosen target.',
      },
      said: 'What you hear in projects: “We’ve discussed this three times now. Can’t we just pick something?”',
      recall: [
        {
          q: 'Design workshops keep reopening the last decision, and the sponsor changes direction. Which kind of stuck is this most likely?',
          options: ['Unclear goal', 'Capacity', 'People', 'Unclear way'],
          answer: 'Unclear goal',
          why: 'When people optimise for different outcomes, every design gets reopened.',
        },
        {
          q: 'The goal and the next steps are clear, but one key manager keeps missing his actions and stays silent. What is the right first move?',
          options: ['Escalate to the sponsor right away', 'Run another team workshop', 'A one-on-one conversation with him', 'Re-plan the project'],
          answer: 'A one-on-one conversation with him',
          why: 'A people problem is solved in a personal conversation, not in a group or a plan.',
        },
        {
          q: 'Two kinds of stuck are mixed: an unclear goal and low capacity. Where do you start?',
          options: ['With capacity, it’s easiest to fix', 'With both at once', 'With whichever the sponsor prefers', 'With the goal, the earliest in the chain'],
          answer: 'With the goal, the earliest in the chain',
          why: 'Adding capacity to a project with an unclear goal just produces more debate.',
        },
        {
          q: 'What is a useful early signal that you yourself are stuck?',
          options: ['You have been “about to” do the same thing for two weeks', 'The client is friendly', 'You are working normal hours', 'The steering group is next week'],
          answer: 'You have been “about to” do the same thing for two weeks',
          why: 'Repeated postponing usually means something is blocking you that you haven’t named yet.',
        },
      ],
      situation: {
        scene: 'You’re at a packaging plant, week 6. You feel the project is stuck but can’t say why. Your manager asks: “So what’s going on there?”',
        ask: 'How do you work out and explain what’s wrong?',
        model: 'I’d run the four questions honestly. Say the goal is clear, the next steps are known, the operations manager supports it, but actions slip across the whole team. Then I’d say: “I think it’s capacity. Everyone agreed to four hours a week, but nobody has them. I want to ask the sponsor to choose: free up the hours, or slow the plan down.”',
        rubric: [
          'Uses a structured check instead of a vague feeling',
          'Names one kind of stuck, backed by symptoms',
          'Links it to the matching fix and who needs to act',
        ],
        pushback: {
          lines: [
            '“‘It feels stuck’ isn’t something I can do anything with. Give me facts.”',
            '“Maybe you’re overthinking it. Keep going for a few weeks and see.”',
          ],
          model: '“Fair, a feeling isn’t enough. Facts: nine of the twelve actions due in the last three weeks slipped, spread across the whole team, and most people say they get about one of their four promised hours. Waiting won’t create hours. I’ll ask the sponsor this week to free them or slow the plan, and tell you on Friday.”',
          rubric: [
            'Acknowledges the request for facts',
            'Names the problem with concrete evidence, not a vague feeling',
            'Proposes a concrete next step with the person who can fix it',
          ],
        },
      },
      sayIt: 'Explain to a junior colleague in 60 seconds the four kinds of stuck and how to tell them apart.',
      terms: [
        { term: 'Unclear goal', def: 'People disagree on what success is, so every solution gets reopened.' },
        { term: 'Unclear way', def: 'The goal is clear but nobody knows how to get there.' },
        { term: 'People problem', def: 'Someone whose support you need isn’t giving it; you see it in one person’s slipping actions or silence.' },
        { term: 'Capacity problem', def: 'Everyone agrees, but nobody has the hours to do the work.' },
        { term: 'Trade-off', def: 'A choice to give one thing less so another gets more, such as time, scope or quality; usually the sponsor’s call.' },
      ],
    },
    {
      id: 'pm.stuck.buytime',
      title: 'Buying time professionally',
      pre: [
        {
          q: 'A plant director asks you a question in a meeting that you can’t answer. Which response loses the most trust?',
          options: ['“I don’t know yet; I’ll come back to you on Thursday.”', 'A confident guess that later turns out to be wrong', '“Good question, let me check with the engineer.”', '“My first view is X, but I want to confirm it.”'],
          answer: 'A confident guess that later turns out to be wrong',
          why: 'Being found out costs far more trust than an honest “I’ll check”.',
        },
      ],
      teach: [
        'When you don’t know, say so, and say when you will. “Good question. I don’t want to guess. I’ll check with the maintenance engineer and come back to you on Thursday.”\n\nTwo rules: name a specific moment, and keep it. A promised answer on Thursday that arrives on Thursday builds more trust than a quick answer on the spot.',
        'Separate what you know, what you think, and what you don’t know. “We know cancellations dropped to 9%. We think it’s mainly the material check. We don’t know yet whether it holds in the busy season.”\n\nSay which assumption you lean on: something you treat as true for now without proof. Senior people trust a consultant who makes that split; they distrust one who sounds equally sure about everything.',
        'A holding statement is for when something goes wrong and you don’t have the full picture yet: what we know, what we’re doing now, when you’ll hear more. “The pilot data from last week is missing. We’re checking with IT whether it’s a report error. You’ll have an update by 14:00.”\n\nIt stops speculation and buys you a few hours. Leave out causes you haven’t confirmed.',
        'When you’re pushed to decide on the spot: “I want to give you a good answer, not a fast one. Can I come back to you tomorrow at 10?” Almost nobody says no.\n\nDon’t overuse it: if you do know, answer. A provisional view is often fine: “My first view is X; I’ll confirm by Thursday.” Asked for a number you don’t have? Give a range, a low and a high value, with what it depends on.',
        'Never bluff. Bluffing, presenting a guess as fact, is found out sooner than you think: engineers and controllers test you, and after one made-up number every later number is doubted.\n\nWhat experts argue about: some seniors say clients pay for confidence, not “I’ll check”. The middle is calibrated confidence: say how sure you are. A sharp question for yourself: “What would I need to know to be sure, and who knows it?”',
      ],
      example: {
        kind: 'faded',
        text: 'Steering group, the monthly meeting where the sponsor and senior managers decide, at a metal parts manufacturer. The CFO, the finance director, turns to you: “So what’s the saving for next year? I need a number for the budget by Friday.”\n\nIt’s Tuesday. You estimate between 100,000 and 250,000 euro a year. The difference depends on whether line 2 is in scope next year, part of the project, which nobody has decided.',
        ask: 'What would you do next?',
        reveal: 'Give the range and what it depends on, and commit to a moment before his deadline. “Between 100 and 250 thousand. The difference is line 2. I’ll check with the production manager tomorrow whether line 2 is in for next year, and send you one number with the assumptions on Thursday, a day before your deadline.”\n\nThen do exactly that. If line 2 is still undecided on Thursday, advise him to budget the conservative 100,000 and show the 150,000 upside separately, with what has to happen for it.',
      },
      said: 'What you hear in projects: “I need a number, not a range. Just give me your best guess.”',
      recall: [
        {
          q: 'What are the two rules when you promise to come back with an answer?',
          options: ['Be vague about timing, and over-deliver', 'Name a specific moment, and keep it', 'Always answer within one hour, and copy your manager', 'Promise only in writing, and never by phone'],
          answer: 'Name a specific moment, and keep it',
          why: 'A kept promise builds trust; a vague one sounds like avoidance.',
        },
        {
          q: 'What does a holding statement contain?',
          options: ['A full analysis of the cause', 'An apology and a promise it won’t happen again', 'What we know, what we’re doing now, when you’ll hear more', 'Only reassurance'],
          answer: 'What we know, what we’re doing now, when you’ll hear more',
          why: 'It gives facts and a next moment, without guessing at causes.',
        },
        {
          q: 'A client insists on one number now, but you only have a range. What is best?',
          options: ['Give the midpoint as if certain', 'Refuse to give any number', 'Give the highest number to keep him happy', 'Give the range with what it depends on, and when you’ll narrow it'],
          answer: 'Give the range with what it depends on, and when you’ll narrow it',
          why: 'Honest about the uncertainty, and still helpful for his decision.',
        },
        {
          q: 'Why do senior people trust a consultant who separates what he knows, thinks and doesn’t know?',
          options: ['It shows judgement about how solid each claim is', 'It makes reports longer', 'It avoids taking any position', 'It is required in consulting contracts'],
          answer: 'It shows judgement about how solid each claim is',
          why: 'Sounding equally sure about everything signals you can’t tell the difference.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator, presenting pilot results. A senior asset manager, who looks after the grid equipment over its whole life, interrupts: “Did you correct for the storm in week 4? That week had three times the normal faults.” Faults are breakdowns in the grid. You didn’t know about the storm.',
        ask: 'What do you say?',
        model: '“I didn’t know about the storm, thanks. That could affect the week 4 numbers. I’ll check how many of the cancellations that week were storm-related and send you the corrected figures by Thursday.” Then continue with the rest, marking week 4 as under review, and send the correction on Thursday.',
        rubric: [
          'Admits not knowing without defending',
          'Names a specific action and moment to come back',
          'Continues the presentation without bluffing about the affected data',
        ],
        pushback: {
          lines: [
            '“You didn’t know about the storm? Then how can we trust any of these numbers?”',
            '“I don’t want a follow-up later. Either the result holds or it doesn’t. Which is it?”',
          ],
          model: '“Good catch, I didn’t know, thank you. The other weeks come from the same source and weren’t hit by the storm, so that part stands. Whether the result holds without week 4, I can’t say right now, and I won’t guess. I’ll rerun it without that week and send it to you on Thursday.”',
          rubric: [
            'Acknowledges the point without getting defensive',
            'Holds to not guessing while keeping what is solid',
            'Proposes a concrete follow-up with a time',
          ],
        },
      },
      sayIt: 'Explain to a new consultant in 60 seconds how to handle a question you can’t answer in front of a client.',
      terms: [
        { term: 'Holding statement', def: 'What we know, what we’re doing, when you’ll hear more, used before the full picture is clear.' },
        { term: 'Assumption', def: 'Something you treat as true for now without proof; name it so others can check it.' },
        { term: 'Provisional view', def: 'A first opinion clearly marked as not yet confirmed.' },
        { term: 'Range', def: 'A low and a high value instead of one number, with what decides where the answer lands.' },
        { term: 'Bluffing', def: 'Presenting a guess as fact; it destroys trust once found out.' },
      ],
    },
    {
      id: 'pm.stuck.askhelp',
      title: 'Asking for help well',
      pre: [
        {
          q: 'When do senior consultants most want a junior to ask for help?',
          options: ['Only when the project is in serious trouble', 'Never, juniors should solve it themselves', 'Early, once they’ve tried one or two things and are stuck', 'At the monthly review'],
          answer: 'Early, once they’ve tried one or two things and are stuck',
          why: 'Help in week 2 is cheap; help in week 8 is a rescue.',
        },
      ],
      teach: [
        'Juniors wait too long because asking feels like admitting weakness. Seniors see it the other way: the junior who asks well, early, is the one they trust with clients. Rule of thumb: stuck on the same thing for more than a day or two, and tried two approaches? Ask.\n\nAsking for help is not escalation. Escalation means taking a problem to someone with more authority so they decide; asking for help means getting advice and deciding yourself.',
        'Framing a request means making it easy to help: context in two sentences, what you tried, your specific question, what you need and by when.\n\n“I’m stuck on reconciling the OEE data at the dairy plant. I tried matching on shift and on order number; neither fits. Do you know how MES systems usually calculate this? 15 minutes before Thursday would help.” MES is the shop-floor software that logs stops and output.',
        'Pick the right person.\n\nA senior colleague: method, experience, and political advice (“how do I handle this director?”). A specialist or engineer: technical facts. The client: how their organisation works. Peers, colleagues at your own level: “has anyone seen this before?”\n\nDifferent questions, different people. If the first person can’t help, ask someone else; don’t stop at one.',
        'The client as a resource: “You know this organisation much better than I do. Who would you talk to about this?”\n\nClients like being asked for advice, and it builds their ownership. That’s not weakness; it’s how good consultants find the shortcut. One limit: don’t hand them your homework. Ask for directions, not for the analysis.',
        'Closing the loop: tell the person what you did with their advice and how it went. It costs one message and makes them glad to help next time.\n\nWhat experts argue about: struggling builds skill, but waiting costs the client. A common middle is a time box: try alone for a set time, say half a day, then ask. A sharp question for yourself: “What would I ask if I weren’t worried about looking junior?”',
      ],
      example: {
        kind: 'faded',
        text: 'Week 4 at a food plant. Your analysis shows OEE, the share of planned time the lines make good product at full speed, is 71% in the system, but operators’ own stop logs suggest about 60%. You have spent three days trying to reconcile the two.\n\nYour manager is very busy. The steering group is in eight days and was expecting the baseline, the starting measurement.',
        ask: 'What would you do next?',
        reveal: 'Stop reconciling alone. Send your manager four lines: context, what you tried, the question, a request for 15 minutes this week.\n\nIn parallel, ask the client’s process engineer: “Who knows exactly how the OEE in the system is calculated?” It is probably someone in IT or the MES team, and the answer may be one setting, such as short stops being excluded.\n\nFor the steering group, report it honestly as a finding: “The system shows 71%, the floor logs about 60%. We are checking which definition is right, and that gap is itself important.”',
      },
      said: 'What you hear in projects: “Why didn’t you come to me two weeks ago? This was a ten-minute question.”',
      recall: [
        {
          q: 'Which is the best way to ask a busy senior for help?',
          options: ['“Do you have time to talk sometime?”', '“I’m stuck on X. I tried A and B. My question is C. Could you spare 15 minutes before Thursday?”', 'A long e-mail with all the background', '“Can you take over this part?”'],
          answer: '“I’m stuck on X. I tried A and B. My question is C. Could you spare 15 minutes before Thursday?”',
          why: 'It is short, shows your effort, and makes helping easy.',
        },
        {
          q: 'You need to know how the client’s organisation really decides on budgets. Whom do you ask first?',
          options: ['A technical specialist', 'Someone at the client who knows the organisation', 'A peer at another client', 'Nobody, you guess'],
          answer: 'Someone at the client who knows the organisation',
          why: 'For how their organisation works, the client is the best source.',
        },
        {
          q: 'Why ask the client “Who would you talk to about this?”',
          options: ['It shifts the work to them', 'It is polite small talk', 'It shows you don’t know your job', 'They know the shortcuts, and being asked builds their ownership'],
          answer: 'They know the shortcuts, and being asked builds their ownership',
          why: 'Using their knowledge is effective and strengthens the relationship.',
        },
        {
          q: 'A senior gave you advice that helped. What do you do afterwards?',
          options: ['Tell them what you did with it and how it went', 'Nothing, they are busy', 'Ask for more advice right away', 'Mention it in your annual review'],
          answer: 'Tell them what you did with it and how it went',
          why: 'Closing the loop makes them glad to help next time.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator, two weeks into leading your first project alone. The head of execution ignores your meeting invitations. You don’t know whether to escalate, keep trying, or go around him. The partner at your firm, a senior co-owner who is responsible for this client, knows it well.',
        ask: 'What do you do?',
        model: 'Ask the partner, framed so it’s easy: “The head of execution hasn’t responded to three invitations. I tried e-mail, his assistant and a quick word in the corridor. Would you approach it differently, or is there history I should know? Fifteen minutes this week would help.” I’d also ask my client sponsor: “Who would you talk to, to get his time?” Then act, and tell both what I did.',
        rubric: [
          'Asks for help early instead of struggling alone',
          'Frames the question with context, what was tried and a clear ask',
          'Uses the client as a resource too, and closes the loop',
        ],
        pushback: {
          lines: [
            '“You’re the lead now. If you come to me after two weeks, the client will wonder why we sent you.”',
            '“Have you actually tried walking into his office? Invitations are easy to ignore.”',
          ],
          model: '“Fair, I don’t want you to take it over. I’ve tried three invitations, his assistant and one chat in the corridor; tomorrow I’ll walk in. What I’m asking is fifteen minutes of your view: what does he care about, and who does he listen to? Then I’ll handle it myself.”',
          rubric: [
            'Acknowledges the concern about his role as lead',
            'Names what he already tried and what he needs',
            'Proposes a specific, limited request for help',
          ],
        },
      },
      sayIt: 'Explain to a junior colleague in 60 seconds when and how to ask a senior for help.',
      terms: [
        { term: 'Framing a request', def: 'Context, what you tried, the specific question, what you need by when.' },
        { term: 'Closing the loop', def: 'Telling someone what you did with their help.' },
        { term: 'Client as a resource', def: 'Using the client’s knowledge of their own organisation to find the way.' },
        { term: 'Escalation', def: 'Taking a problem to someone with more authority so they decide, as opposed to asking for advice.' },
        { term: 'MES', def: 'Manufacturing execution system: the shop-floor software that logs orders, stops and output per machine.' },
      ],
    },
    {
      id: 'pm.stuck.experiment',
      title: 'Acting under uncertainty',
      pre: [
        {
          q: 'You’re not sure whether a new planning rule will help. Which approach is usually best?',
          options: ['Analyse more data until you are sure', 'Roll it out everywhere and see', 'Let the most senior person decide', 'Try it small for two weeks with a clear measure, then decide'],
          answer: 'Try it small for two weeks with a clear measure, then decide',
          why: 'A small test answers the question faster and more convincingly than more debate.',
        },
      ],
      teach: [
        'You’ll rarely get certainty. The question is not “are we sure?” but “what’s the cost of being wrong, and can we undo it?”\n\nA reversible decision, like a new meeting format, a planning rule or a board on the wall, can be made fast and tested. An irreversible decision, like buying a machine, changing a shift contract or announcing a reorganisation, deserves slow, careful analysis.',
        'Design a small experiment: a time-boxed test with a measure. Start from a hypothesis, a guess you can prove wrong: “If planners confirm crew and material two days ahead, cancellations drop.”\n\nThe smallest test: two planners, two weeks, about 40 jobs. What you’ll measure, and against what. And, agreed before you start, the stop criterion: what result means continue and what means stop.',
        'Experiments lower resistance. “We’ll try it for two weeks, then decide together” is much easier to say yes to than “from Monday this is the new way”. But keep the promise: evaluate openly, and actually stop if it doesn’t work.\n\nTypical failures: no comparison group, two changes at once, or a test team that gets so much attention it works there and nowhere else.',
        'What experts argue about: speed. In his letter to shareholders for 2015, published in April 2016, Jeff Bezos called reversible decisions “two-way doors” that small groups should make fast. Critics note that “small” changes can be hard to undo socially once people are used to them.\n\nSo ask: “What would it cost to go back, in money and in trust?” And when you don’t know what to do, say: “We don’t know yet. Here’s the smallest thing that would tell us.”',
        'The limit: never experiment with safety. Switching procedures, lockout (locking a machine’s energy off with a personal padlock) and the five safety rules for electrical work (set out in the European standard EN 50110; in the Netherlands, NEN 3140) are not up for a quick test, whatever the pressure.\n\nThose rules: disconnect; secure against reconnection; verify there is no voltage; earth and short-circuit; shield nearby live parts.',
      ],
      example: {
        kind: 'faded',
        text: 'At a grid operator, the team has argued for three weeks about whether planners should call the contractor, the outside firm whose crews do the work, two days before each job to confirm crew and material. Some say it will eat planner time; others say it will cut cancellations.\n\nThere is no data. Cancellations in the region are 16% of planned jobs.',
        ask: 'What would you do next?',
        reveal: 'This is reversible and cheap, so test it instead of debating. Two planners call ahead for two weeks on about 40 jobs; the other planners work as usual. Measure cancellations in both groups and minutes per call.\n\nAgree in advance: if cancellations in the test group drop by at least a third, to about 11% or lower, and calls take under 10 minutes on average, roll it out; otherwise drop it. At 6 minutes a call, 40 jobs cost 4 hours, small next to one cancelled crew day. Tell the team clearly it’s a test, and present the result together.',
      },
      said: 'What you hear in projects: “We can’t change anything until we’re sure it works.”',
      recall: [
        {
          q: 'A planner makes 40 confirmation calls of 6 minutes each. How many hours is that?',
          number: 4,
          tolerance: 0.1,
          unit: 'hours',
          why: '40 × 6 = 240 minutes; 240 / 60 = 4 hours.',
        },
        {
          q: 'Which decision deserves the slowest, most careful analysis?',
          options: ['A new agenda for the weekly meeting', 'A trial of a planning rule with two planners', 'Changing the shift contract for 200 operators', 'Moving a board to another wall'],
          answer: 'Changing the shift contract for 200 operators',
          why: 'It is hard to undo and affects many people; reversible changes can be tested.',
        },
        {
          q: 'When should you agree what result means continue or stop?',
          options: ['Before the experiment starts', 'After you see the results', 'Only if the result is disappointing', 'Never, you decide case by case'],
          answer: 'Before the experiment starts',
          why: 'Deciding afterwards invites everyone to read the result their own way.',
        },
        {
          q: 'Which of these should never be part of a quick experiment?',
          options: ['The order of agenda items', 'How planners confirm material', 'Where the planning board hangs', 'The steps of a switching procedure'],
          answer: 'The steps of a switching procedure',
          why: 'Safety procedures, such as the steps for switching grid parts off and on safely, are not tested by trial and error.',
        },
      ],
      situation: {
        scene: 'You’re at a plastics plant. The production manager wants to move all changeovers, switching a machine from one product to the next, to the start of each shift, but the shift leads say it will create chaos. Both sides are certain. The discussion has taken four meetings.',
        ask: 'What do you propose?',
        model: '“We can keep discussing, or we can find out. I propose we try it on one line for two weeks. We measure changeover time and output on that line against the others. If output doesn’t drop and changeovers get shorter, we extend it; if not, we stop. Shall we agree those criteria now?”',
        rubric: [
          'Turns the debate into a small, reversible test',
          'Defines what to measure and a comparison',
          'Agrees continue and stop criteria up front',
        ],
        pushback: {
          lines: [
            '“An experiment? I’ve heard both sides for four meetings. I know it’s right; it just needs doing.”',
            '“And if you test it on one line, the shift leads will make sure it fails.”',
          ],
          model: '“I understand you want it settled. A two-week trial on one line settles it with facts instead of a fifth meeting. To keep it fair, we agree up front, with you and the shift leads, what counts as success. If it works, it goes plant-wide.”',
          rubric: [
            'Acknowledges his impatience and his concern',
            'Holds to testing before a plant-wide decision',
            'Proposes a concrete trial with criteria agreed up front',
          ],
        },
      },
      sayIt: 'Explain to a client manager in 60 seconds why a small experiment is often better than more analysis.',
      terms: [
        { term: 'Reversible decision', def: 'A decision you can undo cheaply, so you can decide fast and test.' },
        { term: 'Irreversible decision', def: 'A decision that is hard or costly to undo, which deserves careful analysis.' },
        { term: 'Experiment', def: 'A small, time-boxed test with a measure and stop criteria agreed in advance.' },
        { term: 'Hypothesis', def: 'A specific guess about cause and effect that a test can prove wrong.' },
        { term: 'Stop criterion', def: 'The result, agreed before the test, that means you stop instead of rolling out.' },
        { term: 'Five safety rules', def: 'The fixed steps before electrical work: disconnect, secure against reconnection, verify no voltage, earth and short-circuit, shield nearby live parts.' },
      ],
    },
    {
      id: 'pm.stuck.pressure',
      title: 'When the client pushes',
      pre: [
        {
          q: 'An angry client director demands you deliver two weeks earlier. What is the riskiest response?',
          options: ['Asking what is driving the new date', 'Agreeing on the spot to calm him down', 'Saying you’ll come back with options by the end of the day', 'Checking with your own manager'],
          answer: 'Agreeing on the spot to calm him down',
          why: 'A promise made under pressure that you can’t keep turns a hard moment into a broken commitment.',
        },
      ],
      teach: [
        'When a client pushes hard, your first job is to slow down. Don’t defend, don’t promise.\n\nAcknowledge the pressure: “I hear this is urgent for you.” Then name a call-back moment: “Let me look at what’s realistic and call you back at 18:00.” A calm consultant who comes back with options is worth more than a quick yes.',
        'Facts first. What exactly was agreed? What is the status? What changed, for them or for you? Write it down before you call back.\n\nOften the pressure comes from above them: a board meeting, a customer complaint. Ask: “What do you need to show on Monday?” The real need, what they must actually achieve, is often smaller than the demand.',
        'Separate the demand from the options. Rarely is it all or nothing.\n\nCan part go live? Can the board see results instead of a go-live, the day the new way of working starts for real? What is the risk of going faster, and who carries it?\n\nBring two or three options with your recommendation, like you would in any decision.',
        'The steering group, where the sponsor and senior managers decide, is your ally. Trade-offs between time, scope and risk belong there, not in a corridor with one angry manager.\n\nAnd tell your own manager before the client does. If the client escalates to your partner, the senior co-owner of your firm who answers for this client, you want the partner to hear it from you first.',
        'Sometimes the client is right and you did slip. Then own it quickly and plainly, and say what you’re doing about it.\n\nTypical failures: a yes on the phone that you regret by Monday, or defending so hard you win the argument and lose the client. A sharp question for the call-back: “What happens on Monday if we change nothing?”',
      ],
      example: {
        kind: 'faded',
        text: 'Friday 16:30. The production director of a metal plant calls: “The board meets Monday. I need the new planning live on line 2 by then, or this project is cancelled.”\n\nThe plan says go-live in week 12; it is week 9. Day shift has been trained; night shift hasn’t. Your manager is on holiday until Monday.',
        ask: 'What would you do next?',
        reveal: 'Don’t say yes or no on the phone. “I hear this is urgent for Monday. Let me see what’s realistically possible and call you back at 18:00.” Then find what drives it: he probably needs to show the board progress, not literally a full go-live.\n\nPrepare options. A: go live on day shift only from Monday, with you on the floor; night shift follows in week 11 after training. B: no go-live, but give him one page for the board with pilot results and a firm date. Full go-live with an untrained night shift risks a bad week the board will hear about.\n\nRecommend A. Message your manager’s stand-in or your partner before 18:00. Call back on time, and offer to brief him for the board.',
      },
      said: 'What you hear in projects: “I don’t care how, I need this done by Monday. Otherwise I’m calling your boss.”',
      recall: [
        {
          q: 'What is the first thing to do when a client pushes hard?',
          options: ['Explain why the delay isn’t your fault', 'Promise to do your best', 'Slow down, acknowledge the pressure and say when you’ll come back', 'Escalate immediately to his boss'],
          answer: 'Slow down, acknowledge the pressure and say when you’ll come back',
          why: 'Calm and a clear moment to return beats defending or promising in the heat of it.',
        },
        {
          q: 'Which question often reveals that the real need is smaller than the demand?',
          options: ['“What do you need to show on Monday?”', '“Why didn’t you tell me earlier?”', '“Who else knows about this?”', '“Is this really necessary?”'],
          answer: '“What do you need to show on Monday?”',
          why: 'Behind a deadline demand there is often a specific thing to show someone.',
        },
        {
          q: 'Where do trade-offs between time, scope and risk belong?',
          options: ['In a call with the angriest manager', 'With the project team only', 'With the consultant alone', 'In the steering group, with the sponsor'],
          answer: 'In the steering group, with the sponsor',
          why: 'Those are sponsor decisions, taken with the full picture.',
        },
        {
          q: 'The client threatens to call your partner, the senior co-owner of your firm. What do you do?',
          options: ['Hope he doesn’t', 'Tell your partner yourself first, with the facts', 'Give in to the demand', 'Ask the client not to'],
          answer: 'Tell your partner yourself first, with the facts',
          why: 'Your partner should hear it from you, with context, before the client calls.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator. In a steering group, a regional director says sharply: “Your pilot is three weeks late. I was promised results in September.” The delay came from late IT system access, which you escalated in time in the July steering group, but the director missed that meeting.',
        ask: 'How do you respond in the meeting?',
        model: 'Stay calm and start with the facts, without blaming. “You’re right, we’re three weeks behind the September date. The cause was the late system access, which we raised in the July steering group. Here’s where we are now, and two options to recover part of the delay.” Then let the sponsor and the group choose.',
        rubric: [
          'Stays calm and acknowledges the delay without defensiveness',
          'Gives the facts, including the earlier escalation, without blaming',
          'Moves to options for the steering group to decide',
        ],
        pushback: {
          lines: [
            '“I don’t care whose fault it was. I was promised September and now I have nothing.”',
            '“Escalated? Then why didn’t I hear about it? That’s your job too.”',
          ],
          model: '“You’re right to expect results, and I’m sorry this lands on you. The delay came from IT access; I raised it in the July steering group, which you missed. I should have called you directly as well. The first results are ready in three weeks, and until then you get a short update from me every Friday.”',
          rubric: [
            'Acknowledges his frustration without blaming',
            'Restates the facts calmly and owns his part',
            'Proposes a concrete new date and how he will be kept informed',
          ],
        },
      },
      sayIt: 'Explain to a junior colleague in 60 seconds what to do in the first hour after an angry client call.',
      terms: [
        { term: 'Call-back moment', def: 'A specific time you promise to come back, which buys calm and time.' },
        { term: 'Real need', def: 'What the client must actually achieve behind a demand.' },
        { term: 'Go-live', def: 'The moment a new system or way of working starts for real in daily operation.' },
        { term: 'Steering group', def: 'The regular meeting where the sponsor and senior managers take the project’s big decisions and trade-offs.' },
        { term: 'Partner', def: 'A senior co-owner of a consulting firm who answers for the client relationship.' },
      ],
    },
    {
      id: 'pm.stuck.reset',
      title: 'Resetting a failing project',
      pre: [
        {
          q: 'Which outcome of a reset conversation, an honest talk with the sponsor about a failing project, can count as a success?',
          options: ['Stopping the project', 'Keeping the original plan unchanged', 'Agreeing to work harder', 'Postponing the decision to the next quarter'],
          answer: 'Stopping the project',
          why: 'Stopping a project that can’t deliver frees people and money; continuing it wastes both.',
        },
      ],
      teach: [
        'Projects rarely fail suddenly; they drift. Halfway, with the goal clearly out of reach, hoping to catch up is the most common and most expensive choice.\n\nPart of it is the sunk cost trap: what is already spent feels like a reason to go on, while only future costs and benefits should count. A reset means stopping to look honestly and agreeing a new deal.',
        'The honest assessment, on one page. Plan versus reality on goal, scope, time, people and results. Then the causes, using the four kinds of stuck: goal, way, people, capacity.\n\nCheck the RAG status, the red, amber or green colour in the status report. A status that stays green for weeks while the goal slips is a “watermelon”: green outside, red inside. Amber that never turns red is the same trap. Include your own part: “I should have escalated the capacity issue in week 4.”',
        'Talk to your own manager first. Then ask the sponsor for 45 minutes.\n\nOpen plainly: “I want to be straight with you: as it’s set up now, this project won’t reach its goal. Here’s what I see, what I think caused it, and three options.” Options usually are: stop and hand over what works; shrink the scope and finish properly; re-plan with new conditions.',
        'Re-contracting means agreeing the new deal in writing: a new goal sentence, scope, end date, roles, and what the sponsor commits to, like attending every steering group or freeing two planners.\n\nAdd a check-in point, an agreed moment and criterion: “If by week 20 we’re not at X, we stop.” A reset that only moves dates fails a second time.',
        'It will feel uncomfortable, maybe shameful. Do it anyway. Sponsors are often relieved: they felt it too, and nobody said it.\n\nWhat experts argue about: should a reset bring a new lead? Some say a fresh face makes the restart credible; others that the lead who names the problem honestly has earned trust. A sharp question: “Knowing what we know now, would we start this project today?”',
      ],
      example: {
        kind: 'faded',
        text: 'Week 14 of 20 at a grid operator. Goal: halve the time from job request to release, the moment a job is handed to a crew, in three regions.\n\nReality: the pilot runs in one region; release time is down 10%; the sponsor attended one of four steering groups; two key planners left in month two and weren’t replaced. The team still reports amber: at risk, but not failing.',
        ask: 'What would you do next?',
        reveal: 'Write the honest page: plan versus reality, and causes. Mainly capacity (two planners gone) and people (absent sponsor). Add your part: you should have raised the planners leaving in month two.\n\nTalk to your manager. Then ask the sponsor for 45 minutes: “As set up, this project won’t reach its goal.”\n\nThree options. A: stop now and hand over what works in the pilot region. B: shrink to the pilot region, aim for a 40% cut there, finish properly in six weeks. C: all three regions with two extra planners and the sponsor at every steering group, end date ten weeks later.\n\nRecommend B unless she can really commit to C. Write the new agreement down, with a check-in point.',
      },
      said: 'What you hear in projects: “We’re a bit behind, but if everyone pushes in the last few weeks we’ll still make it.”',
      recall: [
        {
          q: 'Why include your own part in the honest assessment?',
          options: ['It is required by your firm', 'It makes the rest of the assessment credible', 'It protects the client from blame', 'It shortens the conversation'],
          answer: 'It makes the rest of the assessment credible',
          why: 'When you name your own mistakes, the sponsor trusts your view of the rest.',
        },
        {
          q: 'Whom do you talk to before the sponsor?',
          options: ['The whole project team', 'The sponsor’s boss', 'Your own manager', 'Nobody, the sponsor should hear it first'],
          answer: 'Your own manager',
          why: 'Your firm should not be surprised, and your manager can help you prepare.',
        },
        {
          q: 'What does a good re-contract, the new written agreement after a reset, contain?',
          options: ['A new goal, scope, end date, roles, sponsor commitments and a check-in point', 'Only a new end date', 'An apology letter', 'A promise to work harder'],
          answer: 'A new goal, scope, end date, roles, sponsor commitments and a check-in point',
          why: 'A reset only works if the conditions change, not just the dates.',
        },
        {
          q: 'Halfway through, the goal is clearly out of reach. What is the most common but most expensive choice?',
          options: ['Stopping the project', 'Reducing the scope', 'Asking for more resources', 'Hoping to catch up in the last weeks'],
          answer: 'Hoping to catch up in the last weeks',
          why: 'It postpones the problem until there are no options left.',
        },
      ],
      situation: {
        scene: 'You’re at a food plant, week 10 of 16. The OEE target, for the share of planned time the lines make good product at full speed, was 75%; you’re at 64% and flat for five weeks. The sponsor is friendly but hasn’t freed the eight maintenance hours a week he promised. Your manager says: “Your call how to handle it.”',
        ask: 'What do you do?',
        model: 'I’d write one page: target 75, actual 64, flat for five weeks, cause mainly capacity, as the promised maintenance hours never came, plus my part in not escalating sooner. Then ask the sponsor for 45 minutes and say plainly the target won’t be reached as things stand. Options: stop and hand over; aim for 68% with the current team; or free the eight maintenance hours a week now and keep 75% with four extra weeks. Agree the new deal in writing.',
        rubric: [
          'Makes an honest one-page assessment including own part',
          'Says plainly to the sponsor that the goal won’t be reached as set up',
          'Offers clear options, including stopping, and re-contracts in writing',
        ],
        pushback: {
          lines: [
            '“Let’s not be dramatic. 64 is already better than before. Keep going and we’ll see in week 16.”',
            '“Maintenance hours are tight everywhere. I can’t just take them from somewhere else.”',
          ],
          model: '“64 is real progress, and I want to protect it. But flat for five weeks means we won’t reach 75 this way. The missing maintenance hours are the main reason. Either we free those eight hours a week, or we lower the target to 68 now. I’d like you to choose this week.”',
          rubric: [
            'Acknowledges the progress and his constraints',
            'Says plainly that the current path will not reach the target',
            'Proposes a clear choice with a deadline',
          ],
        },
      },
      sayIt: 'Explain to a junior colleague in 60 seconds how to run a reset conversation with a sponsor.',
      terms: [
        { term: 'Reset', def: 'Stopping to assess a failing project honestly and agreeing a new deal.' },
        { term: 'Sunk cost', def: 'Money and effort already spent that you can’t get back; it should not decide whether you continue.' },
        { term: 'RAG status', def: 'Red, amber or green in a status report: in trouble, at risk, or on track.' },
        { term: 'Re-contracting', def: 'Agreeing a new goal, scope, roles and commitments in writing.' },
        { term: 'Check-in point', def: 'An agreed moment and criterion to decide whether to continue or stop.' },
      ],
    },
  ],
};
