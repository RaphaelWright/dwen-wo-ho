"use client";

import { CircleCheck, CircleX } from "lucide-react";
import { PasswordMatchIndicatorProps } from "@/lib/types/auth/password-strength";
import { cn } from "@/lib/utils";

const PasswordMatchIndicator = ({
  password,
  confirmPassword,
  matchLabel,
  mismatchLabel,
}: PasswordMatchIndicatorProps) => {
  if (!confirmPassword) return null;

  const isMatch = password === confirmPassword;

  return (
    <p
      className={cn(
        "animate-in fade-in slide-in-from-top-1 mt-2 flex items-center gap-1.5 text-sm duration-200",
        isMatch ? "text-success" : "text-destructive",
      )}
    >
      {isMatch ? (
        <CircleCheck className="size-3.5 shrink-0" aria-hidden="true" />
      ) : (
        <CircleX className="size-3.5 shrink-0" aria-hidden="true" />
      )}
      {isMatch ? matchLabel : mismatchLabel}
    </p>
  );
};

export default PasswordMatchIndicator;
