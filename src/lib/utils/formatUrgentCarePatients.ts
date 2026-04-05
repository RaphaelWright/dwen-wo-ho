import { UrgentCarePatient } from "@/lib/types/components/curator/school-details";
import type { UrgentPatient } from "@/components/shared/urgent-card";

export function formatUrgentCarePatients(
  patients: UrgentCarePatient[] = [],
  schoolName: string = "Unknown",
  compactTimeAgo: (date: string) => string,
): UrgentPatient[] {
  return [...patients]
    .sort((a, b) => {
      const dateA = new Date(
        a.urgentCareEnteredAt || a.lockinDate || a.createdAt || 0,
      ).getTime();
      const dateB = new Date(
        b.urgentCareEnteredAt || b.lockinDate || b.createdAt || 0,
      ).getTime();
      return dateB - dateA;
    })
    .map((p) => ({
      id: p.id || p.lockinId || p.patientResultId || Math.random().toString(),
      patientResultId: p.patientResultId || p.id || "",
      patientName: p.patientName || "Patient",
      // schoolId is not available in UrgentCarePatient; curator panel filters by school context
      schoolId: 0,
      schoolName: schoolName,
      time: compactTimeAgo(
        p.urgentCareEnteredAt || p.lockinDate || p.createdAt || "",
      ),
      lockinScore: p.lockedInScore ?? 0,
      avatarUrl: undefined,
    }));
}
