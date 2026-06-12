"use client";

import {
  ChevronLeft,
  Activity,
  Clock,
  CheckCircle2,
  Plus,
  FileText,
  Stethoscope,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { useCuratorPatientDetails } from "@/hooks/curator/use-curator-patient-details";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import PatientHeader from "@/components/curator/patient-dashboard/patient-header";
import PatientMetrics from "@/components/curator/patient-dashboard/patient-metrics";

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
      <div className="bg-muted/5 flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-b-2" />

          <p className="text-muted-foreground text-sm">
            Loading patient details...
          </p>
        </div>
      </div>
    );
  }

  if (!patientResult || !lockInAssessment) {
    return (
      <div className="bg-muted/5 flex min-h-screen flex-col items-center justify-center p-6">
        <Button
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground mb-3 flex items-center gap-1 text-sm"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>

        <p className="text-destructive text-sm">
          Failed to load patient details
        </p>
      </div>
    );
  }

  return (
    <div className="bg-muted/5 animate-in fade-in flex min-h-screen flex-col duration-500">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <PatientHeader
          patientResult={patientResult}
          lockInAssessment={lockInAssessment}
          onBack={() => router.back()}
          onDelete={() => setShowDeleteModal(true)}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Assessment Data */}

          <div className="space-y-6 lg:col-span-2">
            <PatientMetrics metrics={metrics} />

            {/* Assessment Metadata Card */}
            <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-sm">
              <div className="border-border bg-muted/20 flex items-center gap-4 border-b px-6 py-4">
                <div className="bg-accent border-border rounded-xl border p-2 shadow-sm">
                  <FileText className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-foreground text-lg font-bold tracking-tight">
                    Assessment Details
                  </h3>
                  <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    Lock-in Information
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
                    Lock-in ID
                  </p>
                  <p className="text-foreground text-sm font-medium">
                    #{lockInAssessment?.lockinId}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
                    Assessment Date
                  </p>
                  <p className="text-foreground text-sm font-medium">
                    {lockInAssessment?.lockinDate
                      ? new Date(
                          lockInAssessment.lockinDate,
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
                    School Type
                  </p>
                  <p className="text-foreground text-sm font-medium">
                    {lockInAssessment?.schoolType}
                  </p>
                </div>
                {lockInAssessment?.comment && (
                  <div className="sm:col-span-3">
                    <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
                      Comment
                    </p>
                    <p className="text-foreground bg-muted/30 rounded-lg p-3 text-sm">
                      {lockInAssessment.comment}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Urgent Care Status Card */}
            <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-sm">
              <div className="border-border bg-muted/20 flex items-center gap-4 border-b px-6 py-4">
                <div className="bg-accent border-border rounded-xl border p-2 shadow-sm">
                  <Stethoscope className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-foreground text-lg font-bold tracking-tight">
                    Urgent Care Status
                  </h3>
                  <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    Care Monitoring
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      lockInAssessment?.inUrgentCare
                        ? "animate-pulse bg-red-500"
                        : "bg-green-500"
                    }`}
                  />
                  <span className="text-foreground font-medium">
                    {lockInAssessment?.inUrgentCare
                      ? "In Urgent Care"
                      : "Not in Urgent Care"}
                  </span>
                </div>
                {lockInAssessment?.inUrgentCare && (
                  <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
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
                      <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
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
              <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-sm">
                <div className="border-border bg-muted/20 flex items-center gap-4 border-b px-6 py-4">
                  <div className="bg-accent border-border rounded-xl border p-2 shadow-sm">
                    <TrendingUp className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-lg font-bold tracking-tight">
                      School Type Comparison
                    </h3>
                    <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                      {lockInAssessment.schoolType} Averages (n=
                      {lockInAssessment.schoolTypeAverages.sampleSize})
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Locked In Score */}
                  <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Locked In Score
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-foreground text-lg font-bold">
                        {lockInAssessment.lockedInScore}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageLockedInScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* General Mental Health */}
                  <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Mental Health
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-foreground text-lg font-bold">
                        {lockInAssessment.generalMentalHealthScore}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageGeneralMentalHealthScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Depression */}
                  <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Depression
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-foreground text-lg font-bold">
                        {lockInAssessment.possibleDepressionScore}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageDepressionScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Loneliness */}
                  <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Loneliness
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-foreground text-lg font-bold">
                        {lockInAssessment.lonelinessScore}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageLonelinessScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Suicidality */}
                  <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Suicidality
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-foreground text-lg font-bold">
                        {lockInAssessment.suicidalRiskScore}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageSuicidalityScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Exam Anxiety */}
                  <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Exam Anxiety
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-foreground text-lg font-bold">
                        {lockInAssessment.examAnxietyScore}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageExamAnxietyScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Core Anxiety */}
                  <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Core Anxiety
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-foreground text-lg font-bold">
                        {lockInAssessment.coreAnxietyScore}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageCoreAnxietyScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Physical Distress */}
                  <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Physical Distress
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-foreground text-lg font-bold">
                        {lockInAssessment.physicalDistressScore}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averagePhysicalDistressScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Exam Preparation */}
                  <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Exam Preparation
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-foreground text-lg font-bold">
                        {lockInAssessment.examPrepScore}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageExamPreparationScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Motivation */}
                  <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Motivation
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-foreground text-lg font-bold">
                        {lockInAssessment.motivationScore}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageMotivationScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Study Skills */}
                  <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Study Skills
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-foreground text-lg font-bold">
                        {lockInAssessment.studySkillsScore}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        avg:{" "}
                        {lockInAssessment.schoolTypeAverages.averageStudySkillsScore.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Procrastination */}
                  <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Procrastination
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-foreground text-lg font-bold">
                        {lockInAssessment.procrastinationScore}
                      </span>
                      <span className="text-muted-foreground text-xs">
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
            <div className="bg-card border-border flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm">
              <div className="flex min-h-0 flex-1 flex-col p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-foreground text-lg font-bold">
                    Actions History
                  </h2>

                  <Button
                    variant={"link"}
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    View All
                  </Button>
                </div>

                {/* Tabs Switcher for this card */}

                <div className="bg-muted mb-6 flex shrink-0 gap-1 rounded-xl p-1">
                  <Button
                    onClick={() => setActiveTab("assessment")}
                    variant="ghost"
                    className={cn(
                      "h-8 flex-1 rounded-lg py-1.5 text-xs font-bold transition-all hover:bg-none",

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
                      "h-8 flex-1 rounded-lg py-1.5 text-xs font-bold transition-all hover:bg-none",

                      activeTab === "history"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    History
                  </Button>
                </div>

                <div className="scrollbar-thumb-border flex-1 scrollbar-thin space-y-3 overflow-y-auto">
                  {isActionsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2" />
                    </div>
                  ) : actions.length === 0 ? (
                    <p className="text-muted-foreground py-8 text-center text-xs">
                      No actions yet
                    </p>
                  ) : (
                    actions.map((action, i) => (
                      <div
                        key={action.id ?? i}
                        className="hover:bg-muted/50 hover:border-border group flex gap-4 rounded-xl border border-transparent p-3 transition-colors"
                      >
                        <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors">
                          <Activity className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-foreground truncate text-sm font-bold">
                            {action.title}
                          </h4>

                          <p className="text-muted-foreground truncate text-xs">
                            {action.type}
                          </p>

                          <div className="text-muted-foreground mt-1 flex items-center gap-1 text-[10px]">
                            <Clock className="h-3 w-3" />{" "}
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
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="border-border bg-muted/10 mt-auto border-t p-4">
                <Button className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700">
                  <Plus className="h-4 w-4" /> Add Action
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
