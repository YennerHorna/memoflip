// modes/custom/customMode.js
// Modo personalizado: tablero de tamaño libre (hasta 10×10) con temporizador o cronómetro.
// Reutiliza la lógica del clásico (core/gameState.js); solo cambia el tamaño y el reloj.
import { createGameState, flipCard, resolveMismatch, tickSecond } from "../../core/gameState.js";
import { ALL_CARD_TYPES } from "../../core/deck.js";
import { getCustomPairCount, customDiffKey } from "../../core/custom.js";
import { renderBoard, applyFlip, applyUnflip, applyMatched, applyMismatch } from "../../ui/board.js";
import { getBestResult, saveBestResultIfBetter } from "../../services/storage.js";
import * as audio from "../../services/audio.js";
import { buildRanking, formatTimeEntry } from "../ranking.js";

export function createCustomMode({ boardEl, hud, winModal }) {
  let config = null; // { clock, durationSec, cols, rows }
  let state = null;
  let tileElements = null;
  let timerId = null;
  let mismatchTimeoutId = null;

  const isTimer = () => config.clock === "timer";
  const total = () => state.deck.length / 2;
  const remaining = () => Math.max(0, config.durationSec - state.seconds);

  function showClock() {
    hud.setClock(isTimer() ? remaining() : state.seconds);
  }

  // Aplica una configuración nueva y arranca la partida.
  function configure(newConfig) {
    config = { ...newConfig };
    start();
  }

  function start() {
    if (!config) return;
    stop();
    const { cols, rows } = config;
    state = createGameState(customDiffKey(cols, rows), {
      pairCount: getCustomPairCount(cols, rows),
      pool: ALL_CARD_TYPES,
    });
    hud.useCustomLabels(config.clock);
    hud.setMoves(0);
    hud.setMatches(0, total());
    hud.setBest(getBestResult(state.diffKey));
    showClock();
    winModal.hide();
    tileElements = renderBoard(boardEl, state.deck, cols, handleTileClick);
  }

  function startTimer() {
    if (timerId) return;
    timerId = setInterval(() => {
      tickSecond(state);
      showClock();
      if (isTimer() && state.seconds >= config.durationSec) onTimeUp();
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
  }

  function stop() {
    stopTimer();
    clearTimeout(mismatchTimeoutId);
    mismatchTimeoutId = null;
    audio.stopEffects();
  }

  function handleTileClick(cardId) {
    const wasStarted = state.started;
    const result = flipCard(state, cardId);
    if (!result.changed) return;
    // El reloj arranca con la primera carta, igual que en el modo clásico.
    if (!wasStarted && state.started) startTimer();

    if (result.event === "flip") {
      applyFlip(tileElements, cardId);
      audio.play("flip");
      return;
    }

    if (result.event === "match") {
      const [a, b] = result.cardIds;
      applyFlip(tileElements, b);
      applyMatched(tileElements, [a, b]);
      hud.setMoves(state.moves);
      hud.setMatches(state.matchedCount, total());
      audio.play("flip");
      if (result.won) onWin();
      return;
    }

    if (result.event === "mismatch") {
      const [a, b] = result.cardIds;
      applyFlip(tileElements, b);
      hud.setMoves(state.moves);
      audio.play("error");
      mismatchTimeoutId = setTimeout(() => {
        mismatchTimeoutId = null;
        applyUnflip(tileElements, a);
        applyUnflip(tileElements, b);
        applyMismatch(tileElements, [a, b]);
        resolveMismatch(state);
      }, 650);
    }
  }

  function onWin() {
    stopTimer();
    const isNewBest = saveBestResultIfBetter(state.diffKey, { seconds: state.seconds, moves: state.moves });
    hud.setBest(getBestResult(state.diffKey));
    audio.play("win");
    // Mismo ranking para temporizador y cronómetro: en ambos se compara el tiempo empleado.
    const ranking = buildRanking({
      key: state.diffKey,
      label: `Personalizado · ${config.cols}×${config.rows}`,
      order: "time",
      result: { seconds: state.seconds, moves: state.moves },
      format: formatTimeEntry,
    });
    winModal.show({ seconds: state.seconds, moves: state.moves, isNewBest, ranking });
  }

  function onTimeUp() {
    stopTimer();
    state.finished = true; // bloquea el tablero: flipCard ignora clics cuando la partida terminó
    showClock();
    audio.play("loss");
    winModal.showSummary({
      title: "¡Se acabó el tiempo!",
      primary: `${state.matchedCount}/${total()} parejas`,
      secondary: `${state.moves} movimientos`,
      isNewBest: false,
      failed: true,
    });
  }

  // Misma interfaz que los demás modos (app.js llama a stop/start).
  return { start, stop, configure };
}
