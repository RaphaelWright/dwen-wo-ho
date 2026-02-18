import Image from "next/image";
import { Users } from "lucide-react";
import { formatProviderName } from "@/lib/utils/formatProviderName";
import { TabContentState } from "@/components/shared/tab-content-state";
import { ProvidersTabProps } from "@/lib/types/components/curator/school-detail-tabs";

export const ProvidersTab = ({
  providers,
  isLoading,
  onProviderClick,
}: ProvidersTabProps) => (
  <TabContentState
    isLoading={isLoading}
    isEmpty={providers.length === 0}
    loadingMessage="Loading providers..."
    emptyMessage="No providers found for this school"
    EmptyIcon={Users}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {providers.map((provider) => (
        <button
          key={provider.email}
          onClick={() => onProviderClick(provider)}
          className="relative text-center bg-card rounded-3xl p-8 hover:shadow-lg transition-all border border-border/50 hover:border-primary/50 group"
        >
          {/* Arrow button in top right */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-muted group-hover:bg-primary flex items-center justify-center transition-colors">
            <svg
              className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>

          {/* Profile photo */}
          <div className="flex justify-center mb-4">
            {provider.profilePhotoURL ? (
              <Image
                src={provider.profilePhotoURL}
                alt={provider.providerName}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover border-4 border-muted"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-4 border-muted">
                <Users className="w-10 h-10 text-muted-foreground/50" />
              </div>
            )}
          </div>

          {/* Provider name */}
          <h4 className="font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
            {formatProviderName(provider.providerName, provider.providerTitle)}
          </h4>

          {/* Specialty */}
          {provider.specialty && (
            <p className="text-sm text-muted-foreground mb-3">
              {provider.specialty}
            </p>
          )}

          {/* Added time ago */}
          <p className="text-sm text-orange-500 font-medium mb-4">
            Added 1d ago
          </p>

          {/* Status badge - only show if not approved */}
          {provider.applicationStatus !== "APPROVED" && (
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                provider.applicationStatus === "PENDING"
                  ? "bg-yellow-500/10 text-yellow-600 border border-yellow-200"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}
            >
              {provider.applicationStatus}
            </span>
          )}
        </button>
      ))}
    </div>
  </TabContentState>
);
