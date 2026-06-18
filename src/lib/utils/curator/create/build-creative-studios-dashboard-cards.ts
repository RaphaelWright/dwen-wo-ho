import { Building2, GraduationCap, Tag, Users } from "lucide-react";
import type { CuratorSummary } from "@/lib/types/api/curator";
import type { CreativeStudiosDashboardCard } from "@/lib/types/components/curator/create/creative-studios";

const CREATIVE_STUDIOS_DASHBOARD_CARD_META = [
  {
    label: "Campuses",
    type: "campus",
    countKey: "campusCount",
    icon: Building2,
    color: "bg-purple-500",
    desc: "Manage school campuses",
  },
  {
    label: "Providers",
    type: "provider",
    countKey: "specialtyCount",
    icon: Users,
    color: "bg-violet-500",
    desc: "Add staff & faculty",
  },
  {
    label: "Programmes",
    type: "programme",
    countKey: "programmeCount",
    icon: GraduationCap,
    color: "bg-indigo-500",
    desc: "Create academic programmes",
  },
  {
    label: "Tags",
    type: "tag",
    countKey: "tagCount",
    icon: Tag,
    color: "bg-fuchsia-500",
    desc: "Organize tag groups",
  },
] as const satisfies ReadonlyArray<{
  label: string;
  type: CreativeStudiosDashboardCard["type"];
  countKey: keyof Pick<
    CuratorSummary,
    "campusCount" | "specialtyCount" | "programmeCount" | "tagCount"
  >;
  icon: CreativeStudiosDashboardCard["icon"];
  color: string;
  desc: string;
}>;

export function buildCreativeStudiosDashboardCards(
  summary?: CuratorSummary,
): CreativeStudiosDashboardCard[] {
  return CREATIVE_STUDIOS_DASHBOARD_CARD_META.map(
    ({ countKey, icon, ...card }) => ({
      ...card,
      icon,
      count: summary?.[countKey] ?? 0,
    }),
  );
}
