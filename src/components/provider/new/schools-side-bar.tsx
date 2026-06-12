"use client";

import { m } from "motion/react";
import { School } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ProviderDashboardState } from "@/hooks/provider/use-provider-dashboard";
import { cn } from "@/lib/utils";
import { SchoolsSidebarSkeleton } from "./schools-sidebar-skeleton";

/**
 * Left sidebar — school filter list.
 * Populated from the live provider dashboard API (no mock data).
 */
export default function SchoolsSidebar({
  activeSchool,
  handleSelectSchool,
  schools,
  totalPatientCount,
  isLoading,
}: {
  activeSchool: ProviderDashboardState["activeSchool"];
  handleSelectSchool: ProviderDashboardState["handleSelectSchool"];
  schools: ProviderDashboardState["schools"];
  totalPatientCount: ProviderDashboardState["totalPatientCount"];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return <SchoolsSidebarSkeleton />;
  }

  // Build display list: "All Schools" entry + live schools from API
  // Filter out schools with missing/invalid ids to avoid duplicate React keys
  // Sort by patient count descending (highest first)
  const displaySchools = [
    {
      id: "all",
      name: "All Schools",
      avatarUrl: undefined,
      count: totalPatientCount,
    },
    ...schools
      .filter((s) => s.schoolId != null && String(s.schoolId) !== "")
      .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
      .map((s) => ({
        id: String(s.schoolId),
        name: s.schoolName ?? "Unknown School",
        // Use avatarUrl field from AssociatedSchool type (API field)
        avatarUrl: s.avatarUrl ?? undefined,
        count: s.count,
      })),
  ];

  return (
    <aside className="no-scrollbar lg:dark:bg-muted mx-auto flex h-fit w-[96%] shrink-0 flex-col overflow-y-auto pb-40 md:pb-10 lg:mt-6 lg:rounded-2xl lg:bg-[#fcf1e9]">
      {/* Header label */}
      <div className="shrink-0 px-4 pt-5 pb-3">
        <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
          My Schools
        </p>
      </div>

      {/* School list */}
      <ScrollArea className="flex-1 px-2.5 pb-4">
        <div className="no-scrollbar flex max-h-[77vh] flex-col gap-2 overflow-y-auto">
          {displaySchools.map((school) => {
            const isActive = activeSchool === school.id;
            const isAll = school.id === "all";
            // Generate a short label for avatar fallback
            const shortLabel = isAll
              ? null
              : (school.name ?? "")
                  .split(" ")
                  .filter(Boolean)
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 3)
                  .toUpperCase() || "?";

            return (
              <m.button
                key={school.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1 }}
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectSchool(school.id)}
                className={cn(
                  "lg:bg-card flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-all duration-300 ease-in-out",
                  isActive
                    ? "bg-primary/15 hover:bg-primary/15 lg:bg-primary"
                    : "hover:bg-card dark:bg-card/90 bg-transparent",
                )}
              >
                {/* Logo */}
                <Avatar
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg border bg-white text-[12px] font-black",
                  )}
                >
                  <AvatarImage src={school.avatarUrl} />
                  <AvatarFallback
                    className={cn(
                      "bg-transparent text-[9px] font-bold",
                      !isAll ? "text-primary" : "",
                    )}
                  >
                    {isAll ? (
                      <School className="text-primary size-4" />
                    ) : (
                      shortLabel
                    )}
                  </AvatarFallback>
                </Avatar>

                {/* Name + count */}
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-[12.5px] font-semibold",
                      isActive ? "text-white" : "text-muted-foreground",
                    )}
                  >
                    {school.name}
                  </p>
                  <p
                    className={cn(
                      "text-[10.5px]",
                      isActive ? "text-white" : "text-muted-foreground/60",
                    )}
                  >
                    {school.count} patients
                  </p>
                </div>
              </m.button>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
