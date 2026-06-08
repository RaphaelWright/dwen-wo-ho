"use client";

import { useState } from "react";
import { ProviderProfileData } from "@/lib/types/provider/auth";

export const useProfileData = () => {
  const [profileData, setProfileData] = useState<ProviderProfileData>({
    photo: null,
    phoneNumber: "",
    bio: "",
    specialty: "",
  });

  const handleChange = (
    property: keyof ProviderProfileData,
    value: string | null,
  ) => {
    setProfileData((prev) => ({ ...prev, [property]: value }));
  };

  return {
    profileData,
    setProfileData,
    handleChange,
  };
};
