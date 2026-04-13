import { stompClient } from "./stomp-client";
import {
  NewNotificationEvent,
  NewUrgentCaseEvent,
  PatientStatusChangedEvent,
  NewPatientResultEvent,
  ActiveSubscription,
  ProviderTopicNotificationEvent,
} from "@/lib/types/websocket";
import { getUserType } from "@/lib/utils/getUserType";
import { ProviderNotification } from "@/lib/types/notification";
import { refetchAllActiveQueries } from "@/lib/query-client-store";

class SubscriptionManager {
  private activeSubscriptions: Map<string, ActiveSubscription> = new Map();
  private userType: ReturnType<typeof getUserType> = null;
  private providerId: string | null = null;
  private schoolIds: number[] = [];
  private hasWarnedMissingId = false;

  // Initialize subscriptions based on user role
  initialize(): void {
    this.userType = getUserType();
    console.log(
      `[SubscriptionManager] Initializing for userType: ${this.userType}`,
    );

    if (!this.userType) {
      console.warn(
        `[SubscriptionManager] No userType found, skipping initialization`,
      );
      return;
    }

    // Try to extract provider ID if not already set
    if (this.userType === "provider" && !this.providerId) {
      this.providerId = this.extractProviderId();
      console.log(
        `[SubscriptionManager] Extracted providerId: ${this.providerId}`,
      );
    }

    // Subscribe to common topic (all roles)
    this.subscribeToTopic(
      "/user/queue/notifications",
      "personal-notifications",
    );

    // Subscribe to role-specific topics
    if (this.userType === "curator") {
      console.log(`[SubscriptionManager] Initializing curator subscriptions`);
      this.initializeCuratorSubscriptions();
    } else if (this.userType === "provider") {
      console.log(`[SubscriptionManager] Initializing provider subscriptions`);
      this.initializeProviderSubscriptions();
    }
    console.log(
      `[SubscriptionManager] Total active subscriptions: ${this.activeSubscriptions.size}`,
    );
  }

  private initializeCuratorSubscriptions(): void {
    // Curator gets all patient results
    this.subscribeToTopic(
      "/topic/curator/patient-results",
      "curator-patient-results",
    );

    // Subscribe to school-specific topics if schools are selected/viewed
    this.schoolIds.forEach((schoolId) => {
      this.subscribeToTopic(
        `/topic/school/${schoolId}/patient-results`,
        `school-${schoolId}-results`,
      );
    });
  }

  private initializeProviderSubscriptions(): void {
    console.log(
      `[SubscriptionManager] initializeProviderSubscriptions called, providerId: ${this.providerId}`,
    );

    if (!this.providerId) {
      // Try to get provider ID from localStorage or API
      this.providerId = this.extractProviderId();
      console.log(
        `[SubscriptionManager] Extracted providerId: ${this.providerId}`,
      );
    }

    if (!this.providerId) {
      // Provider ID will be set later via setProviderId() after profile loads.
      // Don't warn repeatedly - this is expected during initial page load.
      if (!this.hasWarnedMissingId) {
        this.hasWarnedMissingId = true;
        console.warn(
          `[SubscriptionManager] No providerId available, skipping provider subscriptions`,
        );
      }
      return;
    }

    console.log(
      `[SubscriptionManager] Setting up provider subscriptions for ${this.providerId}`,
    );

    // Provider-specific notification events
    this.subscribeToTopic(
      `/topic/provider/${this.providerId}/notifications`,
      "provider-notifications",
    );

    // Urgent cases for this provider
    this.subscribeToTopic(
      `/topic/provider/${this.providerId}/urgent`,
      "provider-urgent",
    );

    // Patient status changes for this provider
    this.subscribeToTopic(
      `/topic/provider/${this.providerId}/patients`,
      "provider-patients",
    );

    // School-specific urgent cases
    this.schoolIds.forEach((schoolId) => {
      this.subscribeToTopic(
        `/topic/provider/school/${schoolId}/urgent`,
        `school-${schoolId}-urgent`,
      );
    });

    console.log(
      `[SubscriptionManager] Provider subscriptions complete. Active: ${this.activeSubscriptions.size}`,
    );
  }

  // Add school-specific subscription dynamically
  addSchoolSubscription(schoolId: number): void {
    if (this.schoolIds.includes(schoolId)) {
      return; // Already subscribed
    }

    this.schoolIds.push(schoolId);

    if (this.userType === "curator") {
      this.subscribeToTopic(
        `/topic/school/${schoolId}/patient-results`,
        `school-${schoolId}-results`,
      );
    } else if (this.userType === "provider") {
      this.subscribeToTopic(
        `/topic/provider/school/${schoolId}/urgent`,
        `school-${schoolId}-urgent`,
      );
    }
  }

  // Remove school-specific subscription
  removeSchoolSubscription(schoolId: number): void {
    this.schoolIds = this.schoolIds.filter((id) => id !== schoolId);

    const topicId =
      this.userType === "curator"
        ? `school-${schoolId}-results`
        : `school-${schoolId}-urgent`;

    this.unsubscribe(topicId);
  }

  private subscribeToTopic(topic: string, subscriptionId: string): void {
    if (this.activeSubscriptions.has(subscriptionId)) {
      console.log(
        `[SubscriptionManager] Already subscribed to ${topic} (${subscriptionId})`,
      );
      return; // Already subscribed
    }

    console.log(
      `[SubscriptionManager] Subscribing to ${topic} (${subscriptionId})`,
    );
    const subId = stompClient.subscribe(topic, (payload: unknown) => {
      this.handleMessage(topic, payload);
    });

    this.activeSubscriptions.set(subscriptionId, {
      id: subId,
      topic,
      unsubscribe: () => stompClient.unsubscribe(subId),
    });
    console.log(
      `[SubscriptionManager] ✓ Subscribed to ${topic} with subId: ${subId}`,
    );
  }

  private unsubscribe(subscriptionId: string): void {
    const subscription = this.activeSubscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.activeSubscriptions.delete(subscriptionId);
    }
  }

  private handleMessage(topic: string, payload: unknown): void {
    console.log(
      `[SubscriptionManager] 📨 Handling message for topic: ${topic}`,
      payload,
    );
    // Dispatch to appropriate handler based on topic pattern
    if (topic === "/user/queue/notifications") {
      console.log(`[SubscriptionManager] → Routing to personal notifications`);
      this.handlePersonalNotification(payload as NewNotificationEvent<unknown>);
    } else if (
      topic.includes("/topic/provider/") &&
      topic.includes("/notifications")
    ) {
      console.log(
        `[SubscriptionManager] → Routing to provider topic notifications`,
      );
      // Provider notification topic has different payload structure
      this.handleProviderTopicNotification(
        payload as ProviderTopicNotificationEvent,
      );
    } else if (topic.includes("/urgent")) {
      console.log(`[SubscriptionManager] → Routing to urgent cases`);
      this.handleUrgentCase(payload as NewUrgentCaseEvent);
    } else if (topic.includes("/patients") && !topic.includes("/urgent")) {
      console.log(`[SubscriptionManager] → Routing to patient status`);
      this.handlePatientStatusChange(payload as PatientStatusChangedEvent);
    } else if (topic.includes("patient-results")) {
      console.log(`[SubscriptionManager] → Routing to patient results`);
      this.handlePatientResult(payload as NewPatientResultEvent);
    } else {
      console.warn(`[SubscriptionManager] ⚠️ Unhandled topic: ${topic}`);
    }

    // Trigger immediate refetch of all active React Query observers.
    // This runs synchronously in the WebSocket message handler — no React
    // lifecycle, no event listener timing issues.
    refetchAllActiveQueries();
  }

  private handlePersonalNotification(
    payload: NewNotificationEvent<unknown>,
  ): void {
    console.log(
      `[SubscriptionManager] 🔔 Dispatching ws:notification`,
      payload,
    );
    // This will be handled by the notification hook/atom
    // Event is dispatched to window for loose coupling
    window.dispatchEvent(
      new CustomEvent("ws:notification", { detail: payload }),
    );
  }

  private handleProviderTopicNotification(payload: unknown): void {
    console.log(
      `[SubscriptionManager] 🔔 Dispatching provider notification`,
      payload,
    );

    // Cast to any to access raw fields without TypeScript interface constraints
    const rawPayload = payload as Record<string, unknown>;

    // Handle UNREAD_COUNT_CHANGED type
    if (rawPayload.type === "UNREAD_COUNT_CHANGED") {
      window.dispatchEvent(
        new CustomEvent("ws:unread-count", {
          detail: { unreadCount: rawPayload.unreadCount as number },
        }),
      );
      return;
    }

    // Handle NEW_NOTIFICATION type - transform to match expected format
    const notificationObj = rawPayload.notification as
      | Record<string, unknown>
      | undefined;
    if (rawPayload.type === "NEW_NOTIFICATION" && notificationObj) {
      // Transform provider topic notification to match ProviderNotification shape
      // Using actual field names from WebSocket payload
      const notification: ProviderNotification = {
        notificationId: (notificationObj.id as string) || "",
        targetId:
          parseInt((notificationObj.relatedEntityId as string) || "0", 10) || 0,
        targetType: (notificationObj.relatedEntityType as string) || "",
        unread: !(notificationObj.read as boolean),
        targetName: (notificationObj.title as string) || "",
        targetSchoolId: (notificationObj.schoolId as number) || 0,
        targetSchoolName: (notificationObj.schoolName as string | null) || null,
        text: (notificationObj.message as string) || "",
        category:
          notificationObj.type as string as ProviderNotification["category"],
        action:
          (notificationObj.action as ProviderNotification["action"]) || "VIEW",
        notification: (notificationObj.notification as string) || "",
        emoji: (notificationObj.emoji as string) || "",
        timestamp: notificationObj.createdAt as string,
        avatarUrl: (notificationObj.avatarUrl as string | null) || null,
      };

      // Dispatch in format expected by useNotificationWebSocket
      window.dispatchEvent(
        new CustomEvent("ws:notification", {
          detail: {
            event: "NEW_NOTIFICATION",
            timestamp: notificationObj.createdAt as string,
            recipientId: "", // Not provided in topic payload
            recipientRole: "ROLE_PROVIDER",
            unreadCount: rawPayload.unreadCount as number,
            notification,
          },
        }),
      );
    }
  }

  private handleUrgentCase(payload: NewUrgentCaseEvent): void {
    console.log(`[SubscriptionManager] 🚨 Dispatching ws:urgent-case`, payload);
    window.dispatchEvent(
      new CustomEvent("ws:urgent-case", { detail: payload }),
    );
  }

  private handlePatientStatusChange(payload: PatientStatusChangedEvent): void {
    console.log(
      `[SubscriptionManager] 🏥 Dispatching ws:patient-status`,
      payload,
    );
    window.dispatchEvent(
      new CustomEvent("ws:patient-status", { detail: payload }),
    );
  }

  private handlePatientResult(payload: NewPatientResultEvent): void {
    console.log(
      `[SubscriptionManager] 📋 Dispatching ws:patient-result`,
      payload,
    );
    window.dispatchEvent(
      new CustomEvent("ws:patient-result", { detail: payload }),
    );
  }

  private extractProviderId(): string | null {
    // Try to get from localStorage or other storage
    // This could be stored during login or fetched from API
    const stored = localStorage.getItem("providerId");
    if (stored) return stored;

    // Fallback: Try to get from profile data in localStorage if available
    // Some auth flows store the full profile or user object
    const profileData = localStorage.getItem("userProfile");
    if (profileData) {
      try {
        const parsed = JSON.parse(profileData);
        return parsed.id || parsed.providerId || null;
      } catch {
        // Ignore parse errors
      }
    }

    return null;
  }

  // Set provider ID (call this after login or when ID is known)
  setProviderId(id: string): void {
    console.log(
      `[SubscriptionManager] setProviderId called: ${id}, current userType: ${this.userType}`,
    );
    this.providerId = id;
    localStorage.setItem("providerId", id);

    // Re-initialize if already connected
    if (this.userType === "provider") {
      console.log(
        `[SubscriptionManager] Re-initializing provider subscriptions`,
      );
      this.cleanup();
      this.initializeProviderSubscriptions();
    } else {
      console.log(
        `[SubscriptionManager] Not a provider userType, skipping subscription init`,
      );
    }
  }

  // Cleanup all subscriptions
  cleanup(): void {
    console.log(
      `[SubscriptionManager] Cleaning up ${this.activeSubscriptions.size} subscriptions`,
    );
    this.activeSubscriptions.forEach((sub) => sub.unsubscribe());
    this.activeSubscriptions.clear();
    this.schoolIds = [];
  }

  // Re-subscribe to all topics after reconnect
  resubscribeAll(): void {
    console.log(
      `[SubscriptionManager] Resubscribing all ${this.activeSubscriptions.size} topics after reconnect`,
    );

    // Get all current topics before clearing
    const topicsToResubscribe: Array<{
      topic: string;
      subscriptionId: string;
    }> = [];
    this.activeSubscriptions.forEach((sub, id) => {
      topicsToResubscribe.push({ topic: sub.topic, subscriptionId: id });
    });

    // Clear current subscriptions (they're invalid after disconnect)
    this.activeSubscriptions.clear();

    // Re-subscribe to each topic
    topicsToResubscribe.forEach(({ topic, subscriptionId }) => {
      console.log(`[SubscriptionManager] Re-subscribing to ${topic}`);
      this.subscribeToTopic(topic, subscriptionId);
    });

    console.log(
      `[SubscriptionManager] Resubscribed to ${this.activeSubscriptions.size} topics`,
    );
  }

  // Get active subscription count (for debugging)
  getActiveSubscriptionCount(): number {
    return this.activeSubscriptions.size;
  }
}

// Export singleton
export const subscriptionManager = new SubscriptionManager();
