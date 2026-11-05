# Technical mode

Purpose: explain technical things precisely and produce documentation people can act on.

## First, choose the document type (Diátaxis)

| Reader's need | Type | Shape |
|---|---|---|
| Learn by doing | Tutorial | A guided, safe path to one working result. Explain only what is needed to continue |
| Get a task done | How-to | Goal, prerequisites, numbered steps (one action each), expected result, troubleshooting |
| Look something up | Reference | Consistent entries (name, type, default, description). No narrative |
| Understand why | Explanation | Context, design reasons, trade-offs, alternatives considered |

Do not mix types in one section. Link to an explanation instead of embedding it in steps.

## Rules

- **Precision beats plainness when they conflict.** Exact term, version, parameter, command. Define a term once if the reader may not know it.
- **One term per concept.** Do not alternate token, key and credential for the same thing; readers assume different words mean different things.
- **Never drop essential detail to save length:** prerequisites, permissions, versions, limits, defaults, error behaviour, security notes, rollback.
- **State assumptions:** environment, versions, what the reader must already have.
- **One action per step,** starting with a verb, followed by the expected result ("You should see...").
- **End procedures with a check:** the command to run and the output that proves it worked.
- **Examples are complete and runnable,** or clearly marked as illustrative. No ellipses in code someone will paste.
- **Support recovery:** name the likely errors and their fixes.
- **Keep explanation next to the thing it explains,** not three sections away.

## Explaining an architecture

1. Purpose: what the system does, for whom, in one or two sentences.
2. Components: 3 to 7, with one-line responsibilities.
3. Flow: how a typical request or record moves through.
4. Decisions and trade-offs: why it is built this way, what was given up.
5. Constraints and risks: scale, security, compliance, known limits.

Offer a diagram when there are more than three components or a non-linear flow (house style: `resources/taste/DESIGN-SYSTEM.md`).

## Common failures

- Marketing language in docs ("seamless", "powerful", "blazing fast").
- Steps that hide two actions; missing prerequisites.
- Explaining the obvious and skipping the hard part.
- Shortening docs by deleting the edge cases people actually hit.
