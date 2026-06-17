"use client";

import { useState } from "react";
import { CreateLauncherProps } from "@/lib/types/components/curator/create/create";
import { CREATE_LAUNCHER_ITEMS_CONFIG } from "@/lib/constants/components/curator/create/create-launcher";

type UseCreateLauncherProps = Omit<
  CreateLauncherProps,
  "setShowCreateLauncher"
>;

export const useCreateLauncher = ({
  onOpenSchoolModal,
  onOpenMemberModal,
  onOpenPartnerModal,
  onOpenReachOverview,
}: UseCreateLauncherProps) => {
  const [comingSoonFeature, setComingSoonFeature] = useState<string | null>(
    null,
  );

  const getHandler = (id: string) => {
    switch (id) {
      case "schools":
        return onOpenSchoolModal;
      case "team":
        return onOpenMemberModal;
      case "partners":
        return onOpenPartnerModal;
      case "reach":
        return onOpenReachOverview;
      default:
        return undefined;
    }
  };

  const menuItems = CREATE_LAUNCHER_ITEMS_CONFIG.map((item) => ({
    ...item,
    onClick: item.requiresHandler ? getHandler(item.id) : undefined,
  }));

  const handleItemClick = (item: (typeof menuItems)[0]) => {
    if (item.isComingSoon) {
      setComingSoonFeature(item.label);
    } else if (item.onClick) {
      item.onClick();
    }
  };

  return {
    comingSoonFeature,
    setComingSoonFeature,
    menuItems,
    handleItemClick,
  };
};
