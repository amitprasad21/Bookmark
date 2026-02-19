/**
 * Supabase Client Configuration
 * 
 * This file sets up the Supabase client for the browser (client-component).
 * Supabase provides:
 * - PostgreSQL database access
 * - Real-time subscriptions (Realtime)
 * - Authentication (Auth)
 * - Session management
 * 
 * Environment Variables Required:
 * - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Public API key (safe to expose)
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
