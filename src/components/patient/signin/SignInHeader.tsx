import { Logo } from "@/components/shared/Logo";
import { SIGN_IN_TEXTS } from "@/lib/constants/components/patient/signin";

export function SignInHeader() {
  return (
    <div className="flex items-center px-8 justify-between w-full">
      <Logo />
      <p className="font-bold text-3xl">
        <span className="text-sm font-normal">{SIGN_IN_TEXTS.header.for} </span>
        {SIGN_IN_TEXTS.header.patient}
      </p>
    </div>
  );
}
