/**
 * Auth Callback Page (/auth/callback)
 * 
 * Handles OAuth callback from Google
 * Exchanges authorization code for session token
 * 
 * Process:
 * 1. User clicks "Sign in with Google"
 * 2. Redirected to Google login
 * 3. User grants permission
 * 4. Returned to this page with code in URL
 * 5. Supabase exchanges code for session
 * 6. User is logged in
 * 7. Redirect to home page
 */

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    // If user is authenticated, redirect to the returnTo path if present
    if (!loading && user) {
      const returnTo = searchParams.get("returnTo");
      try {
        if (returnTo) {
          router.push(returnTo);
        } else {
          router.push("/");
        }
      } catch (e) {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}
