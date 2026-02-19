/**
 * FolderSidebar Component
 * 
 * Left sidebar displaying:
 * - List of all folders
 * - Folder count
 * - Create new folder button
 * - Delete folder option
 * - Highlight selected folder
 */

"use client";

import { Button } from "@/components/ui/button";
import { useFolders } from "@/hooks/useFolders";
import { useAuth } from "@/hooks/useAuth";
import { Folder, FolderPlus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface FolderSidebarProps {
  selectedFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
}

export function FolderSidebar({
  selectedFolder,
  onFolderSelect,
}: FolderSidebarProps) {
  const { user } = useAuth();
  const { folders, addFolder, deleteFolder } = useFolders(user?.id);
  const [creating, setCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const success = await addFolder(newFolderName);
    if (success) {
      setNewFolderName("");
      setCreating(false);
    }
  };

  return (
    <aside className="w-64 border-r border-border bg-card p-4 h-full flex flex-col">
      <h2 className="font-semibold mb-4 flex items-center gap-2">
        <Folder className="h-5 w-5" />
        Folders
      </h2>

      {/* Folders List */}
      <div className="space-y-2 flex-1 overflow-y-auto">
        {/* All Bookmarks */}
        <button
          onClick={() => onFolderSelect(null)}
          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
            selectedFolder === null
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
        >
          All Bookmarks
        </button>

        {/* Folder Items */}
        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`flex items-center gap-2 px-2 py-2 rounded-md group hover:bg-muted transition-colors ${
              selectedFolder === folder.id ? "bg-primary/20" : ""
            }`}
          >
            <button
              onClick={() => onFolderSelect(folder.id)}
              className="flex-1 text-left"
            >
              {folder.name}
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={() => deleteFolder(folder.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Create Folder */}
      {creating ? (
        <form onSubmit={handleCreateFolder} className="space-y-2 border-t pt-4">
          <Input
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="flex-1">
              Create
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setCreating(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button
          onClick={() => setCreating(true)}
          variant="outline"
          className="w-full border-t rounded-t-none"
        >
          <FolderPlus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      )}
    </aside>
  );
}
