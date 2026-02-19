/**
 * BookmarkCard Component
 * 
 * Displays a single bookmark with:
 * - Favicon
 * - Title
 * - URL
 * - Description (if available)
 * - Tags
 * - Edit/Delete buttons
 * - Copy to clipboard
 * - Open in new tab
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, Tag } from "@/integrations/supabase/types";
import { ExternalLink, Trash2, Copy, Check } from "lucide-react";
import { useState } from "react";

interface BookmarkCardProps {
  bookmark: Bookmark;
  tags?: Tag[];
  onDelete?: (id: string) => void;
}

export function BookmarkCard({ bookmark, tags = [], onDelete }: BookmarkCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookmark.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Extract domain from URL for favicon
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return "link";
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this bookmark?")) {
      onDelete?.(bookmark.id);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Favicon */}
          <div className="flex-shrink-0">
            <img
              src={`https://www.google.com/s2/favicons?domain=${getDomain(bookmark.url)}&sz=32`}
              alt=""
              className="h-8 w-8 rounded"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground line-clamp-2">
              {bookmark.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {new URL(bookmark.url).hostname}
            </p>

            {bookmark.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {bookmark.description}
              </p>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={copyToClipboard}
              title="Copy URL"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              asChild
            >
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:text-destructive"
              onClick={handleDelete}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
