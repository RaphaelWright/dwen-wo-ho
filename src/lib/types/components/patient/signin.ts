import { FieldErrors, UseFormRegister } from "react-hook-form";
import { PatientSignInFormData } from "@/hooks/patient/usePatientSignIn";
import type { Route } from "next";

export interface SignInFormProps {
  email: string;
  register: UseFormRegister<PatientSignInFormData>;
  errors: FieldErrors<PatientSignInFormData>;
  showPassword: boolean;
  onTogglePassword: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errorMessage?: string;
  forgotPasswordHref?: Route;
}

export interface SignInFooterProps {
  onBack: () => void;
  isLoading: boolean;
  errors: FieldErrors<PatientSignInFormData>;
}
