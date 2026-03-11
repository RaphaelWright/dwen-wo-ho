"use client";

import { useState } from "react";
import { ROUTES } from "@/lib/constants/routes";
import { useAuthQuery } from "@/hooks/queries/use-auth";

export const usePendingVerification = () => {
  const { logout } = useAuthQuery();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout(ROUTES.provider.auth);
  };

  return {
    showLogoutModal,
    setShowLogoutModal,
    handleLogout,
  };
};
