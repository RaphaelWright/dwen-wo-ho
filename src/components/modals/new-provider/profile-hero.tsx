"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle2, Pencil } from "lucide-react";

export function ProfileHero({
  profileData,
  onEdit,
}: {
  profileData: any;
  onEdit: (key: string, label: string, current: string) => void;
}) {
  const fullName = `${profileData.title} ${profileData.name}`;

  return (
    <div className="flex items-start gap-0 px-7 pt-7 pb-0 shrink-0">
      {/* Avatar area */}
      <div className="flex flex-col items-center gap-2.5 mr-6">
        <motion.div
          whileHover={{ boxShadow: "0 0 40px rgba(139,92,246,.5)" }}
          className="relative size-20 rounded-full flex items-center justify-center text-4xl border-[3px] cursor-pointer bg-primary/20 border-primary"
          onClick={() => onEdit("photo", "Profile Photo", "")}
        >
          👨🏽‍⚕️
          <div className="absolute bottom-0 right-0 size-6.5 rounded-full flex items-center justify-center border-2 bg-primary">
            <Pencil size={10} className="text-white" />
          </div>
        </motion.div>

        <Badge className="inline-flex items-center gap-1.5 text-[10.5px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border bg-success">
          <CheckCircle2 size={10} /> Verified
        </Badge>
      </div>

      {/* Name + status */}
      <div className="flex-1">
        <h2 className="text-[24px] font-black mb-1">{fullName}</h2>
        <p className="text-[13.5px] mb-3 text-muted-foreground">
          {profileData.specialty} · Ranked #1
        </p>
        <div className="inline-flex items-center gap-2 text-[12.5px] border rounded-full px-3 py-1.5 ">
          &nbsp;"{profileData.status}"
        </div>
      </div>
    </div>
  );
}
