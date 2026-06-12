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
    <div className="bg-background/80 border-border/60 fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b px-4 backdrop-blur-lg md:hidden">
      <button
        type="button"
        onClick={onToggle}
        className="text-foreground hover:bg-accent rounded-lg p-2 transition-colors"
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
