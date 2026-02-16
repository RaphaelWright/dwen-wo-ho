import { SchoolIcon } from "@/lib/types/school";

export interface IconsTabProps {
  icons: SchoolIcon[];
  onIconClick: (icon: SchoolIcon) => void;
  onAddFirstIcon: () => void;
}

export interface Patient {
  id: number | string;
  lockinId: number;
  patientName: string;
  lockinScore?: number;
  comment: string | null;
  createdAt?: string;
  visibilityStatus?: string;
  treatingProviders?: Array<{ id: string; fullName: string }>;
}

export interface PatientsTabProps {
  patients: Patient[];
  isLoading: boolean;
  schoolId: string;
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
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEditClick: () => void;
  onDisableClick: () => void;
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
