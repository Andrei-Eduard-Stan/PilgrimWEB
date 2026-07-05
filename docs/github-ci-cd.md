# GitHub, CI, CD, and Publishing

This project is designed to be developed locally, saved with Git, pushed to
GitHub, checked by GitHub Actions, and published with GitHub Pages.

## Vocabulary

- Git: The tool on your computer that tracks file changes.
- GitHub: The website that stores a copy of your Git repository online.
- Commit: A saved checkpoint in Git.
- Push: Sending local commits to GitHub.
- Pull: Downloading commits from GitHub to your computer.
- CI: Continuous Integration. Automated checks that run after code is pushed.
- CD: Continuous Deployment or Delivery. Automated publishing after checks pass.
- Workflow: A GitHub Actions YAML file that defines automation.
- Runner: A temporary machine GitHub uses to run the workflow.
- Artifact: A generated output, such as the built `dist/` website.

## Local Daily Workflow

Check what changed:

```bash
git status
```

Review the actual edits:

```bash
git diff
```

Run checks:

```bash
npm run check
```

Stage the files:

```bash
git add -A
```

Commit the checkpoint:

```bash
git commit -m "Describe the completed change"
```

Push to GitHub:

```bash
git push
```

## First Push to GitHub

If the GitHub repository does not exist yet, create an empty repository on
GitHub first. Do not add a README there if you already have one locally.

Then connect your local repository to it:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

Push the local `main` branch:

```bash
git push -u origin main
```

After this first push, future pushes can usually be:

```bash
git push
```

## Current Deployment Workflow

The project has this workflow:

```text
.github/workflows/deploy-pages.yml
```

It runs when you push to `main`.

The workflow does this:

```text
checkout repository
setup Node.js
install dependencies with npm ci
validate JSON data with npm run check:data
build the Vite site with npm run build
upload dist/ as a Pages artifact
deploy the artifact to GitHub Pages
```

## Why npm ci Is Used in CI

Locally, you normally use:

```bash
npm install
```

In GitHub Actions, the workflow uses:

```bash
npm ci
```

`npm ci` installs exactly what is recorded in `package-lock.json`. That makes
the CI build more repeatable.

## GitHub Pages Setup

For this deployment style, configure the repository like this:

```text
Settings
Pages
Build and deployment
Source: GitHub Actions
```

The workflow will publish the contents of `dist/`.

## Vite Base Path

Because GitHub Pages project sites are usually served from a repository path,
`vite.config.js` includes:

```js
export default {
  base: "/PilgrimWEB/",
};
```

If the repository name changes, this path must change too.

Examples:

```text
Repository: PilgrimWEB
base: "/PilgrimWEB/"

Repository: infrastructure-roadmap
base: "/infrastructure-roadmap/"
```

## Reading a Failed Workflow

On GitHub:

```text
Repository
Actions
Failed workflow run
Failed job
Failed step
```

Common failures:

- `npm ci` fails: dependencies or lockfile problem.
- `npm run check:data` fails: JSON contract problem.
- `npm run build` fails: JavaScript, import, or Vite build problem.
- Deploy fails: GitHub Pages settings or permissions problem.

## What Good Looks Like

A healthy change looks like this:

```text
local edit
local npm run check passes
git commit
git push
GitHub Actions passes
GitHub Pages updates
```

That is the basic CI/CD loop.
