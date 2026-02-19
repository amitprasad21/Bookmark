/**
 * Bookmark Add Page (/bookmark/add)
 */

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoginPage } from "@/components/LoginPage";
import { AppHeader } from "@/components/AppHeader";
import { AddBookmarkForm } from "@/components/AddBookmarkForm";
import { Loader2 } from "lucide-react";

function BookmarkAddContent() {
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
            <p className="text-sm text-muted-foreground mb-4">📌 Adding bookmark from browser</p>
          )}

          <AddBookmarkForm
            initialUrl={initialUrl}
            initialTitle={initialTitle}
            onSuccess={() => {
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

export default function BookmarkAddPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <BookmarkAddContent />
    </Suspense>
  );
}
