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
    extractElementData(i, j, element.tagName);
    j++;
  }
  
  observeNewElementsInGroup(elementGroup, i, j);
}

function observeNewElementsInGroup(group, i, j) {
  const extractDataFromElementsInGroup = (mutationList) => {
    for (const mutation of mutationList) {
      for (const element of mutation.addedNodes) {
        extractElementData(i, j, element.tagName);
        j++;
      }
    }
  }

  const observer = new MutationObserver(extractDataFromElementsInGroup);
  observer.observe(group, { childList: true });
}

function extractElementData(i, j, tagName) {
  const rawData = ytInitialData
    .contents.twoColumnSearchResultsRenderer
    .primaryContents.sectionListRenderer
    .contents[i].itemSectionRenderer
    .contents[j];

  // video, short, or livestream
  if (tagName === "YTD-VIDEO-RENDERER") {
    const title = rawData.videoRenderer.title.runs[0].text;

    const duration = getSecondsFromDuration(rawData.videoRenderer.lengthText.simpleText);
    const views = +rawData.videoRenderer.viewCountText.simpleText.split(" ")[0].split(",").join("");
    const uploadYear = getActualUploadYear(rawData.videoRenderer.publishedTimeText.simpleText);
    const watched = rawData.videoRenderer.isWatched || false;

    let type = duration > 60*3 ? "video" : "short";
    if (rawData.videoRenderer.publishedTimeText.simpleText.split(" ")[0] === "Streamed") {
      type = "live";
    }

    data.set(title, { type: type, title: title, duration: duration, views: views, uploadYear: uploadYear, watched: watched, hidden: false });
    //checkVideo(data.get(title));
  }

  // playlist
  else if (tagName === "YT-LOCKUP-VIEW-MODEL") {
    const title = rawData.lockupViewModel.metadata.lockupMetadataViewModel.title.content;

    const duration = undefined;
    const views = undefined;
    const type = "playlist";
    const uploadYear = undefined;
    const watched = undefined;

    data.set(title, { type: type, title: title, duration: duration, views: views, uploadYear: uploadYear, watched: watched, hidden: false });
    //checkVideo(data.get(title));
  }

  // have yet to test without ad blocker
  else if (tagName === "YTD-AD-SLOT-RENDERER") {}

  // grid of shorts
  else if (tagName === "GRID-SHELF-VIEW-MODEL") {
    // I need to loop through the shorts in the rows and treat them as separate videos
    // ytGridShelfViewModelGridShelfRow
    // I may want to abstract the previous video/short section of this whole thing and use it here too
  }

  // idek
  else if (tagName === "YTD-SEARCH-PYV-RENDERER") {}

  // people also watched
  else if (tagName === "YTD-SHELF-RENDERER") {}

  // channel
  else if (tagName === "YTD-CHANNEL-RENDERER") {
    const title = rawData.channelRenderer.title.simpleText;

    const duration = undefined;
    const views = undefined;
    const type = "channel";
    const uploadYear = undefined;
    const watched = undefined;

    data.set(title, { type: type, title: title, duration: duration, views: views, uploadYear: uploadYear, watched: watched, hidden: false });
    //checkVideo(data.get(title));
  }
}

// consider a helpers.js to store stuff like this
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
