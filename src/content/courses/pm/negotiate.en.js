// pm.negotiate (EN): Negotiating and holding your ground: interests, alternatives, first numbers, scope with a client, saying no, and disagreeing with someone more senior.
export default {
  lessons: [
    {
      id: 'pm.negotiate.interests',
      title: 'Positions and interests',
      pre: [
        {
          q: 'Two team leads both claim the only free meeting room on Thursday afternoon. What should you ask first?',
          options: ['Who booked it first?', 'What does each of them need the room for?', 'Which of them is more senior?', 'Would they flip a coin?'],
          answer: 'What does each of them need the room for?',
          why: 'Their needs may fit together: one may need a screen, the other only quiet. You only find that out by asking why.',
        },
      ],
      teach: [
        'A position is what someone says they want: “We need the report by Friday”, “The price must drop 10%”. An interest is why they want it: a board meeting on Monday, a budget cut they have to show. Fisher and Ury, in Getting to Yes (1981): bargaining over positions makes people dig in; looking at interests opens up options.',
        'Ask why, and why not. “What would that give you?” “What happens if it isn’t Friday?” “What worries you about this?”\n\nListen for needs such as security, recognition, control, money and time. Most interests can be met in more than one way. Write theirs down next to yours.',
        'Shared and different interests both help. Shared: you both want the project to succeed. Different: one side cares most about timing, the other about cost.\n\nDifferences make trades possible: give what is cheap for you and valuable for them.',
        'Use fair standards instead of willpower: market rates, past data, an agreed norm. “What would be fair here, and how could we check it?” That moves the talk from who is stronger to what is reasonable, and it lets both sides say yes without losing face.',
      ],
      example: {
        kind: 'faded',
        text: 'At a grid operator you want every job checked for readiness two days before it starts. The head of execution says: “Your readiness check adds a day to every job. My crews won’t do it.”',
        ask: 'What would you do next?',
        reveal: 'His position is “no extra day”. Ask for the interest: “What would that day cost you?” Say it turns out he worries that crews sit idle and planners then blame them.\n\nYour interest is fewer wasted crew trips. An option that serves both: the planners do the check, and crews only get jobs that pass it. Propose a four-week pilot in one region and agree on a fair standard to judge it: the number of wasted trips before and after.',
      },
      said: 'What you hear in projects: “Help me understand what’s behind that. What would Friday give you?”',
      recall: [
        {
          q: 'Which of these is an interest rather than a position?',
          options: ['“The price must drop 10%”', '“We need the report by Friday”', 'Having a saving to show the board before the budget round', '“We won’t accept a second phase”'],
          answer: 'Having a saving to show the board before the budget round',
          why: 'It is the reason behind a demand. The other three are demands, which can only be accepted or refused.',
        },
        {
          q: 'Which question is most likely to uncover an interest?',
          options: ['“Is that your final offer?”', '“What would that give you?”', '“Can you go any lower?”', '“Do you agree?”'],
          answer: '“What would that give you?”',
          why: 'It asks for the reason behind the demand. The others only test the position.',
        },
        {
          q: 'Why are differences in interests useful in a negotiation?',
          options: ['They show who is right', 'They make trades possible: give what is cheap for you and valuable for them', 'They let you delay the decision', 'They prove the other side is unreasonable'],
          answer: 'They make trades possible: give what is cheap for you and valuable for them',
          why: 'If both sides value the same things equally, every gain is the other’s loss. Differences create room for deals.',
        },
        {
          q: 'A client and you disagree on how many days a site analysis should take. Which is a fair standard to settle it?',
          options: ['Whoever has the higher position decides', 'Splitting the difference', 'The actual days spent on three similar analyses last year', 'The number the client mentioned first'],
          answer: 'The actual days spent on three similar analyses last year',
          why: 'Past data is a standard both sides can check, independent of who pushes hardest.',
        },
      ],
      situation: {
        scene: 'At a parts manufacturer, the production manager refuses to release two operators for your improvement workshop next week: “Not a chance. We’re behind on the big truck order.”',
        ask: 'How do you respond?',
        model: 'I’d take the order seriously and ask about it: “How far behind are you, and what’s blocking it?” His interest is delivering on time; mine is input from the people who know the line. Options: run the workshop in two shorter sessions after the order ships, or pick operators from the shift that isn’t on that order. I’d ask which works better for him.',
        rubric: [
          'Asks about the interest behind his refusal',
          'Names both interests',
          'Offers options that serve both, and lets him choose',
        ],
        pushback: {
          lines: [
            'I don’t need options. I need everyone on the line until this order is out. Full stop.',
            'Every consultant says their workshop is important. Why would yours come before a customer?',
          ],
          model: 'Fair, the customer comes first, and I don’t want to put that order at risk. I still need two people who know the line, or the workshop gives you advice that doesn’t fit. When do you expect the order to ship? I’ll plan the workshop for the first two days after that and keep it to two hours.',
          rubric: [
            'Acknowledges the order comes first',
            'Restates why operators are needed for a useful result',
            'Proposes a concrete time after the order, kept short',
          ],
        },
      },
      sayIt: 'Explain to a colleague in 60 seconds the difference between a position and an interest, with an example from a client.',
      terms: [
        { term: 'Position', def: 'What someone says they want; a demand that can only be accepted or refused.' },
        { term: 'Interest', def: 'Why someone wants it: the need behind the position.' },
        { term: 'Fair standard', def: 'A yardstick both sides can check, such as market rates or past data.' },
      ],
    },
    {
      id: 'pm.negotiate.batna',
      title: 'Your alternative and theirs',
      pre: [
        {
          q: 'What is your BATNA in a negotiation?',
          options: ['Your opening offer', 'What you will actually do if this negotiation ends without agreement', 'The lowest price you will accept', 'The other side’s budget'],
          answer: 'What you will actually do if this negotiation ends without agreement',
          why: 'Best Alternative To a Negotiated Agreement. It sets how strong you are, because it decides when walking away is better.',
        },
      ],
      teach: [
        'BATNA stands for Best Alternative To a Negotiated Agreement (Fisher and Ury). It is what you will actually do if you walk away. Your BATNA, not your wishes, sets your strength.\n\nWith a good alternative you can say no calmly. With a bad one, improve it before you negotiate.',
        'Your walk-away point is the worst deal you will still accept, and it follows from your BATNA.\n\nSay a client offers €950 a day, and you have a firm offer for the same days elsewhere at €1,000 a day. If nothing else differs, accepting less than €1,000 leaves you worse off. Decide this before the meeting, not during it.',
        'Estimate theirs too. What happens to them without a deal: another supplier, doing it themselves, waiting?\n\nThe range between your walk-away point and theirs is the ZOPA, the zone of possible agreement. If there is none, no clever wording will create a deal; change what is on the table instead.',
        'Don’t bluff with an alternative you don’t have. Mention a real one calmly, as information, not as a threat: “If we can’t make this work, we’ll do it next year instead.” And keep improving your BATNA in the background: a second real option is the strongest tool you have.',
      ],
      example: {
        kind: 'faded',
        text: 'A parts manufacturer buys coated brackets from one supplier, who announces a price rise of 12%. A second supplier has quoted 4% above today’s price, but needs 10 weeks to qualify the parts. Coating in-house is not possible.',
        ask: 'What would you do next?',
        reveal: 'Your BATNA is switching to the second supplier after 10 weeks of qualification. Theirs is losing your volume.\n\nStart the qualification now: it improves your alternative whatever happens. Then negotiate: ask what drives the 12% (energy, raw material?) and propose, say, 4% now with a clause that follows the energy index. Your walk-away point is near the second supplier’s 4% plus the cost of qualifying.',
      },
      said: 'What you hear in projects: “Before we go in: what do we do if they say no?”',
      recall: [
        {
          q: 'What is the ZOPA?',
          options: ['Your opening offer minus your walk-away point', 'The range where a deal is possible: between your walk-away point and theirs', 'The average of both opening offers', 'The time left before the deadline'],
          answer: 'The range where a deal is possible: between your walk-away point and theirs',
          why: 'Any deal inside it is better for both sides than walking away. Outside it, one side is better off without a deal.',
        },
        {
          q: 'You are a freelance consultant. The lowest day rate you will accept is €900. The highest day rate the client will pay, which you don’t know, is €1,050. How wide is the zone of possible agreement, in euros per day?',
          number: 150,
          tolerance: 0.5,
          unit: '€ per day',
          why: 'Any rate between €900 and €1,050 works for both: €1,050 − €900 = €150 per day.',
        },
        {
          q: 'You have a firm offer to work the same days for another client at €1,000 a day. Client A offers €950 a day. Assume the two jobs are equal in every other way: travel, interest, relationship. What should you do?',
          options: ['Accept: a deal is better than no deal', 'Turn it down or negotiate up: it is below your alternative', 'Accept and ask for more later', 'Split the difference at €975'],
          answer: 'Turn it down or negotiate up: it is below your alternative',
          why: 'With everything else equal, €950 leaves you worse off than your €1,000 alternative. Your BATNA sets your walk-away point.',
        },
        {
          q: 'Your alternative is weak. What is the best thing to do before the negotiation?',
          options: ['Hide it and act confident', 'Bluff about a better offer', 'Improve it, for example by getting a second real option', 'Accept the first offer to avoid risk'],
          answer: 'Improve it, for example by getting a second real option',
          why: 'Your strength comes from what you can actually do without a deal. A bluff can be called; a real option can’t.',
        },
      ],
      situation: {
        scene: 'Your engagement manager tells you the client wants a 15% fee cut on the next phase, “or they’ll go elsewhere”. You know the client’s team depends on your data model, and another firm would need about three months to rebuild it.',
        ask: 'What do you advise your engagement manager?',
        model: 'I’d say their alternative is weaker than it sounds: switching costs them about three months. So we don’t need to accept 15% straight away. I’d ask what’s behind the request, maybe a budget cap, and offer a trade: a lower fee for a smaller scope, or the same fee with a handover of the model so they depend on us less. And we should agree our own walk-away point before the call.',
        rubric: [
          'Estimates the client’s alternative realistically',
          'Asks for the interest behind the demand',
          'Proposes a trade and a walk-away point decided in advance',
        ],
        pushback: {
          lines: [
            'You’re junior, you don’t see how fast clients walk. I’d rather give a bit than lose the account.',
            'And talking about their switching cost sounds like we’re holding them hostage.',
          ],
          model: 'You know this client far better than I do, and I don’t want to risk the account either. I’m not saying we refuse; I’m saying 15% for the same work isn’t our only move. We never mention switching costs to them. We ask what the budget is and offer a smaller scope. Can we agree our lowest number before Thursday’s call?',
          rubric: [
            'Acknowledges the risk of losing the account and his experience',
            'Restates that a straight cut is not the only option',
            'Proposes agreeing the walk-away point before the call',
          ],
        },
      },
      sayIt: 'Explain BATNA to a colleague in 60 seconds, and why you should know yours before a negotiation starts.',
      terms: [
        { term: 'BATNA', def: 'Best Alternative To a Negotiated Agreement: what you will actually do without a deal.' },
        { term: 'Walk-away point', def: 'The worst deal you will still accept; it follows from your BATNA.' },
        { term: 'ZOPA', def: 'Zone of possible agreement: the range between both sides’ walk-away points.' },
      ],
    },
    {
      id: 'pm.negotiate.anchor',
      title: 'First numbers and framing',
      pre: [
        {
          q: 'In negotiation research, which side tends to end up with the better outcome?',
          options: ['The side that waits for the other to name a number', 'The side that makes a well-founded first offer', 'The side that talks the most', 'Neither: first offers make no difference'],
          answer: 'The side that makes a well-founded first offer',
          why: 'First offers act as an anchor and strongly predict the final deal, as Galinsky and Mussweiler showed in 2001.',
        },
      ],
      teach: [
        'Anchoring (Tversky and Kahneman, 1974): the first number in the room pulls everyone’s estimates towards it, even when they know it is arbitrary. In negotiations, first offers strongly predict the final deal (Galinsky and Mussweiler, 2001). So if you know the market well, it usually pays to put the first number on the table.',
        'A good anchor is ambitious and defensible: you can explain where it comes from. An extreme number you can’t justify costs you credibility and can end the talk. Give the reason with the number: “Similar diagnostics took 18 to 22 days, so we propose 20.”',
        'When they anchor first, don’t argue about their number: that keeps it at the centre. Ask how they arrived at it, explain your basis and put your own number on the table. Don’t make a counteroffer close to a number you think is unreasonable; that accepts their anchor.',
        'Framing: the same fact lands differently. “95% of jobs on time” or “1 in 20 jobs late”. “€31,200” or “€600 a week for a year”.\n\nPeople weigh losses more heavily than equal gains (Kahneman and Tversky), so “without this you keep losing 300 crew hours a month” often lands harder than “this saves 300 hours”. Frame honestly, in terms the other side cares about.',
      ],
      example: {
        kind: 'faded',
        text: 'A client asks how many days you need for a planning diagnostic at three regional offices. Your last three similar diagnostics took 18, 22 and 20 days. On the phone, someone from purchasing mentioned “about 10 days”.',
        ask: 'What would you do next?',
        reveal: 'Put your own number on the table, with its basis: “Our last three diagnostics like this took 18 to 22 days, so we propose 20.” Don’t start from their 10, and don’t meet in the middle at 15 without a reason.\n\nIf they push back, trade scope instead of days: “With 12 days we can do one region thoroughly instead of three.” Then the client chooses what they get for the money.',
      },
      said: 'What you hear in projects: “Where does that number come from? Ours is based on the last three jobs.”',
      recall: [
        {
          q: 'What is anchoring?',
          options: ['Refusing to move from your first offer', 'The first number mentioned pulls later estimates towards it', 'Agreeing on a fixed price in the contract', 'Linking a price to an index'],
          answer: 'The first number mentioned pulls later estimates towards it',
          why: 'Even an arbitrary first number shifts what people see as reasonable.',
        },
        {
          q: 'What makes a good first offer?',
          options: ['As extreme as possible', 'Ambitious and backed by a reason you can explain', 'Exactly what you expect to end up at', 'Just below the other side’s budget'],
          answer: 'Ambitious and backed by a reason you can explain',
          why: 'Ambition leaves room; the reason keeps your credibility. An extreme offer without a basis can end the talk.',
        },
        {
          q: 'The other side opens with a number you think is unreasonable. What should you do?',
          options: ['Counter with a number just above theirs', 'Argue point by point why their number is wrong', 'Ask how they got to it, explain your basis and put your own number forward', 'Split the difference right away'],
          answer: 'Ask how they got to it, explain your basis and put your own number forward',
          why: 'Countering close to their number or arguing about it keeps their anchor at the centre.',
        },
        {
          q: 'A 52-week support contract costs €31,200 in total. You want to frame it per week. How much is that, in euros per week?',
          number: 600,
          tolerance: 0.5,
          unit: '€ per week',
          why: '€31,200 / 52 weeks = €600 per week.',
        },
      ],
      situation: {
        scene: 'At a grid operator you propose a 6-week pilot of a readiness check. The sponsor likes it but says: “Purchasing will never approve 30 days of consulting. Can you do it in 10?” You estimate that 30 days is needed for three regions.',
        ask: 'How do you respond?',
        model: 'I wouldn’t argue with the 10 or meet at 20 without reason. I’d explain the 30: “That’s three regions, 10 days each, based on the pilot we did in the north.” Then offer a trade: “With 10 days we can do one region well. If it works, the other two follow with the results in hand.” So the client chooses scope, not a cheaper version of everything.',
        rubric: [
          'Doesn’t negotiate inside the sponsor’s number',
          'Explains the basis of the estimate',
          'Offers a scope trade instead of a discount',
        ],
        pushback: {
          lines: [
            'One region won’t convince the board. I need all three, and I need it cheap.',
            'Other firms would do this for 10 days. Why are you so expensive?',
          ],
          model: 'I understand you need all three for the board. Three regions in 10 days means corners we’d both regret, because the check only works if the crews help shape it. What I can do: one region in 10 days, with results the board can see, and the other two as a fixed follow-up. If another firm promises all three in 10, I’d ask them how.',
          rubric: [
            'Acknowledges the board needs and the budget pressure',
            'Restates why the scope can’t shrink without losing quality',
            'Proposes a phased option with a fixed follow-up',
          ],
        },
      },
      sayIt: 'Explain anchoring to a colleague in 60 seconds, and what to do when the client names a number first.',
      terms: [
        { term: 'Anchor', def: 'The first number in a negotiation, which pulls the outcome towards it.' },
        { term: 'Framing', def: 'Presenting the same fact in a way that fits what the other side cares about.' },
        { term: 'Loss aversion', def: 'People weigh a loss more heavily than a gain of the same size.' },
      ],
    },
    {
      id: 'pm.negotiate.scope',
      title: 'Negotiating scope and time with a client',
      pre: [
        {
          q: 'Halfway through a fixed-price project, the client asks for “one extra analysis”. What is the best first response?',
          options: ['Yes, to keep him happy', 'No, it isn’t in the contract', 'Ask what decision the analysis is for, then show what it costs in time or what it would replace', 'Do it quietly in the weekend'],
          answer: 'Ask what decision the analysis is for, then show what it costs in time or what it would replace',
          why: 'Often a lighter version answers the real question. And making the trade visible lets the client decide.',
        },
      ],
      teach: [
        'Scope, time and cost hang together. If one moves, something else has to.\n\nA client asking for more, in the same time, for the same budget, is asking you to cut quality without saying so. Your job is not to refuse but to make the trade visible.',
        'Small yeses add up. Five “quick” extras of a day each are a full week on a 20-day project.\n\nKeep a simple change log: what was asked, when, how much effort, what was decided. It makes the conversation about facts instead of about who is being difficult.',
        'Offer options, not a wall: “We can add it and move the final report two weeks, or add it and drop the second region, or do it as a follow-up for four extra days.” Let the client choose: it’s their priority. And always ask what decision the request serves; a lighter version is often enough.',
        'Confirm in writing, briefly: an email after the conversation with what changes. And check with your own manager before you commit extra days. You may not be allowed to give them away, and your firm carries the cost.',
      ],
      example: {
        kind: 'faded',
        text: 'A fixed-price project at a grid operator: 20 days, three regions. In week 3, the sponsor asks to add a fourth region, “since you’re in the data anyway”. You estimate it at 4 extra days.',
        ask: 'What would you do next?',
        reveal: 'First ask what the fourth region is for: is there a board question behind it? Then lay out options: add the region for 4 extra days at the agreed day rate; swap it for region 3; or a light version, one key number for region 4, in 1 day.\n\nCheck with your engagement manager before you name a price for the extra days. After the conversation, confirm the choice by email and add it to the change log.',
      },
      said: 'What you hear in projects: “Happy to add it. Which would you like to move: the date, the scope, or the budget?”',
      recall: [
        {
          q: 'A fixed-price project was planned at 20 days of effort. The client added 5 extra requests of 1 day each, and you did them without changing the price or the plan. By what percentage did the effort grow compared with the plan?',
          number: 25,
          tolerance: 0.5,
          unit: '%',
          why: '5 extra days on 20 planned days: 5 / 20 = 25% more effort for the same price.',
        },
        {
          q: 'Why keep a change log during a project?',
          options: ['To bill the client for everything', 'To make the conversation about facts: what was asked, the effort and what was decided', 'Because auditors require it', 'To prove the client is difficult'],
          answer: 'To make the conversation about facts: what was asked, the effort and what was decided',
          why: 'A log shows how small requests add up, without it turning personal.',
        },
        {
          q: 'A client asks for extra work in the same time and budget. What is the best response?',
          options: ['Refuse: it isn’t in the contract', 'Say yes and work evenings', 'Offer options: more time, less of something else, or a paid follow-up, and let the client choose', 'Ask your manager to say no for you'],
          answer: 'Offer options: more time, less of something else, or a paid follow-up, and let the client choose',
          why: 'It keeps the relationship and makes the trade visible. The client owns the priority.',
        },
        {
          q: 'What should you do before agreeing to extra days with a client?',
          options: ['Check with your own manager', 'Ask the client to put it in writing first', 'Nothing: a client request is always fine', 'Start the work to show goodwill'],
          answer: 'Check with your own manager',
          why: 'Extra days cost your firm money or time, and the decision to give them may not be yours to make.',
        },
      ],
      situation: {
        scene: 'Two weeks before the end of a fixed-price project at a parts manufacturer, the plant manager asks you to “also quickly do the same analysis for the paint shop”. You estimate it at 6 days. Your plan has no slack left.',
        ask: 'What do you say to him?',
        model: 'I’d say I’m glad he sees value in it, and ask what he wants to decide for the paint shop. Then: “That’s about six days. We can add it and move the final report three weeks, or do it as a short follow-up after this project. Within the current plan it would cost the quality of what you’ve asked for.” I’d check with my manager on the follow-up price and confirm by email.',
        rubric: [
          'Asks what decision the extra analysis serves',
          'Makes the trade in time or scope visible',
          'Offers options and confirms in writing',
        ],
        pushback: {
          lines: [
            'Come on, you already know how to do it. It’s just the same analysis on different data.',
            'If you can’t be a bit flexible, I’ll remember that when we talk about the next project.',
          ],
          model: 'You’re right that the method is the same, and that saves time. The data cleaning and the conversations with the paint shop team still take about six days. I want to be flexible, which is why I’m offering options rather than a no. Shall I send you a one-page proposal tomorrow for a short follow-up, so you can decide this week?',
          rubric: [
            'Acknowledges the method can be reused',
            'Restates what the extra work really takes',
            'Proposes a concrete follow-up he can decide on this week',
          ],
        },
      },
      sayIt: 'Explain in 60 seconds how you handle a client who keeps asking for “one more thing” on a fixed-price project.',
      terms: [
        { term: 'Scope creep', def: 'Work that grows bit by bit beyond what was agreed, without changes to time or budget.' },
        { term: 'Change log', def: 'A list of requested changes with effort and the decision taken.' },
        { term: 'Fixed price', def: 'An agreed price for a defined scope; extra work needs a new agreement.' },
      ],
    },
    {
      id: 'pm.negotiate.no',
      title: 'Saying no and offering a trade',
      pre: [
        {
          q: 'Which reply is the clearest “no” that still protects the relationship?',
          options: ['“I’ll see what I can do.”', '“No, that’s impossible.”', '“I can’t take this on this week, because the steering report is due Friday. I can do it Monday, or now if the report moves to Tuesday.”', '“Maybe, let me check.”'],
          answer: '“I can’t take this on this week, because the steering report is due Friday. I can do it Monday, or now if the report moves to Tuesday.”',
          why: 'It is clear, gives one real reason and offers options. The vague answers are heard as yes; the flat no offers nothing.',
        },
      ],
      teach: [
        'Saying yes to everything makes your yes worth less and your work late. William Ury’s “positive no” (2007) has three parts: Yes, No, Yes.\n\nFirst the yes to what you are protecting, such as a promise to a client or the quality of the work. Then a clear no. Then a yes to something else: an option, a trade, a later time.',
        'Be clear, short and calm. A no hidden in “I’ll try” is heard as yes, and then you disappoint later.\n\nGive one real reason, not five excuses: more reasons give more to argue with. Then stop talking.',
        'Offer a trade. “If I do this, what can drop?” “I can do it if Jan takes over the data pull.”\n\nA trade shows you take the request seriously, and it puts the choice with the person who sets the priorities.',
        'Some things are not for trading: safety, integrity, rules you are bound by. Say so plainly: “That I can’t do. Here’s what I can do.” And prepare your no before a tense meeting; it is much easier to say when you have said it once in your head.',
      ],
      example: {
        kind: 'faded',
        text: 'Thursday, 16:00. Your engagement manager asks you to rework the steering committee deck tonight, for 08:00 tomorrow.\n\nYou have promised the client’s planning lead an analysis by Friday noon, which he needs for a capacity decision. You can’t do both well tonight.',
        ask: 'What would you do next?',
        reveal: 'Yes to the shared goal: “I want the steering deck to be strong too.” A clear no: “I can’t do both properly tonight.”\n\nThen a yes with options: “I can fix the three key slides tonight and keep the planning analysis on time. Or, if the deck has priority, I’ll tell the planning lead today that his analysis moves to Monday. Which do you prefer?” The person who sets the priorities makes the choice, with the cost visible.',
      },
      said: 'What you hear in projects: “I can do that, but then something else has to move. Which one?”',
      recall: [
        {
          q: 'What is the order of William Ury’s positive no?',
          options: ['No, Yes, No', 'Yes, No, Yes', 'No, then an apology', 'Yes, then later no'],
          answer: 'Yes, No, Yes',
          why: 'A yes to what you protect, a clear no, then a yes to an alternative.',
        },
        {
          q: 'Why give one real reason for a no instead of several?',
          options: ['Several reasons take too long', 'More reasons give the other person more to argue with', 'One reason sounds more senior', 'It doesn’t matter how many'],
          answer: 'More reasons give the other person more to argue with',
          why: 'Each extra reason is a new point to contest, and weak ones undermine the strong one.',
        },
        {
          q: 'What does offering a trade, such as “If I do this, what can drop?”, achieve?',
          options: ['It shows you take the request seriously and puts the priority choice with the person who sets priorities', 'It gets you out of the work', 'It shows you are too busy', 'It delays the decision'],
          answer: 'It shows you take the request seriously and puts the priority choice with the person who sets priorities',
          why: 'The cost of the request becomes visible, and the right person decides.',
        },
        {
          q: 'Which of these should never be part of a trade?',
          options: ['A deadline', 'The order of tasks', 'Safety and integrity', 'The level of detail in a report'],
          answer: 'Safety and integrity',
          why: 'Deadlines, order and detail can move. Safety and integrity are not up for negotiation.',
        },
      ],
      situation: {
        scene: 'A client manager at a grid operator asks you to change two numbers in your analysis before it goes to the board: “Make the backlog look a bit smaller. The board will panic otherwise.”',
        ask: 'What do you say?',
        model: 'I’d say I understand he doesn’t want a panic, and I share that. But I can’t change the numbers; they have to match the data. What I can do is help present them well: put the trend next to it, show the actions already running, and maybe add a slide on what the backlog means for customers. Shall we work on that framing together tomorrow?',
        rubric: [
          'Says yes to his underlying concern',
          'Gives a clear no on changing the numbers',
          'Offers a concrete alternative for presenting them',
        ],
        pushback: {
          lines: [
            'It’s not lying. It’s just rounding in our favour. Everybody does that.',
            'You’re the consultant. Your job is to help me, not to make my life harder.',
          ],
          model: 'I do want to help you, and that’s exactly why I won’t do it: if the board finds out later, it hurts you far more than a hard number now. The numbers stay as they are. I will help you tell the story: the trend, the actions, and what you need from the board. Shall we sit down for an hour tomorrow and build those two slides together?',
          rubric: [
            'Acknowledges his worry and his wish for help',
            'Restates clearly that the numbers stay as they are',
            'Proposes a concrete session to build the framing together',
          ],
        },
      },
      sayIt: 'Explain in 60 seconds how to say no to a senior person without damaging the relationship.',
      terms: [
        { term: 'Positive no', def: 'Yes to what you protect, a clear no, then yes to an alternative (Ury).' },
        { term: 'Trade', def: 'Offering to do one thing in exchange for something else moving or dropping.' },
      ],
    },
    {
      id: 'pm.negotiate.senior',
      title: 'Disagreeing with someone more senior',
      pre: [
        {
          q: 'In a meeting, the client’s director names a cause for a problem that your data clearly contradicts. What is usually best?',
          options: ['Stay silent and send an email afterwards', 'Contradict him firmly so everyone hears it', 'Ask a question that brings in the data: “Can I add one thing from the data?”', 'Agree now and change the analysis later'],
          answer: 'Ask a question that brings in the data: “Can I add one thing from the data?”',
          why: 'It gets the facts on the table without a public contest. Silence lets a wrong decision go ahead; a firm contradiction makes him defend.',
        },
      ],
      teach: [
        'Disagreeing upwards is part of what clients pay you for. They don’t hire a consultant to hear their own opinion back.\n\nAmy Edmondson’s research on psychological safety shows that teams learn more when people speak up. You help create that by doing it well.',
        'Prepare three things and keep them apart: the fact, your view and your request.\n\n“The data from the last 12 weeks shows X” is the fact. “I think that means Y” is your view. “I’d like us to check Z before deciding” is the request.\n\nA clear request turns disagreement into a next step.',
        'Choose the setting. For a big disagreement, go one-on-one first: never surprise a senior person in front of their team. In a meeting, ask a question rather than give a verdict: “Can I add one thing from the data?”\n\nKeep your voice low and your pace slow. Calm reads as confident.',
        'Know when to stop. Say it clearly once, and a second time only with new information.\n\nIf they decide otherwise and it isn’t about safety or integrity, accept it and commit to the decision; note what you advised. If it is about safety or integrity, you escalate.',
      ],
      example: {
        kind: 'faded',
        text: 'Steering committee at a parts manufacturer. The COO says: “Deliveries are late because operators don’t follow the schedule. We’ll make it a bonus criterion.”\n\nYour data: of the 120 late orders in the last 12 weeks, 84 started late because materials arrived late. You are the youngest in the room.',
        ask: 'What would you do next?',
        reveal: 'Ask for room, calmly: “Can I add one thing from the data?” The fact: “84 of the 120 late orders in the last 12 weeks, that’s 70%, started late because materials came in late.”\n\nYour view: “So a bonus for operators may not move it much.” Your request: “Could we look at materials first and decide on the bonus next month?”\n\nIf he holds his view, don’t argue a second time in the room. Ask for 15 minutes afterwards.',
      },
      said: 'What you hear in projects: “Can I add one thing from the data before we decide?”',
      recall: [
        {
          q: 'What three things do you prepare and keep apart when you disagree with someone senior?',
          options: ['Fact, view, request', 'Problem, blame, solution', 'Opinion, emotion, demand', 'Background, history, conclusion'],
          answer: 'Fact, view, request',
          why: 'Keeping them apart lets the other person accept the fact even if they doubt your view, and the request gives a next step.',
        },
        {
          q: 'A senior manager decides against your advice. It is not about safety or integrity. What do you do?',
          options: ['Keep raising it in every meeting', 'Go to his boss', 'Accept the decision, commit to it, and note what you advised', 'Quietly do it your way'],
          answer: 'Accept the decision, commit to it, and note what you advised',
          why: 'He has the right to decide. Committing keeps trust; writing down your advice keeps you honest.',
        },
        {
          q: 'When do you escalate instead of accepting a senior person’s decision?',
          options: ['When you are sure you are right', 'When the decision is about safety or integrity', 'When your manager would disagree too', 'When the decision costs money'],
          answer: 'When the decision is about safety or integrity',
          why: 'Those are not matters of taste. Everything else is his call once you have made your case.',
        },
        {
          q: 'Of 120 late orders in the last 12 weeks, 84 started late because materials arrived late. What share of the late orders is that, in %?',
          number: 70,
          tolerance: 0.5,
          unit: '%',
          why: '84 / 120 = 0.70, so 70% of the late orders.',
        },
      ],
      situation: {
        scene: 'A grid operator. In a one-on-one, the head of the region tells you to drop the crews’ survey from your report: “They always complain. It’ll only cause unrest.” The survey shows that 60% of crew leads say they get jobs that aren’t ready.',
        ask: 'How do you respond?',
        model: 'I’d say I understand he doesn’t want unrest. Then the fact: “60% of crew leads say they get jobs that aren’t ready, and that matches the cancellation data.” My view: leaving it out means the board misses the main cause. My request: “Can we keep it in, with your response and the actions next to it? Then it shows you’re already on it.”',
        rubric: [
          'Acknowledges his concern',
          'Separates fact, view and request',
          'Proposes a way to keep the finding that works for him',
        ],
        pushback: {
          lines: [
            'I’ve run this region for fifteen years. I know my crews better than a survey does.',
            'I’m the client here. If I say it goes out, it goes out.',
          ],
          model: 'You do know your crews far better than I do, and I value that. The survey isn’t meant to replace that; it supports what the cancellation data shows. It’s your report, and you decide. My advice is to keep it in, with your actions next to it. If you still want it out, I’ll note my advice in the project file. Shall I draft the version with your response?',
          rubric: [
            'Acknowledges his experience and his right to decide',
            'Restates the advice and the reason once, calmly',
            'Proposes drafting the version with his response',
          ],
        },
      },
      sayIt: 'Explain in 60 seconds how to disagree with a senior client calmly and when to let it go.',
      terms: [
        { term: 'Psychological safety', def: 'A shared belief that it is safe to speak up, ask and disagree (Edmondson).' },
        { term: 'Disagree and commit', def: 'Make your case, and once the decision is made, carry it out fully.' },
        { term: 'Fact, view, request', def: 'Three parts kept apart when disagreeing: what the data shows, what you think, what you ask.' },
      ],
    },
  ],
};
