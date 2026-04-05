"use client";

import { useRouter } from "next/navigation";
import type { Route } from "next";
import { DYNAMIC_ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";

import {
  Loader2,
  School,
  BookMarked,
  GraduationCap,
  Building2,
} from "lucide-react";

import WidthConstraint from "@/components/ui/width-constraint";

import { useCuratorSchools } from "@/hooks/curator/use-curator-schools";

import { type FilterType } from "@/lib/types/curator";

import { FILTER_OPTIONS } from "@/lib/constants/components/curator/schools-list-search";

import { SchoolCard } from "@/components/curator/SchoolCard";

import { NotificationBell } from "@/components/shared/notification-bell";

import { useNotification } from "@/hooks/use-notification";

import { FilterTabBar } from "@/components/shared/filter-tab-bar";

import { SearchDropdown } from "@/components/shared/search-dropdown";

import { SchoolSuggestionCard } from "@/components/shared/school-suggestion-card";

import {
  SCHOOLS_LIST_SEARCH_PLACEHOLDERS,
  SCHOOL_FILTER_ICONS,
} from "@/lib/constants/components/curator/schools-list-search";

export default function SchoolsPage() {
  const {
    schoolsList,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    setAppliedSearchQuery,
    filterCounts,
    isLoading,
    hasCachedData,
    isError,
    suggestions,
    quickFilters,
    localActiveFilters,
    toggleFilter,
    removeFilter,
    clearFilters,
  } = useCuratorSchools();

  const router = useRouter();
  const { unreadCount, setIsOpen } = useNotification();

  if (isError) {
    return (
      <WidthConstraint>
        <div className="flex flex-col gap-8 p-8 items-center justify-center min-h-[40vh]">
          <div className="text-center text-destructive font-medium">
            Failed to load schools
          </div>

          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </WidthConstraint>
    );
  }

  return (
    <WidthConstraint>
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-4">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Schools
            </h1>

            <p className="text-muted-foreground text-lg">
              Manage and view all registered educational institutions
            </p>
          </div>

          {/* Header Actions */}
          <div className="hidden 2xl:flex items-center gap-4">
            <NotificationBell
              unreadCount={unreadCount}
              onOpenNotifs={() => setIsOpen(true)}
            />
          </div>
        </div>

        <div className="flex flex-col min-[1229px]:flex-row gap-4 justify-between object-center">
          {/* Search & Filters */}
          <FilterTabBar<FilterType>
            tabs={FILTER_OPTIONS.map((opt) => ({
              key: opt.value,
              label: opt.label,
              icon: SCHOOL_FILTER_ICONS[opt.value],
              count: filterCounts[opt.value],
            }))}
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
            activeTabLayoutId="curator-schools-filter"
            className="hidden min-[1229px]:flex"
          />

          <div className="w-full max-w-sm 2xl:max-w-xl">
            <SearchDropdown
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholders={SCHOOLS_LIST_SEARCH_PLACEHOLDERS}
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
              renderSuggestion={SchoolSuggestionCard}
              onSubmitSearch={(query) => {
                setAppliedSearchQuery(query);
              }}
              onSuggestionAction={(suggestion) => {
                if (suggestion && suggestion.id) {
                  router.push(
                    DYNAMIC_ROUTES.curator.schoolDetails(
                      suggestion.id,
                    ) as Route,
                  );
                }
              }}
              onResetSearch={() => {
                setSearchQuery("");
                setAppliedSearchQuery("");
                setActiveFilter("all");
                clearFilters();
              }}
              className="w-full"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading && !hasCachedData ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />

            <p className="text-muted-foreground font-medium">
              Loading schools...
            </p>
          </div>
        ) : schoolsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <School className="w-10 h-10 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                No schools found
              </h3>

              <p className="text-muted-foreground max-w-sm mx-auto">
                {activeFilter === "all"
                  ? "There are no schools registered yet."
                  : `There are no schools under the "${FILTER_OPTIONS.find((f) => f.value === activeFilter)?.label}" category.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 pb-20">
            {schoolsList.map((school, i) => (
              <div
                key={school.id}
                className="animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <SchoolCard school={school} priority={i < 3} />
              </div>
            ))}
          </div>
        )}
      </div>
    </WidthConstraint>
  );
}
