// ui/spriteSheet.js
// Cada carta es un archivo PNG individual (recortado offline del spritesheet
// original) en assets/sprites/cards/. Sin fetch ni JSON en tiempo de ejecución.
// Resuelto respecto a este módulo (no a la página) para que funcione en cualquier ruta.
const CARDS_DIR = new URL("../assets/sprites/cards/", import.meta.url).href;

export function getCardImagePath(name) {
  return `${CARDS_DIR}${name}.png`;
}

export function backFrameName() {
  return "back";
}
