"use client";

import {
  NEW_PROVIDER_EDITABLE_FIELDS,
  NEW_PROVIDER_FIELD_HOVER,
} from "@/lib/constants/components/provider/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { ReactNode } from "react";
import type { ProfileData } from "@/lib/types/provider/new-provider";

function formatDate(dateString: string): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export default function ProfileFieldsColumn({
  profileData,
  onEdit,
}: {
  profileData: Partial<ProfileData>;
  onEdit: (key: string, label: string, current: string) => void;
}) {
  // Dynamic read-only fields from API data
  const readOnlyFields = [
    { label: "Email", value: profileData.email || "N/A" },
    { label: "Member Since", value: formatDate(profileData.memberSince || "") },
    {
      label: "Last Updated",
      value: formatRelativeTime(profileData.lastUpdated || null),
    },
  ];

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
              <AvatarImage src={profileData.avatarUrl} />
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
          value={(profileData as Record<string, string>)[f.key] ?? ""}
          onEdit={() =>
            onEdit(
              f.key,
              f.label,
              (profileData as Record<string, string>)[f.key] ?? "",
            )
          }
        />
      ))}

      {/* ── Read-only ── */}
      <SectionLabel className="mt-4">Read Only</SectionLabel>

      {readOnlyFields.map((f) => (
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
