"use client";
import { Logo } from "@/components/shared/logo";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/infra/routes";
import { CHECK_EMAIL_TEXTS } from "@/lib/constants/components/patient/auth-copy";
import { useTheme } from "next-themes";
import { useHydrated } from "@/hooks/shared/use-hydrated";
import { ArrowRight } from "lucide-react";

export function CheckEmailHeader() {
  const { theme } = useTheme();
  const mounted = useHydrated();

  return (
    <div className="flex items-center justify-between">
      <Logo variant={mounted && theme === "light" ? "black" : "white"} />
      <Link
        href={ROUTES.provider.checkEmail}
        className="text-muted-foreground hover:text-primary group inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200"
      >
        {CHECK_EMAIL_TEXTS.header.switchText}
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
