import { stompClient } from "./stomp-client";
import { ActiveSubscription } from "@/lib/types/entities/websocket";
import { getUserType } from "@/lib/utils/auth/get-user-type";
import { extractProviderId } from "./provider-id";
import { routeSubscriptionMessage } from "./subscription-message-handlers";

class SubscriptionManager {
  private activeSubscriptions: Map<string, ActiveSubscription> = new Map();
  private userType: ReturnType<typeof getUserType> = null;
  private providerId: string | null = null;
  private schoolIds: number[] = [];
  private hasWarnedMissingId = false;

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

    if (this.userType === "provider" && !this.providerId) {
      this.providerId = extractProviderId();
      console.log(
        `[SubscriptionManager] Extracted providerId: ${this.providerId}`,
      );
    }

    this.subscribeToTopic(
      "/user/queue/notifications",
      "personal-notifications",
    );

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
    this.subscribeToTopic(
      "/topic/curator/patient-results",
      "curator-patient-results",
    );

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
      this.providerId = extractProviderId();
      console.log(
        `[SubscriptionManager] Extracted providerId: ${this.providerId}`,
      );
    }

    if (!this.providerId) {
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

    this.subscribeToTopic(
      `/topic/provider/${this.providerId}/notifications`,
      "provider-notifications",
    );
    this.subscribeToTopic(
      `/topic/provider/${this.providerId}/urgent`,
      "provider-urgent",
    );
    this.subscribeToTopic(
      `/topic/provider/${this.providerId}/patients`,
      "provider-patients",
    );

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

  addSchoolSubscription(schoolId: number): void {
    if (this.schoolIds.includes(schoolId)) {
      return;
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
      return;
    }

    console.log(
      `[SubscriptionManager] Subscribing to ${topic} (${subscriptionId})`,
    );
    const subId = stompClient.subscribe(topic, (payload: unknown) => {
      routeSubscriptionMessage(topic, payload);
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

  setProviderId(id: string): void {
    console.log(
      `[SubscriptionManager] setProviderId called: ${id}, current userType: ${this.userType}`,
    );
    this.providerId = id;
    localStorage.setItem("providerId", id);

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

  cleanup(): void {
    console.log(
      `[SubscriptionManager] Cleaning up ${this.activeSubscriptions.size} subscriptions`,
    );
    this.activeSubscriptions.forEach((sub) => sub.unsubscribe());
    this.activeSubscriptions.clear();
    this.schoolIds = [];
  }

  resubscribeAll(): void {
    console.log(
      `[SubscriptionManager] Resubscribing all ${this.activeSubscriptions.size} topics after reconnect`,
    );

    const topicsToResubscribe: Array<{
      topic: string;
      subscriptionId: string;
    }> = [];
    this.activeSubscriptions.forEach((sub, id) => {
      topicsToResubscribe.push({ topic: sub.topic, subscriptionId: id });
    });

    this.activeSubscriptions.clear();

    topicsToResubscribe.forEach(({ topic, subscriptionId }) => {
      console.log(`[SubscriptionManager] Re-subscribing to ${topic}`);
      this.subscribeToTopic(topic, subscriptionId);
    });

    console.log(
      `[SubscriptionManager] Resubscribed to ${this.activeSubscriptions.size} topics`,
    );
  }

  getActiveSubscriptionCount(): number {
    return this.activeSubscriptions.size;
  }
}

export const subscriptionManager = new SubscriptionManager();
