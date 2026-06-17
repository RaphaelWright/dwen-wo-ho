"use client";

import { m } from "motion/react";
import { RotateCcw } from "lucide-react";
import type { FilterOption } from "@/lib/types/components/shared/search-dropdown";

interface SearchDropdownQuickFiltersProps {
  quickFilters: FilterOption[];
  onFilterChange?: (filter: FilterOption) => void;
  onReset?: () => void;
}

export function SearchDropdownQuickFilters({
  quickFilters,
  onFilterChange,
  onReset,
}: SearchDropdownQuickFiltersProps) {
  if (quickFilters.length === 0) return null;

  return (
    <>
      <div className="bg-border/50 my-5 h-px w-full" />
      <div>
        <div className="mb-3 flex items-center justify-between px-1">
          <h4 className="text-muted-foreground/80 text-[10px] font-bold tracking-widest uppercase">
            Quick Filters
          </h4>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="text-destructive hover:text-destructive/80 flex items-center gap-1 text-[10px] font-bold uppercase transition-colors"
            >
              <RotateCcw className="size-3" />
              Reset Filter
            </button>
          )}
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          {quickFilters.map((filter) => (
            <m.button
              key={filter.id}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={() => onFilterChange?.(filter)}
              className="group border-primary/25 bg-primary/10 text-primary hover:bg-primary/10 hover:border-primary/20 hover:text-primary flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors"
            >
              {filter.icon && (
                <div className="flex items-center justify-center opacity-80 transition-transform duration-200 group-hover:scale-110 group-hover:opacity-100">
                  {filter.icon}
                </div>
              )}
              <span className="text-primary text-[12px] font-medium">
                {filter.label}
              </span>
            </m.button>
          ))}
        </div>
      </div>
    </>
  );
}
