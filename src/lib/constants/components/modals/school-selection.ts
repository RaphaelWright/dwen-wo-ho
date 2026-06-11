import { FilterType } from "@/lib/types/modals";

export const SCHOOL_FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: "All", value: "All" },
  { label: "JHS", value: "JHS" },
  { label: "SHS", value: "SHS" },
  { label: "COLLEGE", value: "COLLEGE" },
];
