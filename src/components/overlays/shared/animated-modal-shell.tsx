"use client";

import { AnimatePresence, m } from "motion/react";
import { ModalPortal } from "@/components/shared/overlays/modal-portal";
import { AnimatedModalShellProps } from "@/lib/types/components/shared/overlays";
import { cn } from "@/lib/utils";
import {
  OVERLAY_BACKDROP_TRANSITION,
  OVERLAY_PANEL_ANIMATE,
  OVERLAY_PANEL_EXIT,
  OVERLAY_PANEL_INITIAL,
  OVERLAY_PANEL_TRANSITION,
} from "@/lib/utils/shared/overlay-motion";

export function AnimatedModalShell({
  isOpen,
  onClose,
  children,
  panelClassName,
  backdropClassName,
  contentClassName,
}: AnimatedModalShellProps) {
  return (
    <ModalPortal>
      <AnimatePresence>
        {isOpen ? (
          <m.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={OVERLAY_BACKDROP_TRANSITION}
            className={cn(
              "z-modal-stack fixed inset-0 flex items-center justify-center bg-black/50 p-3 sm:p-4",
              backdropClassName,
            )}
            onClick={onClose}
          >
            <m.div
              initial={OVERLAY_PANEL_INITIAL}
              animate={OVERLAY_PANEL_ANIMATE}
              exit={OVERLAY_PANEL_EXIT}
              transition={OVERLAY_PANEL_TRANSITION}
              className={cn("relative w-full max-w-xl", contentClassName)}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className={cn(
                  "bg-card text-foreground border-border flex w-full flex-col overflow-hidden rounded-2xl border shadow-2xl",
                  panelClassName,
                )}
              >
                {children}
              </div>
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </ModalPortal>
  );
}
