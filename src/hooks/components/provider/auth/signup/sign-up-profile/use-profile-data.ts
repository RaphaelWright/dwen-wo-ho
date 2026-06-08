"use client";

import { useState } from "react";
import { ProviderProfileData } from "@/lib/types/provider/auth";
import type { PendingUserInfo } from "./use-profile-actions";

export const useProfileData = ({
  initialFullName,
  initialTitle,
  initialSpecialty,
  initialProfileImage,
}: {
  initialFullName: string;
  initialTitle: string;
  initialSpecialty?: string;
  initialProfileImage?: string;
}) => {
  const [profileData, setProfileData] = useState<ProviderProfileData>({
    photo: null,
    phoneNumber: "",
    bio: "",
    specialty: "",
  });

  const [userInfo, setUserInfo] = useState<PendingUserInfo>({
    name: `${initialTitle} ${initialFullName}`,
    title: initialTitle,
    specialty: initialSpecialty || "",
    timeAgo: "Just now",
    profileImage: initialProfileImage,
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
    userInfo,
    setUserInfo,
    handleChange,
  };
};
