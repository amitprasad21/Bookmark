// Minimal popup script - opens the app with prefilled URL and title
(function () {
  const WEB_APP_URL = "http://localhost:3000"; // <- UPDATE for production (use your deployed URL)

  const isValidUrl = (u) => {
    try {
      const parsed = new URL(u);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (e) {
      return false;
    }
  };

  const normalizeWebAppUrl = (rawUrl) => {
    if (!rawUrl) return DEFAULT_WEB_APP_URL;

    try {
      const parsed = new URL(rawUrl);
      return parsed.origin;
    } catch (e) {
      return DEFAULT_WEB_APP_URL;
    }
  });
})();
// Minimal popup script - opens the app with prefilled URL and title
(function () {
  const WEB_APP_URL = "http://localhost:3000"; // <- UPDATE for production (use your deployed URL)

  const getWebAppUrl = async () => {
    try {
      const result = await chrome.storage.sync.get("webAppUrl");
      return normalizeWebAppUrl(result.webAppUrl);
    } catch (e) {
      return DEFAULT_WEB_APP_URL;
    }
  };

  const el = document.getElementById("save");
  const status = document.getElementById("status");

  el.addEventListener("click", async () => {
    try {
      status.textContent = "Fetching active tab...";

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.url) {
        status.textContent = "No active tab found.";
        return;
      }

      if (!isValidUrl(tab.url)) {
        status.textContent = "This page cannot be bookmarked.";
        return;
      }

      const webAppUrl = await getWebAppUrl();
      const url = encodeURIComponent(tab.url);
      const title = encodeURIComponent(tab.title || "");
      const target = `${webAppUrl}/bookmark/add?url=${url}&title=${title}&source=extension-popup`;

      // Open the web app in a new tab so user can edit and confirm
      await chrome.tabs.create({ url: target });
      status.textContent = "Opened Smart Bookmark - complete the save in the new tab.";
    } catch (err) {
      console.error(err);
      status.textContent = "An error occurred.";
    }
  });
})();
