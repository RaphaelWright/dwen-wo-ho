import { Logo } from "@/components/shared/Logo";
import { SIGNUP_VERIFY_TEXTS } from "@/lib/constants/components/patient/signup-verify";

export function VerifyHeader() {
  return (
    <div className="flex items-center px-8 justify-between w-full">
      <Logo />
      <p className="font-bold">
        {SIGNUP_VERIFY_TEXTS.header.for}{" "}
        <span className="text-4xl">{SIGNUP_VERIFY_TEXTS.header.patient}</span>
      </p>
    </div>
  );
}
