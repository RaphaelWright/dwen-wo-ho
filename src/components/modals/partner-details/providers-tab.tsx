import Image from "next/image";
import { FiUsers, FiSearch, FiMinus, FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { ProvidersTabProps } from "@/lib/types/components/modals/partner-details";
import { AssociatedProvider } from "@/lib/types/partners";
import { formatProviderName } from "@/lib/utils/formatProviderName";
import { Input } from "@/components/ui/input";

export const ProvidersTab = ({
  isLoadingProviders,
  associatedProviders,
  filteredAvailableProviders,
  providerSearchQuery,
  setProviderSearchQuery,
  handleProviderClick,
  setProviderToRemove,
  setProviderToAdd,
}: ProvidersTabProps) => {
  return (
    <div className="space-y-6">
      {/* Associated Providers */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">
          Associated Providers
        </h4>
        {isLoadingProviders ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Loading providers...</p>
          </div>
        ) : associatedProviders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiUsers className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No providers associated yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {associatedProviders.map((provider: AssociatedProvider) => (
              <Button
                key={provider.email}
                onClick={() => handleProviderClick(provider)}
                className="w-full flex items-center justify-between p-4 bg-background border border-border rounded-lg hover:border-primary/30 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  {provider.profilePhotoURL ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-200">
                      <Image
                        src={provider.profilePhotoURL}
                        alt={provider.providerName}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-linear-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shrink-0">
                      <FiUsers className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {formatProviderName(
                        provider.providerName,
                        provider.providerTitle,
                      )}
                    </p>
                    {provider.specialty && (
                      <p className="text-sm text-gray-600">
                        {provider.specialty}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProviderToRemove(provider);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Remove provider"
                >
                  <FiMinus className="w-4 h-4" />
                </Button>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Available Providers */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">
          Available Providers
        </h4>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search providers..."
            value={providerSearchQuery}
            onChange={(e) => setProviderSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder-muted-foreground"
          />
        </div>

        {filteredAvailableProviders.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            {providerSearchQuery
              ? "No providers found matching your search."
              : "All providers are already associated."}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredAvailableProviders.map((provider: AssociatedProvider) => (
              <div
                key={provider.email}
                className="flex items-center justify-between p-4 bg-background border border-border rounded-lg hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {provider.profilePhotoURL ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-200">
                      <Image
                        src={provider.profilePhotoURL}
                        alt={provider.providerName}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-linear-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shrink-0">
                      <FiUsers className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {formatProviderName(
                        provider.providerName,
                        provider.providerTitle,
                      )}
                    </p>
                    {provider.specialty && (
                      <p className="text-sm text-gray-600">
                        {provider.specialty}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => setProviderToAdd(provider)}
                  className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-success/50 text-success hover:bg-success/10 transition-colors"
                  aria-label="Add provider"
                >
                  <FiPlus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
