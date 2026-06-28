import { getMetadata } from "@/lib/metadata";
import PatientSignInView from "./view";

export const metadata = getMetadata(
  "Patient Sign In",
  "Sign in to your Dwen Wo Ho patient account.",
  "/patient/signin",
);

export default function PatientSignInPage() {
  return <PatientSignInView />;
}
