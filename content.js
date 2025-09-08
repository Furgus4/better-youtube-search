// Wait for the bar with chips to appear before starting
const chipBarPath = "ytd-app > div#content > ytd-page-manager > ytd-search > div#container > div#header > ytd-search-header-renderer";

const observerTarget = document.querySelector("ytd-app");
const config = { childList: true, subtree: true }

const observationCallback = (mutationList, observer) => {
  if (document.querySelector(chipBarPath) !== null) {
    observer.disconnect();
    main();
  }
}

const observer = new MutationObserver(observationCallback);
observer.observe(observerTarget, config);

function main() {
  let toolbar = document.querySelector(chipBarPath);
  for (const child of toolbar.children) {
    child.style.display = "none";
  }

  const durationAndViews = document.createElement("div");
  durationAndViews.append("Duration & Views");
  durationAndViews.id = "duration-and-views";

  durationAndViews.addEventListener("mouseup", (e) => {
    console.log("open dropdown");
  });

  // needs dropdown icon
  toolbar.appendChild(durationAndViews);
}