import { atom } from "jotai";
import { School } from "@/lib/types/school";

export interface SchoolWithExtras extends School {
  studentCount?: number;
  newPatientId?: number;
  newPatientName?: string;
  latestLockInDate?: string;
  providerCount?: number;
  newProviderName?: string;
  latestProviderDate?: string;
  isLoading?: boolean;
}

interface CuratorSchoolsState {
  schools: SchoolWithExtras[];
  lastUpdated: number | null;
  isLoading: boolean;
}

const initialState: CuratorSchoolsState = {
  schools: [],
  lastUpdated: null,
  isLoading: false,
};

export const curatorSchoolsAtom = atom<CuratorSchoolsState>(initialState);
