import { Lock, Star, CheckCircle, User, Eye, Venus, Mars } from "lucide-react";
import type { SchoolTab } from "@/lib/types/components/curator/school-details/school-details";
import type { FilterOption } from "@/lib/types/components/shared/search-dropdown";

export const SCHOOL_SEARCH_QUICK_FILTERS: Record<SchoolTab, FilterOption[]> = {
  patients: [
    {
      id: "new",
      label: "New",
      filterKey: "visibilityStatus",
      filterValue: "NEW",
      filterType: "exact",
      icon: (
        <User className="size-4 text-blue-500/80 group-hover:text-blue-500" />
      ),
    },
    {
      id: "seen",
      label: "Seen",
      filterKey: "visibilityStatus",
      filterValue: "SEEN",
      filterType: "exact",
      icon: (
        <Eye className="size-4 text-green-500/80 group-hover:text-green-500" />
      ),
    },
    {
      id: "male",
      label: "Male",
      filterKey: "patientSex",
      filterValue: "Male",
      filterType: "exact",
      icon: (
        <Mars className="size-4 text-blue-500/80 group-hover:text-blue-500" />
      ),
    },
    {
      id: "female",
      label: "Female",
      filterKey: "patientSex",
      filterValue: "Female",
      filterType: "exact",
      icon: (
        <Venus className="size-4 text-pink-500/80 group-hover:text-pink-500" />
      ),
    },
  ],
  icons: [
    {
      id: "ready",
      label: "Locked In",
      filterKey: "lockIns",
      filterValue: "hasItems",
      filterType: "contains",
      icon: (
        <Lock className="size-4 text-indigo-500/80 group-hover:text-indigo-500" />
      ),
    },
    {
      id: "top",
      label: "Top Ranked",
      filterKey: "rank",
      filterValue: "top3",
      filterType: "score",
      icon: (
        <Star className="size-4 text-amber-500/80 group-hover:text-amber-500" />
      ),
    },
  ],
  providers: [
    {
      id: "approved",
      label: "Approved",
      filterKey: "applicationStatus",
      filterValue: "APPROVED",
      filterType: "exact",
      icon: (
        <CheckCircle className="size-4 text-emerald-500/80 group-hover:text-emerald-500" />
      ),
    },
  ],
};
