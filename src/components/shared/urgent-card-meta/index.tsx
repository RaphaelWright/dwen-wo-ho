"use client";

import { m } from "motion/react";
import { timeAgo } from "@/lib/utils/shared/time-ago";
import type { UrgentCardMetaProps } from "@/lib/types/components/shared/urgent-card";

/**
 * Patient name, school, and urgency timestamp for an urgent care card.
 */
export default function UrgentCardMeta({ patient }: UrgentCardMetaProps) {
  return (
    <div className="min-w-0 flex-1">
      <p className="text-foreground truncate text-sm font-bold transition-colors">
        {patient.patientName}{" "}
      </p>
      <p className="truncate text-sm font-bold transition-colors">
        <span className="text-muted-foreground mt-0.5 ml-1 text-xs">
          {patient.schoolNickname || patient.schoolName}
        </span>
      </p>
      <div className="mt-1 flex items-center gap-1.5">
        <m.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="bg-destructive size-1.5 shrink-0 rounded-full"
        />
        <span className="text-muted-foreground text-[10.5px]">
          {timeAgo(patient.urgentCareEnteredAt || patient.time)}
        </span>
      </div>
    </div>
  );
}
