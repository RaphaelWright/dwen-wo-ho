"use client";

import Image from "next/image";
import { User, Mail, Phone, Calendar } from "lucide-react";
import { ProviderDetails } from "@/types/provider";

interface ProviderProfileCardProps {
  provider: ProviderDetails;
}

export function ProviderProfileCard({ provider }: ProviderProfileCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
      <div className="px-6 py-8">
        <div className="flex items-start space-x-6">
          {/* Profile Image */}
          <div className="shrink-0">
            {provider.profileImage ? (
              <Image
                src={provider.profileImage}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-30 h-30 rounded-full bg-[#955aa4] flex items-center justify-center">
                <User className="w-16 h-16 text-white" />
              </div>
            )}
          </div>

          {/* Provider Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {provider.professionalTitle
                ? `${provider.professionalTitle} `
                : ""}
              {provider.fullName}
            </h1>
            <div className="flex items-center space-x-2 mb-4">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">{provider.email}</span>
            </div>

            {provider.officePhoneNumber && (
              <div className="flex items-center space-x-2 mb-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  {provider.officePhoneNumber}
                </span>
              </div>
            )}

            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">
                Applied:{" "}
                {provider.createdAt
                  ? new Date(provider.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>

            {(provider.status || provider.bio) && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Bio/Status
                </h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {provider.bio || provider.status}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
