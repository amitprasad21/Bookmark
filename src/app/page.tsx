/**
 * Home Page Component (/)
 * 
 * Main dashboard for the Smart Bookmark application
 * 
 * Features:
 * 1. Authentication check - redirects to login if not authenticated
 * 2. Layout with sidebar (folders) and main content
 * 3. Add bookmark form
 * 4. Bookmark list with filtering
 * 5. Real-time updates across tabs
 * 6. Folder and tag filtering
 * 
 * Data Flow:
 * 1. User logs in → useAuth provides user ID
 * 2. useBookmarks fetches bookmarks for user
 * 3. useFolders fetches folders for user
 * 4. useTags fetches tags for user
 * 5. User selects folder/tags → filters bookmarks
 * 6. Realtime subscriptions update state when data changes
 * 7. UI re-renders with latest data
 * 
 * Filtering Logic:
 * - If folder selected: show only bookmarks in that folder
 * - If tags selected: show only bookmarks with ALL selected tags
 * - If text search: show only bookmarks matching title/URL
 * - Multiple filters work together (AND logic)
 */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useFolders } from "@/hooks/useFolders";
import { useTags } from "@/hooks/useTags";
import { LoginPage } from "@/components/LoginPage";
import { AppHeader } from "@/components/AppHeader";
import { FolderSidebar } from "@/components/FolderSidebar";
import { TagBar } from "@/components/TagBar";
import { BookmarkCard } from "@/components/BookmarkCard";
import { AddBookmarkForm } from "@/components/AddBookmarkForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { createClient } from "@/integrations/supabase/client";
import type { BookmarkTag, Tag } from "@/integrations/supabase/types";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { bookmarks, loading: bookmarksLoading, deleteBookmark } = useBookmarks(
    user?.id
  );
  const { folders } = useFolders(user?.id);
  const { tags } = useTags(user?.id);

  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBookmarks, setFilteredBookmarks] = useState(bookmarks);
  const [bookmarkTagMap, setBookmarkTagMap] = useState<Record<string, string[]>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  const supabase = createClient();

  // Fetch bookmark-tag relationships
  useEffect(() => {
    if (!user?.id || bookmarks.length === 0) {
      setBookmarkTagMap({});
      return;
    }

    const fetchBookmarkTags = async () => {
      const { data } = await supabase
        .from("bookmark_tags")
        .select("bookmark_id, tag_id")
        .in(
          "bookmark_id",
          bookmarks.map((b) => b.id)
        );

      const tagMap: Record<string, string[]> = {};
      (data || []).forEach((bt: BookmarkTag) => {
        if (!tagMap[bt.bookmark_id]) tagMap[bt.bookmark_id] = [];
        tagMap[bt.bookmark_id].push(bt.tag_id);
      });

      setBookmarkTagMap(tagMap);

      // Subscribe to bookmark-tag changes
      const channel = supabase
        .channel(`bookmark_tags:${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmark_tags",
          },
          async () => {
            // Refetch tag mappings when they change
            const { data: newData } = await supabase
              .from("bookmark_tags")
              .select("bookmark_id, tag_id")
              .in(
                "bookmark_id",
                bookmarks.map((b) => b.id)
              );

            const newTagMap: Record<string, string[]> = {};
            (newData || []).forEach((bt: BookmarkTag) => {
              if (!newTagMap[bt.bookmark_id])
                newTagMap[bt.bookmark_id] = [];
              newTagMap[bt.bookmark_id].push(bt.tag_id);
            });

            setBookmarkTagMap(newTagMap);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    fetchBookmarkTags();
  }, [user?.id, bookmarks, supabase]);

  // Filter bookmarks based on folder, tags, and search
  useEffect(() => {
    let filtered = bookmarks;

    // Filter by folder
    if (selectedFolder) {
      filtered = filtered.filter((b) => b.folder_id === selectedFolder);
    }

    // Filter by tags (AND logic - all selected tags must be present)
    if (selectedTags.length > 0) {
      filtered = filtered.filter((b) => {
        const bookmarkTags = bookmarkTagMap[b.id] || [];
        return selectedTags.every((tagId) => bookmarkTags.includes(tagId));
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.url.toLowerCase().includes(query)
      );
    }

    setFilteredBookmarks(filtered);
  }, [bookmarks, selectedFolder, selectedTags, searchQuery, bookmarkTagMap]);

  if (authLoading) {
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

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <FolderSidebar
          selectedFolder={selectedFolder}
          onFolderSelect={setSelectedFolder}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tag Filter Bar */}
          <TagBar selectedTags={selectedTags} onTagsChange={setSelectedTags} />

          {/* Search Bar */}
          <div className="border-b border-border bg-card p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search bookmarks by title or URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Quick Add Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {selectedFolder
                    ? `Bookmarks in ${
                        folders.find((f) => f.id === selectedFolder)?.name ||
                        "Folder"
                      }`
                    : "All Bookmarks"}
                </h2>
                {!showAddForm && (
                  <Button onClick={() => setShowAddForm(true)}>
                    + Add Bookmark
                  </Button>
                )}
              </div>

              {/* Add Form */}
              {showAddForm && (
                <AddBookmarkForm
                  onSuccess={() => setShowAddForm(false)}
                />
              )}

              {/* Bookmarks List */}
              {bookmarksLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredBookmarks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg">No bookmarks found</p>
                  <p className="text-sm">
                    {searchQuery
                      ? "Try adjusting your search"
                      : "Add your first bookmark to get started"}
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredBookmarks.map((bookmark) => {
                    // Get tags for this bookmark
                    const bookmarkTagIds = bookmarkTagMap[bookmark.id] || [];
                    const bookmarkTags = bookmarkTagIds
                      .map((tagId) =>
                        tags.find((t: Tag) => t.id === tagId)
                      )
                      .filter(Boolean) as Tag[];

                    return (
                      <BookmarkCard
                        key={bookmark.id}
                        bookmark={bookmark}
                        tags={bookmarkTags}
                        onDelete={deleteBookmark}
                      />
                    );
                  })}
                </div>
              )}

              {/* Stats */}
              {!bookmarksLoading && (
                <p className="text-center text-sm text-muted-foreground">
                  Showing {filteredBookmarks.length} of {bookmarks.length}{" "}
                  bookmarks
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
