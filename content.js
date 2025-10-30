window.addEventListener("yt-navigate-finish", () => {
  if (document.URL.startsWith("https://www.youtube.com/results")) {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL("main.js");
    s.onload = () => s.remove();
    (document.head || document.documentElement).append("main.js");
  }
});