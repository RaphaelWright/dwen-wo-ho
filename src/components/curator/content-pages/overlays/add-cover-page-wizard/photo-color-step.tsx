"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { COVER_PAGE_COLORS } from "@/lib/constants/components/curator/content-pages/overlays";
import { CoverPhotoColorStepProps } from "@/lib/types/components/curator/content-pages/content-pages";

export function PhotoColorStep({
  photoPreview,
  fileInputRef,
  handlePhotoSelect,
  colorDropdownRef,
  showColorDropdown,
  setShowColorDropdown,
  selectedColor,
  handleColorSelect,
}: CoverPhotoColorStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label
            htmlFor="cover-photo"
            className="text-foreground mb-3 block text-sm font-semibold"
          >
            Photo
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg px-6 py-3 text-base font-semibold transition-colors"
          >
            + Photo
          </button>
          <input
            id="cover-photo"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            aria-label="Upload image"
            onChange={handlePhotoSelect}
            className="hidden"
          />
        </div>
        <div className="relative flex-1" ref={colorDropdownRef}>
          <span className="text-foreground mb-3 block text-sm font-semibold">
            Colors
          </span>
          <button
            type="button"
            onClick={() => setShowColorDropdown(!showColorDropdown)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-between rounded-lg px-6 py-3 text-base font-semibold transition-colors"
          >
            <span>
              {selectedColor
                ? COVER_PAGE_COLORS.find((c) => c.hex === selectedColor)
                    ?.name || `#${selectedColor}`
                : "Colors"}
            </span>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                showColorDropdown ? "rotate-180" : ""
              }`}
            />
          </button>
          {showColorDropdown && (
            <div className="bg-card border-border absolute z-10 mt-2 w-full overflow-hidden rounded-xl border shadow-2xl">
              <div className="max-h-64 space-y-2 overflow-y-auto p-4">
                {COVER_PAGE_COLORS.map((color) => (
                  <button
                    type="button"
                    key={color.hex}
                    onClick={() => handleColorSelect(color)}
                    className="hover:bg-muted/50 flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors"
                  >
                    <div
                      className="border-border h-12 w-12 shrink-0 rounded-lg border-2"
                      style={{ backgroundColor: `#${color.hex}` }}
                    />
                    <div>
                      <p className="text-foreground font-semibold">
                        {color.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        #{color.hex}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="border-border border-b" />
      <div>
        <div
          className="border-border flex h-64 w-full items-center justify-center overflow-hidden rounded-xl border-2"
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
              Add photo to get started
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
