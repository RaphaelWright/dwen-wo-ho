"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiLogOut } from "react-icons/fi";
import { LuChevronsLeft, LuChevronsRight } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import { ROUTES } from "@/lib/constants/routes";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { SidebarContentProps } from "@/lib/types/components/curator/sidebar";
import { SidebarNavItem } from "./sidebar-nav-item";
import { Route } from "next";

export const SidebarContent = ({
  collapsed,
  navItems,
  pathname,
  theme,
  mounted,
  unreadCount,
  onToggleCollapse,
  onLogoutClick,
  onMobileClose,
  setIsOpen,
}: SidebarContentProps) => {
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div
        className={cn(
          "flex items-center justify-between border-b border-border transition-all duration-300",
          collapsed ? "px-2 py-4 justify-center" : "px-4 py-4",
        )}
      >
        <div
          className={cn(
            "flex items-center",
            collapsed ? "justify-center" : "justify-start",
          )}
        >
          {collapsed ? (
            <Link href={ROUTES.curator.dashboard as Route}>
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
              variant="auto"
              href={ROUTES.curator.dashboard}
              className="w-32"
            />
          )}
        </div>

        {!collapsed && <ThemeToggle className="rounded-md h-8 w-8" />}
      </div>

      {/* Navigation section label */}
      <div className="flex-1 overflow-y-auto py-4">
        {!collapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-5 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60"
          >
            Navigation
          </motion.p>
        )}

        <nav className={cn("space-y-1", collapsed ? "px-2" : "px-3")}>
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.label}
              item={item}
              collapsed={collapsed}
              isActive={item.href ? isActive(item.href) : false}
              onMobileClose={onMobileClose}
            />
          ))}
        </nav>
      </div>

      {/* Bottom section: collapse toggle + logout */}
      <div className="border-t border-border p-2 space-y-1">
        {/* Notification Menu Item */}
        <div className="pt-2 mt-2">
          <button
            onClick={() => setIsOpen(true)}
            className={cn(
              "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
              collapsed
                ? "justify-center px-0 w-10 h-10 mx-auto text-muted-foreground hover:bg-muted"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">
              <FiBell className="text-lg shrink-0" />
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
                  Notifications
                </motion.span>
              )}
            </AnimatePresence>

            {/* Unread Badge */}
            {!collapsed && unreadCount > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="ml-auto flex items-center justify-center min-w-6 h-5 rounded-full text-[10px] font-bold bg-success text-white px-1.5"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </motion.span>
            )}

            {/* Collapsed Badge */}
            {collapsed && unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-destructive border-2 border-white" />
            )}
          </button>
        </div>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={onToggleCollapse}
          className={cn(
            "hidden md:flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200",
            collapsed && "justify-center px-0 w-10 h-10 mx-auto",
          )}
        >
          {collapsed ? (
            <LuChevronsRight className="text-lg shrink-0" />
          ) : (
            <>
              <LuChevronsLeft className="text-lg shrink-0" />
              <span className="whitespace-nowrap">Collapse</span>
            </>
          )}
        </button>

        {/* Logout button */}
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={onLogoutClick}
                className="flex items-center justify-center w-10 h-10 mx-auto rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
              >
                <FiLogOut className="text-lg shrink-0" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              Logout
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            onClick={onLogoutClick}
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2.5 h-auto text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          >
            <FiLogOut className="text-lg shrink-0" />
            <span>Logout</span>
          </Button>
        )}
      </div>
    </div>
  );
};
