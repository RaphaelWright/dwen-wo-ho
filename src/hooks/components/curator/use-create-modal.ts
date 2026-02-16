"use client";

import { useState } from "react";
import { CreateModalProps } from "@/lib/types/components/curator/create-modal";
import { CREATE_MODAL_ITEMS_CONFIG } from "@/lib/constants/components/curator/create-modal";

type UseCreateModalProps = Omit<CreateModalProps, "setShowCreateModal">;

export const useCreateModal = ({
  onOpenSchoolModal,
  onOpenMemberModal,
  onOpenPartnerModal,
  onOpenReachModal,
}: UseCreateModalProps) => {
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
        return onOpenReachModal;
      default:
        return undefined;
    }
  };

  const menuItems = CREATE_MODAL_ITEMS_CONFIG.map((item) => ({
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
