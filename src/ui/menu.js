// ui/menu.js
// Pantalla de inicio: elegir modo y dificultad antes de jugar.
export function createMenu(root, { onPlay }) {
  const modeGroup = root.querySelector("#modeGroup");
  const diffGroup = root.querySelector("#diffGroup");
  const playBtn = root.querySelector("#playBtn");

  let selectedMode = modeGroup.querySelector("button.active")?.dataset.mode ?? "classic";
  let selectedDiff = diffGroup.querySelector("button.active")?.dataset.diff ?? "4x4";

  modeGroup.querySelectorAll("button[data-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      selectedMode = btn.dataset.mode;
      modeGroup.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  diffGroup.querySelectorAll("button[data-diff]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedDiff = btn.dataset.diff;
      diffGroup.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  playBtn.addEventListener("click", () => onPlay(selectedMode, selectedDiff));
}
