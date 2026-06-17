"use client";

import Image from "next/image";
import { Users, Pencil, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { m } from "motion/react";
import { SchoolDetailsIconsTabProps } from "@/lib/types/components/curator/school-details/school-details";

export function IconsTab({
  icons,
  onIconClick,
  onAddFirstIcon,
  searchQuery = "",
}: SchoolDetailsIconsTabProps & { searchQuery?: string }) {
  const filteredIcons = icons.filter((icon) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      icon.name?.toLowerCase().includes(query) ||
      (icon.lockIns || []).some((lock) => lock.toLowerCase().includes(query))
    );
  });
  if (filteredIcons.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Users className="text-muted-foreground/50 h-8 w-8" />
        </div>
        <p className="text-foreground mb-1 font-medium">No icons found</p>
        <p className="text-muted-foreground mb-6 text-sm">
          Try adjusting your search or add a new icon.
        </p>
        <Button
          onClick={onAddFirstIcon}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6"
        >
          + Add First Icon
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredIcons
        .sort((a, b) => a.rank - b.rank)
        .map((icon) => (
          <m.button
            layout
            key={icon.id}
            onClick={() => onIconClick(icon)}
            className="group border-border/60 bg-card hover:border-primary/50 relative flex flex-col overflow-hidden rounded-xl border text-left transition-all hover:shadow-lg"
          >
            <div className="bg-muted relative aspect-4/3 overflow-hidden">
              {icon.photoPreview ? (
                <Image
                  src={icon.photoPreview}
                  alt="Cover preview"
                  width={400}
                  height={300}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-muted-foreground/30 flex h-full w-full items-center justify-center">
                  <Users className="h-12 w-12" />
                </div>
              )}
              <div className="bg-background/90 text-foreground absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shadow-sm backdrop-blur-sm">
                #{icon.rank}
              </div>

              {/* Hover Edit Overlay */}
              <div className="bg-foreground/40 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <Pencil className="text-background h-6 w-6" />
              </div>
            </div>

            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-foreground group-hover:text-primary mb-2 truncate font-bold transition-colors">
                {icon.name}
              </h3>

              <div className="mt-auto flex flex-wrap gap-1.5">
                {(icon.lockIns || []).slice(0, 3).map((item) => (
                  <span
                    key={item}
                    className="bg-muted text-muted-foreground border-border inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium"
                  >
                    <Lock className="h-2.5 w-2.5" />
                    <span className="max-w-20 truncate">{item}</span>
                  </span>
                ))}
                {(icon.lockIns?.length || 0) > 3 && (
                  <span className="text-muted-foreground self-center text-[10px]">
                    +{(icon.lockIns?.length || 0) - 3}
                  </span>
                )}
              </div>
            </div>
          </m.button>
        ))}
    </div>
  );
}
