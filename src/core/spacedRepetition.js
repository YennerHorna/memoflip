// core/spacedRepetition.js
// Sistema tipo Leitner: cada tipo de carta vive en una "caja" (0 a 4).
// Acierto → sube de caja (se repasa más espaciado). Falla → baja a caja 0.
const MAX_BOX = 4;

export function createSpacedRepetitionState() {
  return { boxes: {} };
}

function getBox(srState, type) {
  return srState.boxes[type] ?? 0;
}

export function recordSuccess(srState, type) {
  const current = getBox(srState, type);
  srState.boxes[type] = Math.min(MAX_BOX, current + 1);
}

export function recordFailure(srState, type) {
  srState.boxes[type] = 0;
}

export function priorityOrder(srState, allTypes) {
  return allTypes.slice().sort((a, b) => getBox(srState, a) - getBox(srState, b));
}

export function pickTypesForReview(srState, allTypes, count) {
  return priorityOrder(srState, allTypes).slice(0, count);
}
