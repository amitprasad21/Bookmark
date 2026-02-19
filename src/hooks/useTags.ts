/**
 * useTags Hook
 * 
 * Manages tag CRUD operations
 * 
 * Features:
 * - Fetch all tags for user
 * - Create new tag with color
 * - Delete tag (and remove from bookmarks)
 * - Real-time tag changes
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/integrations/supabase/client";
import type { Tag, TagInsert } from "@/integrations/supabase/types";
import { toast } from "sonner";

const TAG_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E2",
];

export function useTags(userId: string | undefined) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) {
      setTags([]);
      setLoading(false);
      return;
    }

    const fetchTags = async () => {
      try {
        const { data, error } = await supabase
          .from("tags")
          .select("*")
          .eq("user_id", userId)
          .order("name");

        if (error) throw error;

        setTags(data || []);

        // Subscribe to tag changes
        const channel = supabase
          .channel(`tags:${userId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "tags",
              filter: `user_id=eq.${userId}`,
            },
            (payload) => {
              if (payload.eventType === "INSERT") {
                setTags((prev) => [
                  ...prev,
                  payload.new as Tag,
                ].sort((a, b) => a.name.localeCompare(b.name)));
              } else if (payload.eventType === "UPDATE") {
                setTags((prev) =>
                  prev.map((t) =>
                    t.id === (payload.new as Tag).id
                      ? (payload.new as Tag)
                      : t
                  )
                );
              } else if (payload.eventType === "DELETE") {
                setTags((prev) =>
                  prev.filter((t) => t.id !== (payload.old as Tag).id)
                );
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error("Error fetching tags:", error);
        toast.error("Failed to load tags");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [userId, supabase]);

  const addTag = useCallback(
    async (tagName: string, color?: string) => {
      try {
        if (!userId) throw new Error("User not authenticated");

        const selectedColor =
          color || TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];

        const { error } = await supabase.from("tags").insert([
          {
            user_id: userId,
            name: tagName,
            color: selectedColor,
          },
        ]);

        if (error) throw error;

        toast.success("Tag created!");
        return true;
      } catch (error) {
        console.error("Error adding tag:", error);
        toast.error("Failed to create tag");
        return false;
      }
    },
    [userId, supabase]
  );

  const deleteTag = useCallback(
    async (tagId: string) => {
      try {
        // Remove tag from all bookmarks
        await supabase.from("bookmark_tags").delete().eq("tag_id", tagId);

        // Delete the tag
        const { error } = await supabase
          .from("tags")
          .delete()
          .eq("id", tagId);

        if (error) throw error;

        toast.success("Tag deleted!");
        return true;
      } catch (error) {
        console.error("Error deleting tag:", error);
        toast.error("Failed to delete tag");
        return false;
      }
    },
    [supabase]
  );

  return {
    tags,
    loading,
    addTag,
    deleteTag,
  };
}
