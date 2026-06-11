"use client";

import { useState, useRef } from "react";
import useSchoolsQuery from "@/hooks/queries/use-schools";
import { School, SchoolFormData } from "@/lib/types/school";

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
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>(
    school?.campuses || [],
  );
  const [formData, setFormData] = useState<SchoolFormData>({
    name: school?.name || "",
    nickname: school?.nickname || "",
    motto: school?.motto || "",
    campuses: school?.campuses || [],
    type: school?.type || "",
    logo: undefined,
  });

  const { updateSchool, isUpdating } = useSchoolsQuery();
  const updateSchoolMutation = { mutate: updateSchool, isPending: isUpdating };
  const campusDropdownRef = useRef<HTMLDivElement>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Re-seed the form while rendering when a different school arrives, instead
  // of mirroring the prop into state via an effect.
  const [prevSchool, setPrevSchool] = useState(school);
  if (school !== prevSchool) {
    setPrevSchool(school);
    if (school) {
      setFormData({
        name: school.name || "",
        nickname: school.nickname || "",
        motto: school.motto || "",
        campuses: school.campuses || [],
        type: school.type || "",
        logo: undefined,
      });
      setSelectedCampuses(school.campuses || []);
      setHasChanges(false);
    }
  }

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
