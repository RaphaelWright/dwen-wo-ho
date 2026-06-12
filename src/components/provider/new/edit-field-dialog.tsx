"use client";

import { useRef, useState, KeyboardEvent, ChangeEvent } from "react";
import { m } from "motion/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NEW_PROVIDER_EDITABLE_FIELDS } from "@/lib/constants/components/provider/dashboard";
import {
  PROVIDER_TITLES,
  PROVIDER_SPECIALTIES,
} from "@/lib/constants/provider-profile";
import type { ProviderDashboardState } from "@/hooks/provider/use-provider-dashboard";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Upload } from "lucide-react";
import { SearchableSelectField } from "./edit-field/searchable-select-field";
import { EmojiStatusField } from "./edit-field/emoji-status-field";

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
  isSaving = false,
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
  isSaving?: boolean;
  profileData?: { avatarUrl?: string; name?: string };
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const isPhotoField = editFieldKey === "photo";
  const isSavingChanges = Boolean(isUploadingAvatar || isSaving);
  const isTitleField = editFieldKey === "title";
  const isSpecialtyField = editFieldKey === "specialty";
  const isStatusField = editFieldKey === "status";
  const isSelectField = isTitleField || isSpecialtyField;
  const selectItems = isTitleField ? PROVIDER_TITLES : PROVIDER_SPECIALTIES;

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
        className="w-95 gap-0 rounded-3xl border p-0 px-6 pb-4"
      >
        <DialogHeader className="mt-10 mb-4">
          <DialogTitle className="text-[16px] font-bold">
            Edit {editFieldLabel}
          </DialogTitle>
        </DialogHeader>

        {/* Photo Upload UI */}
        {isPhotoField ? (
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
              onChange={handleFileChange}
              className="hidden"
            />
            <m.button
              whileTap={{ scale: 0.97 }}
              onClick={() => fileInputRef.current?.click()}
              className="hover:bg-primary/10 flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-[12.5px] font-semibold transition-all"
            >
              <Upload size={14} />
              {selectedFile ? "Change Photo" : "Select Photo"}
            </m.button>
            {selectedFile && (
              <p className="text-muted-foreground text-[11px]">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        ) : isSelectField ? (
          /* Searchable Select Dropdown for Title/Specialty */
          <SearchableSelectField
            key={editFieldKey}
            value={editValue}
            onChange={setEditValue}
            label={editFieldLabel}
            items={selectItems}
          />
        ) : isStatusField ? (
          /* Emoji Picker for Status */
          <EmojiStatusField
            value={editValue}
            onChange={setEditValue}
            onKeyDown={handleKeyDown}
          />
        ) : (
          /* Text Input for other fields */
          <Input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="focus:ring-primary/20 mb-2 focus:ring-1"
            placeholder="Enter value…"
            autoFocus
          />
        )}

        {/* Hint */}
        {hint && (
          <p className="text-muted-foreground mb-5 text-[11px]">{hint}</p>
        )}

        {/* Actions */}
        <div className="mt-2 flex gap-2">
          <m.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setSelectedFile(null);
              setEditOpen(false);
            }}
            className="border-destructive/50 text-destructive hover:bg-destructive! flex-1 cursor-pointer rounded-xl border py-2.5 text-[13px] font-semibold transition-all duration-300 ease-in-out hover:text-white"
            disabled={isSavingChanges}
          >
            Cancel
          </m.button>

          <m.button
            whileTap={{ scale: 0.97 }}
            onClick={handleUpload}
            disabled={
              isPhotoField ? !selectedFile || isSavingChanges : isSavingChanges
            }
            className="text-primary border-primary/50 hover:bg-primary flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border py-2.5 text-[13px] font-semibold transition-all duration-300 ease-in-out hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSavingChanges ? (
              <>
                <Spinner className="size-3.5" />
                {isUploadingAvatar ? "Uploading…" : "Saving…"}
              </>
            ) : (
              "Save Changes"
            )}
          </m.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
