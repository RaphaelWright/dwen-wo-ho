import { atom } from "jotai";
import {
  DEFAULT_PROVIDER_PROFILE,
  NEW_PROVIDER_NOTIFICATIONS,
} from "@/data/mock-provider-data";

export const activeSchoolAtom = atom("all");
export const activeStatusAtom = atom("all");
export const searchQueryAtom = atom("");

export const notifOpenAtom = atom(false);
export const profileOpenAtom = atom(false);
export const editOpenAtom = atom(false);

export const profileDataAtom = atom(DEFAULT_PROVIDER_PROFILE);

export const notificationsAtom = atom(NEW_PROVIDER_NOTIFICATIONS);

export const editFieldKeyAtom = atom<string | null>(null);
export const editFieldLabelAtom = atom<string | null>(null);
export const editValueAtom = atom("");
