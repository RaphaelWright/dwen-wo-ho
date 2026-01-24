"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { School } from "@/types/school";
import { FiSearch } from "react-icons/fi";
import { MdSchool } from "react-icons/md";

type FilterType = "all" | "JHS" | "SHS" | "NMTC" | "University" | "COLLEGE";

const filterOptions: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "JHS", value: "JHS" },
  { label: "SHS", value: "SHS" },
  { label: "COLLEGE", value: "COLLEGE" },
];

interface SchoolSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (school: School | null) => void;
}

export default function SchoolSelectionModal({
  isOpen,
  onClose,
  onSelect,
}: SchoolSelectionModalProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  useEffect(() => {
    if (isOpen) {
      loadSchools();
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  const loadSchools = async () => {
    setIsLoading(true);
    try {
      const response = await api(ENDPOINTS.schools);
      if (response?.success && response.data) {
        const schoolsList = Array.isArray(response.data) ? response.data : [];
        setSchools(schoolsList);
      }
    } catch (error) {
      // Error loading schools
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSchools = useMemo(() => {
    let filtered = activeFilter === "all"
      ? schools
      : schools.filter((school) => school.type === activeFilter);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((school) => {
        const nameMatch = school.name?.toLowerCase().includes(query);
        const nicknameMatch = school.nickname?.toLowerCase().includes(query);
        const typeMatch = school.type?.toLowerCase().includes(query);
        const campusesMatch = school.campuses?.some((campus: string) =>
          campus.toLowerCase().includes(query)
        );
        return nameMatch || nicknameMatch || typeMatch || campusesMatch;
      });
    }

    return filtered;
  }, [schools, searchQuery, activeFilter]);

  const handleSchoolClick = (school: School) => {
    onSelect(school);
  };

  const handleSelectPlatform = () => {
    onSelect(null); // null means platform/default
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border-2 border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <Image
              src="/arrow-diagonal-white.svg"
              alt="Back"
              width={20}
              height={20}
              className="rotate-180"
            />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Select School</h2>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-black" />
            </div>
            <input
              type="text"
              placeholder="Search schools"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="px-6 pt-4 pb-2 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
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
        </div>

        {/* Schools List - Fixed height to show 6 cards (3 rows × 2 columns), rest scrollable */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "20rem" }}>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
                <p className="text-gray-500">Loading schools...</p>
              </div>
            </div>
          ) : filteredSchools.length === 0 ? (
            <div className="text-center py-20">
              <MdSchool className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No schools found
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? "No schools match your search."
                  : "No schools available."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Platform/Default Option */}
              <button
                onClick={handleSelectPlatform}
                className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all text-left h-20 w-full"
              >
                <div className="w-12 h-12 rounded-full bg-[#955aa4] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">+</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">Platform (Default)</p>
                  <p className="text-sm text-gray-500">Default cover page for all schools</p>
                </div>
              </button>

              {/* Schools List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSchools.map((school) => (
                  <button
                    key={school.id}
                    onClick={() => handleSchoolClick(school)}
                    className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all text-left h-20"
                  >
                    {school.logo ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={school.logo}
                          alt={school.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <MdSchool className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {school.name}
                      </p>
                      {school.type && (
                        <p className="text-sm text-gray-500">{school.type}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
