"use client";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { CHECK_EMAIL_TEXTS } from "@/lib/constants/components/patient/check-email";
import { useTheme } from "next-themes";
import { useHydrated } from "@/hooks/use-hydrated";
import { ArrowRight } from "lucide-react";

export function CheckEmailHeader() {
  const { theme } = useTheme();
  const mounted = useHydrated();

  return (
    <div className="flex justify-between items-center">
      <Logo variant={mounted && theme === "light" ? "black" : "white"} />
      <Link
        href={ROUTES.provider.checkEmail}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 group"
      >
        {CHECK_EMAIL_TEXTS.header.switchText}
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
