"use client";

import Image from "next/image";
import type { CoverPageTabProps } from "@/lib/types/components/curator/content-pages/content-pages";

export function CoverPageTab({
  coverPages,
  onCoverPageClick,
  onAddCoverPage,
}: CoverPageTabProps) {
  if (coverPages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h2 className="text-muted-foreground text-center text-[70px] leading-tight font-extrabold">
          Nothing to see yet.
        </h2>
        <p className="text-foreground mt-6 flex items-center gap-2 text-lg">
          You can
          <button
            type="button"
            onClick={onAddCoverPage}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 py-2 font-semibold transition"
          >
            + A D D
          </button>
          a new cover page.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col items-center justify-center">
        <p className="mb-2 text-lg">
          You can{" "}
          <button
            type="button"
            onClick={onAddCoverPage}
            className="bg-foreground text-background hover:bg-foreground/80 rounded-full px-4 py-1.5 font-semibold transition-colors"
          >
            + ADD
          </button>{" "}
          a new cover page.
        </p>
      </div>
      <div className="space-y-6">
        {coverPages.map((page) => (
          <button
            type="button"
            key={page.id}
            onClick={() => onCoverPageClick(page)}
            className="border-primary hover:border-primary/70 relative w-full cursor-pointer overflow-hidden rounded-xl border-2 transition-all"
          >
            <div
              className="relative h-96 w-full"
              style={{ backgroundColor: `#${page.color}` }}
            >
              {page.photoPreview && (
                <Image
                  src={page.photoPreview}
                  alt="Cover page"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            {page.slogan && (
              <div className="from-foreground/70 absolute right-0 bottom-0 left-0 bg-linear-to-t to-transparent p-6">
                <p className="text-background text-2xl font-bold">
                  {page.slogan}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>
    </>
  );
}
