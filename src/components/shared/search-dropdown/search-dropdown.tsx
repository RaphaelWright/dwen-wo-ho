"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import type { SearchDropdownProps } from "@/lib/types/components/shared/search-dropdown";
import { SearchDropdownPanel } from "./search-dropdown-panel";

const EMPTY_FILTER_OPTIONS: SearchDropdownProps<object>["quickFilters"] = [];

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

  const handleSuggestionClick = (item: T) => {
    if (onSuggestionAction) {
      onSuggestionAction(item);
      setIsOpen(false);
    } else if (getSuggestionValue) {
      onSelectOption(getSuggestionValue(item));
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative z-30 ${className}`} ref={containerRef}>
      <div className="relative w-full" onFocus={() => setIsOpen(true)}>
        <InputGroup className="focus-within:ring-primary! relative z-20 w-full rounded-2xl focus-within:ring-1">
          <PlaceholdersAndVanishInput
            onChange={(e) => onSearchChange(e.target.value)}
            value={searchQuery}
            placeholders={placeholders}
            autoFocus={autoFocus}
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitSearch?.(searchQuery);
              setIsOpen(false);
            }}
            className="h-11/12 border-0 bg-transparent! shadow-none focus:outline-none"
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <SearchDropdownPanel
        isOpen={isOpen}
        fullMobileHeight={fullMobileHeight}
        activeFilters={activeFilters ?? []}
        onRemoveFilter={onRemoveFilter}
        suggestions={suggestions}
        quickFilters={quickFilters ?? []}
        emptySuggestionsMessage={emptySuggestionsMessage}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={RenderSuggestion}
        onSuggestionClick={handleSuggestionClick}
        onFilterChange={onFilterChange}
        onResetSearch={onResetSearch}
        onSearchChange={onSearchChange}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
