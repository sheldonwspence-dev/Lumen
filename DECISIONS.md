# Decisions

Format: `YYYY-MM-DD | decision | why | decided by`

2026-10-17 | Build with Claude Code instead of Cowork | Claude Code is made for repos, git and deploys; tagged commits double as build evidence | Claude proposed, Sheldon approved
2026-10-17 | Be open about AI assistance; no attempt to disguise AI-written code | Sheldon doesn't want to hide any of the work | Sheldon
2026-10-17 | Plain HTML/CSS/JS plus one Vercel function, no framework, no build step | Smallest thing Sheldon can read and explain end to end | Claude proposed, Sheldon approved
2026-10-17 | Model: Claude Sonnet 5.5 | Rewrite quality is the whole product, and this is the demo reviewers will try | Claude proposed, Sheldon approved
2026-10-17 | Rate limiting: in-function per-IP limit, input cap, origin check; no extra accounts | Avoids adding a new service; the monthly spend cap covers what the per-instance limit misses | Sheldon chose from Claude's options
2026-10-17 | API key lives only in a Vercel environment variable | Never on Sheldon's machine or in chat | Sheldon
2026-10-17 | Lumen matches the ICDC deck's look as closely as possible: palette, type, logo, components | Tells the story: the concept that placed 2nd in the world at ICDC, made real | Sheldon
2026-10-17 | Claude Code works through each milestone unattended, stopping only at screenshot checkpoints, installs, settings, and unsettled product choices | More gets done between sessions | Sheldon chose background mode, Claude proposed the stop list
2026-10-17 | Sheldon writes all UI text in COPY.md and commits it himself; Claude moves it into the code word for word | Keeps his words untouched, and his own commits show he wrote them | Claude proposed in flaw review, Sheldon approved
2026-10-17 | Copy the ICDC deck into this repo at concept/icdc-deck.html | Claude Code working in this repo can't reach the portfolio repo; concept and product sit side by side | Claude proposed in flaw review, Sheldon approved
2026-10-17 | Work on main only, no milestone branches | Keeps unattended runs simple and testable; nobody uses production before the Oct 22 test | Claude proposed in flaw review, Sheldon approved
2026-10-17 | Rewrites never invent facts; missing details become bracketed slots for the user | Prevents made-up grant details, and a sharper prompt should ask for what's missing | Claude proposed in flaw review, Sheldon approved
2026-10-17 | Removed the committed .DS_Store files (root and concept/) from git and added .DS_Store to .gitignore | They are macOS clutter and were committed by accident | Sheldon
2026-10-17 | .claude/settings.json leaves out defaultMode so the session's auto mode stays; the allow, ask and deny rules are kept | Sheldon wants to keep auto mode, which differs from the acceptEdits setting in CLAUDE.md | Sheldon
2026-10-17 | api/optimize.js uses Vercel's Web Standard export default { fetch(request) } form | It is the current documented format for a function in a no-framework project | Claude decided, Sheldon to review
2026-10-17 | Dropped lumen-oncore1.vercel.app; lumen-theta-ten.vercel.app is the only production domain, in testing, CLAUDE.md, the origin check and the curl rules | The oncore1 domain sits behind Vercel Authentication and can't be reached; Vercel's protection setting is left alone | Sheldon
2026-10-17 | Claude commits the empty COPY.md template once, labeled as the template; after that only Sheldon commits COPY.md | Gives COPY.md a starting point in git without Claude ever committing Sheldon's words | Sheldon
