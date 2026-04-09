import { SchoolIcon } from "@/lib/types/school";

export interface IconsTabProps {
  icons: SchoolIcon[];
  onIconClick: (icon: SchoolIcon) => void;
  onAddFirstIcon: () => void;
}

export interface SchoolPatientRecord {
  id: number | string;
  lockinId: number;
  schoolId: number;
  schoolName: string;
  schoolNickname: string;
  patientName: string;
  patientAge?: number;
  patientSex?: string;
  visibilityStatus: string;
  starProvider?: string | null;
  referredProvider?: string | null;
  createdAt: string;
  firstOpenedAt?: string | null;
  openedByCurrentUser?: boolean;
  treatingProviders?: string[];
  lockinScore: number;
  comment?: string | null;
  patientLevel: string;
}

export interface PatientsTabProps {
  patients: SchoolPatientRecord[];
  isLoading: boolean;
  schoolId: string;
  schoolName?: string;
  compactTimeAgo: (date: string) => string;
  onViewPatient: (patientId: number | string) => void;
}

export interface SchoolHeaderCardProps {
  school: {
    name: string;
    logo?: string;
    nickname?: string;
    motto?: string;
  };
  campusLabel: string | null;
  onEditClick: () => void;
  onDisableClick: () => void;
  searchComponent?: React.ReactNode;
}

export type SchoolTab = "patients" | "icons" | "providers";

export interface SchoolTabNavigationProps {
  activeTab: SchoolTab;
  onTabChange: (tab: SchoolTab) => void;
  patientsCount: number;
  iconsCount: number;
  providersCount: number;
  onAddIconClick: () => void;
}

export interface UrgentCarePatient {
  id?: number | string;
  lockinId?: number | string;
  patientResultId?: number | string;
  schoolId?: number | string;
  patientName?: string;
  lockedInScore?: number | null;
  urgentCareEnteredAt?: string;
  lockinDate?: string;
  createdAt?: string;
}

export interface UrgentCareSidebarProps {
  urgentCare: {
    totalUrgentCarePatients: number;
    patients: UrgentCarePatient[];
  };
  isLoading: boolean;
  compactTimeAgo: (date: string) => string;
  onLogoClick: () => void;
}
