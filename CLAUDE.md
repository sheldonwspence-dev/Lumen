# Lumen Prompt Optimizer

Sheldon Spence's build. You (Claude Code) write the code. Sheldon makes the decisions and writes every word a user sees.

## What it is

One page. Paste a prompt, pick a task (grant proposal, donor email, volunteer outreach), and get back a sharper prompt plus 3 annotated "why this change" notes, with a before/after view.

The story: Sheldon pitched Lumen as a concept at DECA ICDC 2026 and placed 2nd in the world. This repo is that concept made real. It's his MIT Maker Portfolio project, so the build process matters as much as the result. The original deck is in this repo at `concept/icdc-deck.html`. It's the historical artifact: never modify it.

Production domain: `lumen-theta-ten.vercel.app`. Vercel deploys every push to `main`.

## How we work: background mode

Sheldon wants you to work through milestones without him watching.

- At the start of a milestone, post a short plan and wait for his go. After that, work through the whole milestone without stopping.
- Stop and wait only for:
  1. A screenshot checkpoint.
  2. Installing anything or adding a dependency.
  3. Anything touching the API key, Vercel settings, or GitHub settings.
  4. A choice that changes what users see or how the product works and isn't settled in this file.
- For smaller calls, pick the simpler option, log it as "Claude decided, Sheldon to review", and keep going.
- Everything goes on `main`. Nobody uses production before the Oct 22 user test, so in-progress work there costs nothing.
- After each push, wait for Vercel to deploy, then test the function with `curl` against the production domain. Visual checks are Sheldon's job at checkpoints.
- End every milestone by appending a summary to `PROGRESS.md`: what changed, which files, decisions to review, and what Sheldon should look at in the diff. Write it in plain sentences he could use to explain the work to a reviewer.

## Rules

1. **Visible text is Sheldon's.** Every user-facing string (page title, labels, buttons, helper text, errors, empty states, README prose) goes in as `[PLACEHOLDER id: what this text needs to do]`, where `id` is short and unique, like `button.rewrite`. List every placeholder in `COPY.md` as a `### id` heading, a one-line note on what it needs to do, and an empty line for Sheldon's text. Sheldon writes in `COPY.md`. Claude may commit `COPY.md` only to add empty slots, with a commit message that says so; Claude never edits or commits Sheldon's text, and commits of his text are his. When he says it's updated, move his text into the code exactly as written: no edits, no fixes, no rewording. If you spot a typo, note it in `PROGRESS.md` and leave it. The only words you may write are the three task names above.
2. **The API key never leaves Vercel.** It lives only in the Vercel environment variable `ANTHROPIC_API_KEY`. Never ask Sheldon for it, print it, log it, write it to a file, or run `vercel env pull`. Don't run the function locally with a real key.
3. **Scope is fixed.** "What it is" above is the whole product. If anyone proposes more (accounts, history, saving, sharing, more tasks, the deck's other three tools), say "That's a feature. Parking it.", add one line to `PARKED.md`, and get back to the milestone.
4. **Log decisions as they happen.** When a real choice is made, append one line to `DECISIONS.md`:
   `YYYY-MM-DD | decision | why | decided by`
   "Decided by" is one of: Sheldon / Claude proposed, Sheldon approved / Sheldon chose from Claude's options / Claude decided, Sheldon to review. Never backfill or embellish. This file becomes his build log.
5. **Screenshot checkpoints.** At v0, v1 and v1.1, finish the milestone, then stop and say `SCREENSHOT CHECKPOINT: vX`. Tell Sheldon exactly what should be on screen and the filename to use, `YYYY-MM-DD_vX_short-description.png`, for his MIT screenshots folder (outside this repo; screenshots are never committed). Remind him to capture only the browser window (Cmd+Shift+4, then Space). After he confirms, tag the commit `vX` and push the tag.
6. **Honest history.** Small commits with plain messages. Don't remove or rewrite any AI attribution on commits. Commit `COPY.md` only to add empty slots (see rule 1), never with Sheldon's text in it.
7. **Code Sheldon can defend.** Vanilla HTML/CSS/JS, no framework, no build step, no npm dependencies unless Sheldon approves one. Small files he can read end to end. Comment only where the why isn't obvious.
8. **No key in the repo.** Before every commit, search the whole repo, docs included, for the Anthropic key prefix: `sk-` immediately followed by `ant` (written split here so this file doesn't match its own check). If anything turns up, stop and tell Sheldon.
9. **The API is called from one place.** Only `api/optimize.js` calls the Anthropic API. The browser never does.

## Stack

- Frontend: `index.html`, `styles.css`, `app.js`.
- One serverless function: `api/optimize.js`. Check Vercel's current docs for the right format for a no-framework project before writing it.
- Model: Claude Sonnet 5.5, `claude-sonnet-5-5`. Confirm the exact string in Anthropic's models docs before first use. Call the Messages API with `fetch`, no SDK. Don't set `temperature` and `top_p` together.
- The tool's brain: `prompts/optimizer.md`, ported word for word from Sheldon's ICDC prototype. The function loads its Instructions section and puts the user's prompt where `${input}` is; code never rewrites the wording. The task examples in that file are for the "Try an example" button only and must never be sent to the model. If the file is missing or the Instructions section is empty, stop and ask. Don't draft one.
- The rewrite must never invent facts about the user or their organization (amounts, names, dates, results). Where the original prompt is missing something, the rewrite inserts a clearly marked ALL-CAPS slot in square brackets, like `[TOPIC]`, for the user to fill.
- Output shape: `improved`, `highlights` (3-4 phrases) and `changes` (exactly 3), returned as schema-constrained JSON (structured outputs, `output_config.format`). Sonnet 5.5 rejects forced tool calls, so a forced tool call isn't an option. Validate the shape server-side before sending it to the page.
- `.gitignore`: `.env*`, `.vercel`, `node_modules`, `.DS_Store`.

## Abuse protection (no extra accounts)

- POST only. Reject requests whose `Origin` isn't the production domain above or localhost.
- In-memory per-IP limit, roughly 8 requests per 10 minutes. It's per instance, so it leaks across instances; the monthly spend cap on the Anthropic account is the backstop. Say so in a code comment.
- Cap input at about 4,000 characters and set a firm `max_tokens`.
- The page gets a short error code (for example `rate_limited`), which the frontend maps to Sheldon's placeholder messages. Details go to server logs, never the key or the full prompt.

## Look (from v1)

The Prompt Optimizer screen in `concept/icdc-prototype.html`, Sheldon's actual ICDC app: same layout, Fraunces and Inter, same palette. A reviewer should see the concept that won come to life. The deck (`concept/icdc-deck.html`) stays the reference for brand details.

- Palette (the deck's, which the prototype shares; check the prototype's CSS if they differ): `#FDFBF5` cream, `#2C2C2A` ink, `#5F5E5A` and `#888780` greys, `#D3D1C7` and `#E5E2D8` rules, `#BA7517` and `#EF9F27` amber, `#FAEEDA` and `#FAC775` tints, `#854F0B` deep amber.
- Same type as the prototype: Fraunces for headlines and big numbers, Inter for everything else (loaded from Google Fonts).
- Same logo mark and wordmark (the L with the glowing dot, from the deck's SVG).
- Same component vocabulary: small tracked eyebrow labels, the short amber divider under headlines, white cards with hairline borders, the 2px amber border for the featured element, amber italic emphasis in headlines, the soft radial amber glow.
- Light mode only, like the deck.
- The before/after view is the centerpiece. In the deck, the Prompt Optimizer was the featured card; treat it the same way here.

## Milestones

- **M0, Oct 17.** Sheldon has already committed `CLAUDE.md`, `DECISIONS.md` and `concept/icdc-deck.html`. Scaffold the files above, write `.claude/settings.json` (next section), create `COPY.md` and `PROGRESS.md`, push, confirm Vercel deploys, and have `api/optimize` answer a test request with `{ ok: true, keyConfigured: true | false }`. A boolean, never the key. Ask Sheldon to confirm any `DECISIONS.md` lines marked "Sheldon to confirm" and update them. Finish by telling him to type `/exit` and start a fresh session before v0, so the permissions file loads. Stop.
- **v0, Oct 18.** Uses `prompts/optimizer.md`. Paste a prompt, get back the improved prompt and the three changes. Live on Vercel, abuse protection on. Unstyled is fine. Screenshot checkpoint.
- **v1, Oct 19–21.** All three task presets, the 3 notes, before/after view, deck-matched styling, responsive, and Sheldon's text from `COPY.md` moved in so testers see real words on Oct 22. Screenshot checkpoint.
- **v1.1, after the Oct 22 user test.** Fixes from testing only. No new features. Screenshot checkpoint.

## Permissions file (M0)

Create `.claude/settings.json` so background runs don't stall on approvals. Check the current permission-rule syntax in the Claude Code docs first. Commit it; it's part of the public record of how Claude was allowed to work.

- `defaultMode`: `acceptEdits`
- allow: `git add`, `git commit`, `git push`, `git status`, `git diff`, `git log`, `curl` to the production domain, and a local static file server for previews
- ask: `git tag`, any package install (`brew`, `npm`, `pip`)
- deny: reading `.env` files, any `vercel env` command, force pushes, `sudo`, `rm -rf`

## Every session

Read this file, the last 10 lines of `DECISIONS.md`, and the latest entry in `PROGRESS.md`. Say which milestone is next and your plan for it in a few lines. Wait for Sheldon's go, then run the milestone.
