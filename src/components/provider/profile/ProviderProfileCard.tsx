import { FiUser, FiMail, FiPhone, FiCalendar, FiAward } from "react-icons/fi";
import Image from "next/image";
import { formatProviderName } from "@/lib/utils/formatProviderName";
import { ProviderProfileCardProps } from "@/lib/types/provider/profile";

export function ProviderProfileCard({ provider }: ProviderProfileCardProps) {
  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex items-start gap-6">
        {provider.profilePhotoURL ? (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-gray-200">
            <Image
              src={provider.profilePhotoURL}
              alt={formatProviderName(
                provider.providerName || "",
                provider.providerTitle,
              )}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-cyan-500">
            <FiUser className="h-12 w-12 text-white" />
          </div>
        )}
        <div className="flex-1">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            {formatProviderName(
              provider.providerName || "",
              provider.providerTitle,
            )}
          </h2>

          {provider.specialty && (
            <p className="mb-4 text-lg text-gray-600">{provider.specialty}</p>
          )}
          {provider.status && (
            <p className="mb-4 text-gray-700 italic">
              &quot;{provider.status}&quot;
            </p>
          )}

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <FiMail className="h-5 w-5 shrink-0 text-gray-400" />
              <span className="text-gray-700">{provider.email}</span>
            </div>
            {provider.officePhoneNumber && (
              <div className="flex items-center gap-3">
                <FiPhone className="h-5 w-5 shrink-0 text-gray-400" />
                <span className="text-gray-700">
                  {provider.officePhoneNumber}
                </span>
              </div>
            )}
            {provider.applicationDate && (
              <div className="flex items-center gap-3">
                <FiCalendar className="h-5 w-5 shrink-0 text-gray-400" />
                <span className="text-gray-700">
                  Joined{" "}
                  {new Date(provider.applicationDate).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <FiAward className="h-5 w-5 shrink-0 text-gray-400" />
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
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
