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

export interface CuratorPatientResult {
  id: number;
  lockinId: number;
  schoolId: number;
  schoolName: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  visibilityStatus: "NEW" | "SEEN";
  starProvider: {
    id: string;
    fullName: string;
    email: string;
    professionalTitle: string;
    specialty: string;
  } | null;
  referredProvider: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  createdAt: string;
  firstOpenedAt: string | null;
  treatingProviders: Array<{
    id: string;
    fullName: string;
  }>;
}
