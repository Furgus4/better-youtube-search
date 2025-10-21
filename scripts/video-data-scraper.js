if (ytInitialData.contents.twoColumnSearchResultsRenderer === undefined) {
  location.reload();
  // for some reason ytInitialData.contents.twoColumnSearchResultsRenderer doesn't exist on the first load
}

const data = new Map();

function addData(type, title, duration, views, uploadYear, watched) {
  const newData = { type: type, title: title, duration: duration, views: views, uploadYear: uploadYear, watched: watched, hidden: false }
  data.set(title, newData);
  checkVideo(data.get(title));
}

const videoDataObserver = new MutationObserver(getDataFromSearchResults);
let videoDisplayArea = document.querySelector("ytd-search.style-scope.ytd-page-manager > div#container > ytd-two-column-search-results-renderer > div#primary > ytd-section-list-renderer > div#contents");
videoDataObserver.observe(videoDisplayArea, { attributes: false, childList: true, subtree: true });

function getDataFromSearchResults() {
  const elementGroupings = videoDisplayArea.children;
  for (let i = 0; i < elementGroupings.length; i++) {
    if (elementGroupings[i].tagName !== "YTD-ITEM-SECTION-RENDERER") continue;

    const elements = elementGroupings[i].querySelector("div#contents").children;

    for (let j = 0; j < elements.length; j++) {
      const rawData = ytInitialData
          .contents.twoColumnSearchResultsRenderer
          .primaryContents.sectionListRenderer
          .contents[i].itemSectionRenderer
          .contents[j];

      // video or short or livestream
      if (elements[j].tagName === "YTD-VIDEO-RENDERER") {
        const title = rawData.videoRenderer.title.runs[0].text;
        if (data.has(title)) continue;

        const duration = getSecondsFromDuration(rawData.videoRenderer.lengthText.simpleText);
        const views = +rawData.videoRenderer.viewCountText.simpleText.split(" ")[0].split(",").join("");
        const uploadYear = getActualUploadYear(rawData.videoRenderer.publishedTimeText.simpleText);
        const watched = rawData.videoRenderer.isWatched || false;

        let type = duration > 60*3 ? "video" : "short";
        if (rawData.videoRenderer.publishedTimeText.simpleText.split(" ")[0] === "Streamed") {
          type = "live";
        }

        // I did this so that I could easily hide the video,
        // but I may just find the video in the hiding function using the title and querySelector instead
        elements[j].id = title;
        addData(type, title, duration, views, uploadYear, watched);

      // playlist
      } else if (elements[j].tagName === "YT-LOCKUP-VIEW-MODEL") {
        const title = rawData.lockupViewModel.metadata.lockupMetadataViewModel.title.content;
        if (data.has(title)) continue;

        const duration = undefined;
        const views = undefined;
        const type = "playlist";
        const uploadYear = undefined;
        const watched = undefined;
        const subType = undefined;

        elements[j].id = title;
        addData(type, title, duration, views, uploadYear, watched, subType);

      // ad? have yet to test without ad blocker
      } else if (elements[j].tagName === "YTD-AD-SLOT-RENDERER") {
        elements[j].hidden = true;

      // grid of shorts
      } else if (elements[j].tagName === "GRID-SHELF-VIEW-MODEL") {
        elements[j].hidden = true; // hide for now because I'm lazy

        // I need to loop through the shorts in the rows and treat them as separate videos
        // ytGridShelfViewModelGridShelfRow
        // I may want to abstract the previous video/short section of this whole thing and use it here too

      } else if (elements[j].tagName === "YTD-SEARCH-PYV-RENDERER") {
        // idek

      // people also watched
      } else if (elements[j].tagName === "YTD-SHELF-RENDERER") {
        elements[j].hidden = true; // hiding for now because i'm lazy

      // channel
      } else if (elements[j].tagName === "YTD-CHANNEL-RENDERER") {
        const title = rawData.channelRenderer.title.simpleText;
        if (data.has(title)) continue;

        const duration = undefined;
        const views = undefined;
        const type = "channel";
        const uploadYear = undefined;
        const watched = undefined;
        const subType = undefined;

        elements[j].id = title;
        addData(type, title, duration, views, uploadYear, watched, subType);
      }
    }
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