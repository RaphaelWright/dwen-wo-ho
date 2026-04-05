"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lockinsService } from "@/services/lockins";
import { lockInSchema } from "@/lib/schemas/lockin-form-schema";
import { useLockInCache } from "./use-lock-in-cache";
import { LockInFormData } from "@/lib/types/components/patient/lock-in";
import { ROUTES } from "@/lib/constants/routes";

export function useLockInForm() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { cachedDefaults, saveToCache, clearCachedData } =
    useLockInCache(schoolId);

  const form = useForm<LockInFormData>({
    resolver: zodResolver(lockInSchema),
    defaultValues: {
      campus: schoolId ? Number(schoolId) : 0,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = form;

  // Reset form with cached data when it loads
  useEffect(() => {
    if (cachedDefaults) {
      reset({
        campus: schoolId ? Number(schoolId) : 0,
        ...cachedDefaults,
      });
    }
  }, [cachedDefaults, schoolId, reset]);

  // Watch all form values to save on change
  const formValues = watch();

  // Save form data to cache whenever it changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasData = Object.keys(formValues).some(
        (key) => key !== "campus" && formValues[key as keyof LockInFormData],
      );
      if (hasData) {
        saveToCache(formValues);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formValues, saveToCache]);

  useEffect(() => {
    if (schoolId) {
      setValue("campus", Number(schoolId));
    }
  }, [schoolId, setValue]);

  const onSubmit = useCallback(
    async (data: LockInFormData) => {
      setIsSubmitting(true);
      try {
        const response = await lockinsService.submitLockInForm(data);

        if (response?.lockinId) {
          clearCachedData();
          router.push(ROUTES.patient.waitingRoom);
        } else {
          console.error("Failed to submit lock-in: Missing lockinId");
          toast.error("Submission failed. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting lock-in:", error);
        toast.error("Submission failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [clearCachedData, router],
  );

  return {
    router,
    schoolId,
    isSubmitting,
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
}
