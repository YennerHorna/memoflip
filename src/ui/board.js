// ui/board.js
import { DIFFICULTIES } from "../core/difficulty.js";
import { createTileElement, setTileFace, flipTileVisual, markTileMatched, shakeTile } from "./tile.js";

export function renderBoard(boardEl, deck, diffKey, onTileClick) {
  const { cols } = DIFFICULTIES[diffKey];
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  boardEl.innerHTML = "";

  const tileElements = new Map();
  deck.forEach((card) => {
    const tile = createTileElement(card);
    setTileFace(tile, card.type);
    tile.addEventListener("click", () => onTileClick(card.id));
    boardEl.appendChild(tile);
    tileElements.set(card.id, tile);
  });
  return tileElements;
}

export function applyFlip(tileElements, cardId) {
  const tile = tileElements.get(cardId);
  if (tile) flipTileVisual(tile, true);
}

export function applyUnflip(tileElements, cardId) {
  const tile = tileElements.get(cardId);
  if (tile) flipTileVisual(tile, false);
}

export function applyMatched(tileElements, cardIds) {
  cardIds.forEach((id) => {
    const tile = tileElements.get(id);
    if (tile) markTileMatched(tile);
  });
}

export function applyMismatch(tileElements, cardIds) {
  cardIds.forEach((id) => {
    const tile = tileElements.get(id);
    if (tile) shakeTile(tile);
  });
}
