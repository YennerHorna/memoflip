// core/sequence.js
// Modo Secuencia (tipo Corsi): se revela una secuencia de cartas y el jugador
// debe tocarlas en el mismo orden. Cada ronda superada alarga la secuencia.
// Lógica pura: no toca el DOM.
import { CARD_TYPES, shuffle } from "./deck.js";

export const SEQUENCE_DIFFICULTIES = {
  easy: {
    label: "Fácil · 3×3", cols: 3, rows: 3, startLength: 3, stepMs: 1100,
    description: "Tablero de 9 cartas. Empiezas recordando 3 y se muestran despacio.",
  },
  normal: {
    label: "Normal · 4×3", cols: 4, rows: 3, startLength: 4, stepMs: 950,
    description: "Tablero de 12 cartas. Empiezas recordando 4 y se muestran un poco más rápido.",
  },
  hard: {
    label: "Difícil · 4×4", cols: 4, rows: 4, startLength: 5, stepMs: 800,
    description: "Tablero de 16 cartas. Empiezas recordando 5 y se muestran rápido.",
  },
};

export const SEQUENCE_LIVES = 3;

export function getSequenceDifficulty(diffKey) {
  const d = SEQUENCE_DIFFICULTIES[diffKey];
  if (!d) throw new Error(`Dificultad desconocida: ${diffKey}`);
  return d;
}

// Sin repeticiones consecutivas: dos destellos seguidos en la misma carta no se distinguen.
export function buildSequence(tileCount, length) {
  const seq = [];
  for (let i = 0; i < length; i++) {
    let next;
    do {
      next = Math.floor(Math.random() * tileCount);
    } while (tileCount > 1 && next === seq[i - 1]);
    seq.push(next);
  }
  return seq;
}

// `types` permite priorizar ciertas caras (ej. las de repetición espaciada);
// si no se pasa, se eligen al azar.
export function createSequenceState(diffKey, types = shuffle(CARD_TYPES)) {
  const { cols, rows, startLength } = getSequenceDifficulty(diffKey);
  const tileCount = cols * rows;
  if (tileCount > types.length) {
    throw new Error(`El tablero necesita ${tileCount} cartas pero solo hay ${types.length} tipos.`);
  }
  const deck = shuffle(types.slice(0, tileCount)).map((type, index) => ({ id: index, type }));
  return {
    diffKey,
    deck,
    length: startLength,
    sequence: buildSequence(tileCount, startLength),
    inputIndex: 0,
    lives: SEQUENCE_LIVES,
    bestLength: 0,
    phase: "showing", // "showing" | "input" | "finished"
  };
}

export function beginInput(state) {
  if (state.phase === "showing") state.phase = "input";
}

export function submitTap(state, cardId) {
  if (state.phase !== "input") return { changed: false };
  if (!state.deck.some((c) => c.id === cardId)) return { changed: false };

  const expectedId = state.sequence[state.inputIndex];
  if (cardId === expectedId) {
    state.inputIndex++;
    if (state.inputIndex < state.sequence.length) {
      return { changed: true, event: "correct", cardId };
    }
    state.bestLength = Math.max(state.bestLength, state.length);
    state.length++;
    nextRound(state);
    return { changed: true, event: "roundComplete", cardId };
  }

  state.lives--;
  if (state.lives <= 0) {
    state.phase = "finished";
    return { changed: true, event: "gameOver", cardId, expectedId };
  }
  nextRound(state); // misma longitud, secuencia nueva
  return { changed: true, event: "wrong", cardId, expectedId };
}

function nextRound(state) {
  state.sequence = buildSequence(state.deck.length, state.length);
  state.inputIndex = 0;
  state.phase = "showing";
}
