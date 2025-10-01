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
        "<div class='dropdown hidden'>Test</div>" +
      "</div>" +
      "<div id='dav' class='d-container'>" +
        "<div class='chip'>Duration & Views<span class='icon'>V</span></div>" +
        "<div class='dropdown hidden'>Test 2</div>" +
      "</div>" +
      "<div id='ud' class='d-container'>" +
        "<div class='chip'>Upload Date<span class='icon'>V</span></div>" +
        "<div class='dropdown hidden'>Test 3</div>" +
      "</div>" +
      "<div id='kat' class='d-container'>" +
        "<div class='chip'>Keywords & Tags<span class='icon'>V</span></div>" +
        "<div class='dropdown hidden'>Test 4</div>" +
      "</div>" +
      "<div id='sb' class='d-container'>" +
        "<div class='chip'>Sort By<span class='icon'>V</span></div>" +
        "<div class='dropdown hidden'>Test 5</div>" +
      "</div>" +
    "</div>" +
    "<div id='v' class='d-container'>" +
      "<div class='chip'>View<span class='icon'>V</span></div>" +
      "<div class='dropdown hidden'>Test 6</div>" +
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
    containers[i].onclick = (e) => {
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
