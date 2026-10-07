// ui/modals.js
export function createWinModal(root, onPlayAgain) {
  const overlay = root.querySelector("#winOverlay");
  const titleEl = root.querySelector("#winTitle");
  const iconEl = root.querySelector("#winIcon");
  const CHECK_ICON = '<circle cx="12" cy="12" r="9"></circle><path d="M8 12.4 10.6 15 16 9.5"></path>';
  const CLOCK_ICON = '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>';
  const timeEl = root.querySelector("#winTime");
  const movesEl = root.querySelector("#winMoves");
  const bestEl = root.querySelector("#winBest");
  const playAgainBtn = root.querySelector("#playAgainBtn");
  const rankingSection = root.querySelector("#rankingSection");
  const recordForm = root.querySelector("#recordForm");
  const recordName = root.querySelector("#recordName");
  const rankingBoard = root.querySelector("#rankingBoard");
  const rankingLabel = root.querySelector("#rankingLabel");
  const rankingList = root.querySelector("#rankingList");
  const rankingEmpty = root.querySelector("#rankingEmpty");

  // Ranking de la partida mostrada (ver modes/ranking.js), o null si no hay.
  let ranking = null;

  function renderRankingList(entries, highlight = -1) {
    rankingLabel.textContent = ranking.label;
    rankingList.innerHTML = "";
    entries.forEach((entry, index) => {
      const li = document.createElement("li");
      li.classList.toggle("current", index === highlight);
      const pos = document.createElement("span");
      pos.className = "ranking-pos";
      pos.textContent = String(index + 1);
      const name = document.createElement("span");
      name.className = "ranking-name";
      name.textContent = entry.name; // textContent: el nombre lo escribe el jugador
      const score = document.createElement("span");
      score.className = "ranking-score";
      score.textContent = ranking.format(entry);
      li.append(pos, name, score);
      rankingList.appendChild(li);
    });
    rankingEmpty.classList.toggle("hidden", entries.length > 0);
    rankingBoard.classList.remove("hidden");
  }

  function showRanking(next) {
    ranking = next ?? null;
    rankingSection.classList.toggle("hidden", !ranking);
    recordForm.classList.add("hidden");
    rankingBoard.classList.add("hidden");
    if (!ranking) return;
    if (ranking.canSave) {
      // Primero el nombre; la lista aparece al guardar.
      recordName.value = ranking.defaultName;
      recordForm.classList.remove("hidden");
      recordName.focus();
      recordName.select();
    } else if (ranking.entries.length > 0) {
      renderRankingList(ranking.entries);
    } else {
      rankingSection.classList.add("hidden");
    }
  }

  recordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!ranking) return;
    const saved = ranking.save(recordName.value);
    if (!saved) {
      recordName.focus();
      return;
    }
    recordForm.classList.add("hidden");
    renderRankingList(saved.entries, saved.position);
  });

  playAgainBtn.addEventListener("click", () => {
    overlay.classList.remove("show");
    onPlayAgain();
  });

  return {
    show({ seconds, moves, isNewBest, ranking }) {
      this.showSummary({ title: "¡Completado!", primary: `${seconds}s`, secondary: `${moves} movimientos`, isNewBest, ranking });
    },
    // `failed` = resultado negativo (ej. se acabó el tiempo): ícono de reloj y color de aviso.
    // `ranking` (opcional) = objeto de modes/ranking.js: pide el nombre si el resultado entra y
    // al final muestra la lista.
    showSummary({ title, primary, secondary, isNewBest, failed = false, ranking: nextRanking = null }) {
      titleEl.textContent = title;
      iconEl.innerHTML = failed ? CLOCK_ICON : CHECK_ICON;
      titleEl.parentElement.classList.toggle("failed", failed);
      timeEl.textContent = primary;
      movesEl.textContent = secondary;
      bestEl.innerHTML = isNewBest
        ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"></path><path d="M8 5H5a3 3 0 0 0 3 5"></path><path d="M16 5h3a3 3 0 0 1-3 5"></path><path d="M12 13v3"></path><path d="M9 20h6"></path><path d="M10 16.5h4l.5 3.5h-5l.5-3.5Z"></path></svg> ¡Nuevo mejor resultado!'
        : "";
      overlay.classList.add("show");
      showRanking(nextRanking);
    },
    // Texto extra bajo el resultado, en el hueco de "nuevo mejor resultado" si está libre.
    setNote(text) {
      if (!bestEl.textContent) bestEl.textContent = text;
    },
    hide() {
      overlay.classList.remove("show");
      ranking = null;
    },
  };
}
