"use client";

import { useState, useRef } from "react";
import { useCreateSchool } from "@/hooks/queries/useSchoolsQuery";
import { ICreateSchool } from "@/lib/types/school";

interface UseSchoolCreationProps {
  onClose: () => void;
  onSchoolCreated?: (school: ICreateSchool) => void;
}

export type SchoolFormData = {
  name: string;
  nickname: string;
  motto: string;
  campuses: string[];
  type: string;
  logo: File | undefined;
};

export const useSchoolCreation = ({
  onClose,
  onSchoolCreated,
}: UseSchoolCreationProps) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]);
  const [formData, setFormData] = useState<SchoolFormData>({
    name: "",
    nickname: "",
    motto: "",
    campuses: [] as string[],
    type: "",
    logo: undefined,
  });

  const createSchoolMutation = useCreateSchool();
  const campusDropdownRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCampusToggle = (campus: string) => {
    setSelectedCampuses((prev) =>
      prev.includes(campus)
        ? prev.filter((c) => c !== campus)
        : [...prev, campus],
    );
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    setFormData((prev) => ({
      ...prev,
      logo: file,
    }));
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logo: undefined }));
  };

  const handleNext = () => {
    if (!formData.name || !formData.type || !formData.motto.trim()) {
      return;
    }
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      nickname: "",
      motto: "",
      campuses: [],
      type: "",
      logo: undefined,
    });
    setSelectedCampuses([]);
    setCurrentStep(1);
  };

  const handleConfirm = async () => {
    const schoolData: ICreateSchool = {
      name: formData.name,
      nickname: formData.nickname,
      type: formData.type,
      baseline: "",
      motto: formData.motto,
      campuses: selectedCampuses,
      logo: formData.logo ?? null,
    };

    createSchoolMutation.mutate(schoolData, {
      onSuccess: () => {
        onSchoolCreated?.(schoolData);
        onClose();
        resetForm();
      },
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.type !== "" &&
    formData.motto.trim() !== "";

  return {
    currentStep,
    setCurrentStep,
    showCampusDropdown,
    setShowCampusDropdown,
    selectedCampuses,
    formData,
    createSchoolMutation,
    campusDropdownRef,
    handleInputChange,
    handleCampusToggle,
    handleLogoUpload,
    handleRemoveLogo,
    handleNext,
    handleBack,
    handleConfirm,
    handleClose,
    isFormValid,
  };
};
