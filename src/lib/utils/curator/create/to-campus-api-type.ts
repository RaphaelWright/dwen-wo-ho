import { CAMPUS_TYPE_API_MAP } from "@/lib/constants/components/curator/create/creative-studios";
import type { CampusApiType } from "@/lib/types/api/creative-studios";

export function toCampusApiType(displayLabel: string): CampusApiType {
  const apiType = CAMPUS_TYPE_API_MAP[displayLabel];
  if (!apiType) {
    throw new Error(`Unknown campus type: ${displayLabel}`);
  }
  return apiType;
}
