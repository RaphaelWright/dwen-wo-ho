"use client";

import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CreativeStudiosHomeButtonProps } from "@/lib/types/components/curator/create/creative-studios";

export function HomeButton({ onClick }: CreativeStudiosHomeButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      aria-label="Go to curator dashboard"
      className="hover:bg-background/80 bg-background/10 absolute top-4 left-4 z-20 size-9 p-0 text-white hover:text-black"
    >
      <Home className="size-4" />
    </Button>
  );
}
