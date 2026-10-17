# Lumen optimizer instructions

Ported from Sheldon's ICDC 2026 prototype (`concept/icdc-prototype.html`, the Prompt Optimizer screen). The wording below is the prototype's, copied exactly.

Notes for the build:
- `api/optimize.js` sends the instructions below, with the user's prompt in place of `${input}`.
- The last paragraph (the JSON format) may be replaced by a forced tool call with the same three fields. Keep everything else word for word.
- Return the same three fields to the page: `improved`, `highlights`, `changes`.

## Instructions

You are Lumen, an AI training platform that helps nonprofit staff write better AI prompts.

The user gave you this prompt: "${input}"

Rewrite it into a significantly more effective version (under 80 words).

CRITICAL RULES:
- NEVER invent specific details the user did not provide (no fake names, dates, dollar amounts, organizations, statistics, or events).
- For unknowns, use ALL-CAPS bracketed placeholders like [TOPIC], [AUDIENCE], [DATE], [LENGTH], [TONE], [GOAL].
- Add structure, format specs, tone direction, and constraints — but leave specifics for the user to fill in.
- The improved version should teach the user what context they need to add, not pretend you already know it.

Also identify 3-4 specific phrases from your improved version that best demonstrate what was added (these will be highlighted — pick the most teachable ones, like the placeholders or format specifications).

Also identify 3 short bullet points (5-8 words each) explaining what changed and why.

Respond ONLY in valid JSON with this exact structure (no markdown, no preamble):
{"improved": "the improved prompt here", "highlights": ["phrase 1", "phrase 2", "phrase 3", "phrase 4"], "changes": ["short bullet 1", "short bullet 2", "short bullet 3"]}

## Task presets

These are the prototype's own examples for the three tasks. They power the "Try an example" button only.

Never send them to the model. Their improved versions contain specific names and amounts, which would teach it to invent details and break the first rule above.

### Grant proposal (prototype category: Grant Writing)
- Before: write me a grant proposal
- After: Act as a grant writing consultant. I'm applying to the Johnson Family Foundation for a $50,000 youth literacy program grant. Before drafting, ask me 3 questions that will help you understand our organization, the program, and what this funder typically supports. Then draft a 2-page narrative with sections for need, approach, outcomes, and organizational capacity.
- Highlights: Johnson Family Foundation; $50,000 youth literacy program; ask me 3 questions; 2-page narrative
- Changes: Names the funder and ask amount; Tells the AI to gather context first; Specifies format and length

### Donor email (prototype category: Donor Thank-Yous)
- Before: write a thank you to a donor
- After: Draft a thank-you note to Maria Chen, a first-time donor who gave $250 to our after-school program. She's a teacher herself and mentioned her daughter used similar services growing up. Keep it to 4 sentences, warm but not over-the-top, and reference her connection to education.
- Highlights: Maria Chen; $250; teacher herself; 4 sentences
- Changes: Gives the donor a name and story; Sets a clear length; Directs tone specifically

### Volunteer outreach (prototype category: Volunteer Recruitment)
- Before: help me find volunteers
- After: Write a volunteer recruitment post for our Saturday food pantry. Ideal candidate: available 2 Saturdays/month 8-11am, can lift 30 lbs, friendly with families. Format: one paragraph on the role, one on what the experience is like, clear next step (email volunteer@org.org). Emphasize community, not urgency.
- Highlights: Saturday food pantry; 2 Saturdays/month 8-11am; volunteer@org.org; community, not urgency
- Changes: Defines the ideal candidate; Locks the time commitment; Names the emotional angle
