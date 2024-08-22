// Check if SpeechRecognition is supported
let recognition;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser.");
} else {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Set language
    recognition.interimResults = false; // True if you want to see interim results
    recognition.continuous = true; // keep listening
    
    recognition.onresult = function (event) {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');// Get the recognized text
        document.getElementById("result").value = transcript;
    };
    recognition.onerror = function (event) {
        // const resultDiv = document.getElementById('result');
        switch (event.error) {
            case 'no-speech':
                // resultDiv.value = "No speech was detected. Please try again.";
                console.log("No speech was detected. Please try again.");
                break;
            case 'audio-capture':
                console.log("No microphone was found. Please ensure that a microphone is installed.")
                // resultDiv.value = "No microphone was found. Please ensure that a microphone is installed.";
                break;
            case 'not-allowed':
                console.log("Permissions have not been granted to use the microphone.");
                // resultDiv.value = "Permissions have not been granted to use the microphone.";
                break;
            case 'service-not-allowed':
                console.log("Access to the speech recognition service is denied.");
                // resultDiv.value = "Access to the speech recognition service is denied.";
                break;
            case 'bad-grammar':
                console.log("There was a problem with the grammar in your speech.");
                // resultDiv.value = "There was a problem with the grammar in your speech.";
                break;
            default:
                console.log(`Error occurred in recognition:${event.error}`)
                // resultDiv.value = "Error occurred in recognition: " + event.error;
        }
    };
}


document.getElementById("start-btn").addEventListener("click", () => {
    if (recognition) {
        recognition.start();
        console.log("Voice detection started");
        document.getElementById("start-btn").disabled = true;
        document.getElementById("stop-btn").disabled = false;
    }
});

document.getElementById("stop-btn").addEventListener("click", () => {
    if (recognition) {
        recognition.stop();
        console.log("Voice detection stopped");
        document.getElementById("start-btn").disabled = false;
        document.getElementById("stop-btn").disabled = true;
    }
});

document.addEventListener("DOMContentLoaded", function () {
  let searchInput = document.getElementById("result");
    let firstpos = 0;
    let searchStr;
    searchInput.addEventListener("input", function () {
        let searchString = searchInput.value;
        // if (searchString.charAt(searchString.length - 1) == " "||searchString.charAt(searchString.length - 1) == "."||searchString.charAt(searchString.length - 1) == "\n") {
            searchStr = searchString.slice(firstpos, searchString.length - 1);
            firstpos = searchString.length;
            console.log(searchStr);
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
              const activeTab = tabs[0];
              chrome.scripting.executeScript({
                  target: { tabId: activeTab.id },
                  function: highlightText,
                  args: [searchStr]
              });
              
          });
            
        // }
    });
    // document.getElementById("reset-btn").addEventListener("click", () => {
    //     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //         const activeTab = tabs[0];
    //         chrome.scripting.executeScript({
    //             target: { tabId: activeTab.id },
    //             function: remove
    //         });
            
    //     });
        
    // });
});
// function remove() {
//     document.body.innerHTML.replace(/<span id="highlightedString".*?>/g, '');
//     console.log(document.body.innerHTML);
// }
function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
      return `rgb(${r}, ${g}, ${b})`;
}
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
//     // If input text is empty, just return
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
//     document.getElementById("res").innerTEXT = "Process Finished!";
// }


// Function to highlight the specified text
function highlightText(text) {
    console.log('eheh');
    // If input text is empty, just return
    if (text == '') {
        text = '!@#';
    }
    let webpageContent = getHtmlContent();
    console.log("webpaageContent",webpageContent);
    const regex = new RegExp(text, 'gi');

    // Remove previous highlights
    const cleanedText = webpageContent.replace(/<\/?mark[^>]*>/g, '');

    // Highlight new text
    const highlightedText = cleanedText.replace(
        regex,
        (match) => `<mark class="highlight">${match}</mark>`
    );

    document.body.innerHTML = highlightedText;
}
