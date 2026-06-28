import { getMetadata } from "@/lib/metadata";
import { PatientVerifyPasswordResetScreen } from "@/components/patient/verify-password-reset/screen";

export const metadata = getMetadata(
  "Reset Password",
  "Verify your identity to reset your Dwen Wo Ho password.",
  "/patient/reset-password",
);

export default function PatientResetPasswordPage() {
  return <PatientVerifyPasswordResetScreen />;
}
