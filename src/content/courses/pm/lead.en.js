// pm.lead (EN): Leading people: influence without authority, feedback, difficult conversations, team dynamics, listening and leading yourself.
export default {
  lessons: [
    {
      id: 'pm.lead.influence',
      title: 'Influence without authority',
      pre: [
        {
          q: 'You need a plant manager who outranks you to free two operators for your project. What is usually the most effective first move?',
          options: ['Ask your sponsor to instruct him', 'Find out what he needs this quarter and link your request to it', 'Send a well-argued email with the business case (costs and benefits on paper)', 'Raise it at the steering committee, the senior managers who oversee the project'],
          answer: 'Find out what he needs this quarter and link your request to it',
          why: 'People say yes to what helps them. Escalating first costs you the relationship you will need later.',
        },
      ],
      teach: [
        'As a consultant you can’t order anyone around. You trade.\n\nA stakeholder is anyone who can help or block your project, or who feels its effects: the plant manager, a shift lead, a planner. Each has interests: what they are judged on, what keeps them up at night, what they want to avoid. Cohen and Bradford (Influence Without Authority, 1990) call what you can offer a “currency”: help, information, visibility, time saved, a problem off their plate.',
        'Reciprocity is the strong habit of repaying what we receive; Robert Cialdini made it famous in Influence (1984). So give first. Pull the data they have wanted for months, fix a report, show them a finding before it goes to the steering committee: the senior managers who meet, often monthly, to oversee your project and take its big decisions.\n\nSmall, real help builds credit. It isn’t manipulation as long as the help is genuine and you would have offered it anyway.',
        'Credibility when you’re the youngest comes from three things, not from a title: being precise (your numbers are right and you know where they come from), doing what you said by when you said it, and being on the floor. One accurate observation from the shop floor beats ten slides.\n\nWhat you hear when it’s missing: “Interesting, let’s see.” Then nothing. The typical failure: one wrong number in week 2, and every number after it gets checked twice.',
        'Map before you move. A stakeholder map puts each person on two axes: influence on your project, low to high, and current stance, against to for. Ten to fifteen names is normal for one project.\n\nWin first the person with high influence who is still neutral and whom others listen to: often a respected shift lead, not the most senior. Keep your sponsor, the senior manager who commissioned the project and backs it, in reserve: every time you send them in, you spend goodwill.',
        'Talk one-on-one before any group meeting; nobody likes being surprised in front of peers. Lines that work: “What would make this worth it for you?” “If I take the weekly report off your plate, could you free Jan for two mornings?” “Who should I talk to first?”\n\nPractitioners disagree on whether to start with the critics or with the movable middle; most start in the middle. Before every request, ask yourself: what does this person get out of saying yes?',
      ],
      example: {
        kind: 'faded',
        text: 'Week 4 at a grid operator. Your project aims to cut jobs cancelled in the week itself. Next Tuesday you present a readiness check, a short list that confirms permits, material and access before a crew drives out, at the regional team meeting.\n\nThe head of planning supports it, but has little sway over the field. The head of execution is sceptical and the crews respect him.\n\nAns, a work preparer (she gets drawings, permits and material ready for each job) with 25 years in, is the one everyone asks when a job is unclear; she hasn’t said what she thinks. The regional manager is your sponsor.',
        ask: 'What would you do next?',
        reveal: 'Don’t walk into Tuesday cold. Start with Ans: show her the data on cancelled jobs, ask her to poke holes in the check, and adopt her best improvement, visibly.\n\nThen see the head of execution one-on-one. His currency is crews not driving out for jobs that can’t be done, so frame it as “fewer wasted crew trips” and ask: “What would have to be in this for you to back it?”\n\nKeep the sponsor in reserve. On Tuesday, let Ans explain the parts she improved.',
      },
      said: 'What you hear in projects: “If Ans says it works, the rest of the office will follow.”',
      recall: [
        {
          q: 'In influence without authority, what is a “currency”?',
          options: ['Your consulting rate', 'Something the other person values that you can offer', 'The project budget', 'Your sponsor’s backing'],
          answer: 'Something the other person values that you can offer',
          why: 'Help, information, visibility or time saved: you trade what they value for what you need.',
        },
        {
          q: 'Whom do you usually try to win first?',
          options: ['The most senior person in the room', 'The loudest critic', 'The person with high influence who is still neutral and whom others listen to', 'Whoever agrees already'],
          answer: 'The person with high influence who is still neutral and whom others listen to',
          why: 'They are movable and they move others; supporters are already there and loud critics rarely turn first.',
        },
        {
          q: 'Why do you talk to key people one-on-one before a group meeting?',
          options: ['To save time in the meeting', 'Because group meetings are unimportant', 'To get the decision made without them', 'People rarely change position in public, and nobody likes being surprised in front of peers'],
          answer: 'People rarely change position in public, and nobody likes being surprised in front of peers',
          why: 'In a one-on-one they can ask questions and shape it; in a group they defend.',
        },
        {
          q: 'You’re the youngest in the room. What builds credibility fastest?',
          options: ['Precise numbers and doing what you said, when you said it', 'Mentioning your firm’s big clients', 'Using lots of method terms', 'Agreeing with the most senior person'],
          answer: 'Precise numbers and doing what you said, when you said it',
          why: 'Senior people judge on reliability and accuracy, which age doesn’t give you but work does.',
        },
      ],
      situation: {
        scene: 'You’re at a metal parts manufacturer. The maintenance manager, 20 years your senior, keeps postponing the two hours a week his technicians promised your project. He’s friendly about it: “Next week, it’s busy.”',
        ask: 'What do you say in your next one-on-one with him?',
        model: 'I’d ask what’s eating his technicians’ time right now, and listen. Then link it: “If the changeover data, how long the presses stand still when they switch to another product, shows where your breakdowns come from, that’s fewer breakdown calls for your people. Could we start with one hour on Thursday, on the press line you’re most worried about?” And I’d offer something concrete, like taking the downtime report off his plate.',
        rubric: [
          'Asks about his pressures before repeating the request',
          'Links the project to something he is judged on',
          'Makes a smaller, concrete ask and offers something in return',
        ],
        pushback: {
          lines: [
            '“Listen, I’ve run this department for fifteen years. Breakdowns come first. Your project can wait a week.”',
            '“You’re young, you’ll learn: on a real floor, no plan survives Monday morning.”',
          ],
          model: '“You’re right that breakdowns come first; I’d do the same. That’s exactly why I’m asking: the changeover data should mean fewer breakdowns for your people. One hour on Thursday, on the press line you worry about most. If it’s no use to you, tell me.”',
          rubric: [
            'Acknowledges his experience and priorities',
            'Restates the request, linked to his own goals',
            'Proposes a smaller, concrete commitment',
          ],
        },
      },
      sayIt: 'Explain to a new junior consultant in 60 seconds how to get things done at a client when nobody has to listen to you.',
      terms: [
        { term: 'Stakeholder', def: 'Anyone who can help or block your project, or who feels its effects.' },
        { term: 'Currency', def: 'Something a stakeholder values that you can offer in exchange for their help (Cohen and Bradford).' },
        { term: 'Reciprocity', def: 'The habit of repaying what you receive; giving first builds credit.' },
        { term: 'Steering committee', def: 'The senior managers who oversee a project and take its big decisions, often in a monthly meeting.' },
        { term: 'Stakeholder map', def: 'Stakeholders plotted by influence and stance, to decide whom to win first.' },
        { term: 'Sponsor', def: 'The senior manager who commissioned the project and backs it; your last resort when you’re stuck.' },
      ],
    },
    {
      id: 'pm.lead.feedback',
      title: 'Feedback that lands',
      pre: [
        {
          q: 'A senior client manager kept checking his phone during your workshop, and the team noticed. When is the best moment to give feedback?',
          options: ['Right then, in front of the group', 'At the next steering committee', 'Never: he’s the client', 'Soon after, one-on-one, after asking if he’s open to it'],
          answer: 'Soon after, one-on-one, after asking if he’s open to it',
          why: 'Private, soon, and with permission: the three things that make upward feedback hearable.',
        },
      ],
      teach: [
        'SBI is a feedback structure from the Center for Creative Leadership: Situation, Behaviour, Impact.\n\nSituation: when and where. Behaviour: observable behaviour, meaning what a camera would have recorded, without interpretation. Impact: the effect on you, the team or the result.\n\nThen a question. “In yesterday’s workshop (S), you were on your phone for most of the second hour (B). Two operators stopped talking because they thought it was already decided (I). What was going on?”',
        'Behaviour, not character. “You interrupted Ans twice” is feedback; “you’re dominant” is a label people defend against. Tie the impact to something they care about: their goal, their team, the project they sponsor.\n\nOne point per conversation; three at once turns feedback into a performance review. Many trainers now advise against the feedback sandwich, criticism tucked between two compliments: people learn to brace at every compliment and miss the message.',
        'Timing. As soon as you can, in private, when you’re both calm: within a day or two. Not right before he presents.\n\nPositive feedback works the same way and should come more often. Specific praise, like “opening with the outage numbers got the crews listening”, builds the credit you need for the harder message. Vague praise (“good job”) builds nothing, because nobody knows what to repeat.',
        'Upward feedback is feedback to someone above you in rank or power, such as a senior client. Ask permission: “Can I share an observation from this morning?” Make it about the shared goal, keep it small, use “I noticed”.\n\nThen ask and listen. If he pushes back, don’t argue the facts a second time; ask what he saw. When it lands you hear “Hm. Fair.” When it doesn’t, he changes the subject: leave it for today.',
        'Receiving it. Say thanks, ask for an example, don’t defend on the spot: “Can you give me an example, so I know what to change?” Come back later with what you did with it.\n\nFeedforward, Marshall Goldsmith’s term, looks ahead instead of back: ask for one or two suggestions for next time. A sharp question after any workshop: “What is one thing I should do differently next session?” It is easier to answer honestly than “How did I do?”',
      ],
      example: {
        kind: 'faded',
        text: 'This morning’s working session at a food manufacturer. The operations director, 55 and your sponsor, answered every question you addressed to his team leads. After the fourth time, the team leads went quiet.\n\nYou need them to own the actions. You have a short slot with him after lunch.',
        ask: 'What would you do next?',
        reveal: 'Ask permission and link it to his goal: “Can I share an observation from this morning? It’s about getting the team leads to own this, which you asked me for.”\n\nS: “In the session, when I asked the team leads about the changeover data,” B: “you answered the first four questions yourself.” I: “After that, Peter and Sandra didn’t say anything, and I need their commitment on the actions.”\n\nThen ask: “How did you see it?” And stop talking. If he agrees, offer: “Next time, could you let them answer first and add yours after?”',
      },
      said: 'What you hear in projects: “Can I share an observation from this morning? It’s small, but it matters for the rollout.”',
      recall: [
        {
          q: 'Which of these is a behaviour in SBI terms?',
          options: ['You weren’t interested', 'You’re too dominant', 'You checked your phone four times during the session', 'You don’t respect the team'],
          answer: 'You checked your phone four times during the session',
          why: 'Behaviour is observable; the others are interpretations people will defend against.',
        },
        {
          q: 'What do you do right after giving the SBI?',
          options: ['Ask a question and listen', 'Give your solution', 'Repeat it so it sinks in', 'Give two more points while you’re at it'],
          answer: 'Ask a question and listen',
          why: 'Their view may change the picture, and it turns a verdict into a conversation.',
        },
        {
          q: 'What is the first step when giving feedback to a senior client?',
          options: ['Copy your manager in', 'Ask permission to share an observation', 'Start with three compliments', 'Put it in writing'],
          answer: 'Ask permission to share an observation',
          why: 'Permission makes the senior person choose to listen, which lowers defensiveness.',
        },
        {
          q: 'A senior manager pushes back on your feedback: “That’s not how it went.” What do you do?',
          options: ['Repeat the facts more firmly', 'Drop it and apologise', 'Escalate to the sponsor', 'Ask what he saw'],
          answer: 'Ask what he saw',
          why: 'Arguing the facts again makes it a contest; his view may give you information you missed.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator. The planning lead, your main contact, sends the weekly data two days late every week, which leaves you one day for your analysis before the Thursday review. You haven’t said anything yet.',
        ask: 'How do you raise it with him?',
        model: 'I’d ask for ten minutes and say: “Can I raise something practical? The last three weeks (S), the data came in on Wednesday instead of Monday (B). That leaves me one day before the Thursday review, so the analysis gets thinner (I). What makes Monday hard?” Then I’d look for a fix with him, like an automatic export.',
        rubric: [
          'Uses situation, observable behaviour and impact',
          'Asks a question about his side instead of assuming',
          'Moves to a concrete, shared fix',
        ],
        pushback: {
          lines: [
            '“Two days, really? You get the data, don’t you? I have bigger fires to put out.”',
            '“Monday is impossible. The system only closes the week on Tuesday night.”',
          ],
          model: '“I understand, and I do get it, thank you. The two days matter because the analysis gets thin. If the system closes on Tuesday night, let’s move the review to Friday, or set up an automatic export that’s ready first thing Wednesday. Which works better for you?”',
          rubric: [
            'Acknowledges his workload and the system constraint',
            'Restates the impact plainly',
            'Proposes concrete options and lets him choose',
          ],
        },
      },
      sayIt: 'Explain to a colleague in 60 seconds how to give feedback to someone more senior than you.',
      terms: [
        { term: 'SBI', def: 'Situation, Behaviour, Impact: a structure for feedback based on what you observed.' },
        { term: 'Observable behaviour', def: 'What a camera would record, without interpretation.' },
        { term: 'Feedback sandwich', def: 'Criticism tucked between two compliments; many trainers advise against it because people stop trusting the praise.' },
        { term: 'Upward feedback', def: 'Feedback to someone with more seniority or power than you.' },
        { term: 'Feedforward', def: 'Asking for suggestions for next time instead of judging the past (Marshall Goldsmith).' },
      ],
    },
    {
      id: 'pm.lead.difficult',
      title: 'Difficult conversations',
      pre: [
        {
          q: 'Which part of a difficult conversation do most people prepare least, and regret most?',
          options: ['The facts', 'The opening sentence', 'The agenda', 'The meeting room'],
          answer: 'The opening sentence',
          why: 'People prepare arguments and then improvise the start, which sets the tone for everything after.',
        },
      ],
      teach: [
        'Every difficult conversation is three conversations at once (Stone, Patton and Heen, Difficult Conversations, 1999).\n\nThe “what happened” conversation: the facts, who’s right. The feelings conversation: anger, embarrassment, hurt. The identity conversation: what this says about me. Am I competent? Am I taken seriously?\n\nUnder pressure the identity conversation runs loudest, especially when you’re the youngest in the room. You notice it in yourself as the urge to prove you’re right.',
        'Prepare on paper; fifteen minutes is usually enough.\n\nWhat did you see? What is probably their story? What do you feel? What was your contribution: what did you do, or leave undone, that helped create this? The book swaps blame for contribution, because blame looks back and contribution helps you fix it.\n\nWhat do you want at the end: one concrete agreement? Then write the first two sentences and say them out loud; the opening is where most conversations go wrong.',
        'Open straight, with the “third story”: how a neutral observer would describe the difference between you. “I’d like to talk about the downtime data. We see it differently, and I want to understand how you look at it.”\n\nNo long warm-up; people feel it coming and tense up. Opinions differ on small talk: in a Dutch workplace one sentence is plenty, in some cultures skipping it feels rude. Never open by e-mail; tone gets lost and positions harden in writing.',
        'Stay with facts and feelings. Separate what happened from what you made of it. Name emotions when they show: “You sound frustrated.”\n\nThen intent versus impact: you know your impact, only they know their intent. So don’t accuse; ask. “I don’t think you meant it this way, but it made it harder for me to get people to talk. What did you mean by it?”',
        'End with an agreement: who does what by when, and how you check. Say it out loud.\n\n“So you send the downtime log by Thursday, and I take out the shift comparison. Shall we look at it together Monday?” Then confirm it in two lines the same day.\n\nThe typical failure: a good talk, warm feelings, no agreement, and next week the same problem. A sharp closing question: “What will each of us do differently from tomorrow?”',
      ],
      example: {
        kind: 'faded',
        text: 'Week 3 at a packaging plant. Henk, a team leader in his fifties, told his shift in front of you: “This consultant thinks he knows our line after two weeks.”\n\nYour analysis is due Friday and you still need his line data. You felt your face go red and said nothing.',
        ask: 'What would you do next?',
        reveal: 'Book twenty minutes alone with him, today or tomorrow. Prepare: the facts (what he said, data not received), his likely story (an outsider judging his line, his team getting the blame), your feelings (embarrassed, irritated) and your identity trap (wanting to prove you’re competent). Goal: data by Wednesday and Henk checking the analysis before Friday.\n\nOpen: “Henk, I want to talk about Monday’s remark and about the data, because I need your help to get this right.” Then: “When you said that in front of the shift, it made it harder for me to get people to talk. What’s behind it?”\n\nListen. End with the agreement.',
      },
      said: 'What you hear in projects: “I’d like to talk about Monday. I don’t think we see it the same way, and I want to hear how you look at it.”',
      recall: [
        {
          q: 'Which of the three conversations usually makes you defensive?',
          options: ['The facts', 'The agenda', 'The planning', 'The identity conversation: what this says about you'],
          answer: 'The identity conversation: what this says about you',
          why: 'When your competence feels at stake, you defend instead of listen.',
        },
        {
          q: 'What is a “third story” opening?',
          options: ['Describing the situation as a neutral observer would', 'Telling a story about a previous client', 'Starting with your own view', 'Quoting a third person who agrees with you'],
          answer: 'Describing the situation as a neutral observer would',
          why: 'It names the difference without blaming, so both sides can start from it.',
        },
        {
          q: 'Someone’s remark hurt your project. What do you speak about, and what do you ask about?',
          options: ['You state their intent, you ask about the facts', 'You speak about your impact, you ask about their intent', 'You speak about both, you ask about neither', 'You avoid both'],
          answer: 'You speak about your impact, you ask about their intent',
          why: 'You know the impact on you; you don’t know their intent, so you ask.',
        },
        {
          q: 'How do you end a difficult conversation well?',
          options: ['With a joke to ease the tension', 'By agreeing to talk again sometime', 'With a concrete agreement said out loud: who does what by when', 'By letting them have the last word'],
          answer: 'With a concrete agreement said out loud: who does what by when',
          why: 'Without a spoken agreement both leave with a different version of what was decided.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator. A senior planner has told your project lead that “the young consultant” is wasting the planners’ time with questions. You hear it secondhand. You need the planners for two more weeks.',
        ask: 'How do you handle it?',
        model: 'I’d go to the planner directly instead of letting it run through others. “I heard you feel the questions are taking too much of the planners’ time. I want to hear that from you, because I need their input for two more weeks. What would work better?” Then I’d agree something concrete, like one fixed half hour a week, and confirm it in writing.',
        rubric: [
          'Goes to the person directly rather than through others',
          'Opens neutrally and asks for their view',
          'Ends with a concrete agreement on how to work together',
        ],
        pushback: {
          lines: [
            '“Yes, I said it. Your questions take hours and we never see what comes of them.”',
            '“We have a job to do. Two more weeks of this is too much.”',
          ],
          model: '“Thanks for being direct; I’d rather hear it from you. You’re right that you haven’t seen anything back yet. On Friday I’ll show what your answers have produced so far. For the next two weeks: one fixed half hour a week, and I bring my questions as a list.”',
          rubric: [
            'Acknowledges the criticism without getting defensive',
            'Makes clear the planners’ input is still needed',
            'Proposes a concrete, lighter way of working and shows results',
          ],
        },
      },
      sayIt: 'Explain to a friend in 60 seconds how to prepare a conversation you’d rather avoid.',
      terms: [
        { term: 'Three conversations', def: 'What happened, feelings, and identity: all three run in every difficult talk (Stone, Patton and Heen).' },
        { term: 'Identity conversation', def: 'The inner question of what this says about you: am I competent, am I taken seriously?' },
        { term: 'Contribution', def: 'What each side did, or left undone, that helped create the problem; used instead of blame.' },
        { term: 'Third story', def: 'Describing the situation as a neutral observer would, as a way to open.' },
        { term: 'Intent versus impact', def: 'You can speak about the effect on you; their intention is theirs to tell, so you ask about it.' },
      ],
    },
    {
      id: 'pm.lead.teams',
      title: 'Team dynamics',
      pre: [
        {
          q: 'A project team never disagrees in meetings, yet decisions don’t get carried out. What is the most likely cause?',
          options: ['Artificial harmony: the disagreement goes underground', 'Too much conflict', 'Bad minutes', 'Too many meetings'],
          answer: 'Artificial harmony: the disagreement goes underground',
          why: 'If people don’t voice doubts, they don’t commit, and the decision quietly dies after the meeting.',
        },
      ],
      teach: [
        'A widely used model comes from Patrick Lencioni’s The Five Dysfunctions of a Team (2002). Trust makes healthy conflict possible; conflict makes real commitment possible; commitment makes accountability and results possible.\n\nTrust here means saying “I don’t know” or “I got that wrong” without paying for it. Commitment means backing a decision, even one you argued against. Accountability means team members hold each other to what was agreed, instead of leaving that to the boss.',
        'Amy Edmondson’s related term, from her research on work teams (1999), is psychological safety: the shared belief that it is safe to take that kind of risk in this team. Google’s Project Aristotle, an internal study of its own teams (2015, published as a guide, not peer-reviewed), named it the most important of five team dynamics it found.\n\nExperts point out that Lencioni’s pyramid is a business fable with little hard research behind it; Edmondson’s work has much more. Use Lencioni as a map for the conversation, not as science.',
        'Spot it.\n\nLow trust: people check with their boss after the meeting, nobody admits a mistake. No conflict: what Lencioni calls artificial harmony, where meetings feel smooth and the real discussion happens at the coffee machine. No commitment: “we’ll look into it”, actions without owners, decisions reopened next week. Low accountability: only the consultant chases missed actions.',
        'As an outsider you’re not the boss, but you shape the meeting. Make disagreement safe: “What would go wrong with this?” “Who sees it differently?” Go round the table and let the quietest people speak first.\n\nA pre-mortem helps: “It’s three months from now and this has failed. Why?” Gary Klein, who developed it, cites (2007) a study by Mitchell, Russo and Pennington (1989) in which imagining the failure had already happened made people about 30% better at finding the reasons.',
        'Lock in commitment. Close every decision with who, what and by when, and ask: “Can everyone live with this?” Silence isn’t yes, so ask the quiet ones by name. Send the decisions the same day.\n\nKnow your limits. If the real problem is two managers in a quiet war, you won’t fix it in the team meeting. Take what you saw, and its effect on the project, to the sponsor one-on-one. A sharp question for yourself: who talks after the meeting, and to whom?',
      ],
      example: {
        kind: 'faded',
        text: 'A project team at a machine builder: maintenance lead, production lead, two operators, a planner and a quality engineer. Meetings are pleasant and actions get agreed, but 60% aren’t done by the next meeting.\n\nThe operators almost never speak. After meetings, the production lead complains to you about maintenance.',
        ask: 'What would you do next?',
        reveal: 'This is artificial harmony and no commitment, with low trust between production and maintenance underneath.\n\nNext meeting: go round the table starting with the operators, and run a pre-mortem on the main action. Close each action with an owner and a date, and ask each person by name if they can live with it.\n\nThen talk to the production lead one-on-one: “You’ve told me this three times now. Are you willing to say it to him, with me in the room?” If it turns out to be a deeper conflict between the two managers, bring it to the sponsor.',
      },
      said: 'What you hear in projects: “Everyone nodded on Tuesday. By Thursday, nobody remembered agreeing.”',
      recall: [
        {
          q: 'In Lencioni’s model, what comes first: the base the rest builds on?',
          options: ['Accountability', 'Trust', 'Commitment', 'Results'],
          answer: 'Trust',
          why: 'Without trust there is no open conflict, and without conflict no real commitment.',
        },
        {
          q: 'Which is a sign of missing commitment?',
          options: ['Heated discussions in the meeting', 'People asking critical questions', 'Actions without owners and decisions reopened next week', 'A long agenda'],
          answer: 'Actions without owners and decisions reopened next week',
          why: 'People didn’t really buy in, so the decision doesn’t stick.',
        },
        {
          q: 'As an outsider, how do you get quiet team members to speak?',
          options: ['Wait until they volunteer', 'Ask the manager to make them', 'Send a survey afterwards', 'Go round the table and let the quietest speak first'],
          answer: 'Go round the table and let the quietest speak first',
          why: 'Once senior people have spoken, others tend to agree; going first gives them room.',
        },
        {
          q: 'What does a pre-mortem do?',
          options: ['Brings doubts into the open by imagining the plan has already failed', 'Reviews a finished project', 'Checks the budget', 'Assigns blame in advance'],
          answer: 'Brings doubts into the open by imagining the plan has already failed',
          why: 'It makes voicing concerns the task, so nobody looks negative for raising them.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator, in a team of planners and work preparers. In meetings, the senior planner speaks first and longest, and the others agree. In the corridor, two preparers tell you the plan won’t work.',
        ask: 'What do you change in the next meeting?',
        model: 'I’d change the order: “Before we decide, I’d like to hear everyone, starting with the preparers, because they’ll build this.” I’d ask: “What would go wrong with this in practice?” And I’d ask the senior planner beforehand to hold his view until the end, framing it as getting the preparers’ buy-in.',
        rubric: [
          'Changes who speaks first instead of just asking for input',
          'Uses a question that makes doubts safe to voice',
          'Prepares the dominant person beforehand rather than confronting him in the meeting',
        ],
        pushback: {
          lines: [
            '“Why do I suddenly have to wait my turn? I’ve planned this region for twenty years.”',
            '“If they had a problem with the plan, they could have said so. Nobody stopped them.”',
          ],
          model: '“Your twenty years are exactly why I want your view, and you’ll have it. I want to hear everyone first, because some people only speak when there’s room. You close the round; that’s where your experience weighs most. Can we try it for two meetings?”',
          rubric: [
            'Acknowledges his experience and position',
            'Holds to giving the others room first',
            'Proposes a short, concrete trial with a role for him',
          ],
        },
      },
      sayIt: 'Explain to a client project lead in 60 seconds why a team that never disagrees is a warning sign.',
      terms: [
        { term: 'Commitment', def: 'Really backing a decision and acting on it, even one you argued against.' },
        { term: 'Accountability', def: 'Team members holding each other to what was agreed, instead of leaving it to the boss.' },
        { term: 'Psychological safety', def: 'The shared belief that people can admit mistakes and disagree without being punished for it (Edmondson).' },
        { term: 'Artificial harmony', def: 'A team that avoids open disagreement, so conflict moves to the corridor (Lencioni).' },
        { term: 'Pre-mortem', def: 'Imagining the plan has failed and asking why, before you start (Klein).' },
      ],
    },
    {
      id: 'pm.lead.listen',
      title: 'Listening under pressure',
      pre: [
        {
          q: 'A plant manager snaps: “This project is costing my people hours we don’t have.” What is the strongest first response?',
          options: ['Explain the benefits of the project', 'Show that the hours are within the plan', '“Hours you don’t have. What’s eating them right now?”', 'Promise to cut the meetings'],
          answer: '“Hours you don’t have. What’s eating them right now?”',
          why: 'Reflect, then ask: it lowers the heat and gets you the real problem before you answer.',
        },
      ],
      teach: [
        'Active listening, a term from the psychologists Carl Rogers and Richard Farson (1957), means listening to understand, not to reply. MORE PIES is a handy checklist for it.\n\nMood: read the energy in the room before the content. Open questions: what and how, not yes or no, so the other person tells the story. Reflecting: give back the feeling. Empathy: show you get why it matters to them.',
        'Paraphrasing: restate the content in your own words. Inquiry: dig one level deeper. Experience: share your own only when it helps them. Silence: let it work.\n\nUnder pressure you skip straight to defending or solving. The rule: reflect or paraphrase first, then ask, then answer. Reflecting: “That sounds frustrating.” Paraphrasing: “So the forms took more time than the change saved.” When someone attacks the project, there’s usually a worry underneath: workload, blame, losing control.',
        'Silence. After a question, count to five in your head.\n\nIn classroom research in the 1970s, Mary Budd Rowe found teachers waited about one second for an answer; when they waited three seconds or more, answers got longer and better thought out. Adults in meetings are no different: the real answer often comes after the first one. Being comfortable with silence reads as confidence, which helps when you’re the youngest in the room.',
        'Questions that open: “What worries you most about this?” “What would have to be true for this to work?” “What have you tried before?” “What am I missing?”\n\nAvoid “why” when emotions run high: it sounds like an accusation. Use “what made you…” instead.\n\nThe typical failure is the fake question: “Don’t you think we should…?” People hear the answer you want, give it to you, and you learn nothing.',
        'Experience, used well. The trap is “At a previous client we had exactly that…”, which takes the floor away from them.\n\nUse it as a bridge: one sentence, then hand it back. “I’ve seen that go wrong when the people doing the work weren’t asked. Is that what happened here?”\n\nCheck yourself after a tough meeting: what did I learn that I didn’t know before? If nothing, you talked more than you listened.',
      ],
      example: {
        kind: 'faded',
        text: 'Team meeting at a grid operator. You’ve just shown the plan.\n\nA senior work preparer says loudly: “We did a project like this three years ago. Nothing changed, we just got more forms.” The room goes quiet and everyone looks at you.',
        ask: 'What would you do next?',
        reveal: 'Mood: tense; don’t meet it with defensiveness. Reflect: “So you’ve seen this before, and it gave you more work.” Then silence: wait.\n\nOpen question: “What happened then? What made it end in forms?” Paraphrase his answer: “So the problem was that the preparers weren’t asked, and the forms came from head office.”\n\nEmpathy: “I get why you’re sceptical.” Then commit: “I’d like you to tell me when you see this one heading the same way. Could you look at the check with me on Thursday?”',
      },
      said: 'What you hear in projects: “We’ve tried this before.” And the answer that works: “What happened then?”',
      recall: [
        {
          q: 'What is the difference between reflecting and paraphrasing?',
          options: ['There is no difference', 'Reflecting is a question, paraphrasing is a statement', 'Reflecting is for seniors, paraphrasing for juniors', 'Reflecting gives back the feeling, paraphrasing the content'],
          answer: 'Reflecting gives back the feeling, paraphrasing the content',
          why: '“That sounds frustrating” reflects; “so the forms cost more than they saved” paraphrases.',
        },
        {
          q: 'Why avoid “why” questions when emotions run high?',
          options: ['They are too long', 'They sound like an accusation', 'They are closed questions', 'They are too personal'],
          answer: 'They sound like an accusation',
          why: '“Why did you…” invites a defence; “what made you…” invites an explanation.',
        },
        {
          q: 'After you ask a question, how long should you be willing to stay silent?',
          options: ['Around five seconds, or longer', 'One second', 'Not at all; fill the gap quickly', 'Until the senior person speaks'],
          answer: 'Around five seconds, or longer',
          why: 'The considered answer usually comes after the first quick one.',
        },
        {
          q: 'How do you use your own experience without taking over?',
          options: ['Tell the whole story so they see you know it', 'Never mention it', 'One sentence, then a question that hands it back', 'Only at the end of the meeting'],
          answer: 'One sentence, then a question that hands it back',
          why: 'Experience works as a bridge to their story, not as a replacement for it.',
        },
      ],
      situation: {
        scene: 'You’re in a steering committee at a manufacturer. The finance director cuts in: “Honestly, I don’t see what we’re getting for this money.” The sponsor looks at you.',
        ask: 'What do you say first?',
        model: 'I’d not jump into the benefits. First: “You’re not seeing the return yet.” A short pause. Then: “What would you need to see to know it’s worth it?” Then I’d paraphrase his answer and only then link what we have, or say honestly what we don’t have yet and when we will.',
        rubric: [
          'Reflects or paraphrases before defending',
          'Asks an open question to find his real criterion',
          'Answers against his criterion, and is honest about gaps',
        ],
        pushback: {
          lines: [
            '“That’s a nice story, but I asked what we get for the money. I want a number, not a process.”',
            '“And if you can’t give me a number today, why should I believe one next month?”',
          ],
          model: '“Fair question, and you should get a number. Today we can show one hard figure: overtime on the pilot lines is down by a fifth. The rest is still a forecast, and I won’t dress it up. I’ll send you the calculation tomorrow, so you can check it yourself.”',
          rubric: [
            'Acknowledges the question as fair',
            'Answers straight and honestly, without overselling',
            'Proposes a concrete follow-up he can check',
          ],
        },
      },
      sayIt: 'Explain MORE PIES to a colleague in 60 seconds, with one example line for each letter you find hardest.',
      terms: [
        { term: 'Active listening', def: 'Listening to understand rather than to reply, and showing it (Rogers and Farson).' },
        { term: 'MORE PIES', def: 'A checklist for active listening: Mood, Open questions, Reflecting, Empathy, Paraphrasing, Inquiry, Experience, Silence.' },
        { term: 'Open question', def: 'A what or how question that can’t be answered with yes or no.' },
        { term: 'Reflecting', def: 'Giving back the feeling you hear: “That sounds frustrating.”' },
        { term: 'Paraphrasing', def: 'Restating the content in your own words to check you understood.' },
      ],
    },
    {
      id: 'pm.lead.self',
      title: 'Leading yourself',
      pre: [
        {
          q: 'Your heart is pounding just before a big presentation. Which approach worked better in experiments?',
          options: ['Telling yourself to calm down', 'Skipping preparation so you don’t overthink', 'Avoiding eye contact with seniors', 'Telling yourself “I’m excited”'],
          answer: 'Telling yourself “I’m excited”',
          why: 'Nerves and excitement feel the same in the body; reframing as excitement improved performance (Brooks, 2014).',
        },
      ],
      teach: [
        'Being the youngest. First impressions form fast: in one well-known study (Willis and Todorov, 2006), people judged a face as trustworthy or competent after seeing it for a tenth of a second. In a meeting, people size you up early on preparation and calm, not only on age.\n\nWhat works: know your numbers cold, sit at the table rather than along the wall, say something in the first ten minutes, and drop the hedge. Not “Sorry, maybe a stupid question”, but “One question:”.',
        'Many capable people feel like frauds who will be found out. The psychologists Pauline Clance and Suzanne Imes described this in 1978 as the impostor phenomenon; today most people call it impostor syndrome, though it is not a medical diagnosis. It is common among high achievers and new starters.\n\nThe cure is not to feel confident first. It is to act on evidence: what did I prepare, and what do I know that they don’t?',
        'Nerves. Your body’s arousal before a big moment feels the same as excitement. In experiments by Alison Wood Brooks (2014), people who said “I’m excited” before a speech or a maths test did better than people who tried to calm down. This reframing works because it uses the energy instead of fighting it.\n\nBreathe out longer than in for a minute or two; it can slow your heart rate. Prepare your first thirty seconds word for word, so you’re on rails when the adrenaline peaks.',
        'Say it plainly. An assertive statement has three parts: what you see, what you think, what you propose. “The data covers two weeks. I think this is premature. I propose we wait for the full month.”\n\nWhen you don’t know: “I don’t know yet. I’ll come back to you on Thursday.” When a senior pushes back, don’t fold and don’t escalate: “Fair point. What I see in the data is this. How do you see it?” Holding your position once, calmly, is often enough.',
        'Recovery after a bad meeting. Within 24 hours, write down the facts, your part, and what you would do differently. Then act: a short message to the person, like “I didn’t explain it well yesterday; here’s the one-pager.”\n\nIf you were wrong, say so quickly; that builds credibility too. Talk it through with someone you trust. One bad meeting rarely defines you; how you follow up often does. The sharp question: what one thing will I do differently next time?',
      ],
      example: {
        kind: 'faded',
        text: 'You presented first results to the management team of a manufacturer. After two minutes the finance director cut in: “These numbers don’t match ours.”\n\nYou lost your thread, rushed through the rest and finished early. Now you’re back at your desk, replaying it.',
        ask: 'What would you do next?',
        reveal: 'Facts first: his number and yours differ, most likely a different period or definition. Find out which before anything else.\n\nYour part: you didn’t state your source and definitions at the start, and you didn’t pause when he cut in. Act today: email him, “You raised a fair point about the numbers. Ours use the line’s own downtime log for March; I’d like fifteen minutes to align with yours before the next management team meeting.”\n\nAsk your manager how it came across. Next time, open with source and definitions, and have a line ready: “Good point. Which figure do you have?”',
      },
      said: 'What you hear in projects: “I don’t know yet. I’ll come back to you on Thursday.”',
      recall: [
        {
          q: 'Which opening sounds most confident in a meeting with senior people?',
          options: ['“Sorry, maybe a stupid question, but…”', '“I’m just the consultant, but…”', '“One question:”', '“I could be wrong, but maybe…”'],
          answer: '“One question:”',
          why: 'Apologies and hedges shrink you before you’ve said anything.',
        },
        {
          q: 'A senior manager asks something you don’t know. What is the best answer?',
          options: ['Give your best guess as fact', '“I don’t know yet. I’ll come back to you on Thursday.”', 'Change the subject', 'Refer him to your manager'],
          answer: '“I don’t know yet. I’ll come back to you on Thursday.”',
          why: 'It’s honest and comes with a commitment; bluffing gets found out.',
        },
        {
          q: 'Which breathing pattern helps calm nerves fastest?',
          options: ['Short, quick breaths', 'Holding your breath', 'Breathing in longer than out', 'Breathing out longer than in'],
          answer: 'Breathing out longer than in',
          why: 'A long exhale engages the body’s calming system, and within a minute or two your heart rate can drop.',
        },
        {
          q: 'What do you do first after a meeting that went badly?',
          options: ['Write down the facts, your part, and what you’d do differently', 'Avoid the person for a while', 'Explain to everyone why it wasn’t your fault', 'Forget it and move on'],
          answer: 'Write down the facts, your part, and what you’d do differently',
          why: 'Facts calm the replaying in your head and give you a concrete next step.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator, about to lead a workshop with eight experienced planners, most of them over 45. In the coffee line one says, half joking: “So you’re going to tell us how to plan?”',
        ask: 'What do you say, and how do you open the workshop?',
        model: 'I’d smile and say: “No, you know planning far better than I do. I’m here to help find where the time goes.” In the workshop I’d open with one sharp fact from their own data, then ask: “What do you see in this?” That puts their expertise first and shows I’ve done my homework.',
        rubric: [
          'Responds calmly without apologising or getting defensive',
          'Opens with a concrete fact from their own data',
          'Positions their expertise as central with an open question',
        ],
        pushback: {
          lines: [
            '“No offence, but I was planning grid work when you were in primary school.”',
            '“We’ve had workshops before. Lots of sticky notes, and then nothing changes.”',
          ],
          model: '“None taken; that experience is why you’re in the room. I’m not here to tell you how to plan. I bring the data on where jobs get stuck, you tell me what it means. And at the end we pick one thing, with a name and a date on it.”',
          rubric: [
            'Responds to his experience calmly, not defensively',
            'Makes his own role clear',
            'Proposes a concrete outcome for the workshop',
          ],
        },
      },
      sayIt: 'Explain to a new junior consultant in 60 seconds how you handle being the youngest in the room.',
      terms: [
        { term: 'Hedge', def: 'A softening phrase like “maybe a stupid question”, which shrinks you before you’ve said anything.' },
        { term: 'Impostor syndrome', def: 'Feeling like a fraud who will be found out despite evidence of competence (Clance and Imes, 1978).' },
        { term: 'Reframing', def: 'Calling nerves excitement, so the same energy helps you instead of blocking you.' },
        { term: 'Assertive statement', def: 'What you see, what you think, what you propose, said plainly.' },
        { term: 'Recovery', def: 'Facts, your part, and one action within 24 hours after a meeting that went badly.' },
      ],
    },
  ],
};
