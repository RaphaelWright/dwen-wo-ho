import { UseFormRegister, FieldErrors } from "react-hook-form";
import * as z from "zod/v4";
import { SignUpSchema } from "@/lib/schemas/patient-auth-schema";

export type SignUpFormData = z.infer<typeof SignUpSchema>;

export interface NewPasswordFormProps {
  register: UseFormRegister<SignUpFormData>;
  errors: FieldErrors<SignUpFormData>;
  showPassword: boolean;
  onTogglePassword: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export interface NewPasswordFooterProps {
  onBack: () => void;
  isSubmitting?: boolean;
}
