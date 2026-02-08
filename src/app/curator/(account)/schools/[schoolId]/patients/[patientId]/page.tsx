"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { ROUTES } from "@/constants/routes";
import JustGoHealth from "@/components/logo-purple";

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

const generateColor = (color: string) => {
  let code = "";
  if (color === "yellow") code = "#ff9900";
  if (color === "green") code = "#2bb573";
  if (color === "purple") code = "#993399";
  if (color === "red") code = "#ff0000";
  if (color === "light green") code = "#66ff66";
  if (color === "black") code = "#000000";
  return code;
};

export default function PatientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;
  const schoolId = params.schoolId as string;

  const [patientResult, setPatientResult] = useState<PatientResult | null>(
    null,
  );
  const [lockInAssessment, setLockInAssessment] =
    useState<LockInAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resultIndex, setResultIndex] = useState(0);

  useEffect(() => {
    loadPatientDetails();
  }, [patientId]);

  const loadPatientDetails = async () => {
    setIsLoading(true);
    try {
      const resultResponse = await api(
        ENDPOINTS.getPatientResult(Number(patientId)),
      );
      if (resultResponse?.success && resultResponse.data) {
        const resultData = resultResponse.data as PatientResult;
        setPatientResult(resultData);

        try {
          const lockInResponse = await api(
            ENDPOINTS.getSchoolLockIn(resultData.schoolId),
          );
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
            const student = lockInData.students?.find(
              (s) => s.studentName === resultData.patientName,
            );
            if (student) {
              setLockInAssessment({
                fullName: resultData.patientName,
                age: resultData.patientAge,
                sex: resultData.patientSex,
                school: resultData.schoolName,
                lockedInScore: student.lockinScore.toFixed(2),
                lockedInScoreDescription: student.lockedInInterpretation,
                lockedInColor: student.lockedInColor,
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
          // Silently handle
        }
      }
    } catch (error) {
      console.error("Error loading patient details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#faf9f7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#955aa4] mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (!patientResult || !lockInAssessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#faf9f7]">
        <button
          onClick={() => router.back()}
          className="mb-3 text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <p className="text-red-500 text-sm">Failed to load patient details</p>
      </div>
    );
  }

  const metrics = [
    {
      name: "General Mental Health",
      description: lockInAssessment.generalMentalHealth,
      score: lockInAssessment.generalMentalHealthScore,
      items: [
        {
          name: "Depression",
          description: lockInAssessment.possibleDepressionDescription,
          value: lockInAssessment.possibleDepressionScore,
          color: generateColor(lockInAssessment.possibleDepressionColor),
        },
        {
          name: "Loneliness",
          description: lockInAssessment.lonelinessScoreDescription,
          value: lockInAssessment.lonelinessScore,
          color: generateColor(lockInAssessment.lonelinessColor),
        },
        {
          name: "Suicidal Risk",
          description: lockInAssessment.suicidalRiskScoreDescription,
          value: lockInAssessment.suicidalRiskScore,
          color: generateColor(lockInAssessment.suicidalRiskColor),
        },
      ],
    },
    {
      name: "Exam Anxiety",
      score: lockInAssessment.examAnxietyScore,
      description: lockInAssessment.examAnxiety,
      items: [
        {
          name: "Physical Distress",
          description: lockInAssessment.physicalDistressScoreDescription,
          value: lockInAssessment.physicalDistressScore,
          color: generateColor(lockInAssessment.physicalDistressColor),
        },
        {
          name: "Core Anxiety",
          description: lockInAssessment.coreAnxietyScoreDescription,
          value: lockInAssessment.coreAnxietyScore,
          color: generateColor(lockInAssessment.coreAnxietyColor),
        },
      ],
    },
    {
      name: "Exam Prep",
      score: lockInAssessment.examPrepScore,
      description: lockInAssessment.examPrep,
      items: [
        {
          name: "Motivation",
          description: lockInAssessment.motivationScoreDescription,
          value: lockInAssessment.motivationScore,
          color: generateColor(lockInAssessment.motivationColor),
        },
        {
          name: "Procrastination",
          description: lockInAssessment.procrastinationScoreDescription,
          value: lockInAssessment.procrastinationScore,
          color: generateColor(lockInAssessment.procrastinationColor),
        },
        {
          name: "Study Skills",
          description: lockInAssessment.studySkillsScoreDescription,
          value: lockInAssessment.studySkillsScore,
          color: generateColor(lockInAssessment.studySkillsColor),
        },
      ],
    },
  ];

  return (
    <div className="h-screen overflow-y-auto xl:overflow-hidden xl:h-screen w-full flex flex-col xl:flex-row xl:items-stretch justify-between bg-[#faf9f7]">
      <div className="w-full xl:w-7/10 xl:h-full">
        {/* User details */}
        <div className="w-full h-auto xl:h-[52%] bg-[#F6F9E6] px-6 xl:px-24 py-4 xl:py-12">
          <button
            onClick={() => router.push(`/curator/schools/${schoolId}`)}
            className="mb-4 text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back to School
          </button>
          <div className="">
            <h3 className="text-2xl xl:text-5xl font-bold text-[#993399]">
              {patientResult?.patientName} (Health results)
            </h3>
            <p className="font-bold text-xl xl:text-2xl">
              {patientResult?.patientAge} year old {patientResult?.patientSex},{" "}
              {patientResult?.schoolName}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start xl:items-center justify-start gap-4 xl:gap-16 mt-4 xl:mt-8">
            <div
              className="p-4 px-8 xl:p-8 rounded-[20px] text-white gap-4 flex flex-col items-center justify-center"
              style={{
                backgroundColor: generateColor(lockInAssessment.lockedInColor),
              }}
            >
              <p className="font-bold text-xs">Locked In</p>
              <h3 className="font-bold text-5xl xl:text-7xl">
                {lockInAssessment.lockedInScore.split("/")[0]}
              </h3>
              <p className="font-bold text-xs -mt-4">Score</p>
            </div>
            <div>
              <p className="text-2xl xl:text-3xl font-bold mb-2 xl:mb-3">
                Status:{" "}
                <span className="text-[#993399]">
                  {patientResult.visibilityStatus}
                </span>
              </p>
              {patientResult.starProvider && (
                <p className="text-xl xl:text-2xl font-bold mb-2">
                  Star Provider:{" "}
                  <span className="text-[#993399]">
                    {patientResult.starProvider.fullName}
                  </span>
                </p>
              )}
              {patientResult.treatingProviders.length > 0 && (
                <p className="text-xl xl:text-2xl font-bold">
                  Treating Providers:{" "}
                  <span className="text-[#993399]">
                    {patientResult.treatingProviders.length}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="w-full h-auto xl:h-[48%] bg-white">
          <div className="flex p-4 p-6 px-4 xl:px-12 border-b-4 border-black flex items-center justify-between">
            <div className="flex flex-col md:flex-row xl:items-center xl:gap-2">
              <h3 className="text-xl xl:text-3xl font-bold">
                {metrics[resultIndex].name}:
              </h3>
              <p className="text-xl xl:text-3xl font-bold">
                {metrics[resultIndex].description} ({metrics[resultIndex].score}
                )
              </p>
            </div>
            {/* Navigation */}
            <div className="flex items-center gap-4">
              <button
                className={`bg-black hover:cursor-pointer text-white p-2 rounded-full transition-opacity ${
                  resultIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={resultIndex === 0}
                onClick={() => setResultIndex((prev) => --prev)}
              >
                <ChevronLeft className="!w-6 !h-6 xl:!w-9 xl:!h-9" />
              </button>
              <button
                className={`bg-black hover:cursor-pointer text-white p-2 rounded-full transition-opacity ${
                  resultIndex >= metrics.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={resultIndex >= metrics.length - 1}
                onClick={() => setResultIndex((prev) => ++prev)}
              >
                <svg
                  className="!w-6 !h-6 xl:!w-9 xl:!h-9 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Slider */}
          <div className="w-full h-full xl:overflow-hidden">
            <div
              className={`grid-cols-3 h-full grid items-stretch justify-between transition-all duration-300 ease-in-out`}
              style={{
                marginLeft: `-${100 * resultIndex}%`,
                width: `${metrics.length * 100}%`,
              }}
            >
              {metrics.map((metric, index) => {
                return (
                  <div
                    className="w-full h-full flex flex-col md:flex-row md:items-stretch justify-start"
                    key={index}
                  >
                    {metric.items.map((item, idx) => (
                      <div
                        key={idx}
                        className={`w-full flex items-center justify-start flex-col h-full border-black gap-2 p-6 md:p-8 ${
                          idx !== metric.items.length - 1 ? "md:border-r-4" : ""
                        } border-b-4 xl:border-b-0`}
                      >
                        <h1 className="text-2xl xl:text-4xl text-center font-bold">
                          {item.name}
                        </h1>
                        <p className="text-base xl:text-2xl text-center">
                          {item.description}
                        </p>
                        <div
                          className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.value.replace(/\ /g, "")}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right side sidebar */}
      <aside className="w-full xl:w-3/10 bg-white xl:h-full p-8 py-10 flex flex-col items-center justify-between border-t xl:border-t-0 xl:border-l-4 border-black">
        <div className="">
          <JustGoHealth className="scale-100 sm:scale-100 lg:scale-125 origin-left" />
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-3xl xl:text-4xl font-bold text-[#993399] mb-6">
            Patient Information
          </h2>
          <div className="space-y-6 text-left">
            {patientResult.starProvider && (
              <div className="p-6 bg-gray-50 rounded-lg">
                <p className="font-semibold text-lg text-gray-700">
                  Star Provider
                </p>
                <p className="text-base text-gray-600 mt-1">
                  {patientResult.starProvider.fullName}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {patientResult.starProvider.specialty}
                </p>
              </div>
            )}
            {patientResult.referredProvider && (
              <div className="p-6 bg-blue-50 rounded-lg">
                <p className="font-semibold text-lg text-blue-700">
                  Referred Provider
                </p>
                <p className="text-base text-blue-600 mt-1">
                  {patientResult.referredProvider.fullName}
                </p>
              </div>
            )}
            {patientResult.treatingProviders.length > 0 && (
              <div className="p-6 bg-green-50 rounded-lg">
                <p className="font-semibold text-lg text-green-700">
                  Treating Providers
                </p>
                <div className="space-y-2 mt-3">
                  {patientResult.treatingProviders.map((provider) => (
                    <p key={provider.id} className="text-base text-green-600">
                      {provider.fullName}
                    </p>
                  ))}
                </div>
              </div>
            )}
            <div className="p-6 bg-gray-50 rounded-lg">
              <p className="font-semibold text-lg text-gray-700 mb-3">
                Timeline
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Created:{" "}
                {new Date(patientResult.createdAt).toLocaleDateString()}
              </p>
              {patientResult.firstOpenedAt && (
                <p className="text-sm text-gray-600">
                  First Opened:{" "}
                  {new Date(patientResult.firstOpenedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push(`/curator/schools/${schoolId}`)}
          className="mt-12 w-full px-6 py-4 bg-[#993399] text-white text-lg font-semibold rounded-lg hover:bg-[#8a3a8a] transition-colors"
        >
          Back to School
        </button>
      </aside>
    </div>
  );
}
