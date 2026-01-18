"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import WidthConstraint from "@/components/ui/width-constraint";
import { MdSchool } from "react-icons/md";
import Image from "next/image";
import useUserQuery from "@/hooks/queries/useUserQuery";

interface School {
  id: string | number;
  name: string;
  logo?: string;
  type?: string;
  nickname?: string;
}

export default function ProviderSchoolsPage() {
  const router = useRouter();
  const { getProfileQuery } = useUserQuery();
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (getProfileQuery.data) {
      const providerSchools = getProfileQuery.data.schools || [];
      setSchools(Array.isArray(providerSchools) ? providerSchools : []);
      setIsLoading(false);
    }
  }, [getProfileQuery.data]);

  const handleSchoolClick = (schoolId: string | number) => {
    router.push(`/provider/schools/${schoolId}`);
  };

  return (
    <WidthConstraint>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Schools</h1>
          <p className="text-gray-600">View and manage your assigned schools</p>
        </div>

        {/* Schools Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
              <p className="text-gray-500">Loading schools...</p>
            </div>
          </div>
        ) : schools.length === 0 ? (
          <div className="text-center py-20">
            <MdSchool className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No schools assigned</h3>
            <p className="text-gray-500">You haven't been assigned to any schools yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <button
                key={school.id}
                onClick={() => handleSchoolClick(school.id)}
                className="text-left bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow hover:border-[#955aa4]/30"
              >
                <div className="flex items-start gap-4">
                  {school.logo ? (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={school.logo}
                        alt={school.name}
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                      <MdSchool className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {school.name}
                    </h3>
                    {school.nickname && (
                      <p className="text-sm text-gray-500 mb-1">@{school.nickname}</p>
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
  );
}
