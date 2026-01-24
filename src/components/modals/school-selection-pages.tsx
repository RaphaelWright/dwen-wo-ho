"use client";

import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { School } from "@/types/school";
import { FiSearch } from "react-icons/fi";
import { MdSchool } from "react-icons/md";

interface SchoolSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (school: School) => void;
}

export default function SchoolSelectionModal({
  isOpen,
  onClose,
  onSelect,
}: SchoolSelectionModalProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
    if (!searchQuery.trim()) {
      return schools;
    }

    const query = searchQuery.toLowerCase().trim();
    return schools.filter((school) => {
      const nameMatch = school.name?.toLowerCase().includes(query);
      const nicknameMatch = school.nickname?.toLowerCase().includes(query);
      const typeMatch = school.type?.toLowerCase().includes(query);
      const campusesMatch = school.campuses?.some((campus: string) =>
        campus.toLowerCase().includes(query)
      );
      return nameMatch || nicknameMatch || typeMatch || campusesMatch;
    });
  }, [schools, searchQuery]);

  const handleSchoolClick = (school: School) => {
    onSelect(school);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border-2 border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 100 100"
              className="rotate-180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M66.92,39.4a29.45,29.45,0,0,0,5,4.54H3.5V56H71.94a29.39,29.39,0,0,0-5,4.53c-12.6,14.46-9.44,37.08-9.3,38.1l8.79,0c0-.21-2.73-20.94,7.22-32.33C78,61.41,84,56.05,92.07,56.05H96.5V43.9H92.07C84,43.9,78,38.54,73.63,33.59c-9.95-11.38-7.25-32-7.22-32.21l-8.79-.07C57.48,2.33,54.32,24.94,66.92,39.4Z"
                fill="currentColor"
                className="text-gray-900"
              />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Select School</h2>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search schools"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Schools List */}
        <div className="flex-1 overflow-y-auto p-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSchools.map((school) => (
                <button
                  key={school.id}
                  onClick={() => handleSchoolClick(school)}
                  className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-[#955aa4]/30 hover:shadow-md transition-all text-left"
                >
                  {school.logo ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                      <Image
                        src={school.logo}
                        alt={school.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
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
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0"
                  >
                    <path
                      d="M66.92,39.4a29.45,29.45,0,0,0,5,4.54H3.5V56H71.94a29.39,29.39,0,0,0-5,4.53c-12.6,14.46-9.44,37.08-9.3,38.1l8.79,0c0-.21-2.73-20.94,7.22-32.33C78,61.41,84,56.05,92.07,56.05H96.5V43.9H92.07C84,43.9,78,38.54,73.63,33.59c-9.95-11.38-7.25-32-7.22-32.21l-8.79-.07C57.48,2.33,54.32,24.94,66.92,39.4Z"
                      fill="currentColor"
                      className="text-gray-400"
                    />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
