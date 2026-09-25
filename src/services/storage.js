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

export function getBestSequenceLength(diffKey) {
  return getItem(`best_sequence_${diffKey}`, 0);
}

export function saveBestSequenceLengthIfBetter(diffKey, length) {
  const isBetter = length > getBestSequenceLength(diffKey);
  if (isBetter) setItem(`best_sequence_${diffKey}`, length);
  return isBetter;
}

export function getBestNBackAccuracy(diffKey) {
  return getItem(`best_nback_${diffKey}`, null);
}

export function saveBestNBackAccuracyIfBetter(diffKey, accuracy) {
  const current = getBestNBackAccuracy(diffKey);
  const isBetter = current == null || accuracy > current;
  if (isBetter) setItem(`best_nback_${diffKey}`, accuracy);
  return isBetter;
}

export function hasSeenTutorial(modeId) {
  return getItem(`tutorial_seen_${modeId}`, false);
}

export function markTutorialSeen(modeId) {
  setItem(`tutorial_seen_${modeId}`, true);
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
  return getItem("music_volume", 0.3);
}

export function saveMusicVolume(value) {
  setItem("music_volume", value);
}
