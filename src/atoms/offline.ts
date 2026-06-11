import { atom } from "jotai";

// Manual offline mode - user can toggle this to prevent API calls
export const manualOfflineAtom = atom<boolean>(false);
