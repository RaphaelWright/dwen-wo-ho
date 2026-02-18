"use client";

import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PatientsTabProps } from "@/lib/types/components/curator/school-details";

export function PatientsTab({
  patients,
  isLoading,
  compactTimeAgo,
  onViewPatient,
}: PatientsTabProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
          <Users className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <p className="text-foreground font-medium">No patients found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or add a new patient.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {patients.map((patient) => {
        const isTreating = (patient.treatingProviders?.length ?? 0) > 0;
        const isSeen = patient.visibilityStatus === "SEEN";

        return (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-card rounded-2xl border border-border/60 p-4 sm:p-5 hover:shadow-md hover:border-primary/30 transition-all duration-200 flex flex-col sm:flex-row gap-4 sm:items-center"
          >
            {/* Lock-in score Badge - Redesigned */}
            <div
              className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200",
                patient.lockinScore != null
                  ? "bg-primary/5 border-primary/20 text-primary shadow-sm"
                  : "bg-muted/50 border-transparent text-muted-foreground",
              )}
            >
              <span className="font-bold text-lg sm:text-xl">
                {patient.lockinScore != null
                  ? patient.lockinScore.toFixed(1)
                  : "–"}
              </span>
            </div>

            {/* Patient info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-foreground text-lg sm:text-xl group-hover:text-primary transition-colors">
                  {patient.patientName}
                </h3>
                <span className="text-xs font-medium text-muted-foreground px-2 py-0.5 bg-muted rounded-full border border-border">
                  {compactTimeAgo(patient.createdAt || "")} ago
                </span>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {patient.comment ? (
                  <span className="italic">&quot;{patient.comment}&quot;</span>
                ) : (
                  <span className="text-muted-foreground/50 italic">
                    No comments
                  </span>
                )}
              </p>

              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide",
                    isTreating
                      ? "bg-purple-500/10 text-purple-700 border border-purple-200"
                      : isSeen
                        ? "bg-blue-500/10 text-blue-700 border border-blue-200"
                        : "bg-green-500/10 text-green-700 border border-green-200",
                  )}
                >
                  {isTreating ? "Treating" : isSeen ? "Opened" : "New"}
                </div>
              </div>
            </div>

            {/* Action button */}
            <Button
              onClick={() => onViewPatient(patient.id)}
              className={cn(
                "sm:self-center shrink-0 rounded-lg px-6 w-full sm:w-auto transition-all",
                isTreating || isSeen
                  ? "bg-background text-foreground border border-border hover:bg-muted"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20",
              )}
            >
              {isTreating || isSeen ? "View Details" : "Open Case"}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}
