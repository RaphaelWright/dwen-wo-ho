import { FieldErrors, UseFormRegister } from "react-hook-form";
import type { Route } from "next";

export type AuthStep = "check-email" | "sign-in" | "sign-up" | "reset-password";

export interface BaseSignInFormProps {
  audience: "patient" | "provider";
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
  successMessage?: string;
  forgotPasswordHref?: Route;
}
