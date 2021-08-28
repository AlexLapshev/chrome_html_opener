let inputField = getInput(),
  toggle = document.getElementById("toggle"),
  jsEnabled = false

changeTitle()

function getInput() {
  return document.getElementById("paste-here");
}

function openHtml(content) {
  let url = "data:text/html," + encodeURIComponent(content);
  console.log("666")
  chrome.tabs.create({url: url})
}

inputField.addEventListener("input", (e) => {
  e.preventDefault();
  let content = inputField.value;
  if (content.startsWith("{")) {
    content = JSON.stringify(JSON.parse(content), undefined, 4);
    let doc = new DOMParser().parseFromString(`<html><body></body></html>`, "text/html")
    output(syntaxHighlight(content), doc)
    return openHtml(new XMLSerializer().serializeToString(doc))
  }
  return openHtml(prepareHtml(content))
});

toggle.addEventListener("click", async () => {
  jsEnabled = !jsEnabled
  changeTitle()
});

function prepareHtml(html) {
  if (!jsEnabled) {
    let doc = new DOMParser().parseFromString(html, "text/html")
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
    html = new XMLSerializer().serializeToString(doc)
    html = html.replace(/onload/ig, 'notonload');
  }
  return html
}

function changeTitle() {
  let toggleTitle = document.getElementById("toggle-name")
  if (jsEnabled) {
    toggleTitle.textContent = "JS is enabled"
  } else {
    toggleTitle.textContent = "JS is disabled"
  }
}

function output(inp, doc) {
  let pre = doc.createElement('pre');
  pre.style.cssText += "outline: 1px solid #ccc; padding: 5px; margin: 5px; font: 20px \"Fira Sans\", sans-serif; font-weight: bold"
  doc.body.appendChild(pre).innerHTML = inp;
}

const jsonCssMap = {
  "string": "color: green;",
  "number": "color: darkorange;",
  "boolean": "color: blue;",
  "null": "color: magenta;",
  "key": "color: #571028;"
}

function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + `" style="${jsonCssMap[cls]}">` + match + '</span>';
  });
}