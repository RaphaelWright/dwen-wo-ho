import { FiUser, FiMail, FiPhone, FiCalendar, FiAward } from "react-icons/fi";
import Image from "next/image";
import { formatProviderName } from "@/lib/utils/formatProviderName";
import { ProviderProfileCardProps } from "@/lib/types/provider/profile";

export function ProviderProfileCard({ provider }: ProviderProfileCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
      <div className="flex items-start gap-6">
        {provider.profilePhotoURL ? (
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 shrink-0">
            <Image
              src={provider.profilePhotoURL}
              alt={formatProviderName(
                provider.providerName,
                provider.providerTitle,
              )}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
            <FiUser className="w-12 h-12 text-white" />
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {formatProviderName(provider.providerName, provider.providerTitle)}
          </h2>
          {provider.specialty && (
            <p className="text-lg text-gray-600 mb-4">{provider.specialty}</p>
          )}
          {provider.status && (
            <p className="text-gray-700 italic mb-4">
              &quot;{provider.status}&quot;
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <FiMail className="w-5 h-5 text-gray-400 shrink-0" />
              <span className="text-gray-700">{provider.email}</span>
            </div>
            {provider.officePhoneNumber && (
              <div className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="text-gray-700">
                  {provider.officePhoneNumber}
                </span>
              </div>
            )}
            {provider.applicationDate && (
              <div className="flex items-center gap-3">
                <FiCalendar className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="text-gray-700">
                  Joined{" "}
                  {new Date(provider.applicationDate).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <FiAward className="w-5 h-5 text-gray-400 shrink-0" />
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  provider.applicationStatus === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : provider.applicationStatus === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {provider.applicationStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
