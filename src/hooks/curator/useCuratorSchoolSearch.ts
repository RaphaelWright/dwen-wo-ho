"use client";

import { useMemo } from "react";
import { formatProviderName } from "@/lib/utils/formatProviderName";
import { SchoolTab } from "@/lib/types/components/curator/school-details";
import { SchoolIcon } from "@/lib/types/school";
import { SchoolProvider } from "@/lib/types/provider";
import { SCHOOL_SEARCH_QUICK_FILTERS } from "@/lib/constants/components/curator/school-search";
import { compactTimeAgo } from "@/lib/utils/compactTimeAgo";

interface UseCuratorSchoolSearchProps {
  searchQuery: string;
  activeTab: SchoolTab;
  patients: any[];
  schoolIcons: SchoolIcon[];
  providers: SchoolProvider[];
}

export function useCuratorSchoolSearch({
  searchQuery,
  activeTab,
  patients,
  schoolIcons,
  providers,
}: UseCuratorSchoolSearchProps) {
  const suggestions = useMemo(() => {
    const query = searchQuery.toLowerCase();

    switch (activeTab) {
      case "patients":
        return patients
          .filter((p) => !query || p.patientName?.toLowerCase().includes(query))
          .map((p) => ({
            type: "patient" as const,
            name: p.patientName,
            score: p.lockinScore ?? null,
            status:
              (p.treatingProviders?.length ?? 0) > 0
                ? "action"
                : p.visibilityStatus === "SEEN"
                  ? "follow-up"
                  : "new",
            time: compactTimeAgo(p.createdAt || ""),
            metadata: p.comment || "No comments",
          }))
          .slice(0, query ? 5 : 4);
      case "icons":
        return schoolIcons
          .filter((i) => !query || i.name.toLowerCase().includes(query))
          .map((i) => ({
            type: "icon" as const,
            name: i.name,
            subtitle: i.slogan,
            image:
              typeof i.photoPreview === "string" ? i.photoPreview : undefined,
            metadata: `Rank #${i.rank}`,
          }))
          .slice(0, query ? 5 : 4);
      case "providers":
        return providers
          .filter(
            (p) =>
              !query ||
              formatProviderName(p.providerName, p.providerTitle)
                .toLowerCase()
                .includes(query),
          )
          .map((p) => ({
            type: "provider" as const,
            name: formatProviderName(p.providerName, p.providerTitle),
            subtitle: p.specialty ?? undefined,
            image: p.profilePhotoURL ?? undefined,
            metadata: p.applicationStatus ?? undefined,
          }))
          .slice(0, query ? 5 : 4);
      default:
        return [];
    }
  }, [searchQuery, activeTab, patients, schoolIcons, providers]);

  const quickFilters = useMemo(() => {
    return SCHOOL_SEARCH_QUICK_FILTERS[activeTab] || [];
  }, [activeTab]);

  return {
    suggestions,
    quickFilters,
  };
}
