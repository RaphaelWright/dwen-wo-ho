"use client";

import { ChevronLeft, User, Activity, School, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PatientResult } from "@/lib/types/patient";
import { LockInAssessment } from "@/lib/types/lockin";
import { getColorHex } from "@/lib/utils/color-utils";

interface PatientDetailsHeaderProps {
  patientResult: PatientResult;
  lockInAssessment: LockInAssessment | null;
  isTreating: boolean;
  onBack: () => void;
}

export function PatientDetailsHeader({
  patientResult,
  lockInAssessment,
  isTreating,
  onBack,
}: PatientDetailsHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-3xl shadow-sm border border-border p-6 md:p-8 mb-8 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-teal-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

      <Button
        onClick={onBack}
        variant="ghost"
        className="rounded-full mb-6 transition-colors gap-2 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-5" /> Back to List
      </Button>

      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
        {/* Avatar / Initials */}
        <div className="w-24 h-24 md:w-32 md:h-32 bg-teal-500/10 rounded-3xl flex items-center justify-center text-teal-600 shadow-inner shrink-0 ring-1 ring-teal-500/20">
          <User className="w-12 h-12 md:w-16 md:h-16 opacity-80" />
        </div>

        {/* Patient Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {patientResult?.patientName}
            </h1>
            {isTreating && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200">
                Treating
              </span>
            )}
            {patientResult?.visibilityStatus === "NEW" && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                New
              </span>
            )}
            {patientResult?.visibilityStatus === "SEEN" && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                Seen
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
              <Activity className="w-4 h-4 text-teal-600" />
              <span className="font-medium">
                {patientResult?.patientAge} yrs, {patientResult?.patientSex}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
              <School className="w-4 h-4 text-teal-600" />
              <span className="font-medium">{patientResult?.schoolName}</span>
            </div>

            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span className="font-medium">
                Joined{" "}
                {new Date(patientResult?.createdAt || "").toLocaleDateString()}
              </span>
            </div>

            {lockInAssessment?.schoolType && (
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                <School className="w-4 h-4 text-teal-600" />
                <span className="font-medium">
                  {lockInAssessment.schoolType}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Locked-In Score Indicator */}
        {lockInAssessment && (
          <div className="flex flex-col items-center p-6 bg-muted/30 rounded-3xl border border-border/50 min-w-40 mx-auto sm:mx-0 backdrop-blur-sm">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Locked In Score
            </span>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-bold text-teal-600 tracking-tight">
                {lockInAssessment?.lockedInScore.split("/")[0]}
              </span>
              <span className="text-lg text-muted-foreground font-medium">
                /10
              </span>
            </div>

            <div
              className="px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wide shadow-sm"
              style={{
                backgroundColor: getColorHex(
                  lockInAssessment?.lockedInColor || "gray",
                ),
              }}
            >
              {lockInAssessment?.lockedInScoreDescription || "Unknown"}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
