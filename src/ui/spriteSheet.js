// ui/spriteSheet.js
// Cada carta es un archivo PNG individual (recortado offline del spritesheet
// original) en assets/sprites/cards/. Sin fetch ni JSON en tiempo de ejecución.
const CARDS_DIR = "../assets/sprites/cards/";

export function getCardImagePath(name) {
  return `${CARDS_DIR}${name}.png`;
}

export function backFrameName() {
  return "back";
}
