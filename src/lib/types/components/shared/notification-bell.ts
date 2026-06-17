import type { HTMLMotionProps } from "motion/react";
import type { LucideIcon } from "lucide-react";

export interface NotificationBellProps extends Omit<
  HTMLMotionProps<"button">,
  "onClick"
> {
  unreadCount: number;
  onOpenNotifs: () => void;
  icon?: LucideIcon;
  iconSize?: number;
  badgeColor?: string;
  badgeSize?: string;
  containerClassName?: string;
  pulseColor?: string;
}
