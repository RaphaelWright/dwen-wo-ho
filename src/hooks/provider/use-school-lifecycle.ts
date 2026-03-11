"use client";

import { useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { clearAllCaches } from "@/lib/school-api-utils";
import { School } from "@/lib/types/school";
import { SchoolWithExtras as SchoolWithExtrasAtom } from "@/atoms/provider-schools";
import { POLL_INTERVAL } from "@/lib/constants/provider-schools";

export function useSchoolLifecycle(
  getProfileQuery: any,
  loadSchoolsWithData: () => Promise<void>,
  previousSchoolsRef: React.RefObject<Map<number, SchoolWithExtrasAtom>>,
  isInitialLoadRef: React.RefObject<boolean>,
  abortControllerRef: React.RefObject<AbortController | null>,
) {
  // Listen for profile changes
  useEffect(() => {
    if (!getProfileQuery.data || isInitialLoadRef.current) return;

    const currentSchools = getProfileQuery.data.schools || [];
    const currentSchoolIds = new Set(
      (Array.isArray(currentSchools) ? currentSchools : []).map((s: School) =>
        Number(s.id),
      ),
    );
    const cachedSchoolIds = new Set(
      Array.from(previousSchoolsRef.current.keys()),
    );

    cachedSchoolIds.forEach((cachedId) => {
      if (!currentSchoolIds.has(cachedId)) {
        const removedSchool = previousSchoolsRef.current.get(cachedId);
        if (removedSchool) {
          toast.error(`${removedSchool.name} is no longer available`);
        }
      }
    });

    currentSchoolIds.forEach((currentId) => {
      if (!cachedSchoolIds.has(currentId)) {
        const newSchool = (
          Array.isArray(currentSchools) ? currentSchools : []
        ).find((s: School) => Number(s.id) === currentId);
        if (newSchool) {
          toast.success(`New school added: ${newSchool.name}`);
        }
      }
    });
  }, [getProfileQuery.data]);

  // Initial load
  useEffect(() => {
    if (!getProfileQuery.data) return;

    loadSchoolsWithData();
  }, [getProfileQuery.data, loadSchoolsWithData]);

  // Background polling with debouncing
  useEffect(() => {
    if (!getProfileQuery.data) return;

    const lastPollRef = { current: 0 };

    const interval = setInterval(() => {
      const now = Date.now();

      if (now - lastPollRef.current >= POLL_INTERVAL) {
        lastPollRef.current = now;
        loadSchoolsWithData();
      }
    }, POLL_INTERVAL);

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [getProfileQuery.data, loadSchoolsWithData, abortControllerRef]);

  // Clear caches on unmount
  useEffect(() => {
    return () => {
      clearAllCaches();
    };
  }, []);

  return {};
}
