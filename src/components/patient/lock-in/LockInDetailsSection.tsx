import { LockInDetailsSectionProps } from "@/lib/types/components/patient/lock-in";
import { Label } from "@/components/ui/label";
import { LOCK_IN_TEXTS } from "@/lib/constants/components/patient/lock-in";

export function LockInDetailsSection({
  register,
  errors,
  reasonOptions,
  timeToExamOptions,
}: LockInDetailsSectionProps) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">
        {LOCK_IN_TEXTS.details.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="reasonForLockin">
            {LOCK_IN_TEXTS.details.reasonLabel}
          </Label>
          <select
            id="reasonForLockin"
            {...register("reasonForLockin")}
            {...register("reasonForLockin")}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
          >
            <option value="">{LOCK_IN_TEXTS.details.reasonPlaceholder}</option>
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
          <Label htmlFor="timeToExam">{LOCK_IN_TEXTS.details.timeLabel}</Label>
          <select
            id="timeToExam"
            {...register("timeToExam")}
            {...register("timeToExam")}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
          >
            <option value="">{LOCK_IN_TEXTS.details.timePlaceholder}</option>
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
