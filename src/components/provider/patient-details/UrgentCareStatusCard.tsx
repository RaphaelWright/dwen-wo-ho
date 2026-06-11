"use client";

import { Stethoscope } from "lucide-react";
import { m } from "motion/react";
import { LockInAssessment } from "@/lib/types/lockin";

interface UrgentCareStatusCardProps {
  lockInAssessment: LockInAssessment;
}

export function UrgentCareStatusCard({ lockInAssessment }: UrgentCareStatusCardProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-4">
        <div className="p-2 bg-accent rounded-xl shadow-sm border border-border">
          <Stethoscope className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-lg tracking-tight">
            Urgent Care Status
          </h3>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
            Care Monitoring
          </p>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-3 h-3 rounded-full ${
              lockInAssessment?.inUrgentCare
                ? "bg-red-500 animate-pulse"
                : "bg-green-500"
            }`}
          />
          <span className="font-medium text-foreground">
            {lockInAssessment?.inUrgentCare
              ? "In Urgent Care"
              : "Not in Urgent Care"}
          </span>
        </div>
        {lockInAssessment?.inUrgentCare && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold mb-1">
                Entered At
              </p>
              <p className="text-foreground">
                {lockInAssessment.urgentCareEnteredAt
                  ? new Date(lockInAssessment.urgentCareEnteredAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold mb-1">
                Time in Care
              </p>
              <p className="text-foreground">
                {lockInAssessment.timeInUrgentCareMinutes
                  ? `${Math.floor(lockInAssessment.timeInUrgentCareMinutes / 60)}h ${lockInAssessment.timeInUrgentCareMinutes % 60}m`
                  : "N/A"}
              </p>
            </div>
          </div>
        )}
      </div>
    </m.div>
  );
}
