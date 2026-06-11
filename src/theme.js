function setTheme(theme) {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
  localStorage.setItem("theme", theme);
}

Object.assign(window, { $setTheme: setTheme });

const stored = localStorage.getItem("theme");
if (stored) {
  setTheme(stored);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  setTheme("dark");
} else {
  setTheme("light");
}
