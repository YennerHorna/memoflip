// app.js
// Punto de entrada: pantalla de menú (modo, dificultad, engranaje de ajustes) y pantalla de juego.
import { createHud } from "./ui/hud.js";
import { createWinModal } from "./ui/modals.js";
import { createMenu } from "./ui/menu.js";
import { createSettingsPanel } from "./ui/settingsPanel.js";
import { applyTheme } from "./ui/theme.js";
import { createClassicMode } from "./modes/classic/classicMode.js";
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
} from "./services/storage.js";

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

  const hud = createHud(document);
  const boardEl = document.getElementById("board");
  const menuScreen = document.getElementById("menuScreen");
  const gameScreen = document.getElementById("gameScreen");

  let mode;

  function showMenu() {
    mode.stop();
    gameScreen.classList.add("hidden");
    menuScreen.classList.remove("hidden");
  }

  function showGame() {
    menuScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
  }

  const winModal = createWinModal(document, () => mode.start());

  mode = createClassicMode({
    boardEl,
    hud,
    winModal,
    diffKey: "4x4",
  });

  createMenu(document, {
    onPlay: (modeId, diffKey) => {
      showGame();
      mode.setDifficulty(diffKey);
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
}

main();
