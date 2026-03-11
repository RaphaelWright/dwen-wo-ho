"use client";

import Image from "next/image";
import { MdSchool } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { Logo } from "@/components/shared/Logo";
import WidthConstraint from "@/components/ui/width-constraint";
import { useLockInSchools } from "@/hooks/patient/use-lock-in-schools";

export default function LockInPage() {
  const {
    isLoading,
    searchQuery,
    setSearchQuery,
    filteredSchools,
    handleSchoolSelect,
  } = useLockInSchools();

  return (
    <div className="min-h-screen bg-gray-50">
      <WidthConstraint>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Lock In</h1>
              <p className="text-gray-600">Select your school to begin</p>
            </div>
            <Logo />
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

          {/* Schools List */}
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
                  ? "Try adjusting your search query."
                  : "No schools are available at the moment."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchools.map((school) => (
                <button
                  key={school.id}
                  onClick={() => handleSchoolSelect(school.id)}
                  className="text-left bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-[#955aa4]/30"
                >
                  <div className="flex items-start gap-4">
                    {school.logo ? (
                      <div className="relative w-16 h-16 shrink-0">
                        <Image
                          src={school.logo}
                          alt={school.name}
                          fill
                          className="object-contain rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                        <MdSchool className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                        {school.name}
                      </h3>
                      {school.nickname && (
                        <p className="text-sm text-gray-500 mb-1">
                          @{school.nickname}
                        </p>
                      )}
                      {school.type && (
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {school.type}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </WidthConstraint>
    </div>
  );
}
