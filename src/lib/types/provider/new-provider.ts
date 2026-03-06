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

// Alias for backward compatibility; NotificationItem now mirrors the unified Notification interface.
export type NotificationItem = Notification & { id: number };

export type ProfileData = {
  title: string;
  name: string;
  specialty: string;
  avatar: string;
  ranking: string;
  status: string;
  phone: string;
};
