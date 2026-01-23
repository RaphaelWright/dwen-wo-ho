"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import WidthConstraint from "@/components/ui/width-constraint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import JustGoHealth from "@/components/logo-purple";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

type LockInFormData = z.infer<typeof lockInSchema>;

const frequencyOptions = ["never", "rarely", "sometimes", "often", "always"];
const yesNoOptions = ["yes", "no"];
const motivationOptions = ["none", "slightly", "moderate", "high"];
const studyFrequencyOptions = ["never", "rarely", "occasionally", "frequently", "always"];
const timeToExamOptions = ["1d", "2d", "3d", "1w", "2w", "1m", "2m+"];
const reasonOptions = ["exam", "assignment", "project", "other"];

const CACHE_KEY_PREFIX = "lockin_form_cache_";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CachedFormData {
  data: Partial<LockInFormData>;
  timestamp: number;
  schoolId: string;
}

export default function LockInFormPage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCacheKey = () => `${CACHE_KEY_PREFIX}${schoolId}`;

  const loadCachedData = (): Partial<LockInFormData> | null => {
    // Check if we're in the browser
    if (typeof window === "undefined") return null;
    
    try {
      const cacheKey = getCacheKey();
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const cachedData: CachedFormData = JSON.parse(cached);
      
      // Check if cache is for the same school
      if (cachedData.schoolId !== schoolId) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      // Check if cache is expired (older than 5 minutes)
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
  };

  const clearCachedData = () => {
    if (typeof window === "undefined") return;
    try {
      const cacheKey = getCacheKey();
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.error("Error clearing cached form data:", error);
    }
  };

  // Load cached data only on client side
  const [cachedDefaults, setCachedDefaults] = useState<Partial<LockInFormData> | null>(null);
  
  useEffect(() => {
    // Only load on client side
    if (typeof window !== "undefined") {
      setCachedDefaults(loadCachedData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<LockInFormData>({
    resolver: zodResolver(lockInSchema),
    defaultValues: {
      campus: schoolId ? Number(schoolId) : 0,
    },
  });

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

  // Save form data to cache whenever it changes
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only save if form has meaningful data (not just default campus)
      const hasData = Object.keys(formValues).some(
        (key) => key !== "campus" && formValues[key as keyof LockInFormData]
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
    }, 500); // Debounce: save 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [formValues, schoolId]);

  useEffect(() => {
    if (schoolId) {
      setValue("campus", Number(schoolId));
    }
  }, [schoolId, setValue]);

  const onSubmit = async (data: LockInFormData) => {
    setIsSubmitting(true);
    try {
      const response = await api(ENDPOINTS.submitLockIn, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response?.success) {
        // Clear cached data immediately after successful submission
        clearCachedData();
        // Redirect to waiting room - will be implemented in next step
        router.push("/patient/waiting-room");
      } else {
        console.error("Failed to submit lock-in:", response?.message);
      }
    } catch (error) {
      console.error("Error submitting lock-in:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WidthConstraint>
        <div className="p-8 pb-20">
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={() => router.push("/patient/lock-in")}
              variant="ghost"
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Schools
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Lock In Form</h1>
                <p className="text-gray-600">Please fill out the form below</p>
              </div>
              <JustGoHealth />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    {...register("age", { valueAsNumber: true })}
                    placeholder="Enter your age"
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="sex">Sex</Label>
                  <select
                    id="sex"
                    {...register("sex")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4]"
                  >
                    <option value="">Select sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.sex && (
                    <p className="text-red-500 text-sm mt-1">{errors.sex.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="level">Level</Label>
                  <Input
                    id="level"
                    {...register("level")}
                    placeholder="Enter your level (e.g., 2, 3, 4)"
                  />
                  {errors.level && (
                    <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Lock In Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Lock In Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reasonForLockin">Reason for Lock In</Label>
                  <select
                    id="reasonForLockin"
                    {...register("reasonForLockin")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4]"
                  >
                    <option value="">Select reason</option>
                    {reasonOptions.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason.charAt(0).toUpperCase() + reason.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.reasonForLockin && (
                    <p className="text-red-500 text-sm mt-1">{errors.reasonForLockin.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="timeToExam">Time to Exam</Label>
                  <select
                    id="timeToExam"
                    {...register("timeToExam")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4]"
                  >
                    <option value="">Select time</option>
                    {timeToExamOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.timeToExam && (
                    <p className="text-red-500 text-sm mt-1">{errors.timeToExam.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Mental Health Assessment */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Mental Health Assessment</h2>
              <div className="space-y-4">
                {[
                  { name: "feelingDepressed", label: "Feeling Depressed" },
                  { name: "lossOfInterest", label: "Loss of Interest" },
                  { name: "feelingLonely", label: "Feeling Lonely" },
                ].map((field) => (
                  <div key={field.name}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <select
                      id={field.name}
                      {...register(field.name as keyof LockInFormData)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4]"
                    >
                      <option value="">Select frequency</option>
                      {frequencyOptions.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                    {errors[field.name as keyof LockInFormData] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field.name as keyof LockInFormData]?.message}
                      </p>
                    )}
                  </div>
                ))}

                {[
                  { name: "suicidalThoughts", label: "Suicidal Thoughts" },
                  { name: "suicidalPlans", label: "Suicidal Plans" },
                ].map((field) => (
                  <div key={field.name}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <select
                      id={field.name}
                      {...register(field.name as keyof LockInFormData)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4]"
                    >
                      <option value="">Select</option>
                      {yesNoOptions.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                    {errors[field.name as keyof LockInFormData] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field.name as keyof LockInFormData]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Exam Anxiety */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Exam Anxiety</h2>
              <div className="space-y-4">
                {[
                  { name: "examWorrying", label: "Exam Worrying" },
                  { name: "sleepProblems", label: "Sleep Problems" },
                  { name: "fearOfFailure", label: "Fear of Failure" },
                  { name: "feelingNervous", label: "Feeling Nervous" },
                  { name: "sweatingOrHeartRacing", label: "Sweating or Heart Racing" },
                  { name: "stomachUpset", label: "Stomach Upset" },
                ].map((field) => (
                  <div key={field.name}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <select
                      id={field.name}
                      {...register(field.name as keyof LockInFormData)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4]"
                    >
                      <option value="">Select frequency</option>
                      {frequencyOptions.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                    {errors[field.name as keyof LockInFormData] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field.name as keyof LockInFormData]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Study Habits */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Study Habits</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="motivationToStudy">Motivation to Study</Label>
                  <select
                    id="motivationToStudy"
                    {...register("motivationToStudy")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4]"
                  >
                    <option value="">Select level</option>
                    {motivationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.motivationToStudy && (
                    <p className="text-red-500 text-sm mt-1">{errors.motivationToStudy.message}</p>
                  )}
                </div>

                {[
                  { name: "focusWhileStudying", label: "Focus While Studying" },
                  { name: "activeStudying", label: "Active Studying" },
                  { name: "activeRecall", label: "Active Recall" },
                  { name: "lastMinuteStudying", label: "Last Minute Studying" },
                ].map((field) => (
                  <div key={field.name}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <select
                      id={field.name}
                      {...register(field.name as keyof LockInFormData)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4]"
                    >
                      <option value="">Select frequency</option>
                      {studyFrequencyOptions.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                    {errors[field.name as keyof LockInFormData] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field.name as keyof LockInFormData]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/patient/lock-in")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#955aa4] hover:bg-[#955aa4]/90">
                {isSubmitting ? "Submitting..." : "Submit Lock In"}
              </Button>
            </div>
          </form>
        </div>
      </WidthConstraint>
    </div>
  );
}
