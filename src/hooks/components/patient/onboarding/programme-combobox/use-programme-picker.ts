"use client";

import { useMemo } from "react";
import { ONBOARDING_PROGRAMMES } from "@/lib/constants/components/patient/onboarding";

export function useProgrammePicker(searchQuery: string) {
  const programmes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return ONBOARDING_PROGRAMMES;
    }

    return ONBOARDING_PROGRAMMES.filter((programme) => {
      if (programme.name.toLowerCase().includes(query)) {
        return true;
      }
      return programme.tags.some((tag) => tag.toLowerCase().includes(query));
    });
  }, [searchQuery]);

  return { programmes };
}
