import { Users, Star, Stethoscope } from "lucide-react";

export const URGENT_CARE_SKELETON_COUNT = 3;

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
