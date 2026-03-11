"use client";

import { useCallback } from "react";
import { useAtom } from "jotai";
import { providerSchoolsAtom, SchoolWithExtras } from "@/atoms/provider-schools";

export function useSchoolsState() {
  const [schoolsState, setSchoolsState] = useAtom(providerSchoolsAtom);
  const { schools: cachedSchools, isLoading: atomLoading } = schoolsState;

  const updateSchoolInState = useCallback(
    (id: number | string, data: Partial<SchoolWithExtras>) => {
      setSchoolsState((prev) => ({
        ...prev,
        schools: prev.schools.map((s) => (s.id === id ? { ...s, ...data } : s)),
      }));
    },
    [setSchoolsState],
  );

  return {
    cachedSchools,
    atomLoading,
    updateSchoolInState,
    setSchoolsState,
  };
}