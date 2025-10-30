if (ytInitialData.contents.twoColumnSearchResultsRenderer === undefined) {
  location.reload();
  // for some reason ytInitialData.contents.twoColumnSearchResultsRenderer doesn't exist on the first load
}

const data = new Map();

let elementDisplayArea = document.querySelector("ytd-search.style-scope.ytd-page-manager > div#container > ytd-two-column-search-results-renderer > div#primary > ytd-section-list-renderer > div#contents");
let globalI = 0;

// this initial call is here because observers don't account for elements (videos) already loaded
extractDataFromGroup(elementDisplayArea);

const observeNewGroups = new MutationObserver(extractDataFromNewGroups);
observeNewGroups.observe(elementDisplayArea, {attributes: false, childList: true, subtree: false });

function extractDataFromNewGroups(mutationList) {
  for (const mutation of mutationList) {
    for (const node of mutation.addedNodes) {
      if (node.querySelector("#contents") !== null) {
        extractDataFromGroup(node);
      }
    }
  }
}

function extractDataFromGroup(group) {
  const elementGroup = group.querySelector("#contents");
  let i = globalI;
  globalI += 1;
  let j = 0;

  // observers don't account for these initially loaded elements
  for (const element of elementGroup.children) {
    extractElementData(i, j, element);
    j++;
  }

  observeNewElementsInGroup(elementGroup, i, j);
}

function observeNewElementsInGroup(group, i, j) {
  const extractDataFromElementsInGroup = (mutationList) => {
    for (const mutation of mutationList) {
      for (const element of mutation.addedNodes) {
        extractElementData(i, j, element);
        j++;
      }
    }
  }

  const observer = new MutationObserver(extractDataFromElementsInGroup);
  observer.observe(group, { childList: true });
}

function extractElementData(i, j, element) {
  const rawData = ytInitialData
    .contents.twoColumnSearchResultsRenderer
    .primaryContents.sectionListRenderer
    .contents[i].itemSectionRenderer
    .contents[j];

  // video, short, or livestream
  if (element.tagName === "YTD-VIDEO-RENDERER") {
    const title = rawData.videoRenderer.title.runs[0].text;

    const duration = getSecondsFromDuration(rawData.videoRenderer.lengthText.simpleText);
    const views = +rawData.videoRenderer.viewCountText.simpleText.split(" ")[0].split(",").join("") || 0;
    const uploadYear = getActualUploadYear(rawData.videoRenderer.publishedTimeText.simpleText);
    const watched = rawData.videoRenderer.isWatched || false;

    let type = duration > 60*3 ? "videos" : "shorts";
    if (rawData.videoRenderer.publishedTimeText.simpleText.split(" ")[0] === "Streamed") {
      type = "live";
    }

    const curated = false;

    data.set(title, { element: element, type: type, title: title, duration: duration, views: views, uploadYear: uploadYear, watched: watched, curated: curated, hidden: false });
    checkElement(data.get(title));
  }

  // playlist
  else if (element.tagName === "YT-LOCKUP-VIEW-MODEL") {
    const title = rawData.lockupViewModel.metadata.lockupMetadataViewModel.title.content;

    const duration = undefined;
    const views = undefined;
    const type = "playlists";
    const uploadYear = undefined;
    const watched = undefined;
    const curated = false;

    data.set(title, { element: element, type: type, title: title, duration: duration, views: views, uploadYear: uploadYear, watched: watched, curated: curated, hidden: false });
    checkElement(data.get(title));
  }

  // idek
  else if (element.tagName === "YTD-AD-SLOT-RENDERER") {
    // I think maybe sponsored videos are in here, but I've never seen one
  }

  // grid of shorts
  else if (element.tagName === "GRID-SHELF-VIEW-MODEL") {
    // idk how to get uploadYear, duration, watched, or exact views
    /*const type = "short";
    const duration = 3*60;
    const uploadYear = undefined;
    const watched = undefined;
    for (const short of rawData.gridShelfViewModel.contents) {
      //console.log(short.shortsLockupViewModel);
      const title = short.shortsLockupViewModel.overlayMetadata.primaryText.content;
      const views = short.shortsLockupViewModel.overlayMetadata.secondaryText.content;
    }*/

    // lazy solution
    element.hidden = true;
  }

  // idek
  else if (element.tagName === "YTD-SEARCH-PYV-RENDERER") {
    //console.log(rawData);
    // it looks like the raw data has an ad,
    // but I've never seen one even with my ad blocker disabled
  }

  // people also watched and others (curated)
  else if (element.tagName === "YTD-SHELF-RENDERER") {
    // shows more videos so they are hideable
    element.querySelector("yt-formatted-string.ytd-vertical-list-renderer").click();

    const items = element.querySelector("div#items").children;
    const itemsData = rawData.shelfRenderer.content.verticalListRenderer.items;

    const curated = true;

    let k = 0;
    for (const item of items) {
      const title = itemsData[k].videoRenderer.title.runs[0].text;

      const duration = getSecondsFromDuration(itemsData[k].videoRenderer.lengthText.simpleText);
      const views = +itemsData[k].videoRenderer.viewCountText.simpleText.split(" ")[0].split(",").join("") || 0;
      const uploadYear = getActualUploadYear(itemsData[k].videoRenderer.publishedTimeText.simpleText);
      const watched = itemsData[k].videoRenderer.isWatched || false;

      let type = duration > 60*3 ? "videos" : "shorts";
      if (itemsData[k].videoRenderer.publishedTimeText.simpleText.split(" ")[0] === "Streamed") {
        type = "live";
      }

      data.set(title, { element: element, type: type, title: title, duration: duration, views: views, uploadYear: uploadYear, watched: watched, curated: curated, hidden: false });
      checkElement(data.get(title));
      k++;
    }
  }

  // channel
  else if (element.tagName === "YTD-CHANNEL-RENDERER") {
    const title = rawData.channelRenderer.title.simpleText;
    const duration = undefined;
    const views = undefined;
    const type = "channels";
    const uploadYear = undefined;
    const watched = undefined;
    const curated = false;

    data.set(title, { element: element, type: type, title: title, duration: duration, views: views, uploadYear: uploadYear, watched: watched, curated: curated, hidden: false });
    checkElement(data.get(title));
  }
}

const filterSettings = { // updates when the user changes the filters
  "videos": true, // setting everything to false could be a good way to test this in the future as some things are slipping through
  "shorts": true,
  "playlists": true,
  "channels": true,
  "live": true,
  //?"podcast": true?
  //?"song": true?

  minDuration: undefined,
  maxDuration: undefined,

  minViews: undefined,
  maxViews: undefined,

  minUploadYear: undefined,
  maxUploadYear: undefined,

  keywords: [/*"UI", "short"*/],

  sortBy: "default", // default, date, duration, views // idk how im gonna implement this yet

  show: "all", // all, watched, unwatched
  curated: true, // people also watched, explore more, ...
  //"sponsored": ?
}

function checkElement(elementData) {
  elementData.hidden = false;

  // need to make sure I'm accounting for all the undefined stuff that could happen

  // type
  if (!filterSettings[elementData.type]) {
    elementData.hidden = true;
    console.log("type not included");

  // duration
  } else if (elementData.duration < filterSettings.minDuration) {
    elementData.hidden = true;
    console.log("was too short");
  } else if (elementData.duration > filterSettings.maxDuration) {
    elementData.hidden = true;
    console.log("was too long");

  // views
  } else if (elementData.views < filterSettings.minViews) {
    elementData.hidden = true;
    console.log("didn't have enough views");
  } else if (elementData.views > filterSettings.maxViews) {
    elementData.hidden = true;
    console.log("had too many views");

  // upload year
  } else if (elementData.uploadYear < filterSettings.minUploadYear) {
    elementData.hidden = true;
    console.log("uploaded too long ago");
  } else if (elementData.uploadYear > filterSettings.maxUploadYear) {
    elementData.hidden = true;
    console.log("uploaded too recently");

  // all/watched/unwatched
  } else if (elementData.watched && filterSettings.show === "unwatched") {
    elementData.hidden = true;
    console.log("hiding because you've seen this");
  } else if (elementData.watched === false && filterSettings.show === "watched") {
    elementData.hidden = true;
    console.log("hiding because you haven't seen this");
  }

  // sections like "people also watched" or "explore more"
  else if (elementData.curated && !filterSettings.curated) {
    elementData.hidden = true;

    const parentContainer = elementData.element.parentElement.parentElement.parentElement.parentElement.parentElement;
    console.log(parentContainer);
    if (!parentContainer.hidden) {
      parentContainer.hidden = true;
    }

    console.log("hiding whole thing because curated content is disabled");


  // keywords (currently a video needs all keywords otherwise it is hidden)
  // I might make it less strict or add a setting for that
  } else if (filterSettings.keywords[0] !== undefined) {
    console.log("checking against keywords");
    for (let i = 0; i < filterSettings.keywords.length; i++) {
      if (!elementData.title.toLowerCase().includes(filterSettings.keywords[i].toLowerCase())) {
        console.log("hiding because it didn't have keywords");
        console.log(elementData.title, filterSettings.keywords[i]);
        elementData.hidden = true;
      }
    }
  }

  // after checking everything the else would be false,
  // allowing videos to be unhidden as filters change

  // hide or unhide videos
  elementData.element.hidden = elementData.hidden;
}

function checkAllElements() {
  data.forEach(elementData => {
    checkElement(elementData);
  });
}

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
    checkAllElements();
  };

  let durationAndViewInputs = document.querySelector("div#dav > div.dropdown");
  let uploadDateInputs = document.querySelector("div#ud > div.dropdown");
  durationAndViewInputs.onchange = e => {
    if (e.target.value === "") {
      filterSettings[e.target.id] = undefined;
    } else {
      filterSettings[e.target.id] = +e.target.value;
    }
    checkAllElements();
  };
  uploadDateInputs.onchange = e => {
    if (e.target.value === "") {
      filterSettings[e.target.id] = undefined;
    } else {
      filterSettings[e.target.id] = +e.target.value;
    }
    checkAllElements();
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
    checkAllElements();
  }
}

function getSecondsFromDuration(d) {
  let result = 0;
  let arr = d.split(":").reverse();

  for (let i = 0; i < arr.length; i++) {
    result += (+arr[i]) * (60 ** (i));
  }
  return result;
}

function getActualUploadYear(howLongAgo) {
  let arr = howLongAgo.split(" ");

  if (arr[0] === "Streamed") {
    arr = [arr[1], arr[2]];
  }

  const unit = arr[1];
  const amount = arr[0];

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = +(new Date().toString().split(" ")[2]);

  let actualYearUploaded;

  if (unit === "years" || unit === "year") {
    actualYearUploaded = currentYear - amount;
  } else if ((unit === "months" || unit === "month") && currentMonth - amount < 0) {
    actualYearUploaded = currentYear - 1;
  } else if ((unit === "days" || unit === "day") && (currentDay - amount < 0 && currentMonth - 1 < 0)) {
    actualYearUploaded = currentYear - 1;
  } else {
    actualYearUploaded = currentYear;
  }

  return actualYearUploaded;
}
