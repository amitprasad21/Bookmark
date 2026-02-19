/**
 * Supabase Types
 * 
 * Auto-generated from Supabase database schema
 * These types ensure type-safety when working with database tables
 * 
 * Tables:
 * - bookmarks: Main bookmark records
 * - folders: Bookmark folders/categories
 * - tags: Tag definitions
 * - bookmark_tags: Junction table for many-to-many relationship
 * - profiles: User profile information
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          url: string;
          title: string;
          description: string | null;
          folder_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          url: string;
          title: string;
          description?: string | null;
          folder_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          url?: string;
          title?: string;
          description?: string | null;
          folder_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      folders: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bookmark_tags: {
        Row: {
          bookmark_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          bookmark_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          bookmark_id?: string;
          tag_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {
      categorize_bookmark: {
        Args: {
          bookmark_id: string;
          url: string;
          title: string;
        };
        Returns: {
          folder_names: string[];
          tags: string[];
        };
      };
    };
    Enums: {};
    CompositeTypes: {};
  };
};

/**
 * Helper types for easier access
 */
export type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];
export type BookmarkInsert = Database["public"]["Tables"]["bookmarks"]["Insert"];
export type BookmarkUpdate = Database["public"]["Tables"]["bookmarks"]["Update"];

export type Folder = Database["public"]["Tables"]["folders"]["Row"];
export type FolderInsert = Database["public"]["Tables"]["folders"]["Insert"];

export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type TagInsert = Database["public"]["Tables"]["tags"]["Insert"];

export type BookmarkTag = Database["public"]["Tables"]["bookmark_tags"]["Row"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
