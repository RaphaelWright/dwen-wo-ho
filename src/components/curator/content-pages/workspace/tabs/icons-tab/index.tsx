"use client";

import Image from "next/image";
import { Lock } from "lucide-react";
import { sortIconsByRank } from "@/lib/utils/curator/content-pages/icons";
import type { ContentPagesIconsTabProps } from "@/lib/types/components/curator/content-pages/content-pages";

export function IconsTab({
  icons,
  onIconClick,
  onAddIcon,
}: ContentPagesIconsTabProps) {
  const sortedIcons = sortIconsByRank(icons);

  return (
    <>
      {sortedIcons.length === 0 ? (
        <div className="flex min-h-50 flex-col items-center justify-center py-2">
          <p className="text-muted-foreground text-[70px] font-bold">
            Nothing to see yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {sortedIcons.map((icon) => (
            <button
              type="button"
              key={icon.id}
              onClick={() => onIconClick(icon)}
              className="group relative h-96 overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              {icon.photoPreview ? (
                <div className="relative h-full w-full">
                  <Image
                    src={icon.photoPreview}
                    alt={icon.name}
                    width={600}
                    height={400}
                    className="h-full w-full rounded-lg object-contain"
                  />
                  <div className="bg-background border-foreground absolute top-4 left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border-2">
                    <span className="text-foreground text-lg font-bold">
                      #{icon.rank}
                    </span>
                  </div>
                  <div className="from-foreground/70 absolute right-0 bottom-0 left-0 flex flex-col items-center justify-end bg-linear-to-t to-transparent p-6 text-center">
                    <p className="text-background text-3xl font-bold">
                      {icon.name}
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-1">
                      {(icon.lockIns || []).length > 0 ? (
                        (icon.lockIns || []).map((item) => (
                          <span
                            key={item}
                            className="text-background/90 flex items-center gap-1.5 text-sm"
                          >
                            <Lock className="text-warning h-3.5 w-3.5 shrink-0" />
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="text-background/70 text-sm">
                          No lock-ins
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-muted flex h-full w-full items-center justify-center">
                  <p className="text-muted-foreground">{icon.name}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="mb-2 flex flex-col items-center justify-center">
        <p className="text-foreground mb-2 text-lg">
          You can{" "}
          <button
            type="button"
            onClick={onAddIcon}
            className="bg-foreground text-background hover:bg-foreground/80 rounded-full px-3 py-1.5 font-semibold transition-colors"
          >
            + A D D
          </button>{" "}
          new Icons.
        </p>
      </div>
    </>
  );
}
