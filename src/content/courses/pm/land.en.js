// pm.land (EN): Land, making the change stick: adoption, resistance, communication, training, handover and sustaining results.
export default {
  lessons: [
    {
      id: 'pm.land.change',
      title: 'What really drives adoption',
      pre: [
        {
          q: 'What best predicts whether operators keep using a new way of working after the project?',
          options: ['How good the training slides were', 'Whether their direct supervisor asks about it and uses it', 'How many e-mails announced it', 'Whether the CEO opened the kick-off'],
          answer: 'Whether their direct supervisor asks about it and uses it',
          why: 'People do what their direct boss pays attention to, day after day.',
        },
      ],
      teach: [
        'Change management is the work of getting people to actually work the new way. Two models you’ll hear.\n\nKotter’s eight steps (John Kotter, Leading Change, 1996) are for the organisation: create urgency, form a group that drives it, make the picture clear, communicate it, remove obstacles, get quick wins, early visible successes, keep going, and anchor it in how things work.',
        'ADKAR, from the firm Prosci (Jeff Hiatt), is for one person: Awareness (I know it changes), Desire (I want to), Knowledge (I know how), Ability (I can do it in practice), Reinforcement (it keeps being rewarded).\n\nUse it as a diagnosis, not a slide. Not aware: they need to hear it from their boss. No desire: find out what they lose. No knowledge: explain. No ability: practice on the job. No reinforcement: someone has to ask about it every week.',
        'Adoption means people actually using the new way, also when nobody is watching. What drives it in practice: the new way is easier than the old one for the person doing it; their direct boss asks about it; they helped shape it; and the old way is gone, so there’s no fallback.\n\nIf the new process takes the operator longer than the old one, no campaign will save it.',
        'The people side: say the reason in their terms. Not “to improve OEE”, the score for how much of its planned time a line makes good product, but “so you’re not called in on Saturday because the line is behind”.\n\nWhen you don’t know why people aren’t adopting, ask five of them: “What makes this hard to use?” You’ll usually hear one practical thing you can fix this week.',
        'Watch the weeks after go-live, the day the new way officially starts. That’s when the old way tempts and problems show up.\n\nExperts argue about the famous claim that 70% of change programmes fail: a 2011 review by Mark Hughes found no solid evidence behind the number. Kotter’s model is also criticised as too top-down. Ask the sharp question: “What does the operator lose if he works the new way?”',
      ],
      example: {
        kind: 'worked',
        text: 'At a packaging plant, operators were to log every stop longer than 2 minutes on a new terminal, a touchscreen PC next to the line. After six weeks, only 40% of stops are logged. You walk the floor and ask eight operators.\n\nAll know about it (awareness fine) and know how (knowledge fine). But three say: “Nobody ever does anything with it.” And two say the terminal is at the end of the line, 30 metres from where stops happen.\n\nTwo fixes: the shift lead opens each shift start with the top three stops from yesterday and what happens with them (desire, reinforcement), and maintenance moves the terminal to the middle of the line (ability). Four weeks later: 85% logged.',
      },
      said: 'What you hear in projects: “They all got the training. They just don’t want to change.”',
      recall: [
        {
          q: 'Operators know the new process and want it, but on a busy shift they can’t yet do it fast enough, so they fall back to the old way. Where in ADKAR are they stuck?',
          options: ['Awareness', 'Desire', 'Ability', 'Knowledge'],
          answer: 'Ability',
          why: 'They know and want, but can’t yet do it reliably in practice: they need practice and support on the job.',
        },
        {
          q: 'Which of these drives adoption most?',
          options: ['A poster campaign', 'The new way being easier than the old one for the person doing it', 'A strong project logo', 'A message from head office'],
          answer: 'The new way being easier than the old one for the person doing it',
          why: 'If the new way costs them more effort, they will drift back.',
        },
        {
          q: 'Why remove the old way of working when possible?',
          options: ['To punish people who resist', 'Because it is required by Kotter', 'To save money on tools', 'So there is no fallback when things get busy'],
          answer: 'So there is no fallback when things get busy',
          why: 'Under pressure people go back to what they know, if it is still there.',
        },
        {
          q: 'People aren’t adopting and you don’t know why. What is the best first step?',
          options: ['Ask a few of them what makes it hard to use', 'Send a reminder e-mail', 'Repeat the training', 'Report it to the sponsor'],
          answer: 'Ask a few of them what makes it hard to use',
          why: 'The reason is often practical and quick to fix, but only they can tell you.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator, the company that runs the regional power network. A new work order app, which tells field technicians which job to do where, was rolled out three months ago. Half of them still call the planner instead. The IT lead says: “We need another training round.”',
        ask: 'What do you ask or do before agreeing to more training?',
        model: 'I’d ride along with two or three technicians and ask what makes the app hard to use in the field. Then check where they’re stuck: do they know how but lack signal or time, or don’t they see the point? And I’d ask whether their team leaders use the app data in their own morning meeting. Training only helps if knowledge is the problem.',
        rubric: [
          'Goes to the field to find the real reason before choosing a fix',
          'Diagnoses where people are stuck instead of assuming knowledge',
          'Checks whether their direct supervisors reinforce it',
        ],
        pushback: {
          lines: [
            '“The app works fine. The technicians just need to learn it. Training is what we always do.”',
            '“If you go asking technicians why, you’ll only get complaints about IT.”',
          ],
          model: '“The app may well work fine, and training may be part of it. Before we spend another round, I want to know why half of them still call. I’ll ride along with two technicians this week. If it’s skills, we train. If it’s something else, training won’t fix it.”',
          rubric: [
            'Acknowledges his view that the app works',
            'Holds to finding the cause before more training',
            'Proposes a quick, concrete way to find out',
          ],
        },
      },
      sayIt: 'Explain to a plant manager in 60 seconds why a good training doesn’t guarantee people will use a new process.',
      terms: [
        { term: 'Change management', def: 'The work of getting people to actually adopt a new way of working.' },
        { term: 'Kotter', def: 'Eight steps for organisational change, from urgency to anchoring it in the culture.' },
        { term: 'ADKAR', def: 'Awareness, Desire, Knowledge, Ability, Reinforcement: the steps one person goes through in a change.' },
        { term: 'Adoption', def: 'People actually using the new way of working, also when nobody is watching.' },
        { term: 'Go-live', def: 'The day the new way of working or system officially starts.' },
      ],
    },
    {
      id: 'pm.land.resistance',
      title: 'Working with resistance',
      pre: [
        {
          q: 'Which is easier to work with as a consultant?',
          options: ['Open resistance with arguments', 'Polite silent agreement', 'Nobody showing up', 'A team that agrees to everything'],
          answer: 'Open resistance with arguments',
          why: 'Open resistance tells you what’s wrong; silent agreement hides it until go-live.',
        },
      ],
      teach: [
        'Resistance is people slowing or blocking a change. It takes three forms.\n\nOpen resistance: arguments, anger, “this won’t work”. Passive resistance: yes in the meeting, nothing after; “too busy”; people missing sessions. Hidden resistance: “we tried that in 2019”, the old spreadsheet kept alive, data that never arrives.\n\nOpen resistance is a gift: it tells you what to work on. The other two are harder, because you have to find them first.',
        'Resistance tells you something real. Usually one of these: a loss, something they give up (status, skill, control, overtime pay); extra work for them; an earlier project that failed and they paid for it; or a flaw in your design they can see and you can’t.\n\nAsk before you judge: “What would have to be true for this to work for you?”',
        'Work with it, not against it. Invite the sharpest critic into the design: their objections make it better, and a converted critic convinces others more than you ever will.\n\nThis is old news. In 1948 Coch and French showed at a pyjama factory in Virginia that workers who helped design a new method got their output back faster, and quit less, than workers who were simply told.',
        'Be honest when a loss is real: “Yes, you’ll lose the Saturday overtime. Here’s why we still think it’s right.”\n\nDon’t label people as “resisters” in conversations with management; it sticks and closes the door. When you don’t know what’s behind it, have a coffee with the person, one-on-one, away from the meeting. Ask about their experience with earlier changes; often you hear the real story there.',
        'You’ll hear about the change curve: shock, denial, frustration, then acceptance. Management writers adapted it from Elisabeth Kübler-Ross’s 1969 stages for dying patients; she did not write about organisations. It reminds you that a dip in mood is normal, but there is little evidence that people pass through fixed stages.\n\nExperts also argue about the word itself: with Ronald Heifetz, many say people don’t resist change, they resist loss. A common failure is treating all resistance as a bad attitude.',
      ],
      example: {
        kind: 'worked',
        text: 'At a metal works, the most senior setter, Henk, who sets up the presses for each new order, keeps saying the new planning board “is for office people”. In meetings he crosses his arms; his colleagues follow him.\n\nYou ask him for coffee and ask what worries him. He says that in the old way he decided the order on the floor, and now a planner does it from the office. Also: the planner doesn’t know that the big press needs 40 minutes to warm up after a weekend.\n\nYou invite Henk to define the rules for the board with the planner. The warm-up rule goes in. Two weeks later Henk explains the board to the night shift himself.',
      },
      said: 'What you hear in projects: “We tried exactly this in 2019. It didn’t work then either.”',
      recall: [
        {
          q: 'People say yes in meetings but nothing happens afterwards. What form of resistance is this?',
          options: ['Open', 'Hidden', 'Passive', 'Not resistance at all'],
          answer: 'Passive',
          why: 'Agreeing in the room and not acting after is the typical passive form.',
        },
        {
          q: 'Why involve the sharpest critic in the design?',
          options: ['To keep him busy', 'His objections improve the design and he convinces others', 'To show management who resists', 'Because it is a formal requirement'],
          answer: 'His objections improve the design and he convinces others',
          why: 'Critics often see real flaws, and a converted critic has credibility you lack.',
        },
        {
          q: 'An operator will really lose his Saturday overtime pay. What do you say?',
          options: ['Nothing, it may not come up', 'That it is not your decision', 'That he will earn more in the long run', 'Acknowledge the loss honestly and explain why you still think it’s right'],
          answer: 'Acknowledge the loss honestly and explain why you still think it’s right',
          why: 'Denying a real loss destroys trust; naming it keeps it.',
        },
        {
          q: 'Which question best uncovers what resistance is about?',
          options: ['“What would have to be true for this to work for you?”', '“Why are you against this?”', '“Do you understand the plan?”', '“Who told you that?”'],
          answer: '“What would have to be true for this to work for you?”',
          why: 'It invites conditions and concerns instead of a defence.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator, the regional power network company, introducing a new readiness check: a check that each job has people, parts and permits before it is planned. The planners are on board, but a group of experienced work preparers, who put together the drawings, materials and permits for each job, keeps saying “this just adds paperwork” and their checklists come in half filled.',
        ask: 'How do you handle this?',
        model: 'I’d sit down with two of them, one-on-one, and ask what in the checklist feels like paperwork and what would make it useful for them. They may be right that some checks are pointless. I’d then invite one of them to rework the checklist with the planners, and drop what adds nothing. And I wouldn’t label them as resisters to their manager.',
        rubric: [
          'Talks to them individually to understand the objection',
          'Treats their objection as possibly valid and improves the design',
          'Involves them in reworking it and avoids labelling them',
        ],
        pushback: {
          lines: [
            '“We’ve prepared jobs for twenty years without your checklist. It just adds paperwork.”',
            '“If management wants it, fine, we’ll fill it in. Don’t expect us to like it.”',
          ],
          model: '“Fair, you know jobs better than any checklist. I’m not after paperwork; I want fewer jobs cancelled on the day itself. Which questions on it are useless to you? Let’s cut those together on Thursday. Whatever stays, you’ll have chosen.”',
          rubric: [
            'Acknowledges their experience and the extra work',
            'Makes the purpose behind the check clear',
            'Proposes improving it together, concretely',
          ],
        },
      },
      sayIt: 'Explain to a client manager in 60 seconds why resistance is useful information and how you work with it.',
      terms: [
        { term: 'Open resistance', def: 'Arguments and objections said out loud; the easiest form to work with.' },
        { term: 'Passive resistance', def: 'Agreeing in public but not acting, missing sessions, being “too busy”.' },
        { term: 'Hidden resistance', def: 'Keeping the old way alive quietly, or undermining with “we tried that”.' },
        { term: 'Loss', def: 'What someone gives up in a change: status, skill, control, money or comfort.' },
        { term: 'Change curve', def: 'The idea that people’s mood dips and then recovers during a change; useful, but not fixed stages.' },
      ],
    },
    {
      id: 'pm.land.communication',
      title: 'Communicating change',
      pre: [
        {
          q: 'From whom do employees most want to hear how a change affects their own job?',
          options: ['The CEO', 'The project consultant', 'HR', 'Their direct supervisor'],
          answer: 'Their direct supervisor',
          why: 'Senior leaders explain why; the direct boss is trusted on “what does it mean for me”.',
        },
      ],
      teach: [
        'A stakeholder is anyone affected by the change or able to influence it. Map who hears what, when. Groups: directly affected (they work differently), indirectly affected (their input or output changes), and managers.\n\nPer group, answer five questions: what changes for me, when, why, what is expected of me, and where can I ask questions. That one-page table is your communication plan.',
        'Sequence matters. Managers hear it before their teams, so they can answer questions instead of being surprised. Passing it down level by level like this is called a cascade. Never let people hear it first in the corridor or from another site.\n\nIf a rumour is already out, communicate the same day, even if not everything is decided: “Here’s what we know, here’s what we don’t yet, and when we will.”',
        'The middle manager, the shift lead or team leader between senior management and the floor, is the key channel. The plant manager can explain why; the shift lead is the one people ask “what does this mean for my Monday?”\n\nEquip middle managers first: their own questions answered, three talking points, key messages they can say in their own words, and a short list of likely questions with answers.',
        'Repeat. One message in one meeting is not communication. A town hall, one big meeting for all staff, is good for the why, but people need to hear it several times, in several ways: the board, the shift start, a one-on-one. Kotter (1995) estimated from experience that leaders under-communicate their vision by a factor of ten.\n\nCheck if it landed: ask a few people what they understood. When you don’t know an answer, say so and say when you’ll know.',
        'Prosci, the consulting firm behind ADKAR, reports the same split in its own surveys of change practitioners: employees want the business reasons from senior leaders, and what it means for their own job from their direct supervisor.\n\nA common failure is the cascade that stops halfway: the managers were briefed, but half never told their teams. A week later, ask each manager the sharp question: “Which of your people have you told, and what did they ask?”',
      ],
      example: {
        kind: 'worked',
        text: 'A grid operator, the regional power network company, changes how planned jobs get released: from next month, no job enters the week plan without a passed readiness check (people, parts and permits confirmed).\n\nYour plan: week 1, the head of planning tells the five team leaders, with a one-page FAQ, a list of frequently asked questions with answers, and their own questions answered. Week 2, each team leader tells their planners in their own team meeting, using three talking points. Same week, a short message to the execution team leaders, because their crews will see fewer but more reliable jobs.\n\nWeek 3 and 4: the check is on the board at every planning meeting. In week 4 you ask six planners what they understood. Two think the check is optional; you fix that in the next meeting.',
      },
      said: 'What you hear in projects: “Nobody told us anything. We heard it from the guys in Zwolle.”',
      recall: [
        {
          q: 'Who should hear about a change first?',
          options: ['Everyone at the same time', 'The managers, before their teams', 'The most affected employees', 'The works council (elected employee body) only'],
          answer: 'The managers, before their teams',
          why: 'Managers then can answer their teams’ questions instead of being surprised.',
        },
        {
          q: 'A rumour about the change is already going round. What do you do?',
          options: ['Communicate the same day what you know, what you don’t yet, and when you will', 'Wait until everything is decided', 'Deny the rumour', 'Ignore it'],
          answer: 'Communicate the same day what you know, what you don’t yet, and when you will',
          why: 'Silence lets the rumour set the story; partial honesty beats it.',
        },
        {
          q: 'How do you best equip middle managers?',
          options: ['Send them the project plan', 'Invite them to the steering group', 'Answer their own questions first and give them talking points and likely questions', 'Let them figure it out'],
          answer: 'Answer their own questions first and give them talking points and likely questions',
          why: 'They can only explain what they understand and agree with.',
        },
        {
          q: 'How do you check if your message landed?',
          options: ['Count the e-mails opened', 'Ask the managers if they passed it on', 'Assume it did if nobody complains', 'Ask a few people what they understood'],
          answer: 'Ask a few people what they understood',
          why: 'What people understood is what counts, not what you sent.',
        },
      ],
      situation: {
        scene: 'You’re at a food plant. The new shift pattern, which crews work which hours and days, starts in six weeks. The plant manager wants to announce it in a town hall next week and “then we’re done communicating”.',
        ask: 'What do you propose?',
        model: '“The town hall is good for the why. But people will ask their shift lead what it means for their weekends. Can we brief the shift leads first, with an FAQ, a sheet of likely questions and answers, so they can answer? Then the town hall, then each shift lead talks to his team in the shift start. And in week three we ask a few operators what they understood.”',
        rubric: [
          'Keeps the town hall for the why but adds more moments',
          'Briefs and equips the shift leads before their teams',
          'Plans repetition and a check on what landed',
        ],
        pushback: {
          lines: [
            '“A town hall reaches everyone at once. More sessions just stir things up.”',
            '“The shift leads have enough to do. I don’t want them answering questions all week.”',
          ],
          model: '“The town hall is a good start; everyone hears it from you. But people really make up their minds talking to their own shift lead. I’d like to give the shift leads a one-page Q and A and fifteen minutes at each shift start. That stirs up less than six weeks of rumours.”',
          rubric: [
            'Acknowledges the value of the town hall and his concern',
            'Holds to more than one moment of communication',
            'Proposes a light, concrete follow-up through the shift leads',
          ],
        },
      },
      sayIt: 'Explain to a plant manager in 60 seconds why the middle manager is the most important channel in a change.',
      terms: [
        { term: 'Stakeholder', def: 'Anyone affected by the change or able to influence it.' },
        { term: 'Communication plan', def: 'Per group: what changes, when, why, what is expected, where to ask.' },
        { term: 'Cascade', def: 'Passing a message down level by level: managers first, then their teams.' },
        { term: 'Talking points', def: 'Three or four key messages a manager can use in his own words.' },
        { term: 'Middle manager', def: 'The shift lead or team leader between senior management and the floor.' },
        { term: 'Town hall', def: 'One big meeting for all staff, good for explaining the why.' },
      ],
    },
    {
      id: 'pm.land.training',
      title: 'Training and work instructions',
      pre: [
        {
          q: 'What is the best check that a training worked?',
          options: ['A satisfaction score at the end of the training', 'A written test', 'Watching people do the task on the job a week later', 'Attendance numbers'],
          answer: 'Watching people do the task on the job a week later',
          why: 'Only what people do on the job counts; liking a training says little.',
        },
      ],
      teach: [
        'Write the new way down as a short work instruction: one page per task, steps in order, photos of the real equipment, and for each step the key point, the detail that makes it go right or wrong, plus why it matters.\n\nWrite it with the people who do the work and test it: let someone who wasn’t involved follow it while you watch. Where they hesitate, the instruction is unclear.',
        'This comes from TWI, Training Within Industry, a US wartime programme started in 1940 that issued over 1.6 million certificates by 1945. Its Job Instruction method has four steps: prepare the learner, show and explain, let them try while you correct, then follow up.\n\nIts motto still holds: if the worker hasn’t learned, the instructor hasn’t taught. Toyota adopted it in the 1950s.',
        'Classroom versus on the job. A classroom is good for the why and the big picture, in 30 to 60 minutes. Skills are learned through on-the-job training: show it, do it together, let them do it while you watch, check later.\n\nShift leads or experienced operators make the best trainers, if you train them first. Train just before people need it; a session six weeks before go-live is mostly forgotten by then.',
        'Plan short sessions in the week before go-live and support on the floor in the first two weeks after. Cover every shift, including nights and weekends, which projects often forget.\n\nCheck it stuck: a week later, watch people do it without help, not to judge them, but to see whether the instruction or the training needs fixing. When many people make the same mistake, the instruction is wrong, not the people.',
        'Trainers often measure the wrong thing. The Kirkpatrick levels (Donald Kirkpatrick, 1959) rank four checks: did they like it, did they learn it, do they do it on the job, did results improve. Most projects stop at the first: a smiley form.\n\nExperts argue whether a classroom is needed at all. The popular 70-20-10 rule (70% learned on the job, 20% from others, 10% in courses) is a practitioner model with weak evidence. If you don’t know the task well, let the expert train and check the result yourself.',
      ],
      example: {
        kind: 'worked',
        text: 'A grid operator introduces a new way for technicians to report as-built data (where the cable and its joints, the connections between cable lengths, actually ended up) with an app. You write a one-page instruction with the team leader: six steps, photos of the app screens, and the key point “photograph the joint before the trench is filled in again, because you can’t afterwards”. A technician who wasn’t involved tests it; he gets stuck on step 4, which you rewrite.\n\nTraining: 30 minutes in the morning meeting on why, then the team leader goes along on the first job of each technician.\n\nA week later you check 20 reports: 15 complete, 5 without the joint photo. All 5 are from crews who start at 6:00, before the team leader arrives. Next week, a team leader starts early.',
      },
      said: 'What you hear in projects: “We trained everyone in March. By June they were doing it the old way again.”',
      recall: [
        {
          q: 'Where are skills best learned?',
          options: ['In a classroom with slides', 'From an e-mail instruction', 'In an e-learning module', 'On the job: show, do together, let them do, check'],
          answer: 'On the job: show, do together, let them do, check',
          why: 'Skills need practice on the real equipment with feedback.',
        },
        {
          q: 'Many people make the same mistake after training. What does that tell you?',
          options: ['They weren’t paying attention', 'The instruction or training needs fixing', 'They are resisting the change', 'More people need to be trained'],
          answer: 'The instruction or training needs fixing',
          why: 'A shared mistake points at the system, not at the individuals.',
        },
        {
          q: 'When should you train people?',
          options: ['Just before they need it, with support in the first weeks after', 'As early as possible, months ahead', 'Only after go-live, when problems appear', 'Once a year'],
          answer: 'Just before they need it, with support in the first weeks after',
          why: 'Training long before use is largely forgotten by the time it is needed.',
        },
        {
          q: 'How do you test a new work instruction?',
          options: ['Let someone who wasn’t involved follow it while you watch', 'Have the author read it again', 'Send it to the manager for approval', 'Check the spelling'],
          answer: 'Let someone who wasn’t involved follow it while you watch',
          why: 'Where a newcomer hesitates, the instruction is unclear.',
        },
      ],
      situation: {
        scene: 'You’re at a plastics plant. The new changeover checklist, for switching a machine to the next product, was trained in one classroom session for day shift. Night shift got the slides by e-mail. Go-live is Monday.',
        ask: 'What do you do before and after Monday?',
        model: 'Before Monday, I’d arrange a short session for night shift, ideally led by their own shift lead, whom I’d brief first. After go-live, I’d make sure a trained person is on the floor for the first changeovers on every shift. A week later I’d watch a few changeovers, without judging, to see where people get stuck and fix the checklist or the training.',
        rubric: [
          'Covers the forgotten shift before go-live',
          'Plans on-the-job support in the first days',
          'Checks a week later by watching, and fixes the instruction if needed',
        ],
        pushback: {
          lines: [
            '“Night shift are professionals. They can read slides. We’re not moving go-live.”',
            '“An extra session at night costs overtime. Who pays for that?”',
          ],
          model: '“I’m not asking to move Monday. Night shift are professionals, and still, slides don’t show where it goes wrong. Their shift lead and I will run a thirty-minute session at their shift start on Sunday night, and I’ll stand next to the first two night changeovers. That costs less than one bad changeover.”',
          rubric: [
            'Acknowledges the go-live date and the cost',
            'Holds to hands-on training for night shift',
            'Proposes a small, concrete session and support on the floor',
          ],
        },
      },
      sayIt: 'Explain to a team leader in 60 seconds how you train a new way of working so it actually sticks.',
      terms: [
        { term: 'Work instruction', def: 'One page per task: steps, photos, key points and why they matter.' },
        { term: 'Key point', def: 'The detail in a step that makes it go right or wrong.' },
        { term: 'TWI', def: 'Training Within Industry: a US wartime programme of the 1940s; its Job Instruction method teaches a job in four steps.' },
        { term: 'On-the-job training', def: 'Show, do together, let them do it, check: learning on the real work.' },
        { term: 'Kirkpatrick levels', def: 'Four ways to check a training: reaction, learning, behaviour on the job, results.' },
      ],
    },
    {
      id: 'pm.land.handover',
      title: 'Handing over to the line',
      pre: [
        {
          q: 'When is a handover to the line organisation really done?',
          options: ['When the final presentation is given', 'When the documentation is sent', 'When the owner has run it alone for a few cycles and solved a problem without you', 'When the sponsor signs off'],
          answer: 'When the owner has run it alone for a few cycles and solved a problem without you',
          why: 'Ownership is proven by doing, not by documents or presentations.',
        },
      ],
      teach: [
        'The line organisation, the regular departments and managers who run the work every day, owns the result after you leave. Name one process owner for each new process: the one person responsible for how it runs and for its KPI, a key performance indicator, the number that shows whether it works.\n\nThe owner should have daily contact with the work, like a planning manager, not a staff role that only reports on it.',
        'What the owner must be able to do alone: read the KPI and know what’s normal, run the review meeting, train new people, solve the common problems, and know whom to call for the rare ones.\n\nWrite these down as a handover checklist and tick them off together, one by one, as the owner shows each skill in real work, not in a presentation.',
        'Hand over in steps. First the owner watches you run it. Then the owner runs it while you sit beside them. Then they run it alone and you only hear about it. Each step takes a few cycles, for example three weekly meetings.\n\nPut the KPIs in the reports and meetings the line already uses, not in a separate project dashboard that dies when you leave.',
        'The people side: owners often accept a handover reluctantly, as one more thing on their plate. Ask: “What would you need to be able to run this without me?”\n\nTake the answer seriously: time, an analyst, access to data. If the owner can’t get those, the handover isn’t realistic yet, and the sponsor needs to know.',
        'IT projects call the weeks right after go-live hypercare: extra support on call, often two to six weeks, before normal support takes over. Improvement projects need the same, with a clear end date.\n\nA common failure: the handover is a final presentation and a folder of documents, and three months later nobody opens the folder. Ask the sharp question: “Has the owner solved a problem with it without me?”',
      ],
      example: {
        kind: 'worked',
        text: 'At a cable manufacturer you hand over the new weekly planning meeting to the planning manager, Sanne. The checklist: she can read the on-time delivery KPI, the share of orders delivered on the promised date, and knows 92% is normal; she chairs the meeting; she can explain the capacity model, the sheet of available machine and staff hours, to a new planner; she knows what to do when a rush order comes in.\n\nWeeks 1 to 3: you chair, she watches. Weeks 4 to 6: she chairs, you sit beside her and debrief for 10 minutes after. Weeks 7 to 9: she runs it alone.\n\nIn week 8 a key machine breaks down and she re-plans the week without calling you. The KPI moves into the monthly operations report. Handover done.',
      },
      said: 'What you hear in projects: “So now that’s mine too? Next to everything else?”',
      recall: [
        {
          q: 'Who should own a new process after the project?',
          options: ['The consultant, until the next project', 'Someone in daily contact with the work, like the planning manager', 'A staff department that reports on it', 'The steering group as a whole'],
          answer: 'Someone in daily contact with the work, like the planning manager',
          why: 'The owner must be close enough to the work to steer it every week.',
        },
        {
          q: 'Where should the KPIs live after handover?',
          options: ['In a separate project dashboard', 'In the final report', 'In the consultant’s files', 'In the reports and meetings the line already uses'],
          answer: 'In the reports and meetings the line already uses',
          why: 'A separate dashboard dies when the project ends.',
        },
        {
          q: 'What is the right order for handing over a meeting?',
          options: ['Owner watches, owner runs with you beside, owner runs alone', 'Owner runs alone from day one', 'You run it until the end, then send a manual', 'Owner and you take turns indefinitely'],
          answer: 'Owner watches, owner runs with you beside, owner runs alone',
          why: 'Stepwise handover builds skill and confidence.',
        },
        {
          q: 'The owner says he has no time to run the new process. What do you do?',
          options: ['Run it for him a bit longer', 'Find another owner yourself', 'Ask what he needs to run it, and take it to the sponsor if he can’t get it', 'Simplify the process until it takes no time'],
          answer: 'Ask what he needs to run it, and take it to the sponsor if he can’t get it',
          why: 'A handover without the means to run it will fail; the sponsor must decide.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator, the regional power network company. Your project ends in four weeks. The new readiness check works, but you still chair the weekly review. The team leader who should take over says: “It works fine like this, why change it?”',
        ask: 'What do you do?',
        model: '“Because in four weeks I’m gone, and I want it to keep working without me.” Then I’d agree a short checklist of what he must be able to do alone, let him chair next week with me beside him, and ask what he needs to make time for it. If he can’t get that time, I’d raise it with the sponsor now, not in week four.',
        rubric: [
          'Makes the reason for handing over clear',
          'Starts a stepwise handover with a checklist',
          'Checks the owner’s means and escalates early if missing',
        ],
        pushback: {
          lines: [
            '“You chair it well. If I take over, it just becomes one more meeting on my plate.”',
            '“And when you’re gone and it falls apart, they’ll blame me, not you.”',
          ],
          model: '“Thank you, and that’s exactly the risk: it works because I chair it. In four weeks I’m gone. Let’s switch now: you chair from next week, and I sit next to you for three weeks. If something goes wrong, it happens while I’m still here to help fix it.”',
          rubric: [
            'Acknowledges his workload and his fear of blame',
            'Holds to handing over before he leaves',
            'Proposes a concrete, supported transition',
          ],
        },
      },
      sayIt: 'Explain to a client manager in 60 seconds how you hand over a new process so it keeps running after you leave.',
      terms: [
        { term: 'Line organisation', def: 'The regular departments and managers who run the work every day.' },
        { term: 'Process owner', def: 'The one person in the line who is responsible for a process and its KPI.' },
        { term: 'KPI', def: 'Key performance indicator: the number that shows whether a process works.' },
        { term: 'Handover checklist', def: 'What the owner must be able to do alone, ticked off together.' },
        { term: 'Hypercare', def: 'A short period of extra support right after go-live, with a clear end date.' },
      ],
    },
    {
      id: 'pm.land.sustain',
      title: 'Sustaining results',
      pre: [
        {
          q: 'After a successful project, when do results most often start to slip?',
          options: ['Two to four months after the consultant leaves', 'In the first week after go-live', 'After about five years', 'They rarely slip'],
          answer: 'Two to four months after the consultant leaves',
          why: 'A practitioner rule of thumb: once project attention fades, exceptions creep in and people go back to old habits.',
        },
      ],
      teach: [
        'Expect the three-month dip: results often slide a few months after the project ends. It is a practitioner rule of thumb, not a law.\n\nDuring the project everyone pays attention. After you leave, attention goes elsewhere, people change jobs, a busy season comes, exceptions become habits. Expect it and plan for it, instead of being surprised when the KPI slides.',
        'Short, regular checks keep it alive. The line manager checks a few things every week on the floor: is the board up to date, is the checklist used, are the actions done.\n\nCar makers formalised this as the layered process audit: short checks by several layers of management, team leaders daily, managers weekly, the plant manager monthly. Small checks often beat a big audit once a year.',
        'The owner holds a KPI review with the team every month: the trend, the reasons behind the misses, the actions. Look at the trend, not one week; a single bad week is noise.\n\nAgree in advance when you step back in: a follow-up, a planned return visit, at one, three and six months; and a trigger, like “if on-time delivery, the share of orders on time, is below 85% for three weeks in a row, the owner calls us”.',
        'That trigger turns your return into a plan, not a sign of failure.\n\nWhen results slip, don’t fix it yourself; that undermines the owner. Ask the owner what changed: new people, more volume, a step that got skipped. Help him find the cause and act. And don’t take it personally: some slipping is normal. What matters is that the owner notices it and acts.',
        'A common failure: the new way depended on one enthusiastic person, and when she moves jobs it collapses. Check early whether a second person can run it.\n\nExperts disagree on how long to stay involved. Some consultants plan follow-ups for a year; others say that makes the client dependent. A good test is the sharp question at each follow-up: “What have you changed in the process since I left, without me?”',
      ],
      example: {
        kind: 'worked',
        text: 'At a food plant, your project raised on-time delivery, the share of orders delivered on the promised date, from 72% to 90%. At the three-month follow-up it is 81%. Half the gain is gone.\n\nYou sit with the owner, the operations manager, and look at what changed. Two new planners started in month two and never got the training; the weekly review was cancelled four times in the summer.\n\nHe decides: the senior planner trains the new two this month, and the weekly review becomes fixed in the calendar with a stand-in when he’s away. You agree to look again in six weeks. At that point it is back at 88%.',
      },
      said: 'What you hear in projects: “It went really well while you were here. Then summer came and, well, you know how it goes.”',
      recall: [
        {
          q: 'On-time delivery went from 72% to 90%, then dropped to 81%. What percentage of the gain (the rise from 72% to 90%) was lost?',
          number: 50,
          tolerance: 1,
          unit: '%',
          why: 'Gain was 18 points; 9 points lost; 9 / 18 = 50%.',
        },
        {
          q: 'Why agree a trigger for stepping back in?',
          options: ['To sell more consultancy', 'To blame the owner if it fails', 'So your return is a plan, not a sign of failure', 'Because audits require it'],
          answer: 'So your return is a plan, not a sign of failure',
          why: 'An agreed trigger makes stepping back in normal and timely.',
        },
        {
          q: 'Results slip after handover. What do you do?',
          options: ['Fix it yourself quickly', 'Help the owner find what changed and let him act', 'Report the owner to the sponsor', 'Restart the project'],
          answer: 'Help the owner find what changed and let him act',
          why: 'Fixing it yourself takes ownership away from the person who must keep it running.',
        },
        {
          q: 'What keeps a new way of working alive best?',
          options: ['A big audit once a year', 'A final report', 'A poster in the canteen', 'Short weekly checks by the line manager and a monthly KPI review'],
          answer: 'Short weekly checks by the line manager and a monthly KPI review',
          why: 'Frequent small attention catches drift before it becomes a habit.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator, the regional power network company, at the three-month follow-up of your readiness-check project. Cancelled jobs, as a share of planned jobs, went from 18% to 7% during the project, and are now 12%. The owner looks embarrassed.',
        ask: 'How do you run this conversation?',
        model: '“Twelve is still a lot better than eighteen, and some slipping is normal. Let’s look at what changed since the summer.” Then go through it with him: new people, skipped checks, cancelled reviews. Let him pick the actions, agree when we look again, and agree a trigger for when he calls me in between.',
        rubric: [
          'Takes the embarrassment away and treats some slipping as normal',
          'Looks for what changed together, without fixing it himself',
          'Lets the owner choose actions and agrees a next check and trigger',
        ],
        pushback: {
          lines: [
            '“It’s been busy, okay? The storms, the holidays. It’ll come back down on its own.”',
            '“I don’t need a lecture. I know it slipped.”',
          ],
          model: '“No lecture; 12 is still far better than 18, and it’s been a busy quarter. I’m curious what changed: is the check still done every week? If we find the one step that dropped out, we fix it together today, and agree how you’ll spot it next time.”',
          rubric: [
            'Acknowledges the busy period and his embarrassment',
            'Names the slip factually, without blame',
            'Proposes a joint look and a signal for next time',
          ],
        },
      },
      sayIt: 'Explain to a sponsor in 60 seconds why results often slip after a project and how you plan for it.',
      terms: [
        { term: 'Three-month dip', def: 'A practitioner rule of thumb: results often slide a few months after project attention ends.' },
        { term: 'Layered process audit', def: 'Short, frequent checks by several layers of management, from team leader to plant manager.' },
        { term: 'KPI review', def: 'A monthly meeting where the owner and team look at the KPI trend, causes and actions.' },
        { term: 'Follow-up', def: 'A planned check after the project, for example at one, three and six months.' },
        { term: 'Trigger', def: 'An agreed KPI level that means the owner calls for help.' },
      ],
    },
  ],
};
