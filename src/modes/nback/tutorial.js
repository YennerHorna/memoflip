// modes/nback/tutorial.js
// Pasos del tutorial del Modo N-back (formato de demo descrito en ui/tutorial.js).
// La demo muestra 2-back: la carta del centro va cambiando como en el juego.

// Enseña una carta en el hueco 0: cambia la figura tapada, la voltea y la vuelve a tapar.
function showCard(t, type, number) {
  return [
    { t, face: 0, type },
    { t: t + 50, flip: 0 }, { t: t + 50, badge: 0, text: String(number) },
    { t: t + 1250, unflip: 0 },
  ];
}

export const NBACK_TUTORIAL = [
  {
    title: "Una carta a la vez",
    text: "Las cartas aparecen de una en una en el centro y se vuelven a tapar. Tienes que ir recordando las últimas que salieron.",
    demo: {
      cards: ["star_coral"], duration: 5200,
      timeline: [
        ...showCard(400, "star_coral", 1), { t: 450, caption: "Carta 1: estrella" },
        ...showCard(2000, "circle_blue", 2), { t: 2050, caption: "Carta 2: círculo" },
        ...showCard(3600, "heart_green", 3), { t: 3650, caption: "Carta 3: corazón" },
      ],
    },
  },
  {
    title: "¿Es igual a la de hace N?",
    text: "En 2-back comparas cada carta con la que salió dos antes. Si la 3.ª es igual a la 1.ª, ¡es una coincidencia!",
    demo: {
      cards: ["star_coral"], duration: 5600,
      timeline: [
        ...showCard(400, "star_coral", 1), { t: 450, caption: "Carta 1: estrella" },
        ...showCard(2000, "circle_blue", 2), { t: 2050, caption: "Carta 2: círculo" },
        ...showCard(3600, "star_coral", 3), { t: 3650, caption: "Carta 3: estrella = la de hace 2 ✓" },
      ],
    },
  },
  {
    title: "Pulsa «¡Coincide!»",
    text: "Si coincide, pulsa el botón (o la barra espaciadora) antes de que salga la siguiente. Si no coincide, no hagas nada: pulsar sin coincidencia cuenta como error.",
    demo: {
      cards: ["star_coral"], button: "¡Coincide!", duration: 7000,
      timeline: [
        ...showCard(400, "star_coral", 1),
        ...showCard(1900, "circle_blue", 2),
        ...showCard(3400, "star_coral", 3), { t: 3450, caption: "Igual que la 1…" },
        { t: 3900, tap: "button" }, { t: 4000, match: [0] }, { t: 4000, caption: "¡Bien! Era una coincidencia" },
        { t: 4650, unflip: 0 },
        { t: 5100, face: 0, type: "heart_green" }, { t: 5150, flip: 0 }, { t: 5150, badge: 0, text: "4" },
        { t: 5150, caption: "Corazón ≠ círculo: no pulses" }, { t: 6400, unflip: 0 },
      ],
    },
  },
  {
    title: "Tu precisión",
    text: "Al final verás tu porcentaje de aciertos. Fácil es 1-back, Normal 2-back y Difícil 3-back.",
    demo: {
      cards: ["star_coral"], duration: 4200,
      timeline: [
        { t: 300, face: 0, type: "star_coral" }, { t: 400, flip: 0 }, { t: 700, match: [0] },
        { t: 800, caption: "6/6 coincidencias · 0 falsas alarmas" },
        { t: 1800, caption: "¡100% de precisión!" },
      ],
    },
  },
];
