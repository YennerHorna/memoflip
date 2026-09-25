// modes/sequence/sequenceMode.js
// Modo Secuencia: el juego revela cartas en orden y el jugador las repite.
// Entrena la agenda visoespacial (Baddeley & Hitch) con recuerdo activo.
import { CARD_TYPES } from "../../core/deck.js";
import { createSequenceState, getSequenceDifficulty, beginInput, submitTap } from "../../core/sequence.js";
import { pickTypesForReview } from "../../core/spacedRepetition.js";
import { renderBoard, applyFlip, applyUnflip, applyMismatch } from "../../ui/board.js";
import { getBestSequenceLength, saveBestSequenceLengthIfBetter, getSpacedRepetitionData } from "../../services/storage.js";
import * as audio from "../../services/audio.js";

const START_DELAY_MS = 700;
const ROUND_DELAY_MS = 900;
const TAP_FLASH_MS = 400;

export function createSequenceMode({ boardEl, hud, winModal, diffKey }) {
  let state = null;
  let tileElements = null;
  const timers = new Set();

  function later(fn, ms) {
    const id = setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  }

  function stop() {
    timers.forEach(clearTimeout);
    timers.clear();
    audio.stopEffects();
    // Si se corta a mitad de la secuencia, no dejar ninguna carta revelada.
    tileElements?.forEach((_, cardId) => applyUnflip(tileElements, cardId));
  }

  function start() {
    stop();
    // Las caras con peor historial en el modo clásico aparecen primero en el tablero.
    const types = pickTypesForReview(getSpacedRepetitionData(), CARD_TYPES, CARD_TYPES.length);
    state = createSequenceState(diffKey, types);
    const { cols } = getSequenceDifficulty(diffKey);

    hud.useSequenceLabels();
    hud.setBestLength(getBestSequenceLength(diffKey));
    updateHud();
    winModal.hide();
    tileElements = renderBoard(boardEl, state.deck, cols, handleTileClick);
    later(playSequence, START_DELAY_MS);
  }

  function updateHud() {
    hud.setLevel(state.length);
    hud.setLives(state.lives);
    hud.setMatches(state.inputIndex, state.sequence.length);
  }

  function playSequence() {
    const { stepMs } = getSequenceDifficulty(diffKey);
    const showMs = stepMs - 250;
    hud.setStatus("Observa…");
    updateHud();

    state.sequence.forEach((cardId, i) => {
      later(() => {
        applyFlip(tileElements, cardId);
        audio.play("flip");
      }, i * stepMs);
      later(() => applyUnflip(tileElements, cardId), i * stepMs + showMs);
    });

    later(() => {
      beginInput(state);
      hud.setStatus("Tu turno: repite el orden");
    }, state.sequence.length * stepMs);
  }

  function handleTileClick(cardId) {
    const result = submitTap(state, cardId);
    if (!result.changed) return;

    if (result.event === "correct" || result.event === "roundComplete") {
      applyFlip(tileElements, cardId);
      later(() => applyUnflip(tileElements, cardId), TAP_FLASH_MS);
      audio.play("flip");
    }

    if (result.event === "correct") {
      hud.setMatches(state.inputIndex, state.sequence.length);
      return;
    }

    if (result.event === "roundComplete") {
      hud.setMatches(state.sequence.length - 1, state.sequence.length - 1);
      hud.setStatus("¡Bien! Siguiente nivel");
      later(playSequence, ROUND_DELAY_MS);
      return;
    }

    // Error: se muestra la carta tocada temblando y cuál era la correcta.
    applyFlip(tileElements, cardId);
    applyMismatch(tileElements, [cardId]);
    applyFlip(tileElements, result.expectedId);
    later(() => applyUnflip(tileElements, result.expectedId), 700);
    hud.setLives(state.lives);
    audio.play("error");

    if (result.event === "wrong") {
      hud.setStatus("Fallaste. Otra secuencia del mismo nivel");
      later(playSequence, ROUND_DELAY_MS + 400);
      return;
    }

    hud.setStatus("");
    later(onGameOver, 900);
  }

  function onGameOver() {
    const reached = state.bestLength;
    const isNewBest = saveBestSequenceLengthIfBetter(diffKey, reached);
    hud.setBestLength(getBestSequenceLength(diffKey));
    // La partida siempre acaba al quedarse sin vidas: solo suena a victoria si es un récord.
    audio.play(isNewBest && reached > 0 ? "win" : "loss");
    winModal.showSummary({
      title: "Fin de la partida",
      primary: reached ? `Nivel ${reached}` : "Sin niveles superados",
      secondary: reached ? `Recordaste una secuencia de ${reached} cartas` : "¡Inténtalo otra vez!",
      isNewBest: isNewBest && reached > 0,
    });
  }

  function setDifficulty(newDiffKey) {
    diffKey = newDiffKey;
    start();
  }

  return { start, setDifficulty, stop };
}
