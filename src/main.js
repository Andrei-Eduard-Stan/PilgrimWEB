import { sectionRegistry } from "./config/sectionRegistry.js";
import { loadJSON } from "./utils/loadJSON.js";

const app = document.querySelector("#app");

if (!app) {
  throw new Error("App mount element was not found.");
}

const dataSources = {
  pilgrimages: new URL("./data/pilgrimages.json", import.meta.url),
};

const appState = {
  expandedIds: new Set(),
  expansionMode: "single",
};

const statusMessage = document.createElement("p");
const workspaceRegion = document.createElement("div");

statusMessage.className = "system-status";
statusMessage.textContent = "system status: loading";

workspaceRegion.className = "app-region app-region--workspace";

app.replaceChildren(statusMessage, workspaceRegion);

function getEnabledSections(settings) {
  return settings.sections
    .filter((section) => section.enabled)
    .sort((firstSection, secondSection) => firstSection.order - secondSection.order);
}

async function loadDataForSections(sections) {
  const dataByKey = {};
  const dataKeys = new Set();

  for (const section of sections) {
    const registryEntry = sectionRegistry[section.id];

    if (!registryEntry) {
      throw new Error(`No renderer registered for section: ${section.id}`);
    }

    dataKeys.add(registryEntry.dataKey);
  }

  for (const dataKey of dataKeys) {
    const dataUrl = dataSources[dataKey];

    if (!dataUrl) {
      throw new Error(`No data source registered for key: ${dataKey}`);
    }

    dataByKey[dataKey] = await loadJSON(dataUrl);
  }

  return dataByKey;
}

function toggleExpandedId(itemId) {
  const isAlreadyExpanded = appState.expandedIds.has(itemId);

  if (appState.expansionMode === "single") {
    appState.expandedIds.clear();
  }

  if (!isAlreadyExpanded) {
    appState.expandedIds.add(itemId);
  }
}

function renderSections({ sections, dataByKey, settings }) {
  workspaceRegion.replaceChildren();
  appState.expansionMode = settings.interaction?.expansionMode ?? "single";

  for (const section of sections) {
    const registryEntry = sectionRegistry[section.id];
    const sectionData = dataByKey[registryEntry.dataKey];
    const sectionElement = registryEntry.render({
      data: sectionData,
      options: section,
      state: appState,
      callbacks: {
        onTogglePilgrimage: (pilgrimageId) => {
          toggleExpandedId(pilgrimageId);
          renderSections({ sections, dataByKey, settings });
        },
      },
    });

    workspaceRegion.append(sectionElement);
  }
}

async function initialiseApp() {
  try {
    const settingsUrl = new URL("./data/settings.json", import.meta.url);
    const settings = await loadJSON(settingsUrl);
    const sections = getEnabledSections(settings);
    const dataByKey = await loadDataForSections(sections);

    renderSections({ sections, dataByKey, settings });
    statusMessage.textContent = "system status: online";
  } catch (error) {
    console.error("Error initialising app:", error);
    statusMessage.textContent = "system status: error";
  }
}

initialiseApp();
