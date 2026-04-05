"use client";

import { useCuratorRedirect } from "@/hooks/curator/use-curator-redirect";

export default function CuratorDashboard() {
  const { isChecking } = useCuratorRedirect();

  if (isChecking) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}
