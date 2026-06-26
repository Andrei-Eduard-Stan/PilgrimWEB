function createListBlock(titleText, items) {
  const block = document.createElement("section");
  const title = document.createElement("h4");
  const list = document.createElement("ul");

  block.className = "pilgrimage-card__detail-block";
  title.textContent = titleText;

  for (const item of items) {
    const listItem = document.createElement("li");

    listItem.textContent = item;
    list.append(listItem);
  }

  block.append(title, list);

  return block;
}

function createLearningPathBlock(learningPath) {
  const block = document.createElement("section");
  const title = document.createElement("h4");

  block.className = "pilgrimage-card__detail-block";
  title.textContent = "Learning Path";

  block.append(title);

  for (const phase of learningPath) {
    const phaseTitle = document.createElement("p");
    const phaseList = document.createElement("ul");

    phaseTitle.className = "pilgrimage-card__phase-title";
    phaseTitle.textContent = phase.phase;

    for (const item of phase.items) {
      const listItem = document.createElement("li");

      listItem.textContent = item;
      phaseList.append(listItem);
    }

    block.append(phaseTitle, phaseList);
  }

  return block;
}

function formatLabel(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function createProjectBlock(project) {
  const block = document.createElement("section");
  const title = document.createElement("h4");
  const name = document.createElement("p");
  const description = document.createElement("p");

  block.className = "pilgrimage-card__detail-block";
  title.textContent = "Project";
  name.textContent = project.name;
  description.textContent = project.description;

  block.append(title, name, description);

  for (const [key, value] of Object.entries(project)) {
    if (key === "name" || key === "description" || !Array.isArray(value)) {
      continue;
    }

    block.append(createListBlock(formatLabel(key), value));
  }

  return block;
}

export function createPilgrimageCard(
  pilgrimage,
  { isExpanded = false, onToggle } = {},
) {
  const card = document.createElement("article");
  const header = document.createElement("div");
  const title = document.createElement("h3");
  const subtitle = document.createElement("p");
  const meta = document.createElement("p");
  const toggleButton = document.createElement("button");
  const details = document.createElement("div");
  const detailsId = `${pilgrimage.id}-details`;

  card.className = isExpanded ? "pilgrimage-card is-expanded" : "pilgrimage-card";
  card.dataset.pilgrimageId = pilgrimage.id;

  header.className = "pilgrimage-card__header";
  title.textContent = pilgrimage.title;

  toggleButton.className = "pilgrimage-card__toggle";
  toggleButton.type = "button";
  toggleButton.textContent = isExpanded ? "Collapse" : "Expand";
  toggleButton.setAttribute("aria-expanded", String(isExpanded));
  toggleButton.setAttribute("aria-controls", detailsId);
  toggleButton.addEventListener("click", () => {
    onToggle?.(pilgrimage.id);
  });

  subtitle.className = "pilgrimage-card__subtitle";
  subtitle.textContent = pilgrimage.subtitle;

  meta.className = "pilgrimage-card__meta";
  meta.textContent = [pilgrimage.difficulty, pilgrimage.estimatedTime]
    .filter(Boolean)
    .join(" / ");

  details.id = detailsId;
  details.className = "pilgrimage-card__details";
  details.hidden = !isExpanded;

  if (pilgrimage.techStack?.length) {
    details.append(createListBlock("Tech Stack", pilgrimage.techStack));
  }

  if (pilgrimage.learningPath?.length) {
    details.append(createLearningPathBlock(pilgrimage.learningPath));
  }

  if (pilgrimage.project) {
    details.append(createProjectBlock(pilgrimage.project));
  }

  header.append(title, toggleButton);
  card.append(header, subtitle);

  if (meta.textContent) {
    card.append(meta);
  }

  card.append(details);

  return card;
}

export function renderPilgrimageRail({ data, state, callbacks }) {
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
  heading.textContent = "Pilgrimage Rail";

  track.className = "pilgrimage-rail__track";

  for (const pilgrimage of data) {
    track.append(
      createPilgrimageCard(pilgrimage, {
        isExpanded: state.expandedIds.has(pilgrimage.id),
        onToggle: callbacks.onTogglePilgrimage,
      }),
    );
  }

  section.append(heading, track);

  return section;
}
