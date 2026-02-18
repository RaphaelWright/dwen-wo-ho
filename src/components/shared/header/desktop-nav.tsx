"use client";

import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useDesktopNav } from "@/hooks/components/shared/use-desktop-nav";
import { motion } from "framer-motion";
import Link from "next/link";

export const DesktopNav = () => {
  const { pathname, hoveredIndex, setHoveredIndex } = useDesktopNav();
  return (
    <nav className="hidden lg:flex items-center mx-auto">
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
                <motion.div
                  layoutId="hover-pill"
                  className="absolute -inset-x-4 -inset-y-1 bg-gray-100 rounded-full -z-10"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}

              {/* The Active Dot (Above) */}
              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute -top-3 left-0 right-0 mx-auto w-1.5 h-1.5 rounded-full bg-green-600"
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
                  "text-sm font-medium transition-colors py-2 relative z-10",
                  isActive
                    ? "text-green-700"
                    : "text-gray-600 hover:text-black",
                )}
              >
                {item.name}
              </Link>

              {/* The Active Underline (Below) */}
              {isActive && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-600 rounded-full"
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
