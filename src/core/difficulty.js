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
