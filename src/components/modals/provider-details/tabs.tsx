import { Button } from "@/components/ui/button";
import { PROVIDER_DETAILS_TABS } from "@/lib/constants/components/modals/provider-details";
import { ProviderTabsProps } from "@/lib/types/components/modals/provider-details";

export const ProviderTabs = ({
  activeTab,
  setActiveTab,
  associatedSchoolsCount,
  associatedPartnersCount,
}: ProviderTabsProps) => {
  return (
    <div className="px-6 mt-4 mb-4">
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {PROVIDER_DETAILS_TABS.map((tab) => {
          const Icon = tab.icon;
          const count =
            tab.id === "schools"
              ? associatedSchoolsCount
              : tab.id === "partners"
                ? associatedPartnersCount
                : undefined;
          return (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant="ghost"
              className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 rounded-none h-auto bg-transparent hover:bg-transparent ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {count !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
