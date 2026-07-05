# Infrastructure Pilgrimage Roadmap

A modular, JSON-driven roadmap dashboard for infrastructure, systems
engineering, automation, and platform learning.

The project uses a modern black-and-white terminal style. It is intentionally
built with Vite, plain JavaScript modules, CSS, JSON, Git, and GitHub so the
fundamentals stay visible.

## What The App Shows

- Pilgrimage Rail: technical pillars such as Windows, PowerShell, Git, Linux,
  Python, Docker, Terraform, Ansible, Kubernetes, and the integrated lab.
- Roadmap: phased learning plan with skills, projects, outcomes, and flexible
  detail sections.
- Requirements: hardware, software, subscriptions, licences, networking, and
  documentation requirements.

On desktop, the app is designed to fit inside one viewport. Rails scroll
horizontally inside their own sections, while the requirements panel scrolls
vertically inside the sidebar.

## Current Features

- Vite development server and production build
- Vanilla JavaScript component modules
- JSON-driven content
- Modular section registry
- Expandable pilgrimage and roadmap cards
- Focused rail behavior: expanding one rail gives it more vertical space
- Expandable requirements groups
- Desktop dashboard layout
- Mobile layout with natural vertical scrolling
- Data validation script
- GitHub Pages deployment workflow

## Project Structure

```text
.github/
  workflows/
    deploy-pages.yml
docs/
  data-contract.md
  github-ci-cd.md
scripts/
  validate-data.mjs
src/
  components/
    dashboardShell.js
    pilgrimageCards.js
    requirementsPanel.js
    roadmapRail.js
  config/
    sectionRegistry.js
  data/
    pilgrimages.json
    requirements.json
    roadmap.json
    settings.json
  utils/
    loadJSON.js
  main.js
  styles.css
index.html
package.json
vite.config.js
```

## How The App Works

The app starts in `src/main.js`.

```text
settings.json
  -> sectionRegistry.js
  -> loadJSON()
  -> component renderer
  -> DOM elements
  -> styles.css
  -> browser
```

The key idea:

- JSON stores the content.
- JavaScript reads the JSON and creates HTML elements.
- CSS controls the visual layout.
- Git saves each checkpoint.
- GitHub Actions can validate, build, and publish the site.

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Validate data only:

```bash
npm run check:data
```

Validate data and build:

```bash
npm run check
```

Preview the production build:

```bash
npm run preview
```

On Windows PowerShell, if script execution blocks `npm`, use the command shim:

```bash
npm.cmd run check
```

In Git Bash, normal `npm run check` should work.

## Editing Content

Most content changes should happen in JSON:

- `src/data/pilgrimages.json`
- `src/data/roadmap.json`
- `src/data/requirements.json`
- `src/data/settings.json`

The safest edits are changing text, adding array items, removing array items,
and reordering items.

Example safe roadmap edit:

```json
{
  "title": "Monthly Routine",
  "items": [
    "Review lab notes",
    "Commit documented progress"
  ]
}
```

The key `title` must stay as `title`, but the value can be renamed freely.

Read the full contract here:

```text
docs/data-contract.md
```

## Modularity

Sections are controlled by `src/data/settings.json`.

Example:

```json
{
  "id": "roadmap",
  "enabled": true,
  "region": "workspace",
  "order": 2
}
```

The `id` connects to `src/config/sectionRegistry.js`.

```js
roadmap: {
  dataKey: "roadmap",
  render: renderRoadmapRail,
}
```

That means you can enable, disable, reorder, or move existing sections without
touching `index.html`.

Adding a brand-new section needs three things:

1. A JSON data file.
2. A component renderer.
3. A registry entry in `sectionRegistry.js`.

## Git Workflow

Check what changed:

```bash
git status
```

Review edits:

```bash
git diff
```

Run checks:

```bash
npm run check
```

Stage files:

```bash
git add -A
```

Commit:

```bash
git commit -m "Describe the completed change"
```

Push:

```bash
git push
```

## GitHub Pages And CI/CD

The deployment workflow is:

```text
.github/workflows/deploy-pages.yml
```

On every push to `main`, GitHub Actions will:

```text
checkout repository
setup Node.js
install dependencies
validate JSON data
build the Vite site
upload dist/
deploy to GitHub Pages
```

Read the full guide here:

```text
docs/github-ci-cd.md
```

The current Vite base path is:

```js
base: "/PilgrimWEB/"
```

If the GitHub repository name changes, update `vite.config.js` to match.

## Purpose

This is both a learning dashboard and a portfolio artifact. The goal is to
build evidence of practical growth across Windows infrastructure, Linux,
PowerShell, Python, Git, CI/CD, Docker, Terraform, Ansible, Kubernetes, and an
integrated enterprise lab.
