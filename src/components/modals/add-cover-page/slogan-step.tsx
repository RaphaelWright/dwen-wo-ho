"use client";

import Image from "next/image";
import { CoverSloganStepProps } from "@/lib/types/components/modals/add-cover-page";

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
          className="block text-sm font-semibold text-foreground mb-3"
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
          className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <div>
        <div
          className="w-full h-75 rounded-xl border-2 border-border overflow-hidden flex items-center justify-center"
          style={{
            backgroundColor: selectedColor ? `#${selectedColor}` : "var(--muted)",
          }}
        >
          {photoPreview ? (
            <div className="relative w-full h-full">
              <Image
                src={photoPreview}
                alt="Cover preview"
                width={400}
                height={300}
                className="object-cover w-full h-full"
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
