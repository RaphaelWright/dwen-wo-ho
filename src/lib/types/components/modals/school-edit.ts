import { SchoolFormData, School } from "@/lib/types/school";

export interface SchoolEditFooterProps {
  handleDisable: () => void;
  isPending: boolean;
  hasChanges: boolean;
}

export interface SchoolEditFormProps {
  formData: SchoolFormData;
  handleInputChange: (field: string, value: string) => void;
  showCampusDropdown: boolean;
  setShowCampusDropdown: (show: boolean) => void;
  selectedCampuses: string[];
  handleCampusToggle: (campus: string) => void;
  campusDropdownRef: React.RefObject<HTMLDivElement | null>;
  handleSubmit: (e: React.FormEvent) => void;
  school: School;
}

export interface SchoolEditHeaderProps {
  onClose: () => void;
}
