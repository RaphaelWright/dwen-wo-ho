"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProviderPatientDetails } from "@/hooks/provider/use-provider-patient-details";
import {
  PatientDetailsHeader,
  AssessmentMetricsPanel,
  ActionsPanel,
  AssessmentMetadataCard,
  UrgentCareStatusCard,
  SchoolComparisonCard,
} from "@/components/provider/patient-details";

export default function PatientResultPage() {
  const {
    router,
    patientResult,
    lockInAssessment,
    isLoading,
    metrics,
    activeTab,
    setActiveTab,
    pendingActions,
    historyActions,
    isActionsLoading,
    addPatientAction,
    isAddingAction,
    isTreating,
    isAnotherProviderTreating,
    treatingProviderName,
    handleUpdateActionStatus,
    isUpdating,
  } = useProviderPatientDetails();

  // Confirmation dialog state
  const [showStopConfirm, setShowStopConfirm] = useState(false);

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

  if (!patientResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-muted/5">
        <Button
          onClick={() => router.back()}
          className="mb-3 text-muted-foreground hover:text-foreground text-sm"
          variant="ghost"
        >
          Back
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
        <PatientDetailsHeader
          patientResult={patientResult}
          lockInAssessment={lockInAssessment}
          isTreating={isTreating}
          onBack={() => router.back()}
        />

        {/* Action Buttons & Treatment Status */}
        <div className="mb-6 flex items-center gap-3">
          {!isTreating ? (
            <Button
              onClick={() => handleUpdateActionStatus("TREATING")}
              disabled={isUpdating || isAnotherProviderTreating}
              className="bg-teal-600 hover:bg-teal-700 px-6 py-2.5 disabled:opacity-50"
              title={
                isAnotherProviderTreating
                  ? "Another provider is already treating this patient"
                  : ""
              }
            >
              {isUpdating ? "Updating..." : "Start Treating"}
            </Button>
          ) : (
            <Button
              onClick={() => setShowStopConfirm(true)}
              disabled={isUpdating}
              variant="outline"
              className="px-6 py-2.5 border-red-300 hover:bg-red-50 hover:text-red-700"
            >
              {isUpdating ? "Updating..." : "Stop Treating"}
            </Button>
          )}

          {/* Minimal Treatment Status Badge */}
          {(isTreating || isAnotherProviderTreating) && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium cursor-help border",
                      isTreating
                        ? "bg-teal-50 text-teal-700 border-teal-200"
                        : "bg-amber-50 text-amber-700 border-amber-200",
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        isTreating
                          ? "bg-teal-500 animate-pulse"
                          : "bg-amber-500",
                      )}
                    />
                    Under Treatment
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="start"
                  className="max-w-xs bg-white text-slate-700 border border-slate-200 shadow-lg rounded-lg p-3"
                >
                  <p className="text-xs leading-relaxed">
                    {isTreating
                      ? "You are actively treating this patient. Click 'Stop Treating' to end your involvement."
                      : `Dr. ${treatingProviderName} is currently treating this patient.`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Assessment Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detailed Metrics Cards */}
            <AssessmentMetricsPanel metrics={metrics} />

            {/* Assessment Metadata Card */}
            {lockInAssessment && (
              <AssessmentMetadataCard lockInAssessment={lockInAssessment} />
            )}

            {/* Urgent Care Status Card */}
            {lockInAssessment && (
              <UrgentCareStatusCard lockInAssessment={lockInAssessment} />
            )}

            {/* School Type Averages Comparison */}
            {lockInAssessment && (
              <SchoolComparisonCard lockInAssessment={lockInAssessment} />
            )}
          </div>

          {/* Right Column: Actions & History */}
          <div className="space-y-6">
            <div className="lg:sticky lg:top-6">
              <ActionsPanel
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                pendingActions={pendingActions}
                historyActions={historyActions}
                isLoading={isActionsLoading}
                onAddAction={addPatientAction}
                isAddingAction={isAddingAction}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog for Stopping Treatment */}
      <ConfirmationModal
        isOpen={showStopConfirm}
        onClose={() => setShowStopConfirm(false)}
        onConfirm={() => {
          handleUpdateActionStatus("NOT_TREATING");
          setShowStopConfirm(false);
        }}
        title="Stop Treating This Patient?"
        message="Are you sure you want to stop treating this patient? This will mark you as no longer actively involved in their care. You can always resume treatment later."
        confirmText="Yes, Stop Treating"
        cancelText="Cancel"
        variant="danger"
        isLoading={isUpdating}
      />
    </div>
  );
}
