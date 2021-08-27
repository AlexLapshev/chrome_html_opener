let inputField = document.getElementById("html-input");

function openHtml(html) {
  let url = "data:text/html," + encodeURIComponent(html);
  chrome.tabs.create({ url: url });
}

inputField.addEventListener("input", (e) => {
  e.preventDefault();
  const content = inputField.value;
  openHtml(content)
});
