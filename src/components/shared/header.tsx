"use client";

import { m } from "motion/react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { DesktopNav } from "./header/desktop-nav";
import { HeaderActions } from "./header/header-actions";
import { MobileNav } from "./header/mobile-nav";
import { useHeader } from "@/hooks/components/shared/use-header";
import { useTheme } from "next-themes";
import { useHydrated } from "@/hooks/use-hydrated";

const Header = ({ className }: { className?: string }) => {
  const { isOpen, setIsOpen, navRef, isFloating } = useHeader();
  const { theme } = useTheme();
  const mounted = useHydrated();
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <m.header
          layout
          ref={navRef}
          transition={{
            layout: { duration: 0.8, ease: [0.32, 0.72, 0, 1] },
          }}
          className={cn(
            "pointer-events-auto relative z-50 overflow-hidden",
            "bg-background/90 backdrop-blur-md border border-border dark:border-border/30",
            isFloating
              ? "mt-2 w-[95%] sm:w-[80%] max-w-7xl rounded-full shadow-md mx-auto"
              : "mt-0 w-full max-w-full rounded-none shadow-sm",
            className,
          )}
        >
          <div className="px-6">
            <div
              className={cn(
                "flex items-center justify-between h-16",
                isFloating && "h-14.5",
              )}
            >
              {/* Logo */}
              <div className="shrink-0">
                <Logo
                  withLink
                  className="w-36"
                  variant={mounted && theme === "light" ? "black" : "white"}
                />
              </div>

              {/* Desktop Nav */}
              <DesktopNav />

              {/* Right Actions */}
              <HeaderActions isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
          </div>

          {/* Mobile Menu */}
          <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} />
        </m.header>
      </div>

      <div className="h-16" />
    </>
  );
};

export default Header;
