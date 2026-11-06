// pm.portfolio (EN): Programmes, portfolios and governance: running several projects as one, prioritising, decision rights, benefits, shared experts and the boardroom.
export default {
  lessons: [
    {
      id: 'pm.portfolio.programme',
      title: 'Programme or project',
      pre: [
        {
          q: 'What turns a set of projects into a programme, rather than just a list of projects?',
          options: ['They share one budget', 'They share one sponsor', 'Together they deliver an outcome none of them achieves alone', 'They run in the same period'],
          answer: 'Together they deliver an outcome none of them achieves alone',
          why: 'A shared budget or sponsor is administration. A programme exists because the goal needs the projects together.',
        },
      ],
      teach: [
        'A project delivers an output: a readiness check, a rebuilt line, a new planning tool. A programme is a group of projects run together because they deliver one outcome none of them reaches alone: for example, cancelled grid jobs down from 14% to 8%, which needs a readiness check, a new materials process and a planning-tool change.\n\nTest: if you can drop one project and the goal still holds, it belongs in the portfolio, the full list of projects competing for the same money and people, not in this programme.',
        'A dependency is something one project needs from another by a date: B needs A’s data definition by week 10; C needs the same two planners as B in Q2. Keep one list with owner, date and what happens if it slips.\n\nThe maths is harsh: four independent projects that are each 90% likely to deliver on time give only a 66% chance that all four do (0.9 × 0.9 × 0.9 × 0.9 = 0.66). Shared people make it worse.',
        'The programme board: the sponsor, the project owners, the line manager who owns the outcome, and finance if money moves between projects. It meets monthly and decides on the seams: sequencing, shared people, moving scope (what is in or out of a project) between projects.\n\nProject decisions stay in the project steering groups. If the board spends its hour on one project’s test plan, it is a steering group with too many people.',
        'Watch for watermelon reporting: green on the outside, red inside. Each project reports green against its own plan while the shared goal doesn’t move, because nobody reports on the seams.\n\nThe fix: report the outcome number itself every month, next to the project statuses. Experts disagree on how much power a programme lead needs: some say control of the project budgets, others say a clear outcome and a strong board are enough.',
        'As programme lead you own the outcome story, the dependency list and the rhythm. You do not run the projects.\n\nA useful test of yourself: can you explain in two minutes, with numbers, how the projects add up to the goal? If you can’t, the board can’t either, and they will start managing each project separately. The sharp question for any programme: which number moves, by how much, and which project moves which part?',
      ],
      example: {
        kind: 'faded',
        text: 'Vantage is brought in by a regional director at a grid operator. Three projects started separately in her region: a readiness check for planned jobs (team A), a new materials-kit process (team B) and a planning-tool upgrade (IT).\n\nAll three report green. Cancellations are still at 14%; her target is 8%.\n\nYou notice the readiness check reads material data that team B is redesigning, and the IT release in Q3 changes the field the readiness check uses.',
        ask: 'What would you do next?',
        reveal: 'Make it a programme with one number: cancellations from 14% to 8%. Put the dependencies on one page: the material-data definition, the tool field change, and the planners all three teams need. Show the director that each project is green while the seams are red.\n\nPropose: team B owns the material-data definition and freezes it by week 6; IT tests its Q3 release against the readiness check before go-live, the day it goes into use; a monthly programme board with her, the three project owners and the planning manager. Report the outcome monthly, with an estimate of what each project contributes.',
      },
      said: 'What you hear in projects: “Every project is green, so why isn’t the number moving?”',
      recall: [
        {
          q: 'The programme board spends 40 minutes on one project’s test plan. What is wrong?',
          options: ['The board is too small', 'The board is doing project work that belongs in that project’s steering group', 'The test plan should go to finance first', 'Nothing, detail shows commitment'],
          answer: 'The board is doing project work that belongs in that project’s steering group',
          why: 'The board decides on the seams between projects; project detail drowns that out.',
        },
        {
          q: 'Where do most programme failures happen?',
          options: ['Inside the largest project', 'In the original budget', 'At the seams between projects', 'At the kick-off'],
          answer: 'At the seams between projects',
          why: 'Each project manages itself; nobody manages what passes between them unless the programme does.',
        },
        {
          q: 'A programme has four independent projects, each 90% likely to deliver on time. What is the chance, in percent, that all four do?',
          number: 66,
          tolerance: 1,
          unit: '%',
          why: '0.9 × 0.9 × 0.9 × 0.9 = 0.656, so about 66%. Dependencies multiply risk.',
        },
        {
          q: 'What does each line of a dependency list need?',
          options: ['An owner, a date, and what happens if it slips', 'Only the items on the critical path (the chain of tasks that sets the end date)', 'The budget of both projects', 'The names of both teams'],
          answer: 'An owner, a date, and what happens if it slips',
          why: 'Without an owner and a consequence, a dependency is just an observation.',
        },
      ],
      situation: {
        scene: 'You’re at a metal parts manufacturer. The COO (chief operating officer) has three improvement projects running, on OEE (how much of the planned time the machines make good parts), on planning and on maintenance, and asks Vantage: “Can you run these as a programme? I want one story for the board.”',
        ask: 'What do you set up in the first two weeks?',
        model: 'First I’d agree the single outcome with the COO, for example on-time delivery from 82% to 92%, and how each project contributes to it. Then a one-page dependency map with owners and dates, and a monthly programme board that only takes decisions on the seams. I’d tell the project leads plainly: “You keep running your projects; I look after what passes between them.”',
        rubric: [
          'Starts from one measurable outcome, not the list of projects',
          'Makes dependencies visible with owners and dates',
          'Separates programme decisions from project decisions',
        ],
        pushback: {
          lines: [
            '“I don’t want another layer of meetings. Just give me one slide every month.”',
            '“The three project leads won’t like someone above them. Can’t you do it without changing anything?”',
          ],
          model: '“One slide a month is exactly the aim, and for that all three need one shared goal. No new layer: the leads keep their projects, and we add one hour a month where they look at shared dependencies together. In two weeks I’ll show you the draft slide and the goal.”',
          rubric: [
            'Acknowledges his wish for simplicity and the leads’ concern',
            'Holds to a shared goal and a light joint rhythm',
            'Proposes a concrete deliverable within two weeks',
          ],
        },
      },
      sayIt: 'Explain to a client operations director in 60 seconds why three green projects can still miss the goal.',
      terms: [
        { term: 'Programme', def: 'Several projects managed together because they deliver one shared outcome.' },
        { term: 'Portfolio', def: 'All the projects that compete for the same money and people, ranked and managed as one list.' },
        { term: 'Dependency', def: 'Something one project needs from another, by a date, or it slips.' },
        { term: 'Programme board', def: 'The group that decides on sequencing, shared people and scope between projects.' },
        { term: 'Watermelon reporting', def: 'Green on the outside, red inside: every project reports green while the shared goal is missed.' },
      ],
    },
    {
      id: 'pm.portfolio.prioritise',
      title: 'Prioritising the portfolio',
      pre: [
        {
          q: 'A plant has 12 improvement projects and capacity for about 6. Nobody says no. What usually happens?',
          options: ['The 6 best projects get done', 'All 12 move slowly and few finish', 'People work harder and finish 10', 'The sponsor quietly stops the weakest ones'],
          answer: 'All 12 move slowly and few finish',
          why: 'Without a hard line, everything starts and the scarce people are spread over all of it.',
        },
      ],
      teach: [
        'Score each project on four things: value (euros, or a KPI, a key performance indicator, moved per year), effort (days from the scarce people), risk (the chance it doesn’t deliver) and fit with strategy. Keep it rough; a 1–5 scale is fine.\n\nThe point is not precision but moving the conversation from “everything is important” to “this before that”. Experts argue about weighted scoring models: they look objective, but whoever sets the weights sets the outcome.',
        'The bottleneck is the resource that limits how much gets done: usually a few scarce experts, not money. So value per scarce day settles most debates. Project A: €300k a year for 120 days of the two process engineers, so €2.5k per day. Project B: €150k for 30 days, so €5k per day. B goes first, although A looks bigger.\n\nThen use the risk-adjusted value: €300k at 50% confidence counts as €150k.',
        'Capacity is the hard line. Count the scarce people, not the headcount. Two process engineers with 120 project days each give 240 days.\n\nRank the list and draw the capacity line where the running total reaches 240. Everything below the line waits. The typical failure: the line is drawn in January and quietly ignored by March, because every new request “only needs a few days”.',
        'Work in progress is everything started and not yet finished. Little’s law (1961), from queueing theory, the maths of queues: average lead time (start to finish) = work in progress ÷ throughput (projects finished per period). If a plant finishes three projects a quarter, twelve open projects take about four quarters each; six open projects take about two.\n\nIn practice it is worse, because switching and waiting also cut throughput. So twelve projects at half speed deliver less than six at full speed.',
        'Saying no at portfolio level is never a bare no. It is “not now, and here is what it would push out.”\n\n“We can start this. With the people we have, it means project B stops or slips three months. Which do you prefer?” The choice goes to the person who owns both. Keep a visible waiting list, so “not now” doesn’t become “never”. A sharp question for any new request: what do we stop to make room for this?',
      ],
      example: {
        kind: 'faded',
        text: 'Management team (MT) of a food producer. Two process engineers have 240 project days between them this year.\n\nOn the table: A, energy saving, €200k a year, 80 days. B, changeover reduction, €180k, 40 days. C, a new MES (manufacturing execution system: software that steers and records the production orders on the floor), €400k but only 50% confidence, 200 days.\n\nD, packaging waste, €90k, 30 days. E, the plant director’s dashboard, value not stated, 40 days. Everyone wants all five.',
        ask: 'What would you advise?',
        reveal: 'Value per engineer day: B €4.5k, D €3k, A €2.5k, C €1k after the 50% risk adjustment, E unknown. B, D and A together take 150 days: start those.\n\nC does not fit and is the most uncertain, so propose a 60-day first phase that tests the big assumption before committing 200 days. That makes 210 days and leaves 30 as a buffer.\n\nFor E, ask the plant director to put a number on it: “If it beats €2.5k per day, it goes ahead of A.” Then the MT chooses, not you.',
      },
      said: 'What you hear in projects: “Everything on this list is priority one.”',
      recall: [
        {
          q: 'A project is worth €120k a year and needs 40 days of your scarce engineers. What is its value per scarce day, in thousands of euros?',
          number: 3,
          tolerance: 0.1,
          unit: 'k€ per day',
          why: '€120k divided by 40 days is €3k per scarce day.',
        },
        {
          q: 'Why rank by value per scarce day rather than by total value?',
          options: ['It shows what each day of your bottleneck people buys', 'It favours the biggest projects', 'Finance requires it', 'It makes risk irrelevant'],
          answer: 'It shows what each day of your bottleneck people buys',
          why: 'The scarce people are the constraint, so their days are the currency.',
        },
        {
          q: 'The CEO wants a new project started now. How do you say no at portfolio level?',
          options: ['“No, we don’t have the capacity.”', '“We’ll try to squeeze it in.”', '“Yes, if the team works some weekends.”', '“We can start it; it means project B slips three months. Which do you prefer?”'],
          answer: '“We can start it; it means project B slips three months. Which do you prefer?”',
          why: 'It makes the trade-off visible and gives the choice to the person who owns both.',
        },
        {
          q: 'Why do twelve projects at half speed deliver less than six at full speed?',
          options: ['Budgets get split', 'Sponsors lose interest', 'Switching and waiting eat the time', 'They don’t; the output is the same'],
          answer: 'Switching and waiting eat the time',
          why: 'Each project waits for people who are busy elsewhere, so everything takes longer.',
        },
      ],
      situation: {
        scene: 'You’re in the management team (MT) meeting of a packaging plant. The portfolio is ranked and the line is drawn. The plant director says: “My project goes in this quarter. It’s strategic.” It sits below the line.',
        ask: 'What do you say?',
        model: '“It may well be. Then let’s make it visible. If it goes in now, the changeover project, worth about €4k per engineer day, slips to Q3. Can you put a number on yours, so the MT can compare?” If he still insists, the MT decides with both numbers on the table. I don’t argue strategy with him; I show what the choice costs.',
        rubric: [
          'Does not refuse, but names what would be displaced',
          'Asks for the value in comparable terms',
          'Leaves the decision with the people who own the portfolio',
        ],
        pushback: {
          lines: [
            '“Everyone knows this one matters. The scoring model doesn’t capture strategy.”',
            '“If my project has to wait a quarter, I’ll take it to the CEO. Is that what you want?”',
          ],
          model: '“It may well be strategic, and then it should score that way. Which criterion is it missing? If the MT wants it in this quarter, fine, but then one project above the line drops out. I’ll put that choice on Thursday’s agenda, so the MT decides it openly.”',
          rubric: [
            'Acknowledges that the project may matter',
            'Holds to the agreed ranking and the trade-off it implies',
            'Proposes an open decision at a concrete moment',
          ],
        },
      },
      sayIt: 'Explain to an MT in 60 seconds why they should start fewer projects to finish more.',
      terms: [
        { term: 'Bottleneck', def: 'The resource that limits how much gets done; in a portfolio, usually a few scarce experts.' },
        { term: 'Value per scarce day', def: 'Yearly value divided by the days of the bottleneck people a project needs.' },
        { term: 'Risk-adjusted value', def: 'Expected value times your confidence that it will actually be delivered.' },
        { term: 'Capacity line', def: 'The point in the ranked list where the scarce people’s days run out.' },
        { term: 'Work in progress', def: 'Everything started and not yet finished; more of it means longer lead times (Little’s law).' },
      ],
    },
    {
      id: 'pm.portfolio.governance',
      title: 'Governance that decides',
      pre: [
        {
          q: 'A steering group of ten, the managers who oversee the project, meets monthly. The discussions are good, but decisions keep ending with “let’s take it offline”, meaning later, outside the meeting. What is the most likely cause?',
          options: ['They meet too rarely', 'The status reports are too short', 'The meeting is at the wrong time of day', 'Nobody knows who has the right to decide what'],
          answer: 'Nobody knows who has the right to decide what',
          why: 'Groups talk instead of decide when decision rights were never made explicit.',
        },
      ],
      teach: [
        'Governance is the set of agreements on who decides what, made in advance. Write down decision rights for scope, budget, timeline and people.\n\nFor example: the project lead decides within 10% on budget and two weeks on timeline; the steering group decides beyond that; the board decides beyond 20% or on anything that touches strategy. One page, signed off by the sponsor. Those margins are tolerances; PRINCE2, a widely used project method, calls this management by exception.',
        'A steering group that decides has five to seven people, each able to commit their department.\n\nThe agenda lists decisions, not updates. Papers go out three days before. The minutes are a decision log: what was decided, by whom, by when.\n\nIf there is no decision on the agenda, cancel the meeting and send an e-mail. The failure you see most: a 15-slide status update, good discussion, and “let’s take it offline”, meaning nobody decides.',
        'Escalation means passing a problem up to the level that may decide on it. Escalation lines say in advance what goes up, how fast and to whom. A good rule: escalate when a tolerance is breached, or will be within two weeks, and bring options with a recommendation.\n\nEscalating is not failing; it is the system working. Escalating late is the failure.',
        'The people side: a member who never decides often lacks a mandate, the authority from his own boss to commit his department. Ask him privately: “When this comes up, can you decide for your department, or do you need to check first?” Then either help him get the mandate, or invite the person who has it.',
        'Experts argue about size and formality. Large groups feel inclusive but rarely decide. A RACI chart (who is Responsible, Accountable, Consulted and Informed) helps, but one that nobody reads changes nothing.\n\nWhat you see when governance works: short meetings, decisions in the first half hour, and project leads who know without asking what they may decide themselves. The sharp question to open any steering group: “Which decisions do we need from this group today?”',
      ],
      example: {
        kind: 'faded',
        text: 'A grid operator’s steering group has eleven members. For two months it has deferred three decisions: an 18% overrun on contractor costs, whether the second region is in scope this year, and who supplies the two planners.\n\nEach meeting has a 15-slide status update and ends with “let’s take it offline”. The sponsor asks Vantage what is going on.',
        ask: 'What would you do next?',
        reveal: 'Tell the sponsor plainly: “This group isn’t deciding because nobody knows who may decide what.” Propose a one-page decision-rights table with tolerances, and reduce the group to six voting members, with the others as advisers.\n\nRebuild the next agenda around the three decisions, each with options, costs and a recommendation, sent three days before. Pre-meet the two members who have blocked before and ask whether they have the mandate.\n\nStart the meeting with: “Today we need three decisions.” Log them, with owners and dates.',
      },
      said: 'What you hear in projects: “Good discussion. Let’s take this offline.”',
      recall: [
        {
          q: 'The project lead may decide within 10% on budget; beyond that, the steering group decides. A €400k project is now forecast at €450k. Who decides?',
          options: ['The project lead', 'The steering group', 'The board', 'Finance'],
          answer: 'The steering group',
          why: '€50k on €400k is 12.5%, beyond the lead’s 10% but within the steering group’s range.',
        },
        {
          q: 'What makes steering group minutes useful?',
          options: ['A decision log: what, who, by when', 'A full record of the discussion', 'The attendance list', 'All the slides attached'],
          answer: 'A decision log: what, who, by when',
          why: 'Decisions with owners and dates can be followed up; discussions cannot.',
        },
        {
          q: 'When should a project lead escalate?',
          options: ['Only after the tolerance is breached', 'Whenever the sponsor asks for news', 'When a tolerance is breached or will be within two weeks, with options', 'Only at the monthly meeting'],
          answer: 'When a tolerance is breached or will be within two weeks, with options',
          why: 'Early escalation with options leaves room to act; late escalation only reports damage.',
        },
        {
          q: 'One steering group member never commits to anything. What is the most likely reason?',
          options: ['He is not interested', 'The meeting is too long', 'He disagrees with the project', 'He lacks a mandate from his own boss'],
          answer: 'He lacks a mandate from his own boss',
          why: 'People who cannot commit their department avoid deciding; fix the mandate, not the person.',
        },
      ],
      situation: {
        scene: 'You’re at a manufacturer, preparing your first steering group as Vantage. The sponsor sends you last quarter’s agenda: ten update items, no decisions, nine attendees.',
        ask: 'What do you propose to the sponsor?',
        model: '“I’d like to turn this into a meeting that decides. Updates go out in writing three days before. The agenda only has the decisions we need, each with options and a recommendation. And can we agree on one page who decides what, so the small things don’t come here at all?” I’d also ask him which of the nine actually need to be there.',
        rubric: [
          'Replaces updates with decisions on the agenda',
          'Proposes explicit decision rights and tolerances',
          'Addresses who needs to be in the room',
        ],
        pushback: {
          lines: [
            '“People expect those updates. If I cut them, they’ll think the steering group doesn’t care.”',
            '“And nine people is the minimum. Everyone wants to be represented.”',
          ],
          model: '“I understand; those updates feel like attention. They can go in a short note before the meeting, which people read anyway. In the room: three decisions, five people who can make them. Let’s try it twice and then ask the group what they think.”',
          rubric: [
            'Acknowledges his concern about attention and representation',
            'Holds to a steering group built around decisions',
            'Proposes a short trial that gets reviewed',
          ],
        },
      },
      sayIt: 'Explain to a new sponsor in 60 seconds what makes a steering group decide instead of discuss.',
      terms: [
        { term: 'Governance', def: 'The agreements, made in advance, on who decides what and how problems go up.' },
        { term: 'Decision rights', def: 'An agreed list of who decides what, on scope, budget, timeline and people.' },
        { term: 'Tolerance', def: 'The margin within which someone may decide without escalating.' },
        { term: 'Decision log', def: 'A running record of decisions: what, who, by when.' },
        { term: 'Escalation', def: 'Passing a problem up to the level that may decide on it, ideally with options and a recommendation.' },
        { term: 'Mandate', def: 'The authority, given by your own boss, to commit your department in a decision.' },
      ],
    },
    {
      id: 'pm.portfolio.benefits',
      title: 'From output to benefit',
      pre: [
        {
          q: 'When are most project benefits lost?',
          options: ['During the design', 'In the year after the project closes', 'During the pilot', 'When the business case (costs and benefits on paper, written to get approval) is written'],
          answer: 'In the year after the project closes',
          why: 'The team leaves, attention moves, and the old way creeps back while nobody watches the number.',
        },
      ],
      teach: [
        'Output, outcome, benefit.\n\nOutput: what the project delivers, such as the readiness check going live. Outcome: the change in performance, such as cancellations dropping from 14% to 8%. Benefit: the measurable gain for the organisation, such as about 1,200 fewer wasted crew-days a year, worth €900k at €750 per crew-day.\n\nProjects deliver outputs; the line, the managers who run daily operations, owns outcomes and benefits.',
        'Name the benefit owner before the project starts: a manager whose budget or KPI (key performance indicator) carries it, not the project lead, who leaves.\n\nAgree the baseline, the starting value and exactly how it is measured, before you start. How do you count a cancellation? Over which period? Are storm weeks in or out? Write it down and get the controller, the finance person who owns the numbers, to agree. Without it, every result becomes an argument about definitions.',
        'Plan benefits tracking for 6–12 months after go-live, the day the change goes into use. The owner reviews the measure monthly; there is a check-in at 3 and 6 months; and there is a trigger: if the number slips past an agreed level two months in a row, the owner acts. Put this in the close-out plan, with names and dates, or it will not happen.',
        'Be honest about attribution: how much of a change you can credit to your project. If cancellations dropped while a new contractor also started, you can’t claim it all.\n\nSay “we estimate 60–70% comes from the readiness check”, and show why. The cleanest evidence is a comparison: a region without the check over the same months. A board trusts a modest number it can defend more than a big one it can’t.',
        'Why boards are sceptical: Bent Flyvbjerg’s studies of large projects found that benefits often fall short, sometimes far short. He links this to optimism bias, expecting things to go better than they do, and to strategic misrepresentation: business cases are written to get approval.\n\nWhat you see when benefits leak: the project closes, the team moves on, and the old way creeps back within months. The sharp question at every close-out: “Who looks at this number next month, and what do they do if it slips?”',
      ],
      example: {
        kind: 'faded',
        text: 'A changeover project at a manufacturer closed in March. Average changeover went from 90 to 45 minutes; the business case promised €300k a year.\n\nIn September the CFO (chief financial officer) asks where the €300k is. You find two things: changeovers have crept back to 70 minutes, and the capacity that was freed was never used, because sales did not add volume and the weekend shift kept running.',
        ask: 'What would you do next?',
        reveal: 'Separate the two problems. First, the outcome slipped: that is for the operations manager, who restores the standard with a short audit and a monthly review. Second, even at 45 minutes there was no benefit, because freed capacity is only money when someone turns it into money.\n\nPut the choice to the MT: cut the weekend shift, or sell more volume. Each has a number.\n\nThen name one benefit owner, agree the measure with the controller, and book the €300k only once that decision is made. Tell the CFO this directly; don’t defend the old business case.',
      },
      said: 'What you hear in projects: “The project is closed. So who is watching the number now?”',
      recall: [
        {
          q: 'Who should own the benefit of a project?',
          options: ['The project lead', 'The consultant', 'The line manager whose KPI or budget carries it', 'The finance department'],
          answer: 'The line manager whose KPI or budget carries it',
          why: 'The benefit happens in the line after the project ends, so the line must own it.',
        },
        {
          q: 'A project saves 1,200 crew-days a year at €750 per crew-day. What is the yearly benefit, in thousands of euros?',
          number: 900,
          tolerance: 1,
          unit: 'k€',
          why: '1,200 × €750 = €900,000.',
        },
        {
          q: '“The new planning tool is live.” What is this?',
          options: ['An outcome', 'A benefit', 'A baseline', 'An output'],
          answer: 'An output',
          why: 'It is something the project delivered; it says nothing yet about performance or money.',
        },
        {
          q: 'Cancellations fell while another change also happened. How do you report it?',
          options: ['Give an estimated share with the reasoning, for example 60–70%', 'Claim the whole drop', 'Claim nothing to be safe', 'Let finance decide what to say'],
          answer: 'Give an estimated share with the reasoning, for example 60–70%',
          why: 'A defended range is credible; a full claim gets picked apart.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator, two weeks before handing over a project that cut cancellations from 14% to 9%. The project lead says: “Great, we’re done.” Nobody has been named to watch the number after you leave.',
        ask: 'What do you put in place before you go?',
        model: 'I’d ask the regional manager to own the cancellation rate, agree with the controller how it’s measured, and put a monthly review in her MT agenda. We set a trigger, for example above 11% two months in a row means action, and I’d offer a free check-in at 3 and 6 months. Then the result survives my leaving.',
        rubric: [
          'Names a line owner for the benefit, not the project lead',
          'Agrees the measure and a monthly review',
          'Sets a trigger and a follow-up moment after close',
        ],
        pushback: {
          lines: [
            '“We hit 9%. The project is closed. Watching a number is line work, not a project.”',
            '“Nobody has time for another monthly report. If it goes up, we’ll notice.”',
          ],
          model: '“Agreed, the project is done, and it is line work now. That’s why I want a name on it: someone who looks at the cancellation figure once a month for five minutes. If it rises above 11%, they raise the alarm. Who in your team would fit?”',
          rubric: [
            'Acknowledges that the project itself is finished',
            'Holds to someone owning the benefit after handover',
            'Proposes a light, concrete check with a named owner',
          ],
        },
      },
      sayIt: 'Explain to a project lead in 60 seconds the difference between output, outcome and benefit, with one example.',
      terms: [
        { term: 'Output', def: 'What a project delivers, such as a tool going live; it says nothing yet about performance.' },
        { term: 'Outcome', def: 'The change in performance that the outputs are meant to cause.' },
        { term: 'Benefit', def: 'The measurable gain for the organisation, usually in money, that the outcome brings.' },
        { term: 'Benefit owner', def: 'The line manager accountable for realising the benefit after the project.' },
        { term: 'Baseline', def: 'The agreed starting value and the exact way it is measured.' },
        { term: 'Attribution', def: 'How much of a measured change you can credit to your project, and why.' },
      ],
    },
    {
      id: 'pm.portfolio.capacity',
      title: 'The same experts everywhere',
      pre: [
        {
          q: 'A key engineer is booked for a quarter of his time on each of four projects. What usually happens?',
          options: ['Each project waits for him, and he loses much of his week to switching', 'He delivers full value on all four', 'The projects finish faster because they run in parallel', 'Nothing, as long as he plans well'],
          answer: 'Each project waits for him, and he loses much of his week to switching',
          why: 'Spreading one expert thin turns him into the bottleneck of four projects at once.',
        },
      ],
      teach: [
        'At most clients the problem is not total hours but the same five people: the senior process engineer, the planner who knows the system, the one data analyst. Build a capacity matrix: names down, projects across, days per month in each cell, and their real available days at the bottom.\n\nOverbooked rows are your resource conflicts: more days promised to projects than the person has. Often you find two or three red rows, and they explain most of the delay.',
        'Real availability is lower than people think. Of about 260 weekdays a year, holidays, public holidays, sickness and training take roughly 50, and general meetings and admin about 20 more. About 190 real days remain.\n\nIf the day job takes 70%, there are 57 project days a year: about five a month. Booking that person “two days a week” on your project is planning fiction.',
        'Context switching is the time lost when someone jumps between projects and has to pick up the thread again. Gerald Weinberg’s rule of thumb (1992): with two projects you lose about 20% of your time to switching, with three about 40%, with five about 75%. It is an estimate, not a measurement, but people recognise it.\n\nAnd each project waits for that person, so lead times, the calendar time from start to finish, grow.',
        'Better: fewer projects in parallel, each with a real block of time, such as Tuesdays and Thursdays on project A.\n\nMake trade-offs visible, then let the owner decide. Show the matrix with the red cells and two options: “Option 1: Jan works on A and B, C starts in May. Option 2: a contractor does C, 40 days at €1,000, so €40k.”',
        'Don’t solve conflicts quietly by asking people to work evenings. It hides the real cost and burns out your best people.\n\nWhat you hear when it is going wrong: “basically committed”, “she’ll manage”, “just borrow him for a few days”. Experts differ on how full to plan: some book scarce people to 80% and keep 20% for surprises, others plan only a quarter ahead. The sharp question: “Whose days are we counting on, and has she seen this plan?”',
      ],
      example: {
        kind: 'faded',
        text: 'At a grid operator, the senior planner Fatima is named on four projects, including yours. Each project lead assumed one day a week from her. Her manager says she has about four project days a month next to her normal planning work.\n\nYour project’s pilot needs her for 8 days in March. Two other leads are planning on her in March as well.',
        ask: 'What would you do next?',
        reveal: 'Four projects at one day a week is four days a week, about 16 to 17 days a month; she has 4. Build the matrix for her and the two or three other scarce people, and take it to the person who owns all four projects, not to Fatima.\n\nBring options: “March goes to the pilot, the others move her work to April and May; or the regional office lends a second planner for 10 days; or the pilot moves a month.” Ask Fatima beforehand what she thinks is realistic; she knows. Then plan on the decision, not on hope.',
      },
      said: 'What you hear in projects: “Can’t we just borrow Fatima for a few days?”',
      recall: [
        {
          q: 'An expert has 190 available days a year and spends 70% on the day job. How many project days does he have per year?',
          number: 57,
          tolerance: 1,
          unit: 'days',
          why: '30% of 190 is 57 days, about five a month.',
        },
        {
          q: 'What do you put in a capacity matrix?',
          options: ['The total headcount of the department', 'The scarce people, their days per project and their real availability', 'The budget per project', 'Hours booked last year'],
          answer: 'The scarce people, their days per project and their real availability',
          why: 'Conflicts live in a few named people, not in the totals.',
        },
        {
          q: 'Which way of solving a resource conflict hides the real cost?',
          options: ['Showing the owner two options', 'Delaying one project’s start', 'Asking the expert to work evenings', 'Hiring a contractor'],
          answer: 'Asking the expert to work evenings',
          why: 'The cost becomes invisible and lands on your best people.',
        },
        {
          q: 'Why run fewer projects in parallel with the same experts?',
          options: ['It looks better on the portfolio report', 'Managers prefer it', 'It reduces the number of meetings only', 'Less switching and waiting, so each project finishes sooner'],
          answer: 'Less switching and waiting, so each project finishes sooner',
          why: 'Focused blocks of time cut lead times for every project.',
        },
      ],
      situation: {
        scene: 'You’re at a food producer. Three project leads each tell you the same data analyst is “basically committed” to them for June. The analyst says nothing in meetings.',
        ask: 'What do you do?',
        model: 'I’d first ask the analyst privately how many days she really has in June and what she’s been promised. Then I’d put it in a simple matrix and take it to the operations manager who owns the projects: “She has 8 days, we’ve asked for 25. Here are two options.” The decision goes to him, and I tell the three leads beforehand that it’s coming.',
        rubric: [
          'Checks the expert’s real availability with her directly',
          'Makes the overbooking visible in numbers',
          'Brings options to the owner instead of negotiating in the corridor',
        ],
        pushback: {
          lines: [
            '“She told me June was fine. My project was first, so she’s mine.”',
            '“Why make this a big thing? She’ll manage; she always does.”',
          ],
          model: '“I believe she said that, and she probably said it to all three of you. Three times ‘basically committed’ adds up to more than one person. I’d like to sit down with the three leads and her this week and divide June by the day. Then everyone knows what they get.”',
          rubric: [
            'Acknowledges his claim without dismissing it',
            'Names the overload plainly',
            'Proposes a concrete joint split, with the analyst present',
          ],
        },
      },
      sayIt: 'Explain to a project lead in 60 seconds why “two days a week of Fatima” is probably not real.',
      terms: [
        { term: 'Capacity matrix', def: 'Names down, projects across, days per cell, with real availability at the bottom.' },
        { term: 'Resource conflict', def: 'More days promised to projects than a person actually has.' },
        { term: 'Real availability', def: 'Days left for projects after holidays, sickness, training, meetings and the day job.' },
        { term: 'Context switching', def: 'Time lost when someone jumps between projects and has to pick up the thread again.' },
        { term: 'Lead time', def: 'The calendar time from start to finish, including all the waiting.' },
      ],
    },
    {
      id: 'pm.portfolio.boardroom',
      title: 'In front of the board',
      pre: [
        {
          q: 'You have 20 minutes on the management team (MT) agenda. When do you say which decision you need?',
          options: ['At the end, after the evidence', 'Only if they ask', 'In the first minute', 'In an e-mail afterwards'],
          answer: 'In the first minute',
          why: 'Boards listen differently once they know what they are being asked to decide.',
        },
      ],
      teach: [
        'One page, answer first: the top line is the decision you need. This is the pyramid principle, which Barbara Minto developed at McKinsey: the conclusion first, then the arguments, then the evidence.\n\nA board paper then gives: why now, two or three options with cost, benefit and risk each, your recommendation, and what happens if they don’t decide. Detail goes in an appendix. A board reads the first paragraph and the numbers; write for that.',
        'Twenty minutes on the agenda means about five minutes of talking and fifteen of discussion. Open with: “I need one decision today: X. I recommend Y, for three reasons.” Don’t walk through twenty slides; they will interrupt you at slide three anyway.\n\nThe typical failure: the background takes ten minutes, the ask comes in minute eighteen, and the chair says “let’s come back to this next month.”',
        'Pre-wiring: the week before, walk the paper through one-on-one with the two or three people whose view carries weight. Nothing in the meeting should surprise them.\n\nMany board decisions are in effect made before the meeting; the meeting confirms them. If someone will oppose, you want to know now, not in the room. Experts disagree on where pre-wiring ends and backroom politics starts; a test: would you be comfortable if the whole board knew whom you met?',
        'The tough question. Let it finish, repeat the core, answer in one sentence, then give the evidence.\n\nIf you don’t know: “I don’t have that number here; you’ll have it by Thursday.” Never argue with the chair in the room.\n\nWhat you hear when a board member is unconvinced: questions about details on page 6, or “interesting, but…”. Thank them and ask: “What would you need to see to support this?”',
        'Often a question hides an objection. “Is this really the priority?” usually means “Is this better than what I care about?”: a hidden objection. Name it: “You’re asking whether this beats the ERP upgrade, the new company-wide system for orders, stock and finance. Here’s the comparison.”\n\nPrepare for it: list the projects competing for the same money, with one line on each. The sharp question before any board slot: what is the one decision I need, and who could block it?',
      ],
      example: {
        kind: 'faded',
        text: 'Vantage has run a pilot in one region of a grid operator: cancellations from 14% to 9%. You will ask the board for €1.2M to roll it out to four regions over 18 months.\n\nYou have 20 minutes next Tuesday. The CFO (chief financial officer) is known for taking proposals apart, and last month she pushed back on another programme because “benefits are always overstated”.',
        ask: 'How would you prepare and open?',
        reveal: 'Write one page: the decision (€1.2M for four regions), the pilot result with the baseline the controller agreed, the expected benefit as a range with your attribution, and two options: full roll-out, or two regions first for €650k with a go or no-go decision, continue or stop, after 9 months.\n\nMeet the CFO beforehand: “I know you’ve seen benefits overstated. Here is how we measured, and here is the conservative case.” Ask what would convince her.\n\nIn the room, open with the decision and the recommendation, and use the pilot numbers as evidence, not as a story.',
      },
      said: 'What you hear in projects: “What exactly are you asking us to decide?”',
      recall: [
        {
          q: 'What goes at the top of a board paper?',
          options: ['The background of the project', 'The decision you need', 'Your method', 'The team involved'],
          answer: 'The decision you need',
          why: 'Readers stop after the first paragraph; it must contain the ask.',
        },
        {
          q: 'You have a 20-minute slot. About how many minutes should you talk before the discussion starts?',
          number: 5,
          tolerance: 2,
          unit: 'minutes',
          why: 'Roughly a quarter talking and the rest discussion, because the board decides in the discussion.',
        },
        {
          q: 'Why pre-wire a board paper with key members?',
          options: ['To avoid presenting at all', 'Because it is required by law', 'To make the paper shorter', 'Most decisions are made before the meeting, and nobody should be surprised'],
          answer: 'Most decisions are made before the meeting, and nobody should be surprised',
          why: 'Surprised board members defend themselves; prepared ones decide.',
        },
        {
          q: 'A board member asks: “Is this really the priority right now?” What is the best response?',
          options: ['Name the hidden comparison and show it: “You’re asking whether this beats X. Here’s how they compare.”', 'Repeat the benefits of your project', 'Say that the sponsor already agreed', 'Promise to come back next quarter'],
          answer: 'Name the hidden comparison and show it: “You’re asking whether this beats X. Here’s how they compare.”',
          why: 'It answers the real objection instead of the words.',
        },
      ],
      situation: {
        scene: 'You’re presenting to the MT of a manufacturer. Two minutes in, the CEO interrupts: “I’ve read the paper. Why should we spend €300k on this when margins are under pressure?”',
        ask: 'What do you say?',
        model: '“Fair question. Short answer: it pays back in about 10 months, through the €360k a year in lower scrap the pilot showed. If margins are the worry, the smaller option is to start on line 1 for €120k and decide on the rest in Q3.” Then I stop and let him respond, instead of going back to my slides.',
        rubric: [
          'Answers in one or two sentences before giving detail',
          'Uses numbers and offers a smaller option',
          'Stops talking and lets the board discuss',
        ],
        pushback: {
          lines: [
            '“That’s the slide I already read. I asked why now, with margins under pressure.”',
            '“Every consultant promises payback. What if it doesn’t come?”',
          ],
          model: '“Precisely because margins are under pressure: the losses we measured come straight off the margin. We phase it: first one line, with a go or no-go after three months on measured results. If it doesn’t pay back there, you stop.”',
          rubric: [
            'Acknowledges the pressure on margins',
            'Answers the why-now question directly',
            'Proposes a phased step with a clear stop point',
          ],
        },
      },
      sayIt: 'Explain to a project lead in 60 seconds how to get a decision from an MT in a 20-minute slot.',
      terms: [
        { term: 'Answer first', def: 'Put the decision and recommendation at the top, the evidence after it.' },
        { term: 'Pyramid principle', def: 'Barbara Minto’s structure: conclusion first, then the supporting arguments, then the evidence.' },
        { term: 'Board paper', def: 'The one-page document a board reads before it decides: the ask, options, recommendation.' },
        { term: 'Pre-wiring', def: 'Taking key people through a proposal one-on-one before the meeting.' },
        { term: 'Hidden objection', def: 'The real concern behind a question, often a comparison with something else.' },
      ],
    },
  ],
};
