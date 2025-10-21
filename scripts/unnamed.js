const filterSettings = { // updates when the user changes the filters
  "video": true, // setting everything to false could be a good way to test this in the future as some things are slipping through
  "short": true,
  "playlist": true,
  "channel": true,
  "podcast": true,
  "live": true,
  "song": true,

  duration: [undefined, undefined],
  views: [undefined, undefined],

  uploadYear: [undefined, undefined],

  //keywords: [],
  //tags: [],

  //sortBy: "default",

  show: "all", // all, watched, unwatched
  //"suggested": true,
  //"for you": true,
  //"people also watched": true,
  //"sponsored": true
}

function checkVideo(v) {
  // account for all the undefined stuff that could happen

  // type
  if (!filterSettings[v.type]) {
    v.hidden = true;
    console.log("type not included");

  // duration
  } else if (v.duration < filterSettings.duration[0]) {
    v.hidden = true;
    console.log("was too short");
  } else if (v.duration > filterSettings.duration[1]) {
    v.hidden = true;
    console.log("was too long");

    // views
  } else if (v.views < filterSettings.views[0]) {
    v.hidden = true;
    console.log("didn't have enough views");
  } else if (v.views > filterSettings.views[1]) {
    v.hidden = true;
    console.log("had too many views");

    // upload year
  } else if (v.uploadYear < filterSettings.uploadYear[0]) {
    v.hidden = true;
    console.log("uploaded too long ago");
  } else if (v.uploadYear > filterSettings.uploadYear[1]) {
    v.hidden = true;
    console.log("uploaded too recently");

  // all/watched/unwatched
  } else if (v.watched && filterSettings.show === "unwatched") {
    v.hidden = true;
    console.log("hiding because you've seen this");
  } else if (v.watched === false && filterSettings.show === "watched") {
    v.hidden = true;
    console.log("hiding because you haven't seen this");
  }

  // hide or unhide videos
  if (v.hidden) {
    const domVideo = document.getElementById(v.title);
    domVideo.hidden = true;
  } else {
    const domVideo = document.getElementById(v.title);
    domVideo.hidden = false;
  }
}

// Don't know that I'll use this
//function checkAllVideos() {
  //console.log("checking all videos");
  //data.forEach(v => {
    //checkVideo(v)
  //});
//}