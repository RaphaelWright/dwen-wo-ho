"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { Bell, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

export const NotificationBell = ({
  unreadCount,
  onOpenNotifs,
  icon: Icon = Bell,
  iconSize = 20,
  badgeColor = "bg-success",
  badgeSize = "size-2",
  pulseColor = "rgba(16,185,129,.5)",
  containerClassName,
  className,
  ...props
}: NotificationBellProps) => {
  return (
    <div className={cn("flex items-center gap-2.5", containerClassName)}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onOpenNotifs}
        className={cn(
          "relative size-9 flex items-center justify-center rounded-lg border cursor-pointer bg-card/90 hover:bg-muted/80 transition-colors",
          className,
        )}
        aria-label="Open notifications"
        {...props}
      >
        <Icon size={iconSize} />
        {unreadCount > 0 && (
          <motion.div
            animate={{
              boxShadow: [
                `0 0 0 0 ${pulseColor}`,
                `0 0 0 5px rgba(16,185,129,0)`,
                `0 0 0 0 ${pulseColor}`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={cn(
              "absolute top-1.5 right-1.5 rounded-full border-2",
              badgeSize,
              badgeColor,
            )}
          />
        )}
      </motion.button>
    </div>
  );
};
