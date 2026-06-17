"use client";

import { Building2, GraduationCap, Tag, Users } from "lucide-react";
import { useCuratorSummary } from "@/hooks/queries/use-curator";
import { useCreativeStudiosMockStore } from "@/hooks/components/curator/create/use-creative-studios-mock-store";
import type { CreativeStudiosDashboardCard } from "@/lib/types/components/curator/create/creative-studios";

export function useCreativeStudiosView() {
  const { data: summary } = useCuratorSummary();
  const { records } = useCreativeStudiosMockStore();

  const cards: CreativeStudiosDashboardCard[] = [
    {
      label: "Campuses",
      type: "campus",
      count: summary?.schoolCount ?? records.campuses.length,
      icon: Building2,
      color: "bg-purple-500",
      desc: "Manage school campuses",
    },
    {
      label: "Providers",
      type: "provider",
      count: summary?.providerCount ?? records.providers.length,
      icon: Users,
      color: "bg-violet-500",
      desc: "Add staff & faculty",
    },
    {
      label: "Programmes",
      type: "programme",
      count: records.programmes.length,
      icon: GraduationCap,
      color: "bg-indigo-500",
      desc: "Create academic programmes",
    },
    {
      label: "Tags",
      type: "tag",
      count: records.tags.length,
      icon: Tag,
      color: "bg-fuchsia-500",
      desc: "Organize tag groups",
    },
  ];

  return { cards };
}
