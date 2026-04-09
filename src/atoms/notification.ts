import { atom } from "jotai";
import {
  CuratorNotification,
  ProviderNotification,
} from "@/lib/types/notification";

export const curatorNotificationListAtom = atom<CuratorNotification[]>([]);

export const providerNotificationListAtom = atom<ProviderNotification[]>([]);

export const isCuratorNotificationSheetOpenAtom = atom<boolean>(false);

export const isProviderNotificationSheetOpenAtom = atom<boolean>(false);
