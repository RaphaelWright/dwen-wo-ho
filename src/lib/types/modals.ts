import { Area } from "@/lib/utils/image-utils";
import { School } from "./school";
import { ProviderDetails } from "./provider";

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

export type PartnerDetailsTab = "overview" | "schools" | "providers";

export interface AssociatedSchool {
  id: string | number;
  name: string;
  logo?: string;
}

export interface AssociatedProvider {
  id: string;
  email: string;
  providerName: string;
  providerTitle?: string | null;
  specialty?: string;
  profilePhotoURL?: string;
}

export interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: number;
  schoolId: string | number;
}

export interface PatientResult {
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

export interface LockInAssessment {
  fullName: string;
  age: number;
  sex: string;
  school: string;
  generalMentalHealth: string;
  generalMentalHealthScore: string;
  generalMentalHealthColor: string;
  possibleDepressionScore: string;
  possibleDepressionDescription: string;
  possibleDepressionColor: string;
  lonelinessScore: string;
  lonelinessScoreDescription: string;
  lonelinessColor: string;
  suicidalRiskScore: string;
  suicidalRiskScoreDescription: string;
  suicidalRiskColor: string;
  examAnxiety: string;
  examAnxietyScore: string;
  examAnxietyColor: string;
  coreAnxietyScore: string;
  coreAnxietyScoreDescription: string;
  coreAnxietyColor: string;
  physicalDistressScore: string;
  physicalDistressScoreDescription: string;
  physicalDistressColor: string;
  examPrep: string;
  examPrepScore: string;
  examPrepColor: string;
  motivationScore: string;
  motivationScoreDescription: string;
  motivationColor: string;
  studySkillsScore: string;
  studySkillsScoreDescription: string;
  studySkillsColor: string;
  procrastinationScore: string;
  procrastinationScoreDescription: string;
  procrastinationColor: string;
  lockedInScore: string;
  lockedInScoreDescription: string;
  lockedInColor: string;
}

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

export type ProviderDetailsTab = "overview" | "schools" | "partners";

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

export type SchoolFormData = {
  name: string;
  nickname: string;
  type: string;
  baseline: string;
  motto: string;
  campuses: string[];
  logo: File | null;
};

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
