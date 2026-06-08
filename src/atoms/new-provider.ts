import { ProviderProfileData } from "@/lib/types/api/provider-dashboard";
import { ProviderNotification } from "@/lib/types/notification";
import { atom } from "jotai";

export const activeSchoolAtom = atom("all");
export const activeStatusAtom = atom("all");
export const searchQueryAtom = atom("");
export const appliedSearchQueryAtom = atom("");

/** @deprecated Use isNotificationSheetOpenAtom from @/atoms/notification instead */
export const notifOpenAtom = atom(false);
export const profileOpenAtom = atom(false);
export const editOpenAtom = atom(false);

// Initialised empty – real data loaded from API via useProviderDashboard
export const profileDataAtom = atom<Partial<ProviderProfileData>>({});

/** @deprecated Use notificationListAtom from @/atoms/notification instead */
export const notificationsAtom = atom<ProviderNotification[]>([]);

export const editFieldKeyAtom = atom<string | null>(null);
export const editFieldLabelAtom = atom<string | null>(null);
export const editValueAtom = atom("");
