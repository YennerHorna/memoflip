// ui/hud.js
const CLASSIC_LABELS = { time: "Tiempo", moves: "Movimientos", matches: "Parejas", best: "Mejor" };
const SEQUENCE_LABELS = { time: "Nivel", moves: "Vidas", matches: "Paso", best: "Mejor" };
const NBACK_LABELS = { time: "Nivel", moves: "Aciertos", matches: "Carta", best: "Mejor" };

export function createHud(root) {
  const els = {
    time: root.querySelector("#timeStat"),
    moves: root.querySelector("#movesStat"),
    matches: root.querySelector("#matchStat"),
    total: root.querySelector("#totalStat"),
    best: root.querySelector("#bestStat"),
    status: root.querySelector("#gameStatus"),
  };
  const labelEls = {};
  root.querySelectorAll("[data-stat-label]").forEach((el) => {
    labelEls[el.dataset.statLabel] = el;
  });

  function setLabels(labels) {
    Object.entries(labels).forEach(([key, text]) => {
      if (labelEls[key]) labelEls[key].textContent = text;
    });
  }

  return {
    setTime(seconds) { els.time.textContent = `${seconds}s`; },
    setMoves(moves) { els.moves.textContent = String(moves); },
    setMatches(matched, total) {
      els.matches.textContent = String(matched);
      els.total.textContent = String(total);
    },
    setBest(best) {
      els.best.textContent = best ? `${best.seconds}s / ${best.moves} mov.` : "—";
    },
    reset(total) {
      this.setTime(0);
      this.setMoves(0);
      this.setMatches(0, total);
    },

    useClassicLabels() {
      setLabels(CLASSIC_LABELS);
      this.setStatus("");
    },
    useSequenceLabels() { setLabels(SEQUENCE_LABELS); },
    setLevel(level) { els.time.textContent = String(level); },
    setLives(lives) { els.moves.textContent = "♥".repeat(lives) || "0"; },
    setBestLength(length) { els.best.textContent = length ? `Nivel ${length}` : "—"; },

    useNBackLabels() { setLabels(NBACK_LABELS); },
    setNBackLevel(n) { els.time.textContent = `${n}-back`; },
    setHits(hits) { els.moves.textContent = String(hits); },
    setBestAccuracy(accuracy) { els.best.textContent = accuracy == null ? "—" : `${accuracy}%`; },
    setStatus(text) {
      if (!els.status) return;
      els.status.textContent = text;
      els.status.classList.toggle("hidden", !text);
    },
  };
}
