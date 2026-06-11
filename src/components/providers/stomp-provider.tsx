"use client";

import { useEffect, useRef, ReactNode } from "react";
import { useStompWebSocket } from "@/hooks/use-stomp-websocket";
import { useNotificationWebSocket } from "@/hooks/use-notification-websocket";
import { useUrgentCasesWebSocket } from "@/hooks/use-urgent-cases-websocket";
import { usePatientStatusWebSocket } from "@/hooks/use-patient-status-websocket";
import { usePatientResultWebSocket } from "@/hooks/use-patient-result-websocket";
import { subscriptionManager } from "@/services/websocket/subscription-manager";
import { getUserType, hasValidToken } from "@/lib/utils/getUserType";
import { usePathname } from "next/navigation";

export function StompProvider({ children }: { children: ReactNode }) {
  const { connect, disconnect, connectionStatus } = useStompWebSocket();
  // Tracked in a ref: only read inside the auth effect to detect transitions,
  // never rendered, so it shouldn't cause extra renders or chained updates.
  const isAuthRef = useRef(false);
  const pathname = usePathname();

  // Initialize WebSocket hooks (they listen for events)
  useNotificationWebSocket();
  useUrgentCasesWebSocket();
  usePatientStatusWebSocket();
  usePatientResultWebSocket();

  // Connect when authenticated, and re-evaluate on navigation
  useEffect(() => {
    const userType = getUserType();
    const valid = !!(userType && hasValidToken());
    console.log(
      `[StompProvider] Auth check - userType: ${userType}, valid: ${valid}, isAuth: ${isAuthRef.current}`,
    );

    if (valid && !isAuthRef.current) {
      isAuthRef.current = true;
      console.log(`[StompProvider] Connecting...`);
      connect();
    } else if (!valid && isAuthRef.current) {
      isAuthRef.current = false;
      console.log(`[StompProvider] Disconnecting...`);
      disconnect();
    }
  }, [connect, disconnect, pathname]);

  // Track if this is first connection or reconnect
  const wasConnectedRef = useRef(false);

  // Initialize subscriptions when connected
  useEffect(() => {
    console.log(
      `[StompProvider] Connection status changed: ${connectionStatus}`,
    );
    if (connectionStatus === "CONNECTED") {
      const providerId = localStorage.getItem("providerId");

      if (wasConnectedRef.current) {
        // This is a reconnect - need to resubscribe
        console.log(
          `[StompProvider] Reconnect detected, resubscribing... providerId: ${providerId}`,
        );
        subscriptionManager.resubscribeAll();
      } else {
        // This is initial connection
        console.log(
          `[StompProvider] Initial connection, initializing subscriptions, providerId: ${providerId}`,
        );
        // Always initialize first to set userType
        subscriptionManager.initialize();
        // If providerId exists, also set it up (this will trigger provider-specific subscriptions)
        if (providerId) {
          subscriptionManager.setProviderId(providerId);
        }
      }

      wasConnectedRef.current = true;
      console.log(
        `[StompProvider] Active subscriptions: ${subscriptionManager.getActiveSubscriptionCount()}`,
      );
    } else if (connectionStatus === "DISCONNECTED") {
      wasConnectedRef.current = false;
    }
  }, [connectionStatus]);

  // Handle storage events (token changes, logout)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token" || event.key === "userType") {
        const userType = getUserType();

        if (!userType || !hasValidToken()) {
          disconnect();
        } else {
          // Reconnect with new credentials
          disconnect();
          setTimeout(connect, 500);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [connect, disconnect]);

  return <>{children}</>;
}
