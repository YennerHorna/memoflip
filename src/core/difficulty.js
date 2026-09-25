// core/difficulty.js
export const DIFFICULTIES = {
  "4x4": { label: "Fácil · 4×4", cols: 4, rows: 4,
    description: "16 cartas, 8 parejas. Ideal para empezar y aprender la mecánica." },
  "6x4": { label: "Normal · 6×4", cols: 6, rows: 4,
    description: "24 cartas, 12 parejas. Tienes que recordar más posiciones a la vez." },
  "6x6": { label: "Difícil · 6×6", cols: 6, rows: 6,
    description: "36 cartas, 18 parejas: aparecen todas las figuras y colores, muchas se parecen." },
};

export function getPairCount(diffKey) {
  const d = DIFFICULTIES[diffKey];
  if (!d) throw new Error(`Dificultad desconocida: ${diffKey}`);
  return (d.cols * d.rows) / 2;
}
