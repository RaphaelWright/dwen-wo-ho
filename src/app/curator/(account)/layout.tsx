"use client";

import { CuratorSidebar } from "@/components/curator/curator-sidebar";
import { CuratorAuthGate } from "@/components/curator/layout/curator-auth-gate";
import { CuratorNotificationsHost } from "@/components/curator/layout/curator-notifications-host";
import { useCuratorLayout } from "@/hooks/curator/layout/use-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { handleLogout } = useCuratorLayout();

  return (
    <CuratorAuthGate>
      <div className="flex h-screen">
        <CuratorSidebar onLogout={handleLogout} />

        <div className="flex-1 overflow-y-auto pt-14 md:pt-0">{children}</div>

        <CuratorNotificationsHost />
      </div>
    </CuratorAuthGate>
  );
}
