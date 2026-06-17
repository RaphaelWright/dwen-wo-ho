import { Button } from "@/components/ui/button";
import { PartnerTabsProps } from "@/lib/types/components/curator/partners/partner-details-panel";

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
            className={`flex items-center gap-2 rounded-none border-b-2 px-6 py-4 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "text-muted-foreground hover:text-foreground border-transparent hover:border-gray-300"
            }`}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
            {tab.count !== undefined && tab.count !== null && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium">
                {tab.count}
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
