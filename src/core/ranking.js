// core/ranking.js
// Ranking local por modo y dificultad: los mejores resultados con el nombre del jugador.
// Lógica pura: no toca el DOM ni el almacenamiento.

export const RANKING_LIMIT = 10;
export const NAME_MAX_LENGTH = 16;

// Criterios de orden (negativo = `a` va antes que `b`).
export const RANKING_ORDERS = {
  // Parejas (Clásico y Personalizado): menos tiempo y, a igual tiempo, menos movimientos.
  time: (a, b) => a.seconds - b.seconds || a.moves - b.moves,
  // Secuencia (nivel) y N-back (precisión): más alto es mejor.
  score: (a, b) => b.score - a.score,
};

export function normalizeName(raw) {
  return String(raw ?? "").trim().replace(/\s+/g, " ").slice(0, NAME_MAX_LENGTH);
}

// Posición (0 = primero) que ocuparía `result`, o -1 si no entra en el ranking.
// A igualdad con un resultado ya guardado, el nuevo queda detrás (el primero en lograrlo manda).
export function rankingPosition(entries, result, orderKey, limit = RANKING_LIMIT) {
  const compare = RANKING_ORDERS[orderKey];
  let position = entries.findIndex((entry) => compare(result, entry) < 0);
  if (position === -1) position = entries.length;
  return position < limit ? position : -1;
}

export function qualifiesForRanking(entries, result, orderKey, limit = RANKING_LIMIT) {
  return rankingPosition(entries, result, orderKey, limit) !== -1;
}

// Devuelve { entries, position } sin modificar la lista original. position = -1 si no entró.
export function addToRanking(entries, entry, orderKey, limit = RANKING_LIMIT) {
  const position = rankingPosition(entries, entry, orderKey, limit);
  if (position === -1) return { entries: entries.slice(), position };
  const next = entries.slice();
  next.splice(position, 0, entry);
  return { entries: next.slice(0, limit), position };
}
