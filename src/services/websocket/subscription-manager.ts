import { stompClient } from "./stomp-client";
import {
  ROLE_BASED_TOPICS,
  ActiveSubscription,
  NewNotificationEvent,
  UnreadCountChangedEvent,
  NewUrgentCaseEvent,
  PatientStatusChangedEvent,
  NewPatientResultEvent,
} from "@/lib/types/websocket";
import { getUserType } from "@/lib/utils/getUserType";

class SubscriptionManager {
  private activeSubscriptions: Map<string, ActiveSubscription> = new Map();
  private userType: ReturnType<typeof getUserType> = null;
  private providerId: string | null = null;
  private schoolIds: number[] = [];
  private hasWarnedMissingId = false;

  // Initialize subscriptions based on user role
  initialize(): void {
    this.userType = getUserType();

    if (!this.userType) {
      console.log(
        "[SubscriptionManager] No user type found, skipping subscriptions",
      );
      return;
    }

    // Try to extract provider ID if not already set
    if (this.userType === "provider" && !this.providerId) {
      this.providerId = this.extractProviderId();
    }

    console.log(`[SubscriptionManager] Initializing for ${this.userType}`);

    // Subscribe to common topic (all roles)
    this.subscribeToTopic(
      "/user/queue/notifications",
      "personal-notifications",
    );

    // Subscribe to role-specific topics
    if (this.userType === "curator") {
      this.initializeCuratorSubscriptions();
    } else if (this.userType === "provider") {
      this.initializeProviderSubscriptions();
    }
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
    if (!this.providerId) {
      // Try to get provider ID from localStorage or API
      this.providerId = this.extractProviderId();
    }

    if (!this.providerId) {
      // Provider ID will be set later via setProviderId() after profile loads.
      // Don't warn repeatedly - this is expected during initial page load.
      if (!this.hasWarnedMissingId) {
        console.log("[SubscriptionManager] Provider ID not yet available, provider-specific subscriptions will be set up after profile loads");
        this.hasWarnedMissingId = true;
      }
      return;
    }

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
      return; // Already subscribed
    }

    const subId = stompClient.subscribe(topic, (payload: unknown) => {
      this.handleMessage(topic, payload);
    });

    this.activeSubscriptions.set(subscriptionId, {
      id: subId,
      topic,
      unsubscribe: () => stompClient.unsubscribe(subId),
    });

    console.log(
      `[SubscriptionManager] Subscribed: ${topic} (${subscriptionId})`,
    );
  }

  private unsubscribe(subscriptionId: string): void {
    const subscription = this.activeSubscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.activeSubscriptions.delete(subscriptionId);
      console.log(`[SubscriptionManager] Unsubscribed: ${subscriptionId}`);
    }
  }

  private handleMessage(topic: string, payload: unknown): void {
    // Dispatch to appropriate handler based on topic pattern
    if (topic === "/user/queue/notifications") {
      this.handlePersonalNotification(payload as NewNotificationEvent);
    } else if (topic.includes("/urgent")) {
      this.handleUrgentCase(payload as NewUrgentCaseEvent);
    } else if (topic.includes("/patients") && !topic.includes("/urgent")) {
      this.handlePatientStatusChange(payload as PatientStatusChangedEvent);
    } else if (topic.includes("patient-results")) {
      this.handlePatientResult(payload as NewPatientResultEvent);
    }
  }

  private handlePersonalNotification(payload: NewNotificationEvent): void {
    // This will be handled by the notification hook/atom
    // Event is dispatched to window for loose coupling
    window.dispatchEvent(
      new CustomEvent("ws:notification", { detail: payload }),
    );
  }

  private handleUrgentCase(payload: NewUrgentCaseEvent): void {
    window.dispatchEvent(
      new CustomEvent("ws:urgent-case", { detail: payload }),
    );
  }

  private handlePatientStatusChange(payload: PatientStatusChangedEvent): void {
    window.dispatchEvent(
      new CustomEvent("ws:patient-status", { detail: payload }),
    );
  }

  private handlePatientResult(payload: NewPatientResultEvent): void {
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
    this.providerId = id;
    localStorage.setItem("providerId", id);

    // Re-initialize if already connected
    if (this.userType === "provider") {
      this.cleanup();
      this.initializeProviderSubscriptions();
    }
  }

  // Cleanup all subscriptions
  cleanup(): void {
    this.activeSubscriptions.forEach((sub) => sub.unsubscribe());
    this.activeSubscriptions.clear();
    this.schoolIds = [];
    console.log("[SubscriptionManager] Cleaned up all subscriptions");
  }

  // Get active subscription count (for debugging)
  getActiveSubscriptionCount(): number {
    return this.activeSubscriptions.size;
  }
}

// Export singleton
export const subscriptionManager = new SubscriptionManager();
