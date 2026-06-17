"use client";

import { Check, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProviderClinicalToggleProps } from "@/lib/types/components/curator/create/creative-studios";

export function ProviderClinicalToggle({
  checked,
  onChange,
}: ProviderClinicalToggleProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "group border-primary/10 bg-muted hover:border-primary/25 hover:bg-primary/5 relative flex h-12 w-full items-center justify-center gap-0 overflow-hidden rounded-full border-2 p-0 transition-[border-color,background-color] duration-1000 ease-in-out",
        checked &&
          "border-green-400 bg-green-50 hover:border-green-500/70 hover:bg-green-100",
      )}
    >
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        <span
          className={cn(
            "absolute top-0 left-[-35%] h-full w-[30%] bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:animate-[cs-toggle-shimmer_1000ms_ease-in-out_1]",
            checked && "via-white/15",
          )}
        />
      </span>
      <span
        className={cn(
          "absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12),0_0_2px_rgba(0,0,0,0.06)] transition-[left,background-color,box-shadow] duration-1000 ease-in-out group-hover:shadow-[0_6px_14px_rgba(0,0,0,0.16),0_0_4px_rgba(0,0,0,0.08)]",
          checked ? "left-[calc(100%-2.75rem)] bg-green-500" : "left-1",
        )}
      >
        {checked ? <Check className="size-4 text-white" /> : null}
      </span>
      <span
        className={cn(
          "flex w-full items-center justify-center gap-2 text-sm font-medium transition-colors duration-1000 ease-in-out",
          checked ? "text-green-700" : "text-muted-foreground",
        )}
      >
        <Stethoscope className="size-4" />
        Clinical {checked ? "On" : "Off"}
      </span>
    </Button>
  );
}
