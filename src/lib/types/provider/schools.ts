export type FilterType = "all" | "JHS" | "SHS" | "COLLEGE";

export interface ProviderSchoolsHeaderProps {
  title?: string;
  description?: string;
}

export interface ProviderSchoolsFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
}

export interface SchoolCardProps {
  school: any; // Will refine with SchoolWithExtras type
  onClick: (id: string | number) => void;
}

export interface ProviderSchoolsListProps {
  schools: any[]; // Will refine with SchoolWithExtras type
  isLoading: boolean;
  activeFilter: FilterType;
  onSchoolClick: (id: string | number) => void;
}
