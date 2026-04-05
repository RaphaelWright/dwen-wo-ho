"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  MdSearch, 
  MdRefresh, 
  MdOutlineAssignment, 
  MdOutlineLogin,
  MdOutlineUpdate
} from "react-icons/md";
import { useProviderActivityQuery } from "@/hooks/queries/use-provider";
import useSchoolsQuery from "@/hooks/queries/use-schools";
import { ProviderActivityItem } from "@/lib/types/api/providers";

const getActivityIcon = (action?: string) => {
  const normAction = action?.toLowerCase() || "";
  if (normAction.includes("login") || normAction.includes("sign in")) 
    return <MdOutlineLogin className="text-blue-500" />;
  if (normAction.includes("update") || normAction.includes("edit"))
    return <MdOutlineUpdate className="text-yellow-500" />;
  return <MdOutlineAssignment className="text-purple-500" />;
};

export default function ProviderActivityLog() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [schoolId, setSchoolId] = useState("");
  const [status, setStatus] = useState("");

  const { useSchools } = useSchoolsQuery();
  const { data: schoolsData } = useSchools();
  // Depending on how schoolsResponse is shaped, it might be an array directly or have a .data wrapper
  const schools = Array.isArray(schoolsData) ? schoolsData : (schoolsData as any)?.data || [];

  // Debounce search manually for simplicity
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(search);
  };

  const { data, isLoading, isError, refetch } = useProviderActivityQuery({
    search: debouncedSearch,
    page,
    limit: 15,
    ...(schoolId ? { schoolId } : {}),
    ...(status ? { status } : {})
  });

  const activities = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-medium mb-2">Failed to load activity log</p>
        <button 
          onClick={() => refetch()} 
          className="text-sm bg-red-100 px-4 py-2 rounded-md hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Activity Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card rounded-xl border border-border shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xs">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xl" />
            <input
              title="Search provider activity"
              type="text"
              placeholder="Search details..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
            />
          </form>
          
          <select 
            value={schoolId}
            onChange={(e) => { setSchoolId(e.target.value); setPage(0); }}
            className="w-full sm:w-48 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Schools</option>
            {schools.map((s: any) => (
              <option key={s.id} value={s.id}>{s.name || `School #${s.id}`}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(0); }}
            className="w-full sm:w-36 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Statuses</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warning</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        <button
          title="Refresh activity log"
          onClick={() => refetch()}
          className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border self-end sm:self-auto"
        >
          <MdRefresh className="text-xl" />
        </button>
      </div>

      {/* Activity List */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border font-semibold flex items-center justify-between">
          <h3 className="text-lg">Recent Activities</h3>
          <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {totalCount} Total
          </span>
        </div>
        
        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <MdOutlineAssignment className="mx-auto text-4xl mb-3 opacity-20" />
              <p>No activity records found.</p>
            </div>
          ) : (
            activities.map((activity: ProviderActivityItem, idx: number) => (
              <div key={activity.id || idx} className="p-4 hover:bg-muted/50 transition-colors flex gap-4">
                <div className="mt-1 bg-background border border-border rounded-full p-2 h-10 w-10 flex items-center justify-center shrink-0">
                  {getActivityIcon(activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h4 className="font-semibold text-sm truncate">
                      {activity.providerName || activity.providerEmail || "Unknown Provider"}
                    </h4>
                    {activity.timestamp && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(activity.timestamp), "MMM d, yyyy • h:mm a")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium">
                    {activity.action || "Performed an action"}
                  </p>
                  {activity.details && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {activity.details}
                    </p>
                  )}
                  {activity.schoolName && (
                    <div className="mt-2 text-xs font-medium bg-primary/10 text-primary w-fit px-2 py-1 rounded-md">
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
          <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20">
            <button 
              title="Previous page"
              disabled={page <= 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              className="text-sm px-4 py-2 border border-border rounded-md bg-background disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {page + 1} of {totalPages}
            </span>
            <button 
              title="Next page"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              className="text-sm px-4 py-2 border border-border rounded-md bg-background disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
