"use client";

import {
  FiBell,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiTrash2,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
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

export interface Notification {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  timestamp: Date;
}

interface NotificationSheetProps {
  notifications: Notification[];
  onClear: () => void;
  onDismiss: (id: string) => void;
  trigger?: React.ReactNode;
}

const typeConfig = {
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

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);

  if (diffSec < 10) return "Just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  return `${diffHr}h ago`;
}

export const NotificationSheet = ({
  notifications,
  onClear,
  onDismiss,
  trigger,
}: NotificationSheetProps) => {
  const unreadCount = notifications.length;

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            className="relative p-2.5 rounded-md bg-transparent border-0 shadow-none hover:bg-purple-300 transition-all duration-200 group"
            aria-label="Notifications"
          >
            <FiBell className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 text-[#955aa4]" />

            {/* Badge */}
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 flex items-center justify-center px-1 rounded-full bg-[#e92229] text-white text-[10px] font-bold shadow-md"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Pulse animation when there are notifications */}
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 rounded-full bg-[#e92229]/40 animate-ping" />
            )}
          </Button>
        )}
      </DrawerTrigger>

      <DrawerContent className="h-full rounded-none">
        {/* Header */}
        <DrawerHeader className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DrawerTitle className="text-lg font-bold text-gray-900">
                Notifications
              </DrawerTitle>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#955aa4]/10 text-[#955aa4] text-xs font-semibold">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onClear}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                  Clear all
                </button>
              )}
              <DrawerClose asChild>
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200">
                  <FiX className="w-4 h-4" />
                </button>
              </DrawerClose>
            </div>
          </div>
        </DrawerHeader>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 px-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <FiBell className="w-7 h-7 text-gray-300" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                No notifications yet
              </h3>
              <p className="text-xs text-gray-500 text-center max-w-[200px]">
                You&apos;ll see updates about new patients, schools, and system
                events here.
              </p>
            </div>
          ) : (
            <div className="py-2">
              <AnimatePresence initial={false}>
                {notifications.map((notification) => {
                  const config = typeConfig[notification.type];
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 30, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      exit={{ opacity: 0, x: 30, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="px-3"
                    >
                      <div
                        className={cn(
                          "flex items-start gap-3 px-4 py-3.5 mx-0 my-1 rounded-xl border transition-all duration-200 hover:shadow-sm",
                          config.bg,
                          config.border,
                        )}
                      >
                        {/* Icon */}
                        <div
                          className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5",
                            config.bg,
                          )}
                        >
                          <Icon className={cn("w-4 h-4", config.color)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 font-medium leading-snug">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatRelativeTime(notification.timestamp)}
                          </p>
                        </div>

                        {/* Dismiss */}
                        <button
                          onClick={() => onDismiss(notification.id)}
                          className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-all duration-200"
                        >
                          <FiX className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
