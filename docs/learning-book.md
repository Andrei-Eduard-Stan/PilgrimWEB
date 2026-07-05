# Learning The Infrastructure Roadmap Project From Zero

Version: 1.0

Project: Infrastructure Pilgrimage Roadmap

Audience: future you, starting from zero coding knowledge

Format: Markdown source file, suitable for GitHub reading, printing, or PDF conversion

## How To Use This Book

This book teaches the project you built, but it starts from first principles.

Do not try to memorize everything. Read one chapter, open the files in VS Code,
then make a tiny change yourself.

The goal is not to become a JavaScript expert in one sitting. The goal is to
understand the project well enough that you can change it, debug it, commit it,
push it, and explain it.

Recommended study pattern:

```text
Read
Open the related file
Predict what the code does
Make one small change
Run npm run check
Commit the change
Write one note about what you learned
```

## Table Of Contents

1. What You Are Building
2. The Big Mental Model
3. Files, Folders, And The Browser
4. HTML From Zero
5. CSS From Zero
6. JavaScript From Zero
7. JSON From Zero
8. NPM And Vite From Zero
9. Your Project Structure
10. How The App Starts
11. The Section Registry
12. Components
13. State And Expand/Collapse Behavior
14. Layout And The Focused Rail
15. Data Contracts
16. Validation
17. Git From Zero
18. GitHub From Zero
19. CI/CD From Zero
20. GitHub Pages And The Paywall
21. Debugging
22. How To Add A Feature
23. Practice Exercises
24. Glossary

---

# 1. What You Are Building

You are building a web dashboard for your infrastructure learning roadmap.

It has three main visible areas:

```text
Header
Workspace
Sidebar
```

The header shows identity/status text.

The workspace shows:

```text
Pilgrimage Rail
Roadmap
```

The sidebar shows:

```text
Requirements
```

The design style is a modern black-and-white terminal dashboard.

The project is intentionally not React. It uses:

```text
HTML
CSS
JavaScript
JSON
Vite
Git
GitHub
GitHub Actions
```

That is good for learning because the fundamentals are visible.

The project is data-driven. That means most of the visible content lives in JSON
files, not directly inside `index.html`.

For example:

```text
src/data/pilgrimages.json
src/data/roadmap.json
src/data/requirements.json
src/data/settings.json
```

The JavaScript reads those files and builds the visible page.

---

# 2. The Big Mental Model

This is the most important model in the project:

```text
JSON = content and data
JavaScript = behavior and page construction
CSS = appearance and layout
HTML = the starting shell
Git = local checkpoints
GitHub = online copy
GitHub Actions = automatic checks
GitHub Pages or another host = published website
```

When the page loads, this happens:

```text
index.html loads
main.js starts
main.js loads settings.json
settings.json says which sections are enabled
sectionRegistry.js maps section IDs to render functions
main.js loads the needed JSON data
components create HTML elements
styles.css makes those elements look like a dashboard
```

In code-flow form:

```text
settings.json
  -> sectionRegistry.js
  -> loadJSON()
  -> component renderer
  -> DOM elements
  -> styles.css
  -> browser
```

The DOM is the browser's live page structure.

DOM means:

```text
Document Object Model
```

You can think of it as the browser's tree of elements.

Example:

```html
<main id="app"></main>
```

JavaScript can find that element:

```js
const app = document.querySelector("#app");
```

Then JavaScript can put new elements inside it.

---

# 3. Files, Folders, And The Browser

A website is just files that the browser can load.

Your project has many files, but the browser starts with:

```text
index.html
```

That file points to:

```text
src/styles.css
src/main.js
```

The CSS controls appearance.

The JavaScript controls behavior.

Your repo structure is roughly:

```text
.github/
  workflows/
    deploy-pages.yml
docs/
  data-contract.md
  github-ci-cd.md
  learning-book.md
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

Folder meanings:

```text
src/components = reusable UI builders
src/data = content files
src/config = wiring/configuration
src/utils = small helper functions
scripts = developer scripts
docs = learning and project documentation
.github/workflows = GitHub automation
```

---

# 4. HTML From Zero

HTML describes structure.

Example:

```html
<h1>Roadmap DK</h1>
<p>system status: online</p>
```

HTML uses elements.

An element has:

```text
opening tag
content
closing tag
```

Example:

```html
<p>Hello</p>
```

The opening tag is:

```html
<p>
```

The content is:

```text
Hello
```

The closing tag is:

```html
</p>
```

Some elements have attributes:

```html
<main id="app"></main>
```

Here, `id="app"` is an attribute.

An `id` should be unique on the page.

Your `index.html` is intentionally small:

```html
<main id="app"></main>
<script type="module" src="/src/main.js"></script>
```

This means:

```text
Create an empty main element.
Load main.js as a JavaScript module.
Let JavaScript build the page.
```

Why not put everything in HTML?

Because your content is repeated and data-driven. You have many cards. Writing
every card by hand in HTML would create duplication. JSON plus JavaScript lets
you describe the data once and render cards automatically.

---

# 5. CSS From Zero

CSS controls appearance.

Example:

```css
body {
  background-color: #1a1a1a;
  color: #f5f5f5;
}
```

This means:

```text
Find the body element.
Make the background dark.
Make the text light.
```

CSS has selectors and declarations.

In this:

```css
.pilgrimage-card {
  border: 1px solid #444;
}
```

The selector is:

```css
.pilgrimage-card
```

It means:

```text
Find every element with class="pilgrimage-card".
```

The declaration is:

```css
border: 1px solid #444;
```

It means:

```text
Give it a border.
```

## Classes

HTML:

```html
<article class="pilgrimage-card"></article>
```

CSS:

```css
.pilgrimage-card {
  background-color: #111;
}
```

The dot in CSS means class.

## Layout

Your project uses CSS Grid and Flexbox.

Grid is good for page-level layout:

```css
.dashboard-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.32fr);
}
```

That means:

```text
Make the dashboard body a grid.
Use two columns.
The first column is the main workspace.
The second column is the sidebar.
```

Flexbox is good for rails:

```css
.pilgrimage-rail__track {
  display: flex;
  overflow-x: auto;
}
```

That means:

```text
Put cards in a row.
Let the row scroll sideways if there are too many cards.
```

## Data Attributes In CSS

Your JavaScript writes this:

```html
<section class="app-region app-region--workspace" data-focus-mode="roadmap">
```

CSS can react to it:

```css
.app-region--workspace[data-focus-mode="roadmap"] .pilgrimage-rail {
  display: none;
}
```

That means:

```text
When the workspace is focused on roadmap,
hide the pilgrimage rail.
```

This is a clean pattern:

```text
JavaScript decides state.
CSS decides layout.
```

---

# 6. JavaScript From Zero

JavaScript is the programming language running in the browser.

It can:

```text
store values
make decisions
repeat actions
create HTML elements
listen for clicks
load files
update the page
```

## Variables

```js
const app = document.querySelector("#app");
```

This means:

```text
Find the element with id="app".
Store it in a variable called app.
```

`const` means:

```text
This variable name will not be reassigned.
```

## Strings

```js
const title = "Roadmap DK";
```

A string is text.

## Objects

```js
const pilgrimage = {
  id: "windows-infrastructure",
  title: "Windows Infrastructure"
};
```

An object stores related values using keys.

This:

```js
pilgrimage.title
```

means:

```text
Get the title value from the pilgrimage object.
```

## Arrays

```js
const skills = ["DNS", "DHCP", "Active Directory"];
```

An array is a list.

## Loops

```js
for (const skill of skills) {
  console.log(skill);
}
```

This means:

```text
For each skill in the skills array,
print the skill.
```

In your project:

```js
for (const pilgrimage of data) {
  track.append(createPilgrimageCard(pilgrimage));
}
```

This means:

```text
For each pilgrimage object in the JSON data,
create a card,
append the card to the track.
```

## Functions

A function is a reusable action.

```js
function sayHello(name) {
  return `Hello ${name}`;
}
```

Call it:

```js
sayHello("Andrei");
```

In your project:

```js
function createRoadmapCard(phase) {
  const card = document.createElement("article");
  return card;
}
```

This means:

```text
Define a function that creates a roadmap card.
```

## DOM Creation

```js
const card = document.createElement("article");
card.className = "pilgrimage-card";
card.textContent = "Windows Infrastructure";
```

This creates:

```html
<article class="pilgrimage-card">Windows Infrastructure</article>
```

## Events

```js
button.addEventListener("click", () => {
  console.log("Clicked");
});
```

This means:

```text
When the button is clicked, run this code.
```

Your expand buttons use this idea.

---

# 7. JSON From Zero

JSON is a data format.

JSON looks like JavaScript objects, but it is stricter.

Example:

```json
{
  "id": "windows-infrastructure",
  "title": "Windows Infrastructure",
  "techStack": ["Windows Server", "DNS", "DHCP"]
}
```

Rules:

```text
Keys use double quotes.
Strings use double quotes.
No comments.
No trailing commas.
```

Good:

```json
{
  "title": "Roadmap"
}
```

Bad:

```json
{
  title: "Roadmap",
}
```

Your JSON files are:

```text
pilgrimages.json = main technical pillars
roadmap.json = phased roadmap
requirements.json = prerequisites
settings.json = section configuration
```

## Safe JSON Changes

You can safely change values:

```json
{
  "title": "Weekly Habits"
}
```

to:

```json
{
  "title": "Monthly Routine"
}
```

The key is still `title`, so the code still knows where to look.

## Unsafe JSON Changes

This can break things:

```json
{
  "heading": "Monthly Routine"
}
```

Why?

Because the code expects:

```js
section.title
```

It does not know that `heading` means the same thing.

That is why the project has a data contract in:

```text
docs/data-contract.md
```

---

# 8. NPM And Vite From Zero

NPM is the Node package manager.

It helps you:

```text
install tools
run scripts
manage dependencies
```

Vite is the local development/build tool.

It gives you:

```text
local dev server
fast browser refresh
production build
preview server
```

Important files:

```text
package.json
package-lock.json
node_modules/
vite.config.js
```

## package.json

This file describes the project.

Example:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "check": "npm run check:data && npm run build"
  }
}
```

When you run:

```bash
npm run dev
```

NPM looks inside `package.json`, finds `"dev"`, and runs:

```bash
vite
```

## Common Commands

Install dependencies:

```bash
npm install
```

Run local server:

```bash
npm run dev
```

Build the production site:

```bash
npm run build
```

Validate data and build:

```bash
npm run check
```

On Windows PowerShell, if scripts are blocked:

```bash
npm.cmd run check
```

In Git Bash:

```bash
npm run check
```

---

# 9. Your Project Structure

This is the project structure again, with meaning:

```text
src/main.js
```

The app entry point. It starts everything.

```text
src/components/dashboardShell.js
```

Builds the main dashboard shell: header, workspace, sidebar.

```text
src/components/pilgrimageCards.js
```

Builds pilgrimage cards from `pilgrimages.json`.

```text
src/components/roadmapRail.js
```

Builds roadmap phase cards from `roadmap.json`.

```text
src/components/requirementsPanel.js
```

Builds expandable requirement groups from `requirements.json`.

```text
src/config/sectionRegistry.js
```

Connects section IDs to renderers.

```text
src/utils/loadJSON.js
```

Loads JSON files.

```text
src/styles.css
```

Controls the whole visual design.

```text
scripts/validate-data.mjs
```

Checks that JSON data follows the expected structure.

```text
.github/workflows/deploy-pages.yml
```

GitHub Actions workflow for checking, building, and deploying.

---

# 10. How The App Starts

Open:

```text
src/main.js
```

The first important line:

```js
const app = document.querySelector("#app");
```

Meaning:

```text
Find <main id="app"></main>.
Store it in app.
```

Then:

```js
if (!app) {
  throw new Error("App mount element was not found.");
}
```

Meaning:

```text
If the page does not have #app, stop and show an error.
```

This is defensive programming.

Then:

```js
const dataSources = {
  pilgrimages: new URL("./data/pilgrimages.json", import.meta.url),
  requirements: new URL("./data/requirements.json", import.meta.url),
  roadmap: new URL("./data/roadmap.json", import.meta.url),
};
```

Meaning:

```text
Create a lookup object for data files.
```

The key `pilgrimages` points to the pilgrimages JSON file.

The key `roadmap` points to the roadmap JSON file.

The key `requirements` points to the requirements JSON file.

Then:

```js
const appState = {
  expandedIds: new Set(),
  expandedRoadmapIds: new Set(),
  expansionMode: "single",
  focusedWorkspaceSection: null,
};
```

This stores interactive state.

State means:

```text
The current condition of the app.
```

Examples:

```text
Which pilgrimage card is expanded?
Which roadmap phase is expanded?
Is the workspace focused on pilgrimages or roadmap?
```

---

# 11. The Section Registry

Open:

```text
src/config/sectionRegistry.js
```

You will see something like:

```js
export const sectionRegistry = {
  pilgrimages: {
    dataKey: "pilgrimages",
    render: renderPilgrimageRail,
  },
  requirements: {
    dataKey: "requirements",
    render: renderRequirementsPanel,
  },
  roadmap: {
    dataKey: "roadmap",
    render: renderRoadmapRail,
  },
};
```

This is a map.

It says:

```text
If settings.json says "pilgrimages",
load the pilgrimages data,
then render it with renderPilgrimageRail.
```

This is what makes the app modular.

Without the registry, `main.js` would need hardcoded logic for every section.

With the registry, `main.js` can say:

```text
For each enabled section,
look up its renderer,
load its data,
render it.
```

---

# 12. Components

A component is a function that creates part of the page.

In this project, a component is not React. It is just a JavaScript function that
returns DOM elements.

Example:

```js
export function renderRoadmapRail({ data, state = {}, callbacks = {} }) {
  const section = document.createElement("section");
  return section;
}
```

This means:

```text
Create a function that builds a roadmap section.
Return the finished section.
```

## Pilgrimage Cards

`pilgrimageCards.js` creates cards from this data:

```json
{
  "id": "windows-infrastructure",
  "title": "Windows Infrastructure",
  "subtitle": "Windows Server, identity, networking...",
  "techStack": ["Windows Server", "DNS", "DHCP"]
}
```

The renderer creates:

```text
article.pilgrimage-card
  header
    h3
    button
  subtitle
  meta
  details
```

## Roadmap Rail

`roadmapRail.js` creates cards from:

```json
{
  "id": "phase-1",
  "phase": "Phase 1",
  "timeframe": "0-3 months",
  "mainFocus": "Windows infrastructure foundations and Git discipline."
}
```

## Requirements Panel

`requirementsPanel.js` creates expandable groups using native HTML:

```html
<details>
  <summary>Hardware</summary>
  ...
</details>
```

The browser already knows how to expand and collapse `details`.

That is why this panel needs less custom JavaScript.

---

# 13. State And Expand/Collapse Behavior

State tracks what is currently happening.

In `main.js`:

```js
const appState = {
  expandedIds: new Set(),
  expandedRoadmapIds: new Set(),
  expansionMode: "single",
  focusedWorkspaceSection: null,
};
```

`expandedIds` stores expanded pilgrimage IDs.

`expandedRoadmapIds` stores expanded roadmap phase IDs.

`focusedWorkspaceSection` stores:

```text
null
"pilgrimages"
"roadmap"
```

When you click a pilgrimage expand button:

```js
onTogglePilgrimage: (pilgrimageId) => {
  toggleExpandedId(pilgrimageId);
  renderSections({ sections, dataByKey, settings });
}
```

This means:

```text
Update state.
Rerender the sections.
```

This project uses a simple rerender model.

Instead of surgically changing one card, it clears the regions and recreates the
sections from the current state.

That is simpler to understand while learning.

---

# 14. Layout And The Focused Rail

The focused rail behavior uses this idea:

```text
JS writes state into the DOM.
CSS reacts to that state.
```

In `main.js`:

```js
dashboard.regions.workspace.dataset.focusMode = getWorkspaceFocusMode();
```

This creates HTML like:

```html
<section class="app-region app-region--workspace" data-focus-mode="roadmap">
```

Then CSS can say:

```css
.app-region--workspace[data-focus-mode="roadmap"] .pilgrimage-rail {
  display: none;
}
```

Meaning:

```text
When roadmap is focused, hide pilgrimage rail.
```

And:

```css
.app-region--workspace[data-focus-mode="pilgrimages"] .roadmap-rail {
  display: none;
}
```

Meaning:

```text
When pilgrimages are focused, hide roadmap.
```

This is a good separation:

```text
main.js decides which mode the app is in.
styles.css decides what that mode looks like.
```

## Columns To Rows

Originally, expanded pilgrimage card details used columns:

```css
.pilgrimage-card.is-expanded .pilgrimage-card__details {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
```

That means:

```text
Make 3 equal columns.
```

To make rows:

```css
.pilgrimage-card.is-expanded .pilgrimage-card__details {
  grid-template-columns: 1fr;
}
```

That means:

```text
Make 1 column.
The blocks naturally stack vertically.
```

---

# 15. Data Contracts

A data contract is an agreement between JSON and JavaScript.

Example:

```json
{
  "title": "Windows Infrastructure"
}
```

The JavaScript expects:

```js
pilgrimage.title
```

So the contract is:

```text
Every pilgrimage should have a title field.
```

You can change the value:

```json
{
  "title": "Windows Admin"
}
```

But if you rename the key:

```json
{
  "heading": "Windows Admin"
}
```

Then this code no longer works:

```js
pilgrimage.title
```

That is why `docs/data-contract.md` exists.

The validator also checks the contract.

---

# 16. Validation

The project includes:

```text
scripts/validate-data.mjs
```

This script checks your JSON data.

Run it:

```bash
npm run check:data
```

If data is valid:

```text
Data validation passed.
```

If data is invalid, it prints errors.

Example:

```text
roadmap[0].mainFocus must be a non-empty string.
```

That tells you:

```text
Open roadmap.json.
Find the first roadmap item.
Fix mainFocus.
```

The full check is:

```bash
npm run check
```

That runs:

```text
data validation
production build
```

Run it before committing important changes.

---

# 17. Git From Zero

Git tracks changes to your files.

Think of Git as a checkpoint system.

Common command:

```bash
git status
```

Meaning:

```text
Show what has changed.
```

Example output:

```text
 M src/styles.css
```

Meaning:

```text
styles.css has been modified.
```

## Review Changes

```bash
git diff
```

Meaning:

```text
Show exactly what changed.
```

## Stage Changes

```bash
git add src/styles.css
```

Meaning:

```text
Prepare this file for the next commit.
```

Stage everything:

```bash
git add -A
```

## Commit

```bash
git commit -m "Make expanded rails take over workspace"
```

Meaning:

```text
Save a checkpoint with this message.
```

## Log

```bash
git log --oneline --decorate -5
```

Meaning:

```text
Show the last 5 commits.
```

## The Basic Workflow

```bash
git status
npm run check
git add -A
git commit -m "Describe the change"
git push
```

## Commit vs Push

`git commit` saves locally.

`git push` uploads commits to GitHub.

If you commit but do not push, another device cannot see the commit yet.

---

# 18. GitHub From Zero

GitHub is an online host for Git repositories.

Your local repo lives on your computer.

GitHub stores a remote copy.

The remote is usually called:

```text
origin
```

See remotes:

```bash
git remote -v
```

Push commits:

```bash
git push
```

Pull commits:

```bash
git pull
```

Clone on another computer:

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

GitHub also gives you:

```text
Issues
Pull requests
Actions
Projects
Releases
Pages
Security alerts
```

For now, focus on:

```text
Code
Actions
Settings
Pages
```

---

# 19. CI/CD From Zero

CI means Continuous Integration.

It answers:

```text
Does the project still work after this change?
```

CD means Continuous Deployment or Continuous Delivery.

It answers:

```text
Can this project be automatically published?
```

Your workflow is:

```text
.github/workflows/deploy-pages.yml
```

It runs after a push to `main`.

Simplified:

```text
push to main
  -> GitHub starts workflow
  -> install dependencies
  -> validate JSON
  -> build site
  -> upload dist
  -> deploy
```

In YAML:

```yaml
on:
  push:
    branches:
      - main
```

Meaning:

```text
Run this workflow when main receives a push.
```

Install dependencies:

```yaml
- name: Install dependencies
  run: npm ci
```

Validate data:

```yaml
- name: Validate data files
  run: npm run check:data
```

Build:

```yaml
- name: Build site
  run: npm run build
```

CI/CD is not magic. It is just commands running on a GitHub machine.

---

# 20. GitHub Pages And The Paywall

GitHub Pages hosts static websites.

Static means:

```text
HTML
CSS
JavaScript
images
JSON files
```

No server database is required for this project.

The issue you hit:

```text
Private repo + GitHub Pages + free plan = blocked
```

Your options:

```text
Make repo public
Pay for a plan that supports private repo Pages
Use another host such as Cloudflare Pages, Netlify, or Vercel
Keep the repo private and run CI only, without deployment
```

For a portfolio project, public is usually fine after checking for secrets.

Before making a repository public, check:

```text
No passwords
No API keys
No tenant IDs you care about hiding
No private screenshots
No private personal notes
No generated files you do not want public
```

---

# 21. Debugging

Debugging means finding and fixing problems.

Common places to look:

```text
Terminal output
Browser console
GitHub Actions logs
git diff
JSON syntax
Import paths
File names
```

## Vite Import Error

Example:

```text
Failed to resolve import "./components/pilgrimageCard.js"
```

Cause:

```text
The code imports a file name that does not exist.
```

Maybe the real file is:

```text
pilgrimageCards.js
```

Fix:

```js
import { createPilgrimageCard } from "./components/pilgrimageCards.js";
```

## JSON Error

Example bad JSON:

```json
{
  "title": "Roadmap",
}
```

The trailing comma is invalid.

Fix:

```json
{
  "title": "Roadmap"
}
```

## Build Locally Before Push

Use:

```bash
npm run check
```

If it fails locally, it will probably fail in GitHub Actions too.

Fix local problems before pushing.

---

# 22. How To Add A Feature

Use this process for every feature.

## Step 1: Say The Goal

Example:

```text
I want to add a search box that filters pilgrimage cards.
```

## Step 2: Find The Data

Search data files:

```text
src/data/pilgrimages.json
```

Ask:

```text
What data does this feature need?
```

## Step 3: Find The Renderer

For pilgrimage cards:

```text
src/components/pilgrimageCards.js
```

Ask:

```text
Where is the visible HTML created?
```

## Step 4: Find The State

For interactive behavior:

```text
src/main.js
```

Ask:

```text
Does the app need to remember something?
```

For search, it might need:

```js
searchTerm: ""
```

## Step 5: Add CSS

For appearance:

```text
src/styles.css
```

Ask:

```text
What should this look like?
```

## Step 6: Validate

```bash
npm run check
```

## Step 7: Commit

```bash
git status
git diff
git add -A
git commit -m "Add pilgrimage search"
```

---

# 23. Practice Exercises

Do these slowly. The goal is learning, not speed.

## Exercise 1: Change Text

Open:

```text
src/data/settings.json
```

Change nothing yet. Just read it.

Then open:

```text
src/components/pilgrimageCards.js
```

Find:

```js
heading.textContent = "Pilgrimage Rail";
```

Change it to:

```js
heading.textContent = "Learning Rail";
```

Run:

```bash
npm run check
```

Commit:

```bash
git add src/components/pilgrimageCards.js
git commit -m "Rename pilgrimage rail heading"
```

Lesson:

```text
Visible text can come from JavaScript, not only HTML.
```

## Exercise 2: Add A Requirement

Open:

```text
src/data/requirements.json
```

Add a new item under Software:

```json
{
  "name": "Browser DevTools",
  "detail": "Used to inspect HTML, CSS, console errors, network requests, and layout issues."
}
```

Run:

```bash
npm run check:data
```

Lesson:

```text
JSON content changes can update the UI without editing component code.
```

## Exercise 3: Break JSON On Purpose

Make a temporary bad edit:

```json
{
  "title": "Broken",
}
```

Run:

```bash
npm run check:data
```

Observe the error.

Undo the bad edit.

Lesson:

```text
Validation is there to catch mistakes early.
```

## Exercise 4: CSS Selector Practice

Open:

```text
src/styles.css
```

Find:

```css
.roadmap-card {
```

Add:

```css
outline-offset: -1px;
```

Look at the page. Then remove it.

Lesson:

```text
CSS selectors target matching elements.
```

## Exercise 5: Git Practice

Run:

```bash
git status
git log --oneline --decorate -5
```

Explain out loud:

```text
What branch am I on?
Are there uncommitted changes?
What are the last commits?
```

Lesson:

```text
Git status tells you where you are before you move.
```

---

# 24. Glossary

## App

The website/application you are building.

## Attribute

Extra information on an HTML element.

Example:

```html
<main id="app"></main>
```

## Build

The production version of the site generated by Vite.

## CI

Continuous Integration. Automated checks after code changes.

## CD

Continuous Deployment or Delivery. Automated publishing after checks pass.

## Class

An HTML attribute used heavily by CSS.

Example:

```html
<article class="roadmap-card"></article>
```

## Commit

A saved checkpoint in Git.

## Component

A reusable function that builds part of the page.

## CSS

Language used for layout and visual styling.

## Data Contract

The expected shape of your JSON data.

## DOM

The browser's live representation of the page.

## Git

Version control tool on your computer.

## GitHub

Online hosting service for Git repositories.

## HTML

Language used for page structure.

## JavaScript

Programming language used for behavior and DOM creation.

## JSON

Data format used for the roadmap content.

## NPM

Node package manager. Used to install dependencies and run scripts.

## Push

Upload local commits to GitHub.

## Pull

Download remote commits from GitHub.

## Renderer

A function that turns data into DOM elements.

## Repository

A Git-tracked project folder.

## State

The current condition of the app.

Example:

```text
roadmap card phase-1 is expanded
```

## Vite

Development and build tool for the website.

---

# Final Study Plan

Use this order:

```text
Day 1: HTML, CSS, and index.html
Day 2: JSON and data files
Day 3: main.js startup flow
Day 4: sectionRegistry.js and modular rendering
Day 5: pilgrimageCards.js
Day 6: roadmapRail.js
Day 7: requirementsPanel.js
Day 8: styles.css layout
Day 9: Git basics
Day 10: GitHub Actions and deployment
```

For each day:

```text
Read the chapter
Open the file
Make one tiny change
Run npm run check
Commit if it is useful
Write one note in your own words
```

The real milestone is not "I understand everything".

The real milestone is:

```text
I can find the right file.
I can make a small change.
I can run the checks.
I can read the error.
I can commit the result.
I can explain what changed.
```

That is how you become independent.
