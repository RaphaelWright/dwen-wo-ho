"use client";

import { BioStepProps } from "@/lib/types/provider/auth";

export const useBioStep = ({ phoneNumber, bio, onChange }: BioStepProps) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange("phoneNumber", e.target.value);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange("bio", e.target.value);
  };

  return {
    handlePhoneChange,
    handleBioChange,
  };
};
