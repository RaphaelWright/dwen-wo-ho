"use client";

import type { Route } from "next";
import { SearchDropdown } from "@/components/shared/search-dropdown";
import { SCHOOL_DETAILS_SEARCH_PLACEHOLDERS } from "@/lib/constants/components/curator/school-details/tabs";
import { PatientSuggestionCard } from "@/components/shared/patient-suggestion-card/index";
import { SchoolSuggestionCard } from "@/components/shared/school-suggestion-card/index";
import { runSchoolDetailsSuggestionAction } from "@/lib/utils/curator/school-details/suggestion-action";
import type { SchoolDetailsSearchSectionProps } from "@/lib/types/components/curator/school-details/school-details";

export function SchoolDetailsSearchSection({
  activeTab,
  searchQuery,
  setSearchQuery,
  setAppliedSearchQuery,
  suggestions,
  quickFilters,
  localActiveFilters,
  toggleFilter,
  removeFilter,
  clearFilters,
  schoolId,
  schoolIcons,
  onProviderClick,
  setEditingIcon,
  setShowAddIconWizard,
  router,
}: SchoolDetailsSearchSectionProps) {
  return (
    <div className="max-w-full">
      <SearchDropdown
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholders={SCHOOL_DETAILS_SEARCH_PLACEHOLDERS[activeTab]}
        suggestions={suggestions}
        quickFilters={quickFilters}
        activeFilters={localActiveFilters}
        onSelectOption={(val) => {
          setSearchQuery(val);
        }}
        onFilterChange={(filter) => {
          if (filter.filterKey) {
            toggleFilter(filter);
          }
        }}
        onRemoveFilter={removeFilter}
        getSuggestionValue={(s) => s.name}
        renderSuggestion={(suggestion) =>
          activeTab === "icons" ? (
            <SchoolSuggestionCard
              name={suggestion.name}
              avatarUrl={suggestion.avatarUrl}
              type={suggestion.type}
              slogan={suggestion.slogan}
              rank={suggestion.rank}
            />
          ) : (
            <PatientSuggestionCard
              name={suggestion.name}
              score={suggestion.score ?? 0}
              status={suggestion.status ?? ""}
            />
          )
        }
        onSubmitSearch={(query) => setAppliedSearchQuery(query)}
        onSuggestionAction={(suggestion) =>
          runSchoolDetailsSuggestionAction(suggestion, {
            activeTab,
            schoolId,
            schoolIcons,
            router: router as { push: (href: Route) => void },
            handleProviderClick: onProviderClick,
            setEditingIcon,
            setShowAddIconWizard,
          })
        }
        onResetSearch={() => {
          setSearchQuery("");
          setAppliedSearchQuery("");
          clearFilters();
        }}
      />
    </div>
  );
}
