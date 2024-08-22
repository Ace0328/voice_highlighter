// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getStatus") {
        sendResponse({ status: "Background script is running." });
    }
});

// You could handle additional logic here for long-running tasks or listeners
console.log("Background script is initialized.");