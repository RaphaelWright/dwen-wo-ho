"use client";

import { useState, useCallback } from "react";
import { School } from "@/lib/types/school";

export function useCuratorSchoolSelection() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showSchoolModal, setShowSchoolModal] = useState(false);

  const handleSchoolSelect = useCallback((school: School | null) => {
    setSelectedSchool(school);
    setShowSchoolModal(false);
  }, []);

  const handleClearSchool = useCallback(() => {
    setSelectedSchool(null);
  }, []);

  return {
    selectedSchool,
    setSelectedSchool,
    showSchoolModal,
    setShowSchoolModal,
    handleSchoolSelect,
    handleClearSchool,
  };
}
