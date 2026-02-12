"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { LockInFormData } from "@/hooks/patient/useLockInForm";

interface LockInDetailsSectionProps {
  register: UseFormRegister<LockInFormData>;
  errors: FieldErrors<LockInFormData>;
  reasonOptions: string[];
  timeToExamOptions: string[];
}

export function LockInDetailsSection({
  register,
  errors,
  reasonOptions,
  timeToExamOptions,
}: LockInDetailsSectionProps) {
  return (
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
            <p className="text-red-500 text-sm mt-1">
              {errors.reasonForLockin.message}
            </p>
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
            <p className="text-red-500 text-sm mt-1">
              {errors.timeToExam.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
