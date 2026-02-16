import { Button } from "@/components/ui/button";
import { PartnerTabsProps } from "@/lib/types/components/modals/partner-details";

export const PartnerTabs = ({
  tabs,
  activeTab,
  setActiveTab,
}: PartnerTabsProps) => {
  return (
    <div className="border-b border-gray-200">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-colors rounded-none ${
              activeTab === tab.id
                ? "border-[#955aa4] text-[#955aa4]"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
            {tab.count !== undefined && tab.count !== null && (
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium">
                {tab.count}
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
