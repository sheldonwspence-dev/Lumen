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
