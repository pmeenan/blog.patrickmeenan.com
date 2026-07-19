# Project Context & Guidelines

This file serves as a memory for AI assistants to maintain consistency across future AI-assisted development on the `blog.patrickmeenan.com` project.

## Tech Stack
* **Framework**: [Astro](https://astro.build/)
* **Deployment**: Uses a custom build/deploy script (`deploy.sh`) to build the site and sync it to the production server.

## Feature Implementations & Rules

### 1. Images & Gallery
* **Processing Constraints**: All processed images must be resized/constrained to a maximum dimensions of 1280x1280 pixels, maintaining aspect ratio.
* **Format & Quality**: Images are converted/compressed to JPEG format at a quality level of `85`.
* **Orientation (EXIF)**: Processing scripts must always correctly read and apply EXIF orientation metadata to prevent images from rotating sideways on export.
* **Captions**: In Markdown content, the `title` attribute of an image is actively used to render visible image captions on the frontend. Ensure consistent spacing between images and their captions.

### 2. Code Blocks
* **Syntax Highlighting**: Code blocks are styled to contextually support both Light and Dark modes.
* **UX Enhancements**: Must dynamically include a "Copy to Clipboard" button for user convenience.

### 3. Feeds
* **RSS/Atom**: The Atom feed configuration is primarily maintained in `src/pages/atom.xml.js`.

## Writing Blog Posts

When drafting, editing, or reviewing blog post content (anything under `src/content/blog/`), you MUST read [WRITING-GUIDE.md](WRITING-GUIDE.md) first and follow it. It codifies the author's voice, post structure, length, file/frontmatter mechanics, and a set of hard rules (no em-dashes, no puffery, clear language) that drafts are checked against.
