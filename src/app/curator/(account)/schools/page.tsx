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
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSchools, setLoading } from "@/store/slices/curatorSchoolsSlice";

type FilterType = "all" | "JHS" | "SHS" | "NMTC" | "University";

interface SchoolWithExtras extends School {
  studentCount?: number;
  newPatientName?: string;
  latestLockInDate?: string;
  providerCount?: number;
  newProviderName?: string;
  latestProviderDate?: string;
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

  const loadSchoolsWithData = useCallback(
    async (isBackground = false) => {
      if (allSchools.length === 0) return;

      if (!isBackground) {
        dispatch(setLoading(true));
      }

    const currentSchoolIds = new Set(allSchools.map((s: School) => Number(s.id)));

    // Check for removed schools (compare with cached schools)
    if (!isInitialLoadRef.current && isBackground && previousSchoolsRef.current.size > 0) {
      previousSchoolsRef.current.forEach((prevSchool, id) => {
        if (!currentSchoolIds.has(id)) {
          toast.error(`${prevSchool.name} is no longer available`);
        }
      });
    }

    // Check for newly added schools
    if (!isInitialLoadRef.current && isBackground) {
      allSchools.forEach((newSchool: School) => {
        if (!previousSchoolsRef.current.has(Number(newSchool.id))) {
          toast.success(`New school added: ${newSchool.name}`);
        }
      });
    }

    // Fetch lock-in data and patient results for each school
    const enrichedSchools = await Promise.all(
      allSchools.map(async (school: School) => {
        const schoolData: SchoolWithExtras = { ...school };

        try {
          // Fetch lock-in data to get count
          const lockInResponse = await api(ENDPOINTS.getSchoolLockIn(school.id));
          if (lockInResponse?.success && lockInResponse.data) {
            const lockInData = lockInResponse.data as LockInData;
            schoolData.studentCount = lockInData.students?.length || 0;
          }
        } catch (error) {
          // Silently handle "No lockins found" - this is expected for schools without lock-ins
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (!errorMessage.includes("No lockins found")) {
            // Only log if it's not the expected "no lockins" case
          }
          schoolData.studentCount = 0;
        }

        // Fetch provider count
        try {
          const providersResponse = await api(ENDPOINTS.schoolProviders(school.id));
          if (providersResponse?.success && providersResponse.data) {
            const providersData = providersResponse.data as { providers?: ProviderResult[] } | ProviderResult[];
            const providers = Array.isArray(providersData) ? providersData : (providersData.providers || []);
            schoolData.providerCount = providers.length;
          }
        } catch (error) {
          schoolData.providerCount = 0;
        }

        try {
          // Focus on "new" endpoint for latest updates
          const newResultsResponse = await api(ENDPOINTS.getNewSchoolPatientResults(school.id));
          if (newResultsResponse?.success && newResultsResponse.data) {
            const newResults = newResultsResponse.data as PatientResult[];
            if (newResults.length > 0) {
              const latestNewResult = newResults.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              )[0];
              schoolData.newPatientName = latestNewResult.patientName;
              schoolData.latestLockInDate = latestNewResult.createdAt;

              // Check if this is a new patient (not in cache)
              if (!isInitialLoadRef.current && isBackground) {
                const prevSchool = previousSchoolsRef.current.get(Number(school.id));
                if (prevSchool?.newPatientName !== latestNewResult.patientName) {
                  toast.success(`New patient: ${latestNewResult.patientName} at ${school.name}`);
                }
              }
            } else {
              // If no new patients, get latest from all results
              const allResultsResponse = await api(ENDPOINTS.getSchoolPatientResults(school.id));
              if (allResultsResponse?.success && allResultsResponse.data) {
                const results = allResultsResponse.data as PatientResult[];
                if (results.length > 0) {
                  const latestResult = results.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  )[0];
                  schoolData.newPatientName = latestResult.patientName;
                  schoolData.latestLockInDate = latestResult.createdAt;
                }
              }
            }
          }
        } catch (error) {
          // Error fetching results
        }

        // Fetch new providers
        try {
          const newProvidersResponse = await api(ENDPOINTS.getNewSchoolProviders(school.id));
          if (newProvidersResponse?.success && newProvidersResponse.data) {
            const newProviders = newProvidersResponse.data as ProviderResult[];
            if (newProviders.length > 0) {
              const latestProvider = newProviders.sort((a, b) => {
                const aDate = a.createdAt || a.addedAt || "";
                const bDate = b.createdAt || b.addedAt || "";
                return new Date(bDate).getTime() - new Date(aDate).getTime();
              })[0];
              schoolData.newProviderName = latestProvider.fullName;
              schoolData.latestProviderDate = latestProvider.createdAt || latestProvider.addedAt;

              // Check if this is a new provider (not in cache)
              if (!isInitialLoadRef.current && isBackground) {
                const prevSchool = previousSchoolsRef.current.get(Number(school.id));
                if (prevSchool?.newProviderName !== latestProvider.fullName) {
                  toast.success(`New provider: ${latestProvider.fullName} at ${school.name}`);
                }
              }
            } else {
              // If no new providers, get latest from all providers
              const allProvidersResponse = await api(ENDPOINTS.schoolProviders(school.id));
              if (allProvidersResponse?.success && allProvidersResponse.data) {
                const providersData = allProvidersResponse.data as { providers?: ProviderResult[] } | ProviderResult[];
                const providers = Array.isArray(providersData) ? providersData : (providersData.providers || []);
                if (providers.length > 0) {
                  const latestProvider = providers.sort((a, b) => {
                    const aDate = a.createdAt || a.addedAt || "";
                    const bDate = b.createdAt || b.addedAt || "";
                    return new Date(bDate).getTime() - new Date(aDate).getTime();
                  })[0];
                  schoolData.newProviderName = latestProvider.fullName;
                  schoolData.latestProviderDate = latestProvider.createdAt || latestProvider.addedAt;
                }
              }
            }
          }
        } catch (error) {
          // Error fetching providers - endpoint might not exist yet
        }

        return schoolData;
      })
    );

    // Sort schools by latest activity (patient or provider) - most recent first
    enrichedSchools.sort((a, b) => {
      const aLatestDate = a.latestLockInDate || a.latestProviderDate;
      const bLatestDate = b.latestLockInDate || b.latestProviderDate;
      
      if (!aLatestDate && !bLatestDate) return 0;
      if (!aLatestDate) return 1;
      if (!bLatestDate) return -1;
      return new Date(bLatestDate).getTime() - new Date(aLatestDate).getTime();
    });

    // Update cache map
    const newCacheMap = new Map<number, SchoolWithExtras>();
    enrichedSchools.forEach((school) => {
      newCacheMap.set(Number(school.id), school);
    });
    previousSchoolsRef.current = newCacheMap;

    dispatch(setSchools(enrichedSchools));
    if (!isBackground) {
      dispatch(setLoading(false));
    }
    isInitialLoadRef.current = false;
    },
    [allSchools, dispatch]
  );

  // Initial load: if we have cached schools, show them and refresh in background; else show loading and fetch
  useEffect(() => {
    if (allSchools.length === 0) return;
    const hasCache = cachedSchools.length > 0;
    loadSchoolsWithData(hasCache);
  }, [allSchools.length, loadSchoolsWithData]);

  // Background polling for new lock-ins (every 30 seconds) - no loading state
  useEffect(() => {
    if (allSchools.length === 0) return;

    const interval = setInterval(() => {
      loadSchoolsWithData(true); // Background update
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [allSchools.length, loadSchoolsWithData]);

  // Merge allSchools with cache: use cached enriched data when available so list loads fast
  const mergedSchools = useMemo(() => {
    if (allSchools.length === 0) return [];
    if (cachedSchools.length === 0) return allSchools as SchoolWithExtras[];
    return allSchools.map((school) => {
      const cached = cachedSchools.find((c) => String(c.id) === String(school.id));
      return cached ? { ...school, ...cached } : (school as SchoolWithExtras);
    });
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

        {/* Schools Grid - show loading only when no cache and we're fetching */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schoolsList.map((school) => {
              const firstCampus = getFirstCampus(school.campuses);
              const schoolWithExtras = school as SchoolWithExtras;
              
              // Determine which is latest: patient or provider
              const hasLatestPatient = schoolWithExtras.latestLockInDate && 
                (!schoolWithExtras.latestProviderDate || 
                 new Date(schoolWithExtras.latestLockInDate).getTime() >= new Date(schoolWithExtras.latestProviderDate).getTime());
              
              const displayNickname = school.nickname 
                ? (firstCampus ? `${school.nickname} (${firstCampus})` : school.nickname)
                : (firstCampus ? `(${firstCampus})` : "");

              return (
                <Link
                  key={school.id}
                  href={`${ROUTES.curator.schools}/${school.id}`}
                  className="relative group h-80 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
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

                  {/* Top Left - Alert Bar (Patient or Provider) */}
                  {(hasLatestPatient && schoolWithExtras.newPatientName) ? (
                    <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border-2 border-black w-[350px]">
                      <span className="text-base font-semibold block truncate">
                        <span className="text-[#955aa4]">New Patient.</span>{" "}
                        <span className="text-black">{schoolWithExtras.newPatientName}</span>
                      </span>
                    </div>
                  ) : (schoolWithExtras.newProviderName && !hasLatestPatient) ? (
                    <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md border-2 border-black w-[200px]">
                      <span className="text-xs font-semibold block truncate">
                        <span className="text-[#955aa4]">New Provider.</span>{" "}
                        <span className="text-black">{schoolWithExtras.newProviderName}</span>
                      </span>
                    </div>
                  ) : null}

                  {/* Top Right - Count Badge (Student or Provider based on latest) */}
                  <div className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-[#2bb673] backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">
                      {hasLatestPatient ? (schoolWithExtras.studentCount ?? 0) : (schoolWithExtras.providerCount ?? 0)}
                    </span>
                  </div>

                  {/* Bottom Content - School Name, Nickname, and Motto */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-center">
                    <h3 className="text-white font-bold text-xl mb-1 leading-tight">
                      {school.name}
                    </h3>
                    {displayNickname && (
                      <p className="text-white/95 text-sm font-medium mb-1">
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
