"use client";

import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { API_URL } from "@/lib/constants";
import { WAITLIST_CONTENT } from "@/lib/constants/components/modals/waitlist";

export const useWaitlistForm = (onSuccess?: () => void) => {
  const [formData, setFormData] = useState({
    fullName: "",
    whatsappNumber: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setFormData({
      fullName: "",
      whatsappNumber: "",
      email: "",
    });
    setError("");
    setSuccess(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`${API_URL}/waitlists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success(WAITLIST_CONTENT.MESSAGES.SUCCESS);
        resetForm();
        if (onSuccess) onSuccess();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.response.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("duplicate key")) {
          toast.error(WAITLIST_CONTENT.MESSAGES.ALREADY_JOINED);
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error(WAITLIST_CONTENT.MESSAGES.ERROR_GENERIC);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleInputChange,
    loading,
    success,
    error,
    handleSubmit,
  };
};
