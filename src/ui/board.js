// ui/board.js
import { createTileElement, setTileFace, flipTileVisual, markTileMatched, shakeTile } from "./tile.js";

export function renderBoard(boardEl, deck, cols, onTileClick) {
  boardEl.className = "board";
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  // board.css usa --cols/--rows para que el tablero quepa entero en pantalla.
  boardEl.style.setProperty("--cols", cols);
  boardEl.style.setProperty("--rows", Math.ceil(deck.length / cols));
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
