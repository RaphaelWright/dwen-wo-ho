import type {
  BirthDateHints,
  BirthDateParts,
} from "@/lib/types/components/patient/birth-date";

const MONTH_INDEX: Record<string, number> = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function getMonthIndex(monthName: string): number | null {
  const index = MONTH_INDEX[monthName];
  return index === undefined ? null : index;
}

export function ordinalSuffix(day: number): string {
  const value = day % 100;
  if (value >= 11 && value <= 13) {
    return `${day}th`;
  }

  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

export function calcAgeFromParts(
  day: number,
  monthIndex: number,
  year: number,
): number {
  const today = new Date();
  let age = today.getFullYear() - year;
  const hadBirthday =
    today.getMonth() > monthIndex ||
    (today.getMonth() === monthIndex && today.getDate() >= day);

  if (!hadBirthday) {
    age -= 1;
  }

  return age;
}

export function getBirthDateHints(
  parts: BirthDateParts,
): BirthDateHints | null {
  if (!parts.day || !parts.month || !parts.year) {
    return null;
  }

  const day = Number.parseInt(parts.day, 10);
  const year = Number.parseInt(parts.year, 10);
  const monthIndex = getMonthIndex(parts.month);

  if (
    Number.isNaN(day) ||
    Number.isNaN(year) ||
    monthIndex === null ||
    day < 1 ||
    day > 31 ||
    year < 1900
  ) {
    return null;
  }

  const birthDate = new Date(year, monthIndex, day);

  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== monthIndex ||
    birthDate.getDate() !== day
  ) {
    return null;
  }

  return {
    age: calcAgeFromParts(day, monthIndex, year),
    weekday: WEEKDAY_NAMES[birthDate.getDay()],
    ordinalDay: ordinalSuffix(day),
    month: parts.month,
    year,
  };
}

export function formatBirthDateForApi(parts: BirthDateParts): string {
  const monthIndex = getMonthIndex(parts.month);
  const day = Number.parseInt(parts.day, 10);
  const year = Number.parseInt(parts.year, 10);

  if (monthIndex === null || Number.isNaN(day) || Number.isNaN(year)) {
    return "";
  }

  const month = String(monthIndex + 1).padStart(2, "0");
  const dayOfMonth = String(day).padStart(2, "0");
  return `${year}-${month}-${dayOfMonth}`;
}
