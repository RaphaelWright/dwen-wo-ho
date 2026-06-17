import { CREATIVE_STUDIOS_TYPES } from "@/lib/constants/components/curator/create/creative-studios";
import type { CreativeStudiosType } from "@/lib/types/components/curator/create/creative-studios";

export function isCreativeStudiosType(
  value: string,
): value is CreativeStudiosType {
  return (CREATIVE_STUDIOS_TYPES as readonly string[]).includes(value);
}
