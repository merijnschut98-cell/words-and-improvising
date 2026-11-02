// pm.consult (EN): The consulting craft: proposals, pricing, the trusted-advisor relationship, independence and ethics, growing an account and building your own practice.
export default {
  lessons: [
    {
      id: 'pm.consult.proposal',
      title: 'A proposal that wins',
      pre: [
        {
          q: 'A client reads your eight-page proposal. Which part most decides whether you win?',
          options: ['Your method and models', 'Your CV and references', 'The first page: their problem, in their words, with their numbers', 'The price table'],
          answer: 'The first page: their problem, in their words, with their numbers',
          why: 'Nobody buys a method. They buy their own problem solved, and they decide on the first page whether you understood it.',
        },
      ],
      teach: [
        'A proposal wins on its first page. Start with the client’s problem in their words and numbers: “Planned jobs are cancelled 14% of the time; each one wastes a crew-day; your target is 8% by Q4.” If the sponsor reads that and thinks “yes, that’s exactly it”, you are most of the way there. Your method comes later.',
        'Then the outcome and how you will know: the measure, the baseline, the target and who owns it. Then the approach, in phases. A good first phase is short and cheap: a three-week diagnostic, 12 days, €14,400, ending in a go or no-go. It lowers the client’s risk and yours, because you price the rest after you have seen the data.',
        'Write down what you need from them. The sponsor for one hour every two weeks. A counterpart for one day a week. Access to the planning data in week 1. Two sessions with the team leads. This is not small print: many projects slip because the client side did not deliver. Naming it up front makes it a shared commitment instead of an excuse later.',
        'Offer two or three options, not one: diagnostic only; diagnostic plus a pilot in one region; the full programme. A single option invites yes or no; options invite a choice between yeses. Keep it to five or six pages. Before you send it, walk the sponsor through the outline by phone, so the document confirms a conversation instead of starting one.',
      ],
      example: {
        kind: 'faded',
        text: 'An operations director at a packaging manufacturer calls Vantage. Changeovers on the two thermoforming lines are slow, OEE is around 58%, and she has €60k in her budget this year. In the intake she said the real worry is a large customer threatening to move volume if on-time delivery doesn’t rise from 85%. Her purchasing department wants three quotes and “a clear plan with a fixed price”.',
        ask: 'How would you build the proposal?',
        reveal: 'Lead with her problem: on-time delivery at 85%, a key customer at risk, and OEE around 58% on the two lines as the likely cause. State the outcome: on-time delivery above 95% by a named date. Phase 1: a three-week diagnostic, 12 days, €14,400 fixed, that shows where the lost hours go. Phase 2 as two options with a price range, fixed once phase 1 is done. List what you need: line data from the MES, one day a week from the production engineer, the sponsor every two weeks. Keep the total inside €60k. Call her before sending, and ask how purchasing will compare the three quotes.',
      },
      said: 'What you hear in projects: “Nice document. But what exactly are we buying?”',
      recall: [
        {
          q: 'Your phase-1 diagnostic is 12 days at €1,200 a day. What is the fee, in euros?',
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
        model: 'On page one: her problem with her numbers, the outcome we aim for and how we measure it, and the decision her director needs to take, with the price of phase 1. Before Friday I’d call her: “Can I walk you through the outline in ten minutes, so it says what your director needs to hear?” And I’d ask what usually makes her director say no.',
        rubric: [
          'Opens with the client’s problem and numbers, not with Vantage',
          'Makes the decision and the phase-1 price visible on page one',
          'Checks the outline with her before sending it',
        ],
      },
      sayIt: 'Explain to a new client in 60 seconds why you propose a short paid diagnostic before the full project.',
      terms: [
        { term: 'Diagnostic phase', def: 'A short, fixed first phase that tests the problem and ends in a go or no-go.' },
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
        'Three ways to price. Day rate: €1,200 for each day worked; simple, the client carries the overrun risk, but it rewards hours, not results. Fixed price: €48k for an agreed scope; the client knows the bill, you carry the risk. Value-based: a fee linked to what the result is worth, say €80k for a change worth €900k a year. Most upside, but only when the value is measurable and you control enough of it.',
        'A fixed price is a bet on your estimate. Estimate 40 days, price €48k, and it takes 50: your real rate drops to €960. So add a margin of 15–25% for what you don’t know, and write the scope tightly: deliverables, number of sessions, what is out. Every assumption you write down, such as “data available in week 1”, is a basis for a change request if it fails.',
        'Protect the scope in the moment, kindly. When the client asks for “one more analysis”, say: “Happy to. It’s outside what we agreed. It’s about three days; shall I add it as a change, or swap it for the second workshop?” Doing it for free once sets the price of everything that follows at zero.',
        'Discounts. Ten per cent off €1,200 means you need 11% more days to earn the same. If you give one, trade it: a longer commitment, a named reference case, faster payment, or less scope. Never a bare discount. And don’t cut the first phase to win the work; it tells the client your price is where the negotiation starts.',
      ],
      example: {
        kind: 'faded',
        text: 'A plant director wants Vantage to cut scrap on an extrusion line. Scrap costs about €400k a year. He asks for a fixed price. You estimate 30 days if the quality data is clean and 45 if it isn’t, and you won’t know until week 2. Your day rate is €1,200. He mentions that a competitor quoted €30k.',
        ask: 'How would you price this?',
        reveal: 'Don’t bet on the clean case. Split it: a fixed-price phase 1 of 8 days, €9,600, which includes checking the data. Then a fixed price for phase 2 based on what you found: 22 days if the data is clean, 37 if not, plus a 15% margin. Or offer a value option: a lower fixed fee plus a bonus if scrap falls by an agreed amount, measured by his controller. On the €30k: “I can’t judge their scope. Let’s compare what each quote delivers, and who carries the risk if the data is poor.” Don’t match the number blind.',
      },
      said: 'What you hear in projects: “Can you do it for a fixed price? And maybe a bit sharper?”',
      recall: [
        {
          q: 'You quoted €48k fixed for 40 estimated days. The work takes 50 days. What is your effective day rate, in euros?',
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
        scene: 'You’re at a manufacturer in week 4 of a fixed-price project. The sponsor asks you to “quickly” include the second site in the analysis.',
        ask: 'What do you say?',
        model: '“Good idea, and I can see why. It’s outside our fixed scope: the second site is about six extra days, so €7,200. We can add it as a change, or swap it for the third workshop and keep the price. Which works better for you?” I’d confirm his choice by e-mail the same day.',
        rubric: [
          'Welcomes the idea but says clearly that it is outside the scope',
          'Puts a number of days and euros on it',
          'Offers a choice and confirms it in writing',
        ],
      },
      sayIt: 'Explain to a client in 60 seconds the difference between a day rate and a fixed price, and who carries the risk in each.',
      terms: [
        { term: 'Fixed price', def: 'An agreed fee for an agreed scope; the consultant carries the risk of overrun.' },
        { term: 'Risk margin', def: 'An extra 15–25% on a fixed price to cover what you can’t yet know.' },
        { term: 'Change request', def: 'A written agreement to add or swap scope, with its days and price.' },
        { term: 'Value-based pricing', def: 'A fee linked to the measurable value of the result, not to the days worked.' },
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
        'Trust can be broken into four parts, from Maister, Green and Galford’s book The Trusted Advisor: credibility, reliability and intimacy, divided by self-orientation. Credibility: do you know what you’re talking about? Reliability: do you do what you say? Intimacy: can they tell you what really worries them? Self-orientation: are you focused on them, or on yourself, your fee and looking clever? That last one divides everything else.',
        'Reliability is built in small things, early. Send the minutes the same day. Bring the numbers you promised. If you said Thursday, it is Thursday, or you call on Wednesday. Ten small promises kept do more than one brilliant analysis.',
        'Intimacy is the hardest part and the most valuable. It shows when the sponsor says: “Between us, I’m not sure my plant manager can carry this.” You earn it by keeping confidences, by being honest about your own doubts, and by taking an interest in them as a person: “What would make this a good year for you?” Never use what they tell you against anyone.',
        'Self-orientation shows in small ways: steering every conversation to your next phase, talking about Vantage, needing to be right, finishing their sentences. The fix is easy to say and hard to do: listen longer, ask one more question, and sometimes advise less work than you could sell. “You don’t need us for this part; your planner can do it.” That sentence pays back many times.',
      ],
      example: {
        kind: 'faded',
        text: 'Six weeks into a project at a grid operator. Your analysis is strong. But the sponsor has cancelled two of your fortnightly meetings, and a team lead tells you she called your last report “a lot of slides”. Looking back, you have been sending 25-page decks two days late, and in meetings you mostly presented.',
        ask: 'What would you do next?',
        reveal: 'Credibility is not the problem; reliability and intimacy are, and the decks show self-orientation. Change the rhythm: a one-page update, sent the same day, every time. Ask for 30 minutes, not to present but to listen: “I have the feeling our updates aren’t helping you. What would be useful?” Then ask what is on her mind beyond this project. Keep the next three promises small and on time. In a month, ask her again.',
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
          q: 'Why can advising less paid work grow an account?',
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
      },
      sayIt: 'Explain to a junior consultant in 60 seconds what the trust equation is and which part most consultants get wrong.',
      terms: [
        { term: 'Trust equation', def: 'Credibility plus reliability plus intimacy, divided by self-orientation.' },
        { term: 'Self-orientation', def: 'How much you focus on yourself, your fee and being right instead of on the client.' },
        { term: 'Intimacy', def: 'How safe the client feels telling you what really worries them.' },
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
        'Your advice is only worth paying for if it is independent. That means no money from anyone but the client for the advice you give them. If you have a link with a vendor, a partner or a former employer, say so in writing before you advise. Disclosing early costs you nothing; being found out later costs you the client and your name.',
        'Telling the client what they don’t want to hear. Prepare it: facts first, then your conclusion, then what you recommend. Say it to the sponsor alone before any group. Script: “I have to tell you something you won’t like. The data shows the planning tool isn’t why cancellations are high; the materials process is. I’d rather tell you now than in front of the board.” Then stop and let them react.',
        'Conflicts of interest also come in quieter forms. Working for two competing manufacturers on the same topic. Being hired to “confirm” a decision already taken. Advising on a follow-up project you would deliver yourself. The test: would you be comfortable if the client read your reasoning and your invoice side by side? If not, disclose it or step back.',
        'Confidentiality: what you learn at one client stays there. Share lessons anonymously, never names, numbers or documents. Ask permission before using a client as a case, and show them the text. At grid operators, expect rules on network data and security too; ask on day one what you may store and where.',
      ],
      example: {
        kind: 'faded',
        text: 'A plant director hired Vantage to “roll out” a new shift pattern he has already announced. Your analysis shows it will cost about 6% of output on the bottleneck line, because the handovers fall in the busiest hour. He pays your invoice, and he has asked you to present “support for the plan” to the works council next week.',
        ask: 'What would you do next?',
        reveal: 'Don’t present something you don’t believe, and don’t ambush him either. Remember that the works council has a consent right on working-hours schemes (WOR article 27), so a flawed plan sold as sound is a risk for him too. Ask for an hour alone with him this week. Show the data: the handover timing and the 6% loss. Then offer a way forward: move the handover by 45 minutes, or overlap the shifts on the bottleneck, and the pattern can still work. Say plainly: “I can present the plan with this change. I can’t present it as it stands and tell the works council it’s sound.” Most directors respect that. If he doesn’t, it is better to lose this assignment than your name.',
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
        scene: 'You’re at a grid operator. The sponsor asks you to add a line to the final report saying the new contractor “performed well”. Your data shows the contractor caused about a third of the cancellations.',
        ask: 'What do you say?',
        model: '“I understand why you’d like that line, and I don’t want to make things hard with the contractor. But the data shows they caused about a third of the cancellations, so I can’t write that. I can describe it factually and add what they have already improved. Shall we look at the wording together?”',
        rubric: [
          'Declines to write something untrue',
          'Shows the data and stays respectful',
          'Offers an honest alternative wording',
        ],
      },
      sayIt: 'Explain to a client in 60 seconds why you will sometimes tell them things they don’t want to hear, and why that is what they pay for.',
      terms: [
        { term: 'Independence', def: 'Being paid only by the client for your advice, with no interest in a particular answer.' },
        { term: 'Conflict of interest', def: 'A situation where your own gain could bend the advice you give.' },
        { term: 'Disclosure', def: 'Telling the client in writing, in advance, about any link that could affect your advice.' },
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
        'Growing an account is not selling. It is doing the work so well, and so visibly, that the next problem comes to you. A second project at a client you know costs a few hours of conversation; a new client can take months of meetings and proposals.',
        'Follow up after the project ends: a call at 3 months and a visit at 6. “How is the cancellation rate holding? Anything slipping?” No invoice, no pitch. It protects the result, and it is often when clients mention the next problem: “Now that planning works, our warehouse is the mess.” That is an adjacent problem, and you heard it first.',
        'Adjacent problems are the honest route. You see them during the work: the maintenance backlog behind the OEE losses, the poor data behind the planning issues. Note them, and raise them once, at the right moment, usually at close-out: “Two things I saw that are outside our scope, but you should know about.” Then let the client decide whether they want help, and from whom.',
        'Widen the relationships. If you only know the sponsor, the account ends when she changes jobs. Build real contact with two or three others: the controller, the line manager who owns the benefit, the IT lead. Not over lunches, but by being useful to them in the project. And when someone you worked with moves to another company, congratulate them; that is often where your next client comes from.',
      ],
      example: {
        kind: 'faded',
        text: 'Vantage closed a successful project at a food producer in June: changeover times down 40%. Since then, nothing. It is now October. Your sponsor, the operations manager, has just been promoted to plant director. During the project you noticed that their maintenance is mostly reactive: about 60% of maintenance hours go to breakdowns.',
        ask: 'What would you do next?',
        reveal: 'Congratulate her on the promotion, personally, and ask her for a coffee, not a meeting. Start with the old result: “How are the changeovers holding?” If they’ve slipped, offer an hour of help, free. Then, if the moment is right: “When we worked on the lines, I noticed about 60% of maintenance hours go to breakdowns. Is that on your list now?” Don’t bring a proposal. If she is interested, suggest a short diagnostic, as last time. And get to know the new operations manager who took her old job.',
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
        scene: 'You’re at a grid operator, closing a project. The regional manager says: “Great work. We’ll be in touch if we need anything.”',
        ask: 'What do you say before you leave?',
        model: '“Thank you. I’d like to call you in three months to see how the numbers are holding, no strings attached. And two things I noticed outside our scope: the hand-offs with the contractor and the quality of the outage data. Neither is urgent today, but they will limit what you get from this. Happy to talk them through whenever it suits you.”',
        rubric: [
          'Sets a concrete follow-up moment without a sales pitch',
          'Names the adjacent problems once and briefly',
          'Leaves the choice with the client',
        ],
      },
      sayIt: 'Explain to a fellow freelancer in 60 seconds how you grow an account without selling.',
      terms: [
        { term: 'Account', def: 'A client organisation you work with over time, across several projects and people.' },
        { term: 'Adjacent problem', def: 'A problem close to the one you solved, which you saw while doing the work.' },
        { term: 'Follow-up', def: 'Unpaid contact after a project to check the result holds, without a pitch.' },
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
        'Do the capacity maths first. About 200 days remain after holidays, public holidays and sickness. Selling, admin, writing and learning take 30–40%. That leaves 120–140 billable days. At €1,200 a day and 130 days, revenue is €156k before costs and tax. Plan on fewer in your first years, because you will sell more. It also means three or four clients at once, not eight.',
        'Positioning is a choice of who you are for: “I help grid operators and manufacturers turn their performance numbers into steering that management acts on.” Narrow feels risky, but a narrow position is easier to remember and to recommend. A plant director won’t remember “a consultant”; he remembers “the one who fixed our cancellation rate”.',
        'Case histories are your strongest material. One page each: the situation in numbers, what you did, the result in numbers, and a sentence from the client, with permission. “Cancellations from 14% to 9% in six months.” Three solid cases beat a website full of services. Collect the numbers and the permission at close-out; later is too late.',
        'Build the network on purpose: former colleagues, clients who moved on, two or three partners who refer work to you and you to them. If one in three proposals wins and you need six projects a year, you need about 18 proposals. Track that monthly; when it dips, the empty months come about a quarter later.',
        'Say no to the wrong work: outside your position, a sponsor who wants confirmation rather than change, or a price that only works if everything goes well. Script: “This isn’t where I’m strongest; I’d recommend someone who is.” A wrong project costs not just the days, but the case you could have built instead.',
      ],
      example: {
        kind: 'faded',
        text: 'Your first year as Vantage. You have 60 billable days booked for the next six months, at two clients. A large engineering firm offers you 100 days of subcontract work at €850 a day, doing general project administration on an IT migration. A grid operator you would love to work for is talking about a diagnostic in three months, perhaps 15 days at €1,200.',
        ask: 'What would you weigh, and what would you decide?',
        reveal: 'Do the sums. The subcontract is €85,000 and fills your diary: steady income, but at €850, outside your position, and with almost no room left for the grid operator or for selling. With 60 days already booked, 100 more makes 160 in a year, above what you can really bill, with no time to build cases. Options: negotiate it down, for example two days a week for four months, about 35 days or €29,750, which keeps room for the diagnostic and your network. Or decline and put the time into landing the grid operator. If cash is tight, the partial deal is the honest middle. Either way, decide by your position, not only by the diary.',
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
      },
      sayIt: 'Explain to a friend in 60 seconds why a consultant with 130 billable days a year should still say no to work.',
      terms: [
        { term: 'Positioning', def: 'A clear choice of which clients and problems you are for.' },
        { term: 'Billable days', def: 'The days a client pays for, usually 120–140 a year for an independent.' },
        { term: 'Case history', def: 'A one-page story of a project with numbers before and after, used with permission.' },
        { term: 'Pipeline', def: 'The conversations and proposals that will become your work in the coming months.' },
      ],
    },
  ],
};
