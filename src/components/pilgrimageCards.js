function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function getText(value, fallback) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function appendIfPresent(parent, child) {
  if (child) {
    parent.append(child);
  }
}

function createListBlock(titleText, items) {
  const safeItems = toArray(items).filter(Boolean);

  if (safeItems.length === 0) {
    return null;
  }

  const block = document.createElement("section");
  const title = document.createElement("h4");
  const list = document.createElement("ul");

  block.className = "pilgrimage-card__detail-block";
  title.textContent = titleText;

  for (const item of safeItems) {
    const listItem = document.createElement("li");

    listItem.textContent = item;
    list.append(listItem);
  }

  block.append(title, list);

  return block;
}

function createLearningPathBlock(learningPath) {
  const safeLearningPath = toArray(learningPath);

  if (safeLearningPath.length === 0) {
    return null;
  }

  const block = document.createElement("section");
  const title = document.createElement("h4");

  block.className = "pilgrimage-card__detail-block";
  title.textContent = "Learning Plan";

  block.append(title);

  for (const phase of safeLearningPath) {
    const safePhase = isObject(phase) ? phase : {};
    const phaseItems = toArray(safePhase.items).filter(Boolean);

    if (phaseItems.length === 0) {
      continue;
    }

    const phaseTitle = document.createElement("p");
    const phaseList = document.createElement("ul");

    phaseTitle.className = "pilgrimage-card__phase-title";
    phaseTitle.textContent = getText(safePhase.phase, "Phase");

    for (const item of phaseItems) {
      const listItem = document.createElement("li");

      listItem.textContent = item;
      phaseList.append(listItem);
    }

    block.append(phaseTitle, phaseList);
  }

  if (block.childElementCount === 1) {
    return null;
  }

  return block;
}

function formatLabel(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function createProjectBlock(project) {
  if (!isObject(project)) {
    return null;
  }

  const block = document.createElement("section");
  const title = document.createElement("h4");
  const name = document.createElement("p");
  const description = document.createElement("p");

  block.className = "pilgrimage-card__detail-block";
  title.textContent = "Project Plan";
  name.textContent = getText(project.name, "Project");
  description.textContent = getText(project.description, "No project description provided.");

  block.append(title, name, description);

  for (const [key, value] of Object.entries(project)) {
    if (key === "name" || key === "description" || !Array.isArray(value)) {
      continue;
    }

    appendIfPresent(block, createListBlock(formatLabel(key), value));
  }

  return block;
}

export function createPilgrimageCard(
  pilgrimage,
  { index = 0, isExpanded = false, onToggle } = {},
) {
  const safePilgrimage = isObject(pilgrimage) ? pilgrimage : {};
  const card = document.createElement("article");
  const header = document.createElement("div");
  const title = document.createElement("h3");
  const subtitle = document.createElement("p");
  const meta = document.createElement("p");
  const toggleButton = document.createElement("button");
  const details = document.createElement("div");
  const pilgrimageId = getText(safePilgrimage.id, `pilgrimage-${index + 1}`);
  const detailsId = `${pilgrimageId}-details`;

  card.className = isExpanded ? "pilgrimage-card is-expanded" : "pilgrimage-card";
  card.dataset.pilgrimageId = pilgrimageId;

  header.className = "pilgrimage-card__header";
  title.textContent = getText(safePilgrimage.title, "Untitled Pilgrimage");

  toggleButton.className = "pilgrimage-card__toggle";
  toggleButton.type = "button";
  toggleButton.textContent = isExpanded ? "Collapse" : "Expand";
  toggleButton.setAttribute("aria-expanded", String(isExpanded));
  toggleButton.setAttribute("aria-controls", detailsId);
  toggleButton.addEventListener("click", () => {
    onToggle?.(pilgrimageId);
  });

  subtitle.className = "pilgrimage-card__subtitle";
  subtitle.textContent = getText(safePilgrimage.subtitle, "No summary provided.");

  meta.className = "pilgrimage-card__meta";
  meta.textContent = [safePilgrimage.difficulty, safePilgrimage.estimatedTime]
    .filter(Boolean)
    .join(" / ");

  details.id = detailsId;
  details.className = "pilgrimage-card__details";
  details.hidden = !isExpanded;

  appendIfPresent(details, createListBlock("Focus Areas", safePilgrimage.techStack));
  appendIfPresent(details, createLearningPathBlock(safePilgrimage.learningPath));
  appendIfPresent(details, createProjectBlock(safePilgrimage.project));

  if (details.childElementCount === 0) {
    toggleButton.hidden = true;
    details.hidden = true;
  }

  header.append(title, toggleButton);
  card.append(header, subtitle);

  if (meta.textContent) {
    card.append(meta);
  }

  card.append(details);

  return card;
}

export function renderPilgrimageRail({ data, state = {}, callbacks = {} }) {
  if (!Array.isArray(data)) {
    throw new TypeError("Pilgrimage data must be an array.");
  }

  const section = document.createElement("section");
  const heading = document.createElement("h2");
  const track = document.createElement("div");

  section.className = "dashboard-section pilgrimage-rail";
  section.dataset.sectionId = "pilgrimages";
  section.setAttribute("aria-labelledby", "pilgrimages-heading");

  heading.id = "pilgrimages-heading";
  heading.textContent = "Learning Topics";

  track.className = "pilgrimage-rail__track";

  for (const [index, pilgrimage] of data.entries()) {
    const safePilgrimage = isObject(pilgrimage) ? pilgrimage : {};
    const pilgrimageId = getText(safePilgrimage.id, `pilgrimage-${index + 1}`);

    track.append(
      createPilgrimageCard(safePilgrimage, {
        index,
        isExpanded: state.expandedIds?.has(pilgrimageId) ?? false,
        onToggle: callbacks.onTogglePilgrimage,
      }),
    );
  }

  section.append(heading, track);

  return section;
}
