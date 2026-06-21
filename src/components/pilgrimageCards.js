export function createPilgrimageCard(pilgrimage) {
  const card = document.createElement("article");
  const title = document.createElement("h3");
  const subtitle = document.createElement("p");

  card.className = "pilgrimage-card";
  card.dataset.pilgrimageId = pilgrimage.id;

  title.textContent = pilgrimage.title;
  subtitle.textContent = pilgrimage.subtitle;

  card.append(title, subtitle);

  return card;
}