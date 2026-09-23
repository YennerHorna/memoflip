// core/deck.js
// Lógica pura: no toca el DOM. Fácil de testear y reutilizar entre modos.

export const CARD_TYPES = [
  "star_coral", "star_blue", "star_green",
  "circle_coral", "circle_blue", "circle_green",
  "diamond_coral", "diamond_blue", "diamond_green",
  "triangle_coral", "triangle_blue", "triangle_green",
  "heart_coral", "heart_blue", "heart_green",
  "hexagon_coral", "hexagon_blue", "hexagon_green",
];

export function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildDeck(pairCount) {
  if (pairCount > CARD_TYPES.length) {
    throw new Error(
      `Se pidieron ${pairCount} parejas pero solo hay ${CARD_TYPES.length} tipos de carta disponibles.`
    );
  }
  const chosenTypes = shuffle(CARD_TYPES).slice(0, pairCount);
  const doubled = shuffle(chosenTypes.concat(chosenTypes));
  return doubled.map((type, index) => ({ id: index, type, matched: false }));
}
