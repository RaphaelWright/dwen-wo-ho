import { getMetadata } from "@/lib/metadata";
import PatientCheckEmailView from "./view";

export const metadata = getMetadata(
  "Check Your Email",
  "Confirm your email address to continue with Dwen Wo Ho.",
  "/patient/check-email",
);

export default function PatientCheckEmailPage() {
  return <PatientCheckEmailView />;
}
