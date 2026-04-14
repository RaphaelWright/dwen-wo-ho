"use client";

import { Trash, Users } from "lucide-react";
import PatientCard from "@/components/shared/patient-card";
import { PatientsTabProps } from "@/lib/types/components/curator/school-details";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDeleteBulkPatientRecords } from "@/hooks/curator/use-curator-delete-patient-records";
import { SpinnerCustom } from "@/components/ui/custom-spinner";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export function PatientsTab({
  patients,
  isLoading,
  onViewPatient,
  searchQuery = "",
  schoolId,
}: PatientsTabProps & { searchQuery?: string; schoolId: string }) {
  const { bulkDeletePending, deleteBulkPatients } =
    useDeleteBulkPatientRecords(schoolId);
  const [selectedPatients, setSelectedPatients] = useState<
    Set<number | string>
  >(new Set([]));
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  const handleBulkDeleteConfirm = () => {
    deleteBulkPatients(selectedPatients, () => {
      setSelectedPatients(new Set());
      setShowBulkDeleteModal(false);
    });
  };

  const selectAll = selectedPatients.size === patients.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPatients(new Set(patients.map((p) => p.id)));
    } else {
      setSelectedPatients(new Set());
    }
  };

  const handleSelectPatient = (id: string | number, checked: boolean) => {
    const newSelected = new Set(selectedPatients);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedPatients(newSelected);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const filteredPatients = patients.filter((patient) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      patient.patientName?.toLowerCase().includes(query) ||
      patient.visibilityStatus?.toLowerCase().includes(query) ||
      patient.comment?.toLowerCase().includes(query)
    );
  });

  if (filteredPatients.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
          <Users className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <p className="text-foreground font-medium">No patients found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or add a new patient.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <p>Select all</p>
          <Checkbox
            id="select-all-checkbox"
            name="select-all-checkbox"
            checked={selectAll}
            onCheckedChange={handleSelectAll}
            className="bg-background border-primary"
          />
        </div>
        <Button
          variant={"destructive"}
          disabled={selectedPatients.size < 1 || bulkDeletePending}
          onClick={() => setShowBulkDeleteModal(true)}
        >
          {bulkDeletePending ? (
            <SpinnerCustom />
          ) : (
            <div className="flex gap-2 items-center justify-center">
              Delete <Trash className="size-4 text-white" />
            </div>
          )}
        </Button>
      </div>
      {filteredPatients.map((patient, index) => {
        return (
          <PatientCard
            key={patient.id}
            index={index}
            patient={patient}
            onActionClick={onViewPatient}
            showCheckbox={true}
            selectedPatients={selectedPatients}
            handleSelectPatient={handleSelectPatient}
          />
        );
      })}

      <ConfirmationModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Delete Patient Records"
        message={`This will permanently delete ${selectedPatients.size} patient record${selectedPatients.size > 1 ? "s" : ""}. This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={bulkDeletePending}
      />
    </div>
  );
}
