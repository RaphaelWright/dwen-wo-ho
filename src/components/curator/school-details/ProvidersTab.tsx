import Image from "next/image";
import { Users } from "lucide-react";
import { formatProviderName } from "@/lib/utils/formatProviderName";
import { TabContentState } from "@/components/shared/tab-content-state";
import { ProvidersTabProps } from "@/lib/types/components/curator/school-detail-tabs";

export const ProvidersTab = ({
  providers,
  isLoading,
  onProviderClick,
  searchQuery = "",
}: ProvidersTabProps & { searchQuery?: string }) => {
  const filteredProviders = providers.filter((provider) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();

    const nameMatch = formatProviderName(
      provider.providerName,
      provider.providerTitle,
    )
      .toLowerCase()
      .includes(query);
    const emailMatch = provider.email?.toLowerCase().includes(query);
    const specialtyMatch = provider.specialty?.toLowerCase().includes(query);

    return nameMatch || emailMatch || specialtyMatch;
  });

  return (
    <TabContentState
      isLoading={isLoading}
      isEmpty={filteredProviders.length === 0}
      loadingMessage="Loading providers..."
      emptyMessage={
        providers.length === 0
          ? "No providers found for this school"
          : "No providers match your search"
      }
      EmptyIcon={Users}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProviders.map((provider, index) => {
          const fullName = formatProviderName(
            provider.providerName,
            provider.providerTitle,
          );

          // Rotating pastel gradient backgrounds
          const pastelColors = [
            "from-rose-200 to-rose-100", // pink
            "from-blue-200 to-indigo-100", // blue-lavender
            "from-emerald-200 to-green-100", // green
            "from-amber-200 to-yellow-100", // amber
            "from-teal-200 to-cyan-100", // teal
            "from-sky-200 to-cyan-100", // sky
            "from-orange-200 to-amber-100", // orange
            "from-fuchsia-200 to-pink-100", // fuchsia
          ];
          const bgGradient = pastelColors[index % pastelColors.length];

          return (
            <button
              key={provider.email}
              onClick={() => onProviderClick(provider)}
              className="flex flex-col items-center text-center group transition-all duration-200"
            >
              {/* Pastel square with avatar */}
              <div
                className={`w-40 h-40 rounded-3xl bg-linear-to-br ${bgGradient} flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:scale-[1.03] transition-all duration-300`}
              >
                {provider.profilePhotoURL ? (
                  <Image
                    src={provider.profilePhotoURL}
                    alt={provider.providerName}
                    width={88}
                    height={88}
                    className="w-22 h-22 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-22 h-22 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center">
                    <Users className="w-10 h-10 text-foreground/40" />
                  </div>
                )}
              </div>

              {/* Full name (with title) */}
              <h4 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors">
                {fullName}
              </h4>

              {/* Specialty */}
              {provider.specialty && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {provider.specialty}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </TabContentState>
  );
};
