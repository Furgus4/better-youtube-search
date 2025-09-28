window.addEventListener("yt-navigate-finish", () => {
  if (document.URL.startsWith("https://www.youtube.com/results")) {
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

// I don't like this method
// not only is it constantly updating, I'm storing the data twice
// I might have to implement some sort of handshake method where I request the data as I use it
window.addEventListener("dataSent", e => {
  //console.log(e.detail);
});