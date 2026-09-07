# blog.patrickmeenan.com

The personal blog of Patrick Meenan, covering web performance, systems engineering, AI tooling, and software development.

- **Live Site**: [https://blog.patrickmeenan.com](https://blog.patrickmeenan.com)
- **Atom Feed**: [https://blog.patrickmeenan.com/atom.xml](https://blog.patrickmeenan.com/atom.xml)

---

## 🏗️ Architecture & Tech Stack

The blog is built as a fast, fully static website using the [Astro](https://astro.build/) framework.

* **Framework**: [Astro 5](https://astro.build/) in static output mode (`output: 'static'`).
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) using `@tailwindcss/vite` with full support for light and dark modes.
* **Content Collections**: Managed via Astro's content layer in `src/content.config.ts`, validated against a Zod schema.
* **Markdown & Rehype Pipeline**:
  * **Captions**: Custom `rehypeFigureFromTitle` plugin transforms image `title` attributes into `<figure>` and `<figcaption>` elements.
  * **Mermaid Diagrams**: Clientless, build-time SVG diagram rendering via `rehype-mermaid`.
  * **Syntax Highlighting**: Shiki with dual themes (`github-light` and `github-dark`), wrapped lines, and dynamic copy-to-clipboard buttons.
* **Open Graph (OG) Images**: Automatically rendered per post at build time via headless Playwright/Chromium (`src/pages/og/[...slug].png.ts`).
* **Image Service**: Custom Sharp-based image optimization service (`src/image-service.mjs`) ensuring correct EXIF orientation and high quality.
* **Syndication & SEO**:
  * Atom feed generated at `/atom.xml` via `feed` package (`src/pages/atom.xml.js`).
  * XML Sitemap generation via `@astrojs/sitemap`.

---

## 📁 Content Organization

All blog posts are located in the content collection directory under date-based paths:

```text
src/content/blog/
└── YYYY/
    └── MM/
        └── DD/
            └── <post-slug>/
                ├── index.md        # Post content & frontmatter
                ├── hero.jpg        # Colocated images
                └── ...
```

### Frontmatter Example

```markdown
---
title: "Title of the Post"
date: 2026-09-07T14:50:00.000-04:00
heroImage: "./hero.jpg" # Optional; defaults to the first image in the post
originalUrl: "https://..." # Optional; for migrated or cross-posted articles
---
```

### Writing & Asset Guidelines

* **Voice & Mechanics**: When drafting or editing content, refer to [WRITING-GUIDE.md](WRITING-GUIDE.md) and [AGENTS.md](AGENTS.md).
* **Images**:
  * Images must be resized to a maximum dimension of 1280x1280 pixels.
  * Stored as JPEG with quality level `85`.
  * EXIF orientation metadata must always be applied before saving.
  * Image `title` attributes are automatically rendered as visible captions (`![Alt text](./image.jpg "Caption text")`).

---

## 📂 Project Structure

```text
blog.patrickmeenan.com/
├── public/                 # Static public assets (favicons, fonts, robots.txt)
├── src/
│   ├── content/
│   │   └── blog/           # Blog posts (YYYY/MM/DD/<slug>/index.md)
│   ├── layouts/
│   │   └── Layout.astro    # Base HTML shell, metadata, nav, footer
│   ├── pages/
│   │   ├── [...slug].astro # Dynamic post router
│   │   ├── about.astro     # About page
│   │   ├── archive.astro   # Chronological post archive
│   │   ├── atom.xml.js     # Atom feed generator
│   │   ├── index.astro     # Homepage
│   │   └── og/
│   │       └── [...slug].png.ts # Dynamic Open Graph banner generator
│   ├── styles/             # Global CSS
│   ├── utils/              # Metadata extraction & helper plugins
│   ├── content.config.ts   # Astro collection schemas
│   └── image-service.mjs   # Sharp image pipeline
├── astro.config.mjs        # Astro configuration & markdown plugins
├── deploy.ps1              # Windows deployment script (wsl rsync / scp)
├── deploy.sh               # Linux/WSL deployment script (rsync)
├── package.json            # Scripts and dependencies
└── WRITING-GUIDE.md        # Blog writing guidelines and authorial voice
```

---

## 🧞 Available Scripts

All scripts can be run from the root of the project:

| Command | Description |
| :--- | :--- |
| `npm install` | Installs project dependencies. |
| `npm run dev` | Starts the local Astro development server at `http://localhost:4321`. |
| `npm run build` | Builds the static site and all assets into `./dist/`. |
| `npm run preview` | Serves the generated `./dist/` directory locally to test production output. |
| `npm run deploy` | Builds the site and syncs it to the production server via `deploy.ps1`. |
| `npm run astro ...` | Runs Astro CLI commands (e.g., `npm run astro -- --help`). |

---

## 🚀 Deployment

The site is deployed to the production web server (`pmeenan@plex:/var/www/blog.patrickmeenan.com/`).

### From Windows

Deployments can be executed directly from PowerShell, Command Prompt, or VS Code terminal:

```powershell
# Standard deployment (builds and syncs via headless WSL rsync):
npm run deploy

# Or run the script directly:
.\deploy.ps1

# Dry-run deployment (test without copying or deleting remote files):
npm run deploy -- -DryRun

# Deploy existing dist/ without rebuilding:
.\deploy.ps1 -NoBuild

# Force native OpenSSH scp instead of rsync:
.\deploy.ps1 -Scp
```

The script automatically uses headless `wsl rsync -avz --delete` when WSL is present to ensure fast differential transfer and cleanup of stale files on the server. If WSL is not detected or `-Scp` is passed, it falls back to native Windows OpenSSH `scp.exe`.

### From Linux / WSL

If working inside Linux or WSL, use the bash deploy script:

```bash
npm run build
./deploy.sh
```
