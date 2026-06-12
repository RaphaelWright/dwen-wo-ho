"use client";

import { useCuratorRedirect } from "@/hooks/curator/use-curator-redirect";

export default function CuratorDashboard() {
  const { isChecking } = useCuratorRedirect();

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}
