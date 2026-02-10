"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FiFileText,
  FiPlus,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
} from "react-icons/fi";
import { LuChevronsLeft, LuChevronsRight } from "react-icons/lu";
import { MdSchool, MdHealthAndSafety, MdHandshake } from "react-icons/md";
import { cn } from "@/lib/utils";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationSheet } from "./notification-sheet";
import { useNotification } from "@/context/notification-context";

interface SidebarProps {
  schoolCount: number;
  providerCount: number;
  partnerCount: number;
  onCreateClick: () => void;
  onLogout: () => void;
}

interface NavItem {
  href?: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
  onClick?: () => void;
}

const SIDEBAR_EXPANDED_WIDTH = 256; // 16rem
const SIDEBAR_COLLAPSED_WIDTH = 68;

export const CuratorSidebar = ({
  schoolCount,
  providerCount,
  partnerCount,
  onCreateClick,
  onLogout,
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsMobileSidebarOpen(false);
  };

  const navItems: NavItem[] = [
    {
      href: "/curator/schools",
      label: "Schools",
      icon: <MdSchool className="text-lg flex-shrink-0" />,
      count: schoolCount,
    },
    {
      href: "/curator/providers",
      label: "Providers",
      icon: <MdHealthAndSafety className="text-lg flex-shrink-0" />,
      count: providerCount,
    },
    {
      href: "/curator/partners",
      label: "Partners",
      icon: <MdHandshake className="text-lg flex-shrink-0" />,
      count: partnerCount,
    },
    {
      href: "/curator/pages",
      label: "Pages",
      icon: <FiFileText className="text-lg flex-shrink-0" />,
    },
    // {
    //   label: "Create",
    //   icon: <FiPlus className="text-lg flex-shrink-0" />,
    //   onClick: () => {
    //     onCreateClick();
    //     setIsMobileSidebarOpen(false);
    //   },
    // },
  ];

  const NavItemContent = ({
    item,
    collapsed,
  }: {
    item: NavItem;
    collapsed: boolean;
  }) => {
    const active = item.href ? isActive(item.href) : false;

    const content = (
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
          active
            ? "bg-[#955aa4]/10 text-[#955aa4]"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
          collapsed && "justify-center px-0 w-10 h-10 mx-auto",
        )}
      >
        <span
          className={cn(
            "transition-colors duration-200",
            active
              ? "text-[#955aa4]"
              : "text-gray-500 group-hover:text-gray-700",
          )}
        >
          {item.icon}
        </span>

        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap overflow-hidden"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {!collapsed && item.count !== undefined && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={cn(
              "ml-auto text-xs font-semibold px-2 py-0.5 rounded-full min-w-[1.5rem] text-center",
              active
                ? "bg-[#955aa4]/20 text-[#955aa4]"
                : "bg-gray-200/80 text-gray-600",
            )}
          >
            {item.count}
          </motion.span>
        )}

        {/* Active indicator bar */}
        {active && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#955aa4] rounded-r-full"
            style={{ left: collapsed ? "-10px" : "-12px" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </div>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {item.href ? (
              <Link
                href={item.href}
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                {content}
              </Link>
            ) : (
              <button onClick={item.onClick} className="w-full">
                {content}
              </button>
            )}
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            <p>{item.label}</p>
            {item.count !== undefined && (
              <span className="text-xs opacity-70 ml-1">({item.count})</span>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    if (item.href) {
      return (
        <Link href={item.href} onClick={() => setIsMobileSidebarOpen(false)}>
          {content}
        </Link>
      );
    }

    return (
      <button onClick={item.onClick} className="w-full text-left">
        {content}
      </button>
    );
  };

  const SidebarContent = ({ collapsed }: { collapsed: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div
        className={cn(
          "flex items-center border-b border-gray-100 transition-all duration-300",
          collapsed ? "px-2 py-4 justify-center" : "px-5 py-5",
        )}
      >
        <AnimatePresence mode="wait">
          {collapsed ? (
            <motion.div
              key="collapsed-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                priority
                src="/logos/logo-purple-small.png"
                alt="JustGo Health"
                className="w-8 h-8 object-contain"
                width={32}
                height={32}
              />
            </motion.div>
          ) : (
            <motion.div
              key="expanded-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Image
                priority
                src="/logos/logo-black.png"
                alt="JustGo Health"
                className="bg-contain w-auto h-auto"
                width={160}
                height={36}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation section label */}
      <div className="flex-1 overflow-y-auto py-4">
        {!collapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-5 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400"
          >
            Navigation
          </motion.p>
        )}

        <nav className={cn("space-y-1", collapsed ? "px-2" : "px-3")}>
          {navItems.map((item) => (
            <NavItemContent
              key={item.label}
              item={item}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </div>

      {/* Bottom section: collapse toggle + logout */}
      <div className="border-t border-gray-100 p-2 space-y-1">
        {/* Notification Button - Desktop */}
        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "hidden md:flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200",
            collapsed && "justify-center px-0 w-10 h-10 mx-auto",
          )}
        >
          {isCollapsed ? (
            <LuChevronsRight className="text-lg flex-shrink-0" />
          ) : (
            <>
              <LuChevronsLeft className="text-lg flex-shrink-0" />
              <span className="whitespace-nowrap">Collapse</span>
            </>
          )}
        </button>

        {/* Notification Button - Desktop */}
        <NotificationSheet
          notifications={notifications}
          onClear={clearNotifications}
          onDismiss={dismissNotification}
          trigger={
            <button
              className={cn(
                "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-[#955aa4]/10 hover:text-[#955aa4] transition-all duration-200 group",
                collapsed && "justify-center px-0 w-10 h-10 mx-auto",
              )}
            >
              <FiBell className="text-lg flex-shrink-0 group-hover:text-[#955aa4] transition-colors" />
              {!collapsed && (
                <span className="group-hover:text-[#955aa4] transition-colors">
                  Notifications
                </span>
              )}
              {unreadCount > 0 && (
                <span
                  className={cn(
                    "flex items-center justify-center min-w-[1.5rem] h-5 rounded-full text-[10px] font-bold bg-[#e92229] text-white",
                    collapsed
                      ? "absolute top-1 right-1 w-4 h-4"
                      : "ml-auto px-1.5",
                  )}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          }
        />

        {/* Logout button */}
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogoutClick}
                className="flex items-center justify-center w-10 h-10 mx-auto rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
              >
                <FiLogOut className="text-lg flex-shrink-0" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              Logout
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            onClick={handleLogoutClick}
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2.5 h-auto text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <FiLogOut className="text-lg flex-shrink-0" />
            <span>Logout</span>
          </Button>
        )}
      </div>
    </div>
  );

  const {
    notifications,
    clearNotifications,
    dismissNotification,
    unreadCount,
  } = useNotification();

  return (
    <TooltipProvider>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 flex items-center justify-between px-4 z-50">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMobileSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        <Image
          priority
          src="/logos/logo-black.png"
          alt="JustGo Health"
          className="h-7 w-auto"
          width={120}
          height={28}
        />
        <div className="w-9">
          <NotificationSheet
            notifications={notifications}
            onClear={clearNotifications}
            onDismiss={dismissNotification}
          />
        </div>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:flex flex-col h-screen bg-white border-r border-gray-200/60 flex-shrink-0 overflow-hidden relative"
      >
        <SidebarContent collapsed={isCollapsed} />

        {/* Notification integrated into sidebar bottom or specific area if needed, 
            but for better UX, let's put it top-right of the sidebar or similar?
            Actually, the design often has notifications in the top bar. 
            Since we don't have a top bar in desktop layout (it's sidebar + content),
            we should probably add it to the sidebar actions.
        */}
      </motion.aside>

      {/* We need a place for the notification bell in Desktop. 
          Usually it's in a header. Since this app seems to have a sidebar-only layout,
          maybe we can add it to the bottom of the sidebar near logout, or create a mini-header in the main content area?
          
          Looking at the design, `SchoolsPage` had it in its own header.
          If we want it global, we should probably have a persistent top bar in the layout, OR add it to the sidebar.
          
          Let's add it to the sidebar for now as a "Notification" item or a standalone trigger.
      */}

      {/* Floating Notification Trigger for Desktop if not in sidebar list? 
          Or maybe just append it to the nav list? 
          Let's try appending it to the nav list or a separate action area.
      */}

      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        {/* Mobile FAB if needed, but we put it in header already */}
      </div>

      {/* Mobile Sidebar (drawer) */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden fixed top-14 left-0 bottom-0 w-72 bg-white border-r border-gray-200/60 shadow-2xl z-40 overflow-hidden"
          >
            <SidebarContent collapsed={false} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          onLogout();
          setShowLogoutModal(false);
        }}
        title="Logout Confirmation"
        message="Are you sure you want to log out?"
        confirmText="Yes, Logout"
        variant="danger"
      />
    </TooltipProvider>
  );
};
