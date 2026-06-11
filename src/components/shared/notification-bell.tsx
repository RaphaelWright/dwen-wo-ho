"use client";

import { m, HTMLMotionProps } from "motion/react";
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
  void badgeColor;
  void badgeSize;
  void pulseColor;

  return (
    <div className={cn("flex items-center gap-2.5", containerClassName)}>
      <m.button
        whileTap={{ scale: 0.95 }}
        onClick={onOpenNotifs}
        className={cn(
          "relative size-9 flex items-center justify-center rounded-lg border bg-card/90 hover:bg-muted/80 transition-colors",
          className,
        )}
        aria-label="Open notifications"
        {...props}
      >
        <Icon size={iconSize} />
        {unreadCount > 0 && (
          <>
            {/* Unread count badge - top left */}
            <span className="absolute -top-2 -left-2 flex items-center justify-center size-5 text-[8.5px] font-bold text-white bg-success rounded-full">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
            {/* Green beacon pulse - top right */}
            {/* <m.div
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
            /> */}
          </>
        )}
      </m.button>
    </div>
  );
};
