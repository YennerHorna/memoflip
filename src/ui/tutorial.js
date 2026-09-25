// ui/tutorial.js
// Overlay de tutorial paso a paso con una demo animada por paso.
// Solo pinta: el guion de cada demo lo define cada modo (modes/<modo>/tutorial.js).
//
// Formato de `step.demo`:
//   cards:    tipos de carta del mini tablero (todas empiezan boca abajo)
//   cols:     columnas del mini tablero (por defecto, todas en una fila)
//   button:   texto de un botón de respuesta opcional (N-back)
//   duration: ms que dura una vuelta; al terminar se reinicia en bucle
//   timeline: [{ t, ...acción }] con acciones:
//     flip: i | unflip: i | tap: i | "button" | match: [i...] | wrong: [i...]
//     face: i + type (cambia la figura) | badge: i + text (null = quitar) | caption: texto
import { createTileElement, setTileFace, flipTileVisual, markTileMatched, shakeTile } from "./tile.js";

const HAND_SVG = `<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
  <path d="M9 11V4.5a1.5 1.5 0 0 1 3 0V10m0-.5V3.5a1.5 1.5 0 0 1 3 0V10m0-5a1.5 1.5 0 0 1 3 0v8c0 4-2.5 7-6.5 7S6 17.5 4.4 14.8L2.9 12.3a1.5 1.5 0 0 1 2.4-1.8L7.5 13V6a1.5 1.5 0 0 1 3 0v4.5"
    fill="#fff" stroke="#1c1e26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

function createDemo(container, demo) {
  const timers = [];
  let tiles = [];
  let badges = [];
  let button = null;
  let hand = null;
  let captionEl = null;

  function build() {
    container.innerHTML = "";
    const stage = document.createElement("div");
    stage.className = "demo-stage";

    const grid = document.createElement("div");
    grid.className = "demo-grid";
    grid.style.gridTemplateColumns = `repeat(${demo.cols ?? demo.cards.length}, var(--demo-card))`;
    tiles = demo.cards.map((type, i) => {
      const tile = createTileElement({ id: i });
      tile.removeAttribute("role");
      tile.removeAttribute("tabindex");
      tile.setAttribute("aria-hidden", "true");
      setTileFace(tile, type);
      grid.appendChild(tile);
      return tile;
    });
    badges = tiles.map(() => null);
    stage.appendChild(grid);

    if (demo.button) {
      button = document.createElement("span");
      button.className = "demo-button";
      button.textContent = demo.button;
      stage.appendChild(button);
    }

    hand = document.createElement("div");
    hand.className = "demo-hand";
    hand.innerHTML = HAND_SVG;
    stage.appendChild(hand);

    captionEl = document.createElement("p");
    captionEl.className = "demo-caption";

    container.appendChild(stage);
    container.appendChild(captionEl);
  }

  function targetEl(target) {
    return target === "button" ? button : tiles[target];
  }

  function moveHand(target) {
    const el = targetEl(target);
    if (!el) return;
    const stageBox = hand.parentElement.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    const x = box.left - stageBox.left + box.width * 0.45;
    const y = box.top - stageBox.top + box.height * 0.55;
    hand.style.transform = `translate(${x}px, ${y}px)`;
    hand.classList.add("visible");
    hand.classList.remove("tapping");
    // Forzar reflow para reiniciar la animación del toque.
    void hand.offsetWidth;
    hand.classList.add("tapping");
    if (target === "button") {
      button.classList.add("pressed");
      setTimeout(() => button.classList.remove("pressed"), 250);
    }
  }

  function setBadge(i, text) {
    badges[i]?.remove();
    badges[i] = null;
    if (text == null) return;
    const b = document.createElement("span");
    b.className = "tutorial-badge";
    b.textContent = text;
    tiles[i].appendChild(b);
    badges[i] = b;
  }

  function run(action) {
    if ("flip" in action) flipTileVisual(tiles[action.flip], true);
    if ("unflip" in action) flipTileVisual(tiles[action.unflip], false);
    if ("tap" in action) moveHand(action.tap);
    if ("face" in action) setTileFace(tiles[action.face], action.type);
    if ("badge" in action) setBadge(action.badge, action.text);
    if ("match" in action) action.match.forEach((i) => markTileMatched(tiles[i]));
    if ("wrong" in action) action.wrong.forEach((i) => shakeTile(tiles[i]));
    if ("caption" in action) captionEl.textContent = action.caption;
  }

  function loop() {
    build();
    demo.timeline.forEach((action) => timers.push(setTimeout(() => run(action), action.t)));
    timers.push(setTimeout(loop, demo.duration));
  }

  loop();
  return {
    destroy() {
      timers.forEach(clearTimeout);
      container.innerHTML = "";
    },
  };
}

export function createTutorial(root) {
  const overlay = root.querySelector("#tutorialOverlay");
  const titleEl = root.querySelector("#tutorialTitle");
  const textEl = root.querySelector("#tutorialText");
  const artEl = root.querySelector("#tutorialArt");
  const dotsEl = root.querySelector("#tutorialDots");
  const prevBtn = root.querySelector("#tutorialPrevBtn");
  const nextBtn = root.querySelector("#tutorialNextBtn");
  const skipBtn = root.querySelector("#tutorialSkipBtn");

  let steps = [];
  let index = 0;
  let onClose = null;
  let demo = null;

  function render() {
    const step = steps[index];
    titleEl.textContent = step.title;
    textEl.textContent = step.text;

    demo?.destroy();
    demo = null;
    artEl.classList.toggle("hidden", !step.demo);
    if (step.demo) demo = createDemo(artEl, step.demo);

    dotsEl.innerHTML = steps.map((_, i) => `<span class="${i === index ? "active" : ""}"></span>`).join("");
    prevBtn.classList.toggle("invisible", index === 0);
    const isLast = index === steps.length - 1;
    nextBtn.textContent = isLast ? "¡A jugar!" : "Siguiente";
    skipBtn.classList.toggle("invisible", isLast);
  }

  function close() {
    demo?.destroy();
    demo = null;
    overlay.classList.remove("show");
    const cb = onClose;
    onClose = null;
    cb?.();
  }

  prevBtn.addEventListener("click", () => {
    if (index > 0) { index--; render(); }
  });
  nextBtn.addEventListener("click", () => {
    if (index < steps.length - 1) { index++; render(); } else close();
  });
  skipBtn.addEventListener("click", close);

  return {
    show(newSteps, closeCallback) {
      steps = newSteps;
      index = 0;
      onClose = closeCallback;
      // Mostrar antes de renderizar: la mano necesita medir posiciones reales.
      overlay.classList.add("show");
      render();
      nextBtn.focus();
    },
  };
}
