import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SignUpFormData } from "@/hooks/patient/usePatientNewPassword";

export interface NewPasswordFormProps {
  register: UseFormRegister<SignUpFormData>;
  errors: FieldErrors<SignUpFormData>;
  showPassword: boolean;
  onTogglePassword: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export interface NewPasswordFooterProps {
  onBack: () => void;
}
