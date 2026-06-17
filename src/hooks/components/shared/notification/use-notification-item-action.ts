"use client";

import { useState, useCallback } from "react";
import type { NotificationItemAction } from "@/lib/types/components/shared/notification-sheet";
import type { NotifItemStatus } from "@/lib/types/components/shared/notification-item";

const ACTIVE_NOTIF_TIMEOUT_MS = 3000;

export function useNotificationItemAction() {
  const [activeNotif, setActiveNotif] = useState<{
    id: string | number;
    action: NotificationItemAction;
  } | null>(null);

  const getItemStatus = useCallback(
    (notifId: string | number | undefined): NotifItemStatus => {
      if (!notifId || !activeNotif || activeNotif.id !== notifId) {
        return "idle";
      }
      return activeNotif.action === "mark-read" ? "marking-read" : "deleting";
    },
    [activeNotif],
  );

  const runWithActiveNotif = useCallback(
    (
      notifId: string | number,
      action: NotificationItemAction,
      fn: () => void,
    ) => {
      setActiveNotif({ id: notifId, action });
      fn();
      setTimeout(() => {
        setActiveNotif((current) =>
          current?.id === notifId && current?.action === action
            ? null
            : current,
        );
      }, ACTIVE_NOTIF_TIMEOUT_MS);
    },
    [],
  );

  return { getItemStatus, runWithActiveNotif };
}
