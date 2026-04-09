"use client";

import { useRouter } from "next/navigation";

import { CuratorSidebar } from "@/components/ui/curator-sidebar";

import CreateModal from "@/components/curator/create-modal";

import MemberCreationModal from "@/components/modals/member-creation";

import PartnerCreationModal from "@/components/modals/partner-creation";

import ReachModal from "@/components/modals/reach";

import SchoolCreationModal from "@/components/modals/school-creation";

import { useCuratorLayout } from "@/hooks/curator/use-curator-layout";

import { isCuratorNotificationSheetOpenAtom } from "@/atoms/notification";
import { useCuratorNotification } from "@/hooks/use-curator-notification";
import NotificationsSheet from "@/components/shared/notification-sheet";
import { getCuratorNotificationRoute } from "@/lib/config/notification-routing";
import type { CuratorNotification } from "@/lib/types/notification";

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
      onNavigate={(link) => router.push(link as any)}
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

    showCreateModal,

    setShowCreateModal,

    showSchoolModal,

    showMemberModal,

    showPartnerModal,

    showReachModal,

    openSchoolModal,

    openMemberModal,

    openPartnerModal,

    openReachModal,

    closeSchoolModal,

    closeMemberModal,

    closePartnerModal,

    closeReachModal,
  } = useCuratorLayout();

  // Show loading state only after mount to prevent hydration mismatch

  if (!mounted || isAuthenticated === null) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />

          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  return (
    <div className="h-screen bg-background flex">
      <CuratorSidebar
        onCreateClick={() => setShowCreateModal(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 overflow-y-auto bg-muted/10 pt-14 md:pt-0">
        {children}
      </div>

      {showCreateModal && (
        <CreateModal
          setShowCreateModal={setShowCreateModal}
          onOpenSchoolModal={openSchoolModal}
          onOpenMemberModal={openMemberModal}
          onOpenPartnerModal={openPartnerModal}
          onOpenReachModal={openReachModal}
        />
      )}

      <SchoolCreationModal
        isOpen={showSchoolModal}
        onClose={closeSchoolModal}
        onSchoolCreated={closeSchoolModal}
      />

      <MemberCreationModal
        isOpen={showMemberModal}
        onClose={closeMemberModal}
        onMemberCreated={closeMemberModal}
      />

      <PartnerCreationModal
        isOpen={showPartnerModal}
        onClose={closePartnerModal}
        onPartnerCreated={closePartnerModal}
      />

      <ReachModal isOpen={showReachModal} onClose={closeReachModal} />

      <CuratorNotificationsSheet />
    </div>
  );
}
