import type { School, SchoolFormData } from "@/lib/types/entities/school";

export interface SchoolEditPanelFooterProps {
  handleDisable: () => void;
  isPending: boolean;
  hasChanges: boolean;
}

export interface SchoolEditPanelFormProps {
  formData: SchoolFormData;
  handleInputChange: (field: string, value: string) => void;
  showCampusDropdown: boolean;
  setShowCampusDropdown: (show: boolean) => void;
  selectedCampuses: string[];
  handleCampusToggle: (campus: string) => void;
  campusDropdownRef: React.RefObject<HTMLDivElement | null>;
  handleSubmit: (e: React.SubmitEvent) => void;
  school: School;
}

export interface SchoolEditPanelHeaderProps {
  onClose: () => void;
}
