// modes/sequence/tutorial.js
// Pasos del tutorial del Modo Secuencia (formato de demo descrito en ui/tutorial.js).
const CARDS = ["diamond_blue", "triangle_green", "hexagon_coral", "heart_blue", "star_green", "circle_coral"];

// El juego muestra 4 → 1 → 5.
const SHOW_SEQUENCE = [
  { t: 600, caption: "Observa…" },
  { t: 700, flip: 4 }, { t: 1450, unflip: 4 },
  { t: 1700, flip: 1 }, { t: 2450, unflip: 1 },
  { t: 2700, flip: 5 }, { t: 3450, unflip: 5 },
];

export const SEQUENCE_TUTORIAL = [
  {
    title: "Observa",
    text: "Las cartas se voltean una a una formando una secuencia. Fíjate bien en el orden.",
    demo: { cards: CARDS, cols: 3, duration: 4400, timeline: SHOW_SEQUENCE },
  },
  {
    title: "Recuerda el orden",
    text: "Cada carta se vuelve a tapar enseguida. Mientras dice «Observa…» no puedes tocar nada: solo memoriza.",
    demo: {
      cards: CARDS, cols: 3, duration: 5600,
      timeline: [
        ...SHOW_SEQUENCE,
        { t: 700, badge: 4, text: "1" }, { t: 1700, badge: 1, text: "2" }, { t: 2700, badge: 5, text: "3" },
        { t: 3700, caption: "Recuerda: primero, segundo, tercero" },
      ],
    },
  },
  {
    title: "Repite",
    text: "Cuando aparezca «Tu turno», toca las mismas cartas en el mismo orden. Si aciertas toda la secuencia, la siguiente tendrá una carta más.",
    demo: {
      cards: CARDS, cols: 3, duration: 7200,
      timeline: [
        ...SHOW_SEQUENCE,
        { t: 3800, caption: "Tu turno: repite el orden" },
        { t: 4200, tap: 4 }, { t: 4350, flip: 4 }, { t: 4350, badge: 4, text: "1" }, { t: 4800, unflip: 4 },
        { t: 5000, tap: 1 }, { t: 5150, flip: 1 }, { t: 5150, badge: 1, text: "2" }, { t: 5600, unflip: 1 },
        { t: 5800, tap: 5 }, { t: 5950, flip: 5 }, { t: 5950, badge: 5, text: "3" }, { t: 6400, unflip: 5 },
        { t: 6100, caption: "¡Bien! Siguiente nivel: 4 cartas" },
      ],
    },
  },
  {
    title: "Tienes 3 vidas",
    text: "Si te equivocas, te mostramos la carta correcta y pierdes una vida. Sin vidas termina la partida y se guarda el nivel más alto que alcanzaste.",
    demo: {
      cards: CARDS, cols: 3, duration: 5000,
      timeline: [
        { t: 500, caption: "Tu turno: repite el orden" },
        { t: 900, tap: 4 }, { t: 1050, flip: 4 }, { t: 1500, unflip: 4 },
        { t: 1900, tap: 2 }, { t: 2050, flip: 2 }, { t: 2100, wrong: [2] },
        { t: 2100, flip: 1 }, { t: 2100, badge: 1, text: "✓" },
        { t: 2200, caption: "¡Era esta! Pierdes una vida: ♥♥" },
        { t: 3600, unflip: 1 }, { t: 3600, badge: 1, text: null },
      ],
    },
  },
];
