"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ProfileHero } from "./profile-hero";
import { ProfileTabs } from "./profile-tabs";
import { ProfileFooter } from "./profile-footer";
import type { ProviderDashboardState } from "@/hooks/provider/use-provider-dashboard";
import type { AssociatedSchool } from "@/lib/types/api/providers";
import { X } from "lucide-react";

/**
 * Profile dialog with Overview / Schools / Partners tabs.
 *
 * @param {{
 *   open:         boolean,
 *   onOpenChange: (v: boolean) => void,
 *   profileData:  Record<string, string>,
 *   onEdit:       (key: string, label: string, current: string) => void,
 *   schools:      AssociatedSchool[]
 * }} props
 */
export default function ProfileModal({
  profileOpen,
  setProfileOpen,
  profileData,
  openEdit,
  schools,
}: {
  profileOpen: ProviderDashboardState["profileOpen"];
  setProfileOpen: ProviderDashboardState["setProfileOpen"];
  profileData: ProviderDashboardState["profileData"];
  openEdit: ProviderDashboardState["openEdit"];
  schools: AssociatedSchool[];
}) {
  return (
    <Dialog open={profileOpen} onOpenChange={setProfileOpen} modal>
      <DialogContent
        aria-describedby={undefined}
        className="w-[95vw] max-w-3xl sm:max-w-3xl lg:max-w-4xl max-h-[88vh] p-0 border flex flex-col overflow-hidden rounded-4xl gap-0"
      >
        <VisuallyHidden.Root>
          <DialogTitle>Provider Profile Details</DialogTitle>
        </VisuallyHidden.Root>
        <ProfileHero profileData={profileData} onEdit={openEdit} />
        <ProfileTabs
          profileData={profileData}
          onEdit={openEdit}
          schools={schools}
        />
        <ProfileFooter />
      </DialogContent>
    </Dialog>
  );
}
