"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { School } from "@/types/school";

export function useLockInSchools() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadSchools = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api(ENDPOINTS.schools);
      if (response?.success && response.data) {
        const schoolsList = Array.isArray(response.data) ? response.data : [];
        setSchools(schoolsList);
      }
    } catch (error) {
      console.error("Failed to load schools:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchools();
  }, [loadSchools]);

  const filteredSchools = useMemo(() => {
    if (!searchQuery.trim()) {
      return schools;
    }

    const query = searchQuery.toLowerCase().trim();
    return schools.filter((school) => {
      const nameMatch = school.name?.toLowerCase().includes(query);
      const nicknameMatch = school.nickname?.toLowerCase().includes(query);
      const typeMatch = school.type?.toLowerCase().includes(query);
      const campusesMatch = school.campuses?.some((campus: string) =>
        campus.toLowerCase().includes(query),
      );
      return nameMatch || nicknameMatch || typeMatch || campusesMatch;
    });
  }, [schools, searchQuery]);

  const handleSchoolSelect = useCallback(
    (schoolId: number | string) => {
      router.push(`/patient/lock-in/${schoolId}`);
    },
    [router],
  );

  return {
    schools,
    isLoading,
    searchQuery,
    setSearchQuery,
    filteredSchools,
    handleSchoolSelect,
  };
}
