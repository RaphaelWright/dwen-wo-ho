"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
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

  if (!patientResult) {
    return (
      <div className="bg-muted/5 flex min-h-screen flex-col items-center justify-center p-6">
        <Button
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground mb-3 text-sm"
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
    <div className="bg-muted/5 animate-in fade-in flex min-h-screen flex-col duration-500">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
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
            <LoadingButton
              onClick={() => handleUpdateActionStatus("TREATING")}
              loading={isUpdating}
              loadingText="Updating..."
              disabled={isAnotherProviderTreating}
              className="bg-teal-600 px-6 py-2.5 hover:bg-teal-700 disabled:opacity-50"
              title={
                isAnotherProviderTreating
                  ? "Another provider is already treating this patient"
                  : ""
              }
            >
              Start Treating
            </LoadingButton>
          ) : (
            <LoadingButton
              onClick={() => setShowStopConfirm(true)}
              loading={isUpdating}
              loadingText="Updating..."
              variant="outline"
              className="border-red-300 px-6 py-2.5 hover:bg-red-50 hover:text-red-700"
            >
              Stop Treating
            </LoadingButton>
          )}

          {/* Minimal Treatment Status Badge */}
          {(isTreating || isAnotherProviderTreating) && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex cursor-help items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
                      isTreating
                        ? "border-teal-200 bg-teal-50 text-teal-700"
                        : "border-amber-200 bg-amber-50 text-amber-700",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isTreating
                          ? "animate-pulse bg-teal-500"
                          : "bg-amber-500",
                      )}
                    />
                    Under Treatment
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="start"
                  className="max-w-xs rounded-lg border border-slate-200 bg-white p-3 text-slate-700 shadow-lg"
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Assessment Data */}
          <div className="space-y-6 lg:col-span-2">
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
