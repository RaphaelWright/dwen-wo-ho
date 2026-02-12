"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";

const lockInSchema = z.object({
  campus: z.number(),
  reasonForLockin: z.string().min(1, "Reason is required"),
  timeToExam: z.string().min(1, "Time to exam is required"),
  fullName: z.string().min(1, "Full name is required"),
  age: z.number().min(1, "Age is required").max(150, "Invalid age"),
  sex: z.string().min(1, "Sex is required"),
  level: z.string().min(1, "Level is required"),
  feelingDepressed: z.string().min(1, "This field is required"),
  lossOfInterest: z.string().min(1, "This field is required"),
  feelingLonely: z.string().min(1, "This field is required"),
  suicidalThoughts: z.string().min(1, "This field is required"),
  suicidalPlans: z.string().min(1, "This field is required"),
  examWorrying: z.string().min(1, "This field is required"),
  sleepProblems: z.string().min(1, "This field is required"),
  fearOfFailure: z.string().min(1, "This field is required"),
  feelingNervous: z.string().min(1, "This field is required"),
  sweatingOrHeartRacing: z.string().min(1, "This field is required"),
  stomachUpset: z.string().min(1, "This field is required"),
  motivationToStudy: z.string().min(1, "This field is required"),
  focusWhileStudying: z.string().min(1, "This field is required"),
  activeStudying: z.string().min(1, "This field is required"),
  activeRecall: z.string().min(1, "This field is required"),
  lastMinuteStudying: z.string().min(1, "This field is required"),
});

export type LockInFormData = z.infer<typeof lockInSchema>;

import {
  LOCKIN_FREQUENCY_OPTIONS as frequencyOptions,
  LOCKIN_YES_NO_OPTIONS as yesNoOptions,
  LOCKIN_MOTIVATION_OPTIONS as motivationOptions,
  LOCKIN_STUDY_FREQUENCY_OPTIONS as studyFrequencyOptions,
  LOCKIN_TIME_TO_EXAM_OPTIONS as timeToExamOptions,
  LOCKIN_REASON_OPTIONS as reasonOptions,
} from "@/lib/constants/mock-data";

export {
  frequencyOptions,
  yesNoOptions,
  motivationOptions,
  studyFrequencyOptions,
  timeToExamOptions,
  reasonOptions,
};

const CACHE_KEY_PREFIX = "lockin_form_cache_";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CachedFormData {
  data: Partial<LockInFormData>;
  timestamp: number;
  schoolId: string;
}

export function useLockInForm() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCacheKey = useCallback(
    () => `${CACHE_KEY_PREFIX}${schoolId}`,
    [schoolId],
  );

  const loadCachedData = useCallback((): Partial<LockInFormData> | null => {
    if (typeof window === "undefined") return null;

    try {
      const cacheKey = getCacheKey();
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const cachedData: CachedFormData = JSON.parse(cached);

      if (cachedData.schoolId !== schoolId) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      const now = Date.now();
      if (now - cachedData.timestamp > CACHE_DURATION) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return cachedData.data;
    } catch (error) {
      console.error("Error loading cached form data:", error);
      return null;
    }
  }, [getCacheKey, schoolId]);

  const clearCachedData = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const cacheKey = getCacheKey();
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.error("Error clearing cached form data:", error);
    }
  }, [getCacheKey]);

  // Load cached data only on client side
  const [cachedDefaults, setCachedDefaults] =
    useState<Partial<LockInFormData> | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCachedDefaults(loadCachedData());
    }
  }, [schoolId, loadCachedData]);

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
      if (hasData && typeof window !== "undefined") {
        const cacheKey = getCacheKey();
        const cacheData: CachedFormData = {
          data: formValues,
          timestamp: Date.now(),
          schoolId,
        };
        try {
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (error) {
          console.error("Error saving cached form data:", error);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formValues, schoolId, getCacheKey]);

  useEffect(() => {
    if (schoolId) {
      setValue("campus", Number(schoolId));
    }
  }, [schoolId, setValue]);

  const onSubmit = useCallback(
    async (data: LockInFormData) => {
      setIsSubmitting(true);
      try {
        const response = await api(ENDPOINTS.submitLockIn, {
          method: "POST",
          body: JSON.stringify(data),
        });

        if (response?.success) {
          clearCachedData();
          router.push("/patient/waiting-room");
        } else {
          console.error("Failed to submit lock-in:", response?.message);
        }
      } catch (error) {
        console.error("Error submitting lock-in:", error);
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
