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
  durationAndViews.append("Duration & Views"); // needs interactable dropdown icon
  durationAndViews.id = "duration-and-views";
  toolbar.appendChild(durationAndViews);

  const davDropdown = document.createElement("div");
  davDropdown.id = "dav-dd";
  davDropdown.style.display = "none";
  davDropdown.innerHTML =
    "<label for='temp'>Temp UI</label>" +
    "<input name='temp' placeholder='Min' type='number' id='duration-min' class='text-field'>" +
    "<input placeholder='Max' type='number' id='duration-max' class='text-field'>";
  toolbar.appendChild(davDropdown);

  durationAndViews.addEventListener("mouseup", (e) => {
    if (davDropdown.style.display === "none") {
      davDropdown.style.display = "flex";
    } else if (davDropdown.style.display === "flex") {
      davDropdown.style.display = "none";
      // definitely call this on blur of the input fields instead of here
      davFunctionality();
    }
  });

  const davFunctionality = () => {
    const min = document.getElementById("duration-min").value;
    const max = document.getElementById("duration-max").value;

    // I could potentially use an api to get video length here,
    // but that seems convoluted so for now I'll just scrape the html

    // I'll eventually need an observer to filter videos as they load
    const videos = document.querySelector("ytd-search.style-scope.ytd-page-manager > div#container > ytd-two-column-search-results-renderer > div#primary > ytd-section-list-renderer > div#contents");
    console.log(videos);
    // for each ytd-item-section-renderer
    // check duration of each ytd-video-renderer in div#contents

    console.log("hiding videos that don't fit criteria");
  }
}