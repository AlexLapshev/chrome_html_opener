let inputField = getInput()

function getInput () {
  return document.getElementById("paste-here");
}

function openHtml(html) {
  let url = "data:text/html," + encodeURIComponent(html);
  chrome.tabs.create({url: url});
}

inputField.addEventListener("paste", async (event) => {
  setTimeout(() => openHtml(getInput().value), 0.001);
});
