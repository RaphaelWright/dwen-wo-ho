"use client";

import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { processBatch } from "@/lib/utils/shared/batch";
import { School } from "@/lib/types/entities/school";
import { SchoolWithExtras as SchoolWithExtrasAtom } from "@/atoms/provider-schools";
import { BATCH_SIZE } from "@/lib/constants/components/provider/schools/schools";
import type { ProfileQueryHandle } from "@/lib/types/api/auth";

type ProviderSchoolsState = {
  schools: SchoolWithExtrasAtom[];
  lastUpdated: number | null;
  isLoading: boolean;
};

export function useSchoolDataLoader(
  getProfileQuery: ProfileQueryHandle,
  updateSchoolInState: (
    id: number | string,
    data: Partial<SchoolWithExtrasAtom>,
  ) => void,
  setSchoolsState: (
    update: (prev: ProviderSchoolsState) => ProviderSchoolsState,
  ) => void,
  schoolsState: ProviderSchoolsState,
  fetchSchoolData: (
    school: School,
    isBackground?: boolean,
  ) => Promise<SchoolWithExtrasAtom>,
) {
  const previousSchoolsRef = useRef<Map<number, SchoolWithExtrasAtom>>(null!);
  if (!previousSchoolsRef.current) {
    previousSchoolsRef.current = new Map();
  }
  const isInitialLoadRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadSchoolsWithData = useCallback(
    async (isBackground = false) => {
      if (!getProfileQuery.data) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      if (!isBackground) {
        setSchoolsState((prev) => ({ ...prev, isLoading: true }));
      }

      const providerSchools = getProfileQuery.data.schools || [];
      const schoolsArray = Array.isArray(providerSchools)
        ? (providerSchools as School[])
        : [];
      const currentSchoolIds = new Set(
        schoolsArray.map((s: School) => Number(s.id)),
      );

      if (
        !isInitialLoadRef.current &&
        isBackground &&
        previousSchoolsRef.current.size > 0
      ) {
        previousSchoolsRef.current.forEach((prevSchool, id) => {
          if (!currentSchoolIds.has(id)) {
            toast.error(`${prevSchool.name} is no longer available`);
          }
        });

        schoolsArray.forEach((newSchool: School) => {
          if (!previousSchoolsRef.current.has(Number(newSchool.id))) {
            toast.success(`New school added: ${newSchool.name}`);
          }
        });
      }

      try {
        if (schoolsState.schools.length === 0) {
          setSchoolsState((prev) => ({
            ...prev,
            schools: schoolsArray.map(
              (s) => ({ ...s }) as SchoolWithExtrasAtom,
            ),
          }));
        }

        const schoolsWithData = await processBatch(
          schoolsArray,
          BATCH_SIZE,
          async (school: School) => {
            const schoolData = await fetchSchoolData(school, isBackground);

            previousSchoolsRef.current.set(Number(school.id), schoolData);
            updateSchoolInState(school.id, schoolData);

            return schoolData;
          },
        );

        setSchoolsState((prev) => ({ ...prev, schools: schoolsWithData }));
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Error loading schools:", error);
        toast.error("Failed to load some school data");
      } finally {
        if (!isBackground) {
          setSchoolsState((prev) => ({ ...prev, isLoading: false }));
        }
        isInitialLoadRef.current = false;
      }
    },
    [
      getProfileQuery.data,
      fetchSchoolData,
      schoolsState.schools.length,
      setSchoolsState,
      updateSchoolInState,
    ],
  );

  return {
    loadSchoolsWithData,
    previousSchoolsRef,
    isInitialLoadRef,
    abortControllerRef,
  };
}
