"use client";

import { useState } from "react";
import useProviderDashboard from "./useProviderDashboard";
import { GlassNavTab } from "@/components/ui/liquid-glass-navbar";
import { School, Users, AlertTriangle, User } from "lucide-react";

export type MobilePanel = "schools" | "patients" | "urgent";

export function useProviderDashboardMobile() {
  const { setProfileOpen } = useProviderDashboard();

  const [activePanel, setActivePanel] = useState<MobilePanel>("patients");
  const [searchOpen, setSearchOpen] = useState(false);

  const mobileTabs: GlassNavTab[] = [
    {
      id: "schools",
      label: "Schools",
      icon: <School size={20} />,
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
      onAction: () => setProfileOpen(true),
    },
  ];

  // Quick fade transition for mobile panel switching
  const panelVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };
  const panelTransition = { duration: 0.15, ease: "easeOut" as const };

  return {
    activePanel,
    setActivePanel,
    searchOpen,
    setSearchOpen,
    mobileTabs,
    panelVariants,
    panelTransition,
  };
}
