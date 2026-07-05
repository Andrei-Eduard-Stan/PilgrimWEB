function createListBlock(titleText, items) {
  const block = document.createElement("section");
  const title = document.createElement("h4");
  const list = document.createElement("ul");

  block.className = "roadmap-card__detail-block";
  title.textContent = titleText;

  for (const item of items) {
    const listItem = document.createElement("li");

    listItem.textContent = item;
    list.append(listItem);
  }

  block.append(title, list);

  return block;
}

function appendDetailSection(details, title, items) {
  if (!title || !Array.isArray(items) || items.length === 0) {
    return;
  }

  details.append(createListBlock(title, items));
}

function createRoadmapCard(phase, { isExpanded = false, onToggle } = {}) {
  const card = document.createElement("article");
  const header = document.createElement("div");
  const title = document.createElement("h3");
  const toggleButton = document.createElement("button");
  const timeframe = document.createElement("p");
  const focus = document.createElement("p");
  const details = document.createElement("div");
  const detailsId = `${phase.id}-details`;

  card.className = isExpanded ? "roadmap-card is-expanded" : "roadmap-card";
  card.dataset.phaseId = phase.id;

  header.className = "roadmap-card__header";

  title.textContent = phase.phase;

  toggleButton.className = "roadmap-card__toggle";
  toggleButton.type = "button";
  toggleButton.textContent = isExpanded ? "Collapse" : "Expand";
  toggleButton.setAttribute("aria-expanded", String(isExpanded));
  toggleButton.setAttribute("aria-controls", detailsId);
  toggleButton.addEventListener("click", () => {
    onToggle?.(phase.id);
  });

  timeframe.className = "roadmap-card__timeframe";
  timeframe.textContent = phase.timeframe;

  focus.className = "roadmap-card__focus";
  focus.textContent = phase.mainFocus;

  details.id = detailsId;
  details.className = "roadmap-card__details";
  details.hidden = !isExpanded;

  appendDetailSection(details, "Skills", phase.skills);
  appendDetailSection(details, "Projects", phase.projects);
  appendDetailSection(details, "Outcome", phase.outcome ? [phase.outcome] : []);

  for (const detailSection of phase.detailSections ?? []) {
    appendDetailSection(details, detailSection.title, detailSection.items);
  }

  header.append(title, toggleButton);
  card.append(header, timeframe, focus, details);

  return card;
}

export function renderRoadmapRail({ data, state, callbacks }) {
  if (!Array.isArray(data)) {
    throw new TypeError("Roadmap data must be an array.");
  }

  const section = document.createElement("section");
  const heading = document.createElement("h2");
  const track = document.createElement("div");

  section.className = "dashboard-section roadmap-rail";
  section.dataset.sectionId = "roadmap";
  section.setAttribute("aria-labelledby", "roadmap-heading");

  heading.id = "roadmap-heading";
  heading.textContent = "Roadmap";

  track.className = "roadmap-rail__track";

  for (const phase of data) {
    track.append(
      createRoadmapCard(phase, {
        isExpanded: state.expandedRoadmapIds.has(phase.id),
        onToggle: callbacks.onToggleRoadmapPhase,
      }),
    );
  }

  section.append(heading, track);

  return section;
}
