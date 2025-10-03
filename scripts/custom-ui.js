window.trustedTypes.createPolicy('default', {
  createHTML: (string, sink) => string
});

function sanitize(htmlText) {
  return window.trustedTypes.defaultPolicy.createHTML(htmlText);
}

const toolbarHTML =
  "<div id='main-div'>" +
    "<div id='sub-div'>" +

      "<div id='t' class='d-container'>" +
        "<div class='chip'>Type<span class='icon'>V</span></div>" +
        "<div class='dropdown hidden'>" +
          "<div>" +
            "<input type='checkbox' id='videos'/>" +
            "<label for='videos'>Videos</label>" +
          "</div>" +
          "<div>" +
            "<input type='checkbox' id='shorts'/>" +
            "<label for='shorts'>Shorts</label>" +
          "</div>" +
          "<div>" +
            "<input type='checkbox' id='playlists'/>" +
            "<label for='playlists'>Playlists</label>" +
          "</div>" +
          "<div>" +
            "<input type='checkbox' id='channels'/>" +
            "<label for='channels'>Channels</label>" +
          "</div>" +
          "<div>" +
            "<input type='checkbox' id='podcasts'/>" +
            "<label for='podcasts'>Podcasts</label>" +
          "</div>" +
          "<div>" +
            "<input type='checkbox' id='live'/>" +
            "<label for='live'>Live</label>" +
          "</div>" +
          "<div>" +
            "<input type='checkbox' id='songs'/>" +
            "<label for='songs'>Songs</label>" +
          "</div>" +
        "</div>" +
      "</div>" +

      "<div id='dav' class='d-container'>" +
        "<div class='chip'>Duration & Views<span class='icon'>V</span></div>" +
        "<div class='dropdown hidden'>" +
        "</div>" +
      "</div>" +

      "<div id='ud' class='d-container'>" +
        "<div class='chip'>Upload Date<span class='icon'>V</span></div>" +
        "<div class='dropdown hidden'>" +
          "<div>" +
            "<label for='min-date'>Min </label>" +
            "<input type='date' id='min-date'/>" +
          "</div>" +
          "<div>" +
            "<label for='max-date'>Max </label>" +
            "<input type='date' id='max-date'/>" +
          "</div>" +
        "</div>" +
      "</div>" +

      "<div id='kat' class='d-container'>" +
        "<div class='chip'>Keywords & Tags<span class='icon'>V</span></div>" +
        "<div class='dropdown hidden'>Test 4</div>" +
      "</div>" +

      "<div id='sb' class='d-container'>" +
        "<div class='chip'>Sort By<span class='icon'>V</span></div>" +
        "<div class='dropdown hidden'>" +
          "<div>" +
            "<input type='radio' id='default' name='sort-by'/>" +
            "<label for='default'>Default</label>" +
          "</div>" +
          "<div>" +
            "<input type='radio' id='date' name='sort-by'/>" +
            "<label for='date'>Date</label>" +
          "</div>" +
          "<div>" +
            "<input type='radio' id='duration' name='sort-by'/>" +
            "<label for='duration'>Duration</label>" +
          "</div>" +
          "<div>" +
            "<input type='radio' id='views' name='sort-by'/>" +
            "<label for='views'>Views</label>" +
          "</div>" +
        "</div>" +
      "</div>" +
    "</div>" +

    "<div id='v' class='d-container'>" +
      "<div class='chip'>View<span class='icon'>V</span></div>" +
      "<div class='dropdown hidden'>" +
        "<div>" +
          "<input type='radio' id='all' name='view'/>" +
          "<label for='all'>All</label>" +
        "</div>" +
        "<div>" +
          "<input type='radio' id='watched' name='view'/>" +
          "<label for='watched'>Watched</label>" +
        "</div>" +
        "<div>" +
          "<input type='radio' id='unwatched' name='view'/>" +
          "<label for='unwatched'>Unwatched</label>" +
        "</div>" +
        "<div>" +
          "<input type='checkbox' id='suggested'/>" +
          "<label for='suggested'>Suggested</label>" +
        "</div>" +
        "<div>" +
          "<input type='checkbox' id='for-you'/>" +
          "<label for='for-you'>For You</label>" +
        "</div>" +
        "<div>" +
          "<input type='checkbox' id='people-also-watched'/>" +
          "<label for='people-also-watched'>People Also Watched</label>" +
        "</div>" +
        "<div>" +
          "<input type='checkbox' id='sponsored'/>" +
          "<label for='sponsored'>Sponsored</label>" +
        "</div>" +
      "</div>" +
    "</div>" +
  "</div>";

let toolbar;
const toolbarPath = "ytd-app > div#content > ytd-page-manager > ytd-search > div#container > div#header > ytd-search-header-renderer";

const toolbarObserver = new MutationObserver((mutationList, observer) => {
  if (document.querySelector(toolbarPath) !== null) {
    observer.disconnect();
    toolbar = document.querySelector(toolbarPath);
    toolbar.innerHTML = sanitize(toolbarHTML);
    addListeners();
  }
});

toolbarObserver.observe(document.querySelector("ytd-app"), { childList: true, subtree: true });

function addListeners() {
  const containers = document.getElementsByClassName("d-container");

  for (let i = 0; i < containers.length; i++) {
    let chip = containers[i].querySelector(".chip");
    chip.onclick = (e) => {
      showDropdown(containers[i]);
    };
  }

  function showDropdown(c) {
    const d = c.querySelector(".dropdown");
    d.classList.toggle("hidden");
    const icon = c.querySelector(".icon");
    icon.classList.toggle("flipped");

    for (let i = 0; i < containers.length; i++) {
      const currD = containers[i].querySelector(".dropdown");
      if (currD !== d) {
        currD.classList.add("hidden");
      }
      const currIcon = containers[i].querySelector(".icon");
      if (currIcon !== icon) {
        currIcon.classList.remove("flipped");
      }
    }
  }
}
