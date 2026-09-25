// modes/nback/nbackMode.js
// Modo N-back: el core decide qué carta sale y si hubo acierto; la UI solo lo pinta.
import { CARD_TYPES } from "../../core/deck.js";
import { createNBackState, getNBackDifficulty, advance, respond, getScore, NBACK_PASS_ACCURACY } from "../../core/nback.js";
import { pickTypesForReview } from "../../core/spacedRepetition.js";
import { renderNBackStage } from "../../ui/nbackStage.js";
import { getBestNBackAccuracy, saveBestNBackAccuracyIfBetter, getSpacedRepetitionData } from "../../services/storage.js";
import * as audio from "../../services/audio.js";

const START_DELAY_MS = 1200;

export function createNBackMode({ boardEl, hud, winModal, diffKey }) {
  let state = null;
  let stage = null;
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
    stage?.destroy();
    audio.stopEffects();
    stage = null;
  }

  function start() {
    stop();
    // Las figuras con peor historial de repetición espaciada entran en el mazo del N-back.
    const types = pickTypesForReview(getSpacedRepetitionData(), CARD_TYPES, CARD_TYPES.length);
    state = createNBackState(diffKey, types);

    hud.useNBackLabels();
    hud.setNBackLevel(state.n);
    hud.setHits(0);
    hud.setMatches(0, state.stream.length);
    hud.setBestAccuracy(getBestNBackAccuracy(diffKey));
    hud.setStatus("Prepárate…");
    winModal.hide();

    stage = renderNBackStage(boardEl, handleRespond);
    stage.setButtonEnabled(false);
    later(nextTrial, START_DELAY_MS);
  }

  function nextTrial() {
    const result = advance(state);
    if (result.missed) {
      stage.feedback("miss");
      audio.play("error");
    }

    if (result.event === "finished") {
      stage.setButtonEnabled(false);
      stage.destroy(); // suelta Espacio/Enter para que funcionen los botones del modal
      hud.setStatus("");
      later(onFinish, 600);
      return;
    }

    const { stepMs, showMs } = getNBackDifficulty(diffKey);
    stage.showCard(result.type);
    stage.setButtonEnabled(result.canMatch);
    audio.play("flip");
    hud.setMatches(result.index + 1, state.stream.length);
    hud.setStatus(
      result.canMatch
        ? `¿Es igual a la de hace ${state.n}?`
        : `Memoriza esta carta (${result.index + 1}/${state.n})`
    );

    later(() => stage.hideCard(), showMs);
    later(nextTrial, stepMs);
  }

  function handleRespond() {
    if (!stage) return;
    const result = respond(state);
    if (!result.changed) return;
    stage.setButtonEnabled(false);
    stage.feedback(result.event);
    hud.setHits(state.hits);
    if (result.event === "falseAlarm") audio.play("error");
  }

  function onFinish() {
    const { accuracy, hits, targets, falseAlarms, passed } = getScore(state);
    const isNewBest = saveBestNBackAccuracyIfBetter(diffKey, accuracy);
    hud.setBestAccuracy(getBestNBackAccuracy(diffKey));
    audio.play(passed ? "win" : "loss");
    winModal.showSummary({
      title: passed ? "¡Ronda superada!" : "Ronda no superada",
      primary: `${accuracy}% de precisión`,
      secondary: `${hits}/${targets} coincidencias detectadas · ${falseAlarms} ${falseAlarms === 1 ? "falsa alarma" : "falsas alarmas"}`,
      // Un récord con la ronda no superada se guarda, pero no se celebra.
      isNewBest: isNewBest && passed,
    });
    if (!passed) winModal.setNote(`Necesitas al menos ${NBACK_PASS_ACCURACY}% para superarla`);
  }

  function setDifficulty(newDiffKey) {
    diffKey = newDiffKey;
    start();
  }

  return { start, setDifficulty, stop };
}
