# Data Contract

This project is JSON-driven. That means most content changes should happen in
`src/data/*.json`, while JavaScript files define how that content is rendered.

The important rule is simple:

- You can freely change values.
- You can usually add, remove, or reorder array items.
- You should not rename structural keys unless you also update the renderer and validator.

For example, this is safe:

```json
{
  "title": "Weekly Habits",
  "items": ["Make three Git commits per week"]
}
```

Changing `"Weekly Habits"` to `"Monthly Routine"` is safe because it is content.

This is not safe by itself:

```json
{
  "heading": "Monthly Routine"
}
```

The renderer expects the key to be called `title`. If you rename `title` to
`heading`, the JavaScript and validator need to be updated too.

## settings.json

`settings.json` controls which sections appear and where they appear.

```json
{
  "id": "roadmap",
  "enabled": true,
  "region": "workspace",
  "order": 2
}
```

Fields:

- `id`: Must match a key in `src/config/sectionRegistry.js`.
- `enabled`: `true` shows the section, `false` hides it.
- `region`: Either `workspace` or `sidebar`.
- `order`: Lower numbers render first inside the same region.

Safe changes:

- Disable a section by setting `enabled` to `false`.
- Move a section by changing `region`.
- Reorder sections by changing `order`.

Unsafe without code changes:

- Renaming `id` to a value that does not exist in `sectionRegistry.js`.
- Adding a new section without registering a renderer.

## pilgrimages.json

Each item creates one card in the Pilgrimage Rail.

Main fields:

- `id`: Stable identifier used for expand and collapse state.
- `title`: Card heading.
- `subtitle`: Short summary shown while collapsed.
- `difficulty`: Metadata text.
- `estimatedTime`: Metadata text.
- `techStack`: Array of tools or concepts.
- `learningPath`: Array of learning phases.
- `project`: Main practical project for that pilgrimage.

Learning path shape:

```json
{
  "phase": "Foundation",
  "items": ["DNS basics", "DHCP basics"]
}
```

Project shape:

```json
{
  "name": "Mini Enterprise Environment",
  "description": "Build a small Windows lab.",
  "features": ["Active Directory domain", "Group Policy objects"]
}
```

The project renderer is flexible: any extra project field whose value is an
array becomes a list block. For example, `features`, `services`, `commands`,
`deliverables`, and `workflow` can all render without new JavaScript.

## roadmap.json

Each item creates one roadmap phase card.

Main fields:

- `id`: Stable identifier used for expand and collapse state.
- `phase`: Card heading.
- `timeframe`: Time range shown under the heading.
- `mainFocus`: Short summary shown while collapsed.
- `skills`: Array of skill names.
- `projects`: Array of project names.
- `outcome`: Summary of what you should be able to do by the end.
- `detailSections`: Flexible extra sections.

Flexible detail section shape:

```json
{
  "title": "Weekly Habits",
  "items": [
    "Make at least three Git commits per week",
    "Document every lab change in Markdown"
  ]
}
```

Safe changes:

- Rename `Weekly Habits` to another title.
- Add a new detail section.
- Remove a detail section.
- Reorder roadmap phases.

Unsafe without code changes:

- Renaming `mainFocus` to `summary`.
- Renaming `detailSections` to `details`.
- Replacing `items` with another key name.

## requirements.json

Each item creates one expandable requirement group in the sidebar.

Group fields:

- `id`: Stable identifier for the group.
- `title`: Requirement group heading.
- `description`: Short group summary.
- `items`: Requirement entries.

Item shape:

```json
{
  "name": "Node.js",
  "detail": "Required for Vite, local development, and production builds."
}
```

Safe changes:

- Add or remove requirement groups.
- Add or remove items inside a group.
- Reorder groups and items.
- Change the visible text.

## Validation

Run this before committing data changes:

```bash
npm run check:data
```

Run the full local check before pushing:

```bash
npm run check
```

`check:data` validates JSON structure. `check` validates the data and then runs
the production build.
