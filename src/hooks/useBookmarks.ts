/**
 * useBookmarks Hook
 * 
 * Manages bookmark CRUD operations and real-time subscriptions
 * 
 * Features:
 * - Fetch all bookmarks for user
 * - Create new bookmark
 * - Update bookmark (move folder, edit details)
 * - Delete bookmark
 * - Real-time subscription to changes (INSERT, UPDATE, DELETE events)
 * - Automatic state sync across tabs
 * 
 * How Real-time Works:
 * 1. When a bookmark is created/updated/deleted in the database
 * 2. Supabase Realtime broadcasts the change
 * 3. All subscribed clients receive the update
 * 4. Local state is updated automatically
 * 5. UI re-renders with new data
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/integrations/supabase/client";
import type { Bookmark, BookmarkInsert, BookmarkUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export function useBookmarks(userId: string | undefined) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient() as any;

  // Fetch bookmarks and subscribe to changes
  useEffect(() => {
    if (!userId) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    const fetchBookmarks = async () => {
      try {
        // Fetch initial bookmarks
        const { data, error } = await supabase
          .from("bookmarks")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setBookmarks(data || []);

        // Subscribe to real-time changes
        const channel = supabase
          .channel(`bookmarks:${userId}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "bookmarks",
              filter: `user_id=eq.${userId}`,
            },
            (payload: any) => {
              setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
            }
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "bookmarks",
              filter: `user_id=eq.${userId}`,
            },
            (payload: any) => {
              setBookmarks((prev) =>
                prev.map((b) =>
                  b.id === (payload.new as Bookmark).id
                    ? (payload.new as Bookmark)
                    : b
                )
              );
            }
          )
          .on(
            "postgres_changes",
            {
              event: "DELETE",
              schema: "public",
              table: "bookmarks",
              filter: `user_id=eq.${userId}`,
            },
            (payload: any) => {
              setBookmarks((prev) =>
                prev.filter((b) => b.id !== (payload.old as Bookmark).id)
              );
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        toast.error("Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [userId, supabase]);

  // Add new bookmark
  const addBookmark = useCallback(
    async (data: BookmarkInsert) => {
      try {
        const { error } = await supabase.from("bookmarks").insert([data]);

        if (error) throw error;

        toast.success("Bookmark saved successfully!");
        return true;
      } catch (error) {
        console.error("Error adding bookmark:", error);
        toast.error("Failed to save bookmark");
        return false;
      }
    },
    [supabase]
  );

  // Update bookmark
  const updateBookmark = useCallback(
    async (id: string, updates: BookmarkUpdate) => {
      try {
        const { error } = await supabase
          .from("bookmarks")
          .update(updates)
          .eq("id", id);

        if (error) throw error;

        toast.success("Bookmark updated!");
        return true;
      } catch (error) {
        console.error("Error updating bookmark:", error);
        toast.error("Failed to update bookmark");
        return false;
      }
    },
    [supabase]
  );

  // Delete bookmark
  const deleteBookmark = useCallback(
    async (id: string) => {
      try {
        // Delete bookmark-tag associations first
        await supabase.from("bookmark_tags").delete().eq("bookmark_id", id);

        // Then delete the bookmark
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("id", id);

        if (error) throw error;

        toast.success("Bookmark deleted!");
        return true;
      } catch (error) {
        console.error("Error deleting bookmark:", error);
        toast.error("Failed to delete bookmark");
        return false;
      }
    },
    [supabase]
  );

  return {
    bookmarks,
    loading,
    addBookmark,
    updateBookmark,
    deleteBookmark,
  };
}
