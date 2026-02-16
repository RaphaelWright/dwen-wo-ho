import { Partner, School, SchoolReach, SchoolIcon } from "./school";
import { SchoolProvider } from "./provider";

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


