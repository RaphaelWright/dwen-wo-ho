import { MdHealthAndSafety } from "react-icons/md";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UrgentCareSidebarProps } from "@/lib/types/components/curator/school-details";
import { URGENT_CARE_SKELETON_COUNT } from "@/lib/constants/components/curator/school-details";

export function UrgentCareSidebar({
  urgentCare,
  isLoading,
  compactTimeAgo,
}: UrgentCareSidebarProps) {
  return (
    <aside className="w-11/12 lg:w-96 shrink-0 border-t lg:border-t-0 lg:border-l border-border bg-school-details-sidebar p-6 relative z-10 order-last lg:order-0 flex flex-col lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden mx-auto rounded-3xl sm:mx-0 sm:rounded-none mb-4 sm:mb-0 border sm:border-0 shadow-sm lg:shadow-none">
      {/* Title */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-destructive">Urgent Care</h2>
          <span
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-bold",
              urgentCare.totalUrgentCarePatients > 0
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-500",
            )}
          >
            {isLoading ? "..." : urgentCare.totalUrgentCarePatients} Active
          </span>
        </div>
      </div>

      {/* Urgent Care list */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: URGENT_CARE_SKELETON_COUNT }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gray-50 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : urgentCare.patients.length === 0 ? (
          <div className="text-center py-10 bg-muted/30 rounded-xl border border-dashed border-border">
            <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm border border-border">
              <MdHealthAndSafety className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              No urgent care patients
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {urgentCare.patients.map((p, i) => {
              const patientIdStr = p.patientResultId || p.id || p.lockinId;
              const schoolIdStr =
                p.schoolId ||
                (typeof window !== "undefined"
                  ? window.location.pathname.split("/")[3]
                  : "");
              const href =
                patientIdStr && schoolIdStr
                  ? `/curator/schools/${schoolIdStr}/patients/${patientIdStr}`
                  : "#";

              return (
                <Link
                  key={i}
                  href={href as any}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-destructive/30 hover:bg-destructive/5 transition-all duration-200 bg-card shadow-sm cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-destructive/20 bg-destructive/5 text-destructive font-bold text-sm shadow-sm">
                    {p.lockedInScore != null ? p.lockedInScore.toFixed(1) : "-"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground truncate text-base group-hover:text-destructive transition-colors">
                      {p.patientName ?? "Patient"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                      <p className="text-xs text-muted-foreground">
                        {p.urgentCareEnteredAt || p.lockinDate || p.createdAt
                          ? compactTimeAgo(
                              (p.urgentCareEnteredAt ||
                                p.lockinDate ||
                                p.createdAt ||
                                "") as string,
                            )
                          : "Recently"}{" "}
                        ago
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
