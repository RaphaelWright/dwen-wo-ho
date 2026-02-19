"use client";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { CHECK_EMAIL_TEXTS } from "@/lib/constants/components/patient/check-email";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function CheckEmailHeader() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex justify-between items-center">
      <Logo variant={mounted && theme === "light" ? "black" : "white"} />
      <Button variant={"link"}>
        <Link
          href={ROUTES.provider.checkEmail}
          className="text-sm sm:text-base md:text-lg font-medium transition-all duration-300 group"
        >
          {CHECK_EMAIL_TEXTS.header.switchText}
        </Link>
      </Button>
    </div>
  );
}
