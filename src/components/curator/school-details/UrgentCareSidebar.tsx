import { MdHealthAndSafety } from "react-icons/md";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import { UrgentCareSidebarProps } from "@/lib/types/components/curator/school-details";
import { URGENT_CARE_SKELETON_COUNT } from "@/lib/constants/components/curator/school-details";

export function UrgentCareSidebar({
  urgentCare,
  isLoading,
  compactTimeAgo,
  onLogoClick,
}: UrgentCareSidebarProps) {
  return (
    <aside className="w-11/12 lg:w-96 shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white p-6 relative z-10 order-last lg:order-0 flex flex-col lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden  mx-auto rounded-2xl sm:mx-0 sm:rounded-none mb-4 sm:mb-0 border sm:border-0">
      {/* Logo with click to go back and Title */}
      <div className="mb-8">
        <div
          onClick={onLogoClick}
          className="mb-6 cursor-pointer hover:opacity-70 transition-opacity inline-block"
        >
          <Logo className="scale-75 origin-left" />
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Urgent Care</h2>
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
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
              <MdHealthAndSafety className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 font-medium">
              No urgent care patients
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {urgentCare.patients.map((p, i) => (
              <div
                key={i}
                className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50/30 transition-all duration-200 bg-white shadow-sm"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-900 text-white flex items-center justify-center shrink-0 shadow-md group-hover:bg-red-600 transition-colors">
                  <span className="font-bold text-lg">
                    {p.lockedInScore != null ? p.lockedInScore.toFixed(1) : "-"}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-900 truncate text-base group-hover:text-red-700 transition-colors">
                    {p.patientName ?? "Patient"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    <p className="text-xs text-gray-500">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
