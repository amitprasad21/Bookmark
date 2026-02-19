# Smart Bookmark Production & Extension Guide

## 1. Real-time Sync Troubleshooting
- Ensure Supabase Realtime is enabled in your Supabase project dashboard.
- Confirm RLS (Row Level Security) policies allow SELECT for your user.
- All hooks (`useBookmarks`, `useFolders`, `useTags`) already subscribe to real-time changes.
- If you still need to refresh manually, check browser console for errors and Supabase logs for Realtime events.

## 2. Preventing Duplicate Bookmarks
- The backend and UI should normalize URLs before saving.
- Before inserting a new bookmark, check if a normalized URL already exists for the user.
- If a duplicate is found, show a warning and do not insert.
- (If not implemented, add a check in the `addBookmark` function in `useBookmarks.ts`.)

## 3. Deploying to Vercel
1. Push your code to GitHub/GitLab.
2. Go to https://vercel.com and sign up/log in.
3. Click "New Project" and import your repo.
4. Set environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel URL)
5. Click "Deploy". Your app will be live at `https://your-app-name.vercel.app`.
6. Update the extension's `popup.js` `WEB_APP_URL` to your deployed URL.

7. In **Supabase Dashboard → Authentication → URL Configuration**, set:
   - **Site URL** = your deployed app URL (for example `https://bookmark-tawny-nine.vercel.app`)
   - Add Redirect URLs for both local and prod:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000`
     - `https://your-production-domain/auth/callback`
     - `https://your-production-domain`


## 4. OAuth Redirect Troubleshooting
- If you see URLs like `http://localhost:3000/?code=...` on production, Supabase Auth URLs are still pointing to localhost.
- Fix the Supabase URL Configuration first, then redeploy from Vercel so env changes are active.
- If using the extension, make sure `browser-extension/popup.js` points to your deployed app, not localhost.

## 5. Publishing the Chrome Extension
1. Zip the `browser-extension` folder (manifest, popup, icons).
2. Go to https://chrome.google.com/webstore/devconsole
3. Click "Add New Item" and upload your zip.
4. Fill in details, upload icons/screenshots, submit for review.
5. For Edge, Firefox, Opera: use their respective addon stores.
6. After approval, users can install from the store.

## 6. Edge Cases & Security
- Only http(s) URLs are allowed (no chrome://, file://, etc.).
- No Supabase keys or secrets are ever in the extension.
- All authentication and database logic is handled by the web app.
- Extension only passes URL/title via query params.
- Real-time sync, folder/tag filters, and AI features are not affected by the extension.

## 7. Updating the Extension for All Users
- After publishing, users will get updates automatically from the Chrome Web Store.
- For manual testing, use "Load unpacked" in `chrome://extensions`.
- Always update `WEB_APP_URL` in `popup.js` for production.

---

For more details, see `browser-extension/README.md` and `DATABASE_SETUP.md`.
