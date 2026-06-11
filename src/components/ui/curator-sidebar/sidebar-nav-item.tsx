"use client";

import Link from "next/link";
import { m, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarNavItemProps } from "@/lib/types/components/curator/sidebar";

export const SidebarNavItem = ({
  item,
  collapsed,
  isActive,
  onMobileClose,
}: SidebarNavItemProps) => {
  const content = (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        collapsed && "justify-center px-0 w-10 h-10 mx-auto",
      )}
    >
      <span
        className={cn(
          "transition-colors duration-200",
          isActive
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      >
        {item.icon}
      </span>

      <AnimatePresence mode="wait">
        {!collapsed && (
          <m.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="whitespace-nowrap overflow-hidden"
          >
            {item.label}
          </m.span>
        )}
      </AnimatePresence>

      {!collapsed && item.count !== undefined && (
        <m.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={cn(
            "ml-auto flex shrink-0 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold",
            isActive
              ? "bg-primary text-primary-foreground"
              : "bg-muted-foreground/10 text-muted-foreground"
          )}
        >
          {item.count}
        </m.span>
      )}

      {/* Active indicator bar */}
      {isActive && (
        <m.div
          layoutId="activeIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 bg-primary rounded-r-full"
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
            <Link href={item.href} onClick={onMobileClose}>
              {content}
            </Link>
          ) : (
            <button type="button" onClick={item.onClick} className="w-full">
              {content}
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          <p>{item.label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  if (item.href) {
    return (
      <Link href={item.href} onClick={onMobileClose}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={item.onClick}
      className="w-full text-left"
    >
      {content}
    </button>
  );
};
