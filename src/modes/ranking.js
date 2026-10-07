// modes/ranking.js
// Compartido por todos los modos: arma lo que el modal de fin de partida necesita para el ranking
// local (lista actual, si el resultado entra y cómo guardarlo), uniendo core/ranking.js y storage.
import { qualifiesForRanking, addToRanking, normalizeName } from "../core/ranking.js";
import { getRanking, saveRanking, getPlayerName, savePlayerName } from "../services/storage.js";

// key    = ranking a usar (modo + dificultad), ej. "classic_4x4"
// label  = texto para el título del ranking, ej. "Clásico · Fácil 4×4"
// order  = "time" | "score" (ver RANKING_ORDERS)
// result = { seconds, moves } o { score }
// format = (entry) => texto del resultado en la lista
export function buildRanking({ key, label, order, result, format }) {
  const entries = getRanking(key);
  return {
    label,
    entries,
    format,
    canSave: qualifiesForRanking(entries, result, order),
    defaultName: getPlayerName(),
    // Devuelve { entries, position } con la lista ya guardada, o null si el nombre está vacío.
    save(rawName) {
      const name = normalizeName(rawName);
      if (!name) return null;
      savePlayerName(name);
      const saved = addToRanking(getRanking(key), { name, date: Date.now(), ...result }, order);
      saveRanking(key, saved.entries);
      return saved;
    },
  };
}

export const formatTimeEntry = (entry) => `${entry.seconds}s · ${entry.moves} mov.`;
