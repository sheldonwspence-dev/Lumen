# Lumen

Turn sloppy prompts into sharp ones.

Paste how you'd normally ask AI for help. Lumen rewrites it into a prompt that actually works — and teaches you why.

This is for nonprofits, companies, and general employees who want to more effectively use AI by putting their initial idea in here, where it will be revised with all the things AI needs, which can be copied and put back into AI.

Try it: https://lumen-theta-ten.vercel.app

## Why I built it

I turned the DECA pitch into a real project (I wouldn't say product, because I am still hesitant on selling; just building for now) for a few different reasons. I thought that it was a good enough project to at least be convincing, and I thought that AI illiteracy is so prevalent that something which could help fill that gap would be incredibly successful.

## What testers changed

They changed the background information I should assume people have, and set my bar to meet the needs of everyone who may possibly need to use my project. They also showed me that I need to broaden my potential audience when it comes to who can use my project.

| Version | Date | What changed | Why (tester or decision) | By | Approved |
| --- | --- | --- | --- | --- | --- |
| v0 | Oct 19 | Paste a prompt, get a rewrite and three changes | First milestone | Claude | Sheldon |
| v1 | Oct 19 | Three tasks, before/after view, ICDC styling, Sheldon's text | Match the ICDC prototype | Claude, Sheldon | Sheldon |
| v1.1 | Oct 22 | Long pastes no longer silently cut off | Stress test of 16 prompts | Claude | Sheldon |
| v1.2 | Oct 22 | Audience line and Copy button added | Tester 1 feedback | Claude, Sheldon | Sheldon |
| v1.3 | Oct 22 | "Anything else" task button added | Tester 2 feedback | Claude, Sheldon | Sheldon |
| v1.4 | Oct 22 | Instructions say "people" instead of "nonprofit staff" | Broadened audience decision | Sheldon | Sheldon |

Known limitations are logged in [DECISIONS.md](DECISIONS.md).

## How I built it

Claude Code wrote the code. I fed it the ideas and told it where it went wrong.

## What's next

I can definitely make it more implementable with other projects or ideas. Since its intent is to make it easier to use AI, a quick and substantial improvement I can add is something that directly moves you to an AI and pastes the new prompt in there.

## Repo map

- `index.html`, `styles.css`, `app.js`: the page, its styling and its behavior.
- `api/optimize.js`: the one serverless function; the only code that calls the Anthropic API.
- `prompts/optimizer.md`: the instructions the model receives, ported from the ICDC prototype.
- `concept/`: the DECA ICDC original, kept unchanged: `icdc-deck.html` (the pitch deck) and `icdc-prototype.html` (the prototype).
- `COPY.md`: every word users see, written by Sheldon.
- `DECISIONS.md`: the build log of decisions, who made each one.
- `PROGRESS.md`: a summary of each milestone.
- `CLAUDE.md`: the working rules Claude Code follows in this repo.
- `.claude/settings.json`: what Claude Code is allowed to do without asking.
