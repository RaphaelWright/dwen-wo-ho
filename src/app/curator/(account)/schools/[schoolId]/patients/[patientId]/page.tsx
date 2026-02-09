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
      <div className="w-full xl:w-6/10 xl:h-full">
        {/* User details */}
        <div className="w-full h-auto xl:h-[52%] bg-[#F6F9E6] px-6 xl:px-24 py-2 xl:py-6">
          <div className="mb-6">
            <button
              onClick={() => router.push(`/curator/schools/${schoolId}`)}
              className="hover:opacity-70 transition-opacity"
            >
              <JustGoHealth className="scale-75 sm:scale-85 lg:scale-90 origin-left" />
            </button>
          </div>
          <div className="">
            <h3 className="text-5xl xl:text-7xl font-black text-[#993399] mb-3">
              {patientResult?.patientName}
            </h3>
            <p className="font-black text-2xl xl:text-3xl mb-1">
              {patientResult?.patientAge} year old {patientResult?.patientSex}{" "}
              (0555 555 555)
            </p>
            <p className="font-black text-2xl xl:text-3xl">
              Year 2, {patientResult?.schoolName}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-stretch justify-start gap-6 xl:gap-8 mt-8 xl:mt-10">
            <div
              className="p-6 px-8 xl:p-6 rounded-2xl text-white gap-1 flex flex-col items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: generateColor(lockInAssessment.lockedInColor),
              }}
            >
              <p className="font-bold text-lg xl:text-xl">Locked In</p>
              <h3 className="font-bold text-5xl xl:text-6xl leading-none">
                {lockInAssessment.lockedInScore.split("/")[0]}
              </h3>
              <p className="font-bold text-lg xl:text-xl">Score</p>
            </div>
            <div className="flex flex-col gap-4 pt-2">
              <div>
                <p className="text-xl xl:text-3xl font-black">
                  General Mental Health:{" "}
                  <span className="text-[#2bb573]">
                    {lockInAssessment.generalMentalHealth}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xl xl:text-3xl font-black">
                  Exam Anxiety:{" "}
                  <span className="text-[#2bb573]">
                    {lockInAssessment.examAnxiety}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xl xl:text-3xl font-black">
                  Exam Prep:{" "}
                  <span className="text-[#2bb573]">
                    {lockInAssessment.examPrep}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="w-full h-auto xl:h-[48%] bg-white mt-20">
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

      {/* Right side sidebar - REMOVED LEFT BORDER & INCREASED SIZES */}
      <aside className="w-full xl:w-4/10 bg-white xl:h-full p-6 py-8 pb-0 flex flex-col border-t xl:border-t-0 border-black">
        {/* Action/History Toggle */}
        <div className="flex gap-3 mb-8 justify-center">
          <button className="bg-[#2bb573] text-white font-bold py-3 px-8 rounded-full text-xl">
            Action
          </button>
          <button className="bg-gray-400 text-white font-bold py-3 px-8 rounded-full text-xl">
            History
          </button>
        </div>

        {/* Actions List - SIGNIFICANTLY INCREASED SIZES */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden space-y-6 scrollbar-hide px-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {/* Group Therapy */}
          <div className="flex items-start gap-5 pb-6 border-b-2 border-gray-200">
            <div className="w-24 h-24 rounded-full border-4 border-gray-400 flex-shrink-0 p-1">
              <div className="w-full h-full rounded-full bg-gray-300 overflow-hidden">
                <svg
                  className="w-full h-full text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-2xl mb-1">Dr. Francis Nkrumah</h3>
              <p className="text-[#2bb573] font-semibold text-xl flex items-center gap-2 mb-1">
                <span className="text-2xl">👥</span> Group Therapy
              </p>
              <p className="text-lg text-gray-600">
                Jan 3rd, 2026. (Virtual - 2pm)
              </p>
            </div>
          </div>

          {/* Cognitive Behavioral Therapy */}
          <div className="flex items-start gap-5 pb-6 border-b-2 border-gray-200">
            <div className="w-24 h-24 rounded-full border-4 border-gray-400 flex-shrink-0 p-1">
              <div className="w-full h-full rounded-full bg-gray-300 overflow-hidden">
                <svg
                  className="w-full h-full text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-2xl mb-1">Dr. James Nuamah</h3>
              <p className="text-[#2bb573] font-semibold text-xl flex items-center gap-2 mb-1">
                <span className="text-2xl">💡</span> Cognitive Behavioral
                Therapy
              </p>
              <p className="text-lg text-gray-600">
                Dec 20th, 2025. (In-Person - 4pm)
              </p>
            </div>
            <div className="text-[#2bb573] text-3xl">✓</div>
          </div>

          {/* Clinical Evaluation */}
          <div className="flex items-start gap-5 pb-6 border-b-2 border-gray-200">
            <div className="w-24 h-24 rounded-full border-4 border-gray-400 flex-shrink-0 p-1">
              <div className="w-full h-full rounded-full bg-gray-300 overflow-hidden">
                <svg
                  className="w-full h-full text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-2xl mb-1">Dr. Francis Nkrumah</h3>
              <p className="text-[#2bb573] font-semibold text-xl flex items-center gap-2 mb-1">
                <span className="text-2xl">🔍</span> Clinical Evaluation
              </p>
              <p className="text-lg text-gray-600">
                Jan 3rd, 2026. (Virtual - 2pm)
              </p>
            </div>
            <div className="text-[#2bb573] text-3xl">✓</div>
          </div>

          {/* Crisis Management */}
          <div className="flex items-start gap-5 pb-6 border-b-2 border-gray-200">
            <div className="w-24 h-24 rounded-full border-4 border-gray-400 flex-shrink-0 p-1">
              <div className="w-full h-full rounded-full bg-gray-300 overflow-hidden">
                <svg
                  className="w-full h-full text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-2xl mb-1">Dr. Francis Nkrumah</h3>
              <p className="text-[#2bb573] font-semibold text-xl flex items-center gap-2 mb-1">
                <span className="text-2xl">🚨</span> Crisis Management
              </p>
              <p className="text-lg text-gray-600">
                Jan 3rd, 2026. (Virtual - 2pm)
              </p>
            </div>
            <div className="text-[#2bb573] text-3xl">✓</div>
          </div>

          {/* Additional action item */}
          <div className="flex items-start gap-5 pb-6">
            <div className="w-24 h-24 rounded-full border-4 border-gray-400 flex-shrink-0 p-1">
              <div className="w-full h-full rounded-full bg-gray-300 overflow-hidden">
                <svg
                  className="w-full h-full text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-2xl mb-1">Dr. Francis Nkrumah</h3>
              <p className="text-[#2bb573] font-semibold text-xl flex items-center gap-2 mb-1">
                <span className="text-2xl">💬</span> Follow-up Session
              </p>
              <p className="text-lg text-gray-600">
                Jan 3rd, 2026. (Virtual - 2pm)
              </p>
            </div>
            <div className="text-[#2bb573] text-3xl">✓</div>
          </div>
        </div>

        {/* Add Action Button - Full width, no margins */}
        <button className="w-auto px-12 mx-auto mb-5 bg-[#ff3333] hover:bg-[#e62e2e] text-white font-bold py-5 text-2xl flex items-center justify-center gap-3 rounded-full transition-colors">
          Add Action
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[#ff3333]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      </aside>
    </div>
  );
}
