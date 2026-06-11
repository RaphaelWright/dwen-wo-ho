import { getMetadata } from "@/lib/metadata";
import PatientVerifyPasswordResetView from "./view";

export const metadata = getMetadata(
  "Verify Password Reset",
  "Verify your identity to reset your Dwen Wo Ho password.",
  "/patient/verify-password-reset",
);

export default function PatientVerifyPasswordResetPage() {
  return <PatientVerifyPasswordResetView />;
}
