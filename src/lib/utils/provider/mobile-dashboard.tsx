import { GlassNavTab } from "@/components/ui/liquid-glass-navbar";

import {
  School as SchoolLucide,
  Users,
  AlertTriangle,
  User,
} from "lucide-react";

export const mobileTabs: GlassNavTab[] = [
  {
    id: "schools",
    label: "Schools",
    icon: <SchoolLucide size={20} />,
  },
  {
    id: "patients",
    label: "Patients",
    icon: <Users size={20} />,
  },
  {
    id: "urgent",
    label: "Urgent",
    icon: <AlertTriangle size={20} />,
  },
  {
    id: "profile",
    label: "Profile",
    icon: <User size={20} />,
  },
];

// Quick fade transition for mobile panel switching
export const panelVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export const panelTransition = { duration: 0.15, ease: "easeOut" as const };
