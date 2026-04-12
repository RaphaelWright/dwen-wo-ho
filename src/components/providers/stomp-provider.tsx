"use client";

import { useEffect, useCallback, ReactNode } from "react";
import { useStompWebSocket } from "@/hooks/use-stomp-websocket";
import { useNotificationWebSocket } from "@/hooks/use-notification-websocket";
import { useUrgentCasesWebSocket } from "@/hooks/use-urgent-cases-websocket";
import { usePatientStatusWebSocket } from "@/hooks/use-patient-status-websocket";
import { usePatientResultWebSocket } from "@/hooks/use-patient-result-websocket";
import { subscriptionManager } from "@/services/websocket/subscription-manager";
import { getUserType, hasValidToken } from "@/lib/utils/getUserType";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface StompProviderProps {
  children: ReactNode;
}

export function StompProvider({ children }: StompProviderProps) {
  const { connect, disconnect, connectionStatus } = useStompWebSocket();
  const [isAuth, setIsAuth] = useState(false);
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

    if (valid && !isAuth) {
      setIsAuth(true);
      connect();
    } else if (!valid && isAuth) {
      setIsAuth(false);
      disconnect();
    }
  }, [connect, disconnect, pathname, isAuth]);

  // Initialize subscriptions when connected
  useEffect(() => {
    if (connectionStatus === "CONNECTED") {
      // Pass provider ID if available from profile
      const providerId = localStorage.getItem("providerId");
      if (providerId) {
        subscriptionManager.setProviderId(providerId);
      } else {
        subscriptionManager.initialize();
      }
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
