# Before and after

Calibration examples with synthetic facts. Every "after" uses only facts from its "before" or its stated context; anything missing is a visible placeholder. Do not copy them mechanically.

## 1. Client email with a buried ask

**Before:** "Hi Anna, I hope you are well. I wanted to follow up on our conversation last week regarding the dashboard project. As discussed, we have been making good progress on the data side and the ERP integration is now largely in place. There are a few remaining questions around access rights, and it would be helpful to get clarity on these at some point. In particular, we would need someone from your side to grant read access to the invoice module, as without this we cannot complete the revenue view, which was planned for the end of the month."

**After:** "Hi Anna, could someone on your side give me read access to the ERP invoice module by [date]? Without it I can't finish the revenue view planned for the end of the month. The rest of the integration is largely in place, and I have a few smaller access questions we can take at the same time."

**Why:** The ask, its reason and its deadline were in the last sentence; now they lead. "Largely" and the open questions survive. The date is a placeholder because the source has none.

## 2. Status update that hid a blocker

**Before:** "Overall the project is progressing well. Content is complete. The data API has seen some delays. Testing is planned to follow once the API is available. We will review again on Tuesday."

**After:** "Testing cannot start until the data API is delivered, and the API is delayed. Content is complete. Next review is Tuesday."

**Why:** "Progressing well" contradicted the facts. The dependency is the news, so it leads. No percentage, owner or decision was invented.

## 3. Proposal opening (SCQA)

**Context given:** the client's project managers rebuild a weekly margin report by hand from three systems, and it reaches them on Wednesday.

**Before:** "Fryland is a consultancy with experience in data, automation and AI. We offer a wide range of services that help companies become more data-driven. In this proposal we describe our approach to your reporting needs."

**After:** "Every week your project managers rebuild the margin report by hand from three systems, and it reaches them on Wednesday. Until then they steer running jobs on last week's figures. The question is how to get them current margins when the week starts. I propose an automated report that pulls from the three systems you already use, ready by [day and time]."

**Why:** Situation, complication, question, answer, in the client's terms. Credentials come later, if at all. "Last week's figures" follows from a Wednesday report; no timeline or price is invented.

## 4. A result told as a story (post or case study)

**Before:** "We implemented an automation solution that significantly improved efficiency in an installer's quoting process. Previously estimators retyped site-visit notes into the quoting system; now the notes are imported directly. Quotes go out the same day as the visit instead of 2 to 3 days later."

**After:**
"An installer's customers used to wait 2 to 3 days for a quote after the site visit.

The estimators took notes on site, then sat down later and typed the same notes into the quoting system. The quote waited for that second sitting.

Now the site notes go straight into the quoting system, and the quote leaves the same day as the visit.

Often the fastest fix is to find the step where someone types what someone else already wrote."

**Why:** Scene (customers waiting), tension (the second sitting), turn (notes go straight in), lesson. Every fact is from the source; "significantly improved efficiency" is replaced by what actually changed. The story gets four short paragraphs, not one line.

## 5. Slide titles as a storyline

**Before:** Background / Current state / Analysis / Options / Recommendation / Next steps

**After:**
1. Estimators spend [X hours a week] preparing quotes by hand
2. [Y%] of that time is retyping data that already exists
3. Automating the hand-off removes the retyping without changing tools
4. A [length] pilot on one team proves it before wider rollout
5. I need a pilot team and system access by [date]

**Why:** Read alone, the titles make the whole argument. Each is a claim the slide body must prove. The analysis supplies the numbers; until then they stay placeholders.

## 6. Technical step

**Before:** "Next you'll want to make sure the environment is properly configured before running the sync, which can be done in a number of ways."

**After:**
"1. Set the API key: `export ERP_API_KEY=<your key>`.
2. Run the sync in dry-run mode: `[sync command] --dry-run`. You should see [expected output]."

**Why:** One action per step, the exact command, and a check that proves it worked. Command and output are placeholders until taken from the real tool.
