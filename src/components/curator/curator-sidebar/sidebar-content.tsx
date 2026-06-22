"use client";

import Link from "next/link";
import Image from "next/image";
import { m, AnimatePresence } from "motion/react";
import { FiBell, FiLogOut } from "react-icons/fi";
import { LuChevronsLeft, LuChevronsRight } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { ROUTES } from "@/lib/constants/infra/routes";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { SidebarContentProps } from "@/lib/types/components/curator/curator-sidebar/sidebar";
import { SidebarNavItem } from "./sidebar-nav-item";
import { Route } from "next";

export const SidebarContent = ({
  collapsed,
  navItems,
  pathname,
  unreadCount,
  onToggleCollapse,
  onLogoutClick,
  onMobileClose,
  setIsOpen,
}: SidebarContentProps) => {
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <div className="flex h-full flex-col">
      {/* Logo area */}
      <div
        className={cn(
          "border-border flex items-center justify-between border-b transition-all duration-300",
          collapsed ? "justify-center px-2 py-4" : "px-4 py-4",
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
                className="h-8 w-8 object-contain"
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

        {!collapsed && <ThemeToggle className="h-8 w-8 rounded-md" />}
      </div>

      {/* Navigation section label */}
      <div className="flex-1 overflow-y-auto py-4">
        {!collapsed && (
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground/60 mb-2 px-5 text-[10px] font-semibold tracking-widest uppercase"
          >
            Navigation
          </m.p>
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
      <div className="border-border space-y-1 border-t p-2">
        {/* Notification Menu Item */}
        <div className="mt-2 pt-2">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={cn(
              "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              collapsed
                ? "text-muted-foreground hover:bg-muted mx-auto h-10 w-10 justify-center px-0"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">
              <FiBell className="shrink-0 text-lg" />
            </span>

            <AnimatePresence mode="wait">
              {!collapsed && (
                <m.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  Notifications
                </m.span>
              )}
            </AnimatePresence>

            {/* Unread Badge */}
            {!collapsed && unreadCount > 0 && (
              <m.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-success ml-auto flex h-5 min-w-6 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </m.span>
            )}

            {/* Collapsed Badge */}
            {collapsed && unreadCount > 0 && (
              <span className="bg-destructive absolute top-1 right-1 h-3 w-3 rounded-full border-2 border-white" />
            )}
          </button>
        </div>

        {/* Collapse toggle — desktop only */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className={cn(
            "text-muted-foreground hover:bg-accent hover:text-foreground hidden w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 md:flex",
            collapsed && "mx-auto h-10 w-10 justify-center px-0",
          )}
        >
          {collapsed ? (
            <LuChevronsRight className="shrink-0 text-lg" />
          ) : (
            <>
              <LuChevronsLeft className="shrink-0 text-lg" />
              <span className="whitespace-nowrap">Collapse</span>
            </>
          )}
        </button>

        {/* Logout button */}
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onLogoutClick}
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive mx-auto flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200"
              >
                <FiLogOut className="shrink-0 text-lg" />
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
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-auto w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200"
          >
            <FiLogOut className="shrink-0 text-lg" />
            <span>Logout</span>
          </Button>
        )}
      </div>
    </div>
  );
};
