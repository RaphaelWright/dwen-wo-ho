"use client";

import { useState } from "react";

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
  const [profileData, setProfileData] = useState({
    photo: null as string | null,
    phoneNumber: "",
    bio: "",
    specialty: "",
  });

  const [userInfo, setUserInfo] = useState({
    name: `${initialTitle} ${initialFullName}`,
    title: initialTitle,
    specialty: initialSpecialty || "",
    timeAgo: "Just now",
    profileImage: initialProfileImage,
  });

  const handleChange = (
    property: keyof typeof profileData,
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
