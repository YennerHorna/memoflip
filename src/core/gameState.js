// core/gameState.js
// Máquina de estado del juego, independiente de cómo se dibuje en pantalla.
import { buildDeck } from "./deck.js";
import { getPairCount } from "./difficulty.js";

export function createGameState(diffKey) {
  const pairCount = getPairCount(diffKey);
  return {
    diffKey,
    deck: buildDeck(pairCount),
    flippedIds: [],
    matchedCount: 0,
    moves: 0,
    seconds: 0,
    started: false,
    finished: false,
    locked: false,
  };
}

export function flipCard(state, cardId) {
  if (state.locked || state.finished) return { changed: false };

  const card = state.deck.find((c) => c.id === cardId);
  if (!card || card.matched || state.flippedIds.includes(cardId)) {
    return { changed: false };
  }

  if (!state.started) state.started = true;
  state.flippedIds.push(cardId);

  if (state.flippedIds.length < 2) {
    return { changed: true, event: "flip", cardId };
  }

  state.moves++;
  const [firstId, secondId] = state.flippedIds;
  const first = state.deck.find((c) => c.id === firstId);
  const second = state.deck.find((c) => c.id === secondId);
  const isMatch = first.type === second.type;
  state.locked = true;

  if (isMatch) {
    first.matched = true;
    second.matched = true;
    state.matchedCount++;
    state.flippedIds = [];
    state.locked = false;
    if (state.matchedCount === state.deck.length / 2) state.finished = true;
    return { changed: true, event: "match", cardIds: [firstId, secondId], won: state.finished };
  }

  return { changed: true, event: "mismatch", cardIds: [firstId, secondId] };
}

export function resolveMismatch(state) {
  state.flippedIds = [];
  state.locked = false;
}

export function tickSecond(state) {
  if (state.started && !state.finished) state.seconds++;
}
