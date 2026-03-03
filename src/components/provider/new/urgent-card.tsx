"use client";

import { Patient } from "@/lib/types/provider/new-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.35,
        delay: 0.1 + index * 0.07,
        ease: [0.22, 0.8, 0.36, 1],
      }}
      whileHover={{ x: -2, transition: { duration: 0.15 } }}
      className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer bg-destructive dark:bg-destructive/80"
    >
      {/* Avatar */}
      <Avatar className="size-8.5 shrink-0 border border-border">
        <AvatarImage src={patient.avatarUrl} />
        <AvatarFallback className="text-foreground">
          {patient.name ? patient.name.charAt(0).toUpperCase() : "P"}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold truncate text-white">
          {patient.name}
        </p>
        <p className="text-[11px] mt-0.5 text-white/80">
          {patient.schoolLabel}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="size-1.5 rounded-full shrink-0 bg-blue-100"
          />
          <span className="text-[10.5px] text-white">{patient.time}</span>
        </div>
      </div>

      {/* Score badge */}
      <span className="text-[11.5px] font-black px-1.5 py-0.5 rounded shrink-0 bg-white text-black">
        {patient.score.toFixed(1)}
      </span>
    </motion.div>
  );
}
