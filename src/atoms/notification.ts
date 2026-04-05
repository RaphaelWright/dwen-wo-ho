import { atom } from "jotai";
import { Notification } from "@/lib/types/notification";

/** Curator notification list atom - separate from provider notifications */
export const curatorNotificationListAtom = atom<Notification[]>([]);

/** Provider notification list atom - separate from curator notifications */
export const providerNotificationListAtom = atom<Notification[]>([]);

/** Unified export for backward compatibility - prefer role-specific atoms */
export const notificationListAtom = atom<Notification[]>([]);

/** Curator notification sheet visibility */
export const isCuratorNotificationSheetOpenAtom = atom<boolean>(false);

/** Provider notification sheet visibility */
export const isProviderNotificationSheetOpenAtom = atom<boolean>(false);

/** Unified export for backward compatibility - prefer role-specific atoms */
export const isNotificationSheetOpenAtom = atom<boolean>(false);
