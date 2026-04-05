import { Area } from "@/lib/utils/image-utils";
import { School, SchoolFormData } from "./school";
import { ProviderDetails } from "./provider";
import { PROVIDER_DETAILS_TAB_VALUES } from "../constants/components/modals/provider-details";
import type { PatientResult } from "@/lib/types/patient";
import type { LockInAssessment } from "@/lib/types/lockin";

export interface ColorOption {
  hex: string;
  name: string;
}

export interface AddCoverPageModalProps {
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

export type CoverPageStep = "photo-color" | "edit-image" | "slogan";

export interface FeatureComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export interface LineupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface MemberCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberCreated?: (member: any) => void;
}

export interface PartnerCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPartnerCreated?: (partner: {
    name: string;
    nickname?: string;
    logo?: string;
  }) => void;
}

export interface PartnerDetailsModalProps {
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

export interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: number;
  schoolId: string | number;
}

// Re-export canonical types for consumers that import from this module
export type { PatientResult, LockInAssessment };

export interface PendingVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  userInfo?: {
    name: string;
    title: string;
    specialty?: string;
    profileImage?: string;
    timeAgo?: string;
  };
}

export interface ProfessionalTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (title: string) => void;
  selectedTitle?: string;
}

export interface ProviderDetailsModalProps {
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

export type ProviderDetailsTab = (typeof PROVIDER_DETAILS_TAB_VALUES)[number];

export interface ReachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SchoolCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSchoolCreated?: (school: any) => void;
}

export interface SchoolEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: School;
  onSchoolUpdated?: () => void;
  onDisableSchool?: () => void;
}

export type FilterType = "All" | "JHS" | "SHS" | "COLLEGE";

export interface SchoolSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (school: School | null) => void;
}

export interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AddIconModalProps {
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

export interface PhotoCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}
