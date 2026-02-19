# Smart Bookmark Manager

A Chrome-inspired, cross-browser bookmark manager that lets users save, organize, and manage bookmarks with folders, tags, real-time sync, and AI-powered categorization — all without browser extensions.

🔖 **An intelligent bookmark management system with dark theme, real-time sync, and AI categorization**

---

## 🚀 Features

- **🔐 Google Authentication** - Secure login with Google OAuth via Supabase
- **📌 Bookmark with One Click** - Save any webpage instantly using a bookmarklet
- **📁 Folder-Based Organization** - Create unlimited folders with collapsible sidebar
- **🏷️ Color-Coded Tags** - Tag bookmarks with multiple categories and visual filters
- **🎯 AI Auto-Categorization** - Automatically suggest folders and tags using Gemini Flash
- **⚡ Real-Time Sync** - Changes sync instantly across all browser tabs
- **🌙 Dark/Light Theme** - Full dark mode with system preference detection
- **🔍 Advanced Search & Filtering** - Full-text search across URLs and titles
- **⌨️ Drag-and-Drop Reordering** - Persist custom bookmark order
- **📱 Mobile-Friendly** - Responsive design (sidebar hidden on small screens)
- **📌 Browser Extension** - One-click bookmarking from any website (optional)
- **🔄 Quick-Save & Edit** - Popup interface for fast bookmarking

---

## 🧠 How It Works (High Level)

- **Users log in** with their Google account
- **Bookmarks are stored privately** per user in Supabase PostgreSQL
- **A bookmarklet** allows saving the current page from any browser (no extension needed)
- **Clicking a bookmark** redirects to the original URL
- **All changes sync in real time** using Supabase Realtime subscriptions
- **AI suggests categorization** via Gemini Flash (optional)

---

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible component library
- **next-themes** - Dark mode support

### Backend & Services
- **Supabase** - PostgreSQL database, authentication, real-time subscriptions
- **Google OAuth** - Secure authentication
- **Gemini Flash AI** - Auto-categorization (optional)

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

---

## 🏗️ Project Structure

```
smart-bookmark-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with theme provider
│   │   ├── page.tsx            # Main dashboard
│   │   ├── api/                # API routes
│   │   ├── auth/               # OAuth callback
│   │   └── bookmark/           # Bookmarklet integration
│   ├── components/             # React components
│   │   ├── AddBookmarkForm.tsx
│   │   ├── AppHeader.tsx
│   │   ├── BookmarkCard.tsx
│   │   ├── FolderSidebar.tsx
│   │   ├── LoginPage.tsx
│   │   ├── TagBar.tsx
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useBookmarks.ts
│   │   ├── useFolders.ts
│   │   ├── useTags.ts
│   │   └── useTheme.ts
│   ├── integrations/           # External service integration
│   │   └── supabase/
│   ├── lib/                    # Utility functions
│   ├── globals.css             # Global styles + dark theme
│   └── middleware.ts           # Request middleware
├── browser-extension/          # Chrome/Edge extension (optional)
├── node_modules/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── Documentation files (QUICKSTART.md, COMPLETE_GUIDE.md, etc.)
```

---

## 📦 Getting Started (Run Locally)

### 1️⃣ Prerequisites

Make sure you have:
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)

Check versions:
```bash
node -v
npm -v
```

### 2️⃣ Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd smart-bookmark-nextjs
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

You can find these values in your [Supabase project settings](https://supabase.com/dashboard).

### 5️⃣ Set Up Database

Follow [DATABASE_SETUP.md](DATABASE_SETUP.md) to create required tables in Supabase.

### 6️⃣ Start Development Server

```bash
npm run dev
```

The app will be available at:
```
http://localhost:3000
```

Hot reload is enabled — your changes appear instantly!

---

## ⭐ Bookmarklet Setup (One-Time)

1. **Open the app** in your browser at `http://localhost:3000`
2. **Click the `</>`** icon in the header (top-right area)
3. **Drag the "Smart Bookmark"** button to your browser's bookmarks bar
4. **Visit any website** and click the bookmarklet button to save it

The bookmarklet works on any website without needing the extension.

---

## 🔐 Authentication

- **Google OAuth** is used for secure, passwordless login
- **Each user can only access their own bookmarks** (enforced at database level)
- **Sessions are automatically managed** via Supabase Auth
- **Data security is enforced** through Row-Level Security (RLS) policies

---

## 🛠️ Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run tests
npm test
```

---

## 🔄 Real-Time Features

### How Multi-Tab Sync Works

When you have 2+ tabs open with the app:

```
Tab A: User adds/edits/deletes bookmark
    ↓
Database receives change
    ↓
Supabase broadcasts to all subscribers
    ↓
Tab B receives update instantly
    ↓
Tab B state updates automatically
    ↓
Tab B UI re-renders
    ↓
Bookmark appears/updates in Tab B WITHOUT refresh!
```

### What triggers real-time updates:
- ✅ Adding bookmarks
- ✅ Editing bookmarks  
- ✅ Deleting bookmarks
- ✅ Moving bookmarks between folders
- ✅ Adding/removing tags
- ✅ Creating folders
- ✅ Creating tags

All changes are observed **instantly across all browser tabs and windows**!

---

## 🌙 Dark Theme

The application includes a fully implemented dark/light mode system:

### How It Works
- Uses **next-themes** for theme management
- CSS **custom properties (variables)** define colors
- **Tailwind CSS** applies variables to components
- **Automatic system detection** - respects OS preference
- **User preference persists** to localStorage

### Key Features
- Seamless dark/light toggle in header
- Respects system theme on first load
- All components react instantly to theme changes
- No page reload needed

For detailed dark theme documentation, see [DARK_THEME_GUIDE.md](DARK_THEME_GUIDE.md)

---

## 🔐 Security

### Safe by Design

- **No secrets in extension** - All API calls happen in the web app
- **User isolation** - Users only see their own bookmarks (RLS enforced)
- **Google OAuth** - Industry-standard secure authentication
- **HTTPS only** - Required in production
- **Auto token refresh** - Sessions stay valid automatically

### How RLS (Row Level Security) Works

Database policies ensure:
```sql
-- Users only see their own bookmarks
SELECT * FROM bookmarks WHERE user_id = auth.uid()

-- Users only modify their own bookmarks
UPDATE bookmarks SET ... WHERE user_id = auth.uid()

-- Cannot be bypassed - enforced at database level
```

---
## 🎯 How Everything Works

### Data Flow

```
User Action (click button, submit form, etc)
    ↓
React Component / Custom Hook
    ↓
Supabase Client (Browser)
    ↓
Supabase Cloud
    ├─ PostgreSQL Database
    ├─ Authentication
    ├─ Realtime Subscriptions
    └─ Edge Functions
    ↓
Real-time Update Event
    ↓
All Subscribed Clients
    ├─ Tab A
    ├─ Tab B
    └─ Browser Extension
    ↓
State Update + UI Re-render
```

### Key Concepts

#### 1. **Custom Hooks**
Five custom hooks manage all app logic:
- `useAuth` - Login/logout, session management
- `useBookmarks` - Add/delete/edit bookmarks, realtime sync
- `useFolders` - Create/delete folders, folder management
- `useTags` - Create/delete tags, tag operations
- `useTheme` - Dark/light mode toggle

#### 2. **Real-Time Subscriptions**
When data changes in the database, **all clients are notified instantly** without polling:

```typescript
// In useBookmarks hook
.on("postgres_changes", { event: "INSERT", ... }, (payload) => {
  // New bookmark was added in database
  // Hook receives event instantly via WebSocket
  // All tabs see update without page refresh
})
```

#### 3. **Database Schema**
Main tables with RLS policies:
- `bookmarks` - User's saved bookmarks with URLs, titles, descriptions
- `folders` - User's folder structure
- `tags` - User's tags with colors
- `bookmark_tags` - Many-to-many relationship for bookmarks and tags

#### 4. **Authentication Flow**
```
User clicks "Sign in with Google"
    ↓
Redirects to Google OAuth consent
    ↓
User grants permission to app
    ↓
Redirected back to /auth/callback
    ↓
Supabase exchanges authorization code for session
    ↓
Session stored securely in browser
    ↓
User is logged in, app loads personalized bookmarks
```

---

## 📱 Browser Support

### Desktop
- ✅ Chrome/Chromium (with browser extension)
- ✅ Edge (with browser extension)
- ✅ Brave (with browser extension)
- ✅ Firefox (with browser extension)
- ✅ Safari

### Mobile
- ✅ iOS Safari (web app)
- ✅ Android Chrome (web app)
- ❌ Mobile extensions (not supported by browsers)

---

## 🚀 Deployment

### Recommended: Vercel

Vercel makes deploying Next.js apps trivial:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Then set environment variables in Vercel dashboard.

### Other Options
- AWS (EC2, Amplify)
- Google Cloud
- Digital Ocean
- Azure
- Self-hosted with Docker

See [PRODUCTION_AND_EXTENSION_GUIDE.md](PRODUCTION_AND_EXTENSION_GUIDE.md) for detailed deployment steps.

---

## 🧩 Main Components

### Authentication
- `LoginPage` - Google sign-in interface

### Navigation & Layout
- `AppHeader` - Top navigation, theme toggle, user menu
- `FolderSidebar` - Folder list and management
- `TagBar` - Tag filtering and creation

### Bookmarks
- `AddBookmarkForm` - Form to add/edit bookmarks
- `BookmarkCard` - Single bookmark display with actions

### UI Library
- Reusable components from `src/components/ui/` (button, input, card, label, toast)

---

## 🐛 Troubleshooting

### Common Issues

**"Cannot find module '@/...'"**
- Run `npm install`
- Verify `tsconfig.json` path aliases
- Check file names match exactly (case-sensitive)

**Dark mode not working**
- Clear browser localStorage
- Hard refresh (Ctrl+Shift+R)
- Verify `globals.css` CSS variables are defined
- Check browser DevTools → Computed styles

**Bookmarks not syncing across tabs**
- Check browser console (F12) for errors
- Verify Supabase RLS policies are correct
- Check Network tab → WebSocket connection
- Enable Realtime in Supabase dashboard

**Extension not detecting tab**
- Reload extension in `chrome://extensions/`
- Verify `popup.js` `WEB_APP_URL` matches your app URL
- Ensure development server is running
- Check popup console (right-click popup → Inspect)

**Login failing**
- Verify Supabase project is active
- Check Google OAuth credentials in Supabase settings
- Verify callback URL matches your app domain
- Check browser console for specific error

See **[COMPLETE_GUIDE.md](COMPLETE_GUIDE.md)** for detailed troubleshooting section.

---
### External Documentation
- [Next.js Documentation](https://nextjs.org/docs) - Framework docs
- [Supabase Docs](https://supabase.com/docs) - Backend setup
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling docs
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management

---

## 💡 Key Insights

### Why Real-Time Matters
- Users see changes **instantly** without manual refresh
- Multiple users' changes sync **automatically**
- **Feels like native desktop software**, not a web app

### Why This Architecture Scales
- Database handles all concurrency control
- Realtime broadcasts to all clients efficiently
- Each client independently filters and searches
- Works smoothly with thousands of bookmarks

### Why Dark Mode is Built-In
- **One codebase** supports both themes seamlessly
- Colors **change instantly** via CSS variables
- **No JavaScript overhead** - pure CSS-based switching
- **Respects system preferences** automatically

### Why Bookmarklet + Extension
- **Bookmarklet** works on any site without installation
- **Extension** enables keyboard shortcuts and enhanced UX
- Both are **optional** - web app works standalone

---

## 🤝 Contributing

This is a learning/reference project. Feel free to:
- ✅ Fork and customize for your needs
- ✅ Add new features and integrations
- ✅ Improve documentation and examples  
- ✅ Report bugs and suggest improvements

---

## 📄 License
all right reversed by me

---

**Happy bookmarking! 🔖**

Built with ❤️ using **Next.js**, **Supabase**, and **Tailwind CSS**
