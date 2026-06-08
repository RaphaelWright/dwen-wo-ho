"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SectionLabel, InfoCard } from "./profile-helpers";
import type { ProviderAssociatedSchool } from "@/lib/types/api/providers";
import ProfileFieldsColumn from "./profile-fields-column";
import type { ProviderProfileData } from "@/lib/types/api/provider-dashboard";

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

export function ProfileTabs({
  profileData,
  schools,
  onEdit,
}: {
  profileData: Partial<ProviderProfileData>;
  schools: ProviderAssociatedSchool[];
  onEdit: (key: string, label: string, current: string) => void;
}) {
  return (
    <Tabs
      defaultValue="overview"
      className="flex flex-col flex-1 overflow-hidden mt-5"
    >
      <TabsList className="flex w-full gap-0 rounded-none h-auto border-b bg-transparent px-2 md:px-6 md:space-x-2 overflow-x-visible">
        {[
          { value: "overview", label: "Overview" },
          { value: "schools", label: "Schools", badge: String(schools.length) },
          { value: "partners", label: "Partners", badge: "0" },
        ].map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex-1 md:flex-none rounded-2xl pb-2.5 pt-2.5 px-2 md:px-4 text-[12px] md:text-[13px] font-semibold hover:bg-primary/5
                       data-[state=active]:text-primary
                       data-[state=active]:border-b-2
                       data-[state=active]:border-primary
                       data-[state=active]:shadow-none
                       data-[state=active]:bg-transparent"
          >
            {tab.label}
            {tab.badge && (
              <span className="ml-1 md:ml-1.5 text-[10px] md:text-[11px]">
                ({tab.badge})
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* ── Body split: fields col + tab content ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-hidden">
        <ProfileFieldsColumn profileData={profileData} onEdit={onEdit} />

        <div className="flex-1 overflow-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          {/* Overview */}
          <TabsContent value="overview" className="p-6 mt-0">
            <InfoCard label="Current Status Message">
              &quot;{profileData.status}&quot;
            </InfoCard>

            <SectionLabel className="mt-5">Contact</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-5">
              <InfoCard label="Email">{profileData.email || "N/A"}</InfoCard>
              <InfoCard label="Phone">{profileData.phone}</InfoCard>
            </div>

            <SectionLabel>Specialty</SectionLabel>
            <motion.button
              whileHover={{ backgroundColor: "rgba(139,92,246,.25)" }}
              onClick={() =>
                onEdit("specialty", "Specialty", profileData.specialty ?? "")
              }
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5 cursor-pointer text-primary"
            >
              <BrainCircuit size={13} />
              <span className="text-[12.5px] font-semibold">
                {profileData.specialty}
              </span>
              <Pencil size={10} />
            </motion.button>

            <SectionLabel>Activity</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <InfoCard label="Member Since">
                {formatDate(profileData.memberSince || "")}
              </InfoCard>
              <InfoCard label="Last Active">
                {formatRelativeTime(profileData.lastUpdated || null)}
              </InfoCard>
            </div>
          </TabsContent>

          {/* Schools */}
          <TabsContent value="schools" className="p-6 mt-0">
            <SectionLabel>Assigned Schools</SectionLabel>
            <div className="flex flex-col gap-2">
              {schools.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No schools assigned
                </p>
              ) : (
                schools.map((s) => (
                  <div
                    key={s.schoolId}
                    className="flex items-center gap-3 p-2.5 rounded-xl border bg-card"
                  >
                    <Avatar className="w-7 h-7 rounded-[6px] border shrink-0 bg-white">
                      <AvatarImage
                        src={s.avatarUrl || undefined}
                        alt={s.schoolName}
                        className="object-cover"
                      />
                      <AvatarFallback
                        className="text-[11px] font-black bg-white"
                        style={{ color: s.primaryColor || "#6366f1" }}
                      >
                        {s.schoolName?.charAt(0)?.toUpperCase() || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] font-semibold">
                      {s.schoolName}
                    </span>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Partners */}
          <TabsContent
            value="partners"
            className="p-6 mt-0 flex flex-col items-center justify-center min-h-52"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">🤝</div>
              <p className="text-[14px] font-semibold mb-1 text-muted-foreground">
                No partners yet
              </p>
              <p className="text-[12.5px] text-muted-foreground">
                Partner providers will appear here.
              </p>
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}
