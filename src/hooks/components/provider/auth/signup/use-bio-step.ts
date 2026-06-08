"use client";

import { BioStepProps } from "@/lib/types/provider/auth";

export const useBioStep = ({ onChange }: BioStepProps) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange("phoneNumber", e.target.value.replace(/\D/g, "").slice(0, 10));
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange("bio", e.target.value);
  };

  return {
    handlePhoneChange,
    handleBioChange,
  };
};
