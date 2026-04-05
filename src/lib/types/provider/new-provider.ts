export type Patient = {
  id: string | number; // Unique identifier for dynamic routing (e.g., /provider/patients/[id])
  name: string;
  school: string;
  schoolLabel: string;
  time: string;
  score: number;
  avatarUrl?: string;
};

import { Notification } from "@/lib/types/notification";
import type { ProfileData as ApiProfileData } from "@/lib/types/api/provider-dashboard";

// Alias for backward compatibility; NotificationItem now mirrors the unified Notification interface.
export type NotificationItem = Notification & { id: number };

// Re-export API ProfileData and extend with frontend-only computed field
export type ProfileData = ApiProfileData & {
  ranking?: string; // frontend-only computed field, not in API spec
};
