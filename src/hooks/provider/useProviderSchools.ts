"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import useUserQuery from "@/hooks/queries/useUserQuery";
import { useAtom } from "jotai";
import {
  providerSchoolsAtom,
  SchoolWithExtras,
} from "@/atoms/provider-schools";
import { toast } from "sonner";
import {
  processBatch,
  getSchoolLockInCount,
  getLatestPatientResult,
  checkForNewPatients,
  clearAllCaches,
} from "@/lib/schoolsApiUtils";
import { School } from "@/lib/types/school";
import { FilterType } from "@/lib/types/provider/schools";
import {
  BATCH_SIZE,
  POLL_INTERVAL,
  REFETCH_INTERVAL,
} from "@/lib/constants/provider-schools";

export function useProviderSchools() {
  const { getProfileQuery } = useUserQuery({
    refetchInterval: REFETCH_INTERVAL,
  });

  const [schoolsState, setSchoolsState] = useAtom(providerSchoolsAtom);
  const { schools: cachedSchools, isLoading: atomLoading } = schoolsState;

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
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
        // Check for new patients only during background updates
        let forceRefresh = false;
        if (!isInitialLoadRef.current && isBackground) {
          const prevSchool = previousSchoolsRef.current.get(Number(school.id));

          if (prevSchool?.newPatientName) {
            const newPatientCheck = await checkForNewPatients(
              school.id,
              prevSchool.newPatientName,
            );

            if (newPatientCheck?.hasNew && newPatientCheck.latestPatient) {
              toast.success(
                `New patient: ${newPatientCheck.latestPatient.patientName} at ${school.name}`,
              );
              forceRefresh = true; // Force cache refresh to get updated counts
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
    [],
  );

  // Load schools with incremental updates and batching
  const loadSchoolsWithData = useCallback(
    async (isBackground = false) => {
      if (!getProfileQuery.data) return;

      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      if (!isBackground) {
        setSchoolsState((prev) => ({ ...prev, isLoading: true }));
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
          setSchoolsState((prev) => ({
            ...prev,
            schools: schoolsArray.map((s) => ({ ...s }) as SchoolWithExtras),
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
      cachedSchools,
      setSchoolsState,
      updateSchoolInState,
      schoolsState.schools.length,
    ],
  );

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

    const hasCache = cachedSchools.length > 0;

    // If we have cache, show it immediately and refresh in background
    if (hasCache) {
      loadSchoolsWithData(true);
    } else {
      loadSchoolsWithData(false);
    }
  }, [getProfileQuery.data]);

  // Background polling with debouncing
  useEffect(() => {
    if (!getProfileQuery.data) return;

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
  }, [getProfileQuery.data, loadSchoolsWithData]);

  // Clear caches on unmount
  useEffect(() => {
    return () => {
      clearAllCaches();
    };
  }, []);

  const schoolsList = useMemo(() => {
    let filtered =
      activeFilter === "all"
        ? cachedSchools
        : cachedSchools.filter((school) => school.type === activeFilter);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((school) => {
        const nameMatch = school.name?.toLowerCase().includes(query);
        const nicknameMatch = school.nickname?.toLowerCase().includes(query);
        const typeMatch = school.type?.toLowerCase().includes(query);
        const campusesMatch = school.campuses?.some((campus: string) =>
          campus.toLowerCase().includes(query),
        );
        return nameMatch || nicknameMatch || typeMatch || campusesMatch;
      });
    }

    return filtered;
  }, [cachedSchools, activeFilter, searchQuery]);

  return {
    schoolsList,
    cachedSchools,
    atomLoading,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isLoadingProfile: getProfileQuery.isLoading,
  };
}
