// pm.land (English): landing, making the change stick: standardised work and training, adoption and handover, sustaining, benefits and reflection. Four topics, four levels each.
export default {
  lessons: [
    // Topic 1: standardised work and training
    {
      id: 'pm.land.training',
      film: 'pm.land.training',
      title: 'Training and work instructions',
      pre: [
        {
          q: 'What is the best check that a training worked?',
          options: ['A satisfaction score at the end of the training', 'A written test straight after the session', 'Watching people do the task on the job a week later', 'Attendance numbers per shift and department'],
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
          options: ['In a classroom with slides and a short quiz at the end', 'From a clear instruction sent by e-mail to everyone', 'In an e-learning module they can follow at their own pace', 'On the job: show, do together, let them do, check'],
          answer: 'On the job: show, do together, let them do, check',
          why: 'Skills need practice on the real equipment with feedback.',
        },
        {
          q: 'Many people make the same mistake after training. What does that tell you?',
          options: ['They weren’t paying attention during the training session', 'The instruction or training needs fixing', 'They are quietly resisting the change', 'More people need to be trained on it'],
          answer: 'The instruction or training needs fixing',
          why: 'A shared mistake points at the system, not at the individuals.',
        },
        {
          q: 'When should you train people?',
          options: ['Just before they need it, with support in the first weeks after', 'As early as possible, months ahead, so there is time to practise', 'Only after go-live, when the real problems start to appear', 'Once a year, in a refresher session for the whole department'],
          answer: 'Just before they need it, with support in the first weeks after',
          why: 'Training long before use is largely forgotten by the time it is needed.',
        },
        {
          q: 'How do you test a new work instruction?',
          options: ['Let someone who wasn’t involved follow it while you watch', 'Have the author read it again carefully the next morning', 'Send it to the manager for approval before it is printed', 'Check the spelling and the photos against the house style'],
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
      id: 'pm.land.standardwork',
      title: 'Standardised work: the base under every improvement',
      pre: [
        {
          q: 'In Lean, what is the main purpose of standardised work?',
          options: ['Telling operators exactly how fast they have to work', 'A folder of procedures ready for the next audit', 'A baseline to see deviations against and to improve from', 'Proving to the customer that the process is under control'],
          answer: 'A baseline to see deviations against and to improve from',
          why: 'Without a recorded current best way you cannot see what deviates, or know whether a change is really an improvement.',
        },
      ],
      teach: [
        'Standardised work is, in Lean, the recorded current best way to do a task: who does what, in which order, in how much time. It is not a thick procedure but a sheet at the workstation.\n\nThe Lean Enterprise Institute names three elements: the takt time, the work sequence and the standard work-in-process. If one is missing, you have a work instruction, but not yet standardised work.',
        'The takt time is the pace the customer asks for: available time divided by demand, such as 27,000 seconds / 600 boxes = 45 seconds per box. The arithmetic is in Capacity and flow; here takt is the beat the standard is built on.\n\nThe cycle time is how long an operator really takes for one round. Time ten rounds in a row on the floor and record the lowest time that keeps coming back. A round with a problem goes on the problem list, not into the standard.',
        'The work sequence is the fixed order of the steps, including the walking. A fixed order means less forgetting, less searching and equal quality between shifts.\n\nThe standard work-in-process is the smallest number of pieces that must sit in the process to keep work flowing: one in each machine, plus the pieces that must first cool, dry or set. Much more, and the stock hides problems; less, and someone stands waiting.',
        'Standardised work is not the same as the TWI work instruction. The work instruction teaches a new employee how to do a task, with key points. Standardised work shows the leader at a glance whether the work runs to plan.\n\n“Where there is no standard, there can be no kaizen” is often attributed to Taiichi Ohno, father of the Toyota Production System, though no source in his own writing is known. Kaizen is improving step by step. Without a standard you do not know your starting point.',
        'What often goes wrong: a consultant writes the standardised work at a desk, and after a week the operators are back to their own ways. Write it with the people who do the work and measure it on the floor.\n\nExperts argue about how tight to be. Some want every hand movement recorded; others only the steps that decide quality and safety. A sharp question for the team leader: “Where can you see here that someone deviates from the standard?”',
      ],
      example: {
        kind: 'worked',
        text: 'At a food plant you take the soup packing line to standardised work. Takt comes from the capacity study: 27,000 seconds per shift / 600 trays = 45 seconds per tray.\n\nStep 1: with the team leader you time station 3 ten rounds in a row, walking included. Nine rounds take 42 to 45 seconds, most of them 42; one takes 58, because the film roll ran out. You record 42 seconds, the lowest time that keeps coming back, and put the film roll on the problem list.\nStep 2: the work sequence. Halfway through, the operator walks off to fetch film; the film rack moves within reach and the order is fixed: take tray, check weight, place film, seal, push onto the cooling track.\nStep 3: the standard work-in-process. A sealed tray of hot soup must cool for 90 seconds before station 4 can label it: 90 / 45 = 2 trays on the cooling track, plus 1 in the sealer, so 3. More only hides problems.\nStep 4: one sheet per station with sequence, time and work-in-process. The team leader checks it every hour.',
      },
      said: 'What you hear in projects: “Standardised work? Then we become robots. Everyone has his own way, and it works fine.”',
      recall: [
        {
          q: 'After injection moulding, each part must cool for 135 seconds before the next step can handle it. Takt is 45 seconds, and one part is always in the mould. How many parts make up the standard work-in-process for this step, cooling rack and mould together?',
          number: 4,
          tolerance: 0.1,
          unit: 'parts',
          hint: 'Every takt one part goes into the rack. How many takts does a part stay there? Then add the part in the mould.',
          why: '135 / 45 = 3 parts cooling, plus 1 in the mould = 4 parts. Fewer and the next step waits; more only hides problems.',
        },
        {
          q: 'According to the Lean Enterprise Institute, which three elements make up standardised work?',
          options: ['Takt time, work sequence and standard work-in-process', 'Takt time, a work instruction and a signed audit sheet', 'Work sequence, an OEE target and a skills test per operator', 'Cycle time, the shift roster and a safety data sheet'],
          answer: 'Takt time, work sequence and standard work-in-process',
          why: 'Pace, order and the minimum stock in the process together make the standard; the rest are aids.',
        },
        {
          q: 'How does standardised work differ from a TWI work instruction?',
          options: ['Standardised work is for new staff, the instruction for experienced staff', 'There is no difference; they are two words for one sheet', 'The work instruction sets takt, standardised work sets quality', 'The instruction teaches the task; standardised work shows deviations'],
          answer: 'The instruction teaches the task; standardised work shows deviations',
          why: 'The work instruction is a teaching aid with key points; standardised work is the norm the leader compares running work against.',
        },
        {
          q: 'Why do Lean people say you need a standard before you improve?',
          options: ['Because otherwise the customer won’t issue a certificate', 'Because otherwise you can’t tell if a change is better', 'Because operators may not work without a standard', 'Because improving is only allowed after the first audit'],
          answer: 'Because otherwise you can’t tell if a change is better',
          why: 'An improvement is better than something; without a recorded starting point you cannot compare.',
        },
      ],
      situation: {
        scene: 'You are at a plastics plant working on a new assembly cell. The day-shift lead, Ronald, says: “You write something down, we’ll do it our way anyway. My people know perfectly well how to fit a lid.”',
        ask: 'How do you get standardised work the shifts will actually use?',
        model: '“Your people know it better than I do, so I don’t want to write it, I want them to write it. Let’s time ten rounds tomorrow with your two fastest operators and see why they’re faster. What works becomes the standard for all shifts. And if someone finds a better way later, we change the sheet.”',
        rubric: [
          'Lets the operators make the standard themselves',
          'Measures on the floor instead of writing at a desk',
          'Makes clear the standard can improve',
        ],
        pushback: {
          lines: [
            '“Timing ten rounds with a stopwatch? My people will feel watched.”',
            '“And then management uses those times to push us harder.”',
          ],
          model: '“Understandable. We time the steps, not the people, and the operators can hold the stopwatch themselves if they like. The times don’t go into any appraisal; they show where the work gets stuck. If you see them used against you anyway, tell me and I’ll stop.”',
          rubric: [
            'Takes the fear of being watched seriously',
            'Explains what the timings are and are not for',
            'Gives the shift lead a concrete way to hold him to it',
          ],
        },
      },
      sayIt: 'Explain to a shift lead in 60 seconds why standardised work is not a straitjacket but the starting point for improvement.',
      terms: [
        { term: 'Standardised work', def: 'The recorded current best way to do a task: takt, work sequence and standard work-in-process.' },
        { term: 'Takt time', def: 'The pace the customer asks for: available production time divided by the quantity required.' },
        { term: 'Cycle time', def: 'How long an operator or machine really takes for one round, measured on the floor.' },
        { term: 'Work sequence', def: 'The fixed order of the steps of a task, including the walking.' },
        { term: 'Standard work-in-process', def: 'The smallest number of pieces in the process needed to keep work flowing.' },
      ],
    },
    {
      id: 'pm.land.skills',
      title: 'The skills matrix and cross-training',
      pre: [
        {
          q: 'The skills matrix on the wall carries last year’s date. What does that usually tell you?',
          options: ['That nobody new has started or left since then', 'That nobody uses it to plan staffing and training', 'That the team’s skills are stable and in good order', 'That HR keeps the current version digitally'],
          answer: 'That nobody uses it to plan staffing and training',
          why: 'A matrix used daily changes often. An old date almost always means wall decoration.',
        },
      ],
      teach: [
        'A skills matrix is a table with the employees in the rows and the tasks or stations in the columns. Each cell shows how well someone masters that task.\n\nIn Lean it hangs on the shop floor, by the team board, and the team leader uses it every day: who do I put where today, and who needs to learn what? A matrix in an HR system that nobody on the floor sees steers nothing.',
        'Many plants use ILUO, a scale from Japanese industry. The letters fill up, as it were: I, in training, only under supervision. L, does it alone to the standard. U, also meets the standard time and solves normal problems. O, can teach it to others.\n\nNote: companies define the letters differently. Agree per plant what each letter means, and rate on what you see, not on hours of training attended.',
        'Cross-training means people can run several stations. It covers sickness, holidays and changing demand, and makes rotation possible, which spreads heavy work more fairly.\n\nA widely used rule of thumb, the rule of three: at least three people per station who can do it alone, so at L or higher. With two you are exposed as soon as one is sick and one on holiday. It is a rule of thumb, not a norm; critical stations sometimes need more.',
        'From gaps to a plan. Count per station how many people are at L or higher, and put the shortfalls in a training timetable: who, which station, which trainer, which week. TWI already used this timetable in the 1940s.\n\nTrain with Job Instruction and let only someone at O train. Plan realistically: bringing a new task to L often takes weeks of practice, not an afternoon.',
        'What often goes wrong: the matrix becomes an appraisal tool, people feel judged and fill it in kindly. Or out of habit the team leader always puts the best operator on the hardest station, so nobody else learns it.\n\nExperts differ on rewards: some tie pay to the number of stations, others say that leads to paper qualifications. A sharp question for the team leader: “Who can run this station if Fatima is sick tomorrow?”',
      ],
      example: {
        kind: 'faded',
        text: 'At a plastics plant a cell runs with five stations and eight operators. The matrix, just updated with the team leader, shows how many people per station are at L or higher: station 1: four, station 2: two, station 3: two, station 4: one, station 5: none. One operator, Kees, is at O for stations 2, 3 and 4. Station 5 is the new leak tester; the process engineer runs it now.',
        ask: 'How many qualifications are you short under the rule of three, where do you start, and what does your training timetable look like?',
        reveal: 'Needed: 5 × 3 = 15. Present, counting at most three per station: 3 + 2 + 2 + 1 + 0 = 8. Short: 7.\n\nStart with the biggest risk: station 5, where no operator can do it, and station 4, which hangs on one person. The process engineer, the only one at O there, first teaches three operators station 5 with Job Instruction; Kees trains two on station 4 and then one each on stations 2 and 3.\n\nTimetable: two qualifications a month, because each learner needs weeks of practice. After four months every station is at three, and the team leader checks the matrix weekly at the team board.',
      },
      said: 'What you hear in projects: “Only Kees can run station 4. When Kees is on holiday, we just don’t schedule that order.”',
      recall: [
        {
          q: 'What does the O on an ILUO matrix usually mean?',
          options: ['That someone is still learning the task under supervision', 'That someone does the task alone to the standard', 'That someone meets the standard time but doesn’t solve problems yet', 'That someone masters the task and can train others'],
          answer: 'That someone masters the task and can train others',
          why: 'O is the highest level: mastering it and passing it on. Only those people give Job Instruction.',
        },
        {
          q: 'A line has 7 stations. Under the rule of three you want three people at L or higher per station. There are now 13 such qualifications, and no station has more than three. How many more qualifications must you train?',
          number: 8,
          tolerance: 0.1,
          unit: 'qualifications',
          hint: 'First work out how many qualifications you need in total: stations times three.',
          why: '7 × 3 = 21 needed; 21 − 13 = 8 more.',
        },
        {
          q: 'Why does a Lean skills matrix hang on the shop floor and not only in the HR system?',
          options: ['Because the team leader uses it every day for staffing and training', 'Because the HR system can’t display the ILUO letters', 'Because the customer’s auditor wants to see it on the floor', 'Because operators then see who has the best rating'],
          answer: 'Because the team leader uses it every day for staffing and training',
          why: 'It is a steering tool for today and next week, not an archive.',
        },
        {
          q: 'The team leader always puts the best operator on the hardest station. What is the risk over time?',
          options: ['That quality on that station slowly declines', 'That the other operators feel overlooked and leave', 'That nobody else learns the station and you depend on one person', 'That the best operator earns too much compared with the rest'],
          answer: 'That nobody else learns the station and you depend on one person',
          why: 'Short-term certainty builds a dependency that stops the line when that person is sick or leaves.',
        },
      ],
      situation: {
        scene: 'At a metalworking company the production manager wants you to “quickly make a skills matrix” for a customer audit next month. He wants a neat overview in Excel. The team leaders know nothing about it yet.',
        ask: 'What do you propose?',
        model: '“I can make an overview for the audit, but then we have a document. What I’d like: each team leader fills in the matrix with his people at the team board, on what they see, not on courses. Then you see where you’re exposed, for example stations with only one person. We make a training timetable for that. The auditor then sees a matrix that is really used.”',
        rubric: [
          'Makes the difference between an audit document and a steering tool clear',
          'Lets the team leaders fill in the matrix with their people on what they see',
          'Links the matrix to a training timetable for the gaps',
        ],
        pushback: {
          lines: [
            '“The audit is in four weeks. I don’t have time for a whole exercise with team leaders.”',
            '“And when people see they’re on I, I’ll have trouble with the works council.”',
          ],
          model: '“Four weeks is enough: filling it in takes each team leader an hour with his shift. On the works council, the elected employee body: fair point. Let’s bring it as a plan to train people more broadly, not as an appraisal, and inform the council beforehand. An I means ‘getting training’, not ‘doing badly’.”',
          rubric: [
            'Shows it fits in the time',
            'Takes the works council concern seriously and proposes informing it beforehand',
            'Presents the matrix as development, not judgement',
          ],
        },
      },
      sayIt: 'Explain to a production manager in 60 seconds why a skills matrix on the floor delivers more than an overview for the audit.',
      terms: [
        { term: 'Skills matrix', def: 'A table of employees and tasks that shows per cell how well someone masters a task.' },
        { term: 'ILUO', def: 'A four-step skill scale: in training, works alone, also on time and with problems, can train others. Companies define the letters differently.' },
        { term: 'Cross-training', def: 'Employees being able to do several stations or tasks on their own.' },
        { term: 'Rule of three', def: 'A rule of thumb: at least three people per station who can do it alone.' },
        { term: 'Training timetable', def: 'A plan of who learns which station from which trainer, and in which week.' },
      ],
    },
    {
      id: 'pm.land.sdca',
      title: 'Keeping the standard alive',
      pre: [
        {
          q: 'An operator has found a faster way to set up a mould and only does it that way on his own shift. What is the best response?',
          options: ['Test it, and if it works, update the standard and train every shift', 'Ask him to return to the standard sheet until management has decided', 'Leave it as it is; each shift may keep its own best way of working', 'Send the idea to engineering for an official study before anything else'],
          answer: 'Test it, and if it works, update the standard and train every shift',
          why: 'A standard is the current best way. After a test, a better way should become the new standard for everyone.',
        },
      ],
      teach: [
        'Masaaki Imai, who made kaizen known in the West, splits a manager’s work into two jobs. Maintenance: making sure the current standard is followed. Improvement: raising the standard.\n\nFor improvement you use PDCA: Plan, Do, Check, Act, the improvement cycle of planning, trying, checking and locking in. For maintenance you use SDCA: Standardize, Do, Check, Act. First record the standard, then do it, check whether the work follows the standard, and correct if it does not.',
        'The two belong together. After every PDCA improvement comes SDCA, or the gain slips away. And whoever takes SDCA seriously keeps seeing where the standard pinches: input for the next PDCA.\n\nKaizen in Lean is improving step by step by the people who do the work. So a standard is today’s best known method, not a law. Tomorrow someone may find a better one.',
        'Agree how a standard changes. A common route: the operator proposes something, the team leader tests it for a few days on one shift and measures, the process owner approves, the sheet is updated, all shifts are trained with Job Instruction, and the old version leaves the floor.\n\nProjects often forget that last step. Version control, with a version number and date on every sheet, prevents three versions hanging side by side.',
        'Big changes, like a new machine or a different sequence that affects quality, go through engineering or quality. Small improvements you keep close to the floor, because an approval round of weeks kills any proposal.\n\nTrack how many proposals come in and how fast they get tested. If none come, the standard is not perfect; nobody feels ownership.',
        'Experts argue about who writes the standard. In the Toyota tradition, as Jeffrey Liker describes it, team members and team leaders write their own standards; in many Western plants the engineer does. The first gives ownership, the second sometimes more technical care.\n\nWhat often goes wrong: a standard unchanged for a year in a plant that has changed. Sharp question: “When was this sheet last updated, and by whom?”',
      ],
      example: {
        kind: 'faded',
        text: 'At a metalworking company, operator Yusuf on the day shift has worked out a clamping sequence that cuts the changeover of the press brake by 4 minutes. His shift has done it that way for three weeks. The evening shift has not: they follow the sheet at the machine. Last week the evening shift made scrap because a colleague did half the old and half the new way. The team leader wants “everyone back on the sheet”.',
        ask: 'What would you propose, step by step?',
        reveal: 'Not back to the old sheet, but lock in the improvement properly. PDCA: the team leader tests Yusuf’s sequence for a week on both shifts and measures changeover time and scrap. If it works, SDCA: the sheet is updated with a new version number, Yusuf and the team leader train every shift with Job Instruction, the old sheet goes.\n\nThen the team leader checks for a few weeks whether everyone follows the new sequence. And you agree with the process owner how the next proposal will run, so it doesn’t sit on one shift for three weeks again.',
      },
      said: 'What you hear in projects: “The standard is the standard. You don’t just go changing it.”',
      recall: [
        {
          q: 'According to Imai, what do you use SDCA for?',
          options: ['To come up with a new improvement and try it out', 'To set the yearly targets for the department', 'To hold the current standard and correct deviations', 'To trace a problem to its cause with the five whys'],
          answer: 'To hold the current standard and correct deviations',
          why: 'SDCA is the maintenance cycle; PDCA the improvement cycle.',
        },
        {
          q: 'In Lean, what is the right attitude to a standard?',
          options: ['The standard is a law only engineering may change', 'It is today’s best known method, which may improve', 'It only applies to new employees in their first month', 'Each shift may adapt it as it sees fit'],
          answer: 'It is today’s best known method, which may improve',
          why: 'A standard records the current best way, precisely so you can see when something is better.',
        },
        {
          q: 'An improvement has been tested and approved. Which step do projects forget most often?',
          options: ['Thanking the operator who had the idea, in front of the team', 'Reporting the result in the monthly report to management', 'Having the controller check the saving before it is reported', 'Training every shift and taking the old version off the floor'],
          answer: 'Training every shift and taking the old version off the floor',
          why: 'Without training and removing the old sheet, two ways will soon hang side by side.',
        },
        {
          q: 'A line has had no improvement proposals for six months. What is the most likely explanation?',
          options: ['Nobody feels ownership, or proposals sit too long', 'The standard is now so good there is nothing left to improve', 'The operators are happy with their work and have no complaints', 'The line runs too little volume to find improvements'],
          answer: 'Nobody feels ownership, or proposals sit too long',
          why: 'Every process can get better. Silence usually points to a system that discourages proposals.',
        },
      ],
      situation: {
        scene: 'At a cable manufacturer you introduced standardised work on the extrusion line three months ago. At your follow-up you see the sheets at the machines are still version 1, while the operators proudly show you two improvements they “just started doing”. The quality manager is not pleased.',
        ask: 'What do you say to the quality manager and the team leader?',
        model: '“The good news: the operators improve things themselves. The risk: nobody records it, so the next shift or a new colleague does it differently. I propose a short route: proposal, a week’s test by the team leader, your approval if it affects quality, update the sheet with a version number, train all shifts. Then we keep the energy and you keep control.”',
        rubric: [
          'Values that the operators improve things themselves',
          'Names the risk of unrecorded changes',
          'Proposes a short, concrete change route with a role for quality',
        ],
        pushback: {
          lines: [
            '“This is exactly why I was against all that standardised work. Everyone just does whatever.”',
            '“Every change has to go through me. That’s how our quality system works.”',
          ],
          model: '“I get your concern; uncontrolled changes are a real risk. What affects product quality must go through you. But if every small improvement waits weeks, operators stop proposing, or do it quietly, as now. Can we decide together which changes need your approval and which the team leader may approve?”',
          rubric: [
            'Acknowledges the quality risk',
            'Shows that a heavy route makes the problem worse',
            'Proposes agreeing together on the line between big and small',
          ],
        },
      },
      sayIt: 'Explain to a quality manager in 60 seconds why a standard must be able to change, and how you do that in a controlled way.',
      terms: [
        { term: 'PDCA', def: 'Plan, Do, Check, Act: the improvement cycle of planning, trying, checking and locking in.' },
        { term: 'SDCA', def: 'Standardize, Do, Check, Act: the maintenance cycle that makes sure the current standard is followed.' },
        { term: 'Kaizen', def: 'Improving step by step, mainly by the people who do the work.' },
        { term: 'Best known method', def: 'The standard as the best way we know now, not as a law.' },
        { term: 'Version control', def: 'Giving every standard sheet a version number and date, so only one valid version hangs on the floor.' },
      ],
    },
    // Topic 2: adoption and handover
    {
      id: 'pm.land.change',
      film: 'pm.land.adoption',
      title: 'What really drives adoption',
      pre: [
        {
          q: 'What best predicts whether operators keep using a new way of working after the project?',
          options: ['How clear and well designed the training slides were', 'Whether their direct supervisor asks about it and uses it', 'How many e-mails and posters announced the change', 'Whether the CEO opened the kick-off meeting in person'],
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
          options: ['A poster campaign on every notice board in the whole plant', 'The new way being easier than the old one for the person doing it', 'A strong project name and a logo that everyone on the floor knows', 'A clear message from head office about the reasons behind it'],
          answer: 'The new way being easier than the old one for the person doing it',
          why: 'If the new way costs them more effort, they will drift back.',
        },
        {
          q: 'Why remove the old way of working when possible?',
          options: ['To make clear that people who resist will be corrected', 'Because Kotter’s eight steps require it at this point', 'To save licence money on the old tools straight away', 'So there is no fallback when things get busy'],
          answer: 'So there is no fallback when things get busy',
          why: 'Under pressure people go back to what they know, if it is still there.',
        },
        {
          q: 'People aren’t adopting and you don’t know why. What is the best first step?',
          options: ['Ask a few of them what makes it hard to use', 'Send a friendly reminder e-mail to the whole team', 'Repeat the training for everyone who missed it', 'Report the low usage to the sponsor this week'],
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
      film: 'pm.land.adoption',
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
          options: ['To keep him busy so he has less time to complain', 'His objections improve the design and he convinces others', 'To show management clearly who is blocking the change', 'Because the works council formally requires critics to join'],
          answer: 'His objections improve the design and he convinces others',
          why: 'Critics often see real flaws, and a converted critic has credibility you lack.',
        },
        {
          q: 'An operator will really lose his Saturday overtime pay. What do you say?',
          options: ['Say nothing for now; with luck it never comes up in the meeting at all', 'Say that it is not your decision and refer him to his own manager', 'Tell him that in the long run he will earn more anyway, so it evens out', 'Acknowledge the loss honestly and explain why you still think it’s right'],
          answer: 'Acknowledge the loss honestly and explain why you still think it’s right',
          why: 'Denying a real loss destroys trust; naming it keeps it.',
        },
        {
          q: 'Which question best uncovers what resistance is about?',
          options: ['“What would have to be true for this to work for you?”', '“Why exactly are you against this, when the others agree?”', '“Do you understand the plan, or shall I explain it again?”', '“Who told you that, and what else did they say about it?”'],
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
      film: 'pm.land.adoption',
      title: 'Communicating change',
      pre: [
        {
          q: 'From whom do employees most want to hear how a change affects their own job?',
          options: ['The CEO or the plant manager', 'The project consultant who made the design', 'HR, through the staff newsletter', 'Their direct supervisor'],
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
        kind: 'faded',
        text: 'A grid operator, the regional power network company, changes how planned jobs get released: from next month, no job enters the week plan without a passed readiness check (people, parts and permits confirmed).\n\nThree groups are affected: five planning team leaders, their planners, and the team leaders of the field crews, whose crews will see fewer but more reliable jobs. The head of planning wants to send one e-mail to all of them on Friday and be done with it.',
        ask: 'Plan the cascade week by week, and say how you check that the message landed.',
        reveal: 'Week 1: the head of planning tells the five team leaders first, with a one-page FAQ, a list of frequently asked questions with answers, and their own questions answered. Week 2: each team leader tells their planners in their own team meeting, using three talking points. Same week, a short message to the field team leaders, because their crews will feel the change.\n\nWeeks 3 and 4: the check is on the board at every planning meeting. In week 4 you ask six planners what they understood. Two think the check is optional; you fix that in the next meeting.',
      },
      said: 'What you hear in projects: “Nobody told us anything. We heard it from the guys in Zwolle.”',
      recall: [
        {
          q: 'Who should hear about a change first?',
          options: ['Everyone at the same time, so nobody hears it second-hand', 'The managers, before their teams', 'The most affected employees, because it is about their work', 'The works council (elected employee body) only'],
          answer: 'The managers, before their teams',
          why: 'Managers then can answer their teams’ questions instead of being surprised.',
        },
        {
          q: 'A rumour about the change is already going round. What do you do?',
          options: ['Communicate the same day what you know, what you don’t yet, and when you will', 'Wait until everything is decided, so you never have to correct yourself', 'Deny the rumour firmly until the steering group has made a decision', 'Ignore it; rumours die down by themselves if you give them no attention'],
          answer: 'Communicate the same day what you know, what you don’t yet, and when you will',
          why: 'Silence lets the rumour set the story; partial honesty beats it.',
        },
        {
          q: 'How do you best equip middle managers?',
          options: ['Send them the full project plan and ask them to read it before the launch', 'Invite them to the steering group so they hear all the background', 'Answer their own questions first and give them talking points and likely questions', 'Let them figure it out; they know their own teams better than you do'],
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
      id: 'pm.land.handover',
      film: 'pm.land.handover',
      title: 'Handing over to the line',
      pre: [
        {
          q: 'When is a handover to the line organisation really done?',
          options: ['When the final presentation has been given to the steering group and the plant manager', 'When all the documentation, instructions and the KPI sheet have been sent to the owner', 'When the owner has run it alone for a few cycles and solved a problem without you', 'When the sponsor has signed off the closing report and the last invoice is paid'],
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
        kind: 'faded',
        text: 'At a cable manufacturer you hand over the new weekly planning meeting to the planning manager, Sanne. The KPI is on-time delivery, the share of orders delivered on the promised date; 92% is normal. You have nine weeks left. She will also have to explain the capacity model, the sheet of available machine and staff hours, to new planners, and deal with rush orders.',
        ask: 'What goes on the handover checklist, how do you split the nine weeks, and what would tell you the handover is done?',
        reveal: 'Checklist: she can read the KPI and knows 92% is normal; she chairs the meeting; she can explain the capacity model to a new planner; she knows what to do when a rush order comes in.\n\nWeeks 1 to 3: you chair, she watches. Weeks 4 to 6: she chairs, you sit beside her and debrief for 10 minutes after. Weeks 7 to 9: she runs it alone.\n\nThe proof: in week 8 a key machine breaks down and she re-plans the week without calling you. The KPI moves into the monthly operations report. Handover done.',
      },
      said: 'What you hear in projects: “So now that’s mine too? Next to everything else?”',
      recall: [
        {
          q: 'Who should own a new process after the project?',
          options: ['The consultant, until the next project starts and someone is free', 'Someone in daily contact with the work, like the planning manager', 'A staff department that reports on it every month', 'The steering group as a whole, so nobody carries it alone'],
          answer: 'Someone in daily contact with the work, like the planning manager',
          why: 'The owner must be close enough to the work to steer it every week.',
        },
        {
          q: 'Where should the KPIs live after handover?',
          options: ['In a separate project dashboard that you set up', 'In the final report and its appendices', 'In the consultant’s files, to compare at the follow-up', 'In the reports and meetings the line already uses'],
          answer: 'In the reports and meetings the line already uses',
          why: 'A separate dashboard dies when the project ends.',
        },
        {
          q: 'What is the right order for handing over a meeting?',
          options: ['Owner watches, owner runs with you beside, owner runs alone', 'Owner runs it alone from day one, with your phone number at hand', 'You run it until the last week, then send a clear manual', 'Owner and you take turns each week for as long as needed'],
          answer: 'Owner watches, owner runs with you beside, owner runs alone',
          why: 'Stepwise handover builds skill and confidence.',
        },
        {
          q: 'The owner says he has no time to run the new process. What do you do?',
          options: ['Run it for him a bit longer until the busy season is over and he has room', 'Look for another owner yourself, someone in the department who has more time', 'Ask what he needs to run it, and take it to the sponsor if he can’t get it', 'Simplify the process until it takes him almost no time at all, then hand it over'],
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
    // Topic 3: sustaining
    {
      id: 'pm.land.sustain',
      film: 'pm.land.handover',
      title: 'Sustaining results',
      pre: [
        {
          q: 'After a successful project, when do results most often start to slip?',
          options: ['Two to four months after the consultant leaves', 'In the first week after go-live, when everything is new', 'After about five years, when the people have changed', 'They rarely slip once the results are proven'],
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
          hint: 'Work out the gain in points first, then how many of those points were lost.',
          why: 'Gain was 18 points; 9 points lost; 9 / 18 = 50%.',
        },
        {
          q: 'Why agree a trigger for stepping back in?',
          options: ['To sell more consultancy days to the client later', 'To have a reason to blame the owner if it fails', 'So your return is a plan, not a sign of failure', 'Because quality audits formally require it'],
          answer: 'So your return is a plan, not a sign of failure',
          why: 'An agreed trigger makes stepping back in normal and timely.',
        },
        {
          q: 'Results slip after handover. What do you do?',
          options: ['Fix it yourself quickly, before the sponsor notices', 'Help the owner find what changed and let him act', 'Report the owner to the sponsor so it is on record', 'Restart the project with a new team and plan'],
          answer: 'Help the owner find what changed and let him act',
          why: 'Fixing it yourself takes ownership away from the person who must keep it running.',
        },
        {
          q: 'What keeps a new way of working alive best?',
          options: ['One big, thorough audit once a year by an outside party', 'A clear final report that everyone has read and signed', 'A poster in the canteen with the new way and the results', 'Short weekly checks by the line manager and a monthly KPI review'],
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
    {
      id: 'pm.land.lsw',
      title: 'Leader standard work and the gemba walk',
      pre: [
        {
          q: 'In Lean, why does a leader walk a fixed round of the floor?',
          options: ['To check which operators are not doing their work properly and note it', 'To be visible, so people know the boss is paying attention to them', 'To collect yesterday’s production figures for his own morning report', 'To see whether the process runs to standard and help where it gets stuck'],
          answer: 'To see whether the process runs to standard and help where it gets stuck',
          why: 'The round is about the process, not about catching people. What deviates is a signal to help.',
        },
      ],
      teach: [
        'After handover, someone must give the new way attention every day. You arrange that with leader standard work: a fixed list of what a leader does daily and weekly to check the process. For example: 6:10 the start-of-shift meeting, 9:00 look at the board, Tuesday the skills matrix.\n\nDavid Mann describes it in Creating a Lean Culture (2005) as the first of four elements of a lean management system.',
        'Mann’s other three elements: visual controls, often called visual management, boards and markings that show at a glance whether work is on schedule; daily accountability, short meetings in which actions are agreed and followed up; and leadership discipline, leaders keeping this up, also in busy weeks.\n\nWithout that last one the rest falls over. That is why sustaining is mainly the behaviour of leaders, not of operators.',
        'How much time? A rough split often quoted from Mann’s book: a team leader spends about 80% of his shift on standard work, a supervisor about 50%, a value stream manager around 25%. The higher up, the more time for improving and planning.\n\nThese are guide figures, quoted a little differently by different sources, not a norm. In practice you often fall short, but they show that standard work is not only for the floor.',
        'A fixed part is the gemba walk. Gemba is Japanese for “the place where it happens”: the shop floor. The leader walks a fixed route, looks at the process and asks questions: “What is the standard here? How do you see it is going well? What is holding you back?”\n\nHe doesn’t fix everything himself or lecture. What he sees goes on the action board, with an owner and a date.',
        'What often goes wrong: leader standard work becomes a tick list filled in all at once on Friday. Or the leader drops the gemba walk as soon as there is a crisis, exactly when it is most needed.\n\nExperts debate whether to enforce it strictly or let it grow. Start small: three fixed points that really happen beat fifteen on paper. Sharp question: “What did you see on your round today that you didn’t expect?”',
      ],
      example: {
        kind: 'worked',
        text: 'At a packaging company you hand over the new stop registration to department supervisor Petra. Together you put her leader standard work on one card.\n\nDaily: 7:30 start-of-shift meeting at the board of lines 1 and 2 (15 minutes); 8:00 gemba walk along both lines, with three fixed questions (30 minutes); 13:00 check that the morning’s actions have been picked up.\nWeekly: Monday the top three stops with maintenance, Thursday follow one operator through a changeover.\n\nThe first two weeks you walk with her, then she walks alone and on Friday you go through her card with her: what happened, what got skipped, and why. In week 3 she doesn’t drop Thursday but moves it; that is exactly the discipline you want to see.',
      },
      said: 'What you hear in projects: “I don’t have time to walk rounds. I’m in meetings all day.”',
      recall: [
        {
          q: 'A supervisor works a 480-minute shift. Take the rough split quoted from Mann for this layer. Of that, 30 minutes go to the start-of-shift meeting and 60 minutes to the gemba walk. How many minutes of standard work are left for his other fixed checks?',
          number: 150,
          tolerance: 1,
          unit: 'min',
          hint: 'First take the supervisor’s share of the shift (about half), then subtract the fixed blocks.',
          why: '50% of 480 = 240 minutes; 240 − 30 − 60 = 150 minutes.',
        },
        {
          q: 'Which of Mann’s elements holds the other three up?',
          options: ['Visual management on every line and every office wall', 'Leadership discipline: keeping it up, also in busy weeks', 'A digital dashboard with real-time figures for all levels', 'A yearly audit of the whole system by head office'],
          answer: 'Leadership discipline: keeping it up, also in busy weeks',
          why: 'Boards and meetings only work as long as leaders keep using them.',
        },
        {
          q: 'What does a leader do on a good gemba walk?',
          options: ['He notes which operators are not working to standard', 'He fixes the problems he sees himself, straight away', 'He looks at the process, asks questions and puts actions on the board', 'He collects the figures and discusses them later in the office'],
          answer: 'He looks at the process, asks questions and puts actions on the board',
          why: 'Looking and asking helps the team see problems themselves; actions with an owner make sure something happens.',
        },
        {
          q: 'A leader fills in his leader standard work all at once every Friday. What do you do?',
          options: ['Cut it back together to a few points he really does daily', 'Report it to his manager, because a deal is a deal', 'Bring in a digital app that time-stamps every check', 'Accept it, as long as the card is complete every week'],
          answer: 'Cut it back together to a few points he really does daily',
          why: 'A list that doesn’t fit his working day becomes paperwork; small and real beats big and faked.',
        },
      ],
      situation: {
        scene: 'At a food plant the production manager, Erik, is in meetings all day. Your project put daily boards on the lines, but in three weeks Erik has not been there once. The team leaders notice: “If Erik doesn’t think it matters, why should we?”',
        ask: 'How do you raise this with Erik, and what do you propose?',
        model: '“Erik, the boards work, but the team leaders are watching you. They don’t see you there, so they think it doesn’t count. I propose: three times a week, twenty minutes past two boards, with one question per board: ‘What is holding you back?’ I’ll walk with you the first two times. Which meetings could get shorter for it?”',
        rubric: [
          'Is honest about the effect of his absence on the team leaders',
          'Proposes a small, doable rhythm with one concrete question',
          'Helps him free up time instead of only asking for more',
        ],
        pushback: {
          lines: [
            '“I steer on the numbers. I get them in my mail every morning. Why would I go to the floor for that?”',
            '“If I stand there, the team leaders will feel checked on.”',
          ],
          model: '“The numbers tell you what went wrong yesterday, not why. On the floor you see the why, and the team leaders see that it matters to you. They feel checked on if you come to find faults. If you come to ask what holds them back and fix some of it, they’ll start waiting for you.”',
          rubric: [
            'Acknowledges the value of the numbers',
            'Explains what the floor adds to the numbers',
            'Makes the difference between checking and helping concrete',
          ],
        },
      },
      sayIt: 'Explain to a production manager in 60 seconds why results only last if leaders have fixed standard work of their own.',
      terms: [
        { term: 'Leader standard work', def: 'A fixed list of what a leader does daily and weekly to check the process and help.' },
        { term: 'Visual management', def: 'Boards and markings that show at a glance whether work is on schedule and to standard.' },
        { term: 'Daily accountability', def: 'Short, fixed meetings in which actions are agreed and followed up.' },
        { term: 'Gemba', def: 'Japanese for the place where the work happens: the shop floor.' },
        { term: 'Gemba walk', def: 'A leader’s fixed round of the floor to see the process and ask questions.' },
      ],
    },
    {
      id: 'pm.land.tiered',
      title: 'Tiered meetings and escalation',
      pre: [
        {
          q: 'The same material problem has been on the start-of-shift board for three weeks. What does that say about the meeting system?',
          options: ['That the team does not take the problem seriously enough', 'That the board has too little room for new problems', 'That problems the team cannot solve itself are not going up', 'That the meeting is too short to discuss such a problem'],
          answer: 'That problems the team cannot solve itself are not going up',
          why: 'A start-of-shift meeting is for what the team can do itself; the rest must go up a level fast, with an answer coming back.',
        },
      ],
      teach: [
        'Tiered meetings are a series of short, stand-up meetings that follow each other every morning. Tier 1: the team at its board at the start of the shift, the start-of-shift meeting, 10 to 15 minutes. Tier 2: the team leaders with their supervisor. Tier 3: the supervisors with the plant manager.\n\nIn many plants the whole ladder is done by 10 in the morning. Exact times vary; the order, from bottom to top, does not.',
        'Each level stands at a KPI board: a whiteboard or screen with a few key figures from yesterday and today, often coloured red or green. Many companies use the four letters SQDC: Safety, Quality, Delivery, Cost.\n\nThe board shows what deviates; the meeting only covers the red boxes. Green needs no discussion. That keeps a start-of-shift meeting short.',
        'The heart of the system is the escalation rule: an agreement on when a problem goes up a level. For example: anything the team cannot solve itself within 24 hours, or that needs another department, goes to tier 2 the same morning.\n\nJust as important is the way back: the answer must be on the team board the next day. Otherwise the team learns that raising things is pointless.',
        'Tiered meetings also connect the layers. At 9:30 the plant manager hears which problems were on the floor at 6:15, and can deploy resources straight away. In a plant without the ladder he sometimes only hears in the monthly report.\n\nIt is the practical form of the daily accountability from the previous level: short meetings with actions, owners and dates that you check the next day.',
        'What often goes wrong: the meeting becomes a reporting round in which everyone reads out his figures, and it takes 45 minutes. Or escalation only works upwards, and nothing ever comes back.\n\nExperts differ on how many tiers make sense. In a small plant two layers are often enough; four make it slow. Sharp question for the supervisor: “Which problem from yesterday’s start-of-shift meetings did you solve today?”',
      ],
      example: {
        kind: 'faded',
        text: 'At a cable manufacturer tiered meetings have run for a month. Tier 1 at 6:15 at each line, tier 2 at 8:30 with the supervisor, tier 3 at 9:30 with the plant manager. The escalation rule: what the team can’t solve itself within 24 hours, or what needs another department, goes to tier 2 the same morning.\n\nOn Monday line 2 reports in tier 1: copper wire from a new supplier breaks more often, three times already this weekend. The team can’t contact the supplier itself. On Wednesday it is still on line 2’s board, and nobody knows whether anyone is acting on it.',
        ask: 'How should this have gone through the ladder, and what do you need to change now?',
        reveal: 'Monday at 6:15 the team leader should have marked it red on the board and raised it at 8:30 in tier 2, since the team can’t solve it and purchasing is needed. The supervisor should have taken it to tier 3 at 9:30, where the plant manager gives purchasing an action, with a date. Tuesday at 6:15 line 2’s board should have said: purchasing calls the supplier today, samples to quality.\n\nNow: check where it got stuck, probably between tier 1 and tier 2, and add a fixed question to tier 2: “Which red points from the teams need to come here today?” And the answer always goes back to the team board.',
      },
      said: 'What you hear in projects: “I’ve raised it three times at the morning meeting. Nothing ever happens with it.”',
      recall: [
        {
          q: 'What is the right order of a morning tiered meeting?',
          options: ['First the team on the floor, then the team leaders, then management', 'First management, then the team leaders, then the team on the floor', 'All layers at once in one meeting, so everyone hears everything', 'The team and management at the same time, separately'],
          answer: 'First the team on the floor, then the team leaders, then management',
          why: 'Problems arise on the floor; this way they reach whoever has resources the same morning.',
        },
        {
          q: 'Why does a start-of-shift meeting only discuss the red boxes on the KPI board?',
          options: ['Because green figures are not measured reliably', 'Because otherwise the team focuses too much on successes', 'Because management already sees the green figures in the report', 'Because the meeting must stay short and be about deviations'],
          answer: 'Because the meeting must stay short and be about deviations',
          why: 'Green runs to plan; attention belongs with what deviates.',
        },
        {
          q: 'What makes an escalation rule complete?',
          options: ['A list with the phone numbers of all managers and their deputies', 'When it goes up, and that the answer comes back to the team board', 'A cap on how many problems the team may raise in a single week', 'That the supervisor approves every escalation in writing first'],
          answer: 'When it goes up, and that the answer comes back to the team board',
          why: 'Without a way back the team learns that raising things is pointless.',
        },
        {
          q: 'The start-of-shift meeting now takes 45 minutes and everyone reads out his figures. What do you propose?',
          options: ['Move the meeting to once a week', 'A digital dashboard, so the reading out is no longer needed', 'Back to 15 minutes, red points only, with action, owner and date', 'Ask the team leader to run the meeting alone from now on'],
          answer: 'Back to 15 minutes, red points only, with action, owner and date',
          why: 'A start-of-shift meeting is a steering moment, not a report. Short, on deviations, with actions.',
        },
      ],
      situation: {
        scene: 'At a grid operator, the company behind the regional power network, the field operations manager wants to bring in tiered meetings for the field crews, with four layers. The crews start at 7:00 at different depots. He asks you to design it.',
        ask: 'What do you ask first, and what do you propose?',
        model: 'I would first ask which problems now stay unsolved and who can solve them. Then I would propose starting with two or three layers, not four: the crew briefly at 7:00 at the van or board, the team leaders at 8:30 with planning present, and the manager at 9:15. With an escalation rule and the agreement that every answer is back with the crew the next morning.',
        rubric: [
          'Starts from the problems that now stay unsolved',
          'Keeps the number of layers small and fits it to the crews’ working day',
          'Fixes an escalation rule and the way back',
        ],
        pushback: {
          lines: [
            '“The grid operator where I worked before has four layers too. That’s best practice.”',
            '“The crews are spread out. A board at every depot is too much hassle; let’s do it on Teams.”',
          ],
          model: '“That may work well there. Here the question is whether a 7:00 problem reaches you by 10:00. With four layers that gets hard. Let’s start with three and review after six weeks. Teams can work for the furthest crews, but a fixed board at the main depot keeps it visible for everyone.”',
          rubric: [
            'Acknowledges his experience without just adopting it',
            'Tests the design against how fast escalation happens',
            'Proposes a trial with a review and a practical mix for spread-out crews',
          ],
        },
      },
      sayIt: 'Explain to a plant manager in 60 seconds how tiered meetings get a 6 a.m. problem to him before 10.',
      terms: [
        { term: 'Tiered meetings', def: 'A series of short meetings that follow each other every morning, from the team on the floor up to management.' },
        { term: 'Start-of-shift meeting', def: 'A team’s short stand-up meeting at its board at the start of the shift.' },
        { term: 'KPI board', def: 'A board or screen with a few key figures, often red or green, where the meeting stands.' },
        { term: 'Escalation rule', def: 'The agreement on when a problem goes up a level, and how the answer comes back.' },
      ],
    },
    {
      id: 'pm.land.audits',
      title: 'Audits that actually catch something',
      pre: [
        {
          q: 'The layered process audits on a line have scored 100% green for four months, but scrap is rising. What is the most likely explanation?',
          options: ['The line was unlucky with a bad batch of raw material this quarter', 'The audit questions are too easy or the auditors aren’t really looking', 'Scrap is now measured and booked differently than it was before', 'The operators work correctly, but the standard itself is too strict'],
          answer: 'The audit questions are too easy or the auditors aren’t really looking',
          why: 'An audit that never finds anything while the result gets worse is not measuring what matters.',
        },
      ],
      teach: [
        'You met the layered process audit when holding on to results. Now the design. The car industry set it down in CQI-8, a guideline from the AIAG, the American trade body of carmakers and suppliers.\n\nAccording to summaries of the guideline, CQI-8 leaves frequency and questions to the company itself, based on risk. Lower layers audit often and in detail, higher layers less often and more broadly.',
        'The audit question is the heart. A good question is about a key point that matters: a step where it went wrong before, a point from the risk analysis or the control plan. It can be answered yes or no by looking: “Is the torque wrench set to 25 Nm and was it calibrated this week?”\n\nKeep an audit short, often five to ten questions and about ten minutes. Rotate questions, so people don’t only watch the familiar ones.',
        'If the auditor finds a deviation, the first step is to fix on the spot: set the part aside, show the operator the right way, and record it. What can’t be fixed there goes on the action board with an owner.\n\nMeasure two things: the completion rate, the share of planned audits actually done, and what the audits find. If the same deviation keeps coming back, the problem is in the process, not the operator.',
        'Watch out for audit fatigue: after a few months audits become a ritual. Auditors tick boxes from their desk, questions are so familiar they are always green, and nobody does anything with the outcome.\n\nSignals: a 100% completion rate with zero findings, audits always at the same time, or rising scrap with green audits. Then refresh the questions and have a higher layer walk along.',
        'Experts argue about scoring. Some give each line a percentage and post league tables; others say that is exactly what leads to kind filling-in, and prefer to look at which findings were resolved.\n\nAn audit is about the process, not about judging people. Say so at the start, and act on it. Sharp question for the quality manager: “Which audit found something last month that made us change something?”',
      ],
      example: {
        kind: 'faded',
        text: 'At a metalworking company layered process audits have run on the welding line for six months. Team leaders do them daily, supervisors weekly, the plant manager monthly. The overview: completion rate 98%, and 97% of answers green. Meanwhile complaints about weld seams rise from 2 to 6 a month. The ten questions haven’t changed since the start; three are about tidiness, none about the welding parameters.',
        ask: 'What do you see here, and how would you set the audit up again?',
        reveal: 'Audit fatigue and the wrong questions: the audit measures what is easy to see, not what causes the complaints. With the quality engineer, take the key points from the complaints and the control plan, such as current, wire speed and preheating, and turn them into questions you can answer by looking.\n\nRotate: a fixed core of five questions plus changing ones. Have the plant manager walk along twice in the first month. And from now on report not only the green percentage, but also the findings and what was done about them.',
      },
      said: 'What you hear in projects: “The audits are all green. So the problem must be somewhere else.”',
      recall: [
        {
          q: 'What makes an audit question good?',
          options: ['It is phrased so generally that it fits every line in the plant', 'It asks the operator whether he knows the standard by heart', 'It is drawn up once a year by the quality department alone', 'It is about a key point that matters and can be answered by looking'],
          answer: 'It is about a key point that matters and can be answered by looking',
          why: 'Seeing is more reliable than asking, and a key point hits what really goes wrong.',
        },
        {
          q: 'A department has 4 team leaders who each do one audit every working day, 3 supervisors who each do one audit every week, and a plant manager who audits twice a month. Use 21 working days and 4 weeks per month. How many audits is that per month?',
          number: 98,
          tolerance: 0.5,
          unit: 'audits',
          hint: 'Work per layer: number of people times how often per month. Add the three layers.',
          why: '4 × 21 = 84; 3 × 4 = 12; 1 × 2 = 2; 84 + 12 + 2 = 98 audits.',
        },
        {
          q: 'An auditor sees an operator skip a step. What is the first step?',
          options: ['Record it and pass it to the supervisor at the end of the day', 'Schedule refresher training for the whole shift next week', 'Fix on the spot: set the part aside and show the right way', 'Ask the operator for a written statement about what happened'],
          answer: 'Fix on the spot: set the part aside and show the right way',
          why: 'First remove the risk and get it done right, then record it and see whether it happens more often.',
        },
        {
          q: 'Which signal points most strongly to audit fatigue?',
          options: ['A completion rate near 100% with months of no findings', 'A few missed audits during the summer holiday period', 'An audit that finds a new deviation on a key point', 'A higher layer walking along for the first time'],
          answer: 'A completion rate near 100% with months of no findings',
          why: 'Every process deviates sometimes. Never finding anything usually means nobody is really looking.',
        },
      ],
      situation: {
        scene: 'At a plastics plant the customer, an automotive supplier, has demanded layered process audits. The quality manager has made a list of 30 questions every team leader must go through daily. After two weeks the team leaders are fed up: “This costs me three quarters of an hour a day.”',
        ask: 'What do you propose?',
        model: 'I would go through the 30 questions with the quality manager and two team leaders and ask per question: is this about a key point that went wrong before or is in the control plan? That may leave eight. Team leaders do those daily in ten minutes; the rest rotates or moves to the weekly layer. And we report not only green, but also what was found and fixed.',
        rubric: [
          'Takes the team leaders’ workload seriously',
          'Brings the questions back to key points with risk',
          'Spreads questions over layers and looks at findings, not only green',
        ],
        pushback: {
          lines: [
            '“The customer wants to see that we cover everything. Fewer questions is a risk at their audit.”',
            '“If I drop questions and something goes wrong there, I’m the one to blame.”',
          ],
          model: '“Understandable. But thirty questions ticked off in three quarters of an hour cover less than eight that are really looked at. According to summaries, CQI-8 leaves the questions to us, based on risk. We record for every dropped question why, and the rest goes into the weekly audit. Then you can show the customer how we chose.”',
          rubric: [
            'Acknowledges the customer’s demand and his personal risk',
            'Shows that fewer but better questions cover more',
            'Proposes justifying and recording the choices',
          ],
        },
      },
      sayIt: 'Explain to a quality manager in 60 seconds why an audit that is always green can be a bad sign.',
      terms: [
        { term: 'CQI-8', def: 'The guideline of the AIAG, the American automotive trade body, for layered process audits.' },
        { term: 'Audit question', def: 'A short question about a key point that the auditor can answer yes or no by looking.' },
        { term: 'Fix on the spot', def: 'Correcting a deviation the auditor sees straight away and recording it, before moving on.' },
        { term: 'Completion rate', def: 'The share of planned audits actually done.' },
        { term: 'Audit fatigue', def: 'Audits becoming a ritual after a while: ticking without looking, always green, no action.' },
      ],
    },
    // Topic 4: benefits and reflection
    {
      id: 'pm.land.benefits',
      title: 'Benefits: from delivered to delivering',
      pre: [
        {
          q: 'Your project delivered a new changeover process: standardised work, a changeover cart and trained operators. Has the benefit been realised?',
          options: ['No, the benefit is the measurable gain, like shorter changeovers', 'Yes, because everything in scope has been delivered and signed off', 'Yes, as soon as the operators have done the new process right once', 'No, the benefit only counts when the customer pays a higher price for it'],
          answer: 'No, the benefit is the measurable gain, like shorter changeovers',
          why: 'What you deliver is a means. The benefit is the measurable improvement the organisation gets from it afterwards.',
        },
      ],
      teach: [
        'Benefits realisation is the work of making sure the improvement a project promises actually arrives after delivery. The idea comes from programme management, among others from Gerald Bradley, who wrote a book on it in 2006.\n\nA simple chain helps: output, outcome, benefit. Output is what the project delivers: a standard, a board, a training. On its own it yields nothing yet.',
        'The outcome is the change: people work differently, changeovers follow the standard, the team holds a start-of-shift meeting every morning. The benefit is the measurable improvement the organisation gets from that: 30% shorter changeovers, 2 percentage points less scrap, €40,000 a year.\n\nEvery benefit needs a baseline, the level before the project, and an agreed way and moment of measuring. How to tell a real effect from noise is in Close: proving results; here the point is who keeps measuring once you are gone.',
        'Benefits usually come after go-live and grow slowly. A new changeover method is still awkward in week one; only after a few months do you see the full gain. That is why benefits realisation is often work for after the project.\n\nThe benefit owner is the person in the line responsible for the benefit coming in. Usually the sponsor or the manager of the process, never the consultant. You will be gone; the benefit must stay.',
        'Record per benefit: what it is, how you measure it, the baseline, the target, when you expect it, and who owns it. One line per benefit in a table is enough.\n\nThis fits Lean: in an A3, the problem-solving sheet on one A3 page, the target and the check are also set up front. You know beforehand what success is, rather than hunting for the nicest number afterwards.',
        'What often goes wrong: all attention goes to delivery, and nobody measures six months later whether the benefit is there. Or the project claims a saving that really comes from higher volumes.\n\nExperts argue whether to express benefits in euros. Finance people want that; others say safety or quality are benefits too, even when the amount is hard to pin down. Sharp question for the sponsor: “Which number will show you in six months that this project was worth it?”',
      ],
      example: {
        kind: 'worked',
        text: 'At a packaging company your project delivered a new set-up procedure for the sealing machines.\n\nOutput: the procedure, a set-up card per product and ten trained operators.\nOutcome: every changeover follows the card; the team leader checks it on his round.\nBenefit: less scrap. Baseline over three months: 4.0% of 6,000,000 packs a year. Target: 2.5%.\n\nWork out the expected benefit if the target is met: 4.0% − 2.5% = 1.5 percentage points. 1.5% of 6,000,000 = 90,000 fewer scrapped packs a year. Material costs €0.30 per pack: 90,000 × €0.30 = €27,000 a year.\n\nBenefit owner: the production manager. Measurement: after three and after six months, in the monthly report.',
      },
      said: 'What you hear in projects: “The project is done, everything is delivered. What happens next is no longer our problem.”',
      recall: [
        {
          q: 'A line makes 3,000,000 pieces a year. Scrap drops from 5% to 3%, and each scrapped piece costs €0.40 in material. What is the yearly benefit in euros?',
          number: 24000,
          tolerance: 10,
          unit: '€',
          hint: 'First work out how many fewer pieces are scrapped per year.',
          why: '5% − 3% = 2 percentage points; 2% of 3,000,000 = 60,000 pieces; 60,000 × €0.40 = €24,000 a year.',
        },
        {
          q: 'Which one is an outcome, and not an output or a benefit?',
          options: ['The new changeover cart the project built for line 2', 'A saving of €30,000 a year on scrapped material', 'The training all operators attended last month', 'Operators doing every changeover to the new standard'],
          answer: 'Operators doing every changeover to the new standard',
          why: 'An outcome is changed behaviour. The cart and the training are output; the saving is the benefit.',
        },
        {
          q: 'Who should be the benefit owner?',
          options: ['The consultant who led the project', 'The sponsor or line manager who runs the process', 'The controller, because he tracks the numbers', 'The steering group as a whole, so it is widely shared'],
          answer: 'The sponsor or line manager who runs the process',
          why: 'Benefits often only come after the project; someone who stays must steer on them.',
        },
        {
          q: 'Why do you record the baseline before the project starts?',
          options: ['Because the controller requires it for every project', 'Because otherwise the steering group won’t approve the project', 'Because otherwise you can’t show afterwards what the project delivered', 'Because the operators then know how bad the process was'],
          answer: 'Because otherwise you can’t show afterwards what the project delivered',
          why: 'Without a starting point every claim is an opinion.',
        },
      ],
      situation: {
        scene: 'At a food plant your project is almost done: a new schedule with fixed product wheels. The sponsor, the operations director, wants to tell the steering group the project delivers “€200,000 a year”. That number comes from the original proposal; nothing has been measured, and the new schedule has only run for two weeks.',
        ask: 'What do you say to the sponsor?',
        model: '“I understand you want to name the number. But it comes from the proposal and we haven’t measured it; if someone digs, the project looks weak. My proposal: name what was delivered, the outcome we already see, and that we measure the benefit at three and six months against the baseline. Who will own that, you or the planning manager?”',
        rubric: [
          'Is honest that the number has not been measured',
          'Proposes naming output, outcome and benefit separately',
          'Agrees measurement points and a benefit owner',
        ],
        pushback: {
          lines: [
            '“The steering group wants to hear a number. Without one it looks like the project delivers nothing.”',
            '“It’s in the proposal they approved themselves. Everyone knows where it comes from.”',
          ],
          model: '“You can name a number, as an expectation: ‘we expect around €200,000, the first measurement is in March’. Then it’s true, and in March you can prove it. If we say now it already delivers and the measurement comes in lower, that costs you credibility.”',
          rubric: [
            'Acknowledges the need for a number',
            'Turns the claim into an expectation with a measurement date',
            'Points out the risk to the sponsor himself',
          ],
        },
      },
      sayIt: 'Explain to a sponsor in 60 seconds the difference between output, outcome and benefit, and why it matters.',
      terms: [
        { term: 'Benefits realisation', def: 'The work of making sure the promised improvement actually arrives after delivery.' },
        { term: 'Output', def: 'What a project delivers: a standard, a board, a training.' },
        { term: 'Outcome', def: 'The change the output makes possible: people really working the new way, and performance changing with it.' },
        { term: 'Benefit', def: 'The measurable improvement the organisation gets from the outcome, for example less scrap or euros a year.' },
        { term: 'Benefit owner', def: 'The person in the line responsible for a benefit coming in; usually the sponsor or process manager.' },
      ],
    },
    {
      id: 'pm.land.savings',
      title: 'Hard and soft savings',
      pre: [
        {
          q: 'After a SMED project (quick changeover), a press can run 6 more hours a week, but there is no extra demand right now. What is that gain financially?',
          options: ['A hard saving, because the changeover really is shorter', 'A cost, because the project cost money', 'A hard saving as soon as the controller sees the number', 'Freed capacity, which only becomes money when you use it'],
          answer: 'Freed capacity, which only becomes money when you use it',
          why: 'Hours nobody needs don’t lower costs. They become money when you sell more with them or cut costs with them.',
        },
      ],
      teach: [
        'In Close you saw that freed hours only become money when something changes on the books. Controllers draw a sharp line here. Hard savings are money really no longer spent and visible in the profit and loss account: less material thrown away, less overtime paid, a rented warehouse given up.\n\nSoft savings are valuable but not directly visible in costs. Cost avoidance and freed capacity are the best-known forms.',
        'Cost avoidance: money you don’t have to spend, such as a second machine you don’t need to buy because the first can now do enough. Real money, but it never shows as a fall in costs.\n\nFreed capacity: hours of people or machines that come free. They only become money when you use them: sell more, stop overtime, not renew a temp. Otherwise it is just room.',
        'Have every saving checked by the controller, the finance person who guards the company’s numbers. He will ask two things. Recurring or one-off? A lower stock frees cash once; only the lower holding costs come back every year. And from when? If the Saturday shift stops in April, this year saves nine months; the run rate, the full-year amount from then on, is twelve.\n\nA saving the controller has approved survives the steering group; one from your own spreadsheet turns into a debate about assumptions.',
        'A Lean principle belongs here: improving must not lead to layoffs of the people who improve. Many Lean authors, including James Womack and Daniel Jones in Lean Thinking (1996), advise promising that up front. Whoever loses his job through kaizen never joins in again.\n\nSo you deploy freed people on growth, on vacancies that arise anyway, or in an improvement team. The money then comes through growth or natural turnover, not layoffs.',
        'What often goes wrong: a project adds up freed hours times an hourly rate and calls it savings. The controller sees no fall in costs, and the project loses credibility.\n\nExperts differ on soft savings: some leave them out of a project’s return, others include them, listed separately. Be open about which kind you mean. Sharp question to yourself: “Which cost line in the budget goes down because of this, and from when?”',
      ],
      example: {
        kind: 'worked',
        text: 'At a metalworking company a SMED project, quick changeover, has halved changeover time on the big press. The project wants to report “€150,000 savings”. You take it apart with the controller.\n\nHard: the Saturday shift to catch up on backlog is no longer needed. Four operators × 8 hours × €45 an hour = €1,440 per Saturday. That was 40 Saturdays a year: 40 × €1,440 = €57,600.\nCost avoidance: the planned second press of €400,000 is no longer needed. Real money, but listed separately.\nFreed capacity: 5 hours a week still spare on the press. No money until sales brings in orders for it.\n\nIn the steering group: €57,600 hard a year, an avoided investment, and capacity for growth.',
      },
      said: 'What you hear in projects: “Surely we just count those freed hours as savings? Everyone does.”',
      recall: [
        {
          q: 'An improvement means you don’t have to buy a second forklift truck. What kind of saving is that?',
          options: ['A hard saving in the profit and loss account', 'Freed capacity of the warehouse staff', 'Cost avoidance: real money, but no fall in existing costs', 'No saving, because the forklift hadn’t been bought yet'],
          answer: 'Cost avoidance: real money, but no fall in existing costs',
          why: 'You don’t spend money you would otherwise have spent; current costs don’t fall.',
        },
        {
          q: 'Thanks to an improvement the Saturday shift is no longer needed. That shift had 3 operators who each worked 6 hours, at €40 an hour, on 25 Saturdays a year. What is the hard saving per year?',
          number: 18000,
          tolerance: 10,
          unit: '€',
          hint: 'First work out the cost of one Saturday.',
          why: '3 × 6 × €40 = €720 per Saturday; 25 × €720 = €18,000 a year.',
        },
        {
          q: 'Why do you have every saving checked by the controller?',
          options: ['So the saving is credible when someone in the steering group digs', 'Because otherwise the controller won’t pay the consultant’s invoice', 'Because the law requires it for every cost saving', 'So the controller can put the saving in his own budget'],
          answer: 'So the saving is credible when someone in the steering group digs',
          why: 'A number finance has approved survives critical questions; your own spreadsheet doesn’t.',
        },
        {
          q: 'A kaizen frees up two operators. What fits Lean?',
          options: ['Lay them off, because then the saving is hard straight away', 'Deploy them on growth, open vacancies or an improvement team', 'Leave them where they are, so the line has spare people', 'Send them to an agency until there is work again'],
          answer: 'Deploy them on growth, open vacancies or an improvement team',
          why: 'Whoever loses his job through improving stops improving. The money comes through growth or turnover.',
        },
      ],
      situation: {
        scene: 'At a cable manufacturer your team has halved order lead time. The client’s project lead wants to write in the final report: “12 FTE freed, worth €720,000 a year.” FTE stands for full-time equivalents. Nobody has left, and the controller knows nothing about it yet.',
        ask: 'What do you say to the project lead?',
        model: '“It’s a great achievement, and that capacity is real. But if we call it €720,000 savings, the controller will ask which costs went down, and the answer is none. Let’s split it: what is hard, like less overtime or fewer temps; what is freed capacity for growth. And let’s check it with the controller before it goes in the report.”',
        rubric: [
          'Acknowledges the achievement and the real capacity',
          'Explains why freed hours are not a hard saving',
          'Proposes splitting it and checking it with the controller',
        ],
        pushback: {
          lines: [
            '“If we only name the hard part, the project looks small. The board must see what it’s worth.”',
            '“Other projects calculate it this way too. Why shouldn’t we?”',
          ],
          model: '“The board must see what it’s worth, I agree. That’s why I don’t want it to fall at the controller’s first question. We name the hard amount, and separately the capacity for growth with what it would yield if sales fills it. That’s big and it’s true.”',
          rubric: [
            'Shares the goal of showing the value',
            'Points out the risk of a number that doesn’t hold',
            'Proposes an honest presentation that still shows the value',
          ],
        },
      },
      sayIt: 'Explain to a project lead in 60 seconds why freed hours are not yet a saving, and when they become one.',
      terms: [
        { term: 'Hard savings', def: 'Money really no longer spent and visible in the profit and loss account.' },
        { term: 'Soft savings', def: 'A valuable improvement not directly visible in costs, such as cost avoidance or freed capacity.' },
        { term: 'Cost avoidance', def: 'Money you don’t have to spend, such as an investment no longer needed.' },
        { term: 'Freed capacity', def: 'Hours of people or machines that come free; only money when you use them.' },
        { term: 'Controller', def: 'The finance role that guards the company’s numbers and checks savings.' },
        { term: 'Run rate', def: 'The full-year amount of a saving from the moment it starts, as opposed to what it saves in the current year.' },
      ],
    },
    {
      id: 'pm.land.hansei',
      title: 'Reflecting: hansei and the after-action review',
      pre: [
        {
          q: 'Your project hit its target and the client is happy. What does hansei say still belongs to it?',
          options: ['Nothing; reflecting is only for projects that missed their target', 'Looking honestly at what could have gone better anyway', 'A party with the whole team to celebrate the success properly', 'A client satisfaction survey to prove the success on paper'],
          answer: 'Looking honestly at what could have gone better anyway',
          why: 'Hansei is reflection on your own shortcomings, also after a success. That is where you learn most.',
        },
      ],
      teach: [
        'Hansei is Japanese for reflection: honestly looking at what you yourself could have done better, even when it went well. In The Toyota Way (2004) Jeffrey Liker describes it as a core of a learning organisation, next to kaizen.\n\nAt Toyota it is often said that “no problem” is itself a problem: whoever sees nothing to improve isn’t looking properly. After a project, hansei is the moment to apply that to your own work too.',
        'A practical form is the after-action review, developed by the US Army. Four questions, worded a little differently from guide to guide: What was supposed to happen? What actually happened? Why was there a difference? What do we keep and what do we do differently?\n\nMany guides based on army practice advise spending most of the time on the last question, often 25% for the first two, 25% for the third and 50% for the fourth. It is about learning, not retelling the past.',
        'In Lean you often record the story in an A3 report: the problem, the cause, the countermeasures and the result on one A3 sheet. The last boxes, the check and the follow-up, are the place for reflection: what worked, what didn’t, and what it means for next time.\n\nThat way reflection isn’t a loose chat but the last part of PDCA: the A of Act.',
        'Hansei only lasts when the line owns it. The army holds short reviews straight after each exercise, with the people who were there. Do the same on the floor: fifteen minutes at the board after a changeover trial, a line stop or the first week of a new standard, led by the team leader.\n\nA learning point counts when it changes something that stays: the standard, the checklist, the training timetable. How to run a safe project retrospective and turn lessons into actions is in Close.',
        'What often goes wrong: the review becomes a round of compliments, or a list of twenty learning points nobody reads again. Or only the project team reflects, without the line, who know the difference best.\n\nExperts argue whether to review a success as thoroughly as a failure. Whoever takes hansei seriously says yes. Sharp question for the team: “If we did this project again tomorrow, what would we change first?”',
      ],
      example: {
        kind: 'faded',
        text: 'At a grid operator you close the readiness check project in the North region. Target: the share of cancelled jobs from 20% to 8%. Result: 10%. The client is happy. Two things went differently from plan: the work preparers only came on board after they were allowed to revise the checklist themselves, which cost six weeks; and in the summer it slipped back for a while because the stand-in planners hadn’t been trained.\n\nYou run a one-hour after-action review with the planning team leader, two work preparers and the sponsor.',
        ask: 'Go through the four questions: what would you expect to hear for each, and which learning points do you take away?',
        reveal: 'What was supposed to happen: 8% cancelled jobs, with the check in use by week 6. What actually happened: 10%, and the check only settled into the work by week 12. Why: the work preparers were involved too late, and stand-ins weren’t in the training plan.\n\nWhat differently, half the hour: on the next project the people who do the work co-design the checklist from week 1; and stand-ins and holiday staff are in the training timetable by default. Each learning point gets an owner: the first you, the second the planning team leader. And you start yourself: “I should have gone to the work preparers sooner.”',
      },
      said: 'What you hear in projects: “We nearly hit the target, everyone’s happy. Why would we still review it?”',
      recall: [
        {
          q: 'What is the third question of an after-action review?',
          options: ['What was supposed to happen?', 'What actually happened?', 'What do we keep and what do we do differently?', 'Why was there a difference?'],
          answer: 'Why was there a difference?',
          why: 'First the plan, then reality, then the why of the difference, and finally what you do differently.',
        },
        {
          q: 'Which learning point is the most usable?',
          options: ['“Stand-ins go in the training timetable; owner: the team leader”', '“Communication with the shop floor must be better next time”', '“We must involve people in the change earlier than we did”', '“Everyone must feel more ownership of the result from now on”'],
          answer: '“Stand-ins go in the training timetable; owner: the team leader”',
          why: 'Concrete, doable and with an owner. The others are true but too vague to change anything.',
        },
        {
          q: 'Where does reflection sit in an A3 report?',
          options: ['At the top, with the problem description', 'In the middle, with the cause analysis', 'In the check and follow-up boxes, at the end', 'On a separate sheet that isn’t part of the A3'],
          answer: 'In the check and follow-up boxes, at the end',
          why: 'Reflection belongs to the Check and Act of PDCA: what worked, what didn’t, and what it means.',
        },
        {
          q: 'When does a team get the most out of an after-action review?',
          options: ['Once a year, in a big session with all departments together', 'Right after the event, with the people who were there', 'Only at the end of a project, led by the consultant', 'When the monthly KPI report shows a red number'],
          answer: 'Right after the event, with the people who were there',
          why: 'Memories are fresh and those who were there know what really happened. Short reviews after events make reflection a habit of the line.',
        },
      ],
      situation: {
        scene: 'At a food plant you handed over the new changeover standard two months ago. Yesterday team leader Sandra tried a new cleaning sequence on line 3 that should save 10 minutes; the changeover took 40 minutes longer. The production manager says: “It didn’t work. Back to the old way and move on.”',
        ask: 'How do you use hansei here?',
        model: '“Before we drop it, let’s spend fifteen minutes at the line with Sandra and the two operators who did it: what was supposed to happen, what happened, why the difference, what we try next. A failed trial is cheap if we learn from it. Sandra leads it, not me. I helped plan the trial, so I’ll start with what I missed.”',
        rubric: [
          'Treats the failed trial as something to learn from, not to bury',
          'Proposes a short after-action review at the line with the people who were there',
          'Lets the team leader lead it and owns his own part',
        ],
        pushback: {
          lines: [
            '“We don’t have time to discuss every failure. The line has to run.”',
            '“Sandra just shouldn’t have experimented without asking.”',
          ],
          model: '“Fifteen minutes at the board, while the line runs. I don’t want to know who is to blame, but why it took longer; maybe one step was in the wrong order. If we skip this, Sandra stops trying things, and the next idea dies too. What comes out goes into the next trial or into the standard.”',
          rubric: [
            'Acknowledges the time pressure',
            'Steers away from blame towards the cause',
            'Links the review to keeping improvement alive and to the standard',
          ],
        },
      },
      sayIt: 'Explain to a production manager in 60 seconds why a failed trial deserves a short after-action review, and how you run one in fifteen minutes.',
      terms: [
        { term: 'Hansei', def: 'Japanese for reflection: honestly looking at what you could have done better, also after a success.' },
        { term: 'After-action review', def: 'A short review with four questions: what should have happened, what happened, why the difference, what we do differently.' },
        { term: 'A3 report', def: 'A problem-solving story on one A3 sheet: problem, cause, countermeasures, result and follow-up.' },
        { term: 'Learning point', def: 'A concrete agreement on what you will do differently next time, with an owner.' },
      ],
    },
    {
      id: 'pm.land.yokoten',
      title: 'Yokoten: rolling out to other lines',
      pre: [
        {
          q: 'The new changeover approach works on line 1. The director wants the other four lines to do exactly the same next month. What is the biggest risk?',
          options: ['That the other lines improve too fast and overtake line 1 on its own results', 'That the roll-out costs far more time and money than was planned', 'That the solution is copied without the thinking or the local differences', 'That line 1 loses its lead and its people lose their motivation'],
          answer: 'That the solution is copied without the thinking or the local differences',
          why: 'What works on one line rarely fits another one to one. Copying without understanding falls over at the first difference.',
        },
      ],
      teach: [
        'Yokoten is a Japanese word the Lean Enterprise Institute describes as spreading ideas and improvements horizontally across a company. Horizontally means: from line to line and site to site, between peers, not only from the top down.\n\nAt Toyota it mainly means teams going to look at each other and learning how someone else solved a problem.',
        'Lean writers stress: copy and improve, not cut and paste. The other line takes over the thinking, such as why the changeover was split into steps, and adapts the solution to its own machines, products and people.\n\nThat is why a roll-out by e-mail with a slide deck and a template rarely works. People must see it, understand why it works, and adapt it themselves.',
        'A strong approach is the model line: one line where the new way runs fully and stably, as an example and a place to learn. Team leaders from other lines spend a few days there, and the model line’s team leader helps with the first steps on their line.\n\nOnly roll out once the model line is stable: a few months of good results, without the consultant stepping in. Otherwise you spread a half-working process.',
        'Check each line’s roll-out readiness: is there a local owner, is there a baseline, are the differences from the model line known, and has time been freed for training? If one of the four is missing, better to wait a month.\n\nPlan the roll-out in waves, one or two lines at a time. What the first wave learns makes the next one faster.',
        'What often goes wrong: management wants speed and rolls out everywhere at once, with a project team that demonstrates it everywhere. Six months later it only runs on the model line.\n\nExperts argue about pace. Some say a fast roll-out builds momentum; others, as Jim Womack describes at Toyota, say yokoten looks slow but sticks better because each line learns it itself. Sharp question for each new line: “What do you do differently from the model line, and why?”',
      ],
      example: {
        kind: 'faded',
        text: 'At a grid operator the readiness check has worked well in the North region for five months: the share of cancelled jobs went from 20% to 10% and stays stable, without you. The director wants it “in all four other regions next month”. In South there is already a team leader who wants the check; in East and West nobody knows about it yet; the Central region has just got a new planning system and is behind with its work.',
        ask: 'How would you set up the roll-out, and what do you tell the director?',
        reveal: 'North is the model line: stable and without a consultant. Check readiness per region. South is ready: a local owner, and the baseline can be done this month. East and West: first an owner and a baseline. Central: wait until the new system is stable.\n\nWave 1: South. Their team leader and two work preparers spend three days in North and adapt the checklist to their own jobs. Wave 2: East and West, with North and South as examples. Wave 3: Central. To the director: “In two months South runs and two more start. That way it sticks, instead of half-working everywhere.”',
      },
      said: 'What you hear in projects: “It works in North. Just send that checklist to the other regions and we’re done.”',
      recall: [
        {
          q: 'What do Lean people mean by “copy and improve”?',
          options: ['Taking over the solution exactly, so every line works the same', 'Taking over the thinking and adapting the solution to your own line', 'Improving the solution on the model line first and only then spreading it', 'Making the best line the norm and judging the others against it'],
          answer: 'Taking over the thinking and adapting the solution to your own line',
          why: 'Every line is different; whoever understands the why can adapt the solution well.',
        },
        {
          q: 'When is a model line ready to serve as an example for other lines?',
          options: ['As soon as the first good week is over and the numbers are green', 'When management has been shown the results in a presentation', 'When the standardised work has been written and signed off', 'When it runs stably for months without the consultant stepping in'],
          answer: 'When it runs stably for months without the consultant stepping in',
          why: 'Spreading a half-working process gives you a half-working process everywhere.',
        },
        {
          q: 'A region wants to join but has no local owner. What do you do?',
          options: ['Arrange an owner first; until then the roll-out waits there', 'Start anyway; the owner will appear once it works', 'Make the model line’s team leader the owner for now', 'Let the project team run it there until someone is found'],
          answer: 'Arrange an owner first; until then the roll-out waits there',
          why: 'Without a local owner it falls over as soon as the project team leaves.',
        },
        {
          q: 'According to the Lean Enterprise Institute, what is the core of yokoten?',
          options: ['A central department that approves and prescribes improvements', 'A yearly contest for the company’s best improvement', 'A database in which all improvement projects are stored', 'Spreading ideas and improvements horizontally, between lines and sites'],
          answer: 'Spreading ideas and improvements horizontally, between lines and sites',
          why: 'Yokoten goes sideways, between peers, not through a central prescriber.',
        },
      ],
      situation: {
        scene: 'At a packaging company with three sites, your project made stop registration and the start-of-shift meeting land well at one site. The operations director asks you to do the other two sites “in six weeks”, with the same project team.',
        ask: 'What do you propose?',
        model: '“I’d like to spread it, and it runs stably here. But if our team demonstrates it everywhere in six weeks, it will soon only run here. My proposal: per site first an owner and a baseline, then their team leaders spend three days with us, and the team leaders from here help with the start. One site at a time; the second goes faster than the first.”',
        rubric: [
          'Supports the goal of spreading it',
          'Explains why the project team should not demonstrate it everywhere',
          'Proposes a roll-out in waves with owner, baseline and spending time on the model',
        ],
        pushback: {
          lines: [
            '“Six weeks is what management has promised head office.”',
            '“You’ve already worked it all out here. Why should they reinvent the wheel?”',
          ],
          model: '“They don’t have to reinvent the wheel; they take over the thinking and adapt it to their lines. On the six weeks: in six weeks the first site can be live, with a plan for the second. You can show head office that, and it will last.”',
          rubric: [
            'Acknowledges the promise to head office',
            'Explains the difference between copying and learning it yourself',
            'Gives a realistic alternative within the six weeks',
          ],
        },
      },
      sayIt: 'Explain to an operations director in 60 seconds why you don’t roll out an improvement by e-mail, and what yokoten does differently.',
      terms: [
        { term: 'Yokoten', def: 'Japanese for spreading ideas and improvements horizontally, between lines and sites.' },
        { term: 'Copy and improve', def: 'Taking over the thinking behind a solution and adapting the solution to your own situation.' },
        { term: 'Model line', def: 'One line where the new way runs fully and stably, as an example and place to learn for other lines.' },
        { term: 'Roll-out readiness', def: 'Whether a line is ready to join: a local owner, a baseline, known differences and time for training.' },
      ],
    },
  ],
};
