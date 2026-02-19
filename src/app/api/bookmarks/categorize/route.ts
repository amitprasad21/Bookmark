/**
 * Categorize Bookmark API Route
 * 
 * POST /api/bookmarks/categorize
 * 
 * Uses AI (Gemini Flash) to automatically suggest:
 * - Folder to place bookmark in
 * - Tags for the bookmark
 * 
 * Request body:
 * {
 *   "bookmarkId": "uuid",
 *   "url": "string",
 *   "title": "string",
 *   "description": "string (optional)"
 * }
 * 
 * Response:
 * {
 *   "suggestions": {
 *     "folderName": "string",
 *     "tags": ["string", ...]
 *   }
 * }
 */

import { createServerComponentClient } from "@/integrations/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const body = await request.json();
    const { bookmarkId, url, title, description } = body;

    if (!url || !title) {
      return NextResponse.json(
        { error: "URL and title are required" },
        { status: 400 }
      );
    }

    // Call Supabase edge function for AI categorization
    const { data, error } = await supabase.functions.invoke(
      "categorize-bookmark",
      {
        body: {
          bookmark_id: bookmarkId,
          url,
          title,
          description,
        },
      }
    );

    if (error) {
      console.error("Categorization error:", error);
      return NextResponse.json(
        { error: "Failed to categorize bookmark" },
        { status: 500 }
      );
    }

    return NextResponse.json({ suggestions: data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
