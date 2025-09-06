// Wait for the bar with chips to appear before starting
const chipBarPath = "ytd-app > div#content > ytd-page-manager > ytd-search > div#container > div#header"

const observerTarget = document.querySelector("ytd-app");
const config = { childList: true, subtree: true }

const observationCallback = (mutationList, observer) => {
  if (document.querySelector(chipBarPath) !== null) {
    observer.disconnect();
    init();
  }
}

const observer = new MutationObserver(observationCallback);
observer.observe(observerTarget, config);


function init() {
  const oldBar = document.querySelector(chipBarPath);
  let newBar = document.createElement('div');
  newBar.className = "toolbar";

  const parent = oldBar.parentNode;
  parent.appendChild(newBar);
  parent.removeChild(oldBar);
}