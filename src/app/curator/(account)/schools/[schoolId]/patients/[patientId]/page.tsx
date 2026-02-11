"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  User,
  MapPin,
  Calendar,
  School,
  Activity,
  Brain,
  BookOpen,
  AlertCircle,
  Clock,
  CheckCircle2,
  Plus,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { Button } from "@/components/ui/button";

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
  if (color === "green") code = "#081c05";
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

  const [patientResult, setPatientResult] = useState<PatientResult | null>(
    null,
  );
  const [lockInAssessment, setLockInAssessment] =
    useState<LockInAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"assessment" | "history">(
    "assessment",
  );

  useEffect(() => {
    loadPatientDetails();
  }, [patientId]);

  const loadPatientDetails = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching patient result for ID:", patientId);
      const resultResponse = await api(
        ENDPOINTS.getPatientResult(Number(patientId)),
      );
      console.log("Patient Result Response:", resultResponse);

      if (resultResponse?.success && resultResponse.data) {
        const resultData = resultResponse.data as PatientResult;
        console.log("Patient Result Data:", resultData);
        setPatientResult(resultData);

        try {
          console.log(
            "Fetching lock-in assessment for school ID:",
            resultData.schoolId,
          );
          const lockInResponse = await api(
            ENDPOINTS.getSchoolLockIn(resultData.schoolId),
          );
          console.log("Lock-In Response:", lockInResponse);

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
            console.log("Lock-In Data:", lockInData);

            const student = lockInData.students?.find(
              (s) => s.studentName === resultData.patientName,
            );
            console.log("Found Student:", student);

            if (student) {
              const assessment = {
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
              };
              console.log("Lock-In Assessment:", assessment);
              setLockInAssessment(assessment);
            }
          }
        } catch (error) {
          console.error("Error fetching lock-in data:", error);
        }
      }
    } catch (error) {
      console.error("Error loading patient details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Console log whenever state updates
  useEffect(() => {
    console.log("Patient Result State:", patientResult);
  }, [patientResult]);

  useEffect(() => {
    console.log("Lock-In Assessment State:", lockInAssessment);
  }, [lockInAssessment]);

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
    console.warn(
      "Missing data - patientResult:",
      patientResult,
      "lockInAssessment:",
      lockInAssessment,
    );
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

  console.log("Metrics:", metrics);

  // Helper helper to get simplified color for UI
  const getProgressColor = (color: string) => {
    switch (color) {
      case "red":
        return "bg-red-500";
      case "yellow":
        return "bg-yellow-500";
      case "green":
        return "bg-green-500";
      case "purple":
        return "bg-purple-500";
      case "light green":
        return "bg-emerald-400";
      default:
        return "bg-gray-300";
    }
  };

  const getScoreColor = (score: string) => {
    // Logic to determine color based on score if needed, or mapping API colors
    return "text-gray-900";
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Top Navigation / Breadcrumb area could go here if needed, but we have a header card */}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 pt-2! relative overflow-hidden">
          <Button
            onClick={() => router.back()}
            className="rounded-md mb-2 transition-colors gap-2 w-24 md:w-32 bg-red-50 text-destructive hover:bg-destructive hover:text-white"
          >
            <ChevronLeft className="size-5" /> Back
          </Button>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mt-6 md:mt-0">
            {/* Avatar / Initials */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-[#955aa4] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
              <User className="w-12 h-12 md:w-16 md:h-16 opacity-80" />
            </div>

            {/* Patient Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {patientResult?.patientName}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4 justify-center sm:justify-start">
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <Activity className="w-4 h-4 text-purple-500" />
                  <span>
                    {patientResult?.patientAge} yrs, {patientResult?.patientSex}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <School className="w-4 h-4 text-purple-500" />
                  <span>{patientResult?.schoolName}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>
                    Joined{" "}
                    {new Date(
                      patientResult?.createdAt || "",
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Locked-In Score Indicator */}
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 min-w-[140px] mx-auto sm:mx-0">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                Locked In
              </span>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-[#955aa4]">
                  {lockInAssessment?.lockedInScore.split("/")[0]}
                </span>
                <span className="text-lg text-gray-400 mb-1">/ 10</span>
              </div>
              <div
                className="mt-2 px-3 py-2 rounded-full text-xs font-bold text-white uppercase tracking-wide"
                style={{
                  backgroundColor: generateColor(
                    lockInAssessment?.lockedInColor || "gray",
                  ),
                }}
              >
                {lockInAssessment?.lockedInScoreDescription || "Unknown"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Assessment Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detailed Metrics Cards */}
            {metrics.map((category, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                    {idx === 0 ? (
                      <Brain className="w-5 h-5 text-purple-600" />
                    ) : idx === 1 ? (
                      <AlertCircle className="w-5 h-5 text-purple-600" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      {category.description} • Score: {category.score}
                    </p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {(category.items as any[]).map((item: any, i: number) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end mb-1">
                        <span className="font-medium text-gray-700">
                          {item.name}
                        </span>
                        <span
                          className="text-sm font-bold px-2 py-0.5 rounded text-white"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.value}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 min-h-[2.5em]">
                        {item.description}
                      </p>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mt-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          className="h-full rounded-full opacity-50"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Actions & History */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                  Actions History
                </h2>
                <button className="text-sm text-[#955aa4] font-medium hover:underline">
                  View All
                </button>
              </div>

              {/* Tabs Switcher for this card */}
              <div className="flex p-1 bg-gray-100 rounded-lg mb-6">
                <button
                  onClick={() => setActiveTab("assessment")}
                  className={cn(
                    "flex-1 py-1.5 text-xs font-bold rounded-md transition-all",
                    activeTab === "assessment"
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={cn(
                    "flex-1 py-1.5 text-xs font-bold rounded-md transition-all",
                    activeTab === "history"
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  History
                </button>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px] pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                {[
                  {
                    title: "Group Therapy",
                    subtitle: "Dr. Francis Nkrumah",
                    date: "Jan 3rd, 2026",
                    type: "Therapy",
                    icon: Users,
                  },
                  {
                    title: "CBT Session",
                    subtitle: "Dr. James Nuamah",
                    date: "Dec 20th, 2025",
                    type: "Therapy",
                    icon: Brain,
                  },
                  {
                    title: "Clinical Eval",
                    subtitle: "Dr. Francis Nkrumah",
                    date: "Jan 3rd, 2026",
                    type: "Evaluation",
                    icon: Activity,
                  },
                ].map((action, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-[#955aa4] group-hover:bg-[#955aa4] group-hover:text-white transition-colors">
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900">
                        {action.title}
                      </h4>
                      <p className="text-xs text-gray-500">{action.subtitle}</p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                        <Clock className="w-3 h-3" />{" "}
                        <p className="pt-0.5">{action.date}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>

              <button className="sm:relative sm:-bottom-20 mt-6 w-full py-3 rounded-xl bg-destructive text-white font-bold text-sm hover:bg-[#864e94] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-200">
                <Plus className="w-4 h-4" /> Add Action
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
