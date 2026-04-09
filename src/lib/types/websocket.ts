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

// Role-based topic mapping
export interface RoleTopics {
  curator: string[];
  provider: string[];
}

export const ROLE_BASED_TOPICS: Record<
  "curator" | "provider",
  { required: string[]; dynamic: string[] }
> = {
  curator: {
    required: ["/user/queue/notifications", "/topic/curator/patient-results"],
    dynamic: [], // School-specific topics added dynamically
  },
  provider: {
    required: ["/user/queue/notifications"],
    dynamic: [
      "/topic/provider/{providerId}/notifications",
      "/topic/provider/{providerId}/urgent",
      "/topic/provider/{providerId}/patients",
      "/topic/provider/school/{schoolId}/urgent",
    ],
  },
};

// Notification types by role (for frontend filtering if needed)
export const CURATOR_NOTIFICATION_TYPES = [
  "PROVIDER_REGISTRATION",
  "PROVIDER_APPLICATION_UPDATE",
  "SCHOOL_REGISTRATION",
  "NEW_PATIENT_ADDED",
  "CRITICAL_ALERT",
  "ADMIN_ACTION_REQUIRED",
];

export const PROVIDER_NOTIFICATION_TYPES = [
  "PATIENT_LOCK_IN",
  "OPEN_PATIENTS_AVAILABLE",
  "PATIENT_REFERRED",
  "ACTION_STATUS_CHANGED",
  "STAR_PROVIDER_ASSIGNED",
  "PROVIDER_APPLICATION_UPDATE",
  "CRITICAL_ALERT",
  "PROVIDER_SCHOOL_CHANGE",
];

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
