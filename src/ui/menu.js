// ui/menu.js
// Pantalla de inicio: elegir modo y dificultad antes de jugar.
// `difficultiesByMode` = { [modeId]: { [diffKey]: { label, description } } }: cada modo tiene sus propias dificultades.
// El modo "custom" no usa dificultades: al pulsar "Jugar" se abre su propio panel (reloj + tamaño)
// y, al pulsar "Jugar" de nuevo, entrega la configuración como tercer argumento de
// `onPlay(modeId, diffKey, customConfig)`.
import { createCustomPanel } from "./customPanel.js";

export function createMenu(root, { onPlay, difficultiesByMode, initialCustomConfig }) {
  const modeGroup = root.querySelector("#modeGroup");
  const diffGroup = root.querySelector("#diffGroup");
  const playBtn = root.querySelector("#playBtn");
  const diffDescription = root.querySelector("#diffDescription");
  const diffSection = root.querySelector("#diffSection");
  const customSection = root.querySelector("#customSection");
  const menuScreen = root.querySelector("#menuScreen");
  const customInfo = root.querySelector("#customInfo");
  const customBackBtn = root.querySelector("#customBackBtn");

  let selectedMode = modeGroup.querySelector("button.active")?.dataset.mode ?? "classic";
  const selectedDiffByMode = {};

  const isCustom = () => selectedMode === "custom";
  // Segundo paso del modo personalizado: se ve su panel de configuración en lugar de los modos.
  let inCustomSetup = false;

  // `custom` se asigna después: el panel avisa de su estado ya al crearse.
  let custom = null;
  function updatePlayState() {
    playBtn.disabled = inCustomSetup && custom !== null && !custom.isValid();
  }
  custom = createCustomPanel(root, { onChange: updatePlayState });
  custom.setConfig(initialCustomConfig);

  function updateDescription() {
    const diff = difficultiesByMode[selectedMode][selectedDiffByMode[selectedMode]];
    diffDescription.textContent = diff.description ?? "";
  }

  function renderDifficulties() {
    diffSection.classList.toggle("hidden", isCustom());
    customSection.classList.toggle("hidden", !inCustomSetup);
    menuScreen.classList.toggle("is-custom", inCustomSetup);
    customInfo.classList.toggle("hidden", !inCustomSetup);
    updatePlayState();
    if (isCustom()) return;

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

  function setCustomSetup(value) {
    inCustomSetup = value;
    renderDifficulties();
  }

  customBackBtn.addEventListener("click", () => setCustomSetup(false));

  renderDifficulties();
  playBtn.addEventListener("click", () => {
    if (isCustom()) {
      if (!inCustomSetup) {
        setCustomSetup(true);
        return;
      }
      if (!custom.isValid()) return;
      onPlay("custom", null, custom.getConfig());
      return;
    }
    onPlay(selectedMode, selectedDiffByMode[selectedMode]);
  });

  // Al volver del juego se muestra la lista de modos, no el panel personalizado.
  return { showModes: () => setCustomSetup(false) };
}
