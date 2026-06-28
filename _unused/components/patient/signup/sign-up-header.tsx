import { Logo } from "@/components/shared/logo";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/patient/auth-copy";

export function SignUpHeader() {
  return (
    <div className="flex w-full items-center justify-between px-8">
      <Logo />
      <p className="font-bold">
        {SIGN_UP_TEXTS.header.for}{" "}
        <span className="text-4xl">{SIGN_UP_TEXTS.header.patient}</span>
      </p>
    </div>
  );
}
