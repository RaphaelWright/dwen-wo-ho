"use client";

import { Clock, Users, Star, GraduationCap } from "lucide-react";
import ScoreRing from "@/components/shared/score-ring";
import Image from "next/image";
import { motion } from "framer-motion";

export interface SchoolSearchSuggestionCardProps {
  type: "patient" | "icon" | "provider" | "school";
  name: string;
  subtitle?: string;
  score?: number | null;
  status?: string;
  image?: string | null;
  time?: string;
  metadata?: string;
}

export function SchoolSearchSuggestionCard({
  type,
  name,
  subtitle,
  score,
  image,
  time,
  metadata,
}: SchoolSearchSuggestionCardProps) {
  return (
    <div className="flex items-center gap-4 transition-colors">
      <div className="shrink-0">
        {type === "patient" && score !== undefined && (
          <ScoreRing score={score} />
        )}
        {type === "provider" && (
          <div className="size-10 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center">
            {image ? (
              <Image
                src={image}
                alt={name}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <Users className="size-5 text-muted-foreground/40" />
            )}
          </div>
        )}
        {type === "icon" && (
          <div className="size-10 rounded-xl overflow-hidden border border-border bg-muted flex items-center justify-center">
            {image ? (
              <Image
                src={image}
                alt={name}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <Star className="size-5 text-muted-foreground/40" />
            )}
          </div>
        )}
        {type === "school" && (
          <div className="size-10 rounded-xl overflow-hidden border border-border bg-primary/5 flex items-center justify-center">
            <GraduationCap className="size-6 text-primary/60" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="truncate text-[15px] font-bold text-foreground transition-colors group-hover:text-primary">
          {name}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
          {time && (
            <span className="flex items-center gap-1.5 whitespace-nowrap font-medium">
              <Clock className="size-3.5" />
              {time}
            </span>
          )}
          {time && (subtitle || metadata) && (
            <span className="shrink-0 opacity-40">•</span>
          )}
          {subtitle && (
            <span className="truncate text-[10px] font-bold uppercase tracking-wider text-foreground/80">
              {subtitle}
            </span>
          )}
          {metadata && (
            <>
              {subtitle && <span className="shrink-0 opacity-40">•</span>}
              <span className="truncate text-[10px] font-bold uppercase tracking-wider text-foreground/80">
                {metadata}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
