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

// Figuras extra para el modo personalizado: un tablero de 10×10 necesita 50 figuras distintas.
// Los modos Clásico, Secuencia y N-back siguen usando solo CARD_TYPES.
export const EXTRA_CARD_TYPES = [
  "square", "cross", "ring", "moon", "sun", "flower",
  "drop", "bolt", "arrow", "shield", "house",
].flatMap((shape) => ["coral", "blue", "green"].map((color) => `${shape}_${color}`));

export const ALL_CARD_TYPES = CARD_TYPES.concat(EXTRA_CARD_TYPES);

export function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildDeck(pairCount, pool = CARD_TYPES) {
  if (pairCount > pool.length) {
    throw new Error(
      `Se pidieron ${pairCount} parejas pero solo hay ${pool.length} tipos de carta disponibles.`
    );
  }
  const chosenTypes = shuffle(pool).slice(0, pairCount);
  const doubled = shuffle(chosenTypes.concat(chosenTypes));
  return doubled.map((type, index) => ({ id: index, type, matched: false }));
}
