function injectScript (src) {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(src);
    s.onload = () => s.remove();
    (document.head || document.documentElement).append(s);
}

injectScript('injected-script.js')
/*
// wait for a /results page
window.addEventListener("yt-navigate-finish", checkURL);

function checkURL() {
  if (document.URL.startsWith("https://www.youtube.com/results")) {
    waitForChipBar();
  }
}

function waitForChipBar() {
  const chipBarPath = "ytd-app > div#content > ytd-page-manager > ytd-search > div#container > div#header > ytd-search-header-renderer";
  const chipBar = document.querySelector("ytd-app");

  const chipObserver = new MutationObserver(callback);
  function callback(mutationList, observer) {
    if (document.querySelector(chipBarPath) !== null) {
      observer.disconnect();
      // everything starts here
      toolbarInit(chipBarPath);
    }
  }
  const config = { childList: true, subtree: true }
  chipObserver.observe(chipBar, config);
}

function toolbarInit(chipBarPath) {
  const toolbar = document.querySelector(chipBarPath);
  for (const child of toolbar.children) {
    child.style.display = "none";
  }

  durationAndViewsSetup(toolbar);

  // observer that calls all the relevant functionalities as the videos load
  const vda = document.querySelector("ytd-search.style-scope.ytd-page-manager > div#container > ytd-two-column-search-results-renderer > div#primary > ytd-section-list-renderer > div#contents");
  const videoDisplayAreaObserver = new MutationObserver(tempName);
  function tempName(mutationList, observer) {
    durationAndViewsFunctionality();
  }
  const vdaoConfig = { childList: true, subtree: true }
  videoDisplayAreaObserver.observe(vda, vdaoConfig);
}*/