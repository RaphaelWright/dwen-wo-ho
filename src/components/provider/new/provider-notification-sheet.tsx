import NotificationsSheet from "@/components/shared/notification-sheet";
import { getProviderNotificationRoute } from "@/lib/config/notification-routing";
import { ProviderNotification } from "@/lib/types/notification";
import { isProviderNotificationSheetOpenAtom } from "@/atoms/notification";
import { useRouter } from "next/navigation";

export default function ProviderNotificationsSheet({
  notifications,
  setNotifOpen,
  markAllRead,
  markOneRead,
  deleteNotification,
  clearAllNotifications,
  router,
  isMarkingRead,
  isDeleting,
  getNotificationId,
  isNotificationUnread,
  getAvatarUrl,
  getEmoji,
  getTitle,
  getText,
  getTimestamp,
}: {
  notifications: ProviderNotification[];
  setNotifOpen: (open: boolean) => void;
  markAllRead: () => void;
  markOneRead: (id: string | number) => void;
  deleteNotification: (id: string | number) => void;
  clearAllNotifications: () => void;
  router: ReturnType<typeof useRouter>;
  isMarkingRead: boolean;
  isDeleting: boolean;
  getNotificationId: (n: ProviderNotification) => string;
  isNotificationUnread: (n: ProviderNotification) => boolean;
  getAvatarUrl: (n: ProviderNotification) => string | null | undefined;
  getEmoji: (n: ProviderNotification) => string | undefined;
  getTitle: (n: ProviderNotification) => string | undefined;
  getText: (n: ProviderNotification) => string | undefined;
  getTimestamp: (n: ProviderNotification) => string | undefined;
}) {
  return (
    <NotificationsSheet<ProviderNotification>
      notifications={notifications}
      openAtom={isProviderNotificationSheetOpenAtom}
      onOpenChange={setNotifOpen}
      markAllRead={markAllRead}
      markOneRead={markOneRead}
      deleteOne={deleteNotification}
      clearAllNotifications={clearAllNotifications}
      onNavigate={(link) => router.push(link as any)}
      getNotificationActionUrl={(n) => getProviderNotificationRoute(n) ?? "#"}
      isMarkingRead={isMarkingRead}
      isDeleting={isDeleting}
      getNotificationId={getNotificationId}
      isNotificationUnread={isNotificationUnread}
      getAvatarUrl={getAvatarUrl}
      getEmoji={getEmoji}
      getTitle={getTitle}
      getText={getText}
      getTimestamp={getTimestamp}
    />
  );
}
