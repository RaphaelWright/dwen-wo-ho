import type { ChangeEvent, FormEvent, RefObject } from "react";
import type { SchoolFormData } from "@/lib/types/entities/school";

export interface CreateLauncherProps {
  setShowCreateLauncher: (show: boolean) => void;
  onOpenSchoolModal?: () => void;
  onOpenMemberModal?: () => void;
  onOpenPartnerModal?: () => void;
  onOpenReachOverview?: () => void;
}

export interface PartnerCreateFormProps {
  name: string;
  setName: (value: string) => void;
  nickname: string;
  setNickname: (value: string) => void;
  slogan: string;
  setSlogan: (value: string) => void;
  logo: string | null | undefined;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onPickLogo: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export interface SchoolCreateHeaderProps {
  currentStep: number;
  handleClose: () => void;
}

export interface SchoolCreateStepIndicatorProps {
  currentStep: number;
}

export interface SchoolCreateFormStepProps {
  formData: SchoolFormData;
  handleInputChange: (field: string, value: string) => void;
  showCampusDropdown: boolean;
  setShowCampusDropdown: (show: boolean) => void;
  selectedCampuses: string[];
  handleCampusToggle: (campus: string) => void;
  campusDropdownRef: React.RefObject<HTMLDivElement | null>;
  handleLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveLogo: () => void;
}

export interface SchoolCreatePreviewStepProps {
  formData: SchoolFormData;
  selectedCampuses: string[];
}

export interface SchoolCreateFooterProps {
  currentStep: number;
  handleClose: () => void;
  handleNext: () => void;
  handleBack: () => void;
  handleConfirm: () => void;
  isFormValid: boolean;
  isPending: boolean;
}
