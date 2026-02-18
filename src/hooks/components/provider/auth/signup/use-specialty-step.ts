"use client";

import { useState } from "react";
import { SpecialtyStepProps } from "@/lib/types/provider/auth";

export const useSpecialtyStep = ({
  specialty,
  onChange,
}: SpecialtyStepProps) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialty);

  const handleSpecialtySelect = (specialty: string) => {
    const newSelection = selectedSpecialty === specialty ? "" : specialty;
    setSelectedSpecialty(newSelection);
    onChange("specialty", newSelection);
  };

  return {
    selectedSpecialty,
    handleSpecialtySelect,
  };
};
