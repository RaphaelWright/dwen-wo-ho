"use client";

import Image from "next/image";
import { CoverSloganStepProps } from "@/lib/types/components/curator/content-pages/content-pages";

export function SloganStep({
  slogan,
  setSlogan,
  selectedColor,
  photoPreview,
}: CoverSloganStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="cover-slogan"
          className="text-foreground mb-3 block text-sm font-semibold"
        >
          Slogan
        </label>
        <input
          id="cover-slogan"
          type="text"
          aria-label="Slogan"
          value={slogan}
          onChange={(e) => setSlogan(e.target.value)}
          placeholder="Enter slogan..."
          className="bg-muted border-border focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground w-full rounded-lg border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
        />
      </div>
      <div>
        <div
          className="border-border flex h-75 w-full items-center justify-center overflow-hidden rounded-xl border-2"
          style={{
            backgroundColor: selectedColor
              ? `#${selectedColor}`
              : "var(--muted)",
          }}
        >
          {photoPreview ? (
            <div className="relative h-full w-full">
              <Image
                src={photoPreview}
                alt="Cover preview"
                width={400}
                height={300}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <p className="text-muted-foreground text-center">
              Preview will appear here
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
