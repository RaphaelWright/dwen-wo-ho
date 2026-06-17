"use client";

import { BioStepProps } from "@/lib/types/components/provider/auth";
import { toSentenceCase } from "@/lib/utils/shared/string-case";

export const useBioStep = ({ bio, onChange }: BioStepProps) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange("phoneNumber", e.target.value.replace(/\D/g, "").slice(0, 10));
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange("bio", toSentenceCase(e.target.value));
  };

  const handleBioBlur = () => {
    onChange("bio", toSentenceCase(bio));
  };

  return {
    handlePhoneChange,
    handleBioChange,
    handleBioBlur,
  };
};
