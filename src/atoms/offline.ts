import { atom } from "jotai";

// Manual offline mode - user can toggle this to prevent API calls
export const manualOfflineAtom = atom<boolean>(false);

// Combined offline status - either manual or network detected
export const isOfflineAtom = atom((get) => {
  const manualOffline = get(manualOfflineAtom);
  return manualOffline;
});
