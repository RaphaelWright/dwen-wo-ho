import { getMetadata } from "@/lib/metadata";
import PatientLockInSchoolView from "./view";

export const metadata = getMetadata(
  "Lock In",
  "Complete your Dwen Wo Ho lock-in assessment.",
  "/patient/lock-in",
);

export default function PatientLockInSchoolPage() {
  return <PatientLockInSchoolView />;
}
