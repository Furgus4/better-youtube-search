if (ytInitialData.contents.twoColumnSearchResultsRenderer === undefined) {
  location.reload();
  // for some reason ytInitialData.contents.twoColumnSearchResultsRenderer doesn't exist on the first load
}

const data = new Map();

function addData(type, title, duration, views, uploadDate, watched) {
  if (!data.has(title)) {
    const newData = { type: type, title: title, duration: duration, views: views, uploadDate: uploadDate, watched: watched, hidden: false }
    data.set(title, newData);
    checkVideo(data.get(title));
  }
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

      // video or short
      if (elements[j].tagName === "YTD-VIDEO-RENDERER") {
        const title = rawData.videoRenderer.title.runs[0].text;
        const duration = getSecondsFromDuration(rawData.videoRenderer.lengthText.simpleText);
        const views = +rawData.videoRenderer.viewCountText.simpleText.split(" ")[0].split(",").join("");
        const type = duration > 60*3 ? "video" : "short";
        const uploadDate = undefined; // only because idk how to get it yet
        const watched = undefined; // idk how to get this yet either
        const subType = undefined; // could be suggested or something? idk because people also watched is its own section

        // I did this so that I could easily hide the video,
        // but I may just find the video in the hiding function using the title and querySelector instead
        elements[j].id = title;

        addData(type, title, duration, views, uploadDate, watched, subType);

      // playlist
      } else if (elements[j].tagName === "YT-LOCKUP-VIEW-MODEL") {
        const title = rawData.lockupViewModel.metadata.lockupMetadataViewModel.title.content;
        const duration = undefined; // always?
        const views = undefined; // could actually probably find this
        const type = "playlist";
        const uploadDate = undefined; // might be able to find this actually
        const watched = undefined; // idk how this would work
        const subType = undefined;

        elements[j].id = title;

        addData(type, title, duration, views, uploadDate, watched, subType);

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
        const duration = undefined;
        const views = undefined;
        const type = "channel";
        const uploadDate = undefined;
        const watched = undefined;
        const subType = undefined;

        elements[j].id = title;

        addData(type, title, duration, views, uploadDate, watched, subType);
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