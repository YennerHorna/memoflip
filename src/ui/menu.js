// ui/menu.js
// Pantalla de inicio: elegir modo y dificultad antes de jugar.
// `difficultiesByMode` = { [modeId]: { [diffKey]: { label, description } } }: cada modo tiene sus propias dificultades.
export function createMenu(root, { onPlay, difficultiesByMode }) {
  const modeGroup = root.querySelector("#modeGroup");
  const diffGroup = root.querySelector("#diffGroup");
  const playBtn = root.querySelector("#playBtn");
  const diffDescription = root.querySelector("#diffDescription");

  let selectedMode = modeGroup.querySelector("button.active")?.dataset.mode ?? "classic";
  const selectedDiffByMode = {};

  function updateDescription() {
    const diff = difficultiesByMode[selectedMode][selectedDiffByMode[selectedMode]];
    diffDescription.textContent = diff.description ?? "";
  }

  function renderDifficulties() {
    const difficulties = difficultiesByMode[selectedMode];
    const keys = Object.keys(difficulties);
    if (!keys.includes(selectedDiffByMode[selectedMode])) selectedDiffByMode[selectedMode] = keys[0];

    diffGroup.innerHTML = "";
    keys.forEach((key) => {
      const btn = document.createElement("button");
      btn.dataset.diff = key;
      btn.textContent = difficulties[key].label;
      btn.classList.toggle("active", key === selectedDiffByMode[selectedMode]);
      btn.addEventListener("click", () => {
        selectedDiffByMode[selectedMode] = key;
        diffGroup.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        updateDescription();
      });
      diffGroup.appendChild(btn);
    });
    updateDescription();
  }

  modeGroup.querySelectorAll("button[data-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      selectedMode = btn.dataset.mode;
      modeGroup.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderDifficulties();
    });
  });

  renderDifficulties();
  playBtn.addEventListener("click", () => onPlay(selectedMode, selectedDiffByMode[selectedMode]));
}
