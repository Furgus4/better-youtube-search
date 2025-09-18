const videoData = new Map();

// wait for a /results page
window.addEventListener("yt-navigate-finish", checkURL);
function checkURL() {
  if (document.URL.startsWith("https://www.youtube.com/results")) {
    test();
  }
}

function test() {
  console.log(ytInitialData);
  // contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents.0.itemSectionRenderer.contents.{number}.lengthText // actually has short length

  // I'll have to set up a mutation observer again,
  // but it should be pretty much exactly the same as the previous one
}