"use client";

import { NAV_ITEMS } from "@/lib/constants";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { AlignRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ui/theme-toggle";

const Header = ({ className, logo }: { className?: string; logo?: string }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { scrollY } = useScroll();

  const isFloating = isScrolled && !isOpen;

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50 && !isScrolled) setIsScrolled(true);
    else if (latest <= 50 && isScrolled) setIsScrolled(false);
  });

  const router = useRouter();
  const handleGetStarted = () => {
    if (pathname === "/for-providers") router.push(ROUTES.provider.auth);
    else router.push(ROUTES.patient.checkEmail);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <motion.header
          layout
          ref={navRef}
          transition={{
            layout: { duration: 0.8, ease: [0.32, 0.72, 0, 1] },
          }}
          className={cn(
            "pointer-events-auto relative z-50 overflow-hidden",
            "bg-background/90 backdrop-blur-md border border-border",
            isFloating
              ? "mt-2 sm:w-[80%] max-w-7xl rounded-full shadow-md mx-auto"
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
                <Link href="/">
                  <Image
                    src={logo || "/logos/logo-black.png"}
                    alt="Logo"
                    width={160}
                    height={50}
                    className="w-36 h-auto object-contain"
                  />
                </Link>
              </div>

              {/* Desktop Nav */}
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

              {/* Right Actions */}
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Button
                  onClick={() => setIsOpen(!isOpen)}
                  className="lg:hidden p-2"
                >
                  {isOpen ? <X size={24} /> : <AlignRight size={24} />}
                </Button>
                <Button
                  onClick={handleGetStarted}
                  className="hidden lg:flex rounded-full h-9 px-5"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="lg:hidden bg-white border-t border-gray-100"
              >
                <ul className="flex flex-col p-6 gap-4">
                  {NAV_ITEMS.map((item) => (
                    <li
                      key={item.name}
                      className="border-b border-gray-50 pb-2"
                    >
                      <Link
                        href={item.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "font-medium",
                          pathname === item.path
                            ? "text-green-700"
                            : "text-gray-900",
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      </div>

      <div className="h-16" />
    </>
  );
};

export default Header;
