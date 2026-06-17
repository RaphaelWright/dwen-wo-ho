export type NotificationToastType = "success" | "error" | "info";

export interface NotificationToastContent {
  title: string;
  description: string;
  type: NotificationToastType;
}
