"use client";

import { useRef, useState, useEffect, KeyboardEvent, ChangeEvent } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

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
import { Upload, Loader2, ChevronDown, Search, Smile } from "lucide-react";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

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
  const isTitleField = editFieldKey === "title";
  const isSpecialtyField = editFieldKey === "specialty";
  const isStatusField = editFieldKey === "status";
  const isSelectField = isTitleField || isSpecialtyField;
  const selectItems = isTitleField ? PROVIDER_TITLES : PROVIDER_SPECIALTIES;

  // Searchable select state
  const [selectOpen, setSelectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);

  // Emoji picker state
  const [emojiOpen, setEmojiOpen] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  // Filter items based on search
  const filteredItems = selectItems.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Close select when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setSelectOpen(false);
      }
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
      ) {
        setEmojiOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search when dialog opens/closes or field changes
  useEffect(() => {
    setSearchQuery("");
    setSelectOpen(false);
    setEmojiOpen(false);
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
        ) : isSelectField ? (
          /* Searchable Select Dropdown for Title/Specialty */
          <div className="relative mb-2" ref={selectRef}>
            <button
              type="button"
              onClick={() => setSelectOpen(!selectOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
            >
              <span
                className={
                  editValue ? "text-foreground" : "text-muted-foreground"
                }
              >
                {editValue ||
                  `Select ${editFieldLabel?.toLowerCase() || "value"}`}
              </span>
              <ChevronDown
                size={16}
                className={`text-muted-foreground transition-transform ${selectOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {selectOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md"
                >
                  {/* Search input */}
                  <div className="p-2 border-b border-border">
                    <div className="relative">
                      <Search
                        size={14}
                        className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-8 pr-3 py-1.5 text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Items list - scrollable with hidden scrollbar */}
                  <div className="max-h-52 overflow-y-auto scrollbar-hide">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setEditValue(item);
                            setSelectOpen(false);
                            setSearchQuery("");
                          }}
                          className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                            editValue === item
                              ? "bg-accent text-accent-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {item}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                        No {editFieldLabel?.toLowerCase()} found.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : isStatusField ? (
          /* Emoji Picker for Status */
          <div className="relative mb-2" ref={emojiRef}>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 focus:ring-1 focus:ring-primary/20"
                placeholder="Enter status or pick emoji..."
                autoFocus
              />
              <button
                type="button"
                onClick={() => setEmojiOpen(!emojiOpen)}
                className="p-2 rounded-md border border-input bg-background hover:bg-accent transition-colors"
              >
                <Smile size={18} className="text-muted-foreground" />
              </button>
            </div>

            <AnimatePresence>
              {emojiOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 right-0 mt-2"
                >
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      setEditValue((prev) => prev + emojiData.emoji);
                    }}
                    height={350}
                    skinTonesDisabled
                    previewConfig={{ showPreview: false }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Text Input for other fields */
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
