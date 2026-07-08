import Link from "next/link";
import type { Route } from "next";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LANDING_2_CONTENT } from "@/lib/marketing/landing-2";

export function Landing2Nav() {
  const { navigation, links } = LANDING_2_CONTENT;

  return (
    <nav
      className="border-border/80 bg-background/92 sticky top-0 z-50 border-b backdrop-blur-md"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo
          withLink
          href={links.home as Route}
          variant="auto"
          className="max-w-[132px] sm:max-w-[168px]"
        />

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            className="text-muted-foreground hover:text-foreground hidden text-sm font-semibold transition-colors sm:inline-flex"
            href={links.pledge as Route}
          >
            {navigation.pledgeLabel}
          </Link>
          <Link
            className="border-primary/25 text-primary hover:bg-primary/8 inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm font-bold transition-colors"
            href={links.providers as Route}
          >
            {navigation.providersLabel}
          </Link>
          <ThemeToggle className="shrink-0" />
        </div>
      </div>
    </nav>
  );
}
