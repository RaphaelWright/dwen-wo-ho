"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import ScoreRing from "@/components/shared/score-ring";

export interface UrgentPatient {
  id: string | number;
  patientResultId: string | number;
  patientName: string;
  schoolId: number;
  schoolName: string;
  /** Pre-formatted time string, e.g. "2 min ago" */
  time: string;
  lockinScore: number;
  avatarUrl?: string;
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
          <motion.div
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
            className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer bg-card"
          >
            {/* Avatar */}
            <Avatar className="size-8.5 shrink-0 border border-border">
              <AvatarImage src={patient.avatarUrl} />
              <AvatarFallback>
                {patient.patientName
                  ? patient.patientName.charAt(0).toUpperCase()
                  : "P"}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate transition-colors">
                {patient.patientName}{" "}
                <span className="text-xs mt-0.5 text-muted-foreground ml-1">
                  {patient.schoolName}
                </span>
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <motion.div
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="size-1.5 rounded-full shrink-0 bg-destructive"
                />
                <span className="text-[10.5px] text-muted-foreground">
                  {patient.time}
                </span>
              </div>
            </div>

            <div className="self-center">
              <ScoreRing score={patient.lockinScore} />
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={5}>
          <p className="text-xs font-semibold text-destructive">
            Open {patient.patientName}&apos;s case
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
