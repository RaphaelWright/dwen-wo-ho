"use client";

import { NAV_ITEMS } from "@/lib/constants/infra/app";
import { cn } from "@/lib/utils";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const MobileNav = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const pathname = usePathname();
  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="border-t border-gray-100 bg-white lg:hidden"
        >
          <ul className="flex flex-col gap-4 p-6">
            {NAV_ITEMS.map((item) => (
              <li key={item.name} className="border-b border-gray-50 pb-2">
                <Link
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "font-medium",
                    pathname === item.path ? "text-green-700" : "text-gray-900",
                  )}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </m.div>
      )}
    </AnimatePresence>
  );
};
