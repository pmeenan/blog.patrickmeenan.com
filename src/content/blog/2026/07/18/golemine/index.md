---
title: "Exploring iOS Backups with Golemine"
date: 2026-07-18T14:09:10.000-04:00
---

I was getting really frustrated with Apple's search implementation for their "Messages" app (both on mobile and a Macbook) when I was trying to find specific messages from quite a while ago so I did what any dev does these days with all of the capabilities that AI brings: I built a tool for searching, viewing, collecting and printing messages from iOS backups (encrypted included).

![Golemine Hero](./hero.jpeg "A stylized automaton mining through iOS backup data.")

You can use it from here: [https://golemine.com/](https://golemine.com/) if you want to play with it and the code is available on [Github](https://github.com/pmeenan/golemine) (feel free to file issues but I can't guarantee I'll implement new features or provide support).

The name is from **Golem + Mine**: a mechanical golem that mines through the data in a backup and extracts the interesting bits. It is a 100% local, browser-based tool for exploring, searching, and extracting data from iPhone (iTunes/Finder) backups and their Messages data.

## Privacy First (and Local Everything)

It is critical to point out that Golemine is 100% local in-browser and nothing is ever sent off-device (it is hosted on a static server). 

When you load Golemine, your backup data never leaves your machine. There is no server processing, no upload, and no telemetry. In fact, after the first load, the app installs as a Progressive Web App (PWA) and works fully offline. If you point it at an encrypted backup, it decrypts the content locally in a web worker using a session-only password prompt that is wiped from memory as soon as the session ends.

## The Architecture & Tech Stack

Building a tool that can process multi-gigabyte iPhone backups entirely within the browser requires leaning heavily on modern web platform capabilities. I wanted to see how far I could push the browser to do heavy lifting that traditionally required a native desktop application. 

Here is a breakdown of the web technologies powering Golemine:

* **File System Access API:** This is the core enabler. By using the Origin Private File System (OPFS), the browser can read the raw backup folders directly from your hard drive without needing to load terabytes of data into RAM. You literally just drag and drop the backup folder onto the page (though you may have to move the backup out of the protected location on your hard drive first).
* **sqlite-wasm & opfs-sahpool:** Apple stores Messages data in SQLite databases. Golemine uses the official `sqlite-wasm` build backed by the `opfs-sahpool` (SyncAccessHandle pool) to run an in-browser SQLite instance directly against the Origin Private File System. It applies the committed WAL (Write-Ahead Log) frames from the backup, normalizes the data, and builds a fast Full Text Search (FTS) index.
* **Web Workers:** To keep the UI snappy, all the heavy lifting is offloaded. There are dedicated workers for backup processing (`backup-worker`), database operations (`db-worker`), and media decoding (`media-worker`). This includes real-time AES-CBC decryption for encrypted backups.
* **Media Decoding:** Getting attachments right was a challenge. Native videos use the browser's built-in `<video>` tags via lazily staged Blobs, while HEIC photos (which are ubiquitous on iPhones) use `libheif-js` in a worker to generate thumbnails. 
* **The App Shell:** The frontend is built on a strict React 19 and TypeScript foundation using Vite (yeah, bring out the performance pitchforks - you're loading a 10's of GB backup - don't complain about me using React). It utilizes `react-virtuoso` for virtualized timelines, allowing it to render massive conversation threads in an infinite scroll. And because not everyone loves my dark-theme preference, it supports auto or explicit dark/light mode.

## Core Features & Report Printing

While it's still a work-in-progress, the core functionality is already incredibly solid. 

Once you ingest a backup, you get a fast, responsive UI where you can search across all your messages or filter down to specific threads. The search supports participant/attachment filtering and uses a two-month calendar picker for date ranges. It uses unquoted words for case-insensitive prefix matching and quoted words for exact substring matches. 

One of the neatest features I added was the **Report printing** capability. You can select specific messages from timelines or search results and compile them into named reports. It allows you to add notes and export a print-ready PDF directly through the browser's print dialog. The report includes a bunch of message diagnostic data including source hashes, device identity, message GUIDs, raw timestamps, and explicit timezones.

## Getting Started

If you have an iPhone backup sitting on your hard drive (whether created via Finder on macOS or Apple Devices/iTunes on Windows), you can dive right in. 
