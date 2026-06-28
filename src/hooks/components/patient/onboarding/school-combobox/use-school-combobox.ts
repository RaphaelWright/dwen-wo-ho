"use client";

import { useMemo } from "react";
import useSchoolsQuery from "@/hooks/queries/use-schools";
import type {
  SchoolComboboxItem,
  SchoolType,
} from "@/lib/types/components/patient/onboarding";
import { filterSchoolsByType } from "@/lib/utils/patient/filter-schools-by-type";

function toComboboxItem(school: {
  id: number | string;
  name: string;
  logo?: string;
  type?: string;
}): SchoolComboboxItem {
  return {
    value: String(school.id),
    label: school.name,
    logo: school.logo,
    type: school.type,
  };
}

export function useSchoolCombobox(
  schoolType: SchoolType,
  selectedSchoolId: string,
) {
  const { useSchools } = useSchoolsQuery();
  const { data: schools = [], isLoading } = useSchools();

  const items = useMemo(() => {
    return filterSchoolsByType(schools, schoolType).map(toComboboxItem);
  }, [schoolType, schools]);

  const selectedItem = useMemo(() => {
    if (!selectedSchoolId) {
      return null;
    }

    return items.find((item) => item.value === selectedSchoolId) ?? null;
  }, [items, selectedSchoolId]);

  return {
    items,
    selectedItem,
    isLoading,
  };
}
