"use client";

import Image from "next/image";
import { Users, Pencil, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { IconsTabProps } from "@/lib/types/components/curator/school-details";

export function IconsTab({
  icons,
  onIconClick,
  onAddFirstIcon,
}: IconsTabProps) {
  if (icons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <p className="text-foreground font-medium mb-1">No icons added yet</p>
        <p className="text-sm text-muted-foreground mb-6">
          Add icons to highlight school features.
        </p>
        <Button
          onClick={onAddFirstIcon}
          className="bg-black text-white hover:bg-gray-800 rounded-lg px-6"
        >
          + Add First Icon
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {icons
        .sort((a, b) => a.rank - b.rank)
        .map((icon) => (
          <motion.button
            layout
            key={icon.id}
            onClick={() => onIconClick(icon)}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card text-left transition-all hover:border-primary/50 hover:shadow-lg"
          >
            <div className="aspect-4/3 relative bg-muted overflow-hidden">
              {icon.photoPreview ? (
                <Image
                  src={icon.photoPreview}
                  alt={icon.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                  <Users className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center text-xs font-bold shadow-sm text-foreground">
                #{icon.rank}
              </div>

              {/* Hover Edit Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Pencil className="text-white w-6 h-6" />
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-foreground mb-2 truncate group-hover:text-primary transition-colors">
                {icon.name}
              </h3>

              <div className="mt-auto flex flex-wrap gap-1.5">
                {(icon.lockIns || []).slice(0, 3).map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border"
                  >
                    <Lock className="w-2.5 h-2.5" />
                    <span className="truncate max-w-20">{item}</span>
                  </span>
                ))}
                {(icon.lockIns?.length || 0) > 3 && (
                  <span className="text-[10px] text-muted-foreground self-center">
                    +{(icon.lockIns?.length || 0) - 3}
                  </span>
                )}
              </div>
            </div>
          </motion.button>
        ))}
    </div>
  );
}
