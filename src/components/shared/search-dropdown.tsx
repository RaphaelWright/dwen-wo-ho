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
        <InputGroup className="w-full relative z-20 rounded-2xl focus-within:ring-1 focus-within:ring-primary!">
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
              "absolute left-0 top-[calc(100%+8px)] z-30 w-full origin-top overflow-hidden rounded-3xl border border-border/60 bg-card/50 dark:bg-background/70 p-5 shadow-[0_16px_60px_-15px_rgba(0,0,0,0.1)] ring-1 ring-border/30 backdrop-blur-[500px]",
              fullMobileHeight &&
                "max-[1065px]:h-[60dvh] max-[1065px]:overflow-y-auto scrollbar-hide",
            )}
          >
            {/* Active Filters Chips */}
            {activeFilters.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between px-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground/70">
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
                      className="group flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/15 dark:bg-card backdrop-blur-3xl px-3 py-1.5 text-primary"
                    >
                      {filter.icon && (
                        <div className="opacity-90 flex items-center justify-center">
                          {filter.icon}
                        </div>
                      )}
                      <span className="text-[12px] font-medium text-primary">
                        {filter.label}
                      </span>
                      {onRemoveFilter && (
                        <button
                          type="button"
                          onClick={() => onRemoveFilter(filter)}
                          className="ml-1 flex items-center justify-center rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                        >
                          <X className="size-3 text-primary" />
                        </button>
                      )}
                    </m.div>
                  ))}
                </div>
                <div className="my-4 h-px w-full bg-border/50" />
              </div>
            )}

            {/* Suggestions */}
            <div className={quickFilters.length > 0 ? "mb-5" : ""}>
              <h4 className="mb-3 px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                Suggestions
              </h4>
              <div className="space-y-1">
                {suggestions.length > 0 ? (
                  suggestions.map((item) => (
                    <m.div
                      key={getSuggestionValue ? getSuggestionValue(item) : JSON.stringify(item)}
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
                      className="cursor-pointer rounded-2xl border border-transparent p-2.5 transition-colors hover:border-border/50 hover:bg-muted/60"
                    >
                      <RenderSuggestion {...item} />
                    </m.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-10 text-center">
                    <Search className="mb-2 size-6 text-muted-foreground/40" />
                    <div className="text-[13px] font-medium text-muted-foreground">
                      {emptySuggestionsMessage}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Filters */}
            {quickFilters.length > 0 && (
              <>
                <div className="my-5 h-px w-full bg-border/50" />
                <div>
                  <div className="mb-3 flex items-center justify-between px-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
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
                        className="flex items-center gap-1 text-[10px] font-bold uppercase text-destructive hover:text-destructive/80 transition-colors"
                      >
                        <RotateCcw className="size-3" />
                        Reset Filter
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-between">
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
                        className="group flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-primary transition-colors hover:bg-primary/10 hover:border-primary/20 hover:text-primary"
                      >
                        {filter.icon && (
                          <div className="opacity-80 group-hover:opacity-100 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                            {filter.icon}
                          </div>
                        )}
                        <span className="text-[12px] font-medium text-primary">
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
