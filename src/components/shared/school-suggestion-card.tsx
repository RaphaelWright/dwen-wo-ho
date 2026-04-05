"use client";

import { School, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface SchoolSuggestionCardProps {
  name: string;
  avatarUrl?: string;
  type?: string;
  slogan?: string;
  rank?: number | string;
  [key: string]: any; // Allows passing the rest of the school object safely
}

export function SchoolSuggestionCard({
  name,
  avatarUrl,
  type,
  slogan,
  rank,
}: SchoolSuggestionCardProps) {
  // Generate a short 2-3 letter abbreviation for the fallback if logo is absent
  const shortLabel = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 3)
        .toUpperCase()
    : "";

  return (
    <div className="flex items-center gap-4 group/card w-full">
      <div className="shrink-0">
        <Avatar className="size-10 rounded-lg flex items-center justify-center shrink-0 border bg-white shadow-sm transition-transform duration-300 group-hover/card:scale-105">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
          <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold rounded-lg border-primary/20 border flex items-center justify-center w-full h-full">
            {shortLabel || <School className="size-5" />}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="truncate text-[15px] font-bold text-foreground transition-colors group-hover/card:text-primary">
          {name}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2.5 text-[12px] text-muted-foreground leading-none">
          {type && (
            <span className="inline-flex items-center px-2 py-0.5 rounded border border-primary/20 bg-primary/5 text-[10.5px] font-bold tracking-wide uppercase text-primary">
              {type}
            </span>
          )}

          {rank && (
            <>
              <span className="flex items-center gap-1 font-semibold text-[11px] bg-amber-500/10 text-amber-600 dark:text-amber-500 dark:bg-amber-500/20 px-1.5 py-0.5 rounded shrink-0">
                <Trophy className="size-3" />
                #{rank}
              </span>
            </>
          )}

          {slogan && (
            <>
              {(type || rank) && <span className="shrink-0 opacity-40">•</span>}
              <span className="truncate italic text-[11px] opacity-80 min-w-10">
                "{slogan}"
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
