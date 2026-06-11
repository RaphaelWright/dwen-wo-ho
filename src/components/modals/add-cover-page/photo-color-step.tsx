"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { COVER_PAGE_COLORS } from "@/lib/constants/components/modals/add-cover-page";
import { CoverPhotoColorStepProps } from "@/lib/types/components/modals/add-cover-page";

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
            className="block text-sm font-semibold text-foreground mb-3"
          >
            Photo
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-base"
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
          <span className="block text-sm font-semibold text-foreground mb-3">
            Colors
          </span>
          <button
            type="button"
            onClick={() => setShowColorDropdown(!showColorDropdown)}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-between text-base"
          >
            <span>
              {selectedColor
                ? COVER_PAGE_COLORS.find((c) => c.hex === selectedColor)
                    ?.name || `#${selectedColor}`
                : "Colors"}
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                showColorDropdown ? "rotate-180" : ""
              }`}
            />
          </button>
          {showColorDropdown && (
            <div className="absolute z-10 mt-2 w-full bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                {COVER_PAGE_COLORS.map((color) => (
                  <button
                    type="button"
                    key={color.hex}
                    onClick={() => handleColorSelect(color)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors text-left"
                  >
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-border shrink-0"
                      style={{ backgroundColor: `#${color.hex}` }}
                    />
                    <div>
                      <p className="font-semibold text-foreground">
                        {color.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
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
      <div className="border-b border-border" />
      <div>
        <div
          className="w-full h-64 rounded-xl border-2 border-border overflow-hidden flex items-center justify-center"
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
              Add photo to get started
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
