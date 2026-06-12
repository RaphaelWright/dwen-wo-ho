import { ProviderStatsGridProps } from "@/lib/types/provider/profile";
import { getProviderStatItems } from "@/lib/constants/provider-profile";

export function ProviderStatsGrid({ stats }: ProviderStatsGridProps) {
  const statItems = getProviderStatItems(stats);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.bgClass}`}
              >
                <Icon className={`h-6 w-6 ${item.textClass}`} />
              </div>
            </div>
            <h3 className="mb-1 text-2xl font-bold text-gray-900">
              {item.value}
            </h3>
            <p className="text-sm text-gray-600">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}
