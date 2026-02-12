"use client";

import { Logo } from "@/components/shared/Logo";

export function VerifyPasswordResetHeader() {
  return (
    <div className="flex items-center px-8 justify-between w-full">
      <Logo />
      <p className="font-bold">
        for <span className="text-4xl">Patients</span>
      </p>
    </div>
  );
}
