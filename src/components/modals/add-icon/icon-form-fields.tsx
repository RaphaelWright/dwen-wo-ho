"use client";

import { Button } from "@/components/ui/button";
import { IconFormFieldsProps } from "@/lib/types/components/modals/add-icon";

export function IconFormFields({
  name,
  setName,
  slogan,
  setSlogan,
  rank,
  setRank,
  fileInputRef,
  handlePhotoSelect,
}: IconFormFieldsProps) {
  return (
    <div className="flex-1 space-y-6">
      {/* Name Input */}
      <div>
        <label
          htmlFor="icon-name"
          className="block text-sm font-semibold text-foreground mb-3"
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
          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Slogan Input */}
      <div>
        <label
          htmlFor="icon-slogan"
          className="block text-sm font-semibold text-foreground mb-3"
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
          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Photo Button */}
      <div>
        <label
          htmlFor="icon-photo"
          className="block text-sm font-semibold text-foreground mb-3"
        >
          Photo
        </label>
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg font-semibold hover:bg-muted transition-colors text-foreground h-auto justify-start"
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
        <span className="block text-sm font-semibold text-foreground mb-3">
          Rank
        </span>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setRank(Math.max(1, rank - 1))}
            className="w-10 h-10 bg-muted/50 border border-border rounded-lg flex items-center justify-center font-semibold text-foreground hover:bg-muted transition-colors"
          >
            -
          </Button>
          <span className="text-2xl font-bold text-foreground min-w-12 text-center">
            {rank}
          </span>
          <Button
            onClick={() => setRank(rank + 1)}
            className="w-10 h-10 bg-muted/50 border border-border rounded-lg flex items-center justify-center font-semibold text-foreground hover:bg-muted transition-colors"
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
}
