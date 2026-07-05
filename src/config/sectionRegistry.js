import { renderPilgrimageRail } from "../components/pilgrimageCards.js";
import { renderRequirementsPanel } from "../components/requirementsPanel.js";
import { renderRoadmapRail } from "../components/roadmapRail.js";

export const sectionRegistry = {
  pilgrimages: {
    dataKey: "pilgrimages",
    render: renderPilgrimageRail,
  },

  requirements: {
    dataKey: "requirements",
    render: renderRequirementsPanel,
  },

  roadmap: {
    dataKey: "roadmap",
    render: renderRoadmapRail,
  },

};
