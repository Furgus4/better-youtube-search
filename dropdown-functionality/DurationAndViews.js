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
  let min = document.getElementById("duration-min").value;
  let max = document.getElementById("duration-max").value;

  if (min === "" || max === "") {
    return;
  } else {
    // format min and max into seconds here if they weren't already in seconds
    // (can't do this until UI is more complete) ...

    // TEMPORARY
    min *= 60;
    max *= 60;
  }

  const videoDisplayArea = document.querySelector("ytd-search.style-scope.ytd-page-manager > div#container > ytd-two-column-search-results-renderer > div#primary > ytd-section-list-renderer > div#contents");

  for (const child of videoDisplayArea.children) {
    if (child.tagName === "YTD-ITEM-SECTION-RENDERER") {
      const videoList = child.querySelector("div#contents");
      for (const potentialVideo of videoList.children) {

        // declutter for testing
        if (potentialVideo.tagName === "YT-LOCKUP-VIEW-MODEL" || potentialVideo.tagName === "GRID-SHELF-VIEW-MODEL" || potentialVideo.tagName === "YTD-CHANNEL-RENDERER") {
          potentialVideo.remove();
        }

        if (potentialVideo.tagName === "YTD-VIDEO-RENDERER") {
          // textContext is sometimes null here for some reason, I should probably look into that
          const duration = potentialVideo.querySelector("div.yt-badge-shape__text").textContent;

          if (duration === "SHORTS") {
            if (min > 3*60) {
              // maximum length of shorts is 3 minutes
              potentialVideo.remove(); //potentialVideo.hidden = true;
            } else {
              // actually get a duration somehow

              // potentially by using stuff from injected-script?
              // idk i think i might have to call stuff from the context of the injected script,
              // because how would it figure out what data it needs
              // or maybe from here I'll call something that tells the injected script what to do somehow

              // ...
            }
          }

          let seconds = getSecondsFromDuration(duration);

          // Temporary
          if (seconds <= min || seconds >= max) {
            potentialVideo.remove(); //potentialVideo.hidden = true;
          }

          // should I reload when filters change?
          // or should I just unhide certain videos
          // where would this even happen?
        }
      }
    }
  }

  function getSecondsFromDuration(d) {
    let s = 0;
    let arr = d.split(":").reverse();

    for (let i = 0; i < arr.length; i++) {
      s += (+arr[i]) * (60 ** (i));
    }
    return s;
  }
}