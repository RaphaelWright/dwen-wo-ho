import { getMetadata } from "@/lib/metadata";
import PatientSignUpView from "./view";

export const metadata = getMetadata(
  "Patient Sign Up",
  "Create your Dwen Wo Ho patient account.",
  "/patient/signup",
);

export default function PatientSignUpPage() {
  return <PatientSignUpView />;
}
