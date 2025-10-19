window.addEventListener("yt-navigate-finish", () => {
  if (document.URL.startsWith("https://www.youtube.com/results")) {
    // is there some way to preload this stuff?
    // should it all be in one script?
    // should some of this stuff happen in main.js? (not the scraper)

    injectScript('scripts/unnamed.js'); // obviously temp name
    injectScript('scripts/video-data-scraper.js');
    injectScript('scripts/custom-ui.js');
  }
});

function injectScript (src) {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(src);
    s.onload = () => s.remove();
    (document.head || document.documentElement).append(s);
}