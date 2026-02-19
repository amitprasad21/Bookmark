/**
 * useFolders Hook
 * 
 * Manages folder CRUD operations
 * 
 * Features:
 * - Fetch all folders for user
 * - Create new folder
 * - Update folder name
 * - Delete folder
 * - Real-time folder changes
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/integrations/supabase/client";
import type { Folder, FolderInsert } from "@/integrations/supabase/types";
import { toast } from "sonner";

export function useFolders(userId: string | undefined) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) {
      setFolders([]);
      setLoading(false);
      return;
    }

    const fetchFolders = async () => {
      try {
        const { data, error } = await supabase
          .from("folders")
          .select("*")
          .eq("user_id", userId)
          .order("name");

        if (error) throw error;

        setFolders(data || []);

        // Subscribe to folder changes
        const channel = supabase
          .channel(`folders:${userId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "folders",
              filter: `user_id=eq.${userId}`,
            },
            (payload) => {
              if (payload.eventType === "INSERT") {
                setFolders((prev) => [
                  ...prev,
                  payload.new as Folder,
                ].sort((a, b) => a.name.localeCompare(b.name)));
              } else if (payload.eventType === "UPDATE") {
                setFolders((prev) =>
                  prev.map((f) =>
                    f.id === (payload.new as Folder).id
                      ? (payload.new as Folder)
                      : f
                  )
                );
              } else if (payload.eventType === "DELETE") {
                setFolders((prev) =>
                  prev.filter((f) => f.id !== (payload.old as Folder).id)
                );
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error("Error fetching folders:", error);
        toast.error("Failed to load folders");
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, [userId, supabase]);

  const addFolder = useCallback(
    async (folderName: string) => {
      try {
        if (!userId) throw new Error("User not authenticated");

        const { error } = await supabase.from("folders").insert([
          {
            user_id: userId,
            name: folderName,
          },
        ]);

        if (error) throw error;

        toast.success("Folder created!");
        return true;
      } catch (error) {
        console.error("Error adding folder:", error);
        toast.error("Failed to create folder");
        return false;
      }
    },
    [userId, supabase]
  );

  const deleteFolder = useCallback(
    async (folderId: string) => {
      try {
        // Move bookmarks out of folder first
        await supabase
          .from("bookmarks")
          .update({ folder_id: null })
          .eq("folder_id", folderId);

        // Delete the folder
        const { error } = await supabase
          .from("folders")
          .delete()
          .eq("id", folderId);

        if (error) throw error;

        toast.success("Folder deleted!");
        return true;
      } catch (error) {
        console.error("Error deleting folder:", error);
        toast.error("Failed to delete folder");
        return false;
      }
    },
    [supabase]
  );

  return {
    folders,
    loading,
    addFolder,
    deleteFolder,
  };
}
