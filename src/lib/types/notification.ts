export interface Notification {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  link?: string;
  timestamp: Date;
  read: boolean;
}

export interface NotificationSheetProps {
  notifications: Notification[];
  onClear: () => void;
  onDismiss: (id: string) => void;
  trigger?: React.ReactNode;
}
