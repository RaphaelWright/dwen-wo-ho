export interface ActivityLogFilterState {
  search: string;
  debouncedSearch: string;
  page: number;
  schoolId: string;
  status: string;
}

export type ActivityLogFilterAction =
  | { type: "SET_SEARCH"; search: string }
  | { type: "SET_DEBOUNCED_SEARCH"; search: string }
  | { type: "SET_PAGE"; page: number }
  | { type: "SET_SCHOOL_ID"; schoolId: string }
  | { type: "SET_STATUS"; status: string };
