import {
  PROGRAMME_SCHOOL_YEAR_MAX,
  PROGRAMME_SCHOOL_YEAR_MIN,
  getProgrammeYearOptions,
} from "@/lib/constants/components/curator/create/creative-studios";

const programmeYears = getProgrammeYearOptions();

function clampSchoolYear(year: number): number {
  return Math.min(
    PROGRAMME_SCHOOL_YEAR_MAX,
    Math.max(PROGRAMME_SCHOOL_YEAR_MIN, year),
  );
}

export function reconcileProgrammeYears(
  durationFromYear: number,
  durationToYear: number,
) {
  const from = clampSchoolYear(durationFromYear);
  const to = clampSchoolYear(durationToYear);

  if (from <= to) {
    return { durationFromYear: from, durationToYear: to };
  }

  return { durationFromYear: from, durationToYear: from };
}

export function reconcileProgrammeYearFrom(
  durationFromYear: number,
  durationToYear: number,
) {
  return reconcileProgrammeYears(durationFromYear, durationToYear);
}

export function reconcileProgrammeYearTo(
  durationFromYear: number,
  durationToYear: number,
) {
  const from = clampSchoolYear(durationFromYear);
  const to = clampSchoolYear(durationToYear);

  if (to >= from) {
    return { durationFromYear: from, durationToYear: to };
  }

  return { durationFromYear: to, durationToYear: to };
}

export function getProgrammeYearFromOptions() {
  return programmeYears;
}

export function getProgrammeYearToOptions(durationFromYear: number) {
  const from = clampSchoolYear(durationFromYear);
  return programmeYears.filter((year) => year >= from);
}

export function getDefaultProgrammeYears() {
  return { durationFromYear: 1, durationToYear: 1 };
}
