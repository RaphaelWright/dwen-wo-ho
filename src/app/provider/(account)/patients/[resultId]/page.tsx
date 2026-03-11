"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { usePatientResult } from "@/hooks/provider/use-patient-result";
import {
  PatientResultHeader,
  PatientInfoCard,
  ProviderInfoCard,
  LockInAssessmentCard,
} from "@/components/provider/patient-result";

export default function PatientResultPage() {
  const {
    router,
    patientResult,
    lockInAssessment,
    isLoading,
    isUpdating,
    isTreating,
    handleUpdateActionStatus,
    getColorClass,
  } = usePatientResult();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4" />
          <p className="text-gray-500">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (!patientResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="text-center py-20">
            <p className="text-gray-500">Patient result not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <PatientResultHeader
          patientResult={patientResult}
          isTreating={isTreating}
        />

        {/* Action Buttons */}
        <div className="mb-6 flex gap-3">
          {!isTreating && (
            <Button
              onClick={() => handleUpdateActionStatus("TREATING")}
              disabled={isUpdating}
              className="bg-[#955aa4] hover:bg-[#955aa4]/90 px-6 py-2.5"
            >
              {isUpdating ? "Updating..." : "Start Treating"}
            </Button>
          )}
        </div>

        <PatientInfoCard patientResult={patientResult} />

        <ProviderInfoCard patientResult={patientResult} />

        {lockInAssessment && (
          <LockInAssessmentCard
            lockInAssessment={lockInAssessment}
            getColorClass={getColorClass}
          />
        )}
      </div>
    </div>
  );
}
