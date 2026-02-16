import { FiMail, FiPhone, FiCalendar, FiAward, FiUsers } from "react-icons/fi";
import { timeAgo } from "@/lib/utils/timeAgo";
import { OverviewTabProps } from "@/lib/types/components/modals/provider-details";

export const OverviewTab = ({ provider }: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      {/* Status Message */}
      {provider?.status && (
        <div className="bg-linear-to-r from-[#955aa4]/5 to-purple-50 rounded-xl p-4 border border-[#955aa4]/10">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-lg">💬</span>
            Status Message
          </h4>
          <p className="text-gray-700 italic">"{provider.status}"</p>
        </div>
      )}

      {/* Contact Info Section */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <FiUsers className="w-5 h-5 text-[#955aa4]" />
          Contact Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500">
              <FiMail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email Address</p>
              <p className="text-sm font-medium text-gray-900">
                {provider?.email}
              </p>
            </div>
          </div>
          {provider?.officePhoneNumber && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500">
                <FiPhone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone Number</p>
                <p className="text-sm font-medium text-gray-900">
                  {provider.officePhoneNumber}
                </p>
              </div>
            </div>
          )}
          {provider?.applicationDate && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500">
                <FiCalendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Application Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {timeAgo(provider.applicationDate)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Specialties */}
      {provider?.specialties &&
        provider.specialties.length > 0 &&
        provider.specialties.some((s: string) => s && s.trim()) && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiAward className="w-5 h-5 text-[#955aa4]" />
              Specialties
            </h4>
            <div className="flex flex-wrap gap-2">
              {provider.specialties
                .filter((s: string) => s && s.trim())
                .map((specialty: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-[#955aa4]/30 transition-colors"
                  >
                    {specialty}
                  </span>
                ))}
            </div>
          </div>
        )}

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Member Since</p>
          <p className="font-semibold text-gray-900">
            {provider?.createdAt
              ? new Date(provider.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Last Updated</p>
          <p className="font-semibold text-gray-900">
            {provider?.updatedAt ? timeAgo(provider.updatedAt) : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};
