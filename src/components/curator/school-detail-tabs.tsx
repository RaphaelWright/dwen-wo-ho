"use client";

import Image from "next/image";
import { Users, Handshake, TrendingUp, Calendar, Quote } from "lucide-react";
import { MdSchool, MdLocationOn } from "react-icons/md";
import { School } from "@/types/school";
import { formatProviderName } from "@/lib/utils/formatProviderName";

interface SchoolProvider {
  id: string;
  providerName: string;
  providerTitle?: string | null;
  email: string;
  specialty: string | null;
  officePhoneNumber: string | null;
  applicationStatus: string;
  profilePhotoURL: string | null;
}

interface Partner {
  id: string;
  name: string;
  nickname: string;
  slogan: string;
  logo: string;
}

interface SchoolReachResponse {
  schoolName: string;
  reach: number;
}

interface OverviewTabProps {
  school: School;
}

const parseCampuses = (campuses: string[] | null | undefined): string[] => {
  if (!campuses || campuses.length === 0) {
    return [];
  }

  return campuses.flatMap((campus) => {
    // Handle stringified arrays like '["Cape Coast"]'
    if (typeof campus === "string" && campus.trim().startsWith("[")) {
      try {
        const parsed = JSON.parse(campus);
        return Array.isArray(parsed) ? parsed : [campus];
      } catch {
        return [campus];
      }
    }
    return [campus];
  });
};

export const OverviewTab = ({ school }: OverviewTabProps) => {
  const parsedCampuses = parseCampuses(school.campuses);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">School Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <MdSchool className="w-5 h-5 text-[#955aa4] mt-1" />
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{school.type}</p>
            </div>
          </div>
          {school.motto && (
            <div className="flex items-start gap-3">
              <Quote className="w-5 h-5 text-[#955aa4] mt-1" />
              <div>
                <p className="text-sm text-gray-500">Motto</p>
                <p className="font-medium italic">&quot;{school.motto}&quot;</p>
              </div>
            </div>
          )}
          {parsedCampuses.length > 0 && (
            <div className="flex items-start gap-3">
              <MdLocationOn className="w-5 h-5 text-[#955aa4] mt-1" />
              <div>
                <p className="text-sm text-gray-500">Campuses</p>
                <ul className="list-disc list-inside font-medium space-y-1">
                  {parsedCampuses.map((campus, index) => (
                    <li key={index}>{campus}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-[#955aa4] mt-1" />
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium">{new Date(school.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProvidersTabProps {
  providers: SchoolProvider[];
  isLoading: boolean;
  onProviderClick: (provider: SchoolProvider) => void;
}

export const ProvidersTab = ({ providers, isLoading, onProviderClick }: ProvidersTabProps) => (
  <div>
    {isLoading ? (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#955aa4] mx-auto mb-4" />
        <p className="text-gray-500">Loading providers...</p>
      </div>
    ) : providers.length === 0 ? (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No providers found for this school</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <button
            key={provider.email}
            onClick={() => onProviderClick(provider)}
            className="relative text-center bg-white rounded-3xl p-8 hover:shadow-lg transition-all border border-gray-200 hover:border-[#955aa4] group"
          >
            {/* Arrow button in top right */}
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#955aa4] flex items-center justify-center transition-colors">
              <svg 
                className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Profile photo */}
            <div className="flex justify-center mb-4">
              {provider.profilePhotoURL ? (
                <Image
                  src={provider.profilePhotoURL}
                  alt={provider.providerName}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>

            {/* Provider name */}
            <h4 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-[#955aa4] transition-colors">
              {formatProviderName(provider.providerName, provider.providerTitle)}
            </h4>

            {/* Specialty */}
            {provider.specialty && (
              <p className="text-sm text-gray-600 mb-3">{provider.specialty}</p>
            )}

            {/* Added time ago */}
            <p className="text-sm text-orange-500 font-medium mb-4">
              Added 1d ago
            </p>

            {/* Status badge - only show if not approved */}
            {provider.applicationStatus !== "APPROVED" && (
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  provider.applicationStatus === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {provider.applicationStatus}
              </span>
            )}
          </button>
        ))}
      </div>
    )}
  </div>
);

interface PartnersTabProps {
  partners: Partner[];
  isLoading: boolean;
}

export const PartnersTab = ({ partners, isLoading }: PartnersTabProps) => (
  <div>
    {isLoading ? (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#955aa4] mx-auto mb-4" />
        <p className="text-gray-500">Loading partners...</p>
      </div>
    ) : partners.length === 0 ? (
      <div className="text-center py-12">
        <Handshake className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No partners found for this school</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((partner) => (
          <div key={partner.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-start gap-3">
              {partner.logo ? (
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <Handshake className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{partner.name}</h4>
                {partner.nickname && (
                  <p className="text-sm text-gray-600 truncate">&quot;{partner.nickname}&quot;</p>
                )}
                {partner.slogan && (
                  <p className="text-xs text-gray-500 mt-1 truncate">{partner.slogan}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

interface ReachTabProps {
  reach: SchoolReachResponse | null;
  isLoading: boolean;
}

export const ReachTab = ({ reach, isLoading }: ReachTabProps) => (
  <div>
    {isLoading ? (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#955aa4] mx-auto mb-4" />
        <p className="text-gray-500">Loading reach data...</p>
      </div>
    ) : reach ? (
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-br from-[#955aa4] to-[#7a4a88] rounded-2xl p-8 text-center text-white">
          <TrendingUp className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Reach</h3>
          <p className="text-5xl font-extrabold mb-2">{reach.reach}</p>
          <p className="text-white/80">Total reach for {reach.schoolName}</p>
        </div>
      </div>
    ) : (
      <div className="text-center py-12">
        <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No reach data available</p>
      </div>
    )}
  </div>
);

export type { SchoolProvider, Partner, SchoolReachResponse };

