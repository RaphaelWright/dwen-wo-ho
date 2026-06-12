"use client";

import { useReducer } from "react";
import {
  activityLogFilterReducer,
  initialActivityLogFilterState,
} from "@/lib/utils/provider-activity-filter-reducer";
import { format } from "date-fns";
import {
  MdSearch,
  MdRefresh,
  MdOutlineAssignment,
  MdOutlineLogin,
  MdOutlineUpdate,
} from "react-icons/md";
import { useProviderActivityQuery } from "@/hooks/queries/use-provider";
import useSchoolsQuery from "@/hooks/queries/use-schools";
import { ProviderActivityItem } from "@/lib/types/api/providers";
import type { School } from "@/lib/types/school";

const getActivityIcon = (action?: string) => {
  const normAction = action?.toLowerCase() || "";
  if (normAction.includes("login") || normAction.includes("sign in"))
    return <MdOutlineLogin className="text-blue-500" />;
  if (normAction.includes("update") || normAction.includes("edit"))
    return <MdOutlineUpdate className="text-yellow-500" />;
  return <MdOutlineAssignment className="text-purple-500" />;
};

export default function ProviderActivityLog() {
  const [{ search, debouncedSearch, page, schoolId, status }, dispatch] =
    useReducer(activityLogFilterReducer, initialActivityLogFilterState);

  const { useSchools } = useSchoolsQuery();
  const { data: schoolsData } = useSchools();
  // Depending on how schoolsResponse is shaped, it might be an array directly or have a .data wrapper
  const schools: School[] = schoolsData ?? [];

  // Debounce search manually for simplicity
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_SEARCH", search: e.target.value });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_DEBOUNCED_SEARCH", search });
  };

  const { data, isLoading, isError, refetch } = useProviderActivityQuery({
    search: debouncedSearch,
    page,
    limit: 15,
    ...(schoolId ? { schoolId } : {}),
    ...(status ? { status } : {}),
  });

  const activities = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="mb-2 font-medium text-red-600">
          Failed to load activity log
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-md bg-red-100 px-4 py-2 text-sm transition-colors hover:bg-red-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Activity Filter Bar */}
      <div className="bg-card border-border flex flex-col items-center justify-between gap-4 rounded-xl border p-4 shadow-sm md:flex-row">
        <div className="flex w-full flex-1 flex-col gap-3 sm:flex-row md:w-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full sm:max-w-xs"
          >
            <MdSearch className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-xl" />
            <input
              title="Search provider activity"
              aria-label="Search provider activity"
              type="text"
              placeholder="Search details..."
              value={search}
              onChange={handleSearch}
              className="border-border bg-background focus:ring-primary/50 w-full rounded-lg border py-2 pr-4 pl-10 text-sm transition-all focus:ring-2 focus:outline-none"
            />
          </form>

          <select
            value={schoolId}
            onChange={(e) =>
              dispatch({ type: "SET_SCHOOL_ID", schoolId: e.target.value })
            }
            className="border-border bg-background focus:ring-primary/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none sm:w-48"
          >
            <option value="">All Schools</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name || `School #${s.id}`}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) =>
              dispatch({ type: "SET_STATUS", status: e.target.value })
            }
            className="border-border bg-background focus:ring-primary/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none sm:w-36"
          >
            <option value="">All Statuses</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warning</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        <button
          type="button"
          title="Refresh activity log"
          onClick={() => refetch()}
          className="bg-muted text-muted-foreground hover:text-foreground border-border self-end rounded-lg border p-2 transition-colors sm:self-auto"
        >
          <MdRefresh className="text-xl" />
        </button>
      </div>

      {/* Activity List */}
      <div className="bg-card border-border overflow-hidden rounded-xl border shadow-sm">
        <div className="border-border flex items-center justify-between border-b p-4 font-semibold">
          <h3 className="text-lg">Recent Activities</h3>
          <span className="text-muted-foreground bg-muted rounded-full px-3 py-1 text-sm">
            {totalCount} Total
          </span>
        </div>

        <div className="divide-border divide-y">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-muted-foreground p-12 text-center">
              <MdOutlineAssignment className="mx-auto mb-3 text-4xl opacity-20" />
              <p>No activity records found.</p>
            </div>
          ) : (
            activities.map((activity: ProviderActivityItem, idx: number) => (
              <div
                key={activity.id || idx}
                className="hover:bg-muted/50 flex gap-4 p-4 transition-colors"
              >
                <div className="bg-background border-border mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border p-2">
                  {getActivityIcon(activity.action)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                    <h4 className="truncate text-sm font-semibold">
                      {activity.providerName ||
                        activity.providerEmail ||
                        "Unknown Provider"}
                    </h4>
                    {activity.timestamp && (
                      <span className="text-muted-foreground text-xs whitespace-nowrap">
                        {format(
                          new Date(activity.timestamp),
                          "MMM d, yyyy • h:mm a",
                        )}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium">
                    {activity.action || "Performed an action"}
                  </p>
                  {activity.details && (
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                      {activity.details}
                    </p>
                  )}
                  {activity.schoolName && (
                    <div className="bg-primary/10 text-primary mt-2 w-fit rounded-md px-2 py-1 text-xs font-medium">
                      @ {activity.schoolName}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination minimal */}
        {totalPages > 1 && (
          <div className="border-border bg-muted/20 flex items-center justify-between border-t p-4">
            <button
              type="button"
              title="Previous page"
              disabled={page <= 0}
              onClick={() =>
                dispatch({ type: "SET_PAGE", page: Math.max(0, page - 1) })
              }
              className="border-border bg-background rounded-md border px-4 py-2 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-muted-foreground text-sm">
              Page {page + 1} of {totalPages}
            </span>
            <button
              type="button"
              title="Next page"
              disabled={page >= totalPages - 1}
              onClick={() =>
                dispatch({
                  type: "SET_PAGE",
                  page: Math.min(totalPages - 1, page + 1),
                })
              }
              className="border-border bg-background rounded-md border px-4 py-2 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
