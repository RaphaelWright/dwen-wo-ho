"use client";

import { Input } from "@/components/ui/input";
import type { EditFieldTextFieldProps } from "@/lib/types/components/provider/edit-field";

export function EditFieldTextField({
  value,
  onChange,
  onKeyDown,
}: EditFieldTextFieldProps) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      className="focus:ring-primary/20 mb-2 focus:ring-1"
      placeholder="Enter value…"
      autoFocus
    />
  );
}
