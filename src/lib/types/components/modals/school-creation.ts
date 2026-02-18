import { SchoolFormData } from "@/hooks/components/modals/use-school-creation";

export interface SchoolHeaderProps {
  currentStep: number;
  handleClose: () => void;
}

export interface StepIndicatorProps {
  currentStep: number;
}

export interface FormStepProps {
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

export interface PreviewStepProps {
  formData: SchoolFormData;
  selectedCampuses: string[];
}

export interface SchoolFooterProps {
  currentStep: number;
  handleClose: () => void;
  handleNext: () => void;
  handleBack: () => void;
  handleConfirm: () => void;
  isFormValid: boolean;
  isPending: boolean;
}
