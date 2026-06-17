"use client";

import { Button } from "@/components/ui/button";
import { AddIconFormFieldsProps } from "@/lib/types/components/curator/content-pages/content-pages";

export function IconFormFields({
  name,
  setName,
  slogan,
  setSlogan,
  rank,
  setRank,
  fileInputRef,
  handlePhotoSelect,
}: AddIconFormFieldsProps) {
  return (
    <div className="flex-1 space-y-6">
      {/* Name Input */}
      <div>
        <label
          htmlFor="icon-name"
          className="text-foreground mb-3 block text-sm font-semibold"
        >
          Name
        </label>
        <input
          id="icon-name"
          type="text"
          aria-label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name..."
          className="bg-muted/50 border-border focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground w-full rounded-lg border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
        />
      </div>

      {/* Slogan Input */}
      <div>
        <label
          htmlFor="icon-slogan"
          className="text-foreground mb-3 block text-sm font-semibold"
        >
          Slogan
        </label>
        <input
          id="icon-slogan"
          type="text"
          aria-label="Slogan"
          value={slogan}
          onChange={(e) => setSlogan(e.target.value)}
          placeholder="Enter slogan..."
          className="bg-muted/50 border-border focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground w-full rounded-lg border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
        />
      </div>

      {/* Photo Button */}
      <div>
        <label
          htmlFor="icon-photo"
          className="text-foreground mb-3 block text-sm font-semibold"
        >
          Photo
        </label>
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-muted/50 border-border hover:bg-muted text-foreground h-auto w-full justify-start rounded-lg border px-4 py-3 font-semibold transition-colors"
        >
          + Photo
        </Button>
        <input
          id="icon-photo"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          aria-label="Upload image"
          onChange={handlePhotoSelect}
          className="hidden"
        />
      </div>

      {/* Rank Control */}
      <div>
        <span className="text-foreground mb-3 block text-sm font-semibold">
          Rank
        </span>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setRank(Math.max(1, rank - 1))}
            className="bg-muted/50 border-border text-foreground hover:bg-muted flex h-10 w-10 items-center justify-center rounded-lg border font-semibold transition-colors"
          >
            -
          </Button>
          <span className="text-foreground min-w-12 text-center text-2xl font-bold">
            {rank}
          </span>
          <Button
            onClick={() => setRank(rank + 1)}
            className="bg-muted/50 border-border text-foreground hover:bg-muted flex h-10 w-10 items-center justify-center rounded-lg border font-semibold transition-colors"
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
}
