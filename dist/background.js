/*global chrome*/

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openTab") {
    chrome.tabs.create({ url: request.url });
  }
});
// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getApiKey") {
    console.log("getApiKey message received in background.js");
    // Retrieve the API key from chrome.storage.local
    chrome.storage.local.get("apiKey", (result) => {
      console.log(result.apiKey);
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
      } else if (!result.apiKey) {
        sendResponse({
          error:
            "API key is missing. Please enter Perplexity API key in the extension popup.",
        });
      } else {
        sendResponse({ apiKey: result.apiKey });
      }
    });

    // Indicate asynchronous response
    return true;
  }
});
