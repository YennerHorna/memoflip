// services/audio.js
// Aislado a propósito: si no hay archivos de sonido/música todavía, el juego
// sigue funcionando y solo se registra un aviso en consola.
const sfxSounds = {};
let music = null;

let sfxEnabled = true;
let musicEnabled = true;
let sfxVolume = 1;
let musicVolume = 0.3;

// Archivos en src/assets/sounds/ (ver el README de esa carpeta).
// Se resuelven respecto a este módulo, no a la página, para que funcionen en cualquier ruta.
const soundUrl = (file) => new URL(`../assets/sounds/${file}`, import.meta.url).href;

const SOUND_FILES = {
  flip: soundUrl("flip.mp3"),
  error: soundUrl("error.mp3"),
  win: soundUrl("win.mp3"),
  loss: soundUrl("loss.mp3"),
};
const MUSIC_FILE = soundUrl("music.mp3");

export function preloadSounds() {
  Object.entries(SOUND_FILES).forEach(([name, path]) => {
    try {
      const audio = new Audio(path);
      audio.preload = "auto";
      audio.volume = sfxVolume;
      sfxSounds[name] = audio;
    } catch (err) {
      console.warn(`[audio] No se pudo cargar "${name}"`, err);
    }
  });

  try {
    music = new Audio(MUSIC_FILE);
    music.loop = true;
    music.preload = "auto";
    music.volume = musicVolume;
  } catch (err) {
    console.warn("[audio] No se pudo cargar la música", err);
  }
}

export function play(name) {
  if (!sfxEnabled) return;
  const audio = sfxSounds[name];
  if (!audio) return;
  try {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch (err) {
    console.warn(`[audio] Error reproduciendo "${name}"`, err);
  }
}

// Corta los efectos que sigan sonando (win/loss duran varios segundos).
export function stopEffects() {
  Object.values(sfxSounds).forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
}

export function playMusic() {
  if (!musicEnabled || !music) return;
  music.play().catch(() => {});
}

export function stopMusic() {
  if (!music) return;
  music.pause();
  music.currentTime = 0;
}

export function setSoundEnabled(value) {
  sfxEnabled = value;
}

export function isSoundEnabled() {
  return sfxEnabled;
}

export function setSoundVolume(value) {
  sfxVolume = value;
  Object.values(sfxSounds).forEach((audio) => {
    audio.volume = value;
  });
}

export function getSoundVolume() {
  return sfxVolume;
}

export function setMusicEnabled(value) {
  musicEnabled = value;
  if (value) playMusic();
  else stopMusic();
}

export function isMusicEnabled() {
  return musicEnabled;
}

export function setMusicVolume(value) {
  musicVolume = value;
  if (music) music.volume = value;
}

export function getMusicVolume() {
  return musicVolume;
}
