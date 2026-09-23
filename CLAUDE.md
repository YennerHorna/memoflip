# MemoFlip — Contexto del proyecto

Este documento es el contexto completo para construir el proyecto. Léelo entero antes de crear archivos.

## 1. Qué es este proyecto

**MemoFlip** es un juego web de memoria (tipo "cartas de parejas" / concentración) pensado como
entrenador cognitivo de sesiones cortas (5–10 min). El jugador voltea cartas en un tablero y busca
encontrar las parejas iguales en el menor tiempo y número de movimientos posible.

El diseño no es arbitrario: cada mecánica está anclada en literatura de psicología cognitiva:

- **Curva del olvido / repetición espaciada** (Ebbinghaus) → las cartas que el jugador falla deben
  reaparecer más adelante, no desaparecer ni repetirse de inmediato.
- **Efecto de la prueba / testing effect** (Roediger & Karpicke) → el juego siempre exige *recordar
  activamente*, nunca solo "mostrar" la información.
- **Memoria de trabajo** (Baddeley & Hitch) → los modos futuros "Secuencia" y "N-back" entrenan la
  agenda visoespacial y el ejecutivo central.

Actualmente solo está implementado el **Modo Clásico** (parejas). Los modos "Secuencia" y "N-back"
están planeados pero no implementados — sus carpetas pueden existir vacías o no crearse todavía,
a tu criterio.

## 2. Alcance actual: SOLO WEB

Por ahora el proyecto es **exclusivamente para navegador web** (desktop y móvil vía navegador
responsive). NO agregues todavía:
- Capacitor, Android/iOS nativos
- `manifest.json` / `service-worker.js` (PWA) — se añadirán en una fase posterior
- Ningún framework (React, Vue, etc.) — el proyecto es JavaScript vanilla a propósito, por
  simplicidad y porque el equipo aún está prototipando

## 3. Stack tecnológico

- **JavaScript (ES6+ con módulos ES nativos, `type="module"`)** — sin bundler ni transpiler por ahora
- **HTML5**
- **CSS3** (variables de tema para soportar modo claro/oscuro vía `prefers-color-scheme`)
- Sin dependencias de runtime. Como dependencia de desarrollo alcanza con un servidor estático
  (ej. paquete `serve`), porque el juego usa `fetch()` para cargar el JSON de la sprite sheet y
  **eso falla si se abre el `index.html` directo con `file://`** — debe servirse por HTTP.

## 4. Principio de arquitectura (MUY IMPORTANTE, no romper esta separación)

- **`core/`** → lógica pura del juego. **Cero referencias al DOM** (nada de `document`, `window`,
  `querySelector`, etc.). Solo trabaja con datos (arrays, objetos). Debe poder ejecutarse en Node
  sin un navegador, para poder testearse fácil.
- **`ui/`** → la única capa que toca el DOM (crear elementos, `classList`, `addEventListener`).
  No contiene reglas del juego — solo pinta lo que `core/` decide.
- **`services/`** → infraestructura del navegador aislada (localStorage, audio). Si mañana se
  cambia `localStorage` por una API, solo se toca este archivo.
- **`modes/`** → conecta `core/` + `ui/` para un modo de juego específico (ej. `classicMode.js`).
  Los distintos modos comparten `core/` pero tienen su propio flujo.

## 5. Estructura de carpetas objetivo (solo web)

```
memoflip/
├── src/
│   ├── assets/
│   │   └── sprites/
│   │       ├── memoflip_card_faces_spritesheet.png
│   │       ├── memoflip_card_faces_spritesheet.json
│   │       ├── memoflip_flip_animations_spritesheet.png
│   │       └── memoflip_flip_animations_spritesheet.json
│   │
│   ├── core/
│   │   ├── deck.js
│   │   ├── difficulty.js
│   │   ├── gameState.js
│   │   └── spacedRepetition.js
│   │
│   ├── modes/
│   │   └── classic/
│   │       └── classicMode.js
│   │
│   ├── ui/
│   │   ├── board.js
│   │   ├── tile.js
│   │   ├── hud.js
│   │   ├── modals.js
│   │   └── spriteSheet.js
│   │
│   ├── services/
│   │   ├── storage.js
│   │   └── audio.js
│   │
│   ├── styles/
│   │   ├── base.css
│   │   └── board.css
│   │
│   ├── app.js          # ⚠️ FALTA CREAR — ver sección 7
│   └── index.html       # ⚠️ FALTA CREAR — ver sección 7
│
├── package.json          # ⚠️ FALTA CREAR — ver sección 7
└── README.md             # ⚠️ FALTA CREAR — ver sección 7
```

## 6. Assets disponibles

Hay dos sprite sheets PNG + su JSON de metadata (deben copiarse a `src/assets/sprites/`,
se te entregan junto a este documento):

**`memoflip_card_faces_spritesheet.png` / `.json`** — cartas estáticas: 1 dorso + 18 frentes
únicos (6 formas × 3 colores). Grid 5 columnas × 4 filas, celdas de 200×280px, con el arte de la
carta centrado en 160×220px dentro de cada celda. El JSON tiene esta forma:

```json
{
  "frameWidth": 200, "frameHeight": 280,
  "columns": 5, "rows": 4,
  "cardWidth": 160, "cardHeight": 220,
  "frames": [
    { "name": "back", "index": 0, "x": 0, "y": 0 },
    { "name": "star_coral", "index": 1, "x": 200, "y": 0 },
    { "name": "star_blue", "index": 2, "x": 400, "y": 0 }
    /* ... 19 frames en total */
  ]
}
```

Los 18 nombres de tipo de carta (deben coincidir exactamente con `core/deck.js`):
`star_coral, star_blue, star_green, circle_coral, circle_blue, circle_green, diamond_coral,
diamond_blue, diamond_green, triangle_coral, triangle_blue, triangle_green, heart_coral,
heart_blue, heart_green, hexagon_coral, hexagon_blue, hexagon_green`

**`memoflip_flip_animations_spritesheet.png` / `.json`** — animación completa de volteo
(10 frames por carta × 18 cartas, una fila por carta) por si en el futuro se reemplaza el flip 3D
por CSS (`rotateY`) por una animación cuadro a cuadro. **No se usa todavía en el código actual**,
está disponible para una iteración futura.

`ui/spriteSheet.js` ya sabe leer el JSON de `memoflip_card_faces_spritesheet.json` y convertir
coordenadas en píxeles a porcentajes de `background-position` / `background-size`, para que la
carta se vea nítida sin importar el tamaño real del tile en pantalla (sprite responsive).

## 7. Archivos que ya están escritos (créalos con este contenido exacto)

> Todos los `import` son rutas relativas ES modules, no hace falta bundler.

### `src/core/deck.js`
```js
// core/deck.js
// Lógica pura: no toca el DOM. Fácil de testear y reutilizar entre modos.

export const CARD_TYPES = [
  "star_coral", "star_blue", "star_green",
  "circle_coral", "circle_blue", "circle_green",
  "diamond_coral", "diamond_blue", "diamond_green",
  "triangle_coral", "triangle_blue", "triangle_green",
  "heart_coral", "heart_blue", "heart_green",
  "hexagon_coral", "hexagon_blue", "hexagon_green",
];

export function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildDeck(pairCount) {
  if (pairCount > CARD_TYPES.length) {
    throw new Error(
      `Se pidieron ${pairCount} parejas pero solo hay ${CARD_TYPES.length} tipos de carta disponibles.`
    );
  }
  const chosenTypes = shuffle(CARD_TYPES).slice(0, pairCount);
  const doubled = shuffle(chosenTypes.concat(chosenTypes));
  return doubled.map((type, index) => ({ id: index, type, matched: false }));
}
```

### `src/core/difficulty.js`
```js
// core/difficulty.js
export const DIFFICULTIES = {
  "4x4": { label: "Fácil · 4×4", cols: 4, rows: 4 },
  "6x4": { label: "Normal · 6×4", cols: 6, rows: 4 },
  "6x6": { label: "Difícil · 6×6", cols: 6, rows: 6 },
};

export function getPairCount(diffKey) {
  const d = DIFFICULTIES[diffKey];
  if (!d) throw new Error(`Dificultad desconocida: ${diffKey}`);
  return (d.cols * d.rows) / 2;
}
```

### `src/core/gameState.js`
```js
// core/gameState.js
// Máquina de estado del juego, independiente de cómo se dibuje en pantalla.
import { buildDeck } from "./deck.js";
import { getPairCount } from "./difficulty.js";

export function createGameState(diffKey) {
  const pairCount = getPairCount(diffKey);
  return {
    diffKey,
    deck: buildDeck(pairCount),
    flippedIds: [],
    matchedCount: 0,
    moves: 0,
    seconds: 0,
    started: false,
    finished: false,
    locked: false,
  };
}

export function flipCard(state, cardId) {
  if (state.locked || state.finished) return { changed: false };

  const card = state.deck.find((c) => c.id === cardId);
  if (!card || card.matched || state.flippedIds.includes(cardId)) {
    return { changed: false };
  }

  if (!state.started) state.started = true;
  state.flippedIds.push(cardId);

  if (state.flippedIds.length < 2) {
    return { changed: true, event: "flip", cardId };
  }

  state.moves++;
  const [firstId, secondId] = state.flippedIds;
  const first = state.deck.find((c) => c.id === firstId);
  const second = state.deck.find((c) => c.id === secondId);
  const isMatch = first.type === second.type;
  state.locked = true;

  if (isMatch) {
    first.matched = true;
    second.matched = true;
    state.matchedCount++;
    state.flippedIds = [];
    state.locked = false;
    if (state.matchedCount === state.deck.length / 2) state.finished = true;
    return { changed: true, event: "match", cardIds: [firstId, secondId], won: state.finished };
  }

  return { changed: true, event: "mismatch", cardIds: [firstId, secondId] };
}

export function resolveMismatch(state) {
  state.flippedIds = [];
  state.locked = false;
}

export function tickSecond(state) {
  if (state.started && !state.finished) state.seconds++;
}
```

### `src/core/spacedRepetition.js`
```js
// core/spacedRepetition.js
// Sistema tipo Leitner: cada tipo de carta vive en una "caja" (0 a 4).
// Acierto → sube de caja (se repasa más espaciado). Falla → baja a caja 0.
const MAX_BOX = 4;

export function createSpacedRepetitionState() {
  return { boxes: {} };
}

function getBox(srState, type) {
  return srState.boxes[type] ?? 0;
}

export function recordSuccess(srState, type) {
  const current = getBox(srState, type);
  srState.boxes[type] = Math.min(MAX_BOX, current + 1);
}

export function recordFailure(srState, type) {
  srState.boxes[type] = 0;
}

export function priorityOrder(srState, allTypes) {
  return allTypes.slice().sort((a, b) => getBox(srState, a) - getBox(srState, b));
}

export function pickTypesForReview(srState, allTypes, count) {
  return priorityOrder(srState, allTypes).slice(0, count);
}
```

### `src/services/storage.js`
```js
// services/storage.js
const PREFIX = "memoflip_";

export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn("[storage] No se pudo leer", key, err);
    return fallback;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn("[storage] No se pudo guardar", key, err);
    return false;
  }
}

export function getBestResult(diffKey) {
  return getItem(`best_${diffKey}`, null);
}

export function saveBestResultIfBetter(diffKey, { seconds, moves }) {
  const current = getBestResult(diffKey);
  const isBetter =
    !current || seconds < current.seconds || (seconds === current.seconds && moves < current.moves);
  if (isBetter) setItem(`best_${diffKey}`, { seconds, moves });
  return isBetter;
}

export function getSpacedRepetitionData() {
  return getItem("spaced_repetition", { boxes: {} });
}

export function saveSpacedRepetitionData(srState) {
  setItem("spaced_repetition", srState);
}
```

### `src/services/audio.js`
```js
// services/audio.js
// Aislado a propósito: si no hay archivos de sonido todavía, el juego sigue
// funcionando y solo se registra un aviso en consola.
const sounds = {};
let enabled = true;

const SOUND_FILES = {
  flip: "../assets/sounds/flip.mp3",
  match: "../assets/sounds/match.mp3",
  win: "../assets/sounds/win.mp3",
};

export function preloadSounds() {
  Object.entries(SOUND_FILES).forEach(([name, path]) => {
    try {
      const audio = new Audio(path);
      audio.preload = "auto";
      sounds[name] = audio;
    } catch (err) {
      console.warn(`[audio] No se pudo cargar "${name}"`, err);
    }
  });
}

export function play(name) {
  if (!enabled) return;
  const audio = sounds[name];
  if (!audio) return;
  try {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch (err) {
    console.warn(`[audio] Error reproduciendo "${name}"`, err);
  }
}

export function setEnabled(value) { enabled = value; }
export function isEnabled() { return enabled; }
```

### `src/ui/spriteSheet.js`
```js
// ui/spriteSheet.js
// Traduce las coordenadas en píxeles del JSON de la sprite sheet a
// porcentajes de background-position/background-size (sprite responsive).
const SHEET_PATH = "../assets/sprites/memoflip_card_faces_spritesheet.png";
const META_PATH = "../assets/sprites/memoflip_card_faces_spritesheet.json";

let meta = null;
let framesByName = null;

export async function loadSpriteSheet() {
  if (meta) return meta;
  const res = await fetch(META_PATH);
  meta = await res.json();
  framesByName = new Map(meta.frames.map((f) => [f.name, f]));
  return meta;
}

export function getSheetPath() { return SHEET_PATH; }

export function getFrameStyle(name) {
  if (!meta) throw new Error("loadSpriteSheet() debe resolverse antes de pedir frames.");
  const frame = framesByName.get(name);
  if (!frame) throw new Error(`No existe el frame de sprite "${name}"`);

  const col = frame.x / meta.frameWidth;
  const row = frame.y / meta.frameHeight;
  const sizeXPercent = meta.columns * 100;
  const sizeYPercent = meta.rows * 100;
  const xPercent = meta.columns > 1 ? (col / (meta.columns - 1)) * 100 : 0;
  const yPercent = meta.rows > 1 ? (row / (meta.rows - 1)) * 100 : 0;

  return { xPercent, yPercent, sizeXPercent, sizeYPercent };
}

export function backFrameName() { return "back"; }
```

### `src/ui/tile.js`
```js
// ui/tile.js
import { getFrameStyle, getSheetPath, backFrameName } from "./spriteSheet.js";

export function createTileElement(card) {
  const tile = document.createElement("div");
  tile.className = "tile";
  tile.dataset.id = String(card.id);
  tile.setAttribute("role", "button");
  tile.setAttribute("aria-label", "Carta boca abajo");
  tile.tabIndex = 0;
  tile.innerHTML = `
    <div class="tile-inner">
      <div class="face back"></div>
      <div class="face front"></div>
    </div>
  `;
  return tile;
}

function applySpriteFrame(faceEl, frameName) {
  const { xPercent, yPercent, sizeXPercent, sizeYPercent } = getFrameStyle(frameName);
  faceEl.style.backgroundImage = `url("${getSheetPath()}")`;
  faceEl.style.backgroundSize = `${sizeXPercent}% ${sizeYPercent}%`;
  faceEl.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
}

export function setTileFace(tile, cardType) {
  const back = tile.querySelector(".face.back");
  const front = tile.querySelector(".face.front");
  applySpriteFrame(back, backFrameName());
  applySpriteFrame(front, cardType);
}

export function flipTileVisual(tile, isFlipped) {
  tile.classList.toggle("flipped", isFlipped);
  tile.setAttribute("aria-label", isFlipped ? "Carta boca arriba" : "Carta boca abajo");
}

export function markTileMatched(tile) {
  tile.classList.add("matched", "flipped");
}

export function shakeTile(tile) {
  tile.classList.add("shake");
  setTimeout(() => tile.classList.remove("shake", "flipped"), 500);
}
```

### `src/ui/board.js`
```js
// ui/board.js
import { DIFFICULTIES } from "../core/difficulty.js";
import { createTileElement, setTileFace, flipTileVisual, markTileMatched, shakeTile } from "./tile.js";

export function renderBoard(boardEl, deck, diffKey, onTileClick) {
  const { cols } = DIFFICULTIES[diffKey];
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  boardEl.innerHTML = "";

  const tileElements = new Map();
  deck.forEach((card) => {
    const tile = createTileElement(card);
    setTileFace(tile, card.type);
    tile.addEventListener("click", () => onTileClick(card.id));
    boardEl.appendChild(tile);
    tileElements.set(card.id, tile);
  });
  return tileElements;
}

export function applyFlip(tileElements, cardId) {
  const tile = tileElements.get(cardId);
  if (tile) flipTileVisual(tile, true);
}

export function applyUnflip(tileElements, cardId) {
  const tile = tileElements.get(cardId);
  if (tile) flipTileVisual(tile, false);
}

export function applyMatched(tileElements, cardIds) {
  cardIds.forEach((id) => {
    const tile = tileElements.get(id);
    if (tile) markTileMatched(tile);
  });
}

export function applyMismatch(tileElements, cardIds) {
  cardIds.forEach((id) => {
    const tile = tileElements.get(id);
    if (tile) shakeTile(tile);
  });
}
```

### `src/ui/hud.js`
```js
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
```

### `src/ui/modals.js`
```js
// ui/modals.js
export function createWinModal(root, onPlayAgain) {
  const overlay = root.querySelector("#winOverlay");
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
      timeEl.textContent = `${seconds}s`;
      movesEl.textContent = `${moves} movimientos`;
      bestEl.textContent = isNewBest ? "🏆 ¡Nuevo mejor resultado!" : "";
      overlay.classList.add("show");
    },
    hide() { overlay.classList.remove("show"); },
  };
}
```

### `src/modes/classic/classicMode.js`
```js
// modes/classic/classicMode.js
// Orquesta un modo de juego: toma decisiones del "core" y le pide a "ui" que las pinte.
import { createGameState, flipCard, resolveMismatch, tickSecond } from "../../core/gameState.js";
import { recordSuccess, recordFailure } from "../../core/spacedRepetition.js";
import { renderBoard, applyFlip, applyUnflip, applyMatched, applyMismatch } from "../../ui/board.js";
import { getBestResult, saveBestResultIfBetter, getSpacedRepetitionData, saveSpacedRepetitionData } from "../../services/storage.js";
import * as audio from "../../services/audio.js";

export function createClassicMode({ boardEl, hud, winModal, diffKey }) {
  let state = createGameState(diffKey);
  let tileElements = null;
  let timerId = null;
  const srState = getSpacedRepetitionData();

  function start() {
    stopTimer();
    state = createGameState(diffKey);
    hud.reset(state.deck.length / 2);
    hud.setBest(getBestResult(diffKey));
    winModal.hide();
    tileElements = renderBoard(boardEl, state.deck, diffKey, handleTileClick);
  }

  function startTimer() {
    if (timerId) return;
    timerId = setInterval(() => {
      tickSecond(state);
      hud.setTime(state.seconds);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
  }

  function handleTileClick(cardId) {
    const wasStarted = state.started;
    const result = flipCard(state, cardId);
    if (!result.changed) return;
    if (!wasStarted && state.started) startTimer();

    if (result.event === "flip") {
      applyFlip(tileElements, cardId);
      audio.play("flip");
      return;
    }

    if (result.event === "match") {
      const [a, b] = result.cardIds;
      applyFlip(tileElements, b);
      applyMatched(tileElements, [a, b]);
      hud.setMoves(state.moves);
      hud.setMatches(state.matchedCount, state.deck.length / 2);
      audio.play("match");

      const type = state.deck.find((c) => c.id === a).type;
      recordSuccess(srState, type);
      saveSpacedRepetitionData(srState);

      if (result.won) onWin();
      return;
    }

    if (result.event === "mismatch") {
      const [a, b] = result.cardIds;
      applyFlip(tileElements, b);
      hud.setMoves(state.moves);

      const type = state.deck.find((c) => c.id === a).type;
      recordFailure(srState, type);
      saveSpacedRepetitionData(srState);

      setTimeout(() => {
        applyUnflip(tileElements, a);
        applyUnflip(tileElements, b);
        applyMismatch(tileElements, [a, b]);
        resolveMismatch(state);
      }, 650);
    }
  }

  function onWin() {
    stopTimer();
    const isNewBest = saveBestResultIfBetter(diffKey, { seconds: state.seconds, moves: state.moves });
    hud.setBest(getBestResult(diffKey));
    audio.play("win");
    winModal.show({ seconds: state.seconds, moves: state.moves, isNewBest });
  }

  function setDifficulty(newDiffKey) {
    diffKey = newDiffKey;
    start();
  }

  return { start, setDifficulty };
}
```

### `src/styles/base.css`
```css
:root {
  --bg: #f5f3ef;
  --panel: #ffffff;
  --text: #1c1e26;
  --text-soft: #5a5f70;
  --accent: #e05a44;
  --accent-2: #2c3d78;
  --board-bg: #e9e6de;
  --border: #e2ded4;
  --matched: #2fa876;
  --shadow: rgba(20, 20, 30, 0.18);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #12141c; --panel: #1b1e2a; --text: #edeef3; --text-soft: #a3a8ba;
    --accent: #ff7a5c; --accent-2: #7c8fe6; --board-bg: #0f1119;
    --border: #2b2f40; --matched: #34c98d; --shadow: rgba(0, 0, 0, 0.5);
  }
}

:root[data-theme="dark"] {
  --bg: #12141c; --panel: #1b1e2a; --text: #edeef3; --text-soft: #a3a8ba;
  --accent: #ff7a5c; --accent-2: #7c8fe6; --board-bg: #0f1119;
  --border: #2b2f40; --matched: #34c98d; --shadow: rgba(0, 0, 0, 0.5);
}

* { box-sizing: border-box; }

body {
  margin: 0; min-height: 100vh; background: var(--bg); color: var(--text);
  font-family: -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: flex; justify-content: center;
}

.app { width: 100%; max-width: 720px; padding: 22px 16px 60px; }
header { text-align: center; margin-bottom: 18px; }
header h1 { margin: 0 0 4px; font-size: 1.7rem; letter-spacing: -0.4px; }
header p { margin: 0; color: var(--text-soft); font-size: 0.92rem; }

.panel { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 16px; }

button {
  font-family: inherit; cursor: pointer; border-radius: 999px; border: 1px solid var(--border);
  background: var(--panel); color: var(--text); padding: 8px 14px; font-size: 0.85rem;
  transition: transform .12s ease, background .15s ease;
}
button:active { transform: scale(0.96); }
button.active { background: var(--accent-2); color: #fff; border-color: var(--accent-2); }
button.primary { background: var(--accent); color: #fff; border-color: var(--accent); font-weight: 600; }

footer { text-align: center; color: var(--text-soft); font-size: 0.78rem; margin-top: 22px; }
```

### `src/styles/board.css`
```css
.board-wrap { background: var(--board-bg); border-radius: 14px; padding: 14px; }
.board { display: grid; gap: 10px; perspective: 800px; }

.tile { position: relative; aspect-ratio: 3 / 4; cursor: pointer; }
.tile-inner {
  position: absolute; inset: 0; transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(.4,.2,.2,1);
}
.tile.flipped .tile-inner { transform: rotateY(180deg); }

.face {
  position: absolute; inset: 0; border-radius: 10px;
  backface-visibility: hidden; box-shadow: 0 4px 10px var(--shadow);
  background-repeat: no-repeat;
}
.face.front { transform: rotateY(180deg); }

.tile.matched { opacity: 0.85; }
.tile.matched .face.front { outline: 3px solid var(--matched); outline-offset: -3px; border-radius: 10px; }

.tile.shake .tile-inner { animation: shake 0.4s; }
@keyframes shake {
  0%, 100% { transform: translateX(0) rotateY(180deg); }
  25% { transform: translateX(-4px) rotateY(180deg); }
  75% { transform: translateX(4px) rotateY(180deg); }
}
```

## 8. Lo que FALTA crear — hazlo tú

### `src/index.html`
Debe:
- Enlazar `styles/base.css` y `styles/board.css`
- Tener un `<header>` con título "MemoFlip" y subtítulo
- Un `.panel` con:
  - Un grupo de botones de dificultad con `id="diffGroup"`, cada botón con `data-diff="4x4"` /
    `"6x4"` / `"6x6"` (el primero con clase `active`)
  - Un botón "Reiniciar" con `id="restartBtn"`
  - Una fila de stats con estos IDs exactos (los usa `hud.js`): `#timeStat`, `#movesStat`,
    `#matchStat`, `#totalStat`, `#bestStat`
  - Un `.board-wrap` con un `<div id="board" class="board"></div>` dentro (aquí `board.js`
    inyecta las cartas)
- Un overlay de victoria (oculto por defecto, clase `.win-overlay`, con `id="winOverlay"`) que
  contenga: `#winTime`, `#winMoves`, `#winBest`, y un botón `#playAgainBtn`. Agrega en el CSS
  (puede ir en `board.css` o un nuevo archivo) las reglas `.win-overlay { display:none; ... }` y
  `.win-overlay.show { display:flex; }` con estilo de modal centrado
- Cargar `app.js` al final del `<body>` como `<script type="module" src="app.js"></script>`

### `src/app.js`
Debe:
1. Importar `loadSpriteSheet` de `ui/spriteSheet.js` y esperarlo (`await`) antes de iniciar el
   juego (si no, las cartas no tienen sprite todavía)
2. Importar `createHud` de `ui/hud.js` y `createWinModal` de `ui/modals.js`, inicializarlos sobre
   `document`
3. Importar `createClassicMode` de `modes/classic/classicMode.js`, instanciarlo con
   `{ boardEl: document.getElementById("board"), hud, winModal, diffKey: "4x4" }`
4. Llamar a `mode.start()`
5. Enlazar los botones de `#diffGroup`: al hacer click, quitar `active` de todos, agregarlo al
   clickeado, y llamar `mode.setDifficulty(btn.dataset.diff)`
6. Enlazar `#restartBtn` a `mode.start()`
7. Opcional: llamar `preloadSounds()` de `services/audio.js` (no falla si no hay archivos de
   sonido todavía)

### `package.json`
Sin dependencias de runtime. Un único script de desarrollo que levante un servidor estático
sirviendo la carpeta `src/` (por ejemplo con el paquete `serve`, o cualquier servidor estático
equivalente). Nombre del paquete: `memoflip`.

### `README.md`
Explicar brevemente: qué es el proyecto, cómo correrlo en local (recordar que debe servirse por
HTTP, no abrir el `index.html` con doble click porque el `fetch()` del JSON de sprites falla con
`file://`), y la estructura de carpetas con una frase por módulo (`core/` = lógica sin DOM, `ui/`
= todo lo que toca el DOM, `services/` = wrappers de APIs del navegador, `modes/` = conecta todo
para un modo de juego).

## 9. Tarea

1. Crea la estructura de carpetas de la sección 5.
2. Copia los assets de sprites (se entregan junto a este documento) a `src/assets/sprites/`.
3. Crea cada archivo de la sección 7 con el contenido exacto dado.
4. Escribe los archivos de la sección 8 (`index.html`, `app.js`, `package.json`, `README.md`)
   siguiendo esas especificaciones.
5. Verifica que el juego corra: servir `src/` por HTTP, abrir en el navegador, seleccionar una
   dificultad y jugar una partida completa hasta ver el modal de victoria.
6. No agregues PWA, Capacitor, ni frameworks — eso es una fase posterior, fuera de alcance ahora.
