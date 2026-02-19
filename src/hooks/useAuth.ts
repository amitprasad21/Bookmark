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

const AUTH_CALLBACK_PATH = "/auth/callback";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Initialize auth state on mount
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user ?? null);

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, nextSession) => {
          setSession(nextSession);
          setUser(nextSession?.user ?? null);
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

  const signInWithGoogle = useCallback(
    async (returnTo?: string) => {
      try {
        if (!supabase) throw new Error("Supabase is not configured");

        const appOrigin = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
        const callbackUrl = new URL(AUTH_CALLBACK_PATH, appOrigin);

        if (returnTo && returnTo !== AUTH_CALLBACK_PATH) {
          callbackUrl.searchParams.set("returnTo", returnTo);
        }

        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: callbackUrl.toString(),
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

  const signOut = useCallback(async () => {
    try {
      if (!supabase) throw new Error("Supabase is not configured");

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
