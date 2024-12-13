// Check if the user is on Flipkart's website
if (window.location.hostname.includes("flipkart.com")) {
    // Send the URL to the background script
    chrome.runtime.sendMessage({
      action: "checkLoginAndSend",
      url: window.location.href,
    });
  }



chrome.storage.local.get("enabled", (data) => {
if (data.enabled) {
    chrome.runtime.sendMessage({
    action: "checkLoginAndSend",
    url: window.location.href,
    });
}
});
  