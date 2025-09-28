let toolbar;
const toolbarPath = "ytd-app > div#content > ytd-page-manager > ytd-search > div#container > div#header > ytd-search-header-renderer";

const toolbarObserver = new MutationObserver((mutationList, observer) => {
  if (document.querySelector(toolbarPath) !== null) {
    observer.disconnect();
    toolbar = document.querySelector(toolbarPath);
    replaceToolbar();
  }
});

toolbarObserver.observe(document.querySelector("ytd-app"), { childList: true, subtree: true });

function replaceToolbar() {
  for (const child of toolbar.children) {
    child.remove();
  }

  const [mainDiv, subDiv, t, dav, ud, kat, sb, v] = [0, 0, 0, 0, 0, 0, 0, 0].map(() => document.createElement("div"));
  [t.className, dav.className, ud.className, kat.className, sb.className, v.className] = "chip ".repeat(6).split(" ");
  [mainDiv.id, subDiv.id, t.id, dav.id, ud.id, kat.id, sb.id, v.id] = ["main-div", "sub-div", "t", "dav", "ud", "kat", "sb", "v"];

  t.textContent   = "Type";
  dav.textContent = "Duration & Views";
  ud.textContent  = "Upload Date";
  kat.textContent = "Keywords & Tags";
  sb.textContent  = "Sort By";
  v.textContent   = "View";

  const [tI, davI, udI, katI, sbI, vI] = [0, 0, 0, 0, 0, 0].map(() => document.createElement("span"));

  const dds = [t, dav, ud, kat, sb, v];
  const ddis = [tI, davI, udI, katI, sbI, vI];

  for (let i = 0; i < dds.length; i++) {
    ddis[i].className = "icon";
    ddis[i].textContent = "V"; // will probably use an actual icon at some point
    dds[i].append(ddis[i]);
    //dds[i].onclick = (e) => { ddis[i].classList.toggle("flipped") };
  }

  toolbar.append(mainDiv);
  mainDiv.append(subDiv, v);
  subDiv.append(t, dav, ud, kat, sb);
}








