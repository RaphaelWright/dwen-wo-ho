"use client";

import { MdHealthAndSafety } from "react-icons/md";
import WidthConstraint from "@/components/ui/width-constraint";
import ProviderDetailsModal from "@/components/modals/provider-details";
import ProviderCard from "@/components/curator/provider-card";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { useCuratorProviders } from "@/hooks/curator/useCuratorProviders";

export default function ProvidersPage() {
  const {
    isLoading,
    isError,
    error,
    providersList,
    filteredProviders,
    filterOptions,
    selectedProvider,
    filter,
    setFilter,
    showProviderModal,
    setShowProviderModal,
    selectedProviderEmail,
    showApproveModal,
    setShowApproveModal,
    showRejectModal,
    setShowRejectModal,
    modalProviderEmail,
    setModalProviderEmail,
    currentAction,
    handleProviderSelect,
    handleShowApproveModal,
    handleShowRejectModal,
    handleApproveConfirm,
    handleRejectConfirm,
    getProviderName,
  } = useCuratorProviders();

  if (isLoading) {
    return (
      <WidthConstraint>
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading providers...</p>
            </div>
          </div>
        </div>
      </WidthConstraint>
    );
  }

  if (isError) {
    return (
      <WidthConstraint>
        <div className="flex flex-col gap-6 p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium mb-2">
              Failed to load providers
            </p>
            <p className="text-red-500 text-sm">
              {error?.message || "An error occurred"}
            </p>
          </div>
        </div>
      </WidthConstraint>
    );
  }

  return (
    <WidthConstraint>
      <div className="flex flex-col gap-6 md:p-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Providers
                </h1>
                <p className="text-gray-500 text-sm">
                  Manage and review healthcare providers
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-gray-600 text-sm font-medium">Total:</span>
              <span className="text-[#955aa4] text-lg font-bold">
                {providersList.length}
              </span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setFilter(option.id)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  filter === option.id
                    ? `${option.color} text-white shadow-md`
                    : `${option.inactiveColor} ${option.hoverColor}`
                }`}
              >
                {option.label}
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    filter === option.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {option.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredProviders.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <MdHealthAndSafety className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                No providers found
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Providers will appear here once they are registered
              </p>
            </div>
          ) : (
            filteredProviders.map((provider) => (
              <ProviderCard
                key={provider.email}
                provider={provider}
                onViewDetails={handleProviderSelect}
                onShowApproveModal={handleShowApproveModal}
                onShowRejectModal={handleShowRejectModal}
                isModerating={currentAction !== null}
                currentAction={currentAction}
                moderatingProviderEmail={modalProviderEmail}
              />
            ))
          )}
        </div>

        {/* Provider Details Modal */}
        <ProviderDetailsModal
          isOpen={showProviderModal}
          onClose={() => setShowProviderModal(false)}
          providerEmail={selectedProviderEmail}
          provider={selectedProvider}
          onShowApproveModal={handleShowApproveModal}
          onShowRejectModal={handleShowRejectModal}
          isModerating={currentAction !== null}
          currentAction={currentAction}
          moderatingProviderEmail={modalProviderEmail}
        />

        {/* Approve Confirmation Modal */}
        <ConfirmationModal
          isOpen={showApproveModal}
          onClose={() => {
            setShowApproveModal(false);
            setModalProviderEmail("");
          }}
          onConfirm={handleApproveConfirm}
          title="Approve Provider Confirmation"
          message={`Are you sure you want to approve ${getProviderName(modalProviderEmail)} as a provider?`}
          confirmText="Yes, Approve"
          variant="success"
          isLoading={currentAction === "approving"}
        />

        {/* Reject Confirmation Modal */}
        <ConfirmationModal
          isOpen={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setModalProviderEmail("");
          }}
          onConfirm={handleRejectConfirm}
          title="Reject Provider Confirmation"
          message={`Are you sure you want to reject ${getProviderName(modalProviderEmail)}'s provider application?`}
          confirmText="Yes, Reject"
          variant="danger"
          isLoading={currentAction === "rejecting"}
        />
      </div>
    </WidthConstraint>
  );
}
