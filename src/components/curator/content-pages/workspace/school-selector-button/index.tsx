"use client";

import { Button } from "@/components/ui/button";
import type { SchoolSelectorButtonProps } from "@/lib/types/components/curator/content-pages/content-pages";

export function SchoolSelectorButton({
  selectedSchoolName,
  onOpenSchoolModal,
}: SchoolSelectorButtonProps) {
  return (
    <div className="relative top-2 mt-4 flex justify-center">
      <div className="origin-center scale-[1.4]">
        <Button
          type="button"
          onClick={onOpenSchoolModal}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full px-8 py-3 text-lg font-semibold shadow-lg"
        >
          {selectedSchoolName ? `${selectedSchoolName} >` : "Select school >"}
        </Button>
      </div>
    </div>
  );
}
