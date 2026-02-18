import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SignUpFormData } from "@/hooks/patient/usePatientSignUp";

export interface SignUpFormProps {
  email: string;
  register: UseFormRegister<SignUpFormData>;
  errors: FieldErrors<SignUpFormData>;
  showPassword: boolean;
  onTogglePassword: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export interface SignUpFooterProps {
  onBack: () => void;
}
