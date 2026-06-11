"use client";

import { FiMenu, FiX } from "react-icons/fi";
import { Logo } from "@/components/shared/Logo";
import { NotificationBell } from "@/components/shared/notification-bell";
import { MobileHeaderProps } from "@/lib/types/components/curator/sidebar";

export const MobileHeader = ({
  isOpen,
  onToggle,
  theme,
  mounted,
  unreadCount,
  setIsOpen,
}: MobileHeaderProps) => {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-background/80 backdrop-blur-lg border-b border-border/60 flex items-center justify-between px-4 z-50">
      <button
        type="button"
        onClick={onToggle}
        className="text-foreground p-2 hover:bg-accent rounded-lg transition-colors"
      >
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>
      <Logo
        variant={mounted && theme === "light" ? "black" : "white"}
        className="h-7 w-auto"
        withLink={false}
      />
      <div className="flex items-center">
        <NotificationBell
          unreadCount={unreadCount}
          onOpenNotifs={() => setIsOpen(true)}
        />
      </div>
    </div>
  );
};
