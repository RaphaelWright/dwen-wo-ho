import { getMetadata } from "@/lib/metadata";
import PatientNewPasswordView from "./view";

export const metadata = getMetadata(
  "Reset Password",
  "Set a new password for your Dwen Wo Ho patient account.",
  "/patient/new-password",
);

export default function PatientNewPasswordPage() {
  return <PatientNewPasswordView />;
}
