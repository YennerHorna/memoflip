// ui/theme.js
// "auto" deja que decida prefers-color-scheme (base.css); "light"/"dark" fuerzan el tema.
export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "light" || theme === "dark") {
    root.dataset.theme = theme;
  } else {
    delete root.dataset.theme;
  }
}
