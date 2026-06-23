"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LOCK_IN_2_CONTENT } from "@/_unused/lib/marketing/landing-2";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";

export function LockIn2Nav() {
  const { navigation, links } = LOCK_IN_2_CONTENT;

  return (
    <nav
      className="border-border bg-background/90 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto grid h-14 max-w-[1920px] grid-cols-3 items-center px-7 max-[480px]:px-4 sm:h-16">
        <div className="flex min-w-0 items-center justify-start">
          <Link
            className="li2-nav-item group text-foreground inline-flex min-w-0 flex-col items-center gap-1 text-[17px] font-bold no-underline max-[480px]:text-sm"
            href={links.pledge as Route}
            id="navPledge"
          >
            <span className="truncate">{navigation.pledgeLabel}</span>
            <span
              className="bg-foreground h-[3px] w-full rounded-sm"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <div className="li2-nav-item shrink-0" id="navLogo">
            <Logo withLink href={links.home as Route} variant="auto" />
          </div>
        </div>

        <div className="li2-nav-item flex min-w-0 items-center justify-end gap-1.5">
          <Link
            className="border-primary hover:bg-primary/10 flex shrink-0 items-center justify-center gap-1 rounded-full border-2 px-4 py-2 font-bold whitespace-nowrap no-underline transition-colors"
            href={links.providers as Route}
            id="navProviders"
          >
            {navigation.providersLabel} <ArrowUpRight className="size-4" />
          </Link>
          <ThemeToggle className="shrink-0" />
        </div>
      </div>
    </nav>
  );
}
