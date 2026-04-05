import { UseFormRegister, FieldErrors } from "react-hook-form";
import * as z from "zod/v4";
import { PatientSignUpSchema } from "@/lib/schemas/patient-auth-schema";

export type SignUpFormData = z.infer<typeof PatientSignUpSchema>;

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
