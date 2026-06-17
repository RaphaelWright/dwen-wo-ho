"use client";

import { useCuratorPatientDetails } from "@/hooks/curator/patient-details/use-patient-details";
import {
  PatientDetailsErrorView,
  PatientDetailsLoadingView,
} from "@/components/curator/patient-dashboard/page-states";
import { PatientDetailsPageContent } from "@/components/curator/patient-dashboard/page-content";

export default function PatientDetailsPage() {
  const details = useCuratorPatientDetails();
  const { router, patientResult, lockInAssessment, isLoading } = details;

  if (isLoading) {
    return <PatientDetailsLoadingView />;
  }

  if (!patientResult || !lockInAssessment) {
    return <PatientDetailsErrorView onBack={() => router.back()} />;
  }

  return <PatientDetailsPageContent details={details} />;
}
