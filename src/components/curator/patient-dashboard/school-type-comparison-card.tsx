import { TrendingUp } from "lucide-react";

import { PATIENT_COMPARISON_METRICS } from "@/lib/constants/components/curator/patient-dashboard/comparison-metrics";
import type { SchoolTypeComparisonCardProps } from "@/lib/types/components/curator/patient-dashboard";

export default function SchoolTypeComparisonCard({
  lockInAssessment,
}: SchoolTypeComparisonCardProps) {
  const averages = lockInAssessment.schoolTypeAverages;

  if (!averages) return null;

  return (
    <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-sm">
      <div className="border-border bg-muted/20 flex items-center gap-4 border-b px-6 py-4">
        <div className="bg-accent border-border rounded-xl border p-2 shadow-sm">
          <TrendingUp className="h-5 w-5 text-teal-600" />
        </div>
        <div>
          <h3 className="text-foreground text-lg font-bold tracking-tight">
            School Type Comparison
          </h3>
          <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            {lockInAssessment.schoolType} Averages (n={averages.sampleSize})
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {PATIENT_COMPARISON_METRICS.map((metric) => (
          <div
            key={metric.label}
            className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3"
          >
            <span className="text-muted-foreground text-xs font-bold uppercase">
              {metric.label}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-foreground text-lg font-bold">
                {metric.getScore(lockInAssessment)}
              </span>
              <span className="text-muted-foreground text-xs">
                avg: {metric.getAverage(averages).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
