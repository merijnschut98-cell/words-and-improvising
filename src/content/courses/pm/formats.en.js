// pm.formats (English): formats and meetings: which meeting when, designing and leading a workshop, ideas and decisions in a group, and formats on the floor.
export default {
  lessons: [
    {
      id: 'pm.formats.catalogue',
      gist: 'Every meeting has a purpose, participants, a duration and an output; if you cannot name the output, drop the meeting.',
      title: 'A project’s meetings',
      pre: [
        {
          q: 'A sponsor wants a one-hour meeting every week with all twelve team members. Which question do you ask yourself first?',
          options: [
            'Which day of the week clashes least with the team’s diaries',
            'Whether the meeting room is big enough for twelve people at once',
            'What it produces that a message cannot',
            'Who may set the agenda and keep the minutes for the team',
          ],
          answer: 'What it produces that a message cannot',
          why: 'A meeting earns its place by what it produces; without output a message is cheaper.',
        },
      ],
      teach: [
        'A project has several meeting formats. Each format has a purpose, participants, a duration and an output. A meeting is meant to share or to decide; a workshop is meant to make something together, such as a list, a map or a plan.\n\nYou see the difference at the end: after a meeting there are decisions and agreements, after a workshop there is something the group made.',
        'The meetings every project has, briefly described. Kick-off: the project starts, 60 to 90 minutes, with goal, roles and first steps as output. Stand-up: 15 minutes daily at the board. Weekly: 30 to 60 minutes, the team’s progress and problems. Steering group: every few weeks, the sponsor takes decisions.\n\nThe full treatment is in A meeting rhythm that works and Preparing the steering group in Run; tiered meetings on the floor are in Tiered meetings and escalation in Land.',
        'Three formats you plan deliberately. A review or demo shows the working result to the people who will use it, as soon as there is something to show. A retrospective looks at the way of working: see A retrospective people learn from in Close. The five Scrum events in Agile and Scrum are the agile equivalent.\n\nA sponsor check-in is short, 20 to 30 minutes, every two to four weeks.',
        'The workshop is the format that is underrated most. It takes two to three hours, has one goal and delivers one visible output. How to design and lead one is in the next topic of this module.\n\nEvery meeting has a meeting output you can point to: a decision, a list, a map, an agreement. If you cannot name the output, the meeting is a candidate to cancel or to replace by a message.',
      ],
      example: {
        kind: 'worked',
        text: 'A six-month project (24 weeks) at a manufacturer: improving work preparation on an assembly line. The meeting calendar by month.\n\nMonth 1: kick-off in week 1 (60 minutes, output: goal, roles, first steps), a workshop on the current situation in week 3 (3 hours, output: a map), from week 1 a 30-minute weekly every week and a sponsor check-in every two weeks.\nMonths 2 and 3: first steering group in week 8, demo of the pilot in week 10.\nMonths 4 and 5: steering group in week 16, second demo in week 18, a workshop on the handover to operations in week 19.\nMonth 6: retrospective in week 23, final steering group in week 24.\nEvery line has an output; the weekly and the sponsor check-in run throughout.',
      },
      said: 'What you hear in projects: “Shall we just schedule a meeting?”',
      recall: [
        {
          q: 'What distinguishes a workshop from a meeting?',
          options: [
            'A workshop always takes longer than a day and has more participants',
            'The group makes something together that is visible afterwards',
            'Only the sponsor is present, to take decisions',
            'There is no agenda and everybody talks at once',
          ],
          answer: 'The group makes something together that is visible afterwards',
          why: 'A workshop delivers an output the group made itself; a meeting shares or decides.',
        },
        {
          q: 'Which meeting format do you use to show the working result to the people who will use it?',
          options: ['A kick-off', 'A sponsor check-in', 'A steering group', 'A demo or review'],
          answer: 'A demo or review',
          why: 'A demo or review is the moment users see the work and react to it.',
        },
        {
          q: 'A 20-week project has a 90-minute steering group every four weeks. How many hours of steering group is that in total?',
          number: 7.5,
          tolerance: 0.2,
          unit: 'hours',
          why: '20 / 4 = 5 steering groups. 5 × 1.5 hours = 7.5 hours.',
          hint: 'First work out how many steering groups fit in the project, then convert the duration to hours.',
        },
        {
          q: 'You cannot name the output of a weekly meeting. What do you do?',
          options: [
            'Cancel the meeting or replace it by a written update',
            'Make the meeting longer so there is more time to find something',
            'Invite more people so that it feels more important to everyone',
            'Leave the meeting because it is already in all the diaries',
          ],
          answer: 'Cancel the meeting or replace it by a written update',
          why: 'Without a visible output the meeting is redundant, or a message can do the job.',
        },
      ],
      situation: {
        scene: 'You start a project at a grid operator. The sponsor says: “Schedule a weekly meeting with the whole team of twelve, otherwise they will not feel involved.”',
        ask: 'What do you propose?',
        model: '“Involvement matters to me too. I propose a 30-minute weekly with the core team, a steering group every four weeks for you, and a short monthly session with everybody in which we show the results. That way everybody hears what is happening and the meeting stays short.”',
        rubric: ['Acknowledges the importance of involvement', 'Proposes different formats with a purpose of their own', 'Keeps the time cost for the team limited'],
        pushback: {
          lines: ['“If I do not see everyone every week, I do not know how things are going.”', '“A monthly session is too little, then people hear it too late.”'],
          model: '“I understand you want to see it. You get a short written update every week and a half-hour sponsor check-in every two weeks. If the session turns out to be too little after two months, we hold it more often. We check after the first steering group.”',
          rubric: ['Takes the concern about visibility seriously', 'Offers an alternative with less meeting time', 'Proposes a moment to adjust'],
        },
      },
      sayIt: 'Explain in 60 seconds which meetings a project needs and what each produces.',
      terms: [
        {
          term: 'Meeting format',
          def: 'A kind of meeting with its own purpose, participants, duration and output.',
        },
        {
          term: 'Kick-off',
          def: 'The meeting where the project officially starts: goal, scope, roles and first steps.',
        },
        {
          term: 'Sponsor check-in',
          def: 'A short, fixed conversation with the sponsor, for example twenty minutes every two weeks: what goes well, where it is stuck, what is needed.',
        },
        {
          term: 'Workshop',
          def: 'A session in which a group makes one visible output together, such as a list, a map or a plan.',
        },
        {
          term: 'Meeting output',
          def: 'What exists after the meeting that did not before: a decision, a list, a map or an agreement.',
        },
      ],
    },
    {
      id: 'pm.formats.kickoff',
      gist: 'A kick-off of about 60 minutes in five blocks, with a pre-read beforehand, fixes the goal, roles, rhythm, working agreements and first actions.',
      title: 'Preparing and running a kick-off',
      pre: [
        {
          q: 'You organise a kick-off for ten people. The agenda is 90 minutes because that is usual. What is the better design question?',
          options: ['How do we fit in all the presentations without cutting any', 'What must everyone know and have agreed by the end', 'Which manager is least bothered by the length', 'Which building has a room that is available long enough'],
          answer: 'What must everyone know and have agreed by the end',
          why: 'The duration follows from what must be agreed at the end, not the other way round.',
        },
      ],
      teach: [
        'The lesson The first weeks in Intake says a kick-off takes about an hour and the sponsor tells why. This lesson works the kick-off out completely. There are two kinds: the stakeholder kick-off for the sponsor and the most important stakeholders, and the team kick-off for the people who do the work.\n\nOn larger projects you do the first and then the second.',
        'A 60-minute agenda in five blocks. Why, by the sponsor: 10 minutes. Goal and scope, by you: 15. Roles: 10. How do we work together: 10. First steps: 15.\n\nThe invitation goes to those who must agree or take part, not to everyone who would like it. Who speaks is fixed beforehand: the sponsor opens, you lead, the others respond briefly. Each block has one question it answers.',
        'Send a one-page pre-read two days ahead: the goal in one sentence, the scope, who is invited and why, and the agenda. Whoever reads it need not hear in the room what is already there.\n\nThat lets you shorten or drop blocks: the pre-read replaces the explanation, the kick-off is for agreements.',
        'At the end five things are fixed. A goal sentence everyone agrees with. The roles. The meeting rhythm. The working agreements: a few agreements about how to work together, such as replying within a day and putting decisions in one list. The first three actions, each with an owner and a date.\n\nSend this back to everyone within 24 hours. It is the first proof that the kick-off produced something.',
      ],
      example: {
        kind: 'worked',
        text: 'A kick-off for a project that improves work preparation at a grid operator. Ten people, originally planned for 90 minutes: 10 × 1.5 = 15 hours.\n\nYou redesign it. The pre-read (goal, scope, who and why) goes out two days ahead; the explanation block drops out. A 60-minute agenda: why (sponsor) 10, goal and scope 10, roles 10, working agreements 10, first steps 15, wrap-up 5. Ten people × 1 hour = 10 hours: 5 hours saved.\n\nEnd: a goal sentence, five roles, a weekly on Tuesdays, two working agreements, three actions with name and date. Sent the same day.',
      },
      said: 'What you hear in projects: “The kick-off was fine, but afterwards nobody knew what had been agreed.”',
      recall: [
        {
          q: 'What is a pre-read for a kick-off?',
          options: ['The presentation the sponsor gives in the room to explain the why', 'The report with decisions and actions sent within a day afterwards', 'A short text people read beforehand, so the room goes to agreements', 'The full project plan, read beforehand and approved in the room'],
          answer: 'A short text people read beforehand, so the room goes to agreements',
          why: 'The pre-read takes over the explanation, so the kick-off has time for agreements.',
        },
        {
          q: 'Which five things are fixed at the end of a kick-off?',
          options: [
            'Goal sentence, roles, meeting rhythm, working agreements and first three actions',
            'Budget, risk list, schedule, estimate and communication plan for the whole project',
            'Project plan, milestones, budget, steering group members and the first report to the sponsor',
            'Scope, cost, quality, time and a final report for the board',
          ],
          answer: 'Goal sentence, roles, meeting rhythm, working agreements and first three actions',
          why: 'These five turn a gathering into a start: everyone knows goal, role, rhythm, rules and what happens tomorrow.',
        },
        {
          q: 'You cut a kick-off for 12 people from 75 minutes to 45 minutes. How many hours do you save in total?',
          number: 6,
          tolerance: 0.2,
          unit: 'hours',
          why: '75 − 45 = 30 minutes, so 0.5 hours per person. 12 × 0.5 = 6 hours.',
          hint: 'First work out how many minutes drop out per person, then multiply by the number of people.',
        },
        {
          q: 'When do you hold a separate team kick-off after a stakeholder kick-off?',
          options: [
            'Never: one kick-off for everyone is always enough, even for a big project',
            'Only if the project lasts longer than a year and has many people',
            'Only if the sponsor cannot attend the stakeholder kick-off',
            'When the team still has to agree roles and working agreements',
          ],
          answer: 'When the team still has to agree roles and working agreements',
          why: 'The stakeholders settle the why and the support; the team still has to agree how it works.',
        },
      ],
      situation: {
        scene: 'You prepare a kick-off at a manufacturer. The sponsor wants all five department heads to present for a quarter of an hour each. That makes the kick-off 75 minutes long before you have said anything.',
        ask: 'What do you say to the sponsor?',
        model: '“I understand you want every department to be heard. What if each head writes one page that we send round beforehand, and in the kick-off we only discuss where they touch? Then we keep 60 minutes for goal, roles and agreements and everyone has had their say.”',
        rubric: ['Acknowledges the wish for every department to be heard', 'Proposes a pre-read instead of presentations', 'Keeps time free for agreements'],
        pushback: {
          lines: ['“Nobody reads a page. They have to hear it.”', '“If I may not say it myself, my department will feel ignored.”'],
          model: '“That works too: each head gets two minutes to name the main point of the page. That is ten minutes instead of 75. Whoever wants to read it has it; whoever wants to hear it hears it. You open and say why this matters for everyone.”',
          rubric: ['Takes the feeling of being ignored seriously', 'Offers a short speaking slot as an alternative', 'Gives the sponsor a visible role'],
        },
      },
      sayIt: 'Explain in 60 seconds how you structure a one-hour kick-off and what is fixed at the end.',
      terms: [
        {
          term: 'Working agreements',
          def: 'A few agreements on how the team works together, such as reply time and where decisions are kept.',
        },
        {
          term: 'Pre-read',
          def: 'A short text participants read before the meeting, so the time in the room goes to agreements.',
        },
        {
          term: 'Team kick-off',
          def: 'The kick-off for the people who do the work: roles, working agreements and first steps.',
        },
        {
          term: 'Stakeholder kick-off',
          def: 'The kick-off for the sponsor and key stakeholders: why the project exists and what they expect from it.',
        },
      ],
    },
    {
      id: 'pm.formats.system',
      gist: 'Build a meeting system that decides, aligns and learns, with a cadence that follows the pace of the work.',
      title: 'The meeting system of one project',
      pre: [
        {
          q: 'A project has nine fixed meetings and nobody has time left to work. What is the best first step?',
          options: ['Make all meetings a quarter of an hour shorter, to free time each week', 'Bundle the meetings on two fixed days, so the rest stays free', 'Let the team vote on the least useful meeting and cancel it', 'Check per meeting whether it yields a decision, coordination or a lesson'],
          answer: 'Check per meeting whether it yields a decision, coordination or a lesson',
          why: 'Only when you know what each meeting does can you see what is double or missing.',
        },
      ],
      teach: [
        'A project has a meeting system: the set of meetings that together must do three things. Decide (steering group, sponsor check-in), coordinate (stand-up, weekly) and learn (demo, retrospective). Each job must be covered by at least one meeting and preferably not by three.\n\nList per meeting what it produces. What is double, you merge. What is missing, you add.',
        'The cadence is the rhythm of each meeting. As a rule of thumb it follows how fast the work changes: daily or weekly for coordination, monthly for decisions, at milestones for learning.\n\nNot every meeting has to stay a meeting. A one-page written update replaces a status round. An asynchronous update lets people respond in their own time within an agreed period, say 48 hours. It works for information and simple choices, not for a conflict.',
        'Meet in the room, remote or hybrid? One rule for a hybrid meeting: if one person is remote, everyone joins on their own screen, even when they sit together in a room. Then nobody is second class, and the room microphone does not make the difference.\n\nFor a meeting with a discussion or a conflict, prefer the room; for coordination a screen is enough.',
        'Exceptions. The sponsor who keeps cancelling: turn it into a fixed quarter of an hour and a written update, and keep decisions in a list. A client culture of long meetings: agree an end time and an agenda beforehand. Shift work: a short stand-up at the handover between shifts and a written update instead of a meeting the night shift can never join.\n\nThe system for several teams is in Running several workstreams in Run.',
      ],
      example: {
        kind: 'faded',
        text: 'A project at a manufacturer has nine fixed meetings:\n1. daily stand-up, 15 minutes\n2. weekly team meeting, 60 minutes\n3. weekly planning meeting, 60 minutes\n4. weekly status meeting with the manager, 45 minutes\n5. weekly client call, 30 minutes\n6. monthly steering group, 90 minutes\n7. monthly sponsor check-in, 45 minutes\n8. demo every other week, 60 minutes\n9. retrospective every other week, 60 minutes\nA month counts four weeks and twenty working days. Together that is about 24 hours of meetings a month.',
        ask: 'Which do you merge, which do you replace by a written update, and which do you keep? Check that deciding, coordinating and learning stay covered.',
        reveal: 'The team meeting and the planning meeting become one weekly of 60 minutes. The status meeting with the manager becomes a written update from the same board. The client call and the demo alternate instead of both running. The retrospective becomes monthly. The stand-up, the sponsor check-in and the steering group stay.\n\nDeciding: steering group and sponsor check-in. Coordinating: stand-up and weekly plus the update. Learning: demo and retrospective. Everything is still covered. The total drops from about 24 to about 15 hours a month.',
      },
      said: 'What you hear in projects: “I sit in meetings all day and do not get to my work.”',
      recall: [
        {
          q: 'Which three jobs must a meeting system cover together?',
          options: ['Planning, budgeting and reporting', 'Deciding, coordinating and learning', 'Presenting, minuting and evaluating', 'Starting, adjusting and closing'],
          answer: 'Deciding, coordinating and learning',
          why: 'Deciding, coordinating and learning are the three jobs you need meetings for.',
        },
        {
          q: 'What is the rule for a hybrid meeting?',
          options: [
            'Whoever is remote gets the first word on every agenda item',
            'The people in the room hold the meeting and the rest only watch on a screen',
            'If one person is remote, everyone joins on their own screen',
            'Whoever is remote gets the minutes afterwards instead of taking part',
          ],
          answer: 'If one person is remote, everyone joins on their own screen',
          why: 'With everyone on their own screen, all participants have the same position.',
        },
        {
          q: 'You merge two weekly meetings of 60 and 45 minutes into one of 60 minutes. How many hours do you save in four weeks?',
          number: 3,
          tolerance: 0.1,
          unit: 'hours',
          why: 'Per week 105 − 60 = 45 minutes. In four weeks 4 × 45 = 180 minutes = 3 hours.',
          hint: 'First add up the minutes per week before and after merging and convert the difference to hours.',
        },
        {
          q: 'Which form fits best for a meeting in which a conflict must be discussed?',
          options: ['A meeting in the room, with a conversation', 'An asynchronous round by messages in a set time', 'A one-page written update with both positions', 'A video call with cameras off to lower the tension'],
          answer: 'A meeting in the room, with a conversation',
          why: 'A conflict needs conversation and tone; asynchronous or written works for information and simple choices.',
        },
      ],
      situation: {
        scene: 'The sponsor of your project cancels the steering group for the third time in a month. Two decisions are waiting that the team cannot take itself.',
        ask: 'What do you propose?',
        model: '“I know your diary is full. What if the steering group becomes 30 minutes, with the decision paper two days ahead, and a decision you do not want to take in the room can be settled in writing? Then the list of decisions is always with you and the project keeps moving.”',
        rubric: ['Acknowledges the sponsor’s full diary', 'Proposes a lighter form with a written alternative', 'Ties it to the decisions that are waiting'],
        pushback: {
          lines: ['“I trust you, decisions can simply go ahead without me.”', '“Just send me an email, I will see.”'],
          model: '“Thank you for the trust. These two decisions are about budget and about an agreement with the client; I cannot decide them myself and I do not want you to wish later you had decided otherwise. An email with the two options and my recommendation costs you five minutes. Could you answer by Friday?”',
          rubric: ['Thanks them for the trust and stays calm', 'Explains why these decisions are not the team’s', 'Asks for a concrete answer with a date'],
        },
      },
      sayIt: 'Explain in 60 seconds how you prune the meetings of one project without losing decisions, coordination and learning.',
      terms: [
        {
          term: 'Cadence',
          def: 'The rhythm in which a meeting recurs, fitting how fast the work changes.',
        },
        {
          term: 'Written update',
          def: 'A short text at a fixed moment that replaces a meeting when nobody needs to talk.',
        },
        {
          term: 'Asynchronous update',
          def: 'Consultation in which people respond in their own time within an agreed period.',
        },
        {
          term: 'Hybrid meeting',
          def: 'A meeting in which some sit together in a room and others join remotely.',
        },
      ],
    },
    {
      id: 'pm.formats.governance',
      gist: 'The invitation list is a power decision, you prepare decisions beforehand, and every meeting you add costs scarce time; hand over the chair.',
      title: 'The meeting as governance',
      pre: [
        {
          q: 'The sponsor says: “We will take the decision in the steering group.” When should the most important people see the proposal for the first time?',
          options: [
            'A few days earlier, one-to-one, so objections are known',
            'In the steering group itself, so everyone starts equal',
            'Only in the minutes, so the decision is final',
            'A quarter of an hour before the meeting, so they cannot work against it too much',
          ],
          answer: 'A few days earlier, one-to-one, so objections are known',
          why: 'A decision in the room has usually been made already; you prefer to hear objections beforehand and calmly.',
        },
      ],
      teach: [
        'Who is in the room decides the decision. An invitation list is a power decision: whoever is in counts, whoever is not can block it later. For every meeting ask: who must be there, who is there now, and who should have been there?\n\nSuch a meeting is then governance: the agreement on who decides what and how it is settled.',
        'Decisions are prepared beforehand, not taken in the room. The technique of pre-wiring is in In front of the board in Programmes and governance. What a senior weighs here: it takes time, and it can look like backroom politics. Do it openly: say that you speak to key people separately and why.\n\nSurprises in the room cost trust. A decision that surprises the room is often reopened later.',
        'Meeting load is the time that meetings take from the people who can least spare it. Every meeting you add costs hours of scarce time of busy client people. So for each new meeting ask what it replaces.\n\nQuestions for a meeting audit: how many hours a week does this team spend in meetings, what does each produce, who is in without a role, and what happens if it stops for four weeks?',
        'Who chairs? Chairing holds the rhythm, but the meeting dies when you leave. After two or three times hand the chair to an owner at the client, with you as coach. Keep it yourself for a conflict or when the owner is a party.\n\nThe decision list stays with the client. That is the sign that the rhythm survives your exit.',
      ],
      example: {
        kind: 'faded',
        text: 'The management team of a manufacturer (eight people) each spend 22 hours a week in meetings, in a working week of 40 hours. You see: a daily production meeting, a weekly department meeting, a weekly status meeting about an improvement programme, and two meetings nobody knows who started. The director says: “It is busy, but we need it.”',
        ask: 'Write the questions for a meeting audit and make a first proposal. Who chairs, and what do you measure?',
        reveal: 'Questions per meeting: what is the output of the last four weeks (which decisions), who is in without a role, who is the owner, what happens if it stops for four weeks, and what is double? First proposal for a four-week trial: stop the two meetings without an owner or output, replace the status meeting by a written update, and one afternoon a week without meetings.\n\nThe director picks a chair and an owner for the trial; you coach. You measure meeting hours per week and the number of decisions. If the decisions do not fall, the meeting evidently was not needed.',
      },
      said: 'What you hear in projects: “This meeting has existed for years. Nobody remembers why, but you cannot get out.”',
      recall: [
        {
          q: 'Why is an invitation list a power decision?',
          options: [
            'Because only the director may send invitations and nobody else is allowed to',
            'Whoever is in counts, whoever is not can block it later',
            'Because the number of participants decides how long the meeting lasts in practice',
            'Because invitations are a legal document that has to be kept',
          ],
          answer: 'Whoever is in counts, whoever is not can block it later',
          why: 'Whoever was not heard can reopen or ignore the decision later.',
        },
        {
          q: 'How do you prevent pre-wiring from looking like backroom politics?',
          options: ['You leave it out, the decision has to fall in the room', 'You only do it with the sponsor and with nobody else', 'You do it by an email to everyone with a deadline', 'You say openly that you see key people separately and why'],
          answer: 'You say openly that you see key people separately and why',
          why: 'Being open about the pre-talks removes the backroom look.',
        },
        {
          q: 'A management team spends 18 hours a week in meetings in a working week of 40 hours. What percentage of the working week is that?',
          number: 45,
          tolerance: 1,
          unit: '%',
          why: '18 / 40 = 0.45, so 45%.',
          hint: 'Divide the hours in meetings by the hours of the working week.',
        },
        {
          q: 'When do you, as an outsider, keep the chair yourself?',
          options: [
            'Always, so the rhythm stays exactly the same for everyone as before',
            'Never, because an outsider never chairs and must leave it to the client',
            'In a conflict or when the owner is a party',
            'Only in the first week of the project, after that the client carries it',
          ],
          answer: 'In a conflict or when the owner is a party',
          why: 'A party cannot be a neutral chair; then you keep it for now.',
        },
      ],
      situation: {
        scene: 'You lead a project at a manufacturer. The management team is so full of meetings that decisions stay on the table. The director says: “Will you add a weekly project meeting? At least then I know what is going on.”',
        ask: 'What do you say?',
        model: '“I can do that, but then I first ask which meeting it replaces, because the diaries are full. My proposal is to replace the status meeting on the improvement programme by a written update and to put a quarter of an hour of project meeting in its place.”',
        rubric: ['Asks which meeting is replaced', 'Proposes a concrete replacement', 'Makes the client’s meeting load discussable'],
        pushback: {
          lines: ['“My people are used to it. I am not going to cancel meetings.”', '“I simply want an extra moment to talk to you.”'],
          model: '“Fine, then we keep the existing status meeting. May I have the first ten minutes for the project? Then you get to talk to me every week without one more meeting. In two months we check whether it is enough.”',
          rubric: ['Respects the existing habit', 'Offers a solution without an extra meeting', 'Plans a moment to check'],
        },
      },
      sayIt: 'Explain in 60 seconds why a meeting is power and how you examine a client’s meeting load.',
      terms: [
        {
          term: 'Chairing',
          def: 'The role of whoever leads a meeting, guards the rhythm and sees to it that it produces decisions.',
        },
        {
          term: 'Pre-wiring',
          def: 'Taking key people through a proposal one-on-one before the meeting.',
        },
        {
          term: 'Meeting load',
          def: 'The time meetings take from the people who can least spare it.',
        },
        {
          term: 'Meeting audit',
          def: 'A short series of questions with which you check what a team’s meetings cost and produce.',
        },
      ],
    },
    {
      id: 'pm.formats.workshop',
      gist: 'A workshop has one goal, delivers a visible outcome and brings in the right people; you design it with goal, outcome, participants and agenda.',
      title: 'What a workshop is',
      pre: [
        {
          q: 'A manager wants “a session” with twelve people to improve the planning. Which question do you need first?',
          options: ['What should be there at the end and who can make it', 'Whether there is coffee and lunch for all twelve people', 'Whether the session fits better on a Monday or a Friday', 'Whether a presentation with slides has to be made'],
          answer: 'What should be there at the end and who can make it',
          why: 'A session starts from the output and the people who can make it.',
        },
      ],
      teach: [
        'A workshop differs from a meeting on three points. It has one purpose, it delivers a visible output you can photograph, and it brings in the people who hold the knowledge. If nothing visible is there afterwards, it was a meeting.\n\nOutputs are for example a list of problems, a map of a process (the brown paper session in the next lesson), a plan or a chosen order.',
        'You design a session with four questions. Purpose: why now, and what changes through the session? Output: what is there at the end? Participants: who has the knowledge or has to accept it later? Agenda: blocks with minutes.\n\nAnswer them in that order. Whoever starts with the agenda picks formats without knowing what for.',
        'Every session has the same arc. Open: purpose, rules and a short check-in. Diverge: collect widely without judging. Converge: order, choose and work out. Close: who does what by when, and a closing round.\n\nThe retrospective has the same arc in five phases; it is in Designing a retrospective in Close and is not repeated here.',
        'Three roles. The facilitator leads the process and does not steer the content. The outcome owner is whoever will use the result and decide about it; they are present at the opening and the close. The scribe writes visibly and photographs the result.\n\nOne person can combine the roles of facilitator and scribe in a small group. Facilitator and owner are never the same person.',
      ],
      example: {
        kind: 'worked',
        text: 'A two-hour workshop at a grid operator about a new weekly routine for work preparation.\n\nPurpose: agree a routine for planning the week. Output: one page with the steps and an owner per step. Participants: six, four planners, the team lead and someone from the field. Outcome owner: the team lead.\n\nAgenda: 10 minutes opening (purpose, rules, check-in); 35 minutes diverge (what does a good planning week need, silent writing); 5 minutes break; 40 minutes converge (cluster, choose and order steps); 20 minutes close (an owner per step, agree the first week); 10 minutes closing round. Together 120 minutes.',
      },
      said: 'What you hear in projects: “We will hold a session. What exactly, we will see then.”',
      recall: [
        {
          q: 'Which four questions do you use to design a session, in order?',
          options: ['Agenda, room, participants and catering', 'Date, time, place and cost', 'Purpose, output, participants and agenda', 'Who, what, where and when'],
          answer: 'Purpose, output, participants and agenda',
          why: 'Purpose and output first: they decide who must be there and what belongs on the agenda.',
        },
        {
          q: 'What does the outcome owner do?',
          options: ['He leads the session and guards the time', 'He writes and takes photos of the result', 'He stays outside the room to be free to judge', 'He will use the output and decides about it'],
          answer: 'He will use the output and decides about it',
          why: 'The owner is the person who has to carry on with the output; hence they are there at opening and close.',
        },
        {
          q: 'A 90-minute session has 10 minutes opening, 25 minutes diverge and 35 minutes converge. How many minutes are left for closing?',
          number: 20,
          tolerance: 1,
          unit: 'minutes',
          why: '10 + 25 + 35 = 70 minutes. 90 − 70 = 20 minutes.',
          hint: 'Add up the three blocks and subtract the total from the length of the session.',
        },
        {
          q: 'What is diverging in a session?',
          options: ['Making a choice from a list of options', 'Collecting widely without judging', 'Closing the session with a round', 'Holding a long discussion about the output'],
          answer: 'Collecting widely without judging',
          why: 'Diverging widens the supply of ideas; only after that do you choose.',
        },
      ],
      situation: {
        scene: 'You work at a manufacturer. The department manager says: “Schedule a two-hour session with the whole department, twenty people, to talk about the planning.” You have no purpose, no output and no owner.',
        ask: 'What do you say?',
        model: '“Gladly. To make it a good session, I first want to know what should be there afterwards, so we invite the right people. If it is a chosen routine, six to eight people fit better than twenty. Can we talk for a quarter of an hour to write down purpose and output?”',
        rubric: ['Says yes and keeps the pace up', 'Asks about purpose and output before the participant list', 'Proposes a short, concrete next step'],
        pushback: {
          lines: ['“Everyone has to be there, otherwise part of them will feel excluded.”', '“I do not want you to decide it for me afterwards.”'],
          model: '“I understand. We can send the output to the whole department beforehand and report back afterwards, so nobody is excluded. You remain the owner of the output and decide about it; I only lead the process. Shall we note it that way?”',
          rubric: ['Acknowledges the concern about exclusion', 'Explains the split between owner and facilitator', 'Proposes to put it in writing'],
        },
      },
      sayIt: 'Explain in 60 seconds what a workshop is, which four design questions you ask and which roles there are.',
      terms: [
        {
          term: 'Facilitator',
          def: 'The person who runs a session and guards the process, without steering the content.',
        },
        {
          term: 'Outcome owner',
          def: 'The person who will use the session’s output and decides about it.',
        },
        {
          term: 'Scribe',
          def: 'The person who writes visibly during the session and photographs the result.',
        },
        {
          term: 'Diverge',
          def: 'Collecting ideas or points widely, without judging them yet.',
        },
        {
          term: 'Converge',
          def: 'Ordering, choosing and working out what was collected while diverging.',
        },
      ],
    },
    {
      id: 'pm.formats.brownpaper',
      gist: 'On a brown paper a group of six to twelve draws the process left to right, with a swim lane per role.',
      title: 'Running a brown paper session',
      pre: [
        {
          q: 'You want to map a process with a group. Whom do you invite?',
          options: [
            'Only the managers, who know most',
            'As many people as possible, also from other departments and outside the process',
            'One person for each role that works in the process',
            'Only the regular planners, since they know the process best',
          ],
          answer: 'One person for each role that works in the process',
          why: 'One per role covers the whole process, including handovers, without the group getting too big.',
        },
      ],
      teach: [
        'A brown paper is a long sheet of paper, three to five metres, on the wall. The group draws the process from left to right with sticky notes. First the current situation (as-is), only later the desired situation (to-be). It is a common way of working; there is no single standard.\n\nFix the start and end of the process beforehand, for example with the boundaries from Drawing boundaries with SIPOC in Intake.',
        'Preparation. Invite one person per role, six to twelve people together, including the one who receives the work and the one who hands it over. Provide three to five metres of paper, sticky notes in agreed colours, markers and tape, and an empty wall. Reserve three hours.\n\nExplain: we draw how it really goes, not how the procedure says it should.',
        'Walk the process from left to right. One colour for steps, another for problems and questions. Give each role its own swim lane: a row per department or role, one under the other. Mark every handover and every waiting time, because that is where the loss often sits.\n\nLet the group talk and stick the steps themselves; you guard the process and the order.',
        'Validate with the group by walking the whole map once more from left to right: is it right, is something missing? Photograph the map. Redraw it clean the next day and send it round; the desired situation follows in a second session.\n\nIf you need figures on lead time and stock, value stream mapping is the next step: see Value stream mapping in the module Engineering problem solving in Engineering.',
      ],
      example: {
        kind: 'worked',
        text: 'A brown paper session at a grid operator about the work preparation for fault repair. Ten people: four planners, two technicians, a work preparer, a buyer, the team lead and someone from customer service. Four metres of paper, yellow notes for steps, pink for problems.\n\nA 180-minute agenda: 15 opening, 15 boundaries and rules, 70 sticking steps, 10 break, 30 problems and questions, 25 validating, 15 closing.\n\nResult: 23 steps, 7 handovers and 4 places where the work waits for a signature. You redraw it clean the next day, send it round and plan the session on the desired situation.',
      },
      said: 'What you hear in projects: “It never goes like that in practice. This is how it is in the procedure.”',
      recall: [
        {
          q: 'Where do you mark extra on the brown paper, since that is where the loss often sits?',
          options: ['At the first and the last step of the process', 'At handovers and waiting times', 'At the steps the manager finds most important', 'At steps everyone agrees about'],
          answer: 'At handovers and waiting times',
          why: 'At handovers and waiting times work stays put or information gets lost.',
        },
        {
          q: 'What do you do as the last step in the session itself?',
          options: [
            'Validate the map with the group and photograph it',
            'Draw the desired situation completely straight away, before the break',
            'Take the map away to redraw it at home in peace and quiet',
            'Send the group home without looking back at the session',
          ],
          answer: 'Validate the map with the group and photograph it',
          why: 'Validating with the group prevents one person from disputing the map later.',
        },
        {
          q: 'A map has 24 steps, 6 of which are a handover. What percentage of the steps is a handover?',
          number: 25,
          tolerance: 1,
          unit: '%',
          why: '6 / 24 = 0.25, so 25%.',
          hint: 'Divide the number of handovers by the total number of steps.',
        },
        {
          q: 'About how many people do you invite for a brown paper session?',
          options: ['Two or three, so it goes quickly', 'Four or five, so everyone can say a lot', 'Sixteen or more, so all departments are there', 'Six to twelve, one per role'],
          answer: 'Six to twelve, one per role',
          why: 'Six to twelve fits around one wall and covers the roles in the process.',
        },
      ],
      situation: {
        scene: 'You lead a brown paper session at a manufacturer. After an hour the team lead says: “That is not how it really goes. That part of the planning is done differently.” A planner replies that it does go like that.',
        ask: 'What do you do at that moment?',
        model: '“It looks as if you see it differently. May I put both versions on the map, one in yellow and the other in a second colour, with who does it that way? Then we look afterwards at how often each occurs and where the difference lies.”',
        rubric: ['Makes the difference visible without choosing', 'Puts both versions on the map', 'Proposes to check how often each occurs'],
        pushback: {
          lines: ['“This takes time. We just need one version.”', '“If it is not right, that is your mistake, not mine.”'],
          model: '“I take that seriously. We will not work out both versions now; putting them up takes two minutes. This is not about blame but about seeing what really happens. If we pick one version when there are two, the improvement will later miss half of the work.”',
          rubric: ['Takes the time pressure seriously', 'Takes the blame question away', 'Explains the risk of picking one version'],
        },
      },
      sayIt: 'Explain in 60 seconds how you prepare and lead a brown paper session.',
      terms: [
        {
          term: 'Brown paper',
          def: 'A long sheet of paper on the wall on which a group draws a process with sticky notes from left to right.',
        },
        {
          term: 'As-is',
          def: 'How the process really runs now, including where it differs from the procedure.',
        },
        {
          term: 'To-be',
          def: 'How the process should run after the improvement; follows the as-is.',
        },
        {
          term: 'Handover',
          def: 'The moment work passes from one department or person to another.',
        },
        {
          term: 'Swim lane',
          def: 'A row on the map for one department or role, so you see who does what.',
        },
        {
          term: 'Waiting time',
          def: 'The time work sits waiting for someone to pick it up, for example for a signature.',
        },
      ],
    },
    {
      id: 'pm.formats.design',
      gist: 'You design a session by weighing group size, duration and room or online, and you solve the two-role problem by letting someone else facilitate.',
      title: 'Design choices for a session',
      pre: [
        {
          q: 'A process is carried out by 18 people at three locations. What is the biggest problem if you hold one brown paper session in one room?',
          options: ['Three to five metres of paper is too short for the whole process', 'The group is too big for one wall and has to travel for it', 'There is no time to redraw the map clean the same day', 'The sponsor can only be present at one of the three sites'],
          answer: 'The group is too big for one wall and has to travel for it',
          why: 'One wall suits some six to twelve people; a larger group falls into subgroups or silence.',
        },
      ],
      teach: [
        'A session is a series of trade-offs. Group size: six to twelve works around one wall; more people means subgroups or two sessions. Duration: keep one block to about three hours; two short sessions beat one of six hours. Pre-work: a short task beforehand, for example each person’s own steps on notes, saves time in the room but not everyone does it.',
        'Room, remote or hybrid? A remote session runs on an online whiteboard with a timer and voting, for example Miro or Mural (no recommendation), in blocks of at most 90 minutes. You need someone to operate the tool. Hybrid follows the rule from The meeting system of one project: everyone on their own screen.\n\nThe sponsor in the room shows importance and speeds up decisions; outside it people speak more freely. Let the sponsor open and come back for the close.',
        'The two-role problem: you are facilitator and a content expert, and then steer without noticing it. Solve it by letting someone else facilitate, or by saying aloud when you step out of the role to add content. Do not use it to push your own answer through.\n\nFor a root-cause session the approach is in Facilitating a root-cause session in the module Engineering problem solving in Engineering.',
        'You choose the session format for the situation. Brown paper does not fit too many people, a process of five steps, a group that can only meet online, or sensitive data about people. Use an online board, a conversation or anonymous figures instead.\n\nDo two people describe a different process? Do not choose who is right. Put both versions on the map in two colours, ask how often each occurs and go and look on the floor if needed.',
      ],
      example: {
        kind: 'faded',
        text: 'A process for planning maintenance is carried out by 18 people at three sites, six per site. The sponsor wants “a session in which we capture and improve the process”. Travel time between sites is two hours. One of the sites works in shifts. You are also an expert on the system in which the maintenance is recorded.',
        ask: 'Choose group size, format, number of sessions and roles. What do you do with yourself as an expert?',
        reveal: 'Not one big session. Three local brown paper sessions of six people at each site, at a time that suits the shifts, three hours each. Then one online session of 90 minutes with two or three representatives per site to lay the three maps side by side on an online board and discuss the differences.\n\nRoles: someone from each site as scribe; you facilitate the online session and let the team leads run the local sessions after a short instruction, so you do not steer your own answer. The sponsor opens the online session and returns for the close.',
      },
      said: 'What you hear in projects: “Then we just hold one big session with everyone.”',
      recall: [
        {
          q: 'What is the two-role problem?',
          options: ['Two participants want the floor at once and the rest goes quiet', 'A session has two owners who disagree about the goal', 'You lead and are also an expert, and steer without noticing', 'The sponsor and you each have your own aim for the session'],
          answer: 'You lead and are also an expert, and steer without noticing',
          why: 'Whoever is also the expert adds their own answers unintentionally instead of leading the process.',
        },
        {
          q: 'When does brown paper not fit?',
          options: ['For a group that can only meet online', 'For a process with more than twenty steps', 'For a group of eight people in one room', 'For a process carried out by several departments'],
          answer: 'For a group that can only meet online',
          why: 'Brown paper needs a wall and a group in one space; online you use a digital board.',
        },
        {
          q: 'A 3-hour session with 14 participants. How many person-hours does that session cost?',
          number: 42,
          tolerance: 1,
          unit: 'hours',
          why: '14 × 3 = 42 person-hours.',
          hint: 'Multiply the number of participants by the duration of the session in hours.',
        },
        {
          q: 'Two people describe the same process differently. What do you do?',
          options: [
            'You let the highest in rank choose, then it is clear at once',
            'You vote on it and the majority wins, even if it is close',
            'You stop the session until the two of them have agreed between themselves',
            'You put both versions on the map and ask how often each occurs',
          ],
          answer: 'You put both versions on the map and ask how often each occurs',
          why: 'Making both versions visible shows where the difference lies without anyone losing face.',
        },
      ],
      situation: {
        scene: 'You are asked to have a process mapped, with the sponsor wanting to sit in the room. You know employees will then speak less freely, because their department is often blamed for delays.',
        ask: 'What do you propose to the sponsor?',
        model: '“Your presence shows this matters. May I propose that you open the session with what you want to achieve and then leave? You come back for the close, when the group shows what it found. Then people speak freely and you hear the result right away.”',
        rubric: ['Acknowledges the value of the sponsor’s presence', 'Proposes a role at opening and close', 'Protects the group’s openness'],
        pushback: {
          lines: ['“I want to know what they really say. I am not leaving.”', '“If they have something to hide, I want to know.”'],
          model: '“I understand. I will show you what they say as an ordered map, without names; that is more than you hear when you are there, because then they hold back. If you still want to stay, I would ask you only to listen and not to respond. Which of the two do you want?”',
          rubric: ['Takes the need for insight seriously', 'Offers two concrete options', 'Explains the effect on openness'],
        },
      },
      sayIt: 'Explain in 60 seconds how you choose group size, format and roles of a session for a situation.',
      terms: [
        {
          term: 'Two-role problem',
          def: 'Being facilitator and content expert at once, so you steer the group unintentionally.',
        },
        {
          term: 'Pre-work',
          def: 'A short task participants do before the session, so time is left in the room.',
        },
        {
          term: 'Remote session',
          def: 'A session at a distance, usually on a digital board with a timer and voting function.',
        },
        {
          term: 'Session format',
          def: 'The form of a session you choose for the situation, such as brown paper, digital board or conversation.',
        },
      ],
    },
    {
      id: 'pm.formats.facilitation',
      gist: 'Facilitating starts with contracting the outcome with the sponsor; you stay neutral on the answer and make sure the outcome has an owner.',
      title: 'Facilitation as a craft',
      pre: [
        {
          q: 'A sponsor asks: “Can you lead a session in which everyone agrees with my plan?” What do you do?',
          options: [
            'You say yes and prepare a strong presentation that sells the plan',
            'You say no and do not engage with it any further',
            'You say yes and have the participants start executing the plans already',
            'You first ask what is really open and what the session produces',
          ],
          answer: 'You first ask what is really open and what the session produces',
          why: 'Without knowing what is open, you do not know if there is anything to facilitate.',
        },
      ],
      teach: [
        'Facilitating begins before the session, with a contract. Agree with the sponsor what the session is about; that is called contracting the outcome: what is fixed, what is open, what happens to the output and who decides. Put it on one page. If everything is fixed, it is not a workshop but a presentation, and you call it that.',
        'Neutrality means you lead the process and do not steer the answer. You can break it with a leading question, a sticky note of your own, or the order in which you let people speak. If you have a stake, say so or hand the session over.',
        'The IAF competencies of the International Association of Facilitators name six areas: creating collaborative client relationships, planning appropriate group processes, creating and sustaining a participatory environment, guiding the group to appropriate and useful outcomes, building and maintaining professional knowledge, and modelling a positive professional attitude. Use them as a checklist for your own practice.',
        'An honest description of a process makes teams vulnerable: handovers, waiting times and detours quickly point at people. Weigh who pays for the honesty. Create psychological safety with rules: it is about the process, not about people, no names go in the output, and it is agreed beforehand who sees the paper afterwards. How to build safety is in Building psychological safety in Leading people.',
        'Who owns the output afterwards? An output without an owner dies. Name the owner beforehand and agree when they come back with an answer.\n\nWhen do you bring in an outside facilitator? When you are part of the problem yourself, when you know the content too well to stay neutral, or when the hierarchy or the tension (a reorganisation, a conflict) is too high. An outsider is then safer for everybody.',
      ],
      example: {
        kind: 'faded',
        text: 'A sponsor at a manufacturer asks you to lead a workshop that “confirms the new organisation chart”. Management has already fixed the chart. Twenty-five employees are invited. The sponsor says: “It is mainly meant to give the feeling that they were part of it.”',
        ask: 'What do you agree before you say yes?',
        reveal: 'Ask what is still open. The chart is fixed; so you call it that. What can be open is the introduction: the transition, the split of tasks in the teams, what people need. Proposal: a session on “how do we introduce the new structure”, with an output and an owner, instead of a workshop that confirms.\n\nRecord what happens to the output, who decides and when the sponsor reports back. If the sponsor insists that only confirmation is wanted, you offer an information meeting and refuse the name workshop: you guard against consultation theatre, see Legitimacy and consultation theatre.',
      },
      said: 'What you hear in projects: “Just run a session, support will follow by itself.”',
      recall: [
        {
          q: 'What do you record when you contract a session with the sponsor?',
          options: ['What is fixed or open, who decides and what happens to the output', 'The agenda per block, the formats and who leads which block', 'Who comes, how long it takes and who sends the invitation', 'Which outcome the sponsor wants and how you lead the group to it'],
          answer: 'What is fixed or open, who decides and what happens to the output',
          why: 'That way all parties know what the group can influence and what it cannot.',
        },
        {
          q: 'What does a facilitator’s neutrality mean?',
          options: [
            'You have no opinion on the subject and stay out of the conversation',
            'You let the group talk without structure and never intervene',
            'You lead the process and do not steer the answer',
            'You only agree with the sponsor what happens in the session',
          ],
          answer: 'You lead the process and do not steer the answer',
          why: 'Being neutral is about your role in the conversation, not about whether you hold a view.',
        },
        {
          q: 'When do you bring in an outside facilitator?',
          options: [
            'When the group is larger than ten people and the session takes long',
            'When you are part of the problem or the tension is too high',
            'When the sponsor cannot attend the session in person this time',
            'Always at the first session of every project for a new client',
          ],
          answer: 'When you are part of the problem or the tension is too high',
          why: 'An outsider has no stake in the outcome and is safer for the group.',
        },
        {
          q: 'What is the IAF?',
          options: ['A Dutch law for sessions with employees in organisations', 'A software package for online sessions and whiteboards', 'A standard for designing agendas and time schedules', 'A professional association of facilitators'],
          answer: 'A professional association of facilitators',
          why: 'The IAF is an international professional association; its competencies are usable as a checklist.',
        },
      ],
      situation: {
        scene: 'A director at a grid operator asks you to lead a session on “ideas for the new way of working”. You suspect the new way of working has already been chosen and the session is mainly meant to create support.',
        ask: 'What do you say to the director?',
        model: '“Gladly. To do it well, I want to know which part is still open, so we ask people for ideas only on that part. What has already been decided, and what happens to what they say? If the choice is fixed, we call it an explanation with room for questions, and let the session be about the introduction.”',
        rubric: ['Asks what is open and what is fixed', 'Asks what happens to the output', 'Offers an honest name and content for the session'],
        pushback: {
          lines: ['“Forget the name. I just want them to take part.”', '“This is going to be too much hassle. I want it simple.”'],
          model: '“Taking part only works if they notice it counts. If we ask for ideas about something already fixed, they notice and drop out, also for next time. A clear name and one open question costs a quarter of an hour of preparation and prevents you from losing trust.”',
          rubric: ['Acknowledges the goal of involving people', 'Explains the effect on trust', 'Keeps the extra effort small'],
        },
      },
      sayIt: 'Explain in 60 seconds what you agree with a sponsor before accepting a session and when you bring in an outside facilitator.',
      terms: [
        {
          term: 'Contracting the outcome',
          def: 'Agreeing with the sponsor beforehand what is fixed, what is open, what happens to the output and who decides.',
        },
        {
          term: 'Neutrality',
          def: 'Leading the process without steering the answer; you declare a stake or hand over.',
        },
        {
          term: 'IAF competencies',
          def: 'The six competency areas of the International Association of Facilitators, usable as a checklist.',
        },
        {
          term: 'Psychological safety',
          def: 'The shared belief that people can admit mistakes and disagree without being punished for it (Edmondson).',
        },
      ],
    },
    {
      id: 'pm.formats.diverge',
      gist: 'Keep gathering and choosing apart: write silently first to avoid production blocking, then choose, or let the owner decide when the answer is known.',
      title: 'First many ideas, then choose',
      pre: [
        {
          q: 'A team looks for ideas to shorten the waiting time at a counter. What often works better than having everyone name an idea in turn?',
          options: ['Let one experienced person write down what he thinks works', 'First a few minutes each person writes alone, then share', 'Let the group discuss the best solution for an hour', 'Judge the ideas as soon as they are named'],
          answer: 'First a few minutes each person writes alone, then share',
          why: 'Writing alone first keeps ideas that would otherwise vanish while waiting for your turn.',
        },
      ],
      teach: [
        'Creative group work has two beats, which you keep separate: first diverge, then converge (choose). Whoever judges while collecting cuts off ideas before they are worked out. Osborn (Applied Imagination, 1953) gave two principles: deferring judgment and aiming for many ideas. The four rules you sometimes see are worded differently; stick to these two.',
        'An open brainstorm has a problem: only one person speaks at a time. The others wait for their turn, hold on to their idea, forget it or let it go. That is called production blocking. Diehl and Stroebe (1987) found in their experiments that this explained most of why groups produce fewer ideas than as many people working apart. Fear of being judged and free riding played a smaller part. Still say “often” and not “always”: it depends on the group and the task.',
        'Silent writing (also brainwriting) solves that. Everyone writes ideas alone on sticky notes for five minutes. Then you share them, group similar ideas and name the groups: affinity grouping. Quiet people count and a high position steers less.\n\nChoosing can be done with dots; see Designing a retrospective in Close for dot voting. For a root-cause session, writing ideas silently before the expert speaks is in Facilitating a root-cause session in the module Engineering problem solving in Engineering.',
        'A group method helps if you need many angles or knowledge, or if people must carry the result. Let one person simply decide if the answer is already known, the decision is that person’s, or the question is simple or urgent.\n\nIf you ask a group for ideas when the decision has been taken already, that is fake. Legitimacy and consultation theatre is about that later.',
      ],
      example: {
        kind: 'worked',
        text: 'A team of eight at a grid operator looks for ideas to shorten the waiting time at the customer counter. The figures are example figures.\n\nFirst an open round of 20 minutes: everyone names an idea in turn, the manager sits in. Result: 11 ideas, mostly from three people. Two ideas are shot down at once.\n\nThen silent writing: 5 minutes, each alone. Result: 32 notes, from all eight people. You cluster them in six groups. What is different: more ideas in less time, also from the quiet people, and no judgment while collecting.',
      },
      said: 'What you hear in projects: “Let’s brainstorm, just shout something out.”',
      recall: [
        {
          q: 'What is production blocking?',
          options: ['The group gets too many ideas at once to process', 'The manager blocks ideas with an objection', 'The tool no longer stores ideas', 'People lose their idea while waiting for their turn'],
          answer: 'People lose their idea while waiting for their turn',
          why: 'In an open round only one speaks at a time; whoever waits often forgets or drops their idea.',
        },
        {
          q: 'Which two principles of Osborn do you learn here?',
          options: ['Defer judgment and aim for many ideas', 'Judge at once and choose one good idea', 'First vote and then collect', 'Talk to the highest in rank and then write'],
          answer: 'Defer judgment and aim for many ideas',
          why: 'Deferring judgment and quantity keep the collecting phase open.',
        },
        {
          q: 'An open round yields 12 ideas in 20 minutes, silent writing yields 30 in 5 minutes. How many ideas per minute does silent writing yield?',
          number: 6,
          tolerance: 0.1,
          unit: 'ideas per minute',
          why: '30 ideas / 5 minutes = 6 ideas per minute.',
          hint: 'Divide the number of ideas written by the duration of the silent writing in minutes.',
        },
        {
          q: 'When would you rather let one person simply decide?',
          options: [
            'When many angles are needed to understand something well',
            'When people have to carry the decision themselves later in their work',
            'When the answer is known and the decision is his',
            'When you want to keep the group involved in the subject',
          ],
          answer: 'When the answer is known and the decision is his',
          why: 'A group method costs time; if the choice is known, it is more honest for the owner to decide.',
        },
      ],
      situation: {
        scene: 'You lead a short idea session at a manufacturer. After two minutes the department manager starts commenting: “We tried that, it does not work.” The others go quiet.',
        ask: 'What do you do?',
        model: '“Thank you for your experience; I will need it in a moment. For now I ask everyone to write ideas silently for five minutes, without judging them. Afterwards we choose together and look at what has been tried. That way we do not lose ideas that might work with a small change.”',
        rubric: ['Acknowledges the manager’s experience', 'Applies the two beats of diverge and converge', 'Offers a concrete way of working with a time'],
        pushback: {
          lines: ['“We have no time for sticky notes here. Just say what you want to know.”', '“You are wasting my time with all this fuss.”'],
          model: '“I understand you have little time. Five minutes of silent writing costs less than an open round, and you get more ideas. Afterwards you hear everything in a quarter of an hour, ordered by theme. You only have to choose in a moment.”',
          rubric: ['Acknowledges the time pressure', 'Shows that the method saves time', 'Gives the manager a clear task'],
        },
      },
      sayIt: 'Explain in 60 seconds why you let people write ideas silently first and only then choose.',
      terms: [
        {
          term: 'Brainstorm',
          def: 'A group round to collect many ideas, without judging them at once.',
        },
        {
          term: 'Silent writing',
          def: 'Writing ideas down alone first and only then sharing them, also called brainwriting.',
        },
        {
          term: 'Affinity grouping',
          def: 'Putting similar ideas together and naming the groups.',
        },
        {
          term: 'Deferring judgment',
          def: 'Not judging ideas while you are still collecting them, so they can grow.',
        },
        {
          term: 'Production blocking',
          def: 'The loss of ideas because people wait for their turn in an open round.',
        },
      ],
    },
    {
      id: 'pm.formats.session',
      gist: 'An ideas session on a digital board runs from silent writing in private mode to voting; the top three enter the plan within a day.',
      title: 'An idea session on a whiteboard',
      pre: [
        {
          q: 'You lead a half-hour idea session on an online whiteboard with eight people. What do you prepare beforehand?',
          options: [
            'Only the invitation; the rest emerges by itself during the session',
            'A long presentation on the subject for the whole group',
            'A frame with the question, areas and a timer',
            'A list of all the ideas you have thought of yourself already',
          ],
          answer: 'A frame with the question, areas and a timer',
          why: 'A prepared frame keeps the pace and gets the group working at once.',
        },
      ],
      teach: [
        'An online whiteboard is a shared board on which everyone sticks notes at the same time. Many tools, such as Miro and Mural (no recommendation), have a timer, a private mode and a voting function; the names differ per tool.\n\nPreparation: one question in the form “how can we...?”, a frame with an area per step and short instructions, and testing the day before that everyone can edit and not only view.',
        'A session of 30 minutes, step by step. Welcome and rules, 3 minutes. Silent writing, 5 minutes, with private mode on: nobody sees each other’s notes until the timer runs out, so a first idea does not steer the rest. Reading, 5. Clustering, 7. A voting round with three dots per person, 3. The top three get an owner and a date, 5. Closing, 2.',
        'Afterwards you put the output in the plan within a day: the top three as actions with owner and date, the rest as a list for later. Keep an image of the board. An idea without an owner or date is forgotten after a week.\n\nIf you have no tool, 1-2-4-All from Liberating Structures works in a room: first alone, then in pairs, in foursomes and with the whole group, in about 15 minutes.',
      ],
      example: {
        kind: 'worked',
        text: 'A 30-minute idea session at a manufacturer: “how can we shorten the changeover time of line 3?” Eight people, an online board.\n\nMinute 0 to 3: welcome, question, rules. 3 to 8: silent writing with private mode, 46 notes. 8 to 13: each person reads out their own notes. 13 to 20: clustering in 9 groups. 20 to 23: voting round, 8 × 3 = 24 dots. 23 to 28: the top three get an owner and a date. 28 to 30: closing round.\n\nAfter the session the top three go in the plan as actions.',
      },
      said: 'What you hear in projects: “After the session we had a nice board, but nobody did anything with it.”',
      recall: [
        {
          q: 'Why do you switch on private mode during silent writing?',
          options: ['So the tool uses less memory and computing power', 'So a first idea from others does not steer the rest', 'So the facilitator cannot look along on the board', 'So notes do not disappear by accident during writing'],
          answer: 'So a first idea from others does not steer the rest',
          why: 'Without private mode a first visible idea gets copied or steers the others.',
        },
        {
          q: 'Ten people each get 3 dots for the voting round. How many dots are handed out in total?',
          number: 30,
          tolerance: 1,
          unit: 'dots',
          why: '10 × 3 = 30 dots.',
          hint: 'Multiply the number of people by the number of dots per person.',
        },
        {
          q: 'What happens to the top three after the session?',
          options: [
            'They stay on the board until the next session, then we look further',
            'They are put to a new group to review and supplement',
            'They are attached to the minutes of the weekly meeting',
            'They go in the plan with an owner and a date',
          ],
          answer: 'They go in the plan with an owner and a date',
          why: 'An output without an owner and date does not get into the work.',
        },
        {
          q: 'Which format do you use in a room without a tool in about a quarter of an hour?',
          options: ['1-2-4-All: alone, in pairs, foursomes and all together', 'A three-hour brown paper session with the whole department', 'An open brainstorm led by the manager with the whole team', 'A show-of-hands vote without any preparation'],
          answer: '1-2-4-All: alone, in pairs, foursomes and all together',
          why: '1-2-4-All lets people think alone and in small groups before the whole group speaks.',
        },
      ],
      situation: {
        scene: 'You lead an online idea session. After the voting round two ideas are at the top that were thought of by a senior manager. One of the participants says in the chat: “Of course, they chose those already.”',
        ask: 'What do you do?',
        model: '“Thank you for that remark. These are the results of the voting round, anonymous. I will now show how many dots each idea got and which ideas came from the silent writing. If anyone feels something is underrated, I will put it back on the board before we choose owners.”',
        rubric: ['Takes the remark seriously without getting defensive', 'Makes the voting result transparent', 'Offers room to correct before the choice'],
        pushback: {
          lines: ['“The voting is not anonymous after all; you can see who votes where.”', '“I will stop voting if it is already fixed anyway.”'],
          model: '“Good that you say this. I will switch the votes to an anonymous view and redo the round if you want. Nothing is fixed; the top three get owners today, but the sponsor only decides after this session what to do with the output.”',
          rubric: ['Acknowledges the concern about anonymity', 'Offers a solution in the tool', 'Is honest about what is fixed and what is not'],
        },
      },
      sayIt: 'Explain in 60 seconds how you set up a 30-minute idea session on an online board.',
      terms: [
        {
          term: 'Online whiteboard',
          def: 'A shared online board on which several people stick and group notes at the same time.',
        },
        {
          term: 'Private mode',
          def: 'A setting in which your own notes stay hidden from others until the facilitator reveals them.',
        },
        {
          term: 'Timer',
          def: 'A visible clock on the board that limits each block, so the session keeps its pace.',
        },
        {
          term: 'Voting round',
          def: 'A round in which everyone gets a fixed number of dots to choose the best ideas.',
        },
        {
          term: '1-2-4-All',
          def: 'A format from Liberating Structures: alone, in pairs, in foursomes and with the whole group, in about 15 minutes.',
        },
      ],
    },
    {
      id: 'pm.formats.decide',
      gist: 'Choose the decision format by who owns the decision, and by weight and pace; do not ask for ideas when the choice is already made.',
      title: 'Who decides, and how',
      pre: [
        {
          q: 'A group of nine has ranked ten ideas. Who decides which idea is carried out?',
          options: ['The group, by a majority of votes', 'The facilitator, since they led the session', 'That depends on who may take the decision', 'Whoever collected the most dots'],
          answer: 'That depends on who may take the decision',
          why: 'The right to decide lies with an owner; the group can advise or decide if the owner says so.',
        },
      ],
      teach: [
        'Choose the decision format by who owns the decision. Four forms. Advice process: the owner asks advice from those it affects and those who know, and then decides alone; they must listen, not follow. Consent: the decision goes ahead if nobody has a reasoned objection; the term comes from sociocracy. Majority: more than half choose. Consensus: everyone can live with it.',
        'Choose by weight and pace. Small and reversible: the owner decides after a quick question. Larger, but still reversible: consent or a majority. Hard to reverse and affecting many people: consent from those affected, or an advice process with real input. Consensus is slowest; reserve it for decisions where support is truly needed.\n\nYou state a decision rule before the conversation, not after.',
        'A dominant voice and hierarchy in the room call for an approach. Let people write silently first and vote simultaneously, so nobody follows the others. Let the highest in rank speak last. Invite quiet people by name. Anonymous votes help if people depend on each other’s judgment.\n\nOne more rule: take a decision outside the room in a decision note; how is in Getting decisions made in Run.',
        'Do not hold a session if the decision has already been taken. Asking for ideas when the choice is fixed is fake: people notice. Say what is fixed and what is open, and make it an explanation or a question about the introduction.\n\nIf you ask for advice, also say that it is advice and who decides. That way you keep trust.',
      ],
      example: {
        kind: 'faded',
        text: 'Four decisions in one project at a manufacturer:\n1. On which day does the team hold the weekly meeting?\n2. Which colours does the planning board get?\n3. Which of two suppliers delivers the new machine, which will last ten years?\n4. Does a department switch to shift work?',
        ask: 'For each decision choose a decision format and say who must be in the room.',
        reveal: '1. The team lead decides after a quick poll in the chat; small and reversible. 2. A majority by dots by the team, two minutes; it affects their daily work and is easy to revisit. 3. The director is the owner, with an advice process: advice from maintenance, purchasing, finance and operators, at the table or by consent on the requirements. Hard to reverse, so real input. 4. This decision is not the group’s: management decides, after input from the employees, and the works council has a formal role on working hours; check what applies by law.',
      },
      said: 'What you hear in projects: “We will just vote on it, then it is fair.”',
      recall: [
        {
          q: 'What is consent as a decision rule?',
          options: [
            'Everyone must agree completely, without reservation or objection',
            'The decision goes ahead if nobody has a reasoned objection',
            'A majority of two thirds of those present chooses the proposal',
            'The highest in rank decides alone, after a short round',
          ],
          answer: 'The decision goes ahead if nobody has a reasoned objection',
          why: 'Consent does not ask for approval but for no reasoned objection; that is faster than consensus.',
        },
        {
          q: 'How many votes do you need at least for a majority in a group of 9?',
          number: 5,
          tolerance: 0.1,
          unit: 'votes',
          why: 'More than half of 9 is more than 4.5. So at least 5.',
          hint: 'A majority is more than half; work out the half and go up to the next whole number.',
        },
        {
          q: 'What do you tell a group before you ask for ideas about a decision that is fixed?',
          options: ['Nothing, otherwise they drop out', 'That it is their choice', 'That their ideas will go with the minutes later', 'What is fixed, what is open and who decides'],
          answer: 'What is fixed, what is open and who decides',
          why: 'That way the group knows where its input counts; that keeps trust.',
        },
        {
          q: 'What does an owner do in an advice process?',
          options: ['Asks advice from those affected and then decides alone', 'Lets the group vote and follows the majority', 'Waits until everyone can live with it and then decides', 'Gives the decision to whoever gave the most advice'],
          answer: 'Asks advice from those affected and then decides alone',
          why: 'The owner stays responsible, but decides only after real input.',
        },
      ],
      situation: {
        scene: 'You work with a team at a grid operator on a choice between two systems. After an hour of discussion a senior engineer pushes for a vote. Two team members are not yet convinced.',
        ask: 'What do you propose?',
        model: '“Before we vote, I want to know who may take this decision and how. If it is the team lead’s decision, we do an advice round and he decides. If it is the group’s, I ask the two who still doubt what their objection is and whether it is reasoned. Then we know whether consent works.”',
        rubric: ['First asks who decides', 'Offers two decision forms', 'Takes the doubters’ objection seriously'],
        pushback: {
          lines: ['“This takes too long. Voting is fair, a majority decides.”', '“If we do not choose quickly, it costs us the schedule.”'],
          model: '“A majority works fine, but then with a decision rule we agree beforehand. That takes two minutes. If the two doubters will have to carry the execution, an enforced choice costs more time later than two minutes of listening to their objection now.”',
          rubric: ['Acknowledges the time pressure', 'Keeps the majority open as an option', 'Links the objection to execution'],
        },
      },
      sayIt: 'Explain in 60 seconds how you choose the decision format by who owns the decision and how heavy it is.',
      terms: [
        {
          term: 'Consent',
          def: 'A decision goes ahead if nobody has a reasoned objection; the term comes from sociocracy.',
        },
        {
          term: 'Consensus',
          def: 'A decision everyone can live with, including those for whom it is not the first choice.',
        },
        {
          term: 'Advice process',
          def: 'The owner asks advice from those affected and those who know, and then decides alone.',
        },
        {
          term: 'Majority',
          def: 'More than half of the votes choose; fast, but the minority may not feel heard.',
        },
        {
          term: 'Decision rule',
          def: 'The rule by which a group decides, agreed beforehand: owner, consent, majority or consensus.',
        },
      ],
    },
    {
      id: 'pm.formats.legitimacy',
      gist: 'Avoid consultation theatre with a mandate in the invitation and feedback afterwards; always ask who decides, and whether that person said so in this room.',
      title: 'Legitimacy and consultation theatre',
      pre: [
        {
          q: 'Management has already chosen a new organisation, but wants to “let the team think along”. What is the biggest risk?',
          options: [
            'That the team brings up too many ideas to process',
            'That people notice the outcome was fixed and contribute less',
            'That the session takes longer than planned and disrupts the schedule',
            'That the decision is taken faster than necessary as a result',
          ],
          answer: 'That people notice the outcome was fixed and contribute less',
          why: 'People soon see whether their input does anything; if not, the next invitation goes unanswered.',
        },
      ],
      teach: [
        'Consultation theatre is asking for opinions while the outcome is fixed. People notice: the outcome matches the plan from before the session and their input is nowhere to be seen. The price is high. They contribute less and no longer believe the next invitation.\n\nTrust is capital; every sham session takes a piece of it away, also for the next project lead.',
        'Prevent it with a session mandate: what the group may decide, advise on or only hear. Put it in the invitation: “advice to X”, “decision by the group” or “information”. Pre-wire the decision owner (see In front of the board in Programmes and governance): agree with that person beforehand what happens to the output, and have them attend the opening.\n\nWhat a senior weighs: the owner has to say it in the room, not you on their behalf.',
        'Make sure of closing the loop: the output reaches the owner within an agreed time and the owner comes back with an answer within, say, two weeks. What was adopted, what not and why? Not adopting is allowed, if explained.\n\nWithout closing the loop the session has cost a lot of time and produced no trust.',
        'The credible question for every session: “Who decides, and have they said so in this room?” Ask it yourself, and have those you advise ask it. A formal role for employee representation, such as a works council, is something different from a session; check what applies by law for your situation and do not count sessions as a replacement.',
      ],
      example: {
        kind: 'faded',
        text: 'A works council hears that a reorganisation at a manufacturer was “co-created with employees” in four sessions. The council finds that management had already chosen the new structure before the first session. Employees who took part feel used. You led the sessions.',
        ask: 'What should the project lead have done? And what do you do now?',
        reveal: 'Beforehand you would have asked what was still open. If the structure was fixed, you would not have called the sessions co-creation but information and introduction, and put only open parts, such as the transition and the split of tasks in the teams, to the group. You would have put the mandate in the invitation, had management say at the opening what happens to the output and reported back within two weeks.\n\nNow: acknowledge it, explain factually what was fixed and what was open, correct the word co-creation and ask what is still open. Tell the works council and the employees who took part first, before they hear it from others.',
      },
      said: 'What you hear in projects: “They ask for our opinion, but it has been decided anyway.”',
      recall: [
        {
          q: 'What is consultation theatre?',
          options: [
            'A session in which actors role-play a difficult situation with the team',
            'Consultation that takes so long that nobody decides anything any more',
            'Asking for opinions while the outcome is fixed',
            'A form of voting with secret ballots in the room',
          ],
          answer: 'Asking for opinions while the outcome is fixed',
          why: 'Consultation theatre looks like consultation, but does not count in the decision.',
        },
        {
          q: 'What is the mandate of a session?',
          options: ['What the group may decide, advise on or only hear', 'The sponsor’s permission to hold the session at all', 'The budget and time the session may cost', 'The list of invitees and the role of each'],
          answer: 'What the group may decide, advise on or only hear',
          why: 'The mandate says beforehand where the group’s input may count.',
        },
        {
          q: 'What does closing the loop mean here?',
          options: [
            'You send the participants a photo of the board with all the notes',
            'You send the minutes of the session to the sponsor within a week',
            'You ask the participants afterwards how they liked the session',
            'The owner says in time what was adopted and why',
          ],
          answer: 'The owner says in time what was adopted and why',
          why: 'Closing the loop shows that the input counted, even if not everything was adopted.',
        },
        {
          q: 'Which question do you ask before every session?',
          options: ['How many people are coming to the whole session on Thursday?', 'Who decides, and have they said so in this room?', 'Which tool do we use for the voting round?', 'Who takes the minutes of the session?'],
          answer: 'Who decides, and have they said so in this room?',
          why: 'This question tests whether the session really has influence on a decision.',
        },
      ],
      situation: {
        scene: 'A director at a grid operator asks you to lead a session on “the new workplace layout”. You hear from the facility manager that the layout has already been ordered. The director says: “I mainly want it to get support.”',
        ask: 'What do you say to the director?',
        model: '“I understand you want support, and we do not create that best with a session whose outcome is already fixed; people notice. What is still open, such as the layout per department or the transition? We ask their advice on that. The rest we explain. Would you say at the opening yourself what happens to their input?”',
        rubric: ['Acknowledges the goal of support', 'Separates what is fixed from what is open', 'Asks the owner to say it themselves'],
        pushback: {
          lines: ['“If I say it is fixed, they will drop out.”', '“Just run a session, then they will feel heard.”'],
          model: '“Saying honestly what is fixed costs you some short-term enthusiasm, but whoever discovers later that it was fake drops out for good. If I put the open parts to them and show within two weeks what you did with it, they feel truly heard. May I set it up that way?”',
          rubric: ['Takes the fear of dropping out seriously', 'Contrasts short-term with long-term trust', 'Proposes a concrete set-up'],
        },
      },
      sayIt: 'Explain in 60 seconds what consultation theatre costs and how you give a session an honest mandate.',
      terms: [
        {
          term: 'Consultation theatre',
          def: 'Asking for opinions while the outcome is already fixed, so people notice their input does not count.',
        },
        {
          term: 'Closing the loop',
          def: 'The owner comes back within an agreed time with what was adopted and what was not, and why.',
        },
        {
          term: 'Session mandate',
          def: 'What the group may decide, advise on or only hear, put in the invitation beforehand.',
        },
        {
          term: 'Decision owner',
          def: 'The person who takes the decision the session provides input for.',
        },
      ],
    },
    {
      id: 'pm.formats.floor',
      gist: 'Outside the meeting room you see what happens: gemba walk and interviews at the start, a demo during execution, a kaizen event for an area.',
      title: 'Four formats outside the meeting room',
      pre: [
        {
          q: 'You start an improvement project in a production department. What helps most to learn the real situation?',
          options: [
            'Look on the floor and ask questions',
            'Read all the reports of the past year at the office in the room',
            'Send a questionnaire to all employees and keep track of the results',
            'Have the department manager give a presentation in the meeting room',
          ],
          answer: 'Look on the floor and ask questions',
          why: 'On the spot you see what reports and conversations in a room miss.',
        },
      ],
      teach: [
        'Reports and meetings show what people say; the shop floor shows what happens. A project lead has four formats outside the meeting room: the gemba walk, the interview round, the demo and the kaizen event. Each has a purpose, participants, a duration and an output, and each fits a different moment in the route.',
        'The gemba walk is a leader’s fixed round of the floor. As project lead you join one: looking and asking where the work happens, before you do anything. The Lean Enterprise Institute describes it as direct observation and inquiry to understand the current situation before you act. Duration: 30 to 60 minutes. Output: notes and a list of questions.\n\nHow to look is in Go and see: the gemba in the module Engineering problem solving in Engineering; the fixed round in Leader standard work and the gemba walk in Land.',
        'The interview round: one-to-one conversations with people at different levels. Eight to ten conversations of 45 minutes; output: themes and quotes. The demo: showing the working result to the people who will work with it, at the place where they use it; 30 to 60 minutes; output: a list of reactions.\n\nThe kaizen event: a team improves one area for a few days, often three to five; output: a changed area and a follow-up list. See Kaizen: every day and in events in the module Engineering problem solving in Engineering.',
        'When does which format fit? Gemba walk and interview round at the start, in Intake and Plan: learning what exists. The demo during Run: showing what has been built. The kaizen event when an area is understood and a team can change it.\n\nThey complement each other: first look, then ask, then build and show, then improve with a team.',
      ],
      example: {
        kind: 'worked',
        text: 'The first ten weeks of an improvement project at a manufacturer, with the four formats in order.\n\nWeek 1: gemba walk of 45 minutes on two shifts with the shift leader; output: a list of nine questions. Weeks 2 and 3: interview round, nine conversations of 45 minutes. Week 4: playback of the themes to the team. Weeks 6 and 8: demo of the new planning board at the line, for the operators and the shift leader; output: twelve reactions, five changes. Weeks 9 and 10: a four-day kaizen event on the packing department; output: a new layout and a follow-up list of eleven actions.',
      },
      said: 'What you hear in projects: “Come and see for yourself, then you will understand.”',
      recall: [
        {
          q: 'What is a gemba walk?',
          options: ['A tour along the line to show visitors how the process runs', 'Going to look and ask where the work happens, before you act', 'A round of the workplaces to check the safety rules', 'A walk by management along the floor to thank the employees'],
          answer: 'Going to look and ask where the work happens, before you act',
          why: 'The gemba walk is meant to understand the current situation before you do anything.',
        },
        {
          q: 'When do you plan an interview round in the route?',
          options: ['At the end, to evaluate the result of the project', 'Only if a kaizen event has failed completely', 'During a demo to note the reactions of users', 'At the start, to learn what is going on'],
          answer: 'At the start, to learn what is going on',
          why: 'An interview round is a way to find themes early.',
        },
        {
          q: 'What is the output of a kaizen event?',
          options: ['A report for management with recommendations', 'A list of names of people who must improve', 'A changed area and a follow-up list of actions', 'A new work procedure book for the whole company'],
          answer: 'A changed area and a follow-up list of actions',
          why: 'An event changes an area and leaves actions for after the event.',
        },
        {
          q: 'Where do you hold a demo?',
          options: [
            'At the place where the users use the result',
            'In a meeting room at the office, with slides and a good projector',
            'Only with the sponsor in the department, without the users there',
            'Online with a recorded video, so everyone can see it later',
          ],
          answer: 'At the place where the users use the result',
          why: 'On the spot you see at once whether it works for the people who use it.',
        },
      ],
      situation: {
        scene: 'You start a project at a manufacturer. The manager says: “I will arrange a room for a kick-off and a workshop. You have no business on the floor, they are working hard there.”',
        ask: 'What do you say?',
        model: '“Those two meetings are good. May I also walk along for an hour with the shift leader, without asking or changing anything? Then I know what really happens and I make the workshop better. I will come outside peak times and tell the operators that I am learning, not judging.”',
        rubric: ['Acknowledges the planned meetings', 'Asks for a small, concrete time on the floor', 'Limits the disturbance to the operators'],
        pushback: {
          lines: ['“If you walk around, they think they are being assessed.”', '“We have just tightened the safety rules; you cannot just walk onto the line.”'],
          model: '“That is a good point. I will come with the shift leader, who can explain why I am there. I follow the safety rules, get the right protective equipment and stay on the walkways. Can we agree a time together and inform the operators beforehand?”',
          rubric: ['Acknowledges the concern about assessment', 'Takes the safety rules seriously', 'Proposes an arrangement and advance information'],
        },
      },
      sayIt: 'Explain in 60 seconds which four formats outside the meeting room a project lead can organise and when each fits.',
      terms: [
        {
          term: 'Gemba walk',
          def: 'A leader’s fixed round of the floor to see the process and ask questions.',
        },
        {
          term: 'Interview round',
          def: 'One-to-one conversations with people at different levels to learn early what is going on.',
        },
        {
          term: 'Demo',
          def: 'Showing the working result to the people who will work with it, at the place where they use it.',
        },
        {
          term: 'Kaizen event',
          def: 'A team working full-time for a few days, often three to five, on one area; also called a kaizen blitz.',
        },
      ],
    },
    {
      id: 'pm.formats.interviews',
      gist: 'Hold eight to ten interviews across all levels with five open questions, write in the other person’s words and summarise in themes with quotes.',
      title: 'Running an interview round',
      pre: [
        {
          q: 'You are going to interview nine people about their work. How do you choose whom?',
          options: [
            'The nine people who have been with the department the longest',
            'Only the people the manager points out to you as suitable',
            'A spread across levels and roles, also critical people',
            'Only the people who say themselves that they would like to take part',
          ],
          answer: 'A spread across levels and roles, also critical people',
          why: 'A spread across levels and roles prevents you from hearing one side of the story.',
        },
      ],
      teach: [
        'An interview round at the start of a project produces themes you find nowhere in documents. Choose eight to ten people across levels and roles, a sample across levels: operators, planners, a team lead, a manager, someone from the process before or after. Ask the sponsor for a list and add two yourself. A common practice in consulting assignments; there is no fixed standard.',
        'Make an interview guide with five open questions. For example: What does a normal week look like? What do you run into? What goes well and should stay? What would you change first? Whom else should I talk to? Duration: 45 minutes. Listen, ask follow-up questions and do not propose solutions yourself.',
        'Write in the other person’s words, not in your own interpretation. Agree beforehand how anonymous it is: you report themes and quotes without names, and only you read the notes. Plan 30 minutes after each conversation to finish the notes.\n\nBe honest if you cannot promise something, for example that in the case of a crime or a safety risk you must report something.',
        'Then theming: put each point on a note, group them into about five themes, count how many people named each theme and pick one quote per theme. Present this in one playback session of an hour to the whole group: themes, counts, quotes. Ask: what do you recognise, what do you miss? No solutions yet.\n\nFor a review with interviews in an independent examination: see Leading a project review in When you’re stuck.',
      ],
      example: {
        kind: 'worked',
        text: 'An interview round at the planning department of a grid operator: nine interviews.\n\nSample: two planners, two work preparers, a technician, a buyer, a team lead, a manager, a colleague from customer service. A guide with five questions, 45 minutes per conversation. Time: 9 × 45 + 9 × 30 minutes of notes = 675 minutes, about 11 hours.\n\nTheming yields five themes. The biggest: “we hear too late about changes in the order”, named by 7 of 9. The playback session takes an hour; the group recognises four of the five themes and adds one.',
      },
      said: 'What you hear in projects: “We have never told this to anyone before.”',
      recall: [
        {
          q: 'Why do you write in the other person’s words?',
          options: ['Because your interpretation colours the picture later', 'Because it makes the conversations shorter and smoother', 'Because the other person cannot look it up again later', 'Because a standard for interviews prescribes it'],
          answer: 'Because your interpretation colours the picture later',
          why: 'Quotes and own words keep the content close to what was said.',
        },
        {
          q: 'What is theming?',
          options: [
            'Typing out all conversations word for word and keeping them in a folder',
            'Improving the questions for the next conversation based on the previous one',
            'Choosing a theme for the kick-off of the project',
            'Grouping points into themes and counting how many people named each theme',
          ],
          answer: 'Grouping points into themes and counting how many people named each theme',
          why: 'Theming turns separate conversations into a ranking with counts.',
        },
        {
          q: 'You hold 8 interviews of 45 minutes and spend 30 minutes on notes after each. How many hours is that in total?',
          number: 10,
          tolerance: 0.2,
          unit: 'hours',
          why: '45 + 30 = 75 minutes per interview. 8 × 75 = 600 minutes = 10 hours.',
          hint: 'Add the duration of conversation and notes, multiply by the number of conversations and convert to hours.',
        },
        {
          q: 'What do you not yet do in the playback session?',
          options: ['Show the themes and counts', 'Discuss and choose solutions', 'Read out quotes', 'Ask what the group recognises and misses'],
          answer: 'Discuss and choose solutions',
          why: 'First recognise, then solve; otherwise it becomes a discussion about one’s own solution.',
        },
      ],
      situation: {
        scene: 'You do an interview round at a manufacturer. An operator says halfway: “I will tell you, but please do not tell my team lead.” You know the team lead has the list of the people interviewed.',
        ask: 'What do you do?',
        model: '“Thank you for saying so. I only report themes and quotes without names, and I leave nothing with your team lead that can be traced back to you. If a quote would be too recognisable, I leave it out or ask your permission first. Is that how you want it?”',
        rubric: ['Acknowledges the concern about confidentiality', 'Explains how you report anonymously', 'Offers control over too recognisable quotes'],
        pushback: {
          lines: ['“But you will show who said what if the manager asks, won’t you?”', '“Anonymity is fake, because everyone knows each other’s words.”'],
          model: '“No, I agreed that with the manager beforehand: only themes and quotes without names. If a quote is too recognisable I leave it out or ask permission. If the manager insists, I say I cannot give it, and I will tell you.”',
          rubric: ['Makes the agreement with the manager clear', 'Acknowledges quotes can be recognisable', 'Promises to be transparent about pressure'],
        },
      },
      sayIt: 'Explain in 60 seconds how you set up and play back an interview round of nine conversations.',
      terms: [
        {
          term: 'Interview guide',
          def: 'A short list of open questions you use in each conversation, so the conversations are comparable.',
        },
        {
          term: 'Sample across levels',
          def: 'A choice of people from different levels and roles, so you do not hear one side of the story.',
        },
        {
          term: 'Theming',
          def: 'Grouping points from conversations into themes and counting how many people named each theme.',
        },
        {
          term: 'Playback session',
          def: 'One session in which you give the themes, counts and quotes back to the group, without solutions.',
        },
      ],
    },
    {
      id: 'pm.formats.demo',
      gist: 'Show a demo on the floor where it is used, ask for feedback rather than approval, and choose the work format by the question.',
      title: 'A demo on the floor and choosing the right format',
      pre: [
        {
          q: 'A new planning board is ready in a pilot cell. What is the best way to show it to the operators?',
          options: ['A presentation in the canteen during lunch', 'At the board itself, with the operators, and asking for reactions', 'An email with photos and a manual', 'A demonstration by the project lead without letting them do anything'],
          answer: 'At the board itself, with the operators, and asking for reactions',
          why: 'On the spot and with hands on the board you notice what works and what does not.',
        },
      ],
      teach: [
        'A review outside software shows the working result where it is used, for example a pilot cell, a new board or a new form. Invite the users and the decider, 30 to 45 minutes, and let a user really try it. Output: a list of reactions. The Scrum Guide (2020) says the Sprint Review is a working session and never a gate to releasing value; that starting point applies here too. See The five Scrum events and Stage-gate and agile in manufacturing.',
        'The difference is feedback versus approval. Ask for feedback, not for approval. “What would stop you from using this?” yields more than “Is this good?”. Approval is a decision that falls elsewhere, with the sponsor or at a gate. The demo asks what can be better. Within a week write down what you change and what not, and why, and send it back to the participants.',
        'Choose the format by the question and the phase. What actually happens here? Gemba walk. What do people find and miss? Interview round. Does this work for you? Demo. Can a team now improve this area? Kaizen event. In the early phase you learn (gemba walk, interviews), in the middle you show (demo), once an area is understood you improve with a team.',
        'Exceptions on the floor. Shift work: do the demo with each shift or at the shift change; once is not enough and the night shift counts. Safety rules: agree with the supervisor what is allowed and what not, such as protective equipment and forbidden zones. A works council that must be informed: tell it beforehand if something changes the work or the measurement of people. Remote sites: let a local leader run the demo or do it by video with someone on the spot.',
      ],
      example: {
        kind: 'faded',
        text: 'Three moments in one project at a manufacturer.\n\nA. Week 2: nobody agrees why scrap on line 3 is rising.\nB. Week 7: a new board for shift handover hangs in a pilot cell on line 3. Two shifts work there.\nC. Week 12: the packing department is full of waiting time and the team wants to improve it itself.',
        ask: 'Choose the format for each moment and design the demo for B: where, who, how long and what do you ask?',
        reveal: 'A: a gemba walk at line 3 on both shifts, possibly supplemented with a few conversations; the question is what happens, not what people think. B: a demo at the board during shift handover, on both shifts, for the operators, the shift leader and the production manager, 30 minutes. You let an operator really use the board and ask: “What would stop you from using this?” You inform the works council beforehand if it touches the measurement of people. C: a kaizen event, provided there is an owner for the improvements; if not, first that agreement (see the next lesson).',
      },
      said: 'What you hear in projects: “Nice that you show it. But now we are not allowed to change it?”',
      recall: [
        {
          q: 'What is the difference between feedback and approval in a demo?',
          options: [
            'Feedback is written and approval is always given orally',
            'Feedback comes from the sponsor and approval comes from the operators',
            'Feedback asks what can be better, approval falls elsewhere',
            'There is no difference; both words mean that someone agrees',
          ],
          answer: 'Feedback asks what can be better, approval falls elsewhere',
          why: 'The demo is a working session for improvement; a gate is another moment.',
        },
        {
          q: 'Which format fits the question “what actually happens here?”',
          options: ['A gemba walk', 'A demo', 'A kaizen event', 'A steering group'],
          answer: 'A gemba walk',
          why: 'A gemba walk is meant to see what really happens before you change anything.',
        },
        {
          q: 'What do you do for a demo in shift work?',
          options: ['You do one demo with the day shift; the rest will hear of it', 'You send the night shift an email', 'You wait until all shifts are present at once', 'You do the demo with each shift or at the shift change'],
          answer: 'You do the demo with each shift or at the shift change',
          why: 'Every shift uses the result, so every shift must be able to react.',
        },
        {
          q: 'What do you use the Scrum Guide for here?',
          options: ['As a prescription that every demo on the floor must follow', 'As a starting point: a review is a working session, not a gate', 'As proof that demos are mandatory in manufacturing', 'As a list of roles that attend every review'],
          answer: 'As a starting point: a review is a working session, not a gate',
          why: 'The Scrum Guide describes the review as a working session; we take that as a starting point, not a prescription.',
        },
      ],
      situation: {
        scene: 'You organise a demo of a new board in a pilot cell. The production manager comes to watch and says to the operators: “This is how it is going to be, you just have to use it.” The operators say nothing more.',
        ask: 'What do you do?',
        model: '“Thank you for being here. I would like to hear what the operators think before we roll it out. May I ask them what would stop them from using it? What they say we use to adjust it, and in a week I will show what we have changed.”',
        rubric: ['Thanks the manager for being present', 'Turns the question into what would stop use', 'Promises to show what has changed within a week'],
        pushback: {
          lines: ['“I do not want them to think they can choose. It has been decided.”', '“If I allow comments here, I will get resistance later.”'],
          model: '“I understand. Then I will say clearly that the board stays but that the layout can still change. That is more honest than asking whether it is good. Reactions now prevent resistance later, because we adjust things before the roll-out, not after.”',
          rubric: ['Acknowledges the decision has been taken', 'Separates what is fixed from what is open', 'Links reactions to less resistance later'],
        },
      },
      sayIt: 'Explain in 60 seconds how you design a demo on the floor and how you choose between the four formats.',
      terms: [
        {
          term: 'Review',
          def: 'A session in which you show the working result to the users and the decider, to hear what can be better.',
        },
        {
          term: 'Working result',
          def: 'Something users can really try, not a plan or a presentation.',
        },
        {
          term: 'Feedback versus approval',
          def: 'Feedback asks what can be better; approval is a decision that falls elsewhere.',
        },
        {
          term: 'Pilot cell',
          def: 'One bounded part of the floor where a new way of working is tried first.',
        },
      ],
    },
    {
      id: 'pm.formats.kaizenevent',
      gist: 'A kaizen event succeeds when the area owner frees people, the sponsor protects the week and a follow-up list secures the actions.',
      title: 'Commissioning a kaizen event',
      pre: [
        {
          q: 'A production manager says: “Let us do a kaizen week next month.” What do you ask first?',
          options: [
            'Which room is free that week for the team to work in',
            'How the room is arranged and where the lunch comes from',
            'Who the best facilitator in the whole company is for this week',
            'Who takes over the improvements afterwards and frees up the people',
          ],
          answer: 'Who takes over the improvements afterwards and frees up the people',
          why: 'An event stands or falls with freeing people and taking over; the rest is execution.',
        },
      ],
      teach: [
        'How a kaizen event runs is in Kaizen: every day and in events in the module Engineering problem solving in Engineering. Here the subject is commissioning an event: the decision to commission one. Costs: six to ten people, three to five days, lost production, overtime and replacement. Count in person-hours: 8 people × 4 days × 8 hours = 256 hours, still without lost production.',
        'Who frees up the people? The owner of the area, usually the production manager. The sponsor opens the event, protects the week (no phone calls to the team) and attends the close-out report-out to hear what the team found and proposed. They decide as much as possible on the spot.\n\nWithout that role the close-out becomes an explanation with no consequences.',
        'The follow-up list makes or breaks the event: every action with an owner and a date, a quarter of an hour together every week for the first 30 days (see 30-day action list in Kaizen: every day and in events). One person owns the list afterwards.\n\nNo owner, and the improvements stay on the shelf and the department learns that events are a lot of effort without results.',
        'When no event? When there is no owner afterwards, when the problem needs measurements over months (rare failures, variation) or when the area is about to reorganise. Choose daily kaizen or a smaller event instead.\n\nThe gemba walk of directors is also a trap: it easily becomes an inspection tour where people tidy up and fall silent. Agree the walk is for learning, walk with the line leader, ask questions instead of judging, give no orders on the spot except for safety and tell people afterwards what you learned.',
      ],
      example: {
        kind: 'faded',
        text: 'The production manager of a manufacturer wants “a kaizen week next month” on a line where seven people work. Nobody will take over the improvements afterwards; the line leader has no time for it and the manager says: “The team will arrange that itself.” The line is running at full capacity and the shift leader fears for the delivery.',
        ask: 'What do you agree before the event takes place? What does it cost and when do you say no?',
        reveal: 'First an owner with mandate and time, for example the line leader with two hours a week for 30 days, and one problem in one number (the changeover time). Costs: 7 people × 4 days × 8 hours = 224 person-hours, plus production that is lost in those days; agree who pays for that and which delivery they bring forward first. The sponsor opens and attends the close-out, and the follow-up list goes to one person.\n\nIf the manager says there is nobody for the follow-up, you say no to the event and offer daily kaizen or a smaller event. You decide within a week.',
      },
      said: 'What you hear in projects: “The event was great, but nothing happened afterwards.”',
      recall: [
        {
          q: 'A kaizen event with 8 people lasts 3 days of 8 hours. How many person-hours is that, still without lost production?',
          number: 192,
          tolerance: 1,
          unit: 'hours',
          why: '8 × 3 × 8 = 192 person-hours.',
          hint: 'Multiply the number of people by the number of days and the hours per day.',
        },
        {
          q: 'What role does the sponsor have at a kaizen event?',
          options: [
            'Opens the event, protects the week and decides at the close-out',
            'Leads the event as facilitator, from start to finish',
            'Stays out of it completely to leave the team free to work',
            'Writes the report afterwards and passes it on to the board',
          ],
          answer: 'Opens the event, protects the week and decides at the close-out',
          why: 'The sponsor gives mandate and takes decisions at the close-out; without that it stays a presentation.',
        },
        {
          q: 'When do you not commission a kaizen event?',
          options: ['When the team is enthusiastic and eager to begin', 'When the area has been improved before by another team', 'When nobody will take over the follow-up', 'When a facilitator is available for the whole week'],
          answer: 'When nobody will take over the follow-up',
          why: 'Without an owner afterwards the follow-up list stays put and the event loses its value.',
        },
        {
          q: 'Why does a directors’ gemba walk quickly become an inspection tour?',
          options: [
            'Because directors have too little time to really walk around',
            'Because people tidy up and fall silent when someone judges',
            'Because the floor is always too messy for a visit',
            'Because there are no safety rules for visitors to the department',
          ],
          answer: 'Because people tidy up and fall silent when someone judges',
          why: 'A judgment from above makes people defend themselves; a question lets them tell.',
        },
      ],
      situation: {
        scene: 'A director at a grid operator wants “a kaizen week” at a planning department. He shows you the date for next month and says he will come and look on the first day himself. The team lead has not yet been consulted.',
        ask: 'What do you say?',
        model: '“Thank you for the initiative. Before we fix the date, I want to talk to the team lead: who takes over the improvements, who frees up the team and where does the work go then? If you come on the first day, it is best that you open and say what you want to learn, and come back on the last day to hear what the team found.”',
        rubric: ['Thanks them for the initiative', 'Asks about the owner and freeing up people', 'Gives the director a useful role'],
        pushback: {
          lines: ['“I have no time to arrange all that. You arrange it.”', '“It is about the results. They will work out the rest themselves.”'],
          model: '“I will arrange the preparation, but two things only you can do: free up the team lead and decide who does the follow-up. That costs you a quarter of an hour. If that is missing, you get a week of enthusiasm and then nothing. Shall we plan that quarter of an hour this week?”',
          rubric: ['Takes the preparation on', 'Makes clear what only the director can do', 'Proposes a short moment this week'],
        },
      },
      sayIt: 'Explain in 60 seconds what a kaizen event costs, what you agree beforehand and when you say no.',
      terms: [
        {
          term: 'Commissioning an event',
          def: 'The decision to have a kaizen event take place: costs, who frees people up and who follows up.',
        },
        {
          term: 'Close-out report-out',
          def: 'The presentation at the end of the event in which the team shows what it found and proposes, and the sponsor decides.',
        },
        {
          term: 'Follow-up list',
          def: 'The actions left open after the event, each with an owner and a date, kept by one person.',
        },
        {
          term: 'Inspection tour',
          def: 'A round of the floor in which people feel judged, tidy up and fall silent, instead of telling.',
        },
      ],
    },
  ],
};
