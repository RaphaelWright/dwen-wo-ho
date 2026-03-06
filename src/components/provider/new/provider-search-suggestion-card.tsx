"use client";

import { Clock } from "lucide-react";
import ScoreRing from "@/components/shared/score-ring";

export interface ProviderSearchSuggestionCardProps {
  name: string;
  score: number;
  status: string;
  time: string;
  preview: string;
  [key: string]: any; // Allows passing the rest of the patient object safely
}

export function ProviderSearchSuggestionCard({
  name,
  score,
  status,
  time,
  preview,
}: ProviderSearchSuggestionCardProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="shrink-0">
        <ScoreRing score={score} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="truncate text-[15px] font-bold text-foreground">
          {name}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
          <span className="flex items-center gap-1.5 whitespace-nowrap font-medium">
            <Clock className="size-3.5" />
            {time}
          </span>
          <span className="shrink-0 opacity-40">•</span>
          <span className="truncate text-[10px] font-bold uppercase tracking-wider text-foreground/80">
            {preview}
          </span>
        </div>
      </div>
    </div>
  );
}
