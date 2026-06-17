"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";
import { stompClient } from "@/services/shared/websocket/stomp-client";
import { subscriptionManager } from "@/services/shared/websocket/subscription-manager";
import { connectionStatusAtom } from "@/atoms/websocket";
import { getUserType, hasValidToken } from "@/lib/utils/auth/get-user-type";

export function useStompWebSocket() {
  const [connectionStatus, setConnectionStatus] = useAtom(connectionStatusAtom);
  const [userType, setUserType] =
    useState<ReturnType<typeof getUserType>>(null);
  const reconnectAttemptRef = useRef(0);

  // Initialize connection
  const connect = useCallback(() => {
    const type = getUserType();
    setUserType(type);

    if (!type || !hasValidToken()) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    stompClient.connect(token);
  }, []);

  // Disconnect
  const disconnect = useCallback(() => {
    stompClient.disconnect();
    subscriptionManager.cleanup();
  }, []);

  // Subscribe to a topic
  const subscribe = useCallback(
    <T>(topic: string, handler: (payload: T) => void): (() => void) => {
      const subscriptionId = stompClient.subscribe(topic, handler);

      return () => {
        stompClient.unsubscribe(subscriptionId);
      };
    },
    [],
  );

  // Reconnect manually
  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptRef.current = 0;
    setTimeout(connect, 500);
  }, [connect, disconnect]);

  // Setup status listener
  useEffect(() => {
    const unsubscribe = stompClient.onStatusChange((status) => {
      setConnectionStatus(status);
    });

    return unsubscribe;
  }, [setConnectionStatus]);

  // Setup reconnect listener to re-fetch state
  useEffect(() => {
    const unsubscribe = stompClient.onReconnect(() => {
      console.log("[WebSocket] Reconnected - re-fetching critical state");
      // Dispatch event for hooks to re-fetch data
      window.dispatchEvent(new CustomEvent("ws:reconnect"));
    });

    return unsubscribe;
  }, []);

  // Handle visibility change (pause/resume)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Optional: disconnect when tab hidden to save battery
        // disconnect();
      } else {
        // Reconnect when tab becomes visible
        if (
          connectionStatus === "DISCONNECTED" ||
          connectionStatus === "ERROR"
        ) {
          connect();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [connect, connectionStatus]);

  return {
    connectionStatus,
    userType,
    connect,
    disconnect,
    subscribe,
    reconnect,
    isConnected: connectionStatus === "CONNECTED",
    isConnecting: connectionStatus === "CONNECTING",
  };
}
