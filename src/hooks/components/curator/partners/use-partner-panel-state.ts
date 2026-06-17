"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import { DYNAMIC_ENDPOINTS } from "@/lib/constants/endpoints";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { School } from "@/lib/types/entities/school";
import {
  AssociatedSchool,
  AssociatedProvider,
} from "@/lib/types/entities/partners";

export const usePartnerPanelState = () => {
  const router = useRouter();

  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedProviderEmail, setSelectedProviderEmail] = useState("");
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const handleSchoolClick = useCallback(
    async (school: AssociatedSchool) => {
      try {
        const response = await api(
          DYNAMIC_ENDPOINTS.SCHOOLS.GET(String(school.id)),
        );
        if (response?.success && response.data) {
          setSelectedSchool(response.data);
          setShowSchoolModal(true);
        }
      } catch {
        router.push(`${ROUTES.curator.schools}/${String(school.id)}`);
      }
    },
    [router],
  );

  const handleProviderClick = useCallback((provider: AssociatedProvider) => {
    setSelectedProviderEmail(provider.email);
    setShowProviderModal(true);
  }, []);

  return {
    showProviderModal,
    setShowProviderModal,
    selectedProviderEmail,
    setSelectedProviderEmail,
    showSchoolModal,
    setShowSchoolModal,
    selectedSchool,
    setSelectedSchool,
    handleSchoolClick,
    handleProviderClick,
  };
};
