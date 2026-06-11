import { ProviderStatsGridProps } from "@/lib/types/provider/profile";
import { getProviderStatItems } from "@/lib/constants/provider-profile";

export function ProviderStatsGrid({ stats }: ProviderStatsGridProps) {
  const statItems = getProviderStatItems(stats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.bgClass}`}
              >
                <Icon className={`w-6 h-6 ${item.textClass}`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {item.value}
            </h3>
            <p className="text-sm text-gray-600">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}
