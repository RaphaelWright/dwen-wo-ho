"use client";

import ProviderProfileDialog from "@/components/provider/profile-dialog";
import EditFieldDialog from "@/components/provider/workspace/edit-field-dialog";
import { PendingApprovalModal } from "@/components/provider/pending-approval-modal/index";
import { toPendingApprovalUserInfo } from "@/lib/utils/provider/pending-approval";
import ProviderNotificationsSheet from "@/components/provider/workspace/notification-sheet/index";
import type { ProviderDashboardOverlayHostProps } from "@/lib/types/components/provider/dashboard/dashboard";
import type { ProviderDashboardState } from "@/hooks/provider/dashboard/use-dashboard";

export default function ProviderDashboardModals({
  dashboard,
  isApproved,
  isAuthLoading,
  authProfile,
  onLogout,
  router,
}: ProviderDashboardOverlayHostProps<ProviderDashboardState>) {
  const {
    notifications,
    setNotifOpen,
    markAllRead,
    markOneRead,
    deleteNotification,
    clearAllNotifications,
    isMarkingRead,
    isDeleting,
    isMarkingAllRead,
    isClearing,
    profileOpen,
    setProfileOpen,
    profileData,
    openEdit,
    schools,
    editOpen,
    setEditOpen,
    editFieldKey,
    editFieldLabel,
    editValue,
    setEditValue,
    saveEdit,
    uploadAvatar,
    isUploadingAvatar,
    isSaving,
    isUpdatingPhoneNumber,
  } = dashboard;

  return (
    <>
      <ProviderNotificationsSheet
        notifications={notifications}
        setNotifOpen={setNotifOpen}
        markAllRead={markAllRead}
        markOneRead={markOneRead}
        deleteNotification={deleteNotification}
        clearAllNotifications={clearAllNotifications}
        router={router}
        isMarkingRead={isMarkingRead}
        isDeleting={isDeleting}
        isMarkingAllRead={isMarkingAllRead}
        isClearing={isClearing}
        getNotificationId={(n) => n.notificationId}
        isNotificationUnread={(n) => n.unread}
        getAvatarUrl={(n) => n.avatarUrl}
        getEmoji={(n) => n.emoji}
        getTitle={(n) => n.targetName}
        getText={(n) => n.text}
        getTimestamp={(n) => n.timestamp}
      />
      <ProviderProfileDialog
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        profileData={profileData}
        openEdit={openEdit}
        schools={schools}
      />
      <EditFieldDialog
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        editFieldKey={editFieldKey}
        editFieldLabel={editFieldLabel}
        editValue={editValue}
        setEditValue={setEditValue}
        saveEdit={saveEdit}
        uploadAvatar={uploadAvatar}
        isUploadingAvatar={isUploadingAvatar}
        isSaving={isSaving || isUpdatingPhoneNumber}
        profileData={profileData}
      />
      {!isApproved && !isAuthLoading && (
        <PendingApprovalModal
          userInfo={toPendingApprovalUserInfo(
            Object.keys(profileData).length > 0 ? profileData : authProfile,
          )}
          onLogout={onLogout}
        />
      )}
    </>
  );
}
