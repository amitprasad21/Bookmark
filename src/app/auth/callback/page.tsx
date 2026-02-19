/**
 * Auth Callback Page (/auth/callback)
 *
 * Handles OAuth callback from Google.
 */

"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

function getSafeReturnTo(returnTo: string | null) {
  if (!returnTo || !returnTo.startsWith("/")) {
    return "/";
  }

  if (returnTo.startsWith("/auth/callback")) {
    return "/";
  }

  return returnTo;
}

function AuthCallbackContent() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading && user) {
      router.push(getSafeReturnTo(searchParams.get("returnTo")));
    }
  }, [loading, router, searchParams, user]);

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
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
