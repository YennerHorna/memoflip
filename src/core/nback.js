// core/nback.js
// Modo N-back: aparece una carta a la vez y el jugador indica si es igual a la
// que salió N cartas antes. Entrena el ejecutivo central (Baddeley & Hitch).
// Lógica pura: no toca el DOM.
import { CARD_TYPES, shuffle } from "./deck.js";

export const NBACK_DIFFICULTIES = {
  easy: {
    label: "Fácil · 1-back", n: 1, trials: 20, stepMs: 2600, showMs: 1700,
    description: "Compara cada carta con la inmediatamente anterior. 20 cartas.",
  },
  normal: {
    label: "Normal · 2-back", n: 2, trials: 22, stepMs: 2500, showMs: 1600,
    description: "Compara cada carta con la que salió dos antes. 22 cartas.",
  },
  hard: {
    label: "Difícil · 3-back", n: 3, trials: 24, stepMs: 2300, showMs: 1400,
    description: "Compara cada carta con la que salió tres antes, y van más rápido. 24 cartas.",
  },
};

// Pocas figuras distintas: así las no-coincidencias también se repiten y hay que recordar la posición exacta.
export const NBACK_POOL_SIZE = 6;
const TARGET_RATE = 0.3;
// Precisión mínima (%) para considerar la ronda superada.
export const NBACK_PASS_ACCURACY = 80;

export function getNBackDifficulty(diffKey) {
  const d = NBACK_DIFFICULTIES[diffKey];
  if (!d) throw new Error(`Dificultad desconocida: ${diffKey}`);
  return d;
}

// Devuelve la secuencia de cartas y en qué posiciones hay coincidencia con la de N atrás.
export function buildStream(n, length, pool) {
  if (pool.length < 2) throw new Error("El N-back necesita al menos 2 tipos de carta.");
  const candidates = [];
  for (let i = n; i < length; i++) candidates.push(i);
  const targetCount = Math.round((length - n) * TARGET_RATE);
  const targets = new Set(shuffle(candidates).slice(0, targetCount));

  const stream = [];
  for (let i = 0; i < length; i++) {
    if (targets.has(i)) {
      stream.push(stream[i - n]);
    } else {
      const options = i >= n ? pool.filter((t) => t !== stream[i - n]) : pool;
      stream.push(options[Math.floor(Math.random() * options.length)]);
    }
  }
  const isTarget = stream.map((_, i) => targets.has(i));
  return { stream, isTarget };
}

export function createNBackState(diffKey, types = shuffle(CARD_TYPES)) {
  const { n, trials } = getNBackDifficulty(diffKey);
  const { stream, isTarget } = buildStream(n, trials, types.slice(0, NBACK_POOL_SIZE));
  return {
    diffKey,
    n,
    stream,
    isTarget,
    index: -1,
    responded: false,
    hits: 0,
    misses: 0,
    falseAlarms: 0,
    correctRejections: 0,
    phase: "ready", // "ready" | "running" | "finished"
  };
}

// Cierra la carta actual (contando omisiones) y pasa a la siguiente.
export function advance(state) {
  if (state.phase === "finished") return { changed: false };

  let missed = false;
  if (state.index >= state.n && !state.responded) {
    if (state.isTarget[state.index]) {
      state.misses++;
      missed = true;
    } else {
      state.correctRejections++;
    }
  }

  state.index++;
  state.responded = false;
  if (state.index >= state.stream.length) {
    state.phase = "finished";
    return { changed: true, event: "finished", missed };
  }
  state.phase = "running";
  return {
    changed: true,
    event: "next",
    missed,
    type: state.stream[state.index],
    index: state.index,
    canMatch: state.index >= state.n,
  };
}

export function respond(state) {
  // Durante las primeras N cartas todavía no hay con qué comparar: se ignora.
  if (state.phase !== "running" || state.responded || state.index < state.n) {
    return { changed: false };
  }
  state.responded = true;
  if (state.isTarget[state.index]) {
    state.hits++;
    return { changed: true, event: "hit" };
  }
  state.falseAlarms++;
  return { changed: true, event: "falseAlarm" };
}

export function getScore(state) {
  const scorable = state.stream.length - state.n;
  const targets = state.isTarget.filter(Boolean).length;
  const accuracy = Math.round(((state.hits + state.correctRejections) / scorable) * 100);
  return {
    accuracy,
    passed: accuracy >= NBACK_PASS_ACCURACY,
    hits: state.hits,
    targets,
    falseAlarms: state.falseAlarms,
    misses: state.misses,
  };
}
