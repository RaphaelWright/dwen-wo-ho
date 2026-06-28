"use client";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldTitle,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ONBOARDING_COPY,
  ONBOARDING_DOB_DAYS,
  ONBOARDING_DOB_MONTHS,
  ONBOARDING_DOB_YEARS,
} from "@/lib/constants/components/patient/onboarding";
import { DobFieldProps } from "@/lib/types/components/patient/onboarding";
import { getBirthDateHints } from "@/lib/utils/patient/birth-date";

export function DobField({
  birthMonth,
  birthDay,
  birthYear,
  onChange,
}: DobFieldProps) {
  const hints = getBirthDateHints({
    day: birthDay,
    month: birthMonth,
    year: birthYear,
  });

  return (
    <Field>
      <div className="mb-2 flex items-center justify-between gap-3">
        <FieldTitle className="mb-0">
          {ONBOARDING_COPY.createAccount.dob}
        </FieldTitle>
        {hints ? (
          <span
            className="border-success/40 bg-success/10 text-success inline-flex shrink-0 rounded-[10px] border px-2.5 py-1 text-sm font-semibold"
            aria-label={`Age ${hints.age}`}
          >
            {hints.age}
            {ONBOARDING_COPY.createAccount.dobAgeSuffix}
          </span>
        ) : null}
      </div>
      <FieldContent>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Select
            value={birthDay}
            onValueChange={(value) => onChange({ birthDay: value })}
          >
            <SelectTrigger
              aria-label="Birth day"
              className="h-8 w-full min-w-0 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
            >
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {ONBOARDING_DOB_DAYS.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={birthMonth}
            onValueChange={(value) => onChange({ birthMonth: value })}
          >
            <SelectTrigger
              aria-label="Birth month"
              className="h-8 w-full min-w-0 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
            >
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {ONBOARDING_DOB_MONTHS.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={birthYear}
            onValueChange={(value) => onChange({ birthYear: value })}
          >
            <SelectTrigger
              aria-label="Birth year"
              className="h-8 w-full min-w-0 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
            >
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {ONBOARDING_DOB_YEARS.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hints ? (
          <FieldDescription className="mt-3 min-h-[18px]">
            {ONBOARDING_COPY.createAccount.dobBornOnPrefix}{" "}
            <strong className="text-success font-semibold">
              {hints.weekday}, {hints.ordinalDay} {hints.month}, {hints.year}
            </strong>
            .
          </FieldDescription>
        ) : null}
      </FieldContent>
    </Field>
  );
}
