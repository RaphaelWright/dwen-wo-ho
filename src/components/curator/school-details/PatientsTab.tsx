"use client";

import { Users } from "lucide-react";
import PatientCard from "@/components/shared/patient-card";
import { PatientsTabProps } from "@/lib/types/components/curator/school-details";
import type { PatientCase } from "@/lib/types/api/patient-results";

export function PatientsTab({
  patients,
  isLoading,
  onViewPatient,
  searchQuery = "",
}: PatientsTabProps & { searchQuery?: string }) {
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
      {filteredPatients.map((patient, index) => {
        return (
          <PatientCard
            key={patient.id}
            index={index}
            patient={patient}
            onActionClick={onViewPatient}
          />
        );
      })}
    </div>
  );
}
