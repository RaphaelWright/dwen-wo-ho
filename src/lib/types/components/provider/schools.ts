import { School } from "@/lib/types/entities/school";

import { FilterType } from "@/lib/types/components/shared/school-filter";

export type { FilterType };

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
  school: School;
  onClick: (id: string | number) => void;
}

export interface ProviderSchoolsListProps {
  schools: School[];
  isLoading: boolean;
  activeFilter: FilterType;
  onSchoolClick: (id: string | number) => void;
}
