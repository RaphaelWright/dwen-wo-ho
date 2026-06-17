"use client";

import { m } from "motion/react";
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { EditFieldPhotoFieldProps } from "@/lib/types/components/provider/edit-field";

export function EditFieldPhotoField({
  fileInputRef,
  selectedFile,
  profileData,
  onFileChange,
  onSelectClick,
}: EditFieldPhotoFieldProps) {
  return (
    <div className="mb-4 flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage
          src={
            selectedFile
              ? URL.createObjectURL(selectedFile)
              : profileData?.avatarUrl
          }
        />
        <AvatarFallback className="text-2xl">
          {profileData?.name?.charAt(0)?.toUpperCase() || "P"}
        </AvatarFallback>
      </Avatar>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        aria-label="Upload profile photo"
        onChange={onFileChange}
        className="hidden"
      />
      <m.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={onSelectClick}
        className="hover:bg-primary/10 flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-[12.5px] font-semibold transition-all"
      >
        <Upload size={14} />
        {selectedFile ? "Change Photo" : "Select Photo"}
      </m.button>
      {selectedFile ? (
        <p className="text-muted-foreground text-[11px]">
          Selected: {selectedFile.name}
        </p>
      ) : null}
    </div>
  );
}
