"use client";

import ScoreRing from "@/components/shared/score-ring";

import { getStatusConfig } from "@/lib/utils/new-provider";

export interface PatientSuggestionCardProps {
  name: string;
  score: number;
  status: string;
  school?: string;
}

export function PatientSuggestionCard({
  name,

  score,

  status,

  school,
}: PatientSuggestionCardProps) {
  const cfg = getStatusConfig(status);

  return (
    <div className="flex items-center gap-4">
      <div className="shrink-0">
        <ScoreRing score={score} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-foreground group-hover:text-primary truncate text-[15px] font-bold transition-colors">
          {name}
        </div>

        <div className="text-muted-foreground mt-0.5 flex flex-wrap items-center gap-2 text-[12px]">
          <span
            className={`inline-flex items-center gap-1 rounded border px-2 py-0.75 text-[10.5px] font-bold tracking-wide uppercase ${cfg.cls}`}
          >
            {status}
          </span>

          {school && (
            <span className="flex items-center gap-1.5 font-medium whitespace-nowrap">
              <span className="opacity-40">•</span>
              <span>{school}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
