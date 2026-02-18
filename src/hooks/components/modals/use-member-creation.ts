"use client";

import { useState } from "react";

export const useMemberCreation = ({
  onMemberCreated,
  onClose,
}: {
  onMemberCreated?: (formData: { title: string; name: string }) => void;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: "",
    name: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const memberTitles = ["Coach", "Advisor", "Ambassador"];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.name.trim()) return;

    // Simulate API call
    setIsSubmitted(true);

    // Reset form after 2 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      onMemberCreated?.(formData);
      onClose();
    }, 2000);
  };

  return {
    formData,
    isSubmitted,
    memberTitles,
    handleInputChange,
    handleSubmit,
  };
};
