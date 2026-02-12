"use client";

import { Logo } from "@/components/shared/Logo";

export function SignInHeader() {
  return (
    <div className="flex items-center px-8 justify-between w-full">
      <Logo />
      <p className="font-bold text-3xl">
        <span className="text-sm font-normal">for </span>
        Patients
      </p>
    </div>
  );
}
