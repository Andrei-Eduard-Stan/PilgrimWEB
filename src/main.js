import { createPilgrimageCard } from "./components/pilgrimageCards.js";
import { loadJSON } from "./utils/loadJSON.js";

const app = document.querySelector("#app");
const pilgrimagesSection = document.querySelector("#pilgrimages");

if (!app || !pilgrimagesSection) {
  throw new Error("Required DOM elements were not found.");
}

const statusMessage = document.createElement("p");

statusMessage.className = "system-status";
statusMessage.textContent = "system status: loading";

app.prepend(statusMessage);

async function initialiseApp() {
  try {
    const dataUrl = new URL("./data/pilgrimages.json", import.meta.url);
    const pilgrimages = await loadJSON(dataUrl);
    const firstPilgrimage = pilgrimages[0];

    if (!firstPilgrimage) {
      throw new Error("No pilgrimage data was found.");
    }

    const pilgrimageCard = createPilgrimageCard(firstPilgrimage);

    pilgrimagesSection.append(pilgrimageCard);
    statusMessage.textContent = "system status: online";
  } catch (error) {
    console.error("Error loading pilgrimages:", error);
    statusMessage.textContent = "system status: error";
  }
}

initialiseApp();