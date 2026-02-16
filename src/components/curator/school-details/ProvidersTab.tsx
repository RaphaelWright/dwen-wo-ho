import Image from "next/image";
import { Users } from "lucide-react";
import { formatProviderName } from "@/lib/utils/formatProviderName";
import { TabContentState } from "@/components/shared/tab-content-state";
import { ProvidersTabProps } from "@/lib/types/components/curator/school-detail-tabs";

export const ProvidersTab = ({
  providers,
  isLoading,
  onProviderClick,
}: ProvidersTabProps) => (
  <TabContentState
    isLoading={isLoading}
    isEmpty={providers.length === 0}
    loadingMessage="Loading providers..."
    emptyMessage="No providers found for this school"
    EmptyIcon={Users}
  >
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
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
  </TabContentState>
);
