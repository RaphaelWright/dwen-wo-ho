import { UseFormRegister, FieldErrors } from "react-hook-form";
import { LockInFormData } from "@/hooks/patient/useLockInForm";

export interface LockInDetailsSectionProps {
  register: UseFormRegister<LockInFormData>;
  errors: FieldErrors<LockInFormData>;
  reasonOptions: string[];
  timeToExamOptions: string[];
}

export interface ExamAnxietySectionProps {
  register: UseFormRegister<LockInFormData>;
  errors: FieldErrors<LockInFormData>;
  frequencyOptions: string[];
}

export interface MentalHealthSectionProps {
  register: UseFormRegister<LockInFormData>;
  errors: FieldErrors<LockInFormData>;
  frequencyOptions: string[];
  yesNoOptions: string[];
}

export interface PersonalInfoSectionProps {
  register: UseFormRegister<LockInFormData>;
  errors: FieldErrors<LockInFormData>;
}

export interface StudyHabitsSectionProps {
  register: UseFormRegister<LockInFormData>;
  errors: FieldErrors<LockInFormData>;
  motivationOptions: string[];
  studyFrequencyOptions: string[];
}

export interface FormActionButtonsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export interface LockInHeaderProps {
  onBack: () => void;
}
