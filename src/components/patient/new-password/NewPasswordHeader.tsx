import { Logo } from "@/components/shared/Logo";
import { NEW_PASSWORD_TEXTS } from "@/lib/constants/components/patient/new-password";

export function NewPasswordHeader() {
  return (
    <div className="flex items-center px-8 justify-between w-full">
      <Logo />
      <p className="font-bold">
        {NEW_PASSWORD_TEXTS.header.for}{" "}
        <span className="text-4xl">{NEW_PASSWORD_TEXTS.header.patient}</span>
      </p>
    </div>
  );
}
