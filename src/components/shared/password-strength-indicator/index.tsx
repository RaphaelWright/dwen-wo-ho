"use client";

import { m } from "motion/react";
import { CircleCheck, CircleX } from "lucide-react";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import {
  PasswordRequirements,
  PasswordStrengthIndicatorProps,
} from "@/lib/types/auth/password-strength";
import { evaluatePasswordStrength } from "@/lib/utils/shared/password-strength";
import { cn } from "@/lib/utils";

const REQUIREMENT_KEYS: (keyof PasswordRequirements)[] = [
  "length",
  "lowercase",
  "uppercase",
  "number",
  "special",
];

const STRENGTH_LABELS = {
  Weak: SIGN_UP_TEXTS.createAccount.passwordStrength.weak,
  Moderate: SIGN_UP_TEXTS.createAccount.passwordStrength.moderate,
  Strong: SIGN_UP_TEXTS.createAccount.passwordStrength.strong,
  VeryStrong: SIGN_UP_TEXTS.createAccount.passwordStrength.veryStrong,
} as const;

const PasswordStrengthIndicator = ({
  password,
}: PasswordStrengthIndicatorProps) => {
  if (!password) return null;

  const { score, label, tone, requirements } =
    evaluatePasswordStrength(password);

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
        <m.div
          className={cn(
            "h-full rounded-full transition-colors duration-700",
            tone === "destructive" && "bg-destructive",
            tone === "warning" && "bg-warning",
            tone === "successLight" && "bg-success/50",
            tone === "success" && "bg-success",
          )}
          initial={false}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
      <p
        className={cn(
          "text-sm font-medium",
          tone === "destructive" && "text-destructive",
          tone === "warning" && "text-warning",
          tone === "successLight" && "text-success/80",
          tone === "success" && "text-success",
        )}
      >
        {SIGN_UP_TEXTS.createAccount.passwordStrength.label}:{" "}
        {STRENGTH_LABELS[label]}
      </p>
      <div className="flex flex-col gap-1.5">
        {REQUIREMENT_KEYS.map((key) => {
          const met = requirements[key];

          return (
            <p
              key={key}
              className={cn(
                "flex items-center gap-1.5 text-sm",
                met ? "text-success" : "text-muted-foreground",
              )}
            >
              {met ? (
                <CircleCheck className="size-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <CircleX className="size-3.5 shrink-0" aria-hidden="true" />
              )}
              {SIGN_UP_TEXTS.createAccount.passwordStrength.requirements[key]}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
