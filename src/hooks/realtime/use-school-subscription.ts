"use client";

import { useEffect } from "react";
import { subscriptionManager } from "@/services/shared/websocket/subscription-manager";

/**
 * Hook to dynamically subscribe/unsubscribe to school-specific WebSocket topics.
 * When a curator navigates to a school detail page, this subscribes to
 * /topic/school/{schoolId}/patient-results (for curators) or
 * /topic/provider/school/{schoolId}/urgent (for providers).
 *
 * Automatically unsubscribes on unmount or when schoolId changes.
 */
export function useSchoolSubscription(schoolId: string | number | null) {
  useEffect(() => {
    if (!schoolId) return;

    const numericId =
      typeof schoolId === "string" ? Number(schoolId) : schoolId;

    if (isNaN(numericId)) return;

    subscriptionManager.addSchoolSubscription(numericId);

    return () => {
      subscriptionManager.removeSchoolSubscription(numericId);
    };
  }, [schoolId]);
}
