/**
 * Bookmark Add Page (/bookmark/add)
 * 
 * Page specifically for adding bookmarks from browser extension
 * 
 * Features:
 * 1. Pre-fills URL and title from query parameters
 * 2. Smaller form focused on single bookmark
 * 3. Redirects to extension or home after saving
 * 4. Validates authentication
 * 
 * Query Parameters:
 * - url: Website URL to bookmark
 * - title: Website title (auto-detected)
 * - source: Where the request came from (extension-popup, etc)
 * 
 * Used by browser extension:
 * 1. Extension detects current tab URL and title
 * 2. Opens /bookmark/add?url=...&title=...
 * 3. Form is pre-filled
 * 4. User clicks Save
 * 5. Bookmark is added to database
 * 6. Tab closes or redirects
 */

"use client";

import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoginPage } from "@/components/LoginPage";
import { AppHeader } from "@/components/AppHeader";
import { AddBookmarkForm } from "@/components/AddBookmarkForm";
import { Loader2 } from "lucide-react";

export default function BookmarkAddPage() {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();

  const initialUrl = searchParams.get("url") || "";
  const initialTitle = searchParams.get("title") || "";
  const source = searchParams.get("source") || "manual";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <AppHeader />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {source === "extension-popup" && (
            <p className="text-sm text-muted-foreground mb-4">
              📌 Adding bookmark from browser
            </p>
          )}

          <AddBookmarkForm
            initialUrl={initialUrl}
            initialTitle={initialTitle}
            onSuccess={() => {
              // Optionally close the window if opened from extension
              if (source === "extension-popup") {
                window.close();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
