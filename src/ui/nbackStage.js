// ui/nbackStage.js
// Escenario del modo N-back: una sola carta en el centro y el botón "¡Coincide!".
import { createTileElement, setTileFace, flipTileVisual } from "./tile.js";

const FEEDBACK = {
  hit: { text: "¡Bien! Era una coincidencia", cls: "good" },
  falseAlarm: { text: "No coincidía", cls: "bad" },
  miss: { text: "Se te pasó una coincidencia", cls: "bad" },
};

export function renderNBackStage(boardEl, onRespond) {
  boardEl.className = "board nback-board";
  boardEl.removeAttribute("style");
  boardEl.innerHTML = `
    <div class="nback-card-slot"></div>
    <p class="nback-feedback" aria-live="polite"></p>
    <button class="primary nback-btn" type="button">¡Coincide! <kbd>Espacio</kbd></button>
  `;
  const slot = boardEl.querySelector(".nback-card-slot");
  const feedbackEl = boardEl.querySelector(".nback-feedback");
  const button = boardEl.querySelector(".nback-btn");

  const tile = createTileElement({ id: 0 });
  tile.removeAttribute("role");
  tile.removeAttribute("tabindex");
  slot.appendChild(tile);

  let feedbackTimer = null;

  button.addEventListener("click", onRespond);
  function onKey(e) {
    if (e.code !== "Space" && e.code !== "Enter") return;
    if (e.repeat) return;
    e.preventDefault();
    onRespond();
  }
  document.addEventListener("keydown", onKey);

  return {
    showCard(type) {
      setTileFace(tile, type);
      flipTileVisual(tile, true);
      tile.classList.remove("hit", "shake");
    },
    hideCard() { flipTileVisual(tile, false); },
    setButtonEnabled(enabled) { button.disabled = !enabled; },
    feedback(kind) {
      const { text, cls } = FEEDBACK[kind];
      feedbackEl.textContent = text;
      feedbackEl.className = `nback-feedback ${cls}`;
      if (kind === "hit") tile.classList.add("hit");
      // La animación "shake" asume la carta boca arriba; si ya se tapó, no se sacude.
      if (kind === "falseAlarm" && tile.classList.contains("flipped")) tile.classList.add("shake");
      clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(() => {
        feedbackEl.textContent = "";
        tile.classList.remove("shake");
      }, 1100);
    },
    destroy() {
      clearTimeout(feedbackTimer);
      document.removeEventListener("keydown", onKey);
    },
  };
}
