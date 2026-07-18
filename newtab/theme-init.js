// Runs synchronously in <head> before first paint.
// Reads the cached theme from localStorage (synchronous) and applies it
// to <html> so the correct CSS variables are active before the body renders.
const cachedTheme = localStorage.getItem("theme");
if (cachedTheme) {
  document.documentElement.classList.add(cachedTheme);
}
