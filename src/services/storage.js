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

export function getTheme() {
  return getItem("theme", "auto");
}

export function saveTheme(theme) {
  setItem("theme", theme);
}

export function getSoundEnabled() {
  return getItem("sound_enabled", true);
}

export function saveSoundEnabled(value) {
  setItem("sound_enabled", value);
}

export function getSoundVolume() {
  return getItem("sound_volume", 1);
}

export function saveSoundVolume(value) {
  setItem("sound_volume", value);
}

export function getMusicEnabled() {
  return getItem("music_enabled", true);
}

export function saveMusicEnabled(value) {
  setItem("music_enabled", value);
}

export function getMusicVolume() {
  return getItem("music_volume", 0.6);
}

export function saveMusicVolume(value) {
  setItem("music_volume", value);
}
