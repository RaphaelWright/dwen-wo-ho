"use client";

import { ROUTES } from "@/lib/constants/routes";

import { Button } from "@/components/ui/button";

import LoadingOverlay from "@/components/ui/loading-overlay";

import { useCuratorProviderDetails } from "@/hooks/curator/use-curator-provider-details";

import {
  ProviderDetailsHeader,
  ProviderProfileCard,
  ProviderSpecialtiesCard,
  ProviderActionButtons,
  ProviderStatusDisplay,
} from "@/components/curator/provider-details";

const ProviderDetailsPage = () => {
  const {
    provider,

    isLoading,

    isActionLoading,

    successMessage,

    isAuthenticated,

    handleApprove,

    handleReject,

    getStatusColor,

    router,
  } = useCuratorProviderDetails();

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4" />

          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  if (isLoading) {
    return (
      <LoadingOverlay text="Loading provider details..." isVisible={true} />
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Provider Not Found
          </h1>

          <Button onClick={() => router.push(ROUTES.curator.providers)}>
            Back to Providers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingOverlay
        text="Processing request..."
        isVisible={isActionLoading}
      />

      <ProviderDetailsHeader
        status={provider.status || "PENDING"}
        statusColor={getStatusColor(provider.status || "PENDING")}
        onBackClick={() => router.push(ROUTES.curator.providers)}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-600 text-center font-medium">
              {successMessage}
            </p>
          </div>
        )}

        <ProviderProfileCard provider={provider} />

        <ProviderSpecialtiesCard specialties={provider.specialties || []} />

        {provider.status === "PENDING" ? (
          <ProviderActionButtons
            onApprove={handleApprove}
            onReject={handleReject}
            isLoading={isActionLoading}
          />
        ) : (
          <ProviderStatusDisplay
            status={provider.status || "PENDING"}
            updatedAt={provider.updatedAt}
          />
        )}
      </div>
    </div>
  );
};

export default ProviderDetailsPage;
