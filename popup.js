let inputField = document.getElementById("html-input");

function openHtml(html) {
  let url = "data:text/html," + encodeURIComponent(html);
  chrome.tabs.create({ url: url });
}

inputField.addEventListener("paste", (e) => {
  e.preventDefault();
  const content = (e.originalEvent || e).clipboardData.getData('text/plain');
  openHtml(content)
});
