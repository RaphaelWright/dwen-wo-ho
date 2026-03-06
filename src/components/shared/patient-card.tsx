"use client";

import { motion } from "framer-motion";
import { getScoreColor, getStatusConfig } from "@/lib/utils/new-provider";
import ScoreRing from "./score-ring";

/**
 * A single row in the patient list.
 * @param {{ patient: import("@/lib/data").Patient, index: number }} props
 *
 */

export interface PatientCardProps {
  id: string | number;
  name: string;
  score: number | null;
  status: string;
  time: string;
  preview: string | React.ReactNode;
  schoolLabel?: string;
}

export default function PatientCard({
  patient,
  index = 0,
  onActionClick,
}: {
  patient: PatientCardProps;
  index?: number;
  onActionClick?: (id: string | number) => void;
}) {
  const cfg = getStatusConfig(patient.status);
  const scoreColor = getScoreColor(patient.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{
        duration: 0.2,
        delay: Math.min(index * 0.03, 0.15),
        ease: "easeOut",
      }}
      whileHover={{
        x: 3,
        boxShadow: `-2px 0 0 0 ${scoreColor}`,
        transition: { duration: 0.15 },
      }}
      className="relative flex items-center gap-4 px-5 py-4 rounded-xl border cursor-pointer overflow-hidden bg-card z-1"
    >
      {/* Content */}
      <div className="relative z-10 flex items-center gap-4 w-full">
        <ScoreRing score={patient.score} />

        <div className="flex-1 min-w-0">
          {/* Name + time */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[15px] font-bold">{patient.name}</span>
            <span className="text-xs text-muted-foreground">
              {patient.time}
            </span>
          </div>

          {/* Preview */}
          <p className="text-[12.5px] mt-0.5 leading-snug line-clamp-1 text-muted-foreground/80">
            {patient.preview}
          </p>

          {/* Tags */}
          <div className="flex gap-2 mt-2 flex-wrap items-center">
            <span
              className={`inline-flex items-center gap-1 text-[10.5px] font-bold tracking-wide uppercase px-2 py-0.75 rounded border ${cfg.cls}`}
            >
              {cfg.label}
            </span>
            {patient.schoolLabel && (
              <span className="text-[10.5px] font-bold tracking-wide uppercase px-2 py-0.75 rounded border text-muted-foreground/70 max-w-30 truncate">
                {patient.schoolLabel}
              </span>
            )}
          </div>
        </div>

        {/* Action button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            if (onActionClick) onActionClick(patient.id);
          }}
          whileHover={{
            scale: 1.03,
            backgroundColor: "#8B5CF6",
            color: "#ffff",
          }}
          whileTap={{ scale: 0.97 }}
          className="shrink-0 px-4 py-1.5 rounded-xl border text-[12px] font-semibold cursor-pointer bg-card transition-all duration-300 ease-in-out"
        >
          {cfg.actionLabel}
        </motion.button>
      </div>
    </motion.div>
  );
}
