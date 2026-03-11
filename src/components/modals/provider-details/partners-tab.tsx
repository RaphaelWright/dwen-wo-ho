import { FiUsers, FiMinus, FiSearch, FiPlus } from "react-icons/fi";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PartnersTabProps } from "@/lib/types/components/modals/provider-details";
import { AssociatedPartner } from "@/lib/types/partners";
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
        <h4 className="font-semibold mb-3">Associated Partners</h4>
        {isLoadingPartners ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-2"></div>
            <p>Loading partners...</p>
          </div>
        ) : associatedPartners.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FiUsers className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
            <p>No partners associated yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {associatedPartners.map((partner: AssociatedPartner) => (
              <div
                key={partner.id}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-teal-500/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {partner.logo ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-border">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-linear-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shrink-0">
                      <FiUsers className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{partner.name}</p>
                  </div>
                </div>
                <Button
                  onClick={() => setPartnerToRemove(partner)}
                  variant="ghost"
                  className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-destructive text-destructive hover:bg-destructive/80 transition-colors p-0"
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
        <h4 className="font-semibold mb-3">Available Partners</h4>
        {isLoadingPartners ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="text"
                placeholder="Search partners..."
                value={partnerSearchQuery}
                onChange={(e) => setPartnerSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-input border border-input transition-all placeholder-muted-foreground"
              />
            </div>

            {filteredAvailablePartners.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {partnerSearchQuery
                  ? "No partners found matching your search."
                  : "All partners are already associated."}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredAvailablePartners.map((partner: AssociatedPartner) => (
                  <div
                    key={partner.id}
                    className="flex items-center justify-between p-4 bg-card/50 border border-border rounded-lg hover:bg-muted-foreground transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {partner.logo ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-border">
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-muted-foreground rounded-lg flex items-center justify-center shrink-0">
                          <FiUsers className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{partner.name}</p>
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
