"use client";

import { useState } from "react";
import { SpecialtyStepProps } from "@/lib/types/components/provider/auth";
import { useSpecialties } from "@/hooks/queries/use-specialties";

export const useSpecialtyStep = ({
  specialty,
  onChange,
}: SpecialtyStepProps) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialty);
  const { specialties, isLoading: isLoadingSpecialties } = useSpecialties();

  const handleSpecialtySelect = (specialty: string) => {
    const newSelection = selectedSpecialty === specialty ? "" : specialty;
    setSelectedSpecialty(newSelection);
    onChange("specialty", newSelection);
  };

  return {
    selectedSpecialty,
    handleSpecialtySelect,
    specialties,
    isLoadingSpecialties,
  };
};
