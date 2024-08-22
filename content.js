// Function to random background color for highlighttext
function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`; 
}
// Check innerContentText or innerTagText
function isBetweenTags(str) {
  return str.includes("<") && str.includes(">") && str.indexOf("<") && str.indexOf(">"); // Return true if the string is between "<" and ">"
}

function getHtmlContent() {
   let body = document.body;
  let childNodes = body.childNodes;
  let htmlContent = [];

  for (let i = 0; i < childNodes.length; i++) {
    let node = childNodes[i];
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.nodeName === 'STYLE' || node.nodeName === 'SCRIPT') {
        continue;
      }
      if (node.childNodes.length > 0) {
        htmlContent.push(node.outerHTML);
      }
    }
  }

  return htmlContent.join('');
}
// // Function to highlight the specified text
// function highlightText(text) {
//     if (!text) return;
//     let webpageContent = getHtmlContent();
//     let color = getRandomColor();
//     let highlightedString = `<span id='highlightedString' style='background-color: yellow;'>` + text + "</span>";
//     let highlightedContent = webpageContent.replace(new RegExp(text, 'gi'), function (x) {
//         if (isBetweenTags(x)) {
//             return;
//         }
//         else
//             return highlightedString;
//     });
//     document.body.innerHTML = highlightedContent;
//     document.getElementById("res").textContent = "Process Finished!";

// }
// Function to highlight the specified text
function highlightText(text) {
    // If input text is empty, just return
    if (text == '') {
        text = '^&^&^&^&^&';
    }
    let webpageContent = getHtmlContent();
    const regex = new RegExp(text, 'gi');

    // Remove previous highlights
    const cleanedText = webpageContent.replace(/<\/?mark[^>]*>/g, '');

    // Highlight new text
    const highlightedText = cleanedText.replace(
        regex,
        (match) => `<mark class="highlight">${match}</mark>`
    );

    body.innerHTML = highlightedText;
}
// Function to listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.text) {
        highlightText(request.text);
        sendResponse({ status: "success" });
    }
});
