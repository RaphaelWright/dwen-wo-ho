import { FieldErrors, UseFormRegister } from "react-hook-form";
import type { Route } from "next";

export interface BaseSignInFormProps {
  role: "patient" | "provider";
  email: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  errors: FieldErrors;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onBack: () => void;
  onForgotPassword?: () => void;
  onRecoverAccount?: () => void;
  isLoading: boolean;
  isRecovering?: boolean;
  errorMessage?: string;
  forgotPasswordHref?: Route;
}
