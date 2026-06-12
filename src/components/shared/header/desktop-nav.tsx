"use client";

import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useDesktopNav } from "@/hooks/components/shared/use-desktop-nav";
import { m } from "motion/react";
import Link from "next/link";

export const DesktopNav = () => {
  const { pathname, hoveredIndex, setHoveredIndex } = useDesktopNav();
  return (
    <nav className="mx-auto hidden items-center lg:flex">
      <ul
        className="flex items-center gap-8"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {NAV_ITEMS.map((item, index) => {
          const isActive = pathname === item.path;
          const isHovered = hoveredIndex === index;

          return (
            <li
              key={item.name}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
            >
              {/* Hover Pill Effect */}
              {isHovered && (
                <m.div
                  layoutId="hover-pill"
                  className="bg-muted-foreground/10 absolute -inset-x-4 -inset-y-1 -z-10 rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}

              {/* The Active Dot (Above) */}
              {isActive && (
                <m.div
                  layoutId="nav-dot"
                  className="absolute -top-3 right-0 left-0 mx-auto h-1.5 w-1.5 rounded-full bg-green-600"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}

              <Link
                href={item.path}
                className={cn(
                  "relative z-10 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-green-700"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.name}
              </Link>

              {/* The Active Underline (Below) */}
              {isActive && (
                <m.div
                  layoutId="nav-underline"
                  className="absolute right-0 -bottom-1 left-0 h-0.5 rounded-full bg-green-600"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
