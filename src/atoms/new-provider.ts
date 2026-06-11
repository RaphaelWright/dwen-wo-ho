import { ProviderProfileData } from "@/lib/types/api/provider-dashboard";
import { atom } from "jotai";

export const activeSchoolAtom = atom("all");
export const activeStatusAtom = atom("all");
export const searchQueryAtom = atom("");
export const appliedSearchQueryAtom = atom("");

export const profileOpenAtom = atom(false);
export const editOpenAtom = atom(false);

// Initialised empty – real data loaded from API via useProviderDashboard
export const profileDataAtom = atom<Partial<ProviderProfileData>>({});

export const editFieldKeyAtom = atom<string | null>(null);
export const editFieldLabelAtom = atom<string | null>(null);
export const editValueAtom = atom("");
