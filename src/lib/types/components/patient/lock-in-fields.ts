import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { LockInFormData } from "@/lib/types/components/patient/lock-in";

export interface LockInFrequencySelectFieldProps {
  fieldName: keyof LockInFormData;
  label: string;
  placeholder: string;
  options: string[];
  register: UseFormRegister<LockInFormData>;
  errors: FieldErrors<LockInFormData>;
}
