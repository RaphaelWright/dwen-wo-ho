"use client";

import { m, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { FilterOption } from "@/lib/types/components/shared/search-dropdown";
import type { ComponentType } from "react";
import { SearchDropdownActiveFilters } from "./search-dropdown-active-filters";
import { SearchDropdownSuggestions } from "./search-dropdown-suggestions";
import { SearchDropdownQuickFilters } from "./search-dropdown-quick-filters";

interface SearchDropdownPanelProps<T extends object> {
  isOpen: boolean;
  fullMobileHeight?: boolean;
  activeFilters: FilterOption[];
  onRemoveFilter?: (filter: FilterOption) => void;
  suggestions: T[];
  quickFilters: FilterOption[];
  emptySuggestionsMessage: string;
  getSuggestionValue?: (item: T) => string;
  renderSuggestion: ComponentType<T>;
  onSuggestionClick: (item: T) => void;
  onFilterChange?: (filter: FilterOption) => void;
  onResetSearch?: () => void;
  onSearchChange: (v: string) => void;
  onClose: () => void;
}

export function SearchDropdownPanel<T extends object>({
  isOpen,
  fullMobileHeight,
  activeFilters,
  onRemoveFilter,
  suggestions,
  quickFilters,
  emptySuggestionsMessage,
  getSuggestionValue,
  renderSuggestion,
  onSuggestionClick,
  onFilterChange,
  onResetSearch,
  onSearchChange,
  onClose,
}: SearchDropdownPanelProps<T>) {
  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "border-border/60 bg-card/50 dark:bg-background/70 ring-border/30 absolute top-[calc(100%+8px)] left-0 z-30 w-full origin-top overflow-hidden rounded-3xl border p-5 shadow-[0_16px_60px_-15px_rgba(0,0,0,0.1)] ring-1 backdrop-blur-[500px]",
            fullMobileHeight &&
              "scrollbar-hide max-[1065px]:h-[60dvh] max-[1065px]:overflow-y-auto",
          )}
        >
          <SearchDropdownActiveFilters
            activeFilters={activeFilters}
            onRemoveFilter={onRemoveFilter}
          />
          <SearchDropdownSuggestions
            suggestions={suggestions}
            quickFiltersCount={quickFilters.length}
            emptySuggestionsMessage={emptySuggestionsMessage}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            onSuggestionClick={onSuggestionClick}
          />
          <SearchDropdownQuickFilters
            quickFilters={quickFilters}
            onFilterChange={onFilterChange}
            onReset={
              onResetSearch
                ? () => {
                    onSearchChange("");
                    onResetSearch();
                    onClose();
                  }
                : undefined
            }
          />
        </m.div>
      )}
    </AnimatePresence>
  );
}
