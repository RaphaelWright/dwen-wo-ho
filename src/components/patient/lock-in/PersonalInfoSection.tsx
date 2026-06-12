import { PersonalInfoSectionProps } from "@/lib/types/components/patient/lock-in";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LOCK_IN_TEXTS } from "@/lib/constants/components/patient/lock-in";

export function PersonalInfoSection({
  register,
  errors,
}: PersonalInfoSectionProps) {
  return (
    <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
      <h2 className="text-foreground mb-4 text-xl font-bold">
        {LOCK_IN_TEXTS.personal.title}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="fullName">
            {LOCK_IN_TEXTS.personal.fullNameLabel}
          </Label>
          <Input
            id="fullName"
            {...register("fullName")}
            placeholder={LOCK_IN_TEXTS.personal.fullNamePlaceholder}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="age">{LOCK_IN_TEXTS.personal.ageLabel}</Label>
          <Input
            id="age"
            type="number"
            {...register("age", { valueAsNumber: true })}
            placeholder={LOCK_IN_TEXTS.personal.agePlaceholder}
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-500">{errors.age.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="sex">{LOCK_IN_TEXTS.personal.sexLabel}</Label>
          <select
            id="sex"
            {...register("sex")}
            {...register("sex")}
            className="border-input focus:ring-primary/20 focus:border-primary bg-background w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
          >
            <option value="">{LOCK_IN_TEXTS.personal.sexPlaceholder}</option>
            {LOCK_IN_TEXTS.personal.sexOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.sex && (
            <p className="mt-1 text-sm text-red-500">{errors.sex.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="level">{LOCK_IN_TEXTS.personal.levelLabel}</Label>
          <Input
            id="level"
            {...register("level")}
            placeholder={LOCK_IN_TEXTS.personal.levelPlaceholder}
          />
          {errors.level && (
            <p className="mt-1 text-sm text-red-500">{errors.level.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
