# Progress

## M0, Oct 17

**What changed.** The two committed `.DS_Store` files were removed from git and `.DS_Store` was added to a new `.gitignore`, along with `.env*`, `.vercel` and `node_modules`. The repo now has the empty page shell (`index.html`, `styles.css`, `app.js`), one serverless function (`api/optimize.js`), a permissions file (`.claude/settings.json`), `COPY.md` and this file.

**How the function works.** `api/optimize.js` uses the Web Standard `export default { fetch(request) }` form, which Vercel's Node.js docs list as the current format. It only accepts POST and only accepts an `Origin` of one of the two production domains or localhost. A good request returns `{ ok: true, keyConfigured: true | false }`, a boolean only. The key is never read into a response or a log.

**Tested on production.** On `lumen-theta-ten.vercel.app`: a POST with a valid Origin returned `{"ok":true,"keyConfigured":true}`, a GET returned `method_not_allowed`, and a POST with a wrong or missing Origin returned `bad_origin`.

**Needs your attention.**
- `lumen-oncore1.vercel.app` answers every request with "Protected by Vercel Authentication", so the function can't be reached there. This is a Vercel setting, which I don't touch. Decide whether to turn the protection off for that domain, or drop it.
- Four `DECISIONS.md` lines from the flaw review are still marked "Sheldon to confirm".

**Decisions to review.** The `.claude/settings.json` file leaves out `defaultMode` at your instruction, which differs from CLAUDE.md. The `curl` allow rules match only a URL that starts with one of the two production domains, either straight after `curl` or after options. Claude Code's docs say argument-matching rules like this are fragile, so they are a convenience, not a security boundary. The function format choice is logged in `DECISIONS.md`.

**Look at in the diff.** `.claude/settings.json` (the allow, ask and deny lists), `api/optimize.js` (the origin check), and `.gitignore`.

**COPY.md.** I created it with two placeholders, `page.title` and `page.headline`, and did not commit it. That commit is yours.

### M0 follow-up, Oct 17

You confirmed the four "Sheldon to confirm" decisions, so those lines now read "Sheldon approved". You dropped `lumen-oncore1.vercel.app`, so `lumen-theta-ten.vercel.app` is the only production domain. I changed CLAUDE.md, the origin check in `api/optimize.js` and the `curl` rules in `.claude/settings.json` to match. The M0 entry above still mentions both domains because it records what was true at the time. Vercel's protection setting is untouched. The empty COPY.md template is now committed, and from here on only you commit that file.

### v0, Oct 17–19

**What changed.** The page now sends a pasted prompt to `api/optimize.js`, which loads the Instructions section of `prompts/optimizer.md`, puts the prompt where `${input}` is, calls the Anthropic Messages API with `fetch`, checks the reply has an improved prompt, 3–4 highlights and exactly 3 changes, and sends it back. Abuse protection is on: POST only, an Origin check, about 8 requests per 10 minutes per IP (in memory, so it leaks across instances), a 4,000-character input cap and a firm `max_tokens`. Errors reach the page as short codes. The page is unstyled, as v0 allows.

**Files.** `api/optimize.js`, `index.html`, `app.js`, `concept/icdc-prototype.html` (moved from the repo root), `CLAUDE.md`, `DECISIONS.md`, `COPY.md` (empty slots only committed).

**Tested on production.** After a new key was added in Vercel, a real prompt ("write a grant proposal for our after school tutoring program") returned HTTP 200 with an improved prompt, four highlights and three changes. The rewrite used bracketed slots like `[FUNDER NAME]` and invented no facts.

**What went wrong.** The first live calls failed with Anthropic's `401 authentication_error: invalid x-api-key`. I added a temporary debug field three times to read the error and removed it each time; each is logged in `DECISIONS.md`. The cause was the key in Vercel, fixed on your side.

**Decisions to review.** Structured outputs instead of a forced tool call, thinking set to `between_tools`, `max_tokens` 1024 (all approved). I changed CLAUDE.md so I may commit `COPY.md` only to add empty slots. At your request I filled eleven COPY.md slots from the prototype; they are uncommitted for you to review. Five error slots stay empty because the prototype has no error text.

**Look at in the diff.** `api/optimize.js` (origin check, rate limit, validation) and the error handling in `app.js`.
