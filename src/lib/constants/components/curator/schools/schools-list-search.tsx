import {
  BookMarked,
  GraduationCap,
  Building2,
  TableProperties,
  School,
} from "lucide-react";
import type { FilterType } from "@/lib/types/components/shared/school-filter";

export const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "JHS", value: "JHS" },
  { label: "SHS", value: "SHS" },
  { label: "COLLEGE", value: "COLLEGE" },
];

export const SCHOOL_FILTER_ICONS: Record<FilterType, typeof School> = {
  all: School,
  JHS: BookMarked,
  SHS: GraduationCap,
  COLLEGE: Building2,
};

export const SCHOOLS_LIST_SEARCH_QUICK_FILTERS: {
  id: FilterType;
  label: string;
  icon: React.ReactNode;
  filterKey?: string;
  filterValue?: string;
  filterType?: "exact" | "contains" | "score" | "date";
}[] = [
  {
    id: "all",
    label: "All Schools",
    icon: (
      <TableProperties className="size-4 text-slate-500/80 group-hover:text-slate-500" />
    ),
    // No filterKey/filterValue for "all" - it shows everything
  },
  {
    id: "JHS",
    label: "JHS Only",
    filterKey: "type",
    filterValue: "JHS",
    filterType: "exact",
    icon: (
      <BookMarked className="size-4 text-rose-500/80 group-hover:text-rose-500" />
    ),
  },
  {
    id: "SHS",
    label: "SHS Only",
    filterKey: "type",
    filterValue: "SHS",
    filterType: "exact",
    icon: (
      <GraduationCap className="size-4 text-amber-500/80 group-hover:text-amber-500" />
    ),
  },
  {
    id: "COLLEGE",
    label: "College Only",
    filterKey: "type",
    filterValue: "COLLEGE",
    filterType: "exact",
    icon: (
      <Building2 className="size-4 text-sky-500/80 group-hover:text-sky-500" />
    ),
  },
];

export const SCHOOLS_LIST_SEARCH_PLACEHOLDERS = [
  "Search schools by name, nickname, or campus...",
  "Type 'SHS' to see senior high schools...",
  "Looking for a specific campus location?",
  "Find schools by their registration name...",
];
