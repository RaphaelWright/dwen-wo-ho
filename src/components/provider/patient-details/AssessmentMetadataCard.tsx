"use client";

import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import { LockInAssessment } from "@/lib/types/lockin";

interface AssessmentMetadataCardProps {
  lockInAssessment: LockInAssessment;
}

export function AssessmentMetadataCard({ lockInAssessment }: AssessmentMetadataCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-4">
        <div className="p-2 bg-accent rounded-xl shadow-sm border border-border">
          <FileText className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-lg tracking-tight">
            Assessment Details
          </h3>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
            Lock-in Information
          </p>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase font-bold mb-1">
            Lock-in ID
          </p>
          <p className="text-sm font-medium text-foreground">
            #{lockInAssessment?.lockinId}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase font-bold mb-1">
            Assessment Date
          </p>
          <p className="text-sm font-medium text-foreground">
            {lockInAssessment?.lockinDate
              ? new Date(lockInAssessment.lockinDate).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase font-bold mb-1">
            School Type
          </p>
          <p className="text-sm font-medium text-foreground">
            {lockInAssessment?.schoolType}
          </p>
        </div>
        {lockInAssessment?.comment && (
          <div className="sm:col-span-3">
            <p className="text-xs text-muted-foreground uppercase font-bold mb-1">
              Comment
            </p>
            <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg">
              {lockInAssessment.comment}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
