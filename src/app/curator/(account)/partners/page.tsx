"use client";

import WidthConstraint from "@/components/ui/width-constraint";
import { Building2, Search } from "lucide-react";
import Image from "next/image";
import PartnerDetailsModal from "@/components/modals/partner-details";
import { useCuratorPartners } from "@/hooks/curator/use-curator-partners";

export default function PartnersPage() {
  const {
    cachedPartners,
    filteredPartners,
    atomLoading,
    searchQuery,
    setSearchQuery,
    showPartnerModal,
    selectedPartnerId,
    selectedPartner,
    handlePartnerClick,
    handleModalClose,
  } = useCuratorPartners();

  return (
    <WidthConstraint>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Partners</h1>
          <p className="text-gray-600">Manage partner organizations</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search partners by name, nickname, or slogan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all"
            />
          </div>
        </div>

        {/* Partners Grid - show loading only when no cache and we're fetching */}
        {atomLoading && cachedPartners.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
              <p className="text-gray-500">Loading partners...</p>
            </div>
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? "No partners found" : "No partners yet"}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create your first partner to get started"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner) => (
              <button
                key={partner.id}
                onClick={() => handlePartnerClick(partner)}
                className="text-left bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow hover:border-[#955aa4]/30"
              >
                <div className="flex items-start gap-4">
                  {partner.logo ? (
                    <div className="relative w-16 h-16 shrink-0">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {partner.name}
                    </h3>
                    {partner.nickname && (
                      <p className="text-sm text-gray-500 mb-1">
                        @{partner.nickname}
                      </p>
                    )}
                    {partner.slogan && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {partner.slogan}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Partner Details Modal */}
      <PartnerDetailsModal
        isOpen={showPartnerModal}
        onClose={handleModalClose}
        partnerId={selectedPartnerId}
        partner={selectedPartner}
      />
    </WidthConstraint>
  );
}
