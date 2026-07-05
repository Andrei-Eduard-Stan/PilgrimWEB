# Infrastructure Pilgrimage Roadmap

A modular, JSON-driven roadmap dashboard for infrastructure, systems engineering, automation, and platform learning.

The project is built as a modern black-and-white terminal dashboard. It displays technical learning pillars as horizontal pilgrimage cards, a phased roadmap rail, and a requirements panel for lab equipment, tools, accounts, and documentation.

## Current Features

- Viewport-based desktop dashboard layout
- Mobile layout that returns to natural vertical scrolling
- JSON-driven pilgrimage cards
- JSON-driven roadmap phase cards
- JSON-driven requirements panel
- Expandable pilgrimage and roadmap cards
- Native `details` and `summary` requirements accordions
- Modular section registry
- Vite development and production build workflow

## Tech Stack

- Vite
- Vanilla JavaScript modules
- Plain CSS
- JSON data files
- Git and GitHub

This project intentionally avoids React or a component framework for now. The goal is to learn the fundamentals directly: HTML structure, CSS layout, JavaScript modules, DOM rendering, JSON loading, Git, GitHub, and deployment.

## Project Structure

```text
src/
  config/
    sectionRegistry.js
  components/
    dashboardShell.js
    pilgrimageCards.js
    requirementsPanel.js
    roadmapRail.js
  data/
    pilgrimages.json
    requirements.json
    roadmap.json
    settings.json
  utils/
    loadJSON.js
  main.js
  styles.css
```

## Data Flow

```text
settings.json
  -> sectionRegistry.js
  -> loadJSON()
  -> component renderer
  -> DOM elements
  -> styles.css
  -> browser
```

Each section has a stable ID in `settings.json`. The registry maps that ID to a data source and renderer.

Example:

```js
roadmap: {
  dataKey: "roadmap",
  render: renderRoadmapRail,
}
```

That means the app can load `roadmap.json`, pass it to `renderRoadmapRail()`, and place the result in the region configured by `settings.json`.

## Editing Content

Most content changes should happen in JSON:

- Add or edit pilgrimage pillars in `src/data/pilgrimages.json`
- Add or edit roadmap phases in `src/data/roadmap.json`
- Add or edit requirement groups in `src/data/requirements.json`
- Enable, disable, reorder, or move sections in `src/data/settings.json`

Roadmap phase details use a flexible `detailSections` array:

```json
{
  "title": "Weekly Habits",
  "items": [
    "Make at least three Git commits per week",
    "Document every lab change in Markdown"
  ]
}
```

You can rename the title, remove the section, or add another section without editing the JavaScript renderer.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

The site is configured for GitHub Pages at:

```text
https://andrei-eduard-stan.github.io/PilgrimWEB/
```

Because this is a project site under the `PilgrimWEB` repository, `vite.config.js` uses:

```js
base: "/PilgrimWEB/"
```

The deployment workflow lives in:

```text
.github/workflows/deploy-pages.yml
```

On every push to `main`, GitHub Actions will:

```text
checkout repository
install dependencies
build the Vite site
upload dist as a Pages artifact
deploy to GitHub Pages
```

In GitHub, the repository must have Pages configured to use GitHub Actions:

```text
Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

## Git Workflow

Check the working tree:

```bash
git status
```

Review changed files:

```bash
git diff --stat
```

Stage all file changes:

```bash
git add -A
```

Commit a checkpoint:

```bash
git commit -m "Describe the completed step"
```

Push to GitHub:

```bash
git push
```

## Next Improvements

- Add progress tracking
- Add search or filtering
- Add saved progress with `localStorage`
- Add print-friendly view
- Add more screenshots and architecture diagrams

## Purpose

This project is both a learning dashboard and a portfolio artifact. It is designed to show practical growth across Windows infrastructure, Linux, PowerShell, Python, Git, CI/CD, Docker, Terraform, Ansible, Kubernetes, and integrated enterprise lab work.
