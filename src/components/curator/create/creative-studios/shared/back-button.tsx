"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CreativeStudiosBackButtonProps } from "@/lib/types/components/curator/create/creative-studios";

export function BackButton({
  onClick,
  label = "Back",
}: CreativeStudiosBackButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className="text-muted-foreground group hover:text-primary absolute top-4 left-4 z-10 h-auto gap-1.5 px-0 py-0 text-sm hover:bg-transparent md:top-8 md:left-8"
    >
      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
      {label}
    </Button>
  );
}
