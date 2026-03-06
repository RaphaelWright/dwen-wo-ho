import { UrgentCarePatient } from "@/lib/types/components/curator/school-details";

export function formatUrgentCarePatients(
  patients: UrgentCarePatient[] = [],
  schoolName: string = "Unknown",
  compactTimeAgo: (date: string) => string,
) {
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
      name: p.patientName || "Patient",
      school: schoolName,
      schoolLabel: schoolName,
      time: compactTimeAgo(
        p.urgentCareEnteredAt || p.lockinDate || p.createdAt || "",
      ),
      score: p.lockedInScore || 0,
      emoji: "👨🏽‍🎓",
      avatarUrl: undefined,
    }));
}
