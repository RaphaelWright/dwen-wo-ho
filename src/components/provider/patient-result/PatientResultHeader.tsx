"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PatientResultHeaderProps } from "@/lib/types/provider/patient-result";

export function PatientResultHeader({
  patientResult,
  isTreating,
}: PatientResultHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8">
      <Button
        onClick={() => router.back()}
        variant="outline"
        className="w-fit mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {patientResult.patientName}
          </h1>
          <div className="flex items-center gap-4 text-gray-600 text-base">
            <p>{patientResult.patientAge} years old</p>
            <span>•</span>
            <p>{patientResult.patientSex}</p>
            <span>•</span>
            <p>{patientResult.schoolName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {patientResult.visibilityStatus === "NEW" && (
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
              New
            </span>
          )}
          {isTreating && (
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Treating
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
