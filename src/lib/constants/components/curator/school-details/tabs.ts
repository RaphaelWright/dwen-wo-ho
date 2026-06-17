import { Users, Star, Stethoscope } from "lucide-react";
import type { SchoolTab } from "@/lib/types/components/curator/school-details/school-details";

export const SCHOOL_DETAILS_SEARCH_PLACEHOLDERS: Record<SchoolTab, string[]> = {
  patients: [
    "Search for patients...",
    "Look up by name...",
    "Find by visibility status...",
    "Search in comments...",
  ],
  icons: [
    "Search for icons...",
    "Look up by name...",
    "Find by lock-in tag...",
  ],
  providers: [
    "Search for providers...",
    "Look up by name or email...",
    "Find by specialty...",
    "Search by status...",
  ],
};

export const SCHOOL_TABS_CONFIG = [
  {
    key: "patients" as const,
    label: "Patients",
    icon: Users,
  },
  { key: "icons" as const, label: "Icons", icon: Star },
  {
    key: "providers" as const,
    label: "Providers",
    icon: Stethoscope,
  },
];
