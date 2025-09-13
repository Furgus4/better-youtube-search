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

  // loaded in manifest.json
  durationAndViewsSetup(toolbar);

  // put an observer here that calls all the relevant functionalities as the videos load
}