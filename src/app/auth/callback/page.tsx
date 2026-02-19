/**
 * Auth Callback Page (/auth/callback)
 * 
 * Handles OAuth callback from Google
 * Exchanges authorization code for session token
 */

"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading && user) {
      const returnTo = searchParams.get("returnTo");
      router.push(returnTo || "/");
    }
  }, [user, loading, router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
