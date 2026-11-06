// pm.consult (EN): The consulting craft: proposals, pricing, the trusted-advisor relationship, independence and ethics, growing an account and building your own practice.
export default {
  lessons: [
    {
      id: 'pm.consult.proposal',
      title: 'A proposal that wins',
      pre: [
        {
          q: 'A client reads your eight-page proposal (the document that offers your work and its price). Which part most decides whether you win?',
          options: ['Your method and models', 'Your CV and references', 'The first page: their problem, in their words, with their numbers', 'The price table'],
          answer: 'The first page: their problem, in their words, with their numbers',
          why: 'Nobody buys a method. They buy their own problem solved, and they decide on the first page whether you understood it.',
        },
      ],
      teach: [
        'A proposal wins on its first page. Start with the client’s problem in their words and numbers: “Planned jobs are cancelled 14% of the time; each cancellation wastes a crew-day; your target is 8% by Q4.”\n\nIf the sponsor, the manager who pays for and owns the project, reads that and thinks “yes, that’s exactly it”, you are most of the way there. Your method comes later.',
        'Then the outcome and how you will know: the measure, the baseline (today’s level, measured before you start), the target and who owns it. Then the approach, in phases.\n\nA good first phase is a diagnostic phase: short and cheap, for example three weeks, 12 consultant days, €14,400. It ends in a go/no-go decision: continue, change course or stop. You price the rest after you have seen the data, which lowers the risk for both sides.',
        'Write down the client commitments: what you need from them. The sponsor for one hour every two weeks. A counterpart, one person on their side, for one day a week. Access to the planning data in week 1. Two sessions with the team leads.\n\nThis is not small print: many projects slip because the client side did not deliver. Naming it up front makes it a shared commitment instead of an excuse later.',
        'Offer two or three options, not one: diagnostic only; diagnostic plus a pilot in one region; the full programme. A single option invites yes or no; options invite a choice between yeses.\n\nKeep it to five or six pages. Before you send it, walk the sponsor through the outline by phone, so the document confirms a conversation instead of starting one.',
        'What you see in practice: proposals that are mostly about the consultancy and hardly about the client, and purchasing departments that compare quotes on day rate alone. Ask early how the choice will be made, and by whom.\n\nConsultants disagree on showing the price of later phases: a range builds trust, a single number gets fixed in the client’s mind.\n\nA sharp question before you write: “If this succeeds, what will be different in six months, and how will we see it?”',
      ],
      example: {
        kind: 'faded',
        text: 'An operations director at a packaging manufacturer calls Vantage. Changeovers (switching a line from one product to the next) on the two thermoforming lines, which shape heated plastic sheet into trays, are slow. OEE is around 58%: the lines make good parts at full speed for only 58% of their planned time. She has €60k in her budget this year.\n\nIn the intake, the first conversation, she said the real worry is a large customer threatening to move volume if on-time delivery doesn’t rise from 85%. Her purchasing department wants three quotes and “a clear plan with a fixed price”.',
        ask: 'How would you build the proposal?',
        reveal: 'Lead with her problem: on-time delivery at 85%, a key customer at risk, and OEE around 58% on the two lines as the likely cause. State the outcome: on-time delivery above 95% by a named date.\n\nPhase 1: a three-week diagnostic, 12 days, €14,400 fixed, that shows where the lost hours go. Phase 2 as two options with a price range, fixed once phase 1 is done.\n\nList what you need: line data from the MES (the system that logs what the lines do), one day a week from the production engineer, the sponsor every two weeks. Keep the total inside €60k. Call her before sending, and ask how purchasing will compare the three quotes.',
      },
      said: 'What you hear in projects: “Nice document. But what exactly are we buying?”',
      recall: [
        {
          q: 'Your phase-1 diagnostic is 12 consultant days at a day rate of €1,200. What is the fee, in euros?',
          number: 14400,
          tolerance: 1,
          unit: '€',
          why: '12 × €1,200 = €14,400.',
        },
        {
          q: 'Why offer two or three options instead of one?',
          options: ['It makes the proposal look more substantial', 'It turns a yes-or-no into a choice between yeses', 'Purchasing always requires it', 'It hides your real price'],
          answer: 'It turns a yes-or-no into a choice between yeses',
          why: 'With options, the client compares ways of working with you instead of deciding whether to work with you at all.',
        },
        {
          q: 'Why list what you need from the client in the proposal?',
          options: ['To cover yourself legally', 'To make the price look lower', 'To show you are organised', 'The client side is a common reason projects slip, so it must be a shared commitment'],
          answer: 'The client side is a common reason projects slip, so it must be a shared commitment',
          why: 'Named commitments get planned; unnamed ones become the excuse in month two.',
        },
        {
          q: 'What should a first phase usually look like?',
          options: ['Short, cheap and ending in a go or no-go', 'The full scope at a discount', 'Free, to build goodwill', 'As long as possible, to secure revenue'],
          answer: 'Short, cheap and ending in a go or no-go',
          why: 'It lowers the risk for both sides and lets you price the rest on real data.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator, after a good intake with a regional manager. She says: “Send me something by Friday. Keep it short; my director has to sign it.”',
        ask: 'What goes on the first page, and what do you do before Friday?',
        model: 'On page one: her problem with her numbers, the outcome we aim for and how we measure it, and the decision her director needs to take, with the price of phase 1. Before Friday I’d call her: “Can I walk you through the outline in ten minutes, so it says what your director needs to hear?” I’d ask what usually makes him say no, and whether I could join for fifteen minutes when she presents it.',
        rubric: [
          'Opens with the client’s problem and numbers, not with Vantage',
          'Makes the decision and the phase-1 price visible on page one',
          'Checks the outline with her before sending it',
        ],
        pushback: {
          lines: [
            '“Why do you want to meet the director? Just send me the document; I’ll handle him.”',
            '“And keep the price off the first page. He gets nervous when he sees numbers first.”',
          ],
          model: '“Happy for you to lead with him. A fifteen-minute call would help me write it in his words, so you don’t have to translate. If that’s not possible, tell me his two biggest worries. The price goes on page one next to what it delivers, so he can weigh the two together.”',
          rubric: [
            'Acknowledges her role with the director',
            'Holds to what the proposal needs: his concerns and an honest price',
            'Proposes a concrete alternative if a meeting is not possible',
          ],
        },
      },
      sayIt: 'Explain to a new client in 60 seconds why you propose a short paid diagnostic before the full project.',
      terms: [
        { term: 'Baseline', def: 'Today’s level of the measure, taken before the work starts, so the result can be shown later.' },
        { term: 'Diagnostic phase', def: 'A short, fixed first phase that tests the problem and ends in a go or no-go.' },
        { term: 'Go/no-go decision', def: 'The moment at the end of a phase where the client chooses to continue, change course or stop.' },
        { term: 'Client commitments', def: 'What the client must provide, such as people, data and sponsor time, written into the proposal.' },
        { term: 'Options', def: 'Two or three ways to buy the work, so the client chooses how rather than whether.' },
      ],
    },
    {
      id: 'pm.consult.pricing',
      title: 'Pricing and scope',
      pre: [
        {
          q: 'A client asks for 10% off your €1,200 day rate, and you say yes straight away. What does that usually signal?',
          options: ['That your price had room in it, so the next price will be questioned too', 'That you are flexible and easy to work with', 'Nothing; discounts are normal', 'That you value the relationship'],
          answer: 'That your price had room in it, so the next price will be questioned too',
          why: 'A discount given for nothing teaches the client that your price is an opening bid.',
        },
      ],
      teach: [
        'Three ways to price. With a day rate you charge for each day worked, say €1,200: simple, and the client carries the risk of overrun, but it rewards hours, not results.\n\nWith a fixed price you agree one fee, say €48k, for an agreed scope, the written list of what you will deliver: the client knows the bill, you carry the risk.\n\nWith value-based pricing the fee is linked to what the result is worth, say €80k for a change worth €900k a year.',
        'Value-based pricing has the most upside, but only when the value is measurable, you agree the baseline with the client, and you control enough of the result.\n\nAdvocates such as Alan Weiss argue it is the fairest model for both sides. Many purchasing departments still prefer day rates, because they are easy to compare. In practice, value-based fees work best with a client who already trusts you.',
        'A fixed price is a bet on your estimate. Estimate 40 days, price €48k, and it takes 50: your real rate drops to €960.\n\nSo add a risk margin, often 15–25% on top, for what you don’t yet know, and write the scope tightly: deliverables, number of sessions, what is out. Every assumption you write down, such as “data available in week 1”, is the basis for a change request if it fails.',
        'A change request is a short written agreement to add or swap work, with its days and price. Protect the scope in the moment, kindly.\n\nWhen the client asks for “one more analysis”, say: “Happy to. It’s outside what we agreed. It’s about three days; shall I add it as a change, or swap it for the second workshop?” Doing it for free once sets the price of everything that follows at zero.',
        'Discounts. Ten per cent off €1,200 is €1,080, so you need about 11% more days to earn the same (1,200 / 1,080 ≈ 1.11). If you give one, trade it: a longer commitment, a named reference case, faster payment, or less scope. Never a bare discount, and don’t cut the first phase to win the work; it teaches the client that your price is where the negotiation starts.\n\nA sharp question when asked for a discount: “What would you like to leave out?”',
      ],
      example: {
        kind: 'faded',
        text: 'A plant director wants Vantage to cut scrap on an extrusion line, a line that pushes hot plastic through a shaped opening to make profiles. Scrap costs about €400k a year. He asks for a fixed price.\n\nYou estimate 30 days if the quality data is clean and 45 if it isn’t, and you won’t know until week 2. Your day rate is €1,200. He mentions that a competitor quoted €30k.',
        ask: 'How would you price this?',
        reveal: 'Don’t bet on the clean case. Split it: a fixed-price phase 1 of 8 days, €9,600, which includes checking the data. Then a fixed price for phase 2 based on what you found: 22 days if the data is clean, 37 if not, plus a 15% margin.\n\nOr offer a value option: a lower fixed fee plus a bonus if scrap falls by an agreed amount, measured by his controller, the finance person who checks the numbers.\n\nOn the €30k: “I can’t judge their scope. Let’s compare what each quote delivers, and who carries the risk if the data is poor.” Don’t match the number blind.',
      },
      said: 'What you hear in projects: “Can you do it for a fixed price? And maybe a bit sharper?”',
      recall: [
        {
          q: 'You quoted €48k fixed for 40 estimated days. The work takes 50 days. What is your effective day rate (fee divided by days actually worked), in euros?',
          number: 960,
          tolerance: 1,
          unit: '€ per day',
          why: '€48,000 divided by 50 days is €960 a day, 20% below your rate.',
        },
        {
          q: 'When is value-based pricing a good fit?',
          options: ['When the scope is unclear', 'When you want to avoid risk', 'When the client is small', 'When the value is measurable and you control enough of the result'],
          answer: 'When the value is measurable and you control enough of the result',
          why: 'If you can’t measure the value or influence it, a value fee becomes a gamble for both sides.',
        },
        {
          q: 'Mid-project, the client asks for “one more analysis” outside the scope. What is the best response?',
          options: ['Do it for free to keep goodwill', '“It’s outside what we agreed; about three days. Shall I add it as a change, or swap it for something else?”', 'Refuse: scope is scope', 'Do it and add it to the final invoice without saying'],
          answer: '“It’s outside what we agreed; about three days. Shall I add it as a change, or swap it for something else?”',
          why: 'It says yes to the client, names the cost, and lets them choose.',
        },
        {
          q: 'If you give a discount, what should you get in return?',
          options: ['Something of value: a longer commitment, a reference, faster payment or less scope', 'Nothing; it is a goodwill gesture', 'A verbal hint of more work later', 'A thank-you'],
          answer: 'Something of value: a longer commitment, a reference, faster payment or less scope',
          why: 'A traded discount keeps your price credible; a free one undermines it.',
        },
      ],
      situation: {
        scene: 'You’re at a manufacturer in week 4 of a fixed-price project at €1,200 a day. The sponsor asks you to “quickly” include the second site in the analysis.',
        ask: 'What do you say?',
        model: '“Good idea, and I can see why. It’s outside our fixed scope: the second site is about six extra days, so €7,200. We can add it as a change, or swap it for the third workshop and keep the price. Which works better for you?” I’d confirm his choice by e-mail the same day.',
        rubric: [
          'Welcomes the idea but says clearly that it is outside the scope',
          'Puts a number of days and euros on it',
          'Offers a choice and confirms it in writing',
        ],
        pushback: {
          lines: [
            '“It’s the same process at the other site. Just copy the analysis; it can’t be that much work.”',
            '“We agreed a fixed price. I assumed that meant you’d be flexible on the details.”',
          ],
          model: '“It may well be similar, and I’d like to include it. A second site does mean new data and new interviews, about six extra days. Two options: we add it for a fixed amount, or we swap it for something in the current scope. Which do you prefer?”',
          rubric: [
            'Acknowledges the request and his assumption',
            'Makes clear what the fixed price covers',
            'Offers concrete options: an extra fee or a trade',
          ],
        },
      },
      sayIt: 'Explain to a client in 60 seconds the difference between a day rate and a fixed price, and who carries the risk in each.',
      terms: [
        { term: 'Day rate', def: 'A fee per day worked; the client carries the risk if the work takes longer.' },
        { term: 'Fixed price', def: 'An agreed fee for an agreed scope; the consultant carries the risk of overrun.' },
        { term: 'Value-based pricing', def: 'A fee linked to the measurable value of the result, not to the days worked.' },
        { term: 'Risk margin', def: 'An extra 15–25% on a fixed price to cover what you can’t yet know.' },
        { term: 'Scope', def: 'The written list of what you will deliver, and what you won’t.' },
        { term: 'Change request', def: 'A written agreement to add or swap scope, with its days and price.' },
      ],
    },
    {
      id: 'pm.consult.trust',
      title: 'The trusted advisor',
      pre: [
        {
          q: 'What builds a new client’s trust in you fastest in the first months?',
          options: ['Showing your expertise in every meeting', 'Small promises kept, every time', 'Being available evenings and weekends', 'A strong reference from another client'],
          answer: 'Small promises kept, every time',
          why: 'Clients rarely judge your method early on; they judge whether you are dependable.',
        },
      ],
      teach: [
        'The trust equation comes from Maister, Green and Galford’s book The Trusted Advisor (2000): trust = (credibility + reliability + intimacy) / self-orientation.\n\nCredibility: do you know what you’re talking about? Reliability: do you do what you say? Intimacy: can they tell you what really worries them? Self-orientation: are you focused on them, or on yourself, your fee and looking clever? Because it divides, high self-orientation cancels out the rest.',
        'Reliability is built in small things, early. Send the minutes the same day. Bring the numbers you promised. If you said Thursday, it is Thursday, or you call on Wednesday.\n\nClients judge this first, because they can’t yet judge your method. Ten small promises kept do more than one brilliant analysis.',
        'Intimacy is the hardest part and the most valuable. It shows when the sponsor says: “Between us, I’m not sure my plant manager can carry this.”\n\nYou earn it by keeping confidences, by being honest about your own doubts, and by taking an interest in them as a person: “What would make this a good year for you?” Never use what they tell you against anyone.',
        'Self-orientation shows in small ways: steering every conversation to your next phase, talking about Vantage, needing to be right, finishing their sentences. The fix is easy to say and hard to do: listen longer, ask one more question, and sometimes advise less work than you could sell.\n\n“You don’t need us for this part; your planner can do it.” That sentence pays back many times.',
        'The equation is a way to think, not a measurement: the scores you put in are guesses. Its use is diagnostic: when trust is low, ask which part is weak.\n\nWhat junior consultants most often get wrong: they invest in credibility, more slides and more analysis, while the client is waiting for reliability and a listening ear.\n\nA sharp question to ask yourself after a meeting: “Who talked most, and about whose problem?”',
      ],
      example: {
        kind: 'faded',
        text: 'Six weeks into a project at a grid operator. Your analysis is strong.\n\nBut the sponsor has cancelled two of your fortnightly meetings, and a team lead tells you she called your last report “a lot of slides”. Looking back, you have been sending 25-page decks (slide presentations) two days late, and in meetings you mostly presented.',
        ask: 'What would you do next?',
        reveal: 'Credibility is not the problem; reliability and intimacy are, and the decks show self-orientation.\n\nChange the rhythm: a one-page update, sent the same day, every time. Ask for 30 minutes, not to present but to listen: “I have the feeling our updates aren’t helping you. What would be useful?” Then ask what is on her mind beyond this project.\n\nKeep the next three promises small and on time. In a month, ask her again.',
      },
      said: 'What you hear in projects: “He’s clever, but I’m never quite sure whose side he’s on.”',
      recall: [
        {
          q: 'In the trust equation, what does self-orientation do?',
          options: ['It adds to your credibility', 'It divides the other three, so high self-orientation lowers trust', 'It only matters in sales meetings', 'It measures your expertise'],
          answer: 'It divides the other three, so high self-orientation lowers trust',
          why: 'However credible you are, a client who senses you are working for yourself holds back.',
        },
        {
          q: 'The sponsor tells you in confidence that she doubts her plant manager. What builds intimacy?',
          options: ['Raising it in the steering group to get it solved', 'Mentioning it to the plant manager so he can improve', 'Noting it in the project report', 'Keeping it to yourself and using it only to shape your own approach'],
          answer: 'Keeping it to yourself and using it only to shape your own approach',
          why: 'A confidence kept is what makes the next confidence possible.',
        },
        {
          q: 'Which of these most clearly signals high self-orientation?',
          options: ['Asking about the client’s goals for the year', 'Sending the minutes the same day', 'Turning each meeting toward your next phase', 'Admitting you don’t know a number'],
          answer: 'Turning each meeting toward your next phase',
          why: 'It shows the client that your interest is in your next invoice.',
        },
        {
          q: 'Why can advising less paid work grow an account (a client you work with over several projects)?',
          options: ['It shows you put the client’s interest before your fee, which raises trust', 'It lowers your day rate', 'Clients prefer cheap consultants', 'It lets you avoid difficult work'],
          answer: 'It shows you put the client’s interest before your fee, which raises trust',
          why: 'Low self-orientation is visible and rare, and clients remember it.',
        },
      ],
      situation: {
        scene: 'You’re at a manufacturer. In the corridor, the operations director says: “Honestly, I’m not sure this whole programme will survive the reorganisation.” Your second phase depends on it.',
        ask: 'What do you say?',
        model: '“Thanks for telling me. What would it take for it to survive, and what would you need from me?” I’d listen first and not defend my phase 2. If the honest answer is that the programme should pause, I’d help him plan that well, because that is what he will remember.',
        rubric: [
          'Listens and asks before defending his own work',
          'Treats what was said in confidence with care',
          'Puts the client’s interest before the next phase',
        ],
        pushback: {
          lines: [
            '“Don’t get me wrong, I’m not saying it’s over. But I can’t promise you anything about phase two.”',
            '“Why do you care so much? You’ll get paid for phase one either way.”',
          ],
          model: '“I don’t need a promise. I care because the results only last if someone owns them after the reorganisation. Who will own the lines then? If you like, I’ll write a one-page handover that works whoever it is, and we look at phase two once that’s clear.”',
          rubric: [
            'Acknowledges his uncertainty without pushing for a promise',
            'Makes clear it is about the client’s results, not the fee',
            'Proposes a concrete step that helps in any outcome',
          ],
        },
      },
      sayIt: 'Explain to a junior consultant in 60 seconds what the trust equation is and which part most consultants get wrong.',
      terms: [
        { term: 'Trust equation', def: 'Credibility plus reliability plus intimacy, divided by self-orientation (Maister, Green and Galford, 2000).' },
        { term: 'Credibility', def: 'Whether the client believes you know what you’re talking about.' },
        { term: 'Reliability', def: 'Whether you do what you say, when you said it.' },
        { term: 'Intimacy', def: 'How safe the client feels telling you what really worries them.' },
        { term: 'Self-orientation', def: 'How much you focus on yourself, your fee and being right instead of on the client.' },
      ],
    },
    {
      id: 'pm.consult.independence',
      title: 'Independence and ethics',
      pre: [
        {
          q: 'A software vendor offers Vantage 10% of the licence value for every client you refer. What is the problem?',
          options: ['None, if the software is good', 'Only if the client finds out', 'Your advice is no longer independent, even if you believe it is', 'It is always illegal in the Netherlands'],
          answer: 'Your advice is no longer independent, even if you believe it is',
          why: 'Money from a third party bends advice, and the client can no longer tell whether it has.',
        },
      ],
      teach: [
        'Your advice is only worth paying for if it is independent: no money from anyone but the client for the advice you give. A referral fee, money from a vendor for each client you send them, breaks that, because the client can no longer tell whether it bent you.\n\nIf you have a link with a vendor, a partner or a former employer, say so in writing before you advise. That disclosure costs nothing; being found out later costs you the client and your name.',
        'Telling the client what they don’t want to hear. Prepare it: facts first, then your conclusion, then what you recommend. Say it to the sponsor alone before any group.\n\nScript: “I have to tell you something you won’t like. The data shows the planning tool isn’t why cancellations are high; the materials process is. I’d rather tell you now than in front of the board.” Then stop and let them react.',
        'A conflict of interest, where your own gain could bend your advice, also comes in quieter forms. Working for two competing manufacturers on the same topic. Being hired to “confirm” a decision already taken. Advising on a follow-up project you would deliver yourself.\n\nThe test: would you be comfortable if the client read your reasoning and your invoice side by side? If not, disclose it or step back.',
        'Confidentiality: what you learn at one client stays there. Share lessons anonymously, never names, numbers or documents. Ask permission before using a client as a case, and show them the text.\n\nAt grid operators, expect rules on network data and security too; ask on day one what you may store and where.',
        'Professional bodies put this in writing: the Dutch association of management consultants (Ooa) has a code of conduct on independence and confidentiality, and large clients add their own rules to the contract.\n\nWhere practitioners differ: some refuse work for a client’s competitor for a year; others accept it with separate teams and clear walls.\n\nA sharp question to ask yourself: “Would I give the same advice if it earned me nothing?”',
      ],
      example: {
        kind: 'faded',
        text: 'A plant director hired Vantage to “roll out” a new shift pattern he has already announced. Your analysis shows it will cost about 6% of output on the bottleneck line, the line that limits the output of the whole plant, because the handovers between shifts fall in the busiest hour. He pays your invoice, and he has asked you to present “support for the plan” to the works council, the elected employee body, next week.',
        ask: 'What would you do next?',
        reveal: 'Don’t present something you don’t believe, and don’t ambush him either. Remember that the works council has a consent right on working-hours schemes (Article 27 of the Dutch Works Councils Act): if he goes ahead without its consent, the council can have the decision declared void. So a flawed plan sold as sound is a risk for him too.\n\nAsk for an hour alone with him this week. Show the data: the handover timing and the 6% loss. Then offer a way forward: move the handover by 45 minutes, or overlap the shifts on the bottleneck, and the pattern can still work.\n\nSay plainly: “I can present the plan with this change. I can’t present it as it stands and tell the works council it’s sound.” If he doesn’t accept that, it is better to lose this assignment than your name.',
      },
      said: 'What you hear in projects: “We just need you to confirm what we’ve already decided.”',
      recall: [
        {
          q: 'When should you disclose a link with a vendor you might recommend?',
          options: ['In writing, before you advise', 'Only if asked', 'After the recommendation is accepted', 'Never, if the advice is sound anyway'],
          answer: 'In writing, before you advise',
          why: 'Disclosed early, it is a fact the client can weigh; found out later, it is a breach of trust.',
        },
        {
          q: 'You have bad news for the sponsor. Where do you say it first?',
          options: ['In the steering group, so everyone hears it', 'In the final report', 'To the sponsor alone, before any group', 'By e-mail, to have it on record'],
          answer: 'To the sponsor alone, before any group',
          why: 'It gives the sponsor room to react and to decide how to take it further, without losing face.',
        },
        {
          q: 'Which test helps you spot a conflict of interest?',
          options: ['Is it legal?', 'Did your competitors do the same?', 'Does the sponsor agree?', 'Would the client be comfortable reading your reasoning and your invoice side by side?'],
          answer: 'Would the client be comfortable reading your reasoning and your invoice side by side?',
          why: 'It exposes any place where your income and your advice point in different directions.',
        },
        {
          q: 'You want to use a former client’s project as a case on your website. What do you do?',
          options: ['Use it, but leave out the numbers', 'Ask permission and show them the text first', 'Use it if the project is over a year old', 'Mention only the sector'],
          answer: 'Ask permission and show them the text first',
          why: 'The story is partly theirs; permission keeps the relationship and the confidentiality intact.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator. The sponsor asks you to add a line to the final report saying the new contractor “performed well”. Your data shows the contractor caused about a third of the cancellations, though fewer since week 8.',
        ask: 'What do you say?',
        model: '“I understand why you’d like that line, and I don’t want to make things hard with the contractor. But the data shows they caused about a third of the cancellations, so I can’t write that. I can describe it factually and add what they have improved since week 8. Shall we look at the wording together?”',
        rubric: [
          'Declines to write something untrue',
          'Shows the data and stays respectful',
          'Offers an honest alternative wording',
        ],
        pushback: {
          lines: [
            '“It’s one sentence. The contractor matters to us next year; I don’t want a fight.”',
            '“You’re being very rigid. Other firms understand how these things work.”',
          ],
          model: '“I understand the relationship matters, and I don’t want a fight either. I can’t write that they performed well, because our data says otherwise. I can describe it factually and add what has gone well since week 8. Then the report holds up, for you as well.”',
          rubric: [
            'Acknowledges the relationship and his concern',
            'Holds firm on not writing what the data contradicts',
            'Offers a factual alternative wording',
          ],
        },
      },
      sayIt: 'Explain to a client in 60 seconds why you will sometimes tell them things they don’t want to hear, and why that is what they pay for.',
      terms: [
        { term: 'Independence', def: 'Being paid only by the client for your advice, with no interest in a particular answer.' },
        { term: 'Referral fee', def: 'Money from a vendor for each client you send to them; it makes your advice dependent.' },
        { term: 'Disclosure', def: 'Telling the client in writing, in advance, about any link that could affect your advice.' },
        { term: 'Conflict of interest', def: 'A situation where your own gain could bend the advice you give.' },
        { term: 'Confidentiality', def: 'Keeping what you learn at one client away from others: no names, numbers or documents.' },
      ],
    },
    {
      id: 'pm.consult.account',
      title: 'Growing an account',
      pre: [
        {
          q: 'Where does most of an established independent consultant’s new work come from?',
          options: ['Existing clients and people they refer you to', 'Cold outreach to new companies', 'Public tenders', 'LinkedIn posts'],
          answer: 'Existing clients and people they refer you to',
          why: 'People hire who they have seen work, or who someone they trust has seen work.',
        },
      ],
      teach: [
        'An account is a client organisation you work with over time, across several projects and people. Growing it is not selling: it is doing the work so well, and so visibly, that the next problem comes to you.\n\nA second project at a client you know costs a few hours of conversation; a new client can take months of meetings and proposals. That is why most established consultants get most of their work from people who already know them.',
        'Do a follow-up after the project ends: a call at 3 months and a visit at 6. “How is the cancellation rate holding? Anything slipping?” No invoice, no pitch.\n\nIt protects the result, and it is often when clients mention the next problem: “Now that planning works, our warehouse is the mess.” You heard it first.',
        'That is an adjacent problem: close to the one you solved, and seen while doing the work, like the maintenance backlog behind the OEE losses, or the poor data behind the planning issues. Adjacent problems are the honest route to more work.\n\nNote them, and raise them once, usually at close-out, the final meeting where you hand over the results: “Two things I saw outside our scope that you should know about.” Then let the client decide whether they want help, and from whom.',
        'Widen the relationships. If you only know the sponsor, the account ends when she changes jobs.\n\nBuild real contact with two or three others: the controller, the line manager who owns the benefit, the IT lead. Not over lunches, but by being useful to them in the project.\n\nAnd when someone you worked with moves to another company, congratulate them; that is often where your next client comes from.',
        'The other source is a referral: a client who tells a colleague elsewhere “call her”. Referrals come from results people can repeat in one sentence, so give them that sentence: “cancellations from 14% to 9%”.\n\nWhat goes wrong: disappearing after the last invoice, or pitching at every meeting. Opinions differ on free follow-up; an hour is goodwill, a week is unpaid work.\n\nA sharp question at close-out: “Who else should hear about this result?”',
      ],
      example: {
        kind: 'faded',
        text: 'Vantage closed a successful project at a food producer in June: changeover times (the time to switch a line to the next product) down 40%. Since then, nothing. It is now October.\n\nYour sponsor, the operations manager, has just been promoted to plant director. During the project you noticed that their maintenance is mostly reactive, fixing things after they break: about 60% of maintenance hours go to breakdowns.',
        ask: 'What would you do next?',
        reveal: 'Congratulate her on the promotion, personally, and ask her for a coffee, not a meeting. Start with the old result: “How are the changeovers holding?” If they’ve slipped, offer an hour of help, free.\n\nThen, if the moment is right: “When we worked on the lines, I noticed about 60% of maintenance hours go to breakdowns. Is that on your list now?” Don’t bring a proposal.\n\nIf she is interested, suggest a short diagnostic, as last time. And get to know the new operations manager who took her old job.',
      },
      said: 'What you hear in projects: “Funny you should call. We were just talking about our warehouse.”',
      recall: [
        {
          q: 'When is the best moment to raise problems you saw outside your scope?',
          options: ['In the middle of the project, to grow it', 'Never; it looks like selling', 'At close-out, once, and let the client decide', 'In a separate sales meeting'],
          answer: 'At close-out, once, and let the client decide',
          why: 'Raised once at the right time, it is advice; pushed repeatedly, it is selling.',
        },
        {
          q: 'Why make contact at 3 and 6 months after a project ends?',
          options: ['To send an invoice for extra support', 'To protect the result, and because that is when clients often mention the next problem', 'Because the contract requires it', 'To ask for a testimonial'],
          answer: 'To protect the result, and because that is when clients often mention the next problem',
          why: 'The check-in serves the client first; the next question tends to follow from it.',
        },
        {
          q: 'Your only contact at a client is the sponsor. What is the risk?',
          options: ['None; the sponsor decides', 'The project costs more', 'The client gets bored with you', 'The account ends when she leaves or changes role'],
          answer: 'The account ends when she leaves or changes role',
          why: 'A relationship that hangs on one person is only as stable as that person’s job.',
        },
        {
          q: 'What is an adjacent problem?',
          options: ['A problem close to what you solved, which you saw during the work', 'A problem at the client’s competitor', 'Any new sales opportunity', 'A problem the client has already solved'],
          answer: 'A problem close to what you solved, which you saw during the work',
          why: 'You have evidence for it and context the client trusts, so raising it is advice, not a pitch.',
        },
      ],
      situation: {
        scene: 'It is early December. You’re at a grid operator, closing a project that brought cancelled jobs down. The regional manager says: “Great work. We’ll be in touch if we need anything.”',
        ask: 'What do you say before you leave?',
        model: '“Thank you. I’d like to call you in three months to see how the cancellation figure is holding, no strings attached. And two things I noticed outside our scope: the hand-offs with the contractor and the quality of the outage data. Neither is urgent today, but they will limit what you get from this. Happy to talk them through whenever it suits you.”',
        rubric: [
          'Sets a concrete follow-up moment without a sales pitch',
          'Names the adjacent problems once and briefly',
          'Leaves the choice with the client',
        ],
        pushback: {
          lines: [
            '“Honestly, we have no budget for anything new this year. So there’s nothing to talk about.”',
            '“I don’t like being sold to on the last day. Let’s keep it nice.”',
          ],
          model: '“Understood, and I’m not selling anything today. I’d just like to check in three months whether the cancellation figure holds. If it does, good. If it doesn’t, we talk about why. Can I put thirty minutes in your diary for early March?”',
          rubric: [
            'Acknowledges the budget and the wish not to be sold to',
            'Makes clear his interest is in the result lasting',
            'Proposes a specific, low-pressure follow-up with a date',
          ],
        },
      },
      sayIt: 'Explain to a fellow freelancer in 60 seconds how you grow an account without selling.',
      terms: [
        { term: 'Account', def: 'A client organisation you work with over time, across several projects and people.' },
        { term: 'Follow-up', def: 'Unpaid contact after a project to check the result holds, without a pitch.' },
        { term: 'Adjacent problem', def: 'A problem close to the one you solved, which you saw while doing the work.' },
        { term: 'Close-out', def: 'The final meeting of a project, where results are handed over and next steps are named.' },
        { term: 'Referral', def: 'A client recommending you to someone else, often at another company.' },
      ],
    },
    {
      id: 'pm.consult.practice',
      title: 'Building your own practice',
      pre: [
        {
          q: 'An independent consultant has about 200 working days a year after holidays and sickness. Roughly how many can he bill?',
          options: ['About 200', 'About 180', 'About 120 to 140', 'About 80'],
          answer: 'About 120 to 140',
          why: 'Selling, admin, writing and learning take 30–40% of the time, and nobody pays for those days.',
        },
      ],
      teach: [
        'Do the capacity maths first. About 200 working days remain after holidays, public holidays and sickness. Selling, admin, writing and learning take 30–40%. That leaves 120–140 billable days, the days a client pays for: a utilisation of 60–70%.\n\nAt €1,200 a day and 130 days, revenue is €156k before costs and tax. Plan on fewer in your first years, because you will sell more. It also means three or four clients at once, not eight.',
        'Positioning is a choice of who you are for: “I help grid operators and manufacturers turn their performance numbers into steering that management acts on.”\n\nNarrow feels risky, but a narrow position is easier to remember and to recommend. A plant director won’t remember “a consultant”; he remembers “the one who fixed our cancellation rate”.',
        'A case history is your strongest material. One page each: the situation in numbers, what you did, the result in numbers, and a sentence from the client, with permission. “Cancellations from 14% to 9% in six months.”\n\nThree solid cases beat a website full of services. Collect the numbers and the permission at close-out; later is too late.',
        'Build the network on purpose: former colleagues, clients who moved on, two or three partners who refer work to you and you to them.\n\nThen watch your pipeline: the conversations and proposals that will become work. If your win rate is one in three proposals and you need six projects a year, you need about 18 proposals. Track it monthly; when it dips, the empty months come about a quarter later.',
        'Say no to the wrong work: outside your position, a sponsor who wants confirmation rather than change, or a price that only works if everything goes well. Script: “This isn’t where I’m strongest; I’d recommend someone who is.” A wrong project costs not just the days, but the case you could have built instead.\n\nA sharp question before you say yes: “Will this become a case I want to tell?”',
      ],
      example: {
        kind: 'faded',
        text: 'Your first year as Vantage. You have 60 billable days booked for the next six months, at two clients.\n\nA large engineering firm offers you 100 days of subcontract work, under their contract with the end client, at €850 a day, doing general project administration on an IT migration over the coming year. A grid operator you would love to work for is talking about a diagnostic in three months, perhaps 15 days at €1,200.',
        ask: 'What would you weigh, and what would you decide?',
        reveal: 'Do the sums. The subcontract is €85,000 and fills your diary: steady income, but at €850, outside your position, and with almost no room left for the grid operator or for selling. With 60 days already booked, 100 more makes 160 within about a year, above the 120–140 you can really bill, with no time to build cases.\n\nOptions: negotiate it down, for example two days a week for four months, about 35 days or €29,750, which keeps room for the diagnostic and your network. Or decline and put the time into landing the grid operator.\n\nIf cash is tight, the partial deal is the honest middle. Either way, decide by your position, not only by the diary.',
      },
      said: 'What you hear in projects: “So what is it exactly that you do?”',
      recall: [
        {
          q: 'You bill 130 days a year at €1,200 a day. What is your yearly revenue, in thousands of euros?',
          number: 156,
          tolerance: 1,
          unit: 'k€',
          why: '130 × €1,200 = €156,000, before costs and tax.',
        },
        {
          q: 'One in three of your proposals wins, and you need six projects a year. How many proposals do you need to write?',
          number: 18,
          tolerance: 1,
          unit: 'proposals',
          why: '6 projects × 3 proposals per win = 18.',
        },
        {
          q: 'What makes a strong case history?',
          options: ['A list of all the services you offer', 'The situation and the result in numbers, what you did, and a client quote used with permission', 'A long description of your method', 'Just the client’s logo'],
          answer: 'The situation and the result in numbers, what you did, and a client quote used with permission',
          why: 'Numbers and a client’s own words are proof; a list of services is a claim.',
        },
        {
          q: 'Why choose a narrow position for a new practice?',
          options: ['It means fewer clients, so less work', 'Clients prefer generalists', 'It lets you charge any price', 'It is easier to remember and to recommend'],
          answer: 'It is easier to remember and to recommend',
          why: 'Referrals depend on people knowing exactly when to think of you.',
        },
      ],
      situation: {
        scene: 'You’re at a networking event for manufacturers. A plant manager asks: “And what does Vantage do?”',
        ask: 'What do you say?',
        model: '“I help manufacturers and grid operators turn their performance numbers into steering. At a grid operator, for example, we brought cancelled jobs down from 14% to 9% in six months. What are you working on at your plant this year?” Then I listen, and if there’s a fit, I ask whether I may call him next week.',
        rubric: [
          'Positions Vantage in one sentence with a clear audience',
          'Gives one concrete result with numbers',
          'Turns quickly to the other person’s problem',
        ],
        pushback: {
          lines: [
            '“Performance management, everybody says that. We had a big firm in last year and nothing changed.”',
            '“And how old are you? Why would I trust my plant to a small firm?”',
          ],
          model: '“Fair; plenty of projects leave nothing behind. We work on the floor with your own people, and we stay until your team runs its performance review without us. Pick one line where the numbers keep slipping; after half a day there I’ll tell you honestly whether we can help.”',
          rubric: [
            'Responds calmly to his scepticism',
            'Says in plain, concrete words what Vantage does',
            'Proposes a small, concrete next step',
          ],
        },
      },
      sayIt: 'Explain to a friend in 60 seconds why a consultant with 130 billable days a year should still say no to work.',
      terms: [
        { term: 'Billable days', def: 'The days a client pays for, usually 120–140 a year for an independent.' },
        { term: 'Utilisation', def: 'Billable days as a share of available working days, often 60–70% for an independent.' },
        { term: 'Positioning', def: 'A clear choice of which clients and problems you are for.' },
        { term: 'Case history', def: 'A one-page story of a project with numbers before and after, used with permission.' },
        { term: 'Pipeline', def: 'The conversations and proposals that will become your work in the coming months.' },
        { term: 'Win rate', def: 'The share of your proposals that turn into work, such as one in three.' },
      ],
    },
  ],
};
