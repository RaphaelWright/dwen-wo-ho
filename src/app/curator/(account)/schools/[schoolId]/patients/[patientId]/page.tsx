"use client";

import {
  ChevronLeft,
  User,
  Activity,
  Brain,
  BookOpen,
  AlertCircle,
  Clock,
  CheckCircle2,
  Plus,
  School,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  useCuratorPatientDetails,
  generateColor,
} from "@/hooks/curator/useCuratorPatientDetails";
import { MOCK_PATIENT_ACTIONS } from "@/lib/constants/mock-data";

export default function PatientDetailsPage() {
  const {
    router,
    patientResult,
    lockInAssessment,
    isLoading,
    activeTab,
    setActiveTab,
    metrics,
  } = useCuratorPatientDetails();

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

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
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
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 min-w-35 mx-auto sm:mx-0">
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
                  {category.items.map((item, i) => (
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

              <div className="space-y-4 flex-1 overflow-y-auto max-h-150 pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                {MOCK_PATIENT_ACTIONS.map((action, i) => (
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
