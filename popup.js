let inputField = getInput(),
  toggle = document.getElementById("toggle"),
  jsEnabled = false

changeTitle()

function getInput() {
  return document.getElementById("paste-here");
}

function openHtml(html) {
  let url = "data:text/html," + encodeURIComponent(html);
  chrome.tabs.create({url: url});
}

inputField.addEventListener("paste", async () => {
  setTimeout(() => openHtml(prepareHtml(getInput().value)), 0.001);
});

toggle.addEventListener("click", async () => {
  jsEnabled = !jsEnabled
  changeTitle()
});

function prepareHtml(html) {
  let doc = new DOMParser().parseFromString(html, "text/html")

  if (!jsEnabled) {
    let scripts = doc.querySelectorAll("script"),
      searchString = "text/javascript",
      replaceString = "application/json"
    scripts.forEach(script => {
      let scriptHtml = script.outerHTML
      if (scriptHtml.includes(searchString)) {
        scriptHtml = scriptHtml.replace(searchString, replaceString)
      } else {
        scriptHtml = scriptHtml.replace("<script", `<script type="${replaceString}"`)
      }
      script.outerHTML = scriptHtml
    })
  }
  return new XMLSerializer().serializeToString(doc)
}

function changeTitle() {
  let toggleTitle = document.getElementById("toggle-name")
  if (jsEnabled) {
    toggleTitle.textContent = "JS is enabled"
  } else {
    toggleTitle.textContent = "JS is disabled"
  }
}