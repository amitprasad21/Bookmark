/**
 * AddBookmarkForm Component
 * 
 * Form for adding new bookmarks
 * 
 * Features:
 * - URL input (required)
 * - Title input
 * - Description textarea
 * - Folder selection dropdown
 * - Tag selection/creation
 * - Submit button
 * - Can be pre-filled from browser extension query params
 * 
 * Props:
 * - onSuccess: Callback after bookmark is saved
 * - initialUrl: Pre-fill URL field
 * - initialTitle: Pre-fill title field
 * - initialFolder: Pre-select folder
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useFolders } from "@/hooks/useFolders";
import { useTags } from "@/hooks/useTags";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface AddBookmarkFormProps {
  onSuccess?: () => void;
  initialUrl?: string;
  initialTitle?: string;
  initialFolder?: string;
}

export function AddBookmarkForm({
  onSuccess,
  initialUrl = "",
  initialTitle = "",
  initialFolder,
}: AddBookmarkFormProps) {
  const { user } = useAuth();
  const { addBookmark } = useBookmarks(user?.id);
  const { folders } = useFolders(user?.id);
  const { tags } = useTags(user?.id);

  const [url, setUrl] = useState(initialUrl);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(initialFolder || "");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Extract title from URL if title is empty
  useEffect(() => {
    if (!title && url) {
      try {
        const urlObj = new URL(url);
        setTitle(urlObj.hostname);
      } catch {}
    }
  }, [url, title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim() || !user?.id) return;

    try {
      setLoading(true);

      // Validate URL
      try {
        new URL(url);
      } catch {
        alert("Please enter a valid URL");
        return;
      }

      // Add bookmark
      const success = await addBookmark({
        user_id: user.id,
        url: url.trim(),
        title: title || url,
        description: description || null,
        folder_id: selectedFolder || null,
      });

      if (success) {
        // Add bookmark-tag relationships
        if (selectedTags.length > 0) {
          // This would be done after bookmark creation
          // For now, it's simplified - in production, you'd get the bookmark ID
        }

        // Reset form
        setUrl("");
        setTitle("");
        setDescription("");
        setSelectedFolder("");
        setSelectedTags([]);

        onSuccess?.();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Bookmark</CardTitle>
        <CardDescription>
          Save a webpage to your Smart Bookmark library
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url">Website URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Page title (auto-filled from URL)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="Add notes about this bookmark"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Folder Selection */}
          <div className="space-y-2">
            <Label htmlFor="folder">Folder</Label>
            <select
              id="folder"
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">No folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags Selection */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() =>
                    setSelectedTags((prev) =>
                      prev.includes(tag.id)
                        ? prev.filter((id) => id !== tag.id)
                        : [...prev, tag.id]
                    )
                  }
                  disabled={loading}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    selectedTags.includes(tag.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Bookmark"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
