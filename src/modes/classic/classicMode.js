// modes/classic/classicMode.js
// Orquesta un modo de juego: toma decisiones del "core" y le pide a "ui" que las pinte.
import { createGameState, flipCard, resolveMismatch, tickSecond } from "../../core/gameState.js";
import { DIFFICULTIES } from "../../core/difficulty.js";
import { recordSuccess, recordFailure } from "../../core/spacedRepetition.js";
import { renderBoard, applyFlip, applyUnflip, applyMatched, applyMismatch } from "../../ui/board.js";
import { getBestResult, saveBestResultIfBetter, getSpacedRepetitionData, saveSpacedRepetitionData } from "../../services/storage.js";
import * as audio from "../../services/audio.js";

export function createClassicMode({ boardEl, hud, winModal, diffKey }) {
  let state = createGameState(diffKey);
  let tileElements = null;
  let timerId = null;
  let mismatchTimeoutId = null;
  const srState = getSpacedRepetitionData();

  function start() {
    stop();
    state = createGameState(diffKey);
    hud.reset(state.deck.length / 2);
    hud.setBest(getBestResult(diffKey));
    hud.useClassicLabels();
    winModal.hide();
    tileElements = renderBoard(boardEl, state.deck, DIFFICULTIES[diffKey].cols, handleTileClick);
  }

  function startTimer() {
    if (timerId) return;
    timerId = setInterval(() => {
      tickSecond(state);
      hud.setTime(state.seconds);
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
      hud.setMatches(state.matchedCount, state.deck.length / 2);
      audio.play("flip");

      const type = state.deck.find((c) => c.id === a).type;
      recordSuccess(srState, type);
      saveSpacedRepetitionData(srState);

      if (result.won) onWin();
      return;
    }

    if (result.event === "mismatch") {
      const [a, b] = result.cardIds;
      applyFlip(tileElements, b);
      hud.setMoves(state.moves);

      const type = state.deck.find((c) => c.id === a).type;
      audio.play("error");
      recordFailure(srState, type);
      saveSpacedRepetitionData(srState);

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
    const isNewBest = saveBestResultIfBetter(diffKey, { seconds: state.seconds, moves: state.moves });
    hud.setBest(getBestResult(diffKey));
    audio.play("win");
    winModal.show({ seconds: state.seconds, moves: state.moves, isNewBest });
  }

  function setDifficulty(newDiffKey) {
    diffKey = newDiffKey;
    start();
  }

  return { start, setDifficulty, stop };
}
