import {
  MentalHealthSectionProps,
  LockInFormData,
} from "@/lib/types/components/patient/lock-in";
import { Label } from "@/components/ui/label";
import { LOCK_IN_TEXTS } from "@/lib/constants/components/patient/lock-in";

export function MentalHealthSection({
  register,
  errors,
  frequencyOptions,
  yesNoOptions,
}: MentalHealthSectionProps) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">
        {LOCK_IN_TEXTS.mentalHealth.title}
      </h2>
      <div className="space-y-4">
        {LOCK_IN_TEXTS.mentalHealth.frequencyFields.map((field) => (
          <div key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <select
              id={field.name}
              {...register(field.name as keyof LockInFormData)}
              {...register(field.name as keyof LockInFormData)}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
            >
              <option value="">
                {LOCK_IN_TEXTS.mentalHealth.frequencyPlaceholder}
              </option>
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

        {LOCK_IN_TEXTS.mentalHealth.yesNoFields.map((field) => (
          <div key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <select
              id={field.name}
              {...register(field.name as keyof LockInFormData)}
              {...register(field.name as keyof LockInFormData)}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
            >
              <option value="">
                {LOCK_IN_TEXTS.mentalHealth.yesNoPlaceholder}
              </option>
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
  );
}
