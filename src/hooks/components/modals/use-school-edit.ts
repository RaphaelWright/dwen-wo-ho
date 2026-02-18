"use client";

import { useState, useEffect, useRef } from "react";
import { useUpdateSchool } from "@/hooks/queries/useSchoolsQuery";
import { School } from "@/lib/types/school";

export interface SchoolFormData {
  name: string;
  nickname: string;
  motto: string;
  campuses: string[];
  type: string;
}

export const useSchoolEdit = ({
  school,
  onClose,
  onSchoolUpdated,
  onDisableSchool,
}: {
  school: School;
  onClose: () => void;
  onSchoolUpdated?: () => void;
  onDisableSchool?: () => void;
}) => {
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]);
  const [formData, setFormData] = useState<SchoolFormData>({
    name: "",
    nickname: "",
    motto: "",
    campuses: [],
    type: "",
  });

  const updateSchoolMutation = useUpdateSchool();
  const campusDropdownRef = useRef<HTMLDivElement>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (school) {
      setFormData({
        name: school.name || "",
        nickname: school.nickname || "",
        motto: school.motto || "",
        campuses: school.campuses || [],
        type: school.type || "",
      });
      setSelectedCampuses(school.campuses || []);
      setHasChanges(false);
    }
  }, [school]);

  const handleInputChange = (field: string, value: string) => {
    const processedValue = field === "motto" ? value.toUpperCase() : value;
    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));
    setHasChanges(true);
  };

  const handleCampusToggle = (campus: string) => {
    setSelectedCampuses((prev) =>
      prev.includes(campus)
        ? prev.filter((c) => c !== campus)
        : [...prev, campus],
    );
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.type) {
      return;
    }

    updateSchoolMutation.mutate(
      {
        id: school.id,
        name: formData.name,
        nickname: formData.nickname,
        type: formData.type,
        baseline: "",
        motto: formData.motto,
        campuses: selectedCampuses,
        logo: null,
      },
      {
        onSuccess: () => {
          onSchoolUpdated?.();
          onClose();
        },
      },
    );
  };

  const handleDisable = () => {
    onClose();
    onDisableSchool?.();
  };

  return {
    showCampusDropdown,
    setShowCampusDropdown,
    selectedCampuses,
    formData,
    updateSchoolMutation,
    campusDropdownRef,
    hasChanges,
    handleInputChange,
    handleCampusToggle,
    handleSubmit,
    handleDisable,
  };
};
