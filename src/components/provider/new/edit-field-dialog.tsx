"use client";

import { KeyboardEvent } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NEW_PROVIDER_EDITABLE_FIELDS } from "@/data/mock-provider-data";
import useProviderDashboard from "@/hooks/provider/useProviderDashboard";
import { Input } from "@/components/ui/input";

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
export default function EditFieldDialog() {
  const {
    editOpen,
    setEditOpen,
    editFieldKey,
    editFieldLabel,
    editValue,
    setEditValue,
    saveEdit,
  } = useProviderDashboard();
  const hint =
    NEW_PROVIDER_EDITABLE_FIELDS.find((f) => f.key === editFieldKey)?.hint ??
    "";

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") setEditOpen(false);
  };

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent className="w-95 rounded-3xl border p-0 pb-4 px-6 gap-0">
        <DialogHeader className="mb-4 mt-10">
          <DialogTitle className="text-[16px] font-bold">
            Edit {editFieldLabel}
          </DialogTitle>
        </DialogHeader>

        {/* Input */}
        <Input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="mb-2 focus:ring-1 focus:ring-primary/20"
          placeholder="Enter value…"
          autoFocus
        />

        {/* Hint */}
        {hint && (
          <p className="text-[11px] mb-5 text-muted-foreground">{hint}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setEditOpen(false)}
            className="flex-1 py-2.5 rounded-xl border border-destructive/50 text-[13px] font-semibold cursor-pointer text-destructive hover:bg-destructive! hover:text-white transition-all duration-300 ease-in-out"
          >
            Cancel
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={saveEdit}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-primary border border-primary/50 cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 ease-in-out"
          >
            Save Changes
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
