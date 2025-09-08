// If the user loads on a page that isn't the search page,
// when they search for something, YouTube won't reload.

// This means I need another observer to tell when YouTube
// changes to the search screen so this code knows to run

// I should also probably put all the initial observers in a
// separate file from the main function


const chipBarPath = "ytd-app > div#content > ytd-page-manager > ytd-search > div#container > div#header > ytd-search-header-renderer";
const chipBar = document.querySelector("ytd-app");
const config = { childList: true, subtree: true }
const observationCallback = (mutationList, observer) => {
  if (document.querySelector(chipBarPath) !== null) {
    observer.disconnect();
    main();
  }
}
const chipObserver = new MutationObserver(observationCallback);
chipObserver.observe(chipBar, config);

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