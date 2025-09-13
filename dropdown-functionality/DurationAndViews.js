function durationAndViewsSetup(toolbar) {
  // temp UI
  const durationAndViews = document.createElement("div");
  durationAndViews.append("Duration & Views");
  durationAndViews.id = "duration-and-views";
  toolbar.appendChild(durationAndViews);

  // probably need a better way of doing this
  const davDropdown = document.createElement("div");
  davDropdown.id = "dav-dd";
  davDropdown.style.display = "none";
  davDropdown.innerHTML =
    "<label for='temp'>Temp UI</label>" +
    "<input name='temp' placeholder='Min' type='number' id='duration-min' class='text-field'>" +
    "<input placeholder='Max' type='number' id='duration-max' class='text-field'>";
  toolbar.appendChild(davDropdown);

  durationAndViews.addEventListener("mouseup", (e) => {
    if (davDropdown.style.display === "none") {
      davDropdown.style.display = "flex";
    } else if (davDropdown.style.display === "flex") {
      davDropdown.style.display = "none";

      // consider calling this on blur of the input fields instead of here
      console.log("hiding videos");
      durationAndViewsFunctionality();
    }
  });
}

function durationAndViewsFunctionality() {
  const min = document.getElementById("duration-min").value;
  const max = document.getElementById("duration-max").value;

  console.log("min: " + min);
  console.log("max: " + max);

  const videoDisplayArea = document.querySelector("ytd-search.style-scope.ytd-page-manager > div#container > ytd-two-column-search-results-renderer > div#primary > ytd-section-list-renderer > div#contents");

  for (const child of videoDisplayArea.children) {
    if (child.tagName === "YTD-ITEM-SECTION-RENDERER") {
      const videoList = child.querySelector("div#contents");
      for (const potentialVideo of videoList.children) {
        // ytd-video-renderer is a video
        // yt-lockup-view-model is a playlist
        // ytd-ad-slot-renderer is probably an ad, (test without adblocker)
        // grid-shelf-view-model has shorts in it I think

        if (potentialVideo.tagName === "YTD-VIDEO-RENDERER") {
          // right now this also gets SHORTS as a duration,
          // ill probably need to find some other way to get the duration consistently
          // I don't really want to make api calls though

          const duration = potentialVideo.querySelector("div.yt-badge-shape__text").textContent;

          // consider web crawling to the watch page to collect the duration for shorts
          // this currently hides all shorts automatically which is bad
          if (duration === "SHORTS") {
            potentialVideo.remove(); //potentialVideo.hidden = true;
          }

          let minutes = +duration.split(":")[0];
          if (minutes < min || minutes > max) { // not entirely accurate because of unaccounted seconds
            potentialVideo.remove(); //potentialVideo.hidden = true;
          }
        }
      }
    }
  }
}