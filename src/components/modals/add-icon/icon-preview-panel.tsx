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
    <div className="flex flex-col space-y-4 flex-1 h-full">
      <div className="relative w-full flex-1 min-h-100 rounded-xl overflow-hidden bg-muted/30 border border-border">
        {photoPreview ? (
          <>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 z-0 p-0 h-full w-full bg-transparent hover:bg-foreground/10 transition-colors"
            >
              <Image
                src={photoPreview}
                alt={name || "Icon preview"}
                width={400}
                height={400}
                className="object-cover w-full h-full"
              />
            </Button>
            {/* Rank Badge */}
            <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-card border-2 border-foreground flex items-center justify-center z-10 shadow-lg">
              <span className="text-foreground font-bold text-lg">#{rank}</span>
            </div>
            {/* Name Overlay */}
            {name && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-foreground/80 to-transparent z-10">
                <p className="text-background text-3xl font-bold drop-shadow-md">
                  {name}
                </p>
                {slogan && (
                  <p className="text-background/90 text-lg mt-1 drop-shadow-sm">
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
          <div className="w-full h-full flex items-center justify-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="text-muted-foreground hover:text-foreground transition-colors bg-transparent hover:bg-transparent h-auto flex flex-col gap-2"
            >
              <Image
                src="/logos/logo-purple.png"
                alt="Add icon"
                width={48}
                height={48}
                className="w-12 h-12 object-contain opacity-50"
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
        <div className="flex items-center gap-3 p-4 bg-muted/30 border border-border rounded-xl">
          {selectedSchool.logo ? (
            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-border">
              <Image
                src={selectedSchool.logo}
                alt={selectedSchool.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border">
              <span className="text-xl">🏫</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">
              {selectedSchool.name}
            </p>
            {firstCampus && (
              <p className="text-sm text-muted-foreground">{firstCampus}</p>
            )}
          </div>
        </div>
      )}

      {/* Lock-ins Section */}
      <div className="p-4 bg-muted/10 rounded-xl border border-border">
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-warning" />
          Lock-ins ({lockIns.length})
        </h3>
        {lockIns.length > 0 && (
          <div className="space-y-2 mb-3 max-h-36 overflow-y-auto pr-1">
            {lockIns.map((lockIn, index) => (
              <div
                key={lockIn.id}
                className="flex items-center justify-between gap-2"
              >
                <input
                  type="text"
                  aria-label={`Lock-in ${index + 1}`}
                  value={lockIn.value}
                  onChange={(e) => handleUpdateLockIn(lockIn.id, e.target.value)}
                  className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <Button
                  onClick={() => handleRemoveLockIn(lockIn.id)}
                  className="p-2 h-9 w-9 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors bg-transparent text-muted-foreground"
                >
                  <X className="w-4 h-4" />
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
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground"
          />
          <Button
            onClick={handleAddLockIn}
            disabled={!newLockInInput.trim()}
            className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
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
