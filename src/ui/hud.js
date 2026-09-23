// ui/hud.js
export function createHud(root) {
  const els = {
    time: root.querySelector("#timeStat"),
    moves: root.querySelector("#movesStat"),
    matches: root.querySelector("#matchStat"),
    total: root.querySelector("#totalStat"),
    best: root.querySelector("#bestStat"),
  };
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
  };
}
