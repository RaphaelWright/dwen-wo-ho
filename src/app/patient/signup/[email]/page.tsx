import { getMetadata } from "@/lib/metadata";
import PatientSignUpVerifyView from "./view";

export const metadata = getMetadata(
  "Verify Email",
  "Verify your email address to complete your Dwen Wo Ho sign up.",
  "/patient/signup",
);

export default function PatientSignUpVerifyPage() {
  return <PatientSignUpVerifyView />;
}
