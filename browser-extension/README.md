# Smart Bookmark Browser Extension

## One-click Bookmarking (Browser Extension)

### Why an Extension is Required
- **Web apps cannot read the current tab's URL/title for security reasons.**
- Only a browser extension can access the active tab and pass data to the web app.
- No Supabase keys or secrets are ever stored in the extension.

### How It Works
1. User clicks the ⭐ extension icon in the browser toolbar.
2. The extension reads the current tab's URL and title (if allowed).
3. It opens the Smart Bookmark web app at `/bookmark/add?url=...&title=...&source=extension-popup`.
4. The web app pre-fills the Add Bookmark form with the URL and title.
5. User can edit, categorize, and save the bookmark as usual.
6. If not logged in, the app prompts for Google login and resumes the flow after authentication.

### Extension Folder Structure
```
browser-extension/
  manifest.json
  popup.html
  popup.js
  background.js
  icons/
    icon16.png
    icon48.png
    icon128.png
```

### Key Code Snippets
#### manifest.json
```json
{
  "manifest_version": 3,
  "name": "Smart Bookmark - Quick Save",
  "version": "1.0.0",
  "action": { "default_popup": "popup.html" },
  "permissions": ["activeTab", "scripting", "storage"],
  "background": { "service_worker": "background.js" },
  "icons": { "16": "icons/icon16.png", "48": "icons/icon48.png", "128": "icons/icon128.png" }
}
```

#### popup.js
```js
const WEB_APP_URL = "http://localhost:3001";
const isValidUrl = (u) => { try { const parsed = new URL(u); return parsed.protocol === "http:" || parsed.protocol === "https:"; } catch { return false; } };
document.getElementById("save").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !isValidUrl(tab.url)) return;
  const url = encodeURIComponent(tab.url);
  const title = encodeURIComponent(tab.title || "");
  const target = `${WEB_APP_URL}/bookmark/add?url=${url}&title=${title}&source=extension-popup`;
  await chrome.tabs.create({ url: target });
});
```

### Web App Integration
- `/bookmark/add` page reads `url` and `title` from query params.
- If user is not logged in, redirects to Google login and resumes after auth.
- All existing manual paste, AI, and folder/tag features remain unchanged.

### Edge Cases Checklist
- [x] No Supabase keys in extension
- [x] Only http(s) URLs allowed
- [x] Handles restricted pages (chrome://, file://)
- [x] No duplicate bookmarks (web app checks)
- [x] Works across tabs/windows
- [x] No impact on real-time sync, folders, tags, or AI

### Security Notes
- Extension never stores or accesses user credentials
- All authentication and database logic handled by the web app
- Extension only passes URL/title via query params

---

**For production, update `WEB_APP_URL` in popup.js to your deployed app URL.**
