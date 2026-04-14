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
  FileText,
  Stethoscope,
  TrendingUp,
  Users,
  Trash2,
} from "lucide-react";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { useCuratorPatientDetails } from "@/hooks/curator/use-curator-patient-details";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

import { getColorHex } from "@/lib/utils/color-utils";
import { IconProgress } from "@tabler/icons-react";

export default function PatientDetailsPage() {
  const {
    router,

    patientResult,

    lockInAssessment,

    isLoading,

    activeTab,

    setActiveTab,

    metrics,

    actions,

    isActionsLoading,

    showDeleteModal,

    setShowDeleteModal,

    singleDeletePending,

    handleDeleteConfirm,
  } = useCuratorPatientDetails();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3" />

          <p className="text-muted-foreground text-sm">
            Loading patient details...
          </p>
        </div>
      </div>
    );
  }

  if (!patientResult || !lockInAssessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-muted/5">
        <Button
          onClick={() => router.back()}
          className="mb-3 text-muted-foreground hover:text-foreground text-sm flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>

        <p className="text-destructive text-sm">
          Failed to load patient details
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/5 flex flex-col animate-in fade-in duration-500">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Card */}

        <div className="bg-card rounded-3xl shadow-sm border border-border p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="rounded-full transition-colors gap-2 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-5" /> Back to List
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Avatar / Initials */}

            <div className="space-y-2 flex flex-col items-center justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-teal-500/10 rounded-3xl flex items-center justify-center text-teal-600 shadow-inner shrink-0 ring-1 ring-teal-500/20">
                <User className="w-12 h-12 md:w-16 md:h-16 opacity-80" />
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
                className="gap-2 rounded-md w-full"
              >
                <Trash2 className="size-4" /> Delete
              </Button>
            </div>

            {/* Patient Info */}

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {patientResult?.patientName}
              </h1>

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                  <Activity className="w-4 h-4 text-teal-600" />

                  <span className="font-medium">
                    {patientResult?.patientAge} yrs, {patientResult?.patientSex}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                  <School className="w-4 h-4 text-teal-600" />

                  <span className="font-medium">
                    {patientResult?.schoolName}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                  <Calendar className="w-4 h-4 text-teal-600" />

                  <span className="font-medium">
                    Joined{" "}
                    {new Date(
                      patientResult?.createdAt || "",
                    ).toLocaleDateString()}
                  </span>
                </div>
                {lockInAssessment?.schoolType && (
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                    <School className="w-4 h-4 text-teal-600" />

                    <span className="font-medium">
                      {lockInAssessment.schoolType}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                  <IconProgress className="w-4 h-4 text-teal-600" />
                  <span className="font-medium">
                    Year: {patientResult?.patientLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Locked-In Score Indicator */}

            <div className="flex flex-col items-center p-6 bg-muted/30 rounded-3xl border border-border/50 min-w-40 mx-auto sm:mx-0 backdrop-blur-sm">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Locked In Score
              </span>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold text-teal-600 tracking-tight">
                  {lockInAssessment?.lockedInScore.split("/")[0]}
                </span>

                <span className="text-lg text-muted-foreground font-medium">
                  /10
                </span>
              </div>

              <div
                className="px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wide shadow-sm"
                style={{
                  backgroundColor: getColorHex(
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
                className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden group hover:border-primary/20 transition-colors duration-300"
              >
                <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-4">
                  <div className="p-2 bg-accent rounded-xl shadow-sm border border-border group-hover:border-primary/20 transition-colors">
                    {idx === 0 ? (
                      <Brain className="w-5 h-5 text-teal-600" />
                    ) : idx === 1 ? (
                      <AlertCircle className="w-5 h-5 text-teal-600" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-teal-600" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-foreground text-lg tracking-tight">
                      {category.name}
                    </h3>

                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                      {category.description} • Score: {category.score}
                    </p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {category.items.map((item, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end mb-1">
                        <span className="font-medium text-foreground text-sm">
                          {item.name}
                        </span>

                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded text-background"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.value}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em] leading-relaxed">
                        {item.description}
                      </p>

                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          className="h-full rounded-full opacity-60"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Assessment Metadata Card */}
            <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-4">
                <div className="p-2 bg-accent rounded-xl shadow-sm border border-border">
                  <FileText className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg tracking-tight">
                    Assessment Details
                  </h3>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                    Lock-in Information
                  </p>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-1">
                    Lock-in ID
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    #{lockInAssessment?.lockinId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-1">
                    Assessment Date
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {lockInAssessment?.lockinDate
                      ? new Date(
                          lockInAssessment.lockinDate,
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-1">
                    School Type
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {lockInAssessment?.schoolType}
                  </p>
                </div>
                {lockInAssessment?.comment && (
                  <div className="sm:col-span-3">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">
                      Comment
                    </p>
                    <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg">
                      {lockInAssessment.comment}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Urgent Care Status Card */}
            <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-4">
                <div className="p-2 bg-accent rounded-xl shadow-sm border border-border">
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg tracking-tight">
                    Urgent Care Status
                  </h3>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                    Care Monitoring
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      lockInAssessment?.inUrgentCare
                        ? "bg-red-500 animate-pulse"
                        : "bg-green-500"
                    }`}
                  />
                  <span className="font-medium text-foreground">
                    {lockInAssessment?.inUrgentCare
                      ? "In Urgent Care"
                      : "Not in Urgent Care"}
                  </span>
                </div>
                {lockInAssessment?.inUrgentCare && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">
                        Entered At
                      </p>
                      <p className="text-foreground">
                        {lockInAssessment.urgentCareEnteredAt
                          ? new Date(
                              lockInAssessment.urgentCareEnteredAt,
                            ).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">
                        Time in Care
                      </p>
                      <p className="text-foreground">
                        {lockInAssessment.timeInUrgentCareMinutes
                          ? `${Math.floor(lockInAssessment.timeInUrgentCareMinutes / 60)}h ${lockInAssessment.timeInUrgentCareMinutes % 60}m`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* School Type Averages Comparison */}
            {lockInAssessment?.schoolTypeAverages && (
              <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-4">
                  <div className="p-2 bg-accent rounded-xl shadow-sm border border-border">
                    <TrendingUp className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg tracking-tight">
                      School Type Comparison
                    </h3>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                      {lockInAssessment.schoolType} Averages (n=
                      {lockInAssessment.schoolTypeAverages.sampleSize})
                    </p>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Locked In Score */}
                  <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
                    <span className="text-xs text-muted-foreground uppercase font-bold">
                      Locked In Score
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-foreground">
                        {lockInAssessment.lockedInScore}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageLockedInScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* General Mental Health */}
                  <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
                    <span className="text-xs text-muted-foreground uppercase font-bold">
                      Mental Health
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-foreground">
                        {lockInAssessment.generalMentalHealthScore}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageGeneralMentalHealthScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Depression */}
                  <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
                    <span className="text-xs text-muted-foreground uppercase font-bold">
                      Depression
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-foreground">
                        {lockInAssessment.possibleDepressionScore}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageDepressionScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Loneliness */}
                  <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
                    <span className="text-xs text-muted-foreground uppercase font-bold">
                      Loneliness
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-foreground">
                        {lockInAssessment.lonelinessScore}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageLonelinessScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Suicidality */}
                  <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
                    <span className="text-xs text-muted-foreground uppercase font-bold">
                      Suicidality
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-foreground">
                        {lockInAssessment.suicidalRiskScore}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageSuicidalityScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Exam Anxiety */}
                  <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
                    <span className="text-xs text-muted-foreground uppercase font-bold">
                      Exam Anxiety
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-foreground">
                        {lockInAssessment.examAnxietyScore}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageExamAnxietyScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Core Anxiety */}
                  <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
                    <span className="text-xs text-muted-foreground uppercase font-bold">
                      Core Anxiety
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-foreground">
                        {lockInAssessment.coreAnxietyScore}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageCoreAnxietyScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Physical Distress */}
                  <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
                    <span className="text-xs text-muted-foreground uppercase font-bold">
                      Physical Distress
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-foreground">
                        {lockInAssessment.physicalDistressScore}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averagePhysicalDistressScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Exam Preparation */}
                  <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
                    <span className="text-xs text-muted-foreground uppercase font-bold">
                      Exam Preparation
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-foreground">
                        {lockInAssessment.examPrepScore}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageExamPreparationScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Motivation */}
                  <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
                    <span className="text-xs text-muted-foreground uppercase font-bold">
                      Motivation
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-foreground">
                        {lockInAssessment.motivationScore}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageMotivationScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Study Skills */}
                  <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
                    <span className="text-xs text-muted-foreground uppercase font-bold">
                      Study Skills
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-foreground">
                        {lockInAssessment.studySkillsScore}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageStudySkillsScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Procrastination */}
                  <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
                    <span className="text-xs text-muted-foreground uppercase font-bold">
                      Procrastination
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-foreground">
                        {lockInAssessment.procrastinationScore}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageProcrastinationScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Actions & History */}

          <div className="space-y-6">
            <div className="bg-card rounded-3xl shadow-sm border border-border h-full flex flex-col overflow-hidden">
              <div className="p-6 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground">
                    Actions History
                  </h2>

                  <Button
                    variant={"link"}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    View All
                  </Button>
                </div>

                {/* Tabs Switcher for this card */}

                <div className="flex p-1 bg-muted rounded-xl mb-6 shrink-0 gap-1">
                  <Button
                    onClick={() => setActiveTab("assessment")}
                    variant="ghost"
                    className={cn(
                      "flex-1 py-1.5 h-8 text-xs font-bold rounded-lg transition-all hover:bg-none",

                      activeTab === "assessment"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    Pending
                  </Button>

                  <Button
                    onClick={() => setActiveTab("history")}
                    variant="ghost"
                    className={cn(
                      "flex-1 py-1.5 h-8 text-xs font-bold rounded-lg transition-all hover:bg-none",

                      activeTab === "history"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    History
                  </Button>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border">
                  {isActionsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    </div>
                  ) : actions.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-8">
                      No actions yet
                    </p>
                  ) : (
                    actions.map((action, i) => (
                      <div
                        key={action.id ?? i}
                        className="flex gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border group"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                          <Activity className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-foreground truncate">
                            {action.title}
                          </h4>

                          <p className="text-xs text-muted-foreground truncate">
                            {action.type}
                          </p>

                          <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                            <Clock className="w-3 h-3" />{" "}
                            <p className="pt-0.5">
                              {action.createdAt
                                ? new Date(
                                    action.createdAt,
                                  ).toLocaleDateString()
                                : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-border bg-muted/10 mt-auto">
                <Button className="w-full h-10 rounded-lg bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <Plus className="w-4 h-4" /> Add Action
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient Record"
        message="This will permanently delete this patient record. This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={singleDeletePending}
      />
    </div>
  );
}
