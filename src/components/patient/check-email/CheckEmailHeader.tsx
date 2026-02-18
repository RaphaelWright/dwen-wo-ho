import { Logo } from "@/components/shared/Logo";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { CHECK_EMAIL_TEXTS } from "@/lib/constants/components/patient/check-email";

export function CheckEmailHeader() {
  return (
    <div className="absolute flex top-4 md:top-8 items-center px-4 md:px-8 justify-between w-full">
      <Logo variant="black" />
      <Link
        href={ROUTES.provider.checkEmail}
        className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl bg-muted text-destructive rounded-full px-3 md:px-4 py-1 md:py-2"
      >
        {CHECK_EMAIL_TEXTS.header.switchText}
      </Link>
    </div>
  );
}
