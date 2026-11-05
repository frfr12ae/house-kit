# communicator

An agent skill that makes everything an AI writes for other people clear, true and well told: the point first, a storyline that carries the reader, nothing padded, nothing invented.

## Install

Copy the `communicator` folder into your skills directory:

- Claude Code: `~/.claude/skills/communicator/` (personal) or `.claude/skills/communicator/` (one project)
- Any client that reads the Agent Skills format (`SKILL.md` with `name` and `description`) works the same way

The agent loads `SKILL.md` when a task matches the description and opens the files in `references/` only when a task needs them.

## Make it yours

The section "House rules for Frederik's outputs" in `SKILL.md` holds one person's rules (no dashes, solo "I", Danish and English, markdown strategy docs). Replace it with your own. The "Neighbouring skills" paragraph names skills from the author's setup; drop the ones you do not have.

## What is in the folder

| File | Job |
|---|---|
| `SKILL.md` | Priority order, three private sentences, the storyline and its three tests, ten rules, mode picker, final check |
| `references/storyline.md` | Arcs (SCQA, And-But-Therefore, before-turn-after), real tension, story devices, the reader as hero, shapes for proposals, case studies, posts and emails |
| `references/explain.md`, `executive.md`, `technical.md`, `presentation.md` | One file per kind of output |
| `references/editing.md` | Four editing passes, certainty language, AI-writing patterns |
| `references/rubric.md` | Ten dimensions scored 1 to 3; a 1 on accuracy blocks delivery |
| `references/examples.md` | Six before/afters that invent nothing |
| `evals/cases.md` | Ten paired test cases, for you, not the agent |

## Where it came from

Synthesised from three deep-research reports (Claude, ChatGPT, Gemini) on how to make an AI communicate well. All three converged on answer-first structure, plain concrete language and correctness above brevity, drawing on Minto, Orwell, Zinsser, Tufte, Heath and Heath, and Diátaxis. This skill keeps that common core and makes the storyline central rather than an add-on for persuasion.

## How it was tested

- An adversarial review by a separate agent found 14 problems (contradictory rules, examples that invented facts, claim headings forced onto reference docs). All were fixed.
- A blind A/B test on four tasks (client email, proposal opening, LinkedIn post, board note), same model with and without the skill: the skill won 4 of 4 after the fixes. Four cases is a small sample; run `evals/cases.md` on your own work before trusting it.

License: MIT, like the rest of the kit.
