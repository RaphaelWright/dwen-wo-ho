"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { FiLogOut, FiArrowRight, FiMenu, FiUser } from "react-icons/fi";
import { LuChevronsLeft, LuChevronsRight } from "react-icons/lu";
import { MdSchool } from "react-icons/md";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

interface ProviderSidebarProps {
  schoolCount: number;
  onLogout: () => void;
}

export const ProviderSidebar = ({
  schoolCount,
  onLogout,
}: ProviderSidebarProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsMobileSidebarOpen(false);
  };

  // Auto-collapse sidebar on non-main pages
  useEffect(() => {
    const mainPages: string[] = [
      ROUTES.provider.home,
      ROUTES.provider.profile,
      ROUTES.provider.schools,
    ];

    if (!mainPages.includes(pathname)) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [pathname]);

  const onToggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {/* Mobile Header with Hamburger Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4 z-50 shadow-sm">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="text-sidebar-primary p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
        >
          <FiMenu size={24} />
        </button>
        <h1 className="text-sidebar-primary font-bold text-lg">
          JustGo Health
        </h1>
        <div className="w-10" /> {/* Spacer for center alignment */}
      </div>

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* White Sidebar */}
      <div
        className={cn(
          "bg-sidebar border-r border-sidebar-border",
          "flex flex-col h-screen shadow-lg z-40",
          "fixed md:static",
          "transition-all duration-300 ease-in-out",
          isMobileSidebarOpen
            ? "translate-x-0 w-64"
            : cn(
                "-translate-x-full md:translate-x-0",
                isCollapsed ? "w-20" : "w-64",
              ),
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "border-b border-sidebar-border transition-all duration-300",
            isCollapsed ? "p-4 justify-center" : "p-4 lg:p-6",
          )}
        >
          <div
            className={cn(
              "transform hover:scale-105 transition-transform duration-300 flex",
              isCollapsed ? "justify-center" : "justify-center",
            )}
          >
            {isCollapsed ? (
              <Link href={ROUTES.provider.home}>
                <Image
                  priority
                  src="/favicons/apple-touch-icon.png"
                  alt="JustGo Health"
                  className="w-8 h-8 object-contain"
                  width={32}
                  height={32}
                />
              </Link>
            ) : (
              <Logo
                variant="black"
                withLink={true}
                href={ROUTES.provider.home}
              />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div
          className={cn(
            "flex-1 py-6 overflow-y-auto",
            isCollapsed ? "px-2" : "px-4",
          )}
        >
          <nav className="space-y-3">
            <Link
              href={ROUTES.provider.home}
              onClick={() => setIsMobileSidebarOpen(false)}
              className={cn(
                "flex items-center transition-all duration-200 rounded-lg",
                isCollapsed
                  ? "justify-center p-3"
                  : "justify-between px-4 py-3",
                isActive(ROUTES.provider.home) || isActive(ROUTES.provider.home)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md font-bold"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary font-medium",
              )}
              title={isCollapsed ? "Schools" : undefined}
            >
              <div className="flex items-center gap-3">
                <MdSchool className="text-xl shrink-0" />
                {!isCollapsed && <span className="text-lg">Schools</span>}
              </div>
              {!isCollapsed && (
                <span
                  className={cn(
                    "text-sm px-2 py-1 rounded-full",
                    isActive(ROUTES.provider.home) ||
                      isActive(ROUTES.provider.home)
                      ? "bg-white/20 text-white"
                      : "bg-sidebar-accent text-sidebar-foreground",
                  )}
                >
                  {schoolCount}
                </span>
              )}
            </Link>
            <Link
              href={ROUTES.provider.profile}
              onClick={() => setIsMobileSidebarOpen(false)}
              className={cn(
                "flex items-center transition-all duration-200 rounded-lg",
                isCollapsed ? "justify-center p-3" : "px-4 py-3",
                isActive(ROUTES.provider.profile)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md font-bold"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary font-medium",
              )}
              title={isCollapsed ? "Profile" : undefined}
            >
              <div className="flex items-center gap-3">
                <FiUser className="text-xl shrink-0" />
                {!isCollapsed && <span className="text-lg">Profile</span>}
              </div>
            </Link>
          </nav>
        </div>

        {/* Bottom Section: Collapse toggle + Logout */}
        <div className="border-t border-sidebar-border p-2 space-y-1">
          {/* Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className={cn(
              "hidden md:flex items-center w-full rounded-lg py-2.5 transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent",
              isCollapsed
                ? "justify-center px-0 w-10 h-10 mx-auto"
                : "px-3 gap-3",
            )}
            title={isCollapsed ? "Expand" : undefined}
          >
            {isCollapsed ? (
              <LuChevronsRight className="text-xl shrink-0" />
            ) : (
              <>
                <LuChevronsLeft className="text-xl shrink-0" />
                <span className="font-medium">Collapse</span>
              </>
            )}
          </button>

          {/* Logout */}
          <Button
            onClick={handleLogoutClick}
            variant="ghost"
            title={isCollapsed ? "Logout" : undefined}
            className={cn(
              "w-full bg-transparent hover:bg-sidebar-accent text-sidebar-foreground transition-all duration-200",
              isCollapsed
                ? "justify-center p-0 w-10 h-10 mx-auto"
                : "justify-between px-3 py-3",
            )}
          >
            <div
              className={cn(
                "flex items-center",
                isCollapsed ? "justify-center" : "gap-3",
              )}
            >
              <FiLogOut className="text-xl shrink-0" />
              {!isCollapsed && <span className="font-medium">Logout</span>}
            </div>
            {!isCollapsed && <FiArrowRight className="w-4 h-4 shrink-0" />}
          </Button>
        </div>
      </div>

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
    </>
  );
};
