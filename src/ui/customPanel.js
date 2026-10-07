// ui/customPanel.js
// Panel del modo personalizado en el menú: reloj (temporizador/cronómetro), tiempo y tamaño del tablero.
// Solo lee y pinta el formulario; las reglas de validación viven en core/custom.js.
import { CLOCKS, validateCustomConfig, formatClock } from "../core/custom.js";

export function createCustomPanel(root, { onChange }) {
  const clockGroup = root.querySelector("#clockGroup");
  const clockDescription = root.querySelector("#clockDescription");
  const timeRow = root.querySelector("#timeRow");
  const minInput = root.querySelector("#customMin");
  const secInput = root.querySelector("#customSec");
  const colsInput = root.querySelector("#customCols");
  const rowsInput = root.querySelector("#customRows");
  const info = root.querySelector("#customInfo");

  let clock = "timer";
  const inputs = [minInput, secInput, colsInput, rowsInput];

  const toNumber = (el) => (el.value.trim() === "" ? null : Number(el.value));

  function getDurationSec() {
    const min = toNumber(minInput);
    const sec = toNumber(secInput);
    if (min == null && sec == null) return null;
    return (min ?? 0) * 60 + (sec ?? 0);
  }

  function getConfig() {
    return {
      clock,
      durationSec: clock === "timer" ? getDurationSec() : null,
      cols: toNumber(colsInput),
      rows: toNumber(rowsInput),
    };
  }

  function isValid() {
    return validateCustomConfig(getConfig()).ok;
  }

  function refresh() {
    const config = getConfig();
    const result = validateCustomConfig(config);
    const touched = inputs.some((el) => el.value.trim() !== "");

    if (result.ok) {
      const parts = [`${result.cards} cartas · ${result.pairs} parejas`];
      if (clock === "timer") parts.push(`${formatClock(config.durationSec)} de tiempo`);
      info.textContent = parts.join(" · ");
    } else {
      info.textContent = result.error;
    }
    info.classList.toggle("bad", !result.ok && touched);
    onChange(result.ok);
  }

  function setClock(value) {
    clock = value;
    clockGroup.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.clock === value));
    clockDescription.textContent = CLOCKS[value].description;
    timeRow.classList.toggle("hidden", value !== "timer");
    refresh();
  }

  clockGroup.querySelectorAll("button[data-clock]").forEach((btn) => {
    btn.addEventListener("click", () => setClock(btn.dataset.clock));
  });

  // Solo dígitos y 2 caracteres como máximo (el tablero llega a 10 y el tiempo a 99 min).
  inputs.forEach((el) => {
    el.addEventListener("input", () => {
      el.value = el.value.replace(/\D/g, "").slice(0, 2);
      refresh();
    });
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter") document.getElementById("playBtn")?.click();
    });
  });

  setClock("timer");

  return {
    getConfig,
    isValid,
    // Restaura la última configuración usada (las casillas quedan vacías la primera vez).
    setConfig(saved) {
      if (!saved || !CLOCKS[saved.clock]) return;
      if (saved.durationSec) {
        minInput.value = String(Math.floor(saved.durationSec / 60));
        secInput.value = String(saved.durationSec % 60);
      }
      if (saved.cols) colsInput.value = String(saved.cols);
      if (saved.rows) rowsInput.value = String(saved.rows);
      setClock(saved.clock);
    },
  };
}
