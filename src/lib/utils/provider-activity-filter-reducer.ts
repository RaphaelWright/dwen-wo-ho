import type {
  ActivityLogFilterAction,
  ActivityLogFilterState,
} from "@/lib/types/components/provider/activity-log-filters";

export const initialActivityLogFilterState: ActivityLogFilterState = {
  search: "",
  debouncedSearch: "",
  page: 0,
  schoolId: "",
  status: "",
};

export function activityLogFilterReducer(
  state: ActivityLogFilterState,
  action: ActivityLogFilterAction,
): ActivityLogFilterState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.search, page: 0 };
    case "SET_DEBOUNCED_SEARCH":
      return { ...state, debouncedSearch: action.search };
    case "SET_PAGE":
      return { ...state, page: action.page };
    case "SET_SCHOOL_ID":
      return { ...state, schoolId: action.schoolId, page: 0 };
    case "SET_STATUS":
      return { ...state, status: action.status, page: 0 };
    default:
      return state;
  }
}
