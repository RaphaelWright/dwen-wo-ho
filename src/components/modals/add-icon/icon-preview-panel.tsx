"use client";

import Image from "next/image";
import { Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconPreviewPanelProps } from "@/lib/types/components/modals/add-icon";

export function IconPreviewPanel({
  photoPreview,
  name,
  slogan,
  rank,
  fileInputRef,
  handlePhotoSelect,
  selectedSchool,
  firstCampus,
  lockIns,
  newLockInInput,
  setNewLockInInput,
  handleAddLockIn,
  handleUpdateLockIn,
  handleRemoveLockIn,
}: IconPreviewPanelProps) {
  return (
    <div className="flex h-full flex-1 flex-col space-y-4">
      <div className="bg-muted/30 border-border relative min-h-100 w-full flex-1 overflow-hidden rounded-xl border">
        {photoPreview ? (
          <>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="hover:bg-foreground/10 absolute inset-0 z-0 h-full w-full bg-transparent p-0 transition-colors"
            >
              <Image
                src={photoPreview}
                alt={name || "Icon preview"}
                width={400}
                height={400}
                className="h-full w-full object-cover"
              />
            </Button>
            {/* Rank Badge */}
            <div className="bg-card border-foreground absolute top-4 left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-lg">
              <span className="text-foreground text-lg font-bold">#{rank}</span>
            </div>
            {/* Name Overlay */}
            {name && (
              <div className="from-foreground/80 absolute right-0 bottom-0 left-0 z-10 bg-linear-to-t to-transparent p-6">
                <p className="text-background text-3xl font-bold drop-shadow-md">
                  {name}
                </p>
                {slogan && (
                  <p className="text-background/90 mt-1 text-lg drop-shadow-sm">
                    {slogan}
                  </p>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              aria-label="Upload image"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="text-muted-foreground hover:text-foreground flex h-auto flex-col gap-2 bg-transparent transition-colors hover:bg-transparent"
            >
              <Image
                src="/logos/logo-purple.png"
                alt="Add icon"
                width={48}
                height={48}
                className="h-12 w-12 object-contain opacity-50"
              />
              <span className="text-sm font-medium">Click to upload photo</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              aria-label="Upload image"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* School Info */}
      {selectedSchool && (
        <div className="bg-muted/30 border-border flex items-center gap-3 rounded-xl border p-4">
          {selectedSchool.logo ? (
            <div className="border-border h-12 w-12 shrink-0 overflow-hidden rounded-lg border">
              <Image
                src={selectedSchool.logo}
                alt={selectedSchool.name}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="bg-muted border-border flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border">
              <span className="text-xl">🏫</span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate font-semibold">
              {selectedSchool.name}
            </p>
            {firstCampus && (
              <p className="text-muted-foreground text-sm">{firstCampus}</p>
            )}
          </div>
        </div>
      )}

      {/* Lock-ins Section */}
      <div className="bg-muted/10 border-border rounded-xl border p-4">
        <h3 className="text-foreground mb-3 flex items-center gap-2 font-bold">
          <Lock className="text-warning h-4 w-4" />
          Lock-ins ({lockIns.length})
        </h3>
        {lockIns.length > 0 && (
          <div className="mb-3 max-h-36 space-y-2 overflow-y-auto pr-1">
            {lockIns.map((lockIn, index) => (
              <div
                key={lockIn.id}
                className="flex items-center justify-between gap-2"
              >
                <input
                  type="text"
                  aria-label={`Lock-in ${index + 1}`}
                  value={lockIn.value}
                  onChange={(e) =>
                    handleUpdateLockIn(lockIn.id, e.target.value)
                  }
                  className="bg-card border-border text-foreground focus:ring-primary/20 focus:border-primary flex-1 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
                <Button
                  onClick={() => handleRemoveLockIn(lockIn.id)}
                  className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground h-9 w-9 rounded-lg bg-transparent p-2 transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        {/* Add Lock-in Input */}
        <div className="space-y-2">
          <input
            type="text"
            aria-label="New lock-in"
            value={newLockInInput}
            onChange={(e) => setNewLockInInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddLockIn();
              }
            }}
            placeholder="Enter lock-in..."
            className="bg-card border-border text-foreground focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
          <Button
            onClick={handleAddLockIn}
            disabled={!newLockInInput.trim()}
            className={`w-full rounded-lg px-4 py-2 font-semibold transition-colors ${
              !newLockInInput.trim()
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            + Add
          </Button>
        </div>
      </div>
    </div>
  );
}
