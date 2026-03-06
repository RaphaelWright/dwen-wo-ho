"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { FiFileText, FiPlus } from "react-icons/fi";
import { ROUTES } from "@/lib/constants/routes";
import { MdSchool, MdHealthAndSafety, MdHandshake } from "react-icons/md";
import { useNotification } from "@/hooks/useNotification";
import { NavItem, SidebarProps } from "@/lib/types/components/curator/sidebar";

export const useCuratorSidebar = ({ onCreateClick }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { notifications, unreadCount, setIsOpen } = useNotification();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-collapse sidebar on non-main pages
  useEffect(() => {
    const mainPages: string[] = [
      ROUTES.curator.dashboard,
      ROUTES.curator.schools,
      ROUTES.curator.providers,
      ROUTES.curator.partners,
      ROUTES.curator.pages,
    ];

    if (!mainPages.includes(pathname)) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [pathname]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsMobileSidebarOpen(false);
  };

  const navItems: NavItem[] = [
    {
      href: ROUTES.curator.schools,
      label: "Schools",
      icon: <MdSchool className="text-lg shrink-0" />,
    },
    {
      href: ROUTES.curator.providers,
      label: "Providers",
      icon: <MdHealthAndSafety className="text-lg shrink-0" />,
    },
    {
      href: ROUTES.curator.partners,
      label: "Partners",
      icon: <MdHandshake className="text-lg shrink-0" />,
    },
    {
      href: ROUTES.curator.pages,
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
    unreadCount,
    navItems,
    handleLogoutClick,
    setIsOpen: setIsOpen,
  };
};
