const filterSettings = { // updates when the user changes the filters
  "video": true, // setting everything to false could be a good way to test this in the future as some things are slipping through
  "short": true,
  "playlist": true,
  "channel": true,
  "live": true,
  //?"podcast": true?
  //?"song": true?

  duration: [],
  views: [],

  uploadYear: [],

  keywords: [/*"UI", "short"*/],

  sortBy: "default", // default, date, duration, views // idk how im gonna implement this yet

  show: "all", // all, watched, unwatched
  curated: true, // people also watched, explore more, ...
  //"sponsored": ?
}

function checkVideo(elementData, element) {
  // account for all the undefined stuff that could happen

  // type
  if (!filterSettings[elementData.type]) {
    elementData.hidden = true;
    console.log("type not included");

  // duration
  } else if (elementData.duration < filterSettings.duration[0]) {
    elementData.hidden = true;
    console.log("was too short");
  } else if (elementData.duration > filterSettings.duration[1]) {
    elementData.hidden = true;
    console.log("was too long");

  // views
  } else if (elementData.views < filterSettings.views[0]) {
    elementData.hidden = true;
    console.log("didn't have enough views");
  } else if (elementData.views > filterSettings.views[1]) {
    elementData.hidden = true;
    console.log("had too many views");

  // upload year
  } else if (elementData.uploadYear < filterSettings.uploadYear[0]) {
    elementData.hidden = true;
    console.log("uploaded too long ago");
  } else if (elementData.uploadYear > filterSettings.uploadYear[1]) {
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

    const parentContainer = element.parentElement.parentElement.parentElement.parentElement.parentElement;
    console.log(parentContainer);
    if (!parentContainer.hidden) {
      parentContainer.hidden = true;
    }

    console.log("hiding whole thing because curated content is disabled");


  // keywords (currently a video needs all keywords otherwise it is hidden)
  // I might make it less strict or add a setting for that
  } else {
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
  element.hidden = elementData.hidden;
}

// Don't know that I'll use this
//function checkAllVideos() {
  //console.log("checking all videos");
  //data.forEach(v => {
    //checkVideo(v)
  //});
//}