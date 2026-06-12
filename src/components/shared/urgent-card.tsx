"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { m } from "motion/react";
import { timeAgo } from "@/lib/utils/timeAgo";
import ScoreRing from "@/components/shared/score-ring";

export interface UrgentPatient {
  id: string | number;
  patientResultId: string | number;
  patientName: string;
  schoolId: number;
  schoolName: string;
  schoolNickname: string;
  time: string;
  lockedInScore: string;
  score: string;
  avatarUrl?: string;
  urgentCareEnteredAt?: string;
}

/**
 * A single card in the Urgent Care right panel.
 */
export default function UrgentCard({
  patient,
  index,
  onClick,
}: {
  patient: UrgentPatient;
  index: number;
  onClick?: (patient: UrgentPatient) => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <m.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.1 + index * 0.07,
              ease: [0.22, 0.8, 0.36, 1],
            }}
            whileHover={{
              x: -2,
              color: "#ef4444",
              transition: { duration: 0.15 },
            }}
            onClick={() => onClick?.(patient)}
            className="bg-card flex cursor-pointer items-start gap-3 rounded-xl border p-3"
          >
            {/* Avatar */}
            <Avatar className="border-border size-8.5 shrink-0 border">
              <AvatarImage src={patient.avatarUrl} />
              <AvatarFallback>
                {patient.patientName
                  ? patient.patientName.charAt(0).toUpperCase()
                  : "P"}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
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

            <div className="self-center">
              <ScoreRing score={patient.score || patient.lockedInScore} />
            </div>
          </m.div>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={5}>
          <p className="text-destructive text-xs font-semibold">
            Open {patient.patientName}&apos;s case
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
