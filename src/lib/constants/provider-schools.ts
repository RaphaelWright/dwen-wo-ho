import { FilterType } from "@/lib/types/provider/schools";

export const filterOptions: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "JHS", value: "JHS" },
  { label: "SHS", value: "SHS" },
  { label: "COLLEGE", value: "COLLEGE" },
];

export const BATCH_SIZE = 5;
export const POLL_INTERVAL = 60000; // 60 seconds
export const REFETCH_INTERVAL = 30000; // 30 seconds
