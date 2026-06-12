"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import useProviderDashboard from "@/hooks/provider/use-provider-dashboard";
import { performLogout } from "@/lib/auth-utils";
import { ROUTES } from "@/lib/constants/routes";
import useProviderDashboardAuth from "@/hooks/provider/use-provider-dashboard-auth";
import ProviderDashboardShell from "@/components/provider/dashboard/dashboard-shell";
import ProviderDashboardModals from "@/components/provider/dashboard/dashboard-modals";
import { toast } from "@/lib/utils/toast";

export default function ProviderHomePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const {
    isApproved,
    isLoading: isAuthLoading,
    authProfile,
  } = useProviderDashboardAuth();
  const dashboard = useProviderDashboard();
  const { notifications, setNotifOpen } = dashboard;

  useEffect(() => {
    setMounted(true);

    const unreadNotifs = notifications.filter((n) => n.unread === true);

    let timeoutId: ReturnType<typeof setTimeout>;

    if (unreadNotifs.length > 0) {
      timeoutId = setTimeout(() => {
        toast.info("You have unread notifications");
        setNotifOpen(true);
      }, 5000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [notifications, setNotifOpen]);

  const handleLogout = () => {
    performLogout(queryClient, ROUTES.provider.auth);
  };

  if (!mounted) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-full flex-col overflow-x-hidden px-0.5 min-[1065px]:h-screen min-[1065px]:overflow-hidden min-[1065px]:px-0">
      <ProviderDashboardShell
        dashboard={dashboard}
        onUrgentPatientClick={(patient) => {
          router.push(`${ROUTES.provider.patients}/${patient.patientResultId}`);
        }}
      />
      <ProviderDashboardModals
        dashboard={dashboard}
        isApproved={isApproved}
        isAuthLoading={isAuthLoading}
        authProfile={authProfile}
        onLogout={handleLogout}
        router={router}
      />
    </div>
  );
}
