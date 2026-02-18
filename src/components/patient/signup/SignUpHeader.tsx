import { Logo } from "@/components/shared/Logo";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/patient/signup";

export function SignUpHeader() {
  return (
    <div className="flex items-center px-8 justify-between w-full">
      <Logo />
      <p className="font-bold">
        {SIGN_UP_TEXTS.header.for}{" "}
        <span className="text-4xl">{SIGN_UP_TEXTS.header.patient}</span>
      </p>
    </div>
  );
}
