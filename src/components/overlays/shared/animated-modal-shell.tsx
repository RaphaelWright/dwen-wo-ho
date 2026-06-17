"use client";

import { AnimatePresence, m } from "motion/react";
import { AnimatedModalShellProps } from "@/lib/types/components/shared/overlays";
import { cn } from "@/lib/utils";

const DEFAULT_PANEL_CLASS =
  "bg-card text-foreground border-border mx-auto flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border shadow-2xl";

const DEFAULT_BACKDROP_CLASS =
  "bg-background/80 fixed inset-0 z-50 backdrop-blur-3xl";

export function AnimatedModalShell({
  isOpen,
  onClose,
  children,
  panelClassName,
  backdropClassName,
}: AnimatedModalShellProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={backdropClassName ?? DEFAULT_BACKDROP_CLASS}
            onClick={onClose}
          />
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={cn(DEFAULT_PANEL_CLASS, panelClassName)}>
              {children}
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
