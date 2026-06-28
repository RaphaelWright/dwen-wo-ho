import { getMetadata } from "@/lib/metadata";
import { PatientLockInSchoolPickerScreen } from "@/components/patient/lock-in/school-picker-screen";
import { OnboardingHomeProfileModalGate } from "@/components/patient/onboarding/overlays/home-profile-modal/gate";

export const metadata = getMetadata(
  "Lock In",
  "Complete your Dwen Wo Ho lock-in assessment.",
  "/patient/lock-in",
);

export default function PatientLockInPage() {
  return (
    <>
      <PatientLockInSchoolPickerScreen />
      <OnboardingHomeProfileModalGate />
    </>
  );
}
