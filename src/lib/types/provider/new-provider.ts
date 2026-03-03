export type Patient = {
  id: string | number; // Unique identifier for dynamic routing (e.g., /provider/patients/[id])
  name: string;
  school: string;
  schoolLabel: string;
  time: string;
  score: number;
  emoji: string;
  avatarUrl?: string;
};

export type NotificationItem = {
  id: number;
  unread: boolean;
  targetName: string;
  targetSchoolId?: string | number;
  targetSchoolName?: string;
  text: string;
  meta: string;
  avatarUrl?: string;
  targetId?: string;
  targetType?: "patient" | "school" | "system";
};

export type ProfileData = {
  title: string;
  name: string;
  specialty: string;
  status: string;
  phone: string;
};
