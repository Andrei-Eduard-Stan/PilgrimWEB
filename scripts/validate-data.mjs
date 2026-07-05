import { readFile } from "node:fs/promises";

const errors = [];

function addError(message) {
  errors.push(message);
}

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function requireArray(value, path) {
  if (!Array.isArray(value)) {
    addError(`${path} must be an array.`);
    return [];
  }

  return value;
}

function requireText(object, field, path) {
  if (!hasText(object[field])) {
    addError(`${path}.${field} must be a non-empty string.`);
  }
}

function requireObject(value, path) {
  if (!isObject(value)) {
    addError(`${path} must be an object.`);
    return {};
  }

  return value;
}

async function readJsonFile(filePath) {
  const fileText = await readFile(filePath, "utf8");

  try {
    return JSON.parse(fileText);
  } catch (error) {
    addError(`${filePath} is not valid JSON: ${error.message}`);
    return null;
  }
}

function validateSettings(settings) {
  const sections = requireArray(settings?.sections, "settings.sections");

  for (const [index, section] of sections.entries()) {
    const path = `settings.sections[${index}]`;

    requireText(section, "id", path);

    if (typeof section.enabled !== "boolean") {
      addError(`${path}.enabled must be true or false.`);
    }

    if (!["workspace", "sidebar"].includes(section.region)) {
      addError(`${path}.region must be "workspace" or "sidebar".`);
    }

    if (typeof section.order !== "number") {
      addError(`${path}.order must be a number.`);
    }
  }
}

function validatePilgrimages(pilgrimages) {
  for (const [index, pilgrimage] of requireArray(pilgrimages, "pilgrimages").entries()) {
    const path = `pilgrimages[${index}]`;

    requireText(pilgrimage, "id", path);
    requireText(pilgrimage, "title", path);
    requireText(pilgrimage, "subtitle", path);
    requireArray(pilgrimage.techStack, `${path}.techStack`);

    for (const [phaseIndex, phase] of requireArray(
      pilgrimage.learningPath,
      `${path}.learningPath`,
    ).entries()) {
      const phasePath = `${path}.learningPath[${phaseIndex}]`;

      requireText(phase, "phase", phasePath);
      requireArray(phase.items, `${phasePath}.items`);
    }

    const project = requireObject(pilgrimage.project, `${path}.project`);

    requireText(project, "name", `${path}.project`);
    requireText(project, "description", `${path}.project`);
  }
}

function validateRoadmap(roadmap) {
  for (const [index, phase] of requireArray(roadmap, "roadmap").entries()) {
    const path = `roadmap[${index}]`;

    requireText(phase, "id", path);
    requireText(phase, "phase", path);
    requireText(phase, "timeframe", path);
    requireText(phase, "mainFocus", path);
    requireArray(phase.skills, `${path}.skills`);
    requireArray(phase.projects, `${path}.projects`);
    requireText(phase, "outcome", path);

    for (const [sectionIndex, section] of requireArray(
      phase.detailSections,
      `${path}.detailSections`,
    ).entries()) {
      const sectionPath = `${path}.detailSections[${sectionIndex}]`;

      requireText(section, "title", sectionPath);
      requireArray(section.items, `${sectionPath}.items`);
    }
  }
}

function validateRequirements(requirements) {
  for (const [index, group] of requireArray(requirements, "requirements").entries()) {
    const path = `requirements[${index}]`;

    requireText(group, "id", path);
    requireText(group, "title", path);
    requireText(group, "description", path);

    for (const [itemIndex, item] of requireArray(group.items, `${path}.items`).entries()) {
      const itemPath = `${path}.items[${itemIndex}]`;

      requireText(item, "name", itemPath);
      requireText(item, "detail", itemPath);
    }
  }
}

const settings = await readJsonFile("src/data/settings.json");
const pilgrimages = await readJsonFile("src/data/pilgrimages.json");
const roadmap = await readJsonFile("src/data/roadmap.json");
const requirements = await readJsonFile("src/data/requirements.json");

validateSettings(settings);
validatePilgrimages(pilgrimages);
validateRoadmap(roadmap);
validateRequirements(requirements);

if (errors.length > 0) {
  console.error("Data validation failed:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("Data validation passed.");
