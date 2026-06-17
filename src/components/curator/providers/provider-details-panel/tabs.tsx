import { Button } from "@/components/ui/button";
import { PROVIDER_DETAILS_TABS } from "@/lib/constants/components/curator/providers/provider-details-panel";
import { ProviderTabsProps } from "@/lib/types/components/curator/providers/provider-details-panel";

export const ProviderTabs = ({
  activeTab,
  setActiveTab,
  associatedSchoolsCount,
  associatedPartnersCount,
}: ProviderTabsProps) => {
  return (
    <div className="mt-4 mb-4 px-6">
      <div className="border-border flex gap-2 overflow-x-auto border-b pb-2">
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
              className={`flex h-auto items-center gap-2 rounded-none border-b-2 bg-transparent px-4 py-3 text-sm font-semibold transition-all duration-200 hover:bg-transparent ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground border-transparent"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {count !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
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
