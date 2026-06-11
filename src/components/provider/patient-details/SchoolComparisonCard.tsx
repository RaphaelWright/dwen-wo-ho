"use client";

import { TrendingUp } from "lucide-react";
import { m } from "motion/react";
import { LockInAssessment } from "@/lib/types/lockin";

interface SchoolComparisonCardProps {
  lockInAssessment: LockInAssessment;
}

export function SchoolComparisonCard({ lockInAssessment }: SchoolComparisonCardProps) {
  if (!lockInAssessment?.schoolTypeAverages) return null;

  const averages = lockInAssessment.schoolTypeAverages;

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-4">
        <div className="p-2 bg-accent rounded-xl shadow-sm border border-border">
          <TrendingUp className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-lg tracking-tight">
            School Type Comparison
          </h3>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
            {lockInAssessment.schoolType} Averages (n={averages.sampleSize})
          </p>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Locked In Score */}
        <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
          <span className="text-xs text-muted-foreground uppercase font-bold">
            Locked In Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {lockInAssessment.lockedInScore}
            </span>
            <span className="text-xs text-muted-foreground">
              avg: {averages.averageLockedInScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* General Mental Health */}
        <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
          <span className="text-xs text-muted-foreground uppercase font-bold">
            Mental Health
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {lockInAssessment.generalMentalHealthScore}
            </span>
            <span className="text-xs text-muted-foreground">
              avg: {averages.averageGeneralMentalHealthScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Depression */}
        <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
          <span className="text-xs text-muted-foreground uppercase font-bold">
            Depression
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {lockInAssessment.possibleDepressionScore}
            </span>
            <span className="text-xs text-muted-foreground">
              avg: {averages.averageDepressionScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Loneliness */}
        <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
          <span className="text-xs text-muted-foreground uppercase font-bold">
            Loneliness
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {lockInAssessment.lonelinessScore}
            </span>
            <span className="text-xs text-muted-foreground">
              avg: {averages.averageLonelinessScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Suicidality */}
        <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
          <span className="text-xs text-muted-foreground uppercase font-bold">
            Suicidality
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {lockInAssessment.suicidalRiskScore}
            </span>
            <span className="text-xs text-muted-foreground">
              avg: {averages.averageSuicidalityScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Exam Anxiety */}
        <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
          <span className="text-xs text-muted-foreground uppercase font-bold">
            Exam Anxiety
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {lockInAssessment.examAnxietyScore}
            </span>
            <span className="text-xs text-muted-foreground">
              avg: {averages.averageExamAnxietyScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Core Anxiety */}
        <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
          <span className="text-xs text-muted-foreground uppercase font-bold">
            Core Anxiety
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {lockInAssessment.coreAnxietyScore}
            </span>
            <span className="text-xs text-muted-foreground">
              avg: {averages.averageCoreAnxietyScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Physical Distress */}
        <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
          <span className="text-xs text-muted-foreground uppercase font-bold">
            Physical Distress
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {lockInAssessment.physicalDistressScore}
            </span>
            <span className="text-xs text-muted-foreground">
              avg: {averages.averagePhysicalDistressScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Exam Preparation */}
        <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
          <span className="text-xs text-muted-foreground uppercase font-bold">
            Exam Preparation
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {lockInAssessment.examPrepScore}
            </span>
            <span className="text-xs text-muted-foreground">
              avg: {averages.averageExamPreparationScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Motivation */}
        <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
          <span className="text-xs text-muted-foreground uppercase font-bold">
            Motivation
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {lockInAssessment.motivationScore}
            </span>
            <span className="text-xs text-muted-foreground">
              avg: {averages.averageMotivationScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Study Skills */}
        <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
          <span className="text-xs text-muted-foreground uppercase font-bold">
            Study Skills
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {lockInAssessment.studySkillsScore}
            </span>
            <span className="text-xs text-muted-foreground">
              avg: {averages.averageStudySkillsScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Procrastination */}
        <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
          <span className="text-xs text-muted-foreground uppercase font-bold">
            Procrastination
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {lockInAssessment.procrastinationScore}
            </span>
            <span className="text-xs text-muted-foreground">
              avg: {averages.averageProcrastinationScore?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </m.div>
  );
}
