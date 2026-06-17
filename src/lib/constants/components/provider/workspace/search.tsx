import { Zap, TrendingUp, Award } from "lucide-react";
import type { FilterOption } from "@/lib/types/components/shared/search-dropdown";

export const PROVIDER_SEARCH_QUICK_FILTERS: FilterOption[] = [
  {
    id: "status-new",
    label: "New",
    icon: <Zap className="h-3.5 w-3.5" />,
    filterKey: "status",
    filterValue: "new",
    filterType: "exact",
  },
  {
    id: "high-score",
    label: "High Score",
    icon: <TrendingUp className="h-3.5 w-3.5" />,
    filterKey: "score",
    filterValue: "high",
    filterType: "score",
  },
  {
    id: "low-score",
    label: "Low Score",
    icon: <Award className="h-3.5 w-3.5" />,
    filterKey: "score",
    filterValue: "low",
    filterType: "score",
  },
];
