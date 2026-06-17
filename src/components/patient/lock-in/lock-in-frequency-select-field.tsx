import { Label } from "@/components/ui/label";
import { LockInFrequencySelectFieldProps } from "@/lib/types/components/patient/lock-in-fields";

export function LockInFrequencySelectField({
  fieldName,
  label,
  placeholder,
  options,
  register,
  errors,
}: LockInFrequencySelectFieldProps) {
  const fieldError = errors[fieldName];

  return (
    <div>
      <Label htmlFor={fieldName}>{label}</Label>
      <select
        id={fieldName}
        {...register(fieldName)}
        className="border-input focus:ring-primary/20 focus:border-primary bg-background w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
      {fieldError && (
        <p className="mt-1 text-sm text-red-500">{fieldError.message}</p>
      )}
    </div>
  );
}
