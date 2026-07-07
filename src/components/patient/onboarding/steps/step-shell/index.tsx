"use client";

import type { StepShellProps } from "@/lib/types/components/patient/onboarding";
import { cn } from "@/lib/utils";

export function StepShell({
  title,
  subtitle,
  centered = false,
  className,
  children,
}: StepShellProps) {
  return (
    <div
      className={cn("screen", centered && "centered screen-vcenter", className)}
    >
      <h1 className="screen-title">{title}</h1>
      {subtitle ? (
        <p className={centered ? "sub" : "screen-sub"}>{subtitle}</p>
      ) : null}
      {children}
    </div>
  );
}
