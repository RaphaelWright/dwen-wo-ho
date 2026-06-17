"use client";

import {
  PatientsTab,
  IconsTab,
  ProvidersTab,
} from "@/components/curator/school-details";
import type { SchoolDetailsTabContentProps } from "@/lib/types/components/curator/school-details/school-details";

export function SchoolDetailsTabContent({
  activeTab,
  patients,
  patientsLoading,
  schoolId,
  schoolName,
  compactTimeAgo,
  appliedSearchQuery,
  onViewPatient,
  schoolIcons,
  onIconClick,
  onAddFirstIcon,
  providers,
  providersLoading,
  onProviderClick,
}: SchoolDetailsTabContentProps) {
  return (
    <div className="overflow-hidden">
      {activeTab === "patients" && (
        <PatientsTab
          patients={patients}
          isLoading={patientsLoading}
          schoolId={schoolId}
          schoolName={schoolName}
          compactTimeAgo={compactTimeAgo}
          searchQuery={appliedSearchQuery}
          onViewPatient={onViewPatient}
        />
      )}

      {activeTab === "icons" && (
        <div className="p-4 sm:p-6">
          <IconsTab
            icons={schoolIcons}
            searchQuery={appliedSearchQuery}
            onIconClick={onIconClick}
            onAddFirstIcon={onAddFirstIcon}
          />
        </div>
      )}

      {activeTab === "providers" && (
        <div className="p-4 sm:p-6">
          <ProvidersTab
            providers={providers}
            isLoading={providersLoading}
            searchQuery={appliedSearchQuery}
            onProviderClick={onProviderClick}
          />
        </div>
      )}
    </div>
  );
}
