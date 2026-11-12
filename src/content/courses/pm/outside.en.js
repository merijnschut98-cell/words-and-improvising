// pm.outside (English): leading projects outside your field: mindset, asking questions, working with experts, steering and deciding. Four topics, four levels each.
export default {
  lessons: [
    // Topic 1: mindset
    {
      id: 'pm.outside.director',
      title: 'Director, not expert',
      pre: [
        {
          q: 'You lead the rollout of a new MES, the software that tracks orders and machines on the shop floor. The IT architect asks which database setup you prefer. What is your job here?',
          options: ['Pick the option the architect seems to prefer, so the project keeps moving', 'Leave it to IT entirely; database choices aren’t a project leader’s business', 'See that the right person decides it against the project goals, and log it', 'Ask the supplier to choose, since they will have to support it later'],
          answer: 'See that the right person decides it against the project goals, and log it',
          why: 'You don’t have to know the answer. You have to make sure a good answer gets made, by someone who can judge it, and that it fits the goal.',
        },
      ],
      teach: [
        'Sooner or later you will lead a project whose content you can’t judge yourself: an IT system, an electrical installation, a robot cell. That is normal. Most project leaders spend their careers outside the field they were trained in.\n\nThe shift is to see yourself as a director, not an expert. A film director doesn’t hold the camera or write the score, but decides what the film is for and makes sure everyone works towards it.',
        'The subject matter expert is the person who knows the content: the PLC programmer, the grid engineer, the database specialist. They own how something works.\n\nYou are the process owner: the person responsible for how the work gets done. Who decides what, in which order, with which information, and how you know you’re on track. You own the route; they own the engine.',
        'What that means in practice. You don’t answer technical questions; you make sure they get answered, by the right person, by a date. You don’t check the code; you check that someone qualified has checked it, and that it does what the goal needs.\n\nKeep a sharp line between scope, what the project will and won’t deliver, and solution, how it is built. Scope is yours with the sponsor, the manager who owns the project. The solution is theirs.',
        'Each deliverable, a concrete thing the project hands over (a tested interface, a commissioned switchboard), gets an owner from the expert side and a check you can see. That gives you grip without knowing the details.\n\nA typical failure: trying to become a half-expert in three weeks, getting into technical debates you lose, and neglecting the planning and the people meanwhile. Another: hiding behind “I’m not technical” and letting the experts run the project.',
        'What experienced project leaders argue about: some say you need at least enough content knowledge to smell nonsense; others say a strong process beats shallow knowledge. Both are partly right, and the lessons that follow give you the questions and checks that replace a lot of that knowledge.\n\nA sharp question for yourself at the start of every meeting: “What has to be decided here, and who is the right person to decide it?”',
      ],
      example: {
        kind: 'worked',
        text: 'You join an automation supplier’s project at a food manufacturer: a robot cell that stacks boxes on pallets. You know Lean, not robots.\n\nStep 1: write the goal in one line with the client: “Line 3 palletises 12 boxes per minute without an operator from June.”\nStep 2: list the deliverables: the cell, the safety fencing, the PLC program (the software in the industrial computer that controls the cell), the test, the training.\nStep 3: give each an expert owner and a visible check: “safety fencing: owner the safety engineer; check: signed risk assessment.”\nStep 4: a weekly 30-minute meeting where each owner shows the check, not just says it.\n\nResult: you steer the whole cell without judging a single line of code.',
      },
      said: 'What you hear in projects: “You’re not an engineer, are you? So how are you going to lead this?”',
      recall: [
        {
          q: 'What does the project leader own when the content is outside his field?',
          options: ['The process: who decides what, when, and how progress is shown', 'The technical solution, since he answers for the overall result', 'Nothing beyond the schedule; the experts lead the content', 'The code review, so quality is checked independently'],
          answer: 'The process: who decides what, when, and how progress is shown',
          why: 'The expert owns how it works; you own how the work gets done and whether it serves the goal.',
        },
        {
          q: 'Which split is right?',
          options: ['Scope belongs to the experts, the solution to you and the sponsor', 'Scope and solution both belong to the supplier', 'Scope and solution both belong to the sponsor', 'Scope to you and the sponsor, the solution to the experts'],
          answer: 'Scope to you and the sponsor, the solution to the experts',
          why: 'What the project delivers is a business choice; how it is built is a technical one.',
        },
        {
          q: 'What does every deliverable need, so you have grip without the content knowledge?',
          options: ['A detailed technical specification you write yourself', 'A technical owner and a check you can see', 'A weekly status email', 'Your personal approval of the design'],
          answer: 'A technical owner and a check you can see',
          why: 'An owner who can judge it, plus visible evidence that it is done, replaces your own judgement of the content.',
        },
        {
          q: 'Which is a typical failure of a project leader outside his field?',
          options: ['Asking the experts too many basic questions', 'Writing the goal down before the plan and the budget are ready', 'Holding a weekly meeting with every owner', 'Trying to become a half-expert and losing the debates'],
          answer: 'Trying to become a half-expert and losing the debates',
          why: 'You burn credibility on ground you can’t hold, and neglect the planning and the people meanwhile.',
        },
      ],
      situation: {
        scene: 'Kick-off of an electrical project with the grid operator: a new medium-voltage connection, the 10,000-volt cable and switchgear that feed a factory, for a manufacturer that is expanding. The grid operator’s senior engineer looks at you: “So what exactly is a Lean consultant going to add here?”',
        ask: 'How do you answer, in a few sentences?',
        model: '“Fair question. I won’t be judging the cable or the switchgear; that’s you and the installer. What I bring is that this project has one goal, one plan and one list of decisions, and that nothing falls between your team, the installer and the factory. If you tell me what you need from the factory and when, I make sure it’s there.”',
        rubric: [
          'Is honest that he doesn’t judge the technical content',
          'Names his own role concretely: goal, plan, decisions, interfaces',
          'Offers something useful to the expert',
        ],
        pushback: {
          lines: [
            '“Interfaces and plans. We’ve had project leaders like that. They mostly made extra meetings.”',
            '“And when something goes wrong technically, you won’t even know it.”',
          ],
          model: '“Then hold me to it: if my meetings don’t save you time, tell me and I’ll cut them. On the technical side you’re right, I won’t see it myself. That’s why I’ll ask you each week for one thing you can show me, a test report or a signed drawing, and I’ll ask the question you’d rather not hear: what would make this fail?”',
          rubric: [
            'Doesn’t get defensive; invites him to hold him to account',
            'Admits the limit honestly',
            'Shows how he will still have grip: visible evidence and hard questions',
          ],
        },
      },
      sayIt: 'Explain to a friend in 60 seconds why a project leader doesn’t need to be the expert, and what he does own.',
      terms: [
        { term: 'Director', def: 'The project leader as the one who decides what the work is for and steers the process, without doing or judging the technical work himself.' },
        { term: 'Subject matter expert', def: 'The person who knows the content and owns how something works: a programmer, a grid engineer, a process engineer.' },
        { term: 'Process owner', def: 'The person responsible for how the work gets done: who decides what, when, with which information, and how progress is shown.' },
        { term: 'Scope', def: 'What the project will and won’t deliver; set by the project leader with the sponsor.' },
        { term: 'Deliverable', def: 'A concrete thing the project hands over, such as a tested interface or a commissioned switchboard.' },
      ],
    },
    {
      id: 'pm.outside.humility',
      title: 'Curious and humble',
      pre: [
        {
          q: 'In a meeting the engineers use a word you don’t know: “selectivity”. What is usually the best move?',
          options: ['Nod along and look it up after the meeting, so you don’t slow them down', 'Ask them to send a written explanation of the term after the meeting', 'Ask: “What does selectivity mean here, and why does it matter for us?”', 'Ask a general question about the plan so it isn’t obvious you’re lost'],
          answer: 'Ask: “What does selectivity mean here, and why does it matter for us?”',
          why: 'A short, genuine question costs ten seconds; nodding along means you miss what the next twenty minutes are about. (Selectivity: in a fault, only the protection nearest to it switches off, so the rest of the factory keeps its power.)',
        },
      ],
      teach: [
        'Curiosity is the wish to understand how something really works, and it is your main tool outside your field. Experts notice quickly whether you want to understand or just want a status.\n\nIntellectual humility is knowing, and saying, that your view might be wrong or incomplete. Psychologists such as Mark Leary (2017) describe it as recognising the limits of your own knowledge. In his studies it went with weighing evidence more carefully.',
        'The trap is the Dunning-Kruger effect: in experiments by David Dunning and Justin Kruger (1999), people with the least skill in a task tended to overestimate their score the most. Later researchers argue about how big the effect is, but the warning holds for you: after three weeks in a new field you feel you understand it, and that is exactly when you start making confident mistakes.',
        'Take a beginner’s mind: the attitude of someone who looks at a field fresh, without assuming he knows. In practice: ask naive questions out loud. A naive question is a basic question an insider wouldn’t ask, such as “Why does the cable have to be that thick?” or “What happens if this server goes down?”\n\nNaive questions often find what experts stopped seeing, because they take it for granted.',
        'How to ask without looking clueless: say why you ask. “I’m asking so I understand the risk, not to check you.” Ask about consequences, not mechanisms: “What does that mean for the date?” Then write the answer down and use it next time; that shows you listened.\n\nThe failure on the other side is fake humility: asking questions without ever building knowledge, so the experts have to explain the same thing every week.',
        'A rough rule of thumb many project leaders use: if you’ve heard a word three times and still don’t know it, ask now. After that it gets awkward.\n\nA sharp question to keep using: “What do you see that I’m not seeing?” It treats the expert as the expert and often brings up the risk nobody had named.',
      ],
      example: {
        kind: 'worked',
        text: 'Week 2 of an MES project at a metal parts maker. The IT lead says: “We’ll do the integration with the ERP, the company’s main system for orders, stock and finance, through middleware, so the order data stays consistent.”\n\nStep 1, admit it: “I don’t know middleware. Can you explain it in one sentence?” Answer: “Software in between that passes messages between the two systems.”\nStep 2, ask the consequence: “What happens to production if the middleware stops?” Answer: “The MES stops getting new orders after about an hour.”\nStep 3, write down the risk and the owner.\nStep 4, next week use the word correctly yourself.\n\nYou spent a minute, learned a word and found a risk.',
      },
      said: 'What you hear in projects: “Sorry, stupid question maybe, but what happens if that system goes down?” Often the best question in the room.',
      recall: [
        {
          q: 'What is intellectual humility?',
          options: ['Knowing and saying that your view might be wrong or incomplete', 'Keeping your opinion to yourself until the experts have spoken', 'Going along with the experts, since they know the field better', 'Not asking questions in meetings, to save the experts’ time'],
          answer: 'Knowing and saying that your view might be wrong or incomplete',
          why: 'It is about the limits of your knowledge, not about having no view.',
        },
        {
          q: 'What did Dunning and Kruger find, in short?',
          options: ['Experts tended to underestimate how long their own tasks would take', 'People with the least skill tended to overestimate their score the most', 'Beginners rated themselves accurately once they had some feedback', 'The most skilled people overestimated their score more than beginners'],
          answer: 'People with the least skill tended to overestimate their score the most',
          why: 'Little knowledge also means little sense of what you are missing.',
        },
        {
          q: 'How do you ask a naive question without looking clueless?',
          options: ['Ask it as a joke, so nobody takes it too seriously', 'Ask it by email afterwards, so nobody in the room sees you don’t know', 'Say why you ask, and ask about consequences, not mechanisms', 'Ask the most junior person in the room to ask it for you'],
          answer: 'Say why you ask, and ask about consequences, not mechanisms',
          why: '“I’m asking to understand the risk” and “what does that mean for the date?” keep the question on your role.',
        },
        {
          q: 'What is fake humility?',
          options: ['Asking but never learning, so experts keep repeating themselves', 'Asking so few questions that experts assume you already know it all', 'Admitting a mistake only after someone else has pointed it out', 'Saying “I don’t know” to avoid taking a position in a meeting'],
          answer: 'Asking but never learning, so experts keep repeating themselves',
          why: 'Real humility learns; asking the same thing again costs them time and you credibility.',
        },
      ],
      situation: {
        scene: 'Progress meeting with an automation supplier. Their PLC programmer explains a delay and uses three words you don’t know: “safety PLC”, “SIL” and “validation”. The client’s production manager is in the room and glances at you.',
        ask: 'What do you say?',
        model: '“Let me check I follow, because this matters for the date. A safety PLC is the separate controller that stops the cell safely, right? And SIL, what does that stand for, and does the level change how much testing we need?” Then: “So in plain words: the safety part has to be proven separately, and that’s the two weeks. What would help you do it faster?” (For you: SIL, safety integrity level, says how reliable a safety function must be; a higher level means more proof and testing.)',
        rubric: [
          'Asks openly instead of nodding along',
          'Links the questions to the consequence for the project',
          'Sums up in plain words and moves to what helps',
        ],
        pushback: {
          lines: [
            '“I can explain the whole safety standard, but honestly, we don’t have time for a course now.”',
            '“If you don’t know what SIL means, maybe you should read up before the meeting.”',
          ],
          model: '“Fair, I’ll read up, and I don’t need the course. I need one thing: does the safety level change the test time, yes or no, and by how much? Then the production manager knows what to plan for. The rest I’ll look up tonight and check with you tomorrow in five minutes.”',
          rubric: [
            'Accepts the point without apologising at length',
            'Narrows his question to what the project needs',
            'Commits to learning the rest himself, with a time',
          ],
        },
      },
      sayIt: 'Explain in 60 seconds the difference between real and fake humility, with one example of each from a project.',
      terms: [
        { term: 'Curiosity', def: 'The wish to understand how something really works, shown by genuine questions and follow-up.' },
        { term: 'Intellectual humility', def: 'Knowing and saying that your view might be wrong or incomplete (described by psychologists such as Leary).' },
        { term: 'Dunning-Kruger effect', def: 'The finding (Dunning and Kruger, 1999) that people with the least skill in a task tend to overestimate their performance the most; its size is debated.' },
        { term: 'Beginner’s mind', def: 'Looking at a field fresh, without assuming you already know, so you notice what insiders take for granted.' },
        { term: 'Naive question', def: 'A basic question an insider wouldn’t ask, such as “what happens if this goes down?”, that often uncovers hidden assumptions.' },
      ],
    },
    {
      id: 'pm.outside.credibility',
      title: 'Credible without the content',
      pre: [
        {
          q: 'Why do experts trust some project leaders who know little of their field?',
          options: ['Because they are senior and have led bigger projects before', 'Because they pick up the jargon fast and use it in meetings', 'Because they back the experts’ views in front of the sponsor', 'Because they deliver what they promise and put the project first'],
          answer: 'Because they deliver what they promise and put the project first',
          why: 'Credibility outside your field comes from how you run things, not from what you know of the content.',
        },
      ],
      teach: [
        'Credibility is the degree to which people believe what you say and expect you to deliver. Outside your field you can’t earn it with content, so you earn it with the process.\n\nDavid Maister, Charles Green and Robert Galford (The Trusted Advisor, 2000) offer a trust equation: trust equals credibility plus reliability plus intimacy, divided by self-orientation. It is a model, not a measurement, but it shows where you can win.',
        'Reliability: doing what you said, when you said it. The minutes go out the same day, the action list is right, the meeting starts on time. Small, boring, and it is what experts notice first.\n\nIntimacy in the equation means people feel safe telling you things, including bad news. You build it by not punishing the messenger.',
        'Self-orientation is how much you seem focused on yourself: your image, your report, being right. It sits below the line, so it divides everything else. Experts quickly sense a project leader who wants a green status for his manager more than a working system.\n\nCredibility itself, outside your field, means: knowing the plan, the risks and the decisions better than anyone, and being honest about what you don’t know.',
        'Follow-up is the visible proof: what you said you’d chase, you chase, and you report back. “Last week you asked me for the factory’s load data. Here it is, and the open question about the peak load sits with the plant engineer until Friday.”\n\nA typical failure is borrowed authority: “The sponsor wants this.” It works once and costs you every time after.',
        'Where people disagree: some coaches say “fake it till you make it”, act confident in a field you don’t know. Experts usually see through it within a meeting, and once you’re caught bluffing, every later statement is doubted.\n\nA sharp question to ask yourself after a meeting: “Did I do everything I promised last time, and did anyone tell me bad news today?” If not, something in the equation is off.',
      ],
      example: {
        kind: 'faded',
        text: 'You lead the client side of a cable project with the grid operator. In month 1 you promised the grid operator’s engineer the factory’s planned load (how much power the new machines will draw) “by next week”. It took three weeks. Since then she answers your emails slowly and copies her manager in.\n\nIn the next meeting she says, a bit sharply: “We’ll see if the factory delivers this time.”',
        ask: 'Which part of the trust equation is damaged, and what would you do?',
        reveal: 'Reliability, and a little intimacy. Don’t explain at length. Name it: “You’re right, I promised the load data in one week and it took three. That made your planning harder.”\n\nThen repair with small, kept promises: “For the next items I’ll give you a date I’m sure of, and I’ll tell you a day before if it slips.” Keep the next three promises exactly. Trust comes back in deeds, usually slower than it went.',
      },
      said: 'What you hear in projects: “He doesn’t know a transformer from a toaster, but if he says it’s handled, it’s handled.”',
      recall: [
        {
          q: 'In the trust equation of Maister, Green and Galford, what sits below the line, dividing everything else?',
          options: ['Credibility', 'Self-orientation', 'Reliability', 'Intimacy'],
          answer: 'Self-orientation',
          why: 'The more you seem focused on yourself, the more it cancels out credibility, reliability and intimacy.',
        },
        {
          q: 'What does credibility mean for a project leader outside his field?',
          options: ['Never admitting a gap, so the experts keep their confidence in him', 'Knowing the technical content almost as well as the experts', 'Having the most senior title in the room', 'Knowing plan, risks and decisions best, and being open about gaps'],
          answer: 'Knowing plan, risks and decisions best, and being open about gaps',
          why: 'You can’t compete on content, so you lead on the process and on honesty.',
        },
        {
          q: 'What is the problem with borrowed authority (“the sponsor wants this”)?',
          options: ['It breaks the project’s governance rules', 'It slows decisions down, because the sponsor must confirm', 'It works once and weakens you every time after', 'Experts don’t know who the sponsor is'],
          answer: 'It works once and weakens you every time after',
          why: 'People learn that you have no reasons of your own, only someone else’s weight.',
        },
        {
          q: 'You broke a promise to an expert. What repairs trust fastest?',
          options: ['Naming it briefly, then keeping the next promises exactly', 'Offering a small favour to make up for it', 'Asking the sponsor to smooth things over with her', 'Explaining in detail why it happened, so she understands your side'],
          answer: 'Naming it briefly, then keeping the next promises exactly',
          why: 'Trust comes back through kept promises, not through explanations.',
        },
      ],
      situation: {
        scene: 'MES project at a metal parts maker, month 3. The supplier’s lead developer tells you in the corridor: “Your last two status reports were greener than reality. My team noticed.”',
        ask: 'What do you say to him?',
        model: '“Thanks for telling me straight. You’re right, I rounded up, partly because I wanted to give the sponsor good news. That doesn’t help you or the project. From this week I’ll write the status from your team’s evidence, and I’ll show you the report before it goes out. Is there anything in the last one you want corrected now?”',
        rubric: [
          'Thanks him and admits it without excuses',
          'Names the self-orientation honestly',
          'Changes the process so it can’t repeat, and invites correction',
        ],
        pushback: {
          lines: [
            '“Showing me the report is nice, but you’ll still soften it when the sponsor pushes.”',
            '“Honestly, why should my team tell you bad news if it goes up the chain coloured anyway?”',
          ],
          model: '“That’s the real test, and you’ll see it in the next steering meeting. If the data says amber, I’ll say amber, and I’ll say what we need to make it green. If I soften it, call me on it in front of the sponsor. Bad news from your team will go up with your name on the evidence, not on the blame.”',
          rubric: [
            'Accepts that trust has to be shown, not promised',
            'Gives a concrete, checkable commitment',
            'Makes it safe to bring bad news',
          ],
        },
      },
      sayIt: 'Explain the trust equation in 60 seconds and say which part you find hardest to keep up on a project.',
      terms: [
        { term: 'Credibility', def: 'How much people believe what you say and expect you to deliver.' },
        { term: 'Trust equation', def: 'A model by Maister, Green and Galford (2000): trust = (credibility + reliability + intimacy) ÷ self-orientation.' },
        { term: 'Reliability', def: 'Doing what you said, when you said it, including the small things.' },
        { term: 'Self-orientation', def: 'How much you seem focused on yourself, your image or being right; in the trust equation it divides everything else.' },
        { term: 'Follow-up', def: 'Visibly chasing what you said you’d chase and reporting back.' },
      ],
    },
    {
      id: 'pm.outside.keep',
      title: 'What you never hand over',
      pre: [
        {
          q: 'The automation supplier proposes to drop the second safety test “because the first one went fine”. Who should decide that?',
          options: ['The supplier, because they know the cell best', 'Whoever answers for the project’s risks, with expert advice', 'The PLC programmer, because he wrote the safety code', 'The safety engineer alone, because it is purely a safety question'],
          answer: 'Whoever answers for the project’s risks, with expert advice',
          why: 'Experts advise on the risk; the decision to accept it stays with the person accountable for the project.',
        },
      ],
      teach: [
        'You can hand over a lot of the content, but three things stay with you: the goal, the risks and the decisions. Hand those over and you’re no longer leading the project; you’re reporting on it.\n\nThe project goal is the one-line result the project exists for, with a number and a date. Experts optimise their part; only you keep asking whether the parts still add up to the goal.',
        'Accountable means you answer for the result, whoever does the work. In a RACI chart, a table of who is Responsible (does it), Accountable (answers for it), Consulted (asked before) and Informed (told after), each task has exactly one A.\n\nThe experts are often R. The A for the overall result, the plan and the risk picture stays with you and the sponsor. You delegate tasks, not accountability.',
        'Risks: keep a risk register, a list of what could go wrong, how likely, how bad, what you do about it and who owns it. Experts own the technical risks in it; you own the register itself and the conversation about what is acceptable.\n\nThe failure: “The supplier handles the risks.” Then the risks are managed against the supplier’s goals, such as finishing on budget, not yours.',
        'Decisions: keep a decision log, a simple list of what was decided, by whom, on which date and why. It stops the same discussion coming back and protects you when people remember things differently.\n\nThe expert recommends; the right person decides; you make sure the decision is made, recorded and communicated. A decision nobody records was, in practice, never made.',
        'Where it gets hard: experts sometimes present a decision as purely technical when it is really a business trade-off, “we’ll skip that test” is really “we accept more risk to save a week”. Your job is to translate it back into goal, risk and cost, and put it in front of the person accountable.\n\nA sharp question: “Is this a technical choice, or are we choosing between time, cost and risk?”',
      ],
      example: {
        kind: 'faded',
        text: 'Grid operator project, month 5. The installer’s project manager emails you: “To keep the date we’ll energise the new switchgear without the full set of protection settings tests; we’ll do those in the first week of operation. Technically it’s fine.” Energising means switching the power on. Protection settings decide when the switchgear cuts the power in a fault. The factory’s production manager is copied in and replies: “Great, keep the date!”',
        ask: 'What do you do with this email?',
        reveal: 'This is presented as technical but it is a risk decision. Don’t approve it in the email thread and don’t let the production manager’s enthusiasm decide it.\n\nAsk the installer and the grid operator’s engineer in writing what the risk is, how likely and how bad: a wrong trip stops the factory; a missing trip can damage equipment. Put it on one page with the options (keep the date with that risk, or a week later fully tested) and have the sponsor decide. Record it in the decision log.',
      },
      said: 'What you hear in projects: “Don’t worry about that, it’s a technical detail.” Sometimes it is. Sometimes it’s your biggest risk.',
      recall: [
        {
          q: 'Which three things does the project leader never hand over?',
          options: ['The budget, the tools and the meetings', 'The design, the code and the tests', 'The goal, the risks and the decisions', 'The team, the supplier and the client'],
          answer: 'The goal, the risks and the decisions',
          why: 'Hand those over and you report on the project instead of leading it.',
        },
        {
          q: 'In a RACI chart, how many people are Accountable for a task?',
          options: ['Exactly one', 'At least two, for safety', 'As many as needed', 'None; accountability is shared'],
          answer: 'Exactly one',
          why: 'One A means it is clear who answers for the result.',
        },
        {
          q: 'Why is “the supplier handles the risks” dangerous?',
          options: ['Suppliers rarely know enough about the client’s risks', 'It usually breaches the contract with the supplier', 'Risks in IT projects are mostly too small to matter', 'The risks then get managed against the supplier’s goals'],
          answer: 'The risks then get managed against the supplier’s goals',
          why: 'The supplier’s goal, such as finishing on budget, isn’t always the client’s goal.',
        },
        {
          q: 'An expert says: “We’ll skip that test, it’s technical.” What is the better reading?',
          options: ['A purely technical choice, so leave it to him', 'A time-cost-risk trade-off for the accountable person to decide', 'A sign that the supplier is trying to cut corners', 'A routine step, since tests are often trimmed in the last weeks before go-live'],
          answer: 'A time-cost-risk trade-off for the accountable person to decide',
          why: 'Skipping a test usually means accepting more risk to save time: a business decision.',
        },
      ],
      situation: {
        scene: 'Robot cell project, two weeks before go-live. The supplier’s project manager wants to change the agreed acceptance test, the test that proves the cell meets the contract, from 8 hours of production to 2 hours, “because the cell is clearly stable”. You think the 8 hours were there for a reason, but you can’t judge the cell yourself.',
        ask: 'How do you handle it?',
        model: '“I can’t judge the stability myself, so I won’t decide it on feel. The 8 hours are in the contract to see faults that only show after a while, like heat or wear. If you want to shorten it, send me what you base ‘stable’ on, and the risk if we’re wrong. I’ll put it to the client’s sponsor with the production manager’s view, and we decide by Thursday.”',
        rubric: [
          'Doesn’t decide on gut feeling or hand it to the supplier',
          'Asks for the evidence and the risk in writing',
          'Puts the decision with the accountable person, with a date',
        ],
        pushback: {
          lines: [
            '“You’re making this political. Every day we wait costs us money too.”',
            '“If you don’t trust our engineers, say so.”',
          ],
          model: '“I do trust your engineers, and I know the delay costs you. That’s exactly why I want it decided fast and properly, not on my feel or yours. Send me the data today, the sponsor decides Thursday, and whatever she decides goes in the log, so nobody can blame your team afterwards.”',
          rubric: [
            'Acknowledges the cost and affirms trust in the people',
            'Holds the line on who decides',
            'Shows the process also protects the supplier',
          ],
        },
      },
      sayIt: 'Explain to a new project leader in 60 seconds what you never hand over to the experts, and why.',
      terms: [
        { term: 'Project goal', def: 'The one-line result the project exists for, with a number and a date.' },
        { term: 'Accountable', def: 'Answering for the result, whoever does the work; in a RACI there is exactly one per task.' },
        { term: 'RACI', def: 'A table of who is Responsible, Accountable, Consulted and Informed for each task.' },
        { term: 'Risk register', def: 'A list of what could go wrong, how likely and how bad, what you do about it and who owns it.' },
        { term: 'Decision log', def: 'A simple list of what was decided, by whom, when and why.' },
      ],
    },
    // Topic 2: asking questions
    {
      id: 'pm.outside.phasequestions',
      film: 'pm.outside.questions',
      title: 'Questions for each phase',
      pre: [
        {
          q: 'The installer says the new cable will be ready in 6 weeks. Which question reveals the most?',
          options: ['“Are you confident you can hold the six weeks?”', '“Is that six weeks in working days or calendar weeks?”', '“Could your team do it in five if we push?”', '“What has to be true for it to be six weeks?”'],
          answer: '“What has to be true for it to be six weeks?”',
          why: 'It brings out the assumptions behind the estimate, such as permits, materials and crews, which is where the risk sits.',
        },
      ],
      teach: [
        'When you can’t judge the answers, the quality of your questions is your expertise. A question set is a short, fixed list of questions you ask at a given phase, whatever the field. It works for a database, a cable or a robot.\n\nFive areas cover most of it: scope, assumptions, risks, estimates and dependencies. Ask them in that order; each builds on the one before.',
        'Scope: “What exactly will we have at the end? What is explicitly not included?” The second half matters most: misunderstandings live there.\n\nAssumption: something you treat as true for now without proof. “What are we assuming that, if wrong, changes the plan?” Example: “We assume the factory’s network can carry the new data.” Write assumptions down; each one is a risk until it is checked.',
        'Risk: something that may happen and would hurt the goal. “What worries you most? What has gone wrong on similar jobs?” Ask each expert separately; in a group the most senior voice sets the tone.\n\nEstimate: a forecast of time or cost, not a promise. “How sure are you, and what is it based on?” Ask for a range rather than one number.',
        'Dependency: something your work needs from someone else before it can go ahead. “What do you need from others, and by when?” Examples: the grid operator needs the factory’s load data before it can size the cable; the MES supplier needs the ERP team to open an interface.\n\nMost delays in projects outside your field are not technical. They are dependencies that nobody owned.',
        'When to use the sets: at the start, at every change and before each go/no-go moment. Ask the same questions every time; experts get used to them and start preparing the answers.\n\nA typical failure is asking them once, in a kick-off, and filing the answers. A sharp question to end any planning session: “What did we assume today that nobody has checked?”',
      ],
      example: {
        kind: 'worked',
        text: 'Kick-off for an MES at a metal parts maker. You walk the five areas with the supplier and the IT lead.\n\nScope: “At go-live, which lines are on the MES?” “Lines 1 and 2. Line 3 isn’t included.”\nAssumption: “What are we assuming?” “That machine data comes in through the existing network.” You write: unchecked.\nRisk: “What has gone wrong elsewhere?” “Master data, the base data on products and routings (the sequence of steps each product goes through), was dirty.”\nEstimate: “Data clean-up?” “Four to eight weeks, depending on the state.”\nDependency: “What do you need?” “An ERP interface from the client’s IT by 1 March.”\n\nFive questions, three new risks, one owner each.',
      },
      said: 'What you hear in projects: “That’s not in scope.” Good to hear early; terrible to hear at go-live.',
      recall: [
        {
          q: 'What are the five areas of the question set, in order?',
          options: ['Budget, resources, milestones, quality, communication', 'Goals, stakeholders, constraints, methods, reviews', 'Scope, assumptions, risks, estimates, dependencies', 'Requirements, design, build, test, handover'],
          answer: 'Scope, assumptions, risks, estimates, dependencies',
          why: 'Each builds on the one before: you can’t estimate without knowing the scope and the assumptions.',
        },
        {
          q: 'Which half of the scope question matters most?',
          options: ['What is explicitly not included', 'What the full scope will cost', 'What we will deliver at the end', 'Who signs the scope off'],
          answer: 'What is explicitly not included',
          why: 'Misunderstandings sit in what one party assumes is included and the other doesn’t.',
        },
        {
          q: 'Why ask experts about risks one by one rather than in a group?',
          options: ['It is quicker than a group session', 'In a group the most senior voice sets the tone', 'Experts prefer not to talk about risks in groups', 'It keeps the risk register confidential'],
          answer: 'In a group the most senior voice sets the tone',
          why: 'One-on-one, people name worries they’d keep to themselves in front of a senior colleague.',
        },
        {
          q: 'What causes most delays in projects outside your field, according to the lesson?',
          options: ['Technology that turns out not to work', 'Experts who underestimate their work', 'Dependencies nobody owned', 'Too many meetings and status reports eating up time'],
          answer: 'Dependencies nobody owned',
          why: 'The work often waits on something from another party that nobody was chasing.',
        },
      ],
      situation: {
        scene: 'First meeting with the automation supplier about a robot cell. Their sales engineer says: “Standard cell, we’ve built twenty. Twelve weeks from order, no problem.” The client’s production manager is happy.',
        ask: 'Which questions do you ask before anyone celebrates?',
        model: 'I’d walk the five areas. “What exactly is in the twelve weeks: delivery, installation, the acceptance test, training? What isn’t?” “What are you assuming about our side: floor space ready, power, the box sizes?” “On the twenty cells, what went wrong most?” “Is twelve weeks a typical case or a safe case?” “What do you need from us, and by when?”',
        rubric: [
          'Covers scope including what is excluded',
          'Brings out assumptions about the client’s side',
          'Asks about risk history, the basis of the estimate and dependencies',
        ],
        pushback: {
          lines: [
            '“We’ve done this twenty times. You don’t need to grill us.”',
            '“If you want all that in writing, the twelve weeks start after we’ve written it.”',
          ],
          model: '“Twenty cells is exactly why I ask: you know what goes wrong, and I don’t. Five answers is enough, and they don’t need a document; an email with five lines is fine. Most of it is about what you need from us, so we don’t become your delay.”',
          rubric: [
            'Turns their experience into a reason to answer',
            'Keeps the ask small and practical',
            'Frames the questions as protecting the supplier too',
          ],
        },
      },
      sayIt: 'Explain the five areas of the question set in 60 seconds, with one question for each.',
      terms: [
        { term: 'Question set', def: 'A short fixed list of questions you ask at a given phase, whatever the field.' },
        { term: 'Assumption', def: 'Something you treat as true for now without proof; a risk until it is checked.' },
        { term: 'Risk', def: 'Something that may happen and would hurt the goal.' },
        { term: 'Estimate', def: 'A forecast of time or cost, not a promise; best given as a range with its basis.' },
        { term: 'Dependency', def: 'Something your work needs from someone else before it can go ahead.' },
      ],
    },
    {
      id: 'pm.outside.fail',
      title: '“What would make this fail?”',
      pre: [
        {
          q: 'The team says the go-live plan is solid. Which question tends to bring up the most risks?',
          options: ['“Imagine it’s six months on and the go-live failed. What happened?”', '“On a scale of one to ten, how confident is everyone here in this plan?”', '“Does anyone see any risks we haven’t put on the list yet?”', '“What could we do to go live a few weeks earlier?”'],
          answer: '“Imagine it’s six months on and the go-live failed. What happened?”',
          why: 'Imagining the failure as already happened makes it easier for people to name causes than “any risks?”, which invites a quick no.',
        },
      ],
      teach: [
        'Two questions do more work than any others when you can’t judge the content: “What would make this fail?” and “How do you know?”\n\nThe first finds risks. The second checks the claims. Together they let you test a plan without understanding every detail of it.',
        'A premortem is a structured version of the first question. Gary Klein described it in Harvard Business Review (2007): the team imagines the project has already failed and each person writes down why, before anyone speaks.\n\nKlein cites a study (Mitchell, Russo and Pennington, 1989) in which people who imagined an event had already happened came up with about 30% more reasons for it. It counted reasons, not their quality, but more candidates is what you want here. Writing first stops the senior voice from setting the tone.',
        'Look out for a single point of failure: one part, person or supplier that, if it fails, stops everything. One server with no backup, one programmer who knows the code, one cable feeding the whole factory.\n\nFor each serious risk, ask for the mitigation: what we do now to make it less likely or less bad, and who owns it. A risk without a mitigation and an owner is just a worry.',
        '“How do you know?” asks for evidence: something you or someone else can see, test or check, not an opinion. The ladder runs from weak to strong: “I think so”, “it worked before”, “we tested it here”, “here is the test report”.\n\nAsk it calmly and about the claim, not the person: “How do we know the network can carry the data?” rather than “Are you sure?”',
        'The typical failure is asking the questions and accepting the first answer. The first answer is usually the comfortable one; the useful one comes after a pause or a second question. That is Silence and Inquiry from MORE PIES, a listening checklist you’ll meet in full later: stay quiet, then ask one level deeper: “And if that happened, what would we see first?”\n\nA rough rule many project leaders use: if a premortem produces no risk that surprises you, people haven’t been honest yet.',
      ],
      example: {
        kind: 'worked',
        text: 'Two months before an MES go-live, you run a 30-minute premortem with eight people.\n\nStep 1: “It’s September. The go-live failed. Write down why, alone, for 5 minutes.”\nStep 2: read them out one by one. Answers include: “The barcode scanners on line 2 didn’t connect”, “Operators weren’t trained on night shift”, “Only Ahmed knows the interface”.\nStep 3: group them and pick the three most serious.\nStep 4: for each, ask “How do we know it won’t happen?” For the scanners: “We tested them in the office, not on the line.” That’s weak evidence.\nStep 5: a mitigation and owner: a scanner test on line 2 next week, owner the IT lead.\n\nThe single point of failure, Ahmed, gets a second person trained.',
      },
      said: 'What you hear in projects: “It worked in the test environment.” The next question: “And how do we know it will work on the line?”',
      recall: [
        {
          q: 'What happens in a premortem?',
          options: ['The team reviews what went wrong after the project ended', 'The supplier walks the team through its test results', 'The sponsor lists the risks she wants the team to manage closely', 'The team imagines the project has failed and writes down why'],
          answer: 'The team imagines the project has failed and writes down why',
          why: 'Imagined hindsight makes it easier to name causes; writing alone first keeps it honest.',
        },
        {
          q: 'In the 1989 study Klein cites, roughly how many more reasons did people come up with when they imagined the event had already happened?',
          options: ['About 80% more', 'About 30% more', 'No more at all', 'About 5% more'],
          answer: 'About 30% more',
          why: 'Mitchell, Russo and Pennington (1989), cited by Klein (2007). Klein calls it a 30% better ability to identify reasons; the study counted how many reasons people gave, not how good they were.',
        },
        {
          q: 'Which is the strongest evidence that a scanner works on the line?',
          options: ['“I’m fairly sure it works; it’s a standard scanner”', '“It worked fine at another client last year”', '“We tested it in the office and it connected”', '“Here is the report of the test on line 2”'],
          answer: '“Here is the report of the test on line 2”',
          why: 'Tested here, in the real conditions, and written down: the top of the ladder.',
        },
        {
          q: 'What is a single point of failure?',
          options: ['The risk with the highest score on the project’s risk register', 'A risk that has no owner or mitigation', 'One part, person or supplier whose failure stops everything', 'A test that fails and blocks the next milestone'],
          answer: 'One part, person or supplier whose failure stops everything',
          why: 'One server, one expert, one cable: no backup means one failure stops the whole.',
        },
      ],
      situation: {
        scene: 'Grid operator project. The grid operator’s engineer says the factory’s new connection can be energised on 1 October “if all goes well”. The factory has planned the start of a new production line on 2 October.',
        ask: 'What do you ask, and what do you tell the factory?',
        model: 'To the engineer: “What would make 1 October fail? What has to go right between now and then?” Then: “How do we know the switchgear will be delivered on time; is there a confirmed date from the manufacturer?” To the factory: “1 October is the date if all goes well. Starting the line one day later leaves no margin. I’d plan the start for mid-October, or plan a temporary supply.”',
        rubric: [
          'Asks what would make it fail and for evidence behind the key step',
          'Spots the missing margin between the two dates',
          'Gives the factory a concrete option',
        ],
        pushback: {
          lines: [
            '“We always say ‘if all goes well’. It doesn’t mean anything.”',
            '“The factory won’t like you making our date look shaky.”',
          ],
          model: '“That helps, thanks. Then I’ll ask it differently: how often does a date like this hold, in your experience? If it’s nine out of ten, the factory can decide with that. I’m not making your date shaky; I’m making sure the factory doesn’t plan a line start on the one day it can’t afford to slip.”',
          rubric: [
            'Rephrases to get a usable answer',
            'Asks for experience-based odds rather than a promise',
            'Shows he protects both sides',
          ],
        },
      },
      sayIt: 'Explain how to run a premortem in 60 seconds, step by step.',
      terms: [
        { term: 'Premortem', def: 'A session where the team imagines the project has failed and writes down why, before it starts (Klein, 2007).' },
        { term: 'Single point of failure', def: 'One part, person or supplier that stops everything if it fails.' },
        { term: 'Mitigation', def: 'What you do now to make a risk less likely or less bad, with an owner.' },
        { term: 'MORE PIES', def: 'A checklist for active listening: Mood, Open questions, Reflecting, Empathy, Paraphrasing, Inquiry, Experience, Silence.' },
        { term: 'Evidence', def: 'Something you can see, test or check, not an opinion; from “I think so” up to a test report.' },
      ],
    },
    {
      id: 'pm.outside.estimates',
      film: 'pm.outside.questions',
      title: 'Checking estimates without the content',
      pre: [
        {
          q: 'A programmer estimates the interface at “three weeks”. You can’t judge the code. What is the most useful next step?',
          options: ['Ask for a range and how long similar interfaces took before', 'Cut it to two weeks, so there is a stretch target to aim for', 'Accept it as it is, since he is the one who knows the code', 'Add a 50% buffer, the usual margin for software work'],
          answer: 'Ask for a range and how long similar interfaces took before',
          why: 'A range shows the uncertainty, and past jobs are the best check you have without knowing the code.',
        },
      ],
      teach: [
        'You can’t check an estimate by judging the work, but you can check how it was made. Three tools: ranges, reference classes and a second estimate.\n\nThe reason you need them: Daniel Kahneman and Amos Tversky (1979) named the planning fallacy, the tendency to underestimate how long your own task will take, even when you know similar tasks ran late. Experts suffer from it too.',
        'A range is a low and a high estimate instead of one number: “between 3 and 6 weeks”. It shows how uncertain someone is. A three-point estimate adds a most likely value; a common formula (from PERT, developed for the US Navy’s Polaris missile programme in 1958) weights it: (optimistic + 4 × most likely + pessimistic) ÷ 6.\n\nIt is a convention, not a law, but it pulls the estimate towards the long tail.',
        'A reference class is a group of similar past projects you use as a yardstick. Kahneman and Bent Flyvbjerg recommend it: instead of reasoning from the plan, ask “how long did the last five interfaces like this take?”\n\nFlyvbjerg and Gardner (How Big Things Get Done, 2023) report from a database of about 16,000 projects, mostly large ones, that only 8.5% hit both budget and schedule, and only 0.5% also delivered the promised benefits. A base rate like that beats a confident plan.',
        'A second estimate: ask another expert, without showing the first number, and compare. If they’re close, good. If they’re far apart, the gap is the conversation: “What do you see that makes it longer?”\n\nWatch the language too. “Three weeks if nothing goes wrong” is the best case, not the estimate. And an estimate that never changes over months is often not being updated.',
        'Experts argue about how to use estimates. Some agile teams avoid time estimates and only forecast from their own track record. Others want a firm number for the contract. For you the question is simpler: is the estimate a forecast with its uncertainty, or a hope?\n\nA sharp question: “What would make it take twice as long?” If the answer comes instantly, put that in the range.',
      ],
      example: {
        kind: 'faded',
        text: 'The automation supplier estimates the PLC programming for a robot cell. Their programmer gives you three numbers: optimistic 6 weeks, most likely 8 weeks, pessimistic 16 weeks. You know from their last three cells that programming took 9, 11 and 10 weeks.',
        ask: 'What is the three-point estimate, and what does the reference class tell you?',
        reveal: 'Three-point: (6 + 4 × 8 + 16) ÷ 6 = 54 ÷ 6 = 9 weeks.\n\nThe reference class, 9 to 11 weeks on their own last three cells, says 9 is at the optimistic end of what they actually did. So plan around 10 to 11 weeks, and ask: “The last three took 9 to 11. What makes this one faster?” If there’s a real reason, such as reusing code, fine. If not, put the longer figure in the plan.',
      },
      said: 'What you hear in projects: “Three weeks, if nothing goes wrong.” Something always does.',
      recall: [
        {
          q: 'What is the planning fallacy?',
          options: ['Making a plan before the budget has been approved', 'Underestimating your own task, even knowing similar ones ran late', 'Planning so far ahead that the plan is already outdated before it starts', 'Overestimating risks, so plans carry too much buffer'],
          answer: 'Underestimating your own task, even knowing similar ones ran late',
          why: 'Named by Kahneman and Tversky (1979); experts are not immune.',
        },
        {
          q: 'An optimistic estimate of 4 weeks, most likely 6, pessimistic 14. What is the three-point estimate, in weeks, with the formula (O + 4M + P) ÷ 6?',
          number: 7,
          tolerance: 0.1,
          unit: 'weeks',
          why: '(4 + 4 × 6 + 14) ÷ 6 = 42 ÷ 6 = 7 weeks.',
        },
        {
          q: 'What is a reference class?',
          options: ['A training course that teaches experts to estimate', 'The estimate of the most senior expert, used as a benchmark', 'A group of similar past projects used as a yardstick', 'The price in the contract, used as a ceiling'],
          answer: 'A group of similar past projects used as a yardstick',
          why: 'Past outcomes of similar work are a better check than reasoning from the plan alone.',
        },
        {
          q: 'Two experts give independent estimates: 4 weeks and 10 weeks. What do you do?',
          options: ['Ask what each sees that the other doesn’t', 'Take the shorter one, to keep pressure on the team', 'Take the longer one, to be safe', 'Take the average: 7 weeks'],
          answer: 'Ask what each sees that the other doesn’t',
          why: 'The gap shows different assumptions; that conversation is worth more than either number.',
        },
      ],
      situation: {
        scene: 'MES project. The supplier says the data migration, moving product and routing data from the old system to the new one, will take “four weeks”. The client’s IT lead whispers to you afterwards: “Last time we migrated data it took four months.”',
        ask: 'What do you do with these two numbers?',
        model: 'I’d not pick one. I’d ask the supplier for a range and its basis: how many products, how clean the data, what “done” means. I’d ask the IT lead what took four months last time. Then I’d put both in one meeting: “Your four weeks assumes clean data; last time cleaning took most of the time. What would it take with our data?” The plan gets a range, with data quality as the named risk.',
        rubric: [
          'Doesn’t just pick a number',
          'Asks for the basis of each estimate',
          'Uses the past project as a reference and plans with a range',
        ],
        pushback: {
          lines: [
            '“Four weeks is our standard. We’ve done fifty migrations.”',
            '“If you put a range in the plan, the client will hold us to the worst case.”',
          ],
          model: '“Fifty migrations is great, then you’ll know how the time splits between moving and cleaning. If our data is as messy as last time, does four weeks still hold? I’ll put the range in with the reason, data quality, and we narrow it after you’ve sampled the data in two weeks. That protects you more than a number that breaks.”',
          rubric: [
            'Respects their experience and asks about the split',
            'Ties the range to a named cause',
            'Offers a date to narrow the range',
          ],
        },
      },
      sayIt: 'Explain in 60 seconds three ways to check an estimate when you can’t judge the work.',
      terms: [
        { term: 'Planning fallacy', def: 'The tendency to underestimate how long your own task will take, even when similar tasks ran late (Kahneman and Tversky, 1979).' },
        { term: 'Range', def: 'A low and a high estimate instead of one number, showing the uncertainty.' },
        { term: 'Three-point estimate', def: 'An estimate from optimistic, most likely and pessimistic values, often weighted as (O + 4M + P) ÷ 6 (PERT).' },
        { term: 'Reference class', def: 'A group of similar past projects used as a yardstick for a new estimate.' },
        { term: 'Second estimate', def: 'An independent estimate from another expert, made without seeing the first, to compare.' },
      ],
    },
    {
      id: 'pm.outside.jargon',
      title: 'Translating jargon back',
      pre: [
        {
          q: 'The grid engineer says: “The short-circuit level at the connection point is too high for that switchgear.” What is the best reply for a project leader?',
          options: ['“Okay, noted. Let’s keep going for now and pick this up again at the next meeting.”', '“Let’s take that offline; can you and the installer sort out a solution this week?”', '“Can you send me the calculation so I can go through it over the weekend?”', '“So that switchgear can’t take a fault there? What does it mean for cost and date?”'],
          answer: '“So that switchgear can’t take a fault there? What does it mean for cost and date?”',
          why: 'Paraphrasing in plain words checks you understood, and the follow-up turns jargon into a project consequence. (Short-circuit level: how much current flows in a fault; the switchgear must be able to switch it off safely.)',
        },
      ],
      teach: [
        'Jargon is the specialist language of a field: words that are precise for insiders and opaque for everyone else. It isn’t a problem in itself. The problem is when decisions get made in it and nobody outside the field understands what was decided.\n\nYour job is to translate back: from jargon into goal, cost, time and risk, so the sponsor and the people on the floor can follow.',
        'The listening framework behind this is MORE PIES, a checklist for active listening, listening to understand rather than to reply: Mood, Open questions, Reflecting, Empathy, Paraphrasing, Inquiry, Experience, Silence.\n\nTwo letters matter most here. Paraphrasing: restating the content in your own words to check you understood. Inquiry: asking one level deeper, until you reach the consequence.',
        'The paraphrase: “So what you’re saying is…” followed by plain words, then a check: “Have I got that right?” Experts usually correct you, and the correction is where you learn.\n\nThen Inquiry, three questions that always work: “What does that mean for the date?”, “What does it mean for the cost?”, “What does it mean for the risk?” Silence helps too: after the paraphrase, wait for the correction.',
        'Teach-back comes from health care: the doctor asks the patient to explain the instructions back in their own words. You can use it the other way round: explain the expert’s point back to him as you would to the sponsor, and let him fix it.\n\nThe result is a sentence you can take into the steering meeting without misquoting anyone.',
        'Typical failures: translating so loosely the meaning changes (“so it’s basically fine?”), or letting the expert present directly to the board in jargon. Another: pretending to follow, then passing on the jargon unexplained.\n\nA sharp move when an expert is about to present to managers: ask him for the one sentence the sponsor must remember, in plain words, and agree it with him first.',
      ],
      example: {
        kind: 'faded',
        text: 'MES project, design meeting. The integration specialist says: “The ERP interface is batch, not real-time, so we’ll get order changes with up to 15 minutes latency, and we can’t guarantee idempotency on retries.”\n\nYou paraphrase the first part: “So order changes from the office reach the shop floor up to 15 minutes late.” He nods.',
        ask: 'How do you handle the second part, and what do you take to the sponsor?',
        reveal: 'Ask honestly: “Idempotency on retries, what does that mean in plain words, and what’s the consequence?” Answer: “If a message is sent twice, an order might appear twice.”\n\nInquiry: “What would that cost us on the floor, and how often?” Then teach-back: “So I’d tell the sponsor: orders can arrive up to 15 minutes late, and if the link hiccups an order can be doubled, so we need a check for doubles. Is that fair?” He adjusts one word. That sentence goes to the steering meeting.',
      },
      said: 'What you hear in projects: “So what you’re saying is…” The most useful five words a project leader has.',
      recall: [
        {
          q: 'What do the letters of MORE PIES stand for?',
          options: ['Mood, Open questions, Reflecting, Empathy, Positivity, Interest, Evaluation, Summarising', 'Mood, Open questions, Reflecting, Empathy, Paraphrasing, Inquiry, Experience, Silence', 'Motivation, Open questions, Reflecting, Empathy, Paraphrasing, Inquiry, Evaluation, Silence', 'Mood, Observing, Reflecting, Encouraging, Paraphrasing, Interest, Experience, Summarising'],
          answer: 'Mood, Open questions, Reflecting, Empathy, Paraphrasing, Inquiry, Experience, Silence',
          why: 'A checklist for active listening; Paraphrasing and Inquiry do most of the translating work.',
        },
        {
          q: 'Which three questions turn jargon into a project consequence?',
          options: ['Who owns it, what does it need, where is it stuck?', 'Why, why and why again, until you reach the root cause?', 'Is it in scope, is it tested, is it signed off?', 'What does it mean for the date, the cost and the risk?'],
          answer: 'What does it mean for the date, the cost and the risk?',
          why: 'Those are the terms the sponsor decides in.',
        },
        {
          q: 'What is teach-back, used by a project leader?',
          options: ['Sending the meeting minutes to the expert for his review and approval', 'Teaching the expert the basics of project management', 'Retelling his point as you’d tell the sponsor, for him to correct', 'Asking the expert to explain the change to the operators'],
          answer: 'Retelling his point as you’d tell the sponsor, for him to correct',
          why: 'It gives you a plain sentence the expert agrees with, so you don’t misquote him upstairs.',
        },
        {
          q: 'Which is a typical failure when translating jargon?',
          options: ['Translating so loosely the meaning shifts: “so it’s basically fine?”', 'Asking the expert to correct your paraphrase in front of the sponsor', 'Staying silent after the paraphrase until the expert fills the gap', 'Asking the expert for the one sentence the sponsor must really remember'],
          answer: 'Translating so loosely the meaning shifts: “so it’s basically fine?”',
          why: 'A loose translation invites a polite yes and loses the risk.',
        },
      ],
      situation: {
        scene: 'Grid operator project. In the steering meeting the grid operator’s engineer explains: “Because of congestion we can only offer a non-firm connection until the new substation is built, with curtailment during peak hours.” The factory director frowns and looks at you.',
        ask: 'How do you translate this, live, in the meeting?',
        model: '“Let me check I’ve got it, and correct me. The grid in this area is full, so until the new substation is ready, the factory gets a connection where the grid operator may limit our power at busy times. Is that right?” He confirms. “Then the questions for us: how often, for how long, and when is the substation due? That tells us whether the new line can run full shifts.”',
        rubric: [
          'Paraphrases in plain words and asks for correction',
          'Explains congestion and curtailment without jargon',
          'Turns it into the questions the director decides on',
        ],
        pushback: {
          lines: [
            '“That’s a simplification. Curtailment is more nuanced than ‘limit our power’.”',
            '“I’d rather the director reads our technical memo than your version.”',
          ],
          model: '“You’re right, it’s simplified, so tell me what I left out that matters for the decision. The memo should go to the director too. What I need from you now is one sentence he can decide on: how many hours a year we might be limited, and by how much. If you can give a range today, the details can follow in the memo.”',
          rubric: [
            'Accepts the correction and asks what matters',
            'Keeps the memo but asks for a decision-ready sentence',
            'Asks for a range rather than certainty',
          ],
        },
      },
      sayIt: 'Translate one piece of jargon from your own work in 60 seconds: paraphrase it, then say what it means for date, cost and risk.',
      terms: [
        { term: 'Jargon', def: 'The specialist language of a field: precise for insiders, opaque for others.' },
        { term: 'Active listening', def: 'Listening to understand rather than to reply, and showing it.' },
        { term: 'Paraphrasing', def: 'Restating the content in your own words to check you understood.' },
        { term: 'Inquiry', def: 'Asking one level deeper, until you reach the consequence.' },
        { term: 'Teach-back', def: 'Explaining a point back in your own words so the other person can correct it; from health care.' },
      ],
    },
    // Topic 3: working with experts
    {
      id: 'pm.outside.trust',
      title: 'Trust and verify',
      pre: [
        {
          q: 'The PLC programmer says the safety stops all work. You can’t read the code. What is a sensible check?',
          options: ['Ask him to confirm in writing that every single stop has been checked', 'Watch the test where each stop is triggered, and get it signed', 'Read the safety part of the code yourself, with his help', 'Trust him, since asking for proof would undermine him'],
          answer: 'Watch the test where each stop is triggered, and get it signed',
          why: 'You check the result, not the code, and you check most where the risk is highest.',
        },
      ],
      teach: [
        'Trust but verify, an old Russian proverb that Ronald Reagan made famous in arms talks in the 1980s, is the working rule with experts. You trust their skill and intent; you check the results that matter.\n\nVerifying is not distrust. Experts check each other all the time: code reviews, test reports, a second engineer signing a drawing. You are asking for the same.',
        'Check results, not methods. You can’t judge how a cable was sized, but you can ask: “Who checked the calculation, and where is it signed?” You can’t read code, but you can watch the test.\n\nThe four-eyes principle means every important piece of work is checked by a second qualified person. Your job is to make sure the second pair of eyes exists, not to be it.',
        'Risk-based checking: check harder where a mistake would hurt most. Safety, money, and anything you can’t undo get a full check. Routine items get a spot check: a check of a small random sample instead of everything, such as three of the forty drawings.\n\nThis keeps you from two failures: checking nothing, and checking everything so experts feel watched and slow down.',
        'How to ask without offending: make it about the process, not the person, and say it upfront. “On every project I ask to see the test results for the safety items. It’s not about you.” Agreed at the start, it is routine. Introduced after a problem, it feels like suspicion.\n\nA typical failure: verifying only once you already distrust someone. Then the check comes too late.',
        'Experts sometimes push back: “We don’t have time for paperwork.” Often they’re right that some checks are just ritual. Ask which checks they think actually catch problems, and keep those.\n\nA sharp question: “If this were wrong, how would we find out, and how soon?” If the answer is “at go-live”, you need a check before then.',
      ],
      example: {
        kind: 'worked',
        text: 'Robot cell project. Forty items on the supplier’s checklist. You can’t judge any of them yourself.\n\nStep 1: sort by risk with the client’s safety engineer. Five items are safety (emergency stops; the light curtain, a beam that stops the robot when someone reaches in; fence interlocks that stop it when a gate opens), three are contract performance (speed, uptime), thirty-two are routine.\nStep 2: safety and performance get a full check: you watch the test, and the safety engineer signs.\nStep 3: routine gets a spot check: you pick three at random and ask to see them.\nStep 4: you agree this with the supplier at the start: “This is how I check, on every project.”\n\nResult: full grip on the eight items that matter, a light touch on the rest.',
      },
      said: 'What you hear in projects: “Just trust us, we’ve done this before.” And the answer: “I do. Show me the test anyway.”',
      recall: [
        {
          q: 'What do you verify when you can’t judge the method?',
          options: ['The expert’s CV and the references from his previous projects', 'Nothing more; trust is enough with a good expert', 'The results, and that a qualified second person checked them', 'Every step of the work, as far as you can follow it'],
          answer: 'The results, and that a qualified second person checked them',
          why: 'You check outcomes and make sure the four-eyes check exists, without being the second pair of eyes.',
        },
        {
          q: 'What is the four-eyes principle?',
          options: ['Important work is checked by a second qualified person', 'Every critical part is bought from two different suppliers', 'Every project has two leaders who share the role', 'Every expert works with a junior who watches over his shoulder'],
          answer: 'Important work is checked by a second qualified person',
          why: 'A second qualified check catches what the first person can’t see in their own work.',
        },
        {
          q: 'Which items get a full check in risk-based checking?',
          options: ['All items equally, so nobody feels singled out', 'The newest items, because they are untested', 'Whatever the expert says is most important', 'Safety, money, and anything you can’t undo'],
          answer: 'Safety, money, and anything you can’t undo',
          why: 'Check hardest where a mistake hurts most; spot-check the routine.',
        },
        {
          q: 'When should you agree the checks with experts?',
          options: ['After the first problem', 'At the start, as routine', 'Never, just do them', 'At go-live'],
          answer: 'At the start, as routine',
          why: 'Agreed upfront it is normal; introduced after trouble it feels like suspicion.',
        },
      ],
      situation: {
        scene: 'MES project. The supplier says all 300 product records have been migrated and checked. The go-live is in two weeks. You can’t judge the data yourself.',
        ask: 'How do you verify this without becoming a data expert?',
        model: 'I’d ask who checked it and how, and for the result in writing. Then a spot check with the people who know the products: the planner picks 10 records at random and compares them with the old system. If all 10 are right, good. If 2 are wrong, the “all checked” claim doesn’t hold and we need a fuller check before go-live.',
        rubric: [
          'Asks how it was checked and by whom',
          'Uses a spot check by someone who knows the content',
          'Says in advance what result would trigger more checking',
        ],
        pushback: {
          lines: [
            '“We’ve already checked them. Another check is a waste of the planner’s time.”',
            '“If you find one small mistake, you’ll blow it up into a crisis.”',
          ],
          model: '“It’s one hour of the planner’s time against a go-live where wrong data stops the line. If the ten are right, that’s good news for your team and I’ll say so in the steering meeting. If one is off, we look at why together before anyone calls it a crisis.”',
          rubric: [
            'Weighs the small cost against the go-live risk',
            'Makes a good result a win for the supplier',
            'Promises a calm, joint response to a finding',
          ],
        },
      },
      sayIt: 'Explain in 60 seconds how you check an expert’s work when you can’t judge it yourself.',
      terms: [
        { term: 'Trust but verify', def: 'Trust people’s skill and intent, and still check the results that matter; an old Russian proverb made famous by Reagan.' },
        { term: 'Four-eyes principle', def: 'Every important piece of work is checked by a second qualified person.' },
        { term: 'Risk-based checking', def: 'Checking harder where a mistake would hurt most, lighter on routine items.' },
        { term: 'Spot check', def: 'A check of a small random sample instead of everything.' },
      ],
    },
    {
      id: 'pm.outside.disagree',
      title: 'When experts disagree',
      pre: [
        {
          q: 'Two engineers disagree on whether to repair or replace an old transformer. You can’t judge who is right. What is the best first step?',
          options: ['Go with the more senior engineer, since experience counts most here', 'Ask them to sort it out between themselves and come back', 'Ask a third engineer to cast the deciding vote', 'Agree the decision criteria first: cost, risk, downtime, lifetime'],
          answer: 'Agree the decision criteria first: cost, risk, downtime, lifetime',
          why: 'With agreed criteria the argument becomes a comparison you can follow, not a battle of authority.',
        },
      ],
      teach: [
        'When two experts disagree, you can’t judge the content, but you can structure the decision. Most expert disagreements are not about facts; they’re about different assumptions or different priorities.\n\nStep one: get the decision criteria on the table before the options. Decision criteria are the things the choice will be judged on: cost, risk, time, quality, how easy it is to maintain.',
        'Then separate fact from judgement. A fact can be checked: “the transformer is 42 years old”. A judgement is an expert’s assessment: “it will probably last another ten years”. Disagreements usually sit in the judgements.\n\nAsk each expert: “What would change your mind?” That shows what the disagreement really rests on.',
        'A weighted score helps when there are several criteria: give each criterion a weight, score each option, multiply and add up. It’s not magic, and the weights are a business choice, not a technical one, so set them with the sponsor.\n\nIts real value: it shows where the options differ, and whether the outcome changes if a weight moves a little.',
        'A second opinion is an independent expert view from someone outside the argument. Use it for big, hard-to-undo choices, and brief the second expert on the question and the criteria, not on who said what.\n\nAnother useful move: ask each expert to state the other’s position so well that the other agrees. It cools things down and often reveals they’re closer than they sounded.',
        'Typical failures: deciding by seniority, by who talks loudest, or by splitting the difference into a solution neither expert believes in. Another: letting it drag on, while the project waits.\n\nA sharp question: “If we chose your colleague’s option, what exactly would go wrong, and how likely is that?” It turns opinions into risks you can compare.',
      ],
      example: {
        kind: 'worked',
        text: 'Grid project at a factory. The factory’s own electrical engineer wants to keep the old transformer and service it; the installer wants to replace it.\n\nStep 1, criteria with the sponsor: cost over 10 years, risk of unplanned outage, downtime during the work.\nStep 2, fact versus judgement: fact, the oil test shows rising moisture. Judgement: “it will last 10 years” versus “it may fail within 5”.\nStep 3, what would change your mind? The factory engineer: “A worse oil test next year.” The installer: “A clean test.”\nStep 4, a second opinion from an independent test company on the oil results.\n\nThe second opinion supports replacing within 3 years; the sponsor plans it for next summer’s shutdown.',
      },
      said: 'What you hear in projects: “With all respect to my colleague, that is simply wrong.” Time to ask for the criteria.',
      recall: [
        {
          q: 'What do you put on the table first when experts disagree?',
          options: ['The options, so everyone sees what is on the table', 'The budget, since it limits every option', 'The decision criteria', 'Each expert’s track record'],
          answer: 'The decision criteria',
          why: 'Agreed criteria turn the argument into a comparison you can follow.',
        },
        {
          q: 'Where do most expert disagreements sit?',
          options: ['In judgements and assumptions', 'In facts that can be checked', 'In what was said in earlier meetings', 'In the wording of the contract'],
          answer: 'In judgements and assumptions',
          why: 'Facts can be checked; experts differ on what they mean and what will happen.',
        },
        {
          q: 'Who should set the weights in a weighted score?',
          options: ['The most senior expert, who knows what matters technically', 'The sponsor, because the weights are a business choice', 'The supplier, who has done this kind of scoring before', 'Whoever builds the spreadsheet, to keep it consistent'],
          answer: 'The sponsor, because the weights are a business choice',
          why: 'How much cost counts against risk is a business priority, not a technical fact.',
        },
        {
          q: 'How do you brief a second-opinion expert?',
          options: ['Tell them which side you lean towards, to save time', 'Give them the cheaper option only, to keep it focused', 'On the question and the criteria, not on who said what', 'Forward the whole email thread so they see every view'],
          answer: 'On the question and the criteria, not on who said what',
          why: 'An independent view only helps if it is not steered.',
        },
      ],
      situation: {
        scene: 'MES project. The supplier’s architect wants a cloud solution; the client’s IT lead wants the servers on site in the factory. The meeting is getting heated and the sponsor wants a decision in two weeks.',
        ask: 'How do you lead this to a decision?',
        model: 'I’d stop the debate about options and ask the sponsor for the criteria: cost over five years, what happens to production if the internet connection fails, security, and who maintains it. Then each expert scores both options against those criteria and says what would change their mind. If the internet risk stays the sticking point, I’d get a short second opinion on it. The sponsor decides with one page.',
        rubric: [
          'Moves from options to criteria set with the sponsor',
          'Has each expert argue against the criteria',
          'Uses a second opinion on the real sticking point and keeps the deadline',
        ],
        pushback: {
          lines: [
            '“A scoring sheet is just a way to dress up a political choice.”',
            '“You don’t understand the technology, so how can you judge the scores?”',
          ],
          model: '“I won’t judge the scores, you two will, and you’ll see each other’s. The sheet doesn’t decide; it shows where you really differ, so the sponsor decides on the actual issue, probably the internet risk, rather than on who argued best. If the scores move the answer, good. If not, we’ve lost an hour.”',
          rubric: [
            'Is clear he doesn’t judge the content',
            'Shows the sheet’s purpose: locate the real difference',
            'Keeps the decision with the sponsor',
          ],
        },
      },
      sayIt: 'Explain in 60 seconds how you lead two disagreeing experts to a decision you can’t judge yourself.',
      terms: [
        { term: 'Decision criteria', def: 'The things a choice will be judged on, such as cost, risk, time and maintainability.' },
        { term: 'Judgement', def: 'An expert’s assessment that can’t simply be checked, such as how long equipment will last.' },
        { term: 'Weighted score', def: 'Scoring options on weighted criteria and adding up; the weights are a business choice.' },
        { term: 'Second opinion', def: 'An independent expert view from someone outside the argument.' },
      ],
    },
    {
      id: 'pm.outside.time',
      title: 'Their time and motivation',
      pre: [
        {
          q: 'The only PLC programmer on your project also works on three other projects. What is the likely effect?',
          options: ['Much of his time goes to switching, so each project gets less than planned', 'Little effect, because experienced programmers are used to juggling several jobs', 'He works faster, because the pressure keeps him focused', 'Your project gets priority, because it is the newest'],
          answer: 'Much of his time goes to switching, so each project gets less than planned',
          why: 'Switching between tasks costs time to get back into each one; spread over four projects, a lot of hours disappear.',
        },
      ],
      teach: [
        'Experts are usually the scarcest resource on a project: few people can do the work and many projects want them. Your plan is only as real as their availability.\n\nContext switching is moving between tasks or projects, and losing time getting back into each one. Gerald Weinberg (1992) offered a rule of thumb: on two projects someone loses about a fifth of their time to switching; on five, the loss can approach three quarters. A rough guide, not a measurement.',
        'Practical consequences: ask for blocks, not percentages. “Tuesdays and Thursdays” beats “40%”. Prepare so their hours count: questions written down, data ready, decisions lined up. Don’t pull them into meetings where they’re not needed; send a two-line summary instead.\n\nA timebox, a fixed slot of time for a task that ends when the time is up, helps: “Two hours on Thursday to decide the interface design.”',
        'Motivation. Daniel Pink (Drive, 2009), building on self-determination theory by the psychologists Edward Deci and Richard Ryan, names three drivers for knowledge work: autonomy, mastery and purpose.\n\nAutonomy is control over how they do the work. Mastery is getting better at something that matters to them. Purpose is seeing what the work is for.',
        'For you: give autonomy over the how, and be firm on the what and when. Tell them about the problem, not just the task: “The operators lose 20 minutes a shift on this; your interface fixes it.” Credit their work by name in front of the sponsor.\n\nWhat kills motivation: changing priorities without explanation, meetings without purpose, and decisions they advised on that are overruled without being told why.',
        'A typical failure: treating the expert’s manager as the only lever. Their manager allocates hours; you earn their attention.\n\nA sharp question for an expert at the start: “What would make this project worth your time?” Some want an interesting problem, some a clean handover, some simply not to be called at night. Then remember the answer.',
      ],
      example: {
        kind: 'faded',
        text: 'Robot cell project. The supplier’s only safety specialist is on four projects and keeps missing your sessions. Your project needs about 40 hours of his time over the next 8 weeks. His manager says “he’s 25% on your project”.\n\nWeinberg’s rough table gives someone on four projects only about 10% of his time for each one; the rest goes on switching. Assume a 40-hour week.',
        ask: 'How would you secure his time and his attention?',
        reveal: 'On paper, 25% of 8 weeks × 40 hours is 80 hours. At Weinberg’s rough 10% it is about 32 hours, short of the 40 you need.\n\nTranslate the percentage into blocks: ask his manager for one fixed 8-hour day every two weeks (4 days, 32 hours), plus two half days for the safety test (8 hours), booked now. That is 40 hours of concentrated time.\n\nPrepare each day: questions, drawings and decisions ready, so no hour is wasted. Ask him what would make the project worth his while, perhaps fewer late calls from the site. Then credit his work in the steering meeting by name.',
      },
      said: 'What you hear in projects: “I’m on four projects. I’ll get to yours this week.” Translation: maybe.',
      recall: [
        {
          q: 'What is context switching?',
          options: ['Changing suppliers halfway through a project', 'Changing the project scope after the plan has been agreed with the sponsor', 'Moving from on-site servers to the cloud', 'Moving between tasks and losing time getting back into each'],
          answer: 'Moving between tasks and losing time getting back into each',
          why: 'Every switch costs time to get back up to speed.',
        },
        {
          q: 'How should you ask for an expert’s time?',
          options: ['As a percentage of his week', 'As blocks: fixed days or half days', 'Only when a problem comes up', 'Through the sponsor, every week, so it gets priority'],
          answer: 'As blocks: fixed days or half days',
          why: 'Blocks reduce switching and are easier to protect than a percentage.',
        },
        {
          q: 'Which three drivers does Daniel Pink name for knowledge work?',
          options: ['Money, status and security', 'Rules, rewards and deadlines', 'Feedback, targets and bonuses', 'Autonomy, mastery and purpose'],
          answer: 'Autonomy, mastery and purpose',
          why: 'From Drive (2009), building on Deci and Ryan’s self-determination theory.',
        },
        {
          q: 'Where should you give an expert autonomy?',
          options: ['On the scope, so he feels ownership', 'On the deadline, so he can plan his own work', 'On the how, while firm on the what and when', 'On everything, because he is the expert'],
          answer: 'On the how, while firm on the what and when',
          why: 'The method is their craft; the goal and timing are the project’s.',
        },
      ],
      situation: {
        scene: 'Grid operator project. The grid operator’s protection engineer, the person who sets when the switchgear cuts power in a fault, has moved your job down her list twice. Her manager says she’s overloaded. Your energising date depends on her settings.',
        ask: 'What do you do?',
        model: 'I’d ask her directly what she needs to do our job in one go, and make it easy: all drawings and data in one package, a fixed half day booked. I’d ask her manager for that half day, linked to the energising date. And I’d ask her what usually wastes her time on jobs like this, so we can avoid it.',
        rubric: [
          'Makes it easy for her: a complete package and a fixed slot',
          'Uses her manager for the time, not as a stick',
          'Asks what helps her, building her motivation',
        ],
        pushback: {
          lines: [
            '“Everybody’s job is urgent. Why should yours go first?”',
            '“Half a day won’t be enough if your drawings are incomplete again.”',
          ],
          model: '“Fair, I’m not asking to go first, I’m asking for a fixed slot so you can plan it. And you’re right about the drawings: send me your checklist, and I’ll make sure the installer’s package meets it two days before. If it doesn’t, I’ll cancel the slot myself so you don’t waste it.”',
          rubric: [
            'Doesn’t claim priority over others',
            'Accepts the point about drawings and fixes it',
            'Protects her time even at his own cost',
          ],
        },
      },
      sayIt: 'Explain in 60 seconds how you get time and real attention from a busy expert.',
      terms: [
        { term: 'Context switching', def: 'Moving between tasks or projects and losing time getting back into each one.' },
        { term: 'Timebox', def: 'A fixed slot of time for a task that ends when the time is up.' },
        { term: 'Autonomy', def: 'Control over how you do your work; one of Pink’s three drivers.' },
        { term: 'Mastery', def: 'Getting better at something that matters to you; one of Pink’s three drivers.' },
        { term: 'Purpose', def: 'Seeing what the work is for; one of Pink’s three drivers.' },
      ],
    },
    {
      id: 'pm.outside.redflags',
      title: 'Red flags',
      pre: [
        {
          q: 'For six weeks running, the developer reports the interface as “90% done”. What is this most likely a sign of?',
          options: ['Effort is being reported, not working results; the hard part is still ahead', 'The work is nearly finished; the last few details simply take a bit more patience', 'The developer is not putting enough hours into the interface', 'The plan was a week too short, so it will finish next week'],
          answer: 'Effort is being reported, not working results; the hard part is still ahead',
          why: '“Almost done” for weeks usually means the last, hardest part hasn’t been faced yet.',
        },
      ],
      teach: [
        'A red flag is a warning sign that something is wrong before it shows in the plan. Outside your field you can’t see the technical problem, but you can see its signals in how people talk and report.\n\nThree red flags cover a lot: always “almost done”, vague answers, and no demo.',
        'Always “almost done”. The ninety-ninety rule, credited to Tom Cargill of Bell Labs and popularised by Jon Bentley in 1985, jokes: “The first 90 percent of the code accounts for the first 90 percent of the development time. The remaining 10 percent accounts for the other 90 percent.”\n\nIf the percentage barely moves for weeks, ask what is left, item by item, and which item is the hardest.',
        'Vague answers. “We’re working on it.” “It should be fine.” “Some minor issues.” One vague answer is normal; a pattern is a signal. Ask for specifics: “Which issues, and what’s the next step on each?” Someone in control can answer in a sentence; someone who isn’t will get vaguer.\n\nWatermelon status is a status that is green outside and red inside: reported fine, while the team knows it isn’t.',
        'No demo. A demo is showing the thing working, live, not slides about it. If a team that has been building for months can’t show anything working, that is the strongest red flag of the three.\n\nOther signals: one person who knows everything and won’t share, a supplier who keeps changing contact persons, tests that keep being postponed, and bad news that always comes the day before a deadline.',
        'Careful: one flag is a reason to ask, not proof of trouble. Experts are often honestly optimistic, and some problems are genuinely almost solved.\n\nRespond with questions and evidence, not accusations. And look at yourself: if bad news reaches you late, maybe people don’t feel safe bringing it. A sharp question: “What are you worried about that you haven’t told me yet?”',
      ],
      example: {
        kind: 'faded',
        text: 'MES project, month 4. Three weeks in a row the supplier reports the label printing module as “almost done, a few small issues”. The status is green. The demo planned for last Friday was moved “because the test environment was down”. The developer who built it has just moved to another client of the supplier.',
        ask: 'How many red flags do you see, and what would you do this week?',
        reveal: 'At least four: almost done for weeks, vague “small issues”, a postponed demo, and the key person leaving. The green status may be a watermelon.\n\nThis week: ask for the open issues as a list with an owner and date each. Ask for the demo on a fixed day, on any environment that works, even a laptop. Ask who now owns the module and how the handover was done. Tell the sponsor it is amber until the demo, with the reasons.',
      },
      said: 'What you hear in projects: “It’s basically done, just some small things left.” Ask for the list.',
      recall: [
        {
          q: 'What does the ninety-ninety rule warn about?',
          options: ['That about 90% of large projects overrun their budget', 'That the last 10% can take as long as the first 90%', 'That 90% of the bugs tend to sit in 10% of the code', 'That 90% of the value comes from the first 10% of work'],
          answer: 'That the last 10% can take as long as the first 90%',
          why: 'Credited to Tom Cargill, popularised by Jon Bentley (1985): “almost done” can last a long time.',
        },
        {
          q: 'What is watermelon status?',
          options: ['A project that is red but slowly turning green', 'A status report that nobody reads to the end', 'A status reported green while the team knows it is red', 'A project whose demand changes with the season'],
          answer: 'A status reported green while the team knows it is red',
          why: 'Green outside, red inside.',
        },
        {
          q: 'Which of the three red flags is the strongest after months of building?',
          options: ['No demo of anything working', 'Weeks of “almost done” reports', 'A sudden increase in meetings', 'Vague answers to direct questions'],
          answer: 'No demo of anything working',
          why: 'Working results can’t be faked in a live demo; their absence after months says a lot.',
        },
        {
          q: 'You see one red flag. What is the right response?',
          options: ['Escalate it to the sponsor straight away, before it grows', 'Start looking for a replacement supplier', 'Ignore it until you have seen three', 'Ask specific questions and ask for evidence'],
          answer: 'Ask specific questions and ask for evidence',
          why: 'One flag is a reason to ask, not proof; questions and evidence show whether there is a problem.',
        },
      ],
      situation: {
        scene: 'Robot cell project. Two weeks before the acceptance test the supplier’s project manager keeps saying “we’re on track” but can’t say when the cell will run with real boxes. The site visit you planned was cancelled twice.',
        ask: 'How do you raise this with him?',
        model: '“I want to believe ‘on track’, and I need to see it. Can we book a session this week where the cell runs real boxes, even slowly and with faults? And can you send me the list of what’s still open, with an owner and date? If there are problems, I’d rather know now: we can still move things on the client side, but not in two weeks.”',
        rubric: [
          'Names the need for evidence without accusing',
          'Asks for a demo on a fixed date and a specific open-items list',
          'Makes it safe and useful to share bad news now',
        ],
        pushback: {
          lines: [
            '“A demo now would show a half-finished cell. That gives the wrong impression.”',
            '“Are you saying we’re lying about being on track?”',
          ],
          model: '“No, I’m saying I can’t see it yet, and I report what I can see. A half-finished cell running slowly gives the right impression: that it runs. I’ll tell the client upfront it’s a work-in-progress demo. If you’d rather not, send me the open list today, and we book the demo for next Wednesday.”',
          rubric: [
            'Denies the accusation calmly and stays on evidence',
            'Reframes a rough demo as useful',
            'Offers an alternative with a firm date',
          ],
        },
      },
      sayIt: 'Name three red flags in 60 seconds and say which question you’d ask for each.',
      terms: [
        { term: 'Red flag', def: 'A warning sign that something is wrong before it shows in the plan.' },
        { term: 'Ninety-ninety rule', def: 'The joke that the first 90% of the work takes 90% of the time and the last 10% takes the other 90% (Cargill, popularised by Bentley, 1985).' },
        { term: 'Watermelon status', def: 'A status reported green on the outside while it is red inside.' },
        { term: 'Demo', def: 'Showing the thing working, live, not slides about it.' },
      ],
    },
    // Topic 4: steering and deciding
    {
      id: 'pm.outside.progress',
      title: 'Measuring progress without the content',
      pre: [
        {
          q: 'Which progress report gives you the most grip when you can’t judge the work?',
          options: ['“We’re at 70% complete, slightly ahead of where we planned to be.”', '“Four of six milestones are done with test reports; the fifth is due Friday.”', '“The team has worked hard and put in extra hours this month.”', '“We’ve spent 70% of the budget, which is exactly in line with the plan for this month.”'],
          answer: '“Four of six milestones are done with test reports; the fifth is due Friday.”',
          why: 'Completed milestones with evidence are checkable; percentages and effort are not.',
        },
      ],
      teach: [
        'Outside your field you can’t look at the work and judge how far along it is. So measure progress by things that are either done or not done, with evidence you can see.\n\nA milestone is a point in the project where a clear result has to exist: “interface tested with real orders”, “switchgear energised”. It’s a yes-or-no, not a percentage.',
        'Percent complete, the share of work said to be finished, is the weakest measure outside your field: it’s an opinion, and it tends to stall near 90%. Budget spent tells you about money, not progress.\n\nCount finished milestones instead, and only count a milestone when its evidence exists: a signed test report, a demo, an approved drawing.',
        'Acceptance criteria are the conditions a result must meet to count as accepted, written before the work starts. “The label prints in under 3 seconds and all 12 fields match the order.” Agree them with the expert and the user, so “done” isn’t argued about later.\n\nThe definition of done is the shared quality standard that work must meet to count as finished, such as tested, documented, reviewed. It comes from the Scrum Guide; most teams keep it as a short checklist, and it works on any project.',
        'In automation and electrical projects, two formal milestones are common. The factory acceptance test (FAT) is the test of a machine at the supplier’s site before shipping. The site acceptance test (SAT) is the test after installation at the client.\n\nA FAT passed with a list of open points is common; make sure the list has owners and dates before you ship.',
        'Demos are your best progress meter: regular, short, with real data. A two-weekly demo shows more than ten status reports.\n\nA typical failure: milestones so far apart that nothing can be checked for months. A rough rule many project leaders use is a checkable result at least every two to four weeks. A sharp question: “What will you be able to show me in two weeks?”',
      ],
      example: {
        kind: 'worked',
        text: 'MES project. The supplier reports “70% complete”. You rebuild the progress view.\n\nStep 1: list the milestones with the supplier: 1 design approved, 2 test environment running, 3 master data loaded, 4 interface tested with real orders, 5 operator screens accepted, 6 go-live rehearsal passed.\nStep 2: for each, the evidence: signed design, a demo, a data check, a test report, user sign-off, a rehearsal report.\nStep 3: count what has evidence: 1 and 2 only. Milestone 3 is “almost done” without a check.\nStep 4: report 2 of 6 with evidence, the third due in two weeks.\n\nThe “70%” was effort spent. Two of six is what you can prove.',
      },
      said: 'What you hear in projects: “We’re at 70%.” The better question: “70% of what, and what can you show me?”',
      recall: [
        {
          q: 'Why is percent complete a weak measure outside your field?',
          options: ['It is too precise for an estimate', 'Sponsors don’t understand percentages', 'Suppliers each calculate it differently, so you can’t compare', 'It is an opinion and tends to stall near 90%'],
          answer: 'It is an opinion and tends to stall near 90%',
          why: 'You can’t check it, and the last part of the work usually takes longest.',
        },
        {
          q: 'When does a milestone count as done?',
          options: ['When the expert responsible says it is done', 'When its planned date has passed without issues', 'When its evidence exists, such as a signed test report', 'When the budget set aside for it has been spent'],
          answer: 'When its evidence exists, such as a signed test report',
          why: 'Evidence makes progress checkable without judging the content.',
        },
        {
          q: 'What is the difference between FAT and SAT?',
          options: ['FAT is at the supplier before shipping; SAT after installation on site', 'FAT tests the software; SAT tests the hardware and wiring', 'FAT is the formal contract test; SAT is an informal check by the operators', 'FAT is optional for standard machines; SAT is always required'],
          answer: 'FAT is at the supplier before shipping; SAT after installation on site',
          why: 'Factory acceptance test and site acceptance test.',
        },
        {
          q: 'A project has 8 milestones. 5 are reported done, but only 3 have evidence. How many do you report as done?',
          number: 3,
          tolerance: 0.5,
          unit: 'milestones',
          why: 'Only milestones with evidence count; the other 2 are claims until checked.',
        },
      ],
      situation: {
        scene: 'Grid operator project. The factory director asks you: “Where are we? Give me a percentage.” The installer says 80%. You know the cable is laid, but the switchgear hasn’t been delivered and nothing has been tested.',
        ask: 'What do you tell the director?',
        model: '“I’d rather not give a percentage, because it hides where we are. Of the five milestones, two are done with evidence: the route permit and the cable laid and tested. The switchgear delivery is the next one, due in three weeks, and it’s the one that decides the date. After that come installation, testing and energising.”',
        rubric: [
          'Explains briefly why a percentage misleads',
          'Reports milestones with evidence',
          'Points to the next milestone that decides the date',
        ],
        pushback: {
          lines: [
            '“I don’t have time for milestones. I just need to know if we’ll make October.”',
            '“The installer says 80%. Why should I believe your 40?”',
          ],
          model: '“Short answer: October is possible, and it depends on one thing, the switchgear arriving in three weeks. I’ll confirm the delivery date with the manufacturer this week and tell you Friday. The installer’s 80% is his effort; my two of five is what has been tested. Both are true, but only the second tells you about October.”',
          rubric: [
            'Gives a direct answer to the real question',
            'Names the one thing that decides it and a date to confirm',
            'Explains the two numbers without attacking the installer',
          ],
        },
      },
      sayIt: 'Explain in 60 seconds why milestones with evidence beat a percentage, with an example.',
      terms: [
        { term: 'Milestone', def: 'A point in the project where a clear result has to exist; yes or no, not a percentage.' },
        { term: 'Percent complete', def: 'The share of work said to be finished; an opinion that tends to stall near 90%.' },
        { term: 'Acceptance criteria', def: 'Conditions a result must meet to count as accepted, written before the work starts.' },
        { term: 'Definition of done', def: 'A shared quality standard, usually kept as a short checklist, that work must meet to count as finished; from the Scrum Guide.' },
        { term: 'Factory acceptance test', def: 'FAT: testing a machine at the supplier’s site before shipping; the site acceptance test (SAT) follows at the client.' },
      ],
    },
    {
      id: 'pm.outside.decide',
      title: 'Deciding under uncertainty, and escalating',
      pre: [
        {
          q: 'The team can’t agree whether to start the data migration this week or wait two weeks for more test results. The migration can be rerun if needed. What kind of decision is this?',
          options: ['An irreversible one; wait until all the test results are in', 'A reversible one; decide fairly quickly with what you have', 'A technical one; leave it to the migration specialist', 'A strategic one; take it to the board for a decision'],
          answer: 'A reversible one; decide fairly quickly with what you have',
          why: 'If a decision can be undone at low cost, waiting for certainty usually costs more than being a bit wrong.',
        },
      ],
      teach: [
        'Outside your field you will rarely have certainty. The skill is deciding well with what you have, and knowing when it isn’t your decision to make.\n\nFirst ask: is it a reversible decision, one you can undo at low cost, or not? Jeff Bezos (shareholder letter for 2015, published in 2016) called irreversible ones one-way doors: walk through and you can’t come back. Reversible ones are two-way doors.',
        'For two-way doors, decide fairly fast and learn. In his letter for 2016 he suggested most decisions can be made with around 70% of the information you’d like; wait for 90% and you’re usually too slow. A rule of thumb, not a law.\n\nFor one-way doors, such as ordering switchgear with a long lead time (the time from order to delivery) or shutting down the old system, slow down: more evidence, a second opinion, the sponsor deciding.',
        'Escalation is taking a decision or problem to someone with more authority because it is beyond yours. It is not failure; it is the system working. Escalate when it’s outside your mandate, when experts are stuck, or when the goal, budget or date is at risk.\n\nEscalate early, with options, not just a problem: “Here are two options, what each costs, and my recommendation.”',
        'A decision memo makes this concrete: one page with the question, the options, the criteria, the expert advice, your recommendation and the deadline. It forces you to translate the technical part into consequences.\n\nThen communicate the decision clearly and without apology. Jeffrey Pfeffer’s 7 Rules of Power apply here: show up in powerful fashion, state it calmly and firmly, and don’t undercut it with “sorry, maybe”.',
        'Typical failures: escalating too late, when there are no options left; escalating without a recommendation, so the sponsor has to do your thinking; and revisiting decisions every week.\n\nA sharp question for any stuck decision: “If we can’t undo this, who should decide it, and by when? If we can, what’s the cost of waiting another week?”',
      ],
      example: {
        kind: 'worked',
        text: 'Grid project. The switchgear has a 26-week lead time, the time from order to delivery. The final load figures of the factory won’t be known for 4 more weeks. If you wait, energising slips by about a month.\n\nStep 1, door type: ordering is a one-way door; cancelling costs a lot.\nStep 2, ask the expert: “Would the final load figures change the switchgear?” Grid engineer: “Only if the load goes up by more than 30%.”\nStep 3, ask the factory: “How likely is that?” “Very unlikely.”\nStep 4, decision memo to the sponsor: order now with the current sizing, risk named; or wait 4 weeks and slip a month. Recommendation: order now.\nStep 5, the sponsor decides; you record and announce it plainly.',
      },
      said: 'What you hear in projects: “Let’s wait until we know more.” Sometimes wise. Often expensive.',
      recall: [
        {
          q: 'What is a one-way door decision?',
          options: ['A decision only one person is allowed to make', 'A decision that has to be made in a single meeting', 'An irreversible decision, hard or costly to undo', 'A yes-or-no decision with no middle option'],
          answer: 'An irreversible decision, hard or costly to undo',
          why: 'Bezos’s term: walk through and you can’t come back, so take more care.',
        },
        {
          q: 'Roughly how much of the information you’d like did Bezos suggest is enough for most decisions?',
          options: ['About 50%', 'About 100%', 'About 70%', 'About 30%'],
          answer: 'About 70%',
          why: 'From his shareholder letter for 2016 (published 2017): wait for 90% and you’re usually too slow. For a one-way door you slow down anyway.',
        },
        {
          q: 'How should you escalate?',
          options: ['Late, once you are sure there really is a problem', 'Only with the expert in the room to explain it', 'By email to everyone involved, so nobody is surprised', 'Early, with options and a recommendation'],
          answer: 'Early, with options and a recommendation',
          why: 'Early keeps options open; a recommendation saves the sponsor’s thinking time.',
        },
        {
          q: 'Which advice about communicating a decision fits Pfeffer’s 7 Rules of Power?',
          options: ['Start with an apology so people don’t feel overruled', 'State it calmly and firmly, without undercutting it', 'Leave it vague so you can change course', 'Let the expert announce it'],
          answer: 'State it calmly and firmly, without undercutting it',
          why: 'Showing up in powerful fashion: hedging and apologising weaken a decision that has been properly made.',
        },
      ],
      situation: {
        scene: 'MES project. Two weeks before go-live, the test team finds that one report for the quality department doesn’t work. The supplier says it can be fixed in three weeks. Go-live on the planned date without the report, or delay by three weeks? The decision is beyond your mandate.',
        ask: 'How do you bring this to the sponsor, and what do you say once she decides?',
        model: 'A one-page memo today: the problem in plain words, the two options with cost, risk and what the quality department loses, the quality manager’s view, and my recommendation: go live, with a manual workaround for three weeks. After her decision I’d announce it to the team plainly: “We go live on the 14th. The quality report follows on the 4th; until then, quality uses the manual check. Questions to me.”',
        rubric: [
          'Escalates quickly with options, consequences and a recommendation',
          'Includes the affected department’s view',
          'Announces the decision clearly, without apology or hedging',
        ],
        pushback: {
          lines: [
            '“Why are you bringing me this? Can’t you just decide it with the supplier?”',
            '“The quality manager will be furious. Shouldn’t you soften the message?”',
          ],
          model: '“It touches the go-live date and the quality department, so it’s beyond what I can decide; you’ve got my recommendation, and it takes two minutes. On the message: I’ll talk to the quality manager personally first and explain the workaround. Then the announcement stays clear. Softening it would only make people think it might change.”',
          rubric: [
            'Explains why it is the sponsor’s decision and makes it easy',
            'Handles the affected person personally first',
            'Keeps the announcement clear and firm',
          ],
        },
      },
      sayIt: 'Explain in 60 seconds the difference between one-way and two-way doors, and when you escalate.',
      terms: [
        { term: 'Reversible decision', def: 'A decision you can undo at low cost; decide fairly quickly and learn.' },
        { term: 'One-way door', def: 'An irreversible decision, hard or costly to undo (Bezos, shareholder letter for 2015); slow down and get more evidence.' },
        { term: 'Escalation', def: 'Taking a decision or problem to someone with more authority because it is beyond yours; best early and with options.' },
        { term: 'Decision memo', def: 'One page with the question, options, criteria, expert advice, recommendation and deadline.' },
        { term: 'Lead time', def: 'The time from order to delivery.' },
      ],
    },
    {
      id: 'pm.outside.stakeholders',
      title: 'Communicating with stakeholders',
      pre: [
        {
          q: 'You need to tell the factory director that energising slips by four weeks. How do you open?',
          options: ['With the technical background, so he understands exactly why it slipped', 'With how the delay came about and whose part caused it', 'With an apology, so he sees you take it seriously', 'With the conclusion: the new date, what it means for him, your plan'],
          answer: 'With the conclusion: the new date, what it means for him, your plan',
          why: 'Senior people want the point first; the background comes if they ask for it.',
        },
      ],
      teach: [
        'A stakeholder is anyone who affects or is affected by the project: the sponsor, the factory director, the operators, the grid operator, the supplier. Outside your field, you are often the only person who speaks to all of them, so you are the translator.\n\nEach group needs the same facts in its own language: the director in money and dates, operators in what changes on their shift, experts in technical terms.',
        'The pyramid principle, from Barbara Minto (The Pyramid Principle, 1987, written from her work at McKinsey), says: start with the conclusion, then the main reasons, then the detail. Senior people read the first two lines and decide whether to read on.\n\nFor a decision or bad news: what happened, what it means for them, what we’re doing, what we need from them. Four sentences, then stop.',
        'How you say it matters as much as what. Jeffrey Pfeffer’s 7 Rules of Power (2022) argue that people judge competence partly from how confident you appear. For you that means: announce a decision plainly, stand straight, don’t over-explain, and don’t apologise for a decision that was made properly.\n\nIt doesn’t mean pretending: confidence is about how you speak, honesty is about what you say.',
        'Use a hedge, a phrase that shows how certain you are, deliberately. “We expect” versus “we will” is useful precision. Hedging every sentence (“maybe”, “I think”, “sort of”) makes you sound unsure even about what you know.\n\nRule: hedge the forecast, not the facts. “The cable is laid and tested. We expect energising in week 42.”',
        'Typical failures: forwarding the expert’s email with “see below”; giving the director the full technical story; telling operators last. Another: good news to everyone, bad news only when asked.\n\nA sharp check before you send anything: “If he reads only the first two lines, does he know what he needs to know and what I need from him?”',
      ],
      example: {
        kind: 'faded',
        text: 'Robot cell project. The FAT at the supplier showed the cell reaches 10 boxes per minute, not the 12 in the contract. The supplier says a gripper change will fix it in three weeks, delaying shipping. You must inform the factory director, the line operators and the client’s sponsor.\n\nA draft to the director starts: “Last week we attended the factory acceptance test, where several measurements were taken under different conditions…”',
        ask: 'How would you rewrite the opening for the director, and what would you tell the operators?',
        reveal: 'Director, conclusion first: “The robot cell ships three weeks later, on 12 May, because it reached 10 of the 12 boxes per minute at the test. The supplier fixes the gripper at its own cost. Line 3 keeps its manual stacking until then. I need nothing from you; I’ll confirm the new date on 20 April.”\n\nOperators, at the shift start, in their terms: “The robot comes three weeks later. Until then nothing changes for you; the training moves to the week of 12 May.”',
      },
      said: 'What you hear in projects: “Can you just tell me what it means for me?”',
      recall: [
        {
          q: 'What does the pyramid principle say?',
          options: ['Start with the background, then build up to the conclusion', 'Tell senior people last, once the detail is settled', 'Conclusion first, then the main reasons, then the detail', 'Use three slides at most, one idea per slide'],
          answer: 'Conclusion first, then the main reasons, then the detail',
          why: 'Barbara Minto: senior readers decide from the first lines whether to read on.',
        },
        {
          q: 'What do Pfeffer’s 7 Rules of Power suggest about announcing a decision?',
          options: ['Announce it plainly and confidently, without over-explaining', 'Apologise first, to keep people on your side', 'Let the expert announce it, so it carries technical authority', 'Wait until everyone agrees before announcing it'],
          answer: 'Announce it plainly and confidently, without over-explaining',
          why: 'People judge competence partly from how confident you appear.',
        },
        {
          q: 'What should you hedge?',
          options: ['The facts, not the forecast', 'The forecast, not the facts', 'Everything, to be safe', 'Nothing, ever'],
          answer: 'The forecast, not the facts',
          why: '“The cable is tested” is a fact; “we expect week 42” is a forecast with honest uncertainty.',
        },
        {
          q: 'Which is a typical communication failure outside your field?',
          options: ['Opening every message with the conclusion', 'Telling operators what changes on their shift', 'Forwarding the expert’s email with “see below”', 'Ending with what you need from the reader'],
          answer: 'Forwarding the expert’s email with “see below”',
          why: 'It hands the translation work to people who can’t do it.',
        },
      ],
      situation: {
        scene: 'MES project. The sponsor decided to go live without one quality report, with a manual workaround for three weeks. You have to tell the quality manager, who argued against it, and the planners, who will use the system from Monday.',
        ask: 'What do you say to each?',
        model: 'Quality manager, in person and first: “The sponsor decided to go live on the 14th without your report; it follows on the 4th. I know you argued against it, and your point is in the decision memo. Until then the manual check covers it. What do you need from me to make that work?” Planners, short: “Go-live is Monday as planned. One report comes later; it doesn’t affect your screens.”',
        rubric: [
          'Tells the most affected person first and in person',
          'States the decision plainly, acknowledges her view, offers help',
          'Gives each group only what matters to them',
        ],
        pushback: {
          lines: [
            '“So my concerns just got ignored. Why did I bother raising them?”',
            '“If something goes wrong in those three weeks, it’s on you, not me.”',
          ],
          model: '“They weren’t ignored: they’re in the memo, and the sponsor read them. She weighed them against the cost of a three-week delay and decided. I understand you’re not happy with it. If something goes wrong, the decision is on record with the sponsor, not on you. Let’s make the manual check as solid as we can.”',
          rubric: [
            'Shows concretely that her view was heard',
            'Stays firm on the decision without arguing it again',
            'Removes her fear of blame and moves to action',
          ],
        },
      },
      sayIt: 'Tell a director some bad news from your project in 60 seconds, conclusion first.',
      terms: [
        { term: 'Stakeholder', def: 'Anyone who affects or is affected by the project.' },
        { term: 'Pyramid principle', def: 'Start with the conclusion, then the main reasons, then the detail (Barbara Minto).' },
        { term: '7 Rules of Power', def: 'Jeffrey Pfeffer’s book (2022) on gaining and using power at work, including showing up in powerful fashion.' },
        { term: 'Hedge', def: 'A phrase that shows how certain you are, such as “we expect”; use it for forecasts, not facts.' },
      ],
    },
    {
      id: 'pm.outside.learnfast',
      title: 'Learning a new field fast',
      pre: [
        {
          q: 'You start next month on a project in a field you don’t know: grid connections. What is the most useful first step?',
          options: ['Find the ten words the project keeps using and learn why each matters', 'Read a grid engineering textbook cover to cover before your first day there', 'Wait for the kick-off, where the experts will explain the basics', 'Take an online course in electrical engineering first'],
          answer: 'Find the ten words the project keeps using and learn why each matters',
          why: 'A small core vocabulary lets you follow the meetings fast; depth can come later.',
        },
      ],
      teach: [
        'You don’t need to become an expert, but you need to learn fast enough to follow, ask good questions and spot nonsense. Michael Watkins (The First 90 Days, 2003) argues that new leaders should plan their learning deliberately rather than absorb it by chance.\n\nA common way is a 30-60-90 plan: what you will learn and do in your first 30, 60 and 90 days.',
        'First 30 days: learn. Build your domain vocabulary, the ten words that keep coming back in the meetings: for a grid project maybe connection capacity, congestion, medium voltage, switchgear, protection, transformer, cable route, energising, outage, load. For each: what it is, and why it matters to the project.\n\nKeep a glossary: your own list of terms with a one-line meaning and an example.',
        'Days 31–60: understand the system. Draw a mental model, a simple picture in your head and on paper of how the parts connect: where power comes from, through what, to which machines. Ask an expert to correct your drawing; wrong drawings teach fast.\n\nShadowing is spending time alongside an expert while they work: a day with the installer, an hour with the planner. You learn what matters to them, and they get to know you.',
        'Days 61–90: contribute. By now you should be able to explain the project in plain words to an outsider, name the three biggest technical risks and why, and ask questions experts find useful.\n\nTest yourself: explain the system to someone outside the project in five minutes. Where you stumble is what to learn next.',
        'Typical failures: reading theory for weeks without talking to anyone; trying to learn everything rather than what the project needs; or stopping at day 30 because the words now sound familiar.\n\nExperts argue about depth: some say spend 10% of your time on the content throughout; others say front-load it. Either way, a sharp question to every expert in your first month: “What do new people always get wrong about this?”',
      ],
      example: {
        kind: 'faded',
        text: 'You’ll lead the client side of an MES project at a metal parts maker in six weeks. You know Lean and the shop floor, not IT.\n\nWeek 1 you collect the words from the tender and the supplier’s proposal: MES, ERP, interface, master data, routing, work order, integration, test environment, cutover (switching from the old system to the new one), hypercare (extra support in the first weeks after go-live).',
        ask: 'How would you plan your first 90 days?',
        reveal: 'Days 1–30: a glossary of those ten words with the IT lead’s help; ask “why does this matter for us?” for each. Sit with a planner for a day to see the work orders.\n\nDays 31–60: draw the system: ERP sends work orders through the interface to the MES, the MES tracks them on the machines and sends back what was made. Have the architect correct it.\n\nDays 61–90: explain the project to the plant manager in five minutes; name the top three risks, such as master data, the interface and cutover weekend.',
      },
      said: 'What you hear in projects: “You’ll pick it up as you go.” Faster if you plan it.',
      recall: [
        {
          q: 'Day 45 of your 30-60-90 plan on a grid project. Which activity fits that phase best?',
          options: ['Building your list of the ten core words', 'Reading the contract and the tender carefully for the first time', 'Presenting the top three technical risks to the board', 'Drawing how the system connects and having an expert correct it'],
          answer: 'Drawing how the system connects and having an expert correct it',
          why: 'Days 31–60 are for understanding the system: a mental model, corrected by an expert. The words come first (days 1–30); contributing comes last (days 61–90).',
        },
        {
          q: 'What should a glossary entry contain?',
          options: ['The term only, so the list stays short', 'The term, a one-line meaning and an example', 'The full definition from the technical standard', 'The term and the name of the expert who uses it'],
          answer: 'The term, a one-line meaning and an example',
          why: 'Short enough to keep up, concrete enough to remember.',
        },
        {
          q: 'Why ask an expert to correct your drawing of the system?',
          options: ['To show the expert you did your homework', 'To get the drawing signed off as an official project document', 'Because experts enjoy explaining their field', 'Because his corrections show what you misunderstood'],
          answer: 'Because his corrections show what you misunderstood',
          why: 'Correcting a picture is quick for them and very instructive for you.',
        },
        {
          q: 'Which is a typical failure when learning a new field?',
          options: ['Asking experts basic questions in the first week', 'Drawing the system before you fully understand it', 'Reading theory for weeks before talking to anyone', 'Keeping a glossary that is still incomplete'],
          answer: 'Reading theory for weeks before talking to anyone',
          why: 'You learn what matters for the project from the people in it.',
        },
      ],
      situation: {
        scene: 'Your manager tells you on Friday that you’ll join an automation supplier’s project on Monday as client-side project leader for a robot cell. You’ve never worked with robots. The first progress meeting is Wednesday.',
        ask: 'What do you do between Friday and Wednesday?',
        model: 'Over the weekend I’d read the proposal and contract and list the words I don’t know, probably PLC, safety PLC, gripper, cycle time, FAT, SAT, risk assessment. Monday I’d ask the client’s engineer for an hour to explain those ten words and draw the cell. Tuesday an hour at the line. Wednesday I’d go in with the five-area question set and tell them I’m new to robots and will ask basic questions.',
        rubric: [
          'Builds a short vocabulary list from the project documents',
          'Uses an expert and the real line to learn fast',
          'Goes into the first meeting with a question set and is honest about being new',
        ],
        pushback: {
          lines: [
            '“The supplier will eat you alive if you say you’re new to robots.”',
            '“Shouldn’t you just let the engineer lead the first meetings?”',
          ],
          model: '“They’ll find out in ten minutes anyway; if I say it first, I set the tone and my questions sound deliberate. And the engineer will lead the technical part, but the goal, the plan and the decisions are mine from day one. If I hand those over now, it’s hard to take them back.”',
          rubric: [
            'Explains why openness is stronger than hiding it',
            'Gives the engineer the technical lead',
            'Keeps goal, plan and decisions from the start',
          ],
        },
      },
      sayIt: 'Lay out your 30-60-90 plan for a field you don’t know yet, in 60 seconds.',
      terms: [
        { term: '30-60-90 plan', def: 'A plan for what you will learn and do in your first 30, 60 and 90 days.' },
        { term: 'Domain vocabulary', def: 'The core words of a field that keep coming back in the project; about ten to start.' },
        { term: 'Glossary', def: 'Your own list of terms, each with a one-line meaning and an example.' },
        { term: 'Mental model', def: 'A simple picture of how the parts of a system connect.' },
        { term: 'Shadowing', def: 'Spending time alongside an expert while they work, to learn what matters to them.' },
      ],
    },
  ],
};
