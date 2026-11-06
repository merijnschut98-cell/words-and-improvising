// pm.close (EN): Close, finishing well: proving results, acceptance, retrospective, closing report, follow-up and your own reflection.
export default {
  lessons: [
    {
      id: 'pm.close.results',
      title: 'Proving results',
      pre: [
        {
          q: 'Downtime, the share of planned hours a line stands still, fell from 12% to 9% in the four weeks after your project. In the baseline, the weeks measured before the change, weekly values ranged from 8% to 15%. What can you honestly say?',
          options: ['The project cut downtime by 25%', 'The project failed', 'Not much yet: the drop is within normal variation', 'Downtime is now under control'],
          answer: 'Not much yet: the drop is within normal variation',
          why: 'With weekly values swinging from 8 to 15%, four weeks at 9% could be noise: ordinary ups and downs. You need more weeks, or a comparison line, before you claim anything.',
        },
      ],
      teach: [
        'A result claim needs a baseline: the performance before the change, measured the same way as after. Same definition, same data source, same period length, similar conditions.\n\nIf the baseline counted stops over 5 minutes and the after-data counts stops over 2, the comparison is worthless. Agree the definition at the start, write it down, and keep the raw data, so anyone can redo the sum.',
        'Separate your effect from noise: the normal week-to-week swing that has nothing to do with you. If the baseline swings between 11 and 17%, a drop of 2 points after four weeks proves little. Use roughly as many weeks after as before; a common rule of thumb is 8 to 12.\n\nCheck what else changed: volume, product mix, season, new staff. A comparison group, a similar line or region that didn’t get the change, is the strongest evidence you can get.',
        'Money in the client’s terms. Freed hours are only money if something changes on the books: overtime cut, a shift dropped, more product sold, an investment avoided. At a grid operator it may be customers connected sooner, or fewer customer minutes lost: minutes without power, added up over all customers.\n\nIf extra output can be sold, value an hour at contribution margin: sales price minus variable costs such as material and energy. Let the client’s controller, the finance person who owns the numbers, check the sum.',
        'What experts argue about. Some want a formal statistical test; most practitioners settle for a run chart, weekly values plotted over time, plus a comparison group.\n\nWatch for regression to the mean: projects often start after a bad spell, and numbers drift back toward normal anyway, so part of your “gain” may be that. A result that fades once you leave is another warning sign. Measure again three months after closing.',
        'The people side: don’t overclaim. Say what you know and what you don’t: “Downtime went from 12 to 8%. About one point is likely the lower summer volume; the rest we attribute to the changes.”\n\nWelcome a sceptical controller; their approval is worth more than your slide. Give the credit to the team that did the work. A sharp question for yourself: “If a board member challenges this number, who besides me will defend it?”',
      ],
      example: {
        kind: 'worked',
        text: 'At a bottling plant, line 3 had downtime of 14% over 12 baseline weeks (weekly range 11 to 17%). In the 10 weeks after the changes it was 9% (range 7 to 11%), while line 4, untouched, stayed at 13%. The ranges barely overlap and the comparison line didn’t move, so the effect is very likely real.\n\nLine 3 is planned for 6,000 hours a year: 5 points less downtime is 300 extra running hours. The plant is sold out, so those hours become extra product: the controller values an hour at 450 euro contribution margin, so 300 × 450 = about 135,000 euro a year. You present it together with the controller, who checked it.',
      },
      said: 'What you hear in projects: “Nice numbers, but sales were lower this quarter anyway. How much of this is really you?”',
      recall: [
        {
          q: 'A line is planned for 5,000 hours a year. Downtime, as a share of those hours, drops by 4 percentage points. The line is sold out, so each extra running hour is worth 300 euro of contribution margin. What is the yearly value in euro?',
          number: 60000,
          tolerance: 500,
          unit: 'euro',
          why: '5,000 × 0.04 = 200 extra running hours; 200 × 300 = 60,000 euro a year.',
        },
        {
          q: 'When are freed-up hours actually money?',
          options: ['Always, at the standard hourly rate', 'When something changes on the books, like overtime cut or more product sold', 'Only when the consultant says so', 'Never, hours are not money'],
          answer: 'When something changes on the books, like overtime cut or more product sold',
          why: 'Hours that are freed but not used change nothing financially.',
        },
        {
          q: 'What is the strongest evidence that the change, not something else, caused the improvement?',
          options: ['The team feels it is better', 'One very good week', 'The sponsor’s opinion', 'A comparison line or region without the change that didn’t improve'],
          answer: 'A comparison line or region without the change that didn’t improve',
          why: 'If the untouched line stayed flat, season or volume can’t explain your gain.',
        },
        {
          q: 'The client’s controller, the finance person who owns the numbers, challenges your savings. How do you react?',
          options: ['Welcome it and go through the calculation with them', 'Defend the number firmly', 'Ask the sponsor to overrule them', 'Remove the savings from the report'],
          answer: 'Welcome it and go through the calculation with them',
          why: 'A number the controller signed off is believed; yours alone is not.',
        },
      ],
      situation: {
        scene: 'You’re at a grid operator. Your project cut last-week cancellations, planned jobs called off in the final week before their date, from 18% to 9%. The sponsor, the manager who owns the project, wants to report “40,000 hours saved” to the board, based on a rough calculation by a team member.',
        ask: 'What do you say?',
        model: '“The drop from 18 to 9% is solid, I’d lead with that. Before we put 40,000 hours in front of the board, can we check with the controller how it’s calculated and what it actually freed up, for example fewer wasted crew trips or more jobs done per week? A smaller number the controller backs is stronger than a big one someone can shoot down.”',
        rubric: [
          'Leads with the measured result',
          'Questions the savings calculation before it goes to the board',
          'Involves the controller and translates hours into real effects',
        ],
        pushback: {
          lines: [
            '“The board likes a big number. 40,000 hours is what people will remember.”',
            '“Nobody is going to check the calculation. Why make it harder for ourselves?”',
          ],
          model: '“I get it, a big number sticks. But if one board member asks how we got it, we can’t defend it. What we can prove: cancellations halved, from 18 to 9%. I’ll work out with the controller how many hours that really frees up, and turn it into one sentence that still sounds strong.”',
          rubric: [
            'Acknowledges the appeal of a big number',
            'Holds to a result that can be defended',
            'Proposes a concrete, strong alternative message',
          ],
        },
      },
      sayIt: 'Explain to a sponsor in 60 seconds how you prove a project result in a way the controller accepts.',
      terms: [
        { term: 'Baseline', def: 'The performance before the change, measured with the same definition as after.' },
        { term: 'Noise', def: 'Normal week-to-week variation that is not caused by your change.' },
        { term: 'Comparison group', def: 'A similar line or region without the change, to separate your effect from other causes.' },
        { term: 'Contribution margin', def: 'Sales price minus variable costs such as material and energy: what one extra unit or hour of sold output adds to profit.' },
        { term: 'Controller', def: 'The finance person at the client who owns the numbers and checks calculations of savings and costs.' },
        { term: 'Regression to the mean', def: 'Numbers drifting back toward normal after an unusually bad or good spell, with or without your change.' },
      ],
    },
    {
      id: 'pm.close.acceptance',
      title: 'Formal acceptance',
      pre: [
        {
          q: 'When should acceptance criteria, the measurable conditions that say the project is done, be agreed?',
          options: ['At the end, when you know what was achieved', 'At the start, in the project charter', 'Halfway, once the team knows the details', 'They are not needed if the client is happy'],
          answer: 'At the start, in the project charter',
          why: 'Criteria agreed at the end become a negotiation; at the start they are a target. The project charter is the short written agreement on goal, scope and roles.',
        },
      ],
      teach: [
        'Acceptance criteria say when the project is done. Make them measurable and agree them at the start, in the project charter: the short written agreement on goal, scope (what is in and what is out), roles and timing. For example: “Cancellations below 8% for six consecutive weeks in the pilot region; readiness check used in all regions; owner trained.”\n\nWrite down who signs off. Without criteria, the project ends when someone gets tired of it.',
        'The sign-off is the sponsor’s formal yes. Go through each criterion with the sponsor, the manager who owns and pays for the project, with the evidence on one page: met, partly met or not met. Then a signature, or a written confirmation by e-mail.\n\nFormal acceptance protects both sides: the client knows what they got, and you can close the project and invoice. Without it, the last 10% of a project can drag on for months.',
        'Use an open points list. Not everything will be perfect.\n\nList what remains: item, owner, date. The owner sits in the line organisation: the normal hierarchy that runs the daily work, as opposed to the temporary project team. Accept the project with open points rather than waiting for everything to be done. Points owned by the line survive the handover; points owned by “the project” die when it ends.',
        'What experts argue about: accept on outputs or on outcomes? Outputs are what you delivered, such as a trained team or a new check. Outcomes are the results, like fewer cancellations, and they often take months to show.\n\nMethods like PRINCE2, a widely used project method, close on outputs and plan a benefits review later. Many sponsors want outcomes in the criteria. A workable middle: outputs, plus a few weeks of outcome data, plus a review date three to six months out.',
        'The people side: clients sometimes delay sign-off with new wishes. Say: “Let’s check against the criteria we agreed in March. These new wishes are good; they go on the list for the line or a follow-up project.”\n\nIf criteria were never agreed, own that honestly and agree them now, before the last week. A sharp question for the kick-off, the first project meeting: “What would you need to see to sign this off?”',
      ],
      example: {
        kind: 'worked',
        text: 'At a cable manufacturer, the charter said: on-time delivery (the share of orders shipped on the promised date) at least 90% for eight weeks; a weekly planning meeting run by the planning manager; the capacity model, a spreadsheet of hours needed versus hours available, documented and explained to both planners.\n\nIn the closing meeting you show one page: on-time delivery 91 to 94% for nine weeks (met), planning manager chairs since week 7 (met), model documented but not yet explained to the second planner (partly met).\n\nThe sponsor asks about a link to the sales forecast, which was never in scope. You say: “Good idea; I’d put it on the open points list for IT.” Open points: train second planner (planning manager, 15 May), sales forecast link (IT lead, to assess by June). He signs.',
      },
      said: 'What you hear in projects: “Before we sign off, could you just also have a look at the forecast?” The forecast is the sales prediction; it was never part of the agreed work.',
      recall: [
        {
          q: 'Which is a good acceptance criterion?',
          options: ['“The planning is better.”', '“The team is satisfied.”', '“The project went well.”', '“Cancellations below 8% for six consecutive weeks in the pilot region.”'],
          answer: '“Cancellations below 8% for six consecutive weeks in the pilot region.”',
          why: 'It is measurable, has a time span and a place, and leaves no room for debate.',
        },
        {
          q: 'One criterion is only partly met. What do you do?',
          options: ['Delay acceptance until everything is perfect', 'Accept with an open points list: item, owner in the line, date', 'Hide it in the appendix', 'Remove the criterion'],
          answer: 'Accept with an open points list: item, owner in the line, date',
          why: 'Open points owned by the line organisation close the project without losing the loose ends.',
        },
        {
          q: 'The client brings a new wish just before sign-off. What do you say?',
          options: ['“Sure, we’ll add it before closing.”', '“That’s not my problem.”', '“Let’s check against the agreed criteria; this goes on the list for the line or a follow-up.”', '“Then we need a new contract.”'],
          answer: '“Let’s check against the agreed criteria; this goes on the list for the line or a follow-up.”',
          why: 'You keep the agreement and still take the wish seriously.',
        },
        {
          q: 'Why does formal acceptance protect both sides?',
          options: ['The client knows what they got, and you can close and invoice', 'It is required by law', 'It prevents any follow-up work', 'It replaces the closing report'],
          answer: 'The client knows what they got, and you can close and invoice',
          why: 'Clarity about what was delivered ends the project cleanly for both.',
        },
      ],
      situation: {
        scene: 'You’re at a food plant. Your project ends in two weeks. You realise the acceptance criteria were never written down; at the kick-off, the first project meeting, the sponsor only said “improve line efficiency”.',
        ask: 'What do you do?',
        model: 'Own it and fix it now. Book 30 minutes with the sponsor: “We never wrote down exactly when this project is done; that’s on me. Here’s what I propose, based on what we’ve been working toward: OEE, the share of planned time the line makes good product at full speed, above 70% for four weeks on lines 1 and 2, and the shift leads running the daily review.” Agree it, then prepare the sign-off with evidence and an open points list.',
        rubric: [
          'Takes responsibility for the missing criteria',
          'Proposes concrete, measurable criteria based on the actual goal',
          'Prepares sign-off with evidence and an open points list',
        ],
        pushback: {
          lines: [
            '“Why make it formal now? Everyone can see the line runs better. Let’s not make it bureaucratic.”',
            '“If you write criteria now, it looks like you’re moving the goalposts to look good.”',
          ],
          model: '“Everyone sees it now, and in six months nobody remembers what we agreed. I don’t want to move anything: on one page I’ll put what we measured at the start and what we measure now, and you check whether it’s fair. Shall we go through it on Thursday?”',
          rubric: [
            'Acknowledges the visible result and his worry',
            'Holds to a written, agreed acceptance',
            'Proposes a short, concrete step he controls',
          ],
        },
      },
      sayIt: 'Explain to a new project lead in 60 seconds why you agree acceptance criteria at the start and how sign-off works.',
      terms: [
        { term: 'Acceptance criteria', def: 'Measurable conditions, agreed at the start, that say when the project is done.' },
        { term: 'Project charter', def: 'The short written agreement at the start on goal, scope, roles and timing.' },
        { term: 'Sign-off', def: 'The sponsor’s formal confirmation that the project is accepted.' },
        { term: 'Open points list', def: 'Remaining items, each with an owner in the line and a date.' },
        { term: 'Line organisation', def: 'The normal hierarchy that runs the daily work, as opposed to the temporary project team.' },
        { term: 'Benefits review', def: 'A planned check, months after closing, of whether the promised results really came.' },
      ],
    },
    {
      id: 'pm.close.retro',
      title: 'A retrospective people learn from',
      pre: [
        {
          q: 'What happens to most “lessons learned” documents, the write-ups of what a project taught?',
          options: ['They are used in the next project', 'They are never read again', 'They are sent to the board', 'They become company policy'],
          answer: 'They are never read again',
          why: 'Lessons only change anything when they become actions someone owns.',
        },
      ],
      teach: [
        'A retrospective is a structured look back: what do we repeat, what do we change? A simple format: draw a timeline of the project on the wall and let everyone mark highs and lows. Then three questions: what went well, what didn’t, and what would we do differently next time?\n\nPlan 60 to 90 minutes, with the client team, not just the consultants. Many companies call it an evaluation or “lessons learned”.',
        'Psychological safety comes first: the shared sense that you can speak up without being punished or laughed at. People only say what really happened if it feels safe.\n\nStart with yourself as lead: name one thing you would do differently. Have people write on sticky notes before they talk, so quiet voices count. Talk about what happened and why, not who failed. If the sponsor’s presence will silence people, run a separate session without him.',
        'Turn each lesson into an action. “Communication could be better” changes nothing. “Next project: the shift leads hear about changes a week before the operators; owner: the operations manager” does.\n\nPick two or three, not twenty, each with an owner and a moment it will be used, such as the next kick-off. Then check later whether it was used; otherwise the list joins the drawer of old lessons learned.',
        'What experts argue about. Norm Kerth’s “prime directive” (2001) asks everyone to assume people did the best they could with what they knew at the time. Critics say it can paper over real problems, such as a manager who never decided.\n\nA second debate: must the facilitator, the person who runs the session, be neutral? For a tense project most say yes: ask a colleague from outside the project, so you can take part yourself.',
        'The people side: retrospectives can become blame sessions. When it heads that way, steer back: “Let’s look at what made it hard, not who.”\n\nWhen you don’t know how to handle a tense moment, pause and ask the group: “What do we need to talk about this safely?” A sharp closing question: “What is the one thing from today you will actually do differently?”',
      ],
      example: {
        kind: 'worked',
        text: 'At the end of a project at a grid operator, you run a 75-minute retro with six client people and your colleague. On the timeline, the low is clear: weeks 6 to 9, when system access was late.\n\nYou start: “One thing I’d do differently: I should have escalated the access issue, taken it to the sponsor, in week 3, not week 6.” Then everyone writes on sticky notes.\n\nThemes: the pilot, the small first trial, worked because two planners helped design it; the field crews heard about it too late. Actions: for the next rollout, field team leaders are in the design from week 1 (owner: head of execution); IT access is requested in the first week of any project (owner: the PMO lead, who runs the project office).',
      },
      said: 'What you hear in projects: “Lessons learned? We wrote those last time too. Nothing ever happens with them.”',
      recall: [
        {
          q: 'Which is a lesson turned into an action?',
          options: ['“Communication could be better.”', '“We should plan more.”', '“IT access is requested in week 1 of every project; owner: the PMO lead.”', '“Everyone did their best.”'],
          answer: '“IT access is requested in week 1 of every project; owner: the PMO lead.”',
          why: 'It is specific, has an owner (the head of the project office) and a moment it will be used.',
        },
        {
          q: 'How do you as lead make a retrospective safe?',
          options: ['Start by naming one thing you would do differently yourself', 'Let the sponsor open it', 'Keep it short so nobody has to speak', 'Decide the lessons in advance'],
          answer: 'Start by naming one thing you would do differently yourself',
          why: 'When the lead shows it is safe to admit mistakes, others follow.',
        },
        {
          q: 'Why have people write before they talk?',
          options: ['It is faster', 'To have a record', 'So quiet voices count, not only the first one spoken', 'Because the sponsor reads them'],
          answer: 'So quiet voices count, not only the first one spoken',
          why: 'Writing first gets everyone’s view before the group converges on one story.',
        },
        {
          q: 'The retro is turning into a blame session. What do you say?',
          options: ['“Let’s look at what made it hard, not who.”', '“Who was responsible for that?”', '“Let’s end here.”', '“I agree, that was a failure.”'],
          answer: '“Let’s look at what made it hard, not who.”',
          why: 'It steers back to causes, which is where learning happens.',
        },
      ],
      situation: {
        scene: 'You’re closing a project at a metal manufacturer. The plant manager, the head of the whole site, wants to chair the retrospective himself. Last week, two team members told you privately that his late decisions slowed the project.',
        ask: 'How do you set up the retrospective?',
        model: 'I’d suggest to the plant manager that I facilitate, so he can take part. And I’d propose a short session with the team first, without him, so they can speak freely, and then bring the themes, without names, into a joint session. I’d also tell him privately that decision speed came up, so he isn’t surprised.',
        rubric: [
          'Proposes a neutral facilitator instead of the plant manager',
          'Creates a safe space for the team to speak',
          'Prepares the plant manager privately for sensitive feedback',
        ],
        pushback: {
          lines: [
            '“It’s my plant and my project. Of course I chair the retrospective.”',
            '“If people have something to say about me, they can say it to my face.”',
          ],
          model: '“It is your project, and it matters that you’re there. If you chair it, people will wait to hear what you think first. Let me facilitate, and you open by naming one thing you would do differently yourself. Then the others will dare to as well.”',
          rubric: [
            'Acknowledges his ownership and his openness',
            'Holds to a neutral facilitator for honest input',
            'Proposes a concrete role for him that invites openness',
          ],
        },
      },
      sayIt: 'Explain to a client team in 60 seconds how you run a retrospective that leads to real changes.',
      terms: [
        { term: 'Retrospective', def: 'A structured look back at the project to learn what to repeat and what to change.' },
        { term: 'Timeline', def: 'The project laid out in time, with highs and lows, as a start for discussion.' },
        { term: 'Psychological safety', def: 'The shared sense in a group that you can speak up or admit a mistake without being punished or mocked.' },
        { term: 'Facilitator', def: 'The person who runs a session and guards the process, without steering the content.' },
        { term: 'Action', def: 'A lesson made specific, with an owner and a moment it will be used.' },
      ],
    },
    {
      id: 'pm.close.report',
      title: 'Closing report and presentation',
      pre: [
        {
          q: 'In a closing presentation to the management team, the group of senior managers who run the company, what should come first?',
          options: ['The project background and approach', 'A thank you to everyone involved', 'The planning of the project', 'The result against the goal, in one sentence'],
          answer: 'The result against the goal, in one sentence',
          why: 'Senior people want the answer first; the rest is support.',
        },
      ],
      teach: [
        'The closing report: one page, then appendices. The page holds the goal as agreed, the result against it in numbers, what changed in how people work, what is still open and who owns it, and what you recommend next.\n\nAnyone who reads only this page should know what the project delivered. An appendix holds the detail, the analyses and data, for whoever wants to check.',
        'Answer first: start with the conclusion. “Cancellations went from 18 to 7%, and the new check is now run by the planning teams themselves.” Then support it.\n\nThis is the pyramid principle of Barbara Minto, a former McKinsey consultant: the main message on top, about three supporting points under it, the evidence under those. Use one chart that shows before and after, not twelve.',
        'Tell it as a story: where we were, what was in the way, what we did, where we are now.\n\nThen what’s next: a clear recommendation, based on what you saw, not on what you want to sell. “The biggest remaining loss is material availability; I’d tackle that next.” Name what the client can do without you. That makes the recommendation credible.',
        'What experts argue about: a deck, a set of slides, or a written memo? Amazon is known for banning slides in senior meetings and starting with a six-page memo read in silence; most consulting firms live in slides.\n\nA common middle: the one page sent two days ahead, then five to eight slides in the room. Typical failure: 30 slides of analysis with the result on slide 27, by which time the director has left.',
        'The people side: let the client owner present part of it, ideally the result and how it now runs. It shows ownership and gives them credit in front of their bosses.\n\nWhen a director asks something you don’t know, say: “I don’t know exactly; I’ll check and send it to you tomorrow.” A sharp question while preparing: “If they remember one sentence, which one should it be?”',
      ],
      example: {
        kind: 'worked',
        text: 'Closing a downtime project at a dairy plant. Your one page: Goal: cut unplanned downtime, stops nobody scheduled, on lines 1 to 3 from 15% to under 10% of planned hours. Result: 9% for ten weeks, about 160,000 euro a year in extra output, checked by the controller.\n\nWhat changed: daily 15-minute stop review led by the shift leads; top-three causes fixed. Open: line 3 sensor replacement (maintenance manager, June). Next: changeovers, switching a line from one product to the next, are now the biggest loss; recommend a focused project, or the team can start with the method they now know.\n\nIn the presentation, the production manager presents the result and the daily review; you present what’s next.',
      },
      said: 'What you hear in projects: “Can you put it all in a deck? Management likes to see the whole story.”',
      recall: [
        {
          q: 'What must the one-page closing summary contain?',
          options: ['The full project history', 'Goal, result in numbers, what changed, open points with owners, and next steps', 'All the analyses', 'Only the savings'],
          answer: 'Goal, result in numbers, what changed, open points with owners, and next steps',
          why: 'It lets anyone see what the project delivered and what happens now.',
        },
        {
          q: 'Why let the client owner present part of the closing?',
          options: ['It saves you preparation time', 'It is a formal rule', 'It shows ownership and gives them credit in front of their bosses', 'So you can avoid difficult questions'],
          answer: 'It shows ownership and gives them credit in front of their bosses',
          why: 'Visible ownership makes the result last and builds the relationship.',
        },
        {
          q: 'What makes a recommendation for next steps credible?',
          options: ['It names what the client can do without you, based on what you saw', 'It always proposes a follow-up project', 'It is vague so it fits any situation', 'It comes from the sales team'],
          answer: 'It names what the client can do without you, based on what you saw',
          why: 'Advice that doesn’t only point to more work for you is trusted.',
        },
        {
          q: 'A director asks a detail you don’t know. What do you do?',
          options: ['Give your best guess as fact', 'Change the subject', 'Ask a team member to answer', 'Say you don’t know exactly and will send it tomorrow'],
          answer: 'Say you don’t know exactly and will send it tomorrow',
          why: 'Honest and reliable beats a confident wrong answer.',
        },
      ],
      situation: {
        scene: 'You’re preparing the closing presentation at a grid operator. Your manager suggests a 30-slide deck with all the analyses, “to show how much work we did”.',
        ask: 'What do you propose instead?',
        model: 'I’d suggest one page with goal, result, what changed, open points and next steps, plus one before-and-after chart, and the analyses in an appendix for whoever wants them. In the room that becomes a handful of slides. The client cares about what changed for them, not how much we worked. And I’d ask the planning manager to present the result herself.',
        rubric: [
          'Proposes a short, answer-first summary with appendices',
          'Focuses on what changed for the client',
          'Gives the client owner a role in presenting',
        ],
        pushback: {
          lines: [
            '“The client paid a lot. They need to see the work, otherwise it looks thin.”',
            '“Put the analyses in an appendix, fine, but a handful of slides isn’t enough for a closing.”',
          ],
          model: '“They should see the work, I agree. What they’ll remember is the result and what to do next. So: the one page as a handout, five slides in the room, result, cause, what changed, what’s next, and every analysis in an appendix to read later. I’ll show you a draft on Wednesday.”',
          rubric: [
            'Acknowledges the wish to show the work',
            'Holds to a short presentation aimed at decisions',
            'Proposes a concrete structure and a date for a draft',
          ],
        },
      },
      sayIt: 'Explain to a colleague in 60 seconds how you build a closing report on one page.',
      terms: [
        { term: 'Closing report', def: 'One page with goal, result, what changed, open points and next steps, plus appendices.' },
        { term: 'Answer first', def: 'Starting with the conclusion, then supporting it.' },
        { term: 'Pyramid principle', def: 'Barbara Minto’s structure: the main message on top, a few supporting points under it, the evidence under those.' },
        { term: 'Appendix', def: 'Detail for those who want it, kept out of the main story.' },
        { term: 'Deck', def: 'A set of presentation slides; consultants’ everyday word for a presentation.' },
      ],
    },
    {
      id: 'pm.close.followup',
      title: 'Follow-up and the next project',
      pre: [
        {
          q: 'Where do most new consulting projects come from?',
          options: ['Cold calls', 'Public tenders only', 'Existing clients and their referrals', 'Advertising'],
          answer: 'Existing clients and their referrals',
          why: 'Trust built by delivering is the strongest source of new work. A referral is a client introducing you to someone else; a public tender is a formal open competition for a contract.',
        },
      ],
      teach: [
        'The next project grows from this one. The open points list, the losses you saw but didn’t tackle, and the people you worked with are where it starts.\n\nYou don’t need to sell; you need to stay in touch and stay useful. In most consulting firms, existing clients bring in most of the work, plus a referral now and then: a client introducing you to someone else. Cold calls rarely work.',
        'Stay in touch without being pushy. A follow-up is a planned contact after the project, for example at one, three and six months, to check that results hold. Those are natural moments to talk.\n\nIn between, send something useful once in a while: a short article that fits their problem, a benchmark (how comparable companies score on the same measure), an introduction to someone who solved something similar. Ask about their next challenge, and listen.',
        'Propose only when there is a real problem the client recognises. “At the three-month follow-up you mentioned material shortages are now your biggest headache. Would it help if I sketched how we could look at that?”\n\nA proposal to a problem they named is help; a proposal to a problem you named is selling. If they say no, drop it and stay useful.',
        'What experts argue about. The Trusted Advisor (Maister, Green and Galford, 2000) says trust grows from credibility, reliability and intimacy, and shrinks with self-orientation: visibly thinking about your own sale. Someone trusted like that is a trusted advisor. Others say juniors should simply learn to sell and track targets.\n\nA typical failure: no contact for a year, then a call with an offer. A sharp question at a follow-up: “What could make this result fall apart?”',
        'The people side: as a junior, account management, building a lasting client relationship beyond one project, may feel uncomfortable. Think of it as helping someone you know with a problem you understand.\n\nAsk for feedback and, if they were happy, for a reference: permission to name them, or to let a new prospect call them. When you don’t know whether there’s a next project, simply ask: “What’s on your plate for next year?”',
      ],
      example: {
        kind: 'worked',
        text: 'After a planning project at a grid operator, you agreed follow-ups at one, three and six months. At one month you check the KPI, the key number the project steered on, with the owner.\n\nIn month two you send the planning manager a short article about material reservations, because she mentioned it in the retro. At three months she says: “Planning is fine now, but half our delays are materials.” You ask what she’s tried and whether it would help if you sketched an approach.\n\nShe says yes; you send a one-page outline a week later. It becomes a project in the next quarter, with her as sponsor.',
      },
      said: 'What you hear in projects: “Good to hear from you. Actually, there’s something else we’re struggling with.”',
      recall: [
        {
          q: 'What is the difference between helping and selling, in follow-up?',
          options: ['Helping is free, selling is paid', 'Helping responds to a problem the client named; selling pushes one you named', 'There is no difference', 'Selling is done by partners only'],
          answer: 'Helping responds to a problem the client named; selling pushes one you named',
          why: 'Proposals to a problem the client recognises are welcome.',
        },
        {
          q: 'What is a natural way to stay in touch after a project?',
          options: ['Weekly sales e-mails', 'Calling every month to ask for new work', 'Waiting until they call you', 'The agreed follow-ups plus something useful now and then'],
          answer: 'The agreed follow-ups plus something useful now and then',
          why: 'Planned check-ins and relevant help keep the relationship warm.',
        },
        {
          q: 'Where does the next project usually start?',
          options: ['Open points, losses you saw, and the people you worked with', 'A new marketing campaign', 'The client’s annual report', 'A tender from another region'],
          answer: 'Open points, losses you saw, and the people you worked with',
          why: 'You already know the problems and the people; that is your head start.',
        },
        {
          q: 'You don’t know whether the client has a next challenge. What do you do?',
          options: ['Assume there is none', 'Send a standard offer', 'Ask: “What’s on your plate for next year?”', 'Ask your manager to call them'],
          answer: 'Ask: “What’s on your plate for next year?”',
          why: 'A simple open question gives the client room to tell you.',
        },
      ],
      situation: {
        scene: 'You’re at the six-month follow-up of a project at a packaging plant. The results have held. The plant manager mentions in passing that a new production line arrives next year and “nobody really knows how we’ll staff it”.',
        ask: 'What do you do?',
        model: 'First acknowledge the results he kept, which is his credit. Then ask about the new line: “That sounds like a big step. What worries you most about it?” Listen, and if he recognises a problem I can help with, offer to sketch an approach on one page, with no obligation. If not, keep in touch and maybe introduce someone who did a similar ramp-up, the months of bringing a new line up to full output.',
        rubric: [
          'Credits the client for keeping the results',
          'Asks open questions about the new challenge and listens',
          'Offers help only for a problem the client recognises',
        ],
        pushback: {
          lines: [
            '“Oh, that’s for HR, not for you. It’s a year away anyway.”',
            '“I mentioned it in passing. Don’t turn it into a sales pitch.”',
          ],
          model: '“Fair, and I’m not pitching. A year goes fast when you have to staff a new line, and it touches the shift patterns we just set up. Could I send you three questions to think about? If something comes of it, we talk. If not, that’s fine too.”',
          rubric: [
            'Acknowledges that it was in passing, not a request',
            'Says briefly why it matters for him',
            'Proposes a light, concrete step without pressure',
          ],
        },
      },
      sayIt: 'Explain to a junior colleague in 60 seconds how you stay in touch with a client after a project without being pushy.',
      terms: [
        { term: 'Follow-up', def: 'A planned contact after the project to check results and stay in touch.' },
        { term: 'Account management', def: 'Building a lasting relationship with a client beyond one project.' },
        { term: 'Referral', def: 'A client introducing you to someone else who might need help.' },
        { term: 'Benchmark', def: 'How comparable companies score on the same measure, used as a reference point.' },
        { term: 'Trusted advisor', def: 'A consultant the client calls first with a problem, because trust has outgrown a single project.' },
        { term: 'Reference', def: 'A former client who lets you name them, or who talks to a new prospect about your work.' },
      ],
    },
    {
      id: 'pm.close.yourself',
      title: 'Your own reflection',
      pre: [
        {
          q: 'Which feedback question usually gets the most useful answer?',
          options: ['“How did I do?”', '“Any feedback?”', '“Was it OK?”', '“What is one thing I should do differently in my next project?”'],
          answer: '“What is one thing I should do differently in my next project?”',
          why: 'A specific question gets a specific answer; a general one gets “fine”.',
        },
      ],
      teach: [
        'Reflection means looking back on your own part, not the project’s. After each project, take an hour for yourself. Three questions: what went well because of what I did, what would I do differently, and what did I learn about clients, methods or myself?\n\nWrite it down. Two years from now, the pattern across projects will tell you more than any single one.',
        'Collect feedback from the client and a colleague. Ask a specific feedback question, in person or by phone, not in a form: “What’s one thing I should keep doing? One thing I should do differently?”\n\nListen, thank them, and don’t defend. If something surprises you, ask for an example: “When did you see that?” Feedback that stings is often the most useful.',
        'Build your case history: one page per project. Situation, what you did, the result in numbers, what you learned. Leave out confidential client data.\n\nUse it in your development talk, the regular conversation with your manager about how you grow; to prepare for the next client; and to tell credible stories: “At a grid operator we cut last-week cancellations from 18 to 7% by…” Concrete cases are how consultants build trust.',
        'What experts argue about. Kolb’s learning cycle (1984) says you learn from experience only when you reflect, draw a conclusion and try it out next time; without that last step, reflection is just remembering. Marshall Goldsmith prefers “feedforward”: ideas for the future instead of judgement on the past, because people defend the past.\n\nEither way, your blind spot, what others see in you and you don’t, only shows through other people.',
        'The people side: asking for feedback feels awkward, especially when the project was hard. Do it anyway; clients respect it.\n\nWhen you don’t know what to work on, ask a senior colleague who saw you work: “What would make me more effective at a client?” Typical failure: reflecting only after bad projects. Good projects hide lessons too. A sharp question for yourself: “What did I avoid on this project?”',
      ],
      example: {
        kind: 'worked',
        text: 'After a project at a metal works you take an hour. Went well: the coffee talk with the sceptical setter, who sets up the machines, turned him around.\n\nDifferently: from week 2 I waited three weeks to escalate the IT delay, because I didn’t want to look like I couldn’t handle it. Learned: senior clients prefer early bad news.\n\nYou call the plant manager: “One thing I should do differently next time?” He says: “Come to me sooner when things are stuck. I’d rather hear it in week 2.” Same message.\n\nYour case page: “Metal works, weekly planning, on-time delivery 78 to 91%; lesson: escalate in week 2, not week 5.”',
      },
      said: 'What you hear in projects: “You did fine. Maybe a bit more confident next time.” Vague feedback like this needs a follow-up question: “When did I seem unsure?”',
      recall: [
        {
          q: 'Someone gives you feedback that stings. What do you do?',
          options: ['Explain why it happened', 'Listen, thank them, and ask for an example if needed', 'Ignore it', 'Ask someone else for a second opinion right away'],
          answer: 'Listen, thank them, and ask for an example if needed',
          why: 'Defending stops the feedback; curiosity gets you more of it.',
        },
        {
          q: 'What goes in a one-page case history?',
          options: ['Your hours and invoices', 'The client’s confidential data', 'All the slides from the project', 'Situation, what you did, the result in numbers, what you learned'],
          answer: 'Situation, what you did, the result in numbers, what you learned',
          why: 'It gives you a concrete story to learn from and to tell.',
        },
        {
          q: 'Why write down your reflection after every project?',
          options: ['HR requires it', 'Over several projects, patterns show you what to work on', 'To show your manager you are busy', 'It is part of the closing report'],
          answer: 'Over several projects, patterns show you what to work on',
          why: 'One project is anecdote; repeated themes are your development points.',
        },
        {
          q: 'How do you best ask a client for feedback?',
          options: ['In person, with a specific question', 'With a long online form', 'In the closing presentation, in front of everyone', 'You don’t, it is awkward'],
          answer: 'In person, with a specific question',
          why: 'People give more honest and specific feedback in a direct conversation.',
        },
      ],
      situation: {
        scene: 'Your first project as lead, at a grid operator, has just ended. The results were good, but you know the steering groups, the monthly meetings where the sponsor and managers take decisions, were messy and you felt unsure in them. Your manager asks how it went.',
        ask: 'What do you say and do?',
        model: '“The results were good: cancellations from 18 to 7%. What I want to improve is how I run steering groups; I often didn’t get decisions. Could you come to one in my next project and give me feedback?” Then I’d ask the client sponsor the same specific question, and write my one-page case with this as the lesson.',
        rubric: [
          'Names the result and a concrete development point honestly',
          'Asks for specific feedback or help on that point',
          'Writes the case history with the lesson',
        ],
        pushback: {
          lines: [
            '“The results were good. Why focus on the steering groups? Take the win.”',
            '“Everyone feels unsure the first time. It comes with experience.”',
          ],
          model: '“I’m happy with the results. The steering groups are exactly what I want to do better, and experience alone won’t fix that. Could I prepare the next one with you, and would you sit in once and give me two points afterwards?”',
          rubric: [
            'Acknowledges the good result and the reassurance',
            'Holds to naming his own point to develop',
            'Proposes a concrete request for support',
          ],
        },
      },
      sayIt: 'Explain to a new consultant in 60 seconds how you reflect after a project and build your own case history.',
      terms: [
        { term: 'Reflection', def: 'Looking back on what you did, what you’d change and what you learned.' },
        { term: 'Feedback question', def: 'A specific question that invites a specific, useful answer.' },
        { term: 'Case history', def: 'One page per project: situation, approach, result, lesson.' },
        { term: 'Development talk', def: 'A regular conversation with your manager about how you are growing and what to work on next.' },
        { term: 'Blind spot', def: 'Something others see in how you work that you don’t see yourself.' },
      ],
    },
  ],
};
