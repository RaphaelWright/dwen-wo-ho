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

      <div className="flex-1 min-w-0">
        <div className="truncate text-[15px] font-bold text-foreground transition-colors group-hover:text-primary">
          {name}
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
          <span
            className={`inline-flex items-center gap-1 text-[10.5px] font-bold tracking-wide uppercase px-2 py-0.75 rounded border ${cfg.cls}`}
          >
            {status}
          </span>

          {school && (
            <span className="flex items-center gap-1.5 whitespace-nowrap font-medium">
              <span className="opacity-40">•</span>
              <span>{school}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
