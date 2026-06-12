"use client";

import { Brain, AlertCircle, BookOpen } from "lucide-react";
import { m } from "motion/react";
import type { PatientMetricsProps } from "@/lib/types/components/curator/patient-dashboard/metrics";

export default function PatientMetrics({ metrics }: PatientMetricsProps) {
  return (
    <>
      {metrics.map((category, idx) => (
        <div
          key={category.name}
          className="bg-card border-border group hover:border-primary/20 overflow-hidden rounded-3xl border shadow-sm transition-colors duration-300"
        >
          <div className="border-border bg-muted/20 flex items-center gap-4 border-b px-6 py-4">
            <div className="bg-accent border-border group-hover:border-primary/20 rounded-xl border p-2 shadow-sm transition-colors">
              {idx === 0 ? (
                <Brain className="h-5 w-5 text-teal-600" />
              ) : idx === 1 ? (
                <AlertCircle className="h-5 w-5 text-teal-600" />
              ) : (
                <BookOpen className="h-5 w-5 text-teal-600" />
              )}
            </div>

            <div>
              <h3 className="text-foreground text-lg font-bold tracking-tight">
                {category.name}
              </h3>
              <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                {category.description} • Score: {category.score}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
            {category.items.map((item) => (
              <div key={item.name} className="flex flex-col gap-2">
                <div className="mb-1 flex items-end justify-between">
                  <span className="text-foreground text-sm font-medium">
                    {item.name}
                  </span>
                  <span
                    className="text-background rounded px-2 py-0.5 text-xs font-medium"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.value}
                  </span>
                </div>

                <p className="text-muted-foreground line-clamp-2 min-h-[2.5em] text-xs leading-relaxed">
                  {item.description}
                </p>

                <div className="bg-muted mt-1 h-1.5 w-full overflow-hidden rounded-full">
                  <m.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="h-full rounded-full opacity-60"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
