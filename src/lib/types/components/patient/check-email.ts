import {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";
import { PatientCheckEmailFormData } from "@/hooks/patient/usePatientCheckEmail";

export interface CheckEmailFormProps {
  register: UseFormRegister<PatientCheckEmailFormData>;
  handleSubmit: UseFormHandleSubmit<PatientCheckEmailFormData>;
  onSubmit: (data: PatientCheckEmailFormData) => void;
  errors: FieldErrors<PatientCheckEmailFormData>;
  isValidEmail: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
