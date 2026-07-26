---
title: "Testing Compression Dictionary Deployments"
date: 2026-07-26T14:16:17.000-04:00
---

Robin Marx has been asking me for a Compression Dictionary Transport ([RFC 9842](https://www.rfc-editor.org/rfc/rfc9842.html)) test tool for a long time (since well before AI was actually useful for this kind of work). Then Sergey Chernyshev brought it up again recently. So, I finally stopped procrastinating and spent a few hours this weekend working with AI to build out a proper test tool called [compdict](https://www.npmjs.com/package/compdict).

It turns out that using AI makes building test suites for web specs and protocols MUCH easier than doing it by hand, and it is something we should start leaning on a lot more.

![A developer surrounded by computer monitors displaying terminal windows and browser error messages.](./hero.jpeg "Debugging Compression Dictionary Transport issues across multiple monitors.")

## Bouncing Ideas and Spec Analysis

I started by bouncing ideas back and forth between Opus 5 and GPT Sol 5.6 (still waiting for Gemini 3.5 Pro to drop). I pointed both models at the [RFC](https://datatracker.ietf.org/doc/rfc9842/) and the fetch spec [pull request](https://github.com/whatwg/fetch/pull/1854) to work through what a useful test tool would look like and how it ought to work. 

We settled on a Node CLI tool runnable directly via `npx compdict` that also exposes a JavaScript API surface in case anyone wants to integrate it with a CI pipeline.

Beyond validation, I also wanted it to handle offline encoding so you can generate `dcb` and `dcz` delta-compressed assets directly in your build pipeline:

```bash
npx compdict encode dist/app.v2.js \
  --dictionary dist/app.v1.js \
  --encoding dcb \
  --hash
```

Using `--hash` appends the dictionary SHA-256 hash directly to the output filename (matching the Structured Field Byte Sequence in `Available-Dictionary`), making the output assets directly addressable from static storage or a CDN edge without needing on-the-fly compression.

To keep installation painless and avoid native C++ build toolchain headaches in locked-down CI images, we chose to bundle both Brotli and Zstandard via WebAssembly. That gives `compdict` zero runtime native dependencies and known-good codec implementations. When I had tried getting Brotli and Zstandard WASM builds working by hand in the past, it took me a day or two of pain for each one. The AI knocked out the bundled WASM setup without breaking a sweat.

I gave the models a few edge cases I was already aware of, and then had them look through the specs to identify a bunch more that should be tested. Between the two of them, they identified edge cases around content-encoding negotiation, header casing, URL pattern matching, and HTTP protocol parity that I almost certainly would have missed. One model generated the initial plan and the other model reviewed it.

## Putting AI to Work Overnight

Once I was happy with the plan, I asked GPT to orchestrate a bunch of subagents to build it out overnight so it would be ready for me to iterate on in the morning. I picked GPT for the implementation because it tends to be better at following directions, sticking to a plan, and thinking through edge cases (at least for me).

In the morning, I ran a few more rounds of having Opus code review GPT's work, had GPT fix the issues that Opus came up with, and then started running live tests against my dev test pages to see how it works and going back to GPT with change requests (once I have once agent implement, I usually have the same one do the revisions and changes - though often in new conversations).

## Finding Bugs on My Own Site

Funny enough, my own test site was littered with issues (well, my wife's road trip blog but what she doesn't know...):

* **Negotiation bypass:** It would serve `dcz` (Zstandard dictionary) responses as long as `Available-Dictionary` was announced, even if the client didn't advertise `dcz` in `Accept-Encoding`.
* **Caching lifetime:** The static assets are all `cache-control: no-cache`, making dictionaries useless for delta updates (whoops).

It did help refine the checks though. All of these tests are something I would have done if I had coded a test tool myself, but it is WAY more thorough than I ever would have been. And more importantly, it actually created the tool while I've been procrastinating doing it myself for 2 years (does that mean procrastination worked out again? - lazy programmers FTW!).

## Giving It a Spin

If you are serving or testing dictionary-compressed responses on your origin or CDN, you can run `compdict` directly against any URL:

```bash
npx compdict validate https://example.com/static/app.v1.js
```

It validates header correctness, `Vary: available-dictionary` behavior, URL pattern scope, and HTTP/1.1 vs HTTP/2 protocol parity, showing exact byte savings for `dcb` and `dcz` encodings.

The package is live on npm at [compdict](https://www.npmjs.com/package/compdict) and the source code is on [GitHub](https://github.com/pmeenan/compdict). Please file issues for anything you see that is broken or missing from the spec checks, and contributions are always welcome!
