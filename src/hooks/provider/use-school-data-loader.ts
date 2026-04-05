"use client";

import { useCallback, useRef } from "react";
import { toast } from "@/components/ui/sonner";
import { processBatch } from "@/lib/school-api-utils";
import { School } from "@/lib/types/school";
import { SchoolWithExtras as SchoolWithExtrasAtom } from "@/atoms/provider-schools";
import { BATCH_SIZE } from "@/lib/constants/provider-schools";

export function useSchoolDataLoader(
  getProfileQuery: any,
  updateSchoolInState: (id: number | string, data: Partial<SchoolWithExtrasAtom>) => void,
  setSchoolsState: any,
  schoolsState: any,
  fetchSchoolData: (school: School, isBackground?: boolean) => Promise<SchoolWithExtrasAtom>,
) {
  const previousSchoolsRef = useRef<Map<number, SchoolWithExtrasAtom>>(new Map());
  const isInitialLoadRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadSchoolsWithData = useCallback(
    async (isBackground = false) => {
      if (!getProfileQuery.data) return;

      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      if (!isBackground) {
        setSchoolsState((prev: any) => ({ ...prev, isLoading: true }));
      }

      const providerSchools = getProfileQuery.data.schools || [];
      const schoolsArray = Array.isArray(providerSchools)
        ? providerSchools
        : [];
      const currentSchoolIds = new Set(
        schoolsArray.map((s: School) => Number(s.id)),
      );

      // Check for removed/added schools
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
        // Initialize state with basic school data if empty (to show cards immediately)
        if (schoolsState.schools.length === 0) {
          setSchoolsState((prev: any) => ({
            ...prev,
            schools: schoolsArray.map((s) => ({ ...s }) as SchoolWithExtrasAtom),
          }));
        }

        // Process schools in batches with incremental updates
        const schoolsWithData = await processBatch(
          schoolsArray,
          BATCH_SIZE,
          async (school: School, index: number) => {
            const schoolData = await fetchSchoolData(school, isBackground);

            // Update cache map immediately
            previousSchoolsRef.current.set(Number(school.id), schoolData);

            // Update individual school in state for real-time card updates
            updateSchoolInState(school.id, schoolData);

            return schoolData;
          },
        );

        // Final update with complete data in backend order
        setSchoolsState((prev: any) => ({ ...prev, schools: schoolsWithData }));
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Error loading schools:", error);
        toast.error("Failed to load some school data");
      } finally {
        if (!isBackground) {
          setSchoolsState((prev: any) => ({ ...prev, isLoading: false }));
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

  return { loadSchoolsWithData, previousSchoolsRef, isInitialLoadRef, abortControllerRef };
}