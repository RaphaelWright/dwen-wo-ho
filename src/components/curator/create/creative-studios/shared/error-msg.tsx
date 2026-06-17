"use client";

import { FieldError } from "@/components/ui/field";
import type { CreativeStudiosErrorMsgProps } from "@/lib/types/components/curator/create/creative-studios";

export function ErrorMsg({ msg }: CreativeStudiosErrorMsgProps) {
  if (!msg) return null;

  return (
    <FieldError className="cs-fade-in mt-1.5 text-[11px] font-medium">
      {msg}
    </FieldError>
  );
}
