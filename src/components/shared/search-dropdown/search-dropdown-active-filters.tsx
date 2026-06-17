"use client";

import { m } from "motion/react";
import { X } from "lucide-react";
import type { FilterOption } from "@/lib/types/components/shared/search-dropdown";

interface SearchDropdownActiveFiltersProps {
  activeFilters: FilterOption[];
  onRemoveFilter?: (filter: FilterOption) => void;
}

export function SearchDropdownActiveFilters({
  activeFilters,
  onRemoveFilter,
}: SearchDropdownActiveFiltersProps) {
  if (activeFilters.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between px-1">
        <h4 className="text-foreground/70 text-[10px] font-bold tracking-widest uppercase">
          Active Filters
        </h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter) => (
          <m.div
            key={filter.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group border-primary/30 bg-primary/15 dark:bg-card text-primary flex items-center gap-1.5 rounded-full border px-3 py-1.5 backdrop-blur-3xl"
          >
            {filter.icon && (
              <div className="flex items-center justify-center opacity-90">
                {filter.icon}
              </div>
            )}
            <span className="text-primary text-[12px] font-medium">
              {filter.label}
            </span>
            {onRemoveFilter && (
              <button
                type="button"
                onClick={() => onRemoveFilter(filter)}
                className="hover:bg-primary/20 ml-1 flex items-center justify-center rounded-full p-0.5 transition-colors"
              >
                <X className="text-primary size-3" />
              </button>
            )}
          </m.div>
        ))}
      </div>
      <div className="bg-border/50 my-4 h-px w-full" />
    </div>
  );
}
