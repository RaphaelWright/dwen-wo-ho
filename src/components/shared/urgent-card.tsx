"use client";

import { Patient } from "@/lib/types/provider/new-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import ScoreRing from "@/components/shared/score-ring";

/**
 * A single card in the Urgent Care right panel.
 * @param {{ patient: object, index: number }} props
 */
export default function UrgentCard({
  patient,
  index,
}: {
  patient: Patient;
  index: number;
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
            className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer bg-card"
          >
            {/* Avatar */}
            <Avatar className="size-8.5 shrink-0 border border-border">
              <AvatarImage src={patient.avatarUrl} />
              <AvatarFallback>
                {patient.name ? patient.name.charAt(0).toUpperCase() : "P"}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate transition-colors">
                {patient.name}
              </p>
              <p className="text-xs mt-0.5 text-muted-foreground">
                {patient.schoolLabel}
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
              <ScoreRing score={patient.score} />
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={5}>
          <p className="text-xs font-semibold text-destructive">
            Open {patient.name}&apos;s case
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
