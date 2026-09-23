// ui/tile.js
import { getCardImagePath, backFrameName } from "./spriteSheet.js";

export function createTileElement(card) {
  const tile = document.createElement("div");
  tile.className = "tile";
  tile.dataset.id = String(card.id);
  tile.setAttribute("role", "button");
  tile.setAttribute("aria-label", "Carta boca abajo");
  tile.tabIndex = 0;
  tile.innerHTML = `
    <div class="tile-inner">
      <div class="face back"></div>
      <div class="face front"></div>
    </div>
  `;
  return tile;
}

function applyCardImage(faceEl, frameName) {
  faceEl.style.backgroundImage = `url("${getCardImagePath(frameName)}")`;
  faceEl.style.backgroundSize = "contain";
  faceEl.style.backgroundPosition = "center";
}

export function setTileFace(tile, cardType) {
  const back = tile.querySelector(".face.back");
  const front = tile.querySelector(".face.front");
  applyCardImage(back, backFrameName());
  applyCardImage(front, cardType);
}

export function flipTileVisual(tile, isFlipped) {
  tile.classList.toggle("flipped", isFlipped);
  tile.setAttribute("aria-label", isFlipped ? "Carta boca arriba" : "Carta boca abajo");
}

export function markTileMatched(tile) {
  tile.classList.add("matched", "flipped");
}

export function shakeTile(tile) {
  tile.classList.add("shake");
  setTimeout(() => tile.classList.remove("shake", "flipped"), 500);
}
