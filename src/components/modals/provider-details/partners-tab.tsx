import { FiUsers, FiMinus, FiSearch, FiPlus } from "react-icons/fi";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PartnersTabProps } from "@/lib/types/components/modals/provider-details";
import { AssociatedPartner } from "@/lib/types/provider";
import { Input } from "@/components/ui/input";

export const PartnersTab = ({
  isLoadingPartners,
  associatedPartners,
  partnerSearchQuery,
  setPartnerSearchQuery,
  filteredAvailablePartners,
  setPartnerToRemove,
  setPartnerToAdd,
}: PartnersTabProps) => {
  return (
    <div className="space-y-6">
      {/* Associated Partners */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">
          Associated Partners
        </h4>
        {isLoadingPartners ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#955aa4] mx-auto mb-2"></div>
            <p>Loading partners...</p>
          </div>
        ) : associatedPartners.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiUsers className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No partners associated yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {associatedPartners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-[#955aa4]/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {partner.logo ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shrink-0">
                      <FiUsers className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {partner.name}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setPartnerToRemove(partner)}
                  variant="ghost"
                  className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-red-400 text-red-500 hover:bg-red-50 transition-colors p-0"
                  aria-label="Remove partner"
                >
                  <FiMinus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Partners */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Available Partners</h4>
        {isLoadingPartners ? (
          <div className="text-center py-4 text-gray-500">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search partners..."
                value={partnerSearchQuery}
                onChange={(e) => setPartnerSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            {filteredAvailablePartners.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                {partnerSearchQuery
                  ? "No partners found matching your search."
                  : "All partners are already associated."}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredAvailablePartners.map((partner: AssociatedPartner) => (
                  <div
                    key={partner.id}
                    className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {partner.logo ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center shrink-0">
                          <FiUsers className="w-6 h-6 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {partner.name}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setPartnerToAdd(partner)}
                      variant="ghost"
                      className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-green-400 text-green-500 hover:bg-green-50 transition-colors p-0"
                      aria-label="Add partner"
                    >
                      <FiPlus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
