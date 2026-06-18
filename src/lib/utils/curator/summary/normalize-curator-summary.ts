import type { CuratorSummary } from "@/lib/types/api/curator";

const EMPTY_SUMMARY: CuratorSummary = {
  schoolCount: 0,
  providerCount: 0,
  partnerCount: 0,
  campusCount: 0,
  specialtyCount: 0,
  programmeCount: 0,
  tagCount: 0,
};

export function normalizeCuratorSummary(
  data: Partial<CuratorSummary> | null | undefined,
): CuratorSummary {
  const merged = { ...EMPTY_SUMMARY, ...data };
  return {
    ...merged,
    specialtyCount: data?.specialtyCount ?? merged.providerCount,
  };
}
