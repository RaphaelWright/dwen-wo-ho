"use client";

import {
  NEW_PROVIDER_EDITABLE_FIELDS,
  NEW_PROVIDER_FIELD_HOVER,
  NEW_PROVIDER_READ_ONLY_FIELDS,
} from "@/data/mock-provider-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { ReactNode } from "react";

/**
 * Left column of the profile modal — editable + read-only field rows.
 *
 * @param {{
 *   profileData: Record<string, string>,
 *   onEdit:      (key: string, label: string, current: string) => void,
 * }} props
 */

export default function ProfileFieldsColumn({
  profileData,
  onEdit,
}: {
  profileData: any;
  onEdit: (key: string, label: string, current: string) => void;
}) {
  return (
    <div className="w-full p-6 border-b md:border-b-0 md:border-r flex flex-col gap-1.5 overflow-hidden overflow-y-auto no-scrollbar shrink-0 max-h-[40vh] md:max-h-none">
      {/* ── Editable ── */}
      <SectionLabel>Editable</SectionLabel>

      {/* Photo row */}
      <FieldRow
        label="Photo"
        value={
          <div className="flex items-center gap-2">
            <Avatar className="size-5 shrink-0">
              <AvatarImage src={profileData.avatar} />
              <AvatarFallback>
                {profileData.name
                  ? profileData.name.charAt(0).toUpperCase()
                  : "PR"}
              </AvatarFallback>
            </Avatar>
            <span>Current photo</span>
          </div>
        }
        onEdit={() => onEdit("photo", "Profile Photo", "")}
      />

      {/* Dynamic editable fields */}
      {NEW_PROVIDER_EDITABLE_FIELDS.map((f) => (
        <FieldRow
          key={f.key}
          label={f.label}
          value={profileData[f.key] ?? ""}
          onEdit={() => onEdit(f.key, f.label, profileData[f.key] ?? "")}
        />
      ))}

      {/* ── Read-only ── */}
      <SectionLabel className="mt-4">Read Only</SectionLabel>

      {NEW_PROVIDER_READ_ONLY_FIELDS.map((f) => (
        <div key={f.label} className="flex items-center gap-3 px-3 py-2">
          <span className="text-[11.5px] w-22.5 shrink-0">{f.label}</span>
          <span className="text-[13px]">{f.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Sub-components ── */

function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${className}`}
    >
      {children}
    </p>
  );
}

function FieldRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: ReactNode;
  onEdit: () => void;
}) {
  return (
    <motion.button
      whileHover={NEW_PROVIDER_FIELD_HOVER}
      onClick={onEdit}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer text-left w-full"
    >
      <span className="text-[11.5px] w-22.5 shrink-0">{label}</span>
      <span className="text-[13px] font-medium flex-1 truncate flex items-center">
        {value}
      </span>
      <Pencil size={12} className="shrink-0" />
    </motion.button>
  );
}
