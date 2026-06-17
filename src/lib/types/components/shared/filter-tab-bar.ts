import type { LucideIcon } from "lucide-react";

export interface FilterTabItem<T extends string = string> {
  key: T;
  label: string;
  icon: LucideIcon;
  count?: number;
}

export interface FilterTabBarProps<T extends string = string> {
  /** Tab items: key, label, icon, optional count */
  tabs: FilterTabItem<T>[];
  /** Currently active tab key */
  activeTab: T;
  /** Called when user selects a tab */
  onTabChange: (key: T) => void;
  /** Optional search: placeholders per active tab (array or function) */
  searchPlaceholders?: string[] | ((activeTab: T) => string[]);
  /** Controlled search value */
  searchQuery?: string;
  /** Called when search input changes */
  onSearchChange?: (query: string) => void;
  /** Optional slot for tab-specific actions (e.g. "Add Icon" when icons tab is active) */
  renderActions?: (activeTab: T) => React.ReactNode;
  /** Whether to show count badges on tabs (default: true when counts are provided) */
  showCount?: boolean;
  /** Custom class for the root container */
  className?: string;
  /** Custom class for the tabs pill container */
  tabsClassName?: string;
  /** Custom class for the search input wrapper */
  searchClassName?: string;
  /** Custom class for the search input itself (passed to PlaceholdersAndVanishInput) */
  searchInputClassName?: string;
  /** Width of search container: "full" | "sm" | "md" | "auto" (default: "md") */
  searchWidth?: "full" | "sm" | "md" | "auto";
  /** Optional layoutId for the active tab indicator (use unique id if multiple FilterTabBars on page) */
  activeTabLayoutId?: string;
}
