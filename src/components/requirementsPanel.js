function createRequirementItem(item) {

  const listItem = document.createElement("li");
  const name = document.createElement("strong");
  const detail = document.createElement("p");

  name.textContent = item.name;
  detail.textContent = item.detail;

  listItem.append(name, detail);

  return listItem;
}

function createRequirementGroup(group) {

  const details = document.createElement("details");
  const summary = document.createElement("summary");
  const title = document.createElement("span");
  const description = document.createElement("span");
  const list = document.createElement("ul");

  details.className = "requirement-group";
  title.className = "requirement-group__title";
  description.className = "requirement-group__description";
  title.textContent = group.title;
  description.textContent = group.description;

  summary.append(title, description);

  for (const item of group.items) {
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
  heading.textContent = "Requirements";

  section.append(heading);

  for (const group of data) {
    section.append(createRequirementGroup(group));
  }

  return section;
}
