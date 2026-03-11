"use client";

import WidthConstraint from "@/components/ui/width-constraint";
import { useProviderProfile } from "@/hooks/provider/use-provider-profile";
import {
  ProviderProfileHeader,
  ProviderProfileCard,
  ProviderStatsGrid,
} from "@/components/provider/profile";

export default function ProviderProfilePage() {
  const { provider, isLoading, stats } = useProviderProfile();

  if (isLoading) {
    return (
      <WidthConstraint>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </WidthConstraint>
    );
  }

  if (!provider) {
    return (
      <WidthConstraint>
        <div className="text-center py-20">
          <p className="text-gray-500">Failed to load profile</p>
        </div>
      </WidthConstraint>
    );
  }

  return (
    <WidthConstraint>
      <div className="p-8">
        <ProviderProfileHeader />
        <ProviderProfileCard provider={provider} />
        <ProviderStatsGrid stats={stats} />
      </div>
    </WidthConstraint>
  );
}
