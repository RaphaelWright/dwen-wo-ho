"use client";

import { useEffect } from "react";

interface UseNotificationWsSubscriptionOptions {
  onNotification: (event: Event) => void;
  onUnreadCountChange: (event: Event) => void;
  onReconnect: (event: Event) => void;
}

/**
 * Subscribes to browser WebSocket notification events dispatched on `window`.
 */
export function useNotificationWsSubscription({
  onNotification,
  onUnreadCountChange,
  onReconnect,
}: UseNotificationWsSubscriptionOptions) {
  useEffect(() => {
    window.addEventListener("ws:notification", onNotification);
    window.addEventListener("ws:unread-count", onUnreadCountChange);
    window.addEventListener("ws:reconnect", onReconnect);

    return () => {
      window.removeEventListener("ws:notification", onNotification);
      window.removeEventListener("ws:unread-count", onUnreadCountChange);
      window.removeEventListener("ws:reconnect", onReconnect);
    };
  }, [onNotification, onUnreadCountChange, onReconnect]);
}
