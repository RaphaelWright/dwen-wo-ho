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
    <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
      <h2 className="text-foreground mb-4 text-xl font-bold">
        {LOCK_IN_TEXTS.details.title}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="reasonForLockin">
            {LOCK_IN_TEXTS.details.reasonLabel}
          </Label>
          <select
            id="reasonForLockin"
            {...register("reasonForLockin")}
            {...register("reasonForLockin")}
            className="border-input focus:ring-primary/20 focus:border-primary bg-background w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
          >
            <option value="">{LOCK_IN_TEXTS.details.reasonPlaceholder}</option>
            {reasonOptions.map((reason) => (
              <option key={reason} value={reason}>
                {reason.charAt(0).toUpperCase() + reason.slice(1)}
              </option>
            ))}
          </select>
          {errors.reasonForLockin && (
            <p className="mt-1 text-sm text-red-500">
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
            className="border-input focus:ring-primary/20 focus:border-primary bg-background w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
          >
            <option value="">{LOCK_IN_TEXTS.details.timePlaceholder}</option>
            {timeToExamOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {errors.timeToExam && (
            <p className="mt-1 text-sm text-red-500">
              {errors.timeToExam.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
