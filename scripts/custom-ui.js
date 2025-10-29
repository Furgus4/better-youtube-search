/*
 * I may add event listeners to the html in this file
 * they would call the function that checks the video data with the filter settings
 *
 * I'll probably actually handle that later and just call the function when the filter data changes
 * If I did that, it would be in the file that extracts data from the filter input areas
 */

window.trustedTypes.createPolicy('default', {
  createHTML: (string, sink) => string
});

function sanitize(htmlText) {
  return window.trustedTypes.defaultPolicy.createHTML(htmlText);
}

const toolbarHTML =
  "<div id='main-div'>" +
    "<div id='sub-div'>" +

      "<div id='t' class='d-container'>" +
        "<div class='chip'>Type<span class='icon'>V</span></div>" +
        "<div class='dropdown hidden'>" +
          "<div>" +
            "<input type='checkbox' id='videos' checked/>" +
            "<label for='videos'>Videos</label>" +
          "</div>" +
          "<div>" +
            "<input type='checkbox' id='shorts' checked/>" +
            "<label for='shorts'>Shorts</label>" +
          "</div>" +
          "<div>" +
            "<input type='checkbox' id='playlists' checked/>" +
            "<label for='playlists'>Playlists</label>" +
          "</div>" +
          "<div>" +
            "<input type='checkbox' id='channels' checked/>" +
            "<label for='channels'>Channels</label>" +
          "</div>" +
          //"<div>" +
            //"<input type='checkbox' id='podcasts' checked/>" +
            //"<label for='podcasts'>Podcasts</label>" +
          //"</div>" +
          "<div>" +
            "<input type='checkbox' id='live' checked/>" +
            "<label for='live'>Live</label>" +
          "</div>" +
          //"<div>" +
            //"<input type='checkbox' id='songs' checked/>" +
            //"<label for='songs'>Songs</label>" +
          //"</div>" +
        "</div>" +
      "</div>" +

      "<div id='dav' class='d-container'>" +
        "<div class='chip'>Duration & Views<span class='icon'>V</span></div>" +
        "<div class='dropdown hidden'>" +
          "<div>" +
            "Duration" +
            "<div>" +
              "<label for='minDuration'>Min </label>" +
              "<input type='number' id='minDuration'/>" +
            "</div>" +
            "<div>" +
              "<label for='maxDuration'>Max </label>" +
              "<input type='number' id='maxDuration'/>" +
            "</div>" +
          "</div>" +
          "<div>" +
            "Views" +
            "<div>" +
              "<label for='minViews'>Min </label>" +
              "<input type='number' id='minViews'/>" +
            "</div>" +
            "<div>" +
              "<label for='maxViews'>Max </label>" +
              "<input type='number' id='maxViews'/>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>" +

      "<div id='ud' class='d-container'>" +
        "<div class='chip'>Upload Year<span class='icon'>V</span></div>" +
        "<div class='dropdown hidden'>" +
          "<div>" +
            "<label for='minUploadYear'>Min </label>" +
            "<input type='number' id='minUploadYear'/>" +
          "</div>" +
          "<div>" +
            "<label for='maxUploadYear'>Max </label>" +
            "<input type='number' id='maxUploadYear'/>" +
          "</div>" +
        "</div>" +
      "</div>" +

      "<div id='k' class='d-container'>" +
        "<div class='chip'>Keywords<span class='icon'>V</span></div>" +
        "<div class='dropdown hidden'>" +
          "Keywords" +
          "<label for='keywords'>temp: 'keywords here'</label>" +
          "<input type='text' id='keywords'/>" +
        "</div>" +
      "</div>" +

      "<div id='sb' class='d-container'>" +
        "<div class='chip'>Sort By<span class='icon'>V</span></div>" +
        "<div class='dropdown hidden'>" +
          "<div>" +
            "<input type='radio' id='default' name='sort-by'/>" +
            "<label for='default'>Default</label>" +
          "</div>" +
          "<div>" +
            "<input type='radio' id='date' name='sort-by'/>" +
            "<label for='date'>Date</label>" +
          "</div>" +
          "<div>" +
            "<input type='radio' id='duration' name='sort-by'/>" +
            "<label for='duration'>Duration</label>" +
          "</div>" +
          "<div>" +
            "<input type='radio' id='views' name='sort-by'/>" +
            "<label for='views'>Views</label>" +
          "</div>" +
        "</div>" +
      "</div>" +
    "</div>" +

    "<div id='v' class='d-container'>" +
      "<div class='chip'>View<span class='icon'>V</span></div>" +
      "<div class='dropdown hidden'>" +
        "<div>" +
          "<input type='radio' id='all' name='view'/>" +
          "<label for='all'>All</label>" +
        "</div>" +
        "<div>" +
          "<input type='radio' id='watched' name='view'/>" +
          "<label for='watched'>Watched</label>" +
        "</div>" +
        "<div>" +
          "<input type='radio' id='unwatched' name='view'/>" +
          "<label for='unwatched'>Unwatched</label>" +
        "</div>" +
        "<div>" +
          "<input type='checkbox' id='curated' checked/>" +
          "<label for='curated'>Curated</label>" +
        "</div>" +
        //"<div>" +
          //"<input type='checkbox' id='suggested'/>" +
          //"<label for='suggested'>Suggested</label>" +
        //"</div>" +
        //"<div>" +
          //"<input type='checkbox' id='for-you'/>" +
          //"<label for='for-you'>For You</label>" +
        //"</div>" +
        //"<div>" +
          //"<input type='checkbox' id='people-also-watched'/>" +
          //"<label for='people-also-watched'>People Also Watched</label>" +
        //"</div>" +
        //"<div>" +
          //"<input type='checkbox' id='sponsored'/>" +
          //"<label for='sponsored'>Sponsored</label>" +
        //"</div>" +
      "</div>" +
    "</div>" +
  "</div>";

let toolbar;
const toolbarPath = "ytd-app > div#content > ytd-page-manager > ytd-search > div#container > div#header > ytd-search-header-renderer";

const toolbarObserver = new MutationObserver((mutationList, observer) => {
  if (document.querySelector(toolbarPath) !== null) {
    observer.disconnect();
    toolbar = document.querySelector(toolbarPath);
    toolbar.innerHTML = sanitize(toolbarHTML);
    addListeners();
  }
});

toolbarObserver.observe(document.querySelector("ytd-app"), { childList: true, subtree: true });

function addListeners() {
  // adding for dropdown functionality
  const containers = document.getElementsByClassName("d-container");

  for (let i = 0; i < containers.length; i++) {
    let chip = containers[i].querySelector(".chip");
    chip.onclick = (e) => {
      showDropdown(containers[i]);
    };
  }

  function showDropdown(c) {
    const d = c.querySelector(".dropdown");
    d.classList.toggle("hidden");
    const icon = c.querySelector(".icon");
    icon.classList.toggle("flipped");

    for (let i = 0; i < containers.length; i++) {
      const currD = containers[i].querySelector(".dropdown");
      if (currD !== d) {
        currD.classList.add("hidden");
      }
      const currIcon = containers[i].querySelector(".icon");
      if (currIcon !== icon) {
        currIcon.classList.remove("flipped");
      }
    }
  }

  // For updating filterSettings:
  let typeCheckboxes = document.querySelector("div#t > div.dropdown")
  typeCheckboxes.onchange = e => {
    filterSettings[e.target.id] = !filterSettings[e.target.id];
    // check all videos
  };

  let durationAndViewInputs = document.querySelector("div#dav > div.dropdown");
  let uploadDateInputs = document.querySelector("div#ud > div.dropdown");
  durationAndViewInputs.onchange = e => {
    if (e.target.value === "") {
      filterSettings[e.target.id] = undefined;
    } else {
      filterSettings[e.target.id] = +e.target.value;
    }
    // check all videos
  };
  uploadDateInputs.onchange = e => {
    if (e.target.value === "") {
      filterSettings[e.target.id] = undefined;
    } else {
      filterSettings[e.target.id] = +e.target.value;
    }
    // check all videos
  }

  // idk for keywords yet

  let sortByRadioButtons = document.querySelector("div#sb > div.dropdown");
  sortByRadioButtons.onchange = e => {
    console.log(e.target.id);
    filterSettings.sortBy = e.target.id;
  }

  let viewRadioButtonsAndCheckboxes = document.querySelector("div#v > div.dropdown");
  viewRadioButtonsAndCheckboxes.onchange = e => {
    console.log(e.target.id);
    if (e.target.id === "curated") {
      filterSettings.curated = !filterSettings.curated;
    } else {
      filterSettings.show = e.target.id;
    }
    // check all videos
  }
}