export type ConnectionStatus =
  | "CONNECTING"
  | "CONNECTED"
  | "DISCONNECTED"
  | "ERROR";

export interface StompConnectionConfig {
  url: string;
  token: string;
  reconnectDelay?: number;
  debug?: boolean;
}

// WebSocket event payloads from backend
export interface ConnectedEvent {
  event: "CONNECTED";
  timestamp: string;
  userId: string;
  role: "ROLE_PROVIDER" | "ROLE_CURATOR" | "ROLE_ADMIN";
}

export interface NewNotificationEvent<T> {
  event: "NEW_NOTIFICATION";
  timestamp: string;
  recipientId: string;
  recipientRole: string;
  unreadCount: number;
  notification: T;
}

export interface UnreadCountChangedEvent {
  event: "UNREAD_COUNT_CHANGED";
  timestamp: string;
  recipientId: string;
  recipientRole: string;
  unreadCount: number;
}

export type WebSocketEventPayload<T> =
  | ConnectedEvent
  | NewNotificationEvent<T>
  | UnreadCountChangedEvent;

// STOMP topic destinations
export type SubscriptionTopic =
  | "/user/queue/notifications"
  | `/topic/provider/${string}/notifications`
  | `/topic/provider/${string}/urgent`
  | `/topic/provider/${string}/patients`
  | `/topic/provider/school/${string}/urgent`
  | "/topic/curator/patient-results"
  | `/topic/school/${string}/patient-results`;

// Urgent case event (from /topic/provider/{id}/urgent)
export interface UrgentCasePatient {
  patientId: number;
  patientName: string;
  score: number;
  status: "urgent" | "critical";
  schoolId: number;
  schoolName: string;
  time: string;
  preview?: string;
  avatarUrl?: string | null;
}

export interface NewUrgentCaseEvent {
  type: "NEW_URGENT_CASE";
  patient: UrgentCasePatient;
}

// Patient status change event (from /topic/provider/{id}/patients)
export interface PatientStatusChangedEvent {
  type: "PATIENT_STATUS_CHANGED";
  patient: UrgentCasePatient & { status: string };
}

// Curator patient result event (from /topic/curator/patient-results)
export interface NewPatientResultEvent {
  type: "NEW_PATIENT_RESULT";
  schoolId: number;
  patientName: string;
  patientResultId: number;
  lockinId: number;
  createdAt: string;
}

// Provider notification topic payload (/topic/provider/{id}/notifications)
// Has different structure than personal queue
export interface ProviderTopicNotificationEvent {
  type: "NEW_NOTIFICATION" | "UNREAD_COUNT_CHANGED";
  notification?: {
    id: string;
    type: string;
    title: string;
    message: string;
    relatedEntityId: string;
    relatedEntityType: string;
    schoolId: number;
    schoolName?: string | null;
    read: boolean;
    createdAt: string;
    action?: string | null;
    notification?: string | null;
    emoji?: string | null;
    avatarUrl?: string | null;
  };
  unreadCount: number;
}

// Union of all topic-specific events
export type TopicEventPayload =
  | NewUrgentCaseEvent
  | PatientStatusChangedEvent
  | NewPatientResultEvent;

// WebSocket message handler type
export type MessageHandler<T = unknown> = (payload: T) => void;

// Subscription map for tracking active subscriptions
export interface ActiveSubscription {
  id: string;
  topic: string;
  unsubscribe: () => void;
}
