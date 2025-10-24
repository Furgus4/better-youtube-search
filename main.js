window.addEventListener("yt-navigate-finish", () => {
  if (document.URL.startsWith("https://www.youtube.com/results")) {
    // is there some way to preload this stuff?
    // should some of this stuff happen here in main.js?
    // (checkVideo in hide-unhide-elements.js loads too late sometimes)

    injectScript('scripts/hide-unhide-elements.js');
    injectScript('scripts/helpers.js');
    injectScript('scripts/element-data-scraper.js');
    injectScript('scripts/custom-ui.js');
  }
});

function injectScript (src) {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(src);
    s.onload = () => s.remove();
    (document.head || document.documentElement).append(s);
}