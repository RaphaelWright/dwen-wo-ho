import { PersonalInfoSectionProps } from "@/lib/types/components/patient/lock-in";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LOCK_IN_TEXTS } from "@/lib/constants/components/patient/lock-in";

export function PersonalInfoSection({
  register,
  errors,
}: PersonalInfoSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {LOCK_IN_TEXTS.personal.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <p className="text-red-500 text-sm mt-1">
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
            <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="sex">{LOCK_IN_TEXTS.personal.sexLabel}</Label>
          <select
            id="sex"
            {...register("sex")}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4]"
          >
            <option value="">{LOCK_IN_TEXTS.personal.sexPlaceholder}</option>
            {LOCK_IN_TEXTS.personal.sexOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.sex && (
            <p className="text-red-500 text-sm mt-1">{errors.sex.message}</p>
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
            <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
