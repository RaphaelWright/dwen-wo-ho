"use client";

import {
  FiBell,
  FiX,
  FiCheck,
  FiTrash2,
  FiAlertCircle,
  FiInfo,
} from "react-icons/fi";
import { cn, formatRelativeTime } from "@/lib/utils";
import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/hooks/use-notification";
import { NotificationSheetProps } from "@/lib/types/notification";

const NOTIFICATION_TYPE_CONFIG = {
  success: {
    icon: FiCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  error: {
    icon: FiAlertCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  info: {
    icon: FiInfo,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
};

export const NotificationSheet = ({
  notifications,
  onClear,
  onDismiss,
  trigger,
}: NotificationSheetProps) => {
  const { markAsRead, markAllAsRead, isOpen, setIsOpen } = useNotification();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            className="relative p-2.5 rounded-md bg-transparent border-0 shadow-none hover:bg-primary/20 transition-all duration-200 group"
            aria-label="Notifications"
          >
            <FiBell className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 text-primary" />

            {/* Badge */}
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="absolute -top-0.5 -right-0.5 min-w-5 h-5 flex items-center justify-center px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold shadow-md"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Pulse animation when there are unread notifications */}
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 rounded-full bg-destructive/40 animate-ping" />
            )}
          </Button>
        )}
      </DrawerTrigger>

      <DrawerContent className="h-full rounded-none w-full max-w-sm">
        {/* Header */}
        <DrawerHeader className="border-b border-border px-5 py-4">
          <DrawerTitle className="text-lg font-bold text-foreground">
            Notifications
          </DrawerTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-primary p-2 hover:bg-accent/50 rounded-md transition-all duration-200"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={onClear}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                  title="Clear all"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
              <DrawerClose asChild>
                <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200">
                  <FiX className="w-5 h-5" />
                </button>
              </DrawerClose>
            </div>
          </div>
        </DrawerHeader>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto bg-muted/5">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 px-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <FiBell className="w-7 h-7 text-muted-foreground/50" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                No notifications yet
              </h3>
              <p className="text-xs text-muted-foreground text-center max-w-50">
                You&apos;ll see updates about new patients, schools, and system
                events here.
              </p>
            </div>
          ) : (
            <div className="py-2 space-y-1">
              <AnimatePresence initial={false}>
                {notifications.map((notification) => {
                  const config = NOTIFICATION_TYPE_CONFIG[notification.type];
                  const Icon = config.icon;

                  const NotificationContent = (
                    <div
                      className={cn(
                        "relative flex items-center justify-center gap-3 px-2 py-1 mx-0 rounded-xl transition-all duration-200 group hover:shadow-sm border w-full text-left",
                        notification.read
                          ? "bg-card border-transparent opacity-70 hover:opacity-100" // Read style
                          : cn(
                              "bg-card border shadow-sm",
                              config.border,
                              "border-l-2",
                            ), // Unread style
                      )}
                      onClick={(e) => {
                        if (!notification.read) {
                          markAsRead(notification.id);
                        }
                        if (notification.link) {
                          setIsOpen(false);
                        }
                      }}
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          "shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5",
                          notification.read
                            ? "bg-muted text-muted-foreground"
                            : config.bg,
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-4 h-4",
                            notification.read
                              ? "text-muted-foreground"
                              : config.color,
                          )}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p
                            className={cn(
                              "text-sm font-medium leading-snug",
                              notification.read
                                ? "text-muted-foreground"
                                : "text-foreground group-hover:text-primary transition-colors",
                            )}
                          >
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <span
                              className={cn(
                                "shrink-0 w-2 h-2 rounded-full",
                                config.dot,
                              )}
                            />
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(notification.timestamp)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Mark as read"
                          >
                            <FiCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDismiss(notification.id);
                          }}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete"
                        >
                          <FiX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 30, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      exit={{ opacity: 0, x: 30, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="px-2"
                    >
                      {notification.link ? (
                        <Link
                          href={notification.link as any}
                          className="block w-full"
                        >
                          {NotificationContent}
                        </Link>
                      ) : (
                        <div className="block w-full cursor-pointer">
                          {NotificationContent}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
