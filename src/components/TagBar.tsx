/**
 * TagBar Component
 * 
 * Horizontal bar for filtering bookmarks by tags
 * 
 * Features:
 * - Display all available tags
 * - Click to toggle tag selection
 * - Multiple tag selection (AND filtering)
 * - Show selected state
 * - Create new tag button
 */

"use client";

import { Button } from "@/components/ui/button";
import { useTags } from "@/hooks/useTags";
import { useAuth } from "@/hooks/useAuth";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface TagBarProps {
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
}

export function TagBar({ selectedTags, onTagsChange }: TagBarProps) {
  const { user } = useAuth();
  const { tags, addTag } = useTags(user?.id);
  const [creatingTag, setCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const handleToggleTag = (tagId: string) => {
    onTagsChange(
      selectedTags.includes(tagId)
        ? selectedTags.filter((id) => id !== tagId)
        : [...selectedTags, tagId]
    );
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    const success = await addTag(newTagName);
    if (success) {
      setNewTagName("");
      setCreatingTag(false);
    }
  };

  return (
    <div className="border-b border-border bg-card p-4">
      <p className="text-sm font-semibold text-muted-foreground mb-3">
        Filter by Tags
      </p>

      <div className="flex flex-wrap gap-2">
        {/* Tag Buttons */}
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleToggleTag(tag.id)}
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-all ${
              selectedTags.includes(tag.id)
                ? "ring-2 ring-offset-2 ring-primary"
                : "opacity-70 hover:opacity-100"
            }`}
            style={{
              backgroundColor: tag.color,
              color: "white",
            }}
          >
            {tag.name}
            {selectedTags.includes(tag.id) && (
              <X className="ml-1 h-3 w-3" />
            )}
          </button>
        ))}

        {/* Create Tag Button */}
        {creatingTag ? (
          <div className="flex gap-1">
            <Input
              placeholder="Tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="h-8 w-32"
              autoFocus
            />
            <Button
              onClick={handleCreateTag}
              size="sm"
              className="h-8"
            >
              Add
            </Button>
            <Button
              onClick={() => setCreatingTag(false)}
              size="sm"
              variant="outline"
              className="h-8"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setCreatingTag(true)}
            variant="outline"
            size="sm"
            className="h-8"
          >
            <Plus className="h-3 w-3 mr-1" />
            New Tag
          </Button>
        )}
      </div>
    </div>
  );
}
