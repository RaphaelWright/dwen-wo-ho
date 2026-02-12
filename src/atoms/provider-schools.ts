import { atom } from "jotai";
import { School } from "@/types/school";

export interface SchoolWithExtras extends School {
  studentCount?: number;
  newPatientName?: string;
  latestLockInDate?: string;
  providerCount?: number;
  newProviderName?: string;
  latestProviderDate?: string;
  isLoading?: boolean;
}

interface ProviderSchoolsState {
  schools: SchoolWithExtras[];
  lastUpdated: number | null;
  isLoading: boolean;
}

const initialState: ProviderSchoolsState = {
  schools: [],
  lastUpdated: null,
  isLoading: false,
};

export const providerSchoolsAtom = atom<ProviderSchoolsState>(initialState);
