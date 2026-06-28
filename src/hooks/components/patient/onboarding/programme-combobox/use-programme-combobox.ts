"use client";

import { useMemo } from "react";
import { ONBOARDING_PROGRAMME_SEED } from "@/lib/constants/components/patient/onboarding";
import type { ProgrammeComboboxItem } from "@/lib/types/components/patient/onboarding";

function toComboboxItem(name: string): ProgrammeComboboxItem {
  return { value: name, label: name };
}

export function useProgrammeCombobox(selectedProgramme: string) {
  const items = useMemo(
    () => ONBOARDING_PROGRAMME_SEED.map(toComboboxItem),
    [],
  );

  const selectedItem = useMemo(() => {
    if (!selectedProgramme.trim()) {
      return null;
    }

    return items.find((item) => item.value === selectedProgramme) ?? null;
  }, [items, selectedProgramme]);

  return {
    items,
    selectedItem,
  };
}
