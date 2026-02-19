/**
 * useAuth Hook
 * 
 * Manages user authentication state and operations
 * 
 * Features:
 * - Track user session
 * - Google OAuth sign-in
 * - Sign-out functionality
 * - Auto-refresh token handling
 * - Monitors auth state changes in real-time
 * 
 * Usage:
 *   const { user, session, loading, signInWithGoogle, signOut } = useAuth();
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user ?? null);

        // Listen for auth state changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
        });

        return () => subscription?.unsubscribe();
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [supabase]);

  // Sign in with Google OAuth
  // Accepts an optional `returnTo` path which will be attached as a query
  // parameter to the callback so the app can resume the flow after login.
  const signInWithGoogle = useCallback(
    async (returnTo?: string) => {
      try {
        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback${
          returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""
        }`;

        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: callbackUrl,
          },
        });

        if (error) throw error;
      } catch (error) {
        console.error("Google sign-in error:", error);
        throw error;
      }
    },
    [supabase]
  );

  // Sign out user
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      router.push("/");
    } catch (error) {
      console.error("Sign-out error:", error);
      throw error;
    }
  }, [supabase, router]);

  return {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
  };
}
