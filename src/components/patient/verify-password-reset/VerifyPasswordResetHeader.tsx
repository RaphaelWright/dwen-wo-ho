import { Logo } from "@/components/shared/Logo";
import { VERIFY_PASSWORD_RESET_TEXTS } from "@/lib/constants/components/patient/verify-password-reset";

export function VerifyPasswordResetHeader() {
  return (
    <div className="flex items-center px-8 justify-between w-full">
      <Logo />
      <p className="font-bold">
        {VERIFY_PASSWORD_RESET_TEXTS.header.for}{" "}
        <span className="text-4xl">
          {VERIFY_PASSWORD_RESET_TEXTS.header.patient}
        </span>
      </p>
    </div>
  );
}
