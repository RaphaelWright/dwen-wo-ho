"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CreativeStudiosChipProps } from "@/lib/types/components/curator/create/creative-studios";
import { escapeHtml } from "@/lib/utils/curator/create/escape-html";

export function Chip({ label, color, onRemove }: CreativeStudiosChipProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-150",
        color === "purple"
          ? "bg-primary/10 text-primary"
          : "bg-secondary/10 text-secondary",
      )}
    >
      {escapeHtml(label)}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="size-4 p-0 opacity-60 hover:bg-transparent hover:opacity-100"
        aria-label={`Remove ${label}`}
      >
        <X className="size-3" />
      </Button>
    </Badge>
  );
}
