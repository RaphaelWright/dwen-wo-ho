"use client";

import { useState } from "react";
import type { GlassNavTab } from "@/lib/types/components/ui/liquid-glass-navbar";
import { School, Users, AlertTriangle, User, Activity } from "lucide-react";
import type { MobilePanel } from "@/lib/types/components/provider/workspace/layout";
import {
  MOBILE_TABS_CONFIG,
  PANEL_VARIANTS,
  PANEL_TRANSITION,
} from "@/lib/constants/components/provider/workspace/mobile-dashboard";

function getIconComponent(iconName: string) {
  switch (iconName) {
    case "School":
      return <School size={20} />;
    case "Users":
      return <Users size={20} />;
    case "AlertTriangle":
      return <AlertTriangle size={20} />;
    case "User":
      return <User size={20} />;
    case "Activity":
      return <Activity size={20} />;
    default:
      return null;
  }
}

export function useProviderDashboardMobile(
  setProfileOpen: (open: boolean) => void,
) {
  const [activePanel, setActivePanel] = useState<MobilePanel>("patients");
  const [searchOpen, setSearchOpen] = useState(false);

  const mobileTabs: GlassNavTab[] = MOBILE_TABS_CONFIG.map((tab) => ({
    ...tab,
    icon: getIconComponent(tab.iconName),
    onAction: tab.id === "profile" ? () => setProfileOpen(true) : undefined,
  }));

  return {
    activePanel,
    setActivePanel,
    searchOpen,
    setSearchOpen,
    mobileTabs,
    panelVariants: PANEL_VARIANTS,
    panelTransition: PANEL_TRANSITION,
  };
}
