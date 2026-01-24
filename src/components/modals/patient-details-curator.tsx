"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: number;
  schoolId: string | number;
}

interface PatientResult {
  id: number;
  lockinId: number;
  schoolId: number;
  schoolName: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  visibilityStatus: "NEW" | "SEEN";
  starProvider: {
    id: string;
    fullName: string;
    email: string;
    professionalTitle: string;
    specialty: string;
  } | null;
  referredProvider: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  createdAt: string;
  firstOpenedAt: string | null;
  treatingProviders: Array<{
    id: string;
    fullName: string;
  }>;
}

interface LockInAssessment {
  fullName: string;
  age: number;
  sex: string;
  school: string;
  generalMentalHealth: string;
  generalMentalHealthScore: string;
  generalMentalHealthColor: string;
  possibleDepressionScore: string;
  possibleDepressionDescription: string;
  possibleDepressionColor: string;
  lonelinessScore: string;
  lonelinessScoreDescription: string;
  lonelinessColor: string;
  suicidalRiskScore: string;
  suicidalRiskScoreDescription: string;
  suicidalRiskColor: string;
  examAnxiety: string;
  examAnxietyScore: string;
  examAnxietyColor: string;
  coreAnxietyScore: string;
  coreAnxietyScoreDescription: string;
  coreAnxietyColor: string;
  physicalDistressScore: string;
  physicalDistressScoreDescription: string;
  physicalDistressColor: string;
  examPrep: string;
  examPrepScore: string;
  examPrepColor: string;
  motivationScore: string;
  motivationScoreDescription: string;
  motivationColor: string;
  studySkillsScore: string;
  studySkillsScoreDescription: string;
  studySkillsColor: string;
  procrastinationScore: string;
  procrastinationScoreDescription: string;
  procrastinationColor: string;
  lockedInScore: string;
  lockedInScoreDescription: string;
  lockedInColor: string;
}

const getColorClass = (color: string): string => {
  switch (color.toLowerCase()) {
    case "red":
      return "bg-red-100 text-red-800 border-red-300";
    case "yellow":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "green":
      return "bg-green-100 text-green-800 border-green-300";
    case "purple":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "light green":
      return "bg-green-50 text-green-700 border-green-200";
    case "black":
      return "bg-gray-100 text-gray-800 border-gray-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export default function PatientDetailsModal({
  isOpen,
  onClose,
  patientId,
  schoolId,
}: PatientDetailsModalProps) {
  const [patientResult, setPatientResult] = useState<PatientResult | null>(null);
  const [lockInAssessment, setLockInAssessment] = useState<LockInAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && patientId) {
      loadPatientDetails();
    } else {
      setPatientResult(null);
      setLockInAssessment(null);
      setIsLoading(true);
    }
  }, [isOpen, patientId]);

  const loadPatientDetails = async () => {
    setIsLoading(true);
    try {
      // Load patient result
      const resultResponse = await api(ENDPOINTS.getPatientResult(patientId));
      if (resultResponse?.success && resultResponse.data) {
        const resultData = resultResponse.data as PatientResult;
        setPatientResult(resultData);

        // Try to get lock-in assessment details from school lock-in endpoint
        try {
          const lockInResponse = await api(ENDPOINTS.getSchoolLockIn(resultData.schoolId));
          if (lockInResponse?.success && lockInResponse.data) {
            const lockInData = lockInResponse.data as {
              schoolName: string;
              students: Array<{
                studentName: string;
                lockinScore: number;
                lockedInInterpretation: string;
                lockedInColor: string;
              }>;
            };
            // Find the student matching this patient
            const student = lockInData.students?.find(
              (s) => s.studentName === resultData.patientName
            );
            if (student) {
              // Create a simplified assessment object with available data
              // Note: Full assessment details may not be available through this endpoint
              setLockInAssessment({
                fullName: resultData.patientName,
                age: resultData.patientAge,
                sex: resultData.patientSex,
                school: resultData.schoolName,
                lockedInScore: student.lockinScore.toFixed(2),
                lockedInScoreDescription: student.lockedInInterpretation,
                lockedInColor: student.lockedInColor,
                // These would need to come from the full assessment if available
                generalMentalHealth: "N/A",
                generalMentalHealthScore: "N/A",
                generalMentalHealthColor: "gray",
                possibleDepressionScore: "N/A",
                possibleDepressionDescription: "N/A",
                possibleDepressionColor: "gray",
                lonelinessScore: "N/A",
                lonelinessScoreDescription: "N/A",
                lonelinessColor: "gray",
                suicidalRiskScore: "N/A",
                suicidalRiskScoreDescription: "N/A",
                suicidalRiskColor: "gray",
                examAnxiety: "N/A",
                examAnxietyScore: "N/A",
                examAnxietyColor: "gray",
                coreAnxietyScore: "N/A",
                coreAnxietyScoreDescription: "N/A",
                coreAnxietyColor: "gray",
                physicalDistressScore: "N/A",
                physicalDistressScoreDescription: "N/A",
                physicalDistressColor: "gray",
                examPrep: "N/A",
                examPrepScore: "N/A",
                examPrepColor: "gray",
                motivationScore: "N/A",
                motivationScoreDescription: "N/A",
                motivationColor: "gray",
                studySkillsScore: "N/A",
                studySkillsScoreDescription: "N/A",
                studySkillsColor: "gray",
                procrastinationScore: "N/A",
                procrastinationScoreDescription: "N/A",
                procrastinationColor: "gray",
              });
            }
          }
        } catch (error) {
          // Silently handle "No lockins found" - this is expected for schools without lock-ins
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (!errorMessage.includes("No lockins found")) {
            // Only log if it's not the expected "no lockins" case
          }
        }
      }
    } catch (error) {
      console.error("Error loading patient details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
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
              <div className="bg-gradient-to-r from-[#955aa4] to-[#7a4a88] rounded-xl p-6 text-white">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                    {patientResult.patientName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{patientResult.patientName}</h3>
                    <p className="text-white/90">
                      {patientResult.patientAge} years old • {patientResult.patientSex}
                    </p>
                    <p className="text-white/80 mt-1">{patientResult.schoolName}</p>
                  </div>
                </div>
              </div>

              {/* Provider Info */}
              {(patientResult.starProvider || patientResult.referredProvider || patientResult.treatingProviders.length > 0) && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Provider Information</h4>
                  <div className="space-y-3">
                    {patientResult.starProvider && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#955aa4] flex items-center justify-center text-white font-semibold">
                          ⭐
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Star Provider</p>
                          <p className="text-sm text-gray-600">
                            {patientResult.starProvider.fullName} ({patientResult.starProvider.specialty})
                          </p>
                        </div>
                      </div>
                    )}
                    {patientResult.referredProvider && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                          →
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Referred Provider</p>
                          <p className="text-sm text-gray-600">{patientResult.referredProvider.fullName}</p>
                        </div>
                      </div>
                    )}
                    {patientResult.treatingProviders.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-900 mb-2">Treating Providers</p>
                        <div className="space-y-2">
                          {patientResult.treatingProviders.map((provider) => (
                            <div key={provider.id} className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-xs">
                                ✓
                              </div>
                              <p className="text-sm text-gray-600">{provider.fullName}</p>
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
                <h4 className="font-semibold text-gray-900 mb-4">Lock-In Assessment Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* General Mental Health */}
                  <div className={`p-4 rounded-lg border-2 ${getColorClass(lockInAssessment.generalMentalHealthColor)}`}>
                    <p className="text-sm font-medium mb-1">General Mental Health</p>
                    <p className="text-lg font-bold">{lockInAssessment.generalMentalHealth}</p>
                    <p className="text-xs mt-1">{lockInAssessment.generalMentalHealthScore}</p>
                  </div>

                  {/* Possible Depression */}
                  <div className={`p-4 rounded-lg border-2 ${getColorClass(lockInAssessment.possibleDepressionColor)}`}>
                    <p className="text-sm font-medium mb-1">Possible Depression</p>
                    <p className="text-lg font-bold">{lockInAssessment.possibleDepressionDescription}</p>
                    <p className="text-xs mt-1">{lockInAssessment.possibleDepressionScore}</p>
                  </div>

                  {/* Loneliness */}
                  <div className={`p-4 rounded-lg border-2 ${getColorClass(lockInAssessment.lonelinessColor)}`}>
                    <p className="text-sm font-medium mb-1">Loneliness</p>
                    <p className="text-lg font-bold">{lockInAssessment.lonelinessScoreDescription}</p>
                    <p className="text-xs mt-1">{lockInAssessment.lonelinessScore}</p>
                  </div>

                  {/* Suicidal Risk */}
                  <div className={`p-4 rounded-lg border-2 ${getColorClass(lockInAssessment.suicidalRiskColor)}`}>
                    <p className="text-sm font-medium mb-1">Suicidal Risk</p>
                    <p className="text-lg font-bold">{lockInAssessment.suicidalRiskScoreDescription}</p>
                    <p className="text-xs mt-1">{lockInAssessment.suicidalRiskScore}</p>
                  </div>

                  {/* Exam Anxiety */}
                  <div className={`p-4 rounded-lg border-2 ${getColorClass(lockInAssessment.examAnxietyColor)}`}>
                    <p className="text-sm font-medium mb-1">Exam Anxiety</p>
                    <p className="text-lg font-bold">{lockInAssessment.examAnxiety}</p>
                    <p className="text-xs mt-1">{lockInAssessment.examAnxietyScore}</p>
                  </div>

                  {/* Core Anxiety */}
                  <div className={`p-4 rounded-lg border-2 ${getColorClass(lockInAssessment.coreAnxietyColor)}`}>
                    <p className="text-sm font-medium mb-1">Core Anxiety</p>
                    <p className="text-lg font-bold">{lockInAssessment.coreAnxietyScoreDescription}</p>
                    <p className="text-xs mt-1">{lockInAssessment.coreAnxietyScore}</p>
                  </div>

                  {/* Physical Distress */}
                  <div className={`p-4 rounded-lg border-2 ${getColorClass(lockInAssessment.physicalDistressColor)}`}>
                    <p className="text-sm font-medium mb-1">Physical Distress</p>
                    <p className="text-lg font-bold">{lockInAssessment.physicalDistressScoreDescription}</p>
                    <p className="text-xs mt-1">{lockInAssessment.physicalDistressScore}</p>
                  </div>

                  {/* Exam Prep */}
                  <div className={`p-4 rounded-lg border-2 ${getColorClass(lockInAssessment.examPrepColor)}`}>
                    <p className="text-sm font-medium mb-1">Exam Preparation</p>
                    <p className="text-lg font-bold">{lockInAssessment.examPrep}</p>
                    <p className="text-xs mt-1">{lockInAssessment.examPrepScore}</p>
                  </div>

                  {/* Motivation */}
                  <div className={`p-4 rounded-lg border-2 ${getColorClass(lockInAssessment.motivationColor)}`}>
                    <p className="text-sm font-medium mb-1">Motivation</p>
                    <p className="text-lg font-bold">{lockInAssessment.motivationScoreDescription}</p>
                    <p className="text-xs mt-1">{lockInAssessment.motivationScore}</p>
                  </div>

                  {/* Study Skills */}
                  <div className={`p-4 rounded-lg border-2 ${getColorClass(lockInAssessment.studySkillsColor)}`}>
                    <p className="text-sm font-medium mb-1">Study Skills</p>
                    <p className="text-lg font-bold">{lockInAssessment.studySkillsScoreDescription}</p>
                    <p className="text-xs mt-1">{lockInAssessment.studySkillsScore}</p>
                  </div>

                  {/* Procrastination */}
                  <div className={`p-4 rounded-lg border-2 ${getColorClass(lockInAssessment.procrastinationColor)}`}>
                    <p className="text-sm font-medium mb-1">Procrastination</p>
                    <p className="text-lg font-bold">{lockInAssessment.procrastinationScoreDescription}</p>
                    <p className="text-xs mt-1">{lockInAssessment.procrastinationScore}</p>
                  </div>

                  {/* Locked In Score */}
                  <div className={`p-4 rounded-lg border-2 ${getColorClass(lockInAssessment.lockedInColor)} md:col-span-2`}>
                    <p className="text-sm font-medium mb-1">Overall Lock-In Score</p>
                    <p className="text-2xl font-bold">{lockInAssessment.lockedInScoreDescription}</p>
                    <p className="text-sm mt-1">{lockInAssessment.lockedInScore}</p>
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
