"use client";

import { FiSearch } from "react-icons/fi";
import { ProviderSchoolsFilterProps } from "@/features/provider/types/schools";
import { filterOptions } from "@/lib/constants/provider-schools";

export function ProviderSchoolsFilter({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
}: ProviderSchoolsFilterProps) {
  return (
    <>
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
    </>
  );
}
