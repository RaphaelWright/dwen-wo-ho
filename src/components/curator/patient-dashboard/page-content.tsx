"use client";

import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import PatientHeader from "@/components/curator/patient-dashboard/patient-header";
import PatientMetrics from "@/components/curator/patient-dashboard/patient-metrics";
import AssessmentDetailsCard from "@/components/curator/patient-dashboard/assessment-details-card";
import UrgentCareStatusCard from "@/components/curator/patient-dashboard/urgent-care-status-card";
import SchoolTypeComparisonCard from "@/components/curator/patient-dashboard/school-type-comparison-card";
import PatientActionsPanel from "@/components/curator/patient-dashboard/patient-actions-panel";
import type { PatientDetailsPageContentProps } from "@/lib/types/components/curator/patient-dashboard";

export function PatientDetailsPageContent({
  details,
}: PatientDetailsPageContentProps) {
  const {
    router,
    patientResult,
    lockInAssessment,
    metrics,
    actions,
    isActionsLoading,
    activeTab,
    setActiveTab,
    showDeleteModal,
    setShowDeleteModal,
    singleDeletePending,
    handleDeleteConfirm,
  } = details;

  if (!patientResult || !lockInAssessment) return null;

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
          <div className="space-y-6 lg:col-span-2">
            <PatientMetrics metrics={metrics} />
            <AssessmentDetailsCard lockInAssessment={lockInAssessment} />
            <UrgentCareStatusCard lockInAssessment={lockInAssessment} />
            <SchoolTypeComparisonCard lockInAssessment={lockInAssessment} />
          </div>

          <div className="space-y-6">
            <PatientActionsPanel
              actions={actions}
              isActionsLoading={isActionsLoading}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
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
