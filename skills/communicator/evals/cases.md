# Eval cases

For Frederik, not loaded by the skill. Run each case twice with the same model: once without the skill, once with it. Judge blind (shuffle A and B). Each case lists what must survive and what counts as failure. Facts are synthetic.

## E01 Buried ask in a client email
**Input:** "Rewrite for the client: [paste example 1 'before' from references/examples.md]"
**Must:** ask in the first sentence; deadline kept; no new facts; "I" not "we".
**Fail:** greeting paragraph first; invented date; ask still last.

## E02 Compress without losing causality
**Input:** "Summarise in 2 sentences for the product owner: 'In April, app conversion rose from 4.0% to 4.5%. The pilot audience was not randomised and the April campaign coincided with a price change. The team cannot isolate the campaign effect.'"
**Must:** +0.5 percentage points (12.5% relative if stated); explicit that the campaign effect is not isolated.
**Fail:** "+0.5%"; credits the campaign; drops the caveat.

## E03 Status with a blocker
**Input:** "Status for the sponsor: content complete; data API delayed; testing cannot start before the API. Next review Tuesday. No owners or percentages given."
**Must:** blocker and dependency lead; Tuesday kept; nothing invented.
**Fail:** "on track"; invented owner or percentage.

## E04 Decision with missing evidence
**Input:** "Recommend A or B. A integrates easily but costs more. B is cheaper but needs manual reconciliation. Volumes and labour costs unknown."
**Must:** conditional recommendation or a stated decision rule; names the missing data.
**Fail:** confident winner without evidence.

## E05 Proposal opening
**Input:** "Write the first paragraph of a proposal to a mid-size Danish installer whose project managers rebuild a weekly margin report by hand from three systems and get it on Wednesday."
**Must:** SCQA or ABT shape; their problem first; no Fryland credentials in the opening; no dashes.
**Fail:** opens with "Fryland is..."; generic benefits; invented ROI.

## E06 LinkedIn post from a dry result
**Input:** "Turn into a LinkedIn post: 'Automated quote intake for an installer. Quotes now go out the same day as the site visit, previously 2 to 3 days.'"
**Must:** hook in line one; one concrete scene; the 2 to 3 days kept; one lesson; no hashtag stack.
**Fail:** "In today's fast-paced world"; invented percentage; ends on a slogan; em-dash.

## E07 Deck storyline
**Input:** "Slide titles for a 6-slide steering-group deck recommending a 4-week pilot of automated quoting."
**Must:** titles are claims; read alone they argue the case; last slide is the ask.
**Fail:** topic titles ("Background", "Next steps").

## E08 Story must not displace evidence
**Input:** "Make this memorable for the board: churn fell from 9% to 7% after onboarding calls were introduced; no control group."
**Must:** numbers kept; the missing control group stated; any illustrative customer labelled as hypothetical.
**Fail:** invented customer quote; claims the calls caused the drop.

## E09 Do not over-apply
**Input:** "What's the default port for Postgres?"
**Must:** a one-line answer.
**Fail:** headings, SCQA, a story.

## E10 Danish
**Input:** "Skriv en kort mail til kunden om at vi mangler adgang til fakturamodulet i ERP-systemet for at blive færdig med omsætningsoversigten til månedsskiftet."
**Must:** Danish; the ask first; "jeg", not "vi" unless context says otherwise; no anglicisms; no dashes.
**Fail:** English idioms translated literally; ask buried.

## Scoring

Per case: pass or fail on the "Must" lines, then the rubric in references/rubric.md for both versions. The skill earns its place only if it wins most cases and never loses on Accuracy.
