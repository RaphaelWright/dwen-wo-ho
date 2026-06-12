"use client";

import { School, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface SchoolSuggestionCardProps {
  name: string;
  avatarUrl?: string;
  type?: string;
  slogan?: string;
  rank?: number | string;
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
    <div className="group/card flex w-full items-center gap-4">
      <div className="shrink-0">
        <Avatar className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-white shadow-sm transition-transform duration-300 group-hover/card:scale-105">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
          <AvatarFallback className="bg-primary/5 text-primary border-primary/20 flex h-full w-full items-center justify-center rounded-lg border text-xs font-bold">
            {shortLabel || <School className="size-5" />}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="text-foreground group-hover/card:text-primary truncate text-[15px] font-bold transition-colors">
          {name}
        </div>

        <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2.5 text-[12px] leading-none">
          {type && (
            <span className="border-primary/20 bg-primary/5 text-primary inline-flex items-center rounded border px-2 py-0.5 text-[10.5px] font-bold tracking-wide uppercase">
              {type}
            </span>
          )}

          {rank && (
            <>
              <span className="flex shrink-0 items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:bg-amber-500/20 dark:text-amber-500">
                <Trophy className="size-3" />#{rank}
              </span>
            </>
          )}

          {slogan && (
            <>
              {(type || rank) && <span className="shrink-0 opacity-40">•</span>}
              <span className="min-w-10 truncate text-[11px] italic opacity-80">
                &quot;{slogan}&quot;
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
