// app.js
// Punto de entrada: pantalla de menú (modo, dificultad, engranaje de ajustes) y pantalla de juego.
import { createHud } from "./ui/hud.js";
import { createWinModal } from "./ui/modals.js";
import { createMenu } from "./ui/menu.js";
import { createSettingsPanel } from "./ui/settingsPanel.js";
import { createTutorial } from "./ui/tutorial.js";
import { applyTheme } from "./ui/theme.js";
import { createClassicMode } from "./modes/classic/classicMode.js";
import { createSequenceMode } from "./modes/sequence/sequenceMode.js";
import { createNBackMode } from "./modes/nback/nbackMode.js";
import { createCustomMode } from "./modes/custom/customMode.js";
import { DIFFICULTIES } from "./core/difficulty.js";
import { SEQUENCE_DIFFICULTIES } from "./core/sequence.js";
import { NBACK_DIFFICULTIES } from "./core/nback.js";
import { CLASSIC_TUTORIAL } from "./modes/classic/tutorial.js";
import { SEQUENCE_TUTORIAL } from "./modes/sequence/tutorial.js";
import { NBACK_TUTORIAL } from "./modes/nback/tutorial.js";
import { CUSTOM_TUTORIAL } from "./modes/custom/tutorial.js";
import * as audio from "./services/audio.js";
import {
  getTheme,
  saveTheme,
  getSoundEnabled,
  saveSoundEnabled,
  getSoundVolume,
  saveSoundVolume,
  getMusicEnabled,
  saveMusicEnabled,
  getMusicVolume,
  saveMusicVolume,
  hasSeenTutorial,
  markTutorialSeen,
  getCustomConfig,
  saveCustomConfig,
} from "./services/storage.js";

const TUTORIALS = { classic: CLASSIC_TUTORIAL, sequence: SEQUENCE_TUTORIAL, nback: NBACK_TUTORIAL, custom: CUSTOM_TUTORIAL };

function main() {
  audio.preloadSounds();

  const theme = getTheme();
  applyTheme(theme);

  const soundEnabled = getSoundEnabled();
  const soundVolume = getSoundVolume();
  const musicEnabled = getMusicEnabled();
  const musicVolume = getMusicVolume();

  audio.setSoundVolume(soundVolume);
  audio.setSoundEnabled(soundEnabled);
  audio.setMusicVolume(musicVolume);
  audio.setMusicEnabled(musicEnabled);

  // Los navegadores bloquean el audio hasta que el usuario interactúa con la página:
  // la música arranca con el primer click, toque o tecla.
  function startMusicOnFirstGesture() {
    audio.playMusic();
    ["pointerdown", "keydown"].forEach((type) => document.removeEventListener(type, startMusicOnFirstGesture));
  }
  ["pointerdown", "keydown"].forEach((type) => document.addEventListener(type, startMusicOnFirstGesture));

  const hud = createHud(document);
  const boardEl = document.getElementById("board");
  const menuScreen = document.getElementById("menuScreen");
  const gameScreen = document.getElementById("gameScreen");

  let mode;
  let menu;

  function showMenu() {
    mode.stop();
    menu.showModes();
    gameScreen.classList.add("hidden");
    menuScreen.classList.remove("hidden");
  }

  function showGame() {
    menuScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
  }

  // "Jugar de nuevo" lleva a la lista de modos para elegir la siguiente partida.
  const winModal = createWinModal(document, showMenu);

  const modes = {
    classic: createClassicMode({ boardEl, hud, winModal, diffKey: "4x4" }),
    sequence: createSequenceMode({ boardEl, hud, winModal, diffKey: "easy" }),
    nback: createNBackMode({ boardEl, hud, winModal, diffKey: "easy" }),
    custom: createCustomMode({ boardEl, hud, winModal }),
  };
  mode = modes.classic;
  let modeId = "classic";
  const tutorial = createTutorial(document);

  menu = createMenu(document, {
    difficultiesByMode: { classic: DIFFICULTIES, sequence: SEQUENCE_DIFFICULTIES, nback: NBACK_DIFFICULTIES },
    initialCustomConfig: getCustomConfig(),
    onPlay: (selectedModeId, diffKey, customConfig) => {
      mode.stop();
      modeId = selectedModeId;
      mode = modes[modeId];
      showGame();
      // El modo personalizado recibe su configuración (reloj + tamaño); los demás, una dificultad.
      const apply = () => {
        if (modeId === "custom") {
          saveCustomConfig(customConfig);
          mode.configure(customConfig);
        } else {
          mode.setDifficulty(diffKey);
        }
      };
      if (hasSeenTutorial(modeId)) {
        apply();
        return;
      }
      // Primera vez en este modo: se prepara el tablero (para que detrás del tutorial se vea
      // el modo correcto) pero se detiene enseguida; la partida empieza al cerrar el tutorial.
      apply();
      mode.stop();
      tutorial.show(TUTORIALS[modeId], () => {
        markTutorialSeen(modeId);
        mode.start();
      });
    },
  });

  const settingsPanel = createSettingsPanel(document, {
    onThemeChange: (value) => {
      applyTheme(value);
      saveTheme(value);
    },
    onSoundToggle: (enabled) => {
      audio.setSoundEnabled(enabled);
      saveSoundEnabled(enabled);
    },
    onSoundVolume: (value) => {
      audio.setSoundVolume(value);
      saveSoundVolume(value);
    },
    onMusicToggle: (enabled) => {
      audio.setMusicEnabled(enabled);
      saveMusicEnabled(enabled);
    },
    onMusicVolume: (value) => {
      audio.setMusicVolume(value);
      saveMusicVolume(value);
    },
  });

  settingsPanel.setActiveTheme(theme);
  settingsPanel.setSoundEnabled(soundEnabled);
  settingsPanel.setSoundVolume(soundVolume);
  settingsPanel.setMusicEnabled(musicEnabled);
  settingsPanel.setMusicVolume(musicVolume);

  document.getElementById("menuBtn").addEventListener("click", showMenu);
  document.getElementById("restartBtn").addEventListener("click", () => mode.start());
  // Ver el tutorial de nuevo reinicia la partida al cerrarlo (no hay pausa a mitad de secuencia).
  document.getElementById("helpBtn").addEventListener("click", () => {
    mode.stop();
    tutorial.show(TUTORIALS[modeId], () => mode.start());
  });
}

main();
