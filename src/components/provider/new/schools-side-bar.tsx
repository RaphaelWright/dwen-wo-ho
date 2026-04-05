"use client";

import { motion } from "framer-motion";
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
  filteredPatients,
  isLoading,
}: {
  activeSchool: ProviderDashboardState["activeSchool"];
  handleSelectSchool: ProviderDashboardState["handleSelectSchool"];
  schools: ProviderDashboardState["schools"];
  filteredPatients: ProviderDashboardState["filteredPatients"];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return <SchoolsSidebarSkeleton />;
  }

  // Build display list: "All Schools" entry + live schools from API
  // Filter out schools with missing/invalid ids to avoid duplicate React keys
  const displaySchools = [
    {
      id: "all",
      name: "All Schools",
      avatarUrl: undefined,
      count: filteredPatients.length,
    },
    ...schools
      .filter((s) => s.schoolId != null && String(s.schoolId) !== "")
      .map((s) => ({
        id: String(s.schoolId),
        name: s.schoolName ?? "Unknown School",
        // Use avatarUrl field from AssociatedSchool type (API field)
        avatarUrl: s.avatarUrl ?? undefined,
        count: s.count,
      })),
  ];

  return (
    <aside className="w-[96%] mx-auto shrink-0 flex flex-col overflow-y-auto no-scrollbar  h-fit pb-40 md:pb-10  lg:bg-[#fcf1e9] lg:dark:bg-muted lg:rounded-2xl lg:mt-6">
      {/* Header label */}
      <div className="px-4 pt-5 pb-3 shrink-0">
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
          My Schools
        </p>
      </div>

      {/* School list */}
      <ScrollArea className="flex-1 px-2.5 pb-4">
        <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar max-h-[77vh]">
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
              <motion.button
                key={school.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1 }}
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectSchool(school.id)}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl cursor-pointer w-full text-left transition-all duration-300 ease-in-out lg:bg-card",
                  isActive
                    ? "bg-primary/15 hover:bg-primary/15 lg:bg-primary"
                    : "bg-transparent hover:bg-card dark:bg-card/90",
                )}
              >
                {/* Logo */}
                <Avatar
                  className={cn(
                    "size-8 rounded-lg flex items-center justify-center shrink-0 border text-[12px] font-black bg-white",
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
                      <School className="size-4 text-primary" />
                    ) : (
                      shortLabel
                    )}
                  </AvatarFallback>
                </Avatar>

                {/* Name + count */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-[12.5px] font-semibold truncate",
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
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
