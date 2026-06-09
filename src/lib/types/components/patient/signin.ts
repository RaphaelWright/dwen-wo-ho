import { FieldErrors, UseFormRegister } from "react-hook-form";
import * as z from "zod/v4";
import { LoginSchema } from "@/lib/schemas/patient-auth-schema";
import type { Route } from "next";

export type PatientSignInFormData = z.infer<typeof LoginSchema>;

export interface SignInFormProps {
  email: string;
  register: UseFormRegister<PatientSignInFormData>;
  errors: FieldErrors<PatientSignInFormData>;
  showPassword: boolean;
  onTogglePassword: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  forgotPasswordHref?: Route;
}

export interface SignInFooterProps {
  onBack: () => void;
  isLoading: boolean;
  errors: FieldErrors<PatientSignInFormData>;
}
