import { Activity, Brain, Users, LucideIcon } from "lucide-react";

/**
 * Mock / placeholder data used across the application.
 * These are defaults shown before real data loads or as placeholder content.
 * Replace with real API data as features are implemented.
 */

// ─── Default User Info ───────────────────────────────────────────────────────

export const DEFAULT_PENDING_USER_INFO = {
  name: "Dr. Amanda Gorman",
  title: "Clinical Psychologist",
  timeAgo: "2 hours ago",
};

export const DEFAULT_PROVIDER_USER_INFO = {
  name: "Provider",
  title: "Health Provider",
  specialty: "",
  timeAgo: "Recently",
  profileImage: undefined as string | undefined,
};

// ─── Patient Actions History ─────────────────────────────────────────────────

export interface MockAction {
  title: string;
  subtitle: string;
  date: string;
  type: string;
  icon: LucideIcon;
}

export const MOCK_PATIENT_ACTIONS: MockAction[] = [
  {
    title: "Group Therapy",
    subtitle: "Dr. Francis Nkrumah",
    date: "Jan 3rd, 2026",
    type: "Therapy",
    icon: Users,
  },
  {
    title: "CBT Session",
    subtitle: "Dr. James Nuamah",
    date: "Dec 20th, 2025",
    type: "Therapy",
    icon: Brain,
  },
  {
    title: "Clinical Eval",
    subtitle: "Dr. Francis Nkrumah",
    date: "Jan 3rd, 2026",
    type: "Evaluation",
    icon: Activity,
  },
];

// ─── Lock In Form Options ───────────────────────────────────────────────────

export const LOCKIN_FREQUENCY_OPTIONS = [
  "never",
  "rarely",
  "sometimes",
  "often",
  "always",
];

export const LOCKIN_YES_NO_OPTIONS = ["yes", "no"];

export const LOCKIN_MOTIVATION_OPTIONS = [
  "none",
  "slightly",
  "moderate",
  "high",
];

export const LOCKIN_STUDY_FREQUENCY_OPTIONS = [
  "never",
  "rarely",
  "occasionally",
  "frequently",
  "always",
];

export const LOCKIN_TIME_TO_EXAM_OPTIONS = [
  "1d",
  "2d",
  "3d",
  "1w",
  "2w",
  "1m",
  "2m+",
];

export const LOCKIN_REASON_OPTIONS = ["exam", "assignment", "project", "other"];

// ─── Registration & Recovery Steps ──────────────────────────────────────────

export const SIGNUP_STEPS = ["Create", "Verify", "Profile"];

export const RECOVER_STEPS = ["Verify", "New Password"];
