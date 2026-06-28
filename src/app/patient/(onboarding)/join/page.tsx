import { Suspense } from "react";
import { getMetadata } from "@/lib/metadata";
import { OnboardingWorkspace } from "@/components/patient/onboarding/workspace";

export const metadata = getMetadata(
  "Join Dwen Wo Ho",
  "Create your Dwen Wo Ho patient account with your phone or email and enter Lock In.",
  "/patient/join",
);

export default function PatientJoinPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingWorkspace />
    </Suspense>
  );
}
