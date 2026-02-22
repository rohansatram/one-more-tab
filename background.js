// Opens the setup page when the extension is first installed.
function handleInstalled(details) {
  if (details.reason === "install") {
    chrome.tabs.create({ url: "setup/setup.html" });
  }
}

chrome.runtime.onInstalled.addListener(handleInstalled);
