// Mobile dashboard tab configuration
export const MOBILE_TABS_CONFIG = [
  {
    id: "schools",
    label: "Schools",
    iconName: "School",
  },
  {
    id: "patients",
    label: "Patients",
    iconName: "Users",
  },
  {
    id: "urgent",
    label: "Urgent",
    iconName: "AlertTriangle",
  },
  {
    id: "profile",
    label: "Profile",
    iconName: "User",
  },
];

// Quick fade transition for mobile panel switching
export const PANEL_VARIANTS = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export const PANEL_TRANSITION = { duration: 0.15, ease: "easeOut" as const };
