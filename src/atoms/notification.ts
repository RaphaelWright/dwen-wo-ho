import { atom } from "jotai";
import { Notification } from "@/lib/types/notification";

export const notificationsAtom = atom<Notification[]>([]);
export const notificationSheetOpenAtom = atom<boolean>(false);
