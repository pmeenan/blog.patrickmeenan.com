---
title: "Can I create a AAA-quality game with AI on the web platform?"
date: 2026-07-11T20:44:30.000-04:00
---

Maybe? That's the question I'm hoping to answer over the next ... ??.

This is a (hopefully) fun experiment that I'm playing with in my spare time to explore both how far I can get with AI tools and where the rough edges or limits are in Chrome's tech stack and APIs. I'm targeting Chrome specifically because I'm mostly interested in the core capabilities that the latest web platform APIs offer and some of those are still Chrome-only at this point.

The goal is to build a full open-world game with high-quality graphics, native-level performance and peer-to-peer multiplayer. The comparison point for me is something like Skyrim but with much better graphics and some cool new capabilities (though, probably not nearly that expansive).

I'll be using AI to do pretty much all of the actual work and the [project](https://github.com/pmeenan/parallax) is structured from the start to be agent-focused (with instructions, docs, plans, etc) and I'll be doing the architecture, coordinating, planning and reviewing.

![Conducting](./creating.jpeg "Conducting the AI agents to build a new game.")

## Previous Experience

For gaming? None. Zero. Zilch. I've never worked on a game, rendering or graphics engine. I have less than zero artistic or 3D modeling experience (well, I model some 3D objects to print, but nothing you'd want to put in a game). I played a fair bit of Skyrim and a lot of other dungeon-crawler style games (and FPS's) years ago but these days I mostly code for fun - so here we are.

What I do have is a lot of experience in the web stack, execution pipelines, performance and a pretty good understanding of the pipeline and architectures used by gaming engines. Hopefully that, web search and help from the various AI agents will be enough, but that's part of the purpose of the experiment. I want to see how far AI has come along on the areas where I don't have the experience.

I've used AI to build a bunch of apps as side projects in areas where I don't have direct experience and had great luck so it's time to really push the envelope (and burn those subscription tokens).

## The Game

I picked an open-world action RPG-style game as the target because it pushes the tech stack the hardest and any other genre is a subset of that (and it's a type of game I enjoy so... Win/win?).

I'm going to bound the constraints a little bit so it's not a huge world but it will be large enough with enough different settings to force full asset swaps, some with natural transition points (like entering the underground catacombs) and some where seamless loading/swapping will be key (walking in and out of a village). It also allows for pushing the rendering pipeline with LOD management (I really wish Unreal and nanite were available on the web).

The current plan is for a seaside village setting with a castle on a nearby hill with farmland and forests surrounding the village and mountains in the distance. There will be a pretty good selection of buildings to enter and explore (village buildings, castle, catacombs, etc.).

![Game Scene](./scene.jpeg "A seaside village with a castle at the top of a hill and mountains in the distance.")

The hope is to be able to get to near-photorealistic 4k quality at decent frame rates given powerful-enough hardware.

That last bit is key. This isn't targeting "works on anything that can run a browser" and loads instantly, this is experimenting with a real install/launch offline game running on fast machines with 16+ GB of RAM and fast GPUs (Apple silicon is in-scope to try, Nvidia 4080 is the max-settings target).

## The Game Tech Stack

The features and tech decisions are being tracked [here](https://github.com/pmeenan/parallax/blob/main/docs/features.md).

* **Game Engine**: Going into the planning phase, I fully expected to use Unity (and hoped that Unreal had actually done something with WebGPU). I ended up being wrong on both fronts. The main issue with Unity for this experiment is that it isn't particularly flexible for pushing the envelope and threading on the web stack. It's a full environment but you're largely locked into what it offers (and the WebGPU support is still iffy). The current plan is to use [Babylon.js](https://www.babylonjs.com/) for the core engine which will bring proper WebGPU support, character animation, a physics engine and a lot of the core pieces and built for the web stack and extensibility specifically. We'll see if that holds because I'd rather not ALSO build a full engine if I don't have to. As it turns out, since I'm using AI for most of the dev, asset creating and planning, I wouldn't have benefitted from a lot of the Unity tooling anyway.

* **Graphics**: It has been mentioned a few times already, but the plan is to use [WebGPU](https://webgpu.org/) with full support for shaders and see how close to native performance I can get. There will be an "optimizing" step during install/launch where the code caches and shader caches are populated so the game itself will have consistent performance.

* **P2P Multiplayer**: This one is a little outside of the normal open-world genre but I thought it was a key technology to shake out since I've been very disappointed with the lack of direct UDP and TCP support within a browser (security nightmare so there are good reasons). One of the biggest pain points when my kids were young was getting them and their friends connected in Minecraft or Farming Sim, particularly when they weren't in the same physical location. The current plan is to add support for 2-4 player direct P2P multiplayer gaming using [WebRTC data channels](https://webrtc.org/getting-started/data-channels). Using websockets with a central server is easy but requires infrastructure and servers. WebRTC allows for direct data transfer between peers and takes care of the NAT-traversal issues (and is the closest to what local LAN gameplay uses).

* **Controller Support**: We'll be using whatever controller support we can get from the platform directly or the WebUSB support if needed. I'm particularly interested in trying out the event-driven enhancements to the [Gamepad API](https://chromestatus.com/feature/5989275208253440).

### Novel capabilities

Some of the things I want to exercise go beyond what you normally see in an open-world game and will be leveraging the new AI-backed features in Chrome for some of them:

* **NPC Chat**: I'll be leveraging LLM's to have NPCs in the world that can actually hold conversations with players (and will be experimenting with how far that can go). The hope is to create a dynamic world where conversations can have impact (beyond just simple fetch quests). It will make it harder to tell NPC's apart from game characters (intentionally) and it could lead to some interesting open-ended conversations. The NPC's could be seeded with knowledge of when they last crossed paths with someone the player is looking for and a backstory and it would be up to the players to ask the right questions. Flashbacks to Zork! I'm going to explore both training a custom model with the game lore and NPC backgrounds and leveraging the [Prompt API](https://developer.chrome.com/docs/ai/prompt-api) to see which pathe works best.

* **Voice Conversations**: The [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) gives us both speech recognition and text-to-speech (though the voice set is limiting). I'm planning to experiment with how much we can leverage the engine for a more natural conversational experience.

* **Live Translation**: The [Translation API](https://developer.chrome.com/docs/ai/translator-api) supports a large set of language pairs. It likely won't be as good as human-generated translations but it will be interesting to see how well it can work when applied to a full game world in realtime.

## Dev Workflow

I've probably beaten you over the head with the fact that this will largely be built using AI with me doing the architecture, planning and decision making. I have personal subscriptions to the main frontier providers and will mostly be using the core models that each offer (at reasonably high thinking levels):

### For Code:
- Google AI: A combination of 3.1 Pro and 3.5 Flash in Antigravity (though really hoping the rumors of a better pro-level model coming out soon come through).
- OpenAI: GPT 5.6 in Codex (usually High or XHigh).
- Anthropic: Fable (High) or Opus 4.8 (XHigh) in Claude Code.

Those will clearly change over time as new models come out.

For 2D Art I have liked using [Google Flow](https://labs.google/fx/tools/flow). It lets you generate named characters with backgrounds and behaviors as well as environments that you can then combine as needed to generate new images. It is pretty good about maintaining the consistency which has always been a challenge when generating images with AI.

For 3D Assets, I don't know yet and that will be part of the exploration. I will probably use Google Flow to generate the character sheets and views of the characters from multiple angles to feed to another model to generate the actual models. Probably in Blender with whatever model has the best model-building capabilities at the time but I'm not opposed to using AI tools that are designed specifically for 3D model generation.

### Agent Coordination

This is a workflow that has worked really well for me so far.

#### For the initial project setup:
1. Create an empty placeholder AGENTS.md in the project root and a CLAUDE.md with `@AGENTS.md` as the content so they work off the same instructions.
1. Have one AI generate the scaffolding for the project (docs, AGENTS.md, etc.) with instructions in AGENTS.md designed to have agents update docs, log decisions, rules about what they can and can't do and how they will be working.
1. One of the key instructions is to have agents assume their knowledge is stale and to ground any assumptions in web search or actual testing.
1. Iterate with that one agent on an overall goal and plan for the project and have it write the first draft of all of the docs.
1. Fire up each of the other agents and have them review the plans and docs to look for any issues or suggestions (I have yet to have a time where they don't find critical issues, no matter what model did the original work).
1. Review the final result myself and commit if I'm happy.

#### For ongoing development:
1. Pick one of the agents and ask it to implement the next milestone in the plan (or adjust the plan, fix an issue, whatever). Tell it that it is the tech lead for the feature, managing a team of subagents that do the implementation and to not accept the results until they have reviewed it and are happy with the results.
1. Fire up each of the other agents and have them review the current work (nothing is committed so the working tree is the set of changes). They ALWAYS find something wrong, usually pretty critical.
1. Feed the review results back to the implementing agent and ask it to verify the issues and fix the real ones.
1. Repeat until everyone is happy.
1. Repeat with me manually reviewing the changes and live-testing the result.
1. Commit the change when I'm happy with the result.

I'm sure I could wire up a harness to automate the cycles across the agents but I like staying in the loop, making judgement calls and pushing back as needed. If I just automated it and let it go, I'd just get whatever slop they all agreed to call done.

I also usually watch the thinking traces (what they are anyway these days) to make sure I don't need to interrupt it and correct some assumptions it is making.

## Cross-browser?

To the extent that it is possible, I am going to try to keep things cross-browser and only go Chrome-specific if it is unavoidable (without compromising quality). Some of the AI features may be Chrome-only but those can be implemented as progressive enhancements (like auto-translation and voice).

The two areas where I'm expecting to bumpt into challenges are different for Safari and Firefox:

**Safari**: Doesn't implement wasm64 yet so if I need more than 4GB of RAM in any of the wasm threads it will break safari support. I'll try to avoid it but if it proves impossible, at least it will provide good feedback to the Safari team.

**Firefox**: May be a problem for local storage. As far as I can tell, the limits on the amount of storage you can use are a lot lower than Chrome and Safari. If that holds true, a demo or the smaller world might be viable but a full game will have issues.

## Doomed to fail?

Probably, but at least I'll have fun!

The main pain point I am expecting is the model assets. I know Blender has a MCP server that Claude Code and Codex can drive but I expect their actual model generation (particularly full skeletons and rigging) is still in the early days. That said, it's advancing pretty rapidly so maybe by the time I get to that point it will be in good shape.

The project is on Github [here](https://github.com/pmeenan/parallax) and I'll be hosting snapshots of the "game" as I progress through the tech milestones on [parallax-web.com](https://parallax-web.com) (currently just a blank landing page). It's all open and Apache-2 licensed (at least my code and Babylon - we'll see what various libraries pull in but the plan is to keep in unburdened). I'll also be blogging about the progress here (both good and bad). As always, feedback and contributions are always welcome.