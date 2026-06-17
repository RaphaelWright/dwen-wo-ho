import { Route } from "next";
import { ReactNode } from "react";

export interface NavItem {
  href?: Route;
  label: string;
  icon: ReactNode;
  count?: number;
  onClick?: () => void;
}

export interface SidebarProps {
  onLogout: () => void;
}

export interface MobileHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
  theme?: string;
  mounted: boolean;
  unreadCount: number;
  setIsOpen: (open: boolean) => void;
}

export interface SidebarContentProps {
  collapsed: boolean;
  navItems: NavItem[];
  pathname: string;
  theme?: string;
  mounted: boolean;
  unreadCount: number;
  setIsOpen: (open: boolean) => void;
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
