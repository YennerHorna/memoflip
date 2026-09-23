// ui/settingsPanel.js
// Botón de engranaje que abre un menú flotante con tema, efectos y música.
export function createSettingsPanel(root, { onThemeChange, onSoundToggle, onSoundVolume, onMusicToggle, onMusicVolume }) {
  const toggleBtn = root.querySelector("#settingsBtn");
  const panel = root.querySelector("#settingsPanel");
  const closeBtn = root.querySelector("#closeSettingsBtn");
  const themeGroup = root.querySelector("#themeGroup");
  const soundToggle = root.querySelector("#soundToggle");
  const soundVolume = root.querySelector("#soundVolume");
  const musicToggle = root.querySelector("#musicToggle");
  const musicVolume = root.querySelector("#musicVolume");

  function open() {
    panel.classList.remove("hidden");
  }

  function close() {
    panel.classList.add("hidden");
  }

  function toggle() {
    if (panel.classList.contains("hidden")) open();
    else close();
  }

  toggleBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    toggle();
  });

  closeBtn.addEventListener("click", close);

  document.addEventListener("click", (event) => {
    if (panel.classList.contains("hidden")) return;
    if (panel.contains(event.target) || event.target === toggleBtn) return;
    close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  themeGroup.querySelectorAll("button[data-theme]").forEach((btn) => {
    btn.addEventListener("click", () => {
      themeGroup.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      onThemeChange(btn.dataset.theme);
    });
  });

  soundToggle.addEventListener("change", () => {
    soundVolume.disabled = !soundToggle.checked;
    onSoundToggle(soundToggle.checked);
  });
  soundVolume.addEventListener("input", () => onSoundVolume(Number(soundVolume.value) / 100));

  musicToggle.addEventListener("change", () => {
    musicVolume.disabled = !musicToggle.checked;
    onMusicToggle(musicToggle.checked);
  });
  musicVolume.addEventListener("input", () => onMusicVolume(Number(musicVolume.value) / 100));

  return {
    setActiveTheme(theme) {
      themeGroup.querySelectorAll("button").forEach((b) => {
        b.classList.toggle("active", b.dataset.theme === theme);
      });
    },
    setSoundEnabled(enabled) {
      soundToggle.checked = enabled;
      soundVolume.disabled = !enabled;
    },
    setSoundVolume(value) {
      soundVolume.value = String(Math.round(value * 100));
    },
    setMusicEnabled(enabled) {
      musicToggle.checked = enabled;
      musicVolume.disabled = !enabled;
    },
    setMusicVolume(value) {
      musicVolume.value = String(Math.round(value * 100));
    },
  };
}
