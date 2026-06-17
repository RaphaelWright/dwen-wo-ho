import type { SchoolIcon } from "@/lib/types/entities/school";
import type { SchoolProvider } from "@/lib/types/entities/provider";
import type {
  SchoolTab,
  SchoolPatientRecord,
} from "@/lib/types/components/curator/school-details/school-details";

export interface UseCuratorSchoolSearchProps {
  searchQuery: string;
  activeTab: SchoolTab;
  patients: SchoolPatientRecord[];
  schoolIcons: SchoolIcon[];
  providers: SchoolProvider[];
}

/** Normalized suggestion row for school-details SearchDropdown (all tabs). */
export interface SchoolDetailSearchSuggestion {
  id?: number | string;
  email?: string;
  name: string;
  score?: number;
  status?: string;
  avatarUrl?: string;
  type?: string;
  slogan?: string;
  rank?: number | string;
  time?: string;
  preview?: string;
}
