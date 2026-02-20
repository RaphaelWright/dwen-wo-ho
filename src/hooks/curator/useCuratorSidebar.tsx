"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { FiFileText, FiPlus } from "react-icons/fi";
import { MdSchool, MdHealthAndSafety, MdHandshake } from "react-icons/md";
import { useNotification } from "@/hooks/useNotification";
import { NavItem, SidebarProps } from "@/lib/types/components/curator/sidebar";

export const useCuratorSidebar = ({
  schoolCount,
  providerCount,
  partnerCount,
  onCreateClick,
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const {
    notifications,
    clearNotifications,
    dismissNotification,
    unreadCount,
  } = useNotification();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsMobileSidebarOpen(false);
  };

  const navItems: NavItem[] = [
    {
      href: "/curator/schools",
      label: "Schools",
      icon: <MdSchool className="text-lg shrink-0" />,
      count: schoolCount,
    },
    {
      href: "/curator/providers",
      label: "Providers",
      icon: <MdHealthAndSafety className="text-lg shrink-0" />,
      count: providerCount,
    },
    {
      href: "/curator/partners",
      label: "Partners",
      icon: <MdHandshake className="text-lg shrink-0" />,
      count: partnerCount,
    },
    {
      href: "/curator/pages",
      label: "Pages",
      icon: <FiFileText className="text-lg shrink-0" />,
    },
    {
      label: "Create",
      icon: <FiPlus className="text-lg shrink-0" />,
      onClick: () => {
        onCreateClick();
        setIsMobileSidebarOpen(false);
      },
    },
  ];

  return {
    isCollapsed,
    setIsCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    showLogoutModal,
    setShowLogoutModal,
    pathname,
    theme,
    mounted,
    notifications,
    clearNotifications,
    dismissNotification,
    unreadCount,
    navItems,
    handleLogoutClick,
  };
};
