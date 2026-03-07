"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { cn } from "@/lib/utils";

export interface FilterOption {
  id: string;
  label: string;
  subLabel?: string;
  icon?: React.ReactNode;
}

export interface SearchDropdownProps<T extends object> {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  placeholders?: string[];
  suggestions: T[];
  quickFilters?: FilterOption[];
  onSelectOption: (option: string) => void;
  getSuggestionValue?: (item: T) => string;
  renderSuggestion: React.ComponentType<T>;
  emptySuggestionsMessage?: string;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  fullMobileHeight?: boolean;
}

export function SearchDropdown<T extends Record<string, any>>({
  searchQuery,
  onSearchChange,
  placeholders = ["Search..."],
  suggestions,
  quickFilters = [],
  onSelectOption,
  getSuggestionValue,
  renderSuggestion: RenderSuggestion,
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
    onSelectOption(filter);
    setIsOpen(false);
  };

  return (
    <div className={`relative z-30 ${className}`} ref={containerRef}>
      <div
        className="relative w-full"
        onFocus={() => setIsOpen(true)}
        onClick={() => setIsOpen(true)}
      >
        <InputGroup className="w-full relative z-20 rounded-2xl focus-within:ring-1 focus-within:ring-primary!">
          <PlaceholdersAndVanishInput
            onChange={(e) => onSearchChange(e.target.value)}
            value={searchQuery}
            placeholders={placeholders}
            autoFocus={autoFocus}
            onSubmit={(e) => {
              e.preventDefault();
              onSearchChange("");
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
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute left-0 top-[calc(100%+8px)] z-30 w-full origin-top overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-5 shadow-[0_16px_60px_-15px_rgba(0,0,0,0.1)] ring-1 ring-border/30 backdrop-blur-2xl",
              fullMobileHeight &&
                "max-[1065px]:h-[60dvh] max-[1065px]:overflow-y-auto scrollbar-hide",
            )}
          >
            {/* Suggestions */}
            <div className={quickFilters.length > 0 ? "mb-5" : ""}>
              <h4 className="mb-3 px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                Suggestions
              </h4>
              <div className="space-y-1">
                {suggestions.length > 0 ? (
                  suggestions.map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (getSuggestionValue) {
                          handleFilterClick(getSuggestionValue(item));
                        }
                      }}
                      className="cursor-pointer rounded-2xl border border-transparent p-2.5 transition-colors hover:border-border/50 hover:bg-muted/60"
                    >
                      <RenderSuggestion {...item} />
                    </motion.div>
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
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickFilters.map((filter) => (
                      <motion.button
                        key={filter.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        onClick={() =>
                          handleFilterClick(filter.label || filter.id)
                        }
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
                      </motion.button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
