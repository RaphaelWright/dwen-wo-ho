import { atom } from "jotai";
import type { ProfileData } from "@/lib/types/provider/new-provider";

export const activeSchoolAtom = atom("all");
export const activeStatusAtom = atom("all");
export const searchQueryAtom = atom("");
export const appliedSearchQueryAtom = atom("");

/** @deprecated Use isNotificationSheetOpenAtom from @/atoms/notification instead */
export const notifOpenAtom = atom(false);
export const profileOpenAtom = atom(false);
export const editOpenAtom = atom(false);

// Initialised empty – real data loaded from API via useProviderDashboard
export const profileDataAtom = atom<Partial<ProfileData>>({});

/** @deprecated Use notificationListAtom from @/atoms/notification instead */
export const notificationsAtom = atom<any[]>([]);

export const editFieldKeyAtom = atom<string | null>(null);
export const editFieldLabelAtom = atom<string | null>(null);
export const editValueAtom = atom("");
