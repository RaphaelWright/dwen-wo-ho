"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionLabel, InfoCard } from "./profile-helpers";
import { NEW_PROVIDER_ASSIGNED_SCHOOLS } from "@/data/mock-provider-data";
import ProfileFieldsColumn from "./profile-fields-column";
import { ProfileData } from "@/lib/types/provider/new-provider";

export function ProfileTabs({
  profileData,
  onEdit,
}: {
  profileData: ProfileData;
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
          { value: "schools", label: "Schools", badge: "5" },
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

        <div className="flex-1 overflow-hidden overflow-y-auto no-scrollbar">
          {/* Overview */}
          <TabsContent value="overview" className="p-6 mt-0">
            <InfoCard label="Current Status Message">
              "{profileData.status}"
            </InfoCard>

            <SectionLabel className="mt-5">Contact</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-5">
              <InfoCard label="Email">james@justgohealth.com</InfoCard>
              <InfoCard label="Phone">{profileData.phone}</InfoCard>
            </div>

            <SectionLabel>Specialty</SectionLabel>
            <motion.button
              whileHover={{ backgroundColor: "rgba(139,92,246,.25)" }}
              onClick={() =>
                onEdit("specialty", "Specialty", profileData.specialty)
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
              <InfoCard label="Member Since">Feb 7, 2026</InfoCard>
              <InfoCard label="Last Active">2 weeks ago</InfoCard>
            </div>
          </TabsContent>

          {/* Schools */}
          <TabsContent value="schools" className="p-6 mt-0">
            <SectionLabel>Assigned Schools</SectionLabel>
            <div className="flex flex-col gap-2">
              {NEW_PROVIDER_ASSIGNED_SCHOOLS.map((s: any) => (
                <div
                  key={s.name}
                  className="flex items-center gap-3 p-2.5 rounded-xl border bg-card"
                >
                  <div
                    className="w-7 h-7 rounded-[6px] border flex items-center justify-center text-[11px] font-black shrink-0"
                    style={{
                      color: s.color,
                    }}
                  >
                    {s.letter}
                  </div>
                  <span className="text-[13px] font-semibold">{s.name}</span>
                </div>
              ))}
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
