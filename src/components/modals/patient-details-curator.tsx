"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatientDetailsModalProps } from "@/lib/types/modals";
import { usePatientDetailsCurator } from "@/hooks/components/modals/use-patient-details-curator";
import { GET_COLOR_CLASS } from "@/lib/constants/components/modals/patient-details";

export default function PatientDetailsModal({
  isOpen,
  onClose,
  patientId,
}: PatientDetailsModalProps) {
  const {
    patientResult,
    lockInAssessment,
    isLoading,
    assessmentCategories,
    providerGroups,
  } = usePatientDetailsCurator({
    isOpen,
    patientId: String(patientId),
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
                <p className="text-gray-500">Loading patient details...</p>
              </div>
            </div>
          ) : patientResult && lockInAssessment ? (
            <div className="space-y-8">
              {/* Patient Info */}
              <div className="bg-linear-to-r from-[#955aa4] to-[#7a4a88] rounded-xl p-6 text-white">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                    {patientResult.patientName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">
                      {patientResult.patientName}
                    </h3>
                    <p className="text-white/90">
                      {patientResult.patientAge} years old •{" "}
                      {patientResult.patientSex}
                    </p>
                    <p className="text-white/80 mt-1">
                      {patientResult.schoolName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Provider Info */}
              {(patientResult.starProvider ||
                patientResult.referredProvider ||
                patientResult.treatingProviders.length > 0) && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Provider Information
                  </h4>
                  <div className="space-y-3">
                    {providerGroups.map(
                      (group) =>
                        group.data && (
                          <div
                            key={group.id}
                            className="flex items-center gap-3"
                          >
                            <div
                              className={`w-10 h-10 rounded-full ${group.colorClass} flex items-center justify-center text-white font-semibold`}
                            >
                              {group.icon}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {group.label}
                              </p>
                              <p className="text-sm text-gray-600">
                                {group.getContent(group.data)}
                              </p>
                            </div>
                          </div>
                        ),
                    )}

                    {patientResult.treatingProviders.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-900 mb-2">
                          Treating Providers
                        </p>
                        <div className="space-y-2">
                          {patientResult.treatingProviders.map((provider) => (
                            <div
                              key={provider.id}
                              className="flex items-center gap-3"
                            >
                              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-xs">
                                ✓
                              </div>
                              <p className="text-sm text-gray-600">
                                {provider.fullName}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Assessment Scores */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  Lock-In Assessment Results
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assessmentCategories.map((category) => (
                    <div
                      key={category.label}
                      className={`p-4 rounded-lg border-2 ${GET_COLOR_CLASS(category.color)}`}
                    >
                      <p className="text-sm font-medium mb-1">
                        {category.label}
                      </p>
                      <p className="text-lg font-bold">
                        {category.description}
                      </p>
                      <p className="text-xs mt-1">{category.score}</p>
                    </div>
                  ))}

                  {/* Locked In Score */}
                  <div
                    className={`p-4 rounded-lg border-2 ${GET_COLOR_CLASS(lockInAssessment.lockedInColor)} md:col-span-2`}
                  >
                    <p className="text-sm font-medium mb-1">
                      Overall Lock-In Score
                    </p>
                    <p className="text-2xl font-bold">
                      {lockInAssessment.lockedInScoreDescription}
                    </p>
                    <p className="text-sm mt-1">
                      {lockInAssessment.lockedInScore}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(patientResult.createdAt).toLocaleString()}
                </p>
                {patientResult.firstOpenedAt && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">First Opened:</span>{" "}
                    {new Date(patientResult.firstOpenedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500">Failed to load patient details</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
