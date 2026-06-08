import { Partner, School, SchoolReach, SchoolIcon } from "./school";
import { SchoolProvider } from "./provider";
import {
  SchoolTab,
  SchoolPatientRecord,
} from "@/lib/types/components/curator/school-details";

export interface CoverPage {
  id: string;
  photo: File | string;
  photoPreview: string;
  color: string;
  slogan: string;
  schoolId: number | string | null;
}

export interface OverviewTabProps {
  school: School;
}

export interface ProvidersTabProps {
  providers: SchoolProvider[];
  isLoading: boolean;
  onProviderClick: (provider: SchoolProvider) => void;
}

export interface PartnersTabProps {
  partners: Partner[];
  isLoading: boolean;
}

export interface ReachTabProps {
  reach: SchoolReach | null;
  isLoading: boolean;
}

export type { PatientResultResponse as CuratorPatientResult } from "./api/patient-results";

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

export type FilterType = "all" | "JHS" | "SHS" | "COLLEGE";
