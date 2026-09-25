// ui/modals.js
export function createWinModal(root, onPlayAgain) {
  const overlay = root.querySelector("#winOverlay");
  const titleEl = root.querySelector("#winTitle");
  const timeEl = root.querySelector("#winTime");
  const movesEl = root.querySelector("#winMoves");
  const bestEl = root.querySelector("#winBest");
  const playAgainBtn = root.querySelector("#playAgainBtn");

  playAgainBtn.addEventListener("click", () => {
    overlay.classList.remove("show");
    onPlayAgain();
  });

  return {
    show({ seconds, moves, isNewBest }) {
      this.showSummary({ title: "¡Completado!", primary: `${seconds}s`, secondary: `${moves} movimientos`, isNewBest });
    },
    showSummary({ title, primary, secondary, isNewBest }) {
      titleEl.textContent = title;
      timeEl.textContent = primary;
      movesEl.textContent = secondary;
      bestEl.innerHTML = isNewBest
        ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"></path><path d="M8 5H5a3 3 0 0 0 3 5"></path><path d="M16 5h3a3 3 0 0 1-3 5"></path><path d="M12 13v3"></path><path d="M9 20h6"></path><path d="M10 16.5h4l.5 3.5h-5l.5-3.5Z"></path></svg> ¡Nuevo mejor resultado!'
        : "";
      overlay.classList.add("show");
    },
    // Texto extra bajo el resultado, en el hueco de "nuevo mejor resultado" si está libre.
    setNote(text) {
      if (!bestEl.textContent) bestEl.textContent = text;
    },
    hide() { overlay.classList.remove("show"); },
  };
}
