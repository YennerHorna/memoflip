// modes/custom/tutorial.js
// El modo personalizado se juega igual que el clásico: se reutilizan sus pasos y se añade uno sobre el reloj.
import { CLASSIC_TUTORIAL } from "../classic/tutorial.js";

export const CUSTOM_TUTORIAL = [
  ...CLASSIC_TUTORIAL.slice(0, 3),
  {
    title: "Tú pones las reglas",
    text: "Con el temporizador tienes un tiempo límite para completar el tablero; con el cronómetro no hay límite y se mide cuánto tardas. El reloj empieza con tu primera carta.",
  },
];
