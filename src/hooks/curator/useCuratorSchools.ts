"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { School } from "@/lib/types/school";
import { useSchoolsWithRefetch } from "@/hooks/queries/useSchoolsQuery";
import { useAtom } from "jotai";
import { curatorSchoolsAtom, SchoolWithExtras } from "@/atoms/curator-schools";
import { useNotification } from "@/hooks/useNotification";
import {
  processBatch,
  getSchoolLockInCount,
  getLatestPatientResult,
  clearAllCaches,
} from "@/lib/schoolsApiUtils";
import { useQueryClient } from "@tanstack/react-query";

export type FilterType = "all" | "JHS" | "SHS" | "COLLEGE";

export const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "JHS", value: "JHS" },
  { label: "SHS", value: "SHS" },
  { label: "COLLEGE", value: "COLLEGE" },
];

// Configuration
const BATCH_SIZE = 5;
const POLL_INTERVAL = 10000; // 10 seconds

export function getFirstCampus(campuses: string[] | null | undefined): string {
  if (campuses && Array.isArray(campuses) && campuses.length > 0) {
    return campuses[0];
  }
  return "";
}

export function useCuratorSchools() {
  const [schoolsState, setSchoolsState] = useAtom(curatorSchoolsAtom);
  const { schools: cachedSchools, isLoading: atomLoading } = schoolsState;

  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { addNotification } = useNotification();
  const {
    data: allSchools = [],
    isLoading: schoolsLoading,
    isError,
    refetch: refetchSchools,
    forceRefetch,
  } = useSchoolsWithRefetch();

  const previousSchoolsRef = useRef<Map<number, SchoolWithExtras>>(new Map());
  const isInitialLoadRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastPollRef = useRef<number>(0);

  // Helper to update a single school in state
  const updateSchoolInState = useCallback(
    (id: number | string, data: Partial<SchoolWithExtras>) => {
      setSchoolsState((prev) => ({
        ...prev,
        schools: prev.schools.map((s) => (s.id === id ? { ...s, ...data } : s)),
      }));
    },
    [setSchoolsState],
  );

  // Fetch data for a single school with optimized API calls
  const fetchSchoolData = useCallback(
    async (
      school: School,
      isBackground: boolean = false,
    ): Promise<SchoolWithExtras> => {
      const schoolData: SchoolWithExtras = { ...school, isLoading: true };

      try {
        // Check for new patients first during background updates
        let forceRefresh = false;
        if (!isInitialLoadRef.current && isBackground) {
          const prevSchool = previousSchoolsRef.current.get(Number(school.id));

          if (prevSchool?.newPatientName) {
            // Check for new patients using the API
            const latestCheck = await getLatestPatientResult(school.id, true); // Skip cache

            if (
              latestCheck &&
              latestCheck.patientName !== prevSchool.newPatientName
            ) {
              addNotification(
                "success",
                `New patient: ${latestCheck.patientName} at ${school.name}`,
                `/curator/schools/${school.id}/patients`, // Add link to patient page
              );
              forceRefresh = true; // Force cache refresh to get updated counts

              // Invalidate React Query cache and refetch all schools from backend
              await queryClient.invalidateQueries({ queryKey: ["schools"] });
              await forceRefetch();
            }
          }
        }

        // Parallel fetch of lock-in count and latest patient (skip cache if new patient detected)
        const [studentCount, latestPatient] = await Promise.all([
          forceRefresh
            ? getSchoolLockInCount(school.id, true) // Force fresh data
            : getSchoolLockInCount(school.id),
          forceRefresh
            ? getLatestPatientResult(school.id, true) // Force fresh data
            : getLatestPatientResult(school.id),
        ]);

        schoolData.studentCount = studentCount;

        if (latestPatient) {
          schoolData.latestLockInDate = latestPatient.createdAt;
          schoolData.newPatientName = latestPatient.patientName;
        }
      } catch (error) {
        console.error(`Error fetching data for school ${school.id}:`, error);
      }

      schoolData.isLoading = false;
      return schoolData;
    },
    [queryClient, refetchSchools, addNotification, forceRefetch],
  );

  // Load schools with incremental updates and batching
  const loadSchoolsWithData = useCallback(
    async (isBackground = false) => {
      if (allSchools.length === 0) return;

      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      if (!isBackground) {
        setSchoolsState((prev) => ({ ...prev, isLoading: true }));
      }

      const currentSchoolIds = new Set(
        allSchools.map((s: School) => Number(s.id)),
      );

      // Check for removed/added schools
      if (
        !isInitialLoadRef.current &&
        isBackground &&
        previousSchoolsRef.current.size > 0
      ) {
        previousSchoolsRef.current.forEach((prevSchool, id) => {
          if (!currentSchoolIds.has(id)) {
            addNotification(
              "error",
              `School removed: ${prevSchool.name} is no longer available`,
            );
          }
        });

        allSchools.forEach((newSchool: School) => {
          if (!previousSchoolsRef.current.has(Number(newSchool.id))) {
            addNotification(
              "success",
              `New school added: ${newSchool.name}`,
              `/curator/schools/${newSchool.id}`, // Add link to school page
            );
          }
        });
      }

      try {
        // Initialize state with basic school data if empty (to show cards immediately)
        if (schoolsState.schools.length === 0) {
          setSchoolsState((prev) => ({
            ...prev,
            schools: allSchools.map((s) => ({ ...s }) as SchoolWithExtras),
          }));
        }

        // Process schools in batches with incremental updates
        const enrichedSchools = await processBatch(
          allSchools,
          BATCH_SIZE,
          async (school: School) => {
            const schoolData = await fetchSchoolData(school, isBackground);

            // Update cache map immediately
            previousSchoolsRef.current.set(Number(school.id), schoolData);

            // Update individual school in state for real-time card updates
            updateSchoolInState(school.id, schoolData);

            return schoolData;
          },
        );

        // Final update with complete data in backend order
        setSchoolsState((prev) => ({ ...prev, schools: enrichedSchools }));
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Error loading schools:", error);
        addNotification("error", "Failed to load some school data");
      } finally {
        if (!isBackground) {
          setSchoolsState((prev) => ({ ...prev, isLoading: false }));
        }
        isInitialLoadRef.current = false;
      }
    },
    [
      allSchools,
      fetchSchoolData,
      addNotification,
      updateSchoolInState,
      setSchoolsState,
      schoolsState.schools.length,
    ],
  );

  // Initial load
  useEffect(() => {
    if (allSchools.length === 0) return;

    const hasCache = cachedSchools.length > 0;

    if (hasCache) {
      loadSchoolsWithData(true);
    } else {
      loadSchoolsWithData(false);
    }
  }, [allSchools]);

  // Background polling for general data updates
  useEffect(() => {
    if (allSchools.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();

      if (now - lastPollRef.current >= POLL_INTERVAL) {
        lastPollRef.current = now;
        loadSchoolsWithData(true);
      }
    }, POLL_INTERVAL);

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [allSchools.length, loadSchoolsWithData]);

  // Clear caches on unmount
  useEffect(() => {
    return () => {
      clearAllCaches();
    };
  }, []);

  // Use cached schools when available
  const mergedSchools = useMemo(() => {
    if (allSchools.length === 0) return [];
    if (cachedSchools.length > 0) {
      return cachedSchools;
    }
    return allSchools as SchoolWithExtras[];
  }, [allSchools, cachedSchools]);

  const schoolsList = useMemo(() => {
    let filtered =
      activeFilter === "all"
        ? mergedSchools
        : mergedSchools.filter((school) => school.type === activeFilter);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((school) => {
        const nameMatch = school.name?.toLowerCase().includes(query);
        const nicknameMatch = school.nickname?.toLowerCase().includes(query);
        const typeMatch = school.type?.toLowerCase().includes(query);
        const campusesMatch = school.campuses?.some((campus) =>
          String(campus).toLowerCase().includes(query),
        );
        return nameMatch || nicknameMatch || typeMatch || campusesMatch;
      });
    }

    return filtered;
  }, [mergedSchools, activeFilter, searchQuery]);

  return {
    schoolsList,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isLoading: schoolsLoading || atomLoading,
    hasCachedData: cachedSchools.length > 0,
    isError,
  };
}
