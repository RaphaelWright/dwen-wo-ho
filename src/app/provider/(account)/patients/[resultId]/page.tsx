"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePatientResult } from "@/hooks/provider/usePatientResult";

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
        {/* Header */}
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

        {/* Patient Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Patient Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-semibold text-gray-900">
                {patientResult.patientName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Age</p>
              <p className="font-semibold text-gray-900">
                {patientResult.patientAge}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sex</p>
              <p className="font-semibold text-gray-900">
                {patientResult.patientSex}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">School</p>
              <p className="font-semibold text-gray-900">
                {patientResult.schoolName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Submitted</p>
              <p className="font-semibold text-gray-900">
                {new Date(patientResult.createdAt).toLocaleDateString()}
              </p>
            </div>
            {patientResult.firstOpenedAt && (
              <div>
                <p className="text-sm text-gray-500">First Opened</p>
                <p className="font-semibold text-gray-900">
                  {new Date(patientResult.firstOpenedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Provider Information */}
        {(patientResult.starProvider ||
          patientResult.referredProvider ||
          patientResult.treatingProviders.length > 0) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Provider Information
            </h2>
            {patientResult.starProvider && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Star Provider</p>
                <p className="font-semibold text-gray-900">
                  {patientResult.starProvider.professionalTitle}{" "}
                  {patientResult.starProvider.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  {patientResult.starProvider.specialty}
                </p>
              </div>
            )}
            {patientResult.referredProvider && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Referred Provider</p>
                <p className="font-semibold text-gray-900">
                  {patientResult.referredProvider.fullName}
                </p>
              </div>
            )}
            {patientResult.treatingProviders.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Treating Providers</p>
                <div className="space-y-2">
                  {patientResult.treatingProviders.map((provider) => (
                    <p
                      key={provider.id}
                      className="font-semibold text-gray-900"
                    >
                      {provider.fullName}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lock-In Assessment Details */}
        {lockInAssessment && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Lock-In Assessment
            </h2>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4">
              <p className="text-sm text-gray-500 mb-2">
                Overall Lock-In Score
              </p>
              <p
                className={`text-2xl font-bold ${getColorClass(lockInAssessment.lockedInColor)} px-4 py-2 rounded inline-block`}
              >
                {lockInAssessment.lockedInScore} / 10
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-2">
                {lockInAssessment.lockedInScoreDescription}
              </p>
            </div>
            {lockInAssessment.generalMentalHealth !== "N/A" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">
                    General Mental Health
                  </p>
                  <p
                    className={`text-lg font-bold ${getColorClass(lockInAssessment.generalMentalHealthColor)} px-3 py-1 rounded inline-block`}
                  >
                    {lockInAssessment.generalMentalHealth} (
                    {lockInAssessment.generalMentalHealthScore})
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Depression Risk</p>
                  <p
                    className={`text-lg font-bold ${getColorClass(lockInAssessment.possibleDepressionColor)} px-3 py-1 rounded inline-block`}
                  >
                    {lockInAssessment.possibleDepressionDescription} (
                    {lockInAssessment.possibleDepressionScore})
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Suicidal Risk</p>
                  <p
                    className={`text-lg font-bold ${getColorClass(lockInAssessment.suicidalRiskColor)} px-3 py-1 rounded inline-block`}
                  >
                    {lockInAssessment.suicidalRiskScoreDescription} (
                    {lockInAssessment.suicidalRiskScore})
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Exam Anxiety</p>
                  <p
                    className={`text-lg font-bold ${getColorClass(lockInAssessment.examAnxietyColor)} px-3 py-1 rounded inline-block`}
                  >
                    {lockInAssessment.examAnxiety} (
                    {lockInAssessment.examAnxietyScore})
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Exam Preparation</p>
                  <p
                    className={`text-lg font-bold ${getColorClass(lockInAssessment.examPrepColor)} px-3 py-1 rounded inline-block`}
                  >
                    {lockInAssessment.examPrep} (
                    {lockInAssessment.examPrepScore})
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
