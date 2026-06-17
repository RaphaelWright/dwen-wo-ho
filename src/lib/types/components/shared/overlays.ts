import type { Area } from "@/lib/types/components/shared/geometry";
import type { ReactNode } from "react";
import type { School } from "@/lib/types/entities/school";
import type { ProviderDetails } from "@/lib/types/entities/provider";
import { PROVIDER_DETAILS_TAB_VALUES } from "@/lib/constants/components/curator/providers/provider-details-panel";

export interface AnimatedModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  panelClassName?: string;
  backdropClassName?: string;
}

export interface ColorOption {
  hex: string;
  name: string;
}

export type CoverPageStep = "photo-color" | "edit-image" | "slogan";

export type SchoolPickerFilter = "All" | "JHS" | "SHS" | "COLLEGE";

export interface AddCoverPageWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    photo: File | null;
    color: string;
    slogan: string;
  }) => void;
  editData?: {
    photoPreview: string;
    color: string;
    slogan: string;
  } | null;
}

export interface PartnerDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  partnerId: string | number;
  partner?: {
    id: string | number;
    name: string;
    nickname?: string;
    slogan?: string;
    logo?: string;
  };
}

export interface ProviderDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  providerEmail: string;
  provider?: ProviderDetails;
  onShowApproveModal?: (email: string) => void;
  onShowRejectModal?: (email: string) => void;
  isModerating?: boolean;
  currentAction?: "approving" | "rejecting" | null;
  moderatingProviderEmail?: string | null;
}

export type ProviderDetailsPanelTab =
  (typeof PROVIDER_DETAILS_TAB_VALUES)[number];

export interface SchoolEditPanelProps {
  isOpen: boolean;
  onClose: () => void;
  school: School;
  onSchoolUpdated?: () => void;
  onDisableSchool?: () => void;
}

export interface SchoolSelectionPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (school: School | null) => void;
}

export interface AddIconWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    photo: File | null;
    name: string;
    slogan: string;
    rank: number;
    lockIns: string[];
  }) => void;
  editData?: {
    photoPreview: string;
    name: string;
    slogan: string;
    rank: number;
    lockIns?: string[];
  } | null;
  selectedSchool: School | null;
}

export interface PhotoCropperOverlayProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}
