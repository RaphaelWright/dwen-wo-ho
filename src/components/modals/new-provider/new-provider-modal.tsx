"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ProfileHero } from "./profile-hero";
import { ProfileTabs } from "./profile-tabs";
import { ProfileFooter } from "./profile-footer";
import useNewProvider from "@/hooks/provider/use-new-provider";

/**
 * Profile dialog with Overview / Schools / Partners tabs.
 *
 * @param {{
 *   open:         boolean,
 *   onOpenChange: (v: boolean) => void,
 *   profileData:  Record<string, string>,
 *   onEdit:       (key: string, label: string, current: string) => void,
 * }} props
 */
export default function ProfileModal() {
  const { profileOpen, setProfileOpen, profileData, openEdit } =
    useNewProvider();
  return (
    <Dialog open={profileOpen} onOpenChange={setProfileOpen} modal>
      <DialogContent className="w-[95vw] max-w-3xl sm:max-w-3xl lg:max-w-4xl max-h-[88vh] p-0 border flex flex-col overflow-hidden rounded-4xl gap-0">
        <VisuallyHidden.Root>
          <DialogTitle>Provider Profile Details</DialogTitle>
        </VisuallyHidden.Root>
        <ProfileHero profileData={profileData} onEdit={openEdit} />
        <ProfileTabs profileData={profileData} onEdit={openEdit} />
        <ProfileFooter />
      </DialogContent>
    </Dialog>
  );
}
