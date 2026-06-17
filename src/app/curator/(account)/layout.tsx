"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";

import { CuratorSidebar } from "@/components/curator/curator-sidebar";

import CreateLauncher from "@/components/curator/create/create-launcher";

import MemberCreateModal from "@/components/curator/create/member-create-modal";

import PartnerCreateModal from "@/components/curator/create/partner-create-modal";

import ReachOverviewModal from "@/components/curator/create/reach-overview-modal";

import SchoolCreateModal from "@/components/curator/create/school-create-wizard";

import { useCuratorLayout } from "@/hooks/curator/layout/use-layout";

import { isCuratorNotificationSheetOpenAtom } from "@/atoms/notification";
import { useCuratorNotification } from "@/hooks/curator/notification/use-notification";
import NotificationsSheet from "@/components/shared/notification-sheet";
import { getCuratorNotificationRoute } from "@/lib/config/notification-routing";
import type { CuratorNotification } from "@/lib/types/entities/notification";

function CuratorNotificationsSheet() {
  const router = useRouter();
  const {
    notifications,
    setIsOpen,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    deleteNotification,
    isMarkingRead,
    isDeleting,
    isMarkingAllRead,
    isClearing,
  } = useCuratorNotification();
  return (
    <NotificationsSheet<CuratorNotification>
      notifications={notifications}
      openAtom={isCuratorNotificationSheetOpenAtom}
      onOpenChange={setIsOpen}
      markAllRead={markAllAsRead}
      markOneRead={markAsRead}
      deleteOne={deleteNotification}
      clearAllNotifications={clearNotifications}
      isMarkingRead={isMarkingRead}
      isDeleting={isDeleting}
      isMarkingAllRead={isMarkingAllRead}
      isClearing={isClearing}
      onNavigate={(link) => router.push(link as Route)}
      getNotificationActionUrl={(n) => getCuratorNotificationRoute(n) ?? "#"}
      getNotificationId={(n) => n.id}
      isNotificationUnread={(n) => !n.read}
      getAvatarUrl={() => undefined}
      getEmoji={(n) => n.emoji}
      getTitle={(n) => n.title}
      getText={(n) => n.message}
      getTimestamp={(n) => n.createdAt}
    />
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    mounted,

    isAuthenticated,

    handleLogout,

    showCreateLauncher,

    setShowCreateLauncher,

    showSchoolModal,

    showMemberModal,

    showPartnerModal,

    showReachOverview,

    openSchoolModal,

    openMemberModal,

    openPartnerModal,

    openReachOverview,

    closeSchoolModal,

    closeMemberModal,

    closePartnerModal,

    closeReachOverview,
  } = useCuratorLayout();

  // Show loading state only after mount to prevent hydration mismatch

  if (!mounted || isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2" />

          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <CuratorSidebar
        onCreateClick={() => setShowCreateLauncher(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 overflow-y-auto pt-14 md:pt-0">{children}</div>

      {showCreateLauncher && (
        <CreateLauncher
          setShowCreateLauncher={setShowCreateLauncher}
          onOpenSchoolModal={openSchoolModal}
          onOpenMemberModal={openMemberModal}
          onOpenPartnerModal={openPartnerModal}
          onOpenReachOverview={openReachOverview}
        />
      )}

      <SchoolCreateModal
        isOpen={showSchoolModal}
        onClose={closeSchoolModal}
        onSchoolCreated={closeSchoolModal}
      />

      <MemberCreateModal
        isOpen={showMemberModal}
        onClose={closeMemberModal}
        onMemberCreated={closeMemberModal}
      />

      <PartnerCreateModal
        isOpen={showPartnerModal}
        onClose={closePartnerModal}
        onPartnerCreated={closePartnerModal}
      />

      <ReachOverviewModal
        isOpen={showReachOverview}
        onClose={closeReachOverview}
      />

      <CuratorNotificationsSheet />
    </div>
  );
}
