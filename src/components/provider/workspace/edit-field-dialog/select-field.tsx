"use client";

import { SearchableSelectField } from "@/components/provider/workspace/edit-field/searchable-select-field/index";
import type { EditFieldSelectFieldProps } from "@/lib/types/components/provider/edit-field";

export function EditFieldSelectField({
  fieldKey,
  value,
  onChange,
  label,
  items,
}: EditFieldSelectFieldProps) {
  return (
    <SearchableSelectField
      key={fieldKey}
      value={value}
      onChange={onChange}
      label={label}
      items={items}
    />
  );
}
