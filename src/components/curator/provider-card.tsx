"use client";
import Image from "next/image";
import { timeAgo } from "@/lib/utils/timeAgo";
import { FiCheck, FiX } from "react-icons/fi";
import { formatProviderName } from "@/lib/utils/formatProviderName";
import { Button } from "@/components/ui/button";
import { ProviderCardProps } from "@/lib/types/components/curator/provider-card";
import { DEFAULT_PROVIDER_IMAGE } from "@/lib/constants/components/curator/provider-card";
import { useProviderCard } from "@/hooks/components/curator/use-provider-card";

const ProviderCard = (props: ProviderCardProps) => {
  const { provider } = props;
  const {
    handleApproveClick,
    handleRejectClick,
    handleViewDetails,
    isApproving,
    isRejecting,
    isActionDisabled,
  } = useProviderCard(props);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[#955aa4]/50 group hover:scale-[1.02] flex flex-col items-center w-full relative">
      {/* View Details Button - Top Right Corner */}
      <Button
        onClick={handleViewDetails}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#955aa4] group-hover:text-white transition-all duration-300 shadow-sm z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
          />
        </svg>
      </Button>

      {/* Provider Image - Centered at Top */}
      <div className="w-16 h-16 rounded-full overflow-hidden mb-4 ring-4 ring-gray-100 group-hover:ring-[#955aa4]/20 transition-all duration-300">
        <Image
          src={provider.profilePhotoURL || DEFAULT_PROVIDER_IMAGE}
          alt={formatProviderName(
            provider.providerName,
            provider.providerTitle,
          )}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Provider Info - Centered */}
      <div className="text-center w-full">
        <h3 className="font-bold text-gray-900 group-hover:text-[#955aa4] transition-colors text-lg mb-2 truncate px-1">
          {formatProviderName(provider.providerName, provider.providerTitle)}
        </h3>
        <p className="text-gray-600 text-sm mb-3 truncate px-1">
          {provider.specialty || "General Practice"}
        </p>

        {/* Time Added */}
        <p className="text-orange-500 text-xs font-medium mb-4">
          Added {timeAgo(provider.applicationDate)}
        </p>

        {/* Status Badge or Action Buttons */}
        <div className="flex gap-2 justify-center w-full px-1">
          {provider.applicationStatus === "APPROVED" ? (
            <>
              <div className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-sm border border-green-200">
                <FiCheck className="w-4 h-4" />
                Approved
              </div>
              <Button
                onClick={handleRejectClick}
                disabled={isActionDisabled}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-red-600 rounded-lg font-semibold text-sm transition-all duration-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRejecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <FiX className="w-4 h-4" />
                    Reject
                  </>
                )}
              </Button>
            </>
          ) : provider.applicationStatus === "REJECTED" ? (
            <>
              <Button
                onClick={handleApproveClick}
                disabled={isActionDisabled}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-black hover:bg-gray-900 text-white rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApproving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4" />
                    Approve
                  </>
                )}
              </Button>
              <div className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold text-sm border border-red-200">
                <FiX className="w-4 h-4" />
                Rejected
              </div>
            </>
          ) : (
            <>
              <Button
                onClick={handleApproveClick}
                disabled={isActionDisabled}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-black hover:bg-gray-900 text-white rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApproving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4" />
                    Approve
                  </>
                )}
              </Button>
              <Button
                onClick={handleRejectClick}
                disabled={isActionDisabled}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-red-600 rounded-lg font-semibold text-sm transition-all duration-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRejecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <FiX className="w-4 h-4" />
                    Reject
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
