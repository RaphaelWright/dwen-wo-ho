import {
  MentalHealthSectionProps,
  LockInFormData,
} from "@/lib/types/components/patient/lock-in";
import { LOCK_IN_TEXTS } from "@/lib/constants/components/patient/lock-in";
import { LockInFrequencySelectField } from "@/components/patient/lock-in/lock-in-frequency-select-field";

export function MentalHealthSection({
  register,
  errors,
  frequencyOptions,
  yesNoOptions,
}: MentalHealthSectionProps) {
  return (
    <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
      <h2 className="text-foreground mb-4 text-xl font-bold">
        {LOCK_IN_TEXTS.mentalHealth.title}
      </h2>
      <div className="space-y-4">
        {LOCK_IN_TEXTS.mentalHealth.frequencyFields.map((field) => (
          <LockInFrequencySelectField
            key={field.name}
            fieldName={field.name as keyof LockInFormData}
            label={field.label}
            placeholder={LOCK_IN_TEXTS.mentalHealth.frequencyPlaceholder}
            options={frequencyOptions}
            register={register}
            errors={errors}
          />
        ))}

        {LOCK_IN_TEXTS.mentalHealth.yesNoFields.map((field) => (
          <LockInFrequencySelectField
            key={field.name}
            fieldName={field.name as keyof LockInFormData}
            label={field.label}
            placeholder={LOCK_IN_TEXTS.mentalHealth.yesNoPlaceholder}
            options={yesNoOptions}
            register={register}
            errors={errors}
          />
        ))}
      </div>
    </div>
  );
}
