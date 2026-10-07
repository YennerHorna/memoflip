// core/custom.js
// Modo personalizado: el jugador elige el reloj (temporizador o cronómetro) y el tamaño del tablero.
// Lógica pura: no toca el DOM.
import { ALL_CARD_TYPES } from "./deck.js";

export const CUSTOM_MIN_SIZE = 2;
export const CUSTOM_MAX_SIZE = 10;
export const CUSTOM_MIN_SECONDS = 10;
export const CUSTOM_MAX_SECONDS = 99 * 60 + 59;

// "timer" = temporizador (cuenta regresiva con tiempo límite); "stopwatch" = cronómetro (cuenta hacia arriba).
export const CLOCKS = {
  timer: {
    label: "Temporizador",
    description: "Cuenta regresiva: completa el tablero antes de que se acabe el tiempo que elijas.",
  },
  stopwatch: {
    label: "Cronómetro",
    description: "Sin límite: el tiempo corre hacia arriba mientras juegas.",
  },
};

export function getCustomPairCount(cols, rows) {
  return (cols * rows) / 2;
}

function isSizeNumber(n) {
  return Number.isInteger(n) && n >= CUSTOM_MIN_SIZE && n <= CUSTOM_MAX_SIZE;
}

// Devuelve { ok: true, pairs, cards } o { ok: false, error } con un mensaje para el jugador.
export function validateCustomSize(cols, rows) {
  if (cols == null || rows == null || Number.isNaN(cols) || Number.isNaN(rows)) {
    return { ok: false, error: `Escribe las columnas y las filas (de ${CUSTOM_MIN_SIZE} a ${CUSTOM_MAX_SIZE}).` };
  }
  if (!isSizeNumber(cols) || !isSizeNumber(rows)) {
    return { ok: false, error: `Cada medida debe estar entre ${CUSTOM_MIN_SIZE} y ${CUSTOM_MAX_SIZE}.` };
  }
  if ((cols * rows) % 2 !== 0) {
    return { ok: false, error: `Con ${cols}×${rows} sobraría una carta sin pareja: cambia una medida para que el total sea par.` };
  }
  const pairs = getCustomPairCount(cols, rows);
  if (pairs > ALL_CARD_TYPES.length) {
    return { ok: false, error: "Ese tablero necesita más figuras de las disponibles." };
  }
  return { ok: true, pairs, cards: cols * rows };
}

export function validateCustomSeconds(seconds) {
  if (seconds == null || Number.isNaN(seconds) || seconds <= 0) {
    return { ok: false, error: "Escribe el tiempo del temporizador." };
  }
  if (seconds < CUSTOM_MIN_SECONDS) {
    return { ok: false, error: `El tiempo mínimo es ${CUSTOM_MIN_SECONDS} segundos.` };
  }
  if (seconds > CUSTOM_MAX_SECONDS) {
    return { ok: false, error: "El tiempo máximo es 99 minutos y 59 segundos." };
  }
  return { ok: true };
}

// config = { clock: "timer" | "stopwatch", durationSec, cols, rows }
export function validateCustomConfig(config) {
  if (!CLOCKS[config.clock]) return { ok: false, error: "Elige temporizador o cronómetro." };
  if (config.clock === "timer") {
    const time = validateCustomSeconds(config.durationSec);
    if (!time.ok) return time;
  }
  return validateCustomSize(config.cols, config.rows);
}

export function customDiffKey(cols, rows) {
  return `custom_${cols}x${rows}`;
}

export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}
