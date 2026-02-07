"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { MdSchool } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import WidthConstraint from "@/components/ui/width-constraint";
import { School } from "@/types/school";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useSchools } from "@/hooks/queries/useSchoolsQuery";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSchools, setLoading, updateSchool } from "@/store/slices/curatorSchoolsSlice";
import {
  processBatch,
  getSchoolLockInCount,
  getLatestPatientResult,
  clearAllCaches,
  patientResultsCache,
} from "@/lib/schoolsApiUtils";

type FilterType = "all" | "JHS" | "SHS" | "NMTC" | "University";

interface SchoolWithExtras extends School {
  studentCount?: number;
  newPatientName?: string;
  latestLockInDate?: string;
  providerCount?: number;
  newProviderName?: string;
  latestProviderDate?: string;
  isLoading?: boolean;
}

interface PatientResult {
  id: number;
  patientName: string;
  createdAt: string;
  visibilityStatus: string;
}

interface ProviderResult {
  id: string;
  fullName: string;
  email: string;
  createdAt?: string;
  addedAt?: string;
}

interface LockInData {
  schoolName: string;
  students: Array<{
    studentName: string;
    lockinScore: number;
    lockedInInterpretation: string;
    lockedInColor: string;
  }>;
}

const filterOptions: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "JHS", value: "JHS" },
  { label: "SHS", value: "SHS" },
  { label: "NMTC", value: "NMTC" },
  { label: "University", value: "University" },
];

// Configuration
const BATCH_SIZE = 5;
const POLL_INTERVAL = 15000; // 30 seconds

export default function SchoolsPage() {
  const dispatch = useAppDispatch();
  const { schools: cachedSchools, isLoading: reduxLoading } = useAppSelector(
    (state) => state.curatorSchools
  );
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: allSchools = [], isLoading: schoolsLoading, isError } = useSchools();
  const previousSchoolsRef = useRef<Map<number, SchoolWithExtras>>(new Map());
  const isInitialLoadRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastPollRef = useRef<number>(0);

  // Fetch data for a single school with optimized API calls
  const fetchSchoolData = useCallback(async (
    school: School,
    isBackground: boolean = false
  ): Promise<SchoolWithExtras> => {
    const schoolData: SchoolWithExtras = { ...school, isLoading: true };
    
    try {
      // Parallel fetch of lock-in count and latest patient
      const [studentCount, latestPatient] = await Promise.all([
        getSchoolLockInCount(school.id),
        getLatestPatientResult(school.id),
      ]);

      schoolData.studentCount = studentCount;
      
      if (latestPatient) {
        schoolData.latestLockInDate = latestPatient.createdAt;
        schoolData.newPatientName = latestPatient.patientName;
      }

      // Check for new patients during background updates
      if (!isInitialLoadRef.current && isBackground && latestPatient) {
        const prevSchool = previousSchoolsRef.current.get(Number(school.id));
        if (prevSchool?.newPatientName !== latestPatient.patientName) {
          toast.success(`New patient: ${latestPatient.patientName} at ${school.name}`);
        }
      }
    } catch (error) {
      console.error(`Error fetching data for school ${school.id}:`, error);
    }

    schoolData.isLoading = false;
    return schoolData;
  }, []);

  // Load schools with incremental updates and batching
  const loadSchoolsWithData = useCallback(async (isBackground = false) => {
    if (allSchools.length === 0) return;

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    if (!isBackground) {
      dispatch(setLoading(true));
    }

    const currentSchoolIds = new Set(allSchools.map((s: School) => Number(s.id)));

    // Check for removed/added schools
    if (!isInitialLoadRef.current && isBackground && previousSchoolsRef.current.size > 0) {
      previousSchoolsRef.current.forEach((prevSchool, id) => {
        if (!currentSchoolIds.has(id)) {
          toast.error(`${prevSchool.name} is no longer available`);
        }
      });

      allSchools.forEach((newSchool: School) => {
        if (!previousSchoolsRef.current.has(Number(newSchool.id))) {
          toast.success(`New school added: ${newSchool.name}`);
        }
      });
    }

    try {
      // Process schools in batches with incremental updates
      const enrichedSchools = await processBatch(
        allSchools,
        BATCH_SIZE,
        async (school: School, index: number) => {
          const schoolData = await fetchSchoolData(school, isBackground);
          
          // Incrementally update Redux for real-time display
          if (!isBackground || index < 10) {
            dispatch(updateSchool({ id: school.id, data: schoolData }));
          }
          
          return schoolData;
        }
      );

      // Sort schools by latest activity
      enrichedSchools.sort((a, b) => {
        const aStudentDate = a.latestLockInDate;
        const bStudentDate = b.latestLockInDate;
        
        if (aStudentDate && bStudentDate) {
          return new Date(bStudentDate).getTime() - new Date(aStudentDate).getTime();
        }
        
        if (aStudentDate && !bStudentDate) return -1;
        if (!aStudentDate && bStudentDate) return 1;
        
        const aProviderDate = a.latestProviderDate;
        const bProviderDate = b.latestProviderDate;
        
        if (!aProviderDate && !bProviderDate) return 0;
        if (!aProviderDate) return 1;
        if (!bProviderDate) return -1;
        return new Date(bProviderDate).getTime() - new Date(aProviderDate).getTime();
      });

      // Update cache map
      const newCacheMap = new Map<number, SchoolWithExtras>();
      enrichedSchools.forEach((school) => {
        newCacheMap.set(Number(school.id), school);
      });
      previousSchoolsRef.current = newCacheMap;

      // Final batch update to Redux
      dispatch(setSchools(enrichedSchools));
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error("Error loading schools:", error);
      toast.error("Failed to load some school data");
    } finally {
      if (!isBackground) {
        dispatch(setLoading(false));
      }
      isInitialLoadRef.current = false;
    }
  }, [allSchools, dispatch, fetchSchoolData]);

  // Initial load
  useEffect(() => {
    if (allSchools.length === 0) return;
    
    const hasCache = cachedSchools.length > 0;
    
    if (hasCache) {
      loadSchoolsWithData(true);
    } else {
      loadSchoolsWithData(false);
    }
  }, [allSchools.length]);

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
          String(campus).toLowerCase().includes(query)
        );
        return nameMatch || nicknameMatch || typeMatch || campusesMatch;
      });
    }

    return filtered;
  }, [mergedSchools, activeFilter, searchQuery]);

  const getFirstCampus = (campuses: string[] | null | undefined): string => {
    if (campuses && Array.isArray(campuses) && campuses.length > 0) {
      return campuses[0];
    }
    return "";
  };

  if (isError) {
    return (
      <WidthConstraint>
        <div className="flex flex-col gap-8 p-8">
          <div className="text-center text-red-500">Failed to load schools</div>
        </div>
      </WidthConstraint>
    );
  }

  return (
    <WidthConstraint>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Schools</h1>
          <p className="text-gray-600">Manage and view all registered educational institutions</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search schools by name, nickname, type, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {filterOptions.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeFilter === filter.value
                  ? "bg-[#955aa4] text-white shadow-md shadow-[#955aa4]/20"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {(schoolsLoading || reduxLoading) && cachedSchools.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
              <p className="text-gray-500">Loading schools...</p>
            </div>
          </div>
        ) : schoolsList.length === 0 ? (
          <div className="text-center py-20">
            <MdSchool className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeFilter === "all" ? "No schools found" : "No schools found"}
            </h3>
            <p className="text-gray-500">
              {activeFilter === "all"
                ? "There are no schools registered yet."
                : `There are no schools under the ${filterOptions.find((f) => f.value === activeFilter)?.label} category.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {schoolsList.map((school) => {
              const firstCampus = getFirstCampus(school.campuses);
              const displayNickname = school.nickname 
                ? (firstCampus ? `${school.nickname} (${firstCampus})` : school.nickname)
                : (firstCampus ? `(${firstCampus})` : "");

              return (
                <Link
                  key={school.id}
                  href={`${ROUTES.curator.schools}/${school.id}`}
                  className="relative group h-80 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-105 hover:brightness-110 transition-all duration-300 block"
                >
                  {/* Background Image */}
                  {school.logo ? (
                    <div className="absolute inset-0">
                      <Image
                        src={school.logo}
                        alt={school.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <MdSchool className="w-20 h-20 text-gray-400" />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

                  {/* Loading Indicator */}
                  {school.isLoading && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}

                  {/* Top Left - New Patient Alert */}
                  {school.newPatientName && !school.isLoading && (
                    <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-3 py-2 shadow-md border-none w-[240px]">
                      <span className="text-base font-semibold block truncate">
                        <span className="text-[#e92229]">New Patient.</span>{" "}
                        <span className="text-black">{school.newPatientName}</span>
                      </span>
                    </div>
                  )}

                  {/* Top Right - Student Count Badge */}
                  {!school.isLoading && (
                    <div className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-[#e92229] backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {school.studentCount ?? 0}
                      </span>
                    </div>
                  )}

                  {/* Bottom Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-center">
                    <h3 className="text-white font-bold text-4xl mb-1 leading-tight">
                      {school.name}
                    </h3>
                    {displayNickname && (
                      <p className="text-white/95 text-2xl font-medium mb-1">
                        {displayNickname}
                      </p>
                    )}
                    {school.motto && (
                      <p className="text-white/90 text-sm font-medium italic">
                        {school.motto}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </WidthConstraint>
  );
}