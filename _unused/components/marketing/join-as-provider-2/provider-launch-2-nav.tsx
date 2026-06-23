"use client";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { PROVIDER_LAUNCH_2_CONTENT } from "@/_unused/lib/marketing/for-providers-2";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ProviderLaunch2Nav() {
  const router = useRouter();
  const { navigation, links } = PROVIDER_LAUNCH_2_CONTENT;

  return (
    <nav
      className="fixed top-0 right-0 left-0 z-50 backdrop-blur-xs"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex h-14 items-center justify-between px-7 max-[880px]:flex-wrap max-[880px]:gap-3 max-[480px]:px-4 sm:h-16">
        <div className="pl2-nav-item shrink-0" id="navLogo">
          <Logo
            withLink
            href={links.home as Route}
            variant="white"
            className="w-32 sm:w-36"
          />
        </div>

        <Link
          className="pl2-nav-item text-primary-foreground/85 hover:text-primary-foreground text-[17px] font-bold no-underline transition-colors duration-200 max-[880px]:text-sm max-[480px]:text-xs"
          href={links.providers as Route}
          id="navLink"
          aria-current="page"
        >
          {navigation.currentLabel}
        </Link>

        <Button
          className="pl2-nav-item rounded-full"
          id="navCta"
          type="button"
          aria-label="Get started with JustGo Health"
          onClick={() => router.push(links.primaryCta)}
        >
          {navigation.primaryCta}
        </Button>
      </div>
    </nav>
  );
}
