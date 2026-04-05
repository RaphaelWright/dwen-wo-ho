"use client";

import { useRef, useState, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { NEW_PROVIDER_EDITABLE_FIELDS } from "@/lib/constants/components/provider/dashboard";
import type { ProviderDashboardState } from "@/hooks/provider/use-provider-dashboard";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2, X } from "lucide-react";

/**
 * Small edit popup for a single profile field.
 *
 * @param {{
 *   open:          boolean,
 *   onOpenChange:  (v: boolean) => void,
 *   fieldKey:      string | null,
 *   fieldLabel:    string | null,
 *   value:         string,
 *   onChange:      (v: string) => void,
 *   onSave:        () => void,
 * }} props
 */
export default function EditFieldDialog({
  editOpen,
  setEditOpen,
  editFieldKey,
  editFieldLabel,
  editValue,
  setEditValue,
  saveEdit,
  uploadAvatar,
  isUploadingAvatar,
  profileData,
}: {
  editOpen: ProviderDashboardState["editOpen"];
  setEditOpen: ProviderDashboardState["setEditOpen"];
  editFieldKey: ProviderDashboardState["editFieldKey"];
  editFieldLabel: ProviderDashboardState["editFieldLabel"];
  editValue: ProviderDashboardState["editValue"];
  setEditValue: ProviderDashboardState["setEditValue"];
  saveEdit: ProviderDashboardState["saveEdit"];
  uploadAvatar?: (file: File) => Promise<{ avatarUrl: string }>;
  isUploadingAvatar?: boolean;
  profileData?: { avatarUrl?: string; name?: string };
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const isPhotoField = editFieldKey === "photo";

  // Reset selected file when dialog closes or field changes
  useEffect(() => {
    if (!editOpen) {
      setSelectedFile(null);
    }
  }, [editOpen, editFieldKey]);

  const hint = isPhotoField
    ? "Upload a new profile photo"
    : (NEW_PROVIDER_EDITABLE_FIELDS.find((f) => f.key === editFieldKey)?.hint ??
      "");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") setEditOpen(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (isPhotoField && selectedFile && uploadAvatar) {
      await uploadAvatar(selectedFile);
      setSelectedFile(null);
      setEditOpen(false);
    } else {
      saveEdit();
    }
  };

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent
        aria-describedby={undefined}
        className="w-95 rounded-3xl border p-0 pb-4 px-6 gap-0"
      >
        <DialogHeader className="mb-4 mt-10">
          <DialogTitle className="text-[16px] font-bold">
            Edit {editFieldLabel}
          </DialogTitle>
        </DialogHeader>

        {/* Photo Upload UI */}
        {isPhotoField ? (
          <div className="flex flex-col items-center gap-4 mb-4">
            <Avatar className="w-24 h-24">
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
              onChange={handleFileChange}
              className="hidden"
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-[12.5px] font-semibold cursor-pointer hover:bg-primary/10 transition-all"
            >
              <Upload size={14} />
              {selectedFile ? "Change Photo" : "Select Photo"}
            </motion.button>
            {selectedFile && (
              <p className="text-[11px] text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        ) : (
          /* Text Input */
          <Input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="mb-2 focus:ring-1 focus:ring-primary/20"
            placeholder="Enter value…"
            autoFocus
          />
        )}

        {/* Hint */}
        {hint && (
          <p className="text-[11px] mb-5 text-muted-foreground">{hint}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setSelectedFile(null);
              setEditOpen(false);
            }}
            className="flex-1 py-2.5 rounded-xl border border-destructive/50 text-[13px] font-semibold cursor-pointer text-destructive hover:bg-destructive! hover:text-white transition-all duration-300 ease-in-out"
            disabled={isUploadingAvatar}
          >
            Cancel
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleUpload}
            disabled={isPhotoField ? !selectedFile || isUploadingAvatar : false}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-primary border border-primary/50 cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploadingAvatar ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Uploading…
              </>
            ) : (
              "Save Changes"
            )}
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
