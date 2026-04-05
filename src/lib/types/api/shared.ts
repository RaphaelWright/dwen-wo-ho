export type ActionStatus = "NONE" | "TREATING" | "REFERRED";
export type VisibilityStatus = "NEW" | "SEEN";

export type NotificationType =
  | "PROVIDER_REGISTRATION"
  | "PROVIDER_APPLICATION_UPDATE"
  | "SCHOOL_REGISTRATION"
  | "PATIENT_LOCK_IN"
  | "CRITICAL_ALERT"
  | "ADMIN_ACTION_REQUIRED"
  | "PROVIDER_SCHOOL_CHANGE"
  | "NEW_PATIENT_ADDED"
  | "OPEN_PATIENTS_AVAILABLE"
  | "PATIENT_REFERRED"
  | "ACTION_STATUS_CHANGED"
  | "STAR_PROVIDER_ASSIGNED";

export interface ProviderSummaryDTO {
  id: string; // uuid
  fullName: string;
  email: string;
  professionalTitle: string;
  specialty: string;
}

export interface TreatingProviderDTO {
  id: string;
  fullName: string;
}

export interface BackendNotification {
  notificationId: string;
  targetId: number;
  targetType: string;
  unread: boolean;
  targetName: string;
  targetSchoolId: number;
  targetSchoolName: string | null;
  text: string;
  category: string;
  timestamp: string;
  avatarUrl: string | null;
}

export interface NotificationListResponse {
  notifications: BackendNotification[];
  unreadCount: number;
  totalCount: number;
}

export interface ApiSuccessResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
}
