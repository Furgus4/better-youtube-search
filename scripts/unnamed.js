const filterSettings = { // updates when the user changes the filters
  "video": true, // setting everything to false could be a good way to test this in the future as some things are slipping through
  "short": false,
  "playlist": false,
  "channel": false,
  "podcast": false,
  "live": false,
  "song": false,

  duration: [60*10, 60*20], // temp hard coding of 10 to 20 minutes
  views: [undefined, undefined],

  //uploadDate: [undefined, undefined],

  //keywords: [],
  //tags: [],

  //sortBy: "default",

  //show: "all",
  //"suggested": true,
  //"for you": true,
  //"people also watched": true,
  //"sponsored": true
}

function checkVideo(v) {
  // still need to account for when the video settings are undefined

  // type
  if (!filterSettings[v.type]) {
    v.hidden = true;
    console.log("type not included");

  // duration
  } else if (v.duration < filterSettings.duration[0] && filterSettings.duration[0] !== undefined) {
    v.hidden = true;
    console.log("was too short");
  } else if (v.duration > filterSettings.duration[1] && filterSettings.duration[1] !== undefined) {
    v.hidden = true;
    console.log("was too long");

    // views
  } else if (v.views < filterSettings.views[0] && filterSettings.views[0] !== undefined) {
    v.hidden = true;
    console.log("didn't have enough views");
  } else if (v.views > filterSettings.views[1] && filterSettings.views[1] !== undefined) {
    v.hidden = true;
    console.log("had too many views");

    // upload date
  } else if ("") {
    // ...
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