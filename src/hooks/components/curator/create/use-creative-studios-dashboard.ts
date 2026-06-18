"use client";

import { useCuratorSummary } from "@/hooks/queries/use-curator";
import { buildCreativeStudiosDashboardCards } from "@/lib/utils/curator/create/build-creative-studios-dashboard-cards";

export function useCreativeStudiosView() {
  const { data: summary } = useCuratorSummary();
  return { cards: buildCreativeStudiosDashboardCards(summary) };
}
