import type { ReactNode, ComponentType } from "react";

export interface FilterOption {
  id: string;
  label: string;
  subLabel?: string;
  icon?: ReactNode;
  filterKey?: string;
  filterValue?: string;
  filterType?: "exact" | "contains" | "score" | "date";
}

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
  renderSuggestion: ComponentType<T>;
  onSubmitSearch?: (query: string) => void;
  onSuggestionAction?: (item: T) => void;
  onResetSearch?: () => void;
  emptySuggestionsMessage?: string;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  fullMobileHeight?: boolean;
}
