import { getMetadata } from "@/lib/metadata";
import { PatientNewPasswordScreen } from "@/components/patient/new-password/screen";

export const metadata = getMetadata(
  "Set New Password",
  "Set a new password for your Dwen Wo Ho patient account.",
  "/patient/reset-password/new",
);

export default function PatientResetPasswordNewPage() {
  return <PatientNewPasswordScreen />;
}
