"use client";

import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "motion/react";
import { Search, RotateCcw, X } from "lucide-react";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { cn } from "@/lib/utils";

export interface FilterOption {
  id: string;
  label: string;
  subLabel?: string;
  icon?: React.ReactNode;
  filterKey?: string;
  filterValue?: string;
  filterType?: "exact" | "contains" | "score" | "date";
}

const EMPTY_FILTER_OPTIONS: FilterOption[] = [];

export interface SearchDropdownProps<T extends object> {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  placeholders?: string[];
  suggestions: T[];
  quickFilters?: FilterOption[];
  activeFilters?: FilterOption[];
  onSelectOption: (option: string) => void;
  onFilterChange?: (filter: FilterOption) => void;
  onRemoveFilter?: (filter: FilterOption) => void;
  getSuggestionValue?: (item: T) => string;
  renderSuggestion: React.ComponentType<T>;
  onSubmitSearch?: (query: string) => void;
  onSuggestionAction?: (item: T) => void;
  onResetSearch?: () => void;
  emptySuggestionsMessage?: string;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  fullMobileHeight?: boolean;
}

export function SearchDropdown<T extends object>({
  searchQuery,
  onSearchChange,
  placeholders = ["Search..."],
  suggestions,
  quickFilters = EMPTY_FILTER_OPTIONS,
  activeFilters = EMPTY_FILTER_OPTIONS,
  onSelectOption,
  onFilterChange,
  onRemoveFilter,
  getSuggestionValue,
  renderSuggestion: RenderSuggestion,
  onSubmitSearch,
  onSuggestionAction,
  onResetSearch,
  emptySuggestionsMessage = "No matching results found.",
  className = "",
  autoFocus = false,
  fullMobileHeight = false,
}: SearchDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterClick = (filter: string) => {
    // If not decoupled, fallback to onSelectOption
    if (onSelectOption) {
      onSelectOption(filter);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative z-30 ${className}`} ref={containerRef}>
      <div
        className="relative w-full"
        // Opening on focus covers both pointer (clicking the field focuses it)
        // and keyboard (tabbing in) without a click handler on a static node.
        onFocus={() => setIsOpen(true)}
      >
        <InputGroup className="focus-within:ring-primary! relative z-20 w-full rounded-2xl focus-within:ring-1">
          <PlaceholdersAndVanishInput
            onChange={(e) => onSearchChange(e.target.value)}
            value={searchQuery}
            placeholders={placeholders}
            autoFocus={autoFocus}
            onSubmit={(e) => {
              e.preventDefault();
              if (onSubmitSearch) {
                onSubmitSearch(searchQuery);
              }
              setIsOpen(false);
            }}
            className="h-11/12 border-0 bg-transparent! shadow-none focus:outline-none"
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

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
            {/* Active Filters Chips */}
            {activeFilters.length > 0 && (
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
            )}

            {/* Suggestions */}
            <div className={quickFilters.length > 0 ? "mb-5" : ""}>
              <h4 className="text-muted-foreground/80 mb-3 px-1 text-[10px] font-bold tracking-widest uppercase">
                Suggestions
              </h4>
              <div className="space-y-1">
                {suggestions.length > 0 ? (
                  suggestions.map((item) => (
                    <m.div
                      key={
                        getSuggestionValue
                          ? getSuggestionValue(item)
                          : JSON.stringify(item)
                      }
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (onSuggestionAction) {
                          onSuggestionAction(item);
                          setIsOpen(false);
                        } else if (getSuggestionValue) {
                          handleFilterClick(getSuggestionValue(item));
                        }
                      }}
                      className="hover:border-border/50 hover:bg-muted/60 cursor-pointer rounded-2xl border border-transparent p-2.5 transition-colors"
                    >
                      <RenderSuggestion {...item} />
                    </m.div>
                  ))
                ) : (
                  <div className="border-border/60 bg-muted/20 flex flex-col items-center justify-center rounded-2xl border border-dashed py-10 text-center">
                    <Search className="text-muted-foreground/40 mb-2 size-6" />
                    <div className="text-muted-foreground text-[13px] font-medium">
                      {emptySuggestionsMessage}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Filters */}
            {quickFilters.length > 0 && (
              <>
                <div className="bg-border/50 my-5 h-px w-full" />
                <div>
                  <div className="mb-3 flex items-center justify-between px-1">
                    <h4 className="text-muted-foreground/80 text-[10px] font-bold tracking-widest uppercase">
                      Quick Filters
                    </h4>
                    {onResetSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          onSearchChange("");
                          onResetSearch();
                          setIsOpen(false);
                        }}
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
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        onClick={() => {
                          if (onFilterChange) {
                            onFilterChange(filter);
                          }
                        }}
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
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
