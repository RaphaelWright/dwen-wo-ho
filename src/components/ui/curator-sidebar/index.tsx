"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { SidebarProps } from "@/lib/types/components/curator/sidebar";
import { SidebarContent } from "./sidebar-content";
import { MobileHeader } from "./mobile-header";
import { useCuratorSidebar } from "@/hooks/curator/useCuratorSidebar";
import {
  SIDEBAR_EXPANDED_WIDTH,
  SIDEBAR_COLLAPSED_WIDTH,
} from "@/lib/constants/components/curator/sidebar";

export const CuratorSidebar = (props: SidebarProps) => {
  const {
    isCollapsed,
    setIsCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    showLogoutModal,
    setShowLogoutModal,
    theme,
    mounted,
    unreadCount,
    navItems,
    handleLogoutClick,
    pathname,
    setIsOpen,
  } = useCuratorSidebar(props);

  const { onLogout } = props;

  const sidebarContentProps = {
    navItems,
    pathname,
    mounted,
    unreadCount,
    setIsOpen: setIsOpen,
    onToggleCollapse: () => setIsCollapsed(!isCollapsed),
    onLogoutClick: handleLogoutClick,
    onMobileClose: () => setIsMobileSidebarOpen(false),
  };

  return (
    <TooltipProvider>
      {/* Mobile Header */}
      <MobileHeader
        isOpen={isMobileSidebarOpen}
        onToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        theme={theme}
        mounted={mounted}
        unreadCount={unreadCount}
        setIsOpen={setIsOpen}
      />

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
        className="hidden md:flex flex-col h-screen bg-card border-r border-border/60 shrink-0 overflow-hidden relative"
      >
        <SidebarContent {...sidebarContentProps} collapsed={isCollapsed} />
      </motion.aside>

      {/* Mobile Sidebar (drawer) */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden fixed top-14 left-0 bottom-0 w-72 bg-card border-r border-border/60 shadow-2xl z-40 overflow-hidden"
          >
            <SidebarContent {...sidebarContentProps} collapsed={false} />
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
