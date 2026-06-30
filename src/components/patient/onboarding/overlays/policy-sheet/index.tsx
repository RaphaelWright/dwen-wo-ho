"use client";

import { useCallback, useRef } from "react";
import { X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  ONBOARDING_COPY,
  ONBOARDING_POLICY_CANADA_SECTIONS,
  ONBOARDING_POLICY_TERMS_SECTIONS,
} from "@/lib/constants/components/patient/onboarding";
import type { PolicySheetProps } from "@/lib/types/components/patient/onboarding";

export function PolicySheet({ open, onOpenChange, variant }: PolicySheetProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const node = contentRef.current;
    if (!node) {
      return;
    }
    const scrolled = (scrollRef.current?.scrollTop ?? 0) > 24;
    node.dataset.expanded = scrolled ? "true" : "false";
  }, []);

  const copy =
    variant === "canada-us"
      ? ONBOARDING_COPY.policySheets.canadaUs
      : ONBOARDING_COPY.policySheets.terms;

  const sections =
    variant === "canada-us"
      ? ONBOARDING_POLICY_CANADA_SECTIONS
      : ONBOARDING_POLICY_TERMS_SECTIONS;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        ref={contentRef}
        data-expanded="false"
        className="bg-background text-foreground data-[expanded=false]:max-h-[88vh] data-[expanded=true]:h-dvh data-[expanded=true]:max-h-dvh data-[expanded=true]:rounded-none"
      >
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-6 pt-10 pb-28"
          >
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.12em] uppercase">
              {copy.eyebrow}
            </p>
            <DrawerTitle className="font-heading text-foreground mt-2 text-2xl font-semibold">
              {copy.title}
            </DrawerTitle>
            <p className="text-muted-foreground mt-2 text-sm">
              {copy.scrollHint}
            </p>

            <div className="mt-8 flex flex-col gap-6">
              {sections.map((section) => (
                <section key={section.title}>
                  <h3 className="text-foreground text-base font-semibold">
                    {section.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
          </div>

          <div className="from-background via-background/90 pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t to-transparent px-6 pt-12 pb-6">
            <DrawerClose
              type="button"
              className="border-border bg-card text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive pointer-events-auto flex size-12 items-center justify-center rounded-full border shadow-lg transition-colors"
              aria-label={ONBOARDING_COPY.policySheets.closeLabel}
            >
              <X className="size-6" aria-hidden="true" />
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
