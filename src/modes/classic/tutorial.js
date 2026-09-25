// modes/classic/tutorial.js
// Pasos del tutorial del Modo Clásico. Cada `demo` es una animación en bucle
// (formato descrito en ui/tutorial.js).
export const CLASSIC_TUTORIAL = [
  {
    title: "Encuentra las parejas",
    text: "Todas las cartas empiezan boca abajo. Cada figura aparece exactamente dos veces en el tablero.",
    demo: {
      cards: ["star_coral", "circle_blue", "circle_blue", "star_coral"],
      duration: 4200,
      timeline: [
        { t: 700, flip: 0 }, { t: 850, flip: 1 }, { t: 1000, flip: 2 }, { t: 1150, flip: 3 },
        { t: 1300, caption: "Cada figura está dos veces" },
        { t: 3000, unflip: 0 }, { t: 3000, unflip: 1 }, { t: 3000, unflip: 2 }, { t: 3000, unflip: 3 },
      ],
    },
  },
  {
    title: "Voltea dos cartas",
    text: "Toca una carta para darle la vuelta y luego otra. Si son iguales, quedan descubiertas para siempre.",
    demo: {
      cards: ["star_coral", "heart_green", "circle_blue", "star_coral"],
      duration: 4600,
      timeline: [
        { t: 500, tap: 0 }, { t: 700, flip: 0 }, { t: 700, caption: "Primera carta…" },
        { t: 1600, tap: 3 }, { t: 1800, flip: 3 }, { t: 1800, caption: "…segunda carta" },
        { t: 2500, match: [0, 3] }, { t: 2500, caption: "¡Pareja! Se quedan boca arriba" },
      ],
    },
  },
  {
    title: "Si no coinciden, se tapan",
    text: "Las dos cartas se vuelven a tapar. Memoriza dónde estaba cada una: la necesitarás más adelante.",
    demo: {
      cards: ["circle_blue", "heart_green", "star_coral", "circle_blue"],
      duration: 6400,
      timeline: [
        { t: 500, tap: 0 }, { t: 700, flip: 0 },
        { t: 1400, tap: 1 }, { t: 1600, flip: 1 },
        { t: 2300, wrong: [0, 1] }, { t: 2300, caption: "No son iguales: se tapan" },
        { t: 3500, tap: 3 }, { t: 3700, flip: 3 }, { t: 3700, caption: "¿Dónde estaba el otro círculo?" },
        { t: 4500, tap: 0 }, { t: 4700, flip: 0 },
        { t: 5100, match: [0, 3] }, { t: 5100, caption: "¡Lo recordaste!" },
      ],
    },
  },
  {
    title: "Gana rápido",
    text: "La partida termina al encontrar todas las parejas. El tiempo empieza con tu primera carta: intenta usar pocos movimientos para batir tu mejor resultado.",
    demo: {
      cards: ["star_coral", "heart_green", "heart_green", "star_coral"],
      duration: 4400,
      timeline: [
        { t: 400, tap: 1 }, { t: 550, flip: 1 }, { t: 1000, tap: 2 }, { t: 1150, flip: 2 },
        { t: 1400, match: [1, 2] },
        { t: 1700, tap: 0 }, { t: 1850, flip: 0 }, { t: 2300, tap: 3 }, { t: 2450, flip: 3 },
        { t: 2700, match: [0, 3] }, { t: 2800, caption: "¡Completado en 2 movimientos!" },
      ],
    },
  },
];
