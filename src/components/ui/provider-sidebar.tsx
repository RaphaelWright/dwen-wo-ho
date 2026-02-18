"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { FiLogOut, FiArrowRight, FiMenu, FiUser } from "react-icons/fi";
import { MdSchool } from "react-icons/md";
import { cn } from "@/lib/utils";
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
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Header with Hamburger Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4 z-50 shadow-sm">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="text-primary p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
        >
          <FiMenu size={24} />
        </button>
        <h1 className="text-primary font-bold text-lg">JustGo Health</h1>
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
          "w-64 bg-sidebar border-r border-sidebar-border",
          "flex flex-col h-screen shadow-lg z-40",
          "fixed md:static",
          "transition-transform duration-300 ease-in-out",
          isMobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="p-4 lg:p-6 border-b border-sidebar-border">
          <div className="transform hover:scale-105 transition-transform duration-300 justify-center flex">
            <Logo variant="black" withLink={false} />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6">
          <nav className="space-y-3">
            <Link
              href="/provider/schools"
              onClick={() => setIsMobileSidebarOpen(false)}
              className={cn(
                "block px-4 py-3 font-bold transition-all duration-200 rounded-lg",
                isActive("/provider/schools") || isActive("/provider/home")
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MdSchool className="text-xl" />
                  <span className="text-lg">Schools</span>
                </div>
                <span
                  className={cn(
                    "text-sm px-2 py-1 rounded-full",
                    isActive("/provider/schools") || isActive("/provider/home")
                      ? "bg-white/20 text-white"
                      : "bg-sidebar-accent text-sidebar-foreground",
                  )}
                >
                  {schoolCount}
                </span>
              </div>
            </Link>
            <Link
              href="/provider/profile"
              onClick={() => setIsMobileSidebarOpen(false)}
              className={cn(
                "block px-4 py-3 font-bold transition-all duration-200 rounded-lg",
                isActive("/provider/profile")
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary",
              )}
            >
              <div className="flex items-center gap-3">
                <FiUser className="text-xl" />
                <span className="text-lg">Profile</span>
              </div>
            </Link>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            onClick={handleLogoutClick}
            variant="ghost"
            className="w-full bg-transparent hover:bg-sidebar-accent text-sidebar-foreground font-bold py-3 rounded-lg transition-all duration-200"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <FiLogOut className="text-xl text-sidebar-foreground" />
                <span className="text-lg text-sidebar-foreground">Logout</span>
              </div>
              <FiArrowRight className="w-4 h-4 text-sidebar-foreground" />
            </div>
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
