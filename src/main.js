import { sectionRegistry } from "./config/sectionRegistry.js";
import { loadJSON } from "./utils/loadJSON.js";
import { createDashboardShell } from "./components/dashboardShell.js";

const app = document.querySelector("#app");

if (!app) {
  throw new Error("App mount element was not found.");
}

const dataSources = {
  pilgrimages: new URL("./data/pilgrimages.json", import.meta.url),
  requirements: new URL("./data/requirements.json", import.meta.url),
  roadmap: new URL("./data/roadmap.json", import.meta.url),
};

const appState = {
  expandedIds: new Set(),
  expandedRoadmapIds: new Set(),
  expansionMode: "single",
};

const dashboard = createDashboardShell();
const statusMessage = document.createElement("p");
const contentRegions = {
  workspace: dashboard.regions.workspace,
  sidebar: dashboard.regions.sidebar,
};

statusMessage.className = "system-status";
statusMessage.textContent = "system status: loading";

dashboard.regions.status.append(statusMessage);

app.replaceChildren(dashboard.element);

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

function clearContentRegions() {
  for (const region of Object.values(contentRegions)){
    region.replaceChildren();
  }
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

function toggleRoadmapPhaseId(phaseId) {
  const isAlreadyExpanded = appState.expandedRoadmapIds.has(phaseId);

  if (appState.expansionMode === "single") {
    appState.expandedRoadmapIds.clear();
  }

  if (!isAlreadyExpanded) {
    appState.expandedRoadmapIds.add(phaseId);
  }
}

function renderSections({ sections, dataByKey, settings }) {
  clearContentRegions();
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
        onToggleRoadmapPhase: (phaseId) => {
        toggleRoadmapPhaseId(phaseId);
        renderSections({ sections, dataByKey, settings });
},
      },
    });

    const targetRegion = contentRegions[section.region];

    if (!targetRegion) {
      throw new Error(`No dashboard region found for section: ${section.region}`);
    }

    targetRegion.append(sectionElement);
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
