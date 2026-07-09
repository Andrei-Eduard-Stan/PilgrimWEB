function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function createRequirementItem(item = {}) {
  const listItem = document.createElement("li");
  const name = document.createElement("strong");
  const detail = document.createElement("p");

  name.textContent = item.name ?? "Requirement";
  detail.textContent = item.detail ?? "";

  listItem.append(name, detail);

  return listItem;
}

function createRequirementGroup(group = {}, { isOpen = false } = {}) {
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  const title = document.createElement("span");
  const description = document.createElement("span");
  const list = document.createElement("ul");
  const items = toArray(group.items);

  details.className = "requirement-group";
  details.open = isOpen;
  title.className = "requirement-group__title";
  description.className = "requirement-group__description";
  title.textContent = group.title ?? "Requirements";
  description.textContent = group.description ?? "";

  summary.append(title, description);

  if (items.length === 0) {
    const emptyItem = document.createElement("li");

    emptyItem.className = "requirement-group__empty";
    emptyItem.textContent = "No requirements listed.";
    list.append(emptyItem);
  }

  for (const item of items) {
    list.append(createRequirementItem(item));
  }

  details.append(summary, list);
  return details;
}

export function renderRequirementsPanel({ data }) {
  if (!Array.isArray(data)) {
    throw new TypeError("Requirements data must be an array.");
  }

  const section = document.createElement("section");
  const heading = document.createElement("h2");

  section.className = "requirements-panel";
  section.dataset.sectionId = "requirements";
  section.setAttribute("aria-labelledby", "requirements-heading");

  heading.id = "requirements-heading";
  heading.textContent = "Toolkit and Evidence";

  section.append(heading);

  for (const [index, group] of data.entries()) {
    section.append(createRequirementGroup(group, { isOpen: index === 0 }));
  }

  return section;
}
