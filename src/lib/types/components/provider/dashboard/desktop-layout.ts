import type { SetStateAction } from "react";
import type { Variants } from "motion/react";
import type { PatientCase } from "@/lib/types/api/patient-results";
import type { ProviderAssociatedSchool } from "@/lib/types/api/providers";
import type { UrgentPatient } from "@/lib/types/entities/patient";
import type { FilterOption } from "@/lib/types/components/shared/search-dropdown";
import type { MobilePanel } from "@/lib/types/components/provider/workspace/layout";
import type { GlassNavTab } from "@/lib/types/components/ui/liquid-glass-navbar";

export type ProviderDashboardPanelVariants = Variants;

export interface ProviderDashboardPanelTransition {
  duration: number;
  ease: "easeOut";
}

export interface ProviderDashboardSearchConfig {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  topSuggestions: PatientCase[];
  localActiveFilters: FilterOption[];
  onSelectOption: (val: string) => void;
  onFilterChange: (filter: FilterOption) => void;
  removeFilter: (filter: FilterOption) => void;
  onSubmitSearch: (query: string) => void;
  onSuggestionAction: (p: PatientCase) => void;
  onResetSearch: () => void;
  getSuggestionValue: (p: PatientCase) => string;
}

export interface ProviderDashboardDesktopLayoutProps {
  activeSchool: string;
  handleSelectSchool: (id: string | number) => void;
  schools: ProviderAssociatedSchool[];
  totalPatientCount: number;
  isInitLoading: boolean;
  activeStatus: string;
  setActiveStatus: (value: SetStateAction<string>) => void;
  filteredPatients: PatientCase[];
  countForChip: (chipId: string) => number;
  urgentPatients?: UrgentPatient[];
  onUrgentPatientClick: (patient: UrgentPatient) => void;
}

export interface ProviderDashboardMobileSearchOverlayProps {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  searchConfig: ProviderDashboardSearchConfig;
  quickFilters: FilterOption[];
  setActiveSchool: (id: string) => void;
  setActiveStatus: (value: SetStateAction<string>) => void;
}

export interface ProviderDashboardMobilePanelsProps {
  activePanel: MobilePanel;
  panelVariants: ProviderDashboardPanelVariants;
  panelTransition: ProviderDashboardPanelTransition;
  activeSchool: string;
  handleSelectSchool: (id: string | number) => void;
  schools: ProviderAssociatedSchool[];
  totalPatientCount: number;
  isInitLoading: boolean;
  activeStatus: string;
  setActiveStatus: (value: SetStateAction<string>) => void;
  filteredPatients: PatientCase[];
  countForChip: (chipId: string) => number;
  urgentPatients?: UrgentPatient[];
  onUrgentPatientClick: (patient: UrgentPatient) => void;
  mobileTabs: GlassNavTab[];
  setActivePanel: (panel: MobilePanel) => void;
}
