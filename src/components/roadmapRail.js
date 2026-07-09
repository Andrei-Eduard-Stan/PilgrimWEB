function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function getText(value, fallback) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function createListBlock(titleText, items) {
  const safeItems = toArray(items).filter(Boolean);

  if (safeItems.length === 0) {
    return null;
  }

  const block = document.createElement("section");
  const title = document.createElement("h4");
  const list = document.createElement("ul");

  block.className = "roadmap-card__detail-block";
  title.textContent = titleText;

  for (const item of safeItems) {
    const listItem = document.createElement("li");

    listItem.textContent = item;
    list.append(listItem);
  }

  block.append(title, list);

  return block;
}

function appendDetailSection(details, title, items) {
  const listBlock = createListBlock(title, items);

  if (!title || !listBlock) {
    return;
  }

  details.append(listBlock);
}

function createRoadmapCard(phase, { index = 0, isExpanded = false, onToggle } = {}) {
  const safePhase = isObject(phase) ? phase : {};
  const card = document.createElement("article");
  const header = document.createElement("div");
  const title = document.createElement("h3");
  const toggleButton = document.createElement("button");
  const timeframe = document.createElement("p");
  const focus = document.createElement("p");
  const details = document.createElement("div");
  const phaseId = getText(safePhase.id, `phase-${index + 1}`);
  const detailsId = `${phaseId}-details`;

  card.className = isExpanded ? "roadmap-card is-expanded" : "roadmap-card";
  card.dataset.phaseId = phaseId;

  header.className = "roadmap-card__header";

  title.textContent = getText(safePhase.phase, `Phase ${index + 1}`);

  toggleButton.className = "roadmap-card__toggle";
  toggleButton.type = "button";
  toggleButton.textContent = isExpanded ? "Collapse" : "Expand";
  toggleButton.setAttribute("aria-expanded", String(isExpanded));
  toggleButton.setAttribute("aria-controls", detailsId);
  toggleButton.addEventListener("click", () => {
    onToggle?.(phaseId);
  });

  timeframe.className = "roadmap-card__timeframe";
  timeframe.textContent = getText(safePhase.timeframe, "Timeframe not set");

  focus.className = "roadmap-card__focus";
  focus.textContent = getText(safePhase.mainFocus, "No focus summary provided.");

  details.id = detailsId;
  details.className = "roadmap-card__details";
  details.hidden = !isExpanded;

  appendDetailSection(details, "Skills", safePhase.skills);
  appendDetailSection(details, "Projects", safePhase.projects);
  appendDetailSection(details, "Outcome", safePhase.outcome ? [safePhase.outcome] : []);

  for (const detailSection of toArray(safePhase.detailSections)) {
    const safeSection = isObject(detailSection) ? detailSection : {};

    appendDetailSection(details, safeSection.title, safeSection.items);
  }

  if (details.childElementCount === 0) {
    toggleButton.hidden = true;
    details.hidden = true;
  }

  header.append(title, toggleButton);
  card.append(header, timeframe, focus, details);

  return card;
}

export function renderRoadmapRail({ data, state = {}, callbacks = {} }) {
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
  heading.textContent = "Roadmap Phases";

  track.className = "roadmap-rail__track";

  for (const [index, phase] of data.entries()) {
    const safePhase = isObject(phase) ? phase : {};
    const phaseId = getText(safePhase.id, `phase-${index + 1}`);

    track.append(
      createRoadmapCard(safePhase, {
        index,
        isExpanded: state.expandedRoadmapIds?.has(phaseId) ?? false,
        onToggle: callbacks.onToggleRoadmapPhase,
      }),
    );
  }

  section.append(heading, track);

  return section;
}
