# Blog Post Writing Guide

This guide codifies the voice, structure and mechanics of the posts on this blog. It was distilled from all of the existing posts (2008-2026). Follow it when drafting a new post from an idea and guidance provided by Patrick. The goal is a first draft that reads like he wrote it, so he can iterate on substance instead of editing out "AI voice".

## How to use this guide

1. Patrick will give you an idea and some guidance (key points, links, data, images). Treat his guidance as the source of truth for content.
2. Draft the post in a new folder following the file mechanics below.
3. NEVER fabricate data, test results, quotes or links. If the post needs a number, screenshot or test run that you don't have, insert a clearly-marked placeholder like `[TODO: run the test and insert the result]` or `![TODO: waterfall screenshot](./waterfall.png "Caption describing what it should show")`.
4. This is a first draft. Prefer getting the voice and structure right over padding for length.

## File mechanics

- One folder per post: `src/content/blog/YYYY/MM/DD/short-slug/index.md` (date parts from the publish date, slug is short, lowercase, hyphenated).
- Images live in the same folder as the post and are referenced relatively: `./image.png`.
- Frontmatter is minimal:

```
---
title: "Post Title In Quotes"
date: 2026-07-18T14:09:10.000-04:00
---
```

- `title` is quoted. Titles are short, plain and descriptive, occasionally playful or a question ("Progressive JPEGs FTW!", "Does Gemini Create Fast Websites?", "It's Alive!"). Use a spaced hyphen for subtitles, never a colon-plus-clever-phrase and never an em-dash.
- `date` is a full ISO timestamp with the Eastern timezone offset (-04:00 or -05:00).
- Optional `heroImage: "./image.png"` selects the social-share image; otherwise the first image in the post is used automatically. Only set it when a later image is the better preview.

## Length

- Typical post: 700-1200 words. Corpus average is ~730.
- Short announcement or link-share: 100-400 words is fine. Don't pad.
- Deep-dive with data or a project introduction: up to ~1500-2300 words.
- Never stretch a post to hit a length. When the information is done, stop.

## Structure

The canonical shape is: unheaded intro, H2-sectioned discussion, short ending. Posts under ~400 words skip the headings entirely.

### Opening (no heading, 1-3 paragraphs)

Start mid-thought with the hook. No throat-clearing, no "In this post I will...", no roadmap. The first sentence is one of:

- Personal motivation or frustration: "I was getting really frustrated with Apple's search implementation..." / "I've been wanting to build a 100% client-based waterfall tool for a long time."
- The news itself: "Hot off of the Velocity Conference presses, iOS and Android 2.3 agents are now available..."
- A direct question the post will answer: "Should we ship jQuery, React and other popular frameworks with browsers...?"
- A long-standing observation or opinion: "One of the things that has always bothered me about..."
- A reaction to someone else's article or data (link it in the first sentence).

For long data-heavy posts, an optional bold `**TL;DR:**` paragraph can lead: "**TL;DR:** Progressive JPEGs are one of the easiest improvements you can make to the user experience and the penetration is a shockingly-low 7%."

### Discussion (H2 sections)

- Use `##` markdown headings, `###` sparingly for sub-groups.
- Headings are short: plain nouns ("The contenders", "Methodology: Building the Dictionary") or questions ("What is it?", "How did they do?", "How big is it?", "Doomed to fail?").
- Evidence drives the narrative: concrete numbers, before/after deltas, links to live test results, waterfalls and screenshots. Data first, then interpretation ("So, what does it mean?").
- Introduce images with a prose lead-in ending in a colon ("Here's how the savings looked:").
- Bulleted lists for enumerations (features, tradeoffs, formats), often with a bolded lead-in: `* **Game Engine**: ...`. Numbered lists only for ordered steps.

### Ending (short, never a summary)

Never restate the post and never write "In conclusion". End with one of:

- An invitation for feedback or contributions (especially project posts): "Please file issues for anything you see that is broken... and contributions are welcome."
- A forward-looking "What's Next?" section or thought about where things are heading.
- A practical takeaway or caveat the reader should act on.
- A punchline or kicker line: "If your company relies on its massive, legacy codebase as a moat, it might be time to start digging a new one."

## Voice

Write in first person, conversational, like explaining something interesting to a colleague. Specific habits, all backed by the corpus:

- **Contractions everywhere.** "it's", "don't", "I'd", "won't". Uncontracted forms only for emphasis.
- **Address the reader as "you"** and give direct advice when warranted.
- **Parenthetical asides are the signature habit.** Several per post, carrying caveats, jokes, bonus detail and self-deprecation: "(since I'm particularly lazy)", "(ok, petrified probably describes my reaction better than motivated)", "(and I feel better about myself)".
- **Emphasis via ALL CAPS on single words**, sparingly (a few per post, not per paragraph): "REALLY", "WAY better", "It ALSO provides", "FINALLY". This replaces italics.
- **Self-deprecating humor**: "I have zero design skills (less than zero if that's possible)", "you know that I have zero business actually calling it design".
- **Blunt when convinced, hedged when speculating.** Convictions get "Period." Speculation always gets flagged: "My guess is", "I'd hazard a guess", "probably", "I assume", "as far as I can tell", "We'll see if that holds".
- **Concrete numbers are the rhetorical currency**: "~200KB all-in and 9 requests", "~40% sooner", "half the size". Link claims to raw data (test results, spreadsheets, specs, GitHub).
- **Credit people and projects by name with links**: "Huge thanks go out to...".
- **Casual idioms and verbs** are natural here: "a bunch of", "pretty" as intensifier, "a bit", "no-brainer", "took care of it", "let it go to town", "knocked it out of the park", "shake out", "threw together".
- **Sentence starters**: "So,", "Well,", "Unfortunately,", "That said,", "To be fair,", "At the end of the day,". Not "Moreover,", "Furthermore,", "Additionally,".
- **Rhetorical questions as pivots**: "So how do we build it?", "Can we do better?"
- Long multi-clause sentences chained with "and"/"but"/"so" are fine and characteristic. Don't chop everything into short punchy fragments.

## Hard rules (the "AI tells" to avoid)

These are the things Patrick has to manually edit out of AI drafts. Violating them defeats the purpose of the draft.

- **NO em-dashes (—) or en-dashes (–), ever.** Not in prose, not in titles, not in list items. Use a spaced hyphen " - " or parentheses instead. This is the single most important rule.
- **No semicolons.** Chain clauses with "and"/"but"/"so", split with " - ", or use parentheses.
- **No puffery or embellishment.** Banned register: "wonderfully", "beautifully", "incredibly powerful", "blazing fast", "seamless", "robust", "cutting-edge", "revolutionary", "game-changing", "supercharge", "unlock", "elevate", "empower", "a testament to", "the beauty of".
- **No LLM transitional vocabulary**: "delve", "dive into", "unpack", "explore" (as filler), "journey", "landscape", "crucial", "pivotal", "myriad", "plethora", "It's worth noting that", "Notably,".
- **No hype fragments or setups**: "The result?", "Even better,", "But here's the thing:", "Enter X.", "X isn't just Y, it's Z", "Think of it as...".
- **No rule-of-three flourishes** ("faster, cleaner, and more reliable") unless the three items are literally the content.
- **No roadmap or meta text**: "In this post", "Let's get started", "Without further ado" (as a formula), "In conclusion", "To summarize".
- **No listicle framing, no formal abstract, no footnotes, no pull-quote blockquotes, no emoji.**
- **Clear language over impressive language.** Plain verbs, specific nouns, no adjective stacking. If a sentence would survive in marketing copy, rewrite it.
- **Never overstate certainty.** If a cause wasn't verified, say "presumably" or "it looks like", or leave a TODO for Patrick to verify.

## Formatting details

- **Links**: inline on descriptive noun phrases ("there's a recent WHATWG discussion on it [here]", "[wrote a post] about it"). Link the first mention of any tool or project. Bare visible URLs only when the URL itself is the point (e.g. "You can find the repository here: https://...").
- **Images**: `![Alt text describing the image](./image.png "Caption text")`. The `title` attribute renders as a visible caption below the image, so write it as a real caption. Always include both alt text and a caption.
- **Code**: fenced code blocks with a language tag (` ```bash `, ` ```javascript `, ` ```html `, ` ```json `, etc.). Mermaid diagrams are supported via ` ```mermaid ` fences. Short commands can stay inline in backticks or parentheses.
- **Bold**: key stats ("**40 kB** : The core waterfall tools JS"), key announcements, defined terms, list lead-ins. Not for random emphasis (that's what CAPS are for).
- **Italics**: rare. Word-level stress only ("_when_, not _if_").
- **Exclamation points**: one or two per post at most, for genuine peaks.
- **Ellipses**: occasional trailing transitions are in-voice ("so here we are.").
- **Scare quotes** for coined or ironic terms: a site I actually "designed", "vibe coding", "good enough".

## Drafting checklist

Before presenting a draft, verify:

- [ ] Search the draft for "—" and "–": zero matches.
- [ ] Search for ";" in prose: zero matches (code is fine).
- [ ] No banned words/phrases from the hard-rules section.
- [ ] Opens mid-thought with a hook, no roadmap.
- [ ] Ends with feedback invitation, forward look or kicker - not a summary.
- [ ] Every factual claim is either from Patrick's guidance, verifiable, or marked `[TODO]`.
- [ ] All images have alt text plus a caption in the title attribute, or a `[TODO]` placeholder.
- [ ] Frontmatter matches the format above and the folder path matches the date.
- [ ] Reads aloud like one person talking, parentheticals and all.
