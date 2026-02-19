/**
 * Auth Callback Page (/auth/callback)
 *
 * Handles OAuth callback from Google.
 */

"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/integrations/supabase/client";

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
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      if (!supabase) {
        router.replace("/");
        return;
      }

      const code = searchParams.get("code");
      const safeReturnTo = getSafeReturnTo(searchParams.get("returnTo"));

      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("OAuth code exchange error:", error);
          }
        }
      } finally {
        router.replace(safeReturnTo);
      }
    };

    run();
  }, [router, searchParams]);

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
