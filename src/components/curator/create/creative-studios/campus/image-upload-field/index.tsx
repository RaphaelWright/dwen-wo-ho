"use client";

import { ImageIcon, Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { CampusImageUploadFieldProps } from "@/lib/types/components/curator/create/creative-studios";

export function CampusImageUploadField({
  id,
  label,
  previewUrl,
  error,
  variant,
  inputRef,
  onFileChange,
  onClear,
}: CampusImageUploadFieldProps) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel
        htmlFor={id}
        className="text-muted-foreground mb-2 block text-center text-xs font-semibold"
      >
        {label}
      </FieldLabel>

      <Input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={onFileChange}
      />

      <div className="flex justify-center">
        {previewUrl ? (
          <div
            className={cn(
              "group relative size-38 shrink-0 overflow-hidden",
              variant === "banner" ? "rounded-full" : "rounded-sm",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- blob preview URL */}
            <img
              src={previewUrl}
              alt={`${label} preview`}
              className="border-primary/10 size-full border object-cover shadow-sm"
            />
            <div className="bg-foreground/35 absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100">
              <Label
                htmlFor={id}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full shadow-sm transition-colors"
                title={`Change ${label.toLowerCase()}`}
              >
                <Upload className="size-4" />
              </Label>
              <Button
                type="button"
                onClick={onClear}
                className="bg-background/90 text-foreground hover:bg-background size-8 shrink-0 rounded-full p-0"
                title={`Remove ${label.toLowerCase()}`}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Label
            htmlFor={id}
            className={cn(
              "border-primary/10 hover:border-primary/40 bg-primary/5 hover:bg-primary/10 flex size-38 shrink-0 cursor-pointer flex-col items-center justify-center border-2 border-dashed transition-all duration-200",
              variant === "banner" ? "rounded-full" : "rounded-sm",
            )}
            title={`Upload ${label.toLowerCase()}`}
          >
            {variant === "logo" ? (
              <Plus className="text-primary/40 size-7" />
            ) : (
              <div className="flex flex-col items-center gap-2.5">
                <ImageIcon className="text-primary/40 size-7" />
                <p className="text-primary/40 text-[10px] font-medium tracking-widest uppercase">
                  Photo
                </p>
              </div>
            )}
          </Label>
        )}
      </div>

      {error ? (
        <FieldError className="cs-fade-in mt-2 text-center text-[11px] font-medium">
          {error}
        </FieldError>
      ) : null}
    </Field>
  );
}
