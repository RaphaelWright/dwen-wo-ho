import {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";
import * as z from "zod/v4";
import { PatientCheckEmailFormSchema } from "@/lib/schemas/patient-auth-schema";

export type PatientCheckEmailFormData = z.infer<
  typeof PatientCheckEmailFormSchema
>;

export interface CheckEmailFormProps {
  register: UseFormRegister<PatientCheckEmailFormData>;
  handleSubmit: UseFormHandleSubmit<PatientCheckEmailFormData>;
  onSubmit: (data: PatientCheckEmailFormData) => void;
  errors: FieldErrors<PatientCheckEmailFormData>;
  isValidEmail: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
