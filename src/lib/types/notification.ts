export interface Notification {
  id: string | number;
  type: "success" | "error" | "info";
  message: string;
  link?: string;
  timestamp: Date;
  read: boolean;
  // Additional optional fields for shared notification UI
  title?: string;
  avatarUrl?: string;
  targetName?: string;
  targetSchoolId?: string | number;
  targetSchoolName?: string;
  text?: string;
  meta?: string;
  targetId?: string;
  targetType?: "patient" | "school" | "system";
  unread?: boolean;
}

export interface NotificationSheetProps {
  notifications: Notification[];
  onClear: () => void;
  onDismiss: (id: string | number) => void;
  trigger?: React.ReactNode;
}
