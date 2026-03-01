import { Route } from "next";
import { ReactNode } from "react";
import { Notification } from "@/lib/types/notification";

export interface NavItem {
  href?: Route;
  label: string;
  icon: ReactNode;
  count?: number;
  onClick?: () => void;
}

export interface SidebarProps {
  onCreateClick: () => void;
  onLogout: () => void;
}

export interface MobileHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
  theme?: string;
  mounted: boolean;
  notifications: Notification[];
  onClearNotifications: () => void;
  onDismissNotification: (id: string) => void;
}

export interface SidebarContentProps {
  collapsed: boolean;
  navItems: NavItem[];
  pathname: string;
  theme?: string;
  mounted: boolean;
  notifications: Notification[];
  unreadCount: number;
  onClearNotifications: () => void;
  onDismissNotification: (id: string) => void;
  onToggleCollapse: () => void;
  onLogoutClick: () => void;
  onMobileClose: () => void;
}

export interface SidebarNavItemProps {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
  onMobileClose?: () => void;
}
