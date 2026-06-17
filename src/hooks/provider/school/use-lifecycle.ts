"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { School } from "@/lib/types/entities/school";
import { SchoolWithExtras as SchoolWithExtrasAtom } from "@/atoms/provider-schools";
import { POLL_INTERVAL } from "@/lib/constants/components/provider/schools/schools";
import type { ProfileQueryHandle } from "@/lib/types/api/auth";

export function useSchoolLifecycle(
  getProfileQuery: ProfileQueryHandle,
  loadSchoolsWithData: (isBackground?: boolean) => Promise<void>,
  previousSchoolsRef: React.RefObject<Map<number, SchoolWithExtrasAtom>>,
  isInitialLoadRef: React.RefObject<boolean>,
  abortControllerRef: React.RefObject<AbortController | null>,
) {
  useEffect(() => {
    if (!getProfileQuery.data || isInitialLoadRef.current) return;

    const currentSchools = getProfileQuery.data.schools || [];
    const currentSchoolIds = new Set(
      (Array.isArray(currentSchools) ? currentSchools : []).map((s: School) =>
        Number(s.id),
      ),
    );
    const cachedSchoolIds = new Set(
      Array.from(previousSchoolsRef.current?.keys() ?? []),
    );

    cachedSchoolIds.forEach((cachedId) => {
      if (!currentSchoolIds.has(cachedId)) {
        const removedSchool = previousSchoolsRef.current?.get(cachedId);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs are stable containers
  }, [getProfileQuery.data]);

  useEffect(() => {
    if (!getProfileQuery.data) return;

    loadSchoolsWithData();
  }, [getProfileQuery.data, loadSchoolsWithData]);

  useEffect(() => {
    if (!getProfileQuery.data) return;

    const lastPollRef = { current: 0 };

    const interval = setInterval(() => {
      const now = Date.now();

      if (now - lastPollRef.current >= POLL_INTERVAL) {
        lastPollRef.current = now;
        loadSchoolsWithData(true);
      }
    }, POLL_INTERVAL);

    const controller = abortControllerRef.current;

    return () => {
      clearInterval(interval);
      controller?.abort();
    };
  }, [getProfileQuery.data, loadSchoolsWithData, abortControllerRef]);

  return {};
}
