"use client";

import { ChevronLeft, User, Activity, School, Calendar } from "lucide-react";
import { m } from "motion/react";
import { Button } from "@/components/ui/button";
import { PatientResult } from "@/lib/types/entities/patient";
import { LockInAssessment } from "@/lib/types/entities/lockin";
import { getColorHex } from "@/lib/utils/shared/color-hex";
import { IconProgress } from "@tabler/icons-react";

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
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border-border relative mb-8 overflow-hidden rounded-3xl border p-6 shadow-sm md:p-8"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-teal-500/5 to-transparent" />

      <Button
        onClick={onBack}
        variant="ghost"
        className="text-muted-foreground hover:text-foreground mb-6 gap-2 rounded-full pl-0 transition-colors hover:bg-transparent"
      >
        <ChevronLeft className="size-5" /> Back to List
      </Button>

      <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row md:items-center">
        {/* Avatar / Initials */}
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-teal-500/10 text-teal-600 shadow-inner ring-1 ring-teal-500/20 md:h-32 md:w-32">
          <User className="h-12 w-12 opacity-80 md:h-16 md:w-16" />
        </div>

        {/* Patient Info */}
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-3">
            <h1 className="text-foreground text-3xl font-bold md:text-4xl">
              {patientResult?.patientName}
            </h1>
            {isTreating && (
              <span className="rounded-full border border-teal-200 bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
                Treating
              </span>
            )}
            {patientResult?.visibilityStatus === "NEW" && (
              <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                New
              </span>
            )}
            {patientResult?.visibilityStatus === "SEEN" && (
              <span className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                Seen
              </span>
            )}
          </div>

          <div className="text-muted-foreground flex flex-wrap gap-3 text-sm">
            <div className="bg-muted/50 border-border/50 flex items-center gap-2 rounded-full border px-3 py-1.5">
              <Activity className="h-4 w-4 text-teal-600" />
              <span className="font-medium">
                {patientResult?.patientAge} yrs, {patientResult?.patientSex}
              </span>
            </div>

            <div className="bg-muted/50 border-border/50 flex items-center gap-2 rounded-full border px-3 py-1.5">
              <School className="h-4 w-4 text-teal-600" />
              <span className="font-medium">{patientResult?.schoolName}</span>
            </div>

            <div className="bg-muted/50 border-border/50 flex items-center gap-2 rounded-full border px-3 py-1.5">
              <Calendar className="h-4 w-4 text-teal-600" />
              <span className="font-medium">
                Joined{" "}
                {new Date(patientResult?.createdAt || "").toLocaleDateString()}
              </span>
            </div>

            {lockInAssessment?.schoolType && (
              <div className="bg-muted/50 border-border/50 flex items-center gap-2 rounded-full border px-3 py-1.5">
                <School className="h-4 w-4 text-teal-600" />
                <span className="font-medium">
                  {lockInAssessment.schoolType}
                </span>
              </div>
            )}

            <div className="bg-muted/50 border-border/50 flex items-center gap-2 rounded-full border px-3 py-1.5">
              <IconProgress className="h-4 w-4 text-teal-600" />
              <span className="font-medium">
                Year: {patientResult?.patientLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Locked-In Score Indicator */}
        {lockInAssessment && (
          <div className="bg-muted/30 border-border/50 mx-auto flex min-w-40 flex-col items-center rounded-3xl border p-6 backdrop-blur-sm sm:mx-0">
            <span className="text-muted-foreground mb-2 text-xs font-bold tracking-wider uppercase">
              Locked In Score
            </span>

            <div className="mb-2 flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tight text-teal-600">
                {lockInAssessment?.lockedInScore.split("/")[0]}
              </span>
              <span className="text-muted-foreground text-lg font-medium">
                /10
              </span>
            </div>

            <div
              className="rounded-full px-4 py-1.5 text-xs font-bold tracking-wide text-white uppercase shadow-sm"
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
    </m.div>
  );
}
