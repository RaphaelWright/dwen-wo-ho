"use client";

import ProfileModal from "@/components/modals/new-provider/new-provider-modal";
import EditFieldDialog from "@/components/provider/new/edit-field-dialog";
import { PendingApprovalModal } from "@/components/provider/pending-approval-modal";
import { toPendingApprovalUserInfo } from "@/lib/utils/provider-pending-modal";
import ProviderNotificationsSheet from "@/components/provider/new/provider-notification-sheet";
import type { ProviderDashboardModalsProps } from "@/lib/types/components/provider/dashboard/modals";

export default function ProviderDashboardModals({
  dashboard,
  isApproved,
  isAuthLoading,
  authProfile,
  onLogout,
  router,
}: ProviderDashboardModalsProps) {
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
      <ProfileModal
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
