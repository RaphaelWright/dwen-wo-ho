"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import useUserQuery from "@/hooks/queries/useUserQuery";
import { toast } from "sonner";

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
  openedByCurrentUser: boolean;
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

export default function PatientResultPage() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.resultId as string;
  const { getProfileQuery } = useUserQuery();

  const [patientResult, setPatientResult] = useState<PatientResult | null>(null);
  const [lockInAssessment, setLockInAssessment] = useState<LockInAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (resultId && getProfileQuery.data) {
      loadPatientResult();
    }
  }, [resultId, getProfileQuery.data]);

  const loadPatientResult = async () => {
    setIsLoading(true);
    try {
      // First, open the result if not already opened
      const openResponse = await api(ENDPOINTS.openPatientResult(resultId), {
        method: "POST",
      });

      let resultData: PatientResult | null = null;

      if (openResponse?.success && openResponse.data) {
        resultData = openResponse.data as PatientResult;
        setPatientResult(resultData);
      } else {
        // If open fails, try to get the result directly
        const resultResponse = await api(ENDPOINTS.getPatientResult(resultId));
        if (resultResponse?.success && resultResponse.data) {
          resultData = resultResponse.data as PatientResult;
          setPatientResult(resultData);
        }
      }

      // Fetch lock-in assessment details if we have schoolId
      if (resultData?.schoolId) {
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
              }> 
            };
            // Find the student matching this patient
            const student = lockInData.students?.find(
              (s) => s.studentName === resultData?.patientName
            );
            if (student) {
              // Create a simplified assessment object with available data
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
      console.error("Failed to load patient result:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateActionStatus = async (actionStatus: "TREATING") => {
    if (!patientResult || !getProfileQuery.data) return;

    setIsUpdating(true);
    try {
      const providerId = getProfileQuery.data.id || getProfileQuery.data.email;
      const response = await api(ENDPOINTS.updateActionStatus(resultId), {
        method: "PUT",
        body: JSON.stringify({
          providerId,
          actionStatus,
        }),
      });

      if (response?.success) {
        toast.success("Action status updated successfully");
        await loadPatientResult();
      } else {
        toast.error("Failed to update action status");
      }
    } catch (error) {
      console.error("Failed to update action status:", error);
      toast.error("Failed to update action status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "red":
        return "bg-red-100 text-red-800";
      case "yellow":
        return "bg-yellow-100 text-yellow-800";
      case "green":
        return "bg-green-100 text-green-800";
      case "purple":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  const isTreating = patientResult.treatingProviders.some(
    (p) => p.id === getProfileQuery.data?.id || p.id === getProfileQuery.data?.email
  );

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
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{patientResult.patientName}</h1>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">Patient Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-semibold text-gray-900">{patientResult.patientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Age</p>
              <p className="font-semibold text-gray-900">{patientResult.patientAge}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sex</p>
              <p className="font-semibold text-gray-900">{patientResult.patientSex}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">School</p>
              <p className="font-semibold text-gray-900">{patientResult.schoolName}</p>
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
        {(patientResult.starProvider || patientResult.referredProvider || patientResult.treatingProviders.length > 0) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Provider Information</h2>
            {patientResult.starProvider && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Star Provider</p>
                <p className="font-semibold text-gray-900">
                  {patientResult.starProvider.professionalTitle} {patientResult.starProvider.fullName}
                </p>
                <p className="text-sm text-gray-600">{patientResult.starProvider.specialty}</p>
              </div>
            )}
            {patientResult.referredProvider && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Referred Provider</p>
                <p className="font-semibold text-gray-900">{patientResult.referredProvider.fullName}</p>
              </div>
            )}
            {patientResult.treatingProviders.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Treating Providers</p>
                <div className="space-y-2">
                  {patientResult.treatingProviders.map((provider) => (
                    <p key={provider.id} className="font-semibold text-gray-900">
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Lock-In Assessment</h2>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4">
              <p className="text-sm text-gray-500 mb-2">Overall Lock-In Score</p>
              <p className={`text-2xl font-bold ${getColorClass(lockInAssessment.lockedInColor)} px-4 py-2 rounded inline-block`}>
                {lockInAssessment.lockedInScore} / 10
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-2">
                {lockInAssessment.lockedInScoreDescription}
              </p>
            </div>
            {lockInAssessment.generalMentalHealth !== "N/A" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">General Mental Health</p>
                  <p className={`text-lg font-bold ${getColorClass(lockInAssessment.generalMentalHealthColor)} px-3 py-1 rounded inline-block`}>
                    {lockInAssessment.generalMentalHealth} ({lockInAssessment.generalMentalHealthScore})
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Depression Risk</p>
                  <p className={`text-lg font-bold ${getColorClass(lockInAssessment.possibleDepressionColor)} px-3 py-1 rounded inline-block`}>
                    {lockInAssessment.possibleDepressionDescription} ({lockInAssessment.possibleDepressionScore})
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Suicidal Risk</p>
                  <p className={`text-lg font-bold ${getColorClass(lockInAssessment.suicidalRiskColor)} px-3 py-1 rounded inline-block`}>
                    {lockInAssessment.suicidalRiskScoreDescription} ({lockInAssessment.suicidalRiskScore})
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Exam Anxiety</p>
                  <p className={`text-lg font-bold ${getColorClass(lockInAssessment.examAnxietyColor)} px-3 py-1 rounded inline-block`}>
                    {lockInAssessment.examAnxiety} ({lockInAssessment.examAnxietyScore})
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Exam Preparation</p>
                  <p className={`text-lg font-bold ${getColorClass(lockInAssessment.examPrepColor)} px-3 py-1 rounded inline-block`}>
                    {lockInAssessment.examPrep} ({lockInAssessment.examPrepScore})
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