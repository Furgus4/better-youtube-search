if (ytInitialData.contents.twoColumnSearchResultsRenderer === undefined) {
  location.reload();
  // for some reason ytInitialData.contents.twoColumnSearchResultsRenderer doesn't exist on the first load
}

const videoData = new Map();
const sendData = new CustomEvent("dataSent", { detail: videoData }); // might change this to a handshake method where main.js requests data

const videoDataObserver = new MutationObserver(getDataFromSearchResults);
let videoDisplayArea = document.querySelector("ytd-search.style-scope.ytd-page-manager > div#container > ytd-two-column-search-results-renderer > div#primary > ytd-section-list-renderer > div#contents");
videoDataObserver.observe(videoDisplayArea, { attributes: false, childList: true, subtree: true });

function getDataFromSearchResults(mutationList, observer) {
  const videoGroupings = videoDisplayArea.children;
  for (let i = 0; i < videoGroupings.length; i++) {
    if (videoGroupings[i].tagName === "YTD-ITEM-SECTION-RENDERER") {
      const videos = videoGroupings[i].querySelector("div#contents").children;
      for (let j = 0; j < videos.length; j++) {
        if (videos[j].tagName === "YTD-VIDEO-RENDERER") {
          if (!videoData.has(videos[j].querySelector("a#video-title").textContent)) {
            const rawData = ytInitialData.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[i].itemSectionRenderer.contents[j].videoRenderer;
            videoData.set(videos[j].querySelector("a#video-title").textContent, {
              "duration": getSecondsFromDuration(rawData.lengthText.simpleText), // might format this here
              "views": +rawData.viewCountText.simpleText.split(" ")[0].split(",").join(""),
              "hidden": false
            });
            window.dispatchEvent(sendData);
          }
        }
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