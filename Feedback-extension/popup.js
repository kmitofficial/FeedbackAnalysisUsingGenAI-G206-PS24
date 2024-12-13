document.getElementById("toggle").addEventListener("click", () => {
    chrome.storage.local.get("enabled", (data) => {
      const newState = !data.enabled;
      chrome.storage.local.set({ enabled: newState }, () => {
        alert(`Extension is now ${newState ? "enabled" : "disabled"}`);
      });
    });
  });
  