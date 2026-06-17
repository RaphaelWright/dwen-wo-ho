"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { m } from "motion/react";
import ScoreRing from "@/components/shared/score-ring/index";
import UrgentCardMeta from "@/components/shared/urgent-card-meta";
import type { UrgentCardProps } from "@/lib/types/components/shared/urgent-card";

/**
 * A single card in the Urgent Care right panel.
 */
export default function UrgentCard({
  patient,
  index,
  onClick,
}: UrgentCardProps) {
  return (
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
          <Avatar className="border-border size-8.5 shrink-0 border">
            <AvatarImage src={patient.avatarUrl} />
            <AvatarFallback>
              {patient.patientName
                ? patient.patientName.charAt(0).toUpperCase()
                : "P"}
            </AvatarFallback>
          </Avatar>

          <UrgentCardMeta patient={patient} />

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
  );
}
