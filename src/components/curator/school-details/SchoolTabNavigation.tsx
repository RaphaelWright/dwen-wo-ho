"use client";

import { Users } from "lucide-react";
import { SCHOOL_TABS_CONFIG } from "@/lib/constants/components/curator/school-details";
import { Button } from "@/components/ui/button";
import { FilterTabBar } from "@/components/shared/filter-tab-bar";
import { SchoolTabNavigationProps } from "@/lib/types/components/curator/school-details";
import type { SchoolTab } from "@/lib/types/components/curator/school-details";

export function SchoolTabNavigation({
  activeTab,
  onTabChange,
  patientsCount,
  iconsCount,
  providersCount,
  onAddIconClick,
}: SchoolTabNavigationProps) {
  const tabs = SCHOOL_TABS_CONFIG.map((tab) => ({
    ...tab,
    count:
      tab.key === "patients"
        ? patientsCount
        : tab.key === "icons"
          ? iconsCount
          : providersCount,
  }));

  return (
    <FilterTabBar<SchoolTab>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      renderActions={(tab) =>
        tab === "icons" ? (
          <Button
            onClick={onAddIconClick}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 rounded-xl"
          >
            <Users className="w-4 h-4 mr-2" />
            Add Icon
          </Button>
        ) : null
      }
      className="mb-8"
    />
  );
}
