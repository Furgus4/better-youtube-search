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

      // call this on blur of the input fields instead of here
      durationAndViewsFunctionality();
    }
  });
}

function durationAndViewsFunctionality() {
  const min = document.getElementById("duration-min").value;
  const max = document.getElementById("duration-max").value;

  if (min === "" || max === "") {
    return;
  }

  const videoDisplayArea = document.querySelector("ytd-search.style-scope.ytd-page-manager > div#container > ytd-two-column-search-results-renderer > div#primary > ytd-section-list-renderer > div#contents");

  for (const child of videoDisplayArea.children) {
    if (child.tagName === "YTD-ITEM-SECTION-RENDERER") {
      const videoList = child.querySelector("div#contents");
      for (const potentialVideo of videoList.children) {

        // TEMPORARY TEST
        if (potentialVideo.tagName === "YT-LOCKUP-VIEW-MODEL" || potentialVideo.tagName === "GRID-SHELF-VIEW-MODEL" || potentialVideo.tagName === "YTD-CHANNEL-RENDERER") {
          potentialVideo.remove();
        }

        if (potentialVideo.tagName === "YTD-VIDEO-RENDERER") {
          // textContext is sometimes null here for some reason, I should probably look into that
          const duration = potentialVideo.querySelector("div.yt-badge-shape__text").textContent;

          // duration gets "SHORTS" for shorts, which is bad
          // I don't want to make api calls though
          // consider web crawling to collect duration for shorts (if that's allowed)

          // TEMPORARY
          if (duration === "SHORTS") {
            // actually get short duration here
            console.log("temporarily hiding a short because I'm lazy");
            potentialVideo.remove(); //potentialVideo.hidden = true;
          }

          // doesn't work for hour-long videos
          // will probably use a separate function to do this
          let minutes = +duration.split(":")[0] + (+duration.split(":")[1] / 60);

          if (minutes < min || minutes > max) {
            potentialVideo.remove(); //potentialVideo.hidden = true;
          }

          // in the future, I'll just hide videos
          // then I can unhide them as the filters change
        }
      }
    }
  }
}