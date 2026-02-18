"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "@/lib/constants/routes";
import { performLogout } from "@/lib/auth-utils";

export const usePendingVerification = () => {
  const queryClient = useQueryClient();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    performLogout(queryClient, ROUTES.provider.auth);
  };

  return {
    showLogoutModal,
    setShowLogoutModal,
    handleLogout,
  };
};
