"use client";

import { EmojiStatusField } from "@/components/provider/workspace/edit-field/emoji-status-field/index";
import type { EditFieldStatusFieldProps } from "@/lib/types/components/provider/edit-field";

export function EditFieldStatusField({
  value,
  onChange,
  onKeyDown,
}: EditFieldStatusFieldProps) {
  return (
    <EmojiStatusField value={value} onChange={onChange} onKeyDown={onKeyDown} />
  );
}
